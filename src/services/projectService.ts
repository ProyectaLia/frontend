import apiClient from './apiClient';

export const getPublicProjects = (params?: any) => apiClient.get('/projects', { params });

export const getMyProjects = () => apiClient.get('/projects/my-projects');

export const getMyCollaboratingProjects = () => apiClient.get('/projects/collaborating');

export const getAllProjects = (params?: any) => apiClient.get('/projects', { params });

export const getProjectById = (projectId: string | number) => apiClient.get(`/projects/${projectId}`);

export const createProject = (projectData: any) => apiClient.post('/projects', projectData);

export const updateProject = (projectId: string | number, projectData: any) => apiClient.put(`/projects/${projectId}`, projectData);

export const deleteProject = (projectId: string | number) => apiClient.delete(`/projects/${projectId}`); 