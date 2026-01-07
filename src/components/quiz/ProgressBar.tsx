import { motion } from 'framer-motion';

interface ProgressBarProps {
  progress: number;
  label: string;
}

export function ProgressBar({ progress, label }: ProgressBarProps) {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-cc-black/90 backdrop-blur-sm border-b border-cc-dark">
      <div className="max-w-3xl mx-auto px-4 py-3">
        {/* Label */}
        <p className="text-sm text-cc-gray-text mb-2">{label}</p>
        
        {/* Progress bar */}
        <div className="h-2 bg-cc-dark rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-cc-green rounded-full glow-green"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
          />
        </div>
        
        {/* Percentage */}
        <motion.p
          className="text-right text-xs text-cc-green mt-1"
          key={progress}
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
        >
          {progress}%
        </motion.p>
      </div>
    </div>
  );
}
