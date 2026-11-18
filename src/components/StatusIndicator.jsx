export function StatusIndicator({ children, tone = 'sage', dot = true }) {
  return (
    <span className={`status-indicator status-${tone}`}>
      {dot && <span className="status-dot" />}
      {children}
    </span>
  );
}

export function PageHeading({ eyebrow, title, description, action }) {
  return (
    <div className="page-heading">
      <div>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1>{title}</h1>
        {description && <p className="page-description">{description}</p>}
      </div>
      {action && <div className="page-heading-action">{action}</div>}
    </div>
  );
}
