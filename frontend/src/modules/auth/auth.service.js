import apiClient, { USE_MOCKS, USE_ADMIN_MOCKS } from '../../lib/apiClient';
import { DUREE_VERROUILLAGE_MS, enregistrerEchec, reinitialiser, tempsRestant, verrouillerPour } from './tentatives';

// Authentification par téléphone + mot de passe (backend de Virgile : /tenant et /announcer, signup + signin).
// L'étape « code SMS » de l'inscription est SIMULÉE côté front (aucun SMS réel n'est envoyé).
// VITE_REAL_AUTH=true : inscription et connexion passent par le vrai backend, le reste du site peut rester en mocks.
export const ID_MODE = 'phone';
export const CODE_LONGUEUR = 6;
export const CODE_MOCK = '123456';
export const ADMIN_MOCK = '060000000'; // compte de démonstration réservé au développement
export const ADMIN_MOCK_PASSWORD = import.meta.env.VITE_ADMIN_MOCK_PASSWORD || 'esika-admin-demo';
export const AUTH_REELLE = import.meta.env.VITE_REAL_AUTH === 'true' || !USE_MOCKS;

const attendre = (ms) => new Promise((r) => setTimeout(r, ms));
const initiale = (n) => (n ? n.trim().slice(0, 1).toUpperCase() + '.' : '');
const VILLES = { brazzaville: 'Brazzaville', 'pointe-noire': 'Pointe-Noire' };
const CLE_COMPTES = 'esika_comptes_mock';
const CLE_PROFILS = 'esika_profils'; // nom/prénom saisis à l'inscription (le backend ne les renvoie pas encore à la connexion)

// Profil saisi à l'inscription, gardé en mémoire (jamais écrit sur disque : il contient le mot de passe)
let enAttente = null;

/** Message lisible pour une erreur axios (message du backend si présent). */
export function messageErreur(err, defaut) {
  if (err?.response?.status >= 500) return 'Erreur du serveur. Réessayez dans un instant.';
  if (err?.response?.data?.message) return err.response.data.message;
  if (err?.request && !err.response) return 'Serveur injoignable. Vérifiez que le backend est lancé.';
  return defaut;
}

const telephone = (identifiant) => '+242' + identifiant; // 061234567 -> +242061234567

function lireComptes() {
  try { return JSON.parse(localStorage.getItem(CLE_COMPTES) || '{}'); } catch { return {}; }
}

function lireProfils() {
  try { return JSON.parse(localStorage.getItem(CLE_PROFILS) || '{}'); } catch { return {}; }
}

function ouvrirSession(user, token) {
  localStorage.setItem('esika_user', JSON.stringify(user));
  localStorage.setItem('esika_token', token);
  return { user, token };
}

/** Étape « envoi du code » (simulée). profil : { role, prenom, nom, identifiant, ville, email?, motDePasse } */
export async function demanderCode(profil) {
  await attendre(500);
  enAttente = profil;
  return { ok: true };
}

/** Vérifie le code (simulé), crée le compte puis connecte. Retourne { user, token } */
export async function verifierCode({ identifiant, code }) {
  await attendre(500);
  if (code !== CODE_MOCK) throw new Error('CODE_INVALIDE');
  const profil = enAttente;
  if (!profil || profil.identifiant !== identifiant) throw new Error('INSCRIPTION_EXPIREE');

  if (!AUTH_REELLE) {
    const comptes = lireComptes();
    comptes[identifiant] = { prenom: profil.prenom, nom: profil.nom, role: profil.role };
    localStorage.setItem(CLE_COMPTES, JSON.stringify(comptes));
    enAttente = null;
    return ouvrirSession(
      { id: 'u-' + identifiant, prenom: profil.prenom, nom: initiale(profil.nom), identifiant, role: profil.role, ville: profil.ville, numeroVerifie: true },
      'mock-token',
    );
  }

  try {
    await apiClient.post(profil.role === 'proprietaire' ? '/announcer/signup' : '/tenant/signup', {
      firstName: profil.prenom,
      lastName: profil.nom,
      phoneNumber: telephone(identifiant),
      password: profil.motDePasse,
      passwordVerify: profil.motDePasse,
      email: profil.email || undefined,
      city: profil.ville.toLowerCase(),
    });
  } catch (err) {
    // Le backend ne gère pas encore les doublons : il répond 500 quand le numéro existe déjà
    if (err.response?.status >= 500) {
      err.response.status = 409;
      err.response.data = { message: 'Inscription impossible : ce numéro est peut-être déjà inscrit. Essayez de vous connecter.' };
    }
    throw err;
  }
  const profils = lireProfils();
  profils[identifiant] = { prenom: profil.prenom, nom: profil.nom, ville: profil.ville };
  localStorage.setItem(CLE_PROFILS, JSON.stringify(profils));
  const motDePasse = profil.motDePasse;
  enAttente = null;
  reinitialiser(identifiant); // des essais ratés avant l'inscription ne doivent pas bloquer le compte tout neuf
  return seConnecter({ identifiant, motDePasse, role: profil.role });
}

