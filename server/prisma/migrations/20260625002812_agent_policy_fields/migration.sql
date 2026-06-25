-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_policies" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "policyNo" TEXT NOT NULL,
    "ownerId" INTEGER NOT NULL,
    "vehicleId" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME NOT NULL,
    "coverageAmount" REAL NOT NULL,
    "deductible" REAL NOT NULL DEFAULT 0,
    "payoutRatio" REAL NOT NULL DEFAULT 1,
    "coverageTypes" TEXT NOT NULL DEFAULT '[]',
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    CONSTRAINT "policies_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "policies_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "vehicles" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_policies" ("coverageAmount", "endDate", "id", "ownerId", "policyNo", "startDate", "status", "type", "vehicleId") SELECT "coverageAmount", "endDate", "id", "ownerId", "policyNo", "startDate", "status", "type", "vehicleId" FROM "policies";
DROP TABLE "policies";
ALTER TABLE "new_policies" RENAME TO "policies";
CREATE UNIQUE INDEX "policies_policyNo_key" ON "policies"("policyNo");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
