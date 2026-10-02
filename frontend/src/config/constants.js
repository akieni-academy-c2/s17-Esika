// Valeurs métier issues de la Discovery et des wireframes.
export const PASS_PRIX = 2000; // FCFA
export const PASS_DUREE_JOURS = 7;

export const VILLES = ["Brazzaville", "Pointe-Noire"];

export const QUARTIERS = {
  Brazzaville: ["Bacongo", "Poto-Poto", "Moungali", "Ouenzé", "Talangaï", "Plateau des 15 ans", "Makélékélé", "Mfilou"],
  "Pointe-Noire": ["Tié-Tié", "Mpita", "Loandjili"],
};

export const EQUIPEMENTS = [
  "Gardiennage",
  "Groupe électrogène",
  "Climatisation",
  "Wi-Fi",
  "Internet",
  "Parking",
  "Meublé",
];

// À aligner avec les rôles du backend de Virgile (module « annonceur »).
export const ROLES = { LOCATAIRE: "locataire", ANNONCEUR: "annonceur", ADMIN: "admin" };

// À remplacer par le vrai numéro du support ESIKA.
export const SUPPORT_WHATSAPP = "242000000000";