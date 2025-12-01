# 📚 Studio delle Tecnologie - D&D Campaign Tracker

## 🎯 Stack Tecnologico Completo

### Frontend
- **Angular 19** (ultimo framework)
- **TypeScript** (linguaggio tipizzato)
- **SCSS** (CSS avanzato con variabili e nesting)
- **RxJS** (gestione asincrona con Observables)
- **Angular Router** (navigazione SPA)
- **Angular Signals** (reattività moderna)

### Backend
- **Node.js** (runtime JavaScript lato server)
- **Express.js** (framework web minimalista)
- **SQLite3** (database embedded SQL)
- **CORS** (middleware per cross-origin requests)

### DevOps & Tools
- **npm/package.json** (gestione dipendenze)
- **Concurrently** (esecuzione parallela di script)
- **Angular CLI** (ng serve, ng build)
- **Git/GitHub** (version control)

---

## 🏗️ ARCHITETTURA ANGULAR

### 1. **Standalone Components** (Angular 19)
```typescript
@Component({
  selector: 'app-home',
  standalone: true,  // ← Non serve NgModule!
  imports: [RouterLink, CommonModule],  // Import diretti
  template: `...`,
  styleUrls: ['./home.component.scss']
})
```
**Cosa significa:**
- `standalone: true` → Il componente non ha bisogno di un modulo NgModule
- `imports: []` → Dichiara qui cosa usa (altri componenti, direttive, pipe)
- `selector` → Tag HTML per usarlo (`<app-home></app-home>`)
- `template` → HTML inline (o `templateUrl` per file esterno)
- `styleUrls` → Array di file CSS/SCSS

---

