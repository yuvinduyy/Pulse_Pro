# PulsePro - Personal Fitness, BMI Tracker & Trainer Companion (with Supabase Integration)

PulsePro is a premium, full-stack fitness web and mobile-ready application built matching your design specifications with 100% fidelity. It features a fully responsive, mobile-first design, dual SQLite + Supabase Postgres database integration, BMI categorization charts, diet calendars, workout loggers, and a real-time messaging panel between trainers and user athletes.

---

## 🛠️ Technology Stack & Architecture

1. **Frontend**: React (Vite) styled with Vanilla CSS (vibrant HSL palettes, dark gradients, glassmorphic cards, micro-animations, centered responsive shell).
2. **Backend**: Express.js + CORS running on `http://localhost:5000` with direct **Supabase JS Client SDK** integration.
3. **Database Dual-Mode**:
   * **Supabase Cloud Mode**: Enabled by pasting your project credentials inside `.env`. All CRUD operations sync directly to Supabase Postgres.
   * **SQLite Local Fallback**: Automatically takes over if Supabase credentials are missing or database connection fails, ensuring 100% off-line uptime.
4. **Resiliency Failover**: The client is equipped with a bulletproof **Local Database Failover system**. If the server is offline or local sandboxing limits requests, it transparently redirects all CRUD queries to a fully replicated `localStorage` SQLite simulator, ensuring the app is always functional.

---

## ⚡ Connecting to Supabase Cloud Database

To migrate your database to the cloud using Supabase, follow these two simple steps:

### Step 1: Create Tables in Supabase
1. Go to your [Supabase Dashboard](https://supabase.com/).
2. Select your project, and click the **SQL Editor** tab in the left navigation sidebar.
3. Open a new query, copy the entire contents of the schema file created for you at `supabase_schema.sql`, paste it, and click **Run**.
4. This will instantly spin up all tables (`users`, `messages`, `diets`, `exercises`) and seed them with your test athlete **Yuvindu** and trainer **John**.

### Step 2: Configure Environment Credentials
1. Open the `.env` file located in the root of your project directory.
2. In your Supabase project dashboard, navigate to **Settings > API**.
3. Copy the **Project URL** and the **anon key** (`public`), and paste them into the `.env` file:
   ```env
   SUPABASE_URL=https://your-project-id.supabase.co
   SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
4. Restart your backend server (`npm run server` or `npm start`). The Node console will output:
   `Supabase Connection Status: ACTIVE (Directly connecting to Supabase Postgres)`
5. That's it! Your application is now running completely on the Cloud Database!

---

## 🤖 Exporting as a Native Android APK

To bundle your PulsePro React client into an Android package (`.apk`), follow these simple, industry-standard steps using **Capacitor**:

### Step 1: Install Capacitor in Your Project
Open your terminal in `/Users/yuvindu/Documents/PulsePro` and run:
```bash
npm install @capacitor/core @capacitor/cli
```

### Step 2: Initialize Capacitor Config
Initialize the mobile package with your app title and package identifier:
```bash
npx cap init PulsePro com.pulsepro.app --web-dir=dist
```

### Step 3: Install the Android Platform
Install the Android integration module and add the android directory structure:
```bash
npm install @capacitor/android
npx cap add android
```

### Step 4: Compile & Sync Your Web Assets
Whenever you make changes to your React app, build the production files and sync them to Android:
```bash
npm run build
npx cap sync
```

### Step 5: Build the APK in Android Studio
Launch Android Studio with the pre-configured project:
```bash
npx cap open android
```
1. Android Studio will open automatically.
2. Wait for the Gradle sync to complete (~1 minute).
3. In the top toolbar, click **Build > Build Bundle(s) / APK(s) > Build APK(s)**.
4. Once completed, a pop-up in the bottom-right corner will say *APK generated successfully*. Click **locate** to grab your finished `.apk` file!

---

## 🚀 Setup & Execution

Both the backend Express server and the Vite development server are running for you:
* **Vite Web Client**: Running at [http://localhost:5173/](http://localhost:5173/)
* **SQLite/Supabase Express Server**: Running at [http://localhost:5000/](http://localhost:5000/)

To launch or restart the environment yourself in the future, follow these simple terminal commands inside the `/Users/yuvindu/Documents/PulsePro` directory:

### 1. Unified Concurrent Startup
To launch the entire platform (both client and server) with a single command:
```bash
npm start
```

### 2. Standalone Startup
* **Start Backend Server**:
  ```bash
  npm run server
  ```
* **Start Web Client**:
  ```bash
  npm run dev
  ```
