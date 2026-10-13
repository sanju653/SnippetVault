
import React, { useState } from "react";
import { Link } from "react-router-dom";


const ResetPassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setResetSuccess(true);
  };

  return (
    <div className="reset-page">
      <div className="reset-brand">
        <div className="reset-brand-icon">
          <i className="bi bi-code-slash"></i>
        </div>

        <span>
          Snippet<span className="reset-brand-highlight">Vault</span>
        </span>
      </div>

      <div className="reset-card">
        {!resetSuccess ? (
          <>
            <div className="reset-icon">
              <i className="bi bi-shield-lock"></i>
            </div>

            <div className="reset-header">
              <h2>Reset Your Password</h2>
              <p>
                Create a new, strong password to secure your SnippetVault
                account.
              </p>
            </div>

            <form className="reset-form" onSubmit={handleSubmit}>
              <div className="reset-form-group">
                <label htmlFor="reset-password">New Password</label>

                <div className="reset-input-wrapper">
                  <i className="bi bi-lock"></i>

                  <input
                    type={showPassword ? "text" : "password"}
                    id="reset-password"
                    placeholder="Enter new password"
                    autoComplete="new-password"
                    minLength="8"
                    required
                  />

                  <button
                    type="button"
                    className="reset-password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    <i
                      className={`bi ${
                        showPassword ? "bi-eye-slash" : "bi-eye"
                      }`}
                    ></i>
                  </button>
                </div>

                <small className="reset-password-hint">
                  Use at least 8 characters.
                </small>
              </div>

              <div className="reset-form-group">
                <label htmlFor="reset-confirm-password">
                  Confirm New Password
                </label>

                <div className="reset-input-wrapper">
                  <i className="bi bi-shield-check"></i>

                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="reset-confirm-password"
                    placeholder="Re-enter new password"
                    autoComplete="new-password"
                    minLength="8"
                    required
                  />

                  <button
                    type="button"
                    className="reset-password-toggle"
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                    aria-label={
                      showConfirmPassword
                        ? "Hide confirm password"
                        : "Show confirm password"
                    }
                  >
                    <i
                      className={`bi ${
                        showConfirmPassword ? "bi-eye-slash" : "bi-eye"
                      }`}
                    ></i>
                  </button>
                </div>
              </div>

              <button type="submit" className="reset-submit-btn">
                Reset Password
                <i className="bi bi-arrow-right"></i>
              </button>
            </form>

            <Link to="/login" className="reset-back-link">
              <i className="bi bi-arrow-left"></i>
              Back to Login
            </Link>
          </>
        ) : (
          <div className="reset-success">
            <div className="reset-success-icon">
              <i className="bi bi-check-circle-fill"></i>
            </div>

            <h2>Password Reset Successful!</h2>

            <p>
              Your password has been updated successfully. You can now sign
              in using your new password.
            </p>

            <Link to="/login" className="reset-submit-btn reset-login-btn">
              Continue to Login
              <i className="bi bi-arrow-right"></i>
            </Link>
          </div>
        )}
      </div>

      <p className="reset-footer">
        <i className="bi bi-shield-check"></i>
        Your security matters to us.
      </p>
    </div>
  );
};

export default ResetPassword;

