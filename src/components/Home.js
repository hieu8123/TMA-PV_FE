import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from './ui/Button';
import ErrorMessage from './ui/ErrorMessage';
import { getPolls } from '../services/pollService';
import { useError } from '../hooks/useError';

function Home() {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const { error, handleError, clearError } = useError();
  const navigate = useNavigate();

  const fetchPolls = useCallback(async () => {
    try {
      const data = await getPolls();
      setPolls(data);
      setLoading(false);
      clearError();
    } catch (err) {
      handleError(err);
      setLoading(false);
    }
  }, [clearError, handleError]);

  useEffect(() => {
    fetchPolls();
  }, [fetchPolls]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          QuickPolls
        </h1>
        <p className="text-xl text-gray-600">
          Tạo và tham gia các cuộc bỏ phiếu nhanh chóng
        </p>
      </div>

      <div className="grid space-y-4">
        {/* Tạo Poll Mới */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-8">
            <h2 className="text-2xl font-bold text-white">
              Tạo Poll Mới
            </h2>
            <p className="text-indigo-100 mt-2">
              Tạo một cuộc bỏ phiếu mới và chia sẻ với mọi người
            </p>
          </div>
          <div className="p-6">
            <Button
              onClick={() => navigate('/create')}
              className="w-full"
            >
              Tạo Poll Mới
            </Button>
          </div>
        </div>

        {/* Danh sách Poll */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-8">
            <h2 className="text-2xl font-bold text-white">
              Danh Sách Poll
            </h2>
            <p className="text-purple-100 mt-2">
              Chọn một poll để xem kết quả
            </p>
          </div>
          <div className="p-6">
            {error && (
              <ErrorMessage 
                message={error} 
                onRetry={fetchPolls}
              />
            )}
            
            {loading ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-indigo-600 border-t-transparent"></div>
              </div>
            ) : polls.length > 0 ? (
              <div className="space-y-3">
                {polls.map((poll) => (
                  <button
                    key={poll.id}
                    onClick={() => navigate(`/poll/${poll.id}`)}
                    className="w-full text-left p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                  >
                    <h3 className="font-medium text-gray-900">{poll.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {new Date(poll.created_at).toLocaleDateString('vi-VN')}
                    </p>
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-4">
                Chưa có poll nào được tạo
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Hướng dẫn */}
      <div className="mt-12 bg-gray-50 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Cách sử dụng
        </h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="flex items-start">
            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
              <span className="text-indigo-600 font-bold">1</span>
            </div>
            <div className="ml-4">
              <h4 className="text-lg font-medium text-gray-900">Tạo Poll</h4>
              <p className="mt-1 text-gray-600">Tạo một poll mới với tiêu đề và các lựa chọn</p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
              <span className="text-indigo-600 font-bold">2</span>
            </div>
            <div className="ml-4">
              <h4 className="text-lg font-medium text-gray-900">Chia sẻ</h4>
              <p className="mt-1 text-gray-600">Chia sẻ poll với mọi người để họ có thể bỏ phiếu</p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
              <span className="text-indigo-600 font-bold">3</span>
            </div>
            <div className="ml-4">
              <h4 className="text-lg font-medium text-gray-900">Xem kết quả</h4>
              <p className="mt-1 text-gray-600">Theo dõi kết quả bỏ phiếu theo thời gian thực</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home; 