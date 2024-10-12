// backend/server.js

const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Endpoint to handle GPT-4 requests
app.post('/api/chat', async (req, res) => {
    const userMessage = req.body.message;
    const conversationHistory = req.body.history || [];

    try {
        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: 'gpt-4',
                messages: [
                    { role: 'system', content: 'You are a helpful virtual assistant named AADAM.' },
                    ...conversationHistory,
                    { role: 'user', content: userMessage },
                ],
                max_tokens: 150,
                temperature: 0.7,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                },
            }
        );

        const assistantMessage = response.data.choices[0].message.content.trim();
        res.json({ reply: assistantMessage });
    } catch (error) {
        console.error('Error communicating with OpenAI:', error.response ? error.response.data : error.message);
        res.status(500).json({ reply: "I'm sorry, I couldn't process that request." });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
