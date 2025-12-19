import Header from "../components/Layouts/Header";
import Footer from "../components/Layouts/Footer";
import Hero from "../components/Home/Hero";
import Services from "../components/Home/Services";

export default function Home() {
  return (
    <div className="home-container">
      <Header />
      <Hero />
      <Services />
      <Footer />
    </div>
  );
}