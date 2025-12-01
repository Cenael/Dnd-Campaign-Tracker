const express = require('express');
const router = express.Router();
const db = require('../database');

router.get('/', (req, res) => {
  const { campagnaId } = req.query;

  let query = 'SELECT * FROM aggiornamenti';
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

router.post('/', (req, res) => {
  const { testo, campagnaId } = req.body;

  db.run(
    'INSERT INTO aggiornamenti (testo, campagnaId) VALUES (?, ?)',
    [testo, campagnaId],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({
        id: this.lastID,
        testo,
        campagnaId,
      });
    }
  );
});

module.exports = router;
