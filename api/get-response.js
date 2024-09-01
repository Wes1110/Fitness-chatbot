$apiContent = @"
const axios = require('axios');
require('dotenv').config();

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method not allowed' });
        return;
    }

    const userText = req.body.text;

    if (!userText) {
        res.status(400).json({ error: 'No text provided' });
        return;
    }

    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

    try {
        const response = await axios.post('https://api.openai.com/v1/completions', {
            model: 'text-davinci-003',
            prompt: userText,
            max_tokens: 50
        }, {
            headers: {
                'Authorization': `Bearer ${OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        const botResponse = response.data.choices[0].text.trim();
        res.status(200).json({ response: botResponse });
    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Failed to get response from OpenAI API' });
    }
};
"@

Set-Content -Path .\api\get-response.js -Value $apiContent
