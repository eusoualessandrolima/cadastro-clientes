/**
 * Exemplos de uso do Supabase Client
 * Funções para interagir com a tabela de clientes
 */

import { supabase } from '@/integrations/supabase/client';

// =====================================================
// CLIENTES - CRUD Operations
// =====================================================

/**
 * Buscar todos os clientes
 */
export async function getClientes() {
    const { data, error } = await supabase
        .from('clientes')
        .select('*')
        .order('data_cadastro', { ascending: false });

    if (error) {
        console.error('Erro ao buscar clientes:', error);
        throw error;
    }

    return data;
}

/**
 * Buscar cliente por ID
 */
export async function getClienteById(id: string) {
    const { data, error } = await supabase
        .from('clientes')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        console.error('Erro ao buscar cliente:', error);
        throw error;
    }

    return data;
}

/**
 * Criar novo cliente
 */
export async function createCliente(cliente: {
    nome: string;
    email?: string;
    telefone?: string;
    cpf_cnpj?: string;
    tipo_pessoa?: 'fisica' | 'juridica';
    status?: 'ativo' | 'inativo' | 'prospect' | 'cliente';
    cidade?: string;
    estado?: string;
    observacoes?: string;
}) {
    const { data, error } = await supabase
        .from('clientes')
        .insert([cliente])
        .select()
        .single();

    if (error) {
        console.error('Erro ao criar cliente:', error);
        throw error;
    }

    return data;
}

/**
 * Atualizar cliente
 */
export async function updateCliente(id: string, updates: Partial<{
    nome: string;
    email: string;
    telefone: string;
    status: string;
    observacoes: string;
}>) {
    const { data, error } = await supabase
        .from('clientes')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

    if (error) {
        console.error('Erro ao atualizar cliente:', error);
        throw error;
    }

    return data;
}

/**
 * Deletar cliente
 */
export async function deleteCliente(id: string) {
    const { error } = await supabase
        .from('clientes')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Erro ao deletar cliente:', error);
        throw error;
    }

    return true;
}

/**
 * Buscar clientes por status
 */
export async function getClientesByStatus(status: 'ativo' | 'inativo' | 'prospect' | 'cliente') {
    const { data, error } = await supabase
        .from('clientes')
        .select('*')
        .eq('status', status)
        .order('nome');

    if (error) {
        console.error('Erro ao buscar clientes por status:', error);
        throw error;
    }

    return data;
}

/**
 * Buscar clientes com filtro de texto (nome, email, telefone)
 */
export async function searchClientes(searchTerm: string) {
    const { data, error } = await supabase
        .from('clientes')
        .select('*')
        .or(`nome.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,telefone.ilike.%${searchTerm}%`)
        .order('nome');

    if (error) {
        console.error('Erro ao buscar clientes:', error);
        throw error;
    }

    return data;
}

// =====================================================
// CONTATOS - CRUD Operations
// =====================================================

/**
 * Buscar contatos de um cliente
 */
export async function getContatosByCliente(clienteId: string) {
    const { data, error } = await supabase
        .from('contatos')
        .select('*')
        .eq('cliente_id', clienteId)
        .order('principal', { ascending: false });

    if (error) {
        console.error('Erro ao buscar contatos:', error);
        throw error;
    }

    return data;
}

/**
 * Criar novo contato
 */
export async function createContato(contato: {
    cliente_id: string;
    tipo: 'telefone' | 'email' | 'whatsapp' | 'outro';
    valor: string;
    principal?: boolean;
    observacao?: string;
}) {
    const { data, error } = await supabase
        .from('contatos')
        .insert([contato])
        .select()
        .single();

    if (error) {
        console.error('Erro ao criar contato:', error);
        throw error;
    }

    return data;
}

// =====================================================
// INTERAÇÕES - CRUD Operations
// =====================================================

/**
 * Buscar interações de um cliente
 */
export async function getInteracoesByCliente(clienteId: string) {
    const { data, error } = await supabase
        .from('interacoes')
        .select('*')
        .eq('cliente_id', clienteId)
        .order('data_interacao', { ascending: false });

    if (error) {
        console.error('Erro ao buscar interações:', error);
        throw error;
    }

    return data;
}

/**
 * Criar nova interação
 */
export async function createInteracao(interacao: {
    cliente_id: string;
    tipo: 'ligacao' | 'email' | 'reuniao' | 'whatsapp' | 'proposta' | 'outro';
    titulo: string;
    descricao?: string;
    data_interacao?: string;
    proximo_contato?: string;
    status?: 'agendado' | 'concluido' | 'cancelado';
}) {
    const { data, error } = await supabase
        .from('interacoes')
        .insert([interacao])
        .select()
        .single();

    if (error) {
        console.error('Erro ao criar interação:', error);
        throw error;
    }

    return data;
}

// =====================================================
// ESTATÍSTICAS
// =====================================================

/**
 * Contar clientes por status
 */
export async function getClientesStats() {
    const { data, error } = await supabase
        .from('clientes')
        .select('status');

    if (error) {
        console.error('Erro ao buscar estatísticas:', error);
        throw error;
    }

    const stats = {
        total: data.length,
        ativo: data.filter(c => c.status === 'ativo').length,
        inativo: data.filter(c => c.status === 'inativo').length,
        prospect: data.filter(c => c.status === 'prospect').length,
        cliente: data.filter(c => c.status === 'cliente').length,
    };

    return stats;
}

// =====================================================
// TESTE DE CONEXÃO
// =====================================================

/**
 * Testar conexão com Supabase
 */
export async function testConnection() {
    try {
        const { data, error } = await supabase
            .from('clientes')
            .select('count')
            .limit(1);

        if (error) {
            console.error('❌ Erro na conexão:', error);
            return false;
        }

        console.log('✅ Conexão com Supabase OK!');
        return true;
    } catch (err) {
        console.error('❌ Erro ao testar conexão:', err);
        return false;
    }
}
