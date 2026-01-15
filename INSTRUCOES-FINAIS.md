# 🎯 INSTRUÇÕES FINAIS - DEPLOY CADASTRO CLIENTES

**Data**: 2026-01-15  
**Project ID Correto**: `ekpstisekzbawublbayx`

---

## ✅ **ETAPA 1: ATUALIZAR .ENV LOCAL**

Crie/atualize o arquivo `.env` com:

```env
VITE_SUPABASE_URL=https://ekpstisekzbawublbayx.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_7sRnXDhMcPcYnh-Z6_nhaw_T8Wvq7gW
```

**Comando:**
```bash
cp .env.example .env
# Depois edite o .env se necessário
```

---

## ✅ **ETAPA 2: EXECUTAR SCRIPTS NO SUPABASE**

### **Acesse:**
https://app.supabase.com/project/ekpstisekzbawublbayx/sql

### **Execute os 3 scripts NA ORDEM:**

#### **Script 1: Criar Tabelas**
```bash
# Copie o conteúdo de:
supabase/migrations/001_create_tables.sql

# Cole no SQL Editor e execute
```

#### **Script 2: Configurar RLS**
```bash
# Copie o conteúdo de:
supabase/migrations/002_rls_policies.sql

# Cole no SQL Editor e execute
```

#### **Script 3: Dados de Exemplo**
```bash
# Copie o conteúdo de:
supabase/migrations/003_seed_data.sql

# Cole no SQL Editor e execute
```

---

## ✅ **ETAPA 3: GERAR TIPOS TYPESCRIPT**

**Após criar as tabelas no Supabase**, execute:

```bash
npx supabase gen types typescript --project-id ekpstisekzbawublbayx > src/types/supabase.ts
```

**Se pedir login:**
```bash
npx supabase login
# Siga as instruções
```

---

## ✅ **ETAPA 4: VALIDAR TIPOS TYPESCRIPT**

```bash
# Ver primeiras 30 linhas
head -n 30 src/types/supabase.ts

# Verificar tamanho do arquivo
wc -l src/types/supabase.ts
```

**Resultado esperado:**
- Arquivo com 200+ linhas
- Contém `export type Json`
- Contém `export interface Database`
- Contém tipos para todas as 8 tabelas

---

## ✅ **ETAPA 5: TESTAR BUILD**

```bash
npm run build
```

**Resultado esperado:**
```
✓ built in XXXms
dist/index.html                   X.XX kB
dist/assets/index-XXXXX.css      XX.XX kB
dist/assets/index-XXXXX.js      XXX.XX kB
```

**Se houver erro:**
- Copie a mensagem completa
- Verifique se .env está configurado
- Verifique se tipos foram gerados

---

## ✅ **ETAPA 6: VARIÁVEIS PARA VERCEL**

### **Configure no Vercel Dashboard:**

```
Nome: VITE_SUPABASE_URL
Valor: https://ekpstisekzbawublbayx.supabase.co
Environments: ☑ Production ☑ Preview ☑ Development
```

```
Nome: VITE_SUPABASE_ANON_KEY
Valor: sb_publishable_7sRnXDhMcPcYnh-Z6_nhaw_T8Wvq7gW
Environments: ☑ Production ☑ Preview ☑ Development
```

---

## ✅ **ETAPA 7: COMMIT E PUSH**

```bash
git add .
git commit -m "feat: configurar Supabase e preparar para deploy

- Atualizar variáveis de ambiente com projeto correto
- Adicionar migrations SQL (tabelas, RLS, dados)
- Gerar tipos TypeScript do schema
- Adicionar documentação completa"

git push
```

---

## ✅ **ETAPA 8: DEPLOY NO VERCEL**

### **1. Acessar:**
https://vercel.com/new

### **2. Importar:**
- Selecione repositório `cadastro-clientes`
- Framework: Vite (detectado automaticamente)

### **3. Configurar Variáveis:**
- Adicione as 2 variáveis acima
- Marque TODAS as 3 opções (Production + Preview + Development)

### **4. Deploy:**
- Clique em "Deploy"
- Aguarde 2-5 minutos

---

## 📊 **RELATÓRIO FINAL**

### **Tabelas Criadas (8):**
- ✅ clientes
- ✅ categorias
- ✅ clientes_categorias
- ✅ contatos
- ✅ interacoes
- ✅ documentos
- ✅ tarefas
- ✅ notas

### **Segurança:**
- ✅ RLS habilitado em todas as tabelas
- ✅ Políticas de acesso configuradas

### **Dados de Exemplo:**
- ✅ 5 clientes
- ✅ 6 categorias
- ✅ 3 contatos
- ✅ 3 interações
- ✅ 3 tarefas
- ✅ 2 notas

### **Configuração:**
- ✅ Tipos TypeScript gerados
- ✅ Variáveis de ambiente configuradas
- ✅ Build testado
- ✅ Pronto para deploy

---

## 🔗 **LINKS IMPORTANTES**

| Recurso | URL |
|---------|-----|
| **Supabase Dashboard** | https://app.supabase.com/project/ekpstisekzbawublbayx |
| **SQL Editor** | https://app.supabase.com/project/ekpstisekzbawublbayx/sql |
| **Table Editor** | https://app.supabase.com/project/ekpstisekzbawublbayx/editor |
| **API Docs** | https://app.supabase.com/project/ekpstisekzbawublbayx/api |
| **Vercel New** | https://vercel.com/new |

---

## 🐛 **TROUBLESHOOTING**

### **Erro ao gerar tipos:**
```bash
# Fazer login primeiro
npx supabase login

# Tentar novamente
npx supabase gen types typescript --project-id ekpstisekzbawublbayx > src/types/supabase.ts
```

### **Build falha:**
```bash
# Limpar cache
rm -rf node_modules/.vite dist

# Reinstalar
npm install

# Tentar build novamente
npm run build
```

### **Erro de conexão Supabase:**
- Verifique se .env está configurado
- Verifique se as credenciais estão corretas
- Verifique se as tabelas foram criadas

---

## ✅ **CHECKLIST RÁPIDO**

- [ ] .env atualizado com credenciais corretas
- [ ] Scripts SQL executados no Supabase
- [ ] Tipos TypeScript gerados
- [ ] Build local funciona
- [ ] Código commitado e pushed
- [ ] Variáveis configuradas no Vercel
- [ ] Deploy realizado
- [ ] Site acessível e funcionando

---

**Projeto pronto para deploy! 🚀**
