import api, { USE_MOCKS } from "../../lib/apiClient.js";
import { attendre } from "../../mocks/annonces.js";
import { signalementsMock } from "../../mocks/signalements.js";
import { lireSignalementsLocaux, MOTIFS } from "../signalements/signalements.service.js";

const CLE_ETATS = "esika_signalements_etat";
const CLE_MASQUEES = "esika_annonces_masquees";

const lire = (cle, defaut) => {
  try { return JSON.parse(localStorage.getItem(cle)) ?? defaut; } catch { return defaut; }
};

/** Ids (en chaînes) des annonces masquées par l'admin. Lu par annonces.service.js */
export const lireAnnoncesMasquees = () => lire(CLE_MASQUEES, []);

const libelle = (cle) => MOTIFS.find((m) => m.cle === cle)?.libelle ?? "Autre problème";

export async function getSignalements() {
  if (USE_MOCKS) {
    await attendre(250);
    const etats = lire(CLE_ETATS, {});
    return [...lireSignalementsLocaux(), ...signalementsMock]
      .map((s) => ({ ...s, motifLibelle: libelle(s.motif), ...(etats[s.id] ?? {}) }))
      .sort((a, b) => new Date(b.creeLe) - new Date(a.creeLe));
  }
  const { data } = await api.get("/admin/reports");
  return (data ?? []).map((s) => ({ ...s, motifLibelle: libelle(s.motif) }));
}

/** action : "masquee" | "contact" | "sans_suite" */
export async function traiterSignalement(id, { statut, action, annonceId }) {
  if (USE_MOCKS) {
    await attendre(250);
    const etats = lire(CLE_ETATS, {});
    etats[id] = { statut, action, traiteLe: statut === "traite" ? new Date().toISOString() : undefined };
    localStorage.setItem(CLE_ETATS, JSON.stringify(etats));
    if (action === "masquee" && annonceId != null) {
      const masquees = lireAnnoncesMasquees();
      if (!masquees.includes(String(annonceId))) {
        localStorage.setItem(CLE_MASQUEES, JSON.stringify([...masquees, String(annonceId)]));
      }
    }
    return;
  }
  const decision = { masquee: "masquer", sans_suite: "classer", contact: "en_cours" }[action];
  await api.patch(`/admin/reports/${id}`, { decision });
}