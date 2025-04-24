import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPollById, votePoll, togglePollResults } from '../services/pollService';
import { useError } from '../hooks/useError';
import Button from './ui/Button';
import ErrorMessage from './ui/ErrorMessage';

const ViewPoll = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [poll, setPoll] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showResults, setShowResults] = useState(false);
  const { error, handleError, clearError } = useError();

  useEffect(() => {
    fetchPoll();
  }, [id]);

  const fetchPoll = async () => {
    try {
      setLoading(true);
      clearError();
      const data = await getPollById(id);
      setPoll(data.poll);
      setShowResults(data.poll.showResults);
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (optionId) => {
    try {
      clearError();
      const result = await votePoll(id, optionId);
      setPoll(result.poll);
    } catch (err) {
      handleError(err);
    }
  };

  const handleToggleResults = async () => {
    try {
      clearError();
      await togglePollResults(id, !showResults);
      setShowResults(!showResults);
      // Fetch lại poll để cập nhật kết quả
      const data = await getPollById(id);
      setPoll(data.poll);
    } catch (err) {
      handleError(err);
    }
  };

  const shouldShowResults = (poll) => {
    if (poll.isExpired) {
      return true;
    }
    return showResults;
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
        onRetry={fetchPoll}
      />
    );
  }

  if (!poll) {
    return (
      <div className="text-center p-4">
        <p className="text-gray-600">Không tìm thấy poll</p>
        <Button
          type="button"
          variant="secondary"
          onClick={() => navigate('/')}
          className="mt-4"
        >
          Quay lại
        </Button>
      </div>
    );
  }

  const totalVotes = poll.options.reduce((sum, option) => sum + option.votes, 0);
  const canShowResults = shouldShowResults(poll);

  return (
    <div className="space-y-6">
      <div className="bg-white shadow-lg rounded-xl overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-8">
          <h2 className="text-2xl font-bold text-white">{poll.title}</h2>
          {poll.expiresAt && (
            <p className="text-indigo-100 mt-2">
              Hết hạn: {new Date(poll.expiresAt).toLocaleString()}
            </p>
          )}
          {poll.isExpired && (
            <p className="text-red-200 mt-2">
              Poll đã hết hạn
            </p>
          )}
        </div>

        <div className="p-6 space-y-4">
          {poll.options.map(option => (
            <div key={option.id} className="space-y-2">
              <button
                onClick={() => handleVote(option.id)}
                className="w-full text-left p-4 border rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                disabled={poll.isExpired}
              >
                <span>{option.text}</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {canShowResults && (
        <div className="bg-white shadow-lg rounded-xl overflow-hidden">
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-8">
            <h3 className="text-xl font-bold text-white">Kết quả</h3>
          </div>
          <div className="p-6 space-y-4">
            {poll.options.map(option => (
              <div key={option.id} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">{option.text}</span>
                  <span className="text-gray-600">
                    {option.votes} votes
                    {totalVotes > 0 && (
                      <span className="ml-2">
                        ({Math.round((option.votes / totalVotes) * 100)}%)
                      </span>
                    )}
                  </span>
                </div>
                {totalVotes > 0 && (
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-600 rounded-full"
                      style={{ width: `${(option.votes / totalVotes) * 100}%` }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-between items-center">
        <Button
          type="button"
          variant="secondary"
          onClick={() => navigate('/')}
        >
          Quay lại
        </Button>
        {!poll.isExpired && (
          <Button
            type="button"
            onClick={handleToggleResults}
          >
            {showResults ? 'Ẩn kết quả' : 'Hiện kết quả'}
          </Button>
        )}
      </div>
    </div>
  );
};

export default ViewPoll; 