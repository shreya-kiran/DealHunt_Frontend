import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function LoginPage() {
  const { theme, toggle } = useTheme();
  const navigate = useNavigate();

  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors]     = useState({});
  const [loading, setLoading]   = useState(false);

  function validate() {
    const errs = {};
    if (!email.trim())           errs.email = 'Email is required.';
    else if (!isValidEmail(email)) errs.email = 'Enter a valid email address.';
    if (!password)               errs.password = 'Password is required.';
    return errs;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    setTimeout(() => navigate('/dashboard'), 600);
  }

  function handleSso() {
    navigate('/dashboard');
  }

  return (
    <div className="auth-page">
      <button className="theme-toggle" aria-label="Toggle theme" onClick={toggle}>
        {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
      </button>

      <div className="auth-wrapper">
        <div className="auth-card">
          <Link to="/dashboard" className="auth-logo" aria-label="DealHunt home">
            <img src="/assets/images/light_mode.png" alt="DealHunt" className="logo-mode-light" />
            <img src="/assets/images/dark_mode.png"  alt="DealHunt" className="logo-mode-dark" />
          </Link>

          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-subtitle">Sign in to continue hunting deals</p>

          <form className="auth-form" noValidate onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="login-email" className="input-label">Email Address</label>
              <input
                type="email" id="login-email" className={`input-field${errors.email ? ' is-error' : email && !errors.email ? ' is-valid' : ''}`}
                placeholder="you@example.com" autoComplete="email"
                value={email} onChange={e => { setEmail(e.target.value); setErrors(p => ({ ...p, email: '' })); }}
              />
              {errors.email && <span className="input-error">{errors.email}</span>}
            </div>

            <div className="input-group">
              <label htmlFor="login-password" className="input-label">Password</label>
              <div className="input-wrapper">
                <input
                  type={showPass ? 'text' : 'password'} id="login-password"
                  className={`input-field${errors.password ? ' is-error' : ''}`}
                  placeholder="Enter your password" autoComplete="current-password"
                  value={password} onChange={e => { setPassword(e.target.value); setErrors(p => ({ ...p, password: '' })); }}
                />
                <button type="button" className="toggle-password" aria-label="Toggle password" onClick={() => setShowPass(s => !s)}>
                  {showPass ? <EyeClosedIcon /> : <EyeOpenIcon />}
                </button>
              </div>
              {errors.password && <span className="input-error">{errors.password}</span>}
            </div>

            <div className="form-options">
              <label className="checkbox-label" htmlFor="remember-me">
                <input type="checkbox" id="remember-me" />
                <span className="checkbox-custom" />
                Remember me
              </label>
              <a href="#" className="link-subtle">Forgot password?</a>
            </div>

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? <span className="btn-loader" /> : <span>Log In</span>}
            </button>

            <div className="divider"><span>or continue with</span></div>

            <div className="sso-group">
              <button className="sso-btn" type="button" onClick={handleSso}>
                <GoogleIcon />
                Google
              </button>
              <button className="sso-btn" type="button" onClick={handleSso}>
                <AppleIcon />
                Apple
              </button>
            </div>
          </form>

          <p className="auth-footer-text">
            Don't have an account?{' '}
            <Link to="/signup" className="link-accent">Sign up — it's free</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function SunIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="5"/>
      <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
      <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  );
}

function EyeOpenIcon() {
  return (
    <svg className="icon-eye" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  );
}

function EyeClosedIcon() {
  return (
    <svg className="icon-eye" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg className="sso-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg className="sso-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
    </svg>
  );
}
