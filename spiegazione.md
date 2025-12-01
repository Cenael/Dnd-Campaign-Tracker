📚 GUIDA DI STUDIO COMPLETA — Campaign Tracker Web App

(versione didattica + discorsiva)

🔥 1. Obiettivo del Progetto (così lo spieghi all’esame)

Il progetto è una web app full-stack che permette di gestire campagne, personaggi e aggiornamenti di gioco.
Dimostra padronanza di:

Frontend Angular moderno (versione 19)

Backend Node.js con Express

Database relazionale SQLite

Architettura REST

Gestione stato reattiva

UI responsive personalizzata

Come spiegarlo in 10 secondi:

“Ho realizzato una web app full-stack per organizzare campagne e personaggi. L’ho sviluppata con Angular 19, Node/Express e SQLite, implementando routing, API REST, autenticazione e un’architettura pulita e scalabile.”

🧠 2. Architettura globale (concetto fondamentale)

La tua app segue l'architettura:

Client (Angular) → Server REST API (Express) → Database (SQLite)

Perché è importante?

Perché dimostra che sai separare:

UI

Business logic

Persistenza dati

Come descriverlo a voce:

“Il frontend comunica con il backend esclusivamente tramite API REST. Il backend espone endpoint puliti e semplici, che interrogano un database SQLite tramite query parametrizzate. L’app è strutturata come una SPA, quindi la navigazione è immediata.”

⚙️ 3. Tecnologie principali — Perché le hai scelte
🔵 Angular 19 (frontend)

Perché?

Framework robusto → ideale per gestire app complesse

Signals → nuova reattività molto efficiente

Standalone Components → meno boilerplate

Routing e modularità integrati

TypeScript nativo

🟩 Node.js + Express (backend)

Perché?

Facile da integrare con un frontend JS

Semplicità nella gestione delle API

Ottimo per prototipi veloci e app semplici

🟪 SQLite (database)

Perché?

Zero configurazione

Perfetto per un MVP locale

SQL standard

File singolo facile da distribuire

🧩 4. Funzionalità — Cosa fa veramente l’app
Campagne

Creazione

Lista campagne

Partecipazione

Dettaglio con giocatori e personaggi

Personaggi

Creazione personaggi associati alla campagna

Classi, razze, livello

Visualizzazione elenco

Aggiornamenti

Log delle sessioni

Cronologia

Descrizioni dettagliate

Autenticazione

Login

Ruoli (GM / Giocatore)

Autorizzazioni

Come descriverlo all’esame:

“L’app gestisce tre entità fondamentali: campagne, personaggi e aggiornamenti. Ogni parte ha le sue API, il suo modello e la sua interfaccia.”

🧱 5. Struttura del Database — Da sapere a memoria

Tre tabelle:

campagne (1 → molti personaggi, molti aggiornamenti)

personaggi

aggiornamenti

Relazioni:

Una campagna ha molti personaggi

Una campagna ha molti aggiornamenti

Un personaggio appartiene a un utente

Come dirlo a voce:

“Il database è relazionale e semplice: tre tabelle con relazioni uno-a-molti. Le campagne sono la risorsa principale.”

🌐 6. Backend — Come funziona e cosa devi dire
Router Express

Ogni risorsa ha un file dedicato.

Query sicure

SQLite usa query parametrizzate:

db.run('INSERT INTO campagne VALUES (?, ?, ?)', [nome, desc, gmId]);

API REST principali

Per esempio:

GET /api/campagne
POST /api/campagne
GET /api/personaggi
POST /api/aggiornamenti

Come spiegarlo:

“Il backend è pensato per essere minimale: ogni entità ha le sue API CRUD, le query sono parametrizzate per sicurezza e gli endpoint sono progettati in modo RESTful.”

🎨 7. Frontend (Angular) — La parte più importante da spiegare
Componenti standalone

Ogni pagina è un componente a sé → più modulare

Routing semplice e comprensibile

Struttura tipo:

/campagne

/campagne/:id

/personaggi

/aggiornamenti

Signals per lo stato

Esempio:

campagne = signal<Campagna[]>([]);


Quando aggiorno:

this.campagne.set(nuoviDati);

Come spiegarlo:

“Ho usato Signals come stato reattivo. Modificare un Signal aggiorna automaticamente l’interfaccia senza dover usare Observable complicati.”

🔄 8. Flusso dati completo — Da conoscere molto bene

Esempio: caricamento campagne

Angular richiama il service

Il service chiama l’endpoint Express

Express interroga SQLite

Risponde con JSON

Il service aggiorna i Signals

Il componente si aggiorna automaticamente

Come dirlo a voce:

“Il flusso è interamente reattivo: la UI riflette lo stato senza gestione manuale complessa.”

🛡️ 9. Sicurezza e Best Practices

Hai implementato:

CORS configurato

Validazioni input

Query sicure

Architettura pulita separazione UI/logic/dati

Naming chiaro e TypeScript per prevenire errori

Ottimo da dire a voce:

“La sicurezza è basilare ma solida: input validati, query parametrizzate e CORS configurato correttamente.”

🚀 10. Performance

Frontend:

Signals → meno rendering

Liste con trackBy

Architettura leggera

Backend:

Query veloci

Nessun ORM pesante

Risposte JSON immediate

🧪 11. Testing (sapere cosa dire, anche se non lo hai implementato del tutto)

Potenziale uso di Jasmine/Karma per unit test

Cypress per E2E

Service testabili perché logica separata dalla UI

Frase utile:

“L’architettura a componenti standalone e servizi rende facile testare l’applicazione.”

📈 12. Scalabilità e futuro

Elementi che potresti implementare:

Migrazione a PostgreSQL

WebSocket per real-time

PWA

Feature avanzate (upload immagini, dashboard ecc.)

Come spiegarlo:

“L’MVP è stabile, ma l’architettura permette facilmente evoluzioni future.”

🧵 13. Cosa dire all’esame (script pronto)
Inizio (30 secondi)

“Ho realizzato una web app full-stack che permette di gestire campagne, personaggi e aggiornamenti. Ho usato Angular 19 per il frontend, Node/Express per il backend e SQLite come database.”

Centro (2–3 minuti)

“L’app è strutturata come una SPA con routing e componenti standalone. La gestione dello stato è affidata ai Signals. Il backend fornisce API REST pulite per ogni entità, con query parametrizzate e validazione di base. Il database è relazionale e formato da tre tabelle con relazioni uno-a-molti.”

Conclusione (30 secondi)

“Il progetto dimostra competenze full-stack, un’architettura scalabile e un frontend moderno. Rappresenta una base solida per estensioni future.”

📝 14. Come studiarlo in modo efficace

Riguarda architettura e flusso dati → è ciò che valutano di più.

Tieni a mente Signals, routing, API REST, struttura DB.

Ripassa 3 snippet di codice:

Signal e update

Endpoint Express

Query SQL
