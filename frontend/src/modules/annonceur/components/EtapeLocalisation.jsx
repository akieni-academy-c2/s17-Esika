import { QUARTIERS, VILLES } from "../annonceur.data";

export default function EtapeLocalisation({ d, maj }) {
  return (
    <>
      <p className="pub__etiquette">Ville</p>
      <div className="pub__segment">
        {VILLES.map((v) => (
          <button key={v} type="button" aria-pressed={d.ville === v}
            className={d.ville === v ? "is-actif" : ""}
            onClick={() => maj({ ville: v, quartier: "" })}>
            {v}
          </button>
        ))}
      </div>

      <p className="pub__etiquette">Quartier</p>
      <div className="pub__chips" role="group" aria-label="Quartier">
        {QUARTIERS[d.ville].map((q) => (
          <button key={q} type="button" aria-pressed={d.quartier === q}
            className={d.quartier === q ? "is-actif" : ""} onClick={() => maj({ quartier: q })}>
            {q}
          </button>
        ))}
      </div>

      <label className="pub__label" htmlFor="repere">Repère connu dans le quartier</label>
      <input id="repere" className="pub__champ" placeholder="Ex. Derrière le marché Total"
        value={d.repere} onChange={(e) => maj({ repere: e.target.value })} />
      <small className="pub__aide">L'adresse exacte n'est donnée qu'après déblocage du contact.</small>
    </>
  );
}