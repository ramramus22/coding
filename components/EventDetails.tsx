import React from 'react';
import { EVENT_DETAILS } from '../constants';
import { Calendar, Clock, MapPin } from 'lucide-react';

const EventDetails: React.FC = () => {
  return (
    <section id="detalles" className="py-20 bg-gradient-to-br from-pp-blue to-pp-dark text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4">Coordenadas del Encuentro</h2>
          <p className="text-pp-sand">Nos sentiríamos honrados con su presencia.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {/* Date */}
          <div className="flex flex-col items-center p-8 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10 hover:border-pp-gold/50 transition-all group">
            <div className="w-16 h-16 bg-pp-gold/20 rounded-full flex items-center justify-center mb-6 group-hover:bg-pp-gold/30 transition-colors">
              <Calendar className="w-8 h-8 text-pp-gold" />
            </div>
            <h3 className="text-xl font-bold mb-2">Fecha</h3>
            <p className="text-gray-300 text-center">{EVENT_DETAILS.date}</p>
          </div>

          {/* Time */}
          <div className="flex flex-col items-center p-8 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10 hover:border-pp-gold/50 transition-all group">
             <div className="w-16 h-16 bg-pp-gold/20 rounded-full flex items-center justify-center mb-6 group-hover:bg-pp-gold/30 transition-colors">
              <Clock className="w-8 h-8 text-pp-gold" />
            </div>
            <h3 className="text-xl font-bold mb-2">Hora</h3>
            <p className="text-gray-300 text-center">{EVENT_DETAILS.time}</p>
          </div>

          {/* Location */}
          <div className="flex flex-col items-center p-8 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10 hover:border-pp-gold/50 transition-all group">
             <div className="w-16 h-16 bg-pp-gold/20 rounded-full flex items-center justify-center mb-6 group-hover:bg-pp-gold/30 transition-colors">
              <MapPin className="w-8 h-8 text-pp-gold" />
            </div>
            <h3 className="text-xl font-bold mb-2">Lugar</h3>
            <p className="text-gray-300 text-center">{EVENT_DETAILS.locationName}</p>
          </div>
        </div>

        {/* Stylized Map Placeholder */}
        <div className="w-full h-96 rounded-3xl overflow-hidden relative shadow-2xl border border-gray-700">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3761.656337004986!2d-70.6951477!3d19.7986733!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8eb1e36e087434ad%3A0x8737696635075178!2sCasa%20De%20Cultura!5e0!3m2!1sen!2sdo!4v1709582919281!5m2!1sen!2sdo" 
            width="100%" 
            height="100%" 
            style={{border:0, filter: "grayscale(100%) invert(92%) contrast(83%)"}} 
            allowFullScreen={true} 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            title="Mapa Casa de la Cultura"
          ></iframe>
          
          <div className="absolute bottom-4 right-4 bg-pp-dark/90 p-4 rounded-xl backdrop-blur-md border border-white/10 max-w-xs">
            <p className="text-sm text-gray-300">
              Ubicado en el corazón histórico de Puerto Plata, frente al Parque Central.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EventDetails;