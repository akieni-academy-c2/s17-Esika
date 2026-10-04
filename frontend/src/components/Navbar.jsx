import { useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { ROLES, VILLES } from "../config/constants.js";
import { lireVille, ecrireVille } from "../lib/ville.js";
import Button from "./ui/Button.jsx";
import { IconChevronDown, IconHome, IconPin } from "./ui/Icons.jsx";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [ville, setVille] = useState(lireVille);

  // Accepte la valeur de ROLES.ANNONCEUR et "proprietaire" (valeur utilisée par auth.service.js)
  const estProprietaire = !!user && [ROLES.ANNONCEUR, "proprietaire"].includes(user.role);

  const deconnecter = () => {
    logout();
    navigate("/", { replace: true });
  };

  const changerVille = (e) => {
    const v = e.target.value;
    setVille(v);
    ecrireVille(v);
    // Sur la liste, la ville choisie s'applique tout de suite
    if (pathname === "/annonces") navigate(`/annonces?ville=${encodeURIComponent(v)}`);
  };

  return (
    <header className="navbar">
      <div className="container navbar__inner">
        <Link to="/" className="logo" aria-label="ESIKA, accueil">
          <span className="logo__mark" />
          ESIKA
        </Link>

        <nav className="navbar__links" aria-label="Navigation principale">
          <NavLink to="/annonces">Trouver un logement</NavLink>
          <NavLink to="/comment-ca-marche">Comment ça marche</NavLink>
        </nav>

        <div className="navbar__actions">
          <label className="ville-select">
            <span className="sr-only">Ville</span>
            <IconPin taille={15} className="ville-select__pin" />
            <select value={ville} onChange={changerVille}>
              {VILLES.map((v) => <option key={v} value={v}>{v}</option>)}
            </select>
            <IconChevronDown taille={14} className="ville-select__fleche" />
          </label>

          {estProprietaire ? (
            <Button to="/annonceur/mes-annonces" variant="outline" size="sm">
              <IconHome taille={16} /> Mon espace
            </Button>
          ) : (
            <Button to={`/connexion?role=${ROLES.ANNONCEUR}`} variant="outline" size="sm">
              <IconHome taille={16} /> Je suis propriétaire
            </Button>
          )}

          {user ? (
            <>
              <span className="navbar__user">
                <span className="navbar__avatar" aria-hidden="true">
                  {user.prenom?.[0]}
                </span>
                {user.prenom} {user.nom?.[0]}.
              </span>
              <button type="button" className="navbar__logout" onClick={deconnecter}>
                Déconnexion
              </button>
            </>
          ) : (
            <Button to="/connexion" size="sm">Se connecter</Button>
          )}
        </div>
      </div>
    </header>
  );
}
