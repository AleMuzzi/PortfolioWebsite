# 💡 Lampada con litofania

## Summary
Lampada stampata in 3D che rivela una fotografia ad alto dettaglio quando illuminata

## What this project is
Questo progetto nasce come regalo di San Valentino, quando il tema è stato "fatto in casa". E' piaciuto così tanto che me ne sono state commissionate altre dopo.

Una litofania è un'opera d'arte incisa o modellata in porcellana o plastica traslucida molto sottile che può essere vista chiaramente solo se retroilluminata da una sorgente luminosa. In questo progetto, la stampa 3D viene utilizzata per creare questi pezzi, dove i diversi spessori nella plastica si traducono in diversi livelli di trasmissione della luce, rivelando una fotografia dettagliata.


### Elaborazione delle Immagini e Mappatura della Profondità
La trasformazione di una fotografia 2D in un guscio stampabile in 3D comporta un attento flusso di lavoro digitale:
1. **Preparazione Fotografica:** Le immagini ad alto contrasto vengono selezionate ed elaborate (utilizzando strumenti come GIMP) per ottimizzarle per la trasmissione della luce.
2. **Conversione in Negativo:** L'immagine viene invertita in modo che le aree scure corrispondano alle sezioni più spesse della stampa e le aree chiare a quelle più sottili, garantendo una fotografia dall'aspetto naturale quando illuminata.
3. **Mappatura di Spostamento (Displacement Mapping):** L'immagine in scala di grigi elaborata viene utilizzata come "mappa di spostamento" in un software di modellazione 3D. Questa mappa detterà lo spessore locale di una superficie 3D (tipicamente una sfera o un cilindro), "scolpendo" effettivamente l'immagine nella geometria digitale.


### Pipeline di Produzione
In questo caso, le lampade sono prodotte tramite stampa 3D FDM (Fused Deposition Modeling):
1. **Slicing ad Alta Risoluzione:** I modelli 3D vengono tagliati ("slicing") con strati molto sottili (0,1 mm) per garantire gradienti uniformi e fini dettagli fotografici.
2. **Selezione del Materiale:** Vengono utilizzati filamenti come il PLA bianco traslucido o colori chiari simili per le loro eccellenti proprietà di diffusione della luce.
3. **Assemblaggio:** I gusci stampati vengono montati su una base contenente una sorgente luminosa a LED, per non surriscaldare la plastica e rischiare di fonderla, dando vita a un pezzo unico di arredamento personalizzato.

<div style="display: flex; flex-direction: column; align-items: center; gap: 20px;">

![litofania_immagine_originale.png{width="700px"}{align="center"}{caption="Imagine originale"}](src/assets/summaries/litofania_immagine_originale.png) 

![litofania_modello.jpg{width="300px"}](src/assets/summaries/litofania_modello.jpg)
![litofania_modello_sezione.jpg{width="300px"}](src/assets/summaries/litofania_modello_sezione.jpg)
![litofania_interruttore.jpg{width="300px"}](src/assets/summaries/litofania_interruttore.jpg)
</div>
<div style="display: flex; flex-direction: column; align-items: center; gap: 20px;">

![litofania_fine_stampa.jpg{width="500px"}{align="left"}](src/assets/summaries/litofania_fine_stampa.jpg)
<video src="src/assets/summaries/litofania_stampa.mp4" loop autoplay muted playsinline width="500"></video>
</div>

### Risultati
Il risultato finale è una lampada che, da spenta, appare come un semplice oggetto bianco, ma quando accesa rivela una fotografia dettagliata e affascinante.

<div style="display: flex; flex-direction: column; align-items: center; gap: 20px;">

![litofania_fine.jpg{width="500px"}](src/assets/summaries/litofania_fine.jpg)
<video src="src/assets/summaries/litofania_fine.mp4" loop autoplay muted playsinline width="500"></video>
</div>

## Technologies and tools
- **Editing Immagini:** GIMP
- **Modellazione 3D:** 3ds Max, Blender
- **Stampa 3D:** 3D print FDM, Ender 3 Pro, Cura Slicing Software
