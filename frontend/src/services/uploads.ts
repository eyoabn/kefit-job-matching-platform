import { axiosInstance } from './api/axiosInstance';
import type { AxiosRequestConfig } from 'axios';

export type UploadType = 'avatar' | 'job_attachment' | 'contract_attachment' | 'general';

interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

interface UploadResponse {
  url: string;
  filename: string;
  size: number;
  content_type: string;
}

export const uploadFile = async (
  file: File,
  type: UploadType = 'general',
  onProgress?: (progress: UploadProgress) => void
): Promise<UploadResponse> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('type', type);

  const config: AxiosRequestConfig = {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: (progressEvent) => {
      if (onProgress && progressEvent.total) {
        onProgress({
          loaded: progressEvent.loaded,
          total: progressEvent.total,
          percentage: Math.round((progressEvent.loaded * 100) / progressEvent.total),
        });
      }
    },
  };

  const response = await axiosInstance.post<UploadResponse>('/uploads', formData, config);
  return response.data;
};

export const uploadMultipleFiles = async (
  files: File[],
  type: UploadType = 'general',
  onProgress?: (fileIndex: number, progress: UploadProgress) => void
): Promise<UploadResponse[]> => {
  const results: UploadResponse[] = [];
  
  for (let i = 0; i < files.length; i++) {
    const result = await uploadFile(files[i], type, (progress) => {
      onProgress?.(i, progress);
    });
    results.push(result);
  }
  
  return results;
};

export const deleteFile = async (url: string): Promise<void> => {
  await axiosInstance.delete('/uploads', { data: { url } });
};