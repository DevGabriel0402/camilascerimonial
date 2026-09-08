import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, HeartHandshake, Plus, KeyRound, ExternalLink, LogOut, Menu, X, Eye, Save, ChevronRight, ShieldCheck } from 'lucide-react';
import logo from '../../logo.png';
import './AdminLayout.css';

const sections = [
  { id: 'completa', label: 'Proposta completa', description: 'Assessoria do início ao grande dia.', icon: FileText },
  { id: 'cerimonial', label: 'Cerimonial do dia', description: 'Cada detalhe da celebração, bem cuidado.', icon: HeartHandshake },
  { id: 'nova', label: 'PDF personalizado', description: 'Prepare uma proposta para uma ocasião especial.', icon: Plus },
  { id: 'senha', label: 'Configurações', description: 'Gerencie as configurações da sua conta.', icon: KeyRound },
];

export default function AdminLayout({ activeTab, onNavigate, onLogout, onPreview, children }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const dialogRef = useRef(null);
  const menuRef = useRef(null);
  const selected = sections.find(section => section.id === activeTab) || sections[0];

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!menuOpen) { if (dialog.open) dialog.close(); return; }
    dialog.showModal();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const media = window.matchMedia('(min-width: 1024px)');
    const closeOnDesktop = () => { if (media.matches) setMenuOpen(false); };
    media.addEventListener('change', closeOnDesktop);
    return () => {
      document.body.style.overflow = previousOverflow;
      media.removeEventListener('change', closeOnDesktop);
      if (dialog.open) dialog.close();
      menuRef.current?.focus();
    };
  }, [menuOpen]);

  const navigate = id => { onNavigate(id); setMenuOpen(false); };
  const navigation = (mobile = false) => (
    <>
      <div className="workspace-brand">
        <img src={logo} alt="" />
        <div><strong>Camila’s</strong><span>CERIMONIAL · GESTÃO</span></div>
        {mobile && <button type="button" className="workspace-icon-button drawer-close" aria-label="Fechar menu" onClick={() => setMenuOpen(false)}><X size={20} /></button>}
      </div>
      <div className="workspace-switcher"><span className="workspace-avatar">CC</span><div><strong>Meu espaço de trabalho</strong><span>Camila’s Cerimonial</span></div></div>
      <nav aria-label={mobile ? 'Menu administrativo móvel' : 'Menu administrativo'}>
        <p className="workspace-nav-label">PROPOSTAS</p>
        {sections.slice(0, 3).map(({ id, label, icon: Icon }) => (
          <button type="button" key={id} className={`workspace-nav-item ${activeTab === id ? 'is-active' : ''}`} aria-current={activeTab === id ? 'page' : undefined} onClick={() => navigate(id)}>
            <Icon size={19} /><span>{label}</span>{activeTab === id && <ChevronRight size={15} />}
          </button>
        ))}
        <p className="workspace-nav-label workspace-nav-label-spaced">ESPAÇO DE TRABALHO</p>
        <button type="button" className={`workspace-nav-item ${activeTab === 'senha' ? 'is-active' : ''}`} aria-current={activeTab === 'senha' ? 'page' : undefined} onClick={() => navigate('senha')}><KeyRound size={18} /><span>Configurações</span></button>
        <Link to="/" className="workspace-nav-item" onClick={() => setMenuOpen(false)}><ExternalLink size={18} /><span>Ver site público</span></Link>
      </nav>
      <div className="workspace-sidebar-bottom">
        <div className="workspace-note"><ShieldCheck size={20} /><div><strong>Seu cuidado, em cada detalhe.</strong><p>Organize as propostas que dão início a grandes momentos.</p></div></div>
        <div className="workspace-account"><span className="workspace-avatar">CA</span><div><strong>Administradora</strong><span>Camila’s Cerimonial</span></div><button type="button" className="workspace-icon-button" aria-label="Sair da conta" onClick={onLogout}><LogOut size={18} /></button></div>
      </div>
    </>
  );

  return (
    <div className="admin-workspace">
      <a href="#workspace-content" className="workspace-skip">Ir para o conteúdo</a>
      <aside className="workspace-sidebar">{navigation()}</aside>
      <dialog ref={dialogRef} id="workspace-mobile-menu" className="workspace-drawer" aria-label="Navegação do painel" onCancel={() => setMenuOpen(false)} onClose={() => setMenuOpen(false)} onClick={event => { if (event.target === event.currentTarget) { const box = event.currentTarget.getBoundingClientRect(); if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) setMenuOpen(false); } }}>
        <div className="workspace-drawer-inner">{navigation(true)}</div>
      </dialog>
      <div className="workspace-main">
        <header className="workspace-topbar">
          <div className="workspace-topbar-start"><button type="button" ref={menuRef} className="workspace-icon-button workspace-menu-button" aria-label="Abrir menu" aria-expanded={menuOpen} aria-controls="workspace-mobile-menu" onClick={() => setMenuOpen(true)}><Menu size={22} /></button><div className="workspace-breadcrumb"><span>Painel</span><ChevronRight size={14} /><strong>{selected.label}</strong></div></div>
          <div className="workspace-topbar-actions">
            {activeTab !== 'senha' && <><button type="button" className="workspace-button workspace-button-secondary" aria-label="Visualizar PDF" onClick={onPreview}><Eye size={17} /><span>Visualizar PDF</span></button><button type="submit" form="admin-proposal-form" className="workspace-button workspace-button-primary" aria-label="Salvar alterações"><Save size={17} /><span>Salvar alterações</span></button></>}
            <span className="workspace-topbar-avatar" aria-label="Área administrativa">CA</span>
          </div>
        </header>
        <main id="workspace-content" className="workspace-content" tabIndex={-1}>
          <div className="workspace-heading"><div><p className="workspace-eyebrow">{activeTab === 'senha' ? 'ESPAÇO DE TRABALHO' : 'GESTÃO DE PROPOSTAS'}</p><h1>{selected.label}</h1><p>{selected.description}</p></div><span className="workspace-heading-tag">{activeTab === 'nova' ? 'Personalizada' : activeTab === 'senha' ? 'Conta' : 'Modelo de proposta'}</span></div>
          {children}
          <footer className="workspace-footer">Camila’s Cerimonial <span>Feito para cuidar de cada detalhe.</span></footer>
        </main>
      </div>
    </div>
  );
}
