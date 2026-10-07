import { IconWarning } from "./ui/Icons.jsx";

export default function BandeauAntiArnaque({ children }) {
  return (
    <div className="banner banner--warn" role="note">
      <IconWarning taille={18} className="banner__icone" />
      <p>
        <strong>Ne payez jamais avant la visite.</strong>{" "}
        {children ?? "ESIKA ne vous demandera jamais d'argent pour un logement. Si quelqu'un exige un paiement avant la visite, signalez l'annonce."}
      </p>
    </div>
  );
}
