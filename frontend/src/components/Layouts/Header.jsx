import "../../styles/Layouts/Header.css";
import { ChevronDown, ChevronRight, ChevronLeft, ChartPie, Wallet, Radar, Menu, X, Telescope } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const [featuresMenuOpen, setFeaturesMenuOpen] = useState(false);
  const [mobileFeaturesMenuOpen, setMobileFeaturesMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isFeaturesClosing, setIsFeaturesClosing] = useState(false);
  const toastRef = useRef(null);
  const isAuthenticated = localStorage.getItem("user");
  const navigate = useNavigate();
  const openTimeout = useRef(null);
  const closeTimeout = useRef(null);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const showToastMessage = () => {
    if (!toastRef.current) return;
    toastRef.current.classList.remove("show");
    void toastRef.current.offsetWidth;
    toastRef.current.classList.add("show");
    setTimeout(() => {
      toastRef.current?.classList.remove("show");
    }, 2200);
  };

  const handleProtectedNavigation = (path) => {
    if (!isAuthenticated) {
      showToastMessage();
      return;
    }
    navigate(path);
  };

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleMouseEnter = () => {
    clearTimeout(closeTimeout.current);

    openTimeout.current = setTimeout(() => {
      setFeaturesMenuOpen(true);
    }, 150);
  };

  const handleMouseLeave = () => {
    clearTimeout(openTimeout.current);

    closeTimeout.current = setTimeout(() => {
      setFeaturesMenuOpen(false);
    }, 200);
  };

  const closeMobileMenu = () => {
    setIsClosing(true);
    setTimeout(() => {
      setMobileMenuOpen(false);
      setIsClosing(false);
    }, 300);
  };

  const openMobileFeaturesMenu = () => {
    setMobileFeaturesMenuOpen(true);
  };

  const closeMobileFeaturesMenu = () => {
    setIsFeaturesClosing(true);
    setTimeout(() => {
      setMobileFeaturesMenuOpen(false);
      setIsFeaturesClosing(false);
    }, 300);
  };

  return (
    <>
      <header className="header-container">
        <a className="brand" href="/">Finanscım</a>
        {isMobile ? (
          <>
            <button className="mobile-menu-button" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              <Menu size="1.5em" />
            </button>
            {mobileMenuOpen && (
              <div className={`mobile-menu-overlay ${isClosing ? 'closing' : ''}`}>
                <div className="mobile-menu-heading">
                  <a className="mobile-menu-brand" href="/">Finanscım</a>
                  <X width="27px" height="27px" color="#0a2540" className="close-mobile-menu" onClick={closeMobileMenu} />
                </div>
                <nav className="mobile-menu-links">
                  <div className="mobile-features" onClick={openMobileFeaturesMenu}>
                    <span>Hizmetler</span>
                    <ChevronRight size="1.5em" />
                  </div>
                  <div className={`mobile-features-menu ${mobileFeaturesMenuOpen ? 'open' : ''} ${isFeaturesClosing ? 'closing' : ''}`}>
                    <span className="go-back-button">
                      <div className="group" onClick={closeMobileFeaturesMenu}>
                        <ChevronLeft size="1em" />Geri Dön
                      </div>
                      <X width="27px" height="27px" color="#0a2540" cursor="pointer" onClick={closeMobileMenu} />
                    </span>
                    <span className="mobile-features-title">FİNANSAL YÖNETİM</span>
                    <span className="mobile-link" onClick={() => handleProtectedNavigation("/dashboard")}><ChartPie className="mobile-menu-icons" size="1.2em" />Gelir-Gider Takibi</span>
                    <span className="mobile-link" onClick={() => handleProtectedNavigation("/dashboard/investment_planner")}><Wallet className="mobile-menu-icons" size="1.2em" />Yatırım Planlama</span>
                    <span className="mobile-link" onClick={() => handleProtectedNavigation("/dashboard/radar")}><Radar className="mobile-menu-icons" size="1.2em" />Radar</span>
                    <span className="mobile-link" onClick={() => handleProtectedNavigation("/dashboard/stock_explorer")}><Telescope className="mobile-menu-icons" size="1.2em" />Piyasa Varlıkları Özeti</span>
                  </div>

                  <a className="mobile-menu-about" href="/" onClick={closeMobileMenu}>Hakkımızda</a>
                  <a className="mobile-menu-contact" href="/" onClick={closeMobileMenu}>İletişim</a>
                  <a className="mobile-menu-sign-in" href="/signin">Giriş yap</a>
                </nav>
              </div>
            )}
          </>
        ) : (
          <>
            <div className="features" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
              <section>
                <span>Hizmetler</span>
                <ChevronDown size="1em" />
              </section>
              <div className={`features-wrapper ${featuresMenuOpen ? "open" : ""}`}>
                <span className="subtitle">FİNANSAL YÖNETİM</span>
                <div className="features-menu">
                  <span onClick={() => handleProtectedNavigation("/dashboard")}><ChartPie className="menu-icons" size="1.2em" />Gelir-Gider Takibi</span>
                  <span onClick={() => handleProtectedNavigation("/dashboard/investment_planner")}><Wallet className="menu-icons" size="1.2em" />Yatırım Planlama</span>
                  <span onClick={() => handleProtectedNavigation("/dashboard/radar")}><Radar className="menu-icons" size="1.2em" />Radar</span>
                  <span onClick={() => handleProtectedNavigation("/dashboard/stock_explorer")}><Telescope className="menu-icons" size="1.2em" />Piyasa Varlıkları Özeti</span>
                </div>
              </div>
            </div>
            <a className="nav-links" href="/">Hakkımızda</a>
            <a className="nav-links" href="/">İletişim</a>
            <button className="sign-in-button-header" onClick={() => { navigate("/signin"); }}>Giriş yap<ChevronRight size="1em" /></button>
          </>
        )}
      </header>
      <div ref={toastRef} className="toast-alert">
        Hizmetleri kullanmak için giriş yapmalısınız
      </div>
    </>
  );
}