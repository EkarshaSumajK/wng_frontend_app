import { apiClient } from './api';

export const userApi = {
  uploadProfilePicture: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.uploadFile<any>('/users/me/profile-picture', formData);
  },
};
