import { useEffect, useState } from "react";

import {
  deleteIncident,
  getIncidents,
} from "../services/api";

import IncidentCard from "../components/IncidentCard";


function IncidentHistory({
  onOpenIncident,
}) {
  const [incidents, setIncidents] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [severity, setSeverity] =
    useState("all");


  async function loadIncidents() {
    try {
      setLoading(true);
      setError("");

      const data =
        await getIncidents();

      setIncidents(
        Array.isArray(data)
          ? data
          : []
      );
    } catch (err) {
      setError(
        err.message ||
        "Unable to load incident history."
      );
    } finally {
      setLoading(false);
    }
  }


  useEffect(() => {
    loadIncidents();
  }, []);


  async function handleDelete(id) {
    const confirmed =
      window.confirm(
        "Delete this incident permanently?"
      );

    if (!confirmed) {
      return;
    }

    try {
      await deleteIncident(id);

      setIncidents((current) =>
        current.filter(
          (incident) =>
            incident.id !== id
        )
      );
    } catch (err) {
      setError(
        err.message ||
        "Unable to delete incident."
      );
    }
  }


  const filtered =
    incidents.filter((incident) => {
      const matchesSearch =
        !search ||
        incident.title
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          ) ||
        incident.description
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          ) ||
        incident.threat_type
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          );

      const matchesSeverity =
        severity === "all" ||
        incident.severity === severity;

      return (
        matchesSearch &&
        matchesSeverity
      );
    });


  return (
    <div className="history-page">

      <div className="history-header">

        <div>
          <p className="eyebrow">
            SECURITY EVENTS
          </p>

          <h1>
            Incident History
          </h1>

          <p>
            Review, investigate, and manage
            previously recorded security events.
          </p>
        </div>

        <button
          className="secondary-button"
          onClick={loadIncidents}
        >
          ↻ Refresh
        </button>

      </div>


      <div className="history-toolbar">

        <input
          className="search-input"
          value={search}
          onChange={(event) =>
            setSearch(
              event.target.value
            )
          }
          placeholder="Search incidents..."
        />

        <select
          value={severity}
          onChange={(event) =>
            setSeverity(
              event.target.value
            )
          }
        >
          <option value="all">
            All severities
          </option>

          <option value="critical">
            Critical
          </option>

          <option value="high">
            High
          </option>

          <option value="medium">
            Medium
          </option>

          <option value="low">
            Low
          </option>
        </select>

      </div>


      {error && (
        <div className="error-box">
          {error}
        </div>
      )}


      {loading ? (

        <div className="empty-card">
          <div className="loading-spinner small" />
          <p>
            Loading incident history...
          </p>
        </div>

      ) : filtered.length === 0 ? (

        <div className="empty-card">

          <div className="empty-icon">
            ◷
          </div>

          <h3>
            No matching incidents
          </h3>

          <p>
            Try another search or create
            a new security incident.
          </p>

        </div>

      ) : (

        <div className="history-list">

          {filtered.map((incident) => (
            <div
              className="history-item"
              key={incident.id}
            >

              <IncidentCard
                incident={incident}
                onClick={
                  onOpenIncident
                }
              />

              <button
                className="danger-text-button"
                onClick={() =>
                  handleDelete(
                    incident.id
                  )
                }
              >
                Delete
              </button>

            </div>
          ))}

        </div>

      )}

    </div>
  );
}


export default IncidentHistory;