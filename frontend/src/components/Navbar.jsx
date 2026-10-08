import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { ROLES, VILLES } from "../config/constants.js";
import { lireVille, ecrireVille } from "../lib/ville.js";
import Button from "./ui/Button.jsx";
import {
  IconChevronDown,
  IconHome,
  IconLogout,
  IconMenu,
  IconPin,
  IconX,
} from "./ui/Icons.jsx";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [ville, setVille] = useState(lireVille);
  const [ouvert, setOuvert] = useState(false);
  const entete = useRef(null);

  // Propriétaire connecté
  const estProprietaire =
    !!user && [ROLES.ANNONCEUR, "proprietaire"].includes(user.role);

  // Locataire connecté
  const estLocataire =
    !!user && user.role === ROLES.LOCATAIRE;

  // Accueil public
  const estAccueil = pathname === "/";

  useEffect(() => {
    setOuvert(false);
  }, [pathname]);

  useEffect(() => {
    if (!ouvert) return undefined;

    const echap = (e) => e.key === "Escape" && setOuvert(false);

    const dehors = (e) => {
      if (entete.current && !entete.current.contains(e.target)) {
        setOuvert(false);
      }
    };

    document.addEventListener("keydown", echap);
    document.addEventListener("pointerdown", dehors);

    return () => {
      document.removeEventListener("keydown", echap);
      document.removeEventListener("pointerdown", dehors);
    };
  }, [ouvert]);

  const deconnecter = () => {
    logout();
    navigate("/", { replace: true });
  };

  const changerVille = (e) => {
    const v = e.target.value;

    setVille(v);
    ecrireVille(v);

    if (pathname === "/annonces") {
      navigate(`/annonces?ville=${encodeURIComponent(v)}`);
    }
  };

  return (
    <header className="navbar" ref={entete}>
      <div className="container navbar__inner">

        <Link to="/" className="logo" aria-label="ESIKA, accueil">
          <span className="logo__mark" />
          ESIKA
        </Link>

        <button
          type="button"
          className="navbar__burger"
          aria-label={ouvert ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={ouvert}
          aria-controls="menu-principal"
          onClick={() => setOuvert((o) => !o)}
        >
          {ouvert ? <IconX taille={22} /> : <IconMenu taille={22} />}
        </button>

        <div
          id="menu-principal"
          className={`navbar__panneau${
            ouvert ? " navbar__panneau--ouvert" : ""
          }`}
        >

          <nav className="navbar__links" aria-label="Navigation principale">
            <NavLink to="/annonces">Trouver un logement</NavLink>
            <NavLink to="/comment-ca-marche">
              Comment ça marche
            </NavLink>
          </nav>

          <div className="navbar__actions">

            {/* 
              Sur l'accueil :
              le sélecteur de ville est remplacé par "S'inscrire".
              
              Sur les autres pages :
              le sélecteur de ville reste disponible.
            */}
            {estAccueil && !user ? (
              <Button to="/inscription" variant="outline" size="sm">
                S'inscrire
              </Button>
            ) : !estAccueil ? (
              <label className="ville-select">
                <span className="sr-only">Ville</span>

                <IconPin
                  taille={15}
                  className="ville-select__pin"
                />

                <select
                  value={ville}
                  onChange={changerVille}
                >
                  {VILLES.map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </select>

                <IconChevronDown
                  taille={14}
                  className="ville-select__fleche"
                />
              </label>
            ) : null}

            {/* 
              Propriétaire :
              "Mon espace"

              Visiteur non connecté :
              "Je suis propriétaire"

              Locataire connecté :
              RIEN → le bouton propriétaire disparaît.
            */}
            {estProprietaire ? (
              <Button
                to="/annonceur/mes-annonces"
                variant="outline"
                size="sm"
              >
                <IconHome taille={16} />
                Mon espace
              </Button>
            ) : !user ? (
              <Button
                to={`/connexion?role=${ROLES.ANNONCEUR}`}
                variant="outline"
                size="sm"
              >
                <IconHome taille={16} />
                Je suis propriétaire
              </Button>
            ) : null}

            {user ? (
              <>
                <span className="navbar__user">
                  <span
                    className="navbar__avatar"
                    aria-hidden="true"
                  >
                    {user.prenom?.[0]}
                  </span>

                  {user.prenom} {user.nom?.[0]}.
                </span>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={deconnecter}
                >
                  <IconLogout taille={16} />
                  Déconnexion
                </Button>
              </>
            ) : (
              <Button to="/connexion" size="sm">
                Se connecter
              </Button>
            )}

          </div>
        </div>
      </div>
    </header>
  );
}