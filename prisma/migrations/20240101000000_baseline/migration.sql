-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "public"."KPIType" AS ENUM ('numeric', 'percentage', 'boolean', 'scale');

-- CreateEnum
CREATE TYPE "public"."KPIFrequency" AS ENUM ('weekly', 'monthly', 'quarterly');

-- CreateTable
CREATE TABLE "public"."employees" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "responsibility" TEXT NOT NULL DEFAULT '',
    "responsibilities" TEXT[],
    "managerId" TEXT,
    "department" TEXT,
    "archived" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "employees_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."kpis" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" "public"."KPIType" NOT NULL,
    "target" DOUBLE PRECISION,
    "frequency" "public"."KPIFrequency" NOT NULL,
    "employeeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "kpis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."scores" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "overall" DOUBLE PRECISION NOT NULL,
    "notes" TEXT,
    "employeeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "scores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."kpi_scores" (
    "id" TEXT NOT NULL,
    "kpiId" TEXT NOT NULL,
    "scoreId" TEXT NOT NULL,
    "value" DOUBLE PRECISION,
    "booleanValue" BOOLEAN,

    CONSTRAINT "kpi_scores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."accounts" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "provider_account_id" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."sessions" (
    "id" TEXT NOT NULL,
    "session_token" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."users" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "email_verified" TIMESTAMP(3),
    "image" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."verificationtokens" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "public"."notion_employees" (
    "id" SERIAL NOT NULL,
    "notion_id" TEXT NOT NULL,
    "level" DOUBLE PRECISION,
    "step" DOUBLE PRECISION,
    "tenure" TEXT,
    "team" JSONB,
    "manages" JSONB,
    "phone" TEXT,
    "location_factor" TEXT,
    "notion_account" JSONB,
    "step_factor" TEXT,
    "reports_to" JSONB,
    "skills" JSONB,
    "tags" JSONB,
    "level_factor" TEXT,
    "billable_rate" DOUBLE PRECISION,
    "start_date" TIMESTAMP(3),
    "timezone" TEXT,
    "group" JSONB,
    "total_salary" TEXT,
    "email" TEXT,
    "position" TEXT,
    "profile" JSONB,
    "base_salary" DOUBLE PRECISION,
    "name" TEXT,
    "synced_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notion_employees_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."manager_assignments" (
    "id" TEXT NOT NULL,
    "managerId" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "assignedBy" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "manager_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."user_permissions" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "canViewAll" BOOLEAN NOT NULL DEFAULT false,
    "canManageAll" BOOLEAN NOT NULL DEFAULT false,
    "canAssignManagers" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."employee_scorecards" (
    "id" TEXT NOT NULL,
    "employee_notion_id" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "mission" TEXT,
    "created_by" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "employee_scorecards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."scorecard_outcomes" (
    "id" TEXT NOT NULL,
    "scorecard_id" TEXT NOT NULL,
    "order_index" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "details" TEXT[],
    "rating" TEXT,
    "comments" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "scorecard_outcomes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."scorecard_competencies" (
    "id" TEXT NOT NULL,
    "scorecard_id" TEXT NOT NULL,
    "competency" TEXT NOT NULL,
    "rating" TEXT,
    "comments" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "scorecard_competencies_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "kpi_scores_kpiId_scoreId_key" ON "public"."kpi_scores"("kpiId", "scoreId");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_provider_provider_account_id_key" ON "public"."accounts"("provider", "provider_account_id");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_session_token_key" ON "public"."sessions"("session_token");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "verificationtokens_token_key" ON "public"."verificationtokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "verificationtokens_identifier_token_key" ON "public"."verificationtokens"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "notion_employees_notion_id_key" ON "public"."notion_employees"("notion_id");

-- CreateIndex
CREATE INDEX "notion_employees_email_idx" ON "public"."notion_employees"("email");

-- CreateIndex
CREATE INDEX "notion_employees_name_idx" ON "public"."notion_employees"("name");

-- CreateIndex
CREATE INDEX "notion_employees_synced_at_idx" ON "public"."notion_employees"("synced_at" DESC);

-- CreateIndex
CREATE INDEX "manager_assignments_managerId_idx" ON "public"."manager_assignments"("managerId");

-- CreateIndex
CREATE INDEX "manager_assignments_employeeId_idx" ON "public"."manager_assignments"("employeeId");

-- CreateIndex
CREATE UNIQUE INDEX "manager_assignments_managerId_employeeId_key" ON "public"."manager_assignments"("managerId", "employeeId");

-- CreateIndex
CREATE UNIQUE INDEX "user_permissions_email_key" ON "public"."user_permissions"("email");

-- CreateIndex
CREATE INDEX "user_permissions_role_idx" ON "public"."user_permissions"("role");

-- CreateIndex
CREATE UNIQUE INDEX "employee_scorecards_employee_notion_id_key" ON "public"."employee_scorecards"("employee_notion_id");

-- CreateIndex
CREATE INDEX "employee_scorecards_created_by_idx" ON "public"."employee_scorecards"("created_by");

-- CreateIndex
CREATE INDEX "scorecard_outcomes_scorecard_id_idx" ON "public"."scorecard_outcomes"("scorecard_id");

-- CreateIndex
CREATE INDEX "scorecard_competencies_scorecard_id_idx" ON "public"."scorecard_competencies"("scorecard_id");

-- AddForeignKey
ALTER TABLE "public"."employees" ADD CONSTRAINT "employees_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "public"."employees"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."kpis" ADD CONSTRAINT "kpis_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "public"."employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."scores" ADD CONSTRAINT "scores_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "public"."employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."kpi_scores" ADD CONSTRAINT "kpi_scores_kpiId_fkey" FOREIGN KEY ("kpiId") REFERENCES "public"."kpis"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."kpi_scores" ADD CONSTRAINT "kpi_scores_scoreId_fkey" FOREIGN KEY ("scoreId") REFERENCES "public"."scores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."accounts" ADD CONSTRAINT "accounts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."sessions" ADD CONSTRAINT "sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."scorecard_outcomes" ADD CONSTRAINT "scorecard_outcomes_scorecard_id_fkey" FOREIGN KEY ("scorecard_id") REFERENCES "public"."employee_scorecards"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."scorecard_competencies" ADD CONSTRAINT "scorecard_competencies_scorecard_id_fkey" FOREIGN KEY ("scorecard_id") REFERENCES "public"."employee_scorecards"("id") ON DELETE CASCADE ON UPDATE CASCADE;

