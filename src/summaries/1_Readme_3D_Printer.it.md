# 🖨️ Gargantua - Stampante 3D di grande formato

## Summary
Stampante 3D DIY open source di grande formato, basata su BTT Manta M8P e Klipper

## What this project is
Tutto è cominciato quando ho sbagliato a prendere il nuovo piatto in vetro per la mia Creality Ender 3 Pro, ordinando una lastra da 420x420 mm invece di 220x220 mm. Invece di restituirla o ritagliarla, ho deciso di costruire una nuova stampante 3D in grado di sfruttare appieno questa enorme superficie di stampa.
La mia Ender 3 Pro era già stata modificata più volte: doppio asse Z, hotend E3D V6 all-metal, sensore di livellamento automatico BLTouch, e così via. Tuttavia, volevo esplorare a pieno questo mondo, costruendo una macchina da zero con un firmware personalizzato che mi consentisse di sperimentare nuovi approcci alla stampa 3D.
Decisi così di partire dal disegno CAD fornito da Creality per la Ender 3[<math display="inline"><sup>↗</sup></math>](https://github.com/Creality3DPrinting/Ender-3), lo stesso che avevo già utilizzato per le modifiche precedenti, e di rivoluzionarlo completamente per adattarlo a un formato di stampa molto più grande.

Essendo la prima volta che progettavo una stampante 3D, ma soprattutto per mancanza di conoscenze al tempo, sono rimasto conservativo, mantenendo la stessa architettura di base: struttura in alluminio V-slot, doppio asse Z.

> 💡 **Col senno di poi:** Se dovessi ricominciare oggi, opterei quasi sicuramente per una configurazione CoreXY, che offre vantaggi significativi in termini di velocità e precisione di stampa, specialmente per formati più grandi, e su un sistema a guide lineari anziché V-slot.

---

### Dettagli tecnici
```
Volume di stampa:        400x400x768 mm                   
Dimensioni:                                        Numero di estrusori:               2                   
    stampante:           620x625x1145mm            Temperatura massima estrusori:  300°      
    con case:           1020x890x1350mm            Temperatura massima piatto:     110°         
    + deumidificatore:  1020x890x1790mm            Case chiuso:                      Sì                          
Precisione:                      0.1 mm            OS:                          Klipper                              
Velocità massima:              300 mm/s            Alimentazione:           2x 24V 500W               
```
---

### Hardware
La scelta del firmware è stata probabilmente la prima decisione importante da prendere, poiché avrebbe influenzato tutte le altre scelte hardware successive.
Dopo un po' di ricerca, **Klipper** ne è uscito vincitore, noto per la sua flessibilità e capacità di sfruttare al meglio l'hardware a 32 bit, offrendo un controllo preciso dei movimenti e delle temperature, oltre a una vasta gamma di funzionalità avanzate sviluppate dalla comunità open source.
Avevo già esperienza con Marlin, ma volevo esplorare nuove possibilità e Klipper sembrava la scelta giusta per questo progetto.

![gargantua_btt_manta_m8p_photo.png{width="400px"}{align="right"}{caption="BTT Manta M8P"}](/summaries/gargantua_btt_manta_m8p_photo.png)

Per il controller ho scelto la scheda **BTT Manta M8P**, una scheda di controllo a 32 bit basata su STM32G0B1VET6, un ARM Cortex-M0+ a 32 bit 64MHz, che offre un'ampia gamma di funzionalità e una buona compatibilità con vari firmware open source.
Ad affiancarla, la scheda di computazione **BTT CB1**, di fatto una gemella della Raspberry Pi CM4, che esegue Klipper e gestisce l'interfaccia utente tramite **Mainsail**[<math display="inline"><sup>↗</sup></math>](https://github.com/mainsail-crew/mainsail).

Il passo successivo è stato selezionare i motori passo-passo. Per riutilizzare il più possibile i componenti della mia Ender 3 Pro, ho deciso di mantenere gli stessi motori **NEMA 17**, che si sono dimostrati affidabili e adatti alle esigenze di questo progetto, affiancandoli ad un motore **CR 42-60** a doppio asse per l'asse Y, facendomi ispirare alla configurazione della Creality CR-6 Max.

Sempre dalla Creality CR-6 Max ho preso il piatto riscaldato, che offre un'ampia superficie di stampa di **400x400mm** e una distribuzione uniforme del calore, e l'idea di aggiungere un paio di tiranti diagonali per migliorare la stabilità della struttura.

I motori sono pilotati da driver **TMC2209**, noti per il loro funzionamento silenzioso e la capacità di microstepping avanzato, che consente movimenti più fluidi e precisi.

Si sono rese necessarie anche alcune considerazioni sull'alimentazione, dato che il piatto riscaldato richiede una potenza significativa.

![gargantua_biqu_extruder.png{width="300px"}{align="right"}{caption="Biqu H2 V2S REVO"}](/summaries/gargantua_biqu_extruder.png)

La potenza totale richiesta dai componenti principali della stampante è la seguente:
- **Piatto riscaldato:** 420W a 24V
- **2 Hotend Biqu H2 V2S REVO (che raggiungono fino a 300°C):** 40W ciascuno a 24V
- **Sistema di essicazione dei filamenti (progetto in corso):** 200W
- **Altri componenti:** motori, ventole, elettronica
- **Margine di sicurezza**

Ho quindi optato per **due alimentatori da 24V 500W** ciascuno, uno dedicato al piatto riscaldato e l'altro a tutti gli altri componenti. Il piatto riscaldato è controllato attraverso un **SSR** (Solid State Relay) per garantire un funzionamento sicuro, affidabile e veloce.

Infine, ho deciso di aggiornare il sensore di livellamento del letto, passando da un CR-3D, simile ad un BLTouch, a un **Beacon H**[<math display="inline"><sup>↗</sup></math>](https://beacon3d.com/), un sensore che sfrutta lo spostamento tramite correnti indotte _(brutta traduzione di "Eddy current displacement")_ per misurare con precisione la distanza tra il sensore e il letto di stampa, offrendo una calibrazione molto più accurata, affidabile e veloce, soprattutto su superfici più grandi. La mappatura è così passata da una matrice di punti 5x5 ad una 30x30, senza alcuna necessità di interpolazione tra i rilevamenti.

<div style="display: flex; flex-direction: row; align-items: center; justify-content: center; gap: 24px;">
    <video src="/summaries/gargantua_bed_scan.mp4" loop muted autoplay playsinline width="400px"></video>
    <figure width="400px" style="display: table">
      <img src="/summaries/gargantua_bed_mesh.png" width="400px" />
      <figcaption class="image-caption" style="display: table-caption; caption-side: bottom;" >Il piatto sembra molto inclinato, ma se si osserva attentamente l'asse Z, su 40cm di lunghezza ci sono solo 2mm di differenza massima</figcaption>
    </figure>
</div>


### Design e Sviluppo
Il design della stampante è stato realizzato utilizzando **Fusion 360**, che mi ha permesso di progettare ogni componente con precisione, simulare il movimento degli assi e verificare l'integrazione di tutti i componenti hardware. Ho creato modelli 3D dettagliati per ogni parte della stampante, inclusi i supporti per i motori, le staffe per il piatto riscaldato, i supporti per l'elettronica e i componenti di raffreddamento.
Il processo di sviluppo è stato iterativo, con frequenti test e modifiche al design. Progettare tutto in CAD mi ha permesso di identificare e risolvere potenziali problemi di compatibilità e di spazio prima di procedere alla fase di assemblaggio, risparmiando tempo e risorse.
Il progetto era inizialmente di dimensioni gestibili, ma col passare del tempo è stato necessario suddividerlo in parti e combinare quest'ultime in un unico disegno per quando è necessaria una visione di insieme. Questa modularità ha consentito uno sviluppo più agile dei vari componenti.

![gargantua_printer.gif{width="400px"}{align="center"}{caption="Visuale della struttura di Gargantua"}](/summaries/gargantua_printer.gif)

#### Da "bowden" a "direct drive"

La Creality Ender 3 Pro utilizza un sistema di estrusione "bowden", in cui l'estrusore è separato dall'hotend e il filamento viene spinto attraverso un tubo fino all'hotend. 
Questo approccio ha alcuni vantaggi, come la riduzione del peso sull'asse X, ma può presentare problemi di reattività e precisione nell'estrusione, specialmente con materiali flessibili. Avevo già avuto difficoltà con questo sistema provando a stampare TPU, che tendeva a piegarsi all'interno del tubo bowden, ho così deciso di passare a un sistema "direct drive", in cui l'estrusore è montato direttamente sull'hotend. Questo cambiamento ha migliorato significativamente la precisione e la reattività dell'estrusione, permettendomi di stampare una gamma più ampia di materiali con maggiore affidabilità.
Nella progettazione di questa stampante, la flessibilità ha avuto la priorità sulle performance; se dovessi ricominciare con un sistema CoreXY, probabilmente opterei per un sistema di estrusione bowden, per ridurre il peso sull'asse X e migliorare la velocità di stampa, al costo di non poter stampare materiali flessibili.

#### Doppio estrusore

L'idea di poter stampare con due estrusori mi ha sempre affascinato: oltre a permettere di stampare in 2 colori, permette di sperimentare con materiali diversi, come stampe in cui un materiale flessibile e uno non flessibile vengono interlacciati, o di utilizzare supporti solubili come il PVA.
Ho quindi deciso di implementarla fin dall'inizio, progettando una testina di supporto per due hotend Biqu H2 V2S REVO.

![gargantua_print_head_bowden.png{width="900px"}{align="center"}](/summaries/gargantua_print_head_bowden.png)
![gargantua_print_head_direct_drive.png{width="900px"}{align="center"}{caption="(sopra) Bowden extruder, (sotto) Direct drive extruder"}](/summaries/gargantua_print_head_direct_drive.png)

Nelle immagini sopra si può vedere la differenza tra la testina di stampa con estrusori bowden e quella con estrusori direct drive. 
Nella prima, si possono intravedere gli estrusori e i canali di aerazione per raffreddarli (ventole nascoste per mostrare i dettagli), e in lontananza sulla sinistra, i motori degli estrusori.
Nella seconda, invece, si possono vedere i due motori degli estrusori montati direttamente sugli hotend sulla testina di stampa. Il profilo metallico dove erano alloggiati i motori per il sistema bowden è stato lasciato montato per avere un ancoraggio per i cavi che vanno alla testina.

Oltre agli estrusori, si può notare come anche i canali di aerazione del pezzo, alimentati da due ventole radiali, siano stati migliorati, per consentire un raffreddamento più omogeneo.

#### Enclosure
Per migliorare la qualità di stampa, ridurre il rumore durante la stampa e i problemi legati alla deformazione dei pezzi durante la stampa di materiali come l'ABS, ho deciso di costruire un'enclosure per la stampante, una struttura che racchiude completamente la stampante, mantenendo una temperatura interna stabile e riducendo l'influenza delle correnti d'aria esterne.
Avevo già esperienza nella costruzione di enclosure, per la mia Ender 3 Pro avevo costruito quello che su internet viene chiamato "IKEA Lack Enclosure"[<math display="inline"><sup>↗</sup></math>](https://www.google.com/search?q=ikea+lack+enclosure): utilizzando due tavolini IKEA Lack sovrapposti, pannelli di plexiglass per le pareti laterali e le porte, e stampando in 3D i vari connettori.
Come prima enclosure poteva andare bene, ma il tavolino IKEA Lack non forniva la stabilità necessaria, e in ogni caso non sarebbe stata una soluzione applicabile ad una stampante di grandi dimensioni come Gargantua.

Per Gargantua, ho disegnato una struttura in profili a sezione quadrata di alluminio cavo, con due porte, in modo da avere un accesso sia frontale che laterale alla stampante. 

![gargantua_enclosure.png{width="900px"}{align="center"}{caption="Gargantua nel suo case"}](/summaries/gargantua_enclosure.png)

Le pareti e le porte sono state quindi imbottite con pannelli isolanti e rivestite con pannelli di plastica dura.
Per consentirmi di ispezionare la stampa in corso senza dover aprire le porte, ho disegnato le porte con un doppio cardine, in modo che la parte esterna possa essere aperta indipendentemente da quella interna, consistente in un frame di alluminio con un pannello di plexiglass trasparente.
All'interno, la stampante è fissata all'enclosure attraverso 4 smorzatori in gomma, per ridurre le vibrazioni trasmesse alla struttura, anch'essa dotata di smorzatori in gomma come piedini.

>ℹ️ L'enclosure è necessariamente a base non quadrata, questo per ridurre al minimo la dimensione, ma lasciando spazio per il piatto di scorrere lungo l'asse Y.

Un sistema di led a striscia è stato installato sul soffitto dell'enclosure, per illuminare l'interno durante la stampa e facilitare l'ispezione visiva del processo di stampa.

![gargantua_printer_photo_lights.jpg](/summaries/gargantua_printer_photo_lights.jpg)

### Deumidificatore filamenti

Una parte molto importante e spesso sottovalutata nella stampa 3D è la gestione dei filamenti, che sono igroscopici e tendono ad assorbire umidità dall'ambiente, con conseguente degrado della qualità di stampa. Un filamento umido si espande e può causare problemi di sotto-estrusione, o addirittura blocchi dell'estrusore.
Per risolvere questo problema, ho deciso di integrare un sistema di essicazione dei filamenti direttamente sopra all'enclosure, progettando un compartimento dedicato che ospiti 10 filamenti, con un sistema di riscaldamento e ventilazione per mantenere i filamenti asciutti e pronti per la stampa.
Questo sistema è alimentato assieme alla stampante, ed è collegato direttamente agli estrusori, in modo che i filamenti essicati non entrino in contatto con l'umidità esterna durante il percorso verso gli hotend.

![gargantua_dehumidifier_photo.png{width="750px"}{align="center"}{caption="Deumidificatore di filamenti"}](/summaries/gargantua_dehumidifier_photo.png)

Nella foto sopra si può vedere il deumidificatore, con diversi filamenti, e sopra ad esso, si intravede il circuito di riscaldamento, in fase di prototipazione. Al centro, un sistema di carrucole guida i filamenti verso gli estrusori; si può intravedere in basso al centro il tubo che porta i filamenti al di fuori del deumidificatore, verso gli estrusori.

Il sistema è ancora in fase di sviluppo, il circuito è pronto e testato, ma occorrono ancora alcune modifiche al disegno 3D dove sarà posizionato per integrare meglio i componenti e migliorare il flusso d'aria.

### Gestione dei fumi

Stampare con materiali come l'ABS può generare fumi potenzialmente nocivi, oltre a un odore sgradevole. Per migliorare la sicurezza e il comfort durante la stampa, ho deciso di integrare un sistema di estrazione dei fumi direttamente nell'enclosure.
Non avendo accesso ad uno scarico esterno, ho optato per un sistema di filtraggio dell'aria basato su filtri a carbone attivo e HEPA, che catturano le particelle e neutralizzano gli odori prima di reimmettere l'aria nell'ambiente.
Il filtro in questione è l'**AlveoOne R di Alveo3D**[<math display="inline"><sup>↗</sup></math>](https://www.alveo3d.com/en/product/alveoone-r-assembled/), progettato specificamente per la stampa 3D, filtra l'aria presente nel case chiuso.
Il firmware di Gargantua è configurato per attivare automaticamente il sistema di estrazione dei fumi quando vengono stampati materiali che generano fumi, e per continuare a filtrare l'aria per un certo periodo dopo la fine della stampa.

### Il nome: Gargantua
![gargantua_black_hole_banner.jpg{width="1000px"}{height="300px"}{align="center"}{caption="Gargantua - Il buco nero super massiccio di Interstellar"}](/summaries/gargantua_black_hole_banner.jpg)
</br>

Il nome Gargantua è stato scelto in onore al buco nero super massiccio rappresentato nel film Interstellar, diretto da Christopher Nolan.
Gargantua è stato al centro del film, rappresentato come un buco nero rotante con un disco di accrescimento luminoso e distorsioni gravitazionali che ne alterano l'aspetto.

Il nome è stato scelto per simboleggiare la grandezza e la potenza della stampante che, con il suo ampio volume di stampa di **400x400x768mm** e le sue capacità, rappresenta un punto di riferimento nel mio percorso di apprendimento e sperimentazione nel mondo della stampa 3D.


### Dagli errori si impara

Sarebbe bello poter dire che è andato tutto liscio, ma purtroppo non è così. Questo progetto ha presentato numerose sfide e ostacoli lungo il percorso, molti dei quali derivanti dalla mia inesperienza nel progettare una stampante 3D da zero.
I principali sono stati 2: sottovalutare le temperature interne al case e l'erosione degli ugelli degli hotend.

Il precedente enclosure basato su tavolini IKEA Lack non era isolato, e la stampante all'interno dissipava il calore generato durante la stampa, mantenendo una temperatura interna relativamente bassa.
Dopo aver completato l'assemblaggio e aver iniziato a stampare, ho constatato con soddisfazione che la temperatura interna al case saliva rapidamente, raggiungendo picchi di oltre 50°C e mantenendosi poi stabile, segno che l'enclosure stava facendo il suo lavoro.
Tuttavia, questo calore ha causato problemi di surriscaldamento per l'elettronica e gli alimentatori, portando a malfunzionamenti e interruzioni della stampa.
Per risolvere questo problema, ho dovuto effettuare un piccolo foro sul retro dell'enclosure per spostare tutta l'elettronica all'esterno, consentendo una migliore dissipazione del calore.
                              
<div style="display: flex; flex-direction: column; align-items: center;">

![gargantua_electronics_outside_photo.jpg{width="600px"}](/summaries/gargantua_electronics_outside_photo.jpg)
![gargantua_electronics_inside_photo.jpg{width="336px"}](/summaries/gargantua_electronics_inside_photo.jpg)
<div>
<label class="image-caption">(sinistra) Alimentatori e schede di controllo spostate all'esterno del case. (destra) I cablaggi interni alla stampante</label>
</div>

</div>

Il secondo problema è stato l'erosione degli ugelli degli hotend. Quando ho realizzato la testina di stampa a doppio estrusore, ho cercato di ottenere la massima precisione possibile, per fare in modo che i due l'altezza dei due hotend fosse perfettamente allineata.
Tuttavia, il doppio estrusore ha funzionato per poco tempo: erosioni dovute alla stampa e ugelli usciti di fabbrica leggermente più alti di altri hanno reso impossibile mantenere un allineamento preciso tra i due hotend. Purtroppo, la precisione richiesta qua è abbastanza alta, ~0.1mm, e anche una piccola differenza di altezza tra i due hotend può causare problemi di stampa.
Per questo motivo, al momento sto stampando con un singolo estrusore, ma sto lavorando ad una nuova testina di stampa e sto valutando diverse opzioni:
- sistema ad estrusori mobili, in cui gli estrusori si muovono su e giù e vengono calibrati individualmente
- sistema IDEX (Independent Dual Extrusion), in cui i due estrusori sono completamente indipendenti e possono muoversi in modo autonomo, eliminando completamente il problema dell'allineamento.

O magari entrambi!

### Open Source

Il progetto è completamente open source, con tutti i file di progettazione, il firmware e la documentazione disponibili su GitHub[<math display="inline"><sup>↗</sup></math>](https://github.com/AleMuzzi/Gargantua).
L'obiettivo è condividere questa esperienza con la comunità maker e DIY, fornendo una guida dettagliata per chiunque voglia costruire una stampante 3D di grande formato, oltre a offrire spunti e ispirazione per ulteriori modifiche e miglioramenti. 
Il progetto è stato sviluppato con l'intenzione di essere facilmente replicabile, con componenti comunemente disponibili e istruzioni chiare per l'assemblaggio e la configurazione del firmware.

### Risultati
Questo è stato sicuramente il progetto più ambizioso e complesso che abbia mai realizzato, e nonostante le sfide incontrate, sono estremamente soddisfatto del risultato finale. 
Gargantua è una stampante 3D di grande formato, potente e versatile, che mi ha permesso di esplorare nuove possibilità nella stampa 3D e di migliorare le mie competenze in progettazione ed elettronica.
Non posso dire che sia finita, perchè si tratta di un progetto in continua evoluzione, con nuove funzionalità e miglioramenti in fase di sviluppo, ma sono orgoglioso di quello che ho realizzato finora e non vedo l'ora di vedere dove mi porterà questo progetto in futuro.

![gargantua_printer_photo_1.jpg{width="400px"}](summaries/gargantua_printer_photo_1.jpg)
![gargantua_printer_photo_2.jpg{width="400px"}](summaries/gargantua_printer_photo_2.jpg)
![gargantua_printer_photo_3.jpg{width="400px"}](summaries/gargantua_printer_photo_3.jpg)

## Technologies and tools
- **Firmware:** Klipper
- **Hardware:** BTT Manta M8P, BTT CB1, NEMA 17, CR 42-60, TMC2209, SSR
- **Interfaccia utente:** Mainsail
- **Slicer:** Cura, PrusaSlicer
- **Design:** Fusion 360
