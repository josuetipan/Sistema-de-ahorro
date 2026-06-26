-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "EstadoSocio" AS ENUM ('activo', 'inactivo', 'pendiente');

-- CreateEnum
CREATE TYPE "TipoCuenta" AS ENUM ('ahorro', 'corriente', 'credito');

-- CreateEnum
CREATE TYPE "EstadoCuenta" AS ENUM ('activa', 'inactiva', 'bloqueada', 'cerrada');

-- CreateEnum
CREATE TYPE "TipoTransaccion" AS ENUM ('deposito', 'retiro', 'transferencia', 'pago_credito', 'desembolso');

-- CreateEnum
CREATE TYPE "EstadoSolicitud" AS ENUM ('pendiente', 'aprobado', 'rechazado');

-- CreateEnum
CREATE TYPE "EstadoCredito" AS ENUM ('activo', 'pagado', 'vencido', 'cancelado');

-- CreateEnum
CREATE TYPE "EstadoCuota" AS ENUM ('pendiente', 'pagada', 'vencida');

-- CreateEnum
CREATE TYPE "EstadoPago" AS ENUM ('aprobado', 'pendiente', 'rechazado');

-- CreateEnum
CREATE TYPE "TipoDocumento" AS ENUM ('ine', 'comprobante', 'contrato', 'otro');

-- CreateEnum
CREATE TYPE "EstadoDocumento" AS ENUM ('verificado', 'pendiente', 'rechazado');

-- CreateEnum
CREATE TYPE "EstadoAporte" AS ENUM ('pendiente', 'aprobado', 'rechazado');

-- CreateTable
CREATE TABLE "cities" (
    "id_city" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cities_pkey" PRIMARY KEY ("id_city")
);

-- CreateTable
CREATE TABLE "roles" (
    "id_role" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "code_role" TEXT NOT NULL,
    "description" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id_role")
);

-- CreateTable
CREATE TABLE "users" (
    "id_user" UUID NOT NULL DEFAULT gen_random_uuid(),
    "usuario" TEXT NOT NULL,
    "email" TEXT,
    "password_hash" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "role_id" UUID NOT NULL,
    "city_id" UUID NOT NULL,
    "maturity_at" TIMESTAMP(3) NOT NULL,
    "phone_number" TEXT,
    "identification" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "pending_password_reset" BOOLEAN NOT NULL DEFAULT true,
    "last_login" TIMESTAMP(3),
    "address" TEXT,
    "avatar_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id_user")
);

-- CreateTable
CREATE TABLE "admins" (
    "id_admin" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "full_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "identification" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "admins_pkey" PRIMARY KEY ("id_admin")
);

-- CreateTable
CREATE TABLE "password_encrypted" (
    "id_password_encrypted" UUID NOT NULL DEFAULT gen_random_uuid(),
    "id_usuario" UUID NOT NULL,
    "refresh" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "revocado" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "password_encrypted_pkey" PRIMARY KEY ("id_password_encrypted")
);

-- CreateTable
CREATE TABLE "socios" (
    "id_socio" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "codigo" TEXT NOT NULL,
    "estado" "EstadoSocio" NOT NULL DEFAULT 'pendiente',
    "fecha_alta" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "socios_pkey" PRIMARY KEY ("id_socio")
);

-- CreateTable
CREATE TABLE "cuentas" (
    "id_cuenta" UUID NOT NULL DEFAULT gen_random_uuid(),
    "socio_id" UUID NOT NULL,
    "numero_cuenta" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "meta_mensual" DECIMAL(14,2) NOT NULL,
    "color" TEXT,
    "icono" TEXT,
    "tipo" "TipoCuenta" NOT NULL DEFAULT 'ahorro',
    "estado" "EstadoCuenta" NOT NULL DEFAULT 'activa',
    "saldo" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "saldo_disponible" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "moneda" CHAR(3) NOT NULL DEFAULT 'MXN',
    "total_depositos" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "total_retiros" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "fecha_apertura" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cuentas_pkey" PRIMARY KEY ("id_cuenta")
);

