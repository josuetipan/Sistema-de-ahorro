# API Finnova — Documentación de Endpoints (para Insomnia)

Guía de las APIs **ya implementadas** del backend. Pensada para probar en Insomnia/Postman.

## Información general

- **Base URL local:** `http://localhost:3000/api`
  - El puerto se toma de `PORT` (por defecto `3000`).
  - Hay un **prefijo global** `/api`, así que TODAS las rutas empiezan con `/api`.
- **Formato:** JSON. Agrega el header `Content-Type: application/json` en todo `POST/PUT/PATCH`.
- **Validación estricta:** el backend rechaza campos no permitidos (`forbidNonWhitelisted`). Envía **solo** los campos documentados.
- **Autenticación:** JWT Bearer. En las rutas protegidas agrega el header:

```
Authorization: Bearer <accessToken>
```

### Formato de respuesta (envelope global)

**TODAS** las respuestas (éxito y error) usan este formato:

```json
{
  "code": 200,
  "status": "OK",
  "body": { ... }
}
```
- `code`: código HTTP (200, 201, 400, 401, 403, 404, 409, 500...).
- `status`: texto del código (`OK`, `Created`, `Bad Request`, etc.).
- `body`: el contenido real (objeto, arreglo o, en listados paginados, `{ data, meta }`).

> En los ejemplos de abajo, lo que se muestra es **el contenido de `body`** (para no repetir el envelope en cada uno).

**Ejemplo de error** (ej. token inválido):
```json
{
  "code": 401,
  "status": "Unauthorized",
  "body": { "message": "Unauthorized", "statusCode": 401 }
}
```

### Paginación

Los listados que pueden crecer aceptan los query params:
- `page` → número de página (entero ≥ 1, por defecto `1`).
- `limit` → tamaño de página (entero 1–100, por defecto `20`).

El `body` de un listado paginado tiene la forma:
```json
{
  "data": [ /* items */ ],
  "meta": { "page": 1, "limit": 20, "total": 57, "totalPages": 3 }
}
```
Endpoints paginados: `GET /api/ahorro/aportes`, `GET /api/admin/ahorro/aportes`, `GET /api/admin/ahorro/socios`, `GET /api/admin/ahorro/solicitudes`.

### Caché (Redis)

**Todos** los endpoints `GET` se cachean en **Redis**. Detalles:
- La caché es **por usuario**: la clave incluye el id del usuario autenticado, así que ningún cliente ve datos de otro.
- **TTL** configurable con `CACHE_TTL_MS` (por defecto `30000` ms = 30 s). Tras una escritura (POST/PATCH/DELETE), los `GET` pueden mostrar datos hasta `TTL` segundos antes de refrescarse.
- Solo se cachean respuestas exitosas de `GET`; los `POST/PUT/PATCH/DELETE` nunca se cachean.
- **Resiliente:** si Redis no está disponible, la API sigue respondiendo sin caché (no se cuelga ni falla).

Variables de entorno (ver `.env.example`):
```
REDIS_URL=redis://localhost:6379
CACHE_TTL_MS=30000
```

> Para aprovechar la caché necesitas un Redis corriendo. Rápido con Docker:
> `docker run -d --name redis -p 6379:6379 redis:7-alpine`

### Roles disponibles

| Código | Descripción |
|--------|-------------|
| `ADMIN` | Administrador (panel admin) |
| `OPERATOR` | Operador |
| `CUSTOMER` | Socio / cliente |

### Flujo recomendado para empezar a probar

1. `POST /api/auth/admins` → crea un administrador (no requiere token).
2. `POST /api/auth/login` → inicia sesión con ese admin y copia el `accessToken`.
3. Usa ese token como `Bearer` para crear roles, socios, cuentas, etc.

> Nota: el login admite `usuario` **o** `email`. Para el socio, el `usuario` se genera al registrarlo.

---

## 1. Health

### `GET /api/health`
Sin autenticación. Verifica que el servicio está arriba.

**Respuesta (200):**
```json
{ "status": "ok" }
```

---

## 2. Auth

### `POST /api/auth/admins` — Crear administrador
Público (no requiere token). Crea un usuario con rol `ADMIN`.

