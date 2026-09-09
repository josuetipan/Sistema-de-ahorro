export const UserRole = {
  ADMIN: 'ADMIN',
  CUSTOMER: 'CUSTOMER',
  ACCOUNTANT: 'ACCOUNTANT',
} as const;

export type UserRoleName = (typeof UserRole)[keyof typeof UserRole];
