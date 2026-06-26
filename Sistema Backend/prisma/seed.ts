/**
 * La base de datos se llena exclusivamente vía las APIs.
 * Este seed no inserta datos de negocio.
 *
 * Flujo inicial recomendado (Insomnia):
 * 1. POST /api/auth/roles        → crear ADMIN, OPERATOR, CUSTOMER
 * 2. POST /api/auth/admins       → primer administrador (requiere ciudad vía API interna)
 * 3. POST /api/auth/login        → obtener token
 * 4. POST /api/auth/register     → registrar socios/clientes
 */
import 'dotenv/config';

async function main() {
  console.log(
    'Seed omitido: la BD se pobla por las APIs. Ver comentarios en prisma/seed.ts',
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