**Body:**
```json
{
  "fullName": "Juan Pérez",
  "email": "admin@finnova.com",
  "password": "12345678",
  "phoneNumber": "5512345678",
  "identification": "ABC123"
}
```
- `fullName` (req, mín. 2)
- `email` (req, email válido)
- `password` (req, mín. 8)
- `phoneNumber` (opcional)
- `identification` (opcional)

**Respuesta (201):** datos del admin creado (sin tokens). Luego haz login.

---

### `POST /api/auth/login` — Iniciar sesión
Público.

**Body (con usuario):**
```json
{
  "usuario": "admin@finnova.com",
  "password": "12345678"
}
```
**Body (con email):**
```json
{
  "email": "admin@finnova.com",
  "password": "12345678"
}
```
- Debes enviar `usuario` **o** `email` (al menos uno) + `password`.

**Respuesta (200):** incluye `accessToken` y `refreshToken` (cópialos para las siguientes peticiones).

---

### `POST /api/auth/refresh` — Renovar token
Público.

**Body:**
```json
{ "refreshToken": "<refreshToken>" }
```
**Respuesta (200):** nuevos tokens.

---

### `POST /api/auth/logout` — Cerrar sesión
Público.

**Body:**
```json
{ "refreshToken": "<refreshToken>" }
```
**Respuesta (200):**
```json
{ "success": true }
```

---

### `POST /api/auth/register` — Registrar socio/usuario
🔒 Requiere token **ADMIN**.

**Body:**
```json
{
  "fullName": "María López",
  "identification": "CED001122",
  "email": "maria@correo.com",
  "phoneNumber": "5599887766",
  "roleCode": "CUSTOMER",
  "codigoReferencia": "SOC-AB12CD",
  "password": "claveSegura1",
  "cityId": "uuid-de-ciudad"
}
```
- `fullName` (req, solo letras y espacios, máx. 60)
- `identification` (req, letras/números, máx. 20)
- `email` (req, email válido)
- `phoneNumber` (req, 7–20, formato telefónico)
- `roleCode` (req, uno de: `ADMIN`, `OPERATOR`, `CUSTOMER`)
- `codigoReferencia` (opcional, formato `SOC-XXXXXX`)
- `password` (opcional, 8–20)
- `cityId` (opcional, UUID v4)

---

### `GET /api/auth/me` — Datos del usuario autenticado
🔒 Requiere cualquier token válido (Bearer).

**Respuesta (200):**
```json
{
  "id": "...",
  "usuario": "...",
  "email": "...",
  "fullName": "...",
  "cityId": "...",
  "cityName": "...",
  "roles": ["..."]
}
```

---

### `POST /api/auth/reset-password` — Cambiar mi contraseña
🔒 Requiere cualquier token válido (Bearer). El `idUsuario` debe coincidir con el del token.

**Body:**
```json
{
  "idUsuario": "uuid-del-usuario-del-token",
  "currentPassword": "claveActual",
  "newPassword": "claveNueva123"
}
```
- `newPassword` (req, mín. 8 caracteres).
- `currentPassword` (**opcional**) controla el estado `pending_password_reset`:
  - **Si se envía**: se valida que sea correcta y `pending_password_reset` queda en **`false`** (el usuario ya puede entrar normal). Si la nueva contraseña es igual a la actual → `400`.
  - **Si se omite**: la contraseña se cambia sin validar la anterior y `pending_password_reset` queda en **`true`** (en el próximo login el front debe redirigirlo a cambiar contraseña).

---

### `PUT /api/auth/user/password` — Admin asigna contraseña
🔒 Requiere token **ADMIN**.

**Body:**
```json
{
  "idUsuario": "uuid-del-usuario",
  "newPassword": "nuevaClave123"
}
```

---

### `GET /api/auth/admin/health` — Ping admin
🔒 Requiere token **ADMIN**. Útil para verificar que tu token de admin funciona.

**Respuesta (200):**
```json
{ "ok": true, "checkedBy": "<usuario>" }
```

---

## 3. Roles

### `GET /api/auth/roles` — Listar roles activos
🔒 Requiere token **ADMIN**.

### `POST /api/auth/roles` — Crear rol
🔒 Requiere token **ADMIN**.

