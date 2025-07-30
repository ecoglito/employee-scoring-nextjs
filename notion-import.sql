-- Notion Employee Data Import
-- Generated: 2025-07-30T01:05:10.821Z
-- Records: 17

INSERT INTO notion_employees (
  notion_id, name, position, email, phone, level, step, team, skills, tags, "group", 
  base_salary, billable_rate, start_date, timezone, reports_to, manages, profile, 
  notion_account, tenure, location_factor, step_factor, level_factor, total_salary, 
  synced_at, created_at, updated_at
) VALUES (
  '23bb3298-c3ce-807c-9901-d38fab5de04f', 'Arnie Goldberg', 'Head of Design', 'oliver@liquidlabs.inc', NULL, NULL, NULL, '["Product"]'::jsonb, '[]'::jsonb, '["UI/UX","Mobile","Brand","Creative"]'::jsonb, '["PSG"]'::jsonb, NULL, NULL, NULL, 'EST', '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, NULL, 'Error: Unknown Location', '0.970873786408', '0.869565217391', NULL,
  NOW(), NOW(), NOW()
) ON CONFLICT (notion_id) DO UPDATE SET
  name = EXCLUDED.name,
  position = EXCLUDED.position,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  level = EXCLUDED.level,
  step = EXCLUDED.step,
  team = EXCLUDED.team,
  skills = EXCLUDED.skills,
  tags = EXCLUDED.tags,
  "group" = EXCLUDED."group",
  base_salary = EXCLUDED.base_salary,
  billable_rate = EXCLUDED.billable_rate,
  start_date = EXCLUDED.start_date,
  timezone = EXCLUDED.timezone,
  reports_to = EXCLUDED.reports_to,
  manages = EXCLUDED.manages,
  profile = EXCLUDED.profile,
  notion_account = EXCLUDED.notion_account,
  tenure = EXCLUDED.tenure,
  location_factor = EXCLUDED.location_factor,
  step_factor = EXCLUDED.step_factor,
  level_factor = EXCLUDED.level_factor,
  total_salary = EXCLUDED.total_salary,
  synced_at = NOW(),
  updated_at = NOW();

INSERT INTO notion_employees (
  notion_id, name, position, email, phone, level, step, team, skills, tags, "group", 
  base_salary, billable_rate, start_date, timezone, reports_to, manages, profile, 
  notion_account, tenure, location_factor, step_factor, level_factor, total_salary, 
  synced_at, created_at, updated_at
) VALUES (
  '23bb3298-c3ce-8001-ab45-d06c2ba09c20', 'Oliver Adams', 'SWE Intern', 'oliver@liquidlabs.inc', NULL, NULL, NULL, '["Backend"]'::jsonb, '[]'::jsonb, '["APIs & SDKs"]'::jsonb, '["Engineering"]'::jsonb, NULL, NULL, NULL, 'EST', '["239b3298-c3ce-81cf-a972-f4573ea2e4e7"]'::jsonb, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, NULL, 'Error: Unknown Location', '0.970873786408', '0.869565217391', NULL,
  NOW(), NOW(), NOW()
) ON CONFLICT (notion_id) DO UPDATE SET
  name = EXCLUDED.name,
  position = EXCLUDED.position,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  level = EXCLUDED.level,
  step = EXCLUDED.step,
  team = EXCLUDED.team,
  skills = EXCLUDED.skills,
  tags = EXCLUDED.tags,
  "group" = EXCLUDED."group",
  base_salary = EXCLUDED.base_salary,
  billable_rate = EXCLUDED.billable_rate,
  start_date = EXCLUDED.start_date,
  timezone = EXCLUDED.timezone,
  reports_to = EXCLUDED.reports_to,
  manages = EXCLUDED.manages,
  profile = EXCLUDED.profile,
  notion_account = EXCLUDED.notion_account,
  tenure = EXCLUDED.tenure,
  location_factor = EXCLUDED.location_factor,
  step_factor = EXCLUDED.step_factor,
  level_factor = EXCLUDED.level_factor,
  total_salary = EXCLUDED.total_salary,
  synced_at = NOW(),
  updated_at = NOW();

