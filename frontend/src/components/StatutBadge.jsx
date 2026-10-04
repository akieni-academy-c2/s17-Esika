import { dateCourte, estDisponibleMaintenant } from "../lib/format.js";
import Badge from "./ui/Badge.jsx";
import { IconCheckCircle, IconClock } from "./ui/Icons.jsx";

// statut : "disponible" | "a_confirmer" | "loue"
export default function StatutBadge({ statut = "disponible", disponibleLe, loueLe }) {
  if (statut === "loue") return <Badge>{loueLe ? `Loué le ${dateCourte(loueLe)}` : "Loué"}</Badge>;
  if (statut === "a_confirmer") return <Badge variant="warn"><IconClock taille={13} /> À confirmer</Badge>;
  return (
    <Badge variant="success">
      <IconCheckCircle taille={13} />
      {estDisponibleMaintenant(disponibleLe) ? "Disponible maintenant" : `Disponible dès le ${dateCourte(disponibleLe)}`}
    </Badge>
  );
}
