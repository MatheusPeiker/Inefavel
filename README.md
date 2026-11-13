# Passos Automóveis

Site de estoque de seminovos com área do lojista. React + TypeScript + Vite + Tailwind.

## O que tem

- **Página inicial**: destaque rotativo, busca rápida (marca, tipo, preço), carrossel infinito das marcas em estoque, destaques, categorias, novidades e chamada para venda/troca.
- **Estoque**: busca, filtros (marca, tipo, preço, ano, km, câmbio, combustível) e ordenação.
- **Página do carro**: galeria, ficha técnica, selos de procedência, opcionais, comparação com a FIPE e simulador de financiamento (Tabela Price).
- **WhatsApp em todo lugar**: botão flutuante, "Tenho interesse", test drive, envio da simulação e avaliação do usado. As mensagens já vão preenchidas com carro, ano, km, preço e código.
- **Favoritos e comparação** de até 3 carros lado a lado.
- **Área do lojista** (`/admin`): adicionar, editar e remover carros (com desfazer), enviar fotos (comprimidas no navegador), mudar status (disponível / reservado / vendido), marcar destaque e editar dados da loja (WhatsApp, endereço, horário, Instagram, taxa do simulador).

## Rodar localmente

```bash
npm install
cp .env.example .env.local   # ajuste o número do WhatsApp
npm run dev                  # http://localhost:3000
```

Sem as variáveis do Supabase o app roda em **modo demonstração**: o estoque começa com carros de exemplo e as alterações do admin ficam salvas no navegador. PIN do admin: `VITE_ADMIN_PIN` (padrão `1234`).

## Supabase (banco, fotos e login)

1. Crie um projeto no Supabase e rode `supabase/schema.sql` no SQL Editor.
2. Em **Authentication > Providers**, desative novos cadastros. Crie o usuário da loja em **Authentication > Users**.
3. Preencha `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`.
4. Entre em `/admin` com e-mail e senha. Em **Configurações** dá para importar os carros de exemplo.

A troca é automática: com as duas variáveis definidas, o app usa o Supabase (`src/lib/supabase-repo.ts`); sem elas, usa o navegador (`src/lib/repository.ts`).

## Deploy na Vercel

Importe o repositório; o `vercel.json` já define build e as regras de rota. Cadastre as variáveis do `.env.example` em **Settings > Environment Variables**.

## Versão para revisão (arquivo único)

```bash
npm run build:artifact   # gera dist-artifact/passos-automoveis.html
```

Gera um HTML único, com rotas por `#` (ex.: `#carro-pa1042`, `#admin`), para compartilhar e revisar sem servidor.

## Estrutura

```
src/
  assets/logo-paths.ts   vetores da logo (extraídos do PDF da marca)
  components/            Header, Footer, CarCard, BrandMarquee, CarArt, FinanceSimulator…
  pages/                 Home, Stock, CarDetail, Favorites, Compare, Sell
  pages/admin/           Login, Inventory, CarEditor, SettingsPanel
  lib/                   dados (repository, supabase-repo, seed), rotas, WhatsApp, formatação
supabase/schema.sql      tabelas, políticas de acesso e bucket de fotos
```

Cores da marca: laranja `#FF8724` e grafite `#333333`. Tipografia: Montserrat (títulos, como na logo) e DM Sans (texto).
