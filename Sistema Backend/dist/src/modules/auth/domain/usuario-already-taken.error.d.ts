export declare class UsuarioAlreadyTakenError extends Error {
    readonly usuario: string;
    constructor(usuario: string);
}
