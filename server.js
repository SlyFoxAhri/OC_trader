// server.js
const express = require('express');
const authRoutes = require('./routes/authRoutes');
const characterRoutes = require('./routes/characterRoutes');

const app = express();
app.use(express.json());

// Mount the modular routes
app.use('/api/auth', authRoutes);
app.use('/api/characters', characterRoutes);

// Simple global fallback error logging for testing
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong internally! :/' });
});

const PORT = 4000;
app.listen(PORT, () => {
    console.log(`The server is up and listening on port ${PORT} :3`);
});