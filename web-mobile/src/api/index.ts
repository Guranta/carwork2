import api from './request';

export const sendCode = (phone: string) => api.post('/auth/send-code', { phone });
export const login = (phone: string, code: string) => api.post('/auth/login', { phone, code });
export const adminLogin = (username: string, password: string) => api.post('/auth/admin-login', { username, password });
export const getMe = () => api.get('/users/me');
export const getMyVehicles = () => api.get('/users/vehicles');
export const getPolicies = (status?: string) => api.get('/policies', { params: { status } });
export const getPolicyDetail = (id: number) => api.get(`/policies/${id}`);
export const createClaim = (data: any) => api.post('/claims', data);
export const getClaims = (status?: string) => api.get('/claims', { params: { status } });
export const getClaimDetail = (id: number) => api.get(`/claims/${id}`);
export const uploadClaimImages = (id: number, formData: FormData) =>
  api.post(`/claims/${id}/images`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
