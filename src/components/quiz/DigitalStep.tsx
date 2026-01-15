import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Phone, CreditCard, MapPin, Instagram, Globe, Ban } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { ProgressBar } from './ProgressBar';
import { FormData } from '@/types/quiz';
import { celebrateMilestone } from '@/utils/confetti';

interface DigitalStepProps {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
  onNext: () => void;
}

const restrictedSuggestions = [
  { icon: '🚫', text: 'Não discutir preços sem qualificação' },
  { icon: '⏰', text: 'Não prometer prazos específicos' },
  { icon: '📞', text: 'Sempre direcionar para humano em casos complexos' },
];

export function DigitalStep({ formData, updateFormData, onNext }: DigitalStepProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [hasShownMilestone, setHasShownMilestone] = useState(false);

  useEffect(() => {
    if (!hasShownMilestone) {
      celebrateMilestone();
      setHasShownMilestone(true);
    }
  }, [hasShownMilestone]);

  const addSuggestion = (text: string) => {
    const current = formData.restrictedTopics;
    const newTopics = current ? `${current}\n${text}` : text;
    updateFormData({ restrictedTopics: newTopics });
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.contactPhones.trim()) {
      newErrors.contactPhones = 'Informe ao menos um telefone';
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
      <ProgressBar progress={100} label="Bloco 3 de 3 - Presença Digital" />

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
            <div className="bg-cc-gold/10 border border-cc-gold/30 rounded-full px-6 py-2">
              <span className="text-cc-gold font-medium">
                Última etapa! 🏁
              </span>
            </div>
          </motion.div>

          {/* Title */}
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-cc-white">
              📱 Informações que seu Assistente vai usar para responder clientes
            </h2>
            <p className="text-cc-gray-text">
              Preencha os dados que seu assistente precisará ter em mãos quando os clientes perguntarem sobre contato, redes sociais ou formas de pagamento.
            </p>
          </div>

          {/* Example Card */}
          <div className="bg-cc-green/5 border border-cc-green/20 rounded-xl p-5">
            <p className="text-cc-white font-medium mb-3">💬 Como funciona na prática:</p>
            <div className="space-y-2 text-sm">
              <p className="text-cc-gray-text">
                <span className="text-cc-white">Cliente:</span> "Qual o Instagram de vocês?"
              </p>
              <p className="text-cc-green">
                <span className="text-cc-white">Assistente:</span> "Nos siga em @suaempresa! 📸"
              </p>
              <p className="text-cc-gray-text mt-4">
                <span className="text-cc-white">Cliente:</span> "Onde vocês ficam?"
              </p>
              <p className="text-cc-green">
                <span className="text-cc-white">Assistente:</span> "Estamos na Rua X, Centro"
              </p>
            </div>
          </div>

          {/* Form Fields */}
          <div className="bg-cc-gray-light rounded-xl p-6 space-y-6">
            {/* Contact Phones */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-cc-dark">
                <Phone className="w-4 h-4" /> Telefone para contato *
              </Label>
              <Input
                value={formData.contactPhones}
                onChange={(e) => {
                  updateFormData({ contactPhones: e.target.value });
                  setErrors(prev => ({ ...prev, contactPhones: '' }));
                }}
                placeholder="Ex: (62) 99999-9999 | (62) 3333-4444"
                className={errors.contactPhones ? 'border-destructive' : ''}
              />
              <p className="text-xs text-muted-foreground">
                💡 O assistente usará este número quando perguntarem "Como posso ligar?"
              </p>
              {errors.contactPhones && (
                <motion.p
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-sm text-destructive"
                >
                  {errors.contactPhones}
                </motion.p>
              )}
            </div>

            {/* Payment Methods Accepted */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-cc-dark">
                <CreditCard className="w-4 h-4" /> Formas de pagamento aceitas
              </Label>
              <Input
                value={formData.paymentMethodsAccepted}
                onChange={(e) => updateFormData({ paymentMethodsAccepted: e.target.value })}
                placeholder="Ex: PIX, Cartão, Boleto | Reembolsamento em até 7 dias"
              />
              <p className="text-xs text-muted-foreground">
                💡 O assistente explicará as opções quando perguntarem "Como posso pagar?"
              </p>
            </div>

            {/* Address */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-cc-dark">
                <MapPin className="w-4 h-4" /> Endereço da empresa
              </Label>
              <Input
                value={formData.address}
                onChange={(e) => updateFormData({ address: e.target.value })}
                placeholder="Rua, Número, Bairro, Cidade - Estado"
              />
              <p className="text-xs text-muted-foreground">
                💡 O assistente fornecerá este endereço quando perguntarem "Onde vocês ficam?"
              </p>
            </div>

            {/* Instagram */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-cc-dark">
                <Instagram className="w-4 h-4" /> Instagram da empresa
              </Label>
              <Input
                value={formData.instagram}
                onChange={(e) => updateFormData({ instagram: e.target.value })}
                placeholder="Ex: @companychat_ia"
              />
              <p className="text-xs text-muted-foreground">
                💡 O assistente compartilhará este perfil quando perguntarem "Vocês têm Instagram?"
              </p>
            </div>

            {/* Website */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-cc-dark">
                <Globe className="w-4 h-4" /> Site da empresa
              </Label>
              <Input
                value={formData.website}
                onChange={(e) => updateFormData({ website: e.target.value })}
                placeholder="Ex: www.companychat.com.br"
              />
              <p className="text-xs text-muted-foreground">
                💡 O assistente indicará este site quando perguntarem "Onde posso ver mais?"
              </p>
            </div>

            {/* Restricted Topics */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2 text-cc-dark">
                <Ban className="w-4 h-4" /> Tópicos que o assistente NÃO deve abordar
              </Label>
              
              {/* Clickable suggestions */}
              <div className="flex flex-wrap gap-2">
                {restrictedSuggestions.map((suggestion) => (
                  <motion.button
                    key={suggestion.text}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => addSuggestion(suggestion.text)}
                    type="button"
                    className="px-3 py-1.5 text-sm bg-cc-green/10 text-cc-dark border border-cc-green/30 rounded-full hover:bg-cc-green/20 transition-colors"
                  >
                    {suggestion.icon} {suggestion.text}
                  </motion.button>
                ))}
              </div>

              <Textarea
                value={formData.restrictedTopics}
                onChange={(e) => updateFormData({ restrictedTopics: e.target.value })}
                placeholder="Liste aqui o que seu assistente NÃO deve responder..."
                className="min-h-[100px]"
              />
              <p className="text-xs text-muted-foreground">
                💡 Defina limites para evitar que o assistente responda algo inadequado
              </p>
            </div>
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
