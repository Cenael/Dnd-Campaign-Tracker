const express = require('express');
const router = express.Router();
const db = require('../database');

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

    const personaggi = rows.map((p) => ({
      ...p,
      abilityScores: p.abilityScores ? JSON.parse(p.abilityScores) : {},
      proficiencies: p.proficiencies ? JSON.parse(p.proficiencies) : {},
      linguaggi: p.linguaggi ? JSON.parse(p.linguaggi) : [],
      tratti: p.tratti ? JSON.parse(p.tratti) : [],
      equipaggiamento: p.equipaggiamento ? JSON.parse(p.equipaggiamento) : [],
    }));

    res.json(personaggi);
  });
});

router.post('/', (req, res) => {
  const {
    nome,
    classe,
    razza,
    livello,
    campagnaId,
    userId,
    abilityScores,
    puntiFerita,
    puntiFeritaMax,
    classeArmatura,
    iniziativa,
    velocita,
    proficiencies,
    linguaggi,
    tratti,
    background,
    allineamento,
    esperienza,
    equipaggiamento,
    note,
    avatar,
  } = req.body;

  db.run(
    `INSERT INTO personaggi (
      nome, classe, razza, livello, campagnaId, userId,
      abilityScores, puntiFerita, puntiFeritaMax, classeArmatura,
      iniziativa, velocita, proficiencies, linguaggi, tratti,
      background, allineamento, esperienza, equipaggiamento, note, avatar
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      nome,
      classe,
      razza,
      livello,
      campagnaId,
      userId,
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
      avatar || null,
    ],
    function (err) {
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
        userId,
        abilityScores,
        puntiFerita,
        puntiFeritaMax,
        classeArmatura,
        iniziativa,
        velocita,
        proficiencies,
        linguaggi,
        tratti,
        background,
        allineamento,
        esperienza,
        equipaggiamento,
        note,
        avatar,
      });
    }
  );
});

router.put('/:id', (req, res) => {
  const { id } = req.params;
  const {
    nome,
    classe,
    razza,
    livello,
    abilityScores,
    puntiFerita,
    puntiFeritaMax,
    classeArmatura,
    iniziativa,
    velocita,
    proficiencies,
    linguaggi,
    tratti,
    background,
    allineamento,
    esperienza,
    equipaggiamento,
    note,
    avatar,
  } = req.body;

  db.run(
    `UPDATE personaggi SET
      nome = ?, classe = ?, razza = ?, livello = ?,
      abilityScores = ?, puntiFerita = ?, puntiFeritaMax = ?, classeArmatura = ?,
      iniziativa = ?, velocita = ?, proficiencies = ?, linguaggi = ?, tratti = ?,
      background = ?, allineamento = ?, esperienza = ?, equipaggiamento = ?, note = ?, avatar = ?
    WHERE id = ?`,
    [
      nome,
      classe,
      razza,
      livello,
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
      avatar || null,
      id,
    ],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (this.changes === 0) {
        res.status(404).json({ error: 'Personaggio non trovato' });
        return;
      }
      res.json({
        id,
        nome,
        classe,
        razza,
        livello,
        abilityScores,
        puntiFerita,
        puntiFeritaMax,
        classeArmatura,
        iniziativa,
        velocita,
        proficiencies,
        linguaggi,
        tratti,
        background,
        allineamento,
        esperienza,
        equipaggiamento,
        note,
        avatar,
      });
    }
  );
});

router.get('/:id', (req, res) => {
  const { id } = req.params;

  db.get('SELECT * FROM personaggi WHERE id = ?', [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ error: 'Personaggio non trovato' });
      return;
    }

    const personaggio = {
      ...row,
      abilityScores: row.abilityScores ? JSON.parse(row.abilityScores) : {},
      proficiencies: row.proficiencies ? JSON.parse(row.proficiencies) : {},
      linguaggi: row.linguaggi ? JSON.parse(row.linguaggi) : [],
      tratti: row.tratti ? JSON.parse(row.tratti) : [],
      equipaggiamento: row.equipaggiamento ? JSON.parse(row.equipaggiamento) : [],
    };

    res.json(personaggio);
  });
});

router.delete('/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM personaggi WHERE id = ?', [id], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ error: 'Personaggio non trovato' });
      return;
    }
    res.json({ message: 'Personaggio eliminato con successo' });
  });
});
module.exports = router;
