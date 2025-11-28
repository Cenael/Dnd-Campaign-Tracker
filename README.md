# 🐉 D&D Tracker Lite

Applicazione full-stack per la gestione di campagne di Dungeons & Dragons con **Angular 19** (frontend) e **Node.js + Express + SQLite** (backend).

## 📋 Descrizione

Sistema completo che permette a Game Master e giocatori di:
- 🎲 **Gestire campagne** con adesione dinamica dei giocatori
- 👥 **Creare personaggi** con statistiche D&D (classe, razza, livello)
- 📜 **Tracciare aggiornamenti** delle sessioni di gioco
- 🔐 **Sistema ruoli** differenziato (GM vs Giocatore)
- 💾 **Persistenza dati** con database SQLite

## 🎯 Obiettivi

1. Centralizzare la gestione delle campagne D&D
2. Interfaccia moderna con tema fantasy scuro
3. Architettura client-server scalabile
4. Separazione permessi per ruolo utente

## 🚀 Tecnologie Utilizzate

### Frontend
- **Angular 19** - Framework principale con standalone components
- **TypeScript** - Linguaggio di programmazione type-safe
- **RxJS** - Gestione reattiva dello stato con Observables
- **Angular Signals** - Sistema reattivo nativo per lo stato locale
- **HttpClient** - Comunicazione con API REST

### Backend
- **Node.js** - Runtime JavaScript server-side
- **Express** - Framework web minimalista
- **SQLite3** - Database embedded relazionale
- **CORS** - Middleware per cross-origin requests

