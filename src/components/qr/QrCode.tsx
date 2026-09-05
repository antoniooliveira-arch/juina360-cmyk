import { useEffect, useState } from 'react';
import QRCode from 'qrcode';

interface QrCodeProps {
  value: string;
  size?: number;
  className?: string;
}

export function QrCode({ value, size = 160, className }: QrCodeProps) {
  const [uri, setUri] = useState<string>('');

  useEffect(() => {
    let ativo = true;
    QRCode.toDataURL(value || 'JUINA360º', {
      width: size,
      margin: 2,
      errorCorrectionLevel: 'M',
      color: { dark: '#0f172a', light: '#ffffff' },
    })
      .then(url => {
        if (ativo) setUri(url);
      })
      .catch(() => {
        if (ativo) setUri('');
      });
    return () => {
      ativo = false;
    };
  }, [value, size]);

  if (!uri) return <div className={`${className ?? ''} h-40 w-40 animate-pulse rounded-2xl bg-zinc-100`} />;
  return <img src={uri} alt="QR Code" width={size} height={size} className={`${className ?? ''} h-auto w-auto rounded-2xl bg-white shadow-sm`} />;
}