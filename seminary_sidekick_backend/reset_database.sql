-- Drop the existing database if it exists
DROP DATABASE IF EXISTS seminary_sidekick;

-- Create a new database
CREATE DATABASE seminary_sidekick;

-- Connect to the new database
\c seminary_sidekick;

-- Create the Testaments table
CREATE TABLE testaments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE
);

-- Create the DoctrinalMasteries table
CREATE TABLE doctrinal_masteries (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    reference VARCHAR(255) NOT NULL,
    hint TEXT NOT NULL,
    passage TEXT,
    testament_id INTEGER REFERENCES testaments(id)
);

-- Insert the Testament data
INSERT INTO testaments (name) VALUES
('Old Testament'),
('New Testament'),
('Book of Mormon'),
('Doctrine and Covenants');

-- Verify the insertion
SELECT * FROM testaments;
