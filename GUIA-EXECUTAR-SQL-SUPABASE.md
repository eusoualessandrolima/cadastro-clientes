# 🚀 GUIA: EXECUTAR SCRIPTS SQL NO SUPABASE

**Data**: 2026-01-15  
**Projeto**: Cadastro de Clientes

---

## 📋 ORDEM DE EXECUÇÃO

Execute os scripts **NESTA ORDEM**:

1. ✅ `001_create_tables.sql` - Criar tabelas
2. ✅ `002_rls_policies.sql` - Configurar segurança
3. ✅ `003_seed_data.sql` - Inserir dados de exemplo

---

## 🌐 PASSO A PASSO

### **1. Acessar o Supabase Dashboard**

1. Abra: https://app.supabase.com
2. Faça login
3. Selecione o projeto: **olwqbdosvdzlhouadntr**

---

### **2. Abrir o SQL Editor**

1. No menu lateral, clique em **"SQL Editor"**
2. Clique em **"New query"**

---

### **3. Executar Script 1: Criar Tabelas**

1. Abra o arquivo: `supabase/migrations/001_create_tables.sql`
2. **Copie TODO o conteúdo** do arquivo
3. **Cole** no SQL Editor do Supabase
4. Clique em **"Run"** (ou pressione Ctrl+Enter)
5. Aguarde a execução (pode levar 10-30 segundos)
6. Verifique se apareceu: **"Success. No rows returned"**

**✅ Resultado esperado:**
```
Success. No rows returned
```

---

### **4. Executar Script 2: Configurar RLS**

1. Clique em **"New query"** novamente
2. Abra o arquivo: `supabase/migrations/002_rls_policies.sql`
3. **Copie TODO o conteúdo**
4. **Cole** no SQL Editor
5. Clique em **"Run"**
6. Aguarde a execução

**✅ Resultado esperado:**
```
Success. No rows returned
```

---

### **5. Executar Script 3: Dados de Exemplo**

1. Clique em **"New query"** novamente
2. Abra o arquivo: `supabase/migrations/003_seed_data.sql`
3. **Copie TODO o conteúdo**
4. **Cole** no SQL Editor
5. Clique em **"Run"**
6. Aguarde a execução

**✅ Resultado esperado:**
```
NOTICE: ========================================
NOTICE: DADOS DE EXEMPLO INSERIDOS COM SUCESSO
NOTICE: ========================================
NOTICE: Clientes: 5
NOTICE: Categorias: 6
NOTICE: Contatos: 3
NOTICE: Interações: 3
NOTICE: Tarefas: 3
NOTICE: Notas: 2
NOTICE: ========================================
```

---

## ✅ VALIDAR CRIAÇÃO

### **Verificar Tabelas Criadas**

No SQL Editor, execute:

```sql
SELECT 
    table_name,
    table_type
FROM information_schema.tables
WHERE table_schema = 'public'
    AND table_type = 'BASE TABLE'
ORDER BY table_name;
```

**Resultado esperado (8 tabelas):**
```
categorias
clientes
clientes_categorias
contatos
documentos
interacoes
notas
tarefas
```

---

### **Verificar Dados Inseridos**

```sql
-- Contar registros em cada tabela
SELECT 
    'clientes' AS tabela, 
    COUNT(*) AS total 
FROM public.clientes
UNION ALL
SELECT 'categorias', COUNT(*) FROM public.categorias
UNION ALL
SELECT 'contatos', COUNT(*) FROM public.contatos
UNION ALL
SELECT 'interacoes', COUNT(*) FROM public.interacoes
UNION ALL
SELECT 'tarefas', COUNT(*) FROM public.tarefas
UNION ALL
SELECT 'notas', COUNT(*) FROM public.notas;
```

**Resultado esperado:**
```
clientes      | 5
categorias    | 6
contatos      | 3
interacoes    | 3
tarefas       | 3
notas         | 2
```

---

### **Verificar RLS Habilitado**

```sql
SELECT 
    tablename,
    rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;
```

**Todas as tabelas devem ter `rowsecurity = true`**

---

### **Verificar Políticas RLS**

```sql
SELECT 
    schemaname,
    tablename,
    policyname,
    cmd
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, cmd;
```

**Deve retornar várias políticas (SELECT, INSERT, UPDATE, DELETE)**

---

## 🧪 TESTAR QUERIES

### **Listar Clientes**

```sql
SELECT 
    nome,
    email,
    telefone,
    tipo_pessoa,
    status
FROM public.clientes
ORDER BY nome;
```

---

### **Clientes com Categorias**

```sql
SELECT 
    c.nome AS cliente,
    cat.nome AS categoria,
    cat.cor
FROM public.clientes c
INNER JOIN public.clientes_categorias cc ON c.id = cc.cliente_id
INNER JOIN public.categorias cat ON cc.categoria_id = cat.id
ORDER BY c.nome, cat.nome;
```

---

### **Interações Recentes**

```sql
SELECT 
    c.nome AS cliente,
    i.tipo,
    i.assunto,
    i.data_interacao,
    i.resultado
FROM public.interacoes i
INNER JOIN public.clientes c ON i.cliente_id = c.id
ORDER BY i.data_interacao DESC;
```

---

## 🐛 TROUBLESHOOTING

### Erro: "relation already exists"

**Causa**: Tabelas já foram criadas anteriormente.

**Solução**:
```sql
-- Deletar todas as tabelas (CUIDADO!)
DROP TABLE IF EXISTS public.notas CASCADE;
DROP TABLE IF EXISTS public.tarefas CASCADE;
DROP TABLE IF EXISTS public.documentos CASCADE;
DROP TABLE IF EXISTS public.interacoes CASCADE;
DROP TABLE IF EXISTS public.contatos CASCADE;
DROP TABLE IF EXISTS public.clientes_categorias CASCADE;
DROP TABLE IF EXISTS public.categorias CASCADE;
DROP TABLE IF EXISTS public.clientes CASCADE;

-- Depois execute os scripts novamente
```

---

### Erro: "permission denied"

**Causa**: Usuário sem permissões adequadas.

**Solução**: Certifique-se de estar usando o usuário correto no Supabase Dashboard.

---

### Erro ao inserir dados

**Causa**: Tabelas não foram criadas ou RLS está bloqueando.

**Solução**:
1. Verifique se as tabelas existem
2. Verifique se RLS está configurado
3. Certifique-se de estar autenticado

---

## 📊 VISUALIZAR NO SUPABASE

### **Table Editor**

1. No menu lateral, clique em **"Table Editor"**
2. Selecione cada tabela para visualizar os dados
3. Você pode editar, adicionar ou deletar registros

### **Database**

1. No menu lateral, clique em **"Database"**
2. Veja a estrutura completa
3. Verifique índices, triggers e constraints

---

## 🎯 PRÓXIMOS PASSOS

Após executar todos os scripts:

1. ✅ Gerar tipos TypeScript
2. ✅ Configurar cliente Supabase no projeto
3. ✅ Testar conexão
4. ✅ Implementar CRUD

---

## 📝 CHECKLIST

- [ ] Acessei o Supabase Dashboard
- [ ] Executei `001_create_tables.sql`
- [ ] Executei `002_rls_policies.sql`
- [ ] Executei `003_seed_data.sql`
- [ ] Verifiquei que 8 tabelas foram criadas
- [ ] Verifiquei que dados de exemplo foram inseridos
- [ ] Verifiquei que RLS está habilitado
- [ ] Testei queries de exemplo
- [ ] Visualizei dados no Table Editor

---

**Tudo pronto! Banco de dados configurado com sucesso! 🎉**
