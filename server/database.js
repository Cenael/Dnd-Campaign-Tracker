const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Crea/apre il database SQLite
const dbPath = path.join(__dirname, 'dnd-tracker.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Errore apertura database:', err);
  } else {
    console.log('✅ Database SQLite connesso');
  }
});

// Inizializza le tabelle
db.serialize(() => {
  // Tabella Campagne
  db.run(`
    CREATE TABLE IF NOT EXISTS campagne (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      descrizione TEXT NOT NULL,
      gmId INTEGER NOT NULL,
      giocatori TEXT DEFAULT '[]'
    )
  `);

  // Tabella Personaggi
  db.run(`
    CREATE TABLE IF NOT EXISTS personaggi (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      classe TEXT NOT NULL,
      razza TEXT NOT NULL,
      livello INTEGER NOT NULL,
      campagnaId INTEGER NOT NULL,
      userId INTEGER NOT NULL,
      abilityScores TEXT DEFAULT '{}',
      puntiFerita INTEGER DEFAULT 0,
      puntiFeritaMax INTEGER DEFAULT 0,
      classeArmatura INTEGER DEFAULT 10,
      iniziativa INTEGER DEFAULT 0,
      velocita INTEGER DEFAULT 30,
      proficiencies TEXT DEFAULT '{}',
      linguaggi TEXT DEFAULT '[]',
      tratti TEXT DEFAULT '[]',
      background TEXT,
      allineamento TEXT,
      esperienza INTEGER DEFAULT 0,
      equipaggiamento TEXT DEFAULT '[]',
      note TEXT,
      avatar TEXT,
      FOREIGN KEY (campagnaId) REFERENCES campagne(id)
    )
  `);

  // Tabella Aggiornamenti
  db.run(`
    CREATE TABLE IF NOT EXISTS aggiornamenti (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      testo TEXT NOT NULL,
      campagnaId INTEGER NOT NULL,
      FOREIGN KEY (campagnaId) REFERENCES campagne(id)
    )
  `);

  // Tabella Users
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL UNIQUE,
      ruolo TEXT NOT NULL CHECK(ruolo IN ('GM', 'Giocatore'))
    )
  `);

  // Aggiungi colonna avatar se non esiste (migrazione)
  db.run(`
    ALTER TABLE personaggi ADD COLUMN avatar TEXT
  `, (err) => {
    if (err && !err.message.includes('duplicate column name')) {
      console.error('Errore aggiunta colonna avatar:', err);
    } else if (!err) {
      console.log('✅ Colonna avatar aggiunta alla tabella personaggi');
    }
  });

  // Dati iniziali di esempio
  db.get('SELECT COUNT(*) as count FROM campagne', [], (err, row) => {
    if (!err && row.count === 0) {
      console.log('📝 Inserimento dati iniziali...');
      
      // Inserisci utente di esempio
      db.run(`INSERT INTO users (nome, ruolo) VALUES 
        ('Admin', 'GM'),
        ('Giocatore1', 'Giocatore')`, (err) => {
        if (err) {
          console.error('Errore inserimento users:', err);
          return;
        }
        
        // Poi inserisci campagne con gmId valido
        db.run(`INSERT INTO campagne (nome, descrizione, gmId, giocatori) VALUES 
          ('La Maledizione di Strahd', 'Campagna horror gotica', 1, '[]'),
          ('L''avventura degli Eroi Perduti', 'Campagna epica fantasy', 1, '[]')`);

        db.run(`INSERT INTO personaggi (nome, classe, razza, livello, campagnaId, userId) VALUES 
          ('Aragorn', 'Guerriero', 'Umano', 5, 1, 1),
          ('Gandalf', 'Mago', 'Umano', 10, 1, 1)`);

        db.run(`INSERT INTO aggiornamenti (testo, campagnaId) VALUES 
          ('Il party entra nel castello di Strahd.', 1),
          ('Il drago rosso viene sconfitto.', 2)`);
      });
    }
  });
});

module.exports = db;
