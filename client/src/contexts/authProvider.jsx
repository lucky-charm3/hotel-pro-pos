import { useEffect, useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AuthContext } from './authContext.jsx';
import { userService } from '../services/userService.js';

export function AuthProvider({ children }) {
  const queryClient = useQueryClient();
  const [token, setToken] = useState(localStorage.getItem('token'));

  const syncToken = useCallback(() => {
    const t = localStorage.getItem('token');
    setToken(t);
  }, []);

  useEffect(() => {
    window.addEventListener('storage', syncToken);
    window.addEventListener('auth-logout', syncToken);
    return () => {
      window.removeEventListener('storage', syncToken);
      window.removeEventListener('auth-logout', syncToken);
    };
  }, [syncToken]);

  const hasToken = !!token;

  const {
    data: user,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['currentUser'],
    queryFn: userService.getMe,
    enabled: hasToken,           
    retry: (count, err) => {
      const status = err?.response?.status;
      if (status === 401 || status === 403) return false;
      return count < 2;
    },
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 30,
  });

 useEffect(() => {
  if (isError) {
    const status = error?.response?.status;
    if (status === 401 || status === 403) {
      console.log('Token invalid/expired – logging out');
      localStorage.removeItem('token');
      setToken(null);
      queryClient.removeQueries({ queryKey: ['currentUser'] });
      queryClient.setQueryData(['currentUser'], null);
    }
  }
}, [isError, error, queryClient]);

  const loginMutation = useMutation({
    mutationFn: userService.login,
    onSuccess: (data) => {
      if (data?.token) {
        localStorage.setItem('token', data.token);
        setToken(data.token);
        queryClient.setQueryData(['currentUser'], data.user);
      }
    },
    onError: () => {
      localStorage.removeItem('token');
      setToken(null);
    },
  });

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    queryClient.clear();
    window.location.href = '/';
  };

  const value = {
    user: user ?? null,
    loading: isLoading,
    login: loginMutation.mutateAsync,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}