### 2. **Signals** (Reattività Moderna)
```typescript
import { signal, Signal } from '@angular/core';

// Signal scrivibile
campagne = signal<Campagna[]>([]);
campagne.set([...nuoveCoampagne]);  // Scrivi
campagne.update(old => [...old, nuova]);  // Aggiorna

// Signal read-only (computed)
user: Signal<User | null>;
this.user = this.userService.currentUser;
console.log(this.user());  // ← Leggi con ()
```
**Cosa significa:**
- `signal()` → Crea una variabile reattiva (l'UI si aggiorna automaticamente)
- `.set()` → Sostituisce il valore
- `.update()` → Modifica in base al valore precedente
- `Signal<T>` → Tipo read-only (solo lettura)
- `user()` → Chiamata come funzione per leggere il valore

---

### 3. **Dependency Injection (DI)**
```typescript
constructor(
  private userService: UserService,      // Iniettato da Angular
  private router: Router,                // Router di Angular
  private campagneService: CampagneService
) {
  this.user = this.userService.currentUser;
}
```
**Cosa significa:**
- Angular crea automaticamente le istanze dei servizi
- `private` → Crea una proprietà della classe
- I servizi sono **singleton** (una sola istanza condivisa)

---

### 4. **Servizi con HttpClient**
```typescript
@Injectable({
  providedIn: 'root'  // ← Singleton globale
})
export class CampagneService {
  private apiUrl = 'http://localhost:3000/api/campagne';
  private campagneSubject = new BehaviorSubject<Campagna[]>([]);
  
  campagne$ = this.campagneSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadCampagne();
  }

  getCampagne(): Observable<Campagna[]> {
    return this.http.get<Campagna[]>(this.apiUrl);
  }

  addCampagna(campagna: Campagna): Observable<Campagna> {
    return this.http.post<Campagna>(this.apiUrl, campagna);
  }
}
```
**Concetti chiave:**
- `@Injectable` → Marca la classe come iniettabile
- `providedIn: 'root'` → Disponibile in tutta l'app
- `HttpClient` → Fa richieste HTTP (GET, POST, PUT, DELETE)
- `Observable<T>` → Stream asincrono (RxJS)
- `BehaviorSubject` → Observable che tiene uno stato iniziale
- `.asObservable()` → Espone il Subject come Observable (read-only)

---

### 5. **RxJS Operators**
```typescript
this.campagneService.getCampagne().subscribe({
  next: (data) => console.log('Dati ricevuti:', data),
  error: (err) => console.error('Errore:', err),
  complete: () => console.log('Completato')
});

// Pipe con operatori
this.campagne$.pipe(
  map(campagne => campagne.filter(c => c.gmId === userId)),
  tap(campagne => console.log('Campagne filtrate:', campagne))
).subscribe(result => this.myCampagne.set(result));
```
**Operatori comuni:**
- `subscribe()` → Ascolta i valori emessi
- `map()` → Trasforma i dati
- `filter()` → Filtra i dati
- `tap()` → Effetti collaterali (log, debug)
- `switchMap()` → Cambia Observable (es. da ID a dettaglio)
- `catchError()` → Gestisce errori

---

### 6. **Router & Navigation**
```typescript
// app.routes.ts
export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'campagne', component: CampagneListComponent },
  { path: 'campagna/:id', component: CampagnaDetailComponent },
  { path: '**', redirectTo: '' }  // Fallback
];

// In component
constructor(private router: Router, private route: ActivatedRoute) {}

// Navigazione programmatica
this.router.navigate(['/campagne']);
this.router.navigate(['/campagna', campagnaId]);

// Leggere parametri URL
this.route.params.subscribe(params => {
  const id = params['id'];
});
```
**Concetti:**
- `Routes` → Array di configurazione percorsi
- `:id` → Parametro dinamico
- `**` → Wildcard (catch-all)
- `RouterLink` → Direttiva per link (`[routerLink]="['/path']"`)
- `ActivatedRoute` → Info sulla route corrente

---

### 7. **Template Syntax (Angular 19)**
```html
<!-- Property Binding -->
<img [src]="imageUrl" [alt]="description">

<!-- Event Binding -->
<button (click)="save()">Salva</button>

<!-- Two-way Binding -->
<input [(ngModel)]="nome">

<!-- Control Flow (Angular 17+) -->
@if (user()) {
  <p>Ciao {{ user()?.nome }}</p>
} @else {
  <p>Non loggato</p>
}

@for (item of items; track item.id) {
  <div>{{ item.name }}</div>
}

<!-- Interpolazione -->
<h1>{{ titolo }}</h1>

<!-- Class & Style Binding -->
<div [class.active]="isActive" [style.color]="textColor">

<!-- RouterLink -->
<a [routerLink]="['/campagna', campagna.id]">Dettagli</a>
```

---

### 8. **Lifecycle Hooks**
```typescript
export class MyComponent implements OnInit, OnDestroy {
  ngOnInit() {
    // Eseguito dopo la creazione del componente
    console.log('Componente inizializzato');
  }

  ngOnDestroy() {
    // Cleanup prima della distruzione
    this.subscription.unsubscribe();
  }
}
```
**Hook principali:**
- `ngOnInit()` → Inizializzazione (dopo constructor)
- `ngOnDestroy()` → Cleanup (unsubscribe, clear timers)
- `ngOnChanges()` → Quando cambiano gli @Input
- `ngAfterViewInit()` → Dopo rendering della view

---

### 9. **Forms (Template-driven)**
```typescript
import { FormsModule } from '@angular/forms';

// Template
<form #loginForm="ngForm" (ngSubmit)="onSubmit(loginForm)">
  <input 
    type="text" 
    name="nome" 
    [(ngModel)]="user.nome" 
    required 
    #nomeInput="ngModel">
  
  @if (nomeInput.invalid && nomeInput.touched) {
    <span class="error">Nome obbligatorio</span>
  }
  
  <button [disabled]="loginForm.invalid">Login</button>
</form>

// Component
onSubmit(form: NgForm) {
  if (form.valid) {
    console.log(form.value);
  }
}
```

---

### 10. **Platform Detection (SSR)**
```typescript
import { PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

constructor(@Inject(PLATFORM_ID) private platformId: Object) {
  if (isPlatformBrowser(this.platformId)) {
    // Codice solo nel browser (non nel server)
    localStorage.setItem('key', 'value');
  }
}
```
**Perché:** Server-Side Rendering non ha `localStorage`, `window`, `document`

---

## 🗄️ BACKEND NODE.JS + EXPRESS

### 1. **Server Setup (server/index.js)**
```javascript
const express = require('express');
const cors = require('cors');
const app = express();

// Middleware globali
app.use(cors());  // Abilita richieste cross-origin
app.use(express.json());  // Parser JSON automatico

// Routes
app.use('/api/campagne', require('./routes/campagne'));
app.use('/api/personaggi', require('./routes/personaggi'));

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
```
**Concetti:**
- `express()` → Crea app Express
- `app.use()` → Registra middleware/route
- `cors()` → Permette richieste da altri domini (Angular su 4200)
- `express.json()` → Converte body JSON in oggetto JS
- `app.listen()` → Avvia server HTTP

---

### 2. **Routes (server/routes/campagne.js)**
```javascript
const express = require('express');
const router = express.Router();
const db = require('../database');

// GET /api/campagne
router.get('/', (req, res) => {
  db.all('SELECT * FROM campagne', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    // Converti JSON string in array
    const campagne = rows.map(row => ({
      ...row,
      giocatori: JSON.parse(row.giocatori || '[]')
    }));
    
    res.json(campagne);
  });
});

// POST /api/campagne
router.post('/', (req, res) => {
  const { nome, descrizione, gmId } = req.body;
  
  db.run(
    'INSERT INTO campagne (nome, descrizione, gmId, giocatori) VALUES (?, ?, ?, ?)',
    [nome, descrizione, gmId, '[]'],
    function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ id: this.lastID, nome, descrizione, gmId, giocatori: [] });
    }
  );
});

module.exports = router;
```
**Concetti:**
- `Router()` → Mini-app per raggruppare route
- `router.get/post/put/delete()` → Definisce endpoint HTTP
- `req.body` → Dati inviati dal client (serve express.json())
- `req.params` → Parametri URL (es. `/campagne/:id` → `req.params.id`)
- `req.query` → Query string (es. `?search=abc` → `req.query.search`)
- `res.json()` → Risponde con JSON
- `res.status()` → Imposta status HTTP (200, 404, 500)

---

### 3. **Database SQLite (server/database.js)**
```javascript
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'dnd-tracker.db');
const db = new sqlite3.Database(dbPath);

// Crea tabelle se non esistono
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS campagne (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      descrizione TEXT,
      gmId INTEGER NOT NULL,
      giocatori TEXT DEFAULT '[]'
    )
  `);
});

