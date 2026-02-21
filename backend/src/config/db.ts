import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config({ path: '../../.env' }); // Load env from root

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

pool.on('connect', () => {
    console.log('Connected to PostgreSQL Database');
});

export default pool;