import { useRef } from 'react';

export default function CodeInput({ longueur = 6, valeur, onChange, disabled }) {
  const refs = useRef([]);
  const chiffres = Array.from({ length: longueur }, (_, i) => valeur[i] ?? '');

  const maj = (nouveau) => onChange(nouveau.replace(/\D/g, '').slice(0, longueur));

  const saisir = (i, e) => {
    const c = e.target.value.replace(/\D/g, '').slice(-1);
    const tab = [...chiffres];
    tab[i] = c;
    maj(tab.join(''));
    if (c && i < longueur - 1) refs.current[i + 1]?.focus();
  };

  const toucher = (i, e) => {
    if (e.key === 'Backspace' && !chiffres[i] && i > 0) refs.current[i - 1]?.focus();
  };

  const coller = (e) => {
    e.preventDefault();
    const texte = e.clipboardData.getData('text');
    maj(texte);
    refs.current[Math.min(texte.replace(/\D/g, '').length, longueur - 1)]?.focus();
  };

  return (
    <div className="code" onPaste={coller} role="group" aria-label="Code reçu par SMS">
      {chiffres.map((c, i) => (
        <input
          key={i}
          ref={(el) => (refs.current[i] = el)}
          className="code__case"
          type="text"
          inputMode="numeric"
          autoComplete={i === 0 ? 'one-time-code' : 'off'}
          maxLength={1}
          value={c}
          disabled={disabled}
          aria-label={`Chiffre ${i + 1}`}
          onChange={(e) => saisir(i, e)}
          onKeyDown={(e) => toucher(i, e)}
        />
      ))}
    </div>
  );
}