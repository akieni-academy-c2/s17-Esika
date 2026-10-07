import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext.jsx";
import { compresserImage } from "../../../lib/imageCompress";
import { formatFCFA } from "../../../lib/format";
import { brouillonVide, PHOTOS_MAX, PHOTOS_MIN } from "../annonceur.data";
import { lireBrouillon, publierAnnonce, sauverBrouillon } from "../annonceur.service";
import { messageErreur } from "../../auth/auth.service";
import { SUPPORT_WHATSAPP } from "../../../config/constants.js";
import { lienWhatsApp } from "../../../lib/whatsapp.js";
import { IconCamera, IconChat, IconCheck, IconCheckCircle, IconEye } from "../../../components/ui/Icons.jsx";
import EtapeLogement from "../components/EtapeLogement";
import EtapeLocalisation from "../components/EtapeLocalisation";
import EtapePrixEntree from "../components/EtapePrixEntree";
import EtapeEquipements from "../components/EtapeEquipements";
import EtapePhotos from "../components/EtapePhotos";
import "../annonceur.css";

const ETAPES = [
  { titre: "Le logement", sous: "Type et description" },
  { titre: "Localisation", sous: "Quartier et repère" },
  { titre: "Prix et entrée", sous: "Loyer, caution, avance" },
  { titre: "Sécurité et équipements", sous: "Ce que les locataires filtrent" },
  { titre: "Photos", sous: "3 à 6 photos" },
];

function valider(etape, d, photos) {
  if (etape === 0 && !d.type) return "Choisissez le type de logement.";
  if (etape === 1 && !d.quartier) return "Choisissez le quartier.";
  if (etape === 1 && d.repere.trim().length < 3) return "Indiquez un repère connu dans le quartier.";
  if (etape === 2 && !(Number(d.loyer) >= 10000)) return "Entrez un loyer mensuel valide (10 000 FCFA minimum).";
  if (etape === 2 && !d.disponibleLe) return "Indiquez la date de disponibilité.";
  if (etape === 4 && photos.length < PHOTOS_MIN) return `Ajoutez au moins ${PHOTOS_MIN} photos (${photos.length} pour l'instant).`;
  return "";
}

