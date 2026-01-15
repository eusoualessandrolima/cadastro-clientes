export interface StatusInfo {
  valor: string;
  label: string;
  cor: string;
  corBg: string;
  corBorda: string;
  corTexto: string;
  icone: string;
  descricao: string;
}

export const STATUS_CADASTRO: Record<string, StatusInfo> = {
  NOVO: {
    valor: 'novo',
    label: 'Novo',
    cor: '#3B82F6',
    corBg: 'bg-blue-500/10',
    corBorda: 'border-blue-500/30',
    corTexto: 'text-blue-400',
    icone: '📋',
    descricao: 'Lead acabou de preencher o formulário'
  },
  EM_NEGOCIACAO: {
    valor: 'em_negociacao',
    label: 'Em Negociação',
    cor: '#F59E0B',
    corBg: 'bg-yellow-500/10',
    corBorda: 'border-yellow-500/30',
    corTexto: 'text-yellow-400',
    icone: '💬',
    descricao: 'Em contato, negociando proposta'
  },
  AGUARDANDO_PAGAMENTO: {
    valor: 'aguardando_pagamento',
    label: 'Aguardando Pagamento',
    cor: '#FB923C',
    corBg: 'bg-orange-500/10',
    corBorda: 'border-orange-500/30',
    corTexto: 'text-orange-400',
    icone: '💰',
    descricao: 'Proposta aceita, aguardando confirmação de pagamento'
  },
  ATIVO: {
    valor: 'ativo',
    label: 'Ativo',
    cor: '#00FF94',
    corBg: 'bg-[#00FF94]/10',
    corBorda: 'border-[#00FF94]/30',
    corTexto: 'text-[#00FF94]',
    icone: '✅',
    descricao: 'Cliente pagou, assistente implementado'
  },
  PAUSADO: {
    valor: 'pausado',
    label: 'Pausado',
    cor: '#A855F7',
    corBg: 'bg-purple-500/10',
    corBorda: 'border-purple-500/30',
    corTexto: 'text-purple-400',
    icone: '⏸️',
    descricao: 'Pausado temporariamente pelo cliente'
  },
  CANCELADO: {
    valor: 'cancelado',
    label: 'Cancelado',
    cor: '#EF4444',
    corBg: 'bg-red-500/10',
    corBorda: 'border-red-500/30',
    corTexto: 'text-red-400',
    icone: '❌',
    descricao: 'Cliente desistiu ou não qualificado'
  }
};

export function getStatusInfo(statusValor: string): StatusInfo {
  return Object.values(STATUS_CADASTRO).find(s => s.valor === statusValor) || STATUS_CADASTRO.NOVO;
}

export function getAllStatuses(): StatusInfo[] {
  return Object.values(STATUS_CADASTRO);
}
