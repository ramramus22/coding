import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-black py-12 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
        <div className="mb-6 md:mb-0 text-center md:text-left">
          <h3 className="font-serif text-2xl text-pp-gold font-bold">Héctor Gaud</h3>
          <p className="text-gray-500 text-sm mt-2">Memorias entre el Mar y la Montaña</p>
        </div>
        
        <div className="flex space-x-6 mb-6 md:mb-0">
          {/* Social placeholders */}
          <a href="#" className="text-gray-500 hover:text-pp-sand transition-colors">Facebook</a>
          <a href="#" className="text-gray-500 hover:text-pp-sand transition-colors">Instagram</a>
          <a href="#" className="text-gray-500 hover:text-pp-sand transition-colors">Twitter</a>
        </div>

        <div className="text-center md:text-right text-gray-600 text-sm">
          <p>&copy; 2025 La Casa de la Cultura de Puerto Plata.</p>
          <p>Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;