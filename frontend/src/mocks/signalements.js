const JOUR = 86400000;
const joursAvant = (n) => new Date(Date.now() - n * JOUR).toISOString();

// Données de départ, reprises du wireframe Administration.
// annonceId renvoie vers les annonces factices quand elles existent (3 = Tié-Tié, 6 = Loandjili).
export const signalementsMock = [
  { id: "m1", motif: "argent", urgent: true, annonceId: 3, annonceTitre: "3 chambres salon · Tié-Tié", ville: "Pointe-Noire", loyer: 250000, publieLe: joursAvant(7), message: "Le propriétaire me demande d'envoyer l'avance par Mobile Money pour réserver avant de faire visiter.", signalePar: "Locataire", creeLe: joursAvant(2), statut: "a_traiter" },
  { id: "m2", motif: "deja_loue", annonceId: null, annonceTitre: "Chambre salon · Ouenzé", ville: "Brazzaville", loyer: 60000, publieLe: joursAvant(10), message: "On m'a dit au téléphone que le logement est déjà occupé.", signalePar: "Locataire", creeLe: joursAvant(2), statut: "a_traiter" },
  { id: "m3", motif: "prix", annonceId: 6, annonceTitre: "Studio · Loandjili", ville: "Pointe-Noire", loyer: 75000, publieLe: joursAvant(6), message: "Le propriétaire annonce 95 000 FCFA par téléphone au lieu de 75 000.", signalePar: "Locataire", creeLe: joursAvant(3), statut: "a_traiter" },
  { id: "m4", motif: "photos", annonceId: null, annonceTitre: "2 chambres · Talangaï", ville: "Brazzaville", loyer: 110000, publieLe: joursAvant(9), message: "Les photos ne correspondent pas au logement visité.", signalePar: "Locataire", creeLe: joursAvant(4), statut: "en_cours" },
  { id: "m5", motif: "injoignable", annonceId: null, annonceTitre: "Studio · Mfilou", ville: "Brazzaville", loyer: 55000, publieLe: joursAvant(12), message: "", signalePar: "Locataire", creeLe: joursAvant(5), statut: "traite", action: "sans_suite", traiteLe: joursAvant(4) },
];