-- CreateTable
CREATE TABLE "metas_ahorro" (
    "id_meta_ahorro" UUID NOT NULL DEFAULT gen_random_uuid(),
    "cuenta_id" UUID NOT NULL,
    "nombre" TEXT NOT NULL,
    "monto_objetivo" DECIMAL(14,2) NOT NULL,
    "monto_actual" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "fecha_limite" DATE,
    "activa" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "metas_ahorro_pkey" PRIMARY KEY ("id_meta_ahorro")
);

-- CreateTable
CREATE TABLE "config_cooperativa" (
    "id_config_cooperativa" UUID NOT NULL DEFAULT gen_random_uuid(),
    "nombre" TEXT NOT NULL,
    "rfc" TEXT,
    "direccion" TEXT,
    "telefono" TEXT,
    "tasa_ahorro_anual" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "tasa_credito_personal" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "tasa_credito_consumo" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "plazo_minimo_meses" INTEGER NOT NULL DEFAULT 6,
    "plazo_maximo_meses" INTEGER NOT NULL DEFAULT 60,
    "monto_minimo_credito" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "monto_maximo_credito" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "config_cooperativa_pkey" PRIMARY KEY ("id_config_cooperativa")
);

-- CreateTable
CREATE TABLE "tipos_credito" (
    "id_tipo_credito" UUID NOT NULL DEFAULT gen_random_uuid(),
    "config_cooperativa_id" UUID NOT NULL,
    "nombre" TEXT NOT NULL,
    "tasa_anual" DECIMAL(5,2) NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tipos_credito_pkey" PRIMARY KEY ("id_tipo_credito")
);

-- CreateTable
CREATE TABLE "solicitudes_credito" (
    "id_solicitud_credito" UUID NOT NULL DEFAULT gen_random_uuid(),
    "socio_id" UUID NOT NULL,
    "cuenta_id" UUID,
    "tipo_credito_id" UUID NOT NULL,
    "monto" DECIMAL(14,2) NOT NULL,
    "plazo_meses" INTEGER NOT NULL,
    "motivo" TEXT NOT NULL,
    "ingresos_mensuales" DECIMAL(14,2) NOT NULL,
    "estado" "EstadoSolicitud" NOT NULL DEFAULT 'pendiente',
    "revisado_por" UUID,
    "observaciones" TEXT,
    "fecha_solicitud" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_resolucion" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "solicitudes_credito_pkey" PRIMARY KEY ("id_solicitud_credito")
);

-- CreateTable
CREATE TABLE "creditos" (
    "id_credito" UUID NOT NULL DEFAULT gen_random_uuid(),
    "solicitud_id" UUID NOT NULL,
    "socio_id" UUID NOT NULL,
    "cuenta_id" UUID NOT NULL,
    "monto" DECIMAL(14,2) NOT NULL,
    "tasa_anual" DECIMAL(5,2) NOT NULL,
    "plazo_meses" INTEGER NOT NULL,
    "tipo" TEXT NOT NULL,
    "estado" "EstadoCredito" NOT NULL DEFAULT 'activo',
    "cuota_mensual" DECIMAL(14,2) NOT NULL,
    "cuotas_pagadas" INTEGER NOT NULL DEFAULT 0,
    "cuotas_pendientes" INTEGER NOT NULL,
    "proximo_vencimiento" DATE,
    "fecha_desembolso" DATE,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "creditos_pkey" PRIMARY KEY ("id_credito")
);

-- CreateTable
CREATE TABLE "cuotas" (
    "id_cuota" UUID NOT NULL DEFAULT gen_random_uuid(),
    "credito_id" UUID NOT NULL,
    "numero" INTEGER NOT NULL,
    "fecha_vencimiento" DATE NOT NULL,
    "capital" DECIMAL(14,2) NOT NULL,
    "interes" DECIMAL(14,2) NOT NULL,
    "total" DECIMAL(14,2) NOT NULL,
    "estado" "EstadoCuota" NOT NULL DEFAULT 'pendiente',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cuotas_pkey" PRIMARY KEY ("id_cuota")
);

