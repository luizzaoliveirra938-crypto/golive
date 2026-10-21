import { useNavigate, useParams } from 'react-router-dom'
import { legal } from '../data'
import { Icon } from '../components/Icons'

export default function Legal() {
  const { doc } = useParams()
  const navigate = useNavigate()
  const page = legal[doc]

  if (!page) {
    return (
      <div className="empty">
        <h3>Page unavailable</h3>
        <button type="button" className="btn" onClick={() => navigate('/account')}>
          Back
        </button>
      </div>
    )
  }

  return (
    <div className="page">
      <header className="subhead">
        <button type="button" className="icon-btn" aria-label="Back" onClick={() => navigate('/account')}>
          <Icon name="back" />
        </button>
        <h1>{page.title}</h1>
      </header>
      <article className="prose">
        <p className="hint left">Updated {page.updated}</p>
        {page.sections.map((section) => (
          <section key={section.heading}>
            <h2>{section.heading}</h2>
            <p>{section.body}</p>
          </section>
        ))}
      </article>
    </div>
  )
}
