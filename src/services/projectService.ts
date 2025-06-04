import apiClient from './apiClient';

export const getPublicProjects = (params?: any) => apiClient.get('/projects', { params });

export const getMyProjects = () => apiClient.get('/my-projects');

export const getMyCollaboratingProjects = () => apiClient.get('/projects/collaborating'); 