-- CreateTable
CREATE TABLE "CustomApp" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "sessionId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "AppRequest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "submitterEmail" TEXT NOT NULL,
    "stripePaymentId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "adminNotes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "AppUsageEvent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "appSlug" TEXT,
    "customAppId" TEXT,
    "eventType" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AppUsageEvent_customAppId_fkey" FOREIGN KEY ("customAppId") REFERENCES "CustomApp" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "WebhookEndpoint" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "token" TEXT NOT NULL,
    "payloads" TEXT NOT NULL DEFAULT '[]',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "AppRequest_stripePaymentId_key" ON "AppRequest"("stripePaymentId");

-- CreateIndex
CREATE INDEX "AppUsageEvent_appSlug_idx" ON "AppUsageEvent"("appSlug");

-- CreateIndex
CREATE INDEX "AppUsageEvent_createdAt_idx" ON "AppUsageEvent"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "WebhookEndpoint_token_key" ON "WebhookEndpoint"("token");