**Body:**
```json
{
  "name": "Operador",
  "codeRole": "OPERATOR",
  "description": "Rol operativo",
  "isActive": true
}
```
- `name` (req, mín. 2)
- `codeRole` (req, mín. 2, solo letras/números/`_`, se guarda en MAYÚSCULAS)
- `description` (opcional)
- `isActive` (opcional, booleano)

---

## 4. Ahorro — Cliente (socio)

🔒 Todas requieren token **CUSTOMER**.

### `GET /api/ahorro/mis-cuentas`
Lista las cuentas del socio autenticado.

### `GET /api/ahorro/meta`
Devuelve la configuración global de meta de ahorro (mensual, mínima, máxima).

### `GET /api/ahorro/cuentas/:cuentaId/calendario?anio=2026`
Calendario de aportes de una cuenta.
- `:cuentaId` → UUID de la cuenta.
- `anio` (query, opcional) → por defecto el año actual. Rango 2000–2100.
- `metaMensual`, `metaMinima` y `metaMaxima` reflejan **siempre la meta global vigente** (`configuracion_meta_ahorro`), no una meta por cuenta. Si el admin cambia la meta, todos los meses (incluso los ya aportados) muestran la nueva meta.

### `POST /api/ahorro/cuentas/:cuentaId/aportes` — Registrar aporte mensual
- `:cuentaId` → UUID de la cuenta.
- **Content-Type: `multipart/form-data`** (en Insomnia: pestaña Body → "Multipart Form").

**Campos del form-data:**
| Campo | Tipo | Obligatorio | Notas |
|-------|------|-------------|-------|
| `archivo` | **File** | Sí | El comprobante. Se guarda en BD como **base64** (`data:<mime>;base64,...`). Permitidos: PNG, JPG, PDF. Máx. 5 MB. |
| `mes` | texto | Sí | Formato `YYYY-MM`. **Se permiten varios aportes en el mismo mes** para una misma cuenta. |
| `monto` | texto (número) | Sí | > 0, máx. 2 decimales |
| `comprobante` | texto | Sí | Máx. 120, **único** en todo el sistema (código/referencia del pago) |
| `referencia` | texto | No | |
| `archivoNombre` | texto | No | Si se omite, se usa el nombre original del archivo |
| `descripcion` | texto | No | |

**Respuesta:** 201. El campo `urlArchivo` devuelto contiene la cadena base64 guardada.

> Ya **no** hay límite de un aporte por mes: puedes registrar tantos pagos como quieras en el mismo mes. La única restricción es que el `comprobante` no se repita (evita registrar dos veces el mismo pago).

### `POST /api/ahorro/cuentas/:cuentaId/solicitudes` — Solicitar retiro o eliminación
- `:cuentaId` → UUID de la cuenta de origen.

**Body (retiro):**
```json
{
  "tipo": "retiro",
  "monto": 200.00,
  "cuentaDestinoId": "uuid-cuenta-destino",
  "motivo": "Retiro parcial"
}
```
**Body (eliminación):**
```json
{
  "tipo": "eliminacion",
  "motivo": "Ya no usaré esta cuenta"
}
```
- `tipo` (req, `retiro` o `eliminacion`)
- `monto` (opcional, > 0) — usar en retiro
- `cuentaDestinoId` (opcional, UUID) — a dónde transferir el saldo
- `motivo` (opcional)

**Respuesta:** 201.

### `GET /api/ahorro/mis-solicitudes`
Lista las solicitudes del socio autenticado.

### `GET /api/ahorro/resumen`
Resumen para el dashboard del socio: saldos, **saldo pendiente** (aportes por verificar) y **progreso del mes actual**.

**Respuesta (200):**
```json
{
  "mesActual": "2026-06",
  "metaMensual": 25.0,
  "metaMinima": 0.0,
  "metaMaxima": 0.0,
  "totalAhorradoGlobal": 50.0,
  "saldoDisponibleGlobal": 50.0,
  "saldoPendienteGlobal": 50.0,
  "progresoMesGlobal": 25.0,
  "cantidadCuentas": 1,
  "cuentas": [
    {
      "cuentaId": "...",
      "numeroCuenta": "AH-2026-004821",
      "nombre": "Ahorro personal",
      "estado": "activa",
      "saldo": 50.0,
      "saldoDisponible": 50.0,
      "saldoPendiente": 50.0,
      "progresoMes": 25.0,
      "metaMensual": 25.0,
      "metaCumplida": true
    }
  ]
}
```

