import { lazy, Suspense } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout.jsx";
import AuthLayout from "../layouts/AuthLayout.jsx";
import Spinner from "../components/ui/Spinner.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import AnnonceurLayout from "../layouts/AnnonceurLayout.jsx";
import AdminLayout from "../layouts/AdminLayout.jsx";



const Accueil = lazy(() => import("../modules/annonces/pages/Accueil.jsx"));
const ListeAnnonces = lazy(() => import("../modules/annonces/pages/ListeAnnonces.jsx"));
const DetailAnnonce = lazy(() => import("../modules/annonces/pages/DetailAnnonce.jsx"));
const PassContact = lazy(() => import("../modules/passContact/pages/PassContact.jsx"));
const ContactDebloque = lazy(() => import("../modules/passContact/pages/ContactDebloque.jsx"));
const Connexion = lazy(() => import("../modules/auth/pages/Connexion.jsx"));
const Inscription = lazy(() => import("../modules/auth/pages/Inscription.jsx"));
const PublierAnnonce = lazy(() => import("../modules/annonceur/pages/PublierAnnonce.jsx"));
const MesAnnonces = lazy(() => import("../modules/annonceur/pages/MesAnnonces.jsx"));
const CommentCaMarche = lazy(() => import("../modules/contenu/pages/CommentCaMarche.jsx"));
const Signalements = lazy(() => import("../modules/admin/pages/Signalements.jsx"));

// Les autres pages s'ajoutent ici au fur et à mesure.

const page = (element) => <Suspense fallback={<Spinner />}>{element}</Suspense>;

export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      { path: "/", element: page(<Accueil />) },
      { path: "/annonces", element: page(<ListeAnnonces />) },
      { path: "/annonces/:id", element: page(<DetailAnnonce />) },
      { path: "/comment-ca-marche", element: page(<CommentCaMarche />) },

      // Locataire connecté
      {
        element: <ProtectedRoute />,
        children: [
          { path: "/annonces/:id/debloquer", element: page(<PassContact />) },
          { path: "/annonces/:id/contact", element: page(<ContactDebloque />) },
        ],
      },
      {
        element: <ProtectedRoute roles={["proprietaire"]} />,
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
        element: <ProtectedRoute roles={["proprietaire"]} />,
        children: [
          { path: "/annonceur/publier", element: page(<PublierAnnonce />) },
        ],
      },

      { path: "*", element: <p className="container page-vide">Cette page n'existe pas (encore).</p> },
    ],
  },
  {
    element: <AuthLayout />,
    children: [
      { path: "/connexion", element: page(<Connexion />) },
      { path: "/inscription", element: page(<Inscription />) },
    ],
  },
  
  {
    element: <ProtectedRoute roles={["admin"]} />,
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