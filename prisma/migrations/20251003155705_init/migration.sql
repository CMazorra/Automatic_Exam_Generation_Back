-- CreateTable
CREATE TABLE "User" (
    "id_us" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "account" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "course" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id_us")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_password_key" ON "User"("password");

-- CreateIndex
CREATE UNIQUE INDEX "User_account_key" ON "User"("account");