### `GET /api/ahorro/aportes?cuentaId=&desde=&hasta=&page=&limit=`
Lista **paginada** de los aportes/pagos del socio (para "Movimientos", "Actividad reciente" e "Historial de pagos"). Filtros opcionales:
- `cuentaId` → UUID, limita a una cuenta (debe ser del socio).
- `desde` → fecha `YYYY-MM-DD` (incluye desde las 00:00).
- `hasta` → fecha `YYYY-MM-DD` (incluye hasta las 23:59).
- `page` / `limit` → paginación (ver sección "Paginación"). Para "Actividad reciente" usa `page=1&limit=5`.

`body` = `{ data: [...], meta: {...} }`, ordenado por fecha de registro descendente.

> **Rendimiento:** el listado **no** incluye `urlArchivo` (el comprobante en base64, que puede pesar varios MB y volvía lenta la respuesta). Cada item trae solo metadatos (`mes`, `monto`, `estado`, `comprobante`, `archivoNombre`, `fechaRegistro`, etc.). Para ver/descargar el archivo de un aporte usa el endpoint de abajo.

### `GET /api/ahorro/aportes/:aporteId/comprobante`
Devuelve el comprobante (archivo en base64) de **un** aporte. Úsalo solo cuando el usuario quiera ver/descargar el comprobante (ej. al hacer clic en una fila de "Movimientos"). Valida que el aporte pertenezca al usuario autenticado.

**`body` (200):**
```json
{
  "idAporteMensual": "...",
  "cuentaId": "...",
  "comprobante": "REF-12345",
  "archivoNombre": "deposito.png",
  "urlArchivo": "data:image/png;base64,iVBORw0KGgo..."
}
```
- `404` si el aporte no existe; `403` si no es del usuario.

### `GET /api/ahorro/banners`
Lista los banners activos (carrusel del inicio), ordenados por `orden`. No requiere cuerpo. Cada banner trae `imagenUrl` como cadena **base64** (`data:<mime>;base64,...`), lista para usar directo en un `<img src=...>`.

### `GET /api/ahorro/mi-invitacion`
Devuelve el código de invitación del socio autenticado (pantalla "Mi Cuenta"). El código pertenece al **socio**, no a una cuenta; sirve para invitar a nuevas personas a la cooperativa.

**`body` (200):**
```json
{
  "idInvitacion": "...",
  "codigo": "AHORRO-JTP-7X4K",
  "activo": true,
  "createdAt": "2026-02-15T00:00:00.000Z",
  "titular": "María González",
  "socioCodigo": "SOC-AB12CD"
}
```
- `404` si el socio no tiene invitación.

### `POST /api/ahorro/cuentas` — Crear una nueva cuenta propia
Permite al socio agregar una cuenta ("Agregar nueva cuenta"). **El usuario se identifica por el token JWT** (header `Authorization`), por eso el body no lleva `userId`.

**Body:**
```json
{
  "nombre": "Ahorro vacaciones",
  "tipo": "ahorro",
  "moneda": "MXN",
  "color": "#22c55e",
  "icono": "wallet"
}
```
- `nombre` (req, máx. 60)
- `tipo` (opcional, `ahorro` | `corriente` | `credito`)
- `moneda` (opcional, 3 letras)
- `color`, `icono` (opcionales)

**`body` (201):** resumen de la cuenta creada, con contexto del dueño:
```json
{
  "idCuenta": "...",
  "numeroCuenta": "FNV123456789",
  "nombre": "Ahorro vacaciones",
  "tipo": "ahorro",
  "estado": "activa",
  "saldo": 0,
  "saldoDisponible": 0,
  "socioId": "...",
  "titular": "María González"
}
```
- `404` si el usuario autenticado no tiene un socio asociado.

---

## 5. Ahorro — Admin

🔒 Todas requieren token **ADMIN**.

### `POST /api/admin/ahorro/socios/:socioId/cuentas` — Crear cuenta a un socio
- `:socioId` → UUID del socio.

