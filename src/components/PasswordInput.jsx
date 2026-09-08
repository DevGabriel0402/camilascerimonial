import React, { useId, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export default function PasswordInput({ value, onChange, placeholder, autoComplete = 'current-password', required = false }) {
  const [visible, setVisible] = useState(false);
  const controlId = useId();

  return (
    <div className="password-input-control">
      <input
        type={visible ? 'text' : 'password'}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        required={required}
      />
      <label className="password-visibility-toggle" htmlFor={controlId} title={visible ? 'Ocultar senha' : 'Mostrar senha'}>
        <input
          id={controlId}
          type="checkbox"
          checked={visible}
          onChange={event => setVisible(event.target.checked)}
        />
        <span className="password-visibility-icon" aria-hidden="true">
          {visible ? <EyeOff size={17} /> : <Eye size={17} />}
        </span>
        <span className="sr-only">{visible ? 'Ocultar senha' : 'Mostrar senha'}</span>
      </label>
    </div>
  );
}
