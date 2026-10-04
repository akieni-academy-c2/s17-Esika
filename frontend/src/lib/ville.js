// Ville choisie par le visiteur (sélecteur de la barre de navigation), gardée sur l'appareil
const CLE = "esika_ville";
const VILLES = ["Brazzaville", "Pointe-Noire"];

export function lireVille() {
  try {
    const v = localStorage.getItem(CLE);
    return VILLES.includes(v) ? v : "Brazzaville";
  } catch {
    return "Brazzaville";
  }
}

export function ecrireVille(ville) {
  try { localStorage.setItem(CLE, ville); } catch { /* stockage indisponible */ }
}
