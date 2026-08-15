import Navbar from '../components/Navbar';
import Particles from '../components/Particles';
import Hero from '../components/Hero';
import About from '../components/About';
import WhyChooseUs from '../components/WhyChooseUs';
import Services from '../components/Services';
import Team from '../components/Team';
import Contact from '../components/Contact';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <>
      <Navbar />
      <div className="hero-particles-wrapper">
        <Particles />
        <Hero />
      </div>
      <About />
      <WhyChooseUs />
      <Services />
      <Team />
      <Contact />
      <Footer />
    </>
  );
}
