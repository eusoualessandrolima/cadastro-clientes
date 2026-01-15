import { supabase } from '@/integrations/supabase/client';
import { FormData } from '@/types/quiz';
import { parseCurrency } from '@/utils/validation';

// Fallback URL - será sobrescrita pela configuração do usuário
const WEBHOOK_URL_FALLBACK = 'https://webhook.companychatautomacoeseia.com/webhook/formcliente';

// Função para buscar a URL de produção do webhook das configurações do usuário
async function getWebhookUrlProd(): Promise<string | null> {
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      console.warn('⚠️ Usuário não autenticado, usando URL de fallback');
      return WEBHOOK_URL_FALLBACK;
    }

    const { data, error } = await supabase
      .from('configuracoes_sistema')
      .select('configuracoes')
      .eq('user_id', userData.user.id)
      .maybeSingle();

    if (error) {
      console.error('Erro ao buscar configurações:', error);
      return WEBHOOK_URL_FALLBACK;
    }

    const config = data?.configuracoes as { webhook_url_prod?: string } | null;
    
    if (config?.webhook_url_prod) {
      console.log('📍 Usando URL de produção configurada:', config.webhook_url_prod);
      return config.webhook_url_prod;
    }

    console.log('📍 URL de produção não configurada, usando fallback');
    return WEBHOOK_URL_FALLBACK;
  } catch (error) {
    console.error('Erro ao buscar URL do webhook:', error);
    return WEBHOOK_URL_FALLBACK;
  }
}

interface CadastroInsert {
  nome_responsavel: string;
  nome_empresa: string;
  segmento_produto_servico: string;
  cpf_cnpj: string;
  email_principal: string;
  fone_whatsapp: string;
  servicos_contratados: string[];
  modelo_contratacao: string;
  valor_setup: number | null;
  valor_mensalidade: number | null;
  valor_unico: number | null;
  forma_pagamento: string[];
  lembrete_pagamento: boolean | null;
  funcao_principal: string[];
  perguntas_comuns: string;
  tom_comunicacao: string;
  telefone_contato: string;
  formas_pagamento_aceitas: string;
  endereco_empresa: string;
  instagram_empresa: string;
  site_empresa: string;
  topicos_nao_abordar: string;
  informacoes_produtos_servicos: string;
  arquivos_upload: { name: string; size: number; type: string }[];
  status: string;
  origem: string;
}

export async function salvarCadastroNoSupabase(formData: FormData): Promise<{ id: string }> {
  console.log('💾 [salvarCadastroNoSupabase] Iniciando...');
  console.log('📋 FormData recebido:', formData);

  const cadastro: CadastroInsert = {
    nome_responsavel: formData.responsibleName,
    nome_empresa: formData.companyName,
    segmento_produto_servico: formData.segment,
    cpf_cnpj: formData.cpfCnpj,
    email_principal: formData.email,
    fone_whatsapp: formData.phone,
    servicos_contratados: formData.services,
    modelo_contratacao: formData.contractModel,
    valor_setup: formData.contractModel === 'monthly' ? parseCurrency(formData.setupValue) : null,
    valor_mensalidade: formData.contractModel === 'monthly' ? parseCurrency(formData.monthlyValue) : null,
    valor_unico: formData.contractModel === 'single' ? parseCurrency(formData.singleValue) : null,
    forma_pagamento: formData.paymentMethods,
    lembrete_pagamento: formData.recurringReminder,
    funcao_principal: formData.mainFunctions,
    perguntas_comuns: formData.top5Questions,
    tom_comunicacao: formData.communicationTone,
    telefone_contato: formData.contactPhones,
    formas_pagamento_aceitas: formData.paymentMethodsAccepted,
    endereco_empresa: formData.address,
    instagram_empresa: formData.instagram,
    site_empresa: formData.website,
    topicos_nao_abordar: formData.restrictedTopics,
    informacoes_produtos_servicos: formData.additionalInfo,
    arquivos_upload: formData.uploadedFiles.map(f => ({
      name: f.name,
      size: f.size,
      type: f.type
    })),
    status: 'novo',
    origem: 'formulario_cadastro',
  };

  console.log('📦 Objeto cadastro preparado:', cadastro);
  console.log('🔄 Tentando INSERT no Supabase...');

  const { data, error } = await supabase
    .from('cadastros_clientes')
    .insert([cadastro])
    .select('id')
    .single();

  if (error) {
    console.error('❌ ERRO DO SUPABASE:');
    console.error('  Código:', error.code);
    console.error('  Mensagem:', error.message);
    console.error('  Detalhes:', error.details);
    console.error('  Hint:', error.hint);
    console.error('  Erro completo:', JSON.stringify(error, null, 2));
    throw error;
  }

  console.log('✅ Cadastro salvo com sucesso! ID:', data.id);
  return { id: data.id };
}

