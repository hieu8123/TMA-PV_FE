import { useState, useCallback } from 'react';

export const useError = () => {
  const [error, setError] = useState(null);

  const handleError = useCallback((err) => {
    console.error('Error:', err);
    
    if (err instanceof Error) {
      setError(err.message);
    } else if (typeof err === 'string') {
      setError(err);
    } else {
      setError('Đã xảy ra lỗi không xác định');
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    error,
    handleError,
    clearError
  };
}; 