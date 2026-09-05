import React, { createContext, useContext } from 'react';
import { cn } from '@/lib/cn';
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from 'lucide-react';

type Tipo = 'success' | 'warning' | 'error' | 'info';

interface Toast {
  id: number;
  tipo: Tipo;
  mensagem: string;
}

interface ToastContextType {
  toast: (tipo: Tipo, mensagem: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

let nextId = 1;

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = React.useState<Toast[]>([]);

  const push = React.useCallback((tipo: Tipo, mensagem: string) => {
    const id = nextId++;
    setToasts(prev => [...prev, { id, tipo, mensagem }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  }, []);

  const icons: Record<Tipo, React.ReactNode> = {
    success: <CheckCircle2 className="h-5 w-5 text-emerald-500" />,
    warning: <AlertTriangle className="h-5 w-5 text-amber-500" />,
    error: <XCircle className="h-5 w-5 text-red-500" />,
    info: <Info className="h-5 w-5 text-blue-500" />,
  };

  return (
    <ToastContext.Provider value={{ toast: push }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex w-full max-w-sm flex-col gap-2">
        {toasts.map(t => (
          <div
            key={t.id}
            className={cn(
              'flex items-start gap-3 rounded-lg border bg-white p-3 shadow-lg',
              t.tipo === 'success' && 'border-emerald-200',
              t.tipo === 'warning' && 'border-amber-200',
              t.tipo === 'error' && 'border-red-200',
              t.tipo === 'info' && 'border-blue-200'
            )}
          >
            {icons[t.tipo]}
            <p className="flex-1 text-sm text-zinc-800">{t.mensagem}</p>
            <button onClick={() => setToasts(prev => prev.filter(x => x.id !== t.id))} className="text-zinc-400 hover:text-zinc-600">
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast deve ser usado dentro de ToastProvider');
  return context;
};