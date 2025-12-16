import "../styles/Authorization/Signin.css";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Gradient from "../utils/Gradient";

const apiUrl = process.env.REACT_APP_API_URL;

export default function Signin() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const isButtonDisabled = !email.trim() || !password.trim();
  const gradientRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const gradient = new Gradient();
    gradient.initGradient("#gradient-canvas-login");
    gradientRef.current = gradient;
    return () => {
      if (gradientRef.current) {
        gradientRef.current.destroy();
        gradientRef.current = null;
      }
    };
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");
    try {
      const response = await fetch(`${apiUrl}/auth/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("user", JSON.stringify(data));
        navigate("/dashboard");
      } else {
        setLoginError("E-posta ya da şifre yanlış");
      }
    } catch (error) {
      console.error("Error:", error);
      setLoginError("Sunucu hatası. Lütfen daha sonra tekrar deneyin.");
    }
  };

  return (
    <>
      <div className="signup-header"><span className="login-header-span" onClick={() => { navigate("/"); }}>Finanscım</span></div>
      <div className="login-container">
        <canvas id="gradient-canvas-login" className="login-gradient"></canvas>
        <form onSubmit={handleLogin} className="login-form">
          <h1>Hesabınıza giriş yapın</h1>
          <div className="form-group">
            <label htmlFor="email">E-posta</label>
            <input
              type="text"
              name="email"
              id="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setLoginError(""); }}
            />
          </div>
          <div className="form-group">
            <label className="password-label" htmlFor="password">
              Şifre <a className="forgot-password-link" href="/">Şifrenizi unuttunuz mu?</a>
            </label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                id="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setLoginError(""); }}
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
            {loginError && <span className="error-text">{loginError}</span>}
          </div>
          <div className="remember-me">
            <label className="custom-checkboxx">
              <input type="checkbox" />
              <span className="checkmarkk"></span>
            </label>
            <span>Beni bu cihazda hatırla</span>
          </div>
          <button
            type="submit"
            className={`sign-in-button ${isButtonDisabled ? "deactive-button" : ""}`}
          >
            Giriş yap
          </button>
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
          <span className="sign-up-link">Finanscım'da yeni misiniz? <a href="/signup">Hesap oluştur</a></span>
        </form>
      </div>
    </>
  );
}