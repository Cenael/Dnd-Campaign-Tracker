const express = require('express');
const router = express.Router();
const db = require('../database');

// GET - Ottieni tutte le campagne
router.get('/', (req, res) => {
  db.all('SELECT * FROM campagne', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    // Converti la stringa JSON di giocatori in array
    const campagne = rows.map(row => ({
      ...row,
      giocatori: JSON.parse(row.giocatori || '[]')
    }));
    res.json(campagne);
  });
});

// GET - Ottieni campagna per ID
router.get('/:id', (req, res) => {
  const { id } = req.params;
  db.get('SELECT * FROM campagne WHERE id = ?', [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ error: 'Campagna non trovata' });
      return;
    }
    const campagna = {
      ...row,
      giocatori: JSON.parse(row.giocatori || '[]')
    };
    res.json(campagna);
  });
});

// POST - Crea nuova campagna
router.post('/', (req, res) => {
  const { nome, descrizione, gmId } = req.body;
  const giocatori = JSON.stringify([]);
  
  db.run(
    'INSERT INTO campagne (nome, descrizione, gmId, giocatori) VALUES (?, ?, ?, ?)',
    [nome, descrizione, gmId, giocatori],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ 
        id: this.lastID, 
        nome, 
        descrizione, 
        gmId,
        giocatori: []
      });
    }
  );
});

// POST - Giocatore si unisce alla campagna
router.post('/:id/join', (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;

  db.get('SELECT giocatori FROM campagne WHERE id = ?', [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ error: 'Campagna non trovata' });
      return;
    }

    const giocatori = JSON.parse(row.giocatori || '[]');
    if (!giocatori.includes(userId)) {
      giocatori.push(userId);
    }

    db.run(
      'UPDATE campagne SET giocatori = ? WHERE id = ?',
      [JSON.stringify(giocatori), id],
      (err) => {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        res.json({ success: true, giocatori });
      }
    );
  });
});

// POST - Giocatore lascia la campagna
router.post('/:id/leave', (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;

  db.get('SELECT giocatori FROM campagne WHERE id = ?', [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ error: 'Campagna non trovata' });
      return;
    }

    const giocatori = JSON.parse(row.giocatori || '[]');
    const nuoviGiocatori = giocatori.filter(id => id !== userId);

    db.run(
      'UPDATE campagne SET giocatori = ? WHERE id = ?',
      [JSON.stringify(nuoviGiocatori), id],
      (err) => {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        res.json({ success: true, giocatori: nuoviGiocatori });
      }
    );
  });
});

module.exports = router;
