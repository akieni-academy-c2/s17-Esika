import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useOutletContext } from 'react-router-dom';
import CodeInput from '../components/CodeInput';
import PasswordField from '../components/PasswordField';
import { IconCheck, IconChevron, IconHome, IconSearch } from '../../../components/ui/Icons';
import Button from '../../../components/ui/Button';
import { CODE_LONGUEUR, CODE_MOCK, demanderCode, messageErreur, verifierCode } from '../auth.service';
import { useAuth } from '../../../context/AuthContext';

export default function Inscription() {
  const navigate = useNavigate();
  const location = useLocation();
  const retour = location.state?.from ?? '/annonces';
  const [etape, setEtape] = useState(1);
  const [f, setF] = useState({
    role: new URLSearchParams(location.search).get('role') === 'annonceur' ? 'proprietaire' : 'locataire', prenom: '', nom: '', telephone: '', whatsapp: true,
    ville: 'Brazzaville', email: '', motDePasse: '', confirmation: '', cgu: false,
  });
  const [code, setCode] = useState('');
  const [erreur, setErreur] = useState('');
  const [charge, setCharge] = useState(false);
  const [compte, setCompte] = useState(0);
  const { login } = useAuth();
  const setPanneau = useOutletContext()?.setPanneau;

  // Le panneau sombre de gauche suit le rôle choisi et l'étape en cours
  useEffect(() => {
    if (!setPanneau) return;
    setPanneau(etape === 2 ? 'verification' : f.role === 'proprietaire' ? 'inscription-proprio' : 'inscription');
    return () => setPanneau(null);
  }, [etape, f.role, setPanneau]);

  useEffect(() => {
    if (compte <= 0) return;
    const t = setTimeout(() => setCompte((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [compte]);

  const maj = (champ, valeur) => setF((p) => ({ ...p, [champ]: valeur }));
  const tel = f.telephone.replace(/\s/g, '');

  const envoyer = async (e) => {
    e?.preventDefault();
    if (!f.prenom.trim() || !f.nom.trim()) return setErreur('Prénom et nom sont obligatoires.');
    if (!/^0[4-6]\d{7}$/.test(tel)) return setErreur('Entrez un numéro valide, ex. 06 123 4567.');
    if (f.email && !/^\S+@\S+\.\S+$/.test(f.email)) return setErreur('Adresse e-mail invalide.');
    if (f.motDePasse.length < 8) return setErreur('Le mot de passe doit contenir au moins 8 caractères.');
    if (f.motDePasse !== f.confirmation) return setErreur('Les mots de passe ne correspondent pas.');
    if (!f.cgu) return setErreur("Acceptez les conditions d'utilisation pour continuer.");
    setErreur('');
    setCharge(true);
    try {
      await demanderCode({ ...f, identifiant: tel, nom: f.nom.trim(), prenom: f.prenom.trim() });
      setEtape(2);
      setCompte(42);
    } catch (err) {
      setErreur(messageErreur(err, "Impossible d'envoyer le code. Réessayez."));
    } finally {
      setCharge(false);
    }
  };

  const creer = async (e) => {
    e.preventDefault();
    if (code.length < CODE_LONGUEUR) return setErreur(`Entrez les ${CODE_LONGUEUR} chiffres du code.`);
    setErreur('');
    setCharge(true);
    try {
      const { user, token } = await verifierCode({ identifiant: tel, code });
      login(user, token);
      navigate(user.role === 'proprietaire' ? '/annonceur/publier' : retour, { replace: true });
    } catch (err) {
      if (err.message === 'INSCRIPTION_EXPIREE') { setEtape(1); setCode(''); setErreur('Session expirée : saisissez de nouveau vos informations.'); }
      else if (err.response) { setEtape(1); setCode(''); setErreur(messageErreur(err, "Inscription impossible. Réessayez.")); }
      else setErreur(messageErreur(err, 'Code incorrect ou expiré.'));
      setCharge(false);
    }
  };

  return (
    <div className="auth__form">
      <ol className="auth__etapes" aria-label="Étapes">
        <li className={etape === 1 ? 'is-actif' : 'is-fait'}>
          <span className="auth__puce">{etape === 1 ? '1' : <IconCheck taille={14} />}</span>
          Votre profil
        </li>
        <li className={etape === 2 ? 'is-actif' : ''}>
          <span className="auth__puce">2</span>
          Vérification
        </li>
      </ol>

      {etape === 1 ? (
        <form onSubmit={envoyer} noValidate>
          <h1>Créer votre compte</h1>
          <p className="auth__sous">Gratuit, en moins d'une minute.</p>

          <fieldset className="auth__roles">
            <legend>Vous êtes…</legend>
            {[
              ['locataire', 'Je cherche un logement', 'Locataire', <IconSearch key="s" taille={20} />],
              ['proprietaire', 'Je loue un logement', 'Propriétaire', <IconHome key="h" taille={20} />],
            ].map(([val, titre, sous, icone]) => (
              <label key={val} className={`auth__role auth__role--${val}${f.role === val ? ' is-actif' : ''}`}>
                <input type="radio" name="role" checked={f.role === val} onChange={() => maj('role', val)} />
                <span className="auth__role-icone">{icone}</span>
                <span className="auth__role-texte">
                  <strong>{titre}</strong>
                  <small>{sous}</small>
                </span>
              </label>
            ))}
          </fieldset>

          <div className="auth__duo">
            <div>
              <label htmlFor="prenom">Prénom</label>
              <input id="prenom" className="auth__input" autoComplete="given-name" value={f.prenom} onChange={(e) => maj('prenom', e.target.value)} />
            </div>
            <div>
              <label htmlFor="nom">Nom</label>
              <input id="nom" className="auth__input" autoComplete="family-name" value={f.nom} onChange={(e) => maj('nom', e.target.value)} />
            </div>
          </div>
          <p className="auth__aide">Seuls votre prénom et l'initiale de votre nom sont visibles (ex. « Karine M. »).</p>

          <label htmlFor="tel">Numéro de téléphone</label>
          <div className="auth__tel">
            <span>+242</span>
            <input id="tel" type="tel" inputMode="tel" autoComplete="tel-national" placeholder="06 123 4567" value={f.telephone} onChange={(e) => maj('telephone', e.target.value)} />
          </div>
          <label className="auth__check">
            <input type="checkbox" checked={f.whatsapp} onChange={(e) => maj('whatsapp', e.target.checked)} />
            <span>C'est aussi mon numéro WhatsApp</span>
          </label>

          <div className="auth__duo">
            <div>
              <label htmlFor="mdp">Mot de passe</label>
              <PasswordField id="mdp" autoComplete="new-password" placeholder="8 caractères minimum" value={f.motDePasse} onChange={(e) => maj('motDePasse', e.target.value)} />
            </div>
            <div>
              <label htmlFor="mdp2">Confirmer le mot de passe</label>
              <PasswordField id="mdp2" autoComplete="new-password" value={f.confirmation} onChange={(e) => maj('confirmation', e.target.value)} />
            </div>
          </div>

          <div className="auth__duo">
            <div>
              <label id="lbl-ville">Ville</label>
              <div className="auth__segment" role="group" aria-labelledby="lbl-ville">
                {['Brazzaville', 'Pointe-Noire'].map((v) => (
                  <button key={v} type="button" aria-pressed={f.ville === v} className={f.ville === v ? 'is-actif' : ''} onClick={() => maj('ville', v)}>
                    {v}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label htmlFor="email">E-mail <span className="auth__facultatif">(facultatif)</span></label>
              <input id="email" type="email" className="auth__input" autoComplete="email" placeholder="vous@exemple.com" value={f.email} onChange={(e) => maj('email', e.target.value)} />
            </div>
          </div>

          <label className="auth__check auth__check--cgu">
            <input type="checkbox" checked={f.cgu} onChange={(e) => maj('cgu', e.target.checked)} />
            <span>J'accepte les <Link to="/conditions" target="_blank" className="auth__cgu-lien">conditions d'utilisation</Link> et je retiens que <strong>je ne paie jamais un logement avant de l'avoir visité</strong>.</span>
          </label>

          <p className="auth__erreur" role="alert">{erreur}</p>
          <Button type="submit" block size="lg" disabled={charge}>
            {charge ? 'Envoi…' : <>Recevoir mon code par SMS <IconChevron taille={18} /></>}
          </Button>
          <p className="auth__bas">Déjà un compte ? <Link to={`/connexion${location.search}`} state={location.state}>Se connecter</Link></p>
        </form>
      ) : (
        <form onSubmit={creer} noValidate>
          <h1>Vérifiez votre numéro</h1>
          <p className="auth__sous">
            Nous avons envoyé un code à {CODE_LONGUEUR} chiffres au <strong>+242 {f.telephone}</strong>.{' '}
            <button type="button" className="auth__lien" onClick={() => { setEtape(1); setCode(''); setErreur(''); }}>
              Modifier le numéro
            </button>
          </p>
          <CodeInput longueur={CODE_LONGUEUR} valeur={code} onChange={setCode} disabled={charge} />
          <p className="auth__aide">
            {compte > 0 ? <>Pas reçu ? Renvoyer dans 0:{String(compte).padStart(2, '0')}</> : (
              <button type="button" className="auth__lien" onClick={envoyer}>Renvoyer le code</button>
            )}
          </p>
          <p className="auth__demo">Démo : le code est {CODE_MOCK}</p>

          <div className="auth__info">
            <IconCheck taille={18} />
            <span>
              Une fois vérifié, votre profil affiche le badge <strong>Numéro vérifié</strong> : les
              propriétaires et les locataires vous font davantage confiance.
            </span>
          </div>

          <p className="auth__erreur" role="alert">{erreur}</p>
          <Button type="submit" block size="lg" disabled={charge}>
            {charge ? 'Création…' : 'Créer mon compte'}
          </Button>
          <p className="auth__note">
            Locataire : vous arrivez sur la recherche d'annonces. Propriétaire : vous arrivez sur « Publier une annonce ».
          </p>
        </form>
      )}
    </div>
  );
}
