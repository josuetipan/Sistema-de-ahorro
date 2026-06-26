/** Contrato base para casos de uso (capa application). */
export interface UseCase<TInput, TOutput> {
  execute(input: TInput): Promise<TOutput>;
}
