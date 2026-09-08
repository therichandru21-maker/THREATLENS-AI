function StatCard({
  label,
  value,
  icon = "◈",
  variant = "",
}) {
  return (
    <div className={`stat-card ${variant}`}>
      <div className="stat-icon">
        {icon}
      </div>

      <div className="stat-content">
        <span>{label}</span>
        <strong>{value}</strong>
      </div>
    </div>
  );
}

export default StatCard;