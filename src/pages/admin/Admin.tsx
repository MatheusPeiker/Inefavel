import { useState } from 'react';
import { CarFront, LogOut, Settings, ExternalLink } from 'lucide-react';
import { useStore } from '../../lib/store';
import { Link } from '../../lib/router';
import { Logo } from '../../components/Logo';
import { Login } from './Login';
import { Inventory } from './Inventory';
import { SettingsPanel } from './SettingsPanel';

type Tab = 'estoque' | 'config';

export function Admin() {
  const { signedIn, signOut, mode } = useStore();
  const [tab, setTab] = useState<Tab>('estoque');
  if (!signedIn) return <Login />;
  return (
    <div className="wrap pt-6">
      <div className="flex flex-wrap items-center gap-3">
        <Logo variant="symbol" className="hidden h-10 w-auto text-fg sm:block" title="" />
        <div className="min-w-0 flex-1 basis-[260px]">
          <h1 className="display text-[clamp(1.6rem,3.4vw,2.2rem)]">Painel do lojista</h1>
          <p className="text-[13px] text-muted">
            {mode === 'supabase' ? (
              <>Conectado ao banco de dados. As mudanças aparecem no site na hora.</>
            ) : (
              <>
                <span className="mr-1.5 inline-block h-2 w-2 rounded-full bg-brand align-middle" />
                Modo demonstração: as mudanças ficam salvas neste navegador.
              </>
            )}
          </p>
        </div>
        <Link to={{ name: 'home' }} className="btn btn-ghost btn-sm">
          <ExternalLink size={16} /> Ver site
        </Link>
        <button className="btn btn-outline btn-sm" onClick={signOut}>
          <LogOut size={16} /> Sair
        </button>
      </div>

      <div className="mt-6 flex gap-1 border-b border-line" role="tablist">
        {(
          [
            ['estoque', 'Estoque', CarFront],
            ['config', 'Configurações', Settings],
          ] as const
        ).map(([k, label, Icon]) => (
          <button
            key={k}
            role="tab"
            aria-selected={tab === k}
            onClick={() => setTab(k)}
            className={`-mb-px flex items-center gap-2 border-b-[3px] px-4 py-3 text-[14px] font-bold transition ${tab === k ? 'border-brand text-fg' : 'border-transparent text-muted hover:text-fg'}`}
          >
            <Icon size={17} /> {label}
          </button>
        ))}
      </div>
      <div className="pt-6">{tab === 'estoque' ? <Inventory /> : <SettingsPanel />}</div>
    </div>
  );
}
