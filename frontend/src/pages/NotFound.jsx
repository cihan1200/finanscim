import { useNavigate } from "react-router-dom";
import "../styles/NotFound/NotFound.css";

export default function NotFound() {
  const navigate = useNavigate();

  const goBack = () => {
    if (window.history.length <= 1) {
      navigate("/");
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="notfound-container">
      <div className="notfound-content">
        <h1 className="notfound-title">404</h1>
        <p className="notfound-text">
          Aradığınız sayfa bulunamadı veya taşınmış olabilir.
        </p>

        <button className="notfound-button" onClick={goBack}>
          Geri Dön
        </button>
      </div>
    </div>
  );
}
