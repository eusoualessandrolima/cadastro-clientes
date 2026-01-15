#!/bin/bash

# ============================================================================
# SCRIPT: Gerar Tipos TypeScript do Supabase
# ============================================================================
# Descrição: Gera automaticamente os tipos TypeScript a partir do schema
# ============================================================================

echo "🔄 Gerando tipos TypeScript do Supabase..."
echo ""

# Verificar se o diretório existe
if [ ! -d "src/types" ]; then
    echo "📁 Criando diretório src/types..."
    mkdir -p src/types
fi

# Gerar tipos
echo "⚡ Executando comando de geração..."
npx supabase gen types typescript --project-id olwqbdosvdzlhouadntr > src/types/supabase.ts

# Verificar se foi criado
if [ -f "src/types/supabase.ts" ]; then
    echo ""
    echo "✅ Tipos gerados com sucesso!"
    echo ""
    echo "📊 Estatísticas do arquivo:"
    wc -l src/types/supabase.ts
    echo ""
    echo "📝 Primeiras linhas:"
    head -n 20 src/types/supabase.ts
    echo ""
    echo "✨ Arquivo criado: src/types/supabase.ts"
else
    echo ""
    echo "❌ Erro ao gerar tipos!"
    echo "Verifique se as tabelas foram criadas no Supabase."
fi
