import React from 'react';
import { EVENT_DETAILS, IMAGES } from '../constants';
import { ChevronDown } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <div className="relative h-screen w-full overflow-hidden flex items-center justify-center">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat transform scale-105 animate-pulse-slow"
        style={{ backgroundImage: `url('${IMAGES.hero}')` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-pp-dark/60 via-pp-dark/40 to-pp-dark"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-16">
        <p className="text-pp-sand tracking-[0.2em] uppercase text-sm md:text-base mb-4 animate-fade-in-up">
          La Casa de la Cultura de Puerto Plata Presenta
        </p>
        <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-tight drop-shadow-xl animate-fade-in-up delay-100">
          {EVENT_DETAILS.title}
        </h1>
        <div className="w-24 h-1 bg-pp-gold mx-auto mb-8 rounded-full animate-scale-x delay-200"></div>
        <p className="font-serif text-xl md:text-3xl text-gray-200 italic mb-10 font-light animate-fade-in-up delay-300">
          {EVENT_DETAILS.subtitle}
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up delay-500">
           <a 
             href="#rsvp" 
             className="px-8 py-3 bg-pp-gold hover:bg-white hover:text-pp-dark text-pp-dark font-bold rounded-full transition-all duration-300 shadow-[0_0_20px_rgba(212,163,115,0.3)]"
           >
             Confirmar Asistencia
           </a>
           <a 
             href="#detalles" 
             className="px-8 py-3 border border-white/30 hover:bg-white/10 text-white rounded-full transition-all duration-300 backdrop-blur-sm"
           >
             Ver Detalles
           </a>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce text-white/50">
        <ChevronDown size={32} />
      </div>
    </div>
  );
};

export default Hero;