module.exports = db;
```
**Concetti:**
- `sqlite3.Database()` → Connessione al file DB
- `db.serialize()` → Esegue query in sequenza
- `db.run()` → Query che modificano (INSERT, UPDATE, DELETE)
- `db.get()` → Prende una sola riga
- `db.all()` → Prende tutte le righe
- `INTEGER PRIMARY KEY AUTOINCREMENT` → ID auto-incrementale
- `TEXT DEFAULT '[]'` → Stringa JSON per array

---

### 4. **CORS (Cross-Origin Resource Sharing)**
```javascript
const cors = require('cors');

// Configurazione base (permetti tutto)
app.use(cors());

// Configurazione avanzata
app.use(cors({
  origin: 'http://localhost:4200',  // Solo Angular
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
```
**Perché serve:** Browser bloccano richieste tra domini diversi (Angular su 4200, Node su 3000)

---

### 5. **Middleware Pattern**
```javascript
// Middleware custom
const logRequest = (req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();  // ← Passa al prossimo middleware
};

app.use(logRequest);

// Middleware di route
app.get('/protected', checkAuth, (req, res) => {
  res.json({ message: 'Autenticato!' });
});

function checkAuth(req, res, next) {
  if (req.headers.authorization) {
    next();
  } else {
    res.status(401).json({ error: 'Non autorizzato' });
  }
}
```

---

## 📦 PACKAGE.JSON & NPM

### Dipendenze Frontend (Angular)
```json
{
  "dependencies": {
    "@angular/animations": "^19.0.0",      // Animazioni
    "@angular/common": "^19.0.0",          // Direttive comuni
    "@angular/compiler": "^19.0.0",        // Compila template
    "@angular/core": "^19.0.0",            // Core framework
    "@angular/forms": "^19.0.0",           // NgModel, FormControl
    "@angular/platform-browser": "^19.0.0", // Rendering browser
    "@angular/router": "^19.0.0",          // Navigazione
    "rxjs": "~7.8.0",                      // Observables
    "tslib": "^2.3.0",                     // Helper TypeScript
    "zone.js": "~0.14.2"                   // Change detection
  }
}
```

### Dipendenze Backend (Node.js)
```json
{
  "dependencies": {
    "cors": "^2.8.5",           // CORS middleware
    "express": "^4.18.2",       // Framework web
    "sqlite3": "^5.1.6"         // Database
  },
  "devDependencies": {
    "concurrently": "^8.2.0"    // Esegui frontend+backend insieme
  }
}
```

### Scripts NPM
```json
{
  "scripts": {
    "start": "ng serve",                    // Solo frontend
    "server": "node server/index.js",       // Solo backend
    "dev": "concurrently \"npm run server\" \"npm start\"",  // Entrambi
    "build": "ng build",                    // Build produzione
    "test": "ng test"                       // Unit test
  }
}
```
**Comandi:**
- `npm install` → Installa dipendenze
- `npm run dev` → Avvia frontend + backend
- `npm start` → Avvia solo Angular

---

## 🎨 SCSS (CSS Avanzato)

### Variabili
```scss
$gold: #c9a961;
$primary-bg: #0f0e17;

body {
  background: $primary-bg;
  color: $gold;
}
```

### Nesting
```scss
.navbar {
  background: #1a1a2e;
  
  .logo {
    color: $gold;
    
    &:hover {  // ← & = .navbar .logo
      color: lighten($gold, 10%);
    }
  }
}
```

### Funzioni
```scss
$gold: #c9a961;

.card {
  border: 1px solid rgba($gold, 0.3);  // Opacità
  background: lighten($gold, 20%);     // Schiarisce
  box-shadow: 0 2px 5px darken($gold, 10%);  // Scurisce
}
```

---

## 🗂️ STRUTTURA PROGETTO

```
dnd-tracker-lite/
├── src/
│   ├── app/
│   │   ├── features/              # Componenti funzionali
│   │   │   ├── home/
│   │   │   │   ├── home.component.ts
│   │   │   │   └── home.component.scss
│   │   │   ├── login/
│   │   │   ├── campagna/
│   │   │   │   ├── campagne-list.component.ts
│   │   │   │   ├── campagna-form.component.ts
│   │   │   │   └── campagna-detail.component.ts
│   │   │   ├── personaggio/
│   │   │   └── aggiornamento/
│   │   ├── shared/                # Componenti riutilizzabili
│   │   │   └── navbar/
│   │   ├── services/              # Logica business
│   │   │   ├── user.service.ts
│   │   │   ├── campagne.service.ts
│   │   │   ├── personaggi.service.ts
│   │   │   └── aggiornamenti.service.ts
│   │   ├── models/                # Interfacce TypeScript
│   │   │   ├── campagna.ts
│   │   │   ├── personaggio.ts
│   │   │   └── aggiornamento.ts
│   │   ├── app.routes.ts          # Configurazione routing
│   │   ├── app.config.ts          # Configurazione app
│   │   └── app.ts                 # Root component
│   ├── styles.scss                # Stili globali
│   ├── index.html                 # HTML principale
│   └── main.ts                    # Entry point
├── server/
│   ├── index.js                   # Server Express
│   ├── database.js                # Configurazione SQLite
│   ├── routes/
│   │   ├── campagne.js
│   │   ├── personaggi.js
│   │   └── aggiornamenti.js
│   └── dnd-tracker.db             # File database
├── angular.json                   # Config Angular CLI
├── tsconfig.json                  # Config TypeScript
└── package.json                   # Dipendenze npm
```

---

## 🔑 CONCETTI CHIAVE

### TypeScript Interfaces
```typescript
export interface Campagna {
  id?: number;           // ? = opzionale
  nome: string;
  descrizione: string;
  gmId: number;
  giocatori: number[];   // Array di ID
}

// Uso
const campagna: Campagna = {
  nome: 'Lost Mines',
  descrizione: 'Avventura per principianti',
  gmId: 1,
  giocatori: [2, 3, 4]
};
```

### Async/Await vs Observables
```typescript
// Async/Await (Promises)
async loadData() {
  const data = await fetch('/api/campagne').then(r => r.json());
  console.log(data);
}

// Observables (RxJS)
loadData() {
  this.http.get('/api/campagne').subscribe(data => {
    console.log(data);
  });
}
```

### Arrow Functions
```javascript
// Normale
function sum(a, b) {
  return a + b;
}

// Arrow (breve)
const sum = (a, b) => a + b;

// Arrow con blocco
const sum = (a, b) => {
  const result = a + b;
  return result;
};
```

### Destructuring
```typescript
// Oggetto
const { nome, descrizione } = campagna;

// Array
const [primo, secondo] = giocatori;

// Parametri funzione
function salva({ nome, gmId }: Campagna) {
  console.log(nome, gmId);
}
```

### Spread Operator
```typescript
// Array
const nuovi = [...vecchi, nuovo];

// Oggetto
const updated = { ...campagna, nome: 'Nuovo nome' };

// Funzioni
const numeri = [1, 2, 3];
Math.max(...numeri);  // Math.max(1, 2, 3)
```

---

## 🚀 FLUSSO COMPLETO (GET Campagne)

### 1. Angular Component
```typescript
export class CampagneListComponent {
  campagne = signal<Campagna[]>([]);
  
  constructor(private campagneService: CampagneService) {}
  
  ngOnInit() {
    this.campagneService.campagne$.subscribe(data => {
      this.campagne.set(data);  // Aggiorna UI
    });
  }
}
```

### 2. Angular Service
```typescript
export class CampagneService {
  private apiUrl = 'http://localhost:3000/api/campagne';
  private campagneSubject = new BehaviorSubject<Campagna[]>([]);
  campagne$ = this.campagneSubject.asObservable();
  
  constructor(private http: HttpClient) {
    this.loadCampagne();
  }
  
  private loadCampagne() {
    this.http.get<Campagna[]>(this.apiUrl).subscribe({
      next: data => this.campagneSubject.next(data),
      error: err => console.error(err)
    });
  }
}
```

### 3. HTTP Request
```
GET http://localhost:3000/api/campagne
Headers:
  Content-Type: application/json
```

### 4. Express Route
```javascript
router.get('/', (req, res) => {
  db.all('SELECT * FROM campagne', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    
    const campagne = rows.map(row => ({
      ...row,
      giocatori: JSON.parse(row.giocatori)
    }));
    
    res.json(campagne);
  });
});
```

### 5. SQLite Database
```sql
SELECT * FROM campagne;

-- Risultato:
-- id | nome         | descrizione | gmId | giocatori
-- 1  | Lost Mines   | Avventura   | 1    | [2,3]
```

### 6. HTTP Response
```json
[
  {
    "id": 1,
    "nome": "Lost Mines",
    "descrizione": "Avventura per principianti",
    "gmId": 1,
    "giocatori": [2, 3]
  }
]
```

### 7. Angular UI Update
```html
@for (campagna of campagne(); track campagna.id) {
  <div class="card">
    <h3>{{ campagna.nome }}</h3>
    <p>{{ campagna.descrizione }}</p>
  </div>
}
```

---

## 📖 RISORSE PER STUDIARE

### Angular
- Documentazione ufficiale: https://angular.dev
- Tour of Heroes (tutorial): https://angular.dev/tutorials/learn-angular
- RxJS: https://rxjs.dev/guide/overview

### Node.js & Express
- Express docs: https://expressjs.com
- Node.js docs: https://nodejs.org/docs

### TypeScript
- TypeScript Handbook: https://www.typescriptlang.org/docs

### SCSS
- Sass docs: https://sass-lang.com/documentation

---

## 🗺️ STRUTTURA DELLE ROTTE (Navigazione App)

### Configurazione Routes (app.routes.ts)
```typescript
export const routes: Routes = [
  // 🏠 HOME - Pubblica (accessibile senza login)
  { 
    path: '', 
    component: HomeComponent 
  },
  
  // 🔑 LOGIN - Pagina di autenticazione
  { 
    path: 'login', 
    component: LoginComponent 
  },
  
  // 👤 PROFILO - Pagina utente loggato
  { 
    path: 'profilo', 
    component: ProfiloComponent 
  },
  
  // 🗺️ CAMPAGNE
  { 
    path: 'campagne',                    // Lista tutte le campagne
    component: CampagneListComponent 
  },
  { 
    path: 'nuova',                        // Form creazione campagna (solo GM)
    component: CampagnaFormComponent 
  },
  { 
    path: 'campagna/:id',                 // Dettaglio campagna (:id = parametro)
    component: CampagnaDetailComponent 
  },
  
  // 👥 PERSONAGGI
  { 
    path: 'personaggi/:campagnaId',       // Lista personaggi di una campagna
    component: PersonaggiListComponent 
  },
  { 
    path: 'personaggi/nuovo/:campagnaId', // Form nuovo personaggio
    component: PersonaggiFormComponent 
  },
  
  // 📜 AGGIORNAMENTI
  { 
    path: 'aggiornamenti/:campagnaId',    // Lista aggiornamenti campagna
    component: AggiornamentoListComponent 
  },
  { 
    path: 'aggiornamenti/nuovo/:campagnaId', // Form nuovo aggiornamento
    component: AggiornamentoFormComponent 
  },
  
  // 🚫 FALLBACK - Redirect su route non trovate
  { 
    path: '**', 
    redirectTo: '' 
  }
];
```

### Mappa di Navigazione Visuale

```
┌─────────────────────────────────────────────────────────┐
│                    / (Home)                              │
│  - Pubblica (anche per non loggati)                     │
│  - Mostra features dell'app                             │
│  - Link: /login, /campagne, /profilo                    │
└──────────────┬──────────────────────────────────────────┘
               │
               ├──► /login (Login)
               │    - Form autenticazione
               │    - Dopo login → redirect /campagne
               │
               ├──► /profilo (Profilo)
               │    - Info utente
               │    - Lista campagne create (GM) o partecipate (Giocatore)
               │    - Link: /campagna/:id
               │
               └──► /campagne (Lista Campagne)
                    │
                    ├──► /nuova (Form Nuova Campagna - solo GM)
                    │    - Dopo creazione → redirect /campagna/:id
                    │
                    └──► /campagna/:id (Dettaglio Campagna)
                         │
                         ├──► /personaggi/:campagnaId (Lista Personaggi)
                         │    │
                         │    └──► /personaggi/nuovo/:campagnaId (Form)
                         │         - Dopo creazione → torna a lista
                         │
                         └──► /aggiornamenti/:campagnaId (Lista Aggiornamenti)
                              │
                              └──► /aggiornamenti/nuovo/:campagnaId (Form)
                                   - Dopo creazione → torna a lista
```

### Esempi di Navigazione

#### 1. Da Template (HTML)
```html
<!-- Link semplice -->
<a [routerLink]="['/campagne']">Tutte le Campagne</a>

<!-- Link con parametro dinamico -->
<a [routerLink]="['/campagna', campagna.id]">
  Dettagli Campagna
</a>

<!-- Link con ID da variabile -->
<a [routerLink]="['/personaggi', campagnaId]">
  Vedi Personaggi
</a>

<!-- Nested routing -->
<a [routerLink]="['/personaggi', 'nuovo', campagnaId]">
  Crea Personaggio
</a>
```

#### 2. Da Component (TypeScript)
```typescript
constructor(private router: Router) {}

// Navigazione semplice
goToCampagne() {
  this.router.navigate(['/campagne']);
}

// Con parametro
goToDetail(id: number) {
  this.router.navigate(['/campagna', id]);
}

// Con query params
goToSearch() {
  this.router.navigate(['/campagne'], {
    queryParams: { search: 'dragon' }
  });
  // URL: /campagne?search=dragon
}

// Navigazione relativa
goBack() {
  this.router.navigate(['../'], { relativeTo: this.route });
}
```

#### 3. Leggere Parametri URL
```typescript
export class CampagnaDetailComponent {
  campagnaId!: number;
  
  constructor(
    private route: ActivatedRoute,
    private campagneService: CampagneService
  ) {
    // Route params (es. /campagna/5)
    this.route.params.subscribe(params => {
      this.campagnaId = +params['id'];  // + converte string → number
      this.loadCampagna(this.campagnaId);
    });
    
    // Query params (es. /campagne?search=dragon)
    this.route.queryParams.subscribe(params => {
      const search = params['search'];
      console.log('Cerca:', search);
    });
  }
}
```

### Protezione Rotte (Guard Pattern)
```typescript
// Auth Guard (da implementare)
export const authGuard: CanActivateFn = (route, state) => {
  const userService = inject(UserService);
  const router = inject(Router);
  
  if (userService.currentUser()) {
    return true;  // Accesso consentito
  } else {
    router.navigate(['/login']);
    return false;  // Blocca accesso
  }
};

// Applicazione su rotte protette
export const routes: Routes = [
  {
    path: 'profilo',
    component: ProfiloComponent,
    canActivate: [authGuard]  // ← Solo se autenticato
  }
];
```

---

## 🔗 STRUTTURA TECNICA (Come Lavorano i Componenti)

### 1. Architettura Generale

```
┌────────────────────────────────────────────────────────────────┐
│                         BROWSER                                 │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │                   ANGULAR APP (Port 4200)                │ │
│  │                                                           │ │
│  │  ┌─────────────┐  ┌─────────────┐  ┌──────────────┐    │ │
│  │  │ Components  │  │  Services   │  │   Router     │    │ │
│  │  │  (UI View)  │◄─┤  (Logic)    │  │ (Navigation) │    │ │
│  │  └─────────────┘  └──────┬──────┘  └──────────────┘    │ │
│  │                           │                               │ │
│  │                           │ HTTP Requests                 │ │
│  └───────────────────────────┼───────────────────────────────┘ │
└────────────────────────────┼─┼─────────────────────────────────┘
                              │ │
                              ▼ ▼
┌────────────────────────────────────────────────────────────────┐
│                   NODE.JS SERVER (Port 3000)                    │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │                   EXPRESS.JS                              │ │
│  │                                                           │ │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────┐│ │
│  │  │  CORS    │→ │  Router  │→ │   SQL    │→ │ SQLite3 ││ │
│  │  │Middleware│  │ (Routes) │  │  Query   │  │   DB    ││ │
│  │  └──────────┘  └──────────┘  └──────────┘  └─────────┘│ │
│  └──────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────┘
```

---

### 2. Flusso di Dati (Data Flow)

#### Scenario: Visualizzare Lista Campagne

```
┌──────────────────────────────────────────────────────────────┐
│ STEP 1: Utente naviga a /campagne                            │
└───────────────────────────┬──────────────────────────────────┘
                            │
                            ▼
┌──────────────────────────────────────────────────────────────┐
│ STEP 2: Angular Router carica CampagneListComponent         │
│                                                              │
│ export class CampagneListComponent {                         │
│   campagne = signal<Campagna[]>([]);                        │
│                                                              │
│   constructor(private campagneService: CampagneService) {}  │
│                                                              │
│   ngOnInit() {                                              │
│     // Sottoscrive Observable dal service                   │
│     this.campagneService.campagne$.subscribe(data => {      │
│       this.campagne.set(data); // Aggiorna UI              │
│     });                                                      │
│   }                                                          │
│ }                                                            │
└───────────────────────────┬──────────────────────────────────┘
                            │
                            ▼
┌──────────────────────────────────────────────────────────────┐
│ STEP 3: CampagneService fa HTTP request                     │
│                                                              │
│ export class CampagneService {                              │
│   private apiUrl = 'http://localhost:3000/api/campagne';   │
│   private campagneSubject = new BehaviorSubject<[]>([]);   │
│   campagne$ = this.campagneSubject.asObservable();         │
│                                                              │
│   constructor(private http: HttpClient) {                   │
│     this.loadCampagne(); // ← Carica all'avvio             │
│   }                                                          │
│                                                              │
│   private loadCampagne() {                                  │
│     this.http.get<Campagna[]>(this.apiUrl).subscribe({     │
│       next: data => this.campagneSubject.next(data),       │
│       error: err => console.error(err)                      │
│     });                                                      │
│   }                                                          │
│ }                                                            │
└───────────────────────────┬──────────────────────────────────┘
                            │
                            ▼
┌──────────────────────────────────────────────────────────────┐
│ STEP 4: HTTP GET Request                                    │
│                                                              │
│ GET http://localhost:3000/api/campagne                      │
│ Headers:                                                     │
│   Content-Type: application/json                            │
└───────────────────────────┬──────────────────────────────────┘
                            │
                            ▼
┌──────────────────────────────────────────────────────────────┐
│ STEP 5: Express Router intercetta richiesta                 │
│                                                              │
│ // server/routes/campagne.js                                │
│ router.get('/', (req, res) => {                             │
│   db.all('SELECT * FROM campagne', [], (err, rows) => {    │
│     if (err) {                                              │
│       return res.status(500).json({ error: err.message }); │
│     }                                                        │
│                                                              │
│     const campagne = rows.map(row => ({                     │
│       ...row,                                               │
│       giocatori: JSON.parse(row.giocatori || '[]')         │
│     }));                                                     │
│                                                              │
│     res.json(campagne); // ← Risponde con JSON             │
│   });                                                        │
│ });                                                          │
└───────────────────────────┬──────────────────────────────────┘
                            │
                            ▼
┌──────────────────────────────────────────────────────────────┐
│ STEP 6: SQLite esegue query                                 │
│                                                              │
│ SELECT * FROM campagne;                                      │
│                                                              │
│ Risultato:                                                   │
│ ┌────┬──────────────┬───────────┬──────┬────────────┐     │
│ │ id │ nome         │descrizione│ gmId │ giocatori  │     │
│ ├────┼──────────────┼───────────┼──────┼────────────┤     │
│ │ 1  │ Lost Mines   │Avventura  │  1   │ [2,3,4]    │     │
│ │ 2  │ Curse Strahd │Horror     │  1   │ [2,5]      │     │
│ └────┴──────────────┴───────────┴──────┴────────────┘     │
└───────────────────────────┬──────────────────────────────────┘
                            │
                            ▼
┌──────────────────────────────────────────────────────────────┐
│ STEP 7: HTTP Response                                        │
│                                                              │
│ Status: 200 OK                                               │
│ Body:                                                        │
│ [                                                            │
│   {                                                          │
│     "id": 1,                                                 │
│     "nome": "Lost Mines",                                    │
│     "descrizione": "Avventura per principianti",            │
│     "gmId": 1,                                              │
│     "giocatori": [2, 3, 4]                                  │
│   },                                                         │
│   { ... }                                                    │
│ ]                                                            │
└───────────────────────────┬──────────────────────────────────┘
                            │
                            ▼
┌──────────────────────────────────────────────────────────────┐
│ STEP 8: Service riceve dati e aggiorna BehaviorSubject     │
│                                                              │
│ this.campagneSubject.next(data); // ← Emette nuovo valore  │
└───────────────────────────┬──────────────────────────────────┘
                            │
                            ▼
┌──────────────────────────────────────────────────────────────┐
│ STEP 9: Component riceve dati tramite subscription          │
│                                                              │
│ this.campagneService.campagne$.subscribe(data => {          │
│   this.campagne.set(data); // ← Aggiorna Signal            │
│ });                                                          │
└───────────────────────────┬──────────────────────────────────┘
                            │
                            ▼
┌──────────────────────────────────────────────────────────────┐
│ STEP 10: Template si aggiorna automaticamente (Signals)     │
│                                                              │
│ @for (campagna of campagne(); track campagna.id) {          │
│   <div class="card">                                         │
│     <h3>{{ campagna.nome }}</h3>                            │
│     <p>{{ campagna.descrizione }}</p>                       │
│     <a [routerLink]="['/campagna', campagna.id]">          │
│       Dettagli                                              │
│     </a>                                                     │
│   </div>                                                     │
│ }                                                            │
│                                                              │
│ ✅ Utente vede la lista delle campagne!                    │
└──────────────────────────────────────────────────────────────┘
```

---

### 3. Interazione tra Componenti

#### A. Parent → Child (Input)
```typescript
// Parent Component
@Component({
  template: `
    <app-campagna-card 
      [campagna]="selectedCampagna"  ← Passa dati al figlio
      [isGM]="user()?.ruolo === 'GM'">
    </app-campagna-card>
  `
})
export class ParentComponent {
  selectedCampagna: Campagna;
}

// Child Component
@Component({
  selector: 'app-campagna-card'
})
export class CampagnaCardComponent {
  @Input() campagna!: Campagna;  // ← Riceve da parent
  @Input() isGM: boolean = false;
}
```

#### B. Child → Parent (Output)
```typescript
// Child Component
@Component({
  selector: 'app-campagna-form',
  template: `
    <button (click)="save()">Salva</button>
  `
})
export class CampagnaFormComponent {
  @Output() campagnaSaved = new EventEmitter<Campagna>();
  
  save() {
    const newCampagna = { ... };
    this.campagnaSaved.emit(newCampagna);  // ← Emette al parent
  }
}

// Parent Component
@Component({
  template: `
    <app-campagna-form 
      (campagnaSaved)="onSave($event)">  ← Ascolta evento
    </app-campagna-form>
  `
})
export class ParentComponent {
  onSave(campagna: Campagna) {
    console.log('Campagna salvata:', campagna);
  }
}
```

#### C. Service (Sibling Communication)
```typescript
// Service condiviso
@Injectable({ providedIn: 'root' })
export class CampagneService {
  private campagneSubject = new BehaviorSubject<Campagna[]>([]);
  campagne$ = this.campagneSubject.asObservable();
  
  addCampagna(campagna: Campagna) {
    // Aggiorna e notifica tutti i subscriber
    const updated = [...this.campagneSubject.value, campagna];
    this.campagneSubject.next(updated);
  }
}

// Component A (aggiunge)
export class FormComponent {
  constructor(private service: CampagneService) {}
  
  save() {
    this.service.addCampagna(newCampagna);  // ← Notifica tutti
  }
}

// Component B (legge)
export class ListComponent {
  campagne = signal<Campagna[]>([]);
  
  constructor(private service: CampagneService) {
    this.service.campagne$.subscribe(data => {
      this.campagne.set(data);  // ← Riceve aggiornamenti
    });
  }
}
```

---

### 4. Ciclo di Vita dei Componenti

```typescript
export class MyCampagnaComponent implements OnInit, OnDestroy {
  private subscription: Subscription;
  
  // 1. Constructor - Dependency Injection
  constructor(
    private campagneService: CampagneService,
    private route: ActivatedRoute
  ) {
    console.log('1. Constructor - DI setup');
  }
  
  // 2. ngOnInit - Inizializzazione
  ngOnInit() {
    console.log('2. ngOnInit - Component inizializzato');
    
    // Sottoscrizioni, caricamento dati
    this.subscription = this.campagneService.campagne$.subscribe(
      data => this.handleData(data)
    );
    
    // Leggi parametri route
    this.route.params.subscribe(params => {
      const id = params['id'];
      this.loadCampagna(id);
    });
  }
  
  // 3. ngOnDestroy - Cleanup
  ngOnDestroy() {
    console.log('3. ngOnDestroy - Cleanup');
    
    // IMPORTANTE: Unsubscribe per evitare memory leaks
    this.subscription.unsubscribe();
  }
  
  // Altri lifecycle hooks
  ngOnChanges(changes: SimpleChanges) {
    // Quando cambiano gli @Input
  }
  
  ngAfterViewInit() {
    // Dopo rendering della view
  }
}
```

---

### 5. Gestione Stato (State Management)

#### Service come State Store
```typescript
@Injectable({ providedIn: 'root' })
export class CampagneService {
  // State privato
  private _campagne = signal<Campagna[]>([]);
  private _loading = signal<boolean>(false);
  private _error = signal<string | null>(null);
  
  // State pubblico (read-only)
  readonly campagne = this._campagne.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();
  
  // Actions (metodi che modificano lo stato)
  loadCampagne() {
    this._loading.set(true);
    this._error.set(null);
    
    this.http.get<Campagna[]>(this.apiUrl).subscribe({
      next: data => {
        this._campagne.set(data);
        this._loading.set(false);
      },
      error: err => {
        this._error.set(err.message);
        this._loading.set(false);
      }
    });
  }
  
  addCampagna(campagna: Campagna) {
    return this.http.post<Campagna>(this.apiUrl, campagna).pipe(
      tap(newCampagna => {
        // Aggiorna stato locale
        this._campagne.update(old => [...old, newCampagna]);
      })
    );
  }
}

// Component usa lo stato
export class CampagneListComponent {
  campagne = this.service.campagne;  // Signal readonly
  loading = this.service.loading;
  error = this.service.error;
  
  constructor(private service: CampagneService) {
    this.service.loadCampagne();
  }
}

// Template mostra stato
@if (loading()) {
  <p>Caricamento...</p>
} @else if (error()) {
  <p class="error">{{ error() }}</p>
} @else {
  @for (campagna of campagne(); track campagna.id) {
    <div>{{ campagna.nome }}</div>
  }
}
```

---

### 6. Comunicazione HTTP Completa

```typescript
// Service Layer
export class CampagneService {
  private apiUrl = 'http://localhost:3000/api/campagne';
  
  constructor(private http: HttpClient) {}
  
  // GET - Lista
  getCampagne(): Observable<Campagna[]> {
    return this.http.get<Campagna[]>(this.apiUrl).pipe(
      map(campagne => campagne.map(c => ({
        ...c,
        // Trasformazioni se necessarie
      }))),
      catchError(err => {
        console.error('Errore caricamento:', err);
        return throwError(() => new Error('Errore di rete'));
      })
    );
  }
  
  // GET - Singolo
  getCampagnaById(id: number): Observable<Campagna> {
    return this.http.get<Campagna>(`${this.apiUrl}/${id}`);
  }
  
  // POST - Crea
  addCampagna(campagna: Campagna): Observable<Campagna> {
    return this.http.post<Campagna>(this.apiUrl, campagna).pipe(
      tap(newCampagna => console.log('Creata:', newCampagna))
    );
  }
  
  // PUT - Aggiorna
  updateCampagna(id: number, campagna: Campagna): Observable<Campagna> {
    return this.http.put<Campagna>(`${this.apiUrl}/${id}`, campagna);
  }
  
  // DELETE - Elimina
  deleteCampagna(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  
  // POST - Azione specifica
  joinCampagna(id: number, userId: number): Observable<Campagna> {
    return this.http.post<Campagna>(`${this.apiUrl}/${id}/join`, { userId });
  }
}

// Component usa service
export class CampagneListComponent {
  campagne = signal<Campagna[]>([]);
  
  constructor(private service: CampagneService) {}
  
  ngOnInit() {
    this.loadData();
  }
  
  loadData() {
    this.service.getCampagne().subscribe({
      next: data => this.campagne.set(data),
      error: err => console.error(err)
    });
  }
  
  deleteCampagna(id: number) {
    this.service.deleteCampagna(id).subscribe({
      next: () => {
        // Rimuovi dalla lista locale
        this.campagne.update(old => old.filter(c => c.id !== id));
      },
      error: err => alert('Errore eliminazione')
    });
  }
}
```

---

### 7. Navbar Shared Component

```typescript
// Componente condiviso usato ovunque
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink],
  template: `
    <nav class="navbar">
      <a [routerLink]="['/']" class="logo">🐉 D&D Tracker</a>
      
      <div class="nav-center">
        <a [routerLink]="['/']">Home</a>
        <a [routerLink]="['/campagne']">Campagne</a>
        <a [routerLink]="['/profilo']">Profilo</a>
      </div>
      
      @if (user()) {
        <div class="user-info">
          <span>{{ user()?.nome }}</span>
          <button (click)="logout()">Logout</button>
        </div>
      } @else {
        <a [routerLink]="['/login']">Login</a>
      }
    </nav>
  `
})
export class NavbarComponent {
  user: Signal<User | null>;
  
