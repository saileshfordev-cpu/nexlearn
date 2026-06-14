const express = require('express');
const router = express.Router();

router.post('/generate', async (req, res) => {
  try {
    const { subject, topic, difficulty } = req.body;

    const prompt = `Generate 5 multiple choice questions for a student.
Subject: ${subject}
Topic: ${topic}
Difficulty: ${difficulty}

Return ONLY a JSON array, no other text, in this exact format:
[
  {
    "question": "question text here",
    "options": ["option A", "option B", "option C", "option D"],
    "correctAnswer": "option A",
    "explanation": "short explanation why this is correct"
  }
]`;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'user', content: prompt }
        ]
      })
    });

    const data = await response.json();
    console.log('Groq API response:', JSON.stringify(data, null, 2));

    if (data.error) {
      return res.status(500).json({
        message: 'Groq API error ❌',
        error: data.error.message
      });
    }

    let aiText = data.choices[0].message.content;
    aiText = aiText.replace(/```json/g, '').replace(/```/g, '').trim();

    const questions = JSON.parse(aiText);

    res.json({
      message: 'Questions generated successfully! ✅',
      questions: questions
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Failed to generate questions ❌',
      error: error.message
    });
  }
});

module.exports = router;