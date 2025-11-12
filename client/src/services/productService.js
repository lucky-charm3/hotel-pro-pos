import axiosInstance from './axiosInstance';

const PRODUCT_BASE_URL = '/api/products';

export const productService = {
    getAllProducts: async (params = {}) => {
        const response=await axiosInstance.get(PRODUCT_BASE_URL, { params });
        return response.data;
    },

    getTotalProducts: async () => {
        const response=await axiosInstance.get(`${PRODUCT_BASE_URL}/total`);
        return response.data;
    },

    getProductById: async (id) => {
        const response=await axiosInstance.get(`${PRODUCT_BASE_URL}/${id}`);
        return response.data;
    },

    createProduct: async (productData) => {
        const response=await axiosInstance.post(PRODUCT_BASE_URL, productData);
        return response.data;
    },

    updateProduct: async (id, productData) => {
        const response=await axiosInstance.patch(`${PRODUCT_BASE_URL}/${id}`, productData);
        return response.data;
    },

    deleteProduct: async (id) => {
        const response=await axiosInstance.delete(`${PRODUCT_BASE_URL}/${id}`);
        return response.data;
    }
};