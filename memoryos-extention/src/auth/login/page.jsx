import { useState } from "react";
import "../../App.css";

export default function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      console.log("data", data);

      if (res.ok) {
       console.log("Login successful, session data saved:", data);
      onLoginSuccess(data);
      localStorage.setItem("sessionData", JSON.stringify(data));
      }

 setErrorMessage(data.message || "Invalid email or password.");
        setPassword("");
        return;
    //   window.alert("Login successful, session data saved:", data);
    
    } catch (err) {
      console.error(err);
      setErrorMessage("Couldn't reach MemoryOS. Is the server running?");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app">
      <div className="glow glow-violet" />
      <div className="glow glow-cyan" />

      <div className="content">
        <div className="login-header">
          <div className="logo-mark">
            <SparkleIcon />
          </div>
          <span className="wordmark">MemoryOS</span>
        </div>

        <p className="login-subtitle">Log in to save pages to your second brain.</p>

        <form onSubmit={handleSubmit} className="glass-card login-card">
          <label className="field-label" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="input-field"
          />

          <label className="field-label" htmlFor="password">
            Password
          </label>
          <div className="input-wrap">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="input-field"
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="input-toggle"
              tabIndex={-1}
            >
              {showPassword ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </div>

          {errorMessage && <p className="login-error">{errorMessage}</p>}

          <button type="submit" disabled={loading} className="save-btn login-submit">
            {loading ? (
              <>
                <span className="spinner" />
                Logging in...
              </>
            ) : (
              "Log in"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

function SparkleIcon({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 2l1.8 5.6L19 9.5l-5.2 1.9L12 17l-1.8-5.6L5 9.5l5.2-1.9L12 2z" fill="currentColor" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
      <path
        d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
      <path
        d="M3 3l18 18M10.6 10.6a3 3 0 0 0 4.24 4.24M6.6 6.7C4.5 8 3 10 2 12c0 0 3.5 7 10 7 2 0 3.7-.6 5.1-1.4M9.9 4.2A9.6 9.6 0 0 1 12 4c6.5 0 10 7 10 7-.6 1.1-1.6 2.6-3 4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}