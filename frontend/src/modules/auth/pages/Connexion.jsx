import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import CodeInput from '../components/CodeInput';
import Button from '../../../components/ui/Button';
import { CODE_LONGUEUR, CODE_MOCK, ID_MODE, demanderCode, messageErreur, verifierCode } from '../auth.service';
import { USE_MOCKS } from '../../../lib/apiClient';
import { useAuth } from '../../../context/AuthContext';

export default function Connexion() {
  const navigate = useNavigate();
  const location = useLocation();
  const retour = location.state?.from ?? '/annonces';
  const [identifiant, setIdentifiant] = useState('');
  const [envoye, setEnvoye] = useState(false);
  const [code, setCode] = useState('');
  const [erreur, setErreur] = useState('');
  const [charge, setCharge] = useState(false);
  const [compte, setCompte] = useState(0);
  const [devCode, setDevCode] = useState('');
  const { login } = useAuth();

  useEffect(() => {
    if (compte <= 0) return;
    const t = setTimeout(() => setCompte((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [compte]);

  const valide = () =>
    ID_MODE === 'phone'
      ? /^0[4-6]\d{7}$/.test(identifiant.replace(/\s/g, ''))
      : /^\S+@\S+\.\S+$/.test(identifiant);

  const envoyer = async () => {
    if (!valide()) {
      setErreur(ID_MODE === 'phone' ? 'Entrez un numéro valide, ex. 06 123 4567.' : 'Entrez une adresse e-mail valide.');
      return;
    }
    setErreur('');
    setCharge(true);
    try {
      const r = await demanderCode({ identifiant: identifiant.replace(/\s/g, '') });
      setDevCode(r?.devCode ?? '');
      setEnvoye(true);
      setCompte(42);
    } catch (err) {
      setErreur(messageErreur(err, "Impossible d'envoyer le code. Réessayez."));
    } finally {
      setCharge(false);
    }
  };

  const soumettre = async (e) => {
    e.preventDefault();
    if (!envoye) return envoyer();
    if (code.length < CODE_LONGUEUR) return setErreur(`Entrez les ${CODE_LONGUEUR} chiffres du code.`);
    setErreur('');
    setCharge(true);
    try {
      const { user, token } = await verifierCode({ identifiant: identifiant.replace(/\s/g, ''), code });
      login(user, token);
       const dest = user.role === 'admin' ? '/admin/signalements'
        : user.role === 'proprietaire' ? '/annonceur/publier' : retour;
      navigate(dest, { replace: true });
    } catch (err) {
      const msg = messageErreur(err, 'Code incorrect ou expiré.');
      setErreur(msg.startsWith('Inscription incomplète') ? 'Aucun compte avec ce numéro. Créez un compte.' : msg);
      setCharge(false);
    }
  };

  return (
    <form className="auth__form" onSubmit={soumettre} noValidate>
      <h1>Se connecter</h1>
      <p className="auth__sous">Pas de mot de passe : un code SMS suffit.</p>

      <label htmlFor="identifiant">{ID_MODE === 'phone' ? 'Numéro de téléphone' : 'Adresse e-mail'}</label>
      <div className="auth__tel">
        {ID_MODE === 'phone' && <span>+242</span>}
        <input
          id="identifiant"
          type={ID_MODE === 'phone' ? 'tel' : 'email'}
          placeholder={ID_MODE === 'phone' ? '06 123 4567' : 'vous@exemple.com'}
          value={identifiant}
          onChange={(e) => setIdentifiant(e.target.value)}
          disabled={envoye || charge}
        />
      </div>

      {envoye && (
        <>
          <label>Code reçu par SMS</label>
          <CodeInput longueur={CODE_LONGUEUR} valeur={code} onChange={setCode} disabled={charge} />
          <p className="auth__aide">
            {compte > 0 ? (
              <>Renvoyer dans 0:{String(compte).padStart(2, '0')}</>
            ) : (
              <button type="button" className="auth__lien" onClick={envoyer}>Renvoyer le code</button>
            )}
          </p>
          {(USE_MOCKS || devCode) && <p className="auth__demo">Démo : le code est {USE_MOCKS ? CODE_MOCK : devCode}</p>}
        </>
      )}

      <p className="auth__erreur" role="alert">{erreur}</p>

      <Button type="submit" block size="lg" disabled={charge}>
        {charge ? 'Patientez…' : envoye ? 'Se connecter' : 'Recevoir mon code'}
      </Button>

      <p className="auth__bas">
        Pas encore de compte ? <Link to={`/inscription${location.search}`} state={location.state}>Créer un compte</Link>
      </p>
    </form>
  );
}