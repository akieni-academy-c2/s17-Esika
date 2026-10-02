export const VILLES = ["Brazzaville", "Pointe-Noire"];

export const QUARTIERS = {
  Brazzaville: ["Bacongo", "Poto-Poto", "Moungali", "Ouenzé", "Talangaï", "Plateau des 15 ans", "Makélékélé", "Mfilou"],
  "Pointe-Noire": ["Tié-Tié", "Mpita", "Loandjili", "Lumumba", "Mvou-Mvou", "Ngoyo"],
};

export const TYPES = ["Chambre", "Chambre salon", "Studio", "2 chambres", "3 chambres +", "Maison"];

export const EQUIPEMENTS = [
  { cle: "Gardiennage", titre: "Gardiennage / sécurité", sous: "Gardien, portail, clôture" },
  { cle: "Groupe électrogène", titre: "Groupe électrogène", sous: "Parties communes" },
  { cle: "Climatisation", titre: "Climatisation", sous: "1 pièce équipée" },
  { cle: "Wi-Fi", titre: "Wi-Fi inclus", sous: "Dans le loyer" },
  { cle: "Internet", titre: "Connexion Internet possible", sous: "Fibre ou box 4G" },
  { cle: "Parking", titre: "Parking", sous: "1 place dans la cour" },
];

export const ELECTRICITE_EAU = [
  "Compteur prépayé · forage",
  "Compteur prépayé · eau de la ville",
  "Forfait inclus dans le loyer",
  "Autre arrangement avec le propriétaire",
];

export const PHOTOS_MIN = 3;
export const PHOTOS_MAX = 6;

export const brouillonVide = () => ({
  type: "",
  description: "",
  ville: "Brazzaville",
  quartier: "",
  repere: "",
  loyer: "",
  cautionMois: 2,
  avanceMois: 1,
  electriciteEau: ELECTRICITE_EAU[0],
  disponibleLe: new Date().toISOString().slice(0, 10),
  horaires: "",
  equipements: [],
  meuble: false,
});