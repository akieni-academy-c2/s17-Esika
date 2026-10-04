import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import PageTransition from '../components/PageTransition.jsx';
import { ICONES, PANNEAUX } from '../modules/auth/panneaux.js';
import { IconWarning } from '../components/ui/Icons.jsx';
import '../modules/auth/auth.css';

export default function AuthLayout() {
  const { pathname, search } = useLocation();
  // L'inscription peut imposer son propre panneau (rôle choisi, étape de vérification)
  const [forcee, setForcee] = useState(null);

  const proprio = new URLSearchParams(search).get('role') === 'annonceur';
  const base = (pathname.startsWith('/inscription') ? 'inscription' : 'connexion') + (proprio ? '-proprio' : '');
  const cle = forcee ?? base;
  const panneau = PANNEAUX[cle];

  return (
    <div className="auth">
      <aside className="auth__panneau">
        <Link to="/" className="auth__logo" aria-label="ESIKA, accueil">
          <span className="auth__logo-mark" />
          ESIKA
        </Link>

        <div className="auth__bloc" key={cle}>
          <p className="auth__eyebrow">{panneau.eyebrow}</p>
          <h2 className="auth__titre">{panneau.titre}</h2>
          <ul className="auth__atouts">
            {panneau.atouts.map(([icone, texte]) => {
              const Icone = ICONES[icone];
              return (
                <li key={texte}>
                  <Icone taille={18} />
                  <span>{texte}</span>
                </li>
              );
            })}
          </ul>
        </div>

        <p className="auth__alerte">
          <IconWarning taille={18} />
          <span>ESIKA ne vous demandera jamais d'argent pour un logement. Seul le Pass Contact est payant.</span>
        </p>
      </aside>

      <main className="auth__contenu">
        <PageTransition context={{ setPanneau: setForcee }} />
      </main>
    </div>
  );
}
