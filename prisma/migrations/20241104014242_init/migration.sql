-- CreateEnum
CREATE TYPE "Protocol" AS ENUM ('HTTP', 'HTTPS');

-- CreateTable
CREATE TABLE "Admin" (
    "id" TEXT NOT NULL,
    "is_super_admin" BOOLEAN NOT NULL,
    "name" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT,
    "password" TEXT NOT NULL,
    "external_id" TEXT,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Plan" (
    "id" TEXT NOT NULL,
    "pgsql" BOOLEAN NOT NULL DEFAULT false,
    "mysql" BOOLEAN NOT NULL DEFAULT false,
    "mongodb" BOOLEAN NOT NULL DEFAULT false,
    "storage" INTEGER NOT NULL DEFAULT 0,
    "bandwith" INTEGER NOT NULL DEFAULT 0,
    "containers" INTEGER NOT NULL DEFAULT 0,
    "ram" INTEGER NOT NULL DEFAULT 0,
    "cpu" INTEGER NOT NULL DEFAULT 0,
    "domains" INTEGER NOT NULL DEFAULT 0,
    "cron" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Plan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "plan_id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "email" TEXT,
    "external_id" TEXT,
    "env" JSONB NOT NULL DEFAULT '{}',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Container" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "image" TEXT NOT NULL DEFAULT 'node',
    "name" TEXT NOT NULL,
    "env" JSONB NOT NULL DEFAULT '{}',

    CONSTRAINT "Container_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Domain" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "container_id" TEXT,
    "domain" TEXT NOT NULL,
    "protocol_to" "Protocol" NOT NULL DEFAULT 'HTTP',
    "port_to" INTEGER,
    "path_from" TEXT NOT NULL DEFAULT '/',
    "path_to" TEXT NOT NULL DEFAULT '/',
    "ssl_cert_path" TEXT,
    "ssl_key_path" TEXT,

    CONSTRAINT "Domain_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cron" (
    "id" TEXT NOT NULL,
    "container_id" TEXT NOT NULL,
    "enable" BOOLEAN NOT NULL DEFAULT true,
    "cron_time" TEXT NOT NULL,
    "exec_command" TEXT NOT NULL,

    CONSTRAINT "Cron_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_username_key" ON "Admin"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Domain_domain_key" ON "Domain"("domain");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "Plan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Container" ADD CONSTRAINT "Container_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Domain" ADD CONSTRAINT "Domain_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Domain" ADD CONSTRAINT "Domain_container_id_fkey" FOREIGN KEY ("container_id") REFERENCES "Container"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cron" ADD CONSTRAINT "Cron_container_id_fkey" FOREIGN KEY ("container_id") REFERENCES "Container"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
