import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { User, Building2, Briefcase, FileText, Mail, Phone, RefreshCw, Zap, DollarSign } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ProgressBar } from './ProgressBar';
import { FormData } from '@/types/quiz';
import { maskCpfCnpj, maskPhone, maskCurrency } from '@/utils/masks';
import { validateCPF, validateCNPJ, validateEmail, validatePhone } from '@/utils/validation';
import { celebrateMilestone } from '@/utils/confetti';

interface CompanyStepProps {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
  onNext: () => void;
}

interface FieldErrors {
  responsibleName?: string;
  companyName?: string;
  segment?: string;
  cpfCnpj?: string;
  email?: string;
  phone?: string;
  services?: string;
  contractModel?: string;
  agreedValue?: string;
  paymentMethods?: string;
}

export function CompanyStep({ formData, updateFormData, onNext }: CompanyStepProps) {
  const [errors, setErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [hasShownMilestone, setHasShownMilestone] = useState(false);

  useEffect(() => {
    if (!hasShownMilestone) {
      celebrateMilestone();
      setHasShownMilestone(true);
    }
  }, [hasShownMilestone]);

  // Email validation with debounce
  useEffect(() => {
    if (!touched.email) return;

    const timer = setTimeout(() => {
      if (formData.email && !validateEmail(formData.email)) {
        setErrors(prev => ({ ...prev, email: 'Email inválido' }));
      } else {
        setErrors(prev => ({ ...prev, email: undefined }));
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [formData.email, touched.email]);

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));

    switch (field) {
      case 'responsibleName':
        if (formData.responsibleName.length < 3) {
          setErrors(prev => ({ ...prev, responsibleName: 'Mínimo 3 caracteres' }));
        } else {
          setErrors(prev => ({ ...prev, responsibleName: undefined }));
        }
        break;

      case 'companyName':
        if (formData.companyName.length < 2) {
          setErrors(prev => ({ ...prev, companyName: 'Mínimo 2 caracteres' }));
        } else {
          setErrors(prev => ({ ...prev, companyName: undefined }));
        }
        break;

      case 'segment':
        if (formData.segment.length < 3) {
          setErrors(prev => ({ ...prev, segment: 'Mínimo 3 caracteres' }));
        } else {
          setErrors(prev => ({ ...prev, segment: undefined }));
        }
        break;

      case 'cpfCnpj': {
        const clean = formData.cpfCnpj.replace(/\D/g, '');
        if (clean.length === 0) {
          setErrors(prev => ({ ...prev, cpfCnpj: undefined }));
        } else if (clean.length === 11) {
          if (!validateCPF(clean)) {
            setErrors(prev => ({ ...prev, cpfCnpj: 'CPF inválido' }));
          } else {
            setErrors(prev => ({ ...prev, cpfCnpj: undefined }));
          }
        } else if (clean.length === 14) {
          if (!validateCNPJ(clean)) {
            setErrors(prev => ({ ...prev, cpfCnpj: 'CNPJ inválido' }));
          } else {
            setErrors(prev => ({ ...prev, cpfCnpj: undefined }));
          }
        } else {
          setErrors(prev => ({ ...prev, cpfCnpj: 'CPF deve ter 11 dígitos, CNPJ 14 dígitos' }));
        }
        break;
      }

      case 'phone': {
        if (!validatePhone(formData.phone)) {
          setErrors(prev => ({ ...prev, phone: 'Telefone inválido' }));
        } else {
          setErrors(prev => ({ ...prev, phone: undefined }));
        }
        break;
      }
    }
  };

  const handleServiceChange = (service: string, checked: boolean) => {
    const newServices = checked
      ? [...formData.services, service]
      : formData.services.filter(s => s !== service);
    updateFormData({ services: newServices });
  };

  const handlePaymentChange = (method: string, checked: boolean) => {
    const newMethods = checked
      ? [...formData.paymentMethods, method]
      : formData.paymentMethods.filter(m => m !== method);
    updateFormData({ paymentMethods: newMethods });
  };

  const validateForm = (): boolean => {
    const newErrors: FieldErrors = {};

    if (formData.responsibleName.length < 3) newErrors.responsibleName = 'Obrigatório';
    if (formData.companyName.length < 2) newErrors.companyName = 'Obrigatório';
    if (formData.segment.length < 3) newErrors.segment = 'Obrigatório';

    const cleanCpfCnpj = formData.cpfCnpj.replace(/\D/g, '');
    if (cleanCpfCnpj.length === 11 && !validateCPF(cleanCpfCnpj)) {
      newErrors.cpfCnpj = 'CPF inválido';
    } else if (cleanCpfCnpj.length === 14 && !validateCNPJ(cleanCpfCnpj)) {
      newErrors.cpfCnpj = 'CNPJ inválido';
    } else if (cleanCpfCnpj.length !== 11 && cleanCpfCnpj.length !== 14) {
      newErrors.cpfCnpj = 'CPF ou CNPJ inválido';
    }

    if (!validateEmail(formData.email)) newErrors.email = 'Email inválido';
    if (!validatePhone(formData.phone)) newErrors.phone = 'Telefone inválido';
    if (formData.services.length === 0) newErrors.services = 'Selecione ao menos um serviço';
    if (!formData.contractModel) newErrors.contractModel = 'Selecione um modelo';
    if (!formData.agreedValue || formData.agreedValue === 'R$ 0,00') newErrors.agreedValue = 'Informe o valor';
    if (formData.paymentMethods.length === 0) newErrors.paymentMethods = 'Selecione ao menos uma forma';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onNext();
    }
  };

  const services = [
    'Assistente IA personalizado',
    'Integrações com plataformas (CRM, WhatsApp, API)',
    'Outros serviços',
  ];

  return (
    <div className="min-h-screen bg-cc-black">
      <ProgressBar progress={25} label="Bloco 1 de 4 - Informações da Empresa e Acordo Comercial" />

      <div className="pt-24 pb-12 px-4 max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Section 1: Company Data */}
          <div className="bg-cc-gray-light rounded-xl p-6 space-y-6">
            <h2 className="text-lg font-semibold text-cc-dark">Dados da Empresa</h2>

            {/* Responsible Name */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-cc-dark">
                <User className="w-4 h-4" /> Nome do Responsável *
              </Label>
              <Input
                value={formData.responsibleName}
                onChange={(e) => {
                  updateFormData({ responsibleName: e.target.value });
                  setErrors(prev => ({ ...prev, responsibleName: undefined }));
                }}
                onBlur={() => handleBlur('responsibleName')}
                placeholder="Seu nome completo"
                className={errors.responsibleName ? 'border-destructive' : ''}
              />
              {errors.responsibleName && (
                <motion.p
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-sm text-destructive"
                >
                  {errors.responsibleName}
                </motion.p>
              )}
            </div>

            {/* Company Name */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-cc-dark">
                <Building2 className="w-4 h-4" /> Nome da Empresa *
              </Label>
              <Input
                value={formData.companyName}
                onChange={(e) => {
                  updateFormData({ companyName: e.target.value });
                  setErrors(prev => ({ ...prev, companyName: undefined }));
                }}
                onBlur={() => handleBlur('companyName')}
                placeholder="Nome da sua empresa"
                className={errors.companyName ? 'border-destructive' : ''}
              />
              {errors.companyName && (
                <motion.p
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-sm text-destructive"
                >
                  {errors.companyName}
                </motion.p>
              )}
            </div>

            {/* Segment */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-cc-dark">
                <Briefcase className="w-4 h-4" /> Segmento Produto ou Serviço *
              </Label>
              <Input
                value={formData.segment}
                onChange={(e) => {
                  updateFormData({ segment: e.target.value });
                  setErrors(prev => ({ ...prev, segment: undefined }));
                }}
                onBlur={() => handleBlur('segment')}
                placeholder="Ex: E-commerce, Consultoria, Saúde..."
                className={errors.segment ? 'border-destructive' : ''}
              />
              <p className="text-xs text-muted-foreground">
                Isso nos ajuda a personalizar as respostas do seu assistente
              </p>
              {errors.segment && (
                <motion.p
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-sm text-destructive"
                >
                  {errors.segment}
                </motion.p>
              )}
            </div>

            {/* CPF/CNPJ */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-cc-dark">
                <FileText className="w-4 h-4" /> CPF ou CNPJ *
              </Label>
              <Input
                value={formData.cpfCnpj}
                onChange={(e) => {
                  updateFormData({ cpfCnpj: maskCpfCnpj(e.target.value) });
                  setErrors(prev => ({ ...prev, cpfCnpj: undefined }));
                }}
                onBlur={() => handleBlur('cpfCnpj')}
                placeholder="000.000.000-00 ou 00.000.000/0000-00"
                className={errors.cpfCnpj ? 'border-destructive' : ''}
              />
              {errors.cpfCnpj && (
                <motion.p
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-sm text-destructive"
                >
                  {errors.cpfCnpj}
                </motion.p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-cc-dark">
                <Mail className="w-4 h-4" /> Email Principal *
              </Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => {
                  updateFormData({ email: e.target.value });
                  setErrors(prev => ({ ...prev, email: undefined }));
                }}
                onBlur={() => setTouched(prev => ({ ...prev, email: true }))}
                placeholder="seu@email.com"
                className={errors.email ? 'border-destructive' : ''}
              />
              {errors.email && (
                <motion.p
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-sm text-destructive"
                >
                  {errors.email}
                </motion.p>
              )}
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-cc-dark">
                <Phone className="w-4 h-4" /> Fone/WhatsApp *
              </Label>
              <Input
                value={formData.phone}
                onChange={(e) => {
                  updateFormData({ phone: maskPhone(e.target.value) });
                  setErrors(prev => ({ ...prev, phone: undefined }));
                }}
                onBlur={() => handleBlur('phone')}
                placeholder="(00) 00000-0000"
                className={errors.phone ? 'border-destructive' : ''}
              />
              {errors.phone && (
                <motion.p
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-sm text-destructive"
                >
                  {errors.phone}
                </motion.p>
              )}
            </div>
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-cc-gray-text/30" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-cc-black px-4 text-sm text-cc-gray-text">
                Confirmação do Acordo Comercial
              </span>
            </div>
          </div>

          {/* Section 2: Agreement Data */}
          <div className="bg-cc-green/5 border border-cc-green/20 rounded-xl p-6 space-y-6">
            <h2 className="text-lg font-semibold text-cc-white">Dados do Acordo</h2>

            {/* Services */}
            <div className="space-y-3">
              <Label className="text-cc-white">Quais serviços você está contratando? *</Label>
              <div className="space-y-2">
                {services.map((service) => (
                  <div key={service} className="flex items-center gap-3">
                    <Checkbox
                      id={service}
                      checked={formData.services.includes(service)}
                      onCheckedChange={(checked) => handleServiceChange(service, checked === true)}
                      className="border-cc-white/50 data-[state=checked]:bg-cc-green data-[state=checked]:border-cc-green"
                    />
                    <label htmlFor={service} className="text-sm text-cc-white cursor-pointer">
                      {service}
                    </label>
                  </div>
                ))}
              </div>
              {errors.services && (
                <motion.p
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-sm text-destructive"
                >
                  {errors.services}
                </motion.p>
              )}
            </div>

            {/* Contract Model */}
            <div className="space-y-3">
              <Label className="text-cc-white">Modelo de Contratação *</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <motion.div
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => updateFormData({ contractModel: 'monthly' })}
                  className={`cursor-pointer p-4 rounded-xl border-2 transition-all ${
                    formData.contractModel === 'monthly'
                      ? 'border-cc-green bg-cc-green/10'
                      : 'border-cc-white/20 hover:border-cc-white/40'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <RefreshCw className="w-6 h-6 text-cc-green" />
                    <div>
                      <p className="font-medium text-cc-white">Projeto com Assinatura Mensal</p>
                      <p className="text-sm text-cc-gray-text">Pagamento recorrente mensal</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => updateFormData({ contractModel: 'single' })}
                  className={`cursor-pointer p-4 rounded-xl border-2 transition-all ${
                    formData.contractModel === 'single'
                      ? 'border-cc-green bg-cc-green/10'
                      : 'border-cc-white/20 hover:border-cc-white/40'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Zap className="w-6 h-6 text-cc-green" />
                    <div>
                      <p className="font-medium text-cc-white">Projeto Único</p>
                      <p className="text-sm text-cc-gray-text">Pagamento único, sem mensalidade</p>
                    </div>
                  </div>
                </motion.div>
              </div>
              {errors.contractModel && (
                <motion.p
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-sm text-destructive"
                >
                  {errors.contractModel}
                </motion.p>
              )}
            </div>

            {/* Agreed Value */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-cc-white">
                <DollarSign className="w-4 h-4" /> Valor Acordado *
              </Label>
              <Input
                value={formData.agreedValue}
                onChange={(e) => updateFormData({ agreedValue: maskCurrency(e.target.value) })}
                placeholder="R$ 0,00"
                className={`bg-cc-dark/50 border-cc-white/20 text-cc-white placeholder:text-cc-gray-text ${
                  errors.agreedValue ? 'border-destructive' : ''
                }`}
              />
              <p className="text-xs text-cc-gray-text">
                Este é o valor que ficou acertado na proposta comercial
              </p>
              {errors.agreedValue && (
                <motion.p
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-sm text-destructive"
                >
                  {errors.agreedValue}
                </motion.p>
              )}
            </div>

            {/* Payment Methods */}
            <div className="space-y-3">
              <Label className="text-cc-white">Forma de Pagamento *</Label>
              <div className="flex gap-4">
                {['PIX', 'Boleto Bancário'].map((method) => (
                  <div key={method} className="flex items-center gap-2">
                    <Checkbox
                      id={method}
                      checked={formData.paymentMethods.includes(method)}
                      onCheckedChange={(checked) => handlePaymentChange(method, checked === true)}
                      className="border-cc-white/50 data-[state=checked]:bg-cc-green data-[state=checked]:border-cc-green"
                    />
                    <label htmlFor={method} className="text-sm text-cc-white cursor-pointer">
                      {method}
                    </label>
                  </div>
                ))}
              </div>
              {errors.paymentMethods && (
                <motion.p
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-sm text-destructive"
                >
                  {errors.paymentMethods}
                </motion.p>
              )}
            </div>

            {/* Recurring Reminder (conditional) */}
            <AnimatePresence>
              {formData.contractModel === 'monthly' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-3"
                >
                  <Label className="text-cc-white">Lembrete de Pagamento</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => updateFormData({ recurringReminder: true })}
                      className={`cursor-pointer p-4 rounded-xl border-2 transition-all ${
                        formData.recurringReminder === true
                          ? 'border-cc-green bg-cc-green/10'
                          : 'border-cc-white/20 hover:border-cc-white/40'
                      }`}
                    >
                      <p className="font-medium text-cc-white">SIM ✅</p>
                      <p className="text-xs text-cc-gray-text">
                        Você receberá lembrete antes do vencimento
                      </p>
                    </motion.div>

                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => updateFormData({ recurringReminder: false })}
                      className={`cursor-pointer p-4 rounded-xl border-2 transition-all ${
                        formData.recurringReminder === false
                          ? 'border-cc-green bg-cc-green/10'
                          : 'border-cc-white/20 hover:border-cc-white/40'
                      }`}
                    >
                      <p className="font-medium text-cc-white">NÃO ❌</p>
                      <p className="text-xs text-cc-gray-text">
                        Não enviaremos lembretes automáticos
                      </p>
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
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
