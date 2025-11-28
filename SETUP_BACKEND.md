# 🎯 Setup Completato - D&D Tracker con Backend

## ✅ Cosa è stato implementato

### Backend Node.js + Express + SQLite
- ✅ Server Express su porta 3000
- ✅ Database SQLite con 3 tabelle (campagne, personaggi, aggiornamenti)
- ✅ API REST complete per tutte le operazioni CRUD
- ✅ CORS abilitato per comunicazione con Angular
- ✅ Dati iniziali di esempio

### Frontend Angular (Aggiornato)
- ✅ HttpClient configurato in `app.config.ts`
- ✅ Tutti i servizi aggiornati per usare HTTP invece di LocalStorage
- ✅ Gestione asincrona con Observables
- ✅ Error handling su tutte le chiamate API

### File Creati/Modificati

#### Backend (Nuovi)
```
server/
├── index.js           # Entry point server Express
├── database.js        # Configurazione SQLite
├── routes/
│   ├── campagne.js    # API Campagne
│   ├── personaggi.js  # API Personaggi
│   └── aggiornamenti.js # API Aggiornamenti
├── README.md          # Documentazione backend
└── test-api.js        # Script test API
```

#### Frontend (Modificati)
```
src/app/
├── app.config.ts                      # +provideHttpClient()
└── services/
    ├── campagne.service.ts            # HttpClient invece di LocalStorage
    ├── personaggi.service.ts          # HttpClient invece di LocalStorage
    └── aggiornamenti.service.ts       # HttpClient invece di LocalStorage
```

#### Configurazione (Modificati)
```
├── package.json          # +express, cors, sqlite3, concurrently
├── .gitignore           # +server/*.db
└── README.md            # Documentazione aggiornata
```

## 🚀 Come Usare

### 1. Avvio Rapido (Consigliato)
```bash
npm run dev
```
Questo comando avvia:
- Backend su `http://localhost:3000`
- Frontend su `http://localhost:4200`

### 2. Avvio Separato

#### Backend
```bash
npm run server
```

#### Frontend (in un altro terminale)
```bash
npm start
```

## 📡 Test API Backend

### Opzione 1: Browser Console
1. Apri `http://localhost:3000/api/health`
2. Dovresti vedere: `{"status":"OK","message":"⚔️ Server D&D Tracker attivo!"}`

### Opzione 2: Script di Test
```bash
node server/test-api.js
```
Poi nella console Node.js:
```javascript
runAllTests()
```

### Opzione 3: Postman/Insomnia
Importa questi endpoint:
- GET `http://localhost:3000/api/campagne`
- POST `http://localhost:3000/api/campagne`
- GET `http://localhost:3000/api/personaggi?campagnaId=1`

## 📊 Flusso Dati

```
User Action (Angular UI)
    ↓
Component Method
    ↓
Service HTTP Call (Observable)
    ↓
Express Route Handler
    ↓
SQLite Database Query
    ↓
JSON Response
    ↓
Component Update (Signal/Subscription)
    ↓
UI Re-render
```

## 🗄️ Database

Il database viene creato automaticamente al primo avvio in:
```
server/dnd-tracker.db
```

Per resettare i dati:
1. Ferma il server
2. Elimina `server/dnd-tracker.db`
3. Riavvia il server (ricreerà il DB con dati iniziali)

## 🔍 Verifica Installazione

1. **Backend**: Naviga a `http://localhost:3000/api/health`
   - Dovresti vedere: `{"status":"OK",...}`

2. **Frontend**: Naviga a `http://localhost:4200`
   - Fai login come GM o Giocatore
   - Verifica che le campagne vengano caricate dal database

3. **Console Browser (F12)**:
   - Controlla la tab Network
   - Dovresti vedere chiamate a `localhost:3000/api/*`

## ⚠️ Troubleshooting

### Porta 4200 già in uso
```bash
# Trova il processo
netstat -ano | findstr :4200

# Termina il processo (Windows)
taskkill /PID <numero_pid> /F

# Oppure usa una porta diversa
ng serve --port 4201
```

### Backend non risponde
- Verifica che il server sia avviato: `npm run server`
- Controlla i log nella console
- Verifica che la porta 3000 sia libera

### CORS Errors
- Assicurati che il backend sia in esecuzione
- Verifica URL in servizi Angular: `http://localhost:3000/api`

## 🎉 Prossimi Passi

1. **Deploy**:
   - Backend su Railway/Render/Heroku
   - Frontend su Vercel/Netlify
   - Database su PostgreSQL cloud

2. **Sicurezza**:
   - Implementare JWT per autenticazione
   - Validazione input lato server
   - Rate limiting

3. **Features**:
   - WebSocket per real-time updates
   - File upload per immagini personaggi
   - Sistema di notifiche

## 📚 Documentazione

- Backend API: `server/README.md`
- Test API: `server/test-api.js`
- Progetto completo: `README.md`

---

**🎲 Tutto pronto! Buone avventure!**
