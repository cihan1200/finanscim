import "../styles/Authorization/Signup.css";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Gradient from "../utils/Gradient";

const apiUrl = process.env.REACT_APP_API_URL;

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [generalError, setGeneralError] = useState("");
  const isButtonDisabled = !email.trim() || !password.trim() || !name.trim() || !lastName.trim();
  const gradientRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const gradient = new Gradient();
    gradient.initGradient("#gradient-canvas-signup");
    gradientRef.current = gradient;
    return () => {
      if (gradientRef.current) {
        gradientRef.current.destroy();
        gradientRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (location.state && location.state.email) {
      setEmail(location.state.email);
    }
  }, [location]);
  const validateForm = () => {
    let isValid = true;
    setEmailError("");
    setPasswordError("");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError("Geçerli bir e-posta adresi girin.");
      isValid = false;
    }
    if (password.length < 8) {
      setPasswordError("Şifre en az 8 karakter olmalıdır.");
      isValid = false;
    }

    return isValid;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setGeneralError("");
    if (!validateForm()) return;
    try {
      const response = await fetch(`${apiUrl}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, lastName, email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("user", JSON.stringify(data));
        navigate("/dashboard");
      } else {
        setGeneralError(data.message === "User already exists" ? "Bu e-posta adresi zaten kayıtlı" : "Bir hata oluştu");
      }
    } catch (error) {
      console.error("Error:", error);
      setGeneralError("Sunucu hatası. Lütfen tekrar deneyin.");
    }
  };

  return (
    <>
      <canvas className="signup-gradient" id="gradient-canvas-signup"></canvas>
      <div className="signup-header"><span onClick={() => { navigate("/"); }}>Finanscım</span></div>
      <div className="login-container-signup">
        <div className="infos-container">
          <div className="info">
            <span className="infoo-title">Hemen başlayın</span>
            <span className="information">Geliştirici dostu API'lerle entegre edin veya düşük kodlu ya da önceden oluşturulmuş çözümleri seçin.</span>
          </div>
          <div className="info">
            <span className="infoo-title">Her türlü iş modelini destekleyin</span>
            <span className="information">E-ticaret, abonelikler, SaaS platformları, pazar yerleri ve daha fazlası; hepsi tek bir platformda.</span>
          </div>
          <div className="info">
            <span className="infoo-title">Milyonlarca işletmeye katılın</span>
            <span className="information">Finanscım, her ölçekten hırslı girişim ve işletmenin güvenini kazanmıştır.</span>
          </div>
        </div>

        <form onSubmit={handleSignup} className="login-form-signup">
          <h1 className="signup-title">Finanscım hesabınızı oluşturun</h1>

          <div className="form-group">
            <label htmlFor="name">Ad</label>
            <input
              className="signup-input"
              type="text"
              name="name"
              id="name"
              maxLength={10}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="last-name">Soyad</label>
            <input
              className="signup-input"
              type="text"
              name="last-name"
              id="last-name"
              maxLength={10}
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">E-posta</label>
            <input
              className="signup-input"
              type="text"
              name="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {emailError && <span className="error-text">{emailError}</span>}
          </div>

          <div className="form-group">
            <label className="password-label" htmlFor="password">Şifre</label>
            <div className="password-input-wrapper">
              <input
                className="signup-input"
                type={showPassword ? "text" : "password"}
                name="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="password-toggle-icon"
                onClick={() => setShowPassword(!showPassword)}
              >
                {!showPassword ? (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-eye-off"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-eye"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                )}
              </button>
            </div>
            {/* Show Password Error */}
            {passwordError && <span className="error-text">{passwordError}</span>}
          </div>

          {/* Show General Server Error (e.g. User already exists) */}
          {generalError && <span className="error-text" style={{ textAlign: 'center' }}>{generalError}</span>}

          <button
            type="submit"
            className={`sign-in-button ${isButtonDisabled ? "deactive-button" : ""}`}
          >
            Hesap oluştur
          </button>

          {/* ... Divider and Google Button ... */}
          <div className="divider">
            <span className="divider-line"></span>
            <span className="divider-text">VEYA</span>
            <span className="divider-line"></span>
          </div>
          <button type="button" className="google-sign-in-button">
            <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4" />
              <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.715H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853" />
              <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05" />
              <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.159 6.656 3.58 9 3.58z" fill="#EA4335" />
            </svg>
            Google ile giriş yap
          </button>
          <span className="sign-up-link">Zaten hesabınız var mı? <a href="/signin">Giriş yap</a></span>
        </form>
      </div>
    </>
  );
}