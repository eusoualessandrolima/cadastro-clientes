# 📋 Cadastro de Clientes

Sistema de gestão de clientes desenvolvido com React, TypeScript, Vite e Supabase.

## 🚀 Deploy no Vercel

**✅ Projeto pronto para deploy!**

### Início Rápido

1. **Verificar configuração**:
   ```bash
   ./check-deploy.sh
   ```

2. **Ler documentação**:
   - 📖 [`INDEX.md`](./INDEX.md) - Índice completo
   - ⭐ [`DEPLOY-SUMMARY.md`](./DEPLOY-SUMMARY.md) - **Comece aqui!**
   - 📘 [`DEPLOY.md`](./DEPLOY.md) - Guia detalhado

3. **Fazer deploy**:
   - Via Dashboard: https://vercel.com/new
   - Via CLI: `vercel --prod`

### Variáveis de Ambiente

Configure no Vercel:
- `VITE_SUPABASE_PROJECT_ID`
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

Veja [`.env.example`](./.env.example) para referência.

## 🛠️ Tecnologias

- **Framework**: React 18 + Vite
- **Linguagem**: TypeScript
- **Estilização**: Tailwind CSS + shadcn/ui
- **Banco de Dados**: Supabase
- **Deploy**: Vercel
- **Roteamento**: React Router DOM
- **Formulários**: React Hook Form + Zod
- **UI Components**: Radix UI

## 💻 Desenvolvimento Local

### Pré-requisitos

- Node.js 18+ (recomendado: instalar via [nvm](https://github.com/nvm-sh/nvm))
- npm ou yarn
- Conta no Supabase

### Instalação

```bash
# Clonar repositório
git clone <YOUR_GIT_URL>
cd cadastro-clientes

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Edite .env com suas credenciais do Supabase

# Iniciar servidor de desenvolvimento
npm run dev
```

### Scripts Disponíveis

```bash
npm run dev          # Servidor de desenvolvimento
npm run build        # Build de produção
npm run preview      # Preview do build
npm run lint         # Verificar código
```

## 📁 Estrutura do Projeto

```
cadastro-clientes/
├── src/
│   ├── components/          # Componentes React
│   ├── integrations/        # Integrações (Supabase)
│   ├── pages/              # Páginas da aplicação
│   ├── hooks/              # Custom hooks
│   └── lib/                # Utilitários
├── public/                 # Assets estáticos
├── supabase/              # Configurações Supabase
├── vercel.json            # Configuração Vercel
└── vite.config.ts         # Configuração Vite
```

## 📚 Documentação

- [`INDEX.md`](./INDEX.md) - Índice de toda documentação
- [`DEPLOY-SUMMARY.md`](./DEPLOY-SUMMARY.md) - Resumo do deploy
- [`DEPLOY.md`](./DEPLOY.md) - Guia completo de deploy
- [`VERCEL-COMMANDS.md`](./VERCEL-COMMANDS.md) - Comandos CLI
- [`VERCEL-SETTINGS.md`](./VERCEL-SETTINGS.md) - Configurações dashboard

## 🔐 Segurança

- ✅ `.env` está no `.gitignore`
- ✅ Variáveis de ambiente protegidas
- ✅ Credenciais nunca commitadas
- ✅ RLS (Row Level Security) no Supabase

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📝 Licença

Este projeto é privado e proprietário.

## 🆘 Suporte

Para problemas ou dúvidas:
1. Consulte a [documentação](./INDEX.md)
2. Execute `./check-deploy.sh` para verificar configuração
3. Veja a seção de troubleshooting em [`DEPLOY.md`](./DEPLOY.md)

---

**Desenvolvido com ❤️ usando React + Vite + Supabase**

