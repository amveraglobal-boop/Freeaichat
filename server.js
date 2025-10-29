import express from 'express';
const fetch = require('node-fetch');

const dotenv = require('dotenv');
const path = require('path');
const cors = require('cors');
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
if (!OPENROUTER_API_KEY) {
  console.warn('Warning: OPENROUTER_API_KEY not set in environment. Set it before running.');
}

app.post('/api/chat', async (req, res) => {
  const { model, prompt } = req.body;
  if (!model || !prompt) return res.status(400).json({ error: 'model and prompt are required' });
  try {
    const resp = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`
      },
      body: JSON.stringify({
        model,
        messages: [{ role: 'user', content: prompt }],
        // you can customize other params here
        max_tokens: 1000
      })
    });

    if (!resp.ok) {
      const errText = await resp.text();
      return res.status(502).json({ error: 'OpenRouter error', details: errText });
    }

    const data = await resp.json();
    // OpenAI-style response: choices[0].message.content
    const content = data?.choices?.[0]?.message?.content ?? data;
    res.json({ model, content });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'internal_error', details: String(err) });
  }
});

// Fallback to index.html for SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
