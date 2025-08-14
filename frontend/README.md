# Frontend - Real-Time Blood Alert System

## 🚀 Overview
This is the **frontend** for the Real-Time Blood Alert System, designed to be **mobile-friendly for donors** and **desktop-optimized for hospitals**.

It includes:
- **Donor Web App** (mobile responsive)
- **Hospital Dashboard** (desktop)
- **Public/Family Emergency Request Form**

## 🛠️ Tech Stack
- **Framework**: React.js / Next.js
- **Styling**: Tailwind CSS
- **Mapping**: Mapbox API
- **Push Notifications**: OneSignal
- **Auth**: Firebase Authentication

## 📦 Installation
```bash
cd frontend
npm install
```

## Run Development Server
```bash
npm run dev
The frontend will be available at http://localhost:3000.
```
## 🔑 Environment Variables
Create a .env.local file in the frontend/ directory with:
```bash
NEXT_PUBLIC_MAPBOX_KEY=your_mapbox_key
NEXT_PUBLIC_ONESIGNAL_APP_ID=your_onesignal_id
NEXT_PUBLIC_FIREBASE_CONFIG=your_firebase_config
```
## 📂 Folder Structure
```bash
frontend/
│  README.md
│  package.json
│  tailwind.config.js
│  tsconfig.json
│
├── app/                # App router pages
├── components/         # UI components
├── public/             # Static assets
└── styles/             # Global styles
```