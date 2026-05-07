import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ServiceItem, Department } from '../../types';

interface ServiceCardProps {
  service: ServiceItem;
  index: number;
  department?: Department;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  index,
  department = Department.DERMATOLOGY
}) => {
  const isCardio = department === Department.CARDIOLOGY;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`group relative flex flex-col justify-between p-8 h-full transition-all duration-500 overflow-hidden ${isCardio
          ? 'bg-white rounded-xl shadow-lg hover:shadow-blue-500/20 hover:-translate-y-1'
          : 'bg-white rounded-[2rem] border border-stone-100 hover:border-brand-beige shadow-soft hover:shadow-hover hover:-translate-y-1'
        }`}
    >
      {/* Cardio Tech Accent Line */}
      {isCardio && (
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-brand-cardioHighlight to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      )}

      {/* Header: Icon & Index */}
      <div className="flex justify-between items-start mb-6 relative z-10">
        <div className={`p-3 rounded-2xl transition-colors duration-300 ${isCardio
            ? 'bg-blue-50 text-brand-cardioHighlight group-hover:bg-brand-cardioHighlight group-hover:text-white'
            : 'bg-[#F5F3EF] text-brand-darkBlue group-hover:bg-brand-beige'
          }`}>
          {service.icon}
        </div>
        <span className={`text-4xl font-semibold opacity-10 font-sans select-none transition-opacity duration-300 group-hover:opacity-20 ${isCardio ? 'text-brand-blue' : 'text-brand-gold'
          }`}>
          {String(index + 1).padStart(2, '0')}
        </span>
      </div>

      {/* Content Body */}
      <div className="relative z-10 mb-8">
        <h3 className={`text-xl font-bold mb-3 transition-colors ${isCardio ? 'text-gray-900 group-hover:text-brand-cardioHighlight' : 'text-brand-darkBlue'
          }`}>
          {service.title}
        </h3>
        <p className="text-gray-500 text-sm leading-relaxed">
          {service.description}
        </p>
      </div>

      {/* Footer Action */}
      <Link to="/contact" className="mt-auto pt-6 border-t border-gray-100 flex items-center justify-between relative z-10 cursor-pointer">
        <span className={`text-xs font-bold uppercase tracking-widest transition-colors ${isCardio ? 'text-gray-400 group-hover:text-brand-cardioHighlight' : 'text-brand-gold group-hover:text-brand-darkBlue'
          }`}>
          Details
        </span>
        <div className={`transform transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 ${isCardio ? 'text-brand-cardioHighlight opacity-0 group-hover:opacity-100' : 'text-brand-darkBlue opacity-50 group-hover:opacity-100'
          }`}>
          <ArrowUpRight size={18} />
        </div>
      </Link>

      {/* Background Hover Decoration */}
      <div className={`absolute -bottom-24 -right-24 w-48 h-48 rounded-full blur-3xl transition-opacity duration-500 opacity-0 group-hover:opacity-100 pointer-events-none ${isCardio ? 'bg-blue-100' : 'bg-brand-beige'
        }`} />
    </motion.div>
  );
};