export default function PublierAnnonce() {
  const { user } = useAuth();
  const [etape, setEtape] = useState(0);
  const [d, setD] = useState(() => ({ ...brouillonVide(), ...(lireBrouillon() ?? {}) }));
  const [photos, setPhotos] = useState([]);
  const [erreur, setErreur] = useState("");
  const [info, setInfo] = useState("");
  const [enCours, setEnCours] = useState(false);
  const [envoi, setEnvoi] = useState(false);
  const [publiee, setPubliee] = useState(null);

  const maj = (patch) => { setD((p) => ({ ...p, ...patch })); setErreur(""); setInfo(""); };

  // Libère les URLs des aperçus au départ de la page
  useEffect(() => () => photos.forEach((p) => URL.revokeObjectURL(p.url)), []); // eslint-disable-line

  const ajouter = async (fichiers) => {
    const place = PHOTOS_MAX - photos.length;
    if (!place) return;
    setEnCours(true);
    setErreur("");
    const ajoutees = [];
    for (const f of fichiers.slice(0, place)) {
      try { ajoutees.push(await compresserImage(f)); }
      catch { setErreur("Une photo n'a pas pu être lue. Essayez une autre image."); }
    }
    setPhotos((p) => [...p, ...ajoutees]);
    if (fichiers.length > place) setErreur(`Maximum ${PHOTOS_MAX} photos : les autres ont été ignorées.`);
    setEnCours(false);
  };

  const retirer = (i) => {
    URL.revokeObjectURL(photos[i].url);
    setPhotos((p) => p.filter((_, k) => k !== i));
  };

  const brouillon = () => { sauverBrouillon(d); setInfo("Brouillon enregistré (les photos ne sont pas conservées)."); };

  const continuer = async () => {
    const msg = valider(etape, d, photos);
    if (msg) return setErreur(msg);
    setErreur("");
    if (etape < ETAPES.length - 1) { setEtape(etape + 1); window.scrollTo(0, 0); return; }
    setEnvoi(true);
    try { setPubliee(await publierAnnonce(d, photos, user)); }
    catch (err) { setErreur(messageErreur(err, "La publication a échoué. Vérifiez votre connexion et réessayez.")); }
    finally { setEnvoi(false); }
  };

  if (publiee) {
    return (
      <div className="pub pub--fin">
        <span className="pub__fin-icone"><IconCheck taille={28} /></span>
        <h1>Votre annonce est en ligne</h1>
        <p><strong>{publiee.titre}</strong> · {formatFCFA(publiee.loyer)}/mois · entrée {formatFCFA(publiee.loyer * (publiee.cautionMois + publiee.avanceMois))}</p>
        <p>Les locataires voient les changements immédiatement. Si une annonce est signalée, l'équipe ESIKA la vérifie.</p>
        <div className="pub__fin-actions">
          <Link className="pub__btn pub__btn--plein" to="/annonceur/mes-annonces">Voir mes annonces</Link>
          <button type="button" className="pub__btn" onClick={() => window.location.reload()}>Publier une autre annonce</button>
        </div>
      </div>
    );
  }

  const loyer = Number(d.loyer) || 0;
  const total = loyer * (d.cautionMois + d.avanceMois);
  const titreApercu = `${d.type || "Type de logement"} · ${d.quartier || "Quartier"}`;

  return (
    <div className="pub">
      <div className="pub__container">
        <aside className="pub__nav">
          <h1>Publier une annonce</h1>
          <p className="pub__aide">Environ 5 minutes · brouillon enregistré à la demande</p>
          <ol>
            {ETAPES.map((e, i) => (
              <li key={e.titre} className={i === etape ? "is-actif" : i < etape ? "is-fait" : ""}
                aria-current={i === etape ? "step" : undefined}>
                <span>{i < etape ? <IconCheck taille={14} /> : i + 1}</span>
                <div><strong>{e.titre}</strong><small>{e.sous}</small></div>
              </li>
            ))}
          </ol>
          <div className="pub__aide-box">
            <span className="pub__aide-icone"><IconChat taille={18} /></span>
            <strong>Besoin d'aide ?</strong>
            <p>Un conseiller ESIKA publie l'annonce avec vous sur WhatsApp.</p>
            <a href={lienWhatsApp(SUPPORT_WHATSAPP, "Bonjour, je souhaite être accompagné pour publier mon annonce sur ESIKA.")} target="_blank" rel="noreferrer">Être accompagné</a>
          </div>
        </aside>

        <section className="pub__carte">
          <p className="pub__kicker">ÉTAPE {etape + 1} SUR {ETAPES.length}</p>
          <h2>{ETAPES[etape].titre}</h2>

          {etape === 0 && <EtapeLogement d={d} maj={maj} />}
          {etape === 1 && <EtapeLocalisation d={d} maj={maj} />}
          {etape === 2 && <EtapePrixEntree d={d} maj={maj} />}
          {etape === 3 && <EtapeEquipements d={d} maj={maj} />}
          {etape === 4 && <EtapePhotos photos={photos} ajouter={ajouter} retirer={retirer} enCours={enCours} />}

          <p className="pub__erreur" role="alert">{erreur}</p>
          <p className="pub__info" role="status">{info}</p>

          <div className="pub__actions">
            <button type="button" className="pub__btn pub__btn--doux" onClick={brouillon}>Enregistrer le brouillon</button>
            <div>
              {etape > 0 && <button type="button" className="pub__btn" onClick={() => { setEtape(etape - 1); setErreur(""); }}>Étape précédente</button>}
              <button type="button" className="pub__btn pub__btn--plein" disabled={envoi || enCours} onClick={continuer}>
                {envoi ? "Publication…" : etape === ETAPES.length - 1 ? "Publier gratuitement" : "Continuer"}
              </button>
            </div>
          </div>
        </section>

        <aside className="pub__apercu" aria-label="Aperçu côté locataire">
          <p className="pub__aide pub__aide--eye"><IconEye taille={15} /> Aperçu côté locataire</p>
          <div className="pub__vignette">
            {photos[0] ? <img src={photos[0].url} alt="" /> : <span><IconCamera taille={16} /> Photo de couverture</span>}
          </div>
          <div className="pub__apercu-corps">
            <p><strong>{loyer ? formatFCFA(loyer) : "— FCFA"}</strong> /mois <em>0 commission</em></p>
            <h3>{titreApercu}</h3>
            <p className="pub__aide">{d.repere || "Repère dans le quartier"}</p>
            <div className="pub__apercu-total"><span>Total à l'entrée</span><strong>{formatFCFA(total)}</strong></div>
            <div className="pub__tags">{d.equipements.map((e) => <span key={e}>{e}</span>)}</div>
          </div>
          <div className="pub__conseils">
            <strong>Conseils pour une annonce fiable</strong>
            <ul>
              <li><IconCheckCircle taille={16} /> Des photos récentes et lumineuses</li>
              <li><IconCheckCircle taille={16} /> Un repère connu dans le quartier</li>
              <li><IconCheckCircle taille={16} /> Mettez à jour le prix dès qu'il change</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}