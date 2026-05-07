import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

const LOGO_URL = 'https://storage.googleapis.com/clientmedia/Ur%20skin%20and%20Heart/ur%20logo.png';

export const Footer: React.FC = () => {
  const location = useLocation();
  const isCardiology = location.pathname.includes('/cardiology');

  return (
    <footer className={`${isCardiology ? 'bg-brand-blue' : 'bg-brand-darkBlue'} text-white pt-16 pb-8 transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">

          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-14 w-14 rounded-lg overflow-hidden bg-white">
                <img
                  src={LOGO_URL}
                  alt="UR Skin & Heart Clinic logo"
                  className="h-full w-full object-contain"
                  loading="lazy"
                />
              </div>
              <h3 className="text-2xl font-bold font-sans">UR Skin & Heart</h3>
            </div>
            <p className="text-white/70 text-sm leading-relaxed mb-6 font-body">
              Premium medical care specializing in advanced dermatology and interventional cardiology. Your health, our commitment.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li><Link to="/" className="hover:text-white transition-colors block py-2">Dermatology</Link></li>
              <li><Link to="/cardiology" className="hover:text-white transition-colors block py-2">Cardiology</Link></li>
              <li><Link to="/gallery" className="hover:text-white transition-colors block py-2">Gallery</Link></li>
              <li><Link to="/blog" className="hover:text-white transition-colors block py-2">Blog</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors block py-2">Contact</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Contact Us</h4>
            <ul className="space-y-4 text-sm text-white/70">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-brand-beige shrink-0 mt-0.5" />
                <a 
                  href="https://www.google.com/maps/search/UR+Skin+and+Heart+Clinic+Visakhapatnam" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Ground Floor, #48-3-38, Sri Sai Nilayam, Rama Talkies Rd, Visakhapatnam, 530016
                </a>
              </li>
              <li>
                <a href="tel:+919381040073" className="flex items-center gap-3 hover:text-white transition-colors py-1">
                  <Phone className="w-5 h-5 text-brand-beige shrink-0" />
                  <span>+91 9381040073</span>
                </a>
              </li>
              <li>
                <a href="mailto:info@urskinandheart.com" className="flex items-center gap-3 hover:text-white transition-colors py-1">
                  <Mail className="w-5 h-5 text-brand-beige shrink-0" />
                  <span>info@urskinandheart.com</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Clinic Hours</h4>
            <ul className="space-y-3 text-sm text-white/70">
              <li className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-brand-beige" />
                <span>Mon - Sat: 10:00 AM - 08:00 PM</span>
              </li>
              <li className="pl-6">Sun: By Appointment Only</li>
            </ul>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/40"
        >
          <p>© 2025 by UR Skin & Heart Clinic. Design & Developed By <a href="https://www.xscade.com" target="_blank" rel="noopener noreferrer" className="hover:text-white underline">Xscade Technologies</a></p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};