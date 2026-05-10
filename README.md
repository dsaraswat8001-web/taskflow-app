# TaskFlow — Task Management App
**Task 2 of Internship Program | Due: May 15, 2026**

A full-stack task management web app with JWT authentication, full CRUD, priority/status filtering, responsive design, and live deployment.

## Tech Stack
- **Frontend:** React (Vite) + React Router + Axios
- **Backend:** Node.js + Express.js + JWT Auth
- **Database:** MongoDB Atlas (free tier)
- **Deployment:** Vercel (frontend) + Render (backend)

---

## 🚀 Deployment Guide

### Step 1 — MongoDB Atlas Setup
1. Go to [mongodb.com/atlas](https://www.mongodb.com/cloud/atlas) → Create free account
2. Create a **free M0 cluster** (any region)
3. **Database Access** → Add user → set username/password → remember these
4. **Network Access** → Add IP → choose **Allow Access from Anywhere** (0.0.0.0/0)
5. Click **Connect** → Drivers → copy the connection string  
   It looks like: `mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/`  
   Replace `<user>` and `<password>`, add `taskmanager` as the DB name at the end

---

### Step 2 — Deploy Backend to Render

1. Push this folder to a **GitHub repository** (make sure `server/` is at root or in a subfolder)
2. Go to [render.com](https://render.com) → New → **Web Service**
3. Connect your GitHub repo
4. Settings:
   - **Root Directory:** `server`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
   - **Environment:** Node
5. Add **Environment Variables**:
   ```
   MONGODB_URI = mongodb+srv://...your full URI...
   JWT_SECRET  = anyLongRandomStringHere12345!
   CLIENT_URL  = https://your-frontend.vercel.app   (add after Vercel deploy)
   PORT        = 5000
   ```
6. Click **Deploy** → Wait for "Live" status
7. Copy your Render URL: `https://taskflow-server-xxxx.onrender.com`

> ⚠️ Free Render services sleep after 15 min inactivity. First request may take ~30 sec.

---

### Step 3 — Deploy Frontend to Vercel

1. Go to [vercel.com](https://vercel.com) → New Project → Import your GitHub repo
2. Settings:
   - **Root Directory:** `client`
   - **Framework:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
3. Add **Environment Variable**:
   ```
   VITE_API_URL = https://taskflow-server-xxxx.onrender.com
   ```
   *(Use your actual Render URL from Step 2)*
4. Click **Deploy** → Copy your Vercel URL

5. Go back to **Render** → Update `CLIENT_URL` env var → Redeploy

---

### Step 4 — Test Your App
- Visit your Vercel URL
- Register a new account
- Create, edit, delete tasks
- Filter by status/priority
- Click the circle button to cycle task status

---

## Local Development

### Backend
```bash
cd server
cp .env.example .env
# Fill in your MONGODB_URI and JWT_SECRET in .env
npm install
npm run dev
```

### Frontend
```bash
cd client
cp .env.example .env
# VITE_API_URL=http://localhost:5000 for local dev
npm install
npm run dev
```

---

## Features
- ✅ JWT Authentication (register / login / protected routes)
- ✅ Full CRUD for tasks
- ✅ Status: To Do → In Progress → Done (click circle to cycle)
- ✅ Priority levels: High / Medium / Low
- ✅ Due dates with overdue warnings
- ✅ Tags support
- ✅ Search and filter by status + priority
- ✅ Stats bar with completion progress
- ✅ Responsive mobile design
- ✅ Dark editorial UI
