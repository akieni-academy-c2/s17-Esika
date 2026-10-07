import { Link } from "react-router-dom";

export default function Button({ to, href, variant = "primary", size = "md", block = false, className = "", children, ...props }) {
  const classes = ["btn", `btn--${variant}`, size !== "md" && `btn--${size}`, block && "btn--block", className]
    .filter(Boolean)
    .join(" ");

  if (to) return <Link to={to} className={classes} {...props}>{children}</Link>;
  if (href) return <a href={href} className={classes} {...props}>{children}</a>;
  return <button type="button" className={classes} {...props}>{children}</button>;
}