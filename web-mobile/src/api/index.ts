import api from './request';

export const sendCode = (phone: string) => api.post('/auth/send-code', { phone });
export const login = (phone: string, code: string) => api.post('/auth/login', { phone, code });
export const getMe = () => api.get('/users/me');
export const getMyVehicles = () => api.get('/users/vehicles');
export const getPolicies = (status?: string) => api.get('/policies', { params: { status } });
export const getPolicyDetail = (id: number) => api.get(`/policies/${id}`);
