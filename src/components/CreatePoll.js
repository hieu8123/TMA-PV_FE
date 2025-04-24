import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from './ui/Button';
import ErrorMessage from './ui/ErrorMessage';
import { createPoll } from '../services/pollService';
import { useError } from '../hooks/useError';

const CreatePoll = ({ onPollCreated }) => {
  const [title, setTitle] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [expiresAt, setExpiresAt] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdPollId, setCreatedPollId] = useState(null);
  const [showCopied, setShowCopied] = useState(false);
  const { error, handleError, clearError } = useError();
  const navigate = useNavigate();

  const handleAddOption = () => {
    setOptions([...options, '']);
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    clearError();
    
    const validOptions = options.filter(option => option.trim() !== '');
    if (validOptions.length < 2) {
      handleError('Vui lòng thêm ít nhất 2 lựa chọn');
      setIsSubmitting(false);
      return;
    }

    try {
      const pollData = {
        title,
        options: validOptions,
        expires_at: expiresAt || null,
        show_results: showResults
      };
      const result = await createPoll(pollData);
      setCreatedPollId(result.id);
      onPollCreated(result.poll);
      setTitle('');
      setOptions(['', '']);
      setShowResults(false);
      clearError();
    } catch (err) {
      handleError(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyPollId = () => {
    navigator.clipboard.writeText(createdPollId);
    setShowCopied(true);
    setTimeout(() => setShowCopied(false), 2000);
  };

  const handleViewPoll = () => {
    navigate(`/poll/${createdPollId}`);
  };

  if (createdPollId) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow-lg rounded-xl overflow-hidden">
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-8">
            <h3 className="text-2xl font-bold text-white">
              Tạo Poll Thành Công!
            </h3>
            <p className="text-green-100 mt-2">
              Chia sẻ mã poll này với mọi người để họ có thể bỏ phiếu
            </p>
          </div>
          <div className="p-6">
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between">
                <code className="text-lg font-mono text-gray-900">{createdPollId}</code>
                <button
                  onClick={handleCopyPollId}
                  className="text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  {showCopied ? 'Đã copy!' : 'Copy'}
                </button>
              </div>
            </div>
            <div className="flex gap-4">
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate('/')}
                className="flex-1"
              >
                Tạo Poll Mới
              </Button>
              <Button
                type="button"
                onClick={handleViewPoll}
                className="flex-1"
              >
                Xem Poll
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white shadow-lg rounded-xl overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-8">
          <h3 className="text-2xl font-bold text-white">
            Tạo Poll Mới
          </h3>
          <p className="text-indigo-100 mt-2">
            Tạo một cuộc bỏ phiếu mới và chia sẻ với mọi người
          </p>
        </div>
        
        {error && (
          <ErrorMessage 
            message={error} 
            onRetry={clearError}
          />
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Tiêu đề Poll
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Lựa chọn</label>
            {options.map((option, index) => (
              <div key={index} className="mt-2">
                <input
                  type="text"
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder={`Lựa chọn ${index + 1}`}
                />
              </div>
            ))}
            <Button
              type="button"
              variant="secondary"
              onClick={handleAddOption}
              className="mt-2"
            >
              Thêm lựa chọn
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="expiresAt" className="block text-sm font-medium text-gray-700">
                Thời gian hết hạn
              </label>
              <input
                type="datetime-local"
                id="expiresAt"
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              <p className="mt-1 text-sm text-gray-500">
                Để trống nếu không muốn giới hạn thời gian
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Hiển thị kết quả
              </label>
              <div className="mt-2">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    checked={showResults}
                    onChange={(e) => setShowResults(true)}
                    className="form-radio text-indigo-600"
                  />
                  <span className="ml-2">Hiển thị ngay</span>
                </label>
                <label className="inline-flex items-center ml-4">
                  <input
                    type="radio"
                    checked={!showResults}
                    onChange={(e) => setShowResults(false)}
                    className="form-radio text-indigo-600"
                  />
                  <span className="ml-2">Chỉ hiển thị sau khi hết hạn</span>
                </label>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/')}
              className="flex-1"
            >
              Quay lại
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Đang tạo...' : 'Tạo Poll'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePoll; 