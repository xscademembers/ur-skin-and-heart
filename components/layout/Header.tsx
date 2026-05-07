import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, useScroll } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { Button } from '../ui/Button';

const LOGO_URL = 'https://storage.googleapis.com/clientmedia/Ur%20skin%20and%20Heart/ur%20logo.png';

export const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  const location = useLocation();
  const navigate = useNavigate();
  const isCardiology = location.pathname.includes('/cardiology');

  useEffect(() => {
    const unsubscribe = scrollY.on("change", (latest) => {
      setIsScrolled(latest > 50);
    });
    return () => unsubscribe();
  }, [scrollY]);

  const navLinks = [
    { name: 'Dermatology', path: '/' },
    { name: 'Cardiology', path: '/cardiology' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Blog', path: '/blog' },
    { name: 'Contact Us', path: '/contact' },
  ];

  const isActive = (path: string) => location.pathname === path;

  // Text colors based on route
  const titleColor = isCardiology ? 'text-brand-blue' : 'text-brand-darkBlue';
  const subtitleColor = isCardiology ? 'text-brand-blue/60' : 'text-brand-gold';
  const navLinkDefault = 'text-gray-500';
  const navLinkActive = isCardiology ? 'text-brand-blue font-bold' : 'text-brand-darkBlue font-bold';
  const navLinkHover = isCardiology ? 'hover:text-brand-blue' : 'hover:text-brand-gold';
  const buttonVariant = isCardiology ? 'primary' : 'outline'; // Or custom color? Using primary for now but button might need update.
  // Actually Button component might need check. For now let's keep button variant primary but maybe we update its definition later if needed.
  // Let's assume Button 'primary' maps to brand-blue. If we need gold button, we might need a variant. 
  // For 'Book Appointment', lets stick to standard or update inline styles.

  return (
    <>
      {/* pointer-events-none: transparent header otherwise blocks clicks on content below */}
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 pointer-events-none transition-all duration-300 border-b ${isScrolled
          ? 'bg-white/90 backdrop-blur-md border-brand-blue/10 py-3 shadow-sm'
          : 'bg-transparent border-transparent py-5'
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pointer-events-none">
          <div className="flex items-center justify-between pointer-events-none">
            {/* Logo */}
            <Link to="/" className="pointer-events-auto flex items-center gap-2 group">
              <div className="h-10 w-10 md:h-14 md:w-14 rounded-lg overflow-hidden flex items-center justify-center bg-white">
                <img
                  src={LOGO_URL}
                  alt="UR Skin & Heart Clinic logo"
                  className="h-full w-full object-contain"
                  loading="lazy"
                />
              </div>
              <div className="flex flex-col">
                <span className={`text-lg font-bold leading-none tracking-tight ${titleColor}`}>UR Skin & Heart</span>
                <span className={`text-xs font-medium tracking-wider uppercase ${subtitleColor}`}>Clinic</span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="pointer-events-auto hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`text-sm font-medium transition-colors ${navLinkHover} ${isActive(link.path) ? navLinkActive : navLinkDefault
                    }`}
                >
                  {link.name}
                </Link>
              ))}
              <Button
                variant="primary"
                className="ml-4 py-2 px-5 text-xs"
                onClick={() => navigate('/contact')}
              >
                Book Appointment
              </Button>
            </nav>

            {/* Mobile Toggle */}
            <button
              type="button"
              className={`pointer-events-auto md:hidden p-2 ${isCardiology ? 'text-brand-blue' : 'text-brand-darkBlue'}`}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed inset-0 top-[60px] z-40 bg-white md:hidden overflow-y-auto"
        >
          <div className="flex flex-col gap-4 p-6 pt-8 min-h-full">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`text-xl font-bold py-3 border-b border-gray-100 ${isActive(link.path) ? (isCardiology ? 'text-brand-blue' : 'text-brand-darkBlue') : 'text-gray-400'
                  }`}
              >
                {link.name}
              </Link>
            ))}
            <Button
              variant="primary"
              className="w-full mt-6 py-4"
              onClick={() => {
                setIsMobileMenuOpen(false);
                navigate('/contact');
              }}
            >
              Book Appointment
            </Button>
          </div>
        </motion.div>
      )}
    </>
  );
};