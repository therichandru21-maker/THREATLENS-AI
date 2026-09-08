import { useEffect, useState } from "react";

import {
  getIncidents,
} from "../services/api";

import StatCard from "../components/StatCard";
import IncidentCard from "../components/IncidentCard";


function Dashboard({
  user,
  onNewIncident,
  onOpenIncident,
}) {
  const [incidents, setIncidents] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


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
        "Unable to load incidents."
      );
    } finally {
      setLoading(false);
    }
  }


  useEffect(() => {
    loadIncidents();
  }, []);


  const total =
    incidents.length;

  const critical =
    incidents.filter(
      (incident) =>
        incident.severity ===
        "critical"
    ).length;

  const high =
    incidents.filter(
      (incident) =>
        incident.severity ===
        "high"
    ).length;

  const investigating =
    incidents.filter(
      (incident) =>
        incident.status ===
        "investigating"
    ).length;


  return (
    <div className="dashboard">

      <div className="dashboard-header">

        <div>
          <p className="eyebrow">
            THREAT MONITORING
          </p>

          <h1>
            Good to see you,{" "}
            <span>
              {user?.username}
            </span>
          </h1>

          <p className="dashboard-description">
            Monitor, investigate, and respond
            to cybersecurity incidents with
            AI-powered intelligence.
          </p>
        </div>

        <button
          className="primary-button"
          onClick={onNewIncident}
        >
          ＋ New Incident
        </button>

      </div>


      <div className="stats-grid">

        <StatCard
          label="Total Incidents"
          value={total}
          icon="◈"
        />

        <StatCard
          label="Critical"
          value={critical}
          icon="!"
          variant="danger"
        />

        <StatCard
          label="High Risk"
          value={high}
          icon="⚠"
          variant="warning"
        />

        <StatCard
          label="Investigating"
          value={investigating}
          icon="◉"
          variant="info"
        />

      </div>


      <div className="ai-banner">

        <div className="ai-banner-icon">
          ✦
        </div>

        <div className="ai-banner-content">

          <div className="ai-banner-title">
            <strong>
              CyberSentinel AI Engine
            </strong>

            <span className="online-pill">
              ● ONLINE
            </span>
          </div>

          <p>
            Groq LLM + RAG knowledge retrieval
            + automated incident-response agent
            are ready to analyze threats.
          </p>

        </div>

        <div className="ai-banner-model">
          <span>MODEL</span>
          <strong>
            GPT-OSS 20B
          </strong>
        </div>

      </div>


      <div className="section-header">

        <div>
          <p className="eyebrow">
            SECURITY EVENTS
          </p>

          <h2>
            Recent incidents
          </h2>
        </div>

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
            Loading security incidents...
          </p>
        </div>

      ) : incidents.length === 0 ? (

        <div className="empty-card">

          <div className="empty-icon">
            ◈
          </div>

          <h3>
            No incidents yet
          </h3>

          <p>
            Create your first security incident
            to start an AI-powered investigation.
          </p>

          <button
            className="primary-button"
            onClick={onNewIncident}
          >
            ＋ Create Incident
          </button>

        </div>

      ) : (

        <div className="incident-list">

          {incidents
            .slice(0, 5)
            .map((incident) => (
              <IncidentCard
                key={incident.id}
                incident={incident}
                onClick={
                  onOpenIncident
                }
              />
            ))}

        </div>

      )}


      <div className="section-header capabilities-heading">

        <div>
          <p className="eyebrow">
            PLATFORM CAPABILITIES
          </p>

          <h2>
            Intelligent security operations
          </h2>
        </div>

      </div>


      <div className="capability-grid">

        <div className="capability-card">
          <div className="capability-icon">
            ✦
          </div>

          <h3>
            AI Threat Analysis
          </h3>

          <p>
            Identify threat types, severity,
            indicators, impact, and response
            recommendations.
          </p>
        </div>


        <div className="capability-card">
          <div className="capability-icon">
            ◇
          </div>

          <h3>
            RAG Intelligence
          </h3>

          <p>
            Ground AI investigations using
            relevant cybersecurity knowledge.
          </p>
        </div>


        <div className="capability-card">
          <div className="capability-icon">
            ◎
          </div>

          <h3>
            AI Response Agent
          </h3>

          <p>
            Orchestrate investigation, risk
            assessment, and defensive planning.
          </p>
        </div>

      </div>

    </div>
  );
}


export default Dashboard;