INSERT INTO notion_employees (
  notion_id, name, position, email, phone, level, step, team, skills, tags, "group", 
  base_salary, billable_rate, start_date, timezone, reports_to, manages, profile, 
  notion_account, tenure, location_factor, step_factor, level_factor, total_salary, 
  synced_at, created_at, updated_at
) VALUES (
  '239b3298-c3ce-81bb-971f-e092bb0fda81', 'Enzo Coglitore', 'CEO & Co-Founder', 'enzo@liquidlabs.inc', NULL, 4, 2, '["Exec"]'::jsonb, '["Coaching","Mentoring","Solution architecture","Strategy","Vision"]'::jsonb, '[]'::jsonb, '["PSG","Engineering"]'::jsonb, 110000, 250, '2021-04-12'::timestamp, 'EST', '[]'::jsonb, '[]'::jsonb, '[{"name":"undraw_Male_avatar_g98d.png","url":"https://prod-files-secure.s3.us-west-2.amazonaws.com/a530306f-69b8-4a7e-9383-a7399d20fcc7/4f8bf235-2627-45ac-8daa-b37543e9e99f/undraw_Male_avatar_g98d.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46656C37XKO%2F20250730%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20250730T010510Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIj%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIBfxZwWD1x3wSTdgJI35lgZ8KpuFgVOp8ectko6T3CxPAiEAgAh%2Bo5fIGhOBXcd%2BTDi1UeTW9j3Zx6v%2BfExXt8d5ERUqiAQIsf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDGb%2FWla5I7CB%2B0tinyrcA%2FYtJEz3Z%2Fo0CvgyXW3T9U%2Bz79sogeB8OKxgB4Sch3vsVy%2BYB7anz34zY6rGgUEvXxyPoqQaWRnSFnBASnL4FbFNF7hhobyplXte9KUKm9J156X1A755yTK7DveTZm9spJyW1XRaxdk2hB5JRX9eH6VM9V1dUyQXfUavZtljqmfQXyhbtqUrIrPCoaF0UTchE90HP8h8I0miDr6gdeuG3KQy0qWqi0Pt0%2FNkhbNs5vHDE5qWugfkIx8zD9of5z2%2FmrVu%2FARdO26GMLzpyc%2BgyvQ65lmuJ3JOq4DeSdifEdqxXOXoWTfN69sZRcJY2Ng6NBjBdJThZpC8gco80uH9uCnAs95XgPnyJFSfMVH%2FpUWfd8PX%2Bb2LCpCtcr1CYk8oX1042w0Pb%2BIpU4eT%2BcmK6RdeIpnIQi4EhhgxA7uuKiXFgOvmCb%2Bi3Pd5SyIG1i7LXx%2BwICqh8Iv1MV%2BUhbXi9CY%2Bhh902na2F2c4kp2l6ioN3Y623robXSXuKj8w8Gq9CQmhHDvKWOoI0Z937vbAgxJl0WGIMfST6IyT3sT3S%2BNdViutaq%2BPudSwiy7zy0%2BeFub1uG6gJE2YWIVvp4jhETbEhC%2BcW8sDccz8%2BGvvECUd1lQEq2r3jZ5zofMbMIq4pcQGOqUBZ9taYBvfeCwqxiw7WEpPw4vAB8vW45W8VxMl0oxSocFqDuS1eWhLfIZwwNL2X65EBuHF7gFBvZTt%2FFQqtG050hR6Kn6x7Q3UWr8R90%2FW4wXsvEWSoxNi5TSw6jkMxgRSysS8Jw0JY%2BdIUdxMhvjaoWi9Z5ybcj%2BWbwklIeZQ05NkywUdvja%2FXugPNaw6cl80Rr%2FzNECXhizwlA94gvKKHj73wsGp&X-Amz-Signature=7e26f0390167be46b0f41d92af85db9fb9efe572d9f1c8bbcb9a4a1623d9dbb0&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject"}]'::jsonb, '[]'::jsonb, '4.3 years', 'Error: Unknown Location', '1.03', '1.520875', NULL,
  NOW(), NOW(), NOW()
) ON CONFLICT (notion_id) DO UPDATE SET
  name = EXCLUDED.name,
  position = EXCLUDED.position,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  level = EXCLUDED.level,
  step = EXCLUDED.step,
  team = EXCLUDED.team,
  skills = EXCLUDED.skills,
  tags = EXCLUDED.tags,
  "group" = EXCLUDED."group",
  base_salary = EXCLUDED.base_salary,
  billable_rate = EXCLUDED.billable_rate,
  start_date = EXCLUDED.start_date,
  timezone = EXCLUDED.timezone,
  reports_to = EXCLUDED.reports_to,
  manages = EXCLUDED.manages,
  profile = EXCLUDED.profile,
  notion_account = EXCLUDED.notion_account,
  tenure = EXCLUDED.tenure,
  location_factor = EXCLUDED.location_factor,
  step_factor = EXCLUDED.step_factor,
  level_factor = EXCLUDED.level_factor,
  total_salary = EXCLUDED.total_salary,
  synced_at = NOW(),
  updated_at = NOW();

