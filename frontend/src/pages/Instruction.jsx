import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Instruction = () => {
  const [jdDescription, setJdDescription] = useState('');
  const [difficulty, setDifficulty] = useState('easy');
  const navigate = useNavigate();

  const handleStart = () => {
    if (!jdDescription) {
      alert('Please enter the JD before starting the interview.');
      return;
    }
    navigate('/interviewarea', { state: { jdDescription, difficulty } });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-gray-100 p-6">
      <div className="bg-gray-800 p-6 rounded shadow-md max-w-lg w-full mb-6">
        <h2 className="text-xl font-bold mb-4">Instructions</h2>
        <ul className="list-disc list-inside space-y-2 text-gray-200">
          <li>If you are not able to solve a question, you can skip it.</li>
          <li>Click on <span className="font-semibold">Start</span> to begin the interview.</li>
          <li>Click <span className="font-semibold">End</span> to finish the interview.</li>
          <li>This website helps you practice interviews, so kindly avoid any malpractice.</li>
        </ul>
      </div>

      <div className="bg-gray-800 p-6 rounded shadow-md max-w-lg w-full space-y-4">
        <div className="flex flex-col">
          <label className="mb-1 font-semibold">Job Description:</label>
          <input
            type="text"
            value={jdDescription}
            onChange={(e) => setJdDescription(e.target.value)}
            placeholder="Enter the JD"
            className="p-2 rounded bg-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-1 font-semibold">Select Difficulty:</label>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="p-2 rounded bg-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        <button
          onClick={handleStart}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded font-semibold">
          Start Interview
        </button>
      </div>
    </div>
  );
};

export default Instruction;