
import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { loginUser } from "../services/authService";
import { useAuthStore } from "../store/authStore";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const login = useAuthStore((state) => state.login);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const successMessage = location.state?.message;

  // Google OAuth2 login
  const handleGoogleLogin = () => {
    window.location.href =//It means tell the browser to open this URL.Used to navigate the browser to a URL.
    //navigate() is generally used for React app routes, while window.location.href is useful when you need the browser to visit an external website or initiate an OAuth flow through your backend.
      `${import.meta.env.VITE_BACKEND_URL}/oauth2/authorization/google`;
  };

  // GitHub OAuth2 login
  const handleGithubLogin = () => {
    window.location.href =
      `${import.meta.env.VITE_BACKEND_URL}/oauth2/authorization/github`;
  };

  // Email and password login
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await loginUser({
        email: email.trim(),
        password,
      });

      login(response);

      navigate("/", { replace: true });//replace: true as erasing the current page from that position in browser history and putting the new page there instead.
    } catch (err) {
      const responseData = err.response?.data;

      setError(
        responseData?.message ||
          responseData?.error ||
          "Invalid email or password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-brand">
        <div className="login-brand-icon">
          <i className="bi bi-code-slash"></i>
        </div>
        <span>
          Snippet<span className="login-brand-highlight">Vault</span>
        </span>
      </div>

      <div className="login-card">
        <div className="login-header">
          <h2>Welcome Back!</h2>
          <p>Sign in to access your developer workspace.</p>
        </div>

        {successMessage && (
          <div className="alert alert-success py-2" role="alert">
            {successMessage}
          </div>
        )}

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-form-group">
            <label htmlFor="login-email">Email Address</label>

            <div className="login-input-wrapper">
              <i className="bi bi-envelope"></i>

              <input
                type="email"
                id="login-email"
                placeholder="you@example.com"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="login-form-group">
            {/* <div className="login-password-label">
              <label htmlFor="login-password">Password</label>
              <Link to="/forgot-password">Forgot password?</Link>
            </div> */}

            <div className="login-input-wrapper">
              <i className="bi bi-lock"></i>

              <input
                type={showPassword ? "text" : "password"}
                id="login-password"
                placeholder="Enter your password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <button
                type="button"
                className="login-password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                // aria-label={showPassword ? "Hide password" : "Show password"}
              >
                <i
                  className={`bi ${
                    showPassword ? "bi-eye-slash" : "bi-eye"
                  }`}
                ></i>
              </button>
            </div>
          </div>

          <div className="login-remember">
            {/* <label>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span>Remember me</span>
            </label> */}
          </div>

          {error && (
            <div className="alert alert-danger py-2" role="alert">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="login-submit-btn"
            disabled={loading}//Disable a button while an operation is in progress.
          >
            {loading ? "Signing In..." : "Sign In"}
            {!loading && <i className="bi bi-arrow-right"></i>}
          </button>
        </form>

        <div className="login-divider">
          <span></span>
          <p>OR CONTINUE WITH</p>
          <span></span>
        </div>

        <div className="login-social-buttons">
          <button
            type="button"
            className="login-social-btn"
            onClick={handleGoogleLogin}
          >
            <i className="bi bi-google"></i>
            Google
          </button>

          <button
            type="button"
            className="login-social-btn"
            onClick={handleGithubLogin}
          >
            <i className="bi bi-github"></i>
            GitHub
          </button>
        </div>

        <p className="login-register-text">
          Don't have an account? <Link to="/register">Create account</Link>
        </p>
      </div>

      <p className="login-footer">
        <i className="bi bi-shield-check"></i>
        Your code. Your knowledge. All in one secure place.
      </p>
    </div>
  );
}

export default Login;

