// Servicio de aplicación para envío de notificaciones al usuario
export class NotificacionService {
  async enviar(to: string, mensaje: string): Promise<void> {
    console.info(`[Notificación] ${to}: ${mensaje}`);
  }
}
