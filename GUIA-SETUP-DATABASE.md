# 🚀 GUIA: CRIAR BANCO DE DADOS NO SUPABASE

**Projeto**: Cadastro de Clientes  
**Data**: 2026-01-15

---

## 🎯 **OPÇÃO 1: EXECUÇÃO AUTOMÁTICA (VIA SCRIPT)**

### **Passo 1: Instalar dependência**
```bash
npm install pg
```

### **Passo 2: Executar script**
```bash
node supabase/setup-db.js
```

**Resultado esperado:**
```
🔌 Conectando ao Supabase...
✅ Conectado com sucesso!

📝 Executando script SQL...
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Script executado com sucesso!

📊 Verificando tabelas criadas...

📋 Tabelas encontradas:
   1. clientes
   2. contatos
   3. empresas
   4. interacoes

👥 Clientes cadastrados: 3

✅ Banco de dados configurado com sucesso!
```

---

## 🎯 **OPÇÃO 2: EXECUÇÃO MANUAL (VIA SQL EDITOR)**

### **Passo 1: Acessar SQL Editor**
https://app.supabase.com/project/ekpstisekzbawublbayx/sql/new

### **Passo 2: Copiar SQL**
Abra o arquivo: `supabase/setup-database.sql`

### **Passo 3: Colar e Executar**
1. Cole TODO o conteúdo no SQL Editor
2. Clique em **"Run"** (ou Ctrl+Enter)
3. Aguarde mensagem de sucesso

---

## ✅ **VALIDAÇÃO**

### **1. Verificar Tabelas Criadas**

Acesse: https://app.supabase.com/project/ekpstisekzbawublbayx/editor

**Tabelas esperadas:**
- ✅ clientes
- ✅ contatos
- ✅ interacoes
- ✅ empresas

### **2. Verificar RLS Ativo**

Cada tabela deve ter o ícone de cadeado 🔒

### **3. Verificar Dados de Exemplo**

Execute no SQL Editor:
```sql
SELECT * FROM public.clientes;
```

**Resultado esperado:** 3 clientes

---

## 📊 **ESTRUTURA CRIADA**

### **Tabela: clientes**
- id (UUID)
- nome (TEXT)
- email (TEXT UNIQUE)
- telefone (TEXT)
- cpf_cnpj (TEXT UNIQUE)
- tipo_pessoa ('fisica' | 'juridica')
- status ('ativo' | 'inativo' | 'prospect' | 'cliente')
- endereco, cidade, estado, cep
- data_cadastro, ultima_atualizacao
- observacoes, tags
- created_by (FK auth.users)

### **Tabela: contatos**
- id (UUID)
- cliente_id (FK clientes)
- tipo ('telefone' | 'email' | 'whatsapp' | 'outro')
- valor (TEXT)
- principal (BOOLEAN)
- observacao (TEXT)
- created_at

### **Tabela: interacoes**
- id (UUID)
- cliente_id (FK clientes)
- tipo ('ligacao' | 'email' | 'reuniao' | 'whatsapp' | 'proposta' | 'outro')
- titulo, descricao
- data_interacao, proximo_contato
- status ('agendado' | 'concluido' | 'cancelado')
- usuario_id (FK auth.users)
- created_at

### **Tabela: empresas**
- id (UUID)
- cliente_id (FK clientes UNIQUE)
- razao_social, nome_fantasia
- cnpj (UNIQUE)
- inscricao_estadual, inscricao_municipal
- porte ('MEI' | 'ME' | 'EPP' | 'MEDIO' | 'GRANDE')
- created_at

---

## 🔐 **SEGURANÇA (RLS)**

Todas as tabelas têm RLS habilitado com policies:

- ✅ SELECT - Usuários autenticados podem ver
- ✅ INSERT - Usuários autenticados podem criar
- ✅ UPDATE - Usuários autenticados podem atualizar
- ✅ DELETE - Usuários autenticados podem deletar

---

## 🎯 **PRÓXIMOS PASSOS**

### **1. Gerar Tipos TypeScript**
```bash
npx supabase gen types typescript --project-id ekpstisekzbawublbayx > src/types/supabase.ts
```

### **2. Testar Conexão**
```bash
node supabase/test-connection.js
```

### **3. Atualizar Cliente Supabase**
Verificar se `src/integrations/supabase/client.ts` está usando os tipos corretos.

---

## 🐛 **TROUBLESHOOTING**

### **Erro: "relation already exists"**
As tabelas já foram criadas. Você pode:
1. Ignorar (tudo OK)
2. Ou dropar e recriar (cuidado com dados!)

### **Erro: "permission denied"**
Verifique se a senha está correta na connection string.

### **Erro: "could not connect"**
Verifique:
1. Connection string está correta
2. Firewall não está bloqueando
3. Supabase está online

---

## ✅ **CHECKLIST**

- [ ] Script executado com sucesso
- [ ] 4 tabelas criadas
- [ ] RLS habilitado
- [ ] 3 clientes de exemplo inseridos
- [ ] Tipos TypeScript gerados
- [ ] Conexão testada

---

**Pronto para executar! 🚀**
