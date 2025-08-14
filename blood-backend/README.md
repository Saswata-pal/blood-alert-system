### `blood-backend/README.md`
```markdown
# Backend - Real-Time Blood Alert System

## 🚀 Overview
This is the **backend** of the Real-Time Blood Alert System, built with **FastAPI** and **Python**.

It handles:
- **Alert Management API**
- **Donor Management API**
- **AI/ML Modules** (Donor Ranking, Blood Shortage Forecasting, Spam Detection)
- **Notification Engine**
- **Geo-based Donor Matching**

## 🛠️ Tech Stack
- **Framework**: FastAPI
- **Database**: MongoDB Atlas
- **Auth**: Firebase Authentication
- **ML/DL**: Scikit-learn, TensorFlow/Keras
- **Notifications**: Twilio (SMS), SendGrid (Email), OneSignal (Push)

## 📦 Installation
```bash
cd blood-backend
python -m venv venv
venv\Scripts\activate   # For Windows
# source venv/bin/activate  # For Mac/Linux

pip install -r requirements.txt
```
## ▶️ Run Development Server
```bash
uvicorn main:app --reload
The backend will be available at http://localhost:8000.
```

## 🔑 Environment Variables
Create a .env file in the blood-backend/ directory with:
```bash
MONGO_URI=your_mongo_connection_string
FIREBASE_KEY=your_firebase_service_account_key
TWILIO_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
SENDGRID_API_KEY=your_sendgrid_api_key
MAPBOX_TOKEN=your_mapbox_token
```
## 📂 Folder Structure
```bash
blood-backend/
│  README.md
│  requirements.txt
│  main.py
│
├── app/
│   ├── routers/        # API routes
│   ├── models/         # Database models
│   ├── services/       # Business logic & AI models
│   └── utils/          # Helper functions
└── venv/               # Virtual environment 
```