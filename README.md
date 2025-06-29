# Homework Helper for Busy Parents

**Live Demo:** [eduedge.netlify.app](https://eduedge.netlify.app)

---

## Overview
Homework Helper is a full-stack MERN application with AI-powered chat, M-Pesa subscription, and professional user profile management. It is designed to help busy parents get instant, AI-driven homework support for their children.

---

## Features
- **AI Chat:** Ask homework questions and get instant answers powered by Cohere AI (via a Python microservice).
- **M-Pesa Subscription:** Secure mobile payments for premium access using Safaricom Daraja API.
- **User Profiles:** View and edit your profile, change password, and upload an avatar.
- **Responsive UI:** Modern, mobile-friendly design with professional feedback and error handling.
- **Admin/Pro Features:** (Optional) Extendable for more roles and features.

---

## Live Links
- **Frontend:** [eduedge.netlify.app](https://eduedge.netlify.app)
- **Backend API:** [Render Node.js Service](https://homework-helper-backend.onrender.com)
- **AI Python Service:** [Render Python Service](https://ai-python-service.onrender.com)

---

## Tech Stack
- **Frontend:** React, Axios, Netlify
- **Backend:** Node.js, Express, MongoDB, Mongoose, Render
- **AI Service:** Python (Flask, Cohere, python-dotenv), Render
- **Payments:** M-Pesa Daraja API

---

## Project Structure
- `/server` — Node.js/Express backend (MongoDB, AI, payments, REST API)
- `/client` — React frontend (chat UI, image/question input, payments, auth)

---

## Quick Start

### 1. Local Development
- Backend: `cd server && npm install && npm run dev`
- Frontend: `cd client && npm install && npm start`

### 2. Deployment
- Frontend: Deploy `/client` to Netlify
- Backend: Deploy `/server` to Render/Heroku

### 3. Environment Variables
- See `.env.example` files in both `/server` and `/client`

---

## Guides
- See below for detailed setup, GitHub, and deployment instructions (to be filled as project is built)

---

## Local Development

### 1. Clone the Repos
```
git clone <your-mern-repo>
git clone <your-ai-python-service-repo>
```

### 2. Environment Variables
- Set up `.env` files for both backend and Python service (see `.env.example` in each).
- **Important:** Never commit real API keys or secrets to GitHub.

### 3. Start the Python AI Service
```
cd ai-python-service
pip install -r requirements.txt
python app.py
```

### 4. Start the Backend
```
cd server
npm install
npm run dev
```

### 5. Start the Frontend
```
cd client
npm install
npm start
```

---

## Deployment

### Frontend (Netlify)
- Deploy the `client` folder to Netlify.
- Set `REACT_APP_API_URL` in Netlify environment variables to your backend Render URL.

### Backend (Render)
- Deploy the `server` folder to Render as a Node.js web service.
- Set all environment variables in the Render dashboard (see `.env`).
- Set `PYTHON_AI_URL` to your deployed Python service URL.

### Python AI Service (Render)
- Deploy the `ai-python-service` folder to Render as a Python web service.
- Set `COHERE_API_KEY` in the Render dashboard.

---

## API Endpoints

### Backend (Node.js)
- `POST /api/chat` — Ask a question (calls Python AI service)
- `POST /api/subscribe` — Start M-Pesa subscription
- `POST /api/mpesa/callback` — M-Pesa payment callback
- `GET /api/subscription/:userId` — Get subscription status
- `GET /api/user/:id` — Get user profile
- `PUT /api/user/:id` — Update user profile
- `PUT /api/user/:id/password` — Change password

### Python AI Service
- `POST /chat` — AI question/answer endpoint

---

## Environment Variables

### Backend
- `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL`, `PYTHON_AI_URL`, etc.
- `MPESA_CONSUMER_KEY`, `MPESA_CONSUMER_SECRET`, `MPESA_SHORTCODE`, `MPESA_PASSKEY`, `MPESA_CALLBACK_URL`

### Python AI Service
- `COHERE_API_KEY`

---

## Security
- All secrets and API keys must be set in environment variables (never in code or public repos).
- Use HTTPS for all deployed services.

---

## Credits
- Built by [Your Name/Team].
- AI powered by Cohere.
- Payments powered by Safaricom M-Pesa Daraja API.

---

## License
MIT (or your preferred license)