**Body:**
```json
{
  "nombre": "Ahorro principal",
  "tipo": "ahorro",
  "moneda": "MXN",
  "color": "#22c55e",
  "icono": "wallet"
}
```
- `nombre` (req, máx. 60)
- `tipo` (opcional, `ahorro` | `corriente` | `credito`)
- `moneda` (opcional, 3 letras, ej. `MXN`)
- `color`, `icono` (opcionales)

**Respuesta:** 201.

### `GET /api/admin/ahorro/aportes?estado=&mes=&cuentaId=&page=&limit=`
Lista **paginada** de aportes con filtros opcionales:
- `estado` → `pendiente` | `verificado` | `incompleto` | `atrasado` | `rechazado`
- `mes` → formato `YYYY-MM`
- `cuentaId` → UUID
- `page` / `limit` → paginación. `body` = `{ data, meta }`.
- Igual que el listado del socio, **no** incluye `urlArchivo` (base64) por rendimiento; trae los datos de cuenta/socio (`numeroCuenta`, `cuentaNombre`, `socioNombre`, etc.) más los metadatos del aporte.

### `GET /api/admin/ahorro/aportes/:aporteId/comprobante`
Devuelve el comprobante del aporte para revisión administrativa. Incluye `urlArchivo` como base64 (`data:<mime>;base64,...`) y metadatos del archivo.

### `PATCH /api/admin/ahorro/aportes/:aporteId/estado` — Verificar aporte
- `:aporteId` → UUID del aporte.

**Body:**
```json
{
  "estado": "verificado",
  "observaciones": "Comprobante correcto"
}
```
- `estado` (req, uno de: `verificado` | `incompleto` | `atrasado` | `rechazado`)
- `observaciones` (opcional)

### `GET /api/admin/ahorro/meta`
Devuelve la configuración de meta de ahorro global.

### `PATCH /api/admin/ahorro/meta` — Actualizar meta global
**Body (envía al menos uno):**
```json
{
  "metaMensual": 500.00,
  "metaMinima": 200.00,
  "metaMaxima": 1000.00
}
```
- Todos opcionales pero debes mandar al menos uno. Valores ≥ 0, máx. 2 decimales.

### `GET /api/admin/ahorro/socios?page=&limit=&q=&estado=&codigo=&nombre=&email=&identification=&cuentaEstado=`
Lista **paginada** de socios con su info de ahorro. `body` = `{ data, meta }`.

Filtros opcionales:
- `q` → búsqueda general por código, nombre, email, cédula/identificación, teléfono, número de cuenta o nombre de cuenta.
- `estado` → `activo` | `inactivo` | `pendiente`.
- `codigo` → código del socio.
- `nombre` → nombre del usuario.
- `email` → correo.
- `identification` → cédula/identificación.
- `cuentaEstado` → `activa` | `inactiva` | `bloqueada` | `cerrada`.
- `page` / `limit` → paginación. Por defecto `page=1`, `limit=20`; máximo `limit=100`.

### `GET /api/admin/ahorro/socios/:socioId`
Detalle de ahorro de un socio. `:socioId` → UUID.

### `GET /api/admin/ahorro/solicitudes?estado=&tipo=&page=&limit=`
Lista **paginada** de solicitudes de cuenta:
- `estado` → `pendiente` | `aprobada` | `rechazada`
- `tipo` → `eliminacion` | `retiro`
- `page` / `limit` → paginación. `body` = `{ data, meta }`.

### `PATCH /api/admin/ahorro/solicitudes/:solicitudId/resolver` — Aprobar/rechazar
- `:solicitudId` → UUID de la solicitud.

**Body:**
```json
{
  "aprobar": true,
  "observaciones": "Aprobado tras revisión"
}
```
- `aprobar` (req, booleano)
- `observaciones` (opcional)

---

## 6. Banners — Admin

🔒 Todas requieren token **ADMIN**. (El listado público para el socio es `GET /api/ahorro/banners`.)

### `GET /api/admin/ahorro/banners`
Lista **todos** los banners (activos e inactivos), ordenados por `orden`.

### `POST /api/admin/ahorro/banners` — Crear banner
- **Content-Type: `multipart/form-data`**.

