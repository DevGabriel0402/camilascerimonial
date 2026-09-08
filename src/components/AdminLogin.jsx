import React, { useState } from "react";
import { Link } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { ArrowLeft, Cog, LogIn } from "lucide-react";
import toast from "react-hot-toast";
import PasswordInput from './PasswordInput';

export default function AdminLogin({ onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      onLoginSuccess();
    } catch (err) {
      console.error("Erro no Firebase Auth:", err.code, err.message);

      let message;
      switch (err.code) {
        case "auth/invalid-credential":
        case "auth/user-not-found":
        case "auth/wrong-password":
          message = "E-mail ou senha incorretos. Verifique suas credenciais.";
          break;
        case "auth/invalid-email":
          message = "Digite um endereço de e-mail válido.";
          break;
        case "auth/too-many-requests":
          message = "Muitas tentativas. Aguarde alguns minutos e tente novamente.";
          break;
        default:
          message = "Erro ao conectar. Verifique sua conexão e tente novamente.";
      }
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" style={{ background: "var(--bg-page)" }}>
      <div
        className="modal-content-clean form-clean"
        style={{ maxWidth: "420px", border: "1px solid var(--border-color)" }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "20px",
          }}
        >
          <Link
            to="/"
            style={{
              color: "var(--secondary-navy)",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "13px",
              fontWeight: "600",
            }}
          >
            <ArrowLeft size={16} /> Voltar ao Site
          </Link>
          <span
            style={{
              fontSize: "11px",
              color: "var(--primary-gold)",
              textTransform: "uppercase",
              fontWeight: "700",
            }}
          >
            Área Restrita
          </span>
        </div>

        <div style={{ textAlign: "center", marginBottom: "25px" }}>
          <div
            style={{
              width: "55px",
              height: "55px",
              borderRadius: "50%",
              background: "var(--primary-gold-light)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 12px auto",
            }}
          >
            <Cog size={26} color="var(--primary-gold)" />
          </div>

          <h2
            className="serif-title"
            style={{ fontSize: "22px", color: "var(--secondary-navy)" }}
          >
            Login de Administrador
          </h2>
          <p style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "4px" }}>
            Acesso exclusivo ao painel de gestão.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "12px" }}>
            <label
              style={{
                fontSize: "12px",
                color: "var(--text-muted)",
                marginBottom: "4px",
                display: "block",
                fontWeight: "600",
              }}
            >
              E-mail
            </label>
            <input
              type="email"
              placeholder="Digite seu e-mail..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label
              style={{
                fontSize: "12px",
                color: "var(--text-muted)",
                marginBottom: "4px",
                display: "block",
                fontWeight: "600",
              }}
            >
              Senha
            </label>
            <PasswordInput
              placeholder="Digite sua senha..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>

          <button
            type="submit"
            className="btn-gold"
            style={{ width: "100%", marginTop: "6px" }}
            disabled={loading}
          >
            {loading ? (
              "Autenticando..."
            ) : (
              <>
                <LogIn size={16} /> Entrar no Painel
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
