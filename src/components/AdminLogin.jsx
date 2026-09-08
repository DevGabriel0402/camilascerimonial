import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { ArrowLeft, KeyRound, LogIn } from 'lucide-react';

export default function AdminLogin({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      onLoginSuccess();
    } catch (err) {
      console.error("Erro no Firebase Auth:", err.code, err.message);
      
      switch (err.code) {
        case 'auth/invalid-credential':
        case 'auth/user-not-found':
        case 'auth/wrong-password':
          setError('E-mail ou senha incorretos! Verifique suas credenciais.');
          break;
        case 'auth/invalid-email':
          setError('Digite um endereço de e-mail válido.');
          break;
        case 'auth/too-many-requests':
          setError('Muitas tentativas. Tente novamente em alguns minutos.');
          break;
        default:
          setError('Erro ao conectar. Verifique sua conexão e tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" style={{ background: 'var(--bg-page)' }}>
      <div className="modal-content-clean form-clean" style={{ maxWidth: '420px', border: '1px solid var(--border-color)' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <Link to="/" style={{ color: 'var(--secondary-navy)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: '600' }}>
            <ArrowLeft size={16} /> Voltar ao Site
          </Link>
          <span style={{ fontSize: '11px', color: 'var(--primary-gold)', textTransform: 'uppercase', fontWeight: '700' }}>
            Área Restrita
          </span>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '25px' }}>
          <div style={{ width: '55px', height: '55px', borderRadius: '50%', background: 'var(--primary-gold-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px auto' }}>
            <KeyRound size={26} color="var(--primary-gold)" />
          </div>

          <h2 className="serif-title" style={{ fontSize: '22px', color: 'var(--secondary-navy)' }}>
            Login de Administrador
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Acesso exclusivo ao painel de gestão.
          </p>
        </div>

        {error && (
          <div style={{ color: '#ef4444', fontSize: '13px', background: '#fee2e2', border: '1px solid #fca5a5', padding: '10px 14px', borderRadius: '8px', marginBottom: '14px', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '12px' }}>
            <label style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px', display: 'block', fontWeight: '600' }}>E-mail</label>
            <input
              type="email"
              placeholder="Digite seu e-mail..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px', display: 'block', fontWeight: '600' }}>Senha</label>
            <input
              type="password"
              placeholder="Digite sua senha..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn-gold" style={{ width: '100%', marginTop: '6px' }} disabled={loading}>
            {loading ? 'Autenticando...' : (
              <><LogIn size={16} /> Entrar no Painel</>
            )}
          </button>
        </form>

      </div>
    </div>
  );
}