### Styling
- **SCSS** - Pre-processore CSS per stili modulari
- **CSS Grid & Flexbox** - Layout responsive
- **Custom Design System** - Palette colori fantasy (oro #c9a961, nero #0f0e17)

### Routing & Navigation
- **Angular Router** - Navigazione client-side
- **Route Guards** - Possibilità di protezione delle route (preparato per implementazioni future)

## 🏗️ Architettura del Progetto

### Struttura delle Cartelle

```
project-root/
├── src/app/            # Frontend Angular
│   ├── features/       # Moduli funzionali
│   │   ├── campagna/   # Gestione campagne (list, form, detail)
│   │   ├── personaggio/# Gestione personaggi (list, form)
│   │   ├── aggiornamento/# Gestione aggiornamenti (list, form)
│   │   └── login/      # Autenticazione
│   ├── models/         # Interfacce TypeScript
│   ├── services/       # Servizi per comunicazione API
│   └── shared/         # Componenti condivisi (navbar)
└── server/             # Backend Node.js
    ├── routes/         # Route API Express
    │   ├── campagne.js
    │   ├── personaggi.js
    │   └── aggiornamenti.js
    ├── database.js     # Configurazione SQLite
    └── index.js        # Entry point server
```

### Pattern Architetturali

1. **Standalone Components**
   - Ogni componente è completamente autonomo
   - Import espliciti delle dipendenze
   - Migliore tree-shaking e performance

2. **Client-Server Architecture**
   - Frontend Angular comunica con backend via HTTP
   - API RESTful per tutte le operazioni CRUD
   - Database SQLite per persistenza dati
   - CORS abilitato per sviluppo locale

3. **Reactive State Management**
   - HttpClient per chiamate asincrone
   - Observables per gestione streaming dati
   - Signals per stato locale dei componenti
   - BehaviorSubject per cache locale (campagne)

4. **Service Layer**
   - Separazione logica tra UI e business logic
   - Servizi singleton con `providedIn: 'root'`
   - Metodi HTTP per ogni operazione CRUD

## 🎨 Funzionalità Principali

### 1. Autenticazione & Ruoli
- Login con nome e selezione ruolo (GM/Giocatore)
- Stato utente persistito con LocalStorage
- Permessi differenziati per funzionalità

**Permessi per Ruolo**:
| Funzionalità | GM | Giocatore |
|--------------|:--:|:---------:| 
| Creare campagne | ✅ | ❌ |
| Unirsi/lasciare campagne | ❌ | ✅ |
| Creare personaggi | ✅ | ✅* |
| Creare aggiornamenti | ✅ | ❌ |

*_I giocatori possono creare personaggi solo nelle campagne a cui partecipano_

### 2. Gestione Campagne
- **Lista**: Visualizzazione card-based con contatore giocatori
- **Dettaglio**: Info complete, sistema join/leave, navigazione rapida
- **Form**: Creazione con validazione, associazione automatica GM
- **API**: `/api/campagne` - CRUD + join/leave endpoints

### 3. Gestione Personaggi
- **Lista**: Filtrata per campagna, visualizzazione statistiche
- **Form**: Validazione completa (classe, razza, livello ≥1)
- **Permessi**: GM crea sempre, Giocatore solo se iscritto
- **API**: `/api/personaggi?campagnaId=X` - CRUD con filtro

### 4. Sistema Aggiornamenti
- Diario cronologico delle sessioni
- Creazione riservata al GM
- Textarea espansa per descrizioni lunghe
- **API**: `/api/aggiornamenti?campagnaId=X` - CRUD con filtro

### 5. UI/UX
- **Navbar**: Fixed, back button contestuale, badge ruolo, logout
- **Design System**: Tema fantasy scuro (oro #c9a961, nero #0f0e17)
- **Animazioni**: Hover effects, transizioni smooth
- **Responsive**: Layout Grid/Flexbox adattivo

## 🗺️ Architettura Backend

### Database SQLite
```sql
-- Tabelle
campagne: id, nome, descrizione, gmId, giocatori (JSON array)
personaggi: id, nome, classe, razza, livello, campagnaId, userId
aggiornamenti: id, testo, campagnaId
```

### API REST Endpoints
```
GET    /api/campagne              # Lista tutte
POST   /api/campagne              # Crea nuova
GET    /api/campagne/:id          # Dettagli
POST   /api/campagne/:id/join     # Giocatore si unisce
POST   /api/campagne/:id/leave    # Giocatore lascia

GET    /api/personaggi?campagnaId=X  # Filtra per campagna
POST   /api/personaggi               # Crea nuovo

GET    /api/aggiornamenti?campagnaId=X  # Filtra per campagna
POST   /api/aggiornamenti               # Crea nuovo
```

### Stack Tecnico Backend
- **Express**: Server HTTP con middleware CORS
- **SQLite3**: Database embedded (file `server/dnd-tracker.db`)
- **Dati iniziali**: Campagne e personaggi d'esempio al primo avvio

## 📦 Gestione dello Stato

### Frontend (Angular)
```typescript
// Service con HttpClient
getCampagne(): Observable<Campagna[]> {
  return this.http.get<Campagna[]>(`${API_URL}/campagne`);
}

// Component con Signal
campagne = signal<Campagna[]>([]);
loadCampagne() {
  this.service.getCampagne().subscribe(data => 
    this.campagne.set(data)
  );
}
```

### Backend (Express + SQLite)
```javascript
// Route Handler
router.get('/campagne', (req, res) => {
  db.all('SELECT * FROM campagne', [], (err, rows) => {
    res.json(rows.map(r => ({...r, giocatori: JSON.parse(r.giocatori)})));
  });
});
```

## 🚀 Come Iniziare

### Prerequisiti
- Node.js 18+
- npm 9+
- Angular CLI 19+

### Installazione

```bash
# Clona il repository
git clone [url-repo]

# Installa dipendenze
cd dnd-tracker-lite
npm install
```

### Avvio Applicazione

#### Modalità Development (Backend + Frontend)
```bash
npm run dev
```
Questo comando avvia automaticamente:
- **Backend Express** su `http://localhost:3000`
- **Frontend Angular** su `http://localhost:4200`

#### Solo Backend
```bash
npm run server
```

#### Solo Frontend
```bash
npm start
```
**Nota**: Assicurati che il backend sia in esecuzione prima di usare il frontend!

### Build Produzione

```bash
ng build --configuration production
```

I file compilati saranno disponibili nella cartella `dist/`.

## 🔄 Flusso Dati Client-Server

```
User Action (UI Angular)
    ↓
Component Method chiamata
    ↓
Service HTTP Request (Observable)
    ↓
Express Route Handler
    ↓
SQLite Query (database.js)
    ↓
JSON Response
    ↓
Observable emette dati
    ↓
Component Signal aggiornato
    ↓
UI Re-render automatico
```

**Esempio Creazione Campagna**:
1. User compila form → `CampagnaFormComponent.onSubmit()`
2. `CampagneService.addCampagna()` → `POST /api/campagne`
3. Express → `INSERT INTO campagne...`
4. Response `{id: 3, nome: "...", ...}`
5. Observable completa → `router.navigate(['/'])`
6. Lista campagne ricaricata automaticamente

## 🧪 Testing

### Test API Backend
```bash
# Metodo 1: cURL
curl http://localhost:3000/api/health

# Metodo 2: Script Node.js
node server/test-api.js
# poi: runAllTests()

# Metodo 3: Browser
# Naviga a http://localhost:3000/api/campagne
```

### Verifica Funzionamento
1. **Backend**: `http://localhost:3000/api/health` → `{"status":"OK"}`
2. **Frontend**: `http://localhost:4200` → Visualizza campagne
3. **Console Browser (F12)**: Tab Network → Verifica chiamate API

## 📁 Struttura File Database

```
server/dnd-tracker.db    # Database SQLite (creato auto)
.gitignore               # Esclude *.db dal versioning
```

**Reset Database**: Elimina `dnd-tracker.db` e riavvia il server

## 🔮 Roadmap

✅ **Completato**:
- Architettura full-stack con persistenza
- Sistema ruoli GM/Giocatore  
- Join/leave campagne dinamico
- Design system fantasy completo

## 📚 Documentazione Aggiuntiva

- **Backend API**: `server/README.md`
- **Setup Completo**: `SETUP_BACKEND.md`
- **Test API**: `server/test-api.js`

## 📄 Licenza

MIT License

---

**🐉 Buone avventure! 🎲✨**
