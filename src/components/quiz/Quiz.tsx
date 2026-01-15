import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { WelcomeStep } from './WelcomeStep';
import { CompanyStep } from './CompanyStep';
import { PersonalizationStep } from './PersonalizationStep';
import { DigitalStep } from './DigitalStep';
import { MaterialsStep } from './MaterialsStep';
import { ReviewStep } from './ReviewStep';
import { SuccessStep } from './SuccessStep';
import { FormData, initialFormData, QuizStep } from '@/types/quiz';
import { finalizarCadastro } from '@/services/cadastroService';
import { useToast } from '@/hooks/use-toast';

const STORAGE_KEY = 'companychat_onboarding';

export function Quiz() {
  const [step, setStep] = useState<QuizStep>('welcome');
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Clear localStorage on mount for fresh sessions (shared links)
  // Only use sessionStorage for current session persistence
  useEffect(() => {
    // Check if this is a new browser session (no session ID in sessionStorage)
    const sessionId = sessionStorage.getItem('form_session_id');

    if (!sessionId) {
      // New session - clear any old localStorage data and start fresh
      localStorage.removeItem(STORAGE_KEY);
      console.log('🆕 Nova sessão de formulário iniciada - dados limpos');

      // Create new session ID
      sessionStorage.setItem('form_session_id', Date.now().toString());
    } else {
      // Existing session - try to restore data from sessionStorage only
      const savedSession = sessionStorage.getItem(STORAGE_KEY);
      if (savedSession) {
        try {
          const data = JSON.parse(savedSession);
          if (data.step !== 'loading' && data.step !== 'success') {
            setFormData({ ...initialFormData, ...data.formData, uploadedFiles: [] });
            setStep(data.step);
            console.log('♻️ Sessão existente - dados restaurados');
          }
        } catch (e) {
          console.error('Error loading saved data:', e);
        }
      }
    }
  }, []);

  // Save data to sessionStorage only (not localStorage) - persists during current session only
  useEffect(() => {
    if (step !== 'loading' && step !== 'success') {
      const { uploadedFiles, ...dataToSave } = formData;
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify({
        step,
        formData: dataToSave,
        timestamp: Date.now(),
      }));
    }
  }, [formData, step]);

  const updateFormData = useCallback((data: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToStep = (newStep: QuizStep) => {
    setStep(newStep);
    scrollToTop();
  };

  const handleEditStep = (targetStep: 'company' | 'personalization' | 'digital' | 'materials') => {
    goToStep(targetStep);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Salvar no banco e enviar para n8n webhook
      await finalizarCadastro(formData);

      // Clear both storages on success
      localStorage.removeItem(STORAGE_KEY);
      sessionStorage.removeItem(STORAGE_KEY);
      sessionStorage.removeItem('form_session_id');
      setStep('success');
    } catch (error: any) {
      console.error('Submit error:', error);
      toast({
        variant: 'destructive',
        title: 'Erro ao enviar',
        description: error.message || 'Não foi possível enviar seus dados. Tente novamente.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={step}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {step === 'welcome' && (
          <WelcomeStep onNext={() => goToStep('company')} />
        )}
        {step === 'company' && (
          <CompanyStep
            formData={formData}
            updateFormData={updateFormData}
            onNext={() => goToStep('personalization')}
          />
        )}
        {step === 'personalization' && (
          <PersonalizationStep
            formData={formData}
            updateFormData={updateFormData}
            onNext={() => goToStep('digital')}
            onBack={() => goToStep('company')}
          />
        )}
        {step === 'digital' && (
          <DigitalStep
            formData={formData}
            updateFormData={updateFormData}
            onNext={() => goToStep('materials')}
            onBack={() => goToStep('personalization')}
          />
        )}
        {step === 'materials' && (
          <MaterialsStep
            formData={formData}
            updateFormData={updateFormData}
            onNext={() => goToStep('review')}
            onBack={() => goToStep('digital')}
          />
        )}
        {step === 'review' && (
          <ReviewStep
            formData={formData}
            onBack={() => goToStep('materials')}
            onEditStep={handleEditStep}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        )}
        {step === 'success' && <SuccessStep />}
      </motion.div>
    </AnimatePresence>
  );
}
