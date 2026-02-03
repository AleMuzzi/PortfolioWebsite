# 🚁 Drone

## Summary
Un drone completamente DIY con un'app Android per la telemetria e il controllo del volo ottimizzato.

## What this project is
Come da titolo, questo progetto consiste in un drone, costruito interamente in casa. Il progetto non è nato dall'idea di creare un drone commerciale, ma piuttosto come un esercizio di apprendimento per comprendere i principi di base del volo dei droni, della programmazione di applicazioni mobili e dell'integrazione hardware-software.
Ero curioso di esplorare come i vari componenti hardware (motori, ESC, controller di volo) interagiscono con il software e di testare se un'app Android potesse essere utilizzata efficacemente per controllare un drone in tempo reale.
Il progetto è iniziato durante la laurea magistrale e aveva anche lo scopo di formarmi per lavorare in ambito di droni e robotica, che era il mio obiettivo professionale subito dopo la laurea.


### Architettura
![Architettura del drone{width="400px"}{align="right"}](src/summaries/res/drone_architecture.png)
L'intero sistema è stato progettato da 0, partendo dalla selezione dei motori brushless e di conseguenza degli ESC, fino alla scelta del controller di volo e alla progettazione dell'app Android per il controllo e la telemetria.

L'app fornisce un'interfaccia utente che richiama i comandi di un normale controller di volo, con due joystick virtuali per controllare l'acceleratore, l'imbardata, il beccheggio e il rollio. I comandi sono trasmessi al drone tramite Wi-Fi, via UDP, per garantire una bassa latenza. 
Per evitare ritardi cumulativi, i comandi sono inviati in modo continuo ad una frequenza fissa, gestibile dal server. I comandi vengono poi interpretati dal flight controller, che regola la velocità dei motori di conseguenza, passando per gli ESC.

Avendo a disposizione un Arduino Yun, nella versione iniziale del progetto il server UDP era scritto in Lua, sfruttando la potenza di calcolo del processore Linux integrato nell'Arduino Yun. Per poter inviare i comandi al flight controller era però necessario accedere ai pin di Arduino, possibile solo attraverso la _Bridge Library_. Questo introduceva un ritardo significativo nella catena di comunicazione, rendendo il controllo del drone poco reattivo e impreciso.
Per risolvere questo problema, ho deciso di sfruttare un'ESP8266 come antenna Wi-Fi via UART[^1] e riscrivere il server UDP in C, per farlo girare direttamente sul microcontrollore. In questo modo, i comandi potevano essere trasmessi direttamente ai pin di Arduino, riducendo drasticamente la latenza e migliorando la reattività del sistema di controllo.



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

[^1]: https://www.instructables.com/Cheap-Arduino-WiFi-Shield-With-ESP8266/

## Technologies and tools
- **Sviluppo Android:** Architettura dell'applicazione basata su Gradle per il controllo mobile.
- **Hardware di Controllo del Volo:** Controllori di volo multi-rotore (es. KK2), ESC e motori brushless.
- **Comunicazione Wireless:** Implementazione di protocolli per telemetria in tempo reale e link di comando.
- **Imaging Digitale:** Strumenti per la registrazione del volo e documentazione hardware fotografica.
- **Analisi della Telemetria:** Tecniche per rivedere e interpretare i dati dei sensori dal sistema di volo.
