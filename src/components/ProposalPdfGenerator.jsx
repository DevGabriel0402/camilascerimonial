import React from 'react';
import { Download, X } from 'lucide-react';
import html2pdf from 'html2pdf.js';

export default function ProposalPdfGenerator({ proposal, onClose }) {
  const handleDownloadPdf = () => {
    const element = document.getElementById('pdf-proposal-content');
    const opt = {
      margin: 10,
      filename: `Proposta_${proposal.title.replace(/\s+/g, '_')}_CamilasCerimonial.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save();
  };

  if (!proposal) return null;

  return (
    <div className="modal" style={{ display: 'flex', overflowY: 'auto', padding: '20px' }}>
      <div style={{ background: '#fff', borderRadius: '12px', width: '100%', maxWidth: '850px', position: 'relative', margin: 'auto' }}>
        
        {/* Top Control Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 25px', borderBottom: '1px solid #e2e8f0', background: '#f8fafc', borderTopLeftRadius: '12px', borderTopRightRadius: '12px' }}>
          <h3 style={{ color: 'var(--secundary-color)', margin: 0 }}>Visualização & Gerador de PDF</h3>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="btn-success" onClick={handleDownloadPdf}>
              <Download size={18} /> Baixar PDF
            </button>
            <button className="btn-secondary" onClick={onClose}>
              <X size={18} /> Fechar
            </button>
          </div>
        </div>

        {/* PDF Document Container */}
        <div id="pdf-proposal-content" className="pdf-template">
          {/* Header */}
          <div className="pdf-header">
            <div>
              <h1 style={{ margin: 0, color: 'var(--secundary-color)', fontSize: '24px' }}>Camila's Cerimonial</h1>
              <p style={{ color: 'var(--primary-dark)', margin: '4px 0 0 0', fontWeight: 'bold' }}>
                Assessoria e Cerimonial de Eventos
              </p>
            </div>
            <img src="/src/logo.png" alt="Logo" style={{ width: '70px', height: '70px', objectFit: 'contain' }} />
          </div>

          {/* Title */}
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <h2 style={{ color: 'var(--secundary-color)', fontSize: '20px', textTransform: 'uppercase', letterSpacing: '1px' }}>
              {proposal.title || 'Proposta Comercial'}
            </h2>
            <p style={{ color: '#64748b', fontSize: '14px', marginTop: '4px' }}>
              Transformando sonhos em momentos inesquecíveis
            </p>
          </div>

          {/* Client Info Grid if provided */}
          {(proposal.clientName || proposal.eventDate) && (
            <div style={{ background: '#f8fafc', padding: '15px', borderRadius: '8px', marginBottom: '25px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {proposal.clientName && <div><strong>Cliente:</strong> {proposal.clientName}</div>}
              {proposal.eventDate && <div><strong>Data do Evento:</strong> {proposal.eventDate}</div>}
              {proposal.eventType && <div><strong>Tipo de Evento:</strong> {proposal.eventType}</div>}
              {proposal.guestCount && <div><strong>Convidados:</strong> {proposal.guestCount} pessoas</div>}
            </div>
          )}

          {/* Description */}
          <div className="pdf-section">
            <h3>Descrição do Serviço</h3>
            <p style={{ lineHeight: '1.6', color: '#334155', whiteSpace: 'pre-line' }}>
              {proposal.description}
            </p>
          </div>

          {/* Included Services List */}
          {proposal.items && proposal.items.length > 0 && (
            <div className="pdf-section">
              <h3>O que está incluso neste pacote:</h3>
              <ul className="pdf-items-list">
                {proposal.items.map((item, idx) => (
                  <li key={idx}>
                    <span style={{ color: 'var(--primary-dark)', fontWeight: 'bold' }}>✓</span> {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Pricing & Investment */}
          <div className="pdf-section" style={{ background: '#fafafa', padding: '20px', borderRadius: '8px', borderLeft: '4px solid var(--primary-color)' }}>
            <h3 style={{ border: 'none', padding: 0, margin: '0 0 10px 0' }}>Investimento & Condições</h3>
            <p style={{ fontSize: '22px', fontWeight: 'bold', color: 'var(--secundary-color)', margin: '5px 0' }}>
              {proposal.price || 'Sob Consulta'}
            </p>
            {proposal.paymentTerms && (
              <p style={{ fontSize: '13px', color: '#475569', marginTop: '6px', whiteSpace: 'pre-line' }}>
                <strong>Formas de Pagamento:</strong> {proposal.paymentTerms}
              </p>
            )}
          </div>

          {/* Footer & Signature */}
          <div style={{ marginTop: '50px', paddingTop: '20px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', fontSize: '12px', color: '#64748b' }}>
            <div>
              <p><strong>Camila's Cerimonial</strong></p>
              <p>WhatsApp: (31) 98516-5246</p>
              <p>Instagram: @camilascerimonial</p>
            </div>
            <div style={{ textAlign: 'center', width: '200px' }}>
              <div style={{ borderBottom: '1px solid #94a3b8', marginBottom: '5px', height: '40px' }}></div>
              <p>Camila's Cerimonial</p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
