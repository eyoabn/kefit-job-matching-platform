export const config = {
  mockMode: import.meta.env.VITE_MOCK_MODE === 'true',
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1',
};

export const delay = (ms: number): Promise<void> => 
  new Promise(resolve => setTimeout(resolve, ms));

export const MOCK_MODE = config.mockMode;