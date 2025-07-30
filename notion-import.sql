-- Notion Employee Data Import
-- Generated: 2025-07-30T21:27:46.074Z
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
  '239b3298-c3ce-81bb-971f-e092bb0fda81', 'Enzo Coglitore', 'CEO & Co-Founder', 'enzo@liquidlabs.inc', NULL, 4, 2, '["Exec"]'::jsonb, '["Coaching","Mentoring","Solution architecture","Strategy","Vision"]'::jsonb, '[]'::jsonb, '["PSG","Engineering"]'::jsonb, 110000, 250, '2021-04-12'::timestamp, 'EST', '[]'::jsonb, '[]'::jsonb, '[{"name":"undraw_Male_avatar_g98d.png","url":"https://prod-files-secure.s3.us-west-2.amazonaws.com/a530306f-69b8-4a7e-9383-a7399d20fcc7/4f8bf235-2627-45ac-8daa-b37543e9e99f/undraw_Male_avatar_g98d.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663CRHEUFQ%2F20250730%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20250730T212746Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIGOym2cSalDFWSvIasPRnWYxuznqAKLBI7RDXWR7HbEaAiBWAmnOamm%2FSqMI22MbJVS9lF%2B31ER1Bng10Fm%2Fbyo%2BmSqIBAjF%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIM6kYihCYVOoNXltL9KtwDwDmr5NZLOGnoYnNYKi3eNR7Vhwlo%2BsDL2tR9MfZedUEqNLO3n18GHH5np9pav%2BsWQzZHCVtnoRM3lXUPsbM62znPUTSuCr31FcOR0xH5b5xi9ppVMbqeJcEPrWVj8ZZ%2FYkJfmDlkYslbDv%2FGxt732qgIdjTV8MKKpty0mDlPLFqNSykbRSAoKXYSEPYdj7mvWoUGip6Vgm8WMKGtL5aKnoAb3ld%2FUFsUwiCMGU3PacFz0H4Emzsvqdz7VEj75kbKJvHaFHOZ4Na5LsYplrsjQyae2WWgpHN2ooTJ0Fj3E680n6reGggLltgQdDCK4WM0Td7mFM3XArUK06qXueal8qrGdwUk8zh3So60xSGLTGSpYa%2FsqiYJn%2BNZlGvOYbaqmyNWLyArCdlUHuumRS1%2BUWFkA8bBc6aMGCJJzXZ7wmXYJYAIdscEzwSx72pjXiVhl37JPhz5H%2FC5o9Clm53HrvuKHzoSrcqEydfg%2FACad2503QGbgYGusPXe1U8xPyesoo%2BHfVL1q%2FOjcDJFe2Z0z%2FbrVgiKfv4lK72W3GhOlBiK75F1N58YTFx8sGQfmkHNrbcwWIHZghqM6mwP5fobY%2BHh0cEMlIIvhxBG%2BMvJWgwwsRB1zt1H%2FzIB2fYwzuipxAY6pgEvaDLPZ2JpR8PYaRCiihOOOA1ajLwo8LeSplddFBf8XW2aRvmxzitF%2BqbTlv51fmWMoQ%2BAo4FW314vJ6kkobiPTCGFEmCKODNnQAVpRZqllASt%2B3396t%2Foad%2ByxG%2BP1PPO0njI9O3yFpGHf7nWDI3CCIB62MoTQ%2BdszJubZ%2FHTYiFLOxIuRkix4OSR%2B%2BfRBiKf0vTm8tzJzMykAEz5WRNIpIUSFdiH&X-Amz-Signature=a07e05484613465dc4b468b9a2bb0cc5c3d0cc3e1af195686c4f6f7473b31ebe&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject"}]'::jsonb, '[]'::jsonb, '4.3 years', 'Error: Unknown Location', '1.03', '1.520875', NULL,
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
  '239b3298-c3ce-810e-940b-fb46ff696011', 'Rayan Boutaleb', 'Head of Product', 'rayan@liquidlabs.inc', NULL, NULL, NULL, '["Product"]'::jsonb, '[]'::jsonb, '["UI/UX","Product roadmap","Mobile","Customer Support","Brand","Manager"]'::jsonb, '["PSG"]'::jsonb, NULL, NULL, NULL, 'CEST', '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, NULL, 'Error: Unknown Location', '0.970873786408', '0.869565217391', NULL,
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
  '239b3298-c3ce-8147-a024-e055b06f98e8', 'Matt Paik (HDF)', 'Head of Growth', 'hdf@liquidlabs.inc', NULL, NULL, NULL, '["Growth"]'::jsonb, '[]'::jsonb, '["Business Development","Socials","DeFi","Mobile","Perps","Outreach","Brand","Manager"]'::jsonb, '["PSG"]'::jsonb, NULL, NULL, NULL, 'PST', '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, NULL, 'Error: Unknown Location', '0.970873786408', '0.869565217391', NULL,
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