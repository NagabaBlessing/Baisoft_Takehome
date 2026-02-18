import { PaginatedResponse, Product, ProductStatus } from '../types';
import { apiRequest } from './apiClient';

type ApiProduct = {
  id: number;
  name: string;
  description: string;
  price: string;
  image_url: string;
  status: ProductStatus;
  created_by: string;
  approved_by: string | null;
  created_at: string;
};

const mapProduct = (product: ApiProduct): Product => ({
  id: String(product.id),
  name: product.name,
  description: product.description,
  price: Number(product.price),
  imageUrl: product.image_url || '',
  status: product.status,
  createdBy: product.created_by,
  approvedBy: product.approved_by,
  businessId: '',
  createdAt: product.created_at,
});

export const productService = {
  getApprovedProducts: async (filters?: { search?: string; businessId?: string; maxPrice?: number }): Promise<Product[]> => {
    const params = new URLSearchParams();
    if (filters?.search) params.set('search', filters.search);
    if (filters?.businessId) params.set('business_id', filters.businessId);
    if (filters?.maxPrice !== undefined) params.set('max_price', String(filters.maxPrice));

    const query = params.toString();
    const response = await apiRequest<PaginatedResponse<ApiProduct>>(`/api/public/products/${query ? `?${query}` : ''}`);
    return response.results.map(mapProduct);
  },

  getProductsForUser: async (filters?: { status?: ProductStatus; search?: string; ordering?: string }): Promise<Product[]> => {
    const params = new URLSearchParams();
    if (filters?.status) params.set('status', filters.status);
    if (filters?.search) params.set('search', filters.search);
    if (filters?.ordering) params.set('ordering', filters.ordering);

    const query = params.toString();
    const response = await apiRequest<PaginatedResponse<ApiProduct>>(`/api/products/${query ? `?${query}` : ''}`);
    return response.results.map(mapProduct);
  },

  createProduct: async (productData: { name: string; description: string; price: number; imageUrl?: string; status?: ProductStatus }): Promise<Product> => {
    const product = await apiRequest<ApiProduct>('/api/products/', {
      method: 'POST',
      body: JSON.stringify({
        ...productData,
        status: productData.status || ProductStatus.DRAFT,
        image_url: productData.imageUrl || '',
      }),
    });
    return mapProduct(product);
  },

  updateProduct: async (productId: string, updates: { name: string; description: string; price: number; imageUrl?: string; status: ProductStatus }): Promise<Product> => {
    const product = await apiRequest<ApiProduct>(`/api/products/${productId}/`, {
      method: 'PATCH',
      body: JSON.stringify({
        ...updates,
        image_url: updates.imageUrl || '',
      }),
    });
    return mapProduct(product);
  },

  submitForApproval: async (productId: string): Promise<Product> => {
    const product = await apiRequest<ApiProduct>(`/api/products/${productId}/`, {
      method: 'PATCH',
      body: JSON.stringify({ status: ProductStatus.PENDING_APPROVAL }),
    });
    return mapProduct(product);
  },

  approveProduct: async (productId: string): Promise<Product> => {
    const product = await apiRequest<ApiProduct>(`/api/products/${productId}/approve/`, { method: 'POST' });
    return mapProduct(product);
  },

  deleteProduct: async (productId: string) => {
    await apiRequest(`/api/products/${productId}/`, { method: 'DELETE' });
  },
};
