-- Enable UUID extension for secure IDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users Table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user', -- 'admin' or 'user'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Records Table (The data users manage)
CREATE TABLE records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    data JSONB, -- Flexible storage for different data types
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Activity Logs (Audit Trail)
CREATE TABLE activity_logs (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    action VARCHAR(255) NOT NULL,
    details JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);