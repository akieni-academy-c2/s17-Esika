import apiClient, { USE_MOCKS } from '../../lib/apiClient';
import { PASS_DUREE_JOURS } from '../../config/constants';

const CLE = 'esika_pass';
const attendre = (ms) => new Promise((r) => setTimeout(r, ms));
function lirePassLocal() { try { const p = JSON.parse(localStorage.getItem(CLE)); return p && new Date(p.expireLe) > new Date() ? p : null; } catch { return null; } }
const formaterTel = (t = '') => { const n = String(t).replace(/\s/g, ''); return /^\+242\d{9}$/.test(n) ? `+242 ${n.slice(4, 6)} ${n.slice(6, 9)} ${n.slice(9)}` : t; };

export async function getPassActif(annonceId) {
  if (USE_MOCKS) return lirePassLocal();
  if (!annonceId) return null;
  try {
    const { data } = await apiClient.get(`/tenant/announces/${annonceId}/passes/active`);
    return data?.expiredAt ? { ...data, expireLe: data.expiredAt } : null;
  } catch (err) {
    if (err.response?.status === 404 || err.response?.status === 403) return null;
    throw err;
  }
}

export async function acheterPass({ annonceId, operateur, numero }) {
  if (USE_MOCKS) {
    await attendre(1200);
    const expireLe = new Date(Date.now() + PASS_DUREE_JOURS * 86400000).toISOString();
    const pass = { operateur, numero, expireLe };
    localStorage.setItem(CLE, JSON.stringify(pass));
    return pass;
  }
  if (!annonceId) throw new Error('ANNONCE_ID_REQUIS');
  const { data } = await apiClient.post(`/tenant/announces/${annonceId}/passes`, { phoneNumber: numero, operator: operateur });
  return data;
}

export async function getContactAnnonce(annonceId, annonce) {
  if (USE_MOCKS) {
    if (!lirePassLocal()) throw new Error('PASS_REQUIS');
    return { nom: annonce?.proprietaire?.nom ?? 'Didier M.', telephone: annonce?.proprietaire?.telephone ?? '+242 06 000 00 00', horaires: annonce?.proprietaire?.horaires ?? 'À convenir avec le propriétaire' };
  }
  const pass = await getPassActif(annonceId);
  if (!pass?.announcer) throw new Error('PASS_REQUIS');
  const { data: contactAnnonce } = await apiClient.get(`/tenant/announces/${annonceId}/contact`);
  const announcer = pass.announcer;
  return { ...contactAnnonce, nom: `${announcer.firstName ?? ''} ${announcer.lastName ?? ''}`.trim() || 'Propriétaire', telephone: formaterTel(announcer.phoneNumber), horaires: annonce?.proprietaire?.horaires ?? 'À convenir avec le propriétaire' };
}
