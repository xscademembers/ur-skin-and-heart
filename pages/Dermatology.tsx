import React from 'react';
import { motion } from 'framer-motion';
import { HeroDermatology } from '../components/sections/HeroDermatology';
import { ServiceCard } from '../components/ui/ServiceCard';
import { DoctorProfile } from '../components/sections/DoctorProfile';
import { Testimonials } from '../components/sections/Testimonials';
import { ContactForm } from '../components/sections/ContactForm';
import { Department, DoctorDetails, ServiceItem, Testimonial } from '../types';
import { Sparkles, ScanFace, Sun, Eraser, Zap, Smile, Droplet, Scissors, Bandage } from 'lucide-react';

const services: ServiceItem[] = [
  {
    title: "Chemical Peeling",
    description: "Advanced medical-grade peels to exfoliate and rejuvenate skin texture, treating acne and dullness.",
    icon: <Sparkles className="w-6 h-6" />
  },
  {
    title: "Pigmentation Treatment",
    description: "Targeted therapies for melasma, sun spots, and uneven skin tone using laser technology.",
    icon: <Sun className="w-6 h-6" />
  },
  {
    title: "Acne & Scar Treatment",
    description: "Comprehensive care for active acne and scar revision using lasers and subcision techniques.",
    icon: <Eraser className="w-6 h-6" />
  },
  {
    title: "Hair Loss Therapy",
    description: "PRP and medical management for hair restoration and preventing further hair loss.",
    icon: <Zap className="w-6 h-6" />
  },
  {
    title: "MNRF",
    description: "Micro Needling Radiofrequency for skin tightening, open pores, and scar reduction.",
    icon: <ScanFace className="w-6 h-6" />
  },
  {
    title: "Anti-Aging Treatment",
    description: "Botox, fillers, and non-surgical facelifts to restore youthful volume and reduce wrinkles.",
    icon: <Smile className="w-6 h-6" />
  },
  {
    title: "Skin Lightening Treatment",
    description: "Advanced treatments to brighten skin tone, reduce dark spots, and achieve a radiant, even complexion.",
    icon: <Droplet className="w-6 h-6" />
  },
  {
    title: "Hair Transplantation",
    description: "FUE and advanced hair restoration for natural density and hairline design, performed with meticulous technique and follow-up care.",
    icon: <Scissors className="w-6 h-6" />
  },
  {
    title: "Dermato Surgery",
    description: "Minor surgical dermatology including mole and lesion removal, cysts, and scar revision—safe, sterile procedures with cosmetic planning.",
    icon: <Bandage className="w-6 h-6" />
  },
];

const doctor: DoctorDetails = {
  name: "Dr. Ujwala",
  title: "Consultant Dermatologist",
  qualifications: "M.B.B.S., M.D., (DVL)",
  description: "Dr. Ujwala is a renowned expert in cosmetic and aesthetic dermatology with over 15 years of experience. She specializes in creating personalized treatment plans that prioritize skin health and natural-looking results. Her approach combines medical precision with an artistic eye for aesthetics.",
  awards: [
    "Expert in Cosmetic & Aesthetic Dermatology",
    "Certified in Advanced Laser Treatments",
    "Member of IADVL"
  ],
  image: "https://storage.googleapis.com/new_client_files/Ur%20skin%20and%20heart/xscade-creative-studio%20(14).jpeg"
};

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Priya Sharma",
    text: "Dr. Ujwala transformed my skin. The acne treatment was effective, and she explained every step. Truly the best dermatologist in the city.",
    rating: 5,
    treatment: "Acne Treatment"
  },
  {
    id: 2,
    name: "Rahul Verma",
    text: "I visited for hair loss therapy. The results after 3 months are incredible. The clinic is very hygienic and professional.",
    rating: 5,
    treatment: "Hair PRP"
  },
  {
    id: 3,
    name: "Sneha Reddy",
    text: "The chemical peel treatment gave me a glow I haven't seen in years. Highly recommend UR Skin & Heart for aesthetic needs.",
    rating: 5,
    treatment: "Skin Rejuvenation"
  }
];

export const DermatologyPage: React.FC = () => {
  return (
    <div className="bg-brand-surface min-h-screen">
      <HeroDermatology
        title="Advanced Dermatology & Aesthetic Care"
        subtitle="Safe, scientific, and result-oriented skin treatments by certified experts using state-of-the-art technology."
        ctaText="Book Dermatology Consultation"
        imageSrc="https://storage.googleapis.com/new_client_files/Ur%20skin%20and%20heart/DSC01008%20(1)_pages-to-jpg-0001.jpg"
      />

      {/* Services Section */}
      <section className="py-24 lg:py-32 relative overflow-hidden bg-[#FBFBF9]">
        {/* Background Texture */}
        <div className="absolute inset-0 opacity-[0.4]"
          style={{
            backgroundImage: 'radial-gradient(#E5E0D8 1px, transparent 1px)',
            backgroundSize: '24px 24px'
          }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="max-w-2xl"
            >
              <h2 className="text-sm font-bold text-stone-400 uppercase tracking-widest mb-3">Clinical Expertise</h2>
              <h3 className="text-3xl md:text-4xl font-bold text-brand-darkBlue font-sans">Comprehensive Skin Solutions</h3>
            </motion.div>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-gray-500 max-w-md text-sm md:text-base leading-relaxed"
            >
              We combine medical expertise with the latest technology to provide effective treatments for all your dermatological needs.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {services.map((service, index) => (
              <ServiceCard key={index} service={service} index={index} department={Department.DERMATOLOGY} />
            ))}
          </div>
        </div>
      </section>

      <DoctorProfile doctor={doctor} />

      <Testimonials testimonials={testimonials} title="Patient Stories" />

      <ContactForm
        department={Department.DERMATOLOGY}
        options={["Acne", "Pigmentation", "Hair Fall", "Hair Transplant", "Dermato Surgery", "Anti-Aging", "Skin Glow", "Other"]}
        optionsLabel="Skin Concern"
      />
    </div>
  );
};
