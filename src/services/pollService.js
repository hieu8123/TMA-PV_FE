const API_URL = 'http://localhost:3000';

class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json();
    throw new ApiError(error.message || 'Something went wrong', response.status);
  }
  return response.json();
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

export const getPolls = async (showResults = false) => {
  try {
    const response = await fetch(`${API_URL}/polls?showResults=${showResults}`);
    return handleResponse(response);
  } catch (err) {
    if (err instanceof ApiError) {
      throw err;
    }
    throw new ApiError('Không thể kết nối đến server', 0);
  }
};

export const createPoll = async (pollData) => {
  try {
    const response = await fetch(`${API_URL}/polls`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(pollData),
    });
    return handleResponse(response);
  } catch (err) {
    if (err instanceof ApiError) {
      throw err;
    }
    throw new ApiError('Không thể kết nối đến server', 0);
  }
};

export const getPollById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/polls/${id}`);
    return handleResponse(response);
  } catch (err) {
    if (err instanceof ApiError) {
      throw err;
    }
    throw new ApiError('Không thể kết nối đến server', 0);
  }
};

export const votePoll = async (pollId, optionId) => {
  try {
    const response = await fetch(`${API_URL}/polls/${pollId}/vote`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ optionId }),
    });
    return handleResponse(response);
  } catch (err) {
    if (err instanceof ApiError) {
      throw err;
    }
    throw new ApiError('Không thể kết nối đến server', 0);
  }
};

export const togglePollResults = async (pollId, showResults) => {
  try {
    const response = await fetch(`${API_URL}/polls/${pollId}/show-results`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ showResults }),
    });
    return handleResponse(response);
  } catch (err) {
    if (err instanceof ApiError) {
      throw err;
    }
    throw new ApiError('Không thể kết nối đến server', 0);
  }
}; 