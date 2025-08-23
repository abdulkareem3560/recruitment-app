require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const { MongoClient } = require('mongodb');

const app = express();
app.use(cors());
app.use(express.json());

const MONGO_URI = process.env.MONGO_URI; // from .env
const DB_NAME = 'recruitment';            // change as desired
const USERS_COLLECTION = 'users';
const RECORDS_COLLECTION = 'records';

let client, db;
async function connectToDb() {
  if (!client || !client.topology?.isConnected()) {
    client = new MongoClient(MONGO_URI);
    await client.connect();
    db = client.db(DB_NAME);
    console.log('✅ Connected to MongoDB Atlas');
  }
}

// ======= AUTH ROUTES ======= //

// Signup
app.post('/api/signup', async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password are required' });

    await connectToDb();
    const existing = await db.collection(USERS_COLLECTION).findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ message: 'Email already exists' });
    }

    const hash = bcrypt.hashSync(password, 8);
    await db.collection(USERS_COLLECTION).insertOne({
      firstName,
      lastName,
      email: email.toLowerCase(),
      password: hash
    });

    res.status(201).json({ message: 'Signup successful' });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    await connectToDb();

    const user = await db.collection(USERS_COLLECTION).findOne({ email: email.toLowerCase() });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const valid = bcrypt.compareSync(password, user.password);
    if (!valid) return res.status(401).json({ message: 'Invalid credentials' });

    const { password: pwd, ...userData } = user;
    res.json({ message: 'Login successful', user: userData });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ======= RECORD ROUTES ======= //

// GET record by email
app.get('/api/record/:email', async (req, res) => {
  try {
    await connectToDb();
    const email = req.params.email.toLowerCase();
    const record = await db.collection(RECORDS_COLLECTION).findOne({ email });
    if (!record) return res.status(404).json({ message: 'Record not found' });
    res.json(record);
  } catch (err) {
    console.error('Get record error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add new record (prevent duplicate by email)
app.post('/api/record', async (req, res) => {
  try {
    await connectToDb();
    const newRecord = req.body;
    if (!newRecord.email) {
      return res.status(400).json({ message: 'Email is required' });
    }
    const emailLower = newRecord.email.toLowerCase();

    const existing = await db.collection(RECORDS_COLLECTION).findOne({ email: emailLower });
    if (existing) {
      return res.status(409).json({ message: 'Record with this email already exists' });
    }

    await db.collection(RECORDS_COLLECTION).insertOne({
      ...newRecord,
      email: emailLower
    });

    res.json({ message: 'Record added' });
  } catch (err) {
    console.error('Add record error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get("/ping", (req, res) => {
  res.send("Server is running");
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
