import axiosInstance from './axiosInstance';

const BANKING_BASE_URL = '/api/banking';

export const bankingService = {
    getAllBanking: async (params = {}) => {
        const response= await axiosInstance.get(BANKING_BASE_URL, { params });
        return response.data
    },

    getBankingSummary: async () => {
        const response=await axiosInstance.get(`${BANKING_BASE_URL}/summary`);
        return response.data;
    },

    getBankingById: async (id) => {
        const response=await axiosInstance.get(`${BANKING_BASE_URL}/${id}`);
        return response.data;
    },

    createBanking: async (bankingData) => {
        const response=await axiosInstance.post(BANKING_BASE_URL, bankingData);
        return response.data;
    },

    updateBanking: async (id, bankingData) => {
        const response=await axiosInstance.patch(`${BANKING_BASE_URL}/${id}`, bankingData);
        return response.data;
    },

    deleteBanking: async (id) => {
        const response=await axiosInstance.delete(`${BANKING_BASE_URL}/${id}`);
        return response.data;
    }
};
