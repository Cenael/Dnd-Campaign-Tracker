const express = require('express');
const cors = require('cors');
const db = require('./database');

// Import routes
const campagneRoutes = require('./routes/campagne');
const personaggiRoutes = require('./routes/personaggi');
const aggiornamentiRoutes = require('./routes/aggiornamenti');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors()); // Permette richieste da Angular (localhost:4200)
app.use(express.json()); // Parse JSON body

// Routes
app.use('/api/campagne', campagneRoutes);
app.use('/api/personaggi', personaggiRoutes);
app.use('/api/aggiornamenti', aggiornamentiRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: '⚔️ Server D&D Tracker attivo!' });
});

// Avvio server
app.listen(PORT, () => {
  console.log(`🚀 Server Express in ascolto su http://localhost:${PORT}`);
  console.log(`📡 API disponibili su http://localhost:${PORT}/api`);
  console.log(`\n📋 Endpoints:`);
  console.log(`   GET    /api/campagne`);
  console.log(`   POST   /api/campagne`);
  console.log(`   GET    /api/campagne/:id`);
  console.log(`   POST   /api/campagne/:id/join`);
  console.log(`   POST   /api/campagne/:id/leave`);
  console.log(`   GET    /api/personaggi?campagnaId=X`);
  console.log(`   POST   /api/personaggi`);
  console.log(`   GET    /api/aggiornamenti?campagnaId=X`);
  console.log(`   POST   /api/aggiornamenti`);
});

// Gestione chiusura database
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error('Errore chiusura database:', err);
    } else {
      console.log('\n✅ Database chiuso correttamente');
    }
    process.exit(0);
  });
});
