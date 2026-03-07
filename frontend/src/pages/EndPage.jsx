import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

function EndPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { performance } = location.state || { performance: [] };

  const total = performance.length;
  const correctCount = performance.filter(p => p.correct).length;
  const skippedCount = performance.filter(p => p.skipped).length;
  const logout = async ()=>{
    await signOut(auth);
    navigate("/");
  };  

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-4">Interview Summary</h1>

      <div className="mb-6 space-y-1">
        <p>Total Questions: {total}</p>
        <p>Correct Answers: {correctCount}</p>
        <p>Skipped Questions: {skippedCount}</p>
      </div>

      <div className="space-y-6">
        {performance.map((p, index) => (
          <div key={index} className="bg-gray-800 p-4 rounded shadow">
            <p className="mb-1">
              <span className="font-semibold">Q{index + 1}:</span> {p.question}
            </p>

            <p className="mb-1">
              <span className="font-semibold">Your Answer:</span>{" "}
              {p.answer ? <pre className="bg-gray-700 p-2 rounded">{p.answer}</pre> : "Skipped"}
            </p>

            <p className="mb-1">
              <span className="font-semibold">Correct Answer:</span>{" "}
              {p.correctAnswer ? <pre className="bg-gray-700 p-2 rounded">{p.correctAnswer}</pre> : "Not available"}
            </p>

            <p>
              <span className="font-semibold">Result:</span> {p.correct ? "Correct" : "Incorrect"}
            </p>

            <p>
              <span className="font-semibold">Language:</span> {p.language}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <button
          onClick={() => navigate("/instruction")}
          className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 font-semibold"
        >
          Return Home
        </button>
        <button onClick={logout}>Logout</button>
      </div>
    </div>
  );
}

export default EndPage;