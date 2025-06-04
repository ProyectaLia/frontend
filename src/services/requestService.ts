import apiClient from './apiClient';

export const createCollaborationRequest = (projectId: string | number, message: string) =>
  apiClient.post(`/requests/project/${projectId}`, { message });

export const getProjectCollaborationRequests = (projectId: string | number) =>
  apiClient.get(`/requests/project/${projectId}/solicitudes`);

export const updateCollaborationRequestStatus = (requestId: string | number, status: string) =>
  apiClient.put(`/requests/${requestId}/status`, { status });

export const getMySentCollaborationRequests = (params?: any) =>
  apiClient.get('/requests/my-applications', { params }); 