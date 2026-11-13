import { useState } from 'react';
import { LockKeyhole } from 'lucide-react';
import { useStore } from '../../lib/store';
import { Logo } from '../../components/Logo';

const DEMO_PIN = !import.meta.env.VITE_ADMIN_PIN;

export function Login() {
  const { signIn, mode, ready } = useStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const supa = mode === 'supabase';

  return (
    <div className="wrap grid place-items-center py-16">
      <form
        className="card w-full max-w-sm p-7"
        onSubmit={async (e) => {
          e.preventDefault();
          setBusy(true);
          setError('');
          try {
            await signIn({ email, password });
          } catch (err) {
            setError((err as Error).message);
          } finally {
            setBusy(false);
          }
        }}
      >
        <Logo variant="symbol" className="h-12 w-auto text-fg" title="" />
        <h1 className="display mt-5 text-[28px]">Área do lojista</h1>
        <p className="mt-1 text-[14px] text-muted">Entre para cadastrar, editar e remover carros do estoque.</p>
        {supa && (
          <div className="mt-6">
            <label className="field-label" htmlFor="adm-email">E-mail</label>
            <input id="adm-email" type="email" autoComplete="username" className="input" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
        )}
        <div className="mt-4">
          <label className="field-label" htmlFor="adm-senha">{supa ? 'Senha' : 'PIN de acesso'}</label>
          <input
            id="adm-senha"
            type="password"
            inputMode={supa ? undefined : 'numeric'}
            autoComplete="current-password"
            className="input tracking-widest"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            aria-invalid={!!error}
            required
            autoFocus
          />
        </div>
        {error && <p className="mt-3 text-[13px] font-semibold text-danger">{error}</p>}
        <button className="btn btn-primary mt-5 w-full" disabled={busy || !ready}>
          <LockKeyhole size={17} /> {busy ? 'Entrando…' : 'Entrar'}
        </button>
        {!supa && DEMO_PIN && (
          <p className="mt-4 rounded-xl bg-brand-soft px-3 py-2 text-center text-[13px] font-semibold text-brand-text">
            Demonstração: use o PIN <span className="tnum">1234</span>
          </p>
        )}
      </form>
    </div>
  );
}