INSERT INTO notion_employees (
  notion_id, name, position, email, phone, level, step, team, skills, tags, "group", 
  base_salary, billable_rate, start_date, timezone, reports_to, manages, profile, 
  notion_account, tenure, location_factor, step_factor, level_factor, total_salary, 
  synced_at, created_at, updated_at
) VALUES (
  '239b3298-c3ce-8108-9284-f3cb196856c7', 'Matt Adams', 'Founding Infrastructure Engineer', 'matt@liquidlabs.inc', NULL, NULL, NULL, '["Infrastructure & DevOps"]'::jsonb, '[]'::jsonb, '["DevOps","Observability","Load Testing","Deployments","Databases"]'::jsonb, '["Engineering"]'::jsonb, NULL, NULL, NULL, 'EST', '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, NULL, 'Error: Unknown Location', '0.970873786408', '0.869565217391', NULL,
  NOW(), NOW(), NOW()
) ON CONFLICT (notion_id) DO UPDATE SET
  name = EXCLUDED.name,
  position = EXCLUDED.position,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  level = EXCLUDED.level,
  step = EXCLUDED.step,
  team = EXCLUDED.team,
  skills = EXCLUDED.skills,
  tags = EXCLUDED.tags,
  "group" = EXCLUDED."group",
  base_salary = EXCLUDED.base_salary,
  billable_rate = EXCLUDED.billable_rate,
  start_date = EXCLUDED.start_date,
  timezone = EXCLUDED.timezone,
  reports_to = EXCLUDED.reports_to,
  manages = EXCLUDED.manages,
  profile = EXCLUDED.profile,
  notion_account = EXCLUDED.notion_account,
  tenure = EXCLUDED.tenure,
  location_factor = EXCLUDED.location_factor,
  step_factor = EXCLUDED.step_factor,
  level_factor = EXCLUDED.level_factor,
  total_salary = EXCLUDED.total_salary,
  synced_at = NOW(),
  updated_at = NOW();

INSERT INTO notion_employees (
  notion_id, name, position, email, phone, level, step, team, skills, tags, "group", 
  base_salary, billable_rate, start_date, timezone, reports_to, manages, profile, 
  notion_account, tenure, location_factor, step_factor, level_factor, total_salary, 
  synced_at, created_at, updated_at
) VALUES (
  '239b3298-c3ce-810e-940b-fb46ff696011', 'Rayan B.', 'Head of Product', 'rayan@liquidlabs.inc', NULL, NULL, NULL, '["Product"]'::jsonb, '[]'::jsonb, '["UI/UX","Product roadmap","Mobile","Customer Support","Brand"]'::jsonb, '["PSG"]'::jsonb, NULL, NULL, NULL, 'CEST', '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, NULL, 'Error: Unknown Location', '0.970873786408', '0.869565217391', NULL,
  NOW(), NOW(), NOW()
) ON CONFLICT (notion_id) DO UPDATE SET
  name = EXCLUDED.name,
  position = EXCLUDED.position,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  level = EXCLUDED.level,
  step = EXCLUDED.step,
  team = EXCLUDED.team,
  skills = EXCLUDED.skills,
  tags = EXCLUDED.tags,
  "group" = EXCLUDED."group",
  base_salary = EXCLUDED.base_salary,
  billable_rate = EXCLUDED.billable_rate,
  start_date = EXCLUDED.start_date,
  timezone = EXCLUDED.timezone,
  reports_to = EXCLUDED.reports_to,
  manages = EXCLUDED.manages,
  profile = EXCLUDED.profile,
  notion_account = EXCLUDED.notion_account,
  tenure = EXCLUDED.tenure,
  location_factor = EXCLUDED.location_factor,
  step_factor = EXCLUDED.step_factor,
  level_factor = EXCLUDED.level_factor,
  total_salary = EXCLUDED.total_salary,
  synced_at = NOW(),
  updated_at = NOW();

