import "../../styles/Home/Hero.css";
import Gradient from "../../utils/Gradient";
import { useEffect, useRef, useState } from "react";
import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Hero() {
  const gradientRef = useRef(null);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  useEffect(() => {
    const gradient = new Gradient();
    gradient.initGradient("#gradient-canvas");
    gradientRef.current = gradient;

    return () => {
      if (gradientRef.current) {
        gradientRef.current.destroy();
        gradientRef.current = null;
      }
    };
  }, []);

  const handleStart = () => {
    navigate("/signup", { state: { email: email } });
  };

  return (
    <>
      <div className="hero-top-container">
        <canvas id="gradient-canvas"></canvas>

        <div className="hero-top-content">
          <h1 className="hero-title">
            Finansal<br />Geleceğinizi<br />Şekillendirin
          </h1>
        </div>
      </div>

      <div className="hero-bottom-container">
        <p className="hero-description">
          Modern finans çözümleri ile yatırımlarınızı güvenle büyütün.<br />
          Akıllı analizler, güvenli işlemler ve profesyonel rehberlik bir arada.
        </p>
        <div className="quick-start-wrapper">
          <input
            className="quick-start-input"
            type="text"
            placeholder="Email adresi"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button className="quick-start-button" onClick={handleStart}>
            Şimdi başla <ChevronRight size="1em" />
          </button>
        </div>
      </div>
    </>
  );
}