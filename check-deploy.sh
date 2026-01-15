#!/bin/bash

# Script de verificação pré-deploy
# Execute este script antes de fazer deploy no Vercel

echo "🔍 Verificando configuração do projeto para deploy no Vercel..."
echo ""

# Verificar se .env existe
if [ -f ".env" ]; then
    echo "✅ Arquivo .env encontrado"
else
    echo "❌ Arquivo .env não encontrado"
    echo "   Copie .env.example para .env e configure suas credenciais"
fi

# Verificar se .env está no .gitignore
if grep -q "^\.env$" .gitignore; then
    echo "✅ .env está no .gitignore"
else
    echo "⚠️  .env não está no .gitignore - ADICIONE AGORA!"
fi

# Verificar se vercel.json existe
if [ -f "vercel.json" ]; then
    echo "✅ vercel.json configurado"
else
    echo "❌ vercel.json não encontrado"
fi

# Verificar se package.json tem script build
if grep -q '"build"' package.json; then
    echo "✅ Script 'build' encontrado no package.json"
else
    echo "❌ Script 'build' não encontrado no package.json"
fi

# Verificar variáveis de ambiente necessárias
echo ""
echo "📋 Variáveis de ambiente necessárias no Vercel:"
echo "   - VITE_SUPABASE_PROJECT_ID"
echo "   - VITE_SUPABASE_URL"
echo "   - VITE_SUPABASE_PUBLISHABLE_KEY"
echo ""

echo "✨ Verificação concluída!"
echo ""
echo "📚 Próximos passos:"
echo "   1. Faça commit das alterações"
echo "   2. Push para o GitHub/GitLab/Bitbucket"
echo "   3. Importe o projeto no Vercel"
echo "   4. Configure as variáveis de ambiente"
echo "   5. Deploy!"
echo ""
echo "📖 Consulte DEPLOY.md para instruções detalhadas"
