# 🖨️ Gargantua - Stampante 3D di grande formato

## Summary
Stampante 3D DIY open source di grande formato, basata su BTT Manta M8P e Klipper

## What this project is
Tutto è cominciato quando ho sbagliato a prendere il nuovo piatto in vetro per la mia Creality Ender 3 Pro, ordinando una lastra da 420x420 mm invece di 220x220 mm. Invece di restituirla o ritagliarla, ho deciso di costruire una nuova stampante 3D in grado di sfruttare appieno questa enorme superficie di stampa.
La mia Ender 3 Pro era già stata modificata più volte: doppio asse Z, hotend E3D V6 all-metal, sensore di livellamento automatico BLTouch, e così via. Tuttavia, volevo esplorare a pieno questo mondo, costruendo una macchina da zero con un firmware personalizzato che mi consentisse di sperimentare nuovi approcci alla stampa 3D.
Decisi così di partire dal disegno CAD fornito da Creality per la Ender 3[<math display="inline"><sup>↗</sup></math>](https://github.com/Creality3DPrinting/Ender-3), lo stesso che avevo già utilizzato per le modifiche precedenti, e di rivoluzionarlo completamente per adattarlo a un formato di stampa molto più grande.

Essendo la prima volta che progettavo una stampante 3D, ma soprattutto per mancanza di conoscenze al tempo, sono rimasto conservativo, mantenendo la stessa architettura di base: struttura in alluminio V-slot, doppio asse Z.

Se dovessi ricominciare oggi, opterei quasi sicuramente per una configurazione CoreXY, che offre vantaggi significativi in termini di velocità e precisione di stampa, specialmente per formati più grandi, e su un sistema a guide lineari anziché V-slot.

### Hardware
La scelta del firmware è stata probabilmente la prima decisione importante da prendere, poiché avrebbe influenzato tutte le altre scelte hardware successive.
Dopo un po' di ricerca, **Klipper** ne è uscito vincitore, noto per la sua flessibilità e capacità di sfruttare al meglio l'hardware a 32 bit, offrendo un controllo preciso dei movimenti e delle temperature, oltre a una vasta gamma di funzionalità avanzate sviluppate dalla comunità open source.
Avevo già esperienza con Marlin, ma volevo esplorare nuove possibilità e Klipper sembrava la scelta giusta per questo progetto.

![gargantua_btt_manta_m8p_photo.png{width="400px"}{align="right"}{caption="BTT Manta M8P"}](src/summaries/res/gargantua_btt_manta_m8p_photo.png)
Per il controller ho scelto la scheda **BTT Manta M8P**, una scheda di controllo a 32 bit basata su STM32G0B1VET6, un ARM Cortex-M0+ a 32 bit 64MHz, che offre un'ampia gamma di funzionalità e una buona compatibilità con vari firmware open source.
Ad affiancarla, la scheda di computazione **BTT CB1**, di fatto una gemella della Raspberry Pi CM4, che esegue Klipper e gestisce l'interfaccia utente tramite **Mainsail**[<math display="inline"><sup>↗</sup></math>](https://github.com/mainsail-crew/mainsail).

Il passo successivo è stato selezionare i motori passo-passo. Per riutilizzare il più possibile i componenti della mia Ender 3 Pro, ho deciso di mantenere gli stessi motori **NEMA 17**, che si sono dimostrati affidabili e adatti alle esigenze di questo progetto, affiancandoli ad un motore **CR 42-60** a doppio asse per l'asse Y, facendomi ispirare alla configurazione della Creality CR-6 Max.

Sempre dalla Creality CR-6 Max ho preso il piatto riscaldato, che offre un'ampia superficie di stampa di **400x400mm** e una distribuzione uniforme del calore, e l'idea di aggiungere un paio di tiranti diagonali per migliorare la stabilità della struttura.

I motori sono pilotati da driver **TMC2209**, noti per il loro funzionamento silenzioso e la capacità di microstepping avanzato, che consente movimenti più fluidi e precisi.

Si sono rese necessarie anche alcune considerazioni sull'alimentazione, dato che il piatto riscaldato richiede una potenza significativa.

![gargantua_biqu_extruder.png{width="300px"}{align="right"}{caption="Biqu H2 V2S REVO"}](src/summaries/res/gargantua_biqu_extruder.png)

Facendo due conti, la potenza totale richiesta dai componenti principali della stampante è la seguente:
- Piatto riscaldato: 420W a 24V
- 2 Hotend Biqu H2 V2S REVO, in grado di raggiungere fino a 300°C: 40W ciascuno a 24V
- Sistema di essicazione dei filamenti (progetto in corso): 200W
- Altri componenti: motori, ventole, elettronica
- Margine di sicurezza

Ragion per cui ho optato per **due alimentatori da 24V 500W** ciascuno, uno dedicato al piatto riscaldato e l'altro a tutti gli altri componenti. Il piatto riscaldato è controllato attraverso un **SSR** (Solid State Relay) per garantire un funzionamento sicuro, affidabile e veloce.

[//]: # (TODO CHECK THIS CAPTION)
![gargantua_bed_mesh.png{width="400px"}{align="right"}{caption="Se si osserva attentamente l'asse Z, il piatto sembra molto inclinato, ma su 40cm di lunghezza ci sono solo 2mm di differenza massima"}](src/summaries/res/gargantua_bed_mesh.png)
Infine, ho deciso di aggiornare il sensore di livellamento del letto, passando da un CR-3D, simile ad un BLTouch, a un **Beacon H**, un sensore che sfrutta lo spostamento tramite correnti indotte _(brutta traduzione di "Eddy current displacement")_ per misurare con precisione la distanza tra il sensore e il letto di stampa, offrendo una calibrazione molto più accurata, affidabile e veloce, soprattutto su superfici più grandi. La mappatura è così passata da una matrice di punti 5x5 ad una 30x30, senza alcuna necessità di interpolazione tra i rilevamenti.

## Technologies and tools

[//]: # (- Firmware **Marlin 2.x** &#40;personalizzato per STM32F407&#41;.)

[//]: # (- Scheda di controllo a 32 bit **MKS Monster8**.)

[//]: # (- **PrusaSlicer** con profili stampante e materiale personalizzati.)

[//]: # (- **Hardware di Precisione:** Motori passo-passo, riscaldatori ad alta potenza e sensori di livellamento del letto.)

[//]: # (- **Strumenti Media:** Imaging digitale per il monitoraggio della stampa e la creazione di time-lapse.)

Klipper, BTT Manta M8P, BTT CB1, Mainsail, Motori NEMA 17, Driver TMC2209, Piatto riscaldato 420x420mm, Hotend E3D V6, Sensore di livellamento, Alimentatori 24V 500W, SSR, Cura, PrusaSlicer, Fusion 360