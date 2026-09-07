import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Lock, ArrowLeft } from 'lucide-react';

export default function AdminLogin({ onLoginSuccess }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Default password or check local/firebase
    const savedPassword = localStorage.getItem('adminPassword') || 'admin123';
    
    if (password === savedPassword) {
      onLoginSuccess();
    } else {
      setError('Senha incorreta! Tente novamente.');
    }
  };

  return (
    <div className="modal" style={{ display: 'flex' }}>
      <form id="formulario" onSubmit={handleSubmit} style={{ maxWidth: '400px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
          <Link to="/" style={{ color: 'var(--secundary-color)' }}>
            <ArrowLeft size={20} />
          </Link>
          <h2 style={{ fontSize: '20px' }}>Acesso do Administrador</h2>
        </div>

        <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '15px' }}>
          Digite a senha cadastrada para editar as propostas e gerar PDFs.
        </p>

        {error && (
          <div style={{ color: '#ef4444', fontSize: '13px', background: '#fee2e2', padding: '8px', borderRadius: '6px' }}>
            {error}
          </div>
        )}

        <div className="form-group">
          <input
            type="password"
            placeholder="Digite a senha..."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoFocus
          />
        </div>

        <button type="submit" style={{ marginTop: '10px' }}>
          Entrar no Painel
        </button>

        <span style={{ fontSize: '11px', color: '#94a3b8', marginTop: '10px' }}>
          Senha padrão: <strong>admin123</strong> (Você poderá alterá-la dentro do painel)
        </span>
      </form>
    </div>
  );
}
