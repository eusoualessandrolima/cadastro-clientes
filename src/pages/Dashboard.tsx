import { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Clock,
  CheckCircle2,
  AlertCircle,
  LogOut,
  Eye,
  Trash2,
  RefreshCw,
  Zap,
  Search,
  Filter,
  X,
  CheckCircle,
  Building2,
  Phone,
  Mail,
  Plus,
  Edit,
  Save
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useRequireAuth, useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface Cadastro {
  id: string;
  created_at: string;
  nome_responsavel: string;
  nome_empresa: string;
  email_principal: string;
  fone_whatsapp: string;
  segmento_produto_servico: string | null;
  servicos_contratados: string[] | null;
  modelo_contratacao: string | null;
  valor_acordado: number | null;
  status: string;
  webhook_enviado: boolean;
  cpf_cnpj?: string | null;
  telefone_contato?: string | null;
  endereco_empresa?: string | null;
  instagram_empresa?: string | null;
  site_empresa?: string | null;
}

interface Stats {
  total: number;
  novos: number;
  emAndamento: number;
  concluidos: number;
}

interface EditFormData {
  nome_responsavel: string;
  nome_empresa: string;
  segmento_produto_servico: string;
  email_principal: string;
  fone_whatsapp: string;
  valor_acordado: string;
  modelo_contratacao: string;
  status: string;
  cpf_cnpj: string;
  telefone_contato: string;
  endereco_empresa: string;
  instagram_empresa: string;
  site_empresa: string;
}

const statusColors: Record<string, string> = {
  novo: 'bg-blue-500/20 text-blue-400 border-blue-500/40',
  em_analise: 'bg-purple-500/20 text-purple-400 border-purple-500/40',
  em_configuracao: 'bg-orange-500/20 text-orange-400 border-orange-500/40',
  lancamento: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40',
  ativo: 'bg-[#00FF94]/20 text-[#00FF94] border-[#00FF94]/40',
};

const statusLabels: Record<string, string> = {
  novo: 'Novo',
  em_analise: 'Em Análise',
  em_configuracao: 'Em Configuração',
  lancamento: 'Lançamento',
  ativo: 'Concluído',
};

export default function Dashboard() {
  const { loading } = useRequireAuth();
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [cadastros, setCadastros] = useState<Cadastro[]>([]);
  const [stats, setStats] = useState<Stats>({
    total: 0,
    novos: 0,
    emAndamento: 0,
    concluidos: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCadastro, setSelectedCadastro] = useState<Cadastro | null>(null);
  
  // Estado do modal de edição
  const [editingCadastro, setEditingCadastro] = useState<Cadastro | null>(null);
  const [editFormData, setEditFormData] = useState<EditFormData>({
    nome_responsavel: '',
    nome_empresa: '',
    segmento_produto_servico: '',
    email_principal: '',
    fone_whatsapp: '',
    valor_acordado: '',
    modelo_contratacao: '',
    status: 'novo',
    cpf_cnpj: '',
    telefone_contato: '',
    endereco_empresa: '',
    instagram_empresa: '',
    site_empresa: '',
  });
  const [isSaving, setIsSaving] = useState(false);
  
  // Filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [webhookFilter, setWebhookFilter] = useState<string>('all');

  // Dados filtrados
  const filteredCadastros = useMemo(() => {
    return cadastros.filter((cadastro) => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = searchTerm === '' || 
        cadastro.nome_empresa.toLowerCase().includes(searchLower) ||
        cadastro.nome_responsavel.toLowerCase().includes(searchLower) ||
        cadastro.email_principal.toLowerCase().includes(searchLower) ||
        cadastro.fone_whatsapp.includes(searchTerm);
      
      const matchesStatus = statusFilter === 'all' || cadastro.status === statusFilter;
      
      const matchesWebhook = webhookFilter === 'all' || 
        (webhookFilter === 'sent' && cadastro.webhook_enviado) ||
        (webhookFilter === 'pending' && !cadastro.webhook_enviado);
      
      return matchesSearch && matchesStatus && matchesWebhook;
    });
  }, [cadastros, searchTerm, statusFilter, webhookFilter]);

  const hasActiveFilters = searchTerm !== '' || statusFilter !== 'all' || webhookFilter !== 'all';

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setWebhookFilter('all');
  };

  useEffect(() => {
    if (!loading) {
      fetchData();
    }
  }, [loading]);

  async function fetchData() {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('cadastros_clientes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      console.log('=== DADOS CARREGADOS ===', data);
      const cadastrosData = (data || []) as Cadastro[];
      setCadastros(cadastrosData);
      calculateStats(cadastrosData);
    } catch (error: any) {
      console.error('Erro ao carregar dados:', error);
      toast.error('Erro ao carregar dados: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  }

  function calculateStats(data: Cadastro[]) {
    const novos = data.filter(c => c.status === 'novo').length;
    const emAndamento = data.filter(c => 
      ['em_analise', 'em_configuracao', 'lancamento'].includes(c.status)
    ).length;
    const concluidos = data.filter(c => c.status === 'ativo').length;

    setStats({
      total: data.length,
      novos,
      emAndamento,
      concluidos
    });
  }

  async function handleStatusChange(id: string, newStatus: string) {
    try {
      const { error } = await supabase
        .from('cadastros_clientes')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;
      
      toast.success('Status atualizado!');
      fetchData();
    } catch (error: any) {
      toast.error('Erro ao atualizar: ' + error.message);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Tem certeza que deseja excluir este cadastro?')) return;
    
    try {
      const { error } = await supabase
        .from('cadastros_clientes')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast.success('Cadastro excluído!');
      fetchData();
    } catch (error: any) {
      toast.error('Erro ao excluir: ' + error.message);
    }
  }

  function openEditModal(cadastro: Cadastro) {
    setEditingCadastro(cadastro);
    setEditFormData({
      nome_responsavel: cadastro.nome_responsavel || '',
      nome_empresa: cadastro.nome_empresa || '',
      segmento_produto_servico: cadastro.segmento_produto_servico || '',
      email_principal: cadastro.email_principal || '',
      fone_whatsapp: cadastro.fone_whatsapp || '',
      valor_acordado: cadastro.valor_acordado?.toString() || '',
      modelo_contratacao: cadastro.modelo_contratacao || 'monthly',
      status: cadastro.status || 'novo',
      cpf_cnpj: cadastro.cpf_cnpj || '',
      telefone_contato: cadastro.telefone_contato || '',
      endereco_empresa: cadastro.endereco_empresa || '',
      instagram_empresa: cadastro.instagram_empresa || '',
      site_empresa: cadastro.site_empresa || '',
    });
  }

  async function handleSaveEdit() {
    if (!editingCadastro) return;
    
    setIsSaving(true);
    try {
      const updateData = {
        nome_responsavel: editFormData.nome_responsavel,
        nome_empresa: editFormData.nome_empresa,
        segmento_produto_servico: editFormData.segmento_produto_servico || null,
        email_principal: editFormData.email_principal,
        fone_whatsapp: editFormData.fone_whatsapp,
        valor_acordado: editFormData.valor_acordado ? parseFloat(editFormData.valor_acordado) : null,
        modelo_contratacao: editFormData.modelo_contratacao || null,
        status: editFormData.status,
        cpf_cnpj: editFormData.cpf_cnpj || null,
        telefone_contato: editFormData.telefone_contato || null,
        endereco_empresa: editFormData.endereco_empresa || null,
        instagram_empresa: editFormData.instagram_empresa || null,
        site_empresa: editFormData.site_empresa || null,
      };

      console.log('=== SALVANDO EDIÇÃO ===', updateData);

      const { error } = await supabase
        .from('cadastros_clientes')
        .update(updateData)
        .eq('id', editingCadastro.id);

      if (error) throw error;

      toast.success('Cadastro atualizado com sucesso!');
      setEditingCadastro(null);
      fetchData();
    } catch (error: any) {
      console.error('Erro ao salvar edição:', error);
      toast.error('Erro ao atualizar cadastro: ' + error.message);
    } finally {
      setIsSaving(false);
    }
  }

  async function handleLogout() {
    await signOut();
    navigate('/login');
  }

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <RefreshCw className="w-8 h-8 animate-spin text-[#00FF94]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gradient-to-br from-[#00FF94] to-[#00CC75] rounded-xl flex items-center justify-center">
              <Zap className="w-5 h-5 text-black" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Dashboard de Cadastros</h1>
              <p className="text-gray-400 text-sm">Visão geral dos clientes cadastrados</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={fetchData}
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10 bg-white/5"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Atualizar
            </Button>
            <Button
              onClick={handleLogout}
              className="bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-400 hover:text-red-300"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>

        {/* Cards de Métricas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <MetricCard
            icon={Users}
            label="Total de Cadastros"
            value={stats.total}
            color="text-white"
            subtitle="+0 últimos 7 dias"
          />
          <MetricCard
            icon={AlertCircle}
            label="Novos"
            value={stats.novos}
            color="text-blue-400"
            subtitle="Aguardando análise"
          />
          <MetricCard
            icon={Clock}
            label="Em Andamento"
            value={stats.emAndamento}
            color="text-yellow-400"
            subtitle="Em configuração"
          />
          <MetricCard
            icon={CheckCircle2}
            label="Concluídos"
            value={stats.concluidos}
            color="text-[#00FF94]"
            subtitle="Implementações finalizadas"
          />
        </div>

        {/* Filtros e Busca */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Buscar por empresa, responsável, email ou telefone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-black/50 border-white/10 text-white placeholder:text-gray-500 focus:border-[#00FF94]/50"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[160px] bg-[#1a1a1a] border-white/20 text-white">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="bg-[#1a1a1a] border-white/20 z-50">
                  <SelectItem value="all" className="text-white hover:bg-white/10 focus:bg-white/10 focus:text-white">Todos os status</SelectItem>
                  {Object.entries(statusLabels).map(([key, label]) => (
                    <SelectItem key={key} value={key} className="text-white hover:bg-white/10 focus:bg-white/10 focus:text-white">
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Select value={webhookFilter} onValueChange={setWebhookFilter}>
              <SelectTrigger className="w-[160px] bg-[#1a1a1a] border-white/20 text-white">
                <SelectValue placeholder="Webhook" />
              </SelectTrigger>
              <SelectContent className="bg-[#1a1a1a] border-white/20 z-50">
                <SelectItem value="all" className="text-white hover:bg-white/10 focus:bg-white/10 focus:text-white">Todos</SelectItem>
                <SelectItem value="sent" className="text-white hover:bg-white/10 focus:bg-white/10 focus:text-white">Enviados</SelectItem>
                <SelectItem value="pending" className="text-white hover:bg-white/10 focus:bg-white/10 focus:text-white">Pendentes</SelectItem>
              </SelectContent>
            </Select>

            {hasActiveFilters && (
              <Button
                variant="ghost"
                onClick={clearFilters}
                className="text-gray-400 hover:text-white hover:bg-white/10"
              >
                <X className="w-4 h-4 mr-2" />
                Limpar
              </Button>
            )}
          </div>

          {hasActiveFilters && (
            <div className="mt-3 text-sm text-gray-400">
              Mostrando {filteredCadastros.length} de {cadastros.length} cadastros
            </div>
          )}
        </div>

        {/* Lista de Cadastros */}
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
          {filteredCadastros.length === 0 ? (
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/5 mb-6">
                <Users className="w-10 h-10 text-gray-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-400 mb-2">
                {hasActiveFilters 
                  ? 'Nenhum cadastro encontrado com os filtros aplicados'
                  : 'Nenhum cadastro encontrado'
                }
              </h3>
              <p className="text-gray-600 mb-6">
                {hasActiveFilters 
                  ? 'Tente ajustar os filtros de busca'
                  : 'Os cadastros aparecerão aqui quando forem preenchidos'
                }
              </p>
              {!hasActiveFilters && (
                <button
                  onClick={() => window.open('/', '_blank')}
                  className="px-6 py-3 bg-[#00FF94] hover:bg-[#00FF94]/90 text-black font-semibold rounded-lg transition-all inline-flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Abrir Formulário de Cadastro
                </button>
              )}
              {hasActiveFilters && (
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  <X className="w-4 h-4 mr-2" />
                  Limpar Filtros
                </Button>
              )}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-white/10 hover:bg-white/5">
                  <TableHead className="text-gray-400">Empresa</TableHead>
                  <TableHead className="text-gray-400">Responsável</TableHead>
                  <TableHead className="text-gray-400">Contato</TableHead>
                  <TableHead className="text-gray-400">Valor</TableHead>
                  <TableHead className="text-gray-400">Status</TableHead>
                  <TableHead className="text-gray-400">Webhook</TableHead>
                  <TableHead className="text-gray-400 text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCadastros.map((cadastro) => (
                  <TableRow key={cadastro.id} className="border-white/10 hover:bg-white/5 transition-colors">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#00FF94]/10 flex items-center justify-center flex-shrink-0">
                          <Building2 className="w-5 h-5 text-[#00FF94]" />
                        </div>
                        <div>
                          <p className="text-white font-medium">{cadastro.nome_empresa}</p>
                          <p className="text-xs text-gray-500">{cadastro.segmento_produto_servico || '-'}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-300">{cadastro.nome_responsavel}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="text-sm text-gray-400 flex items-center gap-2">
                          <Phone className="w-3 h-3" />
                          {cadastro.fone_whatsapp}
                        </p>
                        <p className="text-sm text-gray-400 flex items-center gap-2">
                          <Mail className="w-3 h-3" />
                          {cadastro.email_principal}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="text-[#00FF94] font-semibold">
                        {cadastro.valor_acordado 
                          ? `R$ ${Number(cadastro.valor_acordado).toLocaleString('pt-BR')}`
                          : '-'
                        }
                      </p>
                      <p className="text-xs text-gray-500">
                        {cadastro.modelo_contratacao === 'monthly' ? 'Mensal' : cadastro.modelo_contratacao === 'unique' ? 'Único' : cadastro.modelo_contratacao === 'single' ? 'Único' : '-'}
                      </p>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={statusColors[cadastro.status] || 'bg-gray-500/20 text-gray-400 border-gray-500/40'}
                      >
                        {statusLabels[cadastro.status] || cadastro.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {cadastro.webhook_enviado ? (
                        <span className="inline-flex items-center gap-1.5 text-xs text-green-400">
                          <CheckCircle className="w-4 h-4" />
                          Enviado
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-xs text-gray-500">
                          <Clock className="w-4 h-4" />
                          Pendente
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {/* Ver Detalhes */}
                        <button
                          onClick={() => setSelectedCadastro(cadastro)}
                          className="p-2.5 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/40 rounded-lg transition-all group"
                          title="Ver detalhes"
                        >
                          <Eye className="w-4 h-4 text-blue-400 group-hover:text-blue-300" />
                        </button>
                        
                        {/* Editar */}
                        <button
                          onClick={() => openEditModal(cadastro)}
                          className="p-2.5 bg-[#00FF94]/20 hover:bg-[#00FF94]/30 border border-[#00FF94]/40 rounded-lg transition-all group"
                          title="Editar"
                        >
                          <Edit className="w-4 h-4 text-[#00FF94] group-hover:text-[#00FF94]/80" />
                        </button>
                        
                        {/* Excluir */}
                        <button
                          onClick={() => handleDelete(cadastro.id)}
                          className="p-2.5 bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 rounded-lg transition-all group"
                          title="Excluir"
                        >
                          <Trash2 className="w-4 h-4 text-red-400 group-hover:text-red-300" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>

      {/* Modal de Detalhes */}
      <Dialog open={!!selectedCadastro} onOpenChange={() => setSelectedCadastro(null)}>
        <DialogContent className="bg-zinc-900 border-white/10 text-white max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">{selectedCadastro?.nome_empresa}</DialogTitle>
            <DialogDescription className="text-gray-400">
              Detalhes completos do cadastro
            </DialogDescription>
          </DialogHeader>
          {selectedCadastro && (
            <div className="space-y-6 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <InfoItem label="Responsável" value={selectedCadastro.nome_responsavel} />
                <InfoItem label="Email" value={selectedCadastro.email_principal} />
                <InfoItem label="WhatsApp" value={selectedCadastro.fone_whatsapp} />
                <InfoItem label="Segmento" value={selectedCadastro.segmento_produto_servico || '-'} />
                <InfoItem 
                  label="Valor Acordado" 
                  value={selectedCadastro.valor_acordado 
                    ? `R$ ${Number(selectedCadastro.valor_acordado).toLocaleString('pt-BR')}`
                    : '-'
                  } 
                />
                <InfoItem 
                  label="Modelo" 
                  value={selectedCadastro.modelo_contratacao === 'monthly' ? 'Mensal' : selectedCadastro.modelo_contratacao === 'single' ? 'Único' : selectedCadastro.modelo_contratacao || '-'} 
                />
              </div>
              
              <div>
                <label className="text-sm text-gray-400 mb-3 block">Alterar Status</label>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(statusLabels).map(([key, label]) => {
                    const isActive = selectedCadastro.status === key;
                    const colorClasses = statusColors[key] || 'bg-gray-500/20 text-gray-400 border-gray-500/40';
                    
                    return (
                      <button
                        key={key}
                        className={`px-4 py-2 rounded-lg font-medium transition-all border ${
                          isActive 
                            ? colorClasses + ' ring-2 ring-offset-2 ring-offset-zinc-900' 
                            : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white'
                        }`}
                        onClick={() => {
                          handleStatusChange(selectedCadastro.id, key);
                          setSelectedCadastro({ ...selectedCadastro, status: key });
                        }}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="text-sm text-gray-500">
                Cadastrado em: {new Date(selectedCadastro.created_at).toLocaleString('pt-BR')}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal de Edição */}
      <Dialog open={!!editingCadastro} onOpenChange={() => setEditingCadastro(null)}>
        <DialogContent className="bg-[#1a1a1a] border-[#00FF94]/20 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-white">Editar Cadastro</DialogTitle>
            <DialogDescription className="text-gray-400">
              Altere os dados do cadastro abaixo
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-5 mt-4">
            {/* Nome Responsável */}
            <div>
              <label className="text-sm text-gray-400 block mb-2">
                Nome do Responsável *
              </label>
              <input
                type="text"
                value={editFormData.nome_responsavel}
                onChange={(e) => setEditFormData({...editFormData, nome_responsavel: e.target.value})}
                className="w-full px-4 py-3 bg-black border border-white/10 rounded-lg text-white focus:border-[#00FF94]/50 focus:outline-none transition-colors"
                placeholder="Nome completo"
              />
            </div>

            {/* Nome Empresa */}
            <div>
              <label className="text-sm text-gray-400 block mb-2">
                Nome da Empresa *
              </label>
              <input
                type="text"
                value={editFormData.nome_empresa}
                onChange={(e) => setEditFormData({...editFormData, nome_empresa: e.target.value})}
                className="w-full px-4 py-3 bg-black border border-white/10 rounded-lg text-white focus:border-[#00FF94]/50 focus:outline-none transition-colors"
                placeholder="Nome da empresa"
              />
            </div>

            {/* Grid 2 colunas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Segmento */}
              <div>
                <label className="text-sm text-gray-400 block mb-2">
                  Segmento
                </label>
                <input
                  type="text"
                  value={editFormData.segmento_produto_servico}
                  onChange={(e) => setEditFormData({...editFormData, segmento_produto_servico: e.target.value})}
                  className="w-full px-4 py-3 bg-black border border-white/10 rounded-lg text-white focus:border-[#00FF94]/50 focus:outline-none transition-colors"
                  placeholder="Ex: Tecnologia, Saúde..."
                />
              </div>

              {/* CPF/CNPJ */}
              <div>
                <label className="text-sm text-gray-400 block mb-2">
                  CPF/CNPJ
                </label>
                <input
                  type="text"
                  value={editFormData.cpf_cnpj}
                  onChange={(e) => setEditFormData({...editFormData, cpf_cnpj: e.target.value})}
                  className="w-full px-4 py-3 bg-black border border-white/10 rounded-lg text-white focus:border-[#00FF94]/50 focus:outline-none transition-colors"
                  placeholder="000.000.000-00"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="text-sm text-gray-400 block mb-2">
                Email *
              </label>
              <input
                type="email"
                value={editFormData.email_principal}
                onChange={(e) => setEditFormData({...editFormData, email_principal: e.target.value})}
                className="w-full px-4 py-3 bg-black border border-white/10 rounded-lg text-white focus:border-[#00FF94]/50 focus:outline-none transition-colors"
                placeholder="email@empresa.com"
              />
            </div>

            {/* Grid 2 colunas - Telefones */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* WhatsApp */}
              <div>
                <label className="text-sm text-gray-400 block mb-2">
                  WhatsApp *
                </label>
                <input
                  type="tel"
                  value={editFormData.fone_whatsapp}
                  onChange={(e) => setEditFormData({...editFormData, fone_whatsapp: e.target.value})}
                  className="w-full px-4 py-3 bg-black border border-white/10 rounded-lg text-white focus:border-[#00FF94]/50 focus:outline-none transition-colors"
                  placeholder="(00) 00000-0000"
                />
              </div>

              {/* Telefone Contato */}
              <div>
                <label className="text-sm text-gray-400 block mb-2">
                  Telefone Contato
                </label>
                <input
                  type="tel"
                  value={editFormData.telefone_contato}
                  onChange={(e) => setEditFormData({...editFormData, telefone_contato: e.target.value})}
                  className="w-full px-4 py-3 bg-black border border-white/10 rounded-lg text-white focus:border-[#00FF94]/50 focus:outline-none transition-colors"
                  placeholder="(00) 0000-0000"
                />
              </div>
            </div>

            {/* Grid 2 colunas - Valor e Modelo */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Valor */}
              <div>
                <label className="text-sm text-gray-400 block mb-2">
                  Valor Acordado
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={editFormData.valor_acordado}
                  onChange={(e) => setEditFormData({...editFormData, valor_acordado: e.target.value})}
                  className="w-full px-4 py-3 bg-black border border-white/10 rounded-lg text-white focus:border-[#00FF94]/50 focus:outline-none transition-colors"
                  placeholder="0.00"
                />
              </div>

              {/* Modelo */}
              <div>
                <label className="text-sm text-gray-400 block mb-2">
                  Modelo de Contratação
                </label>
                <select
                  value={editFormData.modelo_contratacao}
                  onChange={(e) => setEditFormData({...editFormData, modelo_contratacao: e.target.value})}
                  className="w-full px-4 py-3 bg-black border border-white/10 rounded-lg text-white focus:border-[#00FF94]/50 focus:outline-none transition-colors"
                >
                  <option value="monthly">Mensal</option>
                  <option value="single">Único</option>
                  <option value="unique">Único</option>
                </select>
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="text-sm text-gray-400 block mb-2">
                Status
              </label>
              <select
                value={editFormData.status}
                onChange={(e) => setEditFormData({...editFormData, status: e.target.value})}
                className="w-full px-4 py-3 bg-black border border-white/10 rounded-lg text-white focus:border-[#00FF94]/50 focus:outline-none transition-colors"
              >
                <option value="novo">Novo</option>
                <option value="em_analise">Em Análise</option>
                <option value="em_configuracao">Em Configuração</option>
                <option value="lancamento">Lançamento</option>
                <option value="ativo">Concluído</option>
              </select>
            </div>

            {/* Endereço */}
            <div>
              <label className="text-sm text-gray-400 block mb-2">
                Endereço da Empresa
              </label>
              <input
                type="text"
                value={editFormData.endereco_empresa}
                onChange={(e) => setEditFormData({...editFormData, endereco_empresa: e.target.value})}
                className="w-full px-4 py-3 bg-black border border-white/10 rounded-lg text-white focus:border-[#00FF94]/50 focus:outline-none transition-colors"
                placeholder="Rua, número, cidade..."
              />
            </div>

            {/* Grid 2 colunas - Redes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Instagram */}
              <div>
                <label className="text-sm text-gray-400 block mb-2">
                  Instagram
                </label>
                <input
                  type="text"
                  value={editFormData.instagram_empresa}
                  onChange={(e) => setEditFormData({...editFormData, instagram_empresa: e.target.value})}
                  className="w-full px-4 py-3 bg-black border border-white/10 rounded-lg text-white focus:border-[#00FF94]/50 focus:outline-none transition-colors"
                  placeholder="@empresa"
                />
              </div>

              {/* Site */}
              <div>
                <label className="text-sm text-gray-400 block mb-2">
                  Site
                </label>
                <input
                  type="url"
                  value={editFormData.site_empresa}
                  onChange={(e) => setEditFormData({...editFormData, site_empresa: e.target.value})}
                  className="w-full px-4 py-3 bg-black border border-white/10 rounded-lg text-white focus:border-[#00FF94]/50 focus:outline-none transition-colors"
                  placeholder="https://www.empresa.com"
                />
              </div>
            </div>
          </div>

          {/* Footer com botões */}
          <div className="flex gap-3 mt-6 pt-4 border-t border-white/10">
            <Button
              onClick={() => setEditingCadastro(null)}
              variant="outline"
              className="flex-1 border-white/20 text-white hover:bg-white/10"
              disabled={isSaving}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSaveEdit}
              className="flex-1 bg-[#00FF94] hover:bg-[#00FF94]/90 text-black font-semibold"
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Salvar Alterações
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function MetricCard({ icon: Icon, label, value, color, subtitle }: {
  icon: any;
  label: string;
  value: string | number;
  color: string;
  subtitle?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/5 border border-white/10 rounded-xl p-4"
    >
      <div className="flex items-center gap-3 mb-2">
        <div className={`${color}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <p className="text-xs text-gray-400 mb-1">{label}</p>
      <p className={`text-xl font-bold ${color}`}>{value}</p>
      {subtitle && (
        <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
      )}
    </motion.div>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-gray-400 mb-1">{label}</p>
      <p className="text-white">{value}</p>
    </div>
  );
}
