import api, { USE_MOCKS } from "../../lib/apiClient.js";
import { attendre } from "../../mocks/annonces.js";

const CLE = "esika_signalements";

// Les motifs reprennent ceux du back-office (wireframe Administration)
export const MOTIFS = [
  { cle: "argent", libelle: "Demande d'argent avant la visite", urgent: true },
  { cle: "deja_loue", libelle: "Logement déjà loué" },
  { cle: "prix", libelle: "Prix différent de l'annonce" },
  { cle: "photos", libelle: "Photos non conformes" },
  { cle: "injoignable", libelle: "Numéro injoignable" },
  { cle: "autre", libelle: "Autre problème" },
];

export function lireSignalementsLocaux() {
  try { return JSON.parse(localStorage.getItem(CLE)) ?? []; } catch { return []; }
}

/** Lève Error("DEJA_SIGNALE") si cette personne a déjà signalé cette annonce. */
export async function signalerAnnonce({ annonce, motif, message, user }) {
  if (USE_MOCKS) {
    await attendre(500);
    const signataire = user?.id ?? "anonyme";
    const liste = lireSignalementsLocaux();
    if (liste.some((s) => String(s.annonceId) === String(annonce.id) && s.signataire === signataire)) {
      throw new Error("DEJA_SIGNALE");
    }
    const s = {
      id: "s" + Date.now(),
      annonceId: annonce.id,
      annonceTitre: annonce.titre,
      ville: annonce.ville,
      loyer: annonce.loyer,
      motif,
      urgent: MOTIFS.find((m) => m.cle === motif)?.urgent ?? false,
      message: message.trim(),
      signataire,
      signalePar: "Locataire",
      statut: "a_traiter", // a_traiter | en_cours | traite
      creeLe: new Date().toISOString(),
    };
    localStorage.setItem(CLE, JSON.stringify([s, ...liste]));
    return s;
  }
  try {
    const { data } = await api.post(`/tenant/announces/${annonce.id}/reports`, { reason: motif, description: message.trim() });
    return data;
  } catch (err) {
    if (err.response?.status === 409) throw new Error("DEJA_SIGNALE", { cause: err });
    throw err;
  }
}