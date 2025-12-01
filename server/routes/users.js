const express = require('express');
const router = express.Router();
const db = require('../database');

// GET - Ottieni tutti gli utenti
router.get('/', (req, res) => {
  db.all('SELECT * FROM users', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// GET - Verifica se nome utente esiste
router.get('/check/:nome', (req, res) => {
  const { nome } = req.params;
  db.get('SELECT id FROM users WHERE nome = ?', [nome], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ exists: !!row });
  });
});

// POST - Login/Registrazione utente
router.post('/login', (req, res) => {
  const { nome, ruolo } = req.body;

  if (!nome || !ruolo) {
    res.status(400).json({ error: 'Nome e ruolo sono obbligatori' });
    return;
  }

  // Verifica se l'utente esiste già
  db.get('SELECT * FROM users WHERE nome = ?', [nome], (err, existingUser) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    if (existingUser) {
      // Utente già registrato - verifica ruolo
      if (existingUser.ruolo !== ruolo) {
        res.status(409).json({ 
          error: 'Utente già esistente con ruolo diverso',
          existingRole: existingUser.ruolo 
        });
        return;
      }
      // Login con utente esistente
      res.json(existingUser);
    } else {
      // Registra nuovo utente
      db.run(
        'INSERT INTO users (nome, ruolo) VALUES (?, ?)',
        [nome, ruolo],
        function(err) {
          if (err) {
            res.status(500).json({ error: err.message });
            return;
          }
          const newUser = {
            id: this.lastID,
            nome,
            ruolo
          };
          res.status(201).json(newUser);
        }
      );
    }
  });
});

// GET - Ottieni utente per ID
router.get('/:id', (req, res) => {
  const { id } = req.params;
  db.get('SELECT * FROM users WHERE id = ?', [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ error: 'Utente non trovato' });
      return;
    }
    res.json(row);
  });
});

module.exports = router;
