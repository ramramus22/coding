import React from 'react';
import { EVENT_DETAILS, FEATURE_CARDS, IMAGES } from '../constants';

const BookSection: React.FC = () => {
  return (
    <section id="libro" className="py-20 md:py-32 bg-pp-dark relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-pp-blue/10 blur-3xl rounded-full -translate-y-1/2 translate-x-1/4"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Book Mockup Area */}
          <div className="relative group perspective-1000">
            <div className="relative w-full max-w-md mx-auto aspect-[2/3] bg-white shadow-2xl rounded-r-xl transform transition-transform duration-500 group-hover:rotate-y-6 rotate-y-12">
               {/* Spine */}
               <div className="absolute left-0 top-0 bottom-0 w-4 bg-gray-300 -translate-x-full shadow-inner transform skew-y-6 origin-top-right"></div>
               {/* Cover Image */}
               <img 
                 src={IMAGES.bookCover} 
                 alt="Portada del libro" 
                 className="w-full h-full object-cover rounded-r-xl shadow-lg"
               />
               {/* Lighting Effect */}
               <div className="absolute inset-0 bg-gradient-to-tr from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-r-xl pointer-events-none"></div>
            </div>
            
            {/* Reflection/Shadow */}
            <div className="absolute -bottom-10 left-10 right-10 h-8 bg-black/50 blur-xl rounded-[50%]"></div>
          </div>

          {/* Text Content */}
          <div className="text-left">
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-white mb-6">
              Una Ventana a <span className="text-pp-gold">Otra Época</span>
            </h2>
            <p className="text-lg text-gray-300 mb-6 leading-relaxed whitespace-pre-line">
              {EVENT_DETAILS.description}
            </p>
            <p className="text-lg text-gray-400 mb-8 leading-relaxed">
              En "Memorias entre el Mar y la Montaña", Héctor Gaud nos transporta a una Puerto Plata vibrante, llena de personajes inolvidables y momentos que forjaron la identidad de toda una generación.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-10">
              {FEATURE_CARDS.map((feature, idx) => (
                <div key={idx} className="glass-panel p-6 rounded-xl hover:bg-white/5 transition-colors duration-300">
                  <feature.icon className="w-8 h-8 text-pp-gold mb-4" />
                  <h3 className="font-serif text-xl font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-400">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BookSection;