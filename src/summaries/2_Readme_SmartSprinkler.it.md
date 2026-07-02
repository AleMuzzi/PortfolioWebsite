# 🚿 SmartSprinkler

## Summary
Sistema di irrigazione autonomo con decision-making bayesiano, controllo relay ESP32, e app mobile per override manuale

## What this project is
SmartSprinkler è un sistema di irrigazione intelligente che utilizza una rete bayesiana per ottimizzare l'uso dell'acqua in base a fattori ambientali e alle esigenze specifiche delle piante. Progettato per essere efficiente e adattabile, SmartSprinkler mira a ridurre gli sprechi d'acqua migliorando al contempo la salute delle piante.

Il sistema integra sensori per monitorare l'umidità del suolo, la temperatura e le condizioni meteorologiche, utilizzando questi dati per prendere decisioni informate sull'irrigazione. Un server Python/FastAPI gestisce l'inferenza bayesiana e automatizza il processo di irrigazione. L'app mobile e un web dashboard consentono all'utente di monitorare e controllare il sistema da remoto.

### Stato del Progetto
Il progetto è in fase di sviluppo avanzato. Le componenti principali sono operative:

- **Hardware ESP32**: Funzionante con sensori di temperatura/umidità aria (DHT22) e umidità suolo (HW-390)
- **Server BayesianSprinkler**: Implementato e operativo con rete bayesiana a 8 nodi, integrazione Open-Meteo API, scheduler automatico e raffinamento pesi
- **App Mobile Flutter**: Operativa con toggle per routing diretto ESP o tramite server bayesiano
- **Web Frontend React**: Dashboard completo con tab Dashboard, Control e Settings

### Architettura
Il sistema è composto da tre componenti principali: l'hardware ESP32 con Arduino Nano come slave per i sensori, il server BayesianSprinkler (Python/FastAPI), e i client (app mobile Flutter + web frontend React).

#### Hardware ESP32 + Arduino Nano
L'hardware è gestito da un ESP32-CAM come controller principale con un Arduino Nano come slave per i sensori. Il sistema espone un'API HTTP (porta 80):
- `GET /status` — restituisce `air_temperature`, `air_humidity`, `soil_moisture`, `water_pump`, `rotary_position`, `water_low_alert`
- `POST /command` — accetta `{"action": "START|STOP|DISPENSE_SPECIFIC_AMOUNT", "target": "PLANT_NAME", "amount": <ml>}`

L'ESP32 controlla una pompa per l'acqua collegata a un serbatoio esterno (GPIO 12). La selezione della pianta avviene tramite un **selettore rotante stampato in 3D** azionato da un **servo motore SG90** (GPIO 13), che indirizza il flusso d'acqua verso la pianta selezionata. Il Nano legge 4 sensori di umidità del suolo HW-390, un DHT22 e un galleggiante per il livello dell'acqua, comunicando con l'ESP32 via seriale.

Il sistema supporta 4 piante: Habanero, Naga Morich, Carolina Reaper e Rosmarino, ciascuna con soglie e necessità idriche differenti. Le posizioni del servo sono: Habanero (0°), Naga Morich (15°), Carolina Reaper (30°), Rosmarino (45°).

#### BayesianSprinkler Server
Server FastAPI (porta 8080) che gestisce il processo decisionale autonomo:

- **Rete Bayesiana a 8 nodi**: AirTemperature, AirHumidity, CloudCover → EvaporationRisk → NeedWater + SoilMoisture, PlantType, RainForecast
- **APScheduler**: polling orario dei sensori + ciclo di inferenza ogni 30 minuti
- **Open-Meteo API**: integrazione per cloud cover e previsioni pioggia
- **SQLite**: database per cronologia sensori con raffinamento bayesiano dei pesi
- **Endpoint principali**: `POST /api/plants/manual-water`, `GET /api/plants/status`, `GET /api/weather/status`

#### Mobile App Flutter
L'app mobile fornisce un'interfaccia per monitorare e controllare il sistema:
- Dashboard reattiva con stato sensori in tempo reale (polling ogni 2s)
- Toggle per scegliere tra routing diretto ESP o tramite server bayesiano
- Selezione pianta e controllo irrigazione (Start/Stop/Dispensa)
- Pagina Settings per configurare URL ESP32 e Bayesian Server

#### Web Frontend React
Dashboard web con tre tab:
- **Dashboard**: telemetry temps umidità suolo, contesto meteorologico, probabilità bayesiane per pianta
- **Control**: selezione pianta, toggle Direct ESP/Via Bayesian, pulsanti Start/Stop, preset volume
- **Settings**: configurazione URL e polling interval

#### Comunicazione
La rete domestica è configurata per assegnare un IP dedicato all'ESP32, accessibile tramite reverse proxy Nginx. Il server BayesianSprinkler può essere containerizzato con Docker e docker-compose.

## GitHub
https://github.com/AleMuzzi/SmartSprinkler

## Tecnologie e strumenti
- **Linguaggi:** Dart, C/C++, Python, JavaScript
- **Framework:** Flutter, PlatformIO, FastAPI, React
- **Hardware:** ESP32-CAM, Arduino Nano, DHT22, HW-390, SG90 servo, Relay pump
- **Comunicazione:** HTTP, RESTful API
- **Database:** SQLite
- **Design Pattern:** MVVM, Bayesian Network
- **Strumenti:** Docker, Nginx, APScheduler, Open-Meteo API
