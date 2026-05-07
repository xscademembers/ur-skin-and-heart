import React from 'react';
import { motion } from 'framer-motion';
import { Hero } from '../components/sections/Hero';
import { ServiceCard } from '../components/ui/ServiceCard';
import { DoctorProfile } from '../components/sections/DoctorProfile';
import { Testimonials } from '../components/sections/Testimonials';
import { ContactForm } from '../components/sections/ContactForm';
import { Department, DoctorDetails, ServiceItem, Testimonial } from '../types';
import { Activity, HeartPulse, MonitorPlay, Timer, FileHeart, ShieldCheck, Clock, Users } from 'lucide-react';

const services: ServiceItem[] = [
  {
    title: "ECG",
    description: "Electrocardiogram recording to detect heart rhythm and electrical activity abnormalities quickly.",
    icon: <Activity className="w-6 h-6" />
  },
  {
    title: "2D Echo & TEE",
    description: "Advanced echocardiography to visualize heart structure and function with high precision.",
    icon: <HeartPulse className="w-6 h-6" />
  },
  {
    title: "Treadmill Test (TMT)",
    description: "Cardiac stress testing to evaluate heart function during physical exertion.",
    icon: <Timer className="w-6 h-6" />
  },
  {
    title: "Ambulatory BP (ABPM)",
    description: "24-hour blood pressure monitoring for accurate hypertension diagnosis and management.",
    icon: <MonitorPlay className="w-6 h-6" />
  },
  {
    title: "Holter Analysis",
    description: "Continuous monitoring of heart rhythm for 24-48 hours to detect irregular heartbeats.",
    icon: <FileHeart className="w-6 h-6" />
  }
];

const doctor: DoctorDetails = {
  name: "Dr. Rakesh Tumula",
  title: "Consultant Cardiologist",
  qualifications: "M.D., (Gen.med), D.M., (Cardiology)",
  description: "Dr. Rakesh Tumula is a distinguished Interventional Cardiologist known for his precision in diagnosis and compassionate patient care. With a focus on preventive cardiology and complex interventions, he ensures the highest standard of heart health for his patients.",
  awards: [
    "Best Interventional Cardiologist in AP – 2021",
    "Asian Healthcare Summit & Awards, New Delhi",
    "1000+ Successful Angioplasties"
  ],
  image: "https://storage.googleapis.com/new_client_files/Ur%20skin%20and%20heart/xscade-creative-studio%20(15).jpeg"
};

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Srinivas Rao",
    text: "Dr. Rakesh is extremely patient and knowledgeable. His diagnosis was spot on, and the treatment plan has significantly improved my health.",
    rating: 5,
    treatment: "Hypertension Management"
  },
  {
    id: 2,
    name: "Lakshmi Narayana",
    text: "The cardiac checkup facilities are top-notch. I felt very safe and cared for during my TMT and Echo tests.",
    rating: 5,
    treatment: "Cardiac Checkup"
  },
  {
    id: 3,
    name: "David Raj",
    text: "Saved my father's life with timely intervention. We are forever grateful to Dr. Rakesh and his team.",
    rating: 5,
    treatment: "Interventional Cardiology"
  }
];

export const CardiologyPage: React.FC = () => {
  return (
    <div className="bg-white min-h-screen">
      <Hero 
        title="Advanced Cardiac Care You Can Trust"
        subtitle="Accurate diagnosis and advanced cardiac care by an experienced interventional cardiologist dedicated to your heart's health."
        ctaText="Book Cardiology Consultation"
        imageSrc="https://storage.googleapis.com/new_client_files/Ur%20skin%20and%20heart/DSC01007%20(1)_pages-to-jpg-0001.jpg"
        department={Department.CARDIOLOGY}
      />
      
      {/* SECTION 2: TRUST STATS STRIP */}
      <section className="bg-brand-cardioSurface border-y border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-blue-200/50">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="px-4 py-2"
            >
              <div className="flex items-center justify-center gap-3 mb-2 text-brand-blue">
                <ShieldCheck className="w-6 h-6" />
                <span className="font-bold text-2xl">15+ Years</span>
              </div>
              <p className="text-sm text-gray-500 font-medium">Of Clinical Excellence</p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="px-4 py-2"
            >
               <div className="flex items-center justify-center gap-3 mb-2 text-brand-blue">
                <Users className="w-6 h-6" />
                <span className="font-bold text-2xl">10k+</span>
              </div>
              <p className="text-sm text-gray-500 font-medium">Happy Patients</p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="px-4 py-2"
            >
               <div className="flex items-center justify-center gap-3 mb-2 text-brand-blue">
                <Clock className="w-6 h-6" />
                <span className="font-bold text-2xl">24/7</span>
              </div>
              <p className="text-sm text-gray-500 font-medium">Emergency Support</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SECTION 3: SERVICES (REDESIGNED) */}
      <section className="py-24 bg-brand-blue relative overflow-hidden">
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
           <div className="absolute -top-[20%] -right-[10%] w-[600px] h-[600px] rounded-full bg-brand-blueLight blur-3xl" />
           <div className="absolute bottom-[10%] left-[10%] w-[400px] h-[400px] rounded-full bg-brand-cardioHighlight blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="max-w-2xl"
            >
              <span className="text-brand-cardioHighlight font-bold tracking-widest text-sm uppercase mb-3 block">Non-Invasive Diagnostics</span>
              <h2 className="text-3xl md:text-5xl font-bold text-white font-sans leading-tight">Advanced Heart<br/>Care Technology</h2>
            </motion.div>
            
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-blue-100/80 max-w-md text-lg leading-relaxed"
            >
              State-of-the-art diagnostic tools for precise and early detection of cardiac conditions.
            </motion.p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {services.map((service, index) => (
              <ServiceCard 
                key={index} 
                service={service} 
                index={index} 
                department={Department.CARDIOLOGY}
              />
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4: DOCTOR */}
      <DoctorProfile doctor={doctor} department={Department.CARDIOLOGY} />
      
      {/* SECTION 5: TESTIMONIALS */}
      <Testimonials testimonials={testimonials} title="Patient Trust" department={Department.CARDIOLOGY} />
      
      {/* SECTION 6: CONTACT */}
      <ContactForm 
        department={Department.CARDIOLOGY} 
        options={["Chest Pain", "Palpitations", "High BP Check", "Routine Checkup", "Post-Op Care", "Other"]}
        optionsLabel="Symptoms / Reason"
      />
    </div>
  );
};
