import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context'
import { ADMIN_EMAIL, matchesAdminLogin } from '../auth'
import { Icon } from '../components/Icons'

export default function AdminLogin() {
  const navigate = useNavigate()
  const { adminUnlocked, unlockAdmin } = useApp()
  const [email, setEmail] = useState(ADMIN_EMAIL)
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (adminUnlocked) navigate('/admin', { replace: true })
  }, [adminUnlocked, navigate])

  function submit(event) {
    event.preventDefault()
    if (!matchesAdminLogin(email, password)) {
      setError('Incorrect admin email or password.')
      return
    }
    unlockAdmin()
    navigate('/admin', { replace: true })
  }

  return (
    <div className="page auth admin-auth">
      <header className="subhead">
        <button type="button" className="icon-btn" aria-label="Back" onClick={() => navigate('/signin')}>
          <Icon name="back" />
        </button>
        <h1>Admin login</h1>
      </header>
      <form className="pad" onSubmit={submit} noValidate>
        <p className="lede tight">Separate admin access. This is not the member sign-in.</p>
        <label className="field">
          <span>Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              setError('')
            }}
            className={error ? 'bad' : ''}
            autoComplete="username"
          />
        </label>
        <label className="field">
          <span>Password</span>
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              setError('')
            }}
            className={error ? 'bad' : ''}
            autoComplete="current-password"
          />
          <button type="button" className="ghost-eye" onClick={() => setShowPassword((value) => !value)}>
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </label>
        {error && <em className="err block-err">{error}</em>}
        <button type="submit" className="btn block">
          Sign in as admin
        </button>
      </form>
    </div>
  )
}
