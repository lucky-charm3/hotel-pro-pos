import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productService } from '../services/productService';

export const PRODUCT_QUERY_KEY = 'products';
export const TOTAL_PRODUCTS_KEY = 'totalProducts';

export const useGetAllProducts = (params={}) => {
    return useQuery({
        queryKey: [PRODUCT_QUERY_KEY, params],
        queryFn: () => productService.getAllProducts(params),
    });
};

export const useGetProductById = (id, options = {}) => {
    return useQuery({
        queryKey: [PRODUCT_QUERY_KEY, 'details', id],
        queryFn: () => productService.getProductById(id),
        enabled: !!id,
        ...options
    });
};

export const useGetTotalProducts = () => {
    return useQuery({
        queryKey: [TOTAL_PRODUCTS_KEY],
        queryFn: productService.getTotalProducts,
    });
};

export const useCreateProduct = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: productService.createProduct,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [PRODUCT_QUERY_KEY] });
            queryClient.invalidateQueries({ queryKey: [TOTAL_PRODUCTS_KEY] });
        },
    });
};

export const useUpdateProduct = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, productData }) => productService.updateProduct(id, productData),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: [PRODUCT_QUERY_KEY] });
            queryClient.invalidateQueries({ queryKey: [PRODUCT_QUERY_KEY, 'details', variables.id] });
            queryClient.invalidateQueries({ queryKey: [TOTAL_PRODUCTS_KEY] });
        },
    });
};

export const useDeleteProduct = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: productService.deleteProduct,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [PRODUCT_QUERY_KEY] });
            queryClient.invalidateQueries({ queryKey: [TOTAL_PRODUCTS_KEY] });
        },
    });
};
