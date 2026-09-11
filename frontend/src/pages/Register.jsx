import { useState } from "react";
import { register } from "../services/api";


function Register({
  onRegistered,
  onBack,
}) {
  const [username, setUsername] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");


  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError(
        "Passwords do not match."
      );
      return;
    }

    setLoading(true);

    try {
      await register(
        username,
        email,
        password
      );

      setSuccess(
        "Account created successfully. You can now sign in."
      );

      setTimeout(() => {
        onRegistered();
      }, 1200);

    } catch (err) {
      setError(
        err.message ||
        "Registration failed."
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
            ThreatLens AI
          </p>

          <h1>
            Build a safer
            <br />
            digital world.
          </h1>

          <p>
            Create your security operations
            workspace and let AI help your team
            investigate incidents faster.
          </p>

          <div className="hero-features">
            <span>✓ AI Threat Detection</span>
            <span>✓ Security Intelligence</span>
            <span>✓ Automated Response Planning</span>
          </div>

        </div>

      </div>


      <div className="auth-panel">

        <div className="auth-form">

          <div className="mobile-brand">
            🛡 ThreatLens AI
          </div>

          <p className="eyebrow">
            GET STARTED
          </p>

          <h2>
            Create account
          </h2>

          <p className="auth-subtitle">
            Set up your security analyst workspace.
          </p>


          {error && (
            <div className="error-box">
              {error}
            </div>
          )}


          {success && (
            <div className="success-box">
              {success}
            </div>
          )}


          <form onSubmit={handleSubmit}>

            <label>
              Username

              <input
                type="text"
                value={username}
                onChange={(e) =>
                  setUsername(
                    e.target.value
                  )
                }
                placeholder="Choose a username"
                minLength={3}
                required
              />

            </label>


            <label>
              Email

              <input
                type="email"
                value={email}
                onChange={(e) =>
                  setEmail(
                    e.target.value
                  )
                }
                placeholder="you@example.com"
                required
              />

            </label>


            <label>
              Password

              <input
                type="password"
                value={password}
                onChange={(e) =>
                  setPassword(
                    e.target.value
                  )
                }
                placeholder="Minimum 8 characters"
                minLength={8}
                required
              />

            </label>


            <label>
              Confirm Password

              <input
                type="password"
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(
                    e.target.value
                  )
                }
                placeholder="Repeat your password"
                minLength={8}
                required
              />

            </label>


            <button
              className="primary-button"
              type="submit"
              disabled={loading}
            >
              {loading
                ? "Creating account..."
                : "Create account →"}
            </button>

          </form>


          <p className="auth-switch">

            Already have an account?

            <button onClick={onBack}>
              Sign in
            </button>

          </p>

        </div>

      </div>

    </div>
  );
}

export default Register;