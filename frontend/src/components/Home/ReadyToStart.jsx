import "../../styles/Home/ReadyToStart.css";
import { ChevronRight, HandCoins, Blocks } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ReadyToStart() {
  const navigate = useNavigate();
  return (
    <div className="ready-to-start-container">
      <div className="start-now-container">
        <span>Başlamaya hazır mısınız?</span>
        <span>
          Başlamak için hemen bir hesap oluşturun veya
          işletmeniz için özel bir paket tasarlamamız için
          bizimle iletişime geçin.
        </span>

        <div className="buttons-container">
          <button className="button" onClick={() => { navigate("/signup"); }}>
            Şimdi başlayın
            <div className="icon-parent">
              <ChevronRight className="chevron" size="1.3em" strokeWidth={2.7} />
            </div>
          </button>

          <button className="button">
            Satış ekibi
            <div className="icon-parent">
              <ChevronRight className="chevron" size="1.3em" strokeWidth={2.7} />
            </div>
          </button>
        </div>
      </div>

      <div className="details-container">
        <div className="detail">
          <HandCoins size="2em" color="#635bff" />
          <span className="detail-title">Ne ödediğinizi her zaman bilin</span>
          <span className="detail-description">Gizli ücretler olmadan işlem başına entegre fiyatlandırma.</span>
          <button className="button">
            Fiyatlandırma detayları
            <div className="icon-parent">
              <ChevronRight className="chevron" size="1.3em" strokeWidth={2.7} />
            </div>
          </button>
        </div>
        <div className="detail">
          <Blocks size="2em" color="#635bff" />
          <span className="detail-title">Entegrasyonunuzu başlatın</span>
          <span className="detail-description">Finanscım'ı sadece 10 dakikada kullanmaya başlayın.</span>
          <button className="button">
            API referansı
            <div className="icon-parent">
              <ChevronRight className="chevron" size="1.3em" strokeWidth={2.7} />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
