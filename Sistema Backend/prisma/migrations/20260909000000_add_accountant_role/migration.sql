INSERT INTO "roles" ("id_role", "name", "code_role", "description", "is_active", "created_at")
VALUES
  (gen_random_uuid(), 'Administrador', 'ADMIN', 'Administrador del sistema', true, NOW()),
  (gen_random_uuid(), 'Operador', 'OPERATOR', 'Operador del sistema', true, NOW()),
  (gen_random_uuid(), 'Usuario', 'CUSTOMER', 'Socio o cliente', true, NOW()),
  (gen_random_uuid(), 'Contador', 'ACCOUNTANT', 'Verifica aportes', true, NOW())
ON CONFLICT ("code_role") DO UPDATE
SET "is_active" = true;

INSERT INTO "cities" ("id_city", "name", "is_active", "created_at")
VALUES
  (gen_random_uuid(), 'General', true, NOW()),
  (gen_random_uuid(), 'Sistema', true, NOW())
ON CONFLICT ("name") DO UPDATE
SET "is_active" = true;