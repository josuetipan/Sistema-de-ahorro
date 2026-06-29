-- DropIndex
DROP INDEX "aportes_mensuales_cuenta_id_idx";

-- DropIndex
DROP INDEX "aportes_mensuales_cuenta_id_mes_key";

-- CreateIndex
CREATE INDEX "aportes_mensuales_cuenta_id_mes_idx" ON "aportes_mensuales"("cuenta_id", "mes");
