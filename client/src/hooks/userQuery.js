import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '../services/userService';

export const USERS_QUERY_KEY = 'users';

export const useGetUsers = (params) => {
    return useQuery({
        queryKey: [USERS_QUERY_KEY, params],
        queryFn: () => userService.getUsers(params),
        staleTime: 1000 * 60 * 5, 
    });
};

export const useGetCashiers = (params) => {
    return useQuery({
        queryKey: [USERS_QUERY_KEY, 'cashiers', params],
        queryFn: () => userService.getCashiers(params),
    });
};

export const useGetUserById = (id, options = {}) => {
    return useQuery({
        queryKey: [USERS_QUERY_KEY, 'details', id],
        queryFn: () => userService.getUserById(id),
        enabled: !!id,
        ...options
    });
};

export const useGetMe = () => {
    return useQuery({
        queryKey: [USERS_QUERY_KEY, 'me'],
        queryFn: userService.getMe,
        staleTime: Infinity,
    });
};

export const useCreateUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: userService.createUser,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [USERS_QUERY_KEY] });
        },
    });
};

export const useUpdateUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, userData }) => userService.updateUser(id, userData),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: [USERS_QUERY_KEY] });
            queryClient.invalidateQueries({ queryKey: [USERS_QUERY_KEY, 'details', variables.id] });
        },
    });
};

export const useUpdateProfile = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: userService.updateProfile,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [USERS_QUERY_KEY, 'me'] });
        },
    });
};

export const useChangePassword = () => {
    const queryClient=useQueryClient();    return useMutation({
        mutationFn: userService.changePassword,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [USERS_QUERY_KEY, 'me'] });
        },
    });
};

export const useLockAccount = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id }) => userService.lockAccount(id),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: [USERS_QUERY_KEY] });
            queryClient.invalidateQueries({ queryKey: [USERS_QUERY_KEY, 'details', variables.id] });
        },
    });
};

export const useDeleteUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: userService.deleteUser,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [USERS_QUERY_KEY] });
        },
    });
};
