# 🏠 Domo

## Summary
Un'app per il controllo della musica in una rete locale.

## What this project is
Domo è una piccola applicazione Android che consente agli utenti di controllare la riproduzione musicale su un server multimediale all'interno di una rete locale. L'app offre funzionalità di base come play, pausa, salto traccia e regolazione del volume, il tutto attraverso un'interfaccia utente intuitiva e reattiva.
L'app non richiede alcuna connessione a Internet, nè l'autenticazione dell'utente, rendendola ideale per feste tra amici. L'idea è nata dalla necessità di avere un modo semplice e veloce per gestire la musica in ambienti sociali senza complicazioni.


### Come funziona
L'applicazione presenta un'architettura molto semplice, composta da un'interfaccia utente principale che comunica con un server multimediale scritto in C# tramite HTTP e una connessione websocket per aggiornamenti in tempo reale su lo stato della riproduzione, consentendo un controllo della musica fluido, reattivo e multi-utente.


### Pubblicazione
L'app era originariamente disponibile gratuitamente su Google Play Store, ma è stata rimossa per mancanza di tempo per la manutenzione.

## Technologies and tools
- **Linguaggi:** Kotlin, C#
- **Frameworks:** Android SDK
- **Backend e API:** HTTP, WebSocket
