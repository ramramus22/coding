import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import BookSection from './components/BookSection';
import EventDetails from './components/EventDetails';
import Gallery from './components/Gallery';
import RSVPForm from './components/RSVPForm';
import Footer from './components/Footer';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-pp-dark font-sans selection:bg-pp-gold selection:text-pp-dark">
      <Navbar />
      <main>
        <Hero />
        <BookSection />
        <EventDetails />
        <Gallery />
        <RSVPForm />
      </main>
      <Footer />
    </div>
  );
};

export default App;