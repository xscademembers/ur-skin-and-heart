import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/Button';
import { ArrowRight, Activity } from 'lucide-react';
import { Department } from '../../types';

interface HeroProps {
  title: string;
  subtitle: string;
  ctaText: string;
  imageSrc: string;
  department?: Department;
  onCtaClick?: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  title,
  subtitle,
  ctaText,
  imageSrc,
  department = Department.DERMATOLOGY,
  onCtaClick
}) => {
  const isCardio = department === Department.CARDIOLOGY;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20
      }
    }
  };

  const handleScroll = () => {
    if (onCtaClick) {
      onCtaClick();
    } else {
      document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
      {/* Background Elements for Cardiology */}
      {isCardio && (
        <div className="absolute inset-0 pointer-events-none">
          {/* Medical Grid Pattern */}
          <div className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: 'linear-gradient(#003764 1px, transparent 1px), linear-gradient(90deg, #003764 1px, transparent 1px)',
              backgroundSize: '40px 40px'
            }}
          />

          {/* Animated ECG Line */}
          <div className="absolute top-1/3 left-0 right-0 h-32 opacity-10 flex items-center overflow-hidden">
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
              className="w-full h-full bg-gradient-to-r from-transparent via-brand-blue to-transparent transform skew-x-12"
              style={{ width: '50%' }}
            />
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Text Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="relative"
          >
            <motion.div
              variants={itemVariants}
              className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-sm font-semibold mb-6 ${isCardio
                  ? 'bg-blue-50 border-blue-200 text-brand-blue'
                  : 'bg-brand-blue/5 border-brand-blue/10 text-brand-blue'
                }`}
            >
              {isCardio && <Activity size={14} className="animate-pulse" />}
              {isCardio ? "Heart Health Center" : "Premium Medical Care"}
            </motion.div>

            <motion.h1 variants={itemVariants} className="text-4xl md:text-5xl lg:text-6xl font-bold font-sans text-brand-blue leading-[1.1] mb-6 tracking-tight">
              {title}
            </motion.h1>

            <motion.p variants={itemVariants} className="text-lg md:text-xl text-gray-600 mb-8 max-w-lg font-body leading-relaxed">
              {subtitle}
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-wrap gap-4">
              <Button onClick={handleScroll} className="gap-2 shadow-lg shadow-blue-900/10">
                {ctaText} <ArrowRight size={18} />
              </Button>
              <Button variant="outline" onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}>
                Explore Services
              </Button>
            </motion.div>
          </motion.div>

          {/* Visual Content */}
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative lg:h-[600px] flex items-center justify-center"
          >
            {/* Decorative Background Blob */}
            <div
              className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] rounded-full blur-3xl -z-10 ${isCardio ? 'bg-blue-400/20' : 'bg-white/40'
                }`}
            />

            <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-[4/5] lg:aspect-auto lg:h-full w-full max-w-md mx-auto border-4 border-white/50">
              <img
                src={imageSrc}
                alt="Doctor treating patient"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-blue/50 to-transparent" />

              {/* Floating Card for Cardio */}
              {isCardio && (
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-blue-100"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-500">
                      <Activity size={20} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-semibold uppercase">Emergency Response</p>
                      <p className="text-sm font-bold text-brand-blue">Available 24/7</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};