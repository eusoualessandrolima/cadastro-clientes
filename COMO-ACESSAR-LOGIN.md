# 🔐 COMO ACESSAR O SISTEMA - GUIA COMPLETO

**Sistema**: Cadastro de Clientes  
**Data**: 2026-01-15

---

## 🌐 **ACESSAR A TELA DE LOGIN**

### **Opção 1: Desenvolvimento Local**

1. **Inicie o servidor de desenvolvimento:**
```bash
npm run dev
```

2. **Acesse no navegador:**
```
http://localhost:8080/login
```

**OU diretamente:**
```
http://localhost:8080
```
(A página inicial deve redirecionar para login se não estiver autenticado)

---

### **Opção 2: Após Deploy no Vercel**

Acesse a URL gerada pelo Vercel + `/login`:

```
https://seu-projeto.vercel.app/login
```

---

## 📱 **ROTAS DISPONÍVEIS**

| Rota | Descrição | Acesso |
|------|-----------|--------|
| `/` | Página inicial | Público |
| `/login` | **Tela de login** | Público |
| `/register` | Cadastro de novo usuário | Público |
| `/dashboard` | Dashboard principal | Requer autenticação |
| `/configuracoes-cadastros` | Configurações | Requer autenticação |

---

## 🔑 **COMO FAZER LOGIN**

### **Passo 1: Criar um Usuário no Supabase**

Como o sistema usa autenticação do Supabase, você precisa criar um usuário primeiro:

#### **Opção A: Via Supabase Dashboard (Recomendado)**

1. Acesse: https://app.supabase.com/project/ekpstisekzbawublbayx/auth/users
2. Clique em **"Add user"** → **"Create new user"**
3. Preencha:
   - **Email**: seu@email.com
   - **Password**: SuaSenhaSegura123
   - **Auto Confirm User**: ✓ (marque esta opção)
4. Clique em **"Create user"**

#### **Opção B: Via Tela de Registro**

1. Acesse: `http://localhost:8080/register`
2. Preencha o formulário de cadastro
3. Clique em "Criar conta"
4. Confirme o email (se configurado)

---

### **Passo 2: Fazer Login**

1. **Acesse**: `http://localhost:8080/login`

2. **Preencha os campos:**
   - **Email**: O email que você cadastrou
   - **Password**: A senha que você definiu

3. **Clique em "Entrar"**

4. **Você será redirecionado para**: `/dashboard`

---

## 🎨 **VISUAL DA TELA DE LOGIN**

A tela de login tem:

- ✅ **Logo**: CompanyChat IA (ícone de raio verde)
- ✅ **Título**: "Sistema de Gestão de Cadastros"
- ✅ **Campos**:
  - Email (com ícone de envelope)
  - Senha (com ícone de cadeado)
- ✅ **Botão**: "Entrar" (verde brilhante)
- ✅ **Link**: "Criar conta" (para registro)
- ✅ **Design**: Fundo preto com card glassmorphism

---

## 🚀 **INICIAR O SISTEMA LOCALMENTE**

### **Passo a Passo Completo:**

```bash
# 1. Navegar para o projeto
cd /home/alessandro/cadastro-clientes

# 2. Atualizar .env (se ainda não fez)
cp .env.example .env

# 3. Instalar dependências (se necessário)
npm install

# 4. Iniciar servidor de desenvolvimento
npm run dev
```

**Resultado esperado:**
```
  VITE v5.4.19  ready in XXX ms

  ➜  Local:   http://localhost:8080/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

### **Acessar:**
```
http://localhost:8080/login
```

---

## 🔧 **CRIAR USUÁRIO DE TESTE**

### **Via Supabase Dashboard:**

1. **Acesse**: https://app.supabase.com/project/ekpstisekzbawublbayx/auth/users

2. **Clique em**: "Add user" → "Create new user"

3. **Preencha**:
```
Email: admin@teste.com
Password: Admin123456
☑ Auto Confirm User
```

4. **Clique em**: "Create user"

5. **Agora você pode fazer login com**:
   - Email: `admin@teste.com`
   - Senha: `Admin123456`

---

## 📋 **FLUXO COMPLETO DE AUTENTICAÇÃO**

```
1. Usuário acessa /login
   ↓
2. Preenche email e senha
   ↓
3. Clica em "Entrar"
   ↓
4. Sistema valida com Supabase
   ↓
5. Se válido: Redireciona para /dashboard
   ↓
6. Se inválido: Mostra mensagem de erro
```

---

## 🐛 **TROUBLESHOOTING**

### **Erro: "Não consigo acessar localhost:8080"**

**Solução:**
```bash
# Verificar se o servidor está rodando
npm run dev

# Se der erro, limpar cache
rm -rf node_modules/.vite dist
npm install
npm run dev
```

---

### **Erro: "Invalid login credentials"**

**Causas possíveis:**
1. Email ou senha incorretos
2. Usuário não existe no Supabase
3. Usuário não foi confirmado

**Solução:**
1. Verifique se o usuário existe no Supabase Dashboard
2. Crie um novo usuário marcando "Auto Confirm User"
3. Tente novamente

---

### **Erro: "Failed to fetch" ou erro de conexão**

**Causas:**
1. .env não está configurado
2. Credenciais do Supabase incorretas
3. Servidor não está rodando

**Solução:**
```bash
# 1. Verificar .env
cat .env

# Deve conter:
# VITE_SUPABASE_URL=https://ekpstisekzbawublbayx.supabase.co
# VITE_SUPABASE_ANON_KEY=sb_publishable_7sRnXDhMcPcYnh-Z6_nhaw_T8Wvq7gW

# 2. Se não existir, criar:
cp .env.example .env

# 3. Reiniciar servidor
npm run dev
```

---

### **Página em branco ou erro 404**

**Solução:**
```bash
# Verificar se está na rota correta
http://localhost:8080/login

# Se ainda não funcionar, rebuild
npm run build
npm run preview
```

---

## ✅ **CHECKLIST RÁPIDO**

Antes de tentar fazer login:

- [ ] Servidor está rodando (`npm run dev`)
- [ ] .env está configurado com credenciais corretas
- [ ] Usuário foi criado no Supabase
- [ ] Usuário foi confirmado (Auto Confirm marcado)
- [ ] Navegador está acessando `http://localhost:8080/login`

---

## 🎯 **RESUMO RÁPIDO**

### **Para acessar agora:**

```bash
# 1. Iniciar servidor
npm run dev

# 2. Abrir navegador em:
http://localhost:8080/login

# 3. Criar usuário no Supabase:
https://app.supabase.com/project/ekpstisekzbawublbayx/auth/users

# 4. Fazer login com as credenciais criadas
```

---

## 🔗 **LINKS ÚTEIS**

| Recurso | URL |
|---------|-----|
| **Login Local** | http://localhost:8080/login |
| **Registro Local** | http://localhost:8080/register |
| **Dashboard Local** | http://localhost:8080/dashboard |
| **Supabase Auth** | https://app.supabase.com/project/ekpstisekzbawublbayx/auth/users |
| **Supabase Dashboard** | https://app.supabase.com/project/ekpstisekzbawublbayx |

---

**Pronto! Agora você pode acessar o sistema! 🚀**