**Campos del form-data:**
| Campo | Tipo | Obligatorio | Notas |
|-------|------|-------------|-------|
| `imagen` | **File** | Sí | Imagen del banner. Se guarda en BD como **base64**. Permitidos: PNG, JPG, WEBP, GIF. Máx. 5 MB. |
| `titulo` | texto | Sí | Máx. 120 |
| `subtitulo` | texto | No | Máx. 255 |
| `orden` | texto (número) | No | Entero ≥ 0 |
| `activo` | texto (`true`/`false`) | No | |

**Respuesta:** 201. El campo `imagenUrl` devuelto contiene la cadena base64.

### `PATCH /api/admin/ahorro/banners/:bannerId` — Actualizar banner
- `:bannerId` → UUID.
- **Content-Type: `multipart/form-data`**. Envía solo los campos a cambiar (todos opcionales).
- El campo `imagen` (File) es **opcional**: si no lo envías, se conserva la imagen actual; si lo envías, se reemplaza por la nueva (base64).

Ejemplo: para desactivar un banner, manda solo el campo de texto `activo` = `false`.

### `DELETE /api/admin/ahorro/banners/:bannerId` — Eliminar banner
- `:bannerId` → UUID.

**Respuesta (200):**
```json
{ "success": true }
```

---

## Códigos de error comunes

| Código | Significado |
|--------|-------------|
| `400` | Validación fallida o datos inválidos en el body |
| `401` | Token ausente/inválido o credenciales incorrectas |
| `403` | No tienes el rol requerido / acción no permitida |
| `404` | Recurso no encontrado |
| `409` | Conflicto (email/código/comprobante ya existe) |
| `500` | Error interno |

---

## Resumen de endpoints

| Método | Ruta | Rol |
|--------|------|-----|
| GET | `/api/health` | público |
| POST | `/api/auth/admins` | público |
| POST | `/api/auth/login` | público |
| POST | `/api/auth/refresh` | público |
| POST | `/api/auth/logout` | público |
| POST | `/api/auth/register` | ADMIN |
| GET | `/api/auth/me` | autenticado |
| POST | `/api/auth/reset-password` | autenticado |
| PUT | `/api/auth/user/password` | ADMIN |
| GET | `/api/auth/admin/health` | ADMIN |
| GET | `/api/auth/roles` | ADMIN |
| POST | `/api/auth/roles` | ADMIN |
| GET | `/api/ahorro/mis-cuentas` | CUSTOMER |
| GET | `/api/ahorro/resumen` | CUSTOMER |
| GET | `/api/ahorro/meta` | CUSTOMER |
| GET | `/api/ahorro/banners` | CUSTOMER |
| GET | `/api/ahorro/mi-invitacion` | CUSTOMER |
| GET | `/api/ahorro/aportes` | CUSTOMER |
| POST | `/api/ahorro/cuentas` | CUSTOMER |
| GET | `/api/ahorro/cuentas/:cuentaId/calendario` | CUSTOMER |
| POST | `/api/ahorro/cuentas/:cuentaId/aportes` | CUSTOMER |
| POST | `/api/ahorro/cuentas/:cuentaId/solicitudes` | CUSTOMER |
| GET | `/api/ahorro/mis-solicitudes` | CUSTOMER |
| POST | `/api/admin/ahorro/socios/:socioId/cuentas` | ADMIN |
| GET | `/api/admin/ahorro/aportes` | ADMIN |
| PATCH | `/api/admin/ahorro/aportes/:aporteId/estado` | ADMIN |
| GET | `/api/admin/ahorro/meta` | ADMIN |
| PATCH | `/api/admin/ahorro/meta` | ADMIN |
| GET | `/api/admin/ahorro/socios` | ADMIN |
| GET | `/api/admin/ahorro/socios/:socioId` | ADMIN |
| GET | `/api/admin/ahorro/solicitudes` | ADMIN |
| PATCH | `/api/admin/ahorro/solicitudes/:solicitudId/resolver` | ADMIN |
| GET | `/api/admin/ahorro/banners` | ADMIN |
| POST | `/api/admin/ahorro/banners` | ADMIN |
| PATCH | `/api/admin/ahorro/banners/:bannerId` | ADMIN |
| DELETE | `/api/admin/ahorro/banners/:bannerId` | ADMIN |
