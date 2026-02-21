import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { register, login, createRecord, getRecords } from './controllers/main.controller';
import { verifyToken, verifyAdmin } from './middlewares/auth.middleware';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.post('/api/auth/register', register);
app.post('/api/auth/login', login);

// Protected Routes
app.post('/api/records', verifyToken, createRecord);
app.get('/api/records', verifyToken, getRecords);

// Admin Only Route Example
app.get('/api/admin/stats', verifyAdmin, (req, res) => {
    res.json({ msg: "This is admin only data" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Backend running on port ${PORT}`);
});