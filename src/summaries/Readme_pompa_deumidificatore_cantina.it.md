# Controllore Pompa Cantina

## Summary
Controllore di pompa automatizzato basato su Arduino con sensori a doppio livello e logica a macchina a stati.

## What this project is
Questo progetto è un **controllore automatizzato basato su Arduino** progettato per gestire una pompa di estrazione dell'acqua in ambienti soggetti ad accumulo di umidità, come cantine o seminterrati. Utilizzando sensori a doppio livello, il sistema monitora intelligentemente i livelli dell'acqua e attiva la pompa solo quando necessario, garantendo un drenaggio efficiente e prevenendo il traboccamento.

Il sistema è progettato per il funzionamento autonomo, fornendo una soluzione affidabile e a bassa manutenzione per la gestione dell'acqua.

## How it works

### Architettura Hardware
Il controllore si interfaccia con diversi componenti chiave per monitorare e reagire alle condizioni ambientali:
- **Doppi Sensori a Galleggiante:** Sensori di "Pieno" e "Vuoto" posizionati strategicamente forniscono un feedback preciso sui livelli dell'acqua.
- **Interfaccia di Controllo:** Un microcontrollore compatibile con Arduino elabora gli input dei sensori e coordina i segnali di uscita.
- **Gestione dell'Alimentazione:** Un LED di alimentazione dedicato indica lo stato operativo del sistema.
- **Attivazione della Pompa:** Un relè o un driver MOSFET traduce il segnale a bassa tensione del microcontrollore nella potenza richiesta per azionare la pompa dell'acqua.
- **Feedback Visivo:** Un LED di stato fornisce un'indicazione chiara quando la pompa è attivamente impegnata.

### Logica di Controllo e Macchina a Stati
Il sistema opera su una robusta logica a macchina a stati per garantire cicli di pompaggio affidabili:
1. **Attivazione del Ciclo:** Quando il livello dell'acqua raggiunge il sensore di "Pieno", il controllore aziona la pompa e accende il LED di stato.
2. **Drenaggio in Stato Stazionario:** La pompa rimane attiva finché il livello dell'acqua non scende sotto la soglia di "Vuoto". Questa isteresi impedisce alla pompa di accendersi e spegnersi rapidamente vicino a un singolo punto del sensore.
3. **Spegnimento Automatico:** Una volta confermato lo stato di "Vuoto", il controllore disattiva la pompa e resetta il sistema per il ciclo successivo.
4. **Debouncing del Segnale:** Il debouncing a livello software è implementato per ignorare le letture transitorie dei sensori causate dalla turbolenza dell'acqua, prevenendo comportamenti erratici.

La logica è ottimizzata per l'implementazione autonoma, non richiedendo alcuna connessione a un computer esterno una volta caricato il firmware.

## Technologies and tools
- **Microcontrollore:** Piattaforma Arduino (Atmel AVR o simile).
- **Sensori:** Sensori di livello del liquido meccanici o ottici (interruttori a galleggiante).
- **Elettronica di Potenza:** Moduli relè o driver MOSFET ad alta corrente per il controllo della pompa.
- **Firmware:** C++ personalizzato (sketch Arduino) che implementa la logica di controllo basata sugli stati.
- **Indicatori Visivi:** Monitoraggio dello stato e dell'alimentazione basato su LED.
