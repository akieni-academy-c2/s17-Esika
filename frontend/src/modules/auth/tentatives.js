// Limitation des tentatives de connexion : après MAX_TENTATIVES échecs, le numéro est bloqué un moment.
//
// ATTENTION : ce blocage vit dans le navigateur. Il décourage et guide l'utilisateur, mais un attaquant peut
// le contourner (vider le stockage, appeler l'API directement). La vraie protection doit aussi exister côté
// serveur (voir backend/src/middleware/login-limiter.middleware.ts).
export const MAX_TENTATIVES = 3;
export const DUREE_VERROUILLAGE_MS = 15 * 60 * 1000; // 15 minutes
const CLE = 'esika_tentatives';

function lire() {
  try { return JSON.parse(localStorage.getItem(CLE) || '{}'); } catch { return {}; }
}
function ecrire(etat) {
  try { localStorage.setItem(CLE, JSON.stringify(etat)); } catch { /* stockage indisponible */ }
}

// Retire les numéros dont le blocage est terminé, ou dont le dernier échec est trop ancien
function purger(etat, maintenant) {
  for (const [id, e] of Object.entries(etat)) {
    const termine = e.jusqua ? e.jusqua <= maintenant : maintenant - (e.dernier ?? 0) > DUREE_VERROUILLAGE_MS;
    if (termine) delete etat[id];
  }
  return etat;
}

/** Millisecondes restantes avant la fin du blocage de ce numéro (0 = pas bloqué) */
export function tempsRestant(identifiant) {
  const jusqua = lire()[identifiant]?.jusqua ?? 0;
  return Math.max(jusqua - Date.now(), 0);
}

/** Compte un échec de connexion. Retourne { restantes, verrouille, restantMs } */
export function enregistrerEchec(identifiant) {
  const maintenant = Date.now();
  const etat = purger(lire(), maintenant);
  const e = etat[identifiant] ?? { n: 0 };
  if (!e.jusqua) {
    e.n += 1;
    e.dernier = maintenant;
    if (e.n >= MAX_TENTATIVES) e.jusqua = maintenant + DUREE_VERROUILLAGE_MS;
  }
  etat[identifiant] = e;
  ecrire(etat);
  return {
    restantes: Math.max(MAX_TENTATIVES - e.n, 0),
    verrouille: !!e.jusqua,
    restantMs: e.jusqua ? Math.max(e.jusqua - maintenant, 0) : 0,
  };
}

/** Bloque le numéro pour une durée donnée (utilisé quand le serveur répond « trop de tentatives ») */
export function verrouillerPour(identifiant, ms) {
  const maintenant = Date.now();
  const etat = purger(lire(), maintenant);
  etat[identifiant] = { n: MAX_TENTATIVES, dernier: maintenant, jusqua: maintenant + ms };
  ecrire(etat);
}

/** Efface les échecs de ce numéro (connexion réussie, ou compte tout juste créé) */
export function reinitialiser(identifiant) {
  const etat = lire();
  if (identifiant in etat) {
    delete etat[identifiant];
    ecrire(etat);
  }
}

/** 905000 -> « 15:05 » */
export function formaterDuree(ms) {
  const total = Math.ceil(Math.max(ms, 0) / 1000);
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, '0')}`;
}