
import React, { useState } from "react";
import { Link } from "react-router-dom";


const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="forgot-page">
      <div className="forgot-brand">
        <div className="forgot-brand-icon">
          <i className="bi bi-code-slash"></i>
        </div>

        <span>
          Snippet<span className="forgot-brand-highlight">Vault</span>
        </span>
      </div>

      <div className="forgot-card">
        <Link to="/login" className="forgot-back-link">
          <i className="bi bi-arrow-left"></i>
          Back to Login
        </Link>

        <div className="forgot-icon">
          <i className="bi bi-envelope-lock"></i>
        </div>

        <div className="forgot-header">
          <h2>Forgot Password?</h2>
          <p>
            No worries! Enter your registered email address and we'll help
            you reset your password.
          </p>
        </div>

        {!submitted ? (
          <form className="forgot-form" onSubmit={handleSubmit}>
            <div className="forgot-form-group">
              <label htmlFor="forgot-email">Email Address</label>

              <div className="forgot-input-wrapper">
                <i className="bi bi-envelope"></i>

                <input
                  type="email"
                  id="forgot-email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            <button type="submit" className="forgot-submit-btn">
              Send Reset Link
              <i className="bi bi-arrow-right"></i>
            </button>
          </form>
        ) : (
          <div className="forgot-success">
            <div className="forgot-success-icon">
              <i className="bi bi-check-circle-fill"></i>
            </div>

            <h3>Check Your Email</h3>

            <p>
              If an account exists for <strong>{email}</strong>, you'll
              receive instructions to reset your password.
            </p>

            <button
              type="button"
              className="forgot-submit-btn"
              onClick={() => setSubmitted(false)}
            >
              Try Another Email
            </button>
          </div>
        )}

        <div className="forgot-help">
          <i className="bi bi-shield-check"></i>
          Your account security matters to us.
        </div>
      </div>

      <p className="forgot-footer">
        Remember your password? <Link to="/login">Sign in</Link>
      </p>
    </div>
  );
};

export default ForgotPassword;

