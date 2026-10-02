import { TYPES } from "../annonceur.data";

export default function EtapeLogement({ d, maj }) {
  return (
    <>
      <p className="pub__etiquette">Type de logement</p>
      <div className="pub__chips" role="group" aria-label="Type de logement">
        {TYPES.map((t) => (
          <button key={t} type="button" aria-pressed={d.type === t}
            className={d.type === t ? "is-actif" : ""} onClick={() => maj({ type: t })}>
            {t}
          </button>
        ))}
      </div>

      <label className="pub__label" htmlFor="desc">Description (facultatif)</label>
      <textarea id="desc" className="pub__champ" rows={4} maxLength={400}
        placeholder="État du logement, pièces, luminosité, voisinage…"
        value={d.description} onChange={(e) => maj({ description: e.target.value })} />
      <small className="pub__aide">{d.description.length}/400</small>
    </>
  );
}