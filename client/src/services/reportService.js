import axiosInstance from './axiosInstance';

const REPORT_BASE_URL = '/api/reports';

export const reportService = {
    getAllReports: async (params = {}) => {
        const response=await axiosInstance.get(REPORT_BASE_URL, { params });
        return response.data;
    },

    getReportById: async (id) => {
        const response=await axiosInstance.get(`${REPORT_BASE_URL}/${id}`);
        return response.data;
    },

    downloadReportCSV: async (id) => {
        const response=await axiosInstance.get(`${REPORT_BASE_URL}/${id}/download`);
        return response.data;
    },

    printReportHTML: async (id) => {
        const response=await axiosInstance.get(`${REPORT_BASE_URL}/${id}/print`);
        return response.data;
    },

    generateReport: async (reportParams={}) => {
        const response=await axiosInstance.post(`${REPORT_BASE_URL}/generate`, reportParams);
        return response.data;
    },

    deleteReport: async (id) => {
        const response=await axiosInstance.delete(`${REPORT_BASE_URL}/${id}`);
        return response.data;
    }
};