-- CreateTable
CREATE TABLE "pagos" (
    "id_pago" UUID NOT NULL DEFAULT gen_random_uuid(),
    "credito_id" UUID NOT NULL,
    "cuota_id" UUID NOT NULL,
    "transaccion_id" UUID NOT NULL,
    "monto" DECIMAL(14,2) NOT NULL,
    "comprobante" TEXT NOT NULL,
    "estado" "EstadoPago" NOT NULL DEFAULT 'pendiente',
    "fecha_pago" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "registrado_por" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pagos_pkey" PRIMARY KEY ("id_pago")
);

-- CreateTable
CREATE TABLE "transacciones" (
    "id_transaccion" UUID NOT NULL DEFAULT gen_random_uuid(),
    "cuenta_origen_id" UUID NOT NULL,
    "cuenta_destino_id" UUID,
    "credito_id" UUID,
    "tipo" "TipoTransaccion" NOT NULL,
    "monto" DECIMAL(14,2) NOT NULL,
    "moneda" CHAR(3) NOT NULL DEFAULT 'MXN',
    "descripcion" TEXT,
    "referencia" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "registrado_por" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "transacciones_pkey" PRIMARY KEY ("id_transaccion")
);

-- CreateTable
CREATE TABLE "documentos" (
    "id_documento" UUID NOT NULL DEFAULT gen_random_uuid(),
    "socio_id" UUID NOT NULL,
    "solicitud_id" UUID,
    "nombre" TEXT NOT NULL,
    "tipo" "TipoDocumento" NOT NULL,
    "url_archivo" TEXT NOT NULL,
    "estado" "EstadoDocumento" NOT NULL DEFAULT 'pendiente',
    "fecha_subida" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "documentos_pkey" PRIMARY KEY ("id_documento")
);

-- CreateTable
CREATE TABLE "aportes_mensuales" (
    "id_aporte_mensual" UUID NOT NULL DEFAULT gen_random_uuid(),
    "cuenta_id" UUID NOT NULL,
    "mes" VARCHAR(7) NOT NULL,
    "monto" DECIMAL(14,2) NOT NULL,
    "meta_mensual" DECIMAL(14,2) NOT NULL,
    "referencia" TEXT,
    "comprobante" TEXT NOT NULL,
    "url_archivo" TEXT NOT NULL,
    "archivo_nombre" TEXT,
    "descripcion" TEXT,
    "estado" "EstadoAporte" NOT NULL,
    "fecha_registro" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "aportes_mensuales_pkey" PRIMARY KEY ("id_aporte_mensual")
);

-- CreateTable
CREATE TABLE "invitaciones" (
    "id_invitacion" UUID NOT NULL DEFAULT gen_random_uuid(),
    "codigo" TEXT NOT NULL,
    "user_id" UUID NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "invitaciones_pkey" PRIMARY KEY ("id_invitacion")
);

-- CreateTable
CREATE TABLE "banners" (
    "id_banner" UUID NOT NULL DEFAULT gen_random_uuid(),
    "titulo" TEXT NOT NULL,
    "subtitulo" TEXT,
    "imagen_url" TEXT NOT NULL,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "banners_pkey" PRIMARY KEY ("id_banner")
);

-- CreateIndex
CREATE UNIQUE INDEX "cities_name_key" ON "cities"("name");

-- CreateIndex
CREATE UNIQUE INDEX "roles_name_key" ON "roles"("name");

-- CreateIndex
CREATE UNIQUE INDEX "roles_code_role_key" ON "roles"("code_role");

-- CreateIndex
CREATE UNIQUE INDEX "users_usuario_key" ON "users"("usuario");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_role_id_idx" ON "users"("role_id");

-- CreateIndex
CREATE INDEX "users_city_id_idx" ON "users"("city_id");

-- CreateIndex
CREATE UNIQUE INDEX "admins_user_id_key" ON "admins"("user_id");

-- CreateIndex
CREATE INDEX "password_encrypted_id_usuario_idx" ON "password_encrypted"("id_usuario");

-- CreateIndex
CREATE UNIQUE INDEX "socios_user_id_key" ON "socios"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "socios_codigo_key" ON "socios"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "cuentas_numero_cuenta_key" ON "cuentas"("numero_cuenta");

