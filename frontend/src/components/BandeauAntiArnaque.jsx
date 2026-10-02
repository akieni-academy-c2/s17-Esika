export default function BandeauAntiArnaque({ children }) {
  return (
    <div className="banner banner--warn" role="note">
      <strong>Ne payez jamais avant la visite.</strong>{" "}
      {children ?? "ESIKA ne vous demandera jamais d'argent pour un logement. Si quelqu'un exige un paiement avant la visite, signalez l'annonce."}
    </div>
  );
}