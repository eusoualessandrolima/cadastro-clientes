import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { fireConfetti } from '@/utils/confetti';

interface WelcomeStepProps {
  onNext: () => void;
}

export function WelcomeStep({ onNext }: WelcomeStepProps) {
  const [displayedText, setDisplayedText] = useState('');
  const fullText = 'Bem-vindo(a) 🎉';

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index <= fullText.length) {
        setDisplayedText(fullText.slice(0, index));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 50);

    return () => clearInterval(interval);
  }, []);

  const handleStart = () => {
    fireConfetti();
    setTimeout(onNext, 300);
  };

  return (
    <div className="fixed inset-0 bg-cc-black overflow-hidden">
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-cc-green rounded-full opacity-30"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              y: [null, Math.random() * window.innerHeight],
              x: [null, Math.random() * window.innerWidth],
            }}
            transition={{
              duration: 10 + Math.random() * 10,
              repeat: Infinity,
              repeatType: 'reverse',
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* Card */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="glass w-full max-w-lg rounded-2xl p-8 md:p-12 text-center"
        >
          {/* Title with typing effect */}
          <h1 className="text-2xl md:text-3xl font-bold text-cc-dark mb-4 min-h-[2.5rem]">
            {displayedText}
            {displayedText.length < fullText.length && (
              <span className="animate-pulse">|</span>
            )}
          </h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="text-lg text-cc-dark mb-4"
          >
            Você está a poucos passos de revolucionar seu atendimento com Inteligência Artificial.
          </motion.p>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
            className="text-cc-gray-text mb-8"
          >
            Preencha as informações estratégicas para criarmos uma solução{' '}
            <strong>100% personalizada</strong> para o seu negócio.
          </motion.p>

          {/* Button */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.5 }}
          >
            <Button
              onClick={handleStart}
              size="lg"
              className="bg-cc-green text-cc-black font-semibold text-lg px-8 py-6 
                         hover:scale-105 hover:shadow-lg hover:shadow-cc-green/30 
                         transition-all duration-200 glow-green"
            >
              Começar →
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
