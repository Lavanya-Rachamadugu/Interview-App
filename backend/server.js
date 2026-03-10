require("dotenv").config();
const express = require("express");
const cors = require("cors");
const Groq = require("groq-sdk");

const app = express();
app.use(cors());
app.use(express.json());

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

/* =========================================================
   GENERATE QUESTION
========================================================= */
app.post("/api/generate-question", async (req, res) => {
  const { jdDescription, difficulty } = req.body;

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are a coding interviewer. Provide ONLY the question text. No explanation. No markdown. No backticks.",
        },
        {
          role: "user",
          content: `JD: ${jdDescription}\nDifficulty: ${difficulty}`,
        },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
    });

    const question =
      completion?.choices?.[0]?.message?.content?.trim() ||
      "Unable to generate question.";

    res.json({ question });
  } catch (err) {
    console.error("GROQ QUESTION ERROR:", err);
    res.status(500).json({ error: "Failed to fetch question" });
  }
});

/* =========================================================
   EVALUATE ANSWER
========================================================= */
app.post("/api/evaluate-answer", async (req, res) => {
  const { question, userAnswer } = req.body;

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `
You are a technical evaluator.

Return STRICT JSON only.
No markdown.
No explanation.
No backticks.

Format exactly like this:
{
  "correct": boolean,
  "correctAnswer": "Full ideal working code here"
}
`,
        },
        {
          role: "user",
          content: `Question: ${question}
User Answer: ${userAnswer || "No answer provided"}`,
        },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0,
    });

    let messageContent =
      completion?.choices?.[0]?.message?.content || "";

    console.log("RAW AI RESPONSE:\n", messageContent);

    // Remove markdown if AI adds it
    messageContent = messageContent
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    // Extract only JSON block safely
    const jsonMatch = messageContent.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      return res.json({
        correct: false,
        correctAnswer: "AI did not return valid JSON.",
      });
    }

    let result;

    try {
      result = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      console.error("JSON PARSE FAILED:\n", jsonMatch[0]);

      return res.json({
        correct: false,
        correctAnswer: "Error parsing AI response.",
      });
    }

    res.json({
      correct: Boolean(result.correct),
      correctAnswer:
        result.correctAnswer || "No solution provided by AI.",
    });
  } catch (err) {
    console.error("EVALUATION ERROR:", err);
    res.status(500).json({
      error: "Failed to evaluate answer",
      correctAnswer: "Error fetching answer.",
    });
  }
});

/* =========================================================
   START SERVER
========================================================= */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);