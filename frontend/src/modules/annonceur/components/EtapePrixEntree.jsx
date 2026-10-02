import { ELECTRICITE_EAU } from "../annonceur.data";
import { formatFCFA } from "../../../lib/format";

function Compteur({ id, label, valeur, min, max, onChange }) {
  return (
    <div className="pub__compteur">
      <span id={id}>{label}</span>
      <div role="group" aria-labelledby={id}>
        <button type="button" aria-label={`Moins de mois de ${label.toLowerCase()}`}
          disabled={valeur <= min} onClick={() => onChange(valeur - 1)}>−</button>
        <output aria-live="polite">{valeur} mois</output>
        <button type="button" aria-label={`Plus de mois de ${label.toLowerCase()}`}
          disabled={valeur >= max} onClick={() => onChange(valeur + 1)}>+</button>
      </div>
    </div>
  );
}

export default function EtapePrixEntree({ d, maj }) {
  const loyer = Number(d.loyer) || 0;
  const caution = loyer * d.cautionMois;
  const avance = loyer * d.avanceMois;

  return (
    <>
      <label className="pub__label" htmlFor="loyer">Loyer mensuel (FCFA)</label>
      <input id="loyer" className="pub__champ" type="number" inputMode="numeric" min="0" step="5000"
        placeholder="150000" value={d.loyer} onChange={(e) => maj({ loyer: e.target.value })} />

      <div className="pub__duo">
        <Compteur id="c-caution" label="Caution" valeur={d.cautionMois} min={0} max={6}
          onChange={(v) => maj({ cautionMois: v })} />
        <Compteur id="c-avance" label="Avance" valeur={d.avanceMois} min={0} max={6}
          onChange={(v) => maj({ avanceMois: v })} />
      </div>

      <div className="pub__total" aria-live="polite">
        <div>
          <strong>Total à l'entrée affiché aux locataires</strong>
          <small>{formatFCFA(caution)} caution + {formatFCFA(avance)} avance · zéro commission</small>
        </div>
        <span>{formatFCFA(caution + avance)}</span>
      </div>

      <div className="pub__duo">
        <div>
          <label className="pub__label" htmlFor="elec">Électricité et eau</label>
          <select id="elec" className="pub__champ" value={d.electriciteEau}
            onChange={(e) => maj({ electriciteEau: e.target.value })}>
            {ELECTRICITE_EAU.map((o) => <option key={o}>{o}</option>)}
          </select>
        </div>
        <div>
          <label className="pub__label" htmlFor="dispo">Disponible à partir du</label>
          <input id="dispo" type="date" className="pub__champ" value={d.disponibleLe}
            onChange={(e) => maj({ disponibleLe: e.target.value })} />
        </div>
      </div>

      <label className="pub__label" htmlFor="horaires">Horaires de contact préférés</label>
      <input id="horaires" className="pub__champ" placeholder="Ex. 18 h – 20 h en semaine, samedi matin"
        value={d.horaires} onChange={(e) => maj({ horaires: e.target.value })} />
    </>
  );
}