import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import type { Usuario, Categoria, Noticia, Patrocinador } from '../types';
import {
  categorias as initialCategorias,
  usuarios as initialUsuarios,
  noticias as initialNoticias,
  patrocinadores as initialPatrocinadores,
} from '../data/mockData';
import * as api from '../lib/supabaseService';

interface AppContextType {
  categorias: Categoria[];
  noticias: Noticia[];
  patrocinadores: Patrocinador[];
  usuarios: Usuario[];
  currentUser: Usuario | null;
  isAuthenticated: boolean;
  loading: boolean;

  login: (email: string, senha: string) => boolean;
  logout: () => void;

  createNoticia: (n: Omit<Noticia, 'id' | 'views' | 'dataCriacao'>) => Promise<void>;
  updateNoticia: (id: string, data: Partial<Noticia>) => Promise<void>;
  deleteNoticia: (id: string) => Promise<void>;

  createCategoria: (c: Omit<Categoria, 'id'>) => Promise<void>;
  updateCategoria: (id: string, data: Partial<Categoria>) => Promise<void>;
  deleteCategoria: (id: string) => Promise<void>;

  createPatrocinador: (p: Omit<Patrocinador, 'id'>) => Promise<void>;
  updatePatrocinador: (id: string, data: Partial<Patrocinador>) => Promise<void>;
  deletePatrocinador: (id: string) => Promise<void>;

  createUsuario: (u: Omit<Usuario, 'id'>) => Promise<void>;
  updateUsuario: (id: string, data: Partial<Usuario>) => Promise<void>;
  deleteUsuario: (id: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [categorias, setCategorias] = useState<Categoria[]>(initialCategorias);
  const [noticias, setNoticias] = useState<Noticia[]>(initialNoticias);
  const [patrocinadores, setPatrocinadores] = useState<Patrocinador[]>(initialPatrocinadores);
  const [usuarios, setUsuarios] = useState<Usuario[]>(initialUsuarios);
  const [currentUser, setCurrentUser] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!api.supabaseDisponivel) {
        setLoading(false);
        return;
      }
      try {
        const [cats, nots, pats, usrs] = await Promise.all([
          api.fetchCategorias(),
          api.fetchNoticias(),
          api.fetchPatrocinadores(),
          api.fetchUsuarios(),
        ]);
        if (cats.length) setCategorias(cats);
        if (nots.length) setNoticias(nots);
        if (pats.length) setPatrocinadores(pats);
        if (usrs.length) setUsuarios(usrs);
      } catch (err) {
        console.warn('Supabase indisponível, usando dados mock:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const login = useCallback((email: string, senha: string): boolean => {
    const user = usuarios.find(u => u.email === email && u.senha === senha && u.status === 'ativo');
    if (user) {
      setCurrentUser(user);
      return true;
    }
    return false;
  }, [usuarios]);

  const logout = useCallback(() => setCurrentUser(null), []);

  const createNoticia = useCallback(async (n: Omit<Noticia, 'id' | 'views' | 'dataCriacao'>) => {
    if (api.supabaseDisponivel) {
      try {
        const created = await api.createNoticia(n);
        setNoticias(prev => [created, ...prev]);
        return;
      } catch (e) {
        console.warn('Falha ao criar notícia no Supabase:', e);
      }
    }
    const id = `not-${Date.now()}`;
    const nova: Noticia = { ...n, id, views: 0, dataCriacao: new Date() };
    setNoticias(prev => [nova, ...prev]);
  }, []);

  const updateNoticia = useCallback(async (id: string, data: Partial<Noticia>) => {
    if (api.supabaseDisponivel) {
      try {
        await api.updateNoticia(id, data);
      } catch (e) {
        console.warn('Falha ao atualizar notícia:', e);
      }
    }
    setNoticias(prev => prev.map(n => (n.id === id ? { ...n, ...data } : n)));
  }, []);

  const deleteNoticia = useCallback(async (id: string) => {
    if (api.supabaseDisponivel) {
      try {
        await api.deleteNoticia(id);
      } catch (e) {
        console.warn('Falha ao excluir notícia:', e);
      }
    }
    setNoticias(prev => prev.filter(n => n.id !== id));
  }, []);

