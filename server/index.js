import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables from .env
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const DEFAULT_PORT = parseInt(process.env.PORT, 10) || 5000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173';
const DATA_FILE_PATH = process.env.DATA_FILE_PATH || './data/projects.json';
const CONTACTS_FILE_PATH = process.env.CONTACTS_FILE_PATH || './data/contacts.json';

// Middleware
app.use(cors({
  origin: CLIENT_ORIGIN,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Helper functions for data access
const getProjectsFilePath = () => path.resolve(__dirname, DATA_FILE_PATH);
const getContactsFilePath = () => path.resolve(__dirname, CONTACTS_FILE_PATH);

const readProjects = () => {
  try {
    const filePath = getProjectsFilePath();
    if (!fs.existsSync(filePath)) {
      return [];
    }
    const rawData = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(rawData);
  } catch (error) {
    console.error('Error reading projects data:', error);
    throw new Error('Failed to read projects data file.');
  }
};

const readContacts = () => {
  try {
    const filePath = getContactsFilePath();
    if (!fs.existsSync(filePath)) {
      return [];
    }
    const rawData = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(rawData);
  } catch (error) {
    console.error('Error reading contacts data:', error);
    return [];
  }
};

const saveContact = (newContact) => {
  try {
    const filePath = getContactsFilePath();
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const contacts = readContacts();
    contacts.push(newContact);
    fs.writeFileSync(filePath, JSON.stringify(contacts, null, 2), 'utf-8');
    return newContact;
  } catch (error) {
    console.error('Error saving contact data:', error);
    throw new Error('Failed to save contact submission.');
  }
};

// 1. Health check route
app.get('/', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Portfolio Backend API is running' });
});

// 2. GET /api/projects -> Returns all projects
app.get('/api/projects', (req, res, next) => {
  try {
    const projects = readProjects();
    res.status(200).json(projects);
  } catch (error) {
    next(error);
  }
});

// 2. GET /api/projects/:id -> Returns one project by ID
app.get('/api/projects/:id', (req, res, next) => {
  try {
    const { id } = req.params;
    const projects = readProjects();
    const project = projects.find((p) => p.id === id);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.status(200).json(project);
  } catch (error) {
    next(error);
  }
});

// 3. POST /api/contact -> Validate and save contact submission
app.post('/api/contact', (req, res, next) => {
  try {
    const { name, email, message } = req.body || {};
    const validationErrors = {};

    if (!name || typeof name !== 'string' || name.trim() === '') {
      validationErrors.name = 'Name is required.';
    }

    if (!email || typeof email !== 'string' || email.trim() === '') {
      validationErrors.email = 'Email is required.';
    } else if (!email.includes('@') || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      validationErrors.email = 'Please provide a valid email address.';
    }

    if (!message || typeof message !== 'string' || message.trim() === '') {
      validationErrors.message = 'Message is required.';
    }

    if (Object.keys(validationErrors).length > 0) {
      return res.status(400).json({
        error: 'Validation failed',
        details: validationErrors
      });
    }

    const newContact = {
      id: Date.now().toString(),
      name: name.trim(),
      email: email.trim(),
      message: message.trim(),
      createdAt: new Date().toISOString()
    };

    saveContact(newContact);

    res.status(201).json({
      message: 'Contact form submitted successfully.',
      contact: newContact
    });
  } catch (error) {
    next(error);
  }
});

// 4. GET /api/contact -> See all submitted contacts
app.get('/api/contact', (req, res, next) => {
  try {
    const contacts = readContacts();
    res.status(200).json(contacts);
  } catch (error) {
    next(error);
  }
});

// 5. Unknown routes -> JSON 404 response
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.originalUrl} not found` });
});

// 5. Global Error Handling Middleware -> JSON 500 response
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message || 'An unexpected error occurred on the server.'
  });
});

// Start Server with EADDRINUSE Port Handling
const startServer = (portToUse) => {
  const server = app.listen(portToUse, () => {
    console.log(`\n==================================================`);
    console.log(`🚀 Portfolio Backend Server is RUNNING!`);
    console.log(`📡 URL: http://localhost:${portToUse}`);
    console.log(`🌐 Allowed CORS Origin: ${CLIENT_ORIGIN}`);
    console.log(`==================================================\n`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`\n⚠️  Port ${portToUse} is already in use by another process.`);
      const nextPort = Number(portToUse) + 1;
      console.log(`🔄 Attempting to start server on fallback port ${nextPort}...\n`);
      startServer(nextPort);
    } else {
      console.error('Server startup error:', err);
    }
  });
};

startServer(DEFAULT_PORT);
