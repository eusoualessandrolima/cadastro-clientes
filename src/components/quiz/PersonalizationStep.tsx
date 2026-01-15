import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ProgressBar } from './ProgressBar';
import { FormData } from '@/types/quiz';
import { celebrateMidway } from '@/utils/confetti';

interface PersonalizationStepProps {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
  onNext: () => void;
}

const mainFunctions = [
  'Responder sobre produtos/serviços',
  'Qualificar e capturar leads',
  'Fornecer suporte técnico',
  'Agendar compromissos',
  'Tirar dúvidas frequentes',
];

const communicationTones = [
  { id: 'professional', icon: '📎', label: 'Profissional e formal', preview: 'Prezado cliente, como posso auxiliá-lo hoje?' },
  { id: 'friendly', icon: '😊', label: 'Amigável e descontraído', preview: 'Oi! Tudo bem? Em que posso te ajudar?' },
  { id: 'technical', icon: '🔧', label: 'Técnico e objetivo', preview: 'Entendido. Procedimento: verificar configuração X.' },
  { id: 'consultive', icon: '💡', label: 'Consultivo e educativo', preview: 'Boa pergunta! Vou explicar como funciona...' },
];

export function PersonalizationStep({ formData, updateFormData, onNext }: PersonalizationStepProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [hasShownMilestone, setHasShownMilestone] = useState(false);

  useEffect(() => {
    if (!hasShownMilestone) {
      celebrateMidway();
      setHasShownMilestone(true);
    }
  }, [hasShownMilestone]);

  const handleFunctionChange = (func: string, checked: boolean) => {
    const newFunctions = checked
      ? [...formData.mainFunctions, func]
      : formData.mainFunctions.filter(f => f !== func);
    updateFormData({ mainFunctions: newFunctions });
  };

  // Count lines in textarea
  const lineCount = formData.top5Questions
    ? formData.top5Questions.split('\n').filter(line => line.trim()).length
    : 0;

  const getLineCountStatus = () => {
    if (lineCount === 0) return { text: '0/5 perguntas', color: 'text-cc-gray-text' };
    if (lineCount < 5) return { text: `${lineCount}/5 perguntas`, color: 'text-cc-warning' };
    if (lineCount === 5) return { text: '5/5 perguntas ✓', color: 'text-cc-green' };
    return { text: 'Máximo 5 perguntas', color: 'text-destructive' };
  };

  const lineStatus = getLineCountStatus();

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (formData.mainFunctions.length === 0) {
      newErrors.mainFunctions = 'Selecione ao menos uma função';
    }
    if (!formData.top5Questions.trim()) {
      newErrors.top5Questions = 'Preencha as perguntas mais comuns';
    }
    if (!formData.communicationTone) {
      newErrors.communicationTone = 'Selecione um tom de comunicação';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onNext();
    }
  };

  return (
    <div className="min-h-screen bg-cc-black">
      <ProgressBar progress={66} label="Bloco 2 de 3 - Personalização da IA" />

      <div className="pt-24 pb-12 px-4 max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Milestone Badge */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.3 }}
            className="flex justify-center"
          >
            <div className="bg-cc-green/10 border border-cc-green/30 rounded-full px-6 py-2">
              <span className="text-cc-green font-medium">
                Meio caminho percorrido! 🎖️
              </span>
            </div>
          </motion.div>

          {/* Main Functions */}
          <div className="bg-cc-gray-light rounded-xl p-6 space-y-4">
            <Label className="text-lg font-medium text-cc-dark">
              Qual é a principal função do seu Assistente?
            </Label>
            <div className="space-y-3">
              {mainFunctions.map((func) => (
                <div key={func} className="flex items-center gap-3">
                  <Checkbox
                    id={func}
                    checked={formData.mainFunctions.includes(func)}
                    onCheckedChange={(checked) => handleFunctionChange(func, checked === true)}
                    className="data-[state=checked]:bg-cc-green data-[state=checked]:border-cc-green"
                  />
                  <label htmlFor={func} className="text-sm text-cc-dark cursor-pointer">
                    {func}
                  </label>
                </div>
              ))}
            </div>
            <p className="text-sm text-cc-green">
              {formData.mainFunctions.length} funções selecionadas
            </p>
            {errors.mainFunctions && (
              <motion.p
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-sm text-destructive"
              >
                {errors.mainFunctions}
              </motion.p>
            )}
          </div>

          {/* Top 5 Questions */}
          <div className="bg-cc-gray-light rounded-xl p-6 space-y-4">
            <Label className="text-lg font-medium text-cc-dark">
              Quais são as 5 perguntas mais comuns que seus clientes fazem?
            </Label>
            <Textarea
              value={formData.top5Questions}
              onChange={(e) => updateFormData({ top5Questions: e.target.value })}
              placeholder={`Liste as principais dúvidas. Exemplo:\n1. Qual o preço do serviço?\n2. Qual o prazo de entrega?\n3. Como faço para agendar?`}
              className="min-h-[150px] resize-none"
            />
            <p className={`text-sm ${lineStatus.color}`}>{lineStatus.text}</p>
            {errors.top5Questions && (
              <motion.p
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-sm text-destructive"
              >
                {errors.top5Questions}
              </motion.p>
            )}
          </div>

          {/* Communication Tone */}
          <div className="bg-cc-gray-light rounded-xl p-6 space-y-4">
            <Label className="text-lg font-medium text-cc-dark">
              O Assistente deve ter um tom de comunicação:
            </Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {communicationTones.map((tone) => (
                <motion.div
                  key={tone.id}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => updateFormData({ communicationTone: tone.id })}
                  className={`cursor-pointer p-4 rounded-xl border-2 transition-all ${
                    formData.communicationTone === tone.id
                      ? 'border-cc-green bg-cc-green/10'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{tone.icon}</span>
                    <p className="font-medium text-cc-dark">{tone.label}</p>
                  </div>
                  {formData.communicationTone === tone.id && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-3 bg-white rounded-lg p-3 shadow-sm"
                    >
                      <p className="text-sm text-cc-gray-text italic">"{tone.preview}"</p>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
            {errors.communicationTone && (
              <motion.p
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-sm text-destructive"
              >
                {errors.communicationTone}
              </motion.p>
            )}
          </div>

          {/* Submit Button */}
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              onClick={handleSubmit}
              className="w-full bg-cc-green text-cc-black font-semibold text-lg py-6 hover:bg-cc-green/90 glow-green"
            >
              Continuar →
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
