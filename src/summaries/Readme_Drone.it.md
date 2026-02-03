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
Per risolvere questo problema, ho deciso di sfruttare un'[ESP8266 come antenna Wi-Fi via UART](https://www.instructables.com/Cheap-Arduino-WiFi-Shield-With-ESP8266/) e riscrivere il server UDP in C, per farlo girare direttamente sul microcontrollore. In questo modo, i comandi potevano essere trasmessi direttamente ai pin di Arduino, riducendo drasticamente la latenza e migliorando la reattività del sistema di controllo.

### Risultati
Il drone è stato in grado di volare con successo, dimostrando che un'app Android può essere utilizzata efficacemente per il controllo del volo in tempo reale. L'esperienza mi ha fornito una comprensione approfondita dei principi di volo e funzionamento dei droni, della programmazione di applicazioni mobili e dell'integrazione hardware-software.
Avrei potuto migliorare ulteriormente il progetto con funzionalità aggiuntive come la stabilizzazione automatica del volo, il GPS per il posizionamento e il ritorno a casa, ma a quel punto l'obiettivo principale era già stato raggiunto: avevo ottenuto un lavoro come [Full Stack Drone Developer](). #TODO: link al lavoro

![drone_photo_1.jpg{width="500px"}](src/summaries/res/drone_photo_1.jpg)
![drone_photo_2.jpg{width="420px"}](src/summaries/res/drone_photo_2.jpg)

<div style="display: flex; flex-direction: column; align-items: center; gap: 20px;">
<video src="src/summaries/res/drone_test.mp4" loop autoplay muted playsinline width="500"></video>
</div>

### Curiosità
Durante lo sviluppo del progetto, ho dovuto calibrare gli ESC per garantire che i motori rispondessero correttamente ai comandi di velocità. Non avendolo mai fatto prima, ho dovuto documentarmi e ho scoperto che vanno calibrati ascoltanto i "beep" emessi dai motori. Questi suoni non sono casuali, ma seguono uno schema preciso che indica lo stato di calibrazione degli ESC e vengono generati dal movimento del rotore.

Ad ogni accensione del drone, quando l'ESC viene avviato, controlla di avere memorizzato i valori di minimo e massimo. Quindi, se tutto è corretto, il motore emette una serie di beep che indicano che si può procedere con il volo.

## Technologies and tools
- **Frameworks**: Android
- **Linguaggi:** C, Kotlin, Lua
- **Hardware:** Arduino, ESP8266, KK2 Flight Controller, ESC, Brushless Motors

