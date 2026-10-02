export function formatFCFA(montant) {
  return `${Number(montant).toLocaleString("fr-FR").replace(/\u202f/g, "\u00a0")} FCFA`;
}

// D'après les wireframes : total à l'entrée = loyer × (mois de caution + mois d'avance).
export function calculerTotalEntree(loyer, cautionMois, avanceMois) {
  return loyer * (cautionMois + avanceMois);
}

export function dateCourte(iso) {
  return new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit" });
}

export function tempsRelatif(iso) {
  const jours = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
  if (jours <= 0) return "aujourd'hui";
  if (jours === 1) return "hier";
  return `il y a ${jours} jours`;
}

export function estDisponibleMaintenant(iso) {
  return !iso || new Date(iso).getTime() <= Date.now();
}