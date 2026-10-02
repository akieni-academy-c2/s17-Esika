import { Link } from "react-router-dom";
import { formatFCFA, tempsRelatif } from "../lib/format.js";
import Badge from "./ui/Badge.jsx";
import StatutBadge from "./StatutBadge.jsx";
import MontantEntree from "./MontantEntree.jsx";

export default function AnnonceCard({ annonce }) {
  const { id, titre, repere, ville, loyer, cautionMois, avanceMois, nbPhotos, equipements, modifieLe, numeroVerifie, statut, disponibleLe } = annonce;

  return (
    <article className="annonce-card">
      <Link to={`/annonces/${id}`} className="annonce-card__lien">
        <div className="annonce-card__photo photo-placeholder">
          <span className="annonce-card__statut"><StatutBadge statut={statut} disponibleLe={disponibleLe} /></span>
          <span className="annonce-card__nb"><Badge variant="dark">{nbPhotos} photos</Badge></span>
          <span>Photo du logement</span>
        </div>

        <div className="annonce-card__corps">
          <p className="annonce-card__prix">
            <span><strong>{formatFCFA(loyer)}</strong> <small>/mois</small></span>
            <Badge variant="rose">0 commission</Badge>
          </p>
          <h3>{titre}</h3>
          <p className="annonce-card__lieu">{repere}, {ville}</p>

          <MontantEntree loyer={loyer} cautionMois={cautionMois} avanceMois={avanceMois} />

          <ul className="tags">
            {equipements.map((e) => <li key={e}>{e}</li>)}
          </ul>

          <p className="annonce-card__pied">
            <span>Mis à jour {tempsRelatif(modifieLe)}</span>
            {numeroVerifie && <span className="verifie">✓ Numéro vérifié</span>}
          </p>
        </div>
      </Link>
    </article>
  );
}