# 💧 Sistema di Drenaggio Automatico

## Summary
Sistema automatizzato basato su Arduino per il drenaggio dell'acqua del deumidificatore

## What this project is
Questo progetto nasce dalla necessità di svuotare automaticamente l'acqua accumulata dal deumidificatore nella mia cantina, senza dover intervenire manualmente ogni volta che il serbatoio si riempie.
Il risultato è un **controllore automatizzato basato su Arduino** dotato di sensori a doppio livello che gli consentono di gestire autonomamente il livello dell'acqua e attivare la pompa solo quando necessario, garantendo un drenaggio efficiente e prevenendo il traboccamento.

Il sistema è progettato per il funzionamento autonomo, fornendo una soluzione affidabile e a manutenzione nulla per la gestione dell'acqua.


### Architettura Hardware
Questo progetto ha subito un'evoluzione significativa nel tempo. 

#### Prima Iterazione
![pompa_cantina_1_circuito.jpg{width="400px"}{align="right"}{caption="Simulazione circuito su EveryCircuit"}](assets/pompa_cantina_1_circuito.jpg)
L'idea iniziale, ispirata al funzionamento dei serbatoi dei WC, prevedeva l'uso di un singolo sensore a galleggiante per rilevare il livello dell'acqua.

Una volta raggiunto il livello di "Pieno", il circuito veniva chiuso, quindi:
- un lucchetto elettromagnetico scattava per mantenere il galleggiante in posizione, e di conseguenza il circuito attivo
- un timer NE555, configurato con una durata preimpostata, partiva
- la pompa veniva attivata per svuotare il serbatoio
Allo scadere del timer, il lucchetto si disattivava, permettendo al galleggiante di abbassarsi con il livello dell'acqua oramai svuotata, aprendo il circuito e spegnendo la pompa.
Il ciruito è stato progettato su EveryCircuit e successivamente realizzato su una basetta millefori.
Sebbene questa soluzione funzionasse, probabilmente a causa di errori nel circuito (non sono un esperto di elettronica) o all'umidità, il timer NE555 non era affidabile e spesso si rompeva, richiedendo continue riparazioni e l'utilizzo della modalità manuale per svuotare il serbatoio, che era esattamente ciò che volevo evitare.

#### Iterazione Attuale
In un secondo momento, ho deciso di abbandonare completamente il circuito analogico e di passare a una soluzione digitale molto più semplice ed affidabile basata su un microcontrollore **Arduino Nano**.

Il controllore si interfaccia con due sensori a galleggiante, uno posizionato al livello di "Pieno" e l'altro al livello di "Vuoto". 
Questi sensori forniscono un feedback preciso sui livelli dell'acqua, consentendo al microcontrollore di prendere decisioni informate sull'attivazione della pompa.
Il codice Arduino, lungo meno di 40 righe, implementa una logica a macchina a stati che gestisce i cicli di pompaggio in modo affidabile e informa l'utente dello stato del sistema tramite LED dedicati.
E' stato quindi utilizzato un relè per tradurre il segnale a bassa tensione del microcontrollore nella potenza richiesta per azionare la pompa dell'acqua.
                                                
<div style="display: flex; flex-direction: column; align-items: center; gap: 20px">

![pompa_cantina_foto_off.jpg{width="399px"}](assets/pompa_cantina_foto_off.jpg)
![pompa_cantina_foto_on.jpg{width="600px"}](assets/pompa_cantina_foto_on.jpg)
</br>
<label class="image-caption" style="display: flex; flex-direction: column; align-items: center;">Stato Spento (sinistra) e Stato Attivo (destra) con LED di stato acceso</label>

</div>
Nelle foto sopra si possono notare:

- il LED di alimentazione (a sinistra) che indica che il sistema è alimentato
- il LED di stato (acceso a destra) che indica che la pompa è attiva e sta drenando l'acqua dal serbatoio
- i due sensori a galleggiante (in alto a destra) che monitorano i livelli di "Pieno" e "Vuoto"
- il tubo di immissione dell'acqua proveniente dal deumidificatore (verde, in alto a destra)
- il tubo di scarico dell'acqua pompata fuori dal serbatoio (bianco, in alto a sinistra)
- il tubo di emergenza (bianco, a sinistra) che previene il traboccamento in caso di guasto del sistema e devia l'acqua in un secchio esterno
- l'interruttore di azionamento manuale (nero, in alto a destra sopra il serbatoio) che consente di attivare la pompa manualmente in caso di necessità

### Logica di Controllo e Macchina a Stati
Il sistema opera su una semplice e robusta logica a macchina a stati per garantire cicli di pompaggio affidabili:
1. **Attivazione del Ciclo:** Quando il livello dell'acqua raggiunge il sensore di "Pieno", il controllore aziona la pompa e accende il LED di stato.
2. **Drenaggio in Stato Stazionario:** La pompa rimane attiva finché il livello dell'acqua non scende sotto la soglia di "Vuoto". Questa isteresi impedisce alla pompa di accendersi e spegnersi rapidamente vicino a un singolo punto del sensore.
3. **Spegnimento Automatico:** Una volta confermato lo stato di "Vuoto", il controllore disattiva la pompa e resetta il sistema per il ciclo successivo. Il livello di "Vuoto" è stato posizionato strategicamente per garantire che il serbatoio sia sufficientemente svuotato ma non completamente, prevenendo il rischio di danneggiare la pompa a causa del funzionamento a secco.

La logica è ottimizzata per l'implementazione autonoma, non richiedendo alcuna connessione a un computer esterno una volta caricato il firmware.

## Technologies and tools
- **Hardware:** Arduino, Sensori a galleggiante, Relè, LED, Timer NE555, Pompa acqua
- **Linguaggi:** C
- **Software di Progettazione Circuiti:** EveryCircuit
- **Strumenti di Prototipazione:** Basetta millefori, 3D print FDM
