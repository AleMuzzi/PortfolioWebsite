# Domo

## Summary
Una libreria UI Material Design per Android, che porta un'estetica moderna sui dispositivi legacy.

## What this project is
Domo è una libreria Android e una suite dimostrativa progettata per mostrare e implementare componenti UI Material Design personalizzati. Il suo obiettivo principale è fornire widget di alta qualità ispirati al Material — come pulsanti, finestre di dialogo e input — che portino un'estetica moderna ai dispositivi Android più vecchi (supportati a partire da Android 4.0).

Il progetto è strutturato come un modulo libreria riutilizzabile, consentendo agli sviluppatori di integrare facilmente questi componenti nelle proprie applicazioni.

## How it works

### Architettura della Libreria
La logica principale risiede nel modulo libreria `MaterialDesign`. È costruito utilizzando una robusta configurazione Gradle che garantisce un'ampia compatibilità:

- **Retrocompatibilità:** Utilizza `minSdkVersion 14` e si affida a librerie come `NineOldAndroids` per il backport delle animazioni delle proprietà e delle transizioni fluide verso le versioni legacy di Android.
- **Integrazione Moderna:** Compilato rispetto agli SDK moderni per garantire che rimanga funzionale all'interno degli attuali ambienti di sviluppo.
- **Gestione delle Risorse:** Include un ricco set di attributi personalizzati, stili e asset (`res` e `assets`) che definiscono il linguaggio visivo dei componenti, inclusi effetti ripple e ombre di elevazione.

### Componenti UI
La libreria implementa una varietà di viste personalizzate, ognuna incapsulata con la propria logica di disegno e gestione delle interazioni. I componenti chiave includono:
- **Pulsanti Reattivi:** Pulsanti piatti e in rilievo con feedback ripple integrato.
- **Dialoghi:** Finestre modali con stile personalizzato per avvisi e input utente.
- **Floating Action Buttons (FAB):** Trigger di azioni moderne con supporto per vari stili di posizionamento e animazione.

### Flusso di Integrazione
L'integrazione della libreria comporta l'aggiunta del modulo come dipendenza del progetto. Una volta inclusa, gli sviluppatori possono utilizzare i widget direttamente nei loro file di layout XML facendo riferimento al pacchetto della libreria. Questo approccio consente una chiara separazione tra le definizioni dei componenti UI e la logica di business dell'applicazione.

## Technologies and tools
- **Modulo Libreria Android** (basato su Gradle).
- **NineOldAndroids & AndroidX Legacy Support** per animazioni in backport.
- **Disegno di Viste Personalizzate:** Implementazione di pattern visivi Material Design.
- **Pubblicazione Gradle:** Configurazione per la distribuzione della libreria e la gestione delle versioni.
