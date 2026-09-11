import { useState } from "react";

import { login } from "../services/api";


function Login({
  onLogin,
  onRegister,
}) {

  const [username, setUsername] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");


  async function handleSubmit(event) {

    event.preventDefault();

    setError("");
    setLoading(true);


    try {

      const data =
        await login(
          username.trim(),
          password
        );

      onLogin(data);

    } catch (err) {

      setError(
        err.message ||
        "Unable to sign in."
      );

    } finally {

      setLoading(false);
    }
  }


  return (
    <div className="auth-page">

      <div className="auth-visual">

        <div className="auth-glow" />

        <div className="auth-hero">

          <div className="hero-shield">
            🛡
          </div>


          <p className="eyebrow">
            AI-POWERED SECURITY
          </p>


          <h1>
            Detect threats.
            <br />
            Respond faster.
          </h1>


          <p>
            ThreatLens AI helps security
            teams analyze incidents, retrieve
            relevant intelligence, and generate
            defensive response plans.
          </p>


          <div className="hero-features">

            <span>
              ✓ AI Threat Analysis
            </span>

            <span>
              ✓ RAG Intelligence
            </span>

            <span>
              ✓ Automated Response Planning
            </span>

          </div>

        </div>

      </div>


      <div className="auth-panel">

        <div className="auth-form">

          <div className="mobile-brand">
            🛡 ThreatLens AI
          </div>


          <p className="eyebrow">
            SECURITY OPERATIONS
          </p>


          <h2>
            Welcome back
          </h2>


          <p className="auth-subtitle">
            Sign in to your security
            operations workspace.
          </p>


          {error && (
            <div className="error-box">
              {error}
            </div>
          )}


          <form onSubmit={handleSubmit}>

            <label>
              Username

              <input
                type="text"
                value={username}
                onChange={(event) =>
                  setUsername(
                    event.target.value
                  )
                }
                placeholder="Enter username"
                required
              />
            </label>


            <label>
              Password

              <input
                type="password"
                value={password}
                onChange={(event) =>
                  setPassword(
                    event.target.value
                  )
                }
                placeholder="Enter password"
                required
              />
            </label>


            <button
              className="primary-button"
              type="submit"
              disabled={loading}
            >
              {loading
                ? "Signing in..."
                : "Sign in →"}
            </button>

          </form>


          <p className="auth-switch">

            Don't have an account?

            <button
              onClick={onRegister}
            >
              Create account
            </button>

          </p>

        </div>

      </div>

    </div>
  );
}


export default Login;