  const createCategoria = useCallback(async (c: Omit<Categoria, 'id'>) => {
    if (api.supabaseDisponivel) {
      try {
        const created = await api.createCategoria(c);
        setCategorias(prev => [...prev, created]);
        return;
      } catch (e) {
        console.warn('Falha ao criar categoria:', e);
      }
    }
    const id = `cat-${Date.now()}`;
    setCategorias(prev => [...prev, { ...c, id }]);
  }, []);

  const updateCategoria = useCallback(async (id: string, data: Partial<Categoria>) => {
    if (api.supabaseDisponivel) {
      try {
        await api.updateCategoria(id, data);
      } catch (e) {
        console.warn('Falha ao atualizar categoria:', e);
      }
    }
    setCategorias(prev => prev.map(c => (c.id === id ? { ...c, ...data } : c)));
  }, []);

  const deleteCategoria = useCallback(async (id: string) => {
    if (api.supabaseDisponivel) {
      try {
        await api.deleteCategoria(id);
      } catch (e) {
        console.warn('Falha ao excluir categoria:', e);
      }
    }
    setCategorias(prev => prev.filter(c => c.id !== id));
  }, []);

  const createPatrocinador = useCallback(async (p: Omit<Patrocinador, 'id'>) => {
    if (api.supabaseDisponivel) {
      try {
        const created = await api.createPatrocinador(p);
        setPatrocinadores(prev => [...prev, created]);
        return;
      } catch (e) {
        console.warn('Falha ao criar patrocinador:', e);
      }
    }
    const id = `pat-${Date.now()}`;
    setPatrocinadores(prev => [...prev, { ...p, id }]);
  }, []);

  const updatePatrocinador = useCallback(async (id: string, data: Partial<Patrocinador>) => {
    if (api.supabaseDisponivel) {
      try {
        await api.updatePatrocinador(id, data);
      } catch (e) {
        console.warn('Falha ao atualizar patrocinador:', e);
      }
    }
    setPatrocinadores(prev => prev.map(p => (p.id === id ? { ...p, ...data } : p)));
  }, []);

  const deletePatrocinador = useCallback(async (id: string) => {
    if (api.supabaseDisponivel) {
      try {
        await api.deletePatrocinador(id);
      } catch (e) {
        console.warn('Falha ao excluir patrocinador:', e);
      }
    }
    setPatrocinadores(prev => prev.filter(p => p.id !== id));
  }, []);

  const createUsuario = useCallback(async (u: Omit<Usuario, 'id'>) => {
    if (api.supabaseDisponivel) {
      try {
        const created = await api.createUsuario(u);
        setUsuarios(prev => [...prev, created]);
        return;
      } catch (e) {
        console.warn('Falha ao criar usuário:', e);
      }
    }
    const id = `usr-${Date.now()}`;
    setUsuarios(prev => [...prev, { ...u, id }]);
  }, []);

  const updateUsuario = useCallback(async (id: string, data: Partial<Usuario>) => {
    if (api.supabaseDisponivel) {
      try {
        await api.updateUsuario(id, data);
      } catch (e) {
        console.warn('Falha ao atualizar usuário:', e);
      }
    }
    setUsuarios(prev => prev.map(u => (u.id === id ? { ...u, ...data } : u)));
  }, []);

  const deleteUsuario = useCallback(async (id: string) => {
    if (api.supabaseDisponivel) {
      try {
        await api.deleteUsuario(id);
      } catch (e) {
        console.warn('Falha ao excluir usuário:', e);
      }
    }
    if (currentUser?.id === id) return;
    setUsuarios(prev => prev.filter(u => u.id !== id));
  }, [currentUser]);

  return (
    <AppContext.Provider
      value={{
        categorias, noticias, patrocinadores, usuarios,
        currentUser, isAuthenticated: !!currentUser, loading,
        login, logout,
        createNoticia, updateNoticia, deleteNoticia,
        createCategoria, updateCategoria, deleteCategoria,
        createPatrocinador, updatePatrocinador, deletePatrocinador,
        createUsuario, updateUsuario, deleteUsuario,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp deve ser usado dentro de AppProvider');
  return context;
};