INSERT INTO notion_employees (
  notion_id, name, position, email, phone, level, step, team, skills, tags, "group", 
  base_salary, billable_rate, start_date, timezone, reports_to, manages, profile, 
  notion_account, tenure, location_factor, step_factor, level_factor, total_salary, 
  synced_at, created_at, updated_at
) VALUES (
  '239b3298-c3ce-811e-aae9-e4acb678b854', 'Jb/Nd', 'Founding Smart Contract Engineer', 'ledger@liquidlabs.inc', NULL, NULL, NULL, '["Smart Contracts"]'::jsonb, '[]'::jsonb, '["Launchpad","Router","CLOB","Audits","Customer Support"]'::jsonb, '["Engineering"]'::jsonb, NULL, NULL, NULL, 'EST', '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, NULL, 'Error: Unknown Location', '0.970873786408', '0.869565217391', NULL,
  NOW(), NOW(), NOW()
) ON CONFLICT (notion_id) DO UPDATE SET
  name = EXCLUDED.name,
  position = EXCLUDED.position,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  level = EXCLUDED.level,
  step = EXCLUDED.step,
  team = EXCLUDED.team,
  skills = EXCLUDED.skills,
  tags = EXCLUDED.tags,
  "group" = EXCLUDED."group",
  base_salary = EXCLUDED.base_salary,
  billable_rate = EXCLUDED.billable_rate,
  start_date = EXCLUDED.start_date,
  timezone = EXCLUDED.timezone,
  reports_to = EXCLUDED.reports_to,
  manages = EXCLUDED.manages,
  profile = EXCLUDED.profile,
  notion_account = EXCLUDED.notion_account,
  tenure = EXCLUDED.tenure,
  location_factor = EXCLUDED.location_factor,
  step_factor = EXCLUDED.step_factor,
  level_factor = EXCLUDED.level_factor,
  total_salary = EXCLUDED.total_salary,
  synced_at = NOW(),
  updated_at = NOW();

INSERT INTO notion_employees (
  notion_id, name, position, email, phone, level, step, team, skills, tags, "group", 
  base_salary, billable_rate, start_date, timezone, reports_to, manages, profile, 
  notion_account, tenure, location_factor, step_factor, level_factor, total_salary, 
  synced_at, created_at, updated_at
) VALUES (
  '239b3298-c3ce-811e-b401-cdb3cd863ac7', 'Majin', 'Community Manager', 'majin@liquidlabs.inc', NULL, NULL, NULL, '["Growth"]'::jsonb, '[]'::jsonb, '["Twitter","Discord","Announcements","Creative","Socials"]'::jsonb, '["PSG"]'::jsonb, NULL, NULL, NULL, 'PST', '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, NULL, 'Error: Unknown Location', '0.970873786408', '0.869565217391', NULL,
  NOW(), NOW(), NOW()
) ON CONFLICT (notion_id) DO UPDATE SET
  name = EXCLUDED.name,
  position = EXCLUDED.position,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  level = EXCLUDED.level,
  step = EXCLUDED.step,
  team = EXCLUDED.team,
  skills = EXCLUDED.skills,
  tags = EXCLUDED.tags,
  "group" = EXCLUDED."group",
  base_salary = EXCLUDED.base_salary,
  billable_rate = EXCLUDED.billable_rate,
  start_date = EXCLUDED.start_date,
  timezone = EXCLUDED.timezone,
  reports_to = EXCLUDED.reports_to,
  manages = EXCLUDED.manages,
  profile = EXCLUDED.profile,
  notion_account = EXCLUDED.notion_account,
  tenure = EXCLUDED.tenure,
  location_factor = EXCLUDED.location_factor,
  step_factor = EXCLUDED.step_factor,
  level_factor = EXCLUDED.level_factor,
  total_salary = EXCLUDED.total_salary,
  synced_at = NOW(),
  updated_at = NOW();

INSERT INTO notion_employees (
  notion_id, name, position, email, phone, level, step, team, skills, tags, "group", 
  base_salary, billable_rate, start_date, timezone, reports_to, manages, profile, 
  notion_account, tenure, location_factor, step_factor, level_factor, total_salary, 
  synced_at, created_at, updated_at
) VALUES (
  '239b3298-c3ce-813f-89c3-d3fa4ce37b6a', 'Ryan (Rite / 💀)', 'Founding Smart Contract Engineer', 'r@liquidlabs.inc', NULL, NULL, NULL, '["Smart Contracts"]'::jsonb, '[]'::jsonb, '["CLOB","Perps","Vault","Audits","Customer Support"]'::jsonb, '["Engineering"]'::jsonb, NULL, NULL, NULL, 'PST', '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, NULL, 'Error: Unknown Location', '0.970873786408', '0.869565217391', NULL,
  NOW(), NOW(), NOW()
) ON CONFLICT (notion_id) DO UPDATE SET
  name = EXCLUDED.name,
  position = EXCLUDED.position,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  level = EXCLUDED.level,
  step = EXCLUDED.step,
  team = EXCLUDED.team,
  skills = EXCLUDED.skills,
  tags = EXCLUDED.tags,
  "group" = EXCLUDED."group",
  base_salary = EXCLUDED.base_salary,
  billable_rate = EXCLUDED.billable_rate,
  start_date = EXCLUDED.start_date,
  timezone = EXCLUDED.timezone,
  reports_to = EXCLUDED.reports_to,
  manages = EXCLUDED.manages,
  profile = EXCLUDED.profile,
  notion_account = EXCLUDED.notion_account,
  tenure = EXCLUDED.tenure,
  location_factor = EXCLUDED.location_factor,
  step_factor = EXCLUDED.step_factor,
  level_factor = EXCLUDED.level_factor,
  total_salary = EXCLUDED.total_salary,
  synced_at = NOW(),
  updated_at = NOW();

