import { useEffect, useState } from "react";

import {
  getIncident,
  runAgent,
  updateIncident,
} from "../services/api";

import SeverityBadge from "../components/SeverityBadge";


function IncidentAnalyzer({
  incidentId,
  onBack,
}) {
  const [incident, setIncident] =
    useState(null);

  const [agentResult, setAgentResult] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [running, setRunning] =
    useState(false);

  const [error, setError] =
    useState("");


  async function loadIncident() {
    if (!incidentId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const data =
        await getIncident(incidentId);

      setIncident(data);
    } catch (err) {
      setError(
        err.message ||
        "Unable to load incident."
      );
    } finally {
      setLoading(false);
    }
  }


  useEffect(() => {
    loadIncident();
  }, [incidentId]);


  async function handleRunAgent() {
    if (!incidentId) {
      return;
    }

    try {
      setRunning(true);
      setError("");

      const result =
        await runAgent(incidentId);

      setAgentResult(result);

      await loadIncident();
    } catch (err) {
      setError(
        err.message ||
        "AI agent execution failed."
      );
    } finally {
      setRunning(false);
    }
  }


  async function markResolved() {
    if (!incidentId) {
      return;
    }

    try {
      const updated =
        await updateIncident(
          incidentId,
          {
            status: "resolved",
          }
        );

      setIncident(updated);
    } catch (err) {
      setError(
        err.message ||
        "Unable to update incident."
      );
    }
  }


  if (!incidentId) {
    return (
      <div className="empty-card">
        <h3>
          No incident selected
        </h3>

        <p>
          Create or select an incident
          before opening the AI analyzer.
        </p>

        <button
          className="primary-button"
          onClick={onBack}
        >
          ← Back
        </button>
      </div>
    );
  }


  if (loading) {
    return (
      <div className="empty-card">
        <div className="loading-spinner small" />
        <p>
          Loading incident intelligence...
        </p>
      </div>
    );
  }


  if (!incident) {
    return (
      <div className="error-box">
        {error || "Incident not found."}
      </div>
    );
  }


  const analysis =
    agentResult?.analysis || incident;


  return (
    <div className="analyzer-page">

      <div className="page-toolbar">

        <button
          className="secondary-button"
          onClick={onBack}
        >
          ← Back
        </button>

        <div className="toolbar-actions">

          <button
            className="secondary-button"
            onClick={loadIncident}
          >
            ↻ Refresh
          </button>

          <button
            className="primary-button"
            onClick={handleRunAgent}
            disabled={running}
          >
            {running
              ? "✦ AI investigating..."
              : "✦ Run AI Agent"}
          </button>

        </div>

      </div>


      {error && (
        <div className="error-box">
          {error}
        </div>
      )}


      <div className="analyzer-header-card">

        <div>

          <p className="eyebrow">
            AI INCIDENT INVESTIGATION
          </p>

          <h1>
            {incident.title}
          </h1>

          <p>
            {incident.description}
          </p>

        </div>

        <SeverityBadge
          severity={
            incident.severity
          }
        />

      </div>


      <div className="analysis-grid">

        <section className="analysis-panel">

          <p className="eyebrow">
            THREAT ASSESSMENT
          </p>

          <h2>
            {analysis.threat_type ||
              "Unclassified"}
          </h2>

          <div className="analysis-metrics">

            <div>
              <span>Severity</span>

              <SeverityBadge
                severity={
                  analysis.severity ||
                  "medium"
                }
              />
            </div>

            <div>
              <span>Confidence</span>

              <strong>
                {Math.round(
                  (Number(
                    analysis.confidence
                  ) || 0) * 100
                )}
                %
              </strong>
            </div>

            <div>
              <span>Status</span>

              <strong>
                {incident.status}
              </strong>
            </div>

          </div>

        </section>


        <section className="analysis-panel">

          <p className="eyebrow">
            POTENTIAL IMPACT
          </p>

          <p className="analysis-text">
            {analysis.impact ||
              "No impact assessment available yet."}
          </p>

        </section>

      </div>


      <div className="analysis-grid">

        <section className="analysis-panel">

          <p className="eyebrow">
            AI ANALYSIS
          </p>

          <h2>
            Investigation Summary
          </h2>

          <p className="analysis-text">
            {analysis.ai_analysis ||
              "Run the AI agent to generate an analysis."}
          </p>

        </section>


        <section className="analysis-panel">

          <p className="eyebrow">
            RESPONSE PLAN
          </p>

          <h2>
            Defensive Actions
          </h2>

          <div className="response-plan">
            {(analysis.response_plan ||
              "No response plan generated yet.")
              .split("\n")
              .map((item, index) => (
                <div
                  className="response-step"
                  key={index}
                >
                  {item}
                </div>
              ))}
          </div>

        </section>

      </div>


      <section className="analysis-panel">

        <div className="panel-header-row">

          <div>
            <p className="eyebrow">
              INDICATORS
            </p>

            <h2>
              Observed Security Indicators
            </h2>
          </div>

        </div>


        <div className="indicator-list">

          {(analysis.indicators || [])
            .map((indicator, index) => (
              <div
                className="indicator-item"
                key={index}
              >
                <span>
                  {index + 1}
                </span>

                <p>
                  {indicator}
                </p>
              </div>
            ))}

        </div>

      </section>


      {agentResult?.rag && (
        <section className="analysis-panel">

          <p className="eyebrow">
            RAG INTELLIGENCE
          </p>

          <h2>
            Knowledge Sources
          </h2>

          <div className="source-list">

            {agentResult.rag.sources
              ?.map((source) => (
                <span
                  className="source-chip"
                  key={source}
                >
                  ◇ {source}
                </span>
              ))}

          </div>

        </section>
      )}


      <div className="analyzer-footer">

        <span>
          Incident #{incident.id}
        </span>

        {incident.status !==
          "resolved" && (
          <button
            className="secondary-button"
            onClick={markResolved}
          >
            ✓ Mark Resolved
          </button>
        )}

      </div>

    </div>
  );
}


export default IncidentAnalyzer;