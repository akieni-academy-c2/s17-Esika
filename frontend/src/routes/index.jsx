/* eslint-disable react-refresh/only-export-components */
import { lazy, Suspense } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout.jsx";
import AuthLayout from "../layouts/AuthLayout.jsx";
import Spinner from "../components/ui/Spinner.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import AnnonceurLayout from "../layouts/AnnonceurLayout.jsx";
import AdminLayout from "../layouts/AdminLayout.jsx";
import ErreurPage from "../components/ErreurPage.jsx";
import PageIntrouvable from "../components/PageIntrouvable.jsx";

const pages = {
  Accueil: () => import("../modules/annonces/pages/Accueil.jsx"),
  ListeAnnonces: () => import("../modules/annonces/pages/ListeAnnonces.jsx"),
  DetailAnnonce: () => import("../modules/annonces/pages/DetailAnnonce.jsx"),
  PassContact: () => import("../modules/passContact/pages/PassContact.jsx"),
  ContactDebloque: () => import("../modules/passContact/pages/ContactDebloque.jsx"),
  Connexion: () => import("../modules/auth/pages/Connexion.jsx"),
  Inscription: () => import("../modules/auth/pages/Inscription.jsx"),
  PublierAnnonce: () => import("../modules/annonceur/pages/PublierAnnonce.jsx"),
  MesAnnonces: () => import("../modules/annonceur/pages/MesAnnonces.jsx"),
  CommentCaMarche: () => import("../modules/contenu/pages/CommentCaMarche.jsx"),
  Signalements: () => import("../modules/admin/pages/Signalements.jsx"),
  PageLegale: () => import("../modules/contenu/pages/PageLegale.jsx"),
};

const Accueil = lazy(pages.Accueil);
const ListeAnnonces = lazy(pages.ListeAnnonces);
const DetailAnnonce = lazy(pages.DetailAnnonce);
const PassContact = lazy(pages.PassContact);
const ContactDebloque = lazy(pages.ContactDebloque);
const Connexion = lazy(pages.Connexion);
const Inscription = lazy(pages.Inscription);
const PublierAnnonce = lazy(pages.PublierAnnonce);
const MesAnnonces = lazy(pages.MesAnnonces);
const CommentCaMarche = lazy(pages.CommentCaMarche);
const Signalements = lazy(pages.Signalements);
const Conditions = lazy(() => pages.PageLegale().then((m) => ({ default: m.Conditions })));
const Confidentialite = lazy(() => pages.PageLegale().then((m) => ({ default: m.Confidentialite })));
const Contact = lazy(() => pages.PageLegale().then((m) => ({ default: m.Contact })));

// La première page reste légère (3G). Les autres se chargent en arrière-plan dès que le navigateur est
// inactif : un clic sur un lien affiche alors la page tout de suite, sans écran de chargement.
if (typeof window !== "undefined") {
  const precharger = () => {
    Object.entries(pages).forEach(([nom, charger]) => {
      if (nom !== "Signalements") charger().catch(() => {});
    });
  };
  if ("requestIdleCallback" in window) window.requestIdleCallback(precharger);
  else setTimeout(precharger, 2000);
}

const page = (element) => (
  <Suspense fallback={<div className="page-chargement"><Spinner /></div>}>{element}</Suspense>
);

export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    errorElement: <ErreurPage />,
    children: [
      { path: "/", element: page(<Accueil />) },
      { path: "/annonces", element: page(<ListeAnnonces />) },
      { path: "/annonces/:id", element: page(<DetailAnnonce />) },
      { path: "/comment-ca-marche", element: page(<CommentCaMarche />) },
      { path: "/conditions", element: page(<Conditions />) },
      { path: "/confidentialite", element: page(<Confidentialite />) },
      { path: "/contact", element: page(<Contact />) },

      // Locataire connecté
      {
        element: <ProtectedRoute />,
        children: [
          { path: "/annonces/:id/debloquer", element: page(<PassContact />) },
          { path: "/annonces/:id/contact", element: page(<ContactDebloque />) },
        ],
      },

      { path: "*", element: <PageIntrouvable /> },
    ],
  },

  // Espace propriétaire : AnnonceurLayout a son propre en-tête et son propre pied de page,
  // il ne doit donc PAS être imbriqué dans MainLayout (sinon double barre et double footer).
  {
    element: <ProtectedRoute roles={["proprietaire"]} />,
    errorElement: <ErreurPage />,
    children: [
      {
        element: <AnnonceurLayout />,
        children: [
          { path: "/annonceur/publier", element: page(<PublierAnnonce />) },
          { path: "/annonceur/mes-annonces", element: page(<MesAnnonces />) },
        ],
      },
    ],
  },

  {
    element: <AuthLayout />,
    errorElement: <ErreurPage />,
    children: [
      { path: "/connexion", element: page(<Connexion />) },
      { path: "/inscription", element: page(<Inscription />) },
    ],
  },

  {
    element: <ProtectedRoute roles={["admin"]} />,
    errorElement: <ErreurPage />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { path: "/admin", element: <Navigate to="/admin/signalements" replace /> },
          { path: "/admin/signalements", element: page(<Signalements />) },
        ],
      },
    ],
  },
]);
