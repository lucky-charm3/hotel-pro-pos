import axiosInstance from './axiosInstance';

const EXPENSE_BASE_URL = '/api/expenses';

export const expenseService = {
    getAllExpenses: async (params = {}) => {
        const response=await axiosInstance.get(EXPENSE_BASE_URL, { params });
        return response.data;
    },

    getTotalExpenses: async () => {
        const response=await axiosInstance.get(`${EXPENSE_BASE_URL}/total`);
        return response.data;
    },

    getExpenseById: async (id) => {
        const response=await axiosInstance.get(`${EXPENSE_BASE_URL}/${id}`);
        return response.data;
    },

    createExpense: async (expenseData) => {
        const response=await axiosInstance.post(EXPENSE_BASE_URL, expenseData);
        return response.data;
    },

    updateExpense: async (id, expenseData) => {
        const response=await axiosInstance.patch(`${EXPENSE_BASE_URL}/${id}`, expenseData);
        return response.data;
    },

    deleteExpense: async (id) => {
        const response=await axiosInstance.delete(`${EXPENSE_BASE_URL}/${id}`);
        return response.data;
    }
};
