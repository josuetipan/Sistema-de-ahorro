/*
  Warnings:

  - The values [aprobado] on the enum `EstadoAporte` will be removed. If these variants are still used in the database, this will fail.

*/
-- CreateEnum
CREATE TYPE "TipoSolicitudCuenta" AS ENUM ('eliminacion', 'retiro');

-- CreateEnum
CREATE TYPE "EstadoSolicitudCuenta" AS ENUM ('pendiente', 'aprobada', 'rechazada');

-- AlterEnum
BEGIN;
CREATE TYPE "EstadoAporte_new" AS ENUM ('pendiente', 'verificado', 'incompleto', 'atrasado', 'rechazado');
ALTER TABLE "aportes_mensuales" ALTER COLUMN "estado" TYPE "EstadoAporte_new" USING ("estado"::text::"EstadoAporte_new");
ALTER TYPE "EstadoAporte" RENAME TO "EstadoAporte_old";
ALTER TYPE "EstadoAporte_new" RENAME TO "EstadoAporte";
DROP TYPE "public"."EstadoAporte_old";
COMMIT;

-- AlterTable
ALTER TABLE "aportes_mensuales" ADD COLUMN     "fecha_verificacion" TIMESTAMP(3),
ADD COLUMN     "observaciones" TEXT,
ADD COLUMN     "verificado_por" UUID,
ALTER COLUMN "estado" SET DEFAULT 'pendiente',
ALTER COLUMN "fecha_registro" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "cuentas" ADD COLUMN     "meta_maxima" DECIMAL(14,2) NOT NULL DEFAULT 0,
ADD COLUMN     "meta_minima" DECIMAL(14,2) NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "solicitudes_cuenta" (
    "id_solicitud_cuenta" UUID NOT NULL DEFAULT gen_random_uuid(),
    "cuenta_origen_id" UUID NOT NULL,
    "cuenta_destino_id" UUID,
    "tipo" "TipoSolicitudCuenta" NOT NULL,
    "monto" DECIMAL(14,2),
    "motivo" TEXT,
    "estado" "EstadoSolicitudCuenta" NOT NULL DEFAULT 'pendiente',
    "observaciones" TEXT,
    "resuelto_por" UUID,
    "fecha_resolucion" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "solicitudes_cuenta_pkey" PRIMARY KEY ("id_solicitud_cuenta")
);

-- CreateIndex
CREATE INDEX "solicitudes_cuenta_cuenta_origen_id_idx" ON "solicitudes_cuenta"("cuenta_origen_id");

-- CreateIndex
CREATE INDEX "solicitudes_cuenta_estado_idx" ON "solicitudes_cuenta"("estado");

-- CreateIndex
CREATE INDEX "solicitudes_cuenta_tipo_idx" ON "solicitudes_cuenta"("tipo");

-- AddForeignKey
ALTER TABLE "solicitudes_cuenta" ADD CONSTRAINT "solicitudes_cuenta_cuenta_origen_id_fkey" FOREIGN KEY ("cuenta_origen_id") REFERENCES "cuentas"("id_cuenta") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "solicitudes_cuenta" ADD CONSTRAINT "solicitudes_cuenta_cuenta_destino_id_fkey" FOREIGN KEY ("cuenta_destino_id") REFERENCES "cuentas"("id_cuenta") ON DELETE SET NULL ON UPDATE CASCADE;
