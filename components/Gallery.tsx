import React from 'react';
import { IMAGES } from '../constants';

const Gallery: React.FC = () => {
  return (
    <section id="galeria" className="py-20 bg-pp-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
          <div>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-white mb-2">
              Estampas de <span className="text-pp-teal">Nuestra Ciudad</span>
            </h2>
            <p className="text-gray-400 max-w-lg">
              Un recorrido visual por los rincones que guardan nuestras memorias más preciadas.
            </p>
          </div>
          <div className="hidden md:block w-24 h-1 bg-pp-teal rounded-full mb-4"></div>
        </div>

        {/* Masonry-style Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 auto-rows-[200px]">
          
          {/* Large Item */}
          <div className="md:col-span-2 md:row-span-2 relative group overflow-hidden rounded-2xl cursor-pointer">
            <img 
              src={IMAGES.fortaleza} 
              alt="Fortaleza San Felipe" 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
              <p className="text-white font-serif text-xl">Vista Aérea</p>
            </div>
          </div>

          {/* Tall Item */}
          <div className="md:row-span-2 relative group overflow-hidden rounded-2xl cursor-pointer">
            <img 
              src={IMAGES.victorianHouse} 
              alt="Casas Victorianas" 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
             <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
              <p className="text-white font-serif text-xl">Arquitectura Victoriana</p>
            </div>
          </div>

          {/* Standard Items */}
          <div className="relative group overflow-hidden rounded-2xl cursor-pointer">
            <img 
              src={IMAGES.malecoon} 
              alt="Malecón" 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
             <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
              <p className="text-white font-serif text-xl">El Malecón</p>
            </div>
          </div>

          <div className="relative group overflow-hidden rounded-2xl cursor-pointer">
            <img 
              src={IMAGES.cableCar} 
              alt="Teleférico" 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
             <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
              <p className="text-white font-serif text-xl">Calle de las Sombrillas</p>
            </div>
          </div>

           <div className="md:col-span-2 relative group overflow-hidden rounded-2xl cursor-pointer bg-pp-blue/20 flex items-center justify-center border border-white/10 hover:border-pp-gold/50 transition-colors">
             <div className="text-center p-6">
               <p className="font-serif text-2xl text-pp-gold italic">"Un pueblo atrapado entre las aguas del Atlántico y montañas de un verde tropical..."</p>
               <p className="text-sm text-gray-400 mt-2">- H. Gaud</p>
             </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Gallery;