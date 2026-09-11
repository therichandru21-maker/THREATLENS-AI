import { useState } from "react";
import {
  createIncident,
  runAgent,
} from "../services/api";


function NewIncident({
  onCreated,
  onCancel,
}) {
  const [title, setTitle] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [source, setSource] =
    useState("manual");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");


  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const incident =
        await createIncident({
          title,
          description,
          source,
        });

      /*
       * Automatically run the AI Agent after
       * creating the incident.
       *
       * This gives the user a complete
       * AI-powered investigation experience.
       */

      let finalIncident = incident;

      try {
        const agentResult =
          await runAgent(incident.id);

        if (agentResult?.analysis) {
          finalIncident = {
            ...incident,
            ...agentResult.analysis,
          };
        }
      } catch (agentError) {
        console.error(
          "Agent execution failed:",
          agentError
        );
      }

      onCreated(finalIncident);

    } catch (err) {
      setError(
        err.message ||
        "Unable to create incident."
      );
    } finally {
      setLoading(false);
    }
  }


  return (
    <div className="form-page">

      <div className="form-header">

        <div>

          <p className="eyebrow">
            INCIDENT INTAKE
          </p>

          <h1>
            Analyze a security incident
          </h1>

          <p>
            Provide the incident details and
            ThreatLens AI investigate
            the event using its AI agent and
            cybersecurity knowledge base.
          </p>

        </div>

      </div>


      <div className="incident-form-layout">

        <form
          className="incident-form-card"
          onSubmit={handleSubmit}
        >

          {error && (
            <div className="error-box">
              {error}
            </div>
          )}


          <div className="form-section">

            <div className="form-section-heading">

              <span className="step-number">
                01
              </span>

              <div>
                <h3>
                  Incident information
                </h3>

                <p>
                  Describe what your security
                  team observed.
                </p>
              </div>

            </div>


            <label>
              Incident title

              <input
                type="text"
                value={title}
                onChange={(event) =>
                  setTitle(
                    event.target.value
                  )
                }
                placeholder="e.g. Suspicious Login Detected"
                minLength={3}
                maxLength={200}
                required
              />

            </label>


            <label>
              Incident description

              <textarea
                value={description}
                onChange={(event) =>
                  setDescription(
                    event.target.value
                  )
                }
                placeholder="Describe the suspicious activity, affected systems, indicators, timestamps, or other relevant observations..."
                rows={9}
                minLength={5}
                required
              />

            </label>


            <label>
              Incident source

              <select
                value={source}
                onChange={(event) =>
                  setSource(
                    event.target.value
                  )
                }
              >
                <option value="manual">
                  Manual Entry
                </option>

                <option value="security_alert">
                  Security Alert
                </option>

                <option value="siem">
                  SIEM
                </option>

                <option value="endpoint">
                  Endpoint Security
                </option>

                <option value="network">
                  Network Monitoring
                </option>

                <option value="other">
                  Other
                </option>
              </select>

            </label>

          </div>


          <div className="form-actions">

            <button
              type="button"
              className="secondary-button"
              onClick={onCancel}
              disabled={loading}
            >
              Cancel
            </button>


            <button
              type="submit"
              className="primary-button"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="button-spinner" />
                  AI Agent investigating...
                </>
              ) : (
                <>
                  ✦ Analyze with AI
                </>
              )}
            </button>

          </div>

        </form>


        <div className="agent-preview-card">

          <div className="agent-preview-icon">
            ✦
          </div>

          <p className="eyebrow">
            AI INVESTIGATION
          </p>

          <h2>
            What happens next?
          </h2>

          <p>
            ThreatLens AI automatically
            orchestrates the investigation.
          </p>


          <div className="workflow">

            <div className="workflow-step">

              <span>01</span>

              <div>
                <strong>
                  Incident Intake
                </strong>

                <small>
                  Validate and process the
                  security event.
                </small>
              </div>

            </div>


            <div className="workflow-line" />


            <div className="workflow-step">

              <span>02</span>

              <div>
                <strong>
                  Knowledge Retrieval
                </strong>

                <small>
                  Retrieve relevant security
                  intelligence using RAG.
                </small>
              </div>

            </div>


            <div className="workflow-line" />


            <div className="workflow-step">

              <span>03</span>

              <div>
                <strong>
                  Threat Analysis
                </strong>

                <small>
                  Identify threat type and
                  supporting indicators.
                </small>
              </div>

            </div>


            <div className="workflow-line" />


            <div className="workflow-step">

              <span>04</span>

              <div>
                <strong>
                  Risk Assessment
                </strong>

                <small>
                  Determine severity and
                  confidence.
                </small>
              </div>

            </div>


            <div className="workflow-line" />


            <div className="workflow-step">

              <span>05</span>

              <div>
                <strong>
                  Response Planning
                </strong>

                <small>
                  Generate defensive actions
                  for the security team.
                </small>
              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}


export default NewIncident;