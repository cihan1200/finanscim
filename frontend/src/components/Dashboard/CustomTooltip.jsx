export default function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          backgroundColor: "#fff",
          border: "1px solid #edf2f7",
          padding: "8px 12px",
          borderRadius: "8px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
          fontFamily: '"Stack Sans Text", sans-serif',
          fontSize: "12px",
          minWidth: "120px"
        }}
      >
        <p style={{
          fontWeight: 700,
          color: "#2d3748",
          marginBottom: "4px",
          borderBottom: "1px solid #edf2f7",
          paddingBottom: "4px"
        }}>
          {label}
        </p>
        <p style={{ color: "#635bff", fontWeight: 600, margin: 0 }}>
          Net Bakiye: {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', minimumFractionDigits: 0 }).format(payload[0].value)}
        </p>
      </div>
    );
  }
  return null;
}