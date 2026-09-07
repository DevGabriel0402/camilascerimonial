import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { Download, MessageCircle, Lock, FileText, X } from 'lucide-react';
import html2pdf from 'html2pdf.js';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function LandingPage({ proposals, onSelectProposalForPdf }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formName, setFormName] = useState('');
  const [eventType, setEventType] = useState('nenhum');
  const [formText, setFormText] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  const handleSendWhatsApp = (e) => {
    e.preventDefault();
    if (!formName || eventType === 'nenhum') {
      alert('Verifique se foi informado seu nome e o tipo do evento!');
      return;
    }

    const mensagem = `Olá Camila's Cerimonial tudo bem? Meu nome é ${formName} e estou entrando em contato para fazer um orçamento, segue as informações:\n\n*Tipo de Evento:* ${eventType}\n*Observação:* ${formText}\n\nAguardando sua resposta.`;
    const uri = encodeURIComponent(mensagem);
    const contato = '31985165246';
    const url = `https://wa.me/55${contato}?text=${uri}`;
    window.open(url, '_blank');
  };

  const carouselImages = [
    '/images/12.webp',
    '/images/10.webp',
    '/images/15.webp',
    '/images/13.webp',
    '/images/05.webp',
    '/images/06.webp',
    '/images/07.webp',
    '/images/08.webp',
    '/images/09.webp',
    '/images/02.webp',
    '/images/11.webp',
    '/images/01.webp',
    '/images/04.webp',
    '/images/14.webp',
    '/images/03.webp',
  ];

  if (loading) {
    return (
      <div className="loading">
        <div className="bar-loading"></div>
      </div>
    );
  }

  return (
    <div id="body">
      {/* Floating WhatsApp */}
      <a
        className="whatsapp"
        href="https://wa.me/5531985165246"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img src="/src/whatsApp-icon.svg" alt="WhatsApp" />
      </a>

      {/* Modal Formulário */}
      {modalOpen && (
        <div className="modal" id="modal">
          <form id="formulario" onSubmit={handleSendWhatsApp}>
            <div id="btn-fechar" onClick={() => setModalOpen(false)}>
              &times;
            </div>
            <h2>Preencha o formulário</h2>
            <input
              type="text"
              placeholder="Informe seu nome..."
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              required
            />
            <div className="container-select">
              <select
                value={eventType}
                onChange={(e) => setEventType(e.target.value)}
                required
              >
                <option value="nenhum">Selecione o tipo do evento</option>
                <option value="Festa">Festa</option>
                <option value="Festa de 15 anos">Festa de 15 anos</option>
                <option value="Casamento">Casamento</option>
                <option value="Assessoria">Assessoria</option>
                <option value="Assessoria e Casamento completo">
                  Assessoria e casamento completo
                </option>
                <option value="Outros">Outros</option>
              </select>
            </div>
            <textarea
              rows="5"
              placeholder="Envie uma mensagem (opcional)..."
              value={formText}
              onChange={(e) => setFormText(e.target.value)}
            ></textarea>
            <button type="submit">Solicitar Orçamento</button>
          </form>
        </div>
      )}

      {/* Card Contrate Já */}
      <div className="card-contrate" id="card-contrate">
        <div className="right">
          <img src="/src/logo.png" alt="Logo" />
          <p>
            Faça seu Orçamento!
            <span>E nos permita transformar seus sonhos em realidade!</span>
          </p>
        </div>
        <button id="btn-contato" onClick={() => setModalOpen(true)}>
          Conversar
        </button>
      </div>

      {/* Container Principal */}
      <div className="container" id="container">
        {/* Perfil */}
        <div className="perfil">
          <img src="/src/logo.png" alt="Foto de Perfil" />
          <div className="perfil-info">
            <h1 className="name-title">Camila's Cerimonial</h1>
            <p className="description">Juntos transformando sonhos em realidade.</p>
          </div>
        </div>

        {/* Faixa Marquee */}
        <div className="faixa">
          <div className="faixa-content">
            {Array.from({ length: 15 }).map((_, i) => (
              <p key={i}>Cerimonial e Assessoria ● &nbsp;</p>
            ))}
          </div>
        </div>

        {/* Card Titulo Carrossel */}
        <div className="card-container">
          <div className="card">Veja alguns sonhos que já realizamos!</div>
        </div>

        {/* Carrossel */}
        <div className="swiper-wrapper-container">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={15}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            navigation
            pagination={{ clickable: true }}
            autoplay={{ delay: 3500 }}
            className="mySwiper"
          >
            {carouselImages.map((imgSrc, index) => (
              <SwiperSlide key={index}>
                <img src={imgSrc} alt={`Sonho Realizado ${index + 1}`} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Proposta Section */}
        <div className="proposta" id="proposta">
          <h1>Baixe agora nossas propostas!</h1>
          <div className="buttons">
            <button
              className="btn"
              onClick={() => onSelectProposalForPdf('completa')}
            >
              <FileText size={18} />
              Proposta Completa
              <Download size={16} />
            </button>

            <button
              className="btn"
              onClick={() => onSelectProposalForPdf('cerimonial')}
            >
              <FileText size={18} />
              Proposta Cerimonial
              <Download size={16} />
            </button>

            <Link to="/admin" className="btn admin-link-btn">
              <Lock size={16} /> Painel Admin
            </Link>
          </div>
        </div>

        {/* Faixa 2 Marquee */}
        <div className="faixa faixa2">
          <div className="faixa-content">
            {Array.from({ length: 15 }).map((_, i) => (
              <p key={i}>proposta ● &nbsp;</p>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer id="footer">
        Camila's Cerimonial &copy; {new Date().getFullYear()} . Todos os direitos reservados.
        <p>
          Desenvolvido por{' '}
          <span
            onClick={() =>
              window.open('https://www.instagram.com/eu.gabrielvieira/', '_blank')
            }
          >
            Gabriel.
          </span>
        </p>
      </footer>
    </div>
  );
}
