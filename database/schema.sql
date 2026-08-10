
-- AI Grievance Management System
-- Database Schema (SQLite)


PRAGMA foreign_keys = ON;


-- USERS TABLE


CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT UNIQUE,
    password TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'user'
        CHECK(role IN ('user', 'admin')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- DEPARTMENTS TABLE


CREATE TABLE IF NOT EXISTS departments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    department_name TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- COMPLAINTS TABLE


CREATE TABLE IF NOT EXISTS complaints (
    id INTEGER PRIMARY KEY AUTOINCREMENT,

    user_id INTEGER NOT NULL,

    title TEXT NOT NULL,

    description TEXT NOT NULL,

    image_path TEXT,

    category TEXT
        CHECK(category IN (
            'Road',
            'Water',
            'Electricity',
            'Garbage',
            'Sewer',
            'Street Light',
            'Illegal Parking',
            'Other'
        )),

    priority TEXT
        CHECK(priority IN (
            'Low',
            'Medium',
            'High'
        )),

    department_id INTEGER,

    status TEXT NOT NULL DEFAULT 'Pending'
        CHECK(status IN (
            'Pending',
            'In Progress',
            'Resolved'
        )),

    severity TEXT NOT NULL DEFAULT 'Medium'
        CHECK(severity IN (
            'Low',
            'Medium',
            'High'
        )),

    location TEXT,

    latitude REAL,

    longitude REAL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY(user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    FOREIGN KEY(department_id)
        REFERENCES departments(id)
        ON DELETE SET NULL
);


-- COMPLAINT HISTORY TABLE


CREATE TABLE IF NOT EXISTS complaint_history (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    complaint_id INTEGER NOT NULL,

    updated_by INTEGER NOT NULL,

    old_status TEXT
    CHECK(old_status IN ('Pending', 'In Progress', 'Resolved')),

    new_status TEXT NOT NULL
    CHECK(new_status IN ('Pending', 'In Progress', 'Resolved')),

    title TEXT NOT NULL,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY(complaint_id)
        REFERENCES complaints(id)
        ON DELETE CASCADE,

    FOREIGN KEY(updated_by)
        REFERENCES users(id)
        ON DELETE CASCADE
);


-- INDEXES


CREATE INDEX IF NOT EXISTS idx_user_email
ON users(email);

CREATE INDEX IF NOT EXISTS idx_complaint_status
ON complaints(status);

CREATE INDEX IF NOT EXISTS idx_department
ON complaints(department_id);

CREATE INDEX IF NOT EXISTS idx_priority
ON complaints(priority);