-- CreateTable
CREATE TABLE "employee_scorecards" (
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
CREATE TABLE "scorecard_outcomes" (
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
CREATE TABLE "scorecard_competencies" (
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
CREATE UNIQUE INDEX "employee_scorecards_employee_notion_id_key" ON "employee_scorecards"("employee_notion_id");

-- CreateIndex
CREATE INDEX "scorecard_outcomes_scorecard_id_idx" ON "scorecard_outcomes"("scorecard_id");

-- CreateIndex
CREATE INDEX "scorecard_competencies_scorecard_id_idx" ON "scorecard_competencies"("scorecard_id");

-- AddForeignKey
ALTER TABLE "scorecard_outcomes" ADD CONSTRAINT "scorecard_outcomes_scorecard_id_fkey" FOREIGN KEY ("scorecard_id") REFERENCES "employee_scorecards"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scorecard_competencies" ADD CONSTRAINT "scorecard_competencies_scorecard_id_fkey" FOREIGN KEY ("scorecard_id") REFERENCES "employee_scorecards"("id") ON DELETE CASCADE ON UPDATE CASCADE;