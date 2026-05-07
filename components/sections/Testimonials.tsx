import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Quote, ArrowLeft, ArrowRight, MessageCircle } from 'lucide-react';
import { Testimonial, Department } from '../../types';

interface TestimonialsProps {
  testimonials: Testimonial[];
  title: string;
  department?: Department;
}

export const Testimonials: React.FC<TestimonialsProps> = ({ 
  testimonials, 
  title,
  department = Department.DERMATOLOGY
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const isCardio = department === Department.CARDIOLOGY;

  // Auto-play
  useEffect(() => {
    const timer = setInterval(() => {
      handleNext();
    }, 6000);
    return () => clearInterval(timer);
  }, [currentIndex]);

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0,
      scale: 0.95
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 50 : -50,
      opacity: 0,
      scale: 0.95
    })
  };

  return (
    <section className={`py-24 relative overflow-hidden ${
      isCardio ? 'bg-brand-blue' : 'bg-brand-surface'
    }`}>
      {/* Background Decor */}
      {isCardio ? (
        <>
          {/* Medical Grid */}
          <div className="absolute inset-0 opacity-[0.05]" 
               style={{ 
                 backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', 
                 backgroundSize: '30px 30px' 
               }} 
          />
          <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-brand-cardioHighlight/10 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[80px] pointer-events-none" />
        </>
      ) : (
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-beige rounded-full blur-3xl opacity-50 pointer-events-none" />
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Heading & Controls */}
          <div className="lg:col-span-5 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-6 ${
                isCardio 
                  ? 'bg-blue-900/50 text-brand-cardioHighlight border border-blue-800' 
                  : 'bg-brand-beige text-brand-blue'
              }`}>
                <MessageCircle size={12} />
                <span>Success Stories</span>
              </div>
              
              <h2 className={`text-4xl md:text-5xl font-bold mb-6 font-sans leading-tight ${
                isCardio ? 'text-white' : 'text-brand-blue'
              }`}>
                {title}
              </h2>
              
              <p className={`text-lg mb-10 leading-relaxed ${
                isCardio ? 'text-blue-200' : 'text-gray-600'
              }`}>
                Real stories from our patients who have experienced our care and expertise firsthand. Your health journey is our priority.
              </p>

              {/* Navigation Buttons (Desktop) */}
              <div className="hidden lg:flex gap-4">
                <button 
                  onClick={handlePrev}
                  className={`p-4 rounded-full border transition-all duration-300 group ${
                    isCardio 
                      ? 'border-white/20 text-white hover:bg-white hover:text-brand-blue' 
                      : 'border-brand-blue/20 text-brand-blue hover:bg-brand-blue hover:text-white'
                  }`}
                  aria-label="Previous Testimonial"
                >
                  <ArrowLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
                </button>
                <button 
                  onClick={handleNext}
                  className={`p-4 rounded-full border transition-all duration-300 group ${
                    isCardio 
                      ? 'border-white/20 text-white hover:bg-white hover:text-brand-blue' 
                      : 'border-brand-blue/20 text-brand-blue hover:bg-brand-blue hover:text-white'
                  }`}
                  aria-label="Next Testimonial"
                >
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Testimonial Card */}
          <div className="lg:col-span-7 relative">
            <div className="relative min-h-[400px] lg:h-[450px] flex items-center">
              <AnimatePresence initial={false} custom={direction} mode="wait">
                <motion.div
                  key={currentIndex}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 }
                  }}
                  className={`w-full relative p-8 md:p-12 rounded-3xl shadow-2xl ${
                    isCardio 
                      ? 'bg-white/10 backdrop-blur-md border border-white/20' 
                      : 'bg-white border border-gray-100'
                  }`}
                >
                  {/* Large Quote Icon Watermark */}
                  <Quote className={`absolute top-8 right-8 w-24 h-24 rotate-180 opacity-10 pointer-events-none ${
                    isCardio ? 'text-white' : 'text-brand-blue'
                  }`} />

                  {/* Rating */}
                  <div className="flex gap-1 mb-8">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        size={20} 
                        fill={i < testimonials[currentIndex].rating ? "currentColor" : "none"} 
                        className={
                          i < testimonials[currentIndex].rating 
                            ? (isCardio ? "text-brand-cardioHighlight" : "text-yellow-500") 
                            : (isCardio ? "text-blue-800" : "text-gray-200")
                        }
                      />
                    ))}
                  </div>

                  {/* Text */}
                  <p className={`text-xl md:text-2xl font-medium leading-relaxed mb-8 relative z-10 ${
                    isCardio ? 'text-white' : 'text-gray-800'
                  }`}>
                    "{testimonials[currentIndex].text}"
                  </p>

                  {/* Profile Section */}
                  <div className="flex items-center gap-4">
                    {/* Initials Avatar */}
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold uppercase shadow-sm ${
                      isCardio 
                        ? 'bg-brand-cardioHighlight text-white' 
                        : 'bg-brand-beige text-brand-blue'
                    }`}>
                      {testimonials[currentIndex].name.charAt(0)}
                    </div>
                    
                    <div>
                      <h4 className={`font-bold text-lg ${
                        isCardio ? 'text-white' : 'text-brand-blue'
                      }`}>
                        {testimonials[currentIndex].name}
                      </h4>
                      {testimonials[currentIndex].treatment && (
                        <p className={`text-sm ${
                          isCardio ? 'text-blue-200' : 'text-gray-500'
                        }`}>
                          Patient for <span className="font-semibold">{testimonials[currentIndex].treatment}</span>
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Mobile Nav */}
            <div className="flex lg:hidden justify-center gap-4 mt-8">
                <button 
                  onClick={handlePrev}
                  className={`p-3 rounded-full border transition-all ${
                    isCardio 
                      ? 'border-white/20 text-white' 
                      : 'border-brand-blue/20 text-brand-blue'
                  }`}
                  aria-label="Previous"
                >
                  <ArrowLeft size={20} />
                </button>
                <button 
                  onClick={handleNext}
                  className={`p-3 rounded-full border transition-all ${
                    isCardio 
                      ? 'border-white/20 text-white' 
                      : 'border-brand-blue/20 text-brand-blue'
                  }`}
                  aria-label="Next"
                >
                  <ArrowRight size={20} />
                </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};