INSERT INTO notion_employees (
  notion_id, name, position, email, phone, level, step, team, skills, tags, "group", 
  base_salary, billable_rate, start_date, timezone, reports_to, manages, profile, 
  notion_account, tenure, location_factor, step_factor, level_factor, total_salary, 
  synced_at, created_at, updated_at
) VALUES (
  '239b3298-c3ce-8166-afe4-df2d976af04d', 'Justin Moon', 'COO', 'justin@liquidlabs.inc', NULL, NULL, NULL, '["Exec"]'::jsonb, '[]'::jsonb, '["Business Development","Legal","Operations","Institutional","Foundation","Vault","Risk","Liquidity"]'::jsonb, '["PSG"]'::jsonb, NULL, NULL, NULL, 'EST', '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, NULL, 'Error: Unknown Location', '0.970873786408', '0.869565217391', NULL,
  NOW(), NOW(), NOW()
) ON CONFLICT (notion_id) DO UPDATE SET
  name = EXCLUDED.name,
  position = EXCLUDED.position,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  level = EXCLUDED.level,
  step = EXCLUDED.step,
  team = EXCLUDED.team,
  skills = EXCLUDED.skills,
  tags = EXCLUDED.tags,
  "group" = EXCLUDED."group",
  base_salary = EXCLUDED.base_salary,
  billable_rate = EXCLUDED.billable_rate,
  start_date = EXCLUDED.start_date,
  timezone = EXCLUDED.timezone,
  reports_to = EXCLUDED.reports_to,
  manages = EXCLUDED.manages,
  profile = EXCLUDED.profile,
  notion_account = EXCLUDED.notion_account,
  tenure = EXCLUDED.tenure,
  location_factor = EXCLUDED.location_factor,
  step_factor = EXCLUDED.step_factor,
  level_factor = EXCLUDED.level_factor,
  total_salary = EXCLUDED.total_salary,
  synced_at = NOW(),
  updated_at = NOW();

INSERT INTO notion_employees (
  notion_id, name, position, email, phone, level, step, team, skills, tags, "group", 
  base_salary, billable_rate, start_date, timezone, reports_to, manages, profile, 
  notion_account, tenure, location_factor, step_factor, level_factor, total_salary, 
  synced_at, created_at, updated_at
) VALUES (
  '239b3298-c3ce-816e-a29c-c584d2de48fe', 'Nate Burbage', 'Backend Lead & Co-Founder ', 'nate@liquidlabs.inc', NULL, NULL, NULL, '["Backend"]'::jsonb, '[]'::jsonb, '["Indexers","Aggregator","Databases","System Design","DevOps","Deployments","Optimizations"]'::jsonb, '["Engineering"]'::jsonb, NULL, NULL, NULL, 'EST', '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, NULL, 'Error: Unknown Location', '0.970873786408', '0.869565217391', NULL,
  NOW(), NOW(), NOW()
) ON CONFLICT (notion_id) DO UPDATE SET
  name = EXCLUDED.name,
  position = EXCLUDED.position,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  level = EXCLUDED.level,
  step = EXCLUDED.step,
  team = EXCLUDED.team,
  skills = EXCLUDED.skills,
  tags = EXCLUDED.tags,
  "group" = EXCLUDED."group",
  base_salary = EXCLUDED.base_salary,
  billable_rate = EXCLUDED.billable_rate,
  start_date = EXCLUDED.start_date,
  timezone = EXCLUDED.timezone,
  reports_to = EXCLUDED.reports_to,
  manages = EXCLUDED.manages,
  profile = EXCLUDED.profile,
  notion_account = EXCLUDED.notion_account,
  tenure = EXCLUDED.tenure,
  location_factor = EXCLUDED.location_factor,
  step_factor = EXCLUDED.step_factor,
  level_factor = EXCLUDED.level_factor,
  total_salary = EXCLUDED.total_salary,
  synced_at = NOW(),
  updated_at = NOW();

