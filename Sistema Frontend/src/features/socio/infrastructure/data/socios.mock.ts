import type { Socio } from '../../domain/socio.entity';

export const MOCK_SOCIOS_DATA: Socio[] = [
  {
    id: 'soc-1',
    codigoReferencia: 'SOC-ABC123',
    nombres: 'María González López',
    cedula: '1234567890',
    email: 'maria.gonzalez@correo.com',
    telefono: '555-123-4567',
    estado: 'activo',
    fechaAlta: '2024-03-15',
    cuentas: [
      {
        id: 'cta-1-1',
        numeroCuenta: '001-0001',
        saldo: 10000,
        estado: 'ACTIVA',
        fechaApertura: '2024-03-15',
      },
      {
        id: 'cta-1-2',
        numeroCuenta: '001-0002',
        saldo: 2500,
        estado: 'ACTIVA',
        fechaApertura: '2025-01-10',
      },
    ],
  },
  {
    id: 'soc-2',
    codigoReferencia: 'SOC-XYZ789',
    nombres: 'Carlos Ramírez Vega',
    cedula: '0987654321',
    email: 'carlos.ramirez@correo.com',
    telefono: '555-234-5678',
    estado: 'activo',
    fechaAlta: '2024-06-20',
    referidoPor: 'SOC-ABC123',
    referidoPorId: 'soc-1',
    cuentas: [
      {
        id: 'cta-2-1',
        numeroCuenta: '002-0001',
        saldo: 8300,
        estado: 'ACTIVA',
        fechaApertura: '2024-06-20',
      },
    ],
  },
  {
    id: 'soc-3',
    codigoReferencia: 'SOC-F5T1W6',
    nombres: 'Ana Patricia Morales',
    cedula: '1122334455',
    email: 'ana.morales@correo.com',
    telefono: '555-345-6789',
    estado: 'pendiente',
    fechaAlta: '2026-05-28',
    referidoPor: 'SOC-XYZ789',
    referidoPorId: 'soc-2',
    cuentas: [],
  },
  {
    id: 'soc-4',
    codigoReferencia: 'SOC-D9H4L2',
    nombres: 'Roberto Sánchez Díaz',
    cedula: '5566778899',
    email: 'roberto.sanchez@correo.com',
    telefono: '555-456-7890',
    estado: 'inactivo',
    fechaAlta: '2023-01-10',
    cuentas: [
      {
        id: 'cta-4-1',
        numeroCuenta: '004-0001',
        saldo: 450,
        estado: 'INACTIVA',
        fechaApertura: '2023-01-10',
      },
    ],
  },
  {
    id: 'soc-5',
    codigoReferencia: 'SOC-X2Q8J7',
    nombres: 'Laura Hernández Ruiz',
    cedula: '9988776655',
    email: 'laura.hernandez@correo.com',
    telefono: '555-567-8901',
    estado: 'activo',
    fechaAlta: '2025-02-14',
    referidoPor: 'SOC-ABC123',
    referidoPorId: 'soc-1',
    cuentas: [
      {
        id: 'cta-5-1',
        numeroCuenta: '005-0001',
        saldo: 15000,
        estado: 'ACTIVA',
        fechaApertura: '2025-02-14',
      },
      {
        id: 'cta-5-2',
        numeroCuenta: '005-0002',
        saldo: 5100,
        estado: 'ACTIVA',
        fechaApertura: '2025-06-01',
      },
      {
        id: 'cta-5-3',
        numeroCuenta: '005-0003',
        saldo: 2000,
        estado: 'INACTIVA',
        fechaApertura: '2026-01-15',
      },
    ],
  },
];

/** Códigos de referencia válidos para registro público (socios activos) */
export const CODIGOS_REFERENCIA_VALIDOS = MOCK_SOCIOS_DATA.filter((s) => s.estado === 'activo').map(
  (s) => s.codigoReferencia,
);
