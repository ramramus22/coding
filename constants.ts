import { Calendar, Clock, MapPin, BookOpen, User, Heart } from 'lucide-react';

export const EVENT_DETAILS = {
  title: "Memorias entre el Mar y la Montaña",
  subtitle: "Crónicas de Puerto Plata y sus Almas",
  author: "Héctor Gaud",
  date: "Sábado 20 de diciembre de 2025",
  time: "7:00 p. m.",
  locationName: "Casa de la Cultura de Puerto Plata",
  description: "Será una velada entre amigos para celebrar la historia, la identidad y la memoria de nuestra ciudad en la época de quienes disfrutaron su adolescencia en la novia del Atlántico.\n\nEste libro es un viaje íntimo a la ciudad que respira historia, mar y nostalgia. En sus páginas se entrelazan voces, calles y recuerdos que conforman el alma de una de las ciudades más emblemáticas del Caribe. Cada relato evoca la cadencia del Atlántico, el eco de sus montañas y la memoria viva de sus gentes. No es solo una crónica del tiempo: es una mirada al espíritu de Puerto Plata, a su belleza persistente y a la huella que deja en quienes la aman o la recuerdan desde lejos."
};

export const NAV_LINKS = [
  { name: "El Libro", href: "#libro" },
  { name: "Detalles", href: "#detalles" },
  { name: "Galería", href: "#galeria" },
  { name: "Confirmar", href: "#rsvp" },
];

// Placeholder images simulating Puerto Plata scenery
export const IMAGES = {
  hero: "https://files.catbox.moe/814lm3.mp4", // Mountain/Sea vibe
  bookCover: "https://i.ibb.co/7JWWMSNQ/ver07.jpg", // Abstract vintage
  victorianHouse: "https://i.ibb.co/0pPJcpfk/victoriana.jpg", // Architecture
  malecoon: "https://i.ibb.co/5xR1WY7F/sea.jpg", // Sea/Coast
  fortaleza: "https://i.ibb.co/yFTxpCFf/aerea.jpg", // Historical/Stone
  cableCar: "https://i.ibb.co/7J1BCtpk/street2.jpg", // High view
};

export const FEATURE_CARDS = [
  {
    icon: BookOpen,
    title: "Historia Viva",
    desc: "Un viaje a través de las crónicas que definieron una generación."
  },
  {
    icon: User,
    title: "El Autor",
    desc: "Héctor Gaud nos entrega sus recuerdos en cada página escrita."
  },
  {
    icon: Heart,
    title: "Nostalgia",
    desc: "Revive la pasión de otras épocas en La Novia del Atlántico."
  }
];