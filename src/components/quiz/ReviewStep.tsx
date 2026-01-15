import { motion } from 'framer-motion';
import { useState } from 'react';
import { 
  Building2, 
  Bot, 
  Globe, 
  Edit, 
  FileText, 
  ArrowLeft, 
  Rocket,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ProgressBar } from './ProgressBar';
import { FormData, STEP_PROGRESS, STEP_LABELS } from '@/types/quiz';

interface ReviewStepProps {
  formData: FormData;
  onBack: () => void;
  onEditStep: (step: 'company' | 'personalization' | 'digital' | 'materials') => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

export function ReviewStep({ formData, onBack, onEditStep, onSubmit, isSubmitting }: ReviewStepProps) {
  const [confirmation, setConfirmation] = useState(false);

  const handleSubmit = () => {
    if (!confirmation) return;
    onSubmit();
  };

  // Helper to format arrays as comma-separated string
  const formatArray = (arr: string[]) => arr.length > 0 ? arr.join(', ') : 'Não informado';

  // Get contract model display text
  const getContractModelText = () => {
    if (formData.contractModel === 'monthly') return 'Projeto com Assinatura Mensal';
    if (formData.contractModel === 'single') return 'Projeto Único';
    return 'Não selecionado';
  };

  // Get communication tone display text
  const getToneText = () => {
    const tones: Record<string, string> = {
      professional: 'Profissional e formal',
      friendly: 'Amigável e descontraído',
      technical: 'Técnico e objetivo',
      consultive: 'Consultivo e educativo',
    };
    return tones[formData.communicationTone] || 'Não selecionado';
  };

  return (
    <div className="min-h-screen bg-cc-black">
      <ProgressBar progress={STEP_PROGRESS.review} label={STEP_LABELS.review} />

      <div className="pt-24 pb-12 px-4 max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Header */}
          <div className="text-center space-y-2">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
            >
              <CheckCircle2 className="w-16 h-16 text-cc-green mx-auto mb-4" />
            </motion.div>
            <h1 className="text-3xl font-bold text-cc-white">
              ✅ Revise suas informações
            </h1>
            <p className="text-cc-gray-text">
              Confira se está tudo certo antes de finalizar
            </p>
          </div>

          {/* Review Card */}
          <div className="bg-cc-dark/50 backdrop-blur-sm border border-cc-green/20 rounded-2xl p-6 md:p-8 space-y-6">
            
            {/* Section 1: Company Data */}
            <div className="border-b border-cc-gray-text/20 pb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-cc-green flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  Dados da Empresa
                </h2>
                <button
                  onClick={() => onEditStep('company')}
                  className="text-sm text-cc-gray-text hover:text-cc-green flex items-center gap-1 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  Editar
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-cc-gray-text">Responsável:</span>
                  <p className="text-cc-white font-medium">{formData.responsibleName || 'Não informado'}</p>
                </div>
                <div>
                  <span className="text-cc-gray-text">Empresa:</span>
                  <p className="text-cc-white font-medium">{formData.companyName || 'Não informado'}</p>
                </div>
                <div>
                  <span className="text-cc-gray-text">Segmento:</span>
                  <p className="text-cc-white font-medium">{formData.segment || 'Não informado'}</p>
                </div>
                <div>
                  <span className="text-cc-gray-text">CPF/CNPJ:</span>
                  <p className="text-cc-white font-medium">{formData.cpfCnpj || 'Não informado'}</p>
                </div>
                <div>
                  <span className="text-cc-gray-text">Email:</span>
                  <p className="text-cc-white font-medium">{formData.email || 'Não informado'}</p>
                </div>
                <div>
                  <span className="text-cc-gray-text">Telefone:</span>
                  <p className="text-cc-white font-medium">{formData.phone || 'Não informado'}</p>
                </div>
                <div className="md:col-span-2">
                  <span className="text-cc-gray-text">Serviços Contratados:</span>
                  <p className="text-cc-white font-medium">{formatArray(formData.services)}</p>
                </div>
                <div>
                  <span className="text-cc-gray-text">Modelo:</span>
                  <p className="text-cc-white font-medium">{getContractModelText()}</p>
                </div>
                <div>
                  <span className="text-cc-gray-text">Forma de Pagamento:</span>
                  <p className="text-cc-white font-medium">{formatArray(formData.paymentMethods)}</p>
                </div>
                {formData.contractModel === 'monthly' && (
                  <>
                    <div>
                      <span className="text-cc-gray-text">Valor Setup:</span>
                      <p className="text-cc-white font-medium">{formData.setupValue || 'Não informado'}</p>
                    </div>
                    <div>
                      <span className="text-cc-gray-text">Valor Mensalidade:</span>
                      <p className="text-cc-white font-medium">{formData.monthlyValue || 'Não informado'}</p>
                    </div>
                  </>
                )}
                {formData.contractModel === 'single' && (
                  <div>
                    <span className="text-cc-gray-text">Valor Único:</span>
                    <p className="text-cc-white font-medium">{formData.singleValue || 'Não informado'}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Section 2: AI Personalization */}
            <div className="border-b border-cc-gray-text/20 pb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-cc-green flex items-center gap-2">
                  <Bot className="w-5 h-5" />
                  Personalização da IA
                </h2>
                <button
                  onClick={() => onEditStep('personalization')}
                  className="text-sm text-cc-gray-text hover:text-cc-green flex items-center gap-1 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  Editar
                </button>
              </div>
              
              <div className="space-y-4 text-sm">
                <div>
                  <span className="text-cc-gray-text">Função Principal:</span>
                  <p className="text-cc-white font-medium">{formatArray(formData.mainFunctions)}</p>
                </div>
                <div>
                  <span className="text-cc-gray-text">Perguntas Frequentes:</span>
                  <p className="text-cc-white font-medium whitespace-pre-line">
                    {formData.top5Questions || 'Não informado'}
                  </p>
                </div>
                <div>
                  <span className="text-cc-gray-text">Tom de Comunicação:</span>
                  <p className="text-cc-white font-medium">{getToneText()}</p>
                </div>
              </div>
            </div>

            {/* Section 3: Digital Presence */}
            <div className="border-b border-cc-gray-text/20 pb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-cc-green flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Presença Digital
                </h2>
                <button
                  onClick={() => onEditStep('digital')}
                  className="text-sm text-cc-gray-text hover:text-cc-green flex items-center gap-1 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  Editar
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-cc-gray-text">Telefone Contato:</span>
                  <p className="text-cc-white font-medium">{formData.contactPhones || 'Não informado'}</p>
                </div>
                <div>
                  <span className="text-cc-gray-text">Formas de Pagamento:</span>
                  <p className="text-cc-white font-medium">{formData.paymentMethodsAccepted || 'Não informado'}</p>
                </div>
                <div>
                  <span className="text-cc-gray-text">Endereço:</span>
                  <p className="text-cc-white font-medium">{formData.address || 'Não informado'}</p>
                </div>
                <div>
                  <span className="text-cc-gray-text">Instagram:</span>
                  <p className="text-cc-white font-medium">{formData.instagram || 'Não informado'}</p>
                </div>
                <div>
                  <span className="text-cc-gray-text">Site:</span>
                  <p className="text-cc-white font-medium">{formData.website || 'Não informado'}</p>
                </div>
                {formData.restrictedTopics && (
                  <div className="md:col-span-2">
                    <span className="text-cc-gray-text">Tópicos que NÃO deve abordar:</span>
                    <p className="text-cc-white font-medium whitespace-pre-line">
                      {formData.restrictedTopics}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Section 4: Materials */}
            <div className="pb-2">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-cc-green flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Materiais e Informações
                </h2>
                <button
                  onClick={() => onEditStep('materials')}
                  className="text-sm text-cc-gray-text hover:text-cc-green flex items-center gap-1 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  Editar
                </button>
              </div>
              
              <div className="space-y-4 text-sm">
                <div>
                  <span className="text-cc-gray-text">Informações Adicionais:</span>
                  <p className="text-cc-white font-medium whitespace-pre-line">
                    {formData.additionalInfo || 'Não informado'}
                  </p>
                </div>
                {formData.uploadedFiles && formData.uploadedFiles.length > 0 && (
                  <div>
                    <span className="text-cc-gray-text">Arquivos Anexados:</span>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.uploadedFiles.map((file, index) => (
                        <div 
                          key={index} 
                          className="bg-cc-black/50 px-3 py-2 rounded-lg text-sm text-cc-gray-text border border-cc-gray-text/20"
                        >
                          📎 {file.name}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Confirmation Checkbox */}
          <div className="bg-cc-gold/10 border border-cc-gold/30 rounded-lg p-4">
            <label className="flex items-start gap-3 cursor-pointer">
              <Checkbox
                checked={confirmation}
                onCheckedChange={(checked) => setConfirmation(checked === true)}
                className="mt-1 border-cc-gold/50 data-[state=checked]:bg-cc-green data-[state=checked]:border-cc-green"
              />
              <span className="text-sm text-cc-gray-text">
                Confirmo que todas as informações acima estão corretas e desejo prosseguir com o cadastro. 
                Entendo que essas informações serão usadas para configurar meu Assistente de IA personalizado.
              </span>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                onClick={onBack}
                variant="outline"
                className="w-full bg-cc-dark hover:bg-cc-dark/80 border-cc-gray-text/30 text-cc-white font-semibold text-lg py-6"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Voltar
              </Button>
            </motion.div>
            
            <motion.div 
              className="flex-1" 
              whileHover={{ scale: !confirmation || isSubmitting ? 1 : 1.02 }} 
              whileTap={{ scale: !confirmation || isSubmitting ? 1 : 0.98 }}
            >
              <Button
                onClick={handleSubmit}
                disabled={!confirmation || isSubmitting}
                className="w-full bg-cc-green text-cc-black font-semibold text-lg py-6 hover:bg-cc-green/90 glow-green-intense disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Finalizando...
                  </>
                ) : (
                  <>
                    <Rocket className="w-5 h-5 mr-2" />
                    Finalizar Cadastro
                  </>
                )}
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
