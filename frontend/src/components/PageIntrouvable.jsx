import Button from "./ui/Button.jsx";

export default function PageIntrouvable() {
  return (
    <div className="introuvable">
      <span className="introuvable__code">404</span>
      <h1>Cette page n'existe pas</h1>
      <p>Le lien est peut-être incorrect, ou la page a été déplacée.</p>
      <Button to="/">Retour à l'accueil</Button>
    </div>
  );
}
