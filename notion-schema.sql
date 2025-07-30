-- Notion Database Schema for PostgreSQL
-- Generated from: Global Token Avengers

CREATE TABLE notion_employees (
  id SERIAL PRIMARY KEY,
  notion_id VARCHAR(255) UNIQUE NOT NULL,
  level FLOAT,
  step FLOAT,
  tenure TEXT,
  team JSONB,
  manages JSONB,
  phone VARCHAR(255),
  location_factor TEXT,
  notion_account JSONB,
  step_factor TEXT,
  reports_to JSONB,
  skills JSONB,
  tags JSONB,
  level_factor TEXT,
  billable_rate FLOAT,
  start_date TIMESTAMP,
  timezone VARCHAR(255),
  group JSONB,
  total_salary TEXT,
  email VARCHAR(255),
  position VARCHAR(255),
  profile JSONB,
  base_salary FLOAT,
  name VARCHAR(255),
  synced_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for better query performance
CREATE INDEX idx_notion_employees_notion_id ON notion_employees(notion_id);
CREATE INDEX idx_notion_employees_synced_at ON notion_employees(synced_at);