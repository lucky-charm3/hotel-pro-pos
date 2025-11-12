import {useEffect} from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {AuthContext} from './authContext.jsx';
import { userService } from '../services/userService.js'; 

export function AuthProvider({ children }) {
  const queryClient = useQueryClient();

const { data: user, isLoading,error,isError } = useQuery({
    queryKey: ['currentUser'], 
    queryFn: async () => {
        const response = await userService.getMe();
        return response;
    },
    enabled: !!localStorage.getItem('token'), 
    retry:1,
    refetchOnWindowFocus: false, 
    staleTime: 1000 * 60 * 30
  });

   useEffect(() => {
    if (isError) {
      if (error?.response?.status === 401 || error?.response?.status === 403) {
        console.log('Authentication failed, clearing data...');
        localStorage.removeItem('token');
        queryClient.setQueryData(['currentUser'], null);
      }
    }
  }, [isError, error, queryClient]);

  const loginMutation = useMutation({
    mutationFn:async (credentials) => {
      const response = await userService.login(credentials); 

      if (response.success&&response.token) { 
        localStorage.setItem('token', response.token);
        return response.user;
      }
      throw new Error('Login failed');
    },
      onSuccess: (user) => {
        queryClient.setQueryData(['currentUser'], user);
    }
});

  const logout = () => {
    localStorage.removeItem('token');
    queryClient.setQueryData(['currentUser'], null);
    queryClient.removeQueries({ queryKey: ['currentUser'] });
    queryClient.removeQueries({ queryKey: ['users', 'me'] }); 
    window.location.href='/';
  };

  const value = {
    user,
    loading: isLoading,
    login: loginMutation.mutateAsync,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}