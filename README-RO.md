# 💰 EcoNomos - Personal Finance Manager

**EcoNomos** este o aplicație de management financiar personal care ajută utilizatorii să își urmărească veniturile, cheltuielile și economiile.

## 🚀 Funcționalități Cheie

* **📊 Urmărirea Tranzacțiilor:** Adăugarea rapidă a veniturilor și cheltuielilor.
* **📂 Categorii Hibride:**
    * Categorii de Sistem (implicite).
    * Categorii Personalizate (create de utilizator).
* **🎯 Bugete Flexibile:** Logică pentru bugete globale (lunare) sau specifice pe categorii.
* **🐷 Obiective de Economisire:** Urmărirea progresului pentru achiziții importante.
* **🌍 Suport Internațional:** Structură pregătită pentru Multi-Language și Multi-Currency.

## 🛠️ Tehnologii (Tech Stack)

* **Backend:** Node.js, Express.js, Sequelize ORM.
* **Database:** PostgreSQL (via Docker).
* **Frontend:** React.js (urmează).

## ⚙️ Instalare Rapidă

1.  **Configurare:** Creează `.env` în folderul `server`:
    ```env
    POSTGRES_DB=economos_db
    POSTGRES_USER=student
    POSTGRES_PASSWORD=parola_ta
    DB_HOST=localhost
    PORT=3000
    PGADMIN_EMAIL=email-ul_tau
    PGADMIN_PASSWORD=parola_ta
    JWT_SECRET=caractere_random
    ```

2.  **Pornire Bază de Date:**
    ```bash
    docker-compose up -d
    ```

3.  **Pornire Server:**
    ```bash
    cd server
    npm install
    npm run dev
    ```

> La prima rulare, serverul va popula automat categoriile implicite (`food`, `transport`, etc.).