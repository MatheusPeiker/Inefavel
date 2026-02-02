# Conectar ao GitHub - Instruções Passo a Passo

## ✅ Status Atual

- ✅ Repositório Git inicializado
- ✅ Commit inicial realizado com todos os arquivos
- ⏳ Aguardando criação do repositório no GitHub

---

## 📝 Próximos Passos

### Passo 1: Criar Repositório no GitHub

1. **Acesse**: https://github.com/new
2. **Preencha os dados**:
   - **Repository name**: `inefavel-branding` (ou o nome que preferir)
   - **Description**: `Inefável - Branding & Estratégia website with Supabase integration`
   - **Visibilidade**: Public ou Private (sua escolha)
   
3. **IMPORTANTE**: 
   - ❌ **NÃO** marque "Add a README file"
   - ❌ **NÃO** marque "Add .gitignore"
   - ❌ **NÃO** marque "Choose a license"
   
   (Já temos esses arquivos no projeto)

4. **Clique em**: "Create repository"

### Passo 2: Copiar a URL do Repositório

Após criar o repositório, você verá uma página com instruções. Procure pela URL que se parece com:

```
https://github.com/SEU-USUARIO/inefavel-branding.git
```

**Copie essa URL!** Você vai precisar dela no próximo passo.

---

## 🔗 Comandos para Conectar

Depois de criar o repositório no GitHub e copiar a URL, execute estes comandos no terminal:

### 1. Adicionar o Repositório Remoto

```bash
git remote add origin https://github.com/SEU-USUARIO/inefavel-branding.git
```

**Substitua** `SEU-USUARIO` pelo seu nome de usuário do GitHub e `inefavel-branding` pelo nome que você escolheu.

### 2. Renomear Branch para Main (se necessário)

```bash
git branch -M main
```

### 3. Fazer Push para o GitHub

```bash
git push -u origin main
```

Você pode ser solicitado a fazer login no GitHub. Siga as instruções no terminal.

---

## 📋 Checklist Completo

- [ ] Acessar https://github.com/new
- [ ] Criar repositório (sem README, .gitignore ou license)
- [ ] Copiar URL do repositório
- [ ] Executar `git remote add origin URL`
- [ ] Executar `git branch -M main`
- [ ] Executar `git push -u origin main`
- [ ] Verificar que os arquivos aparecem no GitHub

---

## 🔐 Autenticação no GitHub

Se for solicitado a fazer login durante o push, você tem duas opções:

### Opção 1: Personal Access Token (Recomendado)

1. Vá para: https://github.com/settings/tokens
2. Clique em "Generate new token" → "Generate new token (classic)"
3. Dê um nome (ex: "Inefavel Project")
4. Marque o escopo: `repo` (acesso completo a repositórios)
5. Clique em "Generate token"
6. **Copie o token** (você não verá ele novamente!)
7. Use o token como senha quando solicitado

### Opção 2: GitHub CLI

```bash
# Instalar GitHub CLI
winget install GitHub.cli

# Fazer login
gh auth login
```

---

## ✅ Verificação

Após fazer o push, verifique:

1. Acesse seu repositório no GitHub
2. Você deve ver todos os arquivos do projeto
3. O commit inicial deve aparecer no histórico
4. A branch `main` deve estar ativa

---

## 🎯 Próximo Passo: Deploy na Vercel

Depois que o código estiver no GitHub:

1. Acesse: https://vercel.com/new
2. Importe o repositório do GitHub
3. Configure as variáveis de ambiente:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Clique em "Deploy"

---

## 🐛 Troubleshooting

### Erro: "remote origin already exists"

```bash
git remote remove origin
git remote add origin https://github.com/SEU-USUARIO/inefavel-branding.git
```

### Erro: "failed to push some refs"

```bash
git pull origin main --allow-unrelated-histories
git push -u origin main
```

### Erro de Autenticação

- Use um Personal Access Token em vez da senha
- Ou instale e use o GitHub CLI (`gh auth login`)

---

## 📞 Precisa de Ajuda?

Se encontrar algum problema, me avise! Posso ajudar a:
- Resolver erros específicos
- Configurar autenticação
- Verificar se tudo está correto
