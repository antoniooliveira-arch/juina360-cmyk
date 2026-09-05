export const CONTATO = {
  whatsapp: '5566999999999',
  email: 'comercial@juina360.com',
  cidade: 'Juína · MT',
};

export function linkWhatsApp(prefixo: string, texto: string): string {
  const msg = encodeURIComponent(`${prefixo}\n\n${texto}`);
  return `https://wa.me/${CONTATO.whatsapp}?text=${msg}`;
}