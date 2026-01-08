# Zombiecide

## Summary
Gioco di sopravvivenza multiplayer con un client Unity 3D e un server dedicato in C#.

## What this project is
Zombiecide è un progetto di gioco multiplayer che fonde azione in tempo reale con elementi strategici cooperativi. L'architettura è divisa in due componenti distinti:
1. **Client Unity:** Un front-end grafico sviluppato in Unity che gestisce il rendering 3D, l'input del giocatore e le animazioni dei personaggi.
2. **Server Dedicato C#:** Un robusto servizio backend che orchestra la logica di gioco, mantiene lo stato sincronizzato e gestisce la comunicazione tra più giocatori connessi.

Ispirato ai giochi di sopravvivenza cooperativi, Zombiecide sfida i giocatori a lavorare insieme per navigare nelle mappe, combattere le minacce zombie in evoluzione e raggiungere gli obiettivi della missione.

## How it works

### Architettura del Server Dedicato
Il server è un'applicazione C# ad alte prestazioni progettata per la sincronizzazione dello stato a bassa latenza:
- **Gestione delle Connessioni:** Implementa un server TCP personalizzato in grado di gestire più connessioni socket simultanee. Ogni client è associato a un'entità giocatore gestita tramite sessione.
- **Modellazione delle Entità:** Presenta un livello di modello completo che rappresenta giocatori, pedine e vari tipi di zombie. Ciò garantisce che lo stato autorevole di tutte le entità di gioco sia mantenuto sul server.
- **Protocollo di Messaggistica:** Utilizza un formato di serializzazione personalizzato per trasmettere comandi di movimento, azioni di combattimento e aggiornamenti di stato tra i client e il server.
- **Orchestrazione di Turni e Logica:** Gestisce l'orologio interno del gioco, inclusa la convalida del movimento delle pedine, i pattern di spawn dell'IA degli zombie e le condizioni di vittoria/sconfitta.

### Interazione Client-Server
L'esperienza di gioco è guidata da un loop di sincronizzazione continua:
1. **Inizializzazione:** Il client Unity stabilisce una connessione al listener TCP del server.
2. **Emissione di Comandi:** Le azioni del giocatore (come muovere una pedina o attaccare) vengono inviate come pacchetti al server.
3. **Convalida dello Stato:** Il server convalida l'azione rispetto allo stato corrente del gioco e trasmette lo stato aggiornato a tutti i client connessi.
4. **Sincronizzazione Visiva:** I client Unity ricevono gli aggiornamenti di stato e interpolano i movimenti e le azioni di tutte le entità, garantendo un'esperienza visiva coerente per tutti i giocatori.

### Produzione e Sviluppo
Il progetto sfrutta strumenti standard del settore per garantire una base di codice scalabile e manutenibile:
- **Ecosistema .NET:** Il server è costruito come una soluzione .NET standard, facilitando la gestione delle dipendenze e la distribuzione multipiattaforma.
- **Motore Unity:** Il client sfrutta i potenti motori di rendering e fisica di Unity per una sensazione di gioco reattiva.
- **Utility Modulari:** Include componenti C# riutilizzabili per il logging, la generazione di ID unici e la gestione dei protocolli di rete.

## Technologies and tools
- **Motore di Gioco:** Unity per il gameplay lato client 3D e il rendering.
- **Linguaggio Backend:** C# / .NET per il server multiplayer dedicato.
- **Networking:** Implementazione di socket TCP personalizzata per la sincronizzazione in tempo reale.
- **Modellazione Dati:** Rappresentazione orientata agli oggetti di entità di gioco complesse e stati della scacchiera.
- **Serializzazione:** Protocolli di trasferimento dati efficienti per la comunicazione client-server.
