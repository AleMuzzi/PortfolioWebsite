# 🤖 Omnibot

## Summary
Telecomando Android e dashboard di telemetria in tempo reale per robot omnidirezionali.

## What this project is
Omnibot è un'applicazione Android specializzata progettata per fungere da **telecomando principale e dashboard di telemetria** per una piattaforma robotica omnidirezionale. Ottimizzata per l'uso su tablet e dispositivi mobili, fornisce un'interfaccia intuitiva per la navigazione robotica in tempo reale, il monitoraggio del sistema e la configurazione dell'hardware su una rete wireless.

## How it works

### Architettura dell'Applicazione
L'app è costruita utilizzando i moderni standard di sviluppo Android, con un'interfaccia a schermo intero ottimizzata per il paesaggio (landscape) progettata per un controllo di precisione:
- **UI Landscape-First:** L'interfaccia è bloccata in orientamento orizzontale, fornendo il massimo spazio per le superfici di controllo e le visualizzazioni di telemetria, simile a un gamepad professionale o a una dashboard industriale.
- **Ciclo di Vita dell'Applicazione Personalizzato:** Implementa una classe application personalizzata per gestire lo stato globale, inclusi i client di rete e le impostazioni di configurazione persistenti.
- **Networking Potenziato:** Configurato con specifiche regole di sicurezza di rete per consentire una comunicazione affidabile con i controller robotici locali, anche in ambienti di rete limitati o self-hosted.

### Caratteristiche Operative
L'applicazione facilita un'interazione fluida tra l'utente e l'hardware robotico:
1. **Gestione della Connessione:** Scopre o si connette automaticamente al nodo di controllo del robot utilizzando protocolli di rete standard.
2. **Superficie di Controllo di Precisione:** Dispone di joystick virtuali e slider interattivi per movimenti complessi, inclusa la traslazione simultanea (strafing) e la rotazione.
3. **Telemetria in Tempo Reale:** Monitora e visualizza i dati critici del robot, come lo stato della batteria, la velocità del motore e la qualità della connessione.
4. **Pipeline dei Comandi:** Gli input dell'utente vengono serializzati in un formato di messaggistica ad alte prestazioni (come JSON o pacchetti binari) e trasmessi tramite Wi-Fi (TCP/UDP) al computer di bordo del robot, che esegue quindi i movimenti.

## Technologies and tools
- **Sviluppo Android:** Applicazione nativa scritta in **Kotlin** e costruita con **Gradle**.
- **Interfaccia Utente:** Componenti Material Design ottimizzati per l'interazione a schermo intero in landscape.
- **Networking Wireless:** Protocolli di comunicazione basati su Wi-Fi per l'esecuzione dei comandi a bassa latenza.
- **Gestione dello Stato:** Gestione robusta degli stati di connessione e aggiornamenti di telemetria in tempo reale.
