# Full-Stack Portfolio Application

A modern, responsive full-stack portfolio application built with **React + Vite** (Frontend) and **Node.js + Express** (Backend).

---

## 📁 Repository Directory Structure

```
Portfolio-React/
├── portfolio-react/      # React + Vite Frontend Application
│   ├── .env              # Frontend environment configuration
│   ├── .env.example      # Example frontend env
│   ├── package.json      # Frontend dependencies & scripts
│   ├── vite.config.js    # Vite configuration & API proxy setup
│   └── src/              # React components, pages, & styling
│
└── server/               # Node.js + Express Backend Server
    ├── .env              # Backend environment configuration
    ├── .env.example      # Example backend env
    ├── index.js          # Express server & API route handlers
    ├── package.json      # Backend dependencies & scripts
    ├── portfolio_api.postman_collection.json # Exported Postman collection
    └── data/
        ├── projects.json # JSON database for projects
        └── contacts.json # JSON database for contact form submissions
```

---

## ⚙️ Setup & Execution Instructions

To run this application, launch the backend and frontend servers in two separate terminal windows.

### Terminal 1: Express Backend Server
```bash
# Navigate to the backend folder
cd server

# Install dependencies (if first time)
npm install

# Launch backend in dev mode
npm run dev
```
*The backend server will run on `http://localhost:5000`.*

---

### Terminal 2: React Frontend Application
```bash
# Navigate to the frontend folder
cd portfolio-react

# Install dependencies (if first time)
npm install

# Launch React frontend
npm run dev
```
*The React frontend will run on `http://localhost:5173`.*

---

## 📡 REST API Endpoints Overview

| Method | Endpoint | Description | Status Code |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | Health check endpoint returning API status | `200 OK` |
| `GET` | `/api/projects` | Fetch all personal projects | `200 OK` |
| `GET` | `/api/projects/:id` | Fetch details for a specific project by ID | `200 OK` / `404 Not Found` |
| `POST` | `/api/contact` | Submit contact form (`name`, `email`, `message`) | `201 Created` / `400 Bad Request` |
| `GET` | `/api/contact` | Fetch all saved contact form submissions | `200 OK` |

---

## 🧪 Testing API Endpoints (cURL / Postman)

### Postman Collection
Import the pre-configured Postman Collection located at:
`server/portfolio_api.postman_collection.json`

### cURL Commands
- **Health check**:
  ```bash
  curl -X GET http://localhost:5000/
  ```
- **Get all projects**:
  ```bash
  curl -X GET http://localhost:5000/api/projects
  ```
- **Get project by ID**:
  ```bash
  curl -X GET http://localhost:5000/api/projects/nexora
  ```
- **Submit valid contact form**:
  ```bash
  curl -X POST http://localhost:5000/api/contact \
    -H "Content-Type: application/json" \
    -d '{"name":"Alex","email":"alex@example.com","message":"Great portfolio!"}'
  ```
- **Submit invalid contact form (triggers HTTP 400)**:
  ```bash
  curl -X POST http://localhost:5000/api/contact \
    -H "Content-Type: application/json" \
    -d '{"name":"","email":"invalid","message":""}'
  ```
- **Get submitted contact messages**:
  ```bash
  curl -X GET http://localhost:5000/api/contact
  ```
