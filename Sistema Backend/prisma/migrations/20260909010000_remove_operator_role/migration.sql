DO $$
DECLARE
  operator_role_id UUID;
  operator_user_count INTEGER;
BEGIN
  SELECT id_role INTO operator_role_id
  FROM "roles"
  WHERE code_role = 'OPERATOR';

  IF operator_role_id IS NULL THEN
    RETURN;
  END IF;

  SELECT COUNT(*) INTO operator_user_count
  FROM "users"
  WHERE role_id = operator_role_id;

  IF operator_user_count > 0 THEN
    RAISE EXCEPTION 'No se puede eliminar OPERATOR: existen % usuario(s) con ese rol', operator_user_count;
  END IF;

  DELETE FROM "roles"
  WHERE id_role = operator_role_id;
END $$;
