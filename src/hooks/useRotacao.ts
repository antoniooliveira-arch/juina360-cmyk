import { useEffect, useState } from 'react';

export function useRotacao(total: number, intervaloMs = 10000) {
  const [indice, setIndice] = useState(0);
  useEffect(() => {
    if (total <= 1) return;
    const t = setInterval(() => setIndice(i => (i + 1) % total), intervaloMs);
    return () => clearInterval(t);
  }, [total, intervaloMs]);
  return indice;
}

export function atualDaRotacao<T>(itens: T[], indice: number): T | undefined {
  if (!itens.length) return undefined;
  return itens[((indice % itens.length) + itens.length) % itens.length];
}