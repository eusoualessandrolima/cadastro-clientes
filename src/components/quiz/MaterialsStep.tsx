import { motion } from 'framer-motion';
import { useState, useCallback } from 'react';
import { Upload, X, FileText } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { ProgressBar } from './ProgressBar';
import { FormData } from '@/types/quiz';
import { celebrateExcellent, microConfetti } from '@/utils/confetti';

interface MaterialsStepProps {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
  onNext: () => void;
  onBack?: () => void;
}

export function MaterialsStep({ formData, updateFormData, onNext, onBack }: MaterialsStepProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [hasShownExcellent, setHasShownExcellent] = useState(false);

  const charCount = formData.additionalInfo.length;
  const wordCount = formData.additionalInfo.trim() ? formData.additionalInfo.trim().split(/\s+/).length : 0;

  const getQualityStatus = () => {
    if (charCount < 200) return { text: 'Insuficiente 😕', color: 'text-destructive' };
    if (charCount < 500) return { text: 'Básica ⭐', color: 'text-cc-warning' };
    if (charCount < 1000) return { text: 'Boa ⭐⭐⭐', color: 'text-cc-gold' };
    return { text: 'Excelente ⭐⭐⭐⭐⭐', color: 'text-cc-green' };
  };

  const quality = getQualityStatus();

  // Trigger confetti for excellent quality
  if (charCount >= 1000 && !hasShownExcellent) {
    setHasShownExcellent(true);
    celebrateExcellent();
  }

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      handleFiles(files);
    }
  };

  const handleFiles = (files: File[]) => {
    const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain', 'image/jpeg', 'image/png'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    const validFiles = files.filter(file => {
      if (!validTypes.includes(file.type)) {
        console.warn(`Invalid file type: ${file.type}`);
        return false;
      }
      if (file.size > maxSize) {
        console.warn(`File too large: ${file.name}`);
        return false;
      }
      return true;
    });

    if (validFiles.length > 0) {
      microConfetti();
      updateFormData({ uploadedFiles: [...formData.uploadedFiles, ...validFiles] });
    }
  };

  const removeFile = (index: number) => {
    const newFiles = formData.uploadedFiles.filter((_, i) => i !== index);
    updateFormData({ uploadedFiles: newFiles });
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="min-h-screen bg-cc-black">
      <ProgressBar progress={90} label="Bloco 4 de 4 - Materiais e Informações" />

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
                Últimos detalhes! 🎯
              </span>
            </div>
          </motion.div>

          {/* Additional Info */}
          <div className="bg-cc-gray-light rounded-xl p-6 space-y-4">
            <Label className="text-lg font-medium text-cc-dark">
              Informações adicionais sobre produtos/serviços
            </Label>
            <Textarea
              value={formData.additionalInfo}
              onChange={(e) => updateFormData({ additionalInfo: e.target.value })}
              placeholder={`Descreva seus principais produtos, diferenciação, promoções, políticas. Exemplo:
- Temos 3 planos: Básico (R$ 99), Pro (R$ 199), Enterprise (sob consulta)
- Entrega em 24h para capital e 48h para interior
- Garantia de 30 dias`}
              className="min-h-[200px] resize-y"
            />
            <div className="flex justify-between items-center text-sm">
              <span className="text-cc-gray-text">
                {charCount} caracteres | {wordCount} palavras
              </span>
              <span className={quality.color}>{quality.text}</span>
            </div>
          </div>

          {/* File Upload */}
          <div className="bg-cc-gray-light rounded-xl p-6 space-y-4">
            <Label className="text-lg font-medium text-cc-dark">
              Upload de arquivos (opcional)
            </Label>
            
            <motion.div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              animate={isDragOver ? { scale: 1.02 } : { scale: 1 }}
              className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${
                isDragOver
                  ? 'border-cc-green bg-cc-green/5'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <input
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                onChange={handleFileSelect}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              
              {isDragOver ? (
                <div className="text-cc-green">
                  <Upload className="w-12 h-12 mx-auto mb-2 animate-bounce" />
                  <p className="text-lg font-medium">✨ Solte aqui! ✨</p>
                </div>
              ) : (
                <div className="text-cc-gray-text">
                  <Upload className="w-12 h-12 mx-auto mb-2" />
                  <p className="text-lg font-medium text-cc-dark">
                    ☁️ Arraste arquivos aqui ou clique para selecionar
                  </p>
                  <p className="text-sm mt-2">
                    PDF, DOCX, TXT, JPG, PNG (máx. 10MB por arquivo)
                  </p>
                </div>
              )}
            </motion.div>

            {/* Uploaded Files */}
            {formData.uploadedFiles.length > 0 && (
              <div className="space-y-2">
                {formData.uploadedFiles.map((file, index) => (
                  <motion.div
                    key={`${file.name}-${index}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-cc-green" />
                      <div>
                        <p className="text-sm font-medium text-cc-dark">{file.name}</p>
                        <p className="text-xs text-cc-gray-text">{formatFileSize(file.size)}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFile(index)}
                      className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <X className="w-4 h-4 text-cc-gray-text" />
                    </button>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-4">
            {onBack && (
              <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  onClick={onBack}
                  variant="outline"
                  className="w-full bg-cc-dark hover:bg-cc-dark/80 border-cc-gray-text/30 text-cc-white font-semibold text-lg py-6"
                >
                  ← Voltar
                </Button>
              </motion.div>
            )}
            <motion.div className={onBack ? "flex-1" : "w-full"} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                onClick={onNext}
                className="w-full bg-cc-green text-cc-black font-semibold text-lg py-6 hover:bg-cc-green/90 glow-green"
              >
                Continuar →
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
