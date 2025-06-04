import apiClient from './apiClient';
 
export const registerUser = (userData: any) => apiClient.post('/users/register', userData);
export const loginUser = (credentials: any) => apiClient.post('/users/login', credentials);
export const updateUser = (userData: any) => apiClient.put('/users/profile', userData); 