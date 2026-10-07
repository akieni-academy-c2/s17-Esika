import { Link } from "react-router-dom";
import { formatFCFA, tempsRelatif } from "../lib/format.js";
import Badge from "./ui/Badge.jsx";
import StatutBadge from "./StatutBadge.jsx";
import MontantEntree from "./MontantEntree.jsx";
import { IconCamera, IconClock, IconPin, IconShield } from "./ui/Icons.jsx";

export default function AnnonceCard({ annonce }) {
  const { id, titre, repere, ville, loyer, cautionMois, avanceMois, photos, nbPhotos, equipements = [], modifieLe, numeroVerifie, statut, disponibleLe } = annonce;
  const couverture = photos?.[0];
  const total = nbPhotos ?? photos?.length ?? 0;

  return (
    <article className="annonce-card">
      <Link to={`/annonces/${id}`} className="annonce-card__lien">
        <div className="annonce-card__photo photo-placeholder">
          {couverture ? (
            <img src={couverture} alt="" loading="lazy" />
          ) : (
            <span className="photo-placeholder__texte"><IconCamera taille={16} /> Photo du logement</span>
          )}
          <span className="annonce-card__statut"><StatutBadge statut={statut} disponibleLe={disponibleLe} /></span>
          {total > 0 && <span className="annonce-card__nb"><Badge variant="dark"><IconCamera taille={13} /> {total} photos</Badge></span>}
        </div>

        <div className="annonce-card__corps">
          <p className="annonce-card__prix">
            <span><strong>{formatFCFA(loyer)}</strong> <small>/mois</small></span>
            <Badge variant="rose">0 commission</Badge>
          </p>
          <h3>{titre}</h3>
          <p className="annonce-card__lieu"><IconPin taille={14} /> {repere}, {ville}</p>

          <MontantEntree loyer={loyer} cautionMois={cautionMois} avanceMois={avanceMois} />

          <ul className="tags">
            {equipements.map((e) => <li key={e}>{e}</li>)}
          </ul>

          <p className="annonce-card__pied">
            <span><IconClock taille={13} /> Mis à jour {tempsRelatif(modifieLe)}</span>
            {numeroVerifie && <span className="verifie"><IconShield taille={14} /> Numéro vérifié</span>}
          </p>
        </div>
      </Link>
    </article>
  );
}
