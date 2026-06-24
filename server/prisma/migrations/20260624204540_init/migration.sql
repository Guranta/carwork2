-- CreateTable
CREATE TABLE "users" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "phone" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "avatar" TEXT,
    "role" TEXT NOT NULL DEFAULT 'OWNER',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "vehicles" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "ownerId" INTEGER NOT NULL,
    "plateNo" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "vin" TEXT,
    CONSTRAINT "vehicles_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "policies" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "policyNo" TEXT NOT NULL,
    "ownerId" INTEGER NOT NULL,
    "vehicleId" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME NOT NULL,
    "coverageAmount" REAL NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    CONSTRAINT "policies_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "policies_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "vehicles" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "claims" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "claimNo" TEXT NOT NULL,
    "policyId" INTEGER NOT NULL,
    "ownerId" INTEGER NOT NULL,
    "shopId" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "incidentTime" DATETIME,
    "incidentLat" REAL,
    "incidentLng" REAL,
    "description" TEXT,
    "assessmentAmount" REAL,
    "finalAmount" REAL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "claims_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "claims_policyId_fkey" FOREIGN KEY ("policyId") REFERENCES "policies" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "claims_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "repair_shops" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "claim_images" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "claimId" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'damage',
    "exifTime" DATETIME,
    "exifLat" REAL,
    "exifLng" REAL,
    CONSTRAINT "claim_images_claimId_fkey" FOREIGN KEY ("claimId") REFERENCES "claims" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "damage_reports" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "claimId" INTEGER NOT NULL,
    "parts" TEXT NOT NULL,
    "totalEstimate" REAL NOT NULL,
    "aiRawResponse" TEXT,
    CONSTRAINT "damage_reports_claimId_fkey" FOREIGN KEY ("claimId") REFERENCES "claims" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "repair_shops" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "logo" TEXT,
    "lat" REAL NOT NULL,
    "lng" REAL NOT NULL,
    "certification" TEXT NOT NULL,
    "rating" REAL NOT NULL DEFAULT 0,
    "reviewCount" INTEGER NOT NULL DEFAULT 0,
    "basePrice" REAL NOT NULL
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "payments" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "claimId" INTEGER NOT NULL,
    "mockOrderNo" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "paidAt" DATETIME,
    CONSTRAINT "payments_claimId_fkey" FOREIGN KEY ("claimId") REFERENCES "claims" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "reviews" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "claimId" INTEGER NOT NULL,
    "shopId" INTEGER NOT NULL,
    "ownerId" INTEGER NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "reviews_claimId_fkey" FOREIGN KEY ("claimId") REFERENCES "claims" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "reviews_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "repair_shops" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "reviews_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "admins" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'ADJUSTER'
);

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_key" ON "users"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "policies_policyNo_key" ON "policies"("policyNo");

-- CreateIndex
CREATE UNIQUE INDEX "claims_claimNo_key" ON "claims"("claimNo");

-- CreateIndex
CREATE UNIQUE INDEX "damage_reports_claimId_key" ON "damage_reports"("claimId");

-- CreateIndex
CREATE UNIQUE INDEX "admins_username_key" ON "admins"("username");
