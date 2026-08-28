# 🌐 Sito web portfolio

## Summary

Un portfolio personale bilingue con un gemello digitale basato sull'intelligenza artificiale, realizzato con React, TypeScript, Express e framer-motion.

## What this project is

Questo è il mio sito web portfolio personale: una vetrina moderna e interattiva del mio lavoro, della mia esperienza e dei miei progetti personali. Presenta una visualizzazione basata su una timeline, una galleria di progetti con filtri e tag, e un esclusivo "gemello digitale" basato sull'intelligenza artificiale che permette ai visitatori di chattare con una versione virtuale di me, addestrata sull'intero mio percorso professionale.

### Architettura

Il progetto segue un'architettura **client-server** con una chiara separazione tra frontend e backend.

Il **frontend** è una SPA (Single Page Application) in React 19 + TypeScript, realizzata con Vite. Offre diverse visualizzazioni:
- **HomeView**: Punto di ingresso con una panoramica generale
- **ProjectsGridView**: Griglia filtrabile di progetti personali, supportata da file Markdown nella directory `src/summaries/`
- **ExperienceView**: Cronologia verticale di esperienze lavorative e formative
- **DetailsView**: Visualizzazione dettagliata di un singolo progetto o esperienza, con rendering Markdown tramite `react-markdown`
- **AboutView**: Sezione statica "Informazioni su di me"
- **DigitalTwin**: Interfaccia di chat basata sull'intelligenza artificiale e gestita da un proxy LLM nel backend

Il frontend utilizza **framer-motion** per le animazioni, **react-markdown** con `rehype-raw` e `remark-gfm` per il rendering di file Markdown avanzati (incluse estensioni personalizzate come `{width="400px"}` per le immagini) e **Plausible Analytics** per analisi che rispettano la privacy.

**Il backend** è un server Express 5 leggero (`server/index.ts`) in esecuzione sulla porta 3001. Il suo ruolo principale è quello di fungere da proxy per l'IA: carica tutto il contesto del CV (esperienze, progetti, informazioni personali, raccomandazioni) da file Markdown all'avvio, lo inserisce in un prompt di sistema e inoltra i messaggi di chat dal Digital Twin a un modello **Google Gemini** tramite l'API Gemini. Gestisce anche il routing delle SPA in produzione, servendo la build Vite.

La directory `src/summaries/` contiene tutte le descrizioni dei progetti sia in inglese che in italiano. Il server legge e concatena questi file, rimuove le estensioni Markdown personalizzate e li utilizza come contesto per l'IA.

**Il modello dati** è semplice: ogni progetto ed esperienza è definito in `projectsData.ts` e `experiencesData.ts` con un `id` che mappa un file Markdown in `src/summaries/`. La vista di dettaglio carica e visualizza il file Markdown corrispondente.

**L'internazionalizzazione** viene gestita manualmente tramite un modulo leggero `i18n.ts` che supporta l'inglese e l'italiano in tutta l'interfaccia utente.
**Sistema di tag**: ogni tecnologia elencata in un progetto o esperienza diventa un tag cliccabile. Cliccando su un tag si apre una finestra modale che rimanda a tutti gli altri progetti ed esperienze che condividono la stessa competenza o tecnologia, facilitando la navigazione nel portfolio per competenza anziché per cronologia.
La compilazione del progetto richiede sia una build frontend (Vite/TypeScript) che un processo backend:

```bash
# Installa le dipendenze
npm install

# Esegui lo sviluppo (frontend su :5173, backend su :3001)
npm run dev:all

# Build di produzione
npm run build
```

In produzione, il server Express esegue la build Vite dalla sua cartella `dist/` e inoltra le richieste API.


## Il Gemello Digitale

La caratteristica più distintiva è il **Gemello Digitale**: un agente IA chiamato "Sandro" che ha una conoscenza completa della mia carriera, dei miei progetti, delle mie competenze e della mia personalità. All'avvio del backend, vengono caricati tutti i file Markdown dalle cartelle `src/summaries/` e `src/experiences/`, combinati in un prompt contestuale completo e inviato a un modello **Google Gemini** tramite l'API Gemini. Il risultato è un'interfaccia conversazionale in cui i visitatori possono chiedere a Sandro informazioni sul mio background, sulla mia esperienza o sui miei progetti in linguaggio naturale.
Durante la navigazione, Sandro rimane **consapevole del contesto**: sa quale pagina l'utente sta visualizzando e può fornire approfondimenti, riepiloghi e rispondere a domande sul contenuto visualizzato sullo schermo. Questo crea un'esperienza fluida in cui l'assistente IA può spiegare o approfondire qualsiasi elemento che il visitatore incontra durante la navigazione del portfolio.


## Sviluppo assistito da IA

Questo progetto è stato realizzato con il supporto di diversi strumenti di intelligenza artificiale, ognuno dei quali è stato valutato per punti di forza e di debolezza durante lo sviluppo:

- **Gemini** (Google): Utilizzato per la creazione della struttura iniziale, il brainstorming per le decisioni architetturali e la generazione di codice boilerplate. Utile per la prototipazione rapida, ma a volte ha prodotto output generici o incoerenti.
- **Junie** (JetBrains): Valutato come assistente di programmazione all'interno dell'IDE. Utile per il completamento automatico e semplici attività di refactoring.
- **GitHub Copilot**: Utilizzato per i suggerimenti di codice inline, in particolare nei componenti TypeScript/React. Ha funzionato bene per i pattern ripetitivi, ma ha avuto difficoltà con la logica non ovvia.
- **Opencode**: Assistente principale per questo progetto. Utilizzato per comprendere il codebase, scrivere nuovi componenti, eseguire il debug e produrre questo stesso documento. La sua capacità di leggere file, cercare codebase ed eseguire comandi lo ha reso particolarmente adatto a un progetto complesso e multi-file come questo.
- **Openclaw**: Esplorato per compiti specializzatiks. Uno strumento emergente interessante nel campo dello sviluppo assistito dall'IA. Essendo una tecnologia relativamente nuova e complessa in termini di autorizzazioni, Openclaw è stato eseguito su una macchina virtuale dedicata.

Nessun singolo strumento si è rivelato la soluzione definitiva: i risultati migliori sono stati ottenuti combinando più strumenti e applicando il giudizio umano per convalidare e perfezionare l'output.

## GitHub
https://github.com/AleMuzzi/PortfolioWebsite

## Technologies and tools

* **Linguaggi:** TypeScript
* **Framework:** React, Express
* **Analisi:** Plausible Analytics
* **IA:** Google Gemini (proxy), architettura Digital Twin
* **Sviluppo assistito dall'IA:** Gemini, Junie, GitHub Copilot, Opencode, Openclaw
* **Infrastruttura:** Docker, Docker Compose