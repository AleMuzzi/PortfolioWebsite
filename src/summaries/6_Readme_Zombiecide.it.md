# 🧟 Zombiecide

## Summary
Zombicide, ma da remoto!

## What this project is
La necessità di questo progetto è nata durante la pandemia, quando le interazioni sociali erano limitate ed era impossibile giocare a giochi da tavolo con amici e familiari.
Il caso ha voluto che in quel periodo stessi sostenendo un esame universitario incentrato su realtà virtuale e sviluppo di app 3D, che prevedeva la realizzazione di un progetto con Unity, e che non esistesse una versione digitale di Zombicide, solo companion apps. 

Ho quindi deciso di unire l'utile al dilettevole, creando un gioco multiplayer cooperativo ispirato a Zombicide, un popolare gioco da tavolo di sopravvivenza contro gli zombie _(in particolare la versione [Rue Morgue](https://www.zombicide.com/rue-morgue/))_.

![zombicide_banner.webp{align="center"}](/summaries/zombicide_banner.png)

### Il gioco
In Zombiecide, i giocatori assumono il ruolo di sopravvissuti in un mondo post-apocalittico infestato da zombie. Devono collaborare per completare missioni, raccogliere risorse e combattere orde di zombie.
I giocatori controllano le loro pedine su una griglia di gioco, muovendosi strategicamente per evitare gli zombie e raggiungere gli obiettivi della missione. Ogni giocatore ha abilità uniche e può raccogliere armi e oggetti per migliorare le proprie possibilità di sopravvivenza.
Per vincere, i giocatori devono completare gli obiettivi della missione prima che gli zombie li sopraffacciano.

Più info sul sito [www.zombicide.com](https://www.zombicide.com/)

### Architettura
Zombiecide multiplayer ha come obiettivo quello di riproporre la user-experience del gioco da tavolo, ma da remoto. Non vi sono quindi meccaniche complesse di gioco, ma piuttosto un focus sulla sincronizzazione dello stato di gioco tra più giocatori connessi in tempo reale.

L'architettura è divisa in due componenti distinti:
1. **Client Unity:** Un front-end grafico sviluppato in Unity che gestisce il rendering 3D, l'input del giocatore e le animazioni dei personaggi.
2. **Server Dedicato C#:** Un robusto servizio backend che orchestra la logica di gioco, mantiene lo stato sincronizzato e gestisce la comunicazione tra più giocatori connessi.

### Architettura del Server
Il server è un'applicazione C# ad alte prestazioni progettata per la sincronizzazione dello stato a bassa latenza:
- **Gestione delle Connessioni:** 
  - Server TCP per gestire più connessioni socket simultanee. Ogni client è associato a un'entità giocatore gestita tramite sessione.
  - Server UDP per la trasmissione di aggiornamenti di stato ad alta frequenza, come movimenti, rotazioni e azioni in tempo reale.
- **Modellazione delle Entità:** Presenta un livello di modello completo che rappresenta giocatori, pedine e vari tipi di zombie. Ciò garantisce che lo stato autorevole di tutte le entità di gioco sia mantenuto sul server.
- **Utility di Gioco:** Fornisce funzionalità di utilità per la gestione delle regole di gioco, come lo spawn di zombie, l'aggiunta di nuovi giocatori e il mescolamento delle carte.
- **Protocollo di Messaggistica:** Il protocollo è basato su JSON e consente di trasmettere comandi di movimento, azioni di combattimento, lancio dei dadi, etc.

### Interazione Client-Server
L'esperienza di gioco è guidata da un loop di sincronizzazione continua:
1. **Inizializzazione:** Il client Unity stabilisce una connessione al listener TCP del server.
2. **Emissione di Comandi:** Le azioni del giocatore (come muovere una pedina o attaccare) vengono inviate come pacchetti al server.
3. **Convalida dello Stato:** Il server convalida l'azione rispetto allo stato corrente del gioco e trasmette lo stato aggiornato a tutti i client connessi.
4. **Sincronizzazione Visiva:** I client Unity ricevono gli aggiornamenti di stato e interpolano i movimenti e le azioni di tutte le entità, garantendo un'esperienza visiva coerente per tutti i giocatori.

### Gameplay
#### Server
Una volta avviato il server viene richiesta la dimensione NxM della griglia di gioco, dopodichè viene chiesto di immettere, separati da una virgola, i tasselli che compongono la griglia con il relativo orientamento partendo dall’angolo in alto a sinistra e procedendo verso destra riga dopo riga.
Di seguito un esempio con la corrispettiva configurazione risultante:

<div style="display: flex; flex-direction: column; align-items: center">

![zombicide_server_esempio1.png{width="700px"}{align="center"}](/summaries/zombicide_server_esempio1.png)
![zombicide_client_esempio1.png{width="700px"}{align="center"}{caption="(sopra) Configurazione server, (sotto) Risultato lato client"}](/summaries/zombicide_client_esempio1.png)

</div>

A questo punto entrambi i server sono partiti e raggiungibili agli indirizzi e porte indicate. Per consentire l’accesso dall’esterno ho messo l’indirizzo IP del PC su cui risiede il server nella DMZ della rete locale e mappato il mio IP pubblico tramite un servizio di DDNS.

#### Client
All’avvio il client si assicura che la comunicazione col server funzioni correttamente, in caso contrario comunica l’errore all’utente e l’applicazione si chiude. Nel caso in cui tutto funzioni correttamente, viene richiesto all’utente di scegliere il proprio personaggio e di immettere un proprio alias quindi, il gioco carica la configurazione ricevuta dal server e si può iniziare a giocare.

### Produzione e Sviluppo
Il progetto sfrutta strumenti standard del settore per garantire una base di codice scalabile e manutenibile:
- **Ecosistema .NET:** Il server è costruito come una soluzione .NET standard, facilitando la gestione delle dipendenze e la distribuzione multipiattaforma: Windows, Linux e macOS.
- **Motore Unity:** Il client sfrutta i potenti motori di rendering e fisica di Unity per una sensazione di gioco reattiva.

### Risultati
L’applicazione consente il gioco simultaneo fino a 10 giocatori; tuttavia, è scalabile e l’imposizione di un numero massimo di 10 giocatori è solamente vincolata alla fedeltà verso il gioco originale.
L’applicazione, oltre ai test effettuati durante lo sviluppo, ha anche affrontato con successo due sessioni di gioco della durata di **2h con 6 giocatori** e **3h con 8 giocatori**.

Inoltre, il progetto è piaciuto al professore universitario, che lo ha accettato e valutato come progetto d'esame.


## Technologies and tools
- **Frameworks:** .NET, Unity
- **Linguaggi:** C#
- **OS Supportati:** Windows, Linux, macOS
- **Comunicazione:** HTTP, RESTful API, UDP
