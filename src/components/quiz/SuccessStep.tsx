import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Check, ClipboardList, Settings, Rocket, MessageCircle, ArrowLeft, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { celebrateSuccess } from '@/utils/confetti';

export function SuccessStep() {
  const [displayedText, setDisplayedText] = useState('');
  const fullText = 'Cadastro enviado com sucesso!';

  useEffect(() => {
    // Trigger confetti cascade
    celebrateSuccess();

    // Typing effect
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

  const timelineItems = [
    {
      icon: ClipboardList,
      title: '1. Análise das Informações',
      description: 'Nossa equipe está revisando todos os dados',
    },
    {
      icon: Settings,
      title: '2. Configuração Técnica',
      description: 'Vamos configurar os fluxos e personalidade',
    },
    {
      icon: Rocket,
      title: '3. Lançamento',
      description: 'Em até 7 dias seu assistente estará pronto!',
    },
  ];

  return (
    <div className="min-h-screen bg-cc-black flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="w-full max-w-xl bg-cc-white rounded-2xl p-8 md:p-12 text-center space-y-8 border-2 border-cc-green pulse-green"
      >
        {/* Animated Check */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, delay: 0.8 }}
          className="w-20 h-20 mx-auto bg-cc-green rounded-full flex items-center justify-center glow-green"
        >
          <Check className="w-10 h-10 text-cc-black" />
        </motion.div>

        {/* Falling emojis */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 100, delay: 1.2 }}
          className="text-3xl"
        >
          🎉 🎉
        </motion.div>

        {/* Title with typing effect */}
        <h1 className="text-2xl md:text-3xl font-bold text-cc-dark min-h-[2.5rem]">
          {displayedText}
          {displayedText.length < fullText.length && (
            <span className="animate-pulse">|</span>
          )}
        </h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="text-cc-gray-text"
        >
          Obrigado pelas informações. Em até <strong>24 horas</strong>, nossa equipe entrará em contato para dar início ao processo de criação e implementação do seu assistente de IA.
        </motion.p>

        {/* Timeline */}
        <div className="space-y-4 pt-4">
          {timelineItems.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.2 + index * 0.2, duration: 0.4 }}
              className="flex items-start gap-4 text-left bg-cc-gray-light p-4 rounded-xl"
            >
              <div className="w-10 h-10 bg-cc-green/10 rounded-full flex items-center justify-center flex-shrink-0">
                <item.icon className="w-5 h-5 text-cc-green" />
              </div>
              <div>
                <p className="font-medium text-cc-dark">{item.title}</p>
                <p className="text-sm text-cc-gray-text">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Buttons */}
        <div className="space-y-3 pt-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3 }}
          >
            <a
              href="https://wa.me/5562996320162"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                size="lg"
                className="w-full bg-cc-green text-cc-black font-semibold text-lg py-6 
                           hover:scale-105 hover:shadow-lg hover:shadow-cc-green/30 
                           transition-all duration-200 glow-green"
              >
                <motion.span
                  animate={{ scale: [1, 1.02, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="flex items-center gap-2"
                >
                  <MessageCircle className="w-5 h-5" />
                  💬 Falar com Suporte no WhatsApp
                </motion.span>
              </Button>
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3.2 }}
          >
            <a
              href="https://companychat.com.br"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                variant="outline"
                size="lg"
                className="w-full border-cc-green text-cc-green hover:bg-cc-green/10 py-6"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                ← Voltar ao Site
              </Button>
            </a>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3.5 }}
          className="text-xs text-cc-gray-text flex items-center justify-center gap-2"
        >
          <Lock className="w-3 h-3" />
          Seus dados foram recebidos com segurança | CompanyChat IA © 2026
        </motion.p>
      </motion.div>
    </div>
  );
}
