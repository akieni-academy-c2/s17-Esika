import PageTransition from "../components/PageTransition.jsx";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";

export default function MainLayout() {
  return (
    <>
      <Navbar />
      <main>
        <PageTransition />
      </main>
      <Footer />
    </>
  );
}