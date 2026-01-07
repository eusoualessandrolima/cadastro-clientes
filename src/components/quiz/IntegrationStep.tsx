import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ProgressBar } from './ProgressBar';
import { FormData } from '@/types/quiz';
import { celebrateMilestone } from '@/utils/confetti';

interface IntegrationStepProps {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
  onNext: () => void;
}

const solutions = [
  'Sim, já uso chatbot(s) ou respostas automáticas',
  'Uso apenas respostas automáticas básicas',
  'Tenho ferramenta de CRM (Salesforce, RD Station, HubSpot, etc.)',
  'Não, será minha primeira vez',
];

export function IntegrationStep({ formData, updateFormData, onNext }: IntegrationStepProps) {
  const [error, setError] = useState('');
  const [hasShownMilestone, setHasShownMilestone] = useState(false);

  useEffect(() => {
    if (!hasShownMilestone) {
      celebrateMilestone();
      setHasShownMilestone(true);
    }
  }, [hasShownMilestone]);

  const handleSolutionChange = (solution: string, checked: boolean) => {
    const newSolutions = checked
      ? [...formData.existingSolutions, solution]
      : formData.existingSolutions.filter(s => s !== solution);
    updateFormData({ existingSolutions: newSolutions });
    setError('');
  };

  const handleSubmit = () => {
    if (formData.existingSolutions.length === 0) {
      setError('Selecione ao menos uma opção');
      return;
    }
    onNext();
  };

  return (
    <div className="min-h-screen bg-cc-black">
      <ProgressBar progress={75} label="Bloco 3 de 4 - Integrações" />

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
                Você está quase lá! 💪
              </span>
            </div>
          </motion.div>

          {/* Existing Solutions */}
          <div className="bg-cc-gray-light rounded-xl p-6 space-y-4">
            <Label className="text-lg font-medium text-cc-dark">
              Você já utiliza alguma solução de chatbot/CRM?
            </Label>
            <div className="space-y-3">
              {solutions.map((solution, index) => (
                <motion.div
                  key={solution}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <Checkbox
                    id={solution}
                    checked={formData.existingSolutions.includes(solution)}
                    onCheckedChange={(checked) => handleSolutionChange(solution, checked === true)}
                    className="mt-1 data-[state=checked]:bg-cc-green data-[state=checked]:border-cc-green"
                  />
                  <label htmlFor={solution} className="text-sm text-cc-dark cursor-pointer leading-relaxed">
                    {solution}
                  </label>
                </motion.div>
              ))}
            </div>
            {error && (
              <motion.p
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-sm text-destructive"
              >
                {error}
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
