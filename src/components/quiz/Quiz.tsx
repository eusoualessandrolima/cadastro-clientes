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

  // Load saved data on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const data = JSON.parse(saved);
        const hoursSince = (Date.now() - data.timestamp) / 1000 / 60 / 60;
        if (hoursSince < 24 && data.step !== 'loading' && data.step !== 'success') {
          setFormData({ ...initialFormData, ...data.formData, uploadedFiles: [] });
          setStep(data.step);
        }
      } catch (e) {
        console.error('Error loading saved data:', e);
      }
    }
  }, []);

  // Save data on change
  useEffect(() => {
    if (step !== 'loading' && step !== 'success') {
      const { uploadedFiles, ...dataToSave } = formData;
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
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
      
      localStorage.removeItem(STORAGE_KEY);
      setStep('success');
    } catch (error) {
      console.error('Submit error:', error);
      toast({
        variant: 'destructive',
        title: 'Erro ao enviar',
        description: 'Não foi possível enviar seus dados. Tente novamente.',
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
