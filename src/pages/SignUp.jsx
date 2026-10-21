import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useApp } from '../context'
import { deviceLabel, MEMBER_EMAIL, MEMBER_PASSWORD } from '../auth'
import { Icon } from '../components/Icons'

export default function SignUp() {
  const navigate = useNavigate()
  const { signUpDevice, deviceId, thisDevice } = useApp()
  const [name, setName] = useState(thisDevice?.name || '')
  const [error, setError] = useState('')

  function submit(event) {
    event.preventDefault()
    const result = signUpDevice(name)
    if (!result.ok) {
      setError(result.error)
      return
    }
    navigate('/signin', { replace: true, state: { justSignedUp: true } })
  }

  return (
    <div className="page auth">
      <header className="subhead">
        <button type="button" className="icon-btn" aria-label="Back" onClick={() => navigate(-1)}>
          <Icon name="back" />
        </button>
        <h1>Sign up</h1>
      </header>
      <form className="pad" onSubmit={submit} noValidate>
        <p className="lede tight">
          Add your name for admin approval. The shared account email is shown below; the password stays hidden.
        </p>
        <div className="device-chip">{deviceLabel(deviceId)}</div>
        <label className="field">
          <span>Full name</span>
          <input
            value={name}
            onChange={(event) => {
              setName(event.target.value)
              setError('')
            }}
            autoComplete="name"
            className={error ? 'bad' : ''}
            placeholder="Name for approval"
          />
          {error && <em className="err">{error}</em>}
        </label>
        <label className="field">
          <span>Email</span>
          <input type="email" value={MEMBER_EMAIL} readOnly tabIndex={-1} />
        </label>
        <label className="field">
          <span>Password</span>
          <input type="password" value={MEMBER_PASSWORD} readOnly tabIndex={-1} autoComplete="off" />
        </label>
        <button type="submit" className="btn block">
          Submit for approval
        </button>
        <p className="hint">
          Already registered?{' '}
          <Link className="text-link" to="/signin">
            Sign in
          </Link>
        </p>
      </form>
    </div>
  )
}
