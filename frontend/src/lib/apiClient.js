import axios from "axios";

export const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === "true";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000/api";

// Les photos sont servies par le backend (/uploads/...), hors du préfixe /api
export const urlPhoto = (chemin) =>
  !chemin || /^https?:/.test(chemin) ? chemin : API_URL.replace(/\/api\/?$/, "") + chemin;

const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("esika_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (reponse) => {
    // Le backend répond { message, status, data } : on ne garde que data
    const b = reponse.data;
    if (b && typeof b === "object" && "status" in b && "message" in b && "data" in b) reponse.data = b.data;
    return reponse;
  },
  (erreur) => {
    if (erreur.response?.status === 401) {
      localStorage.removeItem("esika_token");
      localStorage.removeItem("esika_user");
    }
    return Promise.reject(erreur);
  }
);

export default api;