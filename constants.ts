import { Calendar, Clock, MapPin, BookOpen, User, Heart } from 'lucide-react';

export const EVENT_DETAILS = {
  title: "Memorias entre el Mar y la Montaña",
  subtitle: "Crónicas de Puerto Plata y sus Almas",
  author: "Héctor Gaud",
  date: "Sábado 20 de diciembre de 2025",
  time: "7:00 p. m.",
  locationName: "Casa de la Cultura de Puerto Plata",
  description: "Será una velada entre amigos para celebrar la historia, la identidad y la memoria de nuestra ciudad en la época de quienes disfrutaron su adolescencia en la década de los años setenta."
};

export const NAV_LINKS = [
  { name: "El Libro", href: "#libro" },
  { name: "Detalles", href: "#detalles" },
  { name: "Galería", href: "#galeria" },
  { name: "Confirmar", href: "#rsvp" },
];

// Placeholder images simulating Puerto Plata scenery
export const IMAGES = {
  hero: "https://picsum.photos/id/1050/1920/1080", // Mountain/Sea vibe
  bookCover: "https://picsum.photos/id/1073/600/900", // Abstract vintage
  victorianHouse: "https://picsum.photos/id/216/800/600", // Architecture
  malecoon: "https://picsum.photos/id/1041/800/600", // Sea/Coast
  fortaleza: "https://picsum.photos/id/287/800/600", // Historical/Stone
  cableCar: "https://picsum.photos/id/413/800/600", // High view
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
    desc: "Héctor Gaud nos entrega su alma en cada página escrita."
  },
  {
    icon: Heart,
    title: "Nostalgia",
    desc: "Revive la magia de los años 70 en La Novia del Atlántico."
  }
];