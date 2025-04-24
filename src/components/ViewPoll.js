import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from './ui/Button';
import ErrorMessage from './ui/ErrorMessage';
import { getPoll, votePoll } from '../services/pollService';
import { useWebSocket } from '../hooks/useWebSocket';
import { useError } from '../hooks/useError';

function ViewPoll() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [poll, setPoll] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isVoting, setIsVoting] = useState(false);
  const { error, handleError, clearError } = useError();

  const fetchPoll = useCallback(async () => {
    try {
      const data = await getPoll(id);
      setPoll(data);
      setLoading(false);
      clearError();
    } catch (err) {
      handleError(err);
      setLoading(false);
    }
  }, [id, handleError, clearError]);

  useWebSocket(id, fetchPoll);

  useEffect(() => {
    fetchPoll();
  }, [fetchPoll]);

  const handleVote = async (optionId) => {
    setIsVoting(true);
    clearError();
    
    try {
      await votePoll(id, optionId);
      // Poll will be updated via WebSocket
    } catch (err) {
      handleError(err);
    } finally {
      setIsVoting(false);
    }
  };

  const isExpired = poll?.expires_at && new Date(poll.expires_at) < new Date();
  const canShowResults = poll?.show_results || isExpired;

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <ErrorMessage 
        message={error} 
        onRetry={fetchPoll}
      />
    );
  }

  if (!poll) {
    return null;
  }

  const totalVotes = poll.options.reduce((sum, option) => sum + option.votes, 0);

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white shadow-lg rounded-xl overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-8">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-2xl font-bold text-white">
                {poll.title}
              </h3>
              <div className="text-indigo-100 mt-2 space-y-1">
                <p>Tổng số phiếu: {totalVotes}</p>
                {poll.expires_at && (
                  <p>
                    {isExpired ? (
                      <span className="text-red-200">Đã hết hạn</span>
                    ) : (
                      <span>Hết hạn: {new Date(poll.expires_at).toLocaleString('vi-VN')}</span>
                    )}
                  </p>
                )}
              </div>
            </div>
            <Button
              onClick={() => navigate('/')}
              variant="secondary"
              className="bg-white/10 hover:bg-white/20 text-white border-white/20"
            >
              Quay về trang chủ
            </Button>
          </div>
        </div>
        
        <div className="p-6 space-y-4">
          {poll.options.map((option) => {
            const percentage = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0;
            return (
              <div key={option.id} className="relative">
                <Button
                  onClick={() => handleVote(option.id)}
                  className="w-full text-left p-4 hover:bg-gray-50 transition-all duration-200"
                  disabled={isVoting || isExpired}
                >
                  <div className="flex justify-between items-center space-x-2">
                    <span className="text-lg font-medium text-gray-900 overflow-hidden">{option.text}</span>
                    {canShowResults && (
                      <span className="text-sm font-semibold mr-2 text-indigo-600 truncate whitespace-nowrap bg-indigo-50 px-3 py-1 rounded-full flex-shrink-0">
                        {option.votes} phiếu
                      </span>
                    )}
                  </div>
                  {canShowResults && (
                    <>
                      <div className="relative flex items-center w-full ml-2 bg-gray-100 rounded-full h-3">
                        <div
                          className="absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500 ease-out"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <div className="ml-2 text-sm font-medium text-indigo-600">
                        {percentage.toFixed(1)}%
                      </div>
                    </>
                  )}
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default ViewPoll; 