-- CreateIndex
CREATE INDEX "cuentas_socio_id_idx" ON "cuentas"("socio_id");

-- CreateIndex
CREATE INDEX "metas_ahorro_cuenta_id_idx" ON "metas_ahorro"("cuenta_id");

-- CreateIndex
CREATE UNIQUE INDEX "tipos_credito_nombre_key" ON "tipos_credito"("nombre");

-- CreateIndex
CREATE INDEX "tipos_credito_config_cooperativa_id_idx" ON "tipos_credito"("config_cooperativa_id");

-- CreateIndex
CREATE INDEX "solicitudes_credito_socio_id_idx" ON "solicitudes_credito"("socio_id");

-- CreateIndex
CREATE INDEX "solicitudes_credito_estado_idx" ON "solicitudes_credito"("estado");

-- CreateIndex
CREATE UNIQUE INDEX "creditos_solicitud_id_key" ON "creditos"("solicitud_id");

-- CreateIndex
CREATE INDEX "creditos_socio_id_idx" ON "creditos"("socio_id");

-- CreateIndex
CREATE INDEX "creditos_estado_idx" ON "creditos"("estado");

-- CreateIndex
CREATE INDEX "cuotas_credito_id_idx" ON "cuotas"("credito_id");

-- CreateIndex
CREATE UNIQUE INDEX "cuotas_credito_id_numero_key" ON "cuotas"("credito_id", "numero");

-- CreateIndex
CREATE UNIQUE INDEX "pagos_cuota_id_key" ON "pagos"("cuota_id");

-- CreateIndex
CREATE UNIQUE INDEX "pagos_transaccion_id_key" ON "pagos"("transaccion_id");

-- CreateIndex
CREATE UNIQUE INDEX "pagos_comprobante_key" ON "pagos"("comprobante");

-- CreateIndex
CREATE INDEX "pagos_credito_id_idx" ON "pagos"("credito_id");

-- CreateIndex
CREATE UNIQUE INDEX "transacciones_referencia_key" ON "transacciones"("referencia");

-- CreateIndex
CREATE INDEX "transacciones_cuenta_origen_id_idx" ON "transacciones"("cuenta_origen_id");

-- CreateIndex
CREATE INDEX "transacciones_cuenta_destino_id_idx" ON "transacciones"("cuenta_destino_id");

-- CreateIndex
CREATE INDEX "transacciones_fecha_idx" ON "transacciones"("fecha");

-- CreateIndex
CREATE INDEX "documentos_socio_id_idx" ON "documentos"("socio_id");

-- CreateIndex
CREATE INDEX "documentos_solicitud_id_idx" ON "documentos"("solicitud_id");

-- CreateIndex
CREATE UNIQUE INDEX "aportes_mensuales_comprobante_key" ON "aportes_mensuales"("comprobante");

-- CreateIndex
CREATE INDEX "aportes_mensuales_cuenta_id_idx" ON "aportes_mensuales"("cuenta_id");

-- CreateIndex
CREATE INDEX "aportes_mensuales_estado_idx" ON "aportes_mensuales"("estado");

-- CreateIndex
CREATE INDEX "aportes_mensuales_mes_idx" ON "aportes_mensuales"("mes");

-- CreateIndex
CREATE UNIQUE INDEX "aportes_mensuales_cuenta_id_mes_key" ON "aportes_mensuales"("cuenta_id", "mes");

-- CreateIndex
CREATE UNIQUE INDEX "invitaciones_codigo_key" ON "invitaciones"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "invitaciones_user_id_key" ON "invitaciones"("user_id");

-- CreateIndex
CREATE INDEX "invitaciones_codigo_idx" ON "invitaciones"("codigo");

-- CreateIndex
CREATE INDEX "banners_activo_idx" ON "banners"("activo");

