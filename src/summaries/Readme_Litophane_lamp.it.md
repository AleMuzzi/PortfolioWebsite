# Lampada Litofania

## Summary
Lampade personalizzate stampate in 3D che rivelano fotografie ad alto dettaglio quando illuminate.

## What this project is
Questo progetto presenta una serie di **lampade litofania** progettate su misura, create come arte funzionale personalizzata. Una litofania è un'opera d'arte incisa o modellata in porcellana o plastica traslucida molto sottile che può essere vista chiaramente solo se retroilluminata da una sorgente luminosa. In questo progetto, la stampa 3D viene utilizzata per creare questi pezzi, dove i diversi spessori nella plastica si traducono in diversi livelli di trasmissione della luce, rivelando una fotografia dettagliata.

Il progetto include diversi design unici, ognuno personalizzato per un destinatario specifico, insieme a un framework riutilizzabile per creare nuovi design da qualsiasi fotografia.

## How it works

### Elaborazione delle Immagini e Mappatura della Profondità
La trasformazione di una fotografia 2D in un guscio stampabile in 3D comporta un attento flusso di lavoro digitale:
1. **Preparazione Fotografica:** Le immagini ad alto contrasto vengono selezionate ed elaborate (utilizzando strumenti come GIMP) per ottimizzarle per la trasmissione della luce.
2. **Conversione in Negativo:** L'immagine viene invertita in modo che le aree scure corrispondano alle sezioni più spesse della stampa e le aree chiare a quelle più sottili, garantendo una fotografia dall'aspetto naturale quando illuminata.
3. **Mappatura di Spostamento (Displacement Mapping):** L'immagine in scala di grigi elaborata viene utilizzata come "mappa di spostamento" in un software di modellazione 3D. Questa mappa detterà lo spessore locale di una superficie 3D (tipicamente una sfera o un cilindro), "scolpendo" effettivamente l'immagine nella geometria digitale.

### Modellazione 3D e Design Strutturale
Creare una lampada funzionale richiede più della semplice immagine; necessita di integrità strutturale e di un modo per alloggiare la sorgente luminosa:
- **Geometria della Superficie:** L'effetto litofania viene applicato a un modello base sferico o cilindrico utilizzando modificatori avanzati in 3ds Max o Blender.
- **Sezionamento Strutturale:** Per facilitare la stampa senza eccessivo materiale di supporto, i modelli grandi vengono spesso divisi in sezioni gestibili utilizzando operazioni booleane. Ciò consente superfici interne più pulite e un assemblaggio più facile.
- **Incastri e Tolleranze:** I modelli sono progettati per incastrarsi con precisione, spesso includendo una base dedicata per alloggiare l'elettronica e la sorgente luminosa.

### Pipeline di Produzione
Gli oggetti fisici finali sono prodotti tramite stampa 3D FDM (Fused Deposition Modeling):
1. **Slicing ad Alta Risoluzione:** I modelli 3D vengono tagliati con strati molto sottili (0,1 mm - 0,2 mm) per garantire gradienti uniformi e fini dettagli fotografici.
2. **Selezione del Materiale:** Vengono utilizzati filamenti PLA bianco traslucido o colori chiari simili per le loro eccellenti proprietà di diffusione della luce.
3. **Assemblaggio:** I gusci stampati vengono montati su una base contenente una sorgente luminosa a LED, dando vita a un pezzo unico di arredamento personalizzato.

## Technologies and tools
- **Editing Immagini:** GIMP per l'ottimizzazione fotografica e la preparazione della mappa di profondità.
- **Modellazione 3D:** 3ds Max e Blender per displacement mapping, geometrie booleane e design strutturale.
- **Stampa 3D:** Stampa FDM con materiali traslucidi e configurazioni di slicing ad alto dettaglio.
- **Integrazione Luce:** Design di basi personalizzate per l'illuminazione a LED.
