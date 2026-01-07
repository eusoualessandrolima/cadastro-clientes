import { motion } from 'framer-motion';
import { useEffect } from 'react';

interface LoadingScreenProps {
  onComplete: () => void;
}

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 2000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-cc-black flex flex-col items-center justify-center">
      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-cc-white text-glow-green">
          CompanyChat{' '}
          <span className="text-cc-green">IA</span>
        </h1>
      </motion.div>

      {/* Pulsing glow ring */}
      <motion.div
        className="w-20 h-20 rounded-full border-2 border-cc-green mb-8"
        animate={{
          boxShadow: [
            '0 0 20px hsl(153 100% 50% / 0.4)',
            '0 0 40px hsl(153 100% 50% / 0.6), 0 0 60px hsl(153 100% 50% / 0.3)',
            '0 0 20px hsl(153 100% 50% / 0.4)',
          ],
        }}
        transition={{ duration: 2, repeat: Infinity }}
      />

      {/* Loading bar */}
      <div className="w-64 h-1 bg-cc-dark rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-cc-green to-emerald-400"
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ duration: 1.8, ease: 'easeInOut' }}
        />
      </div>

      {/* Text */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-4 text-cc-gray-text text-sm"
      >
        Preparando sua experiência...
      </motion.p>
    </div>
  );
}
