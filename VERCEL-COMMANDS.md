# 🚀 Comandos Rápidos - Deploy Vercel

## 📋 Verificação Pré-Deploy
```bash
./check-deploy.sh
```

## 🔧 Desenvolvimento Local
```bash
# Instalar dependências
npm install

# Rodar em desenvolvimento
npm run dev

# Build de produção
npm run build

# Preview do build
npm run preview
```

## 🌐 Deploy via CLI

### Primeira vez
```bash
# Instalar Vercel CLI globalmente
npm install -g vercel

# Login no Vercel
vercel login

# Deploy inicial (modo preview)
vercel

# Configurar variáveis de ambiente
vercel env add VITE_SUPABASE_PROJECT_ID
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_PUBLISHABLE_KEY

# Deploy para produção
vercel --prod
```

### Deploys subsequentes
```bash
# Deploy preview
vercel

# Deploy produção
vercel --prod
```

## 📦 Git Workflow
```bash
# Adicionar alterações
git add .

# Commit
git commit -m "chore: preparar para deploy no Vercel"

# Push (se conectado ao Vercel, faz deploy automático)
git push
```

## 🔍 Verificar Status
```bash
# Ver deploys
vercel ls

# Ver logs do último deploy
vercel logs

# Abrir dashboard do projeto
vercel
```

## 🔐 Gerenciar Variáveis de Ambiente
```bash
# Listar variáveis
vercel env ls

# Adicionar variável
vercel env add NOME_DA_VARIAVEL

# Remover variável
vercel env rm NOME_DA_VARIAVEL

# Pull variáveis para .env.local
vercel env pull
```

## 🌍 Domínio Customizado
```bash
# Adicionar domínio
vercel domains add seudominio.com

# Listar domínios
vercel domains ls

# Remover domínio
vercel domains rm seudominio.com
```

## 🔄 Rollback
```bash
# Listar deploys
vercel ls

# Promover deploy específico para produção
vercel promote [deployment-url]
```

## 📊 Informações do Projeto
```bash
# Ver informações do projeto
vercel inspect

# Ver configuração
vercel project ls
```

## 🐛 Debug
```bash
# Ver logs em tempo real
vercel logs --follow

# Ver logs de um deployment específico
vercel logs [deployment-url]
```

## ⚡ Atalhos Úteis

| Comando | Descrição |
|---------|-----------|
| `vercel` | Deploy preview |
| `vercel --prod` | Deploy produção |
| `vercel ls` | Listar deploys |
| `vercel logs` | Ver logs |
| `vercel env ls` | Listar variáveis |
| `vercel domains ls` | Listar domínios |
| `vercel --help` | Ajuda |

## 📝 Notas

- Deploy via CLI é mais rápido que via dashboard
- Variáveis de ambiente precisam ser configuradas apenas uma vez
- Push no GitHub faz deploy automático se conectado ao Vercel
- Preview deployments são criados automaticamente para PRs
