export const UserRole = {
  ADMIN: 'ADMIN',
  OPERATOR: 'OPERATOR',
  CUSTOMER: 'CUSTOMER',
} as const;

export type UserRoleName = (typeof UserRole)[keyof typeof UserRole];
