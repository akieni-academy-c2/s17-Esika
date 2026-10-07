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
import { basculerFavori, estFavori } from '../../../lib/favoris';
import {
  IconBed, IconCamera, IconCheckCircle, IconChevron, IconClock, IconFlag, IconHeart, IconKey, IconLock, IconPin, IconShare, IconShield, IconSofa,
} from '../../../components/ui/Icons';
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
  const [signaler, setSignaler] = useState(false);
  const [favori, setFavori] = useState(() => estFavori(id));
  const [lienCopie, setLienCopie] = useState(false);

  useEffect(() => {
    let annule = false;
    setEtat('chargement');
    setFavori(estFavori(id));

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

    // Le pass actif décide du bouton affiché (Débloquer / Voir le contact)
    getPassActif(id)
      .then((p) => !annule && setPassActif(!!p))
      .catch(() => {});

    return () => {
      annule = true;
    };
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
  const nbPhotos = a.nbPhotos ?? a.photos?.length ?? 0;
  const nomProprio = a.proprietaire?.nom || 'Propriétaire';
  const initiales = nomProprio.split(/\s+/).slice(0, 2).map((m) => m[0]).join('').toUpperCase();
  const lienContact = passActif ? `/annonces/${a.id}/contact` : `/annonces/${a.id}/debloquer`;

  const dispo =
    a.disponibleLe && new Date(a.disponibleLe) > new Date()
      ? `Disponible dès le ${dateCourte(a.disponibleLe)}`
      : 'Disponible maintenant';

  const partager = async () => {
    const donnees = { title: a.titre, url: window.location.href };
    if (navigator.share) {
      try { await navigator.share(donnees); } catch { /* partage annulé */ }
      return;
    }
    try {
      await navigator.clipboard.writeText(donnees.url);
      setLienCopie(true);
      setTimeout(() => setLienCopie(false), 2000);
    } catch { /* presse-papiers indisponible */ }
  };

  return (
    <div className="detail">
      <div className="detail__container">
        <div className="detail__haut">
          <nav className="detail__fil" aria-label="Fil d'Ariane">
            <Link to={`/annonces?ville=${encodeURIComponent(a.ville)}`}>{a.ville}</Link>
            <IconChevron taille={13} />
            <Link to={`/annonces?ville=${encodeURIComponent(a.ville)}&quartiers=${encodeURIComponent(a.quartier)}`}>{a.quartier}</Link>
            <IconChevron taille={13} />
            <span>{a.titre}</span>
          </nav>
          <div className="detail__actions">
            <Button variant="outline" size="sm" onClick={partager}><IconShare taille={15} /> {lienCopie ? 'Lien copié' : 'Partager'}</Button>
            <Button variant="outline" size="sm" aria-pressed={favori} className={favori ? 'btn--favori' : ''} onClick={() => setFavori(basculerFavori(a.id))}>
              <IconHeart taille={15} fill={favori ? 'currentColor' : 'none'} /> {favori ? 'Enregistrée' : 'Enregistrer'}
            </Button>
            <Button variant="outline" size="sm" onClick={() => setSignaler(true)}><IconFlag taille={15} /> Signaler</Button>
          </div>
        </div>

        <div className="detail__badges">
          {loue ? <Badge variant="neutral">Loué</Badge> : <Badge variant="mint"><IconCheckCircle taille={13} /> {dispo}</Badge>}
          <Badge variant="warn"><IconClock taille={13} /> Mis à jour {tempsRelatif(a.modifieLe)}</Badge>
          <Badge variant="rose">0 commission</Badge>
        </div>

        <div className="detail__entete">
          <h1>{a.titre}</h1>
          <p className="detail__lieu">
            <IconPin taille={16} />
            {a.repere ? `${a.repere} · ` : ''}
            {a.quartier}, {a.ville}
          </p>
        </div>

        <GalerieAnnonce annonce={a} />

        <div className="detail__grille">
          <div className="detail__principal">
            <ul className="detail__resume">
              <li><IconBed taille={18} /> {a.type}</li>
              <li><IconSofa taille={18} /> {a.meuble ? 'Meublé' : 'Non meublé'}</li>
              {nbPhotos > 0 && <li><IconCamera taille={18} /> {nbPhotos} photos</li>}
            </ul>

            <FiabiliteAnnonce annonce={a} />

            <section className="detail__section">
              <h2>Sécurité et équipements</h2>
              <EquipementsGrid equipements={a.equipements} meuble={a.meuble} />
            </section>

            <section className="detail__section">
              <h2>Le logement</h2>
              <p className="detail__description">
                {a.description ||
                  "Description rédigée par le propriétaire : état du logement, pièces, luminosité, voisinage."}
              </p>
            </section>

            <section className="detail__section">
              <h2>Localisation</h2>
              <div className="detail__localisation">
                <span className="detail__localisation-icone"><IconPin taille={20} /></span>
                <div>
                  <strong>{a.quartier}, {a.ville}</strong>
                  {a.repere && <p>Repère : {a.repere}</p>}
                  <small>
                    <IconLock taille={12} /> L'adresse exacte et l'itinéraire sont donnés par le propriétaire après déblocage du contact.
                  </small>
                </div>
              </div>
            </section>

            <section className="detail__section detail__proprio">
              <div className="detail__avatar" aria-hidden="true">{initiales}</div>
              <div className="detail__proprio-texte">
                <strong>{nomProprio}, propriétaire</strong>
                <p><IconClock taille={13} /> {a.proprietaire?.horaires || 'Horaires de contact précisés après déblocage'}</p>
              </div>
              {a.numeroVerifie && <Badge variant="mint"><IconShield taille={13} /> Numéro vérifié</Badge>}
            </section>
          </div>

          <aside className="detail__prix">
            <div className="detail__prix-carte">
              <p className="detail__loyer">
                <strong>{formatFCFA(a.loyer)}</strong> <span>/ mois</span>
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
                <Button block disabled>Logement loué</Button>
              ) : (
                <Button block size="lg" to={lienContact}>
                  <IconKey taille={18} /> {passActif ? 'Voir le contact' : 'Débloquer le contact'}
                </Button>
              )}
              <p className="detail__pass">
                Pass Contact : <strong>{formatFCFA(PASS_PRIX)}</strong>, valable {PASS_DUREE_JOURS}{' '}
                jours sur toutes les annonces
              </p>

              <BandeauAntiArnaque>
                Aucune caution, avance ou frais avant d'avoir visité et rencontré le propriétaire. ESIKA ne vous demandera jamais d'argent pour un logement.
              </BandeauAntiArnaque>
            </div>
          </aside>
        </div>

        {similaires.length > 0 && (
          <section className="detail__section detail__section--similaires">
            <h2>Annonces similaires à {a.ville}</h2>
            <div className="detail__similaires">
              {similaires.map((s) => (
                <AnnonceCard key={s.id} annonce={s} />
              ))}
            </div>
          </section>
        )}
      </div>

      {!loue && (
        <div className="detail__barre-mobile">
          <div>
            <strong>{formatFCFA(a.loyer)}</strong>
            <small>Entrée {formatFCFA(total)}</small>
          </div>
          <Button to={lienContact}><IconKey taille={16} /> {passActif ? 'Voir le contact' : 'Débloquer'}</Button>
        </div>
      )}
      <SignalerModal annonce={a} ouvert={signaler} onFermer={() => setSignaler(false)} />
    </div>
  );
}
