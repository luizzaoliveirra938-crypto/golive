export function Logo({ className = '' }) {
  return (
    <div className={`logo ${className}`.trim()} aria-label="GoLive">
      <img className="logo-mark" src="/golive-icon.png" alt="" width={120} height={120} />
    </div>
  )
}
