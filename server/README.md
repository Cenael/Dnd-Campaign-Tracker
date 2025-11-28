# 🎲 D&D Tracker - Backend API

Backend Node.js + Express + SQLite per l'applicazione D&D Tracker.

## 📐 Architettura

```
┌─────────────────────────────────────────────────┐
│        Frontend Angular (localhost:4200)        │
│  - Componenti UI                                │
│  - HttpClient per API calls                     │
│  - Gestione stato con Signals & Observables     │
└────────────────┬────────────────────────────────┘
                 │ HTTP Requests
                 │ (GET, POST)
                 ↓
┌─────────────────────────────────────────────────┐
│       Backend Express (localhost:3000)          │
│  - CORS Middleware                              │
│  - Route Handlers                               │
│  - Business Logic                               │
└────────────────┬────────────────────────────────┘
                 │ SQL Queries
                 ↓
┌─────────────────────────────────────────────────┐
│         Database SQLite                         │
│  - dnd-tracker.db                               │
│  - Tabelle: campagne, personaggi, aggiornamenti │
└─────────────────────────────────────────────────┘
```

## 🚀 Avvio

### Modalità Development (Backend + Frontend insieme)
```bash
npm run dev
```

Questo comando avvia:
- **Backend Express** su `http://localhost:3000`
- **Frontend Angular** su `http://localhost:4200`

### Solo Backend
```bash
npm run server
```

### Solo Frontend
```bash
npm start
```

## 📡 API Endpoints

### Campagne
- `GET /api/campagne` - Ottieni tutte le campagne
- `GET /api/campagne/:id` - Ottieni campagna per ID
- `POST /api/campagne` - Crea nuova campagna
  ```json
  {
    "nome": "Nome Campagna",
    "descrizione": "Descrizione",
    "gmId": 1
  }
  ```
- `POST /api/campagne/:id/join` - Giocatore si unisce
  ```json
  { "userId": 2 }
  ```
- `POST /api/campagne/:id/leave` - Giocatore lascia
  ```json
  { "userId": 2 }
  ```

### Personaggi
- `GET /api/personaggi?campagnaId=X` - Ottieni personaggi (opzionale filtro per campagna)
- `POST /api/personaggi` - Crea nuovo personaggio
  ```json
  {
    "nome": "Aragorn",
    "classe": "Guerriero",
    "razza": "Umano",
    "livello": 5,
    "campagnaId": 1,
    "userId": 2
  }
  ```

### Aggiornamenti
- `GET /api/aggiornamenti?campagnaId=X` - Ottieni aggiornamenti (opzionale filtro per campagna)
- `POST /api/aggiornamenti` - Crea nuovo aggiornamento
  ```json
  {
    "testo": "Il party ha sconfitto il drago!",
    "campagnaId": 1
  }
  ```

### Health Check
- `GET /api/health` - Verifica stato server

## 🗄️ Database

Il database SQLite viene creato automaticamente in `server/dnd-tracker.db`.

### Struttura Tabelle

**campagne**
- `id` (INTEGER PRIMARY KEY)
- `nome` (TEXT)
- `descrizione` (TEXT)
- `gmId` (INTEGER)
- `giocatori` (TEXT - JSON array)

**personaggi**
- `id` (INTEGER PRIMARY KEY)
- `nome` (TEXT)
- `classe` (TEXT)
- `razza` (TEXT)
- `livello` (INTEGER)
- `campagnaId` (INTEGER)
- `userId` (INTEGER)

**aggiornamenti**
- `id` (INTEGER PRIMARY KEY)
- `testo` (TEXT)
- `campagnaId` (INTEGER)

## 🔧 Tecnologie

- **Express** - Framework web Node.js
- **SQLite3** - Database embedded
- **CORS** - Permette richieste da Angular (localhost:4200)
- **Concurrently** - Esegue backend e frontend simultaneamente

## 📝 Note

- I dati sono persistiti nel file `server/dnd-tracker.db`
- Il server ha dati iniziali di esempio al primo avvio
- CORS è configurato per accettare richieste da tutte le origini (in produzione limitare a dominio specifico)
