import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import { IconLock } from '../../../components/ui/Icons';
import PasswordField from '../components/PasswordField';
import { ADMIN_MOCK, ADMIN_MOCK_PASSWORD, messageErreur, seConnecter } from '../auth.service';
import { MAX_TENTATIVES, formaterDuree, tempsRestant } from '../tentatives';
import { useAuth } from '../../../context/AuthContext';

const telValide = (t) => /^0[4-6]\d{7}$/.test(t);

export default function Connexion() {
  const navigate = useNavigate();
  const location = useLocation();
  const retour = location.state?.from ?? '/annonces';
  const proprio = new URLSearchParams(location.search).get('role') === 'annonceur';
  const [identifiant, setIdentifiant] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [erreur, setErreur] = useState('');
  const [charge, setCharge] = useState(false);
  const [restantMs, setRestantMs] = useState(0); // durée de blocage restante pour le numéro saisi
  const { login } = useAuth();

  const tel = identifiant.replace(/\s/g, '');
  const verrouille = restantMs > 0;

  // Blocage du numéro saisi : recalculé quand le numéro change, puis chaque seconde tant qu'il dure
  useEffect(() => {
    setRestantMs(telValide(tel) ? tempsRestant(tel) : 0);
  }, [tel]);
  useEffect(() => {
    if (!verrouille) return undefined;
    const minuteur = setInterval(() => setRestantMs(telValide(tel) ? tempsRestant(tel) : 0), 1000);
    return () => clearInterval(minuteur);
  }, [verrouille, tel]);

  const soumettre = async (e) => {
    e.preventDefault();
    if (verrouille) return;
    if (!telValide(tel)) return setErreur('Entrez un numéro valide, ex. 06 123 4567.');
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
      setMotDePasse('');
      if (err.message === 'COMPTE_VERROUILLE' || err.verrouille) {
        // Trop d'échecs : le bandeau de blocage prend le relais
        setRestantMs(err.restantMs ?? tempsRestant(tel));
        setErreur('');
      } else {
        let message = err.message === 'COMPTE_INCONNU'
          ? 'Aucun compte avec ce numéro. Créez un compte.'
          : err.message === 'IDENTIFIANTS_ADMIN_MOCK_INVALIDES'
            ? 'Numéro ou mot de passe incorrect.'
            : messageErreur(err, 'Connexion impossible. Réessayez.');
        const n = err.tentativesRestantes;
        if (typeof n === 'number') message += ` Il vous reste ${n} tentative${n > 1 ? 's' : ''}.`;
        setErreur(message);
      }
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
        disabled={charge || verrouille}
      />

      {verrouille && (
        <div className="auth__verrou" role="alert">
          <IconLock taille={20} />
          <div>
            <strong>Connexion temporairement bloquée</strong>
            <p>
              Après {MAX_TENTATIVES} tentatives échouées, ce numéro est bloqué par sécurité.
              Réessayez dans <b aria-live="off">{formaterDuree(restantMs)}</b>.
            </p>
          </div>
        </div>
      )}

      <p className="auth__erreur" role="alert">{erreur}</p>

      {import.meta.env.DEV && import.meta.env.VITE_USE_ADMIN_MOCKS === 'true' && (
        <p className="auth__demo">Admin démo : {ADMIN_MOCK} / {ADMIN_MOCK_PASSWORD}</p>
      )}

      <Button type="submit" block size="lg" disabled={charge || verrouille}>
        {verrouille ? 'Connexion bloquée' : charge ? 'Connexion…' : 'Se connecter'}
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