export async function enviarParaWebhookN8n(formData: FormData, cadastroId?: string): Promise<boolean> {
  try {
    // Buscar URL de produção das configurações
    const webhookUrl = await getWebhookUrlProd();
    
    if (!webhookUrl) {
      console.warn('⚠️ URL de webhook de produção não configurada');
      return false;
    }

    const payload = {
      evento: 'cadastro_novo_finalizado',
      id: cadastroId,
      company: {
        responsibleName: formData.responsibleName,
        companyName: formData.companyName,
        segment: formData.segment,
        cpfCnpj: formData.cpfCnpj,
        email: formData.email,
        phone: formData.phone,
      },
      agreement: {
        services: formData.services,
        contractModel: formData.contractModel,
        setupValue: formData.contractModel === 'monthly' ? parseCurrency(formData.setupValue) : null,
        monthlyValue: formData.contractModel === 'monthly' ? parseCurrency(formData.monthlyValue) : null,
        singleValue: formData.contractModel === 'single' ? parseCurrency(formData.singleValue) : null,
        paymentMethods: formData.paymentMethods,
        recurringReminder: formData.recurringReminder,
      },
      assistant: {
        mainFunctions: formData.mainFunctions,
        top5Questions: formData.top5Questions,
        communicationTone: formData.communicationTone,
      },
      digital: {
        contactPhones: formData.contactPhones,
        paymentMethodsAccepted: formData.paymentMethodsAccepted,
        address: formData.address,
        instagram: formData.instagram,
        website: formData.website,
        restrictedTopics: formData.restrictedTopics,
      },
      materials: {
        additionalInfo: formData.additionalInfo,
        uploadedFiles: formData.uploadedFiles.map(f => ({
          name: f.name,
          size: f.size,
          type: f.type
        })),
      },
      metadata: {
        timestamp: new Date().toISOString(),
        source: 'onboarding_quiz',
        status: 'novo',
      },
    };

    console.log('📤 Enviando para webhook n8n (PRODUÇÃO):', webhookUrl);
    
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Webhook error: ${response.status}`);
    }

    console.log('✅ Webhook enviado com sucesso');

    // Atualizar status no banco
    if (cadastroId) {
      await supabase
        .from('cadastros_clientes')
        .update({
          webhook_enviado: true,
          webhook_data: new Date().toISOString(),
        })
        .eq('id', cadastroId);
    }

    return true;
  } catch (error) {
    console.error('❌ Erro ao enviar webhook:', error);
    return false;
  }
}

export async function finalizarCadastro(formData: FormData): Promise<{ success: boolean }> {
  console.log('🚀 [finalizarCadastro] INICIANDO CADASTRO...');
  console.log('📋 Dados do formulário recebidos:', formData);

  // Validação básica
  if (!formData.responsibleName || !formData.companyName || !formData.email || !formData.phone) {
    console.error('❌ Campos obrigatórios faltando!');
    console.error('  responsibleName:', formData.responsibleName);
    console.error('  companyName:', formData.companyName);
    console.error('  email:', formData.email);
    console.error('  phone:', formData.phone);
    throw new Error('Campos obrigatórios não preenchidos');
  }

  console.log('✅ Validação inicial OK');

  // 1. Salvar no banco
  console.log('💾 Etapa 1: Salvando no banco de dados...');
  let cadastroId: string;
  
  try {
    const result = await salvarCadastroNoSupabase(formData);
    cadastroId = result.id;
    console.log('✅ Etapa 1 concluída! ID do cadastro:', cadastroId);
  } catch (dbError) {
    console.error('❌ Etapa 1 FALHOU - Erro ao salvar no banco:');
    console.error('  Tipo:', (dbError as Error).name);
    console.error('  Mensagem:', (dbError as Error).message);
    throw dbError;
  }
  
  // 2. Enviar para n8n (não quebra o fluxo se falhar)
  console.log('📡 Etapa 2: Enviando para webhook n8n...');
  try {
    await enviarParaWebhookN8n(formData, cadastroId);
    console.log('✅ Etapa 2 concluída! Webhook enviado.');
  } catch (webhookError) {
    console.warn('⚠️ Etapa 2 falhou (webhook), mas cadastro foi salvo:', webhookError);
    // Não re-lançar o erro - o cadastro já foi salvo
  }
  
  console.log('🎉 CADASTRO FINALIZADO COM SUCESSO!');
  return { success: true };
}
