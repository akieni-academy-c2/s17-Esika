import "./Input.css";

export default function Input({ label, id, hint, className = "", ...props }) {
  return (
    <div className={`field ${className}`.trim()}>
      {label && <label htmlFor={id}>{label}</label>}
      <input id={id} className="input" {...props} />
      {hint && <p className="field__hint">{hint}</p>}
    </div>
  );
}