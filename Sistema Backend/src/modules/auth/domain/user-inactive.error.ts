export class UserInactiveError extends Error {
  constructor(message = 'Usuario inactivo') {
    super(message);
    this.name = 'UserInactiveError';
  }
}
