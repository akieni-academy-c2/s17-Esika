import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getAnnonceById, getAnnonces } from '../annonces.service';
import GalerieAnnonce from '../components/GalerieAnnonce';
import FiabiliteAnnonce from '../components/FiabiliteAnnonce';
import EquipementsGrid from '../components/EquipementsGrid';
import AnnonceCard from '../../../components/AnnonceCard';
import BandeauAntiArnaque from '../../../components/BandeauAntiArnaque';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';
import Spinner from '../../../components/ui/Spinner';
import { formatFCFA, tempsRelatif, dateCourte } from '../../../lib/format';
import { PASS_PRIX, PASS_DUREE_JOURS } from '../../../config/constants';
import '../detail.css';
import { getPassActif } from '../../passContact/passContact.service';
import SignalerModal from '../../signalements/SignalerModal';

export default function DetailAnnonce() {
  const { id } = useParams();
  const [annonce, setAnnonce] = useState(null);
  const [similaires, setSimilaires] = useState([]);
  const [etat, setEtat] = useState('chargement'); // chargement | ok | introuvable
  const [passActif, setPassActif] = useState(false);
  const [isSignalerOpen, setIsSignalerOpen] = useState(false);
  const [signaler, setSignaler] = useState(false);


  useEffect(() => {
    let annule = false;
    setEtat('chargement');
    window.scrollTo(0, 0);

    getAnnonceById(id)
      .then(async (a) => {
        if (annule) return;
        if (!a) return setEtat('introuvable');
        setAnnonce(a);
        setEtat('ok');
        try {
          // Accepte un tableau ou un objet { items }
          const res = await getAnnonces({ ville: a.ville });
          const liste = Array.isArray(res) ? res : res?.items ?? [];
          if (!annule) {
            setSimilaires(liste.filter((x) => x.id !== a.id).slice(0, 3));
          }
        } catch {
          /* les annonces similaires sont facultatives */
        }
      })
      .catch(() => !annule && setEtat('introuvable'));

    return () => {
      annule = true;
    };
    getPassActif().then((p) => setPassActif(!!p));
  }, [id]);

  if (etat === 'chargement') {
    return (
      <div className="detail detail--centre">
        <Spinner />
      </div>
    );
  }

  if (etat === 'introuvable') {
    return (
      <div className="detail detail--centre">
        <h1>Annonce introuvable</h1>
        <p>Elle a peut-être été retirée ou le lien est incorrect.</p>
        <Button to="/annonces">Voir les annonces</Button>
      </div>
    );
  }

  const a = annonce;
  const caution = a.loyer * a.cautionMois;
  const avance = a.loyer * a.avanceMois;
  const total = caution + avance;
  const loue = a.statut === 'loue';

  const dispo =
    a.disponibleLe && new Date(a.disponibleLe) > new Date()
      ? `Disponible dès le ${dateCourte(a.disponibleLe)}`
      : 'Disponible maintenant';

  return (
    <div className="detail">
      <div className="detail__container">
        <nav className="detail__fil" aria-label="Fil d'Ariane">
          <Link to="/annonces">{a.ville}</Link>
          <span aria-hidden="true">›</span>
          <Link to={`/annonces?ville=${encodeURIComponent(a.ville)}`}>{a.quartier}</Link>
          <span aria-hidden="true">›</span>
          <span>{a.titre}</span>
        </nav>

        <div className="detail__badges">
          {loue ? <Badge variant="neutral">Loué</Badge> : <Badge variant="success">{dispo}</Badge>}
          <Badge variant="warn">Mis à jour {tempsRelatif(a.modifieLe)}</Badge>
          <Badge variant="rose">0 commission</Badge>
        </div>

        <div className="detail__entete">
          <div>
            <h1>{a.titre}</h1>
            <p className="detail__lieu">
              {a.repere ? `${a.repere} · ` : ''}
              {a.quartier}, {a.ville}
            </p>
          </div>
          <div className="detail__actions">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigator.share?.({ title: a.titre, url: window.location.href })}
            >
              Partager
            </Button>
            {/* TODO : ouvrir SignalerModal (module signalements) */}
            <button type="button" className="sig__declencheur" onClick={() => setSignaler(true)}>
              Signaler
            </button>
          </div>
        </div>

        <GalerieAnnonce annonce={a} />

        <div className="detail__grille">
          <div className="detail__principal">
            <ul className="detail__resume">
              <li>{a.type}</li>
              <li>{a.meuble ? 'Meublé' : 'Non meublé'}</li>
              <li>{a.nbPhotos} photos</li>
            </ul>

            <FiabiliteAnnonce annonce={a} />

            <section className="detail__section">
              <h2>Sécurité et équipements</h2>
              <EquipementsGrid equipements={a.equipements} meuble={a.meuble} />
            </section>

            <section className="detail__section">
              <h2>Le logement</h2>
              <p>
                {a.description ||
                  "Description rédigée par le propriétaire : état du logement, pièces, luminosité, voisinage."}
              </p>
            </section>

            <section className="detail__section">
              <h2>Localisation</h2>
              <div className="detail__localisation">
                <strong>
                  {a.quartier}, {a.ville}
                </strong>
                {a.repere && <p>Repère : {a.repere}</p>}
                <small>
                  L'adresse exacte et l'itinéraire sont donnés par le propriétaire après
                  déblocage du contact.
                </small>
              </div>
            </section>

            <section className="detail__section detail__proprio">
              <div className="detail__avatar" aria-hidden="true">
                {(a.proprietaire?.nom || 'Propriétaire').slice(0, 1)}
              </div>
              <div>
                <strong>{a.proprietaire?.nom || 'Propriétaire'}, propriétaire</strong>
                <p>{a.proprietaire?.horaires || 'Horaires de contact précisés après déblocage'}</p>
              </div>
              {a.numeroVerifie && <Badge variant="success">Numéro vérifié</Badge>}
            </section>
          </div>

          <aside className="detail__prix">
            <div className="detail__prix-carte">
              <p className="detail__loyer">
                <strong>{formatFCFA(a.loyer)}</strong> / mois
              </p>

              <dl className="detail__recap">
                <div>
                  <dt>Caution ({a.cautionMois} mois)</dt>
                  <dd>{formatFCFA(caution)}</dd>
                </div>
                <div>
                  <dt>Avance ({a.avanceMois} mois)</dt>
                  <dd>{formatFCFA(avance)}</dd>
                </div>
                <div>
                  <dt>Frais de démarcheur</dt>
                  <dd className="detail__zero">{formatFCFA(0)}</dd>
                </div>
                <div className="detail__total">
                  <dt>Total à l'entrée</dt>
                  <dd>{formatFCFA(total)}</dd>
                </div>
              </dl>

              <p className="detail__note">
                Montants fixés par le propriétaire, à régler après la visite, contre reçu.
              </p>

              {loue ? (
                <Button block disabled>
                  Logement loué
                </Button>
              ) : (
                
                <Button block
                size="lg"
                to={passActif ? `/annonces/${a.id}/contact` : `/annonces/${a.id}/debloquer`}>
                  {passActif ? 'Voir le contact' : 'Débloquer le contact'}
                </Button>
              )}
              <p className="detail__pass">
                Pass Contact : <strong>{formatFCFA(PASS_PRIX)}</strong>, valable {PASS_DUREE_JOURS}{' '}
                jours sur toutes les annonces
              </p>

              <BandeauAntiArnaque />
            </div>
          </aside>
        </div>

        {similaires.length > 0 && (
          <section className="detail__section">
            <h2>Annonces similaires à {a.ville}</h2>
            <div className="detail__similaires">
              {similaires.map((s) => (
                <AnnonceCard key={s.id} annonce={s} />
              ))}
            </div>
          </section>
        )}
      </div>
      <SignalerModal
        isOpen={isSignalerOpen}
        onClose={() => setIsSignalerOpen(false)}
        annonceId={annonce?.id}
        annonceTitre={annonce?.titre}
      />
      <SignalerModal annonce={a} ouvert={signaler} onFermer={() => setSignaler(false)} />
    </div>
  );
}