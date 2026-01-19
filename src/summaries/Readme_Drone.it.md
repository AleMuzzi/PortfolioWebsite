# 🚁 Drone

## Summary
Una piattaforma drone personalizzata dotata di un'app di telemetria Android e controllo di volo ottimizzato.

## What this project is
Il progetto Drone è uno spazio di lavoro completo per lo sviluppo e la documentazione di una piattaforma drone amatoriale personalizzata. Integra molteplici discipline, tra cui:
- **Controllo Mobile:** Un'applicazione Android costruita su misura per il funzionamento del drone e il monitoraggio della telemetria.
- **Sistemi di Volo:** Profili di configurazione e calibrazione per l'hardware di controllo di volo (come la scheda KK2).
- **Media & Analisi:** Un archivio curato di filmati di volo e documentazione fotografica utilizzati per la messa a punto delle prestazioni e l'ispezione del telaio.

Questo spazio di lavoro funge sia da base tecnica per il funzionamento del drone sia da record storico del suo sviluppo e della sua storia di volo.

## How it works

### Applicazione di Controllo Android
Il cuore dell'interfaccia utente è un'applicazione Android dedicata. Progettata per l'interazione in tempo reale, l'app facilita:
- **Trasmissione dei Comandi:** Invia segnali di controllo precisi (acceleratore, imbardata, beccheggio, rollio) e interruttori di modalità di volo al ricevitore del drone tramite protocolli wireless (Wi-Fi, Bluetooth o link radio personalizzati).
- **Feedback di Telemetria:** Visualizza i dati in tempo reale dal drone, inclusi tensione della batteria, altitudine, orientamento (assetto) e coordinate GPS, utilizzando un'interfaccia dinamica in stile HUD.
- **Registrazione dei Dati:** In grado di registrare la telemetria di volo per l'analisi post-volo e l'ottimizzazione delle prestazioni.

L'applicazione segue i pattern architetturali standard di Android, garantendo prestazioni affidabili e comunicazioni a bassa latenza con l'hardware del drone.

### Configurazione e Messa a Punto del Volo
Un volo di successo richiede una calibrazione precisa dell'hardware. Questo progetto include risorse specializzate per:
- **Tuning PID:** Documentazione e impostazioni per l'ottimizzazione dei controllori Proporzionale-Integrale-Derivativo (PID) per garantire caratteristiche di volo stabili.
- **Calibrazione dell'Electronic Speed Controller (ESC):** Parametri per la sincronizzazione del motore e i tempi di risposta.
- **Documentazione Hardware:** Diagrammi dettagliati e fotografie del telaio, layout dei cablaggi e posizionamento dei componenti per assistere nelle riparazioni e nei futuri aggiornamenti.

### Media di Volo
L'archivio multimediale integrato include filmati sia a bordo che a terra. Questi video non sono solo per esposizione; sono critici per:
- Identificare problemi di vibrazione o instabilità meccaniche.
- Rivedere le manovre di volo e le prestazioni della batteria sotto carico.
- Documentare missioni di successo e testare nuove iterazioni software o hardware.

## Technologies and tools
- **Sviluppo Android:** Architettura dell'applicazione basata su Gradle per il controllo mobile.
- **Hardware di Controllo del Volo:** Controllori di volo multi-rotore (es. KK2), ESC e motori brushless.
- **Comunicazione Wireless:** Implementazione di protocolli per telemetria in tempo reale e link di comando.
- **Imaging Digitale:** Strumenti per la registrazione del volo e documentazione hardware fotografica.
- **Analisi della Telemetria:** Tecniche per rivedere e interpretare i dati dei sensori dal sistema di volo.
