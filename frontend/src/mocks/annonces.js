import { PHOTOS_DEMO } from "../config/images.js";
const JOUR = 86400000;
const joursAvant = (n) => new Date(Date.now() - n * JOUR).toISOString();
const joursApres = (n) => new Date(Date.now() + n * JOUR).toISOString();

export const attendre = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

// Format côté front. À adapter (dans annonces.service.js) au format réel du backend.
const annoncesBase = [
  { id: 1, titre: "2 chambres salon · Bacongo", ville: "Brazzaville", quartier: "Bacongo", repere: "Derrière le marché Total", type: "2 chambres", meuble: false, loyer: 150000, cautionMois: 2, avanceMois: 1, nbPhotos: 6, equipements: ["Gardiennage", "Groupe électrogène", "Parking"], modifieLe: joursAvant(2), disponibleLe: joursApres(3), statut: "disponible", numeroVerifie: true, description: "Appartement au 1er étage d'une parcelle calme, carrelé, cuisine intérieure, compteur prépayé individuel.", proprietaire: { nom: "Didier M.", telephone: "+242 06 612 3456", horaires: "Préfère 18 h – 20 h en semaine, samedi matin" } },
  { id: 2, titre: "Studio meublé · Plateau des 15 ans", ville: "Brazzaville", quartier: "Plateau des 15 ans", repere: "À 5 min de l'avenue de la Paix", type: "Studio", meuble: true, loyer: 120000, cautionMois: 1, avanceMois: 2, nbPhotos: 5, equipements: ["Meublé", "Wi-Fi", "Climatisé"], modifieLe: joursAvant(0), disponibleLe: null, statut: "disponible", numeroVerifie: true },
  { id: 3, titre: "3 chambres salon · Tié-Tié", ville: "Pointe-Noire", quartier: "Tié-Tié", repere: "Près du marché Tié-Tié", type: "3 chambres +", meuble: false, loyer: 250000, cautionMois: 3, avanceMois: 1, nbPhotos: 6, equipements: ["Groupe électrogène", "Climatisé", "Parking"], modifieLe: joursAvant(1), disponibleLe: joursApres(14), statut: "disponible", numeroVerifie: true },
  { id: 4, titre: "Appartement 2 chambres · Mpita", ville: "Pointe-Noire", quartier: "Mpita", repere: "À 300 m de la route de la Base", type: "2 chambres", meuble: true, loyer: 180000, cautionMois: 2, avanceMois: 1, nbPhotos: 6, equipements: ["Meublé", "Internet fibre", "Gardiennage"], modifieLe: joursAvant(3), disponibleLe: null, statut: "disponible", numeroVerifie: true },
  { id: 5, titre: "Chambre salon · Moungali", ville: "Brazzaville", quartier: "Moungali", repere: "Près du rond-point Moungali", type: "Chambre salon", meuble: false, loyer: 65000, cautionMois: 2, avanceMois: 1, nbPhotos: 4, equipements: ["Non meublé", "Gardiennage"], modifieLe: joursAvant(4), disponibleLe: null, statut: "disponible", numeroVerifie: true },
  { id: 6, titre: "Studio · Loandjili", ville: "Pointe-Noire", quartier: "Loandjili", repere: "Près de l'école Loandjili 1", type: "Studio", meuble: false, loyer: 75000, cautionMois: 2, avanceMois: 1, nbPhotos: 3, equipements: ["Non meublé", "Parking"], modifieLe: joursAvant(6), disponibleLe: joursApres(4), statut: "disponible", numeroVerifie: true },
];

// Photos d'exemple (public/images) : le nombre de photos affiché correspond aux images réellement disponibles
const { salon, facade, chambre, porte, cour } = PHOTOS_DEMO;
const PHOTOS = {
  1: [salon, chambre, porte, facade, cour],
  2: [chambre, salon, porte, cour, facade],
  3: [cour, salon, chambre, porte, facade],
  4: [salon, facade, chambre, porte, cour],
  5: [porte, chambre, facade],
  6: [chambre, porte, cour],
};
export const annoncesMock = annoncesBase.map((a) => {
  const photos = PHOTOS[a.id] ?? [];
  return { ...a, photos, nbPhotos: photos.length || a.nbPhotos };
});