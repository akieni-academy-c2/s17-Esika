import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import PasswordField from '../components/PasswordField';
import { messageErreur, seConnecter } from '../auth.service';
import { useAuth } from '../../../context/AuthContext';

export default function Connexion() {
  const navigate = useNavigate();
  const location = useLocation();
  const retour = location.state?.from ?? '/annonces';
  const proprio = new URLSearchParams(location.search).get('role') === 'annonceur';
  const [identifiant, setIdentifiant] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [erreur, setErreur] = useState('');
  const [charge, setCharge] = useState(false);
  const { login } = useAuth();

  const soumettre = async (e) => {
    e.preventDefault();
    const tel = identifiant.replace(/\s/g, '');
    if (!/^0[4-6]\d{7}$/.test(tel)) return setErreur('Entrez un numéro valide, ex. 06 123 4567.');
    if (!motDePasse) return setErreur('Entrez votre mot de passe.');
    setErreur('');
    setCharge(true);
    try {
      const { user, token } = await seConnecter({ identifiant: tel, motDePasse, role: proprio ? 'proprietaire' : undefined });
      login(user, token);
      const dest = user.role === 'admin' ? '/admin/signalements'
        : user.role === 'proprietaire' ? '/annonceur/publier' : retour;
      navigate(dest, { replace: true });
    } catch (err) {
      setErreur(err.message === 'COMPTE_INCONNU'
        ? 'Aucun compte avec ce numéro. Créez un compte.'
        : messageErreur(err, 'Connexion impossible. Réessayez.'));
      setCharge(false);
    }
  };

  return (
    <form className="auth__form" onSubmit={soumettre} noValidate>
      <h1>{proprio ? 'Accéder à mes annonces' : 'Se connecter'}</h1>
      <p className="auth__sous">Entrez votre numéro et votre mot de passe.</p>

      <label htmlFor="identifiant">Numéro de téléphone</label>
      <div className="auth__tel">
        <span>+242</span>
        <input
          id="identifiant"
          type="tel"
          inputMode="tel"
          autoComplete="tel-national"
          placeholder="06 123 4567"
          value={identifiant}
          onChange={(e) => setIdentifiant(e.target.value)}
          disabled={charge}
        />
      </div>

      <label htmlFor="mdp">Mot de passe</label>
      <PasswordField
        id="mdp"
        autoComplete="current-password"
        value={motDePasse}
        onChange={(e) => setMotDePasse(e.target.value)}
        disabled={charge}
      />

      <p className="auth__erreur" role="alert">{erreur}</p>

      <Button type="submit" block size="lg" disabled={charge}>
        {charge ? 'Connexion…' : 'Se connecter'}
      </Button>

      <p className="auth__bas">
        {proprio ? 'Nouveau propriétaire ? ' : 'Pas encore de compte ? '}
        <Link to={`/inscription${location.search}`} state={location.state}>
          {proprio ? 'Créer un compte et publier gratuitement' : 'Créer un compte'}
        </Link>
      </p>
    </form>
  );
}
