const express = require('express');
const { VertexAI } = require('@google-cloud/aiplatform');
const app = express();
app.use(express.json());

const project = 'mywebsitebot-dkju';
const location = 'us-central1';
const model = 'gemini-1.0-pro-001';

const vertexAI = new VertexAI({ project, location });
const generativeModel = vertexAI.getGenerativeModel({ model });

app.post('/webhook', async (req, res) => {
  try {
    const userMessage = req.body.message;
    if (!userMessage) return res.status(400).send({ error: 'Missing message' });

    const result = await generativeModel.generateContent({
      contents: [{ role: 'user', parts: [{ text: userMessage }] }]
    });

    const textResponse = result.response.candidates?.[0]?.content?.parts?.[0]?.text || 'No response';
    res.json({ response: textResponse });

  } catch (err) {
    console.error('Error:', err.message);
    res.status(500).send({ error: 'Something went wrong' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Zoni webhook listening on port ${PORT}`));
