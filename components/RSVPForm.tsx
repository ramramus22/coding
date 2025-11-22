import React, { useState } from 'react';

const RSVPForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    guests: '1',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    
    try {
      const response = await fetch('https://formspree.io/f/xjkzoepz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          nombre: formData.name,
          email: formData.email,
          asistentes: formData.guests,
          mensaje: formData.message
        })
      });

      if (response.ok) {
        setStatus('success');
      } else {
        setStatus('error');
      }
    } catch (error) {
      setStatus('error');
    }
  };

  return (
    <section id="rsvp" className="py-20 bg-pp-dark relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel rounded-3xl p-8 md:p-12 shadow-2xl border-t border-white/20">
          <div className="text-center mb-10">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-4">Confirme su Asistencia</h2>
            <p className="text-gray-400">Ayúdenos a preparar una velada inolvidable.</p>
          </div>

          {status === 'success' ? (
            <div className="text-center py-12 animate-fade-in-up">
              <div className="w-20 h-20 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
              </div>
              <h3 className="text-2xl font-serif text-white mb-2">¡Gracias por confirmar!</h3>
              <p className="text-gray-300">Nos vemos el sábado 20 de diciembre.</p>
              <button 
                onClick={() => { setStatus('idle'); setFormData({name:'', email:'', guests:'1', message:''}) }}
                className="mt-8 text-pp-gold hover:underline text-sm"
              >
                Enviar otra respuesta
              </button>
            </div>
          ) : status === 'error' ? (
            <div className="text-center py-12 animate-fade-in-up">
              <div className="w-20 h-20 bg-red-500/20 text-red-400 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </div>
              <h3 className="text-2xl font-serif text-white mb-2">Error al enviar</h3>
              <p className="text-gray-300">Por favor intente nuevamente.</p>
              <button 
                onClick={() => setStatus('idle')}
                className="mt-8 text-pp-gold hover:underline text-sm"
              >
                Intentar de nuevo
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">Nombre Completo</label>
                  <input
                    type="text"
                    id="name"
                    required
                    className="w-full bg-white/5 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pp-gold focus:border-transparent transition-all"
                    placeholder="Su nombre"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">Correo Electrónico</label>
                  <input
                    type="email"
                    id="email"
                    required
                    className="w-full bg-white/5 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pp-gold focus:border-transparent transition-all"
                    placeholder="correo@ejemplo.com"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="guests" className="block text-sm font-medium text-gray-300 mb-2">Número de Asistentes</label>
                <select
                  id="guests"
                  className="w-full bg-white/5 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-pp-gold focus:border-transparent transition-all appearance-none"
                  value={formData.guests}
                  onChange={(e) => setFormData({...formData, guests: e.target.value})}
                >
                  <option value="1" className="bg-pp-dark text-white">1 Persona</option>
                  <option value="2" className="bg-pp-dark text-white">2 Personas</option>
                  <option value="3" className="bg-pp-dark text-white">3 Personas</option>
                  <option value="4" className="bg-pp-dark text-white">4+ Personas</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">Mensaje (Opcional)</label>
                <textarea
                  id="message"
                  rows={4}
                  className="w-full bg-white/5 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pp-gold focus:border-transparent transition-all"
                  placeholder="¿Tiene algún recuerdo de los 70 que quiera compartir?"
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={status === 'submitting'}
                className="w-full bg-pp-gold hover:bg-white hover:text-pp-dark text-pp-dark font-bold py-4 rounded-lg transition-all duration-300 shadow-lg flex items-center justify-center"
              >
                {status === 'submitting' ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-pp-dark" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Enviando...
                  </span>
                ) : (
                  "Enviar Confirmación"
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default RSVPForm;