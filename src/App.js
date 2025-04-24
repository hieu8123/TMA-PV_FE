import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PollList from './components/PollList';
import CreatePoll from './components/CreatePoll';
import ViewPoll from './components/ViewPoll';

function App() {
  const [polls, setPolls] = useState([]);

  const handlePollCreated = (newPoll) => {
    setPolls([newPoll, ...polls]);
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <div className="container mx-auto py-8">
          <h1 className="text-3xl font-bold text-center mb-8">QuickPolls</h1>
          <div className="max-w-2xl mx-auto">
            <Routes>
              <Route path="/" element={<PollList polls={polls} />} />
              <Route path="/create" element={<CreatePoll onPollCreated={handlePollCreated} />} />
              <Route path="/poll/:id" element={<ViewPoll />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App; 