INSERT INTO notion_employees (
  notion_id, name, position, email, phone, level, step, team, skills, tags, "group", 
  base_salary, billable_rate, start_date, timezone, reports_to, manages, profile, 
  notion_account, tenure, location_factor, step_factor, level_factor, total_salary, 
  synced_at, created_at, updated_at
) VALUES (
  '239b3298-c3ce-8177-be4e-f9feb02005e6', 'Stephán Thomas', 'Quantitative Data Scientist', 'stephan@liquidlabs.inc', NULL, NULL, NULL, '["Science"]'::jsonb, '[]'::jsonb, '["Vault","R&D","Risk","Liquidity"]'::jsonb, '["PSG"]'::jsonb, NULL, NULL, NULL, 'EST', '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, NULL, 'Error: Unknown Location', '0.970873786408', '0.869565217391', NULL,
  NOW(), NOW(), NOW()
) ON CONFLICT (notion_id) DO UPDATE SET
  name = EXCLUDED.name,
  position = EXCLUDED.position,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  level = EXCLUDED.level,
  step = EXCLUDED.step,
  team = EXCLUDED.team,
  skills = EXCLUDED.skills,
  tags = EXCLUDED.tags,
  "group" = EXCLUDED."group",
  base_salary = EXCLUDED.base_salary,
  billable_rate = EXCLUDED.billable_rate,
  start_date = EXCLUDED.start_date,
  timezone = EXCLUDED.timezone,
  reports_to = EXCLUDED.reports_to,
  manages = EXCLUDED.manages,
  profile = EXCLUDED.profile,
  notion_account = EXCLUDED.notion_account,
  tenure = EXCLUDED.tenure,
  location_factor = EXCLUDED.location_factor,
  step_factor = EXCLUDED.step_factor,
  level_factor = EXCLUDED.level_factor,
  total_salary = EXCLUDED.total_salary,
  synced_at = NOW(),
  updated_at = NOW();

INSERT INTO notion_employees (
  notion_id, name, position, email, phone, level, step, team, skills, tags, "group", 
  base_salary, billable_rate, start_date, timezone, reports_to, manages, profile, 
  notion_account, tenure, location_factor, step_factor, level_factor, total_salary, 
  synced_at, created_at, updated_at
) VALUES (
  '239b3298-c3ce-818b-8894-f4196b71e7f4', 'Matteo Lunghi', 'CTO & Co-Founder', 'm@liquidlabs.inc', NULL, NULL, NULL, '["Exec"]'::jsonb, '[]'::jsonb, '[]'::jsonb, '["Engineering","PSG"]'::jsonb, NULL, NULL, NULL, 'EST', '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, NULL, 'Error: Unknown Location', '0.970873786408', '0.869565217391', NULL,
  NOW(), NOW(), NOW()
) ON CONFLICT (notion_id) DO UPDATE SET
  name = EXCLUDED.name,
  position = EXCLUDED.position,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  level = EXCLUDED.level,
  step = EXCLUDED.step,
  team = EXCLUDED.team,
  skills = EXCLUDED.skills,
  tags = EXCLUDED.tags,
  "group" = EXCLUDED."group",
  base_salary = EXCLUDED.base_salary,
  billable_rate = EXCLUDED.billable_rate,
  start_date = EXCLUDED.start_date,
  timezone = EXCLUDED.timezone,
  reports_to = EXCLUDED.reports_to,
  manages = EXCLUDED.manages,
  profile = EXCLUDED.profile,
  notion_account = EXCLUDED.notion_account,
  tenure = EXCLUDED.tenure,
  location_factor = EXCLUDED.location_factor,
  step_factor = EXCLUDED.step_factor,
  level_factor = EXCLUDED.level_factor,
  total_salary = EXCLUDED.total_salary,
  synced_at = NOW(),
  updated_at = NOW();

