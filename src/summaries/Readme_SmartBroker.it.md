# 📈 SmartBroker

## Summary
Framework di investimento guidato dall'IA per l'analisi di mercato e strategie di reddito automatizzate.

## Cos'è questo progetto
SmartBroker è un framework di ricerca e simulazione basato su Python focalizzato sull'**investimento a reddito assistito dall'IA**. Fornisce una pipeline completa per scaricare dati storici di mercato, progettare sofisticate feature tecniche e relative ai rendimenti, addestrare modelli di machine learning per prevedere la sovraperformance corretta per il rischio ed eseguire backtest realistici che tengano conto di tasse, commissioni e reinvestimento dei dividendi.

Il progetto include anche utility di notifica automatizzate per colmare il divario tra le previsioni del modello e gli avvisi in tempo reale.

## Come funziona

### Pipeline dei Dati e Feature Engineering
Il cuore di SmartBroker è un robusto motore di ingestione ed elaborazione dati:

1. **Integrazione dei Dati di Mercato:** Utilizza API finanziarie per recuperare prezzi di chiusura rettificati, record storici dei dividendi e dati di benchmark (es. SPY) per un'ampia gamma di ticker.
2. **Analisi degli Indicatori Tecnici:** Sfrutta librerie specializzate per calcolare metriche chiave, tra cui:
   - **Analisi del Trend:** Medie mobili (SMA 50/200) e metriche di distanza relativa.
   - **Momento e Forza:** Relative Strength Index (RSI) e misure di volatilità.
   - **Metriche di Reddito:** Calcolo dinamico dei rendimenti da dividendi degli ultimi 12 mesi.
3. **Generazione del Target Alpha:** Calcola il "Target Alpha" confrontando i rendimenti futuri dei singoli titoli rispetto a un benchmark, consentendo al modello di imparare quali feature prevedono una performance in eccesso piuttosto che solo il movimento generale del mercato.

### Punteggio IA e Logica della Strategia
Il progetto impiega un approccio di apprendimento supervisionato per identificare candidati di investimento ad alto potenziale:

- **Modellazione Predittiva:** Un `RandomForestRegressor` viene addestrato su finestre mobili di dati storici. Il modello apprende la relazione tra feature tecniche e futuri rendimenti corretti per il rischio.
- **Filtraggio Dinamico del Rischio:** Implementa una logica di "Kill Switch" in cui i candidati che non soddisfano determinati criteri tecnici (es. scambiati al di sotto della loro media mobile a 200 giorni) vengono automaticamente squalificati, indipendentemente dal loro punteggio IA.
- **Selezione del Portafoglio:** I candidati con il punteggio più alto che superano tutti i filtri di rischio vengono selezionati per il portafoglio simulato, con il capitale allocato secondo regole di strategia predefinite.

### Motore di Backtesting Realistico
SmartBroker va oltre le semplici simulazioni di prezzo modellando vincoli del mondo reale:

- **Modellazione degli Attriti:** Tiene conto delle commissioni di trading fisse e variabili.
- **Consapevolezza Fiscale:** Simula l'impatto delle tasse sulle plusvalenze e sui dividendi sulla crescita complessiva del portafoglio.
- **Ribilanciamento Flessibile:** Supporta frequenze di ribilanciamento sia mensili che settimanali. Il motore settimanale include una logica di "ribilanciamento intelligente" che evita operazioni non necessarie se il paniere ideale del portafoglio rimane stabile, minimizzando i costi.
- **Monitoraggio del Reddito:** Traccia specificamente il reddito netto da dividendi come metrica di performance primaria insieme all'apprezzamento del capitale.

### Notifiche Automatizzate
I moduli di notifica integrati consentono al sistema di trasmettere i segnali del modello e gli avvisi di portafoglio direttamente alle piattaforme di messaggistica (come Telegram), consentendo una transizione fluida dalla ricerca al monitoraggio.

## Tecnologie e strumenti
- **Linguaggio:** Python 3.13+
- **Data Science:** `pandas`, `NumPy` e `scikit-learn` per la modellazione e l'analisi.
- **Analisi Finanziaria:** `yfinance` per il reperimento dei dati e `pandas-ta` per gli indicatori tecnici.
- **Integrazione:** API di Telegram Bot per avvisi e monitoraggio automatizzati.
- **Visualizzazione:** `matplotlib` per grafici di performance e rischio-rendimento.
