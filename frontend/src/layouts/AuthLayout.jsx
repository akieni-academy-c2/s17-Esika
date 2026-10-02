import { Link, Outlet } from 'react-router-dom';
import '../modules/auth/auth.css';

export default function AuthLayout() {
  return (
    <div className="auth">
      <aside className="auth__panneau">
        <Link to="/" className="auth__logo">ESIKA</Link>
        <ul className="auth__atouts">
          <li>Zéro commission, zéro démarcheur</li>
          <li>Le total à l'entrée affiché sur chaque annonce</li>
          <li>Le contact direct du propriétaire, par appel ou WhatsApp</li>
        </ul>
        <p className="auth__alerte">
          ESIKA ne vous demandera jamais d'argent pour un logement. Seul le Pass Contact est
          payant.
        </p>
      </aside>
      <main className="auth__contenu">
        <Outlet />
      </main>
    </div>
  );
}