// Un échec d'identifiants = mauvais mot de passe, numéro inconnu (les erreurs réseau et serveur ne comptent pas)
const ECHECS_MOCK = ['COMPTE_INCONNU', 'IDENTIFIANTS_ADMIN_MOCK_INVALIDES'];
const estEchecIdentifiants = (err) => ECHECS_MOCK.includes(err?.message) || [400, 401, 404].includes(err?.response?.status);

/**
 * Connexion par téléphone + mot de passe. Retourne { user, token }.
 * Après 3 échecs, le numéro est bloqué 15 minutes : l'erreur porte alors `verrouille` et `restantMs`.
 * Les autres échecs portent `tentativesRestantes`.
 */
export async function seConnecter(params) {
  const { identifiant } = params;
  const restantMs = tempsRestant(identifiant);
  if (restantMs > 0) {
    const bloque = new Error('COMPTE_VERROUILLE');
    bloque.restantMs = restantMs;
    throw bloque;
  }
  try {
    const session = await connexion(params);
    reinitialiser(identifiant);
    return session;
  } catch (err) {
    if (err.response?.status === 429) {
      // Le serveur a lui-même bloqué ce numéro : on s'aligne sur sa durée
      const ms = (Number(err.response.data?.retryAfter) || DUREE_VERROUILLAGE_MS / 1000) * 1000;
      verrouillerPour(identifiant, ms);
      err.verrouille = true;
      err.restantMs = ms;
    } else if (estEchecIdentifiants(err)) {
      const r = enregistrerEchec(identifiant);
      err.tentativesRestantes = r.restantes;
      err.verrouille = r.verrouille;
      err.restantMs = r.restantMs;
    }
    throw err;
  }
}

async function connexion({ identifiant, motDePasse, role }) {
  // Le compte admin de démonstration est complètement indépendant des mocks généraux.
  // Il est impossible à activer en production grâce à USE_ADMIN_MOCKS (DEV uniquement).
  if (USE_ADMIN_MOCKS && identifiant === ADMIN_MOCK) {
    await attendre(250);
    if (motDePasse !== ADMIN_MOCK_PASSWORD) throw new Error('IDENTIFIANTS_ADMIN_MOCK_INVALIDES');
    return ouvrirSession(
      { id: 'admin-mock', prenom: 'Admin', nom: 'ESIKA', identifiant, role: 'admin', numeroVerifie: true },
      'admin-mock-token',
    );
  }

  // Le compte admin réel reste toujours branché sur le backend, même si VITE_USE_MOCKS=true.
  // Ainsi, activer des mocks généraux ne désactive jamais l’accès admin réel.
  if (identifiant === ADMIN_MOCK) {
    const { data } = await apiClient.post('/admin/signin', { phoneNumber: telephone(identifiant), password: motDePasse });
    const u = data.user ?? {};
    return ouvrirSession({ id: u.id ?? 'admin', prenom: u.firstName ?? 'Admin', nom: initiale(u.lastName ?? 'ESIKA'), identifiant, role: 'admin', numeroVerifie: true }, data.token);
  }

  if (!AUTH_REELLE) {
    await attendre(500);
    const compte = lireComptes()[identifiant];
    if (!compte) throw new Error('COMPTE_INCONNU');
    return ouvrirSession(
      {
        id: 'u-' + identifiant,
        prenom: compte.prenom,
        nom: initiale(compte.nom),
        identifiant,
        role: compte.role,
        numeroVerifie: true,
      },
      'mock-token',
    );
  }

  // Le backend a une route de connexion par rôle : locataire d'abord, puis propriétaire si le numéro est inconnu
  const ordre = role === 'proprietaire' ? ['announcer', 'tenant'] : ['tenant', 'announcer'];
  let derniereErreur;
  for (const r of ordre) {
    try {
      const { data } = await apiClient.post(`/${r}/signin`, { phoneNumber: telephone(identifiant), password: motDePasse });
      // Si le backend ne renvoie pas encore l'utilisateur, on reprend le profil saisi à l'inscription (même navigateur)
      const u = data.user ?? {};
      const local = lireProfils()[identifiant] ?? {};
      const user = {
        id: u.id,
        prenom: u.firstName ?? local.prenom ?? 'Utilisateur',
        nom: initiale(u.lastName ?? local.nom),
        identifiant,
        role: r === 'announcer' ? 'proprietaire' : 'locataire',
        ville: VILLES[u.city] ?? u.city ?? local.ville,
        numeroVerifie: true,
      };
      return ouvrirSession(user, data.token);
    } catch (err) {
      if (err.response?.status !== 404) throw err; // mot de passe faux, etc. : on s'arrête
      derniereErreur = err;
    }
  }
  throw derniereErreur;
}

export function deconnecter() {
  localStorage.removeItem('esika_user');
  localStorage.removeItem('esika_token');
}