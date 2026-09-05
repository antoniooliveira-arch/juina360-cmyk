import type { Campanha, PatrocinadorMedia } from '@/types';

export function fotoDe(c: Campanha | undefined): PatrocinadorMedia | undefined {
  return c?.media?.find(m => m.tipo === 'imagem') ?? c?.media?.find(m => m.tipo === 'video');
}

export function musicaDe(c: Campanha | undefined): PatrocinadorMedia | undefined {
  return c?.media?.find(m => m.tipo === 'audio');
}