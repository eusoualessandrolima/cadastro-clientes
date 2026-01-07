import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { LoadingScreen } from './LoadingScreen';
import { WelcomeStep } from './WelcomeStep';
import { CompanyStep } from './CompanyStep';
import { PersonalizationStep } from './PersonalizationStep';
import { IntegrationStep } from './IntegrationStep';
import { DigitalStep } from './DigitalStep';
import { MaterialsStep } from './MaterialsStep';
import { SuccessStep } from './SuccessStep';
import { FormData, initialFormData, QuizStep } from '@/types/quiz';
import { sendOnboardingData, OnboardingData } from '@/services/api';
import { parseCurrency } from '@/utils/validation';
import { useToast } from '@/hooks/use-toast';

const STORAGE_KEY = 'companychat_onboarding';

export function Quiz() {
  const [step, setStep] = useState<QuizStep>('loading');
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

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const payload: OnboardingData = {
        company: {
          responsibleName: formData.responsibleName,
          companyName: formData.companyName,
          segment: formData.segment,
          cpfCnpj: formData.cpfCnpj,
          email: formData.email,
          phone: formData.phone,
        },
        agreement: {
          services: formData.services,
          contractModel: formData.contractModel as 'monthly' | 'single',
          agreedValue: parseCurrency(formData.agreedValue),
          paymentMethods: formData.paymentMethods,
          recurringReminder: formData.recurringReminder,
        },
        assistant: {
          mainFunctions: formData.mainFunctions,
          top5Questions: formData.top5Questions,
          communicationTone: formData.communicationTone,
          existingSolutions: formData.existingSolutions,
        },
        digital: {
          contactPhones: formData.contactPhones,
          paymentMethodsAccepted: formData.paymentMethodsAccepted,
          address: formData.address,
          instagram: formData.instagram,
          website: formData.website,
          restrictedTopics: formData.restrictedTopics,
        },
        materials: {
          additionalInfo: formData.additionalInfo,
          uploadedFiles: formData.uploadedFiles.map(f => ({ name: f.name, size: f.size, type: f.type })),
        },
        metadata: {
          timestamp: new Date().toISOString(),
          source: 'onboarding_quiz',
        },
      };

      await sendOnboardingData(payload);
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
        {step === 'loading' && <LoadingScreen onComplete={() => setStep('welcome')} />}
        {step === 'welcome' && <WelcomeStep onNext={() => setStep('company')} />}
        {step === 'company' && <CompanyStep formData={formData} updateFormData={updateFormData} onNext={() => setStep('personalization')} />}
        {step === 'personalization' && <PersonalizationStep formData={formData} updateFormData={updateFormData} onNext={() => setStep('integration')} />}
        {step === 'integration' && <IntegrationStep formData={formData} updateFormData={updateFormData} onNext={() => setStep('digital')} />}
        {step === 'digital' && <DigitalStep formData={formData} updateFormData={updateFormData} onNext={() => setStep('materials')} />}
        {step === 'materials' && <MaterialsStep formData={formData} updateFormData={updateFormData} onSubmit={handleSubmit} isSubmitting={isSubmitting} />}
        {step === 'success' && <SuccessStep />}
      </motion.div>
    </AnimatePresence>
  );
}
