const express = require('express');
const authRoutes = require('./routes/authRoutes');
const characterRoutes = require('./routes/characterRoutes');
const fileRoutes = require('./routes/fileRoutes');
const tradeRoutes = require('./routes/tradeRoutes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// Body parsers for JSON interactions
app.use(express.json());

// Mount API Modular Endpoints
app.use('/api/auth', authRoutes);
app.use('/api/characters', characterRoutes);
app.use('/api', fileRoutes); // Handles mixed /pictures and context endpoints
app.use('/api/trades', tradeRoutes);

// Global Central Catch-All Fallback Error Layer (MUST be mounted last)
app.use(errorHandler);

const PORT = 4000;
app.listen(PORT, () => {
    console.log(`The server is up and listening on port ${PORT} :3`);
});