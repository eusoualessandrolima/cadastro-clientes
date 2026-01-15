/**
 * Script de teste para validar conexão com Supabase
 * Execute no console do navegador ou como módulo
 */

import { supabase } from '@/integrations/supabase/client';
import { testConnection, getClientesStats } from './supabase-examples';

export async function runTests() {
    console.log('🧪 Iniciando testes de conexão Supabase...\n');

    // Teste 1: Conexão básica
    console.log('📡 Teste 1: Verificando conexão...');
    const isConnected = await testConnection();
    console.log(isConnected ? '✅ Conexão OK' : '❌ Falha na conexão');
    console.log('');

    // Teste 2: Buscar tabelas
    console.log('📋 Teste 2: Listando tabelas...');
    try {
        const { data: clientes } = await supabase.from('clientes').select('count');
        const { data: contatos } = await supabase.from('contatos').select('count');
        const { data: interacoes } = await supabase.from('interacoes').select('count');
        const { data: empresas } = await supabase.from('empresas').select('count');

        console.log('✅ Tabelas encontradas:');
        console.log('   - clientes:', clientes);
        console.log('   - contatos:', contatos);
        console.log('   - interacoes:', interacoes);
        console.log('   - empresas:', empresas);
    } catch (error) {
        console.error('❌ Erro ao listar tabelas:', error);
    }
    console.log('');

    // Teste 3: Buscar clientes
    console.log('👥 Teste 3: Buscando clientes...');
    try {
        const { data: clientes, error } = await supabase
            .from('clientes')
            .select('*')
            .limit(5);

        if (error) throw error;

        console.log(`✅ ${clientes?.length || 0} clientes encontrados:`);
        clientes?.forEach((cliente, index) => {
            console.log(`   ${index + 1}. ${cliente.nome} (${cliente.email || 'sem email'})`);
        });
    } catch (error) {
        console.error('❌ Erro ao buscar clientes:', error);
    }
    console.log('');

    // Teste 4: Estatísticas
    console.log('📊 Teste 4: Estatísticas...');
    try {
        const stats = await getClientesStats();
        console.log('✅ Estatísticas:');
        console.log('   Total:', stats.total);
        console.log('   Ativos:', stats.ativo);
        console.log('   Inativos:', stats.inativo);
        console.log('   Prospects:', stats.prospect);
        console.log('   Clientes:', stats.cliente);
    } catch (error) {
        console.error('❌ Erro ao buscar estatísticas:', error);
    }
    console.log('');

    // Teste 5: Autenticação
    console.log('🔐 Teste 5: Verificando autenticação...');
    try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
            console.log('✅ Usuário autenticado:');
            console.log('   Email:', session.user.email);
            console.log('   ID:', session.user.id);
        } else {
            console.log('⚠️  Nenhum usuário autenticado');
        }
    } catch (error) {
        console.error('❌ Erro ao verificar autenticação:', error);
    }
    console.log('');

    console.log('✅ Testes concluídos!');
    console.log('━'.repeat(50));
}

// Auto-executar se estiver no navegador
if (typeof window !== 'undefined') {
    console.log('💡 Para executar os testes, chame: runTests()');
}

export default runTests;
