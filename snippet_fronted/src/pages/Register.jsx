import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/authService";


const Register = () => {

  const [name, setName] = useState("");
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [confirmPassword, setConfirmPassword] = useState("");

const [error, setError] = useState("");
const [loading, setLoading] = useState(false);



  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  const handleSubmit=async(e)=>{

    e.preventDefault();
      setError("");

        if (password !== confirmPassword) {
    setError("Passwords do not match.");
    return;
  }

  if (password.length < 6) {
    setError("Password must be at least 6 characters.");
    return;
  }
try{
   setLoading(true);

    await registerUser({
      name: name.trim(),
      email: email.trim(),
      password,
    });
    navigate("/login", {
      state: {
        message: "Account created successfully. Please log in.",
      },
      //state passes information to the destination page during navigation.
    });
}catch(err){
   const responseData = err.response?.data;

    setError(
      responseData?.message ||
        responseData?.error ||
        "Registration failed. Please try again."
    );

}finally {
    setLoading(false);
  }



  };

  return (
    <div className="register-page">
      <div className="register-brand">
        <div className="register-brand-icon">
          <i className="bi bi-code-slash"></i>
        </div>
        <span>
          Snippet<span className="register-brand-highlight">Vault</span>
        </span>
      </div>

      <div className="register-card">
        <div className="register-header">
          <h2>Create Your Account</h2>
          <p>Start organizing your code snippets in one place.</p>
        </div>

        <form className="register-form" onSubmit={handleSubmit}>

          <div className="register-form-group">
            <label htmlFor="register-name">Full Name</label>
            <div className="register-input-wrapper">
              <i className="bi bi-person"></i>
              <input
                type="text"
                id="register-name"
                placeholder="Enter your full name"
                autoComplete="name"
                value={name}
                onChange={(e)=>setName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="register-form-group">
            <label htmlFor="register-email">Email Address</label>
            <div className="register-input-wrapper">
              <i className="bi bi-envelope"></i>
              <input
                type="email"
                id="register-email"
                placeholder="you@example.com"
                autoComplete="email"
                value={email}
  onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="register-form-group">
            <label htmlFor="register-password">Password</label>
            <div className="register-input-wrapper">
              <i className="bi bi-lock"></i>
              <input
                type={showPassword ? "text" : "password"}
                id="register-password"
                placeholder="Create a strong password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={6}
                required
              />
              <button
                type="button"
                className="register-password-toggle"
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
          </div>

          <div className="register-form-group">
            <label htmlFor="register-confirm-password">
              Confirm Password
            </label>
            <div className="register-input-wrapper">
              <i className="bi bi-shield-lock"></i>
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="register-confirm-password"
                placeholder="Re-enter your password"
                autoComplete="new-password"
                  value={confirmPassword}
  onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="register-password-toggle"
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

          <div className="register-terms">
            <label>
              <input type="checkbox" required />
              <span>
                I agree to the <a href="#terms">Terms of Service</a> and{" "}
                <a href="#privacy">Privacy Policy</a>.
              </span>
            </label>
          </div>
{error && (
  <div className="alert alert-danger py-2" role="alert">
    {error}
  </div>
)}
          <button type="submit" className="register-submit-btn"  disabled={loading}>
           {loading ? "Creating Account..." : "Create Account"}

            {!loading && <i className="bi bi-arrow-right"></i>}
          </button>
        </form>

        <div className="register-divider">
          <span></span>
          <p>OR SIGN UP WITH</p>
          <span></span>
        </div>

        <div className="register-social-buttons">
          <button type="button" className="register-social-btn">
            <i className="bi bi-google"></i>
            Google
          </button>

          <button type="button" className="register-social-btn">
            <i className="bi bi-github"></i>
            GitHub
          </button>
        </div>

        <p className="register-login-text">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>

      <p className="register-footer">
        <i className="bi bi-shield-check"></i>
        Your code. Your knowledge. All in one secure place.
      </p>
    </div>
  );
};

export default Register;

