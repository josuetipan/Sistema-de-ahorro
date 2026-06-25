type PagosAhorroListener = () => void;

const listeners = new Set<PagosAhorroListener>();

export function subscribePagosAhorro(listener: PagosAhorroListener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function notifyPagosAhorroChanged(): void {
  listeners.forEach((listener) => listener());
}
