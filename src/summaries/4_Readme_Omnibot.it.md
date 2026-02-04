# 🤖 Omnibot

## Summary
Robot omnidirezionale con un'app Android dedicata per il controllo e lo streaming video in tempo reale.

## What this project is
Così come il progetto [DIY Drone](http://project:diy-drone) descritto in precedenza, anche questo progetto nasce come esercizio di apprendimento per esplorare la robotica mobile, in particolare i robot omnidirezionali e il funzionamento delle omniwheels (ruote omnidirezionali).
In quanto progetto esplorativo e senza una particolare utilità finale, il budget è stato mantenuto al minimo, partendo da un robot giocattolo: 

![omnibot_photo.png{width="400px"}{align="center"}](src/summaries/res/omnibot_photo.png)

### Prima Fase: Apprendimento del funzionamento originale
La prima fase del progetto ha comportato l'assemblaggio e la comprensione del codice fornito con il robot. Di base, il robot era dotato di un microcontrollore ESP32-CAM che gestiva l'esecuzione dei comandi e la trasmissione video tramite attraverso un'interfaccia web.
I comandi venivano poi inviati ad una versione custom di Arduino Uno via seriale, che a sua volta controllava i motori DC collegati alle omniwheels.

### Seconda Fase: Personalizzazione
Dopo aver compreso il funzionamento di base del robot, ho deciso di mantenere l'hardware originale ma di riscrivere il software eseguito dall'ESP32-CAM per farlo funzionare con il mio controller Android.
Ho quindi modificato il controller android precedentemente sviluppato per il [DIY Drone](http://project:diy-drone) per adattarlo al controllo del robot omnidirezionale, aggiungendo funzionalità specifiche per la gestione delle omniwheels e della telemetria del robot.


### Caratteristiche Operative
L'applicazione facilita un'interazione fluida tra l'utente e l'hardware robotico:
1. **Gestione della Connessione:** Scopre o si connette automaticamente al nodo di controllo del robot utilizzando protocolli di rete standard.
2. **Superficie di Controllo di Precisione:** Dispone di joystick virtuali e slider interattivi per movimenti complessi, inclusa la traslazione simultanea (strafing) e la rotazione.
4. **Pipeline dei Comandi:** Gli input dell'utente vengono serializzati in un formato che ne minimizza la dimensione e trasmessi tramite Wi-Fi (UDP) al computer di bordo del robot, che esegue quindi i movimenti. Anche il protocollo di comunicazione tra ESP32-CAM e Arduino Uno è stato modificato per venire incontro alle nuove esigenze.

### Risultati
Il robot è in grado di muoversi in tutte le direzioni con facilità, dimostrando l'efficacia delle omniwheels per la mobilità omnidirezionale. L'app Android fornisce un'interfaccia utente intuitiva e reattiva per il controllo del robot, consentendo movimenti precisi e fluidi.
La trasmissione video in tempo reale consente all'utente di vedere l'ambiente circostante, migliorando ulteriormente l'esperienza di controllo remoto.

## Technologies and tools
- **Frameworks:** Android, Arduino, ESP32, ESP32-CAM
- **Linguaggi:** C, Kotlin
- **Protocolli di Comunicazione:** UDP, Serial
