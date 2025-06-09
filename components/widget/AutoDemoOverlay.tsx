import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Sparkles } from 'lucide-react';

export interface DemoConfig {
  uploadMessage: string;
  generationMessage: string;
}

interface AutoDemoOverlayProps {
  onDismiss: () => void;
  config: DemoConfig;
}

export function AutoDemoOverlay({ onDismiss, config }: AutoDemoOverlayProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isDismissed, setIsDismissed] = useState(false);

  // Auto-advance steps
  useEffect(() => {
    if (isDismissed) return;

    const timer = setInterval(() => {
      setCurrentStep((prev) => (prev >= 1 ? 0 : prev + 1));
    }, 4000); // Change step every 4 seconds

    return () => clearInterval(timer);
  }, [isDismissed]);

  const handleDismiss = () => {
    setIsDismissed(true);
    onDismiss();
  };

  return (
    <AnimatePresence>
      {!isDismissed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleDismiss}
          className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm"
        >
          <AnimatePresence mode="wait">
            {currentStep === 0 && (
              <motion.div
                key="upload"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="absolute z-50"
                style={{
                  // Position this over the upload area
                  top: '20%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)'
                }}
              >
                <div className="bg-white rounded-lg shadow-lg p-4 flex items-center gap-3">
                  <Upload className="text-blue-500" />
                  <p className="text-gray-700">{config.uploadMessage}</p>
                </div>
              </motion.div>
            )}
            {currentStep === 1 && (
              <motion.div
                key="generate"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="absolute z-50"
                style={{
                  // Position this over the generation area
                  bottom: '30%',
                  right: '20%',
                }}
              >
                <div className="bg-white rounded-lg shadow-lg p-4 flex items-center gap-3">
                  <Sparkles className="text-blue-500" />
                  <p className="text-gray-700">{config.generationMessage}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 