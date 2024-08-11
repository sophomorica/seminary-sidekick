-- Connect to the seminary_sidekick database
\c seminary_sidekick;

-- Create enum type for TestamentEnum
CREATE TYPE testament_enum AS ENUM ('New Testament', 'Old Testament', 'Book of Mormon', 'Doctrine and Covenants');

-- Modify existing testaments table to use the new enum
ALTER TABLE testaments
ALTER COLUMN name TYPE testament_enum USING name::testament_enum;

-- Create DoctrinalMasteries table (if not exists)
CREATE TABLE IF NOT EXISTS doctrinal_masteries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    reference VARCHAR(255) NOT NULL,
    hint TEXT NOT NULL,
    passage TEXT NOT NULL,
    testament_id INTEGER REFERENCES testaments(id)
);

-- Create Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL
);

-- Create Games table
CREATE TABLE games (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL UNIQUE
);

-- Create UserProgress table
CREATE TABLE user_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    doctrinal_mastery_id UUID REFERENCES doctrinal_masteries(id),
    memorized BOOLEAN DEFAULT FALSE,
    mastered BOOLEAN DEFAULT FALSE
);

-- Create GameScores table
CREATE TABLE game_scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    game_id UUID REFERENCES games(id),
    score INTEGER NOT NULL,
    completed_at TIMESTAMP NOT NULL
);

-- Verify the table creation
\dt

-- Display table schemas
\d testaments
\d doctrinal_masteries
\d users
\d games
\d user_progress
\d game_scores
