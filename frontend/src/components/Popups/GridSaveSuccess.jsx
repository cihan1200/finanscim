import "../../styles/Popups/GridSaveSuccess.css";
import { CheckCircle } from "lucide-react";
import { useEffect, useState } from "react";

export default function GridSaveSuccess() {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Parent unmounts this component after 3000ms.
    // We start the exit animation at 2700ms (300ms before removal).
    const timer = setTimeout(() => {
      setIsExiting(true);
    }, 2700);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`grid-save-success-overlay ${isExiting ? "exiting" : ""}`}>
      <div className="grid-save-success-content">
        <CheckCircle className="success-icon" size={32} />
        <span className="success-message">Tablo Başarıyla Kaydedildi!</span>
      </div>
    </div>
  );
}