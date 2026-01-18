# SmartSprinkler

## Summary
Applicazione Flutter multipiattaforma per il controllo remoto dell'irrigazione e la gestione delle zone.

## Cos'è questo progetto
SmartSprinkler è un'applicazione mobile multipiattaforma sviluppata con **Flutter** che funge da interfaccia di controllo intuitiva per un sistema di irrigazione connesso in rete. Fornisce ai proprietari di casa e agli appassionati la possibilità di:

- **Monitorare lo Stato del Sistema:** Visibilità in tempo reale sullo stato del controller di irrigazione.
- **Gestione delle Zone:** Controllo preciso sulle singole zone di irrigazione o su piante specifiche.
- **Erogazione su Richiesta:** Funzionalità per erogare un volume misurato di acqua (in millilitri) per un'irrigazione mirata.
- **Configurazione Remota:** Impostazioni flessibili per adattare l'app a diversi ambienti di rete ed endpoint backend.

## Come funziona

### Architettura dell'Applicazione
L'app segue un'architettura pulita e reattiva che separa l'interfaccia utente dalla logica di business sottostante:

- **UI Reattiva:** Costruita con il sistema di widget di Flutter, l'UI utilizza pattern `ListenableBuilder` per garantire che la dashboard rifletta automaticamente l'ultimo stato dell'hardware senza aggiornamenti manuali.
- **Pattern ViewModel:** Impiega uno strato ViewModel dedicato per orchestrare la logica di irrigazione, mantenendo il codice di presentazione focalizzato e manutenibile.
- **Persistenza dei Dati:** Include un modulo di configurazione per memorizzare e gestire le impostazioni di sistema, come gli endpoint API e i parametri di connessione.

### Flusso Operativo
L'interazione tra l'app e l'hardware di irrigazione è progettata per affidabilità e facilità d'uso:

1. **Interazione Utente:** Attraverso la dashboard "Irrigation Control", gli utenti selezionano una zona target e un'azione (Start, Stop o Dispense).
2. **Elaborazione dei Comandi:** L'app serializza queste azioni in comandi strutturati (JSON) contenenti la zona target, l'azione desiderata e qualsiasi parametro quantitativo (come il volume d'acqua).
3. **Comunicazione di Rete:** I comandi vengono trasmessi tramite richieste HTTP POST all'API del controller di irrigazione. L'app è progettata per gestire varie condizioni di rete, fornendo un feedback chiaro attraverso un sistema di notifiche toast.
4. **Feedback Hardware:** Il sistema analizza le risposte del server per confermare l'esecuzione riuscita o fornire report dettagliati sugli errori in caso di problemi di connettività o guasti hardware.

### Integrazione Backend
L'applicazione è progettata per essere indipendente dal backend, comunicando tramite un'interfaccia HTTP standard. Ciò le consente di interfacciarsi con una varietà di controller hardware, dalle soluzioni personalizzate basate su ESP32/Arduino ai piccoli server, purché implementino l'API dei comandi documentata.

## Tecnologie e strumenti
- **Framework Frontend:** Flutter e Dart per un'esperienza multipiattaforma coerente.
- **Networking:** `package:http` per una comunicazione API robusta e lo scambio di dati.
- **Gestione dello Stato:** Pattern reattivi basati su Listenable per aggiornamenti dell'interfaccia utente in tempo reale.
- **Feedback Utente:** `Fluttertoast` per notifiche di stato ed errore non intrusive.
- **Design Pattern:** Separazione degli interessi basata su ViewModel.
