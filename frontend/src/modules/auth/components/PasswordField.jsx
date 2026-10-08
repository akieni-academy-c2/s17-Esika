import { useState } from 'react';
import { IconEye, IconEyeOff } from '../../../components/ui/Icons.jsx';

/** Champ mot de passe avec bouton afficher / masquer */
export default function PasswordField({ id, value, onChange, autoComplete, placeholder, disabled }) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="auth__mdp">
      <input
        id={id}
        type={visible ? 'text' : 'password'}
        className="auth__input"
        autoComplete={autoComplete}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
      />
      <button
        type="button"
        className="auth__oeil"
        aria-label={visible ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
        aria-pressed={visible}
        onClick={() => setVisible((v) => !v)}
      >
        {visible ? <IconEyeOff taille={18} /> : <IconEye taille={18} />}
      </button>
    </div>
  );
}
