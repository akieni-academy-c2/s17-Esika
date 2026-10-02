// variant : success | warn | rose | neutral | dark
export default function Badge({ variant = "neutral", children, className = "" }) {
  return <span className={`badge badge--${variant} ${className}`.trim()}>{children}</span>;
}