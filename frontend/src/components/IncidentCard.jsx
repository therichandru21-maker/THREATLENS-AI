import SeverityBadge from "./SeverityBadge";

function IncidentCard({
  incident,
  onClick,
}) {
  if (!incident) {
    return null;
  }

  const status =
    incident.status || "open";

  return (
    <button
      className="incident-row"
      onClick={() =>
        onClick?.(incident.id)
      }
    >
      <div className="incident-main">

        <div className="incident-type-icon">
          {incident.severity === "critical"
            ? "!"
            : "◈"}
        </div>

        <div>
          <h3>
            {incident.title}
          </h3>

          <p>
            {incident.description}
          </p>

          <small>
            {incident.created_at
              ? new Date(
                  incident.created_at
                ).toLocaleString("en-IN")
              : "Unknown date"}
          </small>
        </div>

      </div>

      <div className="incident-meta">

        <SeverityBadge
          severity={incident.severity}
        />

        <span className="status-badge">
          {status.charAt(0).toUpperCase() +
            status.slice(1)}
        </span>

        <span className="incident-arrow">
          →
        </span>

      </div>
    </button>
  );
}

export default IncidentCard;