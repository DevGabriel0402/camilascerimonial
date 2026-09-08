import React, { useRef, useState } from 'react';
import { Download, X, FileCheck } from 'lucide-react';
import html2pdf from 'html2pdf.js';
import logo from '../logo.png';

export default function ProposalPdfGenerator({ proposal, onClose }) {
  const docRef = useRef(null);
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState('');

  const handleDownloadPdf = async () => {
    const element = docRef.current;
    if (!element || downloading) return;
    setDownloading(true);
    setDownloadError('');

    const clientSlug = (proposal.clientName || proposal.title || 'proposta')
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '');

    const opt = {
      // A4 minus 15 mm on each side leaves a 180 x 267 mm content area.
      margin: [15, 15, 15, 15],
      filename: `Proposta_CamilasCerimonial_${clientSlug}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        logging: false,
        letterRendering: true,
        backgroundColor: '#ffffff',
        windowWidth: 1024,
        scrollX: 0,
        scrollY: 0,
      },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: {
        mode: ['css', 'legacy'],
        before: '.pdf-page-break-before',
        avoid: [
          '.pdf-keep-together',
          '.pdf-item-row',
          '.pdf-payment-card',
          '.pdf-tier-row',
          'tr',
          'li',
        ],
      },
    };

    try {
      await document.fonts.ready;
      await Promise.all(Array.from(element.querySelectorAll('img'), image => image.decode()));
      await html2pdf().set(opt).from(element).save();
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      setDownloadError('Não foi possível gerar o PDF. Tente novamente.');
    } finally {
      setDownloading(false);
    }
  };

  if (!proposal) return null;

  const guestTiers = proposal.pricingByGuests?.tiers || [];
  const enabledMethods = (proposal.paymentOptions?.methods || []).filter(m => m.enabled !== false);
  const today = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });

  return (
    <div
      style={{
        position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.7)',
        backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center',
        justifyContent: 'center', zIndex: 99999, padding: '12px',
      }}
    >
      <div style={{
        background: '#F8F7F4', border: '1px solid #ddd', borderRadius: '18px',
        width: '100%', maxWidth: '880px', maxHeight: '94vh',
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
        boxShadow: '0 30px 60px rgba(0,0,0,0.25)',
      }}>

        {/* ── Top Bar ── */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '14px 22px', background: '#1E3562',
          borderRadius: '18px 18px 0 0', flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FileCheck color="#C5A467" size={20} />
            <span style={{ color: '#fff', fontSize: '15px', fontWeight: '700', letterSpacing: '0.3px' }}>
              Proposta Comercial — Camila's Cerimonial
            </span>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={handleDownloadPdf}
              disabled={downloading}
              style={{
                background: '#C5A467', color: '#fff', border: 'none', borderRadius: '8px',
                padding: '8px 18px', fontSize: '13px', fontWeight: '700',
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px',
                letterSpacing: '0.3px',
              }}
            >
              <Download size={15} /> {downloading ? 'Gerando PDF...' : 'Baixar PDF'}
            </button>
            <button
              onClick={onClose}
              style={{
                background: 'rgba(255,255,255,0.12)', color: '#fff', border: 'none',
                borderRadius: '8px', width: '36px', height: '36px',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {downloadError && <p role="alert" style={{ padding: '0 22px', color: '#b91c1c' }}>{downloadError}</p>}
        {/* ── Scrollable Preview Area ── */}
        <div style={{ overflowY: 'auto', flex: 1, padding: '20px', background: '#CBD5E1' }}>

          {/* ══════════ PDF DOCUMENT ══════════ */}
          <div
            ref={docRef}
            style={{
              background: '#FFFFFF',
              width: '180mm',
              boxSizing: 'border-box',
              overflowWrap: 'anywhere',
              margin: '0 auto',
              fontFamily: "'Georgia', 'Times New Roman', serif",
              color: '#1a1a2e',
              fontSize: '12px',
              lineHeight: '1.65',
            }}
          >

            {/* ── COVER HEADER ── */}
            <div className="pdf-keep-together" style={{
              background: 'linear-gradient(135deg, #1E3562 0%, #0f1f3d 60%, #162d56 100%)',
              padding: '26px 20px 22px',
              position: 'relative',
              overflow: 'hidden',
            }}>
              {/* Decorative circles */}
              <div style={{
                position: 'absolute', top: '-40px', right: '-40px',
                width: '180px', height: '180px', borderRadius: '50%',
                background: 'rgba(197,164,103,0.08)', pointerEvents: 'none',
              }} />
              <div style={{
                position: 'absolute', bottom: '-30px', left: '30%',
                width: '120px', height: '120px', borderRadius: '50%',
                background: 'rgba(197,164,103,0.05)', pointerEvents: 'none',
              }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '10px' }}>
                    <img
                      src={logo}
                      alt="Logo"
                      style={{ width: '58px', height: '58px', objectFit: 'scale-down', borderRadius: '50%', border: '2px solid rgba(197,164,103,0.5)', background: 'rgba(250, 250, 250, 0.98)', padding: '4px' }}
                      crossOrigin="anonymous"
                    />
                    <div>
                      <h1 style={{ margin: 0, color: '#FFFFFF', fontSize: '24px', fontWeight: '700', letterSpacing: '0.5px', lineHeight: '1.1' }}>
                        Camila's Cerimonial
                      </h1>
                      <p style={{ margin: '3px 0 0 0', color: '#C5A467', fontSize: '10px', fontWeight: '600', letterSpacing: '2.5px', textTransform: 'uppercase' }}>
                        Assessoria &amp; Cerimonial de Eventos
                      </p>
                    </div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ margin: 0, color: 'rgba(255,255,255,0.5)', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '1px' }}>Emitido em</p>
                  <p style={{ margin: '2px 0 0 0', color: 'rgba(255,255,255,0.8)', fontSize: '11px', fontWeight: '600' }}>{today}</p>
                </div>
              </div>

              {/* Divider line */}
              <div style={{ borderTop: '1px solid rgba(197,164,103,0.3)', margin: '18px 0 16px 0' }} />

              <h2 style={{
                margin: 0, color: '#F3EBDD', fontSize: '18px',
                fontWeight: '700', letterSpacing: '0.5px', position: 'relative',
                textTransform: 'uppercase',
              }}>
                {proposal.title || 'Proposta Comercial'}
              </h2>
              <p style={{ margin: '4px 0 0 0', color: 'rgba(243,235,221,0.6)', fontSize: '10px', letterSpacing: '0.5px' }}>
                Documento gerado exclusivamente para o cliente abaixo
              </p>
            </div>

            {/* ── GOLD ACCENT BAR ── */}
            <div style={{ height: '4px', background: 'linear-gradient(90deg, #C5A467, #DFC08A, #C5A467)' }} />

            {/* ── BODY CONTENT ── */}
            <div style={{ padding: '24px 0' }}>

              {/* 1. DADOS DO CLIENTE */}
              {(proposal.clientName || proposal.clientCpfCnpj || proposal.clientPhone || proposal.eventDate) && (
                <div className="pdf-section" style={{ marginBottom: '28px' }}>
                  <SectionTitle icon="👤" title="Dados do Cliente" />
                  <div style={{
                    display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
                    gap: '10px', marginTop: '12px',
                  }}>
                    {proposal.clientName && <InfoRow label="Cliente / Noivos" value={proposal.clientName} />}
                    {proposal.clientCpfCnpj && <InfoRow label="CPF" value={proposal.clientCpfCnpj} />}
                    {proposal.clientPhone && <InfoRow label="WhatsApp" value={proposal.clientPhone} />}
                    {proposal.clientEmail && <InfoRow label="E-mail" value={proposal.clientEmail} />}
                    {proposal.eventDate && <InfoRow label="Data do Evento" value={proposal.eventDate} />}
                    {proposal.eventType && <InfoRow label="Tipo de Evento" value={proposal.eventType} />}
                    {proposal.guestCount && <InfoRow label="Estimativa de Convidados" value={proposal.guestCount} />}
                  </div>
                </div>
              )}

              <Divider />

              {/* 2. SOBRE NÓS */}
              {proposal.aboutUs && (
                <div className="pdf-section" style={{ marginBottom: '28px' }}>
                  <SectionTitle icon="✨" title="Sobre Camila's Cerimonial" />
                  <div style={{
                    marginTop: '12px', background: '#F9F6F0',
                    border: '1px solid #E8DCC8', borderLeft: '4px solid #C5A467',
                    borderRadius: '0 8px 8px 0', padding: '14px 18px',
                  }}>
                    <p style={{ margin: 0, color: '#334155', fontSize: '12px', lineHeight: '1.75', fontStyle: 'italic' }}>
                      "{proposal.aboutUs}"
                    </p>
                  </div>
                </div>
              )}

              <Divider />

              {/* 3. SERVIÇOS INCLUSOS */}
              {proposal.categorizedItems && proposal.categorizedItems.length > 0 && (
                <div className="pdf-section" style={{ marginBottom: '28px' }}>
                  <SectionTitle icon="📋" title="Serviços &amp; Itens Inclusos" />
                  <div style={{ marginTop: '14px' }}>
                    {proposal.categorizedItems.map((catGroup) => {
                      const activeSubitems = (catGroup.subitems || []).filter(s => s.selected !== false);
                      if (activeSubitems.length === 0) return null;
                      return (
                        <div
                          key={catGroup.id}
                          className="pdf-keep-together"
                          style={{ pageBreakInside: 'avoid', marginBottom: '18px' }}
                        >
                          <div style={{
                            background: '#1E3562', color: '#F3EBDD',
                            padding: '7px 14px', borderRadius: '6px',
                            fontSize: '11px', fontWeight: '700',
                            letterSpacing: '0.5px', textTransform: 'uppercase',
                            marginBottom: '8px',
                          }}>
                            {catGroup.category}
                          </div>
                          <div style={{ paddingLeft: '4px' }}>
                            {activeSubitems.map((sub, idx) => (
                              <div
                                key={sub.id}
                                className="pdf-item-row"
                                style={{
                                  pageBreakInside: 'avoid',
                                  display: 'flex', alignItems: 'flex-start', gap: '10px',
                                  padding: '7px 10px',
                                  background: idx % 2 === 0 ? '#FAFAFA' : '#FFFFFF',
                                  borderBottom: '1px solid #F1F5F9',
                                  fontSize: '12px',
                                }}
                              >
                                <span style={{ color: '#C5A467', fontWeight: '900', fontSize: '14px', lineHeight: '1.2', flexShrink: 0 }}>✓</span>
                                <span style={{ color: '#1e293b', lineHeight: '1.5' }}>{sub.name}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <Divider />

              {/* 4. INVESTIMENTO */}
              <div className="pdf-section" style={{ marginBottom: '28px' }}>
                <SectionTitle icon="💰" title="Investimento" />
                <div style={{ marginTop: '14px' }}>
                  {guestTiers.length > 0 ? (
                    <div style={{ border: '1px solid #CBD5E1', borderRadius: '8px', overflow: 'hidden' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                        <thead>
                          <tr style={{ background: '#1E3562' }}>
                            <th style={{ padding: '10px 16px', textAlign: 'left', color: '#F3EBDD', fontWeight: '700', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                              Faixa de Convidados
                            </th>
                            <th style={{ padding: '10px 16px', textAlign: 'right', color: '#C5A467', fontWeight: '700', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                              Investimento
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {guestTiers.map((tier, idx) => (
                            <tr
                              key={tier.id || idx}
                              className="pdf-tier-row"
                              style={{
                                pageBreakInside: 'avoid',
                                background: tier.selected ? '#F9F6F0' : idx % 2 === 0 ? '#fff' : '#F8FAFC',
                              }}
                            >
                              <td style={{ padding: '9px 16px', borderBottom: '1px solid #F1F5F9', color: '#334155' }}>
                                {tier.range}
                                {tier.selected && (
                                  <span style={{ marginLeft: '8px', fontSize: '9px', color: '#C5A467', fontWeight: '700', textTransform: 'uppercase', background: '#F9F2E7', padding: '2px 6px', borderRadius: '4px', border: '1px solid #C5A467' }}>
                                    ★ Selecionado
                                  </span>
                                )}
                              </td>
                              <td style={{ padding: '9px 16px', borderBottom: '1px solid #F1F5F9', textAlign: 'right', color: '#1E3562', fontWeight: '700' }}>
                                {tier.price}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div style={{
                      background: 'linear-gradient(135deg, #1E3562 0%, #0f1f3d 100%)',
                      borderRadius: '10px', padding: '20px 24px',
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      borderLeft: '5px solid #C5A467',
                    }}>
                      <div>
                        <p style={{ margin: 0, color: '#C5A467', fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.5px' }}>
                          Valor do Investimento
                        </p>
                        <p style={{ margin: '4px 0 0 0', color: 'rgba(243,235,221,0.7)', fontSize: '11px' }}>
                          {proposal.guestCount || 'Quantidade de convidados a definir'}
                        </p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ color: '#DFC08A', fontSize: '26px', fontWeight: '700', lineHeight: '1' }}>
                          {proposal.price || 'Sob Consulta'}
                        </div>
                        <p style={{ margin: '4px 0 0 0', color: 'rgba(255,255,255,0.4)', fontSize: '9px' }}>
                          Sujeito a confirmação
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <Divider />

              {/* 5. FORMAS DE PAGAMENTO */}
              {enabledMethods.length > 0 && (
                <div className="pdf-section" style={{ marginBottom: '28px' }}>
                  <SectionTitle icon="💳" title="Formas de Pagamento" />
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: `repeat(${Math.min(enabledMethods.length, 3)}, minmax(0, 1fr))`,
                    gap: '10px', marginTop: '14px',
                  }}>
                    {enabledMethods.map((method) => (
                      <div
                        key={method.id}
                        className="pdf-payment-card"
                        style={{
                          pageBreakInside: 'avoid',
                          background: '#F9F6F0', border: '1px solid #E8DCC8',
                          borderRadius: '8px', padding: '12px 14px',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '5px' }}>
                          <span style={{ fontSize: '16px' }}>
                            {method.type === 'pix' ? '📱' : method.type === 'card' ? '💳' : '🏦'}
                          </span>
                          <span style={{ fontWeight: '700', fontSize: '11px', color: '#1E3562' }}>
                            {method.label}
                          </span>
                        </div>
                        <p style={{ margin: 0, fontSize: '10.5px', color: '#475569', lineHeight: '1.5' }}>
                          {method.details}
                        </p>
                      </div>
                    ))}
                  </div>

                  {(proposal.paymentOptions?.terms || proposal.paymentTerms) && (
                    <div style={{
                      marginTop: '12px', background: '#EEF2FF',
                      border: '1px solid #C7D2FE', borderRadius: '8px', padding: '10px 14px',
                    }}>
                      <p style={{ margin: 0, fontSize: '11px', color: '#3730a3' }}>
                        <strong>📌 Condições Gerais:</strong>{' '}
                        {proposal.paymentOptions?.terms || proposal.paymentTerms}
                      </p>
                    </div>
                  )}
                </div>
              )}

              <Divider />

              {/* 6. SAUDAÇÃO FINAL */}
              <div className="pdf-section" style={{ marginBottom: '32px' }}>
                {proposal.finalGreeting?.message && (
                  <div style={{
                    background: '#F9F6F0', border: '1px solid #E8DCC8',
                    borderRadius: '10px', padding: '18px 22px', textAlign: 'center',
                    marginBottom: '20px',
                  }}>
                    <p style={{ margin: 0, color: '#5C4A2A', fontSize: '13px', fontStyle: 'italic', lineHeight: '1.7' }}>
                      ❝ {proposal.finalGreeting.message} ❞
                    </p>
                  </div>
                )}

                {/* Assinaturas */}
                <div className="pdf-keep-together" style={{
                  display: 'grid', gridTemplateColumns: '1fr 1fr',
                  gap: '30px', marginTop: '24px', paddingTop: '16px',
                  borderTop: '1px dashed #CBD5E1',
                }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ borderBottom: '1.5px solid #94A3B8', marginBottom: '6px', height: '40px' }} />
                    <p style={{ margin: 0, fontWeight: '700', color: '#1E3562', fontSize: '11px' }}>
                      Camila's Cerimonial
                    </p>
                    <p style={{ margin: '2px 0 0 0', fontSize: '9.5px', color: '#64748B' }}>
                      Assinatura / Responsável
                    </p>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ borderBottom: '1.5px solid #94A3B8', marginBottom: '6px', height: '40px' }} />
                    <p style={{ margin: 0, fontWeight: '700', color: '#1E3562', fontSize: '11px' }}>
                      {proposal.clientName || 'Cliente'}
                    </p>
                    <p style={{ margin: '2px 0 0 0', fontSize: '9.5px', color: '#64748B' }}>
                      Assinatura / Contratante
                    </p>
                  </div>
                </div>
              </div>

            </div>

            {/* ── FOOTER ── */}
            <div className="pdf-keep-together" style={{
              background: '#1E3562',
              padding: '16px 20px',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              flexWrap: 'wrap', gap: '8px',
            }}>
              <div>
                <p style={{ margin: 0, color: '#C5A467', fontWeight: '700', fontSize: '11px', letterSpacing: '0.5px' }}>
                  Camila's Cerimonial &amp; Assessoria
                </p>
                <p style={{ margin: '2px 0 0 0', color: 'rgba(255,255,255,0.55)', fontSize: '9.5px' }}>
                  (31) 98516-5246  ·  @camilascerimonial
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ margin: 0, color: '#C5A467', fontWeight: '700', fontSize: '10px' }}>
                  {proposal.finalGreeting?.validity || 'Proposta válida por 15 dias.'}
                </p>
                <p style={{ margin: '2px 0 0 0', color: 'rgba(255,255,255,0.4)', fontSize: '9px' }}>
                  Documento gerado eletronicamente
                </p>
              </div>
            </div>

          </div>
          {/* ══════════ FIM DO DOCUMENTO ══════════ */}
        </div>
      </div>
    </div>
  );
}

/* ── Subcomponentes auxiliares de layout ── */
function SectionTitle({ icon, title }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
      <span style={{ fontSize: '15px' }}>{icon}</span>
      <h3 style={{
        margin: 0, color: '#1E3562', fontSize: '14px', fontWeight: '700',
        letterSpacing: '0.3px', borderBottom: '2px solid #C5A467',
        paddingBottom: '4px', flex: 1,
      }}>
        {title}
      </h3>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="pdf-keep-together" style={{
      background: '#F9F6F0', border: '1px solid #E8DCC8',
      borderRadius: '6px', padding: '8px 12px',
    }}>
      <p style={{ margin: 0, fontSize: '9.5px', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.8px', fontWeight: '600' }}>
        {label}
      </p>
      <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#1E3562', fontWeight: '700' }}>
        {value}
      </p>
    </div>
  );
}

function Divider() {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '10px',
      margin: '0 0 26px 0',
    }}>
      <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, transparent, #E8DCC8)' }} />
      <span style={{ color: '#C5A467', fontSize: '14px' }}>✦</span>
      <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, #E8DCC8, transparent)' }} />
    </div>
  );
}
