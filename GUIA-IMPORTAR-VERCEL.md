# 🚀 GUIA PASSO A PASSO - IMPORTAR NO VERCEL

**Data**: 2026-01-15  
**Status**: ✅ Código commitado e enviado para o repositório

---

## 📋 PRÉ-REQUISITOS CONCLUÍDOS

- ✅ Código commitado
- ✅ Push para o repositório em andamento
- ✅ Todas as configurações prontas

---

## 🌐 PASSO A PASSO PARA IMPORTAR NO VERCEL

### **PASSO 1: Acessar o Vercel**

1. Abra seu navegador
2. Acesse: **https://vercel.com/new**
3. Faça login (se ainda não estiver logado)
   - Pode usar GitHub, GitLab ou Bitbucket

---

### **PASSO 2: Importar Repositório**

1. Na página "Import Git Repository", você verá seus repositórios
2. Procure por: **`cadastro-clientes`**
3. Clique em **"Import"** ao lado do repositório

**Screenshot de referência:**
```
┌─────────────────────────────────────────────┐
│  Import Git Repository                     │
├─────────────────────────────────────────────┤
│                                             │
│  🔍 Search repositories...                 │
│                                             │
│  📁 cadastro-clientes                      │
│     eusoualessandrolima/cadastro-clientes  │
│                              [Import] ←─── CLIQUE AQUI
│                                             │
└─────────────────────────────────────────────┘
```

---

### **PASSO 3: Configurar Projeto**

O Vercel detectará automaticamente as configurações. Verifique se está assim:

```
┌─────────────────────────────────────────────┐
│  Configure Project                          │
├─────────────────────────────────────────────┤
│                                             │
│  Project Name:                              │
│  cadastro-clientes                          │
│                                             │
│  Framework Preset:                          │
│  Vite                          ✓ Detectado │
│                                             │
│  Root Directory:                            │
│  ./                                         │
│                                             │
│  Build and Output Settings:                │
│  Build Command: npm run build    ✓ Auto   │
│  Output Directory: dist          ✓ Auto   │
│  Install Command: npm install    ✓ Auto   │
│                                             │
└─────────────────────────────────────────────┘
```

**⚠️ NÃO CLIQUE EM "DEPLOY" AINDA!**

---

### **PASSO 4: Adicionar Variáveis de Ambiente**

**IMPORTANTE**: Você DEVE configurar as variáveis ANTES do primeiro deploy!

1. Na mesma página, role até a seção **"Environment Variables"**
2. Clique em **"Add"** ou expanda a seção

Adicione as **3 variáveis** abaixo:

---

#### **VARIÁVEL 1:**

```
Name:  VITE_SUPABASE_PROJECT_ID
Value: olwqbdosvdzlhouadntr

Environments:
☑ Production
☑ Preview
☑ Development
```

Clique em **"Add"**

---

#### **VARIÁVEL 2:**

```
Name:  VITE_SUPABASE_URL
Value: https://olwqbdosvdzlhouadntr.supabase.co

Environments:
☑ Production
☑ Preview
☑ Development
```

Clique em **"Add"**

---

#### **VARIÁVEL 3:**

```
Name:  VITE_SUPABASE_PUBLISHABLE_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9sd3FiZG9zdmR6bGhvdWFkbnRyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg0MzI0OTEsImV4cCI6MjA4NDAwODQ5MX0.G-SwrgZ_C5QWDWkY7unDaQsWkvZp2U_HGMFJJtaEKzY

Environments:
☑ Production
☑ Preview
☑ Development
```

Clique em **"Add"**

---

### **PASSO 5: Fazer Deploy**

Após adicionar as 3 variáveis:

1. Verifique se todas as 3 variáveis estão listadas
2. Role até o final da página
3. Clique no botão **"Deploy"**

```
┌─────────────────────────────────────────────┐
│                                             │
│  Environment Variables (3)                  │
│  ✓ VITE_SUPABASE_PROJECT_ID                │
│  ✓ VITE_SUPABASE_URL                       │
│  ✓ VITE_SUPABASE_PUBLISHABLE_KEY           │
│                                             │
│                                             │
│              [Deploy] ←─── CLIQUE AQUI     │
│                                             │
└─────────────────────────────────────────────┘
```

---

### **PASSO 6: Acompanhar o Build**

O Vercel iniciará o processo de build. Você verá:

```
Building...
├─ Installing dependencies...
├─ Running build command...
├─ Uploading build output...
└─ Deploying...
```

**Tempo estimado**: 2-5 minutos

---

### **PASSO 7: Deploy Concluído! 🎉**

Quando concluir, você verá:

```
┌─────────────────────────────────────────────┐
│  🎉 Congratulations!                        │
│                                             │
│  Your project has been deployed!            │
│                                             │
│  🌐 https://cadastro-clientes-xxx.vercel.app│
│                                             │
│  [Visit] [Dashboard]                        │
└─────────────────────────────────────────────┘
```

Clique em **"Visit"** para ver seu projeto online!

---

## ✅ CHECKLIST DE DEPLOY

Marque conforme for completando:

- [ ] Acessei https://vercel.com/new
- [ ] Importei o repositório "cadastro-clientes"
- [ ] Verifiquei que Framework = Vite
- [ ] Adicionei VITE_SUPABASE_PROJECT_ID
- [ ] Adicionei VITE_SUPABASE_URL
- [ ] Adicionei VITE_SUPABASE_PUBLISHABLE_KEY
- [ ] Marquei Production + Preview + Development em todas
- [ ] Cliquei em "Deploy"
- [ ] Aguardei o build completar
- [ ] Acessei a URL gerada
- [ ] Testei o sistema

---

## 🐛 TROUBLESHOOTING

### Build falhou?

1. Verifique os logs de build no dashboard
2. Confirme que as 3 variáveis estão configuradas
3. Verifique se não há erros de sintaxe no código

### Site não carrega?

1. Verifique se o deploy foi concluído
2. Aguarde alguns segundos (propagação DNS)
3. Limpe o cache do navegador (Ctrl+Shift+R)

### Erro de conexão Supabase?

1. Verifique se as variáveis estão corretas
2. Confirme que não há espaços extras nos valores
3. Teste as credenciais no Supabase Dashboard

---

## 📊 APÓS O DEPLOY

### Configurações Recomendadas

1. **Domínio Customizado** (opcional)
   - Dashboard → Settings → Domains
   - Adicione seu domínio

2. **Analytics** (recomendado)
   - Dashboard → Analytics
   - Ative Web Analytics

3. **Notificações**
   - Dashboard → Settings → Notifications
   - Configure alertas de deploy

---

## 🔄 DEPLOYS FUTUROS

Após o primeiro deploy, o Vercel fará deploy automático:

- ✅ A cada push na branch main
- ✅ Preview para cada Pull Request
- ✅ Comentários automáticos nos PRs

---

## 📞 PRECISA DE AJUDA?

- 📖 Documentação Vercel: https://vercel.com/docs
- 💬 Suporte Vercel: https://vercel.com/support
- 📚 Sua documentação: Veja DEPLOY.md

---

**Boa sorte com o deploy! 🚀**
