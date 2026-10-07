import { useAuth } from "../context/AuthContext.jsx";

const estProprietaire = (user) => !!user && ["proprietaire", "annonceur"].includes(user.role);

/** Lien « Publier une annonce » selon l'utilisateur : propriétaire -> formulaire, sinon -> inscription propriétaire */
export function useLienPublier() {
  const { user } = useAuth();
  return estProprietaire(user) ? "/annonceur/publier" : "/inscription?role=annonceur";
}

/** Lien « Mes annonces » selon l'utilisateur */
export function useLienMesAnnonces() {
  const { user } = useAuth();
  return estProprietaire(user) ? "/annonceur/mes-annonces" : "/connexion?role=annonceur";
}
