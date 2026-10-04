import { QUARTIERS } from "../../../config/constants.js";
import { formatFCFA } from "../../../lib/format.js";
import BandeauAntiArnaque from "../../../components/BandeauAntiArnaque.jsx";
import { IconBolt, IconCar, IconCheckCircle, IconClock, IconGlobe, IconShield, IconSnow, IconWifi, IconX } from "../../../components/ui/Icons.jsx";

const TYPES = ["Chambre", "Chambre salon", "Studio", "2 chambres", "3 chambres +", "Maison"];
const LOYER_MIN = 25000;
const LOYER_MAX = 500000;

// Clé de filtre (valeur enregistrée dans l'URL) -> libellé affiché + icône
const EQUIPEMENTS_FILTRABLES = [
  { cle: "Gardiennage", libelle: "Gardiennage / sécurité", Icone: IconShield },
  { cle: "Groupe électrogène", libelle: "Groupe électrogène", Icone: IconBolt },
  { cle: "Climatisation", libelle: "Climatisation", Icone: IconSnow },
  { cle: "Wi-Fi", libelle: "Wi-Fi inclus", Icone: IconWifi },
  { cle: "Internet", libelle: "Connexion Internet possible", Icone: IconGlobe },
  { cle: "Parking", libelle: "Parking", Icone: IconCar },
];

const basculer = (liste, valeur) => (liste.includes(valeur) ? liste.filter((v) => v !== valeur) : [...liste, valeur]);

function Chip({ actif, onClick, children }) {
  return (
    <button type="button" className={`chip${actif ? " chip--actif" : ""}`} aria-pressed={actif} onClick={onClick}>
      {children}
    </button>
  );
}

function Segmente({ options, valeur, onChange, label }) {
  return (
    <div className="segmente segmente--plein" role="group" aria-label={label}>
      {options.map(([val, texte]) => (
        <button key={val} type="button" aria-pressed={valeur === val} onClick={() => onChange(val)}>
          {texte}
        </button>
      ))}
    </div>
  );
}

export default function Filtres({ filtres, onChange, onReset, ouverts, onFermer }) {
  const loyerCourant = filtres.loyerMax ? Number(filtres.loyerMax) : LOYER_MAX;

  return (
    <aside className={`filtres${ouverts ? " filtres--ouverts" : ""}`} aria-label="Filtres">
      <div className="filtres__tete">
        <h2>Filtres</h2>
        <span className="filtres__actions">
          <button type="button" className="lien" onClick={onReset}>Réinitialiser</button>
          <button type="button" className="filtres__fermer" onClick={onFermer} aria-label="Fermer les filtres"><IconX taille={18} /></button>
        </span>
      </div>

      <fieldset>
        <legend>Ville</legend>
        <Segmente
          label="Ville"
          valeur={filtres.ville}
          onChange={(ville) => onChange({ ville, quartiers: [] })}
          options={[["Brazzaville", "Brazzaville"], ["Pointe-Noire", "Pointe-Noire"]]}
        />
      </fieldset>

      <fieldset>
        <legend>Quartiers</legend>
        <div className="chips">
          {(QUARTIERS[filtres.ville] ?? []).map((q) => (
            <Chip key={q} actif={filtres.quartiers.includes(q)} onClick={() => onChange({ quartiers: basculer(filtres.quartiers, q) })}>
              {q}
            </Chip>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend>Loyer max / mois</legend>
        <input
          type="range"
          className="range"
          min={LOYER_MIN}
          max={LOYER_MAX}
          step={5000}
          value={loyerCourant}
          aria-label="Loyer maximum par mois"
          onChange={(e) => onChange({ loyerMax: Number(e.target.value) >= LOYER_MAX ? "" : e.target.value })}
        />
        <div className="range__reperes">
          <span>{LOYER_MIN.toLocaleString("fr-FR")}</span>
          <strong>{filtres.loyerMax ? formatFCFA(filtres.loyerMax) : "Tous les loyers"}</strong>
          <span>{LOYER_MAX.toLocaleString("fr-FR")} +</span>
        </div>
      </fieldset>

      <div className="champ">
        <label htmlFor="budgetMax">Budget d'entrée max (caution + avance)</label>
        <div className="champ__entree">
          <input
            id="budgetMax"
            type="number"
            inputMode="numeric"
            min="0"
            step="10000"
            placeholder="Ex. 500000"
            value={filtres.budgetMax}
            onChange={(e) => onChange({ budgetMax: e.target.value })}
          />
          <span>FCFA</span>
        </div>
      </div>

      <fieldset>
        <legend>Type de logement</legend>
        <div className="chips">
          {TYPES.map((t) => (
            <Chip key={t} actif={filtres.type === t} onClick={() => onChange({ type: filtres.type === t ? "" : t })}>
              {t}
            </Chip>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend>Ameublement</legend>
        <Segmente
          label="Ameublement"
          valeur={filtres.meuble}
          onChange={(meuble) => onChange({ meuble })}
          options={[["", "Tous"], ["oui", "Meublé"], ["non", "Non meublé"]]}
        />
      </fieldset>

      <fieldset className="filtres__groupe">
        <legend>Sécurité et équipements</legend>
        {EQUIPEMENTS_FILTRABLES.map(({ cle, libelle, Icone }) => (
          <label key={cle} className="check">
            <input type="checkbox" checked={filtres.equipements.includes(cle)} onChange={() => onChange({ equipements: basculer(filtres.equipements, cle) })} />
            <Icone taille={16} />
            {libelle}
          </label>
        ))}
      </fieldset>

      <fieldset className="filtres__groupe">
        <legend>Fiabilité</legend>
        <label className="check">
          <input type="checkbox" checked={filtres.dispoMaintenant} onChange={(e) => onChange({ dispoMaintenant: e.target.checked })} />
          <IconCheckCircle taille={16} />
          Disponible maintenant
        </label>
        <label className="check">
          <input type="checkbox" checked={filtres.maj7j} onChange={(e) => onChange({ maj7j: e.target.checked })} />
          <IconClock taille={16} />
          Mise à jour il y a moins de 7 jours
        </label>
        <label className="check">
          <input type="checkbox" checked={filtres.verifie} onChange={(e) => onChange({ verifie: e.target.checked })} />
          <IconShield taille={16} />
          Numéro vérifié
        </label>
      </fieldset>

      <BandeauAntiArnaque>Signalez toute demande d'argent anticipée.</BandeauAntiArnaque>
    </aside>
  );
}
