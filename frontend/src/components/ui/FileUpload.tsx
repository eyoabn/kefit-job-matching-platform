import React, { useCallback, useState } from 'react';
import { Upload, X, FileText, Image, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import axios from 'axios';

interface FileUploadProps {
  onUploadComplete: (url: string, filename: string) => void;
  onError?: (error: string) => void;
  accept?: string;
  maxSize?: number;
  label?: string;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB default

export const FileUpload: React.FC<FileUploadProps> = ({
  onUploadComplete,
  onError,
  accept = 'application/pdf,image/jpeg,image/png',
  maxSize = MAX_FILE_SIZE,
  label = 'Upload file',
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const { axiosInstance } = useAuth() as any;

  const handleUpload = useCallback(async (file: File) => {
    setError(null);
    
    if (file.size > maxSize) {
      const errorMsg = `File too large. Max size is ${Math.round(maxSize / 1024 / 1024)}MB`;
      setError(errorMsg);
      onError?.(errorMsg);
      return;
    }

    const allowedTypes = accept.split(',').map(t => t.trim());
    if (!allowedTypes.includes(file.type)) {
      const errorMsg = 'Invalid file type. Allowed: PDF, JPG, PNG';
      setError(errorMsg);
      onError?.(errorMsg);
      return;
    }

    setUploading(true);
    setProgress(0);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'general');

      const response = await axiosInstance.post('/uploads', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (event) => {
          if (event.total) {
            setProgress(Math.round((event.loaded * 100) / event.total));
          }
        },
      });

      onUploadComplete(response.data.url, response.data.filename);
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Upload failed';
      setError(errorMsg);
      onError?.(errorMsg);
    } finally {
      setUploading(false);
    }
  }, [maxSize, accept, axiosInstance, onUploadComplete, onError]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file) handleUpload(file);
  }, [handleUpload]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
  }, [handleUpload]);

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <Image className="w-5 h-5 text-blue-500" />;
    return <FileText className="w-5 h-5 text-red-500" />;
  };

  return (
    <div className="space-y-2">
      {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}
      
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragActive 
            ? 'border-kefit-primary bg-kefit-primary/5' 
            : 'border-gray-300 hover:border-gray-400'
        } ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept={accept}
          onChange={handleChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={uploading}
        />
        
        <div className="space-y-2">
          <Upload className="mx-auto w-8 h-8 text-gray-400" />
          <p className="text-sm text-gray-600">
            <span className="font-medium text-kefit-primary">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-gray-500">
            PDF, JPG, PNG up to {Math.round(maxSize / 1024 / 1024)}MB
          </p>
        </div>

        {uploading && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
            <div className="w-full max-w-[200px] mx-4">
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-kefit-primary transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-xs text-center mt-2 text-gray-600">{progress}%</p>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-2 text-sm text-red-600">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}
    </div>
  );
};