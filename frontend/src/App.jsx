import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Interviewarea from './pages/Interviewarea';
import Instruction from './pages/Instruction';
import EndPage from './pages/EndPage';
import Login from './Login'
import Signup from './Signup';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />}/>
        <Route path="/signup" element={<Signup/>}/>
        <Route path="/instruction" element={<Instruction />} />
        <Route path="/interviewarea" element={<Interviewarea />} />
        <Route path="/endpage" element={<EndPage />} />
      </Routes>
    </Router>
  );
};

export default App;