---
name: prisma-create-table-uuid
description: Utiliza esta skill para crear tablas en Prisma donde los IDs se generen automáticamente usando `uuid` con el prefijo de la tabla (por ejemplo, `id_user` para la tabla `Users`, `id_order` para la tabla `Orders`, etc.).
---

# Skill para crear tablas en Prisma con UUID y prefijos en los IDs

## Objetivo
Crear una tabla en Prisma asegurando que:
1. Los IDs de las tablas sigan el formato `<id_table>`, por ejemplo, `id_user` para la tabla `Users`.
2. Los IDs sean generados automáticamente usando la función `gen_random_uuid()` para asegurar que sean UUIDs.

## Flujo de trabajo
1. **Identificar la tabla**: Definir el nombre de la tabla y cómo se relacionan las columnas.
2. **Definir el nombre del ID**: El nombre del ID debe seguir el formato `<id_table>`, es decir, para la tabla `Users`, el ID debe llamarse `id_user`.
3. **Usar UUID para los IDs**: El tipo del campo de ID debe ser `String` y debe usar la función `gen_random_uuid()` para generar automáticamente el UUID.
4. **Agregar el campo `createdAt`**: Es recomendable tener un campo para la fecha de creación, por ejemplo, `createdAt DateTime @default(now())` para hacer un seguimiento de la creación de cada registro.
5. **Generar el modelo Prisma**: Crear el modelo en el archivo `schema.prisma`.
6. **Generar migración y aplicar**: Ejecutar el comando para generar la migración y aplicar los cambios a la base de datos.

## Ejemplo de un modelo en Prisma
### Creación de la tabla `Users`:
```prisma id="m9cjq1"
model User {
  id        String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  username  String
  email     String   @unique
  password  String
  createdAt DateTime @default(now())

  @@map("users") // Opcional: asegura que el nombre de la tabla sea 'users' en la DB
}