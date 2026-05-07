import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Send, ArrowRight, Instagram, Facebook, Youtube, CheckCircle2 } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const ContactPage: React.FC = () => {
    const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        subject: 'General Inquiry',
        message: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormStatus('submitting');

        try {
            const response = await fetch('/api/contacts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: `${formData.firstName} ${formData.lastName}`,
                    email: formData.email,
                    phone: formData.phone,
                    subject: formData.subject,
                    message: formData.message,
                    source: 'Contact Page'
                })
            });

            if (response.ok) {
                setFormStatus('success');
                setFormData({
                    firstName: '',
                    lastName: '',
                    email: '',
                    phone: '',
                    subject: 'General Inquiry',
                    message: ''
                });
            } else {
                setFormStatus('error');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            setFormStatus('error');
        }
    };

    return (
        <div className="min-h-screen bg-[#FDFCF8] pt-24 pb-20 relative overflow-hidden font-sans text-brand-blue">

            {/* Background Gradients */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-b from-blue-100/40 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-t from-orange-50/50 to-transparent rounded-full blur-3xl translate-y-1/3 -translate-x-1/4 pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

                {/* Hero Header */}
                <div className="mb-20 text-center max-w-3xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-blue/5 border border-brand-blue/10 text-brand-blue text-xs font-bold uppercase tracking-wider mb-6"
                    >
                        <span className="w-2 h-2 rounded-full bg-brand-blue animate-pulse" />
                        We are here to help
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-7xl font-bold mb-6 tracking-tight text-brand-blue"
                    >
                        Let's start a <br /> conversation.
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl text-gray-500 leading-relaxed"
                    >
                        Have questions about a treatment? Need to book a priority appointment?
                        <br className="hidden md:block" /> Our team is ready to assist you.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">

                    {/* LEFT COLUMN: Contact Bento Grid */}
                    <div className="lg:col-span-5 flex flex-col gap-6">

                        {/* Info Cards */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="grid grid-cols-1 gap-4"
                        >
                            {/* Phone Card */}
                            <a href="tel:+919381040073" className="group bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-blue-50 text-brand-blue flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <Phone size={24} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Call Us</p>
                                        <p className="text-lg font-bold text-brand-blue">+91 9381040073</p>
                                    </div>
                                </div>
                                <div className="w-8 h-8 rounded-full border border-gray-100 flex items-center justify-center opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all">
                                    <ArrowRight size={14} />
                                </div>
                            </a>

                            {/* Email Card */}
                            <a href="mailto:info@urskinandheart.com" className="group bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300 flex items-center justify-between">
                                <div className="flex items-center gap-5">
                                    <div className="flex items-center justify-center w-14 h-14 bg-blue-50 rounded-2xl text-brand-blue">
                                        <Mail size={24} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Email Us</p>
                                        <p className="text-lg font-bold text-brand-blue">info@urskinandheart.com</p>
                                    </div>
                                </div>
                                <div className="w-8 h-8 rounded-full border border-gray-100 flex items-center justify-center opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all">
                                    <ArrowRight size={14} />
                                </div>
                            </a>

                            {/* Location Card */}
                            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                                <div className="flex items-start gap-4 mb-4">
                                    <div className="w-12 h-12 rounded-2xl bg-gray-50 text-gray-600 flex items-center justify-center shrink-0">
                                        <MapPin size={24} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Visit Us</p>
                                        <p className="text-lg font-bold text-brand-blue leading-tight">
                                            Ground Floor, #48-3-38, Sri Sai Nilayam,<br />2nd Lane, Rama Talkies Rd, Srinagar,<br />Visakhapatnam, Andhra Pradesh 530016
                                        </p>
                                    </div>
                                </div>
                                <a
                                    href="https://www.google.com/maps/search/UR+Skin+and+Heart+Clinic+Visakhapatnam"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block h-32 w-full rounded-xl overflow-hidden grayscale hover:grayscale-0 transition-all duration-500 cursor-pointer"
                                >
                                    <iframe
                                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3800.4!2d83.2985!3d17.7185!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a39431389e6973f%3A0x92d9c20395498b01!2sRama%20Talkies%20Road%2C%20Srinagar%2C%20Visakhapatnam%2C%20Andhra%20Pradesh%20530016!5e0!3m2!1sen!2sin!4v1703067600000!5m2!1sen!2sin"
                                        width="100%"
                                        height="100%"
                                        style={{ border: 0, pointerEvents: 'none' }}
                                        allowFullScreen={false}
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                    />
                                </a>
                            </div>
                        </motion.div>

                        {/* Social Links */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="flex gap-4 px-2"
                        >
                            <a href="https://www.instagram.com/_urskinandheartclinic_" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-brand-blue/10 flex items-center justify-center text-brand-blue/60 hover:bg-brand-blue hover:text-white transition-all">
                                <Instagram size={18} />
                            </a>
                            <a href="https://www.facebook.com/drujwalastheskinclinic" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-brand-blue/10 flex items-center justify-center text-brand-blue/60 hover:bg-brand-blue hover:text-white transition-all">
                                <Facebook size={18} />
                            </a>
                            <a href="https://www.youtube.com/@URSkinHeartClinic" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-brand-blue/10 flex items-center justify-center text-brand-blue/60 hover:bg-brand-blue hover:text-white transition-all">
                                <Youtube size={18} />
                            </a>
                        </motion.div>
                    </div>

                    {/* RIGHT COLUMN: Modern Form */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="lg:col-span-7"
                    >
                        <div className="bg-white/80 backdrop-blur-xl p-8 md:p-12 rounded-[2.5rem] shadow-2xl shadow-blue-900/5 border border-white/50 relative overflow-hidden">
                            {/* Decorative Form Background */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-50 to-transparent rounded-bl-[10rem] -z-10" />

                            {formStatus === 'success' ? (
                                <div className="min-h-[500px] flex flex-col items-center justify-center text-center">
                                    <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 animate-bounce">
                                        <CheckCircle2 size={40} />
                                    </div>
                                    <h3 className="text-3xl font-bold text-brand-blue mb-2">Message Sent!</h3>
                                    <p className="text-gray-500 mb-8 max-w-xs">We'll get back to you within 24 hours.</p>
                                    <Button onClick={() => setFormStatus('idle')} variant="outline">
                                        Send Another
                                    </Button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-8">
                                    {formStatus === 'error' && (
                                        <div className="p-4 bg-red-50 text-red-600 rounded-xl text-center">
                                            Something went wrong. Please try again.
                                        </div>
                                    )}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="group">
                                            <label className="block text-sm font-bold text-gray-500 mb-2 group-focus-within:text-brand-blue transition-colors">First Name</label>
                                            <input
                                                type="text"
                                                name="firstName"
                                                value={formData.firstName}
                                                onChange={handleChange}
                                                placeholder="John"
                                                required
                                                className="w-full bg-transparent border-b-2 border-gray-100 py-3 text-lg font-medium text-brand-blue focus:border-brand-blue outline-none transition-colors placeholder-gray-300"
                                            />
                                        </div>
                                        <div className="group">
                                            <label className="block text-sm font-bold text-gray-500 mb-2 group-focus-within:text-brand-blue transition-colors">Last Name</label>
                                            <input
                                                type="text"
                                                name="lastName"
                                                value={formData.lastName}
                                                onChange={handleChange}
                                                placeholder="Doe"
                                                required
                                                className="w-full bg-transparent border-b-2 border-gray-100 py-3 text-lg font-medium text-brand-blue focus:border-brand-blue outline-none transition-colors placeholder-gray-300"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="group">
                                            <label className="block text-sm font-bold text-gray-500 mb-2 group-focus-within:text-brand-blue transition-colors">Email Address</label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                placeholder="john@example.com"
                                                required
                                                className="w-full bg-transparent border-b-2 border-gray-100 py-3 text-lg font-medium text-brand-blue focus:border-brand-blue outline-none transition-colors placeholder-gray-300"
                                            />
                                        </div>
                                        <div className="group">
                                            <label className="block text-sm font-bold text-gray-500 mb-2 group-focus-within:text-brand-blue transition-colors">Phone Number</label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                placeholder="+91 00000 00000"
                                                required
                                                className="w-full bg-transparent border-b-2 border-gray-100 py-3 text-lg font-medium text-brand-blue focus:border-brand-blue outline-none transition-colors placeholder-gray-300"
                                            />
                                        </div>
                                    </div>

                                    <div className="group">
                                        <label className="block text-sm font-bold text-gray-500 mb-2 group-focus-within:text-brand-blue transition-colors">Select Subject</label>
                                        <select
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleChange}
                                            className="w-full bg-transparent border-b-2 border-gray-100 py-3 text-lg font-medium text-brand-blue focus:border-brand-blue outline-none transition-colors cursor-pointer appearance-none"
                                        >
                                            <option>General Inquiry</option>
                                            <option>Book Appointment</option>
                                            <option>Feedback</option>
                                            <option>Partnership</option>
                                        </select>
                                    </div>

                                    <div className="group">
                                        <label className="block text-sm font-bold text-gray-500 mb-2 group-focus-within:text-brand-blue transition-colors">Your Message</label>
                                        <textarea
                                            rows={4}
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            placeholder="How can we help you today?"
                                            required
                                            className="w-full bg-gray-50/50 rounded-2xl border-none p-4 text-brand-blue focus:ring-2 focus:ring-brand-blue/10 outline-none transition-all placeholder-gray-300 resize-none"
                                        ></textarea>
                                    </div>

                                    <div className="pt-4 flex flex-col-reverse sm:flex-row items-center justify-between gap-4">
                                        <p className="text-xs text-gray-400 max-w-xs text-center sm:text-left">By submitting this form, you agree to our <a href="#" className="underline hover:text-brand-blue">Privacy Policy</a>.</p>
                                        <Button
                                            type="submit"
                                            className="w-full sm:w-auto px-10 py-5 bg-brand-blue text-white rounded-full shadow-lg shadow-blue-900/20 hover:shadow-xl hover:shadow-blue-900/30 hover:scale-105 transition-all duration-300 text-lg group"
                                            disabled={formStatus === 'submitting'}
                                        >
                                            {formStatus === 'submitting' ? 'Sending...' : (
                                                <span className="flex items-center justify-center gap-2">Send Message <Send size={18} className="group-hover:translate-x-1 transition-transform" /></span>
                                            )}
                                        </Button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </motion.div>

                </div>
            </div>
        </div>
    );
};
