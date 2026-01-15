import { supabase } from '@/integrations/supabase/client';
import { FormData } from '@/types/quiz';
import { parseCurrency } from '@/utils/validation';

const WEBHOOK_URL = 'https://webhook.companychatautomacoeseia.com/webhook/formcliente';

interface CadastroInsert {
  nome_responsavel: string;
  nome_empresa: string;
  segmento_produto_servico: string;
  cpf_cnpj: string;
  email_principal: string;
  fone_whatsapp: string;
  servicos_contratados: string[];
  modelo_contratacao: string;
  valor_acordado: number;
  forma_pagamento: string[];
  lembrete_pagamento: boolean | null;
  funcao_principal: string[];
  perguntas_comuns: string;
  tom_comunicacao: string;
  solucoes_existentes: string[];
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
  const cadastro: CadastroInsert = {
    nome_responsavel: formData.responsibleName,
    nome_empresa: formData.companyName,
    segmento_produto_servico: formData.segment,
    cpf_cnpj: formData.cpfCnpj,
    email_principal: formData.email,
    fone_whatsapp: formData.phone,
    servicos_contratados: formData.services,
    modelo_contratacao: formData.contractModel,
    valor_acordado: parseCurrency(formData.agreedValue),
    forma_pagamento: formData.paymentMethods,
    lembrete_pagamento: formData.recurringReminder,
    funcao_principal: formData.mainFunctions,
    perguntas_comuns: formData.top5Questions,
    tom_comunicacao: formData.communicationTone,
    solucoes_existentes: formData.existingSolutions,
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

  const { data, error } = await supabase
    .from('cadastros_clientes')
    .insert([cadastro])
    .select('id')
    .single();

  if (error) {
    console.error('Erro ao salvar no banco:', error);
    throw error;
  }

  return { id: data.id };
}

export async function enviarParaWebhookN8n(formData: FormData, cadastroId?: string): Promise<boolean> {
  try {
    const payload = {
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
        agreedValue: parseCurrency(formData.agreedValue),
        paymentMethods: formData.paymentMethods,
        recurringReminder: formData.recurringReminder,
      },
      assistant: {
        mainFunctions: formData.mainFunctions,
        top5Questions: formData.top5Questions,
        communicationTone: formData.communicationTone,
        existingSolutions: formData.existingSolutions,
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

    console.log('📤 Enviando para webhook n8n:', WEBHOOK_URL);
    
    const response = await fetch(WEBHOOK_URL, {
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
  // 1. Salvar no banco
  const { id } = await salvarCadastroNoSupabase(formData);
  
  // 2. Enviar para n8n
  await enviarParaWebhookN8n(formData, id);
  
  return { success: true };
}
