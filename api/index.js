const express = require('express');
const cors = require('cors');
const db = require('../server/database');

// Import routes
const campagneRoutes = require('../server/routes/campagne');
const personaggiRoutes = require('../server/routes/personaggi');
const aggiornamentiRoutes = require('../server/routes/aggiornamenti');
const usersRoutes = require('../server/routes/users');

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Routes
app.use('/api/campagne', campagneRoutes);
app.use('/api/personaggi', personaggiRoutes);
app.use('/api/aggiornamenti', aggiornamentiRoutes);
app.use('/api/users', usersRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: '⚔️ Server D&D Tracker attivo!' });
});

module.exports = app;
