import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/Button';
import { ArrowRight, Sparkles } from 'lucide-react';

interface HeroDermatologyProps {
  title: string;
  subtitle: string;
  ctaText: string;
  imageSrc: string;
  onCtaClick?: () => void;
}

export const HeroDermatology: React.FC<HeroDermatologyProps> = ({
  title,
  subtitle,
  ctaText,
  imageSrc,
  onCtaClick
}) => {

  const handleScroll = () => {
    if (onCtaClick) {
      onCtaClick();
    } else {
      document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden bg-gradient-to-br from-[#FFF8F6] via-[#FFF1EE] to-[#FDF2F8]">
      {/* Organic Background Shapes */}
      <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-orange-100/40 blur-3xl mix-blend-multiply filter pointer-events-none" />
      <div className="absolute bottom-[10%] right-[-5%] w-[400px] h-[400px] rounded-full bg-rose-100/40 blur-3xl mix-blend-multiply filter pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">

          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-start text-left"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFF0EB] border border-[#FFDCCF] text-brand-gold text-sm font-semibold tracking-wide mb-8 shadow-sm">
              <Sparkles size={14} className="text-brand-gold" />
              <span>Premium Aesthetic Care</span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-sans text-brand-darkBlue leading-[1.1] mb-6 tracking-tight">
              {title}
            </h1>

            <p className="text-lg md:text-xl text-brand-darkBlue/80 mb-10 max-w-lg font-body leading-relaxed opacity-90">
              {subtitle}
            </p>

            <div className="flex flex-wrap gap-4 w-full sm:w-auto">
              <Button
                onClick={handleScroll}
                className="w-full sm:w-auto gap-2 shadow-xl shadow-orange-900/10 py-6 px-8 text-lg bg-brand-darkBlue hover:bg-brand-blue text-white border-none"
              >
                {ctaText} <ArrowRight size={20} />
              </Button>
              <Button
                variant="outline"
                onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
                className="w-full sm:w-auto py-6 px-8 text-lg border-brand-gold text-brand-darkBlue hover:bg-[#FFF0EB] hover:text-brand-blue"
              >
                Explore Services
              </Button>
            </div>
          </motion.div>

          {/* Visual Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative lg:h-[700px] w-full flex items-center justify-center lg:justify-end"
          >
            {/* Main Image with Organic Mask/Border */}
            <div className="relative w-full max-w-[500px] aspect-[4/5] z-10">
              <div className="absolute inset-0 rounded-[3rem] transform rotate-3 bg-[#EAD8D0] opacity-30 scale-105" />
              <div className="absolute inset-0 rounded-[3rem] transform -rotate-2 bg-[#F2C9B8] opacity-20 scale-105" />

              <div className="relative h-full w-full rounded-[2.5rem] overflow-hidden shadow-2xl shadow-orange-900/10 border-[6px] border-white">
                <img
                  src={imageSrc}
                  alt="Aesthetic Treatment"
                  className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-[1.5s]"
                />
                {/* Gentle Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#43291F]/30 to-transparent mix-blend-multiply" />
              </div>

              {/* Floating Badge */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="absolute bottom-4 left-4 lg:bottom-8 lg:-left-8 bg-white/95 backdrop-blur-md p-5 rounded-2xl shadow-xl border border-rose-100 max-w-[200px]"
              >
                <div className="flex flex-col gap-1">
                  <span className="text-[#9A3412] font-bold text-3xl">Top 1%</span>
                  <span className="text-xs text-[#5D4037] font-medium uppercase tracking-wider">Dermatologists in Region</span>
                </div>
              </motion.div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
