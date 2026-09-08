import { useEffect, useMemo, useState } from "react";

import {
  getIncidents,
} from "../services/api";


function Analytics() {
  const [incidents, setIncidents] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  async function loadData() {
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
        "Unable to load analytics."
      );
    } finally {
      setLoading(false);
    }
  }


  useEffect(() => {
    loadData();
  }, []);


  const stats = useMemo(() => {
    const total =
      incidents.length;

    const count = (value) =>
      incidents.filter(
        (item) =>
          String(
            item[value.key] || ""
          ).toLowerCase() ===
          value.value
      ).length;

    const critical = count({
      key: "severity",
      value: "critical",
    });

    const high = count({
      key: "severity",
      value: "high",
    });

    const medium = count({
      key: "severity",
      value: "medium",
    });

    const low = count({
      key: "severity",
      value: "low",
    });

    const open = count({
      key: "status",
      value: "open",
    });

    const investigating =
      count({
        key: "status",
        value: "investigating",
      });

    const resolved = count({
      key: "status",
      value: "resolved",
    });

    const analyzed =
      incidents.filter(
        (item) =>
          Boolean(item.ai_analysis)
      ).length;

    const confidenceValues =
      incidents
        .map((item) =>
          Number(item.confidence)
        )
        .filter(
          (value) =>
            Number.isFinite(value)
        );

    const averageConfidence =
      confidenceValues.length
        ? confidenceValues.reduce(
            (sum, value) =>
              sum + value,
            0
          ) /
          confidenceValues.length
        : 0;

    return {
      total,
      critical,
      high,
      medium,
      low,
      open,
      investigating,
      resolved,
      analyzed,
      averageConfidence,
    };
  }, [incidents]);


  const threats = useMemo(() => {
    const map = {};

    incidents.forEach(
      (incident) => {
        const type =
          incident.threat_type ||
          "Unclassified";

        map[type] =
          (map[type] || 0) + 1;
      }
    );

    return Object.entries(map)
      .sort(
        (a, b) => b[1] - a[1]
      );
  }, [incidents]);


  if (loading) {
    return (
      <div className="empty-card">
        <div className="loading-spinner small" />
        <p>
          Loading security analytics...
        </p>
      </div>
    );
  }


  return (
    <div className="analytics-page">

      <div className="analytics-header">

        <div>
          <p className="eyebrow">
            SECURITY INTELLIGENCE
          </p>

          <h1>
            Security Analytics
          </h1>

          <p>
            Monitor incident trends,
            severity, lifecycle, and
            AI investigation performance.
          </p>
        </div>

        <button
          className="secondary-button"
          onClick={loadData}
        >
          ↻ Refresh
        </button>

      </div>


      {error && (
        <div className="error-box">
          {error}
        </div>
      )}


      <div className="analytics-stat-grid">

        <div className="analytics-stat-card">
          <span>Total Incidents</span>
          <strong>
            {stats.total}
          </strong>
        </div>

        <div className="analytics-stat-card danger-card">
          <span>Critical Threats</span>
          <strong>
            {stats.critical}
          </strong>
        </div>

        <div className="analytics-stat-card warning-card">
          <span>High Severity</span>
          <strong>
            {stats.high}
          </strong>
        </div>

        <div className="analytics-stat-card ai-card">
          <span>AI Analyzed</span>
          <strong>
            {stats.analyzed}
          </strong>
        </div>

      </div>


      <div className="analytics-secondary-grid">

        <div className="analytics-mini-card">
          <span>Open</span>
          <strong>{stats.open}</strong>
          <small>
            Awaiting investigation
          </small>
        </div>

        <div className="analytics-mini-card">
          <span>Investigating</span>
          <strong>
            {stats.investigating}
          </strong>
          <small>
            Active investigations
          </small>
        </div>

        <div className="analytics-mini-card">
          <span>Resolved</span>
          <strong>
            {stats.resolved}
          </strong>
          <small>
            Completed incidents
          </small>
        </div>

        <div className="analytics-mini-card">
          <span>AI Confidence</span>
          <strong>
            {Math.round(
              stats.averageConfidence *
                100
            )}
            %
          </strong>
          <small>
            Average model confidence
          </small>
        </div>

      </div>


      <div className="analytics-chart-grid">

        <section className="analytics-panel">

          <p className="eyebrow">
            RISK DISTRIBUTION
          </p>

          <h2>
            Severity Overview
          </h2>


          {[
            ["Critical", stats.critical, "critical"],
            ["High", stats.high, "high"],
            ["Medium", stats.medium, "medium"],
            ["Low", stats.low, "low"],
          ].map(
            ([label, value, type]) => {

              const percentage =
                stats.total
                  ? Math.round(
                      (value /
                        stats.total) *
                        100
                    )
                  : 0;

              return (
                <div
                  className="severity-row"
                  key={label}
                >

                  <div className="severity-label">
                    <span
                      className={`severity-dot ${type}`}
                    />

                    <span>
                      {label}
                    </span>

                    <strong>
                      {value}
                    </strong>
                  </div>

                  <div className="severity-track">
                    <div
                      className={`severity-fill ${type}`}
                      style={{
                        width:
                          `${percentage}%`,
                      }}
                    />
                  </div>

                  <small>
                    {percentage}%
                  </small>

                </div>
              );
            }
          )}

        </section>


        <section className="analytics-panel">

          <p className="eyebrow">
            INCIDENT LIFECYCLE
          </p>

          <h2>
            Status Overview
          </h2>


          {[
            ["Open", stats.open],
            [
              "Investigating",
              stats.investigating,
            ],
            ["Resolved", stats.resolved],
          ].map(
            ([label, value]) => {

              const percentage =
                stats.total
                  ? Math.round(
                      (value /
                        stats.total) *
                        100
                    )
                  : 0;

              return (
                <div
                  className="status-item"
                  key={label}
                >

                  <div className="status-item-top">
                    <span>
                      {label}
                    </span>

                    <strong>
                      {value}
                    </strong>
                  </div>

                  <div className="status-track">
                    <div
                      className="status-fill"
                      style={{
                        width:
                          `${percentage}%`,
                      }}
                    />
                  </div>

                </div>
              );
            }
          )}

        </section>

      </div>


      <section className="analytics-panel">

        <p className="eyebrow">
          THREAT INTELLIGENCE
        </p>

        <h2>
          Threat Type Distribution
        </h2>


        {threats.length === 0 ? (

          <div className="analytics-empty">
            <h3>
              No threat classifications yet
            </h3>

            <p>
              Run AI analysis on an incident
              to generate threat intelligence.
            </p>
          </div>

        ) : (

          <div className="threat-list">

            {threats.map(
              ([threat, value]) => {

                const max =
                  threats[0][1] || 1;

                return (
                  <div
                    className="threat-row"
                    key={threat}
                  >

                    <div className="threat-name">
                      <span>✦</span>

                      <strong>
                        {threat}
                      </strong>
                    </div>

                    <div className="threat-bar">
                      <div
                        className="threat-bar-fill"
                        style={{
                          width:
                            `${(value / max) * 100}%`,
                        }}
                      />
                    </div>

                    <span className="threat-count">
                      {value}
                    </span>

                  </div>
                );
              }
            )}

          </div>

        )}

      </section>


      <section className="analytics-panel">

        <p className="eyebrow">
          RECENT ACTIVITY
        </p>

        <h2>
          Latest Security Incidents
        </h2>


        {incidents
          .slice(0, 5)
          .map((incident) => (
            <div
              className="recent-incident-row"
              key={incident.id}
            >

              <span>
                #{incident.id}
              </span>

              <div>
                <strong>
                  {incident.title}
                </strong>

                <small>
                  {incident.threat_type ||
                    "Unclassified"}
                </small>
              </div>

              <span
                className={`analytics-severity-badge ${
                  incident.severity
                }`}
              >
                {incident.severity}
              </span>

              <span>
                {incident.status}
              </span>

            </div>
          ))}

      </section>

    </div>
  );
}


export default Analytics;