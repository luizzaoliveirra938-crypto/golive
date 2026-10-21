import { useNavigate } from 'react-router-dom'
import { useApp } from '../context'
import { deviceLabel, statusLabel } from '../auth'
import { Icon } from '../components/Icons'
import { ProofUpload } from '../components/ProofUpload'
import { rm } from '../data'

const PLAN = {
  name: 'GoLive device access',
  price: 49,
  note: 'Monthly access for one approved device',
}

export default function Subscribe() {
  const navigate = useNavigate()
  const { thisDevice, deviceId, deviceStatus, submitSubscribeProof } = useApp()

  if (!thisDevice) {
    return (
      <div className="page auth">
        <div className="pad empty">
          <h3>Sign up first</h3>
          <button type="button" className="btn" onClick={() => navigate('/signup')}>
            Go to sign up
          </button>
        </div>
      </div>
    )
  }

  const waiting = deviceStatus === 'subscribe_pending'

  return (
    <div className="page auth">
      <header className="subhead">
        <button type="button" className="icon-btn" aria-label="Back" onClick={() => navigate('/signin')}>
          <Icon name="back" />
        </button>
        <h1>Subscribe</h1>
      </header>
      <div className="pad">
        <p className="lede tight">
          Admin asked this device to subscribe before access. Pay the fee below, then upload proof for confirmation.
        </p>
        <div className="device-chip">
          {deviceLabel(deviceId)} · {thisDevice.name} · {statusLabel(deviceStatus)}
        </div>

        <section className="summary-card">
          <div className="sum-row">
            <span>Plan</span>
            <strong>{PLAN.name}</strong>
          </div>
          <div className="sum-row">
            <span>Amount</span>
            <strong>{rm(PLAN.price)}</strong>
          </div>
          <p className="section-hint">{PLAN.note}</p>
          <div className="pay-list static">
            <div className="pay on">
              <span>
                <strong>Bank transfer / eWallet</strong>
                <small>Use reference: {String(deviceId).slice(0, 8).toUpperCase()}</small>
              </span>
            </div>
          </div>
        </section>

        {waiting ? (
          <div className="banner">
            Proof submitted. Waiting for admin confirmation. You can sign in once this device is allowed.
          </div>
        ) : (
          <ProofUpload
            title="Upload subscription proof"
            onSubmit={(proof) => {
              const result = submitSubscribeProof(proof)
              if (!result.ok) return
            }}
          />
        )}

        {waiting && thisDevice.subscribeProof && !thisDevice.subscribeProof.startsWith('data:application/pdf') && (
          <img className="proof-photo" src={thisDevice.subscribeProof} alt="Submitted proof" />
        )}

        <button type="button" className="btn ghost block" onClick={() => navigate('/signin')}>
          Back to sign in
        </button>
      </div>
    </div>
  )
}
