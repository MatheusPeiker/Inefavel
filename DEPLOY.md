# Deploy na Vercel - Guia Completo

Este guia explica como fazer o deploy do projeto Inefável na Vercel.

## 📋 Pré-requisitos

- Conta na [Vercel](https://vercel.com)
- Projeto configurado com Supabase (credenciais necessárias)
- Código versionado no Git (GitHub, GitLab ou Bitbucket) - opcional mas recomendado

## 🚀 Opção 1: Deploy via Vercel Dashboard (Recomendado)

### Passo 1: Preparar o Repositório Git

Se ainda não tiver um repositório Git:

```bash
git init
git add .
git commit -m "Initial commit - Inefável branding project"
```

Depois, crie um repositório no GitHub e faça push:

```bash
git remote add origin https://github.com/seu-usuario/seu-repositorio.git
git branch -M main
git push -u origin main
```

### Passo 2: Importar Projeto na Vercel

1. Acesse [vercel.com/new](https://vercel.com/new)
2. Clique em **"Import Git Repository"**
3. Selecione seu repositório do GitHub
4. A Vercel detectará automaticamente que é um projeto Vite

### Passo 3: Configurar Variáveis de Ambiente

Na seção **"Environment Variables"**, adicione:

| Nome | Valor |
|------|-------|
| `VITE_SUPABASE_URL` | `https://vnqddvxiqqpoopxosdqg.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Sua chave anônima do Supabase |

> **Importante**: Certifique-se de adicionar as variáveis para todos os ambientes (Production, Preview, Development)

### Passo 4: Deploy

1. Clique em **"Deploy"**
2. Aguarde o build completar (geralmente 1-2 minutos)
3. Acesse o link fornecido pela Vercel

## 🔧 Opção 2: Deploy via Vercel CLI

### Instalar Vercel CLI

```bash
npm install -g vercel
```

### Login na Vercel

```bash
vercel login
```

### Deploy

```bash
# Deploy de preview
vercel

# Deploy de produção
vercel --prod
```

Durante o processo, você será solicitado a:
- Configurar o projeto
- Adicionar variáveis de ambiente

## ⚙️ Configuração Automática

O arquivo `vercel.json` já está configurado com:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "vite"
}
```

## 🔐 Variáveis de Ambiente

As seguintes variáveis precisam ser configuradas na Vercel:

- **VITE_SUPABASE_URL**: URL do seu projeto Supabase
- **VITE_SUPABASE_ANON_KEY**: Chave pública anônima do Supabase

### Como Adicionar Variáveis de Ambiente

**Via Dashboard:**
1. Vá para o projeto na Vercel
2. Settings → Environment Variables
3. Adicione cada variável
4. Selecione os ambientes (Production, Preview, Development)
5. Clique em "Save"

**Via CLI:**
```bash
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY
```

## 🧪 Testar Build Localmente

Antes de fazer deploy, teste o build de produção:

```bash
# Criar build de produção
npm run build

# Testar build localmente
npm run preview
```

Acesse `http://localhost:4173` e teste o formulário de contato.

## 🔄 Deploys Automáticos

Após o primeiro deploy, a Vercel configurará deploys automáticos:

- **Push para `main`**: Deploy de produção
- **Push para outras branches**: Deploy de preview
- **Pull Requests**: Deploy de preview com URL única

## 📊 Monitoramento

Após o deploy, você pode monitorar:

- **Analytics**: Tráfego e performance
- **Logs**: Erros e requisições
- **Deployments**: Histórico de deploys

Acesse: `https://vercel.com/seu-usuario/seu-projeto`

## 🌐 Domínio Personalizado

Para adicionar um domínio personalizado:

1. Vá para Settings → Domains
2. Adicione seu domínio
3. Configure os registros DNS conforme instruções
4. Aguarde propagação (pode levar até 48h)

## ✅ Checklist de Deploy

- [ ] Código commitado no Git
- [ ] Repositório no GitHub/GitLab/Bitbucket
- [ ] Variáveis de ambiente configuradas na Vercel
- [ ] Build testado localmente (`npm run build`)
- [ ] Tabela criada no Supabase
- [ ] Deploy realizado
- [ ] Formulário de contato testado em produção
- [ ] Dados sendo salvos no Supabase

## 🐛 Troubleshooting

### Build Falha

**Erro**: `Module not found`
- **Solução**: Verifique se todas as dependências estão no `package.json`
- Execute `npm install` localmente e commit o `package-lock.json`

### Variáveis de Ambiente Não Funcionam

**Erro**: `Missing Supabase environment variables`
- **Solução**: Certifique-se que as variáveis começam com `VITE_`
- Verifique se foram adicionadas para o ambiente correto (Production)
- Faça um novo deploy após adicionar as variáveis

### Formulário Não Envia

**Erro**: Erro ao enviar formulário
- **Solução**: Verifique se a tabela `contact_submissions` existe no Supabase
- Confirme que as políticas RLS estão configuradas corretamente
- Verifique os logs da Vercel para erros específicos

## 📱 URLs Importantes

Após o deploy, você terá:

- **URL de Produção**: `https://seu-projeto.vercel.app`
- **Dashboard**: `https://vercel.com/seu-usuario/seu-projeto`
- **Analytics**: `https://vercel.com/seu-usuario/seu-projeto/analytics`

## 🎉 Pronto!

Seu projeto está agora rodando na Vercel com:
- ✅ Deploy automático
- ✅ HTTPS habilitado
- ✅ CDN global
- ✅ Formulário de contato funcional
- ✅ Integração com Supabase

Para atualizações futuras, basta fazer push para o repositório Git!
