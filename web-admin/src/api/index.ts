import api from './request';

export const adminLogin = (username: string, password: string) =>
  api.post('/auth/admin-login', { username, password });
export const getDashboard = () => api.get('/admin/dashboard');
export const getAdminClaims = (params: any) => api.get('/admin/claims', { params });
export const getAdminClaimDetail = (id: number) => api.get(`/admin/claims/${id}`);
export const updateClaimStatus = (id: number, data: any) => api.patch(`/claims/${id}/status`, data);
export const getAdminUsers = (params: any) => api.get('/admin/users', { params });
export const getAdminShops = () => api.get('/admin/shops');
