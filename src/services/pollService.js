const API_URL = 'http://localhost:3001';

class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

const handleResponse = async (response) => {
  const data = await response.json();
  
  if (!response.ok) {
    throw new ApiError(data.error || 'Đã xảy ra lỗi', response.status);
  }
  
  return data;
};

// Dữ liệu mẫu cho testing
const mockPolls = [
  {
    id: '1',
    title: 'Bạn thích framework nào nhất?',
    created_at: '2024-03-20T10:00:00Z',
    expires_at: '2024-03-27T10:00:00Z', // Hết hạn sau 7 ngày
    show_results: true, // Hiển thị kết quả ngay lập tức
    options: [
      { id: '1', text: 'React', votes: 150 },
      { id: '2', text: 'Vue', votes: 100 },
      { id: '3', text: 'Angular', votes: 50 }
    ]
  },
  {
    id: '2',
    title: 'Bạn thích ngôn ngữ lập trình nào nhất?',
    created_at: '2024-03-20T11:00:00Z',
    expires_at: '2024-03-21T11:00:00Z', // Hết hạn sau 1 ngày
    show_results: false, // Chỉ hiển thị kết quả sau khi hết hạn
    options: [
      { id: '4', text: 'JavaScript', votes: 200 },
      { id: '5', text: 'Python', votes: 150 },
      { id: '6', text: 'Java', votes: 100 }
    ]
  }
];

export const getPolls = async () => {
  // try {
  //   const response = await fetch(`${API_URL}/polls`);
  //   return handleResponse(response);
  // } catch (err) {
  //   if (err instanceof ApiError) {
  //     throw err;
  //   }
  //   throw new ApiError('Không thể kết nối đến server', 0);
  // }
  return mockPolls;
};

export const createPoll = async (pollData) => {
  // try {
  //   const response = await fetch(`${API_URL}/polls`, {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify(pollData),
  //   });
    
  //   return handleResponse(response);
  // } catch (err) {
  //   if (err instanceof ApiError) {
  //     throw err;
  //   }
  //   throw new ApiError('Không thể kết nối đến server', 0);
  // }
  const newPoll = {
    id: Math.random().toString(36).substr(2, 9),
    title: pollData.title,
    created_at: new Date().toISOString(),
    expires_at: pollData.expires_at,
    show_results: pollData.show_results,
    options: pollData.options.map(option => ({
      id: Math.random().toString(36).substr(2, 9),
      text: option,
      votes: 0
    }))
  };
  mockPolls.unshift(newPoll);
  return { id: newPoll.id };
};

export const getPoll = async (pollId) => {
  // try {
  //   const response = await fetch(`${API_URL}/polls/${pollId}`);
  //   return handleResponse(response);
  // } catch (err) {
  //   if (err instanceof ApiError) {
  //     throw err;
  //   }
  //   throw new ApiError('Không thể kết nối đến server', 0);
  // }
  const poll = mockPolls.find(p => p.id === pollId);
  if (!poll) {
    throw new ApiError('Poll not found', 404);
  }
  return poll;
};

export const votePoll = async (pollId, optionId) => {
  // try {
  //   const response = await fetch(`${API_URL}/polls/${pollId}/vote`, {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({ optionId }),
  //   });
    
  //   return handleResponse(response);
  // } catch (err) {
  //   if (err instanceof ApiError) {
  //     throw err;
  //   }
  //   throw new ApiError('Không thể kết nối đến server', 0);
  // }
  const poll = mockPolls.find(p => p.id === pollId);
  if (!poll) {
    throw new ApiError('Poll not found', 404);
  }

  // Kiểm tra thời gian hết hạn
  if (new Date(poll.expires_at) < new Date()) {
    throw new ApiError('Poll đã hết hạn', 400);
  }

  const option = poll.options.find(o => o.id === optionId);
  if (!option) {
    throw new ApiError('Option not found', 404);
  }
  option.votes++;
  return { success: true };
}; 