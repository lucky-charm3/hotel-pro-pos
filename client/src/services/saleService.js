import axiosInstance from './axiosInstance';

const SALE_BASE_URL = '/api/sales';

export const saleService = {
    getAllSales: async (params = {}) => {
        const response=await axiosInstance.get(SALE_BASE_URL, { params });
        return response.data;
    },

    getSaleById: async (id) => {
        const response=await axiosInstance.get(`${SALE_BASE_URL}/${id}`);
        return response.data;
    },

    getSaleDetails: async (id) => {
        const response=await axiosInstance.get(`${SALE_BASE_URL}/${id}/details`);
        return response.data;
    },

    getCashierSales: async (params = {}) => {
        const response=await axiosInstance.get(`${SALE_BASE_URL}/cashier/sales`, { params });
        return response.data;
    },

    getTotalSalesToday: async () => {
        const response=await axiosInstance.get(`${SALE_BASE_URL}/cashier/today-total`);
        return response.data;
    },

    createSale: async (saleData) => {
        const response=await axiosInstance.post(SALE_BASE_URL, saleData);
        return response.data;
    },

    deleteSale: async (id) => {
        const response=await axiosInstance.delete(`${SALE_BASE_URL}/${id}`);
        return response.data;
    }
};
