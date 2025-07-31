-- Add indexes for NotionEmployee table
CREATE INDEX IF NOT EXISTS idx_notion_employees_email ON notion_employees(email);
CREATE INDEX IF NOT EXISTS idx_notion_employees_name ON notion_employees(name);
CREATE INDEX IF NOT EXISTS idx_notion_employees_synced_at ON notion_employees(synced_at DESC);
CREATE INDEX IF NOT EXISTS idx_notion_employees_team ON notion_employees USING GIN (team);
CREATE INDEX IF NOT EXISTS idx_notion_employees_tags ON notion_employees USING GIN (tags);

-- Add indexes for ManagerAssignment table
CREATE INDEX IF NOT EXISTS idx_manager_assignments_manager_id ON manager_assignments("managerId");
CREATE INDEX IF NOT EXISTS idx_manager_assignments_employee_id ON manager_assignments("employeeId");

-- Add indexes for UserPermission table
CREATE INDEX IF NOT EXISTS idx_user_permissions_role ON user_permissions(role);

-- Add indexes for EmployeeScorecard table
CREATE INDEX IF NOT EXISTS idx_employee_scorecards_created_by ON employee_scorecards(created_by);

-- Add composite indexes for common queries
CREATE INDEX IF NOT EXISTS idx_notion_employees_email_notion_id ON notion_employees(email, notion_id);