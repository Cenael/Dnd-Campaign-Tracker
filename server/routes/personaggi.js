const express = require('express');
const router = express.Router();
const db = require('../database');

// GET - Ottieni tutti i personaggi
router.get('/', (req, res) => {
  const { campagnaId } = req.query;
  
  let query = 'SELECT * FROM personaggi';
  let params = [];
  
  if (campagnaId) {
    query += ' WHERE campagnaId = ?';
    params = [campagnaId];
  }
  
  db.all(query, params, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// POST - Crea nuovo personaggio
router.post('/', (req, res) => {
  const { nome, classe, razza, livello, campagnaId, userId } = req.body;
  
  db.run(
    'INSERT INTO personaggi (nome, classe, razza, livello, campagnaId, userId) VALUES (?, ?, ?, ?, ?, ?)',
    [nome, classe, razza, livello, campagnaId, userId],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ 
        id: this.lastID, 
        nome, 
        classe, 
        razza, 
        livello, 
        campagnaId,
        userId
      });
    }
  );
});

module.exports = router;
