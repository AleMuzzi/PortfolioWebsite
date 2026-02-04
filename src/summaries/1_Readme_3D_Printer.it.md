# 🖨️ Gargantua - Stampante 3D di grande formato

## Summary
Firmware Marlin a 32 bit personalizzato e profili di slicing ottimizzati per una stampante 3D di grande formato.

## What this project is
Questo progetto documenta una configurazione di stampante 3D pesantemente personalizzata basata sulla scheda di controllo a 32 bit MKS Monster8 e sul firmware Marlin 2.x. Comprende tre aspetti principali:

- **Firmware ed Elettronica:** Configurazione personalizzata di Marlin 2.x per la scheda Monster8.
- **Configurazione dello Slicer:** Profili ottimizzati per stampe di alta qualità costanti e ripetibili.
- **Documentazione e Media:** Una raccolta di video time-lapse e documentazione hardware che documenta l'evoluzione e la messa a punto della stampante.

Funge da hub centrale per le specifiche tecniche della stampante, la cronologia del firmware e i risultati di stampa.

## How it works

### Firmware e Controller
Il sistema esegue il firmware Marlin 2.x, un sistema di controllo del movimento open source adattato per la MKS Monster8 (MCU basata su STM32F4). La configurazione è specificamente ottimizzata per questo hardware per gestire:

- **Movimento di Precisione:** Controllo dei motori passo-passo per tutti gli assi e gli estrusori.
- **Gestione Termica:** Tuning PID avanzato per l'hotend e il letto riscaldato.
- **Input/Output:** Gestione di finecorsa, ventole e interfacce display.
- **Esecuzione:** Parsing efficiente del G-code da varie sorgenti (SD, USB o host).

La logica di controllo mappa i pin fisici della Monster8 ai componenti specifici della stampante, garantendo una comunicazione affidabile tra l'MCU e l'hardware.

### Configurazione dello Slicer e Pipeline di Stampa
Il flusso di lavoro dal modello digitale all'oggetto fisico segue una pipeline strutturata:

1. **Preparazione del Modello:** I modelli 3D vengono elaborati in PrusaSlicer utilizzando profili di materiale e stampante ottimizzati.
2. **Slicing:** Lo slicer genera percorsi utensile strato per strato e G-code ottimizzato per la meccanica specifica della macchina.
3. **Esecuzione:** Il firmware Marlin esegue il G-code in tempo reale, coordinando i movimenti meccanici e i controlli termici.
4. **Monitoraggio:** Una telecamera dedicata cattura il processo di stampa, fornendo feedback visivo e creando registrazioni time-lapse per la revisione della qualità e la documentazione.

### Ottimizzazione Specifica della Macchina
La configurazione è ottimizzata per una stampante di grande formato stile "Gargantua". Ogni aspetto — dalle dimensioni fisiche e i limiti di accelerazione alle correnti dei motori e al livellamento del letto — è definito con precisione nel firmware e nei preset dello slicer per corrispondere alle capacità meccaniche della macchina.

## Technologies and tools
- Firmware **Marlin 2.x** (personalizzato per STM32F407).
- Scheda di controllo a 32 bit **MKS Monster8**.
- **PrusaSlicer** con profili stampante e materiale personalizzati.
- **Hardware di Precisione:** Motori passo-passo, riscaldatori ad alta potenza e sensori di livellamento del letto.
- **Strumenti Media:** Imaging digitale per il monitoraggio della stampa e la creazione di time-lapse.
