import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  TrendingUp, 
  DollarSign, 
  Clock,
  CheckCircle,
  AlertCircle,
  LogOut,
  Eye,
  Trash2,
  RefreshCw,
  Zap
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
} from '@/components/ui/dialog';
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
}

interface Stats {
  total: number;
  novos: number;
  emAndamento: number;
  ativos: number;
  ticketMedio: number;
  totalRecorrente: number;
}

const statusColors: Record<string, string> = {
  novo: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  em_analise: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  em_configuracao: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  lancamento: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  ativo: 'bg-green-500/20 text-green-400 border-green-500/30',
};

const statusLabels: Record<string, string> = {
  novo: 'Novo',
  em_analise: 'Em Análise',
  em_configuracao: 'Em Configuração',
  lancamento: 'Lançamento',
  ativo: 'Ativo',
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
    ativos: 0,
    ticketMedio: 0,
    totalRecorrente: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCadastro, setSelectedCadastro] = useState<Cadastro | null>(null);

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

      const cadastrosData = (data || []) as Cadastro[];
      setCadastros(cadastrosData);
      calculateStats(cadastrosData);
    } catch (error: any) {
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
    const ativos = data.filter(c => c.status === 'ativo').length;
    
    const valoresValidos = data
      .filter(c => c.valor_acordado)
      .map(c => Number(c.valor_acordado));
    const ticketMedio = valoresValidos.length > 0 
      ? valoresValidos.reduce((a, b) => a + b, 0) / valoresValidos.length 
      : 0;
    
    const recorrentes = data
      .filter(c => c.modelo_contratacao === 'monthly' && c.status === 'ativo')
      .reduce((sum, c) => sum + (Number(c.valor_acordado) || 0), 0);

    setStats({
      total: data.length,
      novos,
      emAndamento,
      ativos,
      ticketMedio,
      totalRecorrente: recorrentes
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
              className="border-white/10 text-white hover:bg-white/5"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Atualizar
            </Button>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="border-red-500/30 text-red-400 hover:bg-red-500/10"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>

        {/* Cards de Métricas */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <MetricCard
            icon={Users}
            label="Total de Cadastros"
            value={stats.total}
            color="text-white"
          />
          <MetricCard
            icon={AlertCircle}
            label="Novos"
            value={stats.novos}
            color="text-blue-400"
          />
          <MetricCard
            icon={Clock}
            label="Em Andamento"
            value={stats.emAndamento}
            color="text-yellow-400"
          />
          <MetricCard
            icon={CheckCircle}
            label="Ativos"
            value={stats.ativos}
            color="text-green-400"
          />
          <MetricCard
            icon={DollarSign}
            label="Ticket Médio"
            value={`R$ ${stats.ticketMedio.toFixed(0)}`}
            color="text-[#00FF94]"
          />
          <MetricCard
            icon={TrendingUp}
            label="MRR"
            value={`R$ ${stats.totalRecorrente.toFixed(0)}`}
            color="text-[#00FF94]"
          />
        </div>

        {/* Lista de Cadastros */}
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
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
              {cadastros.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-gray-500 py-12">
                    Nenhum cadastro encontrado
                  </TableCell>
                </TableRow>
              ) : (
                cadastros.map((cadastro) => (
                  <TableRow key={cadastro.id} className="border-white/10 hover:bg-white/5">
                    <TableCell className="font-medium">{cadastro.nome_empresa}</TableCell>
                    <TableCell className="text-gray-400">{cadastro.nome_responsavel}</TableCell>
                    <TableCell className="text-gray-400">
                      <div className="text-sm">{cadastro.email_principal}</div>
                      <div className="text-xs text-gray-500">{cadastro.fone_whatsapp}</div>
                    </TableCell>
                    <TableCell className="text-[#00FF94]">
                      {cadastro.valor_acordado 
                        ? `R$ ${Number(cadastro.valor_acordado).toLocaleString('pt-BR')}`
                        : '-'
                      }
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={statusColors[cadastro.status] || 'bg-gray-500/20 text-gray-400'}
                      >
                        {statusLabels[cadastro.status] || cadastro.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {cadastro.webhook_enviado ? (
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-yellow-400" />
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setSelectedCadastro(cadastro)}
                          className="text-gray-400 hover:text-white hover:bg-white/10"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(cadastro.id)}
                          className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Modal de Detalhes */}
      <Dialog open={!!selectedCadastro} onOpenChange={() => setSelectedCadastro(null)}>
        <DialogContent className="bg-zinc-900 border-white/10 text-white max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">{selectedCadastro?.nome_empresa}</DialogTitle>
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
                  value={selectedCadastro.modelo_contratacao === 'monthly' ? 'Mensal' : 'Único'} 
                />
              </div>
              
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Alterar Status</label>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(statusLabels).map(([key, label]) => (
                    <Button
                      key={key}
                      size="sm"
                      variant={selectedCadastro.status === key ? 'default' : 'outline'}
                      className={selectedCadastro.status === key 
                        ? 'bg-[#00FF94] text-black' 
                        : 'border-white/10 text-gray-300'
                      }
                      onClick={() => {
                        handleStatusChange(selectedCadastro.id, key);
                        setSelectedCadastro({ ...selectedCadastro, status: key });
                      }}
                    >
                      {label}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="text-sm text-gray-500">
                Cadastrado em: {new Date(selectedCadastro.created_at).toLocaleString('pt-BR')}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function MetricCard({ icon: Icon, label, value, color }: {
  icon: any;
  label: string;
  value: string | number;
  color: string;
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
