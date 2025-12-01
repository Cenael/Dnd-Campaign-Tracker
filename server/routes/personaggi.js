const express = require('express');
const router = express.Router();
const db = require('../database');

// GET - Ottieni tutti i personaggi con parsing JSON
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
    
    // Parse JSON fields per ogni personaggio
    const personaggi = rows.map(p => ({
      ...p,
      abilityScores: p.abilityScores ? JSON.parse(p.abilityScores) : {},
      proficiencies: p.proficiencies ? JSON.parse(p.proficiencies) : {},
      linguaggi: p.linguaggi ? JSON.parse(p.linguaggi) : [],
      tratti: p.tratti ? JSON.parse(p.tratti) : [],
      equipaggiamento: p.equipaggiamento ? JSON.parse(p.equipaggiamento) : []
    }));
    
    res.json(personaggi);
  });
});

// POST - Crea nuovo personaggio con dati D&D 5e completi
router.post('/', (req, res) => {
  const { 
    nome, classe, razza, livello, campagnaId, userId,
    abilityScores, puntiFerita, puntiFeritaMax, classeArmatura,
    iniziativa, velocita, proficiencies, linguaggi, tratti,
    background, allineamento, esperienza, equipaggiamento, note, avatar
  } = req.body;
  
  db.run(
    `INSERT INTO personaggi (
      nome, classe, razza, livello, campagnaId, userId,
      abilityScores, puntiFerita, puntiFeritaMax, classeArmatura,
      iniziativa, velocita, proficiencies, linguaggi, tratti,
      background, allineamento, esperienza, equipaggiamento, note, avatar
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      nome, classe, razza, livello, campagnaId, userId,
      JSON.stringify(abilityScores || {}),
      puntiFerita || 0,
      puntiFeritaMax || 0,
      classeArmatura || 10,
      iniziativa || 0,
      velocita || 30,
      JSON.stringify(proficiencies || {}),
      JSON.stringify(linguaggi || []),
      JSON.stringify(tratti || []),
      background || '',
      allineamento || '',
      esperienza || 0,
      JSON.stringify(equipaggiamento || []),
      note || '',
      avatar || null
    ],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ 
        id: this.lastID,
        nome, classe, razza, livello, campagnaId, userId,
        abilityScores, puntiFerita, puntiFeritaMax, classeArmatura,
        iniziativa, velocita, proficiencies, linguaggi, tratti,
        background, allineamento, esperienza, equipaggiamento, note, avatar
      });
    }
  );
});

module.exports = router;
