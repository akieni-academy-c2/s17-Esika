import { EQUIPEMENTS } from "../annonceur.data";
import { IconBolt, IconCar, IconGlobe, IconShield, IconSnow, IconWifi } from "../../../components/ui/Icons.jsx";

const icone = (titre = "") => {
  const t = titre.toLowerCase();
  if (t.includes("gardien") || t.includes("sécurité")) return IconShield;
  if (t.includes("groupe")) return IconBolt;
  if (t.includes("clim")) return IconSnow;
  if (t.includes("wi")) return IconWifi;
  if (t.includes("internet")) return IconGlobe;
  return IconCar;
};

export default function EtapeEquipements({ d, maj }) {
  const basculer = (cle) =>
    maj({
      equipements: d.equipements.includes(cle)
        ? d.equipements.filter((e) => e !== cle)
        : [...d.equipements, cle],
    });

  return (
    <>
      <p className="pub__aide">Les locataires filtrent souvent sur ces critères : soyez précis.</p>
      <ul className="pub__equip">
        {EQUIPEMENTS.map((e) => {
          const Icone = icone(e.titre);
          return (
            <li key={e.cle}>
              <label>
                <Icone taille={20} />
                <span className="pub__equip-texte"><strong>{e.titre}</strong><small>{e.sous}</small></span>
                <input type="checkbox" role="switch" className="interrupteur" checked={d.equipements.includes(e.cle)}
                  onChange={() => basculer(e.cle)} />
              </label>
            </li>
          );
        })}
      </ul>

      <p className="pub__etiquette">Ameublement</p>
      <div className="pub__segment">
        {[["Meublé", true], ["Non meublé", false]].map(([lib, val]) => (
          <button key={lib} type="button" aria-pressed={d.meuble === val}
            className={d.meuble === val ? "is-actif" : ""} onClick={() => maj({ meuble: val })}>
            {lib}
          </button>
        ))}
      </div>
    </>
  );
}