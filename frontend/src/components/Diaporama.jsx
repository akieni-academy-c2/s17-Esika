import { useEffect, useState } from "react";

/**
 * Diaporama qui défile tout seul (3 s par défaut) avec fondu.
 * - pause au survol / au focus, et quand l'onglet n'est pas visible ;
 * - pas de défilement automatique si l'utilisateur a demandé « réduire les animations » ;
 * - les points permettent de choisir une photo (le décompte repart alors à zéro).
 */
export default function Diaporama({ images, intervalle = 3000, label = "Photos de logements" }) {
  const [index, setIndex] = useState(0);
  const [pause, setPause] = useState(false);
  const [visible, setVisible] = useState(true);
  const [reduit] = useState(() => typeof window !== "undefined" && !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches);

  useEffect(() => {
    const maj = () => setVisible(document.visibilityState !== "hidden");
    document.addEventListener("visibilitychange", maj);
    return () => document.removeEventListener("visibilitychange", maj);
  }, []);

  useEffect(() => {
    if (images.length < 2 || pause || reduit || !visible) return undefined;
    const minuteur = setInterval(() => setIndex((i) => (i + 1) % images.length), intervalle);
    return () => clearInterval(minuteur);
  }, [images.length, intervalle, pause, reduit, visible, index]);

  return (
    <div
      className="diaporama"
      role="region"
      aria-roledescription="carrousel"
      aria-label={label}
      onMouseEnter={() => setPause(true)}
      onMouseLeave={() => setPause(false)}
      onFocus={() => setPause(true)}
      onBlur={() => setPause(false)}
    >
      {images.map((img, i) => (
        <img
          key={img.src}
          src={img.src}
          alt={img.alt}
          className={`diaporama__img${i === index ? " is-actif" : ""}`}
          aria-hidden={i !== index}
          width="1400"
          height="788"
          fetchPriority={i === 0 ? "high" : undefined}
          decoding="async"
        />
      ))}

      {images.length > 1 && (
        <div className="diaporama__points" role="group" aria-label="Choisir une photo">
          {images.map((img, i) => (
            <button
              key={img.src}
              type="button"
              className="diaporama__point"
              aria-label={`Photo ${i + 1} sur ${images.length}`}
              aria-current={i === index}
              onClick={() => setIndex(i)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
