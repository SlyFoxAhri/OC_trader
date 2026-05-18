const express = require('express');
const authRoutes = require('./routes/authRoutes');
const characterRoutes = require('./routes/characterRoutes');
const fileRoutes = require('./routes/fileRoutes');
const tradeRoutes = require('./routes/tradeRoutes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/characters', characterRoutes);
app.use('/api', fileRoutes); 
app.use('/api/trades', tradeRoutes);

app.use(errorHandler);

const PORT = 4000;
app.listen(PORT, () => {
    console.log(`The server is up and listening on port ${PORT} :3`);
});