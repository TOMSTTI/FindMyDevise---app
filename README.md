# FindMyDevice - Real-Time Location Sharing App

A modern, real-time location sharing web application built with React, Node.js, Express, Socket.io, MongoDB, and the Google Maps API.

## Features
- **Real-Time Tracking**: WebSockets (Socket.io) enable instant location updates across connected clients.
- **Secure Authentication**: JWT-based secure login and registration.
- **Privacy First**: Explicit user consent is required before sharing location. Users can stop tracking at any time.
- **Premium UI/UX**: Dark mode aesthetic, glassmorphism components, and smooth micro-animations.
- **Location History**: Automatic logging of past locations.
- **Docker Support**: Fully containerized using Docker and Docker Compose.

---

## 🛠️ Tech Stack
- **Frontend**: React (Vite), React Router, `@vis.gl/react-google-maps`, Socket.io-client, Vanilla CSS.
- **Backend**: Node.js, Express, MongoDB (Mongoose), Socket.io, JWT, bcrypt.

---

## 🚀 Getting Started Locally (Docker)

The easiest way to run the application is using Docker.

### Prerequisites
- Docker and Docker Compose installed.
- A Google Maps API Key.

### Steps
1. Clone the repository.
2. Setup environment variables:
   - In `backend/`, copy `.env.example` to `.env` and fill in the values.
   - In `frontend/`, copy `.env.example` to `.env` and add your Google Maps API Key.
3. From the root directory, run:
   ```bash
   docker-compose up --build
   ```
4. Access the frontend at `http://localhost:5173` and the backend at `http://localhost:5000`.

---

## 💻 Manual Setup

If you prefer running without Docker:

### Backend Setup
1. `cd backend`
2. `npm install`
3. Setup `.env` file based on `.env.example` (Make sure you have a local MongoDB running or an Atlas URI).
4. `npm run dev`

### Frontend Setup
1. `cd frontend`
2. `npm install`
3. Setup `.env` file with `VITE_GOOGLE_MAPS_API_KEY`.
4. `npm run dev`

---

## ☁️ Deployment (Render / Vercel)

### 1. Backend Deployment (Render)
Render is an excellent platform for deploying Node.js apps with WebSockets.
1. Create a new **Web Service** on Render.
2. Connect your GitHub repository.
3. Set the Root Directory to `backend`.
4. Build Command: `npm install`
5. Start Command: `npm start`
6. Add Environment Variables:
   - `MONGO_URI` (Use MongoDB Atlas URI)
   - `JWT_SECRET` (A strong random string)
   - `FRONTEND_URL` (Your deployed Vercel frontend URL, e.g., `https://findmydevice.vercel.app`)

### 2. Frontend Deployment (Vercel)
Vercel is optimized for Vite and React apps.
1. Import your repository into Vercel.
2. Set the Framework Preset to **Vite**.
3. Set the Root Directory to `frontend`.
4. Add Environment Variables:
   - `VITE_API_URL` (Your Render backend URL, e.g., `https://your-backend.onrender.com`)
   - `VITE_GOOGLE_MAPS_API_KEY` (Your Google Maps Key)
5. Deploy.

---

## 🔐 Privacy & Security
- Passwords are encrypted using bcrypt.
- Session management is handled securely via JSON Web Tokens.
- The `isTracking` consent flag is respected universally. Location is neither tracked locally nor emitted to the Socket room if consent is revoked.
# FindMyDevise---app
# FindMyDevise---app
