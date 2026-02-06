# 🚿 SmartSprinkler

## Summary
Sistema di irrigazione intelligente basato su Bayesian Inference

## What this project is
SmartSprinkler è un sistema di irrigazione intelligente che utilizza tecniche di inferenza bayesiana per ottimizzare l'uso dell'acqua in base a vari fattori ambientali e alle esigenze delle piante. 
Progettato per essere efficiente e adattabile, SmartSprinkler mira a ridurre gli sprechi d'acqua migliorando al contempo la salute delle piante. 

Il sistema integra sensori per monitorare l'umidità del suolo, la temperatura e le condizioni meteorologiche, utilizzando questi dati per prendere decisioni informate sull'irrigazione.
Associata a questo sistema c'è un'applicazione mobile che consente all'utente di monitorare e controllare il sistema di irrigazione da remoto.


### Stato del Progetto
Attualmente, il progetto è in fase di sviluppo e sperimentazione. 

Principalmente per una questione di test dell'hardware, la parte di controllo da remoto è stata la prima ad essere sviluppata e funziona correttamente, assieme ad alcuni sensori, tra cui quello di temperatura e umidità dell'aria e quello di umidità del suolo. L'integrazione con il resto dei sensori e l'implementazione dell'inferenza bayesiana sono invece ancora in corso. 

L'obiettivo finale è creare un sistema completamente automatizzato che possa adattarsi dinamicamente alle condizioni ambientali per ottimizzare l'irrigazione.

### Architettura
Il sistema è composto da due componenti principali: l'hardware di irrigazione e i client che interagiscono con esso, siano essi un'app azionata manualmente o un sistema di controllo automatizzato basato su inferenza bayesiana.

#### Hardware di Irrigazione
L'hardware di irrigazione è gestito da un'ESP32-CAM, che funge da nodo centrale per il controllo e la comunicazione. La scheda è stata programmata utilizzando il framework Arduino, con codice scritto in C. 

All'avvio, l'ESP32 si connette alla rete Wi-Fi locale e avvia un server HTTP che espone un'API RESTful per interagire col sistema. Le richieste possono essere:
- **di stato:** per ottenere informazioni sui sensori e lo stato attuale dell'irrigazione
- **di comando:** per inviare istruzioni di irrigazione specifiche, come "Start", "Stop" e "Dispensa", insieme a parametri come la pianta da irrigare e il volume d'acqua da erogare.

Come prima versione, il sistema è dotato di una pompa per l'acqua collegata a un serbatoio esterno, che viene attivata tramite mosfet controllato dall'ESP32. 
Un'elettrovalvola direziona il flusso d'acqua verso la pianta selezionata. 
Al momento, il sistema è dotato di una sola elettrovalvola, quindi può decidere tra 2 piante (valvola aperta o chiusa), ma l'idea è di espandere il sistema aggiungendo ulteriori elettrovalvole in un sistema binario per gestire più piante (<math display="inline"><mi>n</mi></math> valvole per <math display="inline"><mn>2</mn><sup>n</sup></math> piante).
                                              

<div style="display: flex; flex-direction: column; align-items: center">

![smart_sprinkler_photo_closed.jpg{width="400px"}](src/assets/smart_sprinkler_photo_closed.jpg)
![smart_sprinkler_photo_open.jpg{width="354px"}](src/assets/smart_sprinkler_photo_open.jpg)

</div>

Come si può vedere dalle foto sopra, il sistema è attualmente in una fase di prototipo, senza un case dedicato nè una scheda che dia struttura, ma è comunque funzionante. Nella foto dell'interno si possono notare l'ESP32-CAM e il mosfet che controlla la pompa dell'acqua, mentre nella foto esterna si può vedere il sensore DHT22 per la temperatura e l'umidità dell'aria.

#### Applicazione Mobile
L'app mobile, sviluppata utilizzando Flutter e Dart, fornisce un'interfaccia utente intuitiva per monitorare e controllare il sistema di irrigazione.
L'app segue un'architettura pulita e reattiva che separa l'interfaccia utente dalla logica di business sottostante:
- **UI Reattiva:** Costruita con il sistema di widget di Flutter, l'UI utilizza pattern `ListenableBuilder` per garantire che la dashboard rifletta automaticamente l'ultimo stato dell'hardware senza aggiornamenti manuali.
- **Pattern ViewModel:** Impiega uno strato ViewModel dedicato per orchestrare la logica di irrigazione, mantenendo il codice focalizzato e manutenibile.
- **Persistenza dei Dati:** Include un modulo di configurazione per memorizzare e gestire le impostazioni di sistema, come gli endpoint API e i parametri di connessione.

#### Bayesian Inference Controller
⚠️ In fase di sviluppo ⚠️

#### Comunicazione
La rete di casa è stata configurata per assegnare un indirizzo IP dedicato all'ESP32, che è stato mappato attraverso un reverse proxy (Nginx) per consentire l'accesso esterno tramite un dominio che punta al mio IP pubblico.


## Tecnologie e strumenti
- **Framework:** Flutter, Arduino, Bayesian Inference
- **Linguaggi:** Dart, C
- **Hardware:** ESP32, Mosfet, Elettrovalvola, Pompa acqua
- **Comunicazione:** HTTP, RESTful API
- **Design Pattern:** MVVM
