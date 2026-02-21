import { Request, Response } from 'express';
import pool from '../config/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import { AuthRequest } from '../middlewares/auth.middleware';

// REGISTER
export const register = async (req: Request, res: Response) => {
    const { email, password, role } = req.body;
    const hash = await bcrypt.hash(password, 10);
    
    try {
        const result = await pool.query(
            'INSERT INTO users (email, password_hash, role) VALUES ($1, $2, $3) RETURNING id, email, role',
            [email, hash, role || 'user']
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'User already exists or DB error' });
    }
};

// LOGIN
export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    
    if (result.rows.length === 0) return res.status(400).json({ error: 'User not found' });

    const user = result.rows[0];
    const validPass = await bcrypt.compare(password, user.password_hash);
    
    if (!validPass) return res.status(400).json({ error: 'Invalid password' });

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET as string, { expiresIn: '1h' });
    res.json({ token, role: user.role });
};

// CREATE RECORD + TRIGGER AUTOMATION
export const createRecord = async (req: AuthRequest, res: Response) => {
    const { title, data } = req.body;
    const userId = req.user.id;

    try {
        // 1. Create Record
        const record = await pool.query(
            'INSERT INTO records (user_id, title, data) VALUES ($1, $2, $3) RETURNING *',
            [userId, title, data]
        );

        // 2. Log Activity
        await pool.query(
            'INSERT INTO activity_logs (user_id, action, details) VALUES ($1, $2, $3)',
            [userId, 'CREATE_RECORD', { recordId: record.rows[0].id }]
        );

        // 3. Trigger n8n Automation (Fire and Forget)
        // Note: The URL assumes n8n is running in Docker and reachable
        // If running backend locally and n8n in docker, use http://localhost:5678/webhook/...
        const n8nUrl = 'http://localhost:5678/webhook/new-record-trigger'; 
        
        axios.post(n8nUrl, {
            event: 'NEW_RECORD',
            record: record.rows[0],
            user_id: userId
        }).catch(err => console.error("n8n Trigger Failed:", err.message));

        res.json(record.rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Database error' });
    }
};
// GET RECORDS
export const getRecords = async (req: AuthRequest, res: Response) => {
    const userId = req.user.id;
    const result = await pool.query('SELECT * FROM records WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
    res.json(result.rows);
};