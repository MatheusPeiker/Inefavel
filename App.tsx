
import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import ServicesTimeline from './components/ServicesTimeline';
import Manifesto from './components/Manifesto';
import DeliveryCards from './components/DeliveryCards';
import About from './components/About';
import FinalCTA from './components/FinalCTA';
import Contact from './components/Contact';
import Footer from './components/Footer';

const App: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col selection:bg-primary/20 bg-off-white">
      <Header />
      
      <main className="flex-grow max-w-[1200px] mx-auto px-6 lg:px-40 w-full overflow-hidden">
        <Hero />
        <ServicesTimeline />
        <Manifesto />
        <About />
        <DeliveryCards />
        <Contact />
        <FinalCTA />
      </main>

      <Footer />
    </div>
  );
};

export default App;
