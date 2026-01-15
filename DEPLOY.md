# 🚀 Deploy no Vercel - Cadastro de Clientes

## 📋 Pré-requisitos

- Conta no [Vercel](https://vercel.com)
- Conta no [Supabase](https://supabase.com)
- Projeto configurado no Supabase com as tabelas necessárias

## 🔧 Configuração Local

### 1. Instalar Dependências

```bash
npm install
```

### 2. Configurar Variáveis de Ambiente

Copie o arquivo `.env.example` para `.env`:

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas credenciais do Supabase:

```env
VITE_SUPABASE_PROJECT_ID=seu_project_id
VITE_SUPABASE_URL=https://seu-project-id.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sua_chave_publica_anon
```

### 3. Testar Localmente

```bash
npm run dev
```

### 4. Testar Build de Produção

```bash
npm run build
npm run preview
```

## 🌐 Deploy no Vercel

### Opção 1: Via CLI (Recomendado)

1. **Instalar Vercel CLI**:
```bash
npm install -g vercel
```

2. **Login no Vercel**:
```bash
vercel login
```

3. **Deploy**:
```bash
vercel
```

4. **Configurar Variáveis de Ambiente no Vercel**:
```bash
vercel env add VITE_SUPABASE_PROJECT_ID
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_PUBLISHABLE_KEY
```

5. **Deploy para Produção**:
```bash
vercel --prod
```

### Opção 2: Via Dashboard do Vercel

1. **Acesse** [vercel.com/new](https://vercel.com/new)

2. **Importe seu repositório** do GitHub/GitLab/Bitbucket

3. **Configure o projeto**:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

4. **Adicione as Variáveis de Ambiente**:
   - Vá em **Settings** → **Environment Variables**
   - Adicione as seguintes variáveis:
     - `VITE_SUPABASE_PROJECT_ID`
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_PUBLISHABLE_KEY`

5. **Clique em Deploy**

## 🔐 Variáveis de Ambiente Necessárias

| Variável | Descrição | Onde Encontrar |
|----------|-----------|----------------|
| `VITE_SUPABASE_PROJECT_ID` | ID do projeto Supabase | Dashboard Supabase → Settings → General |
| `VITE_SUPABASE_URL` | URL da API do Supabase | Dashboard Supabase → Settings → API → Project URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Chave pública anon | Dashboard Supabase → Settings → API → Project API keys → anon public |

## ✅ Checklist Pré-Deploy

- [ ] `.env` está no `.gitignore`
- [ ] Todas as dependências estão no `package.json`
- [ ] Build local funciona (`npm run build`)
- [ ] Variáveis de ambiente configuradas no Vercel
- [ ] Tabelas do Supabase criadas e configuradas
- [ ] RLS (Row Level Security) configurado no Supabase

## 🔄 Deploy Automático

Após o primeiro deploy, o Vercel automaticamente:
- Faz deploy de cada commit na branch principal
- Cria preview deployments para Pull Requests
- Executa builds otimizados

## 🐛 Troubleshooting

### Build falha no Vercel

1. Verifique os logs de build no dashboard do Vercel
2. Confirme que todas as variáveis de ambiente estão configuradas
3. Teste o build localmente: `npm run build`

### Erro de conexão com Supabase

1. Verifique se as variáveis de ambiente estão corretas
2. Confirme que a URL do Supabase está acessível
3. Verifique as políticas RLS no Supabase

### Rotas não funcionam (404)

- O arquivo `vercel.json` já está configurado para SPA routing
- Todas as rotas redirecionam para `index.html`

## 📚 Recursos Úteis

- [Documentação Vercel](https://vercel.com/docs)
- [Documentação Vite](https://vitejs.dev/)
- [Documentação Supabase](https://supabase.com/docs)

## 🎯 Próximos Passos

Após o deploy:
1. Configure um domínio customizado (opcional)
2. Configure analytics do Vercel
3. Configure monitoramento de erros (Sentry, etc.)
4. Configure CI/CD para testes automatizados
