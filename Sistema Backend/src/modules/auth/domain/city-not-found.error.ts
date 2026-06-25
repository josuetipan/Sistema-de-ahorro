export class CityNotFoundError extends Error {
  constructor(message = 'La ciudad no existe o está inactiva') {
    super(message);
    this.name = 'CityNotFoundError';
  }
}