-- CreateIndex
CREATE INDEX "banners_orden_idx" ON "banners"("orden");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id_role") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "cities"("id_city") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admins" ADD CONSTRAINT "admins_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id_user") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "password_encrypted" ADD CONSTRAINT "password_encrypted_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "users"("id_user") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "socios" ADD CONSTRAINT "socios_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id_user") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cuentas" ADD CONSTRAINT "cuentas_socio_id_fkey" FOREIGN KEY ("socio_id") REFERENCES "socios"("id_socio") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "metas_ahorro" ADD CONSTRAINT "metas_ahorro_cuenta_id_fkey" FOREIGN KEY ("cuenta_id") REFERENCES "cuentas"("id_cuenta") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tipos_credito" ADD CONSTRAINT "tipos_credito_config_cooperativa_id_fkey" FOREIGN KEY ("config_cooperativa_id") REFERENCES "config_cooperativa"("id_config_cooperativa") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "solicitudes_credito" ADD CONSTRAINT "solicitudes_credito_socio_id_fkey" FOREIGN KEY ("socio_id") REFERENCES "socios"("id_socio") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "solicitudes_credito" ADD CONSTRAINT "solicitudes_credito_cuenta_id_fkey" FOREIGN KEY ("cuenta_id") REFERENCES "cuentas"("id_cuenta") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "solicitudes_credito" ADD CONSTRAINT "solicitudes_credito_tipo_credito_id_fkey" FOREIGN KEY ("tipo_credito_id") REFERENCES "tipos_credito"("id_tipo_credito") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "solicitudes_credito" ADD CONSTRAINT "solicitudes_credito_revisado_por_fkey" FOREIGN KEY ("revisado_por") REFERENCES "users"("id_user") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "creditos" ADD CONSTRAINT "creditos_solicitud_id_fkey" FOREIGN KEY ("solicitud_id") REFERENCES "solicitudes_credito"("id_solicitud_credito") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "creditos" ADD CONSTRAINT "creditos_socio_id_fkey" FOREIGN KEY ("socio_id") REFERENCES "socios"("id_socio") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "creditos" ADD CONSTRAINT "creditos_cuenta_id_fkey" FOREIGN KEY ("cuenta_id") REFERENCES "cuentas"("id_cuenta") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cuotas" ADD CONSTRAINT "cuotas_credito_id_fkey" FOREIGN KEY ("credito_id") REFERENCES "creditos"("id_credito") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pagos" ADD CONSTRAINT "pagos_credito_id_fkey" FOREIGN KEY ("credito_id") REFERENCES "creditos"("id_credito") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pagos" ADD CONSTRAINT "pagos_cuota_id_fkey" FOREIGN KEY ("cuota_id") REFERENCES "cuotas"("id_cuota") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pagos" ADD CONSTRAINT "pagos_transaccion_id_fkey" FOREIGN KEY ("transaccion_id") REFERENCES "transacciones"("id_transaccion") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pagos" ADD CONSTRAINT "pagos_registrado_por_fkey" FOREIGN KEY ("registrado_por") REFERENCES "users"("id_user") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transacciones" ADD CONSTRAINT "transacciones_cuenta_origen_id_fkey" FOREIGN KEY ("cuenta_origen_id") REFERENCES "cuentas"("id_cuenta") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transacciones" ADD CONSTRAINT "transacciones_cuenta_destino_id_fkey" FOREIGN KEY ("cuenta_destino_id") REFERENCES "cuentas"("id_cuenta") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transacciones" ADD CONSTRAINT "transacciones_credito_id_fkey" FOREIGN KEY ("credito_id") REFERENCES "creditos"("id_credito") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transacciones" ADD CONSTRAINT "transacciones_registrado_por_fkey" FOREIGN KEY ("registrado_por") REFERENCES "users"("id_user") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documentos" ADD CONSTRAINT "documentos_socio_id_fkey" FOREIGN KEY ("socio_id") REFERENCES "socios"("id_socio") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documentos" ADD CONSTRAINT "documentos_solicitud_id_fkey" FOREIGN KEY ("solicitud_id") REFERENCES "solicitudes_credito"("id_solicitud_credito") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "aportes_mensuales" ADD CONSTRAINT "aportes_mensuales_cuenta_id_fkey" FOREIGN KEY ("cuenta_id") REFERENCES "cuentas"("id_cuenta") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invitaciones" ADD CONSTRAINT "invitaciones_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id_user") ON DELETE CASCADE ON UPDATE CASCADE;
