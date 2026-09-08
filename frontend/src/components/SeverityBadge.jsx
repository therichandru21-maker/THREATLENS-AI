function SeverityBadge({ severity = "medium" }) {
  const normalized = String(severity).toLowerCase();

  return (
    <span
      className={`severity-badge severity-${normalized}`}
    >
      {normalized.toUpperCase()}
    </span>
  );
}

export default SeverityBadge;