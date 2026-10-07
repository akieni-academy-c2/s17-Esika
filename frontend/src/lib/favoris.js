// Annonces enregistrées par le visiteur (gardées sur son appareil)
const CLE = "esika_favoris";

const lire = () => {
  try { return JSON.parse(localStorage.getItem(CLE) || "[]"); } catch { return []; }
};

export const estFavori = (id) => lire().includes(String(id));

/** Ajoute ou retire l'annonce ; retourne le nouvel état (true = enregistrée) */
export function basculerFavori(id) {
  const cle = String(id);
  const liste = lire();
  const suivant = liste.includes(cle) ? liste.filter((x) => x !== cle) : [...liste, cle];
  try { localStorage.setItem(CLE, JSON.stringify(suivant)); } catch { /* stockage indisponible */ }
  return suivant.includes(cle);
}