INSERT INTO notion_employees (
  notion_id, name, position, email, phone, level, step, team, skills, tags, "group", 
  base_salary, billable_rate, start_date, timezone, reports_to, manages, profile, 
  notion_account, tenure, location_factor, step_factor, level_factor, total_salary, 
  synced_at, created_at, updated_at
) VALUES (
  '239b3298-c3ce-81cf-a972-f4573ea2e4e7', 'Moses Lee', 'Frontend Lead & Co-Founder', 'moses@liquidlabs.inc', NULL, NULL, NULL, '["Full Stack"]'::jsonb, '[]'::jsonb, '["UI/UX","APIs & SDKs","Customer Support","Integrations","EIPs"]'::jsonb, '["Engineering"]'::jsonb, NULL, NULL, NULL, 'EST', '[]'::jsonb, '["23bb3298-c3ce-8001-ab45-d06c2ba09c20"]'::jsonb, '[]'::jsonb, '[]'::jsonb, NULL, 'Error: Unknown Location', '0.970873786408', '0.869565217391', NULL,
  NOW(), NOW(), NOW()
) ON CONFLICT (notion_id) DO UPDATE SET
  name = EXCLUDED.name,
  position = EXCLUDED.position,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  level = EXCLUDED.level,
  step = EXCLUDED.step,
  team = EXCLUDED.team,
  skills = EXCLUDED.skills,
  tags = EXCLUDED.tags,
  "group" = EXCLUDED."group",
  base_salary = EXCLUDED.base_salary,
  billable_rate = EXCLUDED.billable_rate,
  start_date = EXCLUDED.start_date,
  timezone = EXCLUDED.timezone,
  reports_to = EXCLUDED.reports_to,
  manages = EXCLUDED.manages,
  profile = EXCLUDED.profile,
  notion_account = EXCLUDED.notion_account,
  tenure = EXCLUDED.tenure,
  location_factor = EXCLUDED.location_factor,
  step_factor = EXCLUDED.step_factor,
  level_factor = EXCLUDED.level_factor,
  total_salary = EXCLUDED.total_salary,
  synced_at = NOW(),
  updated_at = NOW();

INSERT INTO notion_employees (
  notion_id, name, position, email, phone, level, step, team, skills, tags, "group", 
  base_salary, billable_rate, start_date, timezone, reports_to, manages, profile, 
  notion_account, tenure, location_factor, step_factor, level_factor, total_salary, 
  synced_at, created_at, updated_at
) VALUES (
  '239b3298-c3ce-81d7-aa08-fad354ac19f1', 'Julien Kuntz', 'Smart Contract Engineer', 'jk@liquidlabs.inc', NULL, NULL, NULL, '["Smart Contracts"]'::jsonb, '[]'::jsonb, '["Router","Audits"]'::jsonb, '["Engineering"]'::jsonb, NULL, NULL, NULL, 'CEST', '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, NULL, 'Error: Unknown Location', '0.970873786408', '0.869565217391', NULL,
  NOW(), NOW(), NOW()
) ON CONFLICT (notion_id) DO UPDATE SET
  name = EXCLUDED.name,
  position = EXCLUDED.position,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  level = EXCLUDED.level,
  step = EXCLUDED.step,
  team = EXCLUDED.team,
  skills = EXCLUDED.skills,
  tags = EXCLUDED.tags,
  "group" = EXCLUDED."group",
  base_salary = EXCLUDED.base_salary,
  billable_rate = EXCLUDED.billable_rate,
  start_date = EXCLUDED.start_date,
  timezone = EXCLUDED.timezone,
  reports_to = EXCLUDED.reports_to,
  manages = EXCLUDED.manages,
  profile = EXCLUDED.profile,
  notion_account = EXCLUDED.notion_account,
  tenure = EXCLUDED.tenure,
  location_factor = EXCLUDED.location_factor,
  step_factor = EXCLUDED.step_factor,
  level_factor = EXCLUDED.level_factor,
  total_salary = EXCLUDED.total_salary,
  synced_at = NOW(),
  updated_at = NOW();

INSERT INTO notion_employees (
  notion_id, name, position, email, phone, level, step, team, skills, tags, "group", 
  base_salary, billable_rate, start_date, timezone, reports_to, manages, profile, 
  notion_account, tenure, location_factor, step_factor, level_factor, total_salary, 
  synced_at, created_at, updated_at
) VALUES (
  '239b3298-c3ce-81ef-85fb-d9b32e3871b2', 'Richard Jovanovic', 'Founding Backend Engineer', 'richard@liquidlabs.inc', NULL, NULL, NULL, '["Backend"]'::jsonb, '[]'::jsonb, '["Indexers","System Design","Optimizations","Databases"]'::jsonb, '["Engineering"]'::jsonb, NULL, NULL, NULL, 'MST', '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, NULL, 'Error: Unknown Location', '0.970873786408', '0.869565217391', NULL,
  NOW(), NOW(), NOW()
) ON CONFLICT (notion_id) DO UPDATE SET
  name = EXCLUDED.name,
  position = EXCLUDED.position,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  level = EXCLUDED.level,
  step = EXCLUDED.step,
  team = EXCLUDED.team,
  skills = EXCLUDED.skills,
  tags = EXCLUDED.tags,
  "group" = EXCLUDED."group",
  base_salary = EXCLUDED.base_salary,
  billable_rate = EXCLUDED.billable_rate,
  start_date = EXCLUDED.start_date,
  timezone = EXCLUDED.timezone,
  reports_to = EXCLUDED.reports_to,
  manages = EXCLUDED.manages,
  profile = EXCLUDED.profile,
  notion_account = EXCLUDED.notion_account,
  tenure = EXCLUDED.tenure,
  location_factor = EXCLUDED.location_factor,
  step_factor = EXCLUDED.step_factor,
  level_factor = EXCLUDED.level_factor,
  total_salary = EXCLUDED.total_salary,
  synced_at = NOW(),
  updated_at = NOW();

