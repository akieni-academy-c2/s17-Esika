import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import Footer from "../components/Footer.jsx";
import "../modules/annonceur/annonceur.css";

export default function AnnonceurLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const deconnecter = () => {
    logout();
    navigate("/", { replace: true });
  };

  return (
    <>
      <header className="esp">
        <div className="esp__inner">
          <Link to="/" className="esp__logo" aria-label="ESIKA, accueil">ESIKA</Link>
          <span className="esp__badge">Espace propriétaire</span>

          <nav className="esp__liens" aria-label="Espace propriétaire">
            <NavLink to="/annonceur/mes-annonces">Mes annonces</NavLink>
            <NavLink to="/annonceur/publier">Publier</NavLink>
            <NavLink to="/comment-ca-marche">Comment ça marche</NavLink>
          </nav>

          <div className="esp__droite">
            <Link to="/annonceur/publier" className="pub__btn pub__btn--plein esp__cta">
              + Publier une annonce
            </Link>
            <span className="esp__user">
              <span className="esp__avatar" aria-hidden="true">{user?.prenom?.[0]}</span>
              <span className="esp__nom">{user?.prenom} {user?.nom?.[0]}.</span>
            </span>
            <button type="button" className="esp__logout" onClick={deconnecter}>Déconnexion</button>
          </div>
        </div>
      </header>

      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}