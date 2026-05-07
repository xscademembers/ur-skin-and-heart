import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/Button';
import { Calendar, Check, Phone, Mail, Clock, ShieldCheck, MapPin, ChevronDown, ExternalLink } from 'lucide-react';
import { Department } from '../../types';
import { contactSubmitUserMessage } from '../../contactSubmitMessage';

interface ContactFormProps {
  department: Department;
  options: string[]; // Concerns or Symptoms
  optionsLabel: string;
}

export const ContactForm: React.FC<ContactFormProps> = ({ department, options, optionsLabel }) => {
  const [formState, setFormState] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [submitError, setSubmitError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    date: '',
    concern: ''
  });

  const isCardio = department === Department.CARDIOLOGY;
  const isGeneral = department === Department.GENERAL;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormState('submitting');
    setSubmitError('');

    let preferredDate: string | undefined;
    if (formData.date) {
      const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(formData.date);
      if (m) {
        const y = Number(m[1]);
        const mo = Number(m[2]);
        const d = Number(m[3]);
        const dt = new Date(y, mo - 1, d, 12, 0, 0);
        if (!Number.isNaN(dt.getTime())) preferredDate = dt.toISOString();
      }
    }

    const body: Record<string, string | undefined> = {
      name: formData.name,
      phone: formData.phone,
      subject: formData.concern,
      source:
        department === Department.CARDIOLOGY
          ? 'Cardiology'
          : department === Department.DERMATOLOGY
            ? 'Dermatology'
            : 'General',
    };
    if (preferredDate) body.preferredDate = preferredDate;

    try {
      const response = await fetch('/api/contacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok) {
        setFormState('success');
        setFormData({
          name: '',
          phone: '',
          date: '',
          concern: ''
        });
      } else {
        const msg = contactSubmitUserMessage(response.status, typeof data.message === 'string' ? data.message : undefined);
        console.error('Submission failed', response.status, data);
        setSubmitError(msg);
        setFormState('error');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitError(contactSubmitUserMessage(0));
      setFormState('error');
    }
  };

  const inputClasses = `w-full px-5 py-4 rounded-xl border outline-none transition-all duration-300 text-gray-700 placeholder-gray-400 font-medium ${isCardio
    ? 'border-gray-200 bg-gray-50 focus:bg-white focus:border-brand-cardioHighlight focus:ring-4 focus:ring-blue-500/10'
    : isGeneral
      ? 'border-gray-200 bg-gray-50 focus:bg-white focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/5'
      : 'border-gray-200 bg-[#FBFBF9] focus:bg-white focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/5'
    }`;

  const labelClasses = "block text-sm font-bold text-gray-700 mb-2 ml-1";

  return (
    <section id="contact-form" className={`py-24 lg:py-32 relative overflow-hidden ${isCardio ? 'bg-slate-50' : isGeneral ? 'bg-white' : 'bg-[#F4F2ED]'
      }`}>
      {/* Abstract Background Decor */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white rounded-full mix-blend-overlay blur-3xl opacity-50 pointer-events-none translate-x-1/3 -translate-y-1/3" />
      {isCardio && (
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-blue-100/30 to-transparent pointer-events-none" />
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">

          {/* LEFT COLUMN: Context & Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="pt-8"
          >
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-6 ${isCardio
              ? 'bg-blue-100 text-brand-cardioHighlight'
              : isGeneral
                ? 'bg-gray-100 text-gray-600'
                : 'bg-white text-brand-blue shadow-sm'
              }`}>
              <Clock size={12} />
              <span>Easy Scheduling</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold text-brand-blue mb-6 font-sans leading-tight">
              Ready to prioritize <br />
              <span className={isCardio ? 'text-brand-cardioHighlight' : 'opacity-60'}>your health?</span>
            </h2>

            <p className="text-lg text-gray-600 mb-10 leading-relaxed max-w-md">
              Book a consultation with our specialists. We prioritize your comfort and ensure a comprehensive assessment of your needs.
            </p>

            {/* Benefits Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
              {[
                { icon: ShieldCheck, text: "Board Certified Specialists" },
                { icon: Clock, text: "Zero Wait-Time Policy" },
                { icon: Check, text: "Comprehensive Analysis" },
                { icon: Check, text: "Personalized Care Plan" }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className={`p-2 rounded-full shrink-0 ${isCardio ? 'bg-blue-100 text-brand-cardioHighlight' : isGeneral ? 'bg-gray-100 text-brand-blue' : 'bg-brand-beige text-brand-blue'
                    }`}>
                    <item.icon size={16} />
                  </div>
                  <span className="font-semibold text-gray-700 text-sm">{item.text}</span>
                </div>
              ))}
            </div>

            {/* Contact Info Card */}
            <div className={`p-6 rounded-2xl border ${isCardio
              ? 'bg-white border-blue-100 shadow-lg shadow-blue-100/50'
              : isGeneral
                ? 'bg-gray-50 border-gray-100'
                : 'bg-white border-brand-beige shadow-soft'
              }`}>
              <h4 className="font-bold text-brand-blue mb-4">Visit Us</h4>
              <div className="space-y-4">
                <a href="tel:+919381040073" className="flex items-center gap-4 group p-3 rounded-xl transition-colors hover:bg-gray-50">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${isCardio ? 'bg-blue-50 text-brand-cardioHighlight group-hover:bg-brand-cardioHighlight group-hover:text-white' : 'bg-brand-surface text-brand-blue group-hover:bg-brand-blue group-hover:text-white'
                    }`}>
                    <Phone size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Call Us Now</p>
                    <p className="text-lg font-bold text-gray-800">+91 9381040073</p>
                  </div>
                </a>

                <div className="p-3">
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${isCardio ? 'bg-blue-50 text-brand-cardioHighlight' : 'bg-brand-surface text-brand-blue'
                      }`}>
                      <MapPin size={20} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Clinic Location</p>
                      <p className="text-sm font-medium text-gray-800 leading-snug">Ground Floor, #48-3-38, Sri Sai Nilayam,<br />2nd Lane, Rama Talkies Rd, Srinagar,<br />Visakhapatnam, AP 530016</p>
                    </div>
                  </div>

                  {/* Embedded Map */}
                  <a
                    href="https://www.google.com/maps/search/UR+Skin+and+Heart+Clinic+Visakhapatnam"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block relative w-full h-48 rounded-xl overflow-hidden shadow-inner border border-gray-100 group cursor-pointer"
                  >
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3800.4!2d83.2985!3d17.7185!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a39431389e6973f%3A0x92d9c20395498b01!2sRama%20Talkies%20Road%2C%20Srinagar%2C%20Visakhapatnam%2C%20Andhra%20Pradesh%20530016!5e0!3m2!1sen!2sin!4v1703067600000!5m2!1sen!2sin"
                      width="100%"
                      height="100%"
                      style={{ border: 0, pointerEvents: 'none' }}
                      allowFullScreen={false}
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      className="grayscale group-hover:grayscale-0 transition-all duration-700"
                      title="Clinic Location Map"
                    />
                    <span
                      className={`absolute bottom-3 right-3 text-xs font-bold px-3 py-1.5 rounded-full shadow-md flex items-center gap-1 ${isCardio ? 'bg-brand-cardioHighlight text-white' : 'bg-brand-blue text-white'
                        }`}
                    >
                      View Large <ExternalLink size={10} />
                    </span>
                  </a>
                </div>
              </div>
            </div>
          </motion.div>

          {/* RIGHT COLUMN: Form Card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="relative"
          >
            {/* Decorative blob behind card */}
            <div className={`absolute -inset-4 rounded-[2.5rem] blur-xl opacity-40 -z-10 ${isCardio ? 'bg-brand-cardioHighlight' : 'bg-brand-beige'
              }`} />

            <div className="bg-white p-8 md:p-10 rounded-3xl shadow-2xl relative overflow-hidden">
              <AnimatePresence mode="wait">
                {formState === 'success' ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="text-center py-20 flex flex-col items-center justify-center h-full min-h-[500px]"
                  >
                    <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-8 ${isCardio ? 'bg-green-100 text-green-600' : 'bg-brand-beige text-brand-blue'
                      }`}>
                      <Check size={48} strokeWidth={3} />
                    </div>
                    <h3 className="text-3xl font-bold text-brand-blue mb-4">Request Received!</h3>
                    <p className="text-gray-500 max-w-xs mx-auto mb-10">
                      We have received your appointment request. Our team will call you shortly to confirm the time slot.
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setFormState('idle');
                        setSubmitError('');
                      }}
                    >
                      Book Another Appointment
                    </Button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit}
                    className="space-y-6"
                  >
                    <div className="mb-8">
                      <h3 className="text-2xl font-bold text-gray-900">Request Appointment</h3>
                      <p className="text-gray-500 text-sm mt-1">Fill out the form below and we'll get back to you.</p>
                      {formState === 'error' && submitError && (
                        <p className="text-red-600 text-sm mt-3 leading-relaxed">{submitError}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className={labelClasses}>Full Name</label>
                      <input
                        required
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="e.g. John Doe"
                        className={inputClasses}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className={labelClasses}>Phone Number</label>
                        <input
                          required
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="+91 00000 00000"
                          className={inputClasses}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className={labelClasses}>Preferred Date</label>
                        <div className="relative">
                          <input
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            className={`${inputClasses} appearance-none pr-10`}
                          />
                          <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className={labelClasses}>{optionsLabel}</label>
                      <div className="relative">
                        <select
                          name="concern"
                          value={formData.concern}
                          onChange={handleChange}
                          className={`${inputClasses} appearance-none cursor-pointer`}
                        >
                          <option value="" disabled>Select an option</option>
                          {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                      </div>
                    </div>

                    <div className="pt-4">
                      <Button
                        type="submit"
                        className={`w-full py-4 text-base shadow-xl transition-all duration-300 ${isCardio
                          ? 'shadow-blue-500/20 hover:shadow-blue-500/30'
                          : 'shadow-stone-500/10 hover:shadow-stone-500/20'
                          }`}
                        disabled={formState === 'submitting'}
                      >
                        {formState === 'submitting' ? (
                          <span className="flex items-center gap-2">
                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Processing...
                          </span>
                        ) : (
                          `Confirm Request`
                        )}
                      </Button>
                      <p className="text-xs text-center text-gray-400 mt-6 flex items-center justify-center gap-2">
                        <ShieldCheck size={14} />
                        Your data is secure and confidential.
                      </p>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};