  constructor(
    private userService: UserService,
    private router: Router
  ) {
    this.user = this.userService.currentUser;
  }
  
  logout() {
    this.userService.logout();
    this.router.navigate(['/login']);
  }
}

// Usata in app.ts (root)
@Component({
  selector: 'app-root',
  template: `
    <app-navbar></app-navbar>  ← Sempre visibile
    <router-outlet></router-outlet>  ← Contenuto dinamico
  `,
  imports: [NavbarComponent, RouterOutlet]
})
export class App {}
```

---

## 🎓 ORDINE DI STUDIO CONSIGLIATO

1. **TypeScript Base** (types, interfaces, classes)
2. **Angular Components** (template, lifecycle, binding)
3. **Angular Services & DI** (dependency injection)
4. **RxJS Basics** (Observable, subscribe, operators)
5. **Angular Router** (navigazione, parametri)
6. **HTTP & APIs** (HttpClient, REST)
7. **Node.js & Express** (routing, middleware)
8. **SQLite/SQL** (query base)
9. **SCSS** (variabili, nesting)
10. **Angular Signals** (nuova reattività)

---

## 💡 PATTERN COMUNI NEL PROGETTO

### Service Pattern
Tutta la logica business e le chiamate HTTP stanno nei servizi, non nei componenti.

### Observable Pattern
Comunicazione asincrona tra componenti tramite Observables (RxJS).

### Repository Pattern
I servizi Angular astraggono l'accesso ai dati (sia da API che localStorage).

### MVC-like
- **Model**: Interfaces in `models/`
- **View**: Template HTML
- **Controller**: Component TypeScript

### REST API
- `GET /api/campagne` → Lista
- `GET /api/campagne/:id` → Dettaglio
- `POST /api/campagne` → Crea
- `PUT /api/campagne/:id` → Aggiorna
- `DELETE /api/campagne/:id` → Elimina

---

Questo documento copre tutte le tecnologie e i concetti usati nel progetto. Studialo sezione per sezione! 🚀
