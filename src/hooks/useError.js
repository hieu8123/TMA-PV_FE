import { useState } from 'react';

export const useError = () => {
  const [error, setError] = useState(null);

  const handleError = (err) => {
    if (err instanceof Error) {
      setError(err.message);
    } else if (typeof err === 'string') {
      setError(err);
    } else {
      setError('Đã xảy ra lỗi không xác định');
    }
  };

  const clearError = () => {
    setError(null);
  };

  return { error, handleError, clearError };
}; 