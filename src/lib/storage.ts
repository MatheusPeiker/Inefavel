// localStorage com fallback em memória (aba anônima, cookies bloqueados etc.).
const memory = new Map<string, string>();

export const storage = {
  get<T>(key: string, fallback: T): T {
    try {
      const raw = localStorage.getItem(key);
      return raw == null ? fallback : (JSON.parse(raw) as T);
    } catch {
      const raw = memory.get(key);
      return raw == null ? fallback : (JSON.parse(raw) as T);
    }
  },
  set(key: string, value: unknown) {
    const raw = JSON.stringify(value);
    memory.set(key, raw);
    try {
      localStorage.setItem(key, raw);
    } catch (e) {
      if (e instanceof DOMException && (e.name === 'QuotaExceededError' || e.code === 22)) {
        throw new Error('O navegador ficou sem espaço para salvar mais fotos. Envie fotos menores ou conecte o Supabase.');
      }
      // Sem acesso ao localStorage: segue em memória nesta sessão.
    }
  },
  remove(key: string) {
    memory.delete(key);
    try {
      localStorage.removeItem(key);
    } catch {
      /* ignore */
    }
  },
};

export const session = {
  get(key: string) {
    try {
      return sessionStorage.getItem(key);
    } catch {
      return memory.get('s:' + key) ?? null;
    }
  },
  set(key: string, v: string | null) {
    if (v == null) memory.delete('s:' + key);
    else memory.set('s:' + key, v);
    try {
      if (v == null) sessionStorage.removeItem(key);
      else sessionStorage.setItem(key, v);
    } catch {
      /* ignore */
    }
  },
};
