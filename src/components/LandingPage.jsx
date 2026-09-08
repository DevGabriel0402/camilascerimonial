import logo from '../logo.png';
import eventPhoto12 from '../../images/12.webp';
import eventPhoto10 from '../../images/10.webp';
import eventPhoto15 from '../../images/15.webp';
import eventPhoto13 from '../../images/13.webp';
import eventPhoto05 from '../../images/05.webp';
import eventPhoto06 from '../../images/06.webp';
import eventPhoto07 from '../../images/07.webp';
import eventPhoto08 from '../../images/08.webp';
import eventPhoto09 from '../../images/09.webp';
import eventPhoto02 from '../../images/02.webp';
import eventPhoto01 from '../../images/01.webp';
import eventPhoto03 from '../../images/03.webp';
import eventPhoto04 from '../../images/04.webp';
import eventPhoto11 from '../../images/11.webp';
import eventPhoto14 from '../../images/14.webp';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { Download, MessageCircle, Lock, FileText, CheckCircle2, Star, X, ChevronRight, FileCheck } from 'lucide-react';
import { maskPhone, maskCPF } from '../utils/masks';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function LandingPage({ proposals, siteContent, onSelectProposalForPdf }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [proposalModalType, setProposalModalType] = useState(null); // 'completa' | 'cerimonial' | null
  const [loading, setLoading] = useState(true);

  // General Contact Form
  const [formName, setFormName] = useState('');
  const [eventType, setEventType] = useState('nenhum');
  const [guestCount, setGuestCount] = useState('');
  const [formText, setFormText] = useState('');

  // Proposal PDF Client Data Form
  const [clientData, setClientData] = useState({
    name: '',
    phone: '',
    email: '',
    cpf: '',
    guestTierId: ''
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  const handleSendWhatsApp = (e) => {
    e.preventDefault();
    if (!formName || eventType === 'nenhum') {
      alert('Por favor, informe seu nome e o tipo do evento!');
      return;
    }

    const mensagem = `Olá ${siteContent.brandName}! Meu nome é ${formName}.\n\n*Tipo de Evento:* ${eventType}\n*Estimativa de Convidados:* ${guestCount || 'Não informado'}\n*Observações:* ${formText || 'Sem observações'}\n\nGostaria de solicitar um orçamento e consultar datas!`;
    const uri = encodeURIComponent(mensagem);
    const contato = siteContent.whatsappPhone;
    const url = `https://wa.me/55${contato}?text=${uri}`;
    window.open(url, '_blank');
  };

  // Trigger Client Data Form when clicking Proposal Buttons
  const handleOpenProposalClientForm = (type) => {
    setClientData({ name: '', phone: '', email: '', cpf: '', guestTierId: '' });
    setProposalModalType(type);
  };

  // Submit Client Data Form and Generate Custom PDF
  const handleGenerateCustomPdf = (e) => {
    e.preventDefault();
    if (!clientData.name || !clientData.phone || !clientData.cpf) {
      alert('Por favor, informe seu Nome, WhatsApp e CPF para personalizar o PDF!');
      return;
    }

    const baseProposal = proposals[proposalModalType] || {};

    const tiers = baseProposal.pricingByGuests?.tiers || [];
    const selectedTier = tiers.find(tier => tier.id === clientData.guestTierId);
    if (tiers.length > 0 && !selectedTier) {
      alert('Selecione uma opção de convidados.');
      return;
    }

    // Combine base template with client details
    const customProposalForPdf = {
      ...baseProposal,
      clientName: clientData.name,
      clientPhone: clientData.phone,
      clientEmail: clientData.email,
      clientCpfCnpj: clientData.cpf,
      eventDate: 'A definir',
      guestCount: selectedTier?.range || '',
      price: selectedTier ? (selectedTier.price || 'Sob consulta') : baseProposal.price,
      pricingByGuests: {
        ...baseProposal.pricingByGuests,
        guestCount: selectedTier?.range || '',
        finalPrice: selectedTier ? (selectedTier.price || 'Sob consulta') : baseProposal.price,
        tiers: tiers.map(tier => ({ ...tier, selected: tier.id === selectedTier?.id }))
      }
    };

    setProposalModalType(null);
    onSelectProposalForPdf(customProposalForPdf);
    // Reset form for next use
    setClientData({ name: '', phone: '', email: '', cpf: '', guestTierId: '' });
  };

  const photoSources = { '01': eventPhoto01, '02': eventPhoto02, '03': eventPhoto03, '04': eventPhoto04, '05': eventPhoto05, '06': eventPhoto06, '07': eventPhoto07, '08': eventPhoto08, '09': eventPhoto09, '10': eventPhoto10, '11': eventPhoto11, '12': eventPhoto12, '13': eventPhoto13, '14': eventPhoto14, '15': eventPhoto15 };
  const carouselImages = siteContent.gallery.map(image => ({ ...image, url: photoSources[image.photo] || eventPhoto01 }));
  const brandLogo = siteContent.logoUrl || logo;

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner-clean"></div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-page)' }}>

      {/* Floating WhatsApp */}
      <a
        className="whatsapp-float"
        href={`https://wa.me/55${siteContent.whatsappPhone}`}
        target="_blank"
        rel="noopener noreferrer"
        title={`Falar com ${siteContent.brandName} no WhatsApp`}
      >
        <MessageCircle size={26} />
      </a>

      {/* Header Bar */}
      <header className="header-nav">
        <a href="#" className="brand-logo-container" title={siteContent.brandName}>
          <img src={brandLogo} alt={`Logo ${siteContent.brandName}`} className="brand-logo-img" />
          <div className="brand-name" style={{ fontSize: '18px' }}>{siteContent.brandName}</div>
        </a>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button className="btn-gold" onClick={() => setModalOpen(true)}>
            {siteContent.contactButton}
          </button>

          <Link to="/admin" className="admin-icon-btn" title="Área do Administrador">
            <Lock size={18} />
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <img src={brandLogo} alt={siteContent.brandName} className="profile-avatar" />

        <h1 className="hero-title">
          {siteContent.heroLead} <span className="gold-accent">{siteContent.heroAccent}</span>
        </h1>

        <p className="hero-subtitle">
          {siteContent.heroSubtitle}
        </p>

        {/* Stats Badges */}
        <div className="stats-badge-grid">
          {siteContent.stats.map((stat, index) => <div className="stat-item" key={index}>
            <div className="stat-num" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>{stat.value} {stat.star && <Star size={18} fill="var(--primary-gold)" color="var(--primary-gold)" />}</div>
            <div className="stat-label">{stat.label}</div>
          </div>)}
        </div>
      </section>

      {/* Marquee Strip */}
      <div className="marquee-strip">
        <div className="marquee-content">
          {Array.from({ length: 10 }).map((_, idx) => (
            <div className="marquee-item" key={idx}>
              <span>{siteContent.marqueeText}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Portfolio Gallery Swiper - BEFORE proposals */}
      <section className="section-container" style={{ marginTop: '50px' }}>
        <div className="section-header">
          <div className="section-tag">{siteContent.galleryTag}</div>
          <h2 className="section-title">
            {siteContent.galleryLead} <span className="navy-accent">{siteContent.galleryAccent}</span>
          </h2>
        </div>

        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={20}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 3500 }}
          style={{ paddingBottom: '45px' }}
        >
          {carouselImages.map((img, index) => (
            <SwiperSlide key={index}>
              <div className="swiper-luxury-card">
                <img src={img.url} alt={img.title} />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* Package Cards (Propostas) */}
      <section className="section-container">
        <div className="section-header">
          <div className="section-tag">{siteContent.packagesTag}</div>
          <h2 className="section-title">
            {siteContent.packagesLead} <span className="navy-accent">{siteContent.packagesAccent}</span>
          </h2>
        </div>

        <div className="packages-grid">

          {/* Completa */}
          {proposals.completa && (
            <div className="package-card featured">
              <div className="package-badge">{siteContent.completeBadge}</div>
              <div>
                <h3 className="package-title">{proposals.completa.title}</h3>
                <p className="package-desc">{proposals.completa.description}</p>

                <ul className="package-checklist">
                  {proposals.completa.items && proposals.completa.items.map((item, i) => (
                    <li key={i}>
                      <CheckCircle2 size={16} /> {item}
                    </li>
                  ))}
                </ul>
              </div>

              <button
                className="btn-gold"
                style={{ width: '100%', marginTop: '15px' }}
                onClick={() => handleOpenProposalClientForm('completa')}
              >
                <FileText size={16} /> {siteContent.completeButton}
              </button>
            </div>
          )}

          {/* Cerimonial */}
          {proposals.cerimonial && (
            <div className="package-card">
              <div>
                <h3 className="package-title">{proposals.cerimonial.title}</h3>
                <p className="package-desc">{proposals.cerimonial.description}</p>

                <ul className="package-checklist">
                  {proposals.cerimonial.items && proposals.cerimonial.items.map((item, i) => (
                    <li key={i}>
                      <CheckCircle2 size={16} /> {item}
                    </li>
                  ))}
                </ul>
              </div>

              <button
                className="btn-outline-gold"
                style={{ width: '100%', marginTop: '15px' }}
                onClick={() => handleOpenProposalClientForm('cerimonial')}
              >
                <FileText size={16} /> {siteContent.ceremonyButton}
              </button>
            </div>
          )}

        </div>
      </section>

      {/* Bottom Floating Bar */}
      <div className="bottom-callout-bar">
        <div className="callout-info">
          <img src={brandLogo} alt={`Logo ${siteContent.brandName}`} className="callout-avatar" />
          <div className="callout-text">
            <h4>{siteContent.calloutTitle}</h4>
            <p>{siteContent.calloutText}</p>
          </div>
        </div>
        <button className="btn-gold" onClick={() => setModalOpen(true)}>
          {siteContent.calloutButton}
        </button>
      </div>

      {/* MODAL 1: Client Data Form for PDF Generation */}
      {proposalModalType && (
        <div className="modal-overlay" onClick={() => setProposalModalType(null)}>
          <div className="modal-content-clean form-clean" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '460px' }}>
            <button className="modal-close-btn" onClick={() => setProposalModalType(null)}>
              <X size={18} />
            </button>

            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'var(--primary-gold-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px auto' }}>
                <FileCheck size={26} color="var(--primary-gold)" />
              </div>
              <h2 className="serif-title" style={{ fontSize: '22px', color: 'var(--secondary-navy)' }}>
                Gerar Sua Proposta Comercial em PDF
              </h2>
              <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginTop: '4px' }}>
                Informe seus dados para receber o documento completo personalizado com seu nome e CPF.
              </p>
            </div>

            <form onSubmit={handleGenerateCustomPdf}>
              <div>
                <label style={{ fontSize: '11.5px', fontWeight: 'bold', color: 'var(--secondary-navy)', marginBottom: '3px', display: 'block' }}>Seu Nome Completo *</label>
                <input
                  type="text"
                  placeholder="Ex: Maria Clara & João Pedro"
                  value={clientData.name}
                  onChange={(e) => setClientData(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '11.5px', fontWeight: 'bold', color: 'var(--secondary-navy)', marginBottom: '3px', display: 'block' }}>WhatsApp para Contato *</label>
                <input
                  type="text"
                  placeholder="(31) 98516-5246"
                  value={clientData.phone}
                  onChange={(e) => setClientData(prev => ({ ...prev, phone: maskPhone(e.target.value) }))}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '11.5px', fontWeight: 'bold', color: 'var(--secondary-navy)', marginBottom: '3px', display: 'block' }}>Seu E-mail (opcional)</label>
                <input
                  type="email"
                  placeholder="seuemail@exemplo.com"
                  value={clientData.email}
                  onChange={(e) => setClientData(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>

              <div>
                <label style={{ fontSize: '11.5px', fontWeight: 'bold', color: 'var(--secondary-navy)', marginBottom: '3px', display: 'block' }}>CPF do Solicitante *</label>
                <input
                  type="text"
                  placeholder="000.000.000-00"
                  value={clientData.cpf}
                  onChange={(e) => setClientData(prev => ({ ...prev, cpf: maskCPF(e.target.value) }))}
                  required
                />
              </div>

              {(proposals[proposalModalType]?.pricingByGuests?.tiers || []).length > 0 && (
                <div>
                  <label htmlFor="proposal-guest-tier" style={{ fontSize: '11.5px', fontWeight: 'bold', color: 'var(--secondary-navy)', marginBottom: '3px', display: 'block' }}>Opções de convidados *</label>
                  <select
                    id="proposal-guest-tier"
                    value={clientData.guestTierId}
                    onChange={(e) => setClientData(prev => ({ ...prev, guestTierId: e.target.value }))}
                    required
                  >
                    <option value="">Selecione uma opção</option>
                    {proposals[proposalModalType].pricingByGuests.tiers.map(tier => (
                      <option key={tier.id} value={tier.id}>{tier.range}</option>
                    ))}
                  </select>
                  {clientData.guestTierId && (
                    <p role="status" style={{ color: 'var(--secondary-navy)', fontWeight: 'bold', marginTop: '10px' }}>
                      Valor da proposta: {proposals[proposalModalType].pricingByGuests.tiers.find(tier => tier.id === clientData.guestTierId)?.price || 'Sob consulta'}
                    </p>
                  )}
                </div>
              )}

              <button type="submit" className="btn-gold" style={{ width: '100%', marginTop: '10px' }}>
                <Download size={16} /> Gerar PDF Personalizado
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: General Contact Form */}
      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal-content-clean" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setModalOpen(false)}>
              <X size={18} />
            </button>

            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <h2 className="serif-title" style={{ fontSize: '24px', color: 'var(--secondary-navy)' }}>
                Preencha o formulário
              </h2>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
                Entraremos em contato via WhatsApp.
              </p>
            </div>

            <form onSubmit={handleSendWhatsApp} className="form-clean">
              <input
                type="text"
                placeholder="Informe seu nome..."
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                required
              />

              <select
                value={eventType}
                onChange={(e) => setEventType(e.target.value)}
                required
              >
                <option value="nenhum">Selecione o tipo do evento</option>
                <option value="Casamento">Casamento</option>
                <option value="Festa de 15 Anos">Festa de 15 anos</option>
                <option value="Assessoria Completa">Assessoria Completa</option>
                <option value="Cerimonial do Dia">Cerimonial do Dia</option>
                <option value="Outros">Outros</option>
              </select>

              <input
                type="number"
                placeholder="Quantidade de convidados (opcional)..."
                value={guestCount}
                onChange={(e) => setGuestCount(e.target.value)}
              />

              <textarea
                rows="3"
                placeholder="Envie uma mensagem ou observação (opcional)..."
                value={formText}
                onChange={(e) => setFormText(e.target.value)}
              ></textarea>

              <button type="submit" className="btn-gold" style={{ width: '100%', marginTop: '6px' }}>
                Solicitar Orçamento <ChevronRight size={16} />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="footer-clean">
        <p style={{ marginBottom: '4px' }}>
          {siteContent.brandName} &copy; {new Date().getFullYear()} . {siteContent.footerText}
        </p>
        <p>
          Desenvolvido por{' '}
          <span onClick={() => window.open(siteContent.developerUrl, '_blank')}>
            {siteContent.developerName}
          </span>
        </p>
      </footer>

    </div>
  );
}
