# 🚀 Deploy Rápido na Vercel - Guia Simplificado

## ✅ Vercel CLI Instalada!

A CLI da Vercel já está instalada e pronta para uso.

---

## 📝 Passo a Passo Simples

### **Passo 1: Login na Vercel**

Execute este comando no terminal:

```bash
vercel login
```

**O que vai acontecer:**
1. O comando vai perguntar qual método de login você prefere
2. Escolha uma opção (recomendo **GitHub** se você tem conta lá)
3. Seu navegador vai abrir automaticamente
4. Faça login na Vercel
5. Autorize a CLI
6. Volte ao terminal - você estará logado!

---

### **Passo 2: Deploy do Projeto**

Depois de fazer login, execute:

```bash
vercel
```

**O que vai acontecer:**
A CLI vai fazer algumas perguntas. Aqui estão as respostas recomendadas:

1. **"Set up and deploy?"** → Pressione **Enter** (Yes)
2. **"Which scope?"** → Pressione **Enter** (sua conta pessoal)
3. **"Link to existing project?"** → Digite **N** e pressione **Enter** (No)
4. **"What's your project's name?"** → Digite **inefavel-branding** ou pressione **Enter**
5. **"In which directory is your code located?"** → Pressione **Enter** (./)
6. **"Want to override the settings?"** → Digite **N** e pressione **Enter** (No)

Pronto! O deploy vai começar automaticamente! 🎉

---

### **Passo 3: Configurar Variáveis de Ambiente**

Após o primeiro deploy, você precisa adicionar as variáveis do Supabase:

```bash
vercel env add VITE_SUPABASE_URL
```

Quando solicitado:
- **Value**: Cole `https://vnqddvxiqqpoopxosdqg.supabase.co`
- **Environments**: Selecione **Production, Preview, Development** (use espaço para marcar, Enter para confirmar)

Depois:

```bash
vercel env add VITE_SUPABASE_ANON_KEY
```

Quando solicitado:
- **Value**: Cole sua chave anônima do Supabase
- **Environments**: Selecione **Production, Preview, Development**

---

### **Passo 4: Redeploy com as Variáveis**

Agora que as variáveis estão configuradas, faça um novo deploy:

```bash
vercel --prod
```

Este comando vai fazer o deploy de produção com todas as variáveis configuradas!

---

## 🎯 Comandos Resumidos

Execute na ordem:

```bash
# 1. Login
vercel login

# 2. Primeiro deploy (preview)
vercel

# 3. Adicionar variáveis de ambiente
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY

# 4. Deploy de produção
vercel --prod
```

---

## 📊 Após o Deploy

Quando o deploy terminar, você verá:

```
✅ Production: https://inefavel-branding.vercel.app
```

**Copie essa URL e teste:**
1. Abra no navegador
2. Role até o formulário de contato
3. Preencha e envie
4. Verifique no Supabase se os dados foram salvos

---

## 🔍 Verificar Status do Projeto

A qualquer momento, você pode:

```bash
# Ver informações do projeto
vercel ls

# Ver logs
vercel logs

# Abrir dashboard no navegador
vercel dashboard
```

---

## 🐛 Problemas Comuns

### "No token found"
**Solução**: Execute `vercel login` novamente

### "Build failed"
**Solução**: 
1. Verifique se o build funciona localmente: `npm run build`
2. Se funcionar, tente o deploy novamente

### "Environment variables not working"
**Solução**:
1. Verifique se adicionou as variáveis: `vercel env ls`
2. Faça redeploy: `vercel --prod`

---

## 💡 Dicas

- ✅ Use `vercel` para deploy de preview (teste)
- ✅ Use `vercel --prod` para deploy de produção
- ✅ Cada push no Git pode gerar deploy automático (configure depois)
- ✅ Você pode ter múltiplos deploys de preview

---

## 🎉 Pronto!

Depois de seguir esses passos, seu site estará no ar na Vercel com:
- ✅ HTTPS automático
- ✅ CDN global
- ✅ Formulário de contato funcionando
- ✅ Integração com Supabase

**Qualquer dúvida, me avise!** 🚀
