import axiosInstance from './axiosInstance';

const USER_BASE_URL = '/api/users';

export const userService = {
    getUsers:async  (params = {}) => {
        const response=await axiosInstance.get(USER_BASE_URL, { params });
        return response.data;
    },

    getCashiers:async  (params = {}) => {
        const response=await axiosInstance.get(`${USER_BASE_URL}/cashiers`, { params });
        return response.data;
    },
    
    getUserById:async  (id) => {
        const response=await axiosInstance.get(`${USER_BASE_URL}/${id}`);
        return response.data;
    },

    getMe:async  () => {
        const response=await axiosInstance.get(`${USER_BASE_URL}/me`);
        return response.data;
    },

   login:async  (credentials) => {
    const response=await axiosInstance.post(`${USER_BASE_URL}/login`, credentials);
    return response.data;
    },

    createUser:async  (userData) => {
        const response=await axiosInstance.post(USER_BASE_URL, userData);
        return response.data;
    },

    updateUser:async  (id, userData) => {
        const response=await axiosInstance.patch(`${USER_BASE_URL}/${id}`, userData);
        return response.data;
    },

    updateProfile:async  (profileData) => {
        const response=await axiosInstance.patch(`${USER_BASE_URL}/profile`, profileData);
        return response.data;
    },

    changePassword:async  (passwordData) => {
        const response=await axiosInstance.patch(`${USER_BASE_URL}/change-password`, passwordData);
        return response.data;
    },
    
    lockAccount: async  (id) => {
        const response=await axiosInstance.patch(`${USER_BASE_URL}/lock-account/${id}`);
        return response.data;
    },
    
    deleteUser: async  (id) => {
        const response=await axiosInstance.delete(`${USER_BASE_URL}/${id}`);
        return response.data;
    }
};
