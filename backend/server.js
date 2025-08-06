const express = require('express');
const cors = require('cors');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const USERS_FILE = './users.json';

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Helper to read users
function readUsers() {
  if (!fs.existsSync(USERS_FILE)) return [];
  const data = fs.readFileSync(USERS_FILE, 'utf-8');
  return JSON.parse(data || '[]');
}

// Helper to write users
function writeUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

// Signup
app.post('/api/signup', (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  const users = readUsers();

  if (users.find((u) => u.email === email)) {
    return res.status(409).json({ message: 'Email already exists' });
  }

  const hash = bcrypt.hashSync(password, 8);

  users.push({ firstName, lastName, email, password: hash });
  writeUsers(users);

  res.status(201).json({ message: 'Signup successful' });
});

// Login
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  const users = readUsers();
  const user = users.find((u) => u.email === email);

  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const valid = bcrypt.compareSync(password, user.password);
  if (!valid) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // For basic demo, return success and user info minus password
  const { password: pwd, ...userData } = user;
  res.json({ message: 'Login successful', user: userData });
});

const RECORDS_FILE = './records.json';

// Helper to read records
function readRecords() {
  if (!fs.existsSync(RECORDS_FILE)) return [];
  const data = fs.readFileSync(RECORDS_FILE, 'utf8');
  return JSON.parse(data || '[]');
}

// API: GET record by email
app.get('/api/record/:email', (req, res) => {
  const email = req.params.email.toLowerCase();
  const records = readRecords();
  const record = records.find(r => r.email.toLowerCase() === email);
  if (record) {
    res.json(record);
  } else {
    res.status(404).json({ message: 'Record not found' });
  }
});

app.post('/api/record', (req, res) => {
  const newRecord = req.body;
  let records = [];
  if (fs.existsSync(RECORDS_FILE)) {
    records = JSON.parse(fs.readFileSync(RECORDS_FILE, 'utf-8') || '[]');
  }
  // Prevent duplicate by email
  if (records.some(r => r.email && r.email.toLowerCase() === (newRecord.email || '').toLowerCase())) {
    return res.status(409).json({message: "Record with this email already exists"});
  }
  records.push(newRecord);
  fs.writeFileSync(RECORDS_FILE, JSON.stringify(records, null, 2));
  res.json({message: "Record added"});
});

app.listen(5000, () => console.log('API running on PORT: 5000'));
