"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AhorroModule = void 0;
const common_1 = require("@nestjs/common");
const auth_module_1 = require("../auth/auth.module");
const cuenta_repository_port_1 = require("./domain/ports/cuenta.repository.port");
const aporte_repository_port_1 = require("./domain/ports/aporte.repository.port");
const solicitud_cuenta_repository_port_1 = require("./domain/ports/solicitud-cuenta.repository.port");
const meta_config_repository_port_1 = require("./domain/ports/meta-config.repository.port");
const banner_repository_port_1 = require("./domain/ports/banner.repository.port");
const invitacion_repository_port_1 = require("./domain/ports/invitacion.repository.port");
const prisma_cuenta_repository_1 = require("./infrastructure/persistence/prisma/prisma-cuenta.repository");
const prisma_aporte_repository_1 = require("./infrastructure/persistence/prisma/prisma-aporte.repository");
const prisma_solicitud_cuenta_repository_1 = require("./infrastructure/persistence/prisma/prisma-solicitud-cuenta.repository");
const prisma_meta_config_repository_1 = require("./infrastructure/persistence/prisma/prisma-meta-config.repository");
const prisma_banner_repository_1 = require("./infrastructure/persistence/prisma/prisma-banner.repository");
const prisma_invitacion_repository_1 = require("./infrastructure/persistence/prisma/prisma-invitacion.repository");
const get_mis_cuentas_use_case_1 = require("./application/use-cases/get-mis-cuentas.use-case");
const get_calendario_cuenta_use_case_1 = require("./application/use-cases/get-calendario-cuenta.use-case");
const registrar_aporte_use_case_1 = require("./application/use-cases/registrar-aporte.use-case");
const crear_solicitud_cuenta_use_case_1 = require("./application/use-cases/crear-solicitud-cuenta.use-case");
const listar_mis_solicitudes_use_case_1 = require("./application/use-cases/listar-mis-solicitudes.use-case");
const listar_mis_aportes_use_case_1 = require("./application/use-cases/listar-mis-aportes.use-case");
const get_comprobante_aporte_use_case_1 = require("./application/use-cases/get-comprobante-aporte.use-case");
const get_resumen_ahorro_use_case_1 = require("./application/use-cases/get-resumen-ahorro.use-case");
const get_mi_invitacion_use_case_1 = require("./application/use-cases/get-mi-invitacion.use-case");
const crear_mi_cuenta_use_case_1 = require("./application/use-cases/crear-mi-cuenta.use-case");
const listar_banners_use_case_1 = require("./application/use-cases/listar-banners.use-case");
const crear_cuenta_use_case_1 = require("./application/use-cases/crear-cuenta.use-case");
const listar_aportes_use_case_1 = require("./application/use-cases/listar-aportes.use-case");
const verificar_aporte_use_case_1 = require("./application/use-cases/verificar-aporte.use-case");
const get_meta_config_use_case_1 = require("./application/use-cases/get-meta-config.use-case");
const actualizar_meta_config_use_case_1 = require("./application/use-cases/actualizar-meta-config.use-case");
const listar_socios_ahorro_use_case_1 = require("./application/use-cases/listar-socios-ahorro.use-case");
const get_socio_ahorro_use_case_1 = require("./application/use-cases/get-socio-ahorro.use-case");
const listar_solicitudes_use_case_1 = require("./application/use-cases/listar-solicitudes.use-case");
const resolver_solicitud_use_case_1 = require("./application/use-cases/resolver-solicitud.use-case");
const listar_banners_admin_use_case_1 = require("./application/use-cases/listar-banners-admin.use-case");
const crear_banner_use_case_1 = require("./application/use-cases/crear-banner.use-case");
const actualizar_banner_use_case_1 = require("./application/use-cases/actualizar-banner.use-case");
const eliminar_banner_use_case_1 = require("./application/use-cases/eliminar-banner.use-case");
const ahorro_controller_1 = require("./presentation/controllers/ahorro.controller");
const admin_ahorro_controller_1 = require("./presentation/controllers/admin-ahorro.controller");
let AhorroModule = class AhorroModule {
};
exports.AhorroModule = AhorroModule;
exports.AhorroModule = AhorroModule = __decorate([
    (0, common_1.Module)({
        imports: [auth_module_1.AuthModule],
        controllers: [ahorro_controller_1.AhorroController, admin_ahorro_controller_1.AdminAhorroController],
        providers: [
            prisma_cuenta_repository_1.PrismaCuentaRepository,
            prisma_aporte_repository_1.PrismaAporteRepository,
            prisma_solicitud_cuenta_repository_1.PrismaSolicitudCuentaRepository,
            prisma_meta_config_repository_1.PrismaMetaConfigRepository,
            prisma_banner_repository_1.PrismaBannerRepository,
            prisma_invitacion_repository_1.PrismaInvitacionRepository,
            { provide: cuenta_repository_port_1.CUENTA_REPOSITORY, useExisting: prisma_cuenta_repository_1.PrismaCuentaRepository },
            { provide: aporte_repository_port_1.APORTE_REPOSITORY, useExisting: prisma_aporte_repository_1.PrismaAporteRepository },
            {
                provide: solicitud_cuenta_repository_port_1.SOLICITUD_CUENTA_REPOSITORY,
                useExisting: prisma_solicitud_cuenta_repository_1.PrismaSolicitudCuentaRepository,
            },
            { provide: meta_config_repository_port_1.META_CONFIG_REPOSITORY, useExisting: prisma_meta_config_repository_1.PrismaMetaConfigRepository },
            { provide: banner_repository_port_1.BANNER_REPOSITORY, useExisting: prisma_banner_repository_1.PrismaBannerRepository },
            { provide: invitacion_repository_port_1.INVITACION_REPOSITORY, useExisting: prisma_invitacion_repository_1.PrismaInvitacionRepository },
            get_mis_cuentas_use_case_1.GetMisCuentasUseCase,
            get_calendario_cuenta_use_case_1.GetCalendarioCuentaUseCase,
            registrar_aporte_use_case_1.RegistrarAporteUseCase,
            crear_solicitud_cuenta_use_case_1.CrearSolicitudCuentaUseCase,
            listar_mis_solicitudes_use_case_1.ListarMisSolicitudesUseCase,
            listar_mis_aportes_use_case_1.ListarMisAportesUseCase,
            get_comprobante_aporte_use_case_1.GetComprobanteAporteUseCase,
            get_resumen_ahorro_use_case_1.GetResumenAhorroUseCase,
            get_mi_invitacion_use_case_1.GetMiInvitacionUseCase,
            crear_mi_cuenta_use_case_1.CrearMiCuentaUseCase,
            listar_banners_use_case_1.ListarBannersUseCase,
            crear_cuenta_use_case_1.CrearCuentaUseCase,
            listar_aportes_use_case_1.ListarAportesUseCase,
            verificar_aporte_use_case_1.VerificarAporteUseCase,
            get_meta_config_use_case_1.GetMetaConfigUseCase,
            actualizar_meta_config_use_case_1.ActualizarMetaConfigUseCase,
            listar_socios_ahorro_use_case_1.ListarSociosAhorroUseCase,
            get_socio_ahorro_use_case_1.GetSocioAhorroUseCase,
            listar_solicitudes_use_case_1.ListarSolicitudesUseCase,
            resolver_solicitud_use_case_1.ResolverSolicitudUseCase,
            listar_banners_admin_use_case_1.ListarBannersAdminUseCase,
            crear_banner_use_case_1.CrearBannerUseCase,
            actualizar_banner_use_case_1.ActualizarBannerUseCase,
            eliminar_banner_use_case_1.EliminarBannerUseCase,
        ],
    })
], AhorroModule);
//# sourceMappingURL=ahorro.module.js.map