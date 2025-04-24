import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPolls } from '../services/pollService';
import { useError } from '../hooks/useError';
import Button from './ui/Button';
import ErrorMessage from './ui/ErrorMessage';

const PollList = ({ polls: initialPolls = [] }) => {
  const navigate = useNavigate();
  const [polls, setPolls] = useState(initialPolls);
  const [loading, setLoading] = useState(true);
  const { error, handleError, clearError } = useError();

  useEffect(() => {
    
      fetchPolls();
      setLoading(false);
    
  }, [initialPolls]);

  const fetchPolls = async () => {
    try {
      setLoading(true);
      clearError();
      const data = await getPolls();
      setPolls(data.polls);
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
        <p className="mt-2 text-gray-600">Đang tải...</p>
      </div>
    );
  }

  if (error) {
    return (
      <ErrorMessage 
        message={error} 
        onRetry={fetchPolls}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Danh sách Polls</h2>
        <Button
          type="button"
          onClick={() => navigate('/create')}
        >
          Tạo Poll Mới
        </Button>
      </div>

      {polls.length === 0 ? (
        <div className="text-center p-8 bg-white rounded-lg shadow">
          <p className="text-gray-600">Chưa có poll nào</p>
          <Button
            type="button"
            onClick={() => navigate('/create')}
            className="mt-4"
          >
            Tạo Poll Đầu Tiên
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {polls.map(poll => (
            <div key={poll.id} className="bg-white shadow-lg rounded-xl overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-8">
                <h3 className="text-xl font-bold text-white">{poll.title}</h3>
                {poll.expiresAt && (
                  <p className="text-indigo-100 mt-2">
                    Hết hạn: {new Date(poll.expiresAt).toLocaleString()}
                  </p>
                )}
              </div>

              <div className="p-6">
                <div className="space-y-2">
                  {poll.options.map(option => (
                    <div key={option.id} className="flex items-center justify-between">
                      <span className="text-gray-700">{option.text}</span>
                      {poll.showResults && (
                        <span className="text-gray-600">
                          {option.votes} votes
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex justify-end">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => navigate(`/poll/${poll.id}`)}
                  >
                    Xem chi tiết
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PollList; 