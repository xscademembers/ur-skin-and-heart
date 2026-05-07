import React from 'react';
import { motion } from 'framer-motion';
import { Award, Check, GraduationCap, Star, ShieldCheck } from 'lucide-react';
import { DoctorDetails, Department } from '../../types';

interface DoctorProfileProps {
  doctor: DoctorDetails;
  department?: Department;
}

export const DoctorProfile: React.FC<DoctorProfileProps> = ({
  doctor,
  department = Department.DERMATOLOGY
}) => {
  const isCardio = department === Department.CARDIOLOGY;

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <section className={`py-24 lg:py-32 relative overflow-hidden ${isCardio ? 'bg-white' : 'bg-[#FAF9F6]'
      }`}>
      {/* Dynamic Background Elements */}
      {isCardio ? (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-slate-50 -skew-x-12 translate-x-20" />
          <div className="absolute bottom-20 left-20 w-64 h-64 border-4 border-blue-50 rounded-full opacity-50" />
          <div className="absolute top-40 right-40 w-32 h-32 bg-blue-100/30 rounded-full blur-2xl" />
        </div>
      ) : (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-1/2 h-full bg-[#F2F0E9] rounded-r-[100px]" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-brand-beige/30 rounded-full blur-3xl" />
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-16 lg:gap-24">

          {/* LEFT COLUMN: IMAGE & VISUALS */}
          <div className="w-full lg:w-5/12 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="relative z-10"
            >
              {/* Main Image Frame */}
              <div className={`relative aspect-[3/4] rounded-[2rem] overflow-hidden shadow-2xl ${isCardio ? 'shadow-blue-900/10' : 'shadow-stone-900/10'
                }`}>
                <img
                  src={doctor.image}
                  alt={doctor.name}
                  className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-700 ease-in-out"
                />

                {/* Gradient Overlay for Text Readability if needed */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-60" />
              </div>

              {/* Animated Rotating Badge (Seal of Excellence) */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                className={`absolute -top-12 -left-12 w-40 h-40 z-0 hidden md:flex items-center justify-center`}
              >
                <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
                  <path
                    id="curve"
                    d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
                    fill="transparent"
                  />
                  <text className={`text-[11px] font-bold uppercase tracking-[0.2em] ${isCardio ? 'fill-blue-200' : 'fill-stone-300'
                    }`}>
                    <textPath href="#curve">
                      Board Certified • Specialist • Trusted Care •
                    </textPath>
                  </text>
                </svg>
                {/* Center Icon of Badge */}
                <div className={`absolute inset-0 m-auto w-16 h-16 rounded-full flex items-center justify-center shadow-sm ${isCardio ? 'bg-blue-50 text-brand-blue' : 'bg-[#EAE6DB] text-stone-600'
                  }`}>
                  <Star fill="currentColor" size={24} />
                </div>
              </motion.div>

              {/* Floating Glass Stats Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className={`absolute bottom-8 right-0 md:-right-12 p-6 rounded-2xl backdrop-blur-md border shadow-xl max-w-[240px] ${isCardio
                    ? 'bg-white/90 border-blue-100'
                    : 'bg-white/90 border-stone-100'
                  }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-full shrink-0 ${isCardio ? 'bg-blue-600 text-white' : 'bg-stone-800 text-white'
                    }`}>
                    <Award size={20} />
                  </div>
                  <div>
                    <p className="text-3xl font-bold leading-none mb-1">15+</p>
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Years of Experience</p>
                  </div>
                </div>
              </motion.div>

            </motion.div>
          </div>

          {/* RIGHT COLUMN: CONTENT */}
          <div className="w-full lg:w-7/12 pt-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
              }}
            >
              {/* Eyebrow */}
              <motion.div variants={fadeInUp} className="flex items-center gap-3 mb-6">
                <span className={`h-px w-12 ${isCardio ? 'bg-brand-cardioHighlight' : 'bg-stone-400'}`} />
                <span className={`text-sm font-bold uppercase tracking-[0.2em] ${isCardio ? 'text-brand-cardioHighlight' : 'text-stone-500'
                  }`}>
                  Meet The Expert
                </span>
              </motion.div>

              {/* Name & Title */}
              <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl lg:text-6xl font-bold text-brand-blue mb-4 font-sans tracking-tight">
                {doctor.name}
              </motion.h2>

              <motion.div variants={fadeInUp} className="flex flex-wrap items-center gap-4 mb-10">
                <div className={`px-4 py-1.5 rounded-full text-sm font-semibold border ${isCardio
                    ? 'bg-blue-50 text-blue-800 border-blue-100'
                    : 'bg-stone-100 text-stone-800 border-stone-200'
                  }`}>
                  {doctor.title}
                </div>
                <div className="flex items-center gap-2 text-gray-500 text-sm font-medium">
                  <GraduationCap size={18} />
                  <span>{doctor.qualifications}</span>
                </div>
              </motion.div>

              {/* Bio Text */}
              <motion.p variants={fadeInUp} className="text-lg md:text-xl text-gray-600 leading-relaxed mb-10 font-body max-w-2xl">
                {doctor.description}
              </motion.p>

              {/* Divider */}
              <motion.hr variants={fadeInUp} className={`border-t mb-10 ${isCardio ? 'border-blue-100' : 'border-stone-200'}`} />

              {/* Achievements / Credentials */}
              <motion.div variants={fadeInUp}>
                <h4 className={`text-sm font-bold uppercase tracking-widest mb-6 ${isCardio ? 'text-gray-400' : 'text-stone-400'
                  }`}>
                  Distinctions & Expertise
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                  {doctor.awards?.map((award, index) => (
                    <div key={index} className="flex items-start gap-3 group">
                      <div className={`mt-1 shrink-0 transition-colors ${isCardio ? 'text-brand-cardioHighlight group-hover:text-blue-600' : 'text-brand-blue group-hover:text-stone-600'
                        }`}>
                        {isCardio ? <ShieldCheck size={20} /> : <Check size={20} strokeWidth={3} />}
                      </div>
                      <span className="text-gray-700 font-medium group-hover:text-black transition-colors">
                        {award}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Signature Area (Optional Visual Touch) */}
              <motion.div variants={fadeInUp} className="mt-12 opacity-80">
                {/* This represents a signature - using a handwriting font or image would be ideal here */}
                <div className={`text-3xl font-light italic opacity-60 ${isCardio ? 'text-blue-900' : 'text-stone-800'}`} style={{ fontFamily: 'cursive' }}>
                  {doctor.name.split(' ')[1]}
                </div>
              </motion.div>

            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};