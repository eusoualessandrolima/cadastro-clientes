# 📊 DOCUMENTAÇÃO DO BANCO DE DADOS - CADASTRO DE CLIENTES

**Versão**: 1.0.0  
**Data**: 2026-01-15  
**SGBD**: PostgreSQL (Supabase)

---

## 📋 ÍNDICE

1. [Visão Geral](#visão-geral)
2. [Diagrama ER](#diagrama-er)
3. [Tabelas](#tabelas)
4. [Relacionamentos](#relacionamentos)
5. [Índices](#índices)
6. [Políticas RLS](#políticas-rls)
7. [Queries de Exemplo](#queries-de-exemplo)

---

## 🎯 VISÃO GERAL

O banco de dados foi projetado para gerenciar um sistema completo de cadastro e relacionamento com clientes, incluindo:

- **Cadastro de Clientes** (PF e PJ)
- **Categorização** de clientes
- **Múltiplos Contatos** por cliente
- **Histórico de Interações**
- **Gestão de Documentos**
- **Tarefas e Follow-ups**
- **Notas Rápidas**

### Estatísticas

- **8 Tabelas Principais**
- **30+ Índices** para performance
- **RLS Habilitado** em todas as tabelas
- **Triggers Automáticos** para timestamps

---

## 🗺️ DIAGRAMA ER

```
┌─────────────────────┐
│     CLIENTES        │
├─────────────────────┤
│ • id (PK)          │
│ • nome             │
│ • email            │◄────────┐
│ • telefone         │         │
│ • cpf_cnpj         │         │
│ • tipo_pessoa      │         │
│ • endereco (JSON)  │         │
│ • status           │         │
│ • data_cadastro    │         │
└─────────────────────┘         │
         │                      │
         │ 1:N                  │
         ▼                      │
┌─────────────────────┐         │
│     CONTATOS        │         │
├─────────────────────┤         │
│ • id (PK)          │         │
│ • cliente_id (FK)  │─────────┘
│ • nome             │
│ • cargo            │
│ • email            │
│ • telefone         │
│ • preferencial     │
└─────────────────────┘

┌─────────────────────┐         ┌─────────────────────┐
│    CATEGORIAS       │         │  CLIENTES_          │
├─────────────────────┤    N:M  │  CATEGORIAS         │
│ • id (PK)          │◄────────┤─────────────────────┤
│ • nome             │         │ • id (PK)          │
│ • descricao        │         │ • cliente_id (FK)  │
│ • cor              │         │ • categoria_id(FK) │
│ • icone            │         └─────────────────────┘
└─────────────────────┘                  │
                                         │
                                         ▼
                              ┌─────────────────────┐
                              │     CLIENTES        │
                              └─────────────────────┘

┌─────────────────────┐
│    INTERACOES       │
├─────────────────────┤
│ • id (PK)          │
│ • cliente_id (FK)  │─────────┐
│ • tipo             │         │
│ • assunto          │         │
│ • descricao        │         │
│ • data_interacao   │         │
│ • resultado        │         │
│ • proxima_acao     │         │
└─────────────────────┘         │
                                │
┌─────────────────────┐         │
│    DOCUMENTOS       │         │
├─────────────────────┤         │
│ • id (PK)          │         │
│ • cliente_id (FK)  │─────────┤
│ • nome             │         │
│ • tipo             │         │
│ • url              │         │
│ • tags[]           │         │
└─────────────────────┘         │
                                │
┌─────────────────────┐         │
│      TAREFAS        │         │
├─────────────────────┤         │
│ • id (PK)          │         │
│ • cliente_id (FK)  │─────────┤
│ • titulo           │         │
│ • status           │         │
│ • prioridade       │         │
│ • data_vencimento  │         │
│ • responsavel_id   │         │
└─────────────────────┘         │
                                │
┌─────────────────────┐         │
│       NOTAS         │         │
├─────────────────────┤         │
│ • id (PK)          │         │
│ • cliente_id (FK)  │─────────┘
│ • conteudo         │
│ • fixada           │
│ • cor              │
└─────────────────────┘
```

---

## 📊 TABELAS

### 1. **clientes**

Tabela principal do sistema.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `id` | UUID | Identificador único (PK) |
| `nome` | VARCHAR(255) | Nome do cliente |
| `email` | VARCHAR(255) | Email (único) |
| `telefone` | VARCHAR(20) | Telefone principal |
| `cpf_cnpj` | VARCHAR(18) | CPF ou CNPJ (único) |
| `tipo_pessoa` | VARCHAR(10) | 'fisica' ou 'juridica' |
| `endereco` | JSONB | Endereço completo |
| `observacoes` | TEXT | Observações gerais |
| `status` | VARCHAR(20) | 'ativo', 'inativo', 'bloqueado' |
| `data_cadastro` | TIMESTAMPTZ | Data de criação |
| `data_atualizacao` | TIMESTAMPTZ | Última atualização |
| `criado_por` | UUID | Usuário que criou (FK) |
| `atualizado_por` | UUID | Usuário que atualizou (FK) |

**Constraints:**
- Nome deve ter no mínimo 3 caracteres
- Email e CPF/CNPJ devem ser únicos
- Status: apenas valores permitidos

**Índices:**
- `idx_clientes_nome`
- `idx_clientes_email`
- `idx_clientes_cpf_cnpj`
- `idx_clientes_status`
- `idx_clientes_data_cadastro`

---

### 2. **categorias**

Categorias para classificação de clientes.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `id` | UUID | Identificador único (PK) |
| `nome` | VARCHAR(100) | Nome da categoria (único) |
| `descricao` | TEXT | Descrição |
| `cor` | VARCHAR(7) | Cor em hexadecimal |
| `icone` | VARCHAR(50) | Nome do ícone |
| `ativo` | BOOLEAN | Se está ativa |
| `criado_em` | TIMESTAMPTZ | Data de criação |
| `atualizado_em` | TIMESTAMPTZ | Última atualização |

**Exemplos:**
- VIP (#FFD700)
- Corporativo (#4169E1)
- Varejo (#32CD32)

---

### 3. **clientes_categorias**

Relacionamento N:M entre clientes e categorias.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `id` | UUID | Identificador único (PK) |
| `cliente_id` | UUID | ID do cliente (FK) |
| `categoria_id` | UUID | ID da categoria (FK) |
| `criado_em` | TIMESTAMPTZ | Data de criação |

**Constraint:**
- UNIQUE(cliente_id, categoria_id) - Evita duplicatas

---

### 4. **contatos**

Múltiplos contatos por cliente.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `id` | UUID | Identificador único (PK) |
| `cliente_id` | UUID | ID do cliente (FK) |
| `nome` | VARCHAR(255) | Nome do contato |
| `cargo` | VARCHAR(100) | Cargo/função |
| `email` | VARCHAR(255) | Email do contato |
| `telefone` | VARCHAR(20) | Telefone |
| `whatsapp` | VARCHAR(20) | WhatsApp |
| `preferencial` | BOOLEAN | Se é contato principal |
| `observacoes` | TEXT | Observações |
| `criado_em` | TIMESTAMPTZ | Data de criação |
| `atualizado_em` | TIMESTAMPTZ | Última atualização |

---

### 5. **interacoes**

Histórico de todas as interações com clientes.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `id` | UUID | Identificador único (PK) |
| `cliente_id` | UUID | ID do cliente (FK) |
| `tipo` | VARCHAR(50) | Tipo de interação |
| `assunto` | VARCHAR(255) | Assunto |
| `descricao` | TEXT | Descrição detalhada |
| `data_interacao` | TIMESTAMPTZ | Quando ocorreu |
| `duracao_minutos` | INTEGER | Duração em minutos |
| `resultado` | VARCHAR(50) | Resultado da interação |
| `proxima_acao` | TEXT | Próxima ação |
| `data_proxima_acao` | TIMESTAMPTZ | Data da próxima ação |
| `anexos` | JSONB | Anexos relacionados |
| `criado_por` | UUID | Quem registrou (FK) |
| `criado_em` | TIMESTAMPTZ | Data de criação |

**Tipos de Interação:**
- ligacao
- email
- reuniao
- whatsapp
- visita
- outro

**Resultados:**
- positivo
- neutro
- negativo
- pendente

---

### 6. **documentos**

Documentos anexados aos clientes.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `id` | UUID | Identificador único (PK) |
| `cliente_id` | UUID | ID do cliente (FK) |
| `nome` | VARCHAR(255) | Nome do arquivo |
| `tipo` | VARCHAR(50) | Tipo de documento |
| `tamanho_bytes` | BIGINT | Tamanho do arquivo |
| `url` | TEXT | URL do arquivo |
| `storage_path` | TEXT | Caminho no storage |
| `descricao` | TEXT | Descrição |
| `tags` | TEXT[] | Tags para busca |
| `criado_por` | UUID | Quem fez upload (FK) |
| `criado_em` | TIMESTAMPTZ | Data de upload |

---

### 7. **tarefas**

Tarefas relacionadas aos clientes.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `id` | UUID | Identificador único (PK) |
| `cliente_id` | UUID | ID do cliente (FK) |
| `titulo` | VARCHAR(255) | Título da tarefa |
| `descricao` | TEXT | Descrição |
| `status` | VARCHAR(20) | Status atual |
| `prioridade` | VARCHAR(20) | Prioridade |
| `data_vencimento` | TIMESTAMPTZ | Data de vencimento |
| `data_conclusao` | TIMESTAMPTZ | Quando foi concluída |
| `responsavel_id` | UUID | Responsável (FK) |
| `criado_por` | UUID | Quem criou (FK) |
| `criado_em` | TIMESTAMPTZ | Data de criação |
| `atualizado_em` | TIMESTAMPTZ | Última atualização |

**Status:**
- pendente
- em_andamento
- concluida
- cancelada

**Prioridade:**
- baixa
- media
- alta
- urgente

---

### 8. **notas**

Notas rápidas sobre clientes.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `id` | UUID | Identificador único (PK) |
| `cliente_id` | UUID | ID do cliente (FK) |
| `conteudo` | TEXT | Conteúdo da nota |
| `fixada` | BOOLEAN | Se está fixada |
| `cor` | VARCHAR(7) | Cor da nota |
| `criado_por` | UUID | Quem criou (FK) |
| `criado_em` | TIMESTAMPTZ | Data de criação |
| `atualizado_em` | TIMESTAMPTZ | Última atualização |

---

## 🔗 RELACIONAMENTOS

### Clientes → Contatos (1:N)
Um cliente pode ter múltiplos contatos.

### Clientes ↔ Categorias (N:M)
Um cliente pode ter várias categorias e uma categoria pode ter vários clientes.

### Clientes → Interações (1:N)
Um cliente pode ter múltiplas interações registradas.

### Clientes → Documentos (1:N)
Um cliente pode ter múltiplos documentos anexados.

### Clientes → Tarefas (1:N)
Um cliente pode ter múltiplas tarefas associadas.

### Clientes → Notas (1:N)
Um cliente pode ter múltiplas notas.

---

## 🔒 POLÍTICAS RLS

Todas as tabelas têm RLS habilitado com as seguintes políticas:

- ✅ **SELECT**: Usuários autenticados podem visualizar
- ✅ **INSERT**: Usuários autenticados podem criar
- ✅ **UPDATE**: Usuários autenticados podem atualizar
- ✅ **DELETE**: Usuários autenticados podem deletar

**Storage:**
- Bucket `documentos-clientes` criado
- Políticas de acesso para usuários autenticados

---

## 📝 QUERIES DE EXEMPLO

### Listar todos os clientes ativos

```sql
SELECT 
    id,
    nome,
    email,
    telefone,
    tipo_pessoa,
    status
FROM public.clientes
WHERE status = 'ativo'
ORDER BY nome;
```

### Buscar clientes por categoria

```sql
SELECT 
    c.id,
    c.nome,
    c.email,
    cat.nome AS categoria
FROM public.clientes c
INNER JOIN public.clientes_categorias cc ON c.id = cc.cliente_id
INNER JOIN public.categorias cat ON cc.categoria_id = cat.id
WHERE cat.nome = 'VIP'
ORDER BY c.nome;
```

### Listar interações recentes

```sql
SELECT 
    c.nome AS cliente,
    i.tipo,
    i.assunto,
    i.data_interacao,
    i.resultado
FROM public.interacoes i
INNER JOIN public.clientes c ON i.cliente_id = c.id
WHERE i.data_interacao >= NOW() - INTERVAL '30 days'
ORDER BY i.data_interacao DESC;
```

### Tarefas pendentes por prioridade

```sql
SELECT 
    c.nome AS cliente,
    t.titulo,
    t.prioridade,
    t.data_vencimento,
    t.status
FROM public.tarefas t
INNER JOIN public.clientes c ON t.cliente_id = c.id
WHERE t.status IN ('pendente', 'em_andamento')
ORDER BY 
    CASE t.prioridade
        WHEN 'urgente' THEN 1
        WHEN 'alta' THEN 2
        WHEN 'media' THEN 3
        WHEN 'baixa' THEN 4
    END,
    t.data_vencimento;
```

### Clientes com mais interações

```sql
SELECT 
    c.nome,
    c.email,
    COUNT(i.id) AS total_interacoes,
    MAX(i.data_interacao) AS ultima_interacao
FROM public.clientes c
LEFT JOIN public.interacoes i ON c.id = i.cliente_id
GROUP BY c.id, c.nome, c.email
ORDER BY total_interacoes DESC
LIMIT 10;
```

### Buscar clientes por texto (nome, email ou CPF/CNPJ)

```sql
SELECT 
    id,
    nome,
    email,
    cpf_cnpj,
    telefone
FROM public.clientes
WHERE 
    nome ILIKE '%termo%' OR
    email ILIKE '%termo%' OR
    cpf_cnpj ILIKE '%termo%'
ORDER BY nome;
```

### Dashboard - Estatísticas gerais

```sql
SELECT 
    (SELECT COUNT(*) FROM public.clientes WHERE status = 'ativo') AS clientes_ativos,
    (SELECT COUNT(*) FROM public.clientes WHERE status = 'inativo') AS clientes_inativos,
    (SELECT COUNT(*) FROM public.tarefas WHERE status = 'pendente') AS tarefas_pendentes,
    (SELECT COUNT(*) FROM public.interacoes WHERE data_interacao >= NOW() - INTERVAL '7 days') AS interacoes_semana;
```

### Clientes sem interação nos últimos 30 dias

```sql
SELECT 
    c.id,
    c.nome,
    c.email,
    c.telefone,
    MAX(i.data_interacao) AS ultima_interacao
FROM public.clientes c
LEFT JOIN public.interacoes i ON c.id = i.cliente_id
WHERE c.status = 'ativo'
GROUP BY c.id, c.nome, c.email, c.telefone
HAVING MAX(i.data_interacao) < NOW() - INTERVAL '30 days' OR MAX(i.data_interacao) IS NULL
ORDER BY ultima_interacao NULLS FIRST;
```

---

## 🔧 MANUTENÇÃO

### Atualizar timestamp automaticamente

Triggers já configurados para atualizar `atualizado_em` automaticamente em:
- clientes
- categorias
- contatos
- tarefas
- notas

### Backup recomendado

```bash
# Via Supabase CLI
supabase db dump -f backup.sql

# Via pg_dump
pg_dump -h db.olwqbdosvdzlhouadntr.supabase.co -U postgres -d postgres > backup.sql
```

---

**Última atualização**: 2026-01-15  
**Versão do Schema**: 1.0.0
