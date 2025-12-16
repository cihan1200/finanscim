import "../../styles/Layouts/Footer.css";
import { Copyright } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ReactComponent as Facebook } from "../../assests/facebook.svg";
import { ReactComponent as X } from "../../assests/x.svg";
import { ReactComponent as Instagram } from "../../assests/instagram.svg";

export default function Footer() {
  const navigate = useNavigate();
  const year = new Date().getFullYear();

  return (
    <>
      <footer className="footer">
        <div className="footer-brand-and-socials-container">
          <span className="footer-brand" onClick={() => { navigate("/"); }}>Finanscım</span>
          <span className="footer-description">
            Finansal geleceğinizi şekillendirmek için burdayız.
            Modern Çözümler ile finans yönetiminizi kolaylaştırıyoruz.
          </span>
          <div className="footer-socials">
            <Facebook className="footer-facebook-logo" />
            <X className="footer-x-logo" />
            <Instagram className="footer-instagram-logo" />
          </div>
        </div>
        <div className="footer-fast-links-container">
          <span className="footer-fast-links-title">Hızlı Linkler</span>
          <nav className="footer-fast-links" id="fast-links">
            <a href="/">Ana Sayfa</a>
            <a href="/services">Hizmetler</a>
            <a href="/about">Hakkımızda</a>
            <a href="/contact">İletişim</a>
          </nav>
        </div>
        <div className="footer-services-links-container">
          <span className="footer-services-links-title">Hizmetlerimiz</span>
          <nav className="footer-services-links" id="services-links">
            <a href="/services">Aylık Özet</a>
            <a href="/services">Gelir - Gider</a>
            <a href="/services">Yatırım Planlama</a>
          </nav>
        </div>
      </footer>
      <div className="footer-copyright">
        <Copyright size="1em" />
        {year}
        <span>Finanscım, AŞ</span>
      </div>
    </>
  );
}