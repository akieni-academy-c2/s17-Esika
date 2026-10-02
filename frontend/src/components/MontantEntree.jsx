import { calculerTotalEntree, formatFCFA } from "../lib/format.js";

export default function MontantEntree({ loyer, cautionMois, avanceMois }) {
  return (
    <div className="montant-entree">
      <div>
        <span className="montant-entree__label">Total à l'entrée</span>
        <span className="montant-entree__detail">
          Caution {cautionMois} mois + avance {avanceMois} mois
        </span>
      </div>
      <strong className="montant-entree__total">{formatFCFA(calculerTotalEntree(loyer, cautionMois, avanceMois))}</strong>
    </div>
  );
}