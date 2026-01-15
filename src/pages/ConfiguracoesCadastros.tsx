import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useRequireAuth, useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { 
  Settings, 
  Webhook, 
  MessageSquare, 
  Bell,
  Save,
  Zap,
  LayoutDashboard,
  Users,
  LogOut,
  Loader2,
  Link as LinkIcon,
  Copy
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface ConfigData {
  webhook_url_test: string;
  webhook_url_prod: string;
  webhook_eventos: {
    cadastro_novo: boolean;
    status_alterado: boolean;
    tag_adicionada: boolean;
    cadastro_convertido: boolean;
    proposta_baixada: boolean;
  };
  evolution_url: string;
  evolution_api_key: string;
  evolution_instance: string;
  notificacoes_navegador: boolean;
  email_diario_resumo: boolean;
  alerta_leads_quentes: boolean;
  lembretes_followup: boolean;
}

const defaultConfig: ConfigData = {
  webhook_url_test: '',
  webhook_url_prod: '',
  webhook_eventos: {
    cadastro_novo: true,
    status_alterado: true,
    tag_adicionada: false,
    cadastro_convertido: false,
    proposta_baixada: false
  },
  evolution_url: '',
  evolution_api_key: '',
  evolution_instance: 'default',
  notificacoes_navegador: false,
  email_diario_resumo: false,
  alerta_leads_quentes: false,
  lembretes_followup: false
};

export default function ConfiguracoesCadastros() {
  const { loading } = useRequireAuth();
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [config, setConfig] = useState<ConfigData>(defaultConfig);
  const [salvando, setSalvando] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading) {
      carregarConfiguracoes();
    }
  }, [loading]);

  async function carregarConfiguracoes() {
    setIsLoading(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return;

      const { data, error } = await supabase
        .from('configuracoes_sistema')
        .select('configuracoes')
        .eq('user_id', userData.user.id)
        .maybeSingle();
      
      if (error) throw error;
      
      if (data?.configuracoes) {
        setConfig({ ...defaultConfig, ...(data.configuracoes as unknown as ConfigData) });
      }
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function salvarConfiguracoes() {
    setSalvando(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error('Usuário não autenticado');

      // Check if settings already exist
      const { data: existing } = await supabase
        .from('configuracoes_sistema')
        .select('id')
        .eq('user_id', userData.user.id)
        .maybeSingle();

      const configJson = JSON.parse(JSON.stringify(config));

      if (existing) {
        // Update existing
        const { error } = await supabase
          .from('configuracoes_sistema')
          .update({
            configuracoes: configJson,
          })
          .eq('user_id', userData.user.id);

        if (error) throw error;
      } else {
        // Insert new - use raw SQL approach via RPC or direct insert
        const { error } = await supabase
          .from('configuracoes_sistema')
          .insert([{
            user_id: userData.user.id,
            configuracoes: configJson,
          }]);

        if (error) throw error;
      }

      toast.success('Configurações salvas com sucesso!');
    } catch (error: any) {
      console.error('Erro ao salvar:', error);
      toast.error('Erro ao salvar configurações: ' + error.message);
    } finally {
      setSalvando(false);
    }
  }

  async function testarWebhook() {
    if (!config.webhook_url_test) {
      toast.error('Insira uma URL de webhook de teste');
      return;
    }
    
    const toastId = 'webhook-test';
    toast.loading('Testando conexão...', { id: toastId });
    
    console.log('🔄 Iniciando teste de webhook...');
    console.log('📍 URL (TESTE):', config.webhook_url_test);
    
    try {
      const dadosTeste = {
        evento: 'teste_conexao',
        timestamp: new Date().toISOString(),
        dados: {
          mensagem: 'Teste de conexão do webhook',
          sistema: 'Cadastros - CompanyChat IA'
        }
      };
      
      console.log('📤 Enviando dados:', dadosTeste);
      
      const response = await fetch(config.webhook_url_test, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dadosTeste)
      });

      if (response.ok) {
        const responseText = await response.text();
        console.log('✅ Webhook TESTE respondeu com sucesso:', responseText);
        toast.success('Webhook de teste funcionando!', { 
          id: toastId,
          description: 'Conexão estabelecida com sucesso'
        });
      } else {
        console.error('❌ Webhook TESTE retornou erro:', response.status, response.statusText);
        toast.error('Erro ao testar webhook', { 
          id: toastId,
          description: `Status ${response.status}: ${response.statusText}`
        });
      }
    } catch (error: any) {
      console.error('❌ Erro de conexão com webhook TESTE:', error);
      toast.error('Erro de conexão com webhook', { 
        id: toastId,
        description: error.message 
      });
    }
  }

  async function testarEvolutionAPI() {
    if (!config.evolution_url || !config.evolution_api_key) {
      toast.error('Preencha URL e API Key da Evolution');
      return;
    }
    
    try {
      const response = await fetch(`${config.evolution_url}/instance/connectionState/${config.evolution_instance}`, {
        headers: {
          'apikey': config.evolution_api_key
        }
      });

      if (response.ok) {
        toast.success('Evolution API conectada!');
      } else {
        toast.error('Erro na conexão Evolution API: ' + response.statusText);
      }
    } catch (error: any) {
      toast.error('Erro de conexão com Evolution API: ' + error.message);
    }
  }

  async function handleLogout() {
    await signOut();
    navigate('/login');
  }

  function copiarLinkFormulario() {
    const linkFormulario = `${window.location.origin}/`;
    navigator.clipboard.writeText(linkFormulario);
    toast.success('Link copiado!', {
      description: 'Cole e compartilhe com seus clientes',
    });
  }

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#00FF94]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 min-h-screen bg-[#0a0a0a] border-r border-white/10 p-4 flex flex-col">
          <div className="flex items-center gap-3 mb-8 px-2">
            <div className="w-10 h-10 bg-gradient-to-br from-[#00FF94] to-[#00CC75] rounded-xl flex items-center justify-center">
              <Zap className="w-5 h-5 text-black" />
            </div>
            <span className="font-bold text-lg">Cadastros</span>
          </div>

          <nav className="flex flex-col gap-2 flex-1">
            <Link
              to="/dashboard"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                location.pathname === '/dashboard'
                  ? 'bg-[#00FF94]/10 text-[#00FF94] border border-[#00FF94]/20'
                  : 'text-gray-400 hover:bg-white/5'
              }`}
            >
              <LayoutDashboard className="w-5 h-5" />
              <span className="font-medium">Dashboard</span>
            </Link>

            <Link
              to="/configuracoes-cadastros"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                location.pathname === '/configuracoes-cadastros'
                  ? 'bg-[#00FF94]/10 text-[#00FF94] border border-[#00FF94]/20'
                  : 'text-gray-400 hover:bg-white/5'
              }`}
            >
              <Settings className="w-5 h-5" />
              <span className="font-medium">Configurações</span>
            </Link>
          </nav>

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors mt-auto"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Sair</span>
          </button>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <Settings className="w-8 h-8 text-[#00FF94]" />
              <h1 className="text-3xl font-bold">Configurações</h1>
            </div>
            <p className="text-gray-400">Personalize o funcionamento do dashboard</p>
          </div>

          {/* Cards de Configuração */}
          <div className="grid gap-6 max-w-4xl">

            {/* Link do Formulário */}
            <div className="bg-white/5 border border-[#00FF94]/20 rounded-xl p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-[#00FF94]/20 rounded-xl flex items-center justify-center">
                  <LinkIcon className="w-6 h-6 text-[#00FF94]" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">Link do Formulário</h2>
                  <p className="text-gray-400 text-sm">Compartilhe com seus clientes</p>
                </div>
              </div>

              <div className="space-y-4">
                {/* URL do formulário */}
                <div className="bg-black/50 rounded-lg p-4 border border-[#00FF94]/10">
                  <p className="text-sm text-gray-400 mb-2">URL pública do formulário:</p>
                  <p className="text-[#00FF94] font-mono text-sm break-all">
                    {typeof window !== 'undefined' ? `${window.location.origin}/` : 'https://seudominio.com/'}
                  </p>
                </div>
                
                {/* Botão copiar */}
                <Button
                  onClick={copiarLinkFormulario}
                  className="w-full bg-[#00FF94] hover:bg-[#00FF94]/90 text-black font-semibold"
                >
                  <Copy className="w-5 h-5 mr-2" />
                  Copiar Link do Formulário
                </Button>
                
                {/* Instruções */}
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                  <p className="text-sm text-blue-200">
                    💡 <strong>Como usar:</strong> Copie este link e compartilhe com seus clientes por WhatsApp, 
                    email ou redes sociais. Cada cliente que abrir o link verá um formulário limpo.
                  </p>
                </div>
              </div>
            </div>
            
            {/* n8n Webhook */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                  <Webhook className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">n8n Webhook</h2>
                  <p className="text-gray-400 text-sm">Integração com automações</p>
                </div>
              </div>

              {/* URLs do Webhook */}
              <div className="space-y-4 mb-6">
                <div>
                  <Label className="text-sm text-gray-400 mb-2 block">URL do Webhook (Teste)</Label>
                  <Input
                    type="url"
                    value={config.webhook_url_test}
                    onChange={(e) => setConfig({...config, webhook_url_test: e.target.value})}
                    placeholder="https://webhook.seudominio.com/webhook-test/..."
                    className="bg-black border-white/10 text-white focus:border-purple-500/50"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    🧪 Esta URL é usada apenas para testar a conexão
                  </p>
                </div>

                <div>
                  <Label className="text-sm text-gray-400 mb-2 block">URL do Webhook (Produção)</Label>
                  <Input
                    type="url"
                    value={config.webhook_url_prod}
                    onChange={(e) => setConfig({...config, webhook_url_prod: e.target.value})}
                    placeholder="https://workflow.seudominio.com/webhook/..."
                    className="bg-black border-white/10 text-white focus:border-purple-500/50"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    🚀 Esta URL será usada quando o cadastro for finalizado
                  </p>
                </div>

                {/* Eventos */}
                <div>
                  <Label className="text-sm text-gray-400 mb-3 block">Eventos que disparam webhook:</Label>
                  <div className="space-y-3">
                    {Object.entries({
                      cadastro_novo: 'Cadastro novo capturado',
                      status_alterado: 'Status alterado',
                      tag_adicionada: 'Tag adicionada',
                      cadastro_convertido: 'Cadastro convertido',
                      proposta_baixada: 'Proposta baixada'
                    }).map(([key, label]) => (
                      <label key={key} className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={config.webhook_eventos[key as keyof typeof config.webhook_eventos]}
                          onChange={(e) => setConfig({
                            ...config,
                            webhook_eventos: {
                              ...config.webhook_eventos,
                              [key]: e.target.checked
                            }
                          })}
                          className="w-4 h-4 rounded border-white/20 bg-black text-purple-500 focus:ring-purple-500"
                        />
                        <span className="text-gray-300">{label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <Button
                onClick={testarWebhook}
                variant="outline"
                className="border-purple-500/40 text-purple-400 hover:bg-purple-500/20"
              >
                Testar Conexão
              </Button>
            </div>

            {/* Evolution API */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">Evolution API</h2>
                  <p className="text-gray-400 text-sm">Integração com WhatsApp</p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3 mb-6">
                <div>
                  <Label className="text-sm text-gray-400 mb-2 block">URL da API</Label>
                  <Input
                    type="url"
                    value={config.evolution_url}
                    onChange={(e) => setConfig({...config, evolution_url: e.target.value})}
                    placeholder="https://evolution.seudominio.com"
                    className="bg-black border-white/10 text-white focus:border-green-500/50"
                  />
                </div>

                <div>
                  <Label className="text-sm text-gray-400 mb-2 block">API Key</Label>
                  <Input
                    type="password"
                    value={config.evolution_api_key}
                    onChange={(e) => setConfig({...config, evolution_api_key: e.target.value})}
                    placeholder="••••••••••••"
                    className="bg-black border-white/10 text-white focus:border-green-500/50"
                  />
                </div>

                <div>
                  <Label className="text-sm text-gray-400 mb-2 block">Instância</Label>
                  <Input
                    type="text"
                    value={config.evolution_instance}
                    onChange={(e) => setConfig({...config, evolution_instance: e.target.value})}
                    placeholder="default"
                    className="bg-black border-white/10 text-white focus:border-green-500/50"
                  />
                </div>
              </div>

              <Button
                onClick={testarEvolutionAPI}
                variant="outline"
                className="border-green-500/40 text-green-400 hover:bg-green-500/20"
              >
                Testar Conexão
              </Button>
            </div>

            {/* Notificações */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center">
                  <Bell className="w-6 h-6 text-yellow-400" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">Notificações</h2>
                  <p className="text-gray-400 text-sm">Configure como receber alertas</p>
                </div>
              </div>

              <div className="space-y-4">
                {Object.entries({
                  notificacoes_navegador: 'Notificações do navegador',
                  email_diario_resumo: 'Email diário com resumo',
                  alerta_leads_quentes: 'Alerta para leads quentes (ROI > 50x)',
                  lembretes_followup: 'Lembretes de follow-up'
                }).map(([key, label]) => (
                  <div key={key} className="flex items-center justify-between py-2 px-4 bg-black/30 rounded-lg">
                    <span className="text-gray-300">{label}</span>
                    <Switch
                      checked={config[key as keyof ConfigData] as boolean}
                      onCheckedChange={(checked) => setConfig({...config, [key]: checked})}
                    />
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Botão Salvar Fixo */}
          <div className="fixed bottom-0 left-64 right-0 bg-gradient-to-t from-black via-black to-transparent p-6">
            <div className="max-w-4xl">
              <Button
                onClick={salvarConfiguracoes}
                disabled={salvando}
                className="w-full bg-[#00FF94] hover:bg-[#00FF94]/90 text-black font-semibold h-12"
              >
                {salvando ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5 mr-2" />
                    Salvar Configurações
                  </>
                )}
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
