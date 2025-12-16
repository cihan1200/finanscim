import Header from "../components/Layouts/Header";
import Footer from "../components/Layouts/Footer";
import Hero from "../components/Home/Hero";
import Statistics from "../components/Home/Statistics";
import Services from "../components/Home/Services";
import BusinessesCarousel from "../components/Home/BusinessesCarousel";
import CompanyStories from "../components/Home/CompanyStories";
import ReadyToStart from "../components/Home/ReadyToStart";

export default function Home() {
  return (
    <div className="home-container">
      <Header />
      <Hero />
      <Services />
      <Statistics />
      <BusinessesCarousel />
      <CompanyStories />
      <ReadyToStart />
      <Footer />
    </div>
  );
}