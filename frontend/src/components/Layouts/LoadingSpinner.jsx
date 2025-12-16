import "../../styles/Layouts/LoadingSpinner.css";

export default function LoadingSpinner({ text = "Yükleniyor..." }) {
  return (
    <div className="spinner-overlay">
      <div className="spinner-container">
        <div className="spinner"></div>
        <span className="spinner-text">{text}</span>
      </div>
    </div>
  );
}
