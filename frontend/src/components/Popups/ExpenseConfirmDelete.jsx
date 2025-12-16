export default function ExpenseConfirmDelete({ confirm, cancel }) {
  return (
    <div className="confirmation-popup-overlay">
      <div className="confirmation-popup-content">
        <h3>Emin misiniz?</h3>
        <p>Bu gideri silmek istediğinize emin misiniz?</p>
        <div className="confirmation-buttons">
          <button className="confirm-btn cancel" onClick={cancel}>İptal</button>
          <button className="confirm-btn delete" onClick={confirm}>Sil</button>
        </div>
      </div>
    </div>
  );
}