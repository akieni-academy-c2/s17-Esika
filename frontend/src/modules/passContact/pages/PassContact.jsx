import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getAnnonceById } from '../../annonces/annonces.service';
import { acheterPass, getPassActif } from '../passContact.service';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';
import Spinner from '../../../components/ui/Spinner';
import { formatFCFA } from '../../../lib/format';
import { PASS_PRIX } from '../../../config/constants';
import '../passContact.css';

const OPERATEURS = [
  { id: 'mtn', nom: 'MTN Mobile Money', sigle: 'MoMo' },
  { id: 'airtel', nom: 'Airtel Money', sigle: 'Airtel' },
];

export default function PassContact() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [annonce, setAnnonce] = useState(null);
  const [operateur, setOperateur] = useState('mtn');
  const [numero, setNumero] = useState('');
  const [erreur, setErreur] = useState('');
  const [paiement, setPaiement] = useState(false);

  useEffect(() => {
    // TODO : si non connecté -> /connexion (quand AuthContext + ProtectedRoute existent)
    getPassActif().then((p) => p && navigate(`/annonces/${id}/contact`, { replace: true }));
    getAnnonceById(id).then(setAnnonce);
  }, [id, navigate]);

  const payer = async (e) => {
    e.preventDefault();
    const propre = numero.replace(/\s/g, '');
    if (!/^0[4-6]\d{7}$/.test(propre)) {
      setErreur('Entrez un numéro valide, par exemple 06 123 4567.');
      return;
    }
    setErreur('');
    setPaiement(true);
    try {
      await acheterPass({ operateur, numero: propre });
      navigate(`/annonces/${id}/contact`, { replace: true });
    } catch {
      setErreur('Le paiement a échoué. Vérifiez votre solde et réessayez.');
      setPaiement(false);
    }
  };

  if (!annonce) {
    return <div className="pass pass--centre"><Spinner /></div>;
  }

  const total = annonce.loyer * (annonce.cautionMois + annonce.avanceMois);

  return (
    <div className="pass">
      <div className="pass__container">
        <ol className="pass__etapes" aria-label="Étapes">
          <li className="pass__etape--faite">Annonce</li>
          <li className="pass__etape--active" aria-current="step">Pass Contact</li>
          <li>Contact du propriétaire</li>
        </ol>

        <div className="pass__grille">
          <div>
            <h1>Débloquez le contact du propriétaire</h1>

            <Link to={`/annonces/${annonce.id}`} className="pass__annonce">
              <div className="pass__vignette" aria-hidden="true" />
              <div>
                <strong>{annonce.titre}</strong>
                <p>{annonce.repere ? `${annonce.repere}, ` : ''}{annonce.ville}</p>
                <p>
                  <strong>{formatFCFA(annonce.loyer)}</strong>/mois · entrée {formatFCFA(total)}
                </p>
                {annonce.numeroVerifie && <Badge variant="success">Numéro vérifié</Badge>}
              </div>
            </Link>

            <div className="pass__offre">
              <div className="pass__offre-tete">
                <span>PASS CONTACT · 7 JOURS</span>
                <strong>{formatFCFA(PASS_PRIX)}</strong>
              </div>
              <ul>
                <li>Contact direct de tous les propriétaires</li>
                <li>Appel et WhatsApp pendant 7 jours</li>
                <li>Aucun frais de démarcheur</li>
              </ul>
            </div>
          </div>

          <form className="pass__paiement" onSubmit={payer} noValidate>
            <h2>Paiement Mobile Money</h2>

            <fieldset className="pass__operateurs" disabled={paiement}>
              <legend className="pass__sr">Opérateur</legend>
              {OPERATEURS.map((o) => (
                <label key={o.id} className={operateur === o.id ? 'is-actif' : ''}>
                  <input
                    type="radio"
                    name="operateur"
                    value={o.id}
                    checked={operateur === o.id}
                    onChange={() => setOperateur(o.id)}
                  />
                  <span className="pass__sigle">{o.sigle}</span>
                  {o.nom}
                </label>
              ))}
            </fieldset>

            <label className="pass__champ" htmlFor="numero-momo">Numéro Mobile Money</label>
            <div className="pass__tel">
              <span>+242</span>
              <input
                id="numero-momo"
                type="tel"
                inputMode="numeric"
                autoComplete="tel-national"
                placeholder="06 123 4567"
                value={numero}
                onChange={(e) => setNumero(e.target.value)}
                aria-invalid={!!erreur}
                aria-describedby="erreur-momo"
                disabled={paiement}
              />
            </div>
            <p id="erreur-momo" className="pass__erreur" role="alert" aria-live="assertive">
              {erreur}
            </p>

            <div className="pass__total">
              <span>Total</span>
              <strong>{formatFCFA(PASS_PRIX)}</strong>
            </div>

            <Button type="submit" block size="lg" disabled={paiement}>
              {paiement ? 'Paiement en cours…' : `Payer ${formatFCFA(PASS_PRIX)}`}
            </Button>

            <p className="pass__demo">
              <strong>Version de démonstration :</strong> paiement simulé, aucun débit réel.
            </p>
            <p className="pass__note">
              C'est le seul paiement sur ESIKA. Caution et loyer se règlent au propriétaire, après
              la visite, contre reçu.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}