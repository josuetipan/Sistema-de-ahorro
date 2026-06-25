/*
  Warnings:

  - You are about to drop the column `meta_maxima` on the `cuentas` table. All the data in the column will be lost.
  - You are about to drop the column `meta_mensual` on the `cuentas` table. All the data in the column will be lost.
  - You are about to drop the column `meta_minima` on the `cuentas` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "cuentas" DROP COLUMN "meta_maxima",
DROP COLUMN "meta_mensual",
DROP COLUMN "meta_minima";

-- CreateTable
CREATE TABLE "configuracion_meta_ahorro" (
    "id_configuracion_meta_ahorro" UUID NOT NULL DEFAULT gen_random_uuid(),
    "meta_mensual" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "meta_minima" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "meta_maxima" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "configuracion_meta_ahorro_pkey" PRIMARY KEY ("id_configuracion_meta_ahorro")
);
