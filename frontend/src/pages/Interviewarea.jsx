import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

function Interviewarea() {
  const location = useLocation();
  const navigate = useNavigate();
  const { jdDescription, difficulty: initialDifficulty } = location.state || {};

  const [started, setStarted] = useState(false);
  const [question, setQuestion] = useState("");
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [difficultyLevel, setDifficultyLevel] = useState(initialDifficulty || "easy");
  const [performance, setPerformance] = useState([]);
  const [timer, setTimer] = useState(0);
  const [isEnding, setIsEnding] = useState(false); 

  const intervalRef = useRef(null);

  useEffect(() => {
    if (started) {
      intervalRef.current = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [started]);

  useEffect(() => {
    if (started) fetchQuestion();
  }, [difficultyLevel, started]);

  const fetchQuestion = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/generate-question", {
        jdDescription,
        difficulty: difficultyLevel
      });
      setQuestion(res.data.question);
      setCode("");
      setOutput("");
    } catch (err) {
      setQuestion("Failed to fetch question.");
    }
  };

  const adjustDifficulty = (answeredCorrectly) => {
    if (answeredCorrectly) {
      if (difficultyLevel === "easy") setDifficultyLevel("medium");
      else if (difficultyLevel === "medium") setDifficultyLevel("hard");
    } else {
      if (difficultyLevel === "hard") setDifficultyLevel("medium");
      else if (difficultyLevel === "medium") setDifficultyLevel("easy");
    }
  };

  const handleRun = () => {
    try {
      // eslint-disable-next-line no-eval
      const result = eval(code);
      setOutput(result !== undefined ? result.toString() : "No output");
    } catch (err) {
      setOutput(err.toString());
    }
  };

  const handleSubmit = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/evaluate-answer", {
        question,
        userAnswer: code
      });

      const { correct, correctAnswer } = res.data;

      setPerformance(prev => [
        ...prev,
        {
          question,
          answer: code,
          correct,
          skipped: false,
          correctAnswer,
          language: "javascript"
        }
      ]);

      adjustDifficulty(correct);
      fetchQuestion();
    } catch (err) {
      alert("Failed to evaluate answer.");
    }
  };

  const handleSkip = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/evaluate-answer", {
        question,
        userAnswer: ""
      });

      const { correctAnswer } = res.data;

      setPerformance(prev => [
        ...prev,
        {
          question,
          answer: "",
          correct: false,
          skipped: true,
          correctAnswer,
          language: "javascript"
        }
      ]);

      adjustDifficulty(false);
      fetchQuestion();
    } catch (err) {
      alert("Failed to fetch correct answer for skipped question.");
    }
  };

  const handleEnd = async () => {
    setIsEnding(true);
    clearInterval(intervalRef.current);

    // Create a local copy to ensure we don't lose the final question
    let finalPerformance = [...performance];

    // Check if current question needs evaluation before we leave
    if (question && !performance.some(p => p.question === question)) {
      try {
        const res = await axios.post("http://localhost:5000/api/evaluate-answer", {
          question,
          userAnswer: code
        });
        
        finalPerformance.push({
          question,
          answer: code || "Skipped/Not answered",
          correct: res.data.correct,
          skipped: !code,
          correctAnswer: res.data.correctAnswer || "Not provided by AI",
          language: "javascript"
        });
      } catch (err) {
        console.error("Final evaluation failed", err);
      }
    }

    navigate("/endpage", { state: { performance: finalPerformance } });
  };

  const startInterview = () => {
    setStarted(true);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4 flex flex-col">
      <div className="flex justify-between items-center mb-4 bg-gray-800 p-3 rounded shadow">
        <div className="text-xl font-bold">Technical Interview</div>
        <div className="flex gap-4 items-center">
          <div>
            Timer: {Math.floor(timer / 60).toString().padStart(2,"0")}:
                   {(timer % 60).toString().padStart(2,"0")}
          </div>
          <button onClick={handleSkip} disabled={isEnding} className="bg-yellow-600 px-3 py-1 rounded">Skip</button>
          <button onClick={handleEnd} disabled={isEnding} className="bg-red-600 px-3 py-1 rounded">
            {isEnding ? "Processing..." : "End"}
          </button>
        </div>
      </div>

      {!started ? (
        <div className="flex justify-center items-center flex-1">
          <button onClick={startInterview} className="bg-green-600 px-6 py-3 rounded hover:bg-green-700 font-bold text-lg">
            Start Interview
          </button>
        </div>
      ) : (
        <div className="flex flex-1 gap-4">
          <textarea className="w-1/2 p-3 bg-gray-800 rounded text-gray-100 resize-none" value={question} readOnly />
          <div className="w-1/2 flex flex-col gap-2">
            <textarea
              className="flex-1 p-3 bg-gray-800 rounded text-gray-100 resize-none font-mono"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Write your answer here..."
            />
            <div className="flex gap-2">
              <button onClick={handleRun} className="bg-blue-600 px-3 py-1 rounded">Run</button>
              <button onClick={handleSubmit} className="bg-green-600 px-3 py-1 rounded">Submit</button>
            </div>
            <pre className="bg-gray-800 p-2 rounded h-32 overflow-auto">{output}</pre>
          </div>
        </div>
      )}
    </div>
  );
}

export default Interviewarea;