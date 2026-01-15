# 🔄 ATUALIZAR TIPOS TYPESCRIPT DO SUPABASE

**Data**: 2026-01-15  
**Projeto**: Cadastro de Clientes

---

## 📋 QUANDO ATUALIZAR OS TIPOS

Atualize os tipos TypeScript sempre que:

- ✅ Criar novas tabelas no Supabase
- ✅ Adicionar/remover colunas
- ✅ Alterar tipos de dados
- ✅ Modificar constraints
- ✅ Adicionar/remover enums

---

## 🚀 COMO ATUALIZAR

### **Método 1: Via npx (Recomendado)**

```bash
# Gerar tipos automaticamente do Supabase
npx supabase gen types typescript --project-id olwqbdosvdzlhouadntr > src/types/supabase.ts
```

**Pré-requisitos:**
- As tabelas devem estar criadas no Supabase
- Você deve ter acesso ao projeto

---

### **Método 2: Via Supabase CLI**

```bash
# Instalar Supabase CLI (se ainda não tiver)
npm install -g supabase

# Gerar tipos
supabase gen types typescript --project-id olwqbdosvdzlhouadntr > src/types/supabase.ts
```

---

### **Método 3: Manual (Não Recomendado)**

Se os métodos acima falharem, você pode:

1. Acessar: https://app.supabase.com/project/olwqbdosvdzlhouadntr/api
2. Ir em "TypeScript"
3. Copiar o código gerado
4. Colar em `src/types/supabase.ts`

---

## 📝 PASSO A PASSO COMPLETO

### **1. Executar Scripts SQL no Supabase**

Primeiro, certifique-se de que as tabelas foram criadas:

```bash
# Siga o guia: GUIA-EXECUTAR-SQL-SUPABASE.md
```

---

### **2. Gerar Tipos TypeScript**

```bash
cd /home/alessandro/cadastro-clientes

# Gerar tipos
npx supabase gen types typescript --project-id olwqbdosvdzlhouadntr > src/types/supabase.ts
```

---

### **3. Verificar Arquivo Gerado**

```bash
# Ver primeiras linhas do arquivo
head -n 50 src/types/supabase.ts
```

O arquivo deve conter:
- Interface `Database`
- Tipos para cada tabela
- Tipos `Row`, `Insert`, `Update` para cada tabela

---

### **4. Commit das Alterações**

```bash
git add src/types/supabase.ts
git commit -m "chore: atualizar tipos TypeScript do Supabase"
git push
```

---

## 🔧 CONFIGURAR CLIENTE SUPABASE COM TIPOS

### **Atualizar src/integrations/supabase/client.ts**

```typescript
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/supabase'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

export const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      storage: localStorage,
      persistSession: true,
      autoRefreshToken: true,
    }
  }
)
```

---

## 💡 EXEMPLOS DE USO COM TYPESCRIPT

### **1. Buscar Clientes (Tipado)**

```typescript
import { supabase } from '@/integrations/supabase/client'
import type { Cliente } from '@/types/supabase'

// Buscar todos os clientes
const { data, error } = await supabase
  .from('clientes')
  .select('*')

// data é do tipo Cliente[] | null
if (data) {
  data.forEach((cliente: Cliente) => {
    console.log(cliente.nome) // ✅ Autocomplete funciona!
  })
}
```

---

### **2. Inserir Cliente (Tipado)**

```typescript
import type { ClienteInsert } from '@/types/supabase'

const novoCliente: ClienteInsert = {
  nome: 'João Silva',
  email: 'joao@example.com',
  telefone: '(11) 98765-4321',
  tipo_pessoa: 'fisica', // ✅ Autocomplete com valores permitidos
  status: 'ativo'
}

const { data, error } = await supabase
  .from('clientes')
  .insert(novoCliente)
  .select()
  .single()

// data é do tipo Cliente | null
```

---

### **3. Atualizar Cliente (Tipado)**

```typescript
import type { ClienteUpdate } from '@/types/supabase'

const atualizacao: ClienteUpdate = {
  telefone: '(11) 99999-8888',
  status: 'inativo'
}

const { data, error } = await supabase
  .from('clientes')
  .update(atualizacao)
  .eq('id', clienteId)
  .select()
  .single()
```

---

### **4. Buscar com Relacionamentos**

```typescript
import type { Cliente, Categoria } from '@/types/supabase'

const { data, error } = await supabase
  .from('clientes')
  .select(`
    *,
    clientes_categorias (
      categorias (
        *
      )
    )
  `)

// Tipo personalizado para o resultado
type ClienteComCategorias = Cliente & {
  clientes_categorias: {
    categorias: Categoria
  }[]
}
```

---

### **5. Usar Enums**

```typescript
import type { Database } from '@/types/supabase'

type StatusCliente = Database['public']['Tables']['clientes']['Row']['status']
// StatusCliente = 'ativo' | 'inativo' | 'bloqueado'

type TipoInteracao = Database['public']['Tables']['interacoes']['Row']['tipo']
// TipoInteracao = 'ligacao' | 'email' | 'reuniao' | 'whatsapp' | 'visita' | 'outro'
```

---

## 🎯 HOOKS PERSONALIZADOS

### **useClientes.ts**

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import type { Cliente, ClienteInsert, ClienteUpdate } from '@/types/supabase'

export function useClientes() {
  const queryClient = useQueryClient()

  // Buscar todos os clientes
  const { data: clientes, isLoading } = useQuery({
    queryKey: ['clientes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clientes')
        .select('*')
        .order('nome')
      
      if (error) throw error
      return data as Cliente[]
    }
  })

  // Criar cliente
  const criarCliente = useMutation({
    mutationFn: async (novoCliente: ClienteInsert) => {
      const { data, error } = await supabase
        .from('clientes')
        .insert(novoCliente)
        .select()
        .single()
      
      if (error) throw error
      return data as Cliente
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientes'] })
    }
  })

  // Atualizar cliente
  const atualizarCliente = useMutation({
    mutationFn: async ({ id, dados }: { id: string; dados: ClienteUpdate }) => {
      const { data, error } = await supabase
        .from('clientes')
        .update(dados)
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      return data as Cliente
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientes'] })
    }
  })

  // Deletar cliente
  const deletarCliente = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('clientes')
        .delete()
        .eq('id', id)
      
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientes'] })
    }
  })

  return {
    clientes,
    isLoading,
    criarCliente,
    atualizarCliente,
    deletarCliente
  }
}
```

---

## 🐛 TROUBLESHOOTING

### Erro: "Cannot find module '@/types/supabase'"

**Solução:**
```bash
# Verificar se o arquivo existe
ls -la src/types/supabase.ts

# Se não existir, gerar
npx supabase gen types typescript --project-id olwqbdosvdzlhouadntr > src/types/supabase.ts
```

---

### Erro: "project_id is invalid"

**Solução:**
- Verifique se o project_id está correto: `olwqbdosvdzlhouadntr`
- Certifique-se de ter acesso ao projeto no Supabase

---

### Tipos não estão atualizando

**Solução:**
```bash
# Limpar cache do TypeScript
rm -rf node_modules/.vite
rm -rf dist

# Reiniciar servidor de desenvolvimento
npm run dev
```

---

## ✅ CHECKLIST

- [ ] Tabelas criadas no Supabase
- [ ] Tipos TypeScript gerados
- [ ] Cliente Supabase configurado com tipos
- [ ] Exemplos de uso testados
- [ ] Hooks personalizados criados
- [ ] Commit realizado

---

**Tipos atualizados com sucesso! 🎉**
