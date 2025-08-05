// src/index.ts
import express from 'express';
import paramOptions from './routes/paramOptions'; // ✅ works fine


const app = express();
const PORT = 5000;

app.use('/api/param-options', paramOptions);

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
