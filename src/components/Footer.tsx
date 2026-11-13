import { useState } from 'react';
import { Clock, Copy, LockKeyhole, MapPin, Check } from 'lucide-react';
import { Logo } from './Logo';
import { Link } from '../lib/router';
import { useStore } from '../lib/store';
import { phoneLabel } from '../lib/format';
import { genericText, waLink } from '../lib/whatsapp';
import { InstagramIcon, WhatsAppIcon, copyText } from './ui';

export function Footer() {
  const { settings } = useStore();
  const [copied, setCopied] = useState(false);
  const phone = phoneLabel(settings.whatsapp);
  return (
    <footer id="contato" className="mt-20 bg-ink text-on-ink">
      <div className="wrap grid gap-10 py-14 md:grid-cols-[1.3fr_1fr_1fr] md:gap-8">
        <div className="min-w-0">
          <Logo className="h-12 w-auto" ink="#ffffff" />
          <p className="mt-5 max-w-sm text-[15px] text-ink-muted">
            Seminovos em {settings.city.replace(' · ', '-')}. Financiamento facilitado e seu usado na troca, mediante avaliação. Atendimento direto pelo WhatsApp.
          </p>
          <a href={waLink(settings.whatsapp, genericText(settings))} target="_blank" rel="noopener noreferrer" className="btn btn-primary mt-6">
            <WhatsAppIcon size={18} /> Chamar no WhatsApp
          </a>
        </div>
        <div className="grid content-start gap-4 text-[15px]">
          <p className="eyebrow text-brand">Visite a loja</p>
          <p className="flex gap-3">
            <MapPin size={18} className="mt-0.5 shrink-0 text-ink-muted" />
            <span>
              {settings.address && (
                <>
                  {settings.address}
                  <br />
                </>
              )}
              <span className={settings.address ? 'text-ink-muted' : ''}>{settings.city}</span>
            </span>
          </p>
          {settings.hours && (
            <p className="flex gap-3">
              <Clock size={18} className="mt-0.5 shrink-0 text-ink-muted" />
              <span>{settings.hours}</span>
            </p>
          )}
        </div>
        <div className="grid content-start gap-4 text-[15px]">
          <p className="eyebrow text-brand">Contato</p>
          <div className="flex items-center gap-3">
            <WhatsAppIcon size={18} className="shrink-0 text-ink-muted" />
            <span className="select-all tnum">{phone}</span>
            <button
              className="rounded-md p-1 text-ink-muted hover:text-on-ink"
              aria-label="Copiar número"
              onClick={async () => {
                if (await copyText(phone)) {
                  setCopied(true);
                  setTimeout(() => setCopied(false), 1600);
                }
              }}
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
            </button>
          </div>
          {settings.instagram && (
            <a href={`https://instagram.com/${settings.instagram}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-brand">
              <span className="text-ink-muted">
                <InstagramIcon />
              </span>
              @{settings.instagram}
            </a>
          )}
          <Link to={{ name: 'admin' }} className="mt-2 inline-flex items-center gap-2 text-[13px] font-semibold text-ink-muted hover:text-on-ink">
            <LockKeyhole size={15} /> Área do lojista
          </Link>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="wrap flex flex-wrap items-center justify-between gap-3 py-5 text-[12px] text-ink-muted" style={{ paddingBottom: 'calc(20px + env(safe-area-inset-bottom, 0px))' }}>
          <span>© 2026 {settings.storeName}. Todos os direitos reservados.</span>
          <span>*Parcelas simuladas com 30% de entrada e taxa de {settings.interestRate.toLocaleString('pt-BR')}% a.m., sujeitas à aprovação de crédito.</span>
        </div>
      </div>
    </footer>
  );
}
