# ConsultPro — Deployment Guide

## Overview

ConsultPro is a MERN stack application with:
- **Frontend:** React + Vite (hosted on Vercel)
- **Backend:** Express + Node.js API (hosted on Render/Railway)
- **Database:** MongoDB Atlas
- **Email:** Nodemailer (SMTP)

---

## 1. Prerequisites

| Tool | Purpose | Download |
|------|---------|----------|
| Node.js v18+ | Runtime | https://nodejs.org |
| MongoDB Atlas | Database | https://cloud.mongodb.com |
| Git | Version control | https://git-scm.com |
| Docker (optional) | Containerization | https://docker.com |

---

## 2. Environment Variables

### Backend (`server/.env`)

| Variable | Required | Description |
|----------|----------|-------------|
| `MONGO_URI` | ✅ | MongoDB connection string |
| `ADMIN_TOKEN` | ✅ | Secret token for admin API auth |
| `PORT` | ❌ | Server port (default: 5000) |
| `FRONTEND_URL` | ❌ | CORS allowed origin |
| `SMTP_HOST` | ❌ | SMTP server host |
| `SMTP_PORT` | ❌ | SMTP server port |
| `SMTP_USER` | ❌ | SMTP username |
| `SMTP_PASS` | ❌ | SMTP password |
| `ADMIN_EMAIL` | ❌ | Admin notification email |

### Frontend (`src/api.js`)

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_API_URL` | ✅ | Backend API URL (e.g., `https://consultpro-api.onrender.com/api`) |

---

## 3. Frontend Deployment (Vercel)

### Steps:
1. Push code to GitHub repository
2. Go to https://vercel.com → Add New Project
3. Import your GitHub repo
4. Configure:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Root Directory:** `./` (project root)
5. Add environment variable:
   - `VITE_API_URL` = `https://your-backend-url.onrender.com/api`
6. Click **Deploy**

### Vercel Configuration (vercel.json):
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    { "source": "/((?!api/).*)", "destination": "/index.html" }
  ]
}
```

---

## 4. Backend Deployment (Render)

### Steps:
1. Push code to GitHub repository
2. Go to https://render.com → New Web Service
3. Connect your GitHub repo
4. Configure:
   - **Name:** `consultpro-api`
   - **Root Directory:** `server`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
5. Add environment variables (all from section 2 above)
6. Click **Create Web Service**

### Alternative: Deploy via `render.yaml`
```yaml
services:
  - type: web
    name: consultpro-api
    runtime: node
    rootDir: server
    buildCommand: npm install
    startCommand: npm start
    healthCheckPath: /api/health
    envVars:
      - key: NODE_ENV
        value: production
      - key: MONGO_URI
        sync: false
      - key: ADMIN_TOKEN
        generateValue: true
```

---

## 5. Docker Deployment (Alternative)

### Build the Docker image:
```bash
# From project root
docker build -t consultpro-api -f Dockerfile .
```

### Run the container:
```bash
docker run -p 5000:5000 \
  -e MONGO_URI="mongodb+srv://..." \
  -e ADMIN_TOKEN="your-token" \
  consultpro-api
```

### Deploy to cloud with Docker:
- **Railway:** `railway up`
- **Fly.io:** `fly launch`
- **AWS ECS:** Push to ECR and create service

---

## 6. Post-Deployment Checklist

- [ ] Backend health check: `GET /api/health` returns 200
- [ ] Frontend loads without errors
- [ ] Contact form submits successfully
- [ ] Newsletter signup works
- [ ] Service inquiry form works
- [ ] Admin login authenticates correctly
- [ ] Admin dashboard loads contacts, subscribers, inquiries
- [ ] Blog posts are publicly visible
- [ ] Admin can create/edit/delete blog posts
- [ ] Email notifications work (if SMTP configured)
- [ ] CORS is configured for frontend URL

---

## 7. Troubleshooting

| Problem | Solution |
|---------|----------|
| MongoDB connection fails | Whitelist IP in MongoDB Atlas Network Access |
| CORS errors | Ensure `FRONTEND_URL` is set correctly on backend |
| Admin auth fails | Verify `ADMIN_TOKEN` is same in server `.env` and client |
| Emails not sending | Check SMTP credentials (use Gmail App Password) |
| 404 on page refresh | vercel.json rewrites must be configured |

