'use client'
import { useState } from 'react'
import { apiLogin, apiRegister } from '../lib/api'
import { avatarInitials } from '../lib/utils'

export default function LoginPage({ onLogin }) {
  const [tab, setTab] = useState('signin')
  const [siEmail, setSiEmail] = useState('')
  const [siPass, setSiPass] = useState('')
  const [regName, setRegName] = useState('')
  const [regEmail, setRegEmail] = useState('')
  const [regPass, setRegPass] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function doLogin() {
    if (!siEmail || !siPass) { setError('Please fill in all fields.'); return }
    setLoading(true); setError('')
    try {
      const data = await apiLogin(siEmail, siPass)
      const u = {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        initials: avatarInitials(data.user.name),
        isAdmin: data.user.role === 'admin',
        role: data.user.role
      }
      localStorage.setItem('cv_session', JSON.stringify(u))
      onLogin(u)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function doRegister() {
    if (!regName || !regEmail || !regPass) { setError('Please fill in all fields.'); return }
    if (regPass.length < 6) { setError('Password must be at least 6 characters.'); return }
    setLoading(true); setError('')
    try {
      await apiRegister(regName, regEmail, regPass)
      const data = await apiLogin(regEmail, regPass)
      const u = {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        initials: avatarInitials(data.user.name),
        isAdmin: data.user.role === 'admin',
        role: data.user.role
      }
      localStorage.setItem('cv_session', JSON.stringify(u))
      onLogin(u, 'register')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const switchTab = (t) => { setTab(t); setError('') }

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>{tab === 'signin' ? 'Welcome back' : 'Create account'}</h1>
        <p className="subtitle">
          {tab === 'signin' ? 'Sign in to your Campus Voice account' : 'Join your campus community'}
        </p>
        <div className="tab-row">
          <button className={`tab-btn ${tab === 'signin' ? 'active' : ''}`} onClick={() => switchTab('signin')}>Sign in</button>
          <button className={`tab-btn ${tab === 'register' ? 'active' : ''}`} onClick={() => switchTab('register')}>Register</button>
        </div>
        {error && <div className="error-msg">{error}</div>}
        {tab === 'signin' ? (
          <div>
            <div className="form-group">
              <label>College email</label>
              <input type="email" placeholder="bhoomi@psit.ac.in" value={siEmail}
                onChange={e => setSiEmail(e.target.value)} onKeyDown={e => e.key === 'Enter' && doLogin()} />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" placeholder="••••••••" value={siPass}
                onChange={e => setSiPass(e.target.value)} onKeyDown={e => e.key === 'Enter' && doLogin()} />
            </div>
            <button className="btn-primary" onClick={doLogin} disabled={loading}>
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
            <div className="divider">or</div>
            <div className="login-switch">
              Don&apos;t have an account? <span onClick={() => switchTab('register')}>Register</span>
            </div>
          </div>
        ) : (
          <div>
            <div className="form-group">
              <label>Full name</label>
              <input type="text" placeholder="Bhavishya Kumar" value={regName} onChange={e => setRegName(e.target.value)} />
            </div>
            <div className="form-group">
              <label>College email</label>
              <input type="email" placeholder="you@psit.ac.in" value={regEmail} onChange={e => setRegEmail(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" placeholder="Create a password" value={regPass} onChange={e => setRegPass(e.target.value)} />
            </div>
            <button className="btn-primary" onClick={doRegister} disabled={loading}>
              {loading ? 'Creating account…' : 'Create account'}
            </button>
            <div className="login-switch" style={{ marginTop: 14 }}>
              Already have an account? <span onClick={() => switchTab('signin')}>Sign in</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