INSERT INTO notion_employees (
  notion_id, name, position, email, phone, level, step, team, skills, tags, "group", 
  base_salary, billable_rate, start_date, timezone, reports_to, manages, profile, 
  notion_account, tenure, location_factor, step_factor, level_factor, total_salary, 
  synced_at, created_at, updated_at
) VALUES (
  '239b3298-c3ce-81f5-aa2d-e0ed1811aa9c', 'Eduardo Kegler', 'Founding Frontend Engineer', 'eduardo@liquidlabs.inc', NULL, NULL, NULL, '["Frontend"]'::jsonb, '[]'::jsonb, '["UI/UX","Customer Support"]'::jsonb, '["Engineering"]'::jsonb, NULL, NULL, NULL, 'EST', '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, NULL, 'Error: Unknown Location', '0.970873786408', '0.869565217391', NULL,
  NOW(), NOW(), NOW()
) ON CONFLICT (notion_id) DO UPDATE SET
  name = EXCLUDED.name,
  position = EXCLUDED.position,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  level = EXCLUDED.level,
  step = EXCLUDED.step,
  team = EXCLUDED.team,
  skills = EXCLUDED.skills,
  tags = EXCLUDED.tags,
  "group" = EXCLUDED."group",
  base_salary = EXCLUDED.base_salary,
  billable_rate = EXCLUDED.billable_rate,
  start_date = EXCLUDED.start_date,
  timezone = EXCLUDED.timezone,
  reports_to = EXCLUDED.reports_to,
  manages = EXCLUDED.manages,
  profile = EXCLUDED.profile,
  notion_account = EXCLUDED.notion_account,
  tenure = EXCLUDED.tenure,
  location_factor = EXCLUDED.location_factor,
  step_factor = EXCLUDED.step_factor,
  level_factor = EXCLUDED.level_factor,
  total_salary = EXCLUDED.total_salary,
  synced_at = NOW(),
  updated_at = NOW();

INSERT INTO notion_employees (
  notion_id, name, position, email, phone, level, step, team, skills, tags, "group", 
  base_salary, billable_rate, start_date, timezone, reports_to, manages, profile, 
  notion_account, tenure, location_factor, step_factor, level_factor, total_salary, 
  synced_at, created_at, updated_at
) VALUES (
  '239b3298-c3ce-8147-a024-e055b06f98e8', 'Matt Paik (HDF)', 'Head of Growth', 'hdf@liquidlabs.inc', NULL, NULL, NULL, '["Growth"]'::jsonb, '[]'::jsonb, '["Business Development","Socials","DeFi","Mobile","Perps","Outreach","Brand"]'::jsonb, '["PSG"]'::jsonb, NULL, NULL, NULL, 'PST', '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, NULL, 'Error: Unknown Location', '0.970873786408', '0.869565217391', NULL,
  NOW(), NOW(), NOW()
) ON CONFLICT (notion_id) DO UPDATE SET
  name = EXCLUDED.name,
  position = EXCLUDED.position,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  level = EXCLUDED.level,
  step = EXCLUDED.step,
  team = EXCLUDED.team,
  skills = EXCLUDED.skills,
  tags = EXCLUDED.tags,
  "group" = EXCLUDED."group",
  base_salary = EXCLUDED.base_salary,
  billable_rate = EXCLUDED.billable_rate,
  start_date = EXCLUDED.start_date,
  timezone = EXCLUDED.timezone,
  reports_to = EXCLUDED.reports_to,
  manages = EXCLUDED.manages,
  profile = EXCLUDED.profile,
  notion_account = EXCLUDED.notion_account,
  tenure = EXCLUDED.tenure,
  location_factor = EXCLUDED.location_factor,
  step_factor = EXCLUDED.step_factor,
  level_factor = EXCLUDED.level_factor,
  total_salary = EXCLUDED.total_salary,
  synced_at = NOW(),
  updated_at = NOW();