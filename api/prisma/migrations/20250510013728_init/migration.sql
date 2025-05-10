-- CreateEnum
CREATE TYPE "LoginSort" AS ENUM ('GITHUB', 'GOOGLE', 'SYSTEM');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "firstName" VARCHAR(50) NOT NULL,
    "lastName" VARCHAR(50) NOT NULL,
    "email" VARCHAR(50) NOT NULL,
    "password" VARCHAR(70),
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Login" (
    "id" SERIAL NOT NULL,
    "sort" "LoginSort" NOT NULL DEFAULT 'SYSTEM',
    "lastLogout" TIMESTAMP,
    "hashedRt" TEXT,
    "isVerified" BOOLEAN NOT NULL,
    "userId" VARCHAR(36) NOT NULL,

    CONSTRAINT "Login_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Profile" (
    "id" SERIAL NOT NULL,
    "photoUrl" TEXT,
    "backgroundUrl" TEXT,
    "bio" VARCHAR(200),
    "website" TEXT,
    "userId" VARCHAR(36) NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Login_id_key" ON "Login"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Login_hashedRt_key" ON "Login"("hashedRt");

-- CreateIndex
CREATE UNIQUE INDEX "Login_userId_key" ON "Login"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_id_key" ON "Profile"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_userId_key" ON "Profile"("userId");

-- AddForeignKey
ALTER TABLE "Login" ADD CONSTRAINT "Login_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
