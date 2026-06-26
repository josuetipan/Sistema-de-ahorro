import { type AuthUserPayload } from '../../../auth/infrastructure/auth/current-user.decorator';
import { GetMisCuentasUseCase } from '../../application/use-cases/get-mis-cuentas.use-case';
import { GetMetaConfigUseCase } from '../../application/use-cases/get-meta-config.use-case';
import { GetCalendarioCuentaUseCase } from '../../application/use-cases/get-calendario-cuenta.use-case';
import { RegistrarAporteUseCase } from '../../application/use-cases/registrar-aporte.use-case';
import { CrearSolicitudCuentaUseCase } from '../../application/use-cases/crear-solicitud-cuenta.use-case';
import { ListarMisSolicitudesUseCase } from '../../application/use-cases/listar-mis-solicitudes.use-case';
import { RegistrarAporteHttpDto } from '../dto/registrar-aporte.http.dto';
import { CrearSolicitudHttpDto } from '../dto/crear-solicitud.http.dto';
export declare class AhorroController {
    private readonly getMisCuentas;
    private readonly getMetaConfig;
    private readonly getCalendario;
    private readonly registrarAporte;
    private readonly crearSolicitud;
    private readonly listarMisSolicitudes;
    private readonly logger;
    constructor(getMisCuentas: GetMisCuentasUseCase, getMetaConfig: GetMetaConfigUseCase, getCalendario: GetCalendarioCuentaUseCase, registrarAporte: RegistrarAporteUseCase, crearSolicitud: CrearSolicitudCuentaUseCase, listarMisSolicitudes: ListarMisSolicitudesUseCase);
    misCuentas(user: AuthUserPayload): Promise<import("../../application/use-cases/get-mis-cuentas.use-case").MisCuentasResult>;
    meta(): Promise<import("../../domain/ports/meta-config.repository.port").MetaConfig>;
    calendario(user: AuthUserPayload, cuentaId: string, anio?: string): Promise<import("../../application/use-cases/get-calendario-cuenta.use-case").CalendarioResult>;
    registrarAportePago(user: AuthUserPayload, cuentaId: string, body: RegistrarAporteHttpDto): Promise<import("../../domain/ports/aporte.repository.port").AporteResumen>;
    solicitar(user: AuthUserPayload, cuentaId: string, body: CrearSolicitudHttpDto): Promise<import("../../domain/ports/solicitud-cuenta.repository.port").SolicitudCuentaResumen>;
    misSolicitudes(user: AuthUserPayload): Promise<import("../../domain/ports/solicitud-cuenta.repository.port").SolicitudCuentaResumen[]>;
    private mapError;
}
