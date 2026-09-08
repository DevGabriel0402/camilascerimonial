import React, { useState, useEffect } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { defaultProposals } from '../App';
import { maskCurrency } from '../utils/masks';
import {
  Save, Plus, Trash2, Eye, CheckCircle2,
  ChevronDown, ChevronUp, UserCheck, HeartHandshake, CheckSquare, Square, Users,
  CreditCard, QrCode, Landmark, MessageSquare
} from 'lucide-react';
import ProposalPdfGenerator from './ProposalPdfGenerator';
import AdminLayout from './admin/AdminLayout';
import LandingPageEditor from './admin/LandingPageEditor';
import { defaultSiteContent } from '../siteContent';

export default function AdminDashboard({ proposals, setProposals, siteContent = defaultSiteContent, setSiteContent = () => {}, onLogout }) {
  const [activeTab, setActiveTab] = useState('completa');
  const [currentProposal, setCurrentProposal] = useState(proposals.completa || defaultProposals.completa);
  const [pdfPreviewProposal, setPdfPreviewProposal] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');

  // Accordions Open/Close state
  const [openAccordions, setOpenAccordions] = useState({
    dados: true,
    sobre: false,
    itens: false,
    orcamento: true,
    pagamento: false,
    saudacao: false
  });

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    if (activeTab === 'completa') {
      setCurrentProposal(proposals.completa || defaultProposals.completa);
    } else if (activeTab === 'cerimonial') {
      setCurrentProposal(proposals.cerimonial || defaultProposals.cerimonial);
    } else if (activeTab === 'nova') {
      setCurrentProposal({
        ...defaultProposals.completa,
        id: 'custom_' + Date.now(),
        title: 'Proposta Comercial Personalizada',
        clientName: 'Cliente VIP',
        clientCpfCnpj: '',
        clientPhone: '',
        eventDate: '',
        eventType: 'Casamento'
      });
    }
  }, [activeTab, proposals]);

  const toggleAccordion = (key) => {
    setOpenAccordions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleInputChange = (field, value) => {
    setCurrentProposal(prev => ({ ...prev, [field]: value }));
  };

  const handleNestedInputChange = (parent, field, value) => {
    setCurrentProposal(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value
      }
    }));
  };

  // --- Guest Price Tiers ---
  const handleAddGuestTier = () => {
    const currentTiers = currentProposal.pricingByGuests?.tiers || [];
    const newTier = {
      id: 'tier_' + Date.now(),
      range: 'Até 150 convidados',
      price: 'R$ 3.000,00',
      selected: false
    };

    setCurrentProposal(prev => ({
      ...prev,
      pricingByGuests: {
        ...prev.pricingByGuests,
        tiers: [...currentTiers, newTier]
      }
    }));
  };

  const handleRemoveGuestTier = (tierId) => {
    const currentTiers = currentProposal.pricingByGuests?.tiers || [];
    const updated = currentTiers.filter(t => t.id !== tierId);

    setCurrentProposal(prev => ({
      ...prev,
      pricingByGuests: {
        ...prev.pricingByGuests,
        tiers: updated
      }
    }));
  };

  const handleTierChange = (tierId, field, rawValue) => {
    let value = rawValue;
    if (field === 'price') {
      value = maskCurrency(rawValue);
    }

    const currentTiers = currentProposal.pricingByGuests?.tiers || [];
    const updated = currentTiers.map(t => {
      if (t.id === tierId) {
        const updatedTier = { ...t, [field]: value };
        if (field === 'price' && t.selected) {
          handleInputChange('price', value);
          handleNestedInputChange('pricingByGuests', 'finalPrice', value);
        }
        return updatedTier;
      }
      return t;
    });

    setCurrentProposal(prev => ({
      ...prev,
      pricingByGuests: {
        ...prev.pricingByGuests,
        tiers: updated
      }
    }));
  };

  const handleSelectGuestTier = (tierId) => {
    const currentTiers = currentProposal.pricingByGuests?.tiers || [];
    let selectedPrice = currentProposal.price;

    const updated = currentTiers.map(t => {
      if (t.id === tierId) {
        selectedPrice = t.price;
        return { ...t, selected: true };
      }
      return { ...t, selected: false };
    });

    handleInputChange('price', selectedPrice);

    setCurrentProposal(prev => ({
      ...prev,
      price: selectedPrice,
      pricingByGuests: {
        ...prev.pricingByGuests,
        finalPrice: selectedPrice,
        tiers: updated
      }
    }));
  };

  // --- Category & Subitems ---
  const handleToggleSubitem = (catId, subId) => {
    const updatedCategories = currentProposal.categorizedItems.map(cat => {
      if (cat.id === catId) {
        return {
          ...cat,
          subitems: cat.subitems.map(sub => {
            if (sub.id === subId) {
              return { ...sub, selected: !sub.selected };
            }
            return sub;
          })
        };
      }
      return cat;
    });

    setCurrentProposal(prev => ({ ...prev, categorizedItems: updatedCategories }));
  };

  const handleSubitemTextChange = (catId, subId, newText) => {
    const updatedCategories = currentProposal.categorizedItems.map(cat => {
      if (cat.id === catId) {
        return {
          ...cat,
          subitems: cat.subitems.map(sub => {
            if (sub.id === subId) {
              return { ...sub, name: newText };
            }
            return sub;
          })
        };
      }
      return cat;
    });

    setCurrentProposal(prev => ({ ...prev, categorizedItems: updatedCategories }));
  };

  const handleAddSubitem = (catId) => {
    const updatedCategories = currentProposal.categorizedItems.map(cat => {
      if (cat.id === catId) {
        return {
          ...cat,
          subitems: [
            ...cat.subitems,
            { id: 'sub_' + Date.now(), name: 'Novo serviço incluso', selected: true }
          ]
        };
      }
      return cat;
    });

    setCurrentProposal(prev => ({ ...prev, categorizedItems: updatedCategories }));
  };

  const handleRemoveSubitem = (catId, subId) => {
    const updatedCategories = currentProposal.categorizedItems.map(cat => {
      if (cat.id === catId) {
        return {
          ...cat,
          subitems: cat.subitems.filter(sub => sub.id !== subId)
        };
      }
      return cat;
    });

    setCurrentProposal(prev => ({ ...prev, categorizedItems: updatedCategories }));
  };

  const handleAddCategory = () => {
    const newCat = {
      id: 'cat_' + Date.now(),
      category: 'Nova Categoria de Serviços',
      subitems: [
        { id: 'sub_' + Date.now(), name: 'Item inicial', selected: true }
      ]
    };
    setCurrentProposal(prev => ({
      ...prev,
      categorizedItems: [...(prev.categorizedItems || []), newCat]
    }));
  };

  const handleRemoveCategory = (catId) => {
    setCurrentProposal(prev => ({
      ...prev,
      categorizedItems: prev.categorizedItems.filter(c => c.id !== catId)
    }));
  };

  const handleCategoryTitleChange = (catId, newTitle) => {
    const updated = currentProposal.categorizedItems.map(c => {
      if (c.id === catId) return { ...c, category: newTitle };
      return c;
    });
    setCurrentProposal(prev => ({ ...prev, categorizedItems: updated }));
  };

  // --- Payment Options ---
  const handleTogglePaymentMethod = (methodId) => {
    if (!currentProposal.paymentOptions || !currentProposal.paymentOptions.methods) return;
    const updatedMethods = currentProposal.paymentOptions.methods.map(m => {
      if (m.id === methodId) return { ...m, enabled: !m.enabled };
      return m;
    });
    setCurrentProposal(prev => ({
      ...prev,
      paymentOptions: { ...prev.paymentOptions, methods: updatedMethods }
    }));
  };

  const handlePaymentMethodDetailsChange = (methodId, newDetails) => {
    const updatedMethods = currentProposal.paymentOptions.methods.map(m => {
      if (m.id === methodId) return { ...m, details: newDetails };
      return m;
    });
    setCurrentProposal(prev => ({
      ...prev,
      paymentOptions: { ...prev.paymentOptions, methods: updatedMethods }
    }));
  };

  // --- Save Proposal (Local + Firebase Sync) ---
  const handleSaveProposal = async (e) => {
    e.preventDefault();

    // 1. Salva localmente primeiro (Resposta instantânea sem travamentos)
    const updatedProposals = {
      ...proposals,
      [activeTab]: currentProposal
    };

    setProposals(updatedProposals);
    localStorage.setItem('camilas_proposals_v3', JSON.stringify(updatedProposals));
    setSuccessMsg('Proposta salva e atualizada com sucesso!');

    // 2. Tenta sincronizar no Firebase Firestore em segundo plano
    try {
      await setDoc(doc(db, "proposals", activeTab), currentProposal);
      setSuccessMsg('Proposta salva e sincronizada no Firebase Firestore!');
    } catch (err) {
      console.log('Sincronização em segundo plano:', err.message);
    }

    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    if (!newPassword) return;
    if (newPassword !== confirmPassword) {
      alert('As senhas não coincidem!');
      return;
    }
    localStorage.setItem('adminPassword', newPassword);
    setSuccessMsg('Senha alterada com sucesso!');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleSiteContentChange = async (updatedContent, save = false) => {
    setSiteContent(updatedContent);
    localStorage.setItem('camilas_site_content_v1', JSON.stringify(updatedContent));
    if (!save) return;
    setSuccessMsg('Página pública salva com sucesso!');
    try {
      await setDoc(doc(db, 'settings', 'landingPage'), updatedContent);
      setSuccessMsg('Página pública salva e sincronizada!');
    } catch (err) {
      console.log('Sincronização da landing page:', err.message);
    }
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  return (
    <AdminLayout activeTab={activeTab} onNavigate={setActiveTab} onLogout={onLogout} onPreview={() => setPdfPreviewProposal(currentProposal)}>

      {/* PDF Modal Viewer */}
      {pdfPreviewProposal && (
        <ProposalPdfGenerator
          proposal={pdfPreviewProposal}
          onClose={() => setPdfPreviewProposal(null)}
        />
      )}

      <div>
        {activeTab !== 'senha' && activeTab !== 'landing' && <>
          <div className="workspace-summary">
            <div className="workspace-summary-card"><div className="workspace-summary-icon"><CheckSquare size={19} /></div><div><span>Serviços inclusos</span><strong>{(currentProposal.categorizedItems || []).reduce((count, category) => count + (category.subitems || []).filter(item => item.selected !== false).length, 0)}</strong></div></div>
            <div className="workspace-summary-card"><div className="workspace-summary-icon"><Users size={19} /></div><div><span>Faixas de convidados</span><strong>{currentProposal.pricingByGuests?.tiers?.length || 0}</strong></div></div>
            <div className="workspace-summary-card"><div className="workspace-summary-icon"><CreditCard size={19} /></div><div><span>Formas de pagamento</span><strong>{(currentProposal.paymentOptions?.methods || []).filter(method => method.enabled !== false).length}</strong></div></div>
          </div>
          <div className="workspace-editor-label"><h2>Conteúdo da proposta</h2><p>Edite as seções e salve suas alterações.</p></div>
        </>}

        {/* Success Alert */}
        {successMsg && (
          <div style={{ background: '#dcfce7', border: '1px solid #86efac', color: '#15803d', padding: '12px 18px', borderRadius: '10px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: '600', fontSize: '14px' }}>
            <CheckCircle2 size={18} /> {successMsg}
          </div>
        )}

        {activeTab === 'landing' && (
          <LandingPageEditor content={siteContent} onChange={handleSiteContentChange} />
        )}

        {/* ACCORDIONS FORM */}
        {activeTab !== 'senha' && activeTab !== 'landing' && currentProposal && (
          <form id="admin-proposal-form" onSubmit={handleSaveProposal} className="form-clean">

            {/* ACCORDION 1: Dados Principais */}
            <div style={{ background: 'var(--bg-page)', border: '1px solid var(--border-color)', borderRadius: '14px', marginBottom: '15px', overflow: 'hidden' }}>
              <div
                onClick={() => toggleAccordion('dados')}
                role="button" tabIndex={0} aria-expanded={openAccordions.dados}
                onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); toggleAccordion('dados'); } }}
                style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', background: '#ffffff', borderBottom: openAccordions.dados ? '1px solid var(--border-color)' : 'none' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <UserCheck size={20} color="var(--primary-gold)" />
                  <h3 className="serif-title" style={{ fontSize: '16px', color: 'var(--secondary-navy)', margin: 0 }}>
                    1. Dados Principais da Proposta & Cliente
                  </h3>
                </div>
                {openAccordions.dados ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </div>

              {openAccordions.dados && (
                <div style={{ padding: '20px' }}>
                  <div style={{ marginBottom: '12px' }}>
                    <label style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px', display: 'block', fontWeight: '600' }}>Título da Proposta</label>
                    <input
                      type="text"
                      value={currentProposal.title || ''}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      required
                    />
                  </div>

                  <div className="admin-responsive-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>

                    <div>
                      <label style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px', display: 'block', fontWeight: '600' }}>Tipo de Evento</label>
                      <input
                        type="text"
                        placeholder="Ex: Casamento, 15 anos"
                        value={currentProposal.eventType || ''}
                        onChange={(e) => handleInputChange('eventType', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ACCORDION 2: Sobre Nós */}
            <div style={{ background: 'var(--bg-page)', border: '1px solid var(--border-color)', borderRadius: '14px', marginBottom: '15px', overflow: 'hidden' }}>
              <div
                onClick={() => toggleAccordion('sobre')}
                role="button" tabIndex={0} aria-expanded={openAccordions.sobre}
                onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); toggleAccordion('sobre'); } }}
                style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', background: '#ffffff', borderBottom: openAccordions.sobre ? '1px solid var(--border-color)' : 'none' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <HeartHandshake size={20} color="var(--primary-gold)" />
                  <h3 className="serif-title" style={{ fontSize: '16px', color: 'var(--secondary-navy)', margin: 0 }}>
                    2. Sobre Nós (Apresentação Institucional)
                  </h3>
                </div>
                {openAccordions.sobre ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </div>

              {openAccordions.sobre && (
                <div style={{ padding: '20px' }}>
                  <label style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px', display: 'block', fontWeight: '600' }}>
                    Texto de Apresentação da Camila's Cerimonial
                  </label>
                  <textarea
                    rows="4"
                    value={currentProposal.aboutUs || ''}
                    onChange={(e) => handleInputChange('aboutUs', e.target.value)}
                  ></textarea>
                </div>
              )}
            </div>

            {/* ACCORDION 3: Itens Inclusos */}
            <div style={{ background: 'var(--bg-page)', border: '1px solid var(--border-color)', borderRadius: '14px', marginBottom: '15px', overflow: 'hidden' }}>
              <div
                onClick={() => toggleAccordion('itens')}
                role="button" tabIndex={0} aria-expanded={openAccordions.itens}
                onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); toggleAccordion('itens'); } }}
                style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', background: '#ffffff', borderBottom: openAccordions.itens ? '1px solid var(--border-color)' : 'none' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <CheckSquare size={20} color="var(--primary-gold)" />
                  <h3 className="serif-title" style={{ fontSize: '16px', color: 'var(--secondary-navy)', margin: 0 }}>
                    3. Itens Inclusos (Com seleção de itens e subitens)
                  </h3>
                </div>
                {openAccordions.itens ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </div>

              {openAccordions.itens && (
                <div style={{ padding: '20px' }}>
                  {currentProposal.categorizedItems && currentProposal.categorizedItems.map((catGroup) => (
                    <div key={catGroup.id} style={{ background: '#ffffff', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '15px', marginBottom: '15px' }}>

                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '12px' }}>
                        <input
                          type="text"
                          style={{ marginBottom: 0, fontWeight: 'bold', color: 'var(--secondary-navy)' }}
                          value={catGroup.category}
                          onChange={(e) => handleCategoryTitleChange(catGroup.id, e.target.value)}
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveCategory(catGroup.id)}
                          style={{ background: '#fee2e2', color: '#ef4444', border: '1px solid #fca5a5', borderRadius: '8px', padding: '8px 12px', cursor: 'pointer' }}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingLeft: '10px' }}>
                        {catGroup.subitems && catGroup.subitems.map((sub) => (
                          <div key={sub.id} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div
                              onClick={() => handleToggleSubitem(catGroup.id, sub.id)}
                              style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                            >
                              {sub.selected ? <CheckSquare size={18} color="var(--primary-gold)" /> : <Square size={18} color="#cbd5e1" />}
                            </div>

                            <input
                              type="text"
                              style={{ marginBottom: 0, opacity: sub.selected ? 1 : 0.5, flex: 1 }}
                              value={sub.name}
                              onChange={(e) => handleSubitemTextChange(catGroup.id, sub.id, e.target.value)}
                            />

                            <button
                              type="button"
                              onClick={() => handleRemoveSubitem(catGroup.id, sub.id)}
                              style={{ background: 'transparent', color: '#94a3b8', border: 'none', cursor: 'pointer', padding: '4px' }}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        ))}
                      </div>

                      <button
                        type="button"
                        className="btn-outline-gold"
                        onClick={() => handleAddSubitem(catGroup.id)}
                        style={{ marginTop: '12px', padding: '4px 12px', fontSize: '11px' }}
                      >
                        <Plus size={13} /> Adicionar Subitem
                      </button>

                    </div>
                  ))}

                  <button
                    type="button"
                    className="btn-outline-gold"
                    onClick={handleAddCategory}
                    style={{ width: '100%', marginTop: '5px' }}
                  >
                    <Plus size={15} /> Adicionar Nova Categoria
                  </button>
                </div>
              )}
            </div>

            {/* ACCORDION 4: Orçamento */}
            <div style={{ background: 'var(--bg-page)', border: '1px solid var(--border-color)', borderRadius: '14px', marginBottom: '15px', overflow: 'hidden' }}>
              <div
                onClick={() => toggleAccordion('orcamento')}
                role="button" tabIndex={0} aria-expanded={openAccordions.orcamento}
                onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); toggleAccordion('orcamento'); } }}
                style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', background: '#ffffff', borderBottom: openAccordions.orcamento ? '1px solid var(--border-color)' : 'none' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Users size={20} color="var(--primary-gold)" />
                  <h3 className="serif-title" style={{ fontSize: '16px', color: 'var(--secondary-navy)', margin: 0 }}>
                    4. Orçamento (Com Máscara R$)
                  </h3>
                </div>
                {openAccordions.orcamento ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </div>

              {openAccordions.orcamento && (
                <div style={{ padding: '20px' }}>
                  <div style={{ marginBottom: '15px', background: '#ffffff', border: '1px solid var(--border-color)', padding: '15px', borderRadius: '10px' }}>
                    <div className="admin-responsive-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>

                      <div>
                        <label style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px', display: 'block', fontWeight: '600' }}>
                          Valor Final da Proposta (R$)
                        </label>
                        <input
                          type="text"
                          placeholder="R$ 0,00"
                          value={currentProposal.price || ''}
                          onChange={(e) => {
                            const val = maskCurrency(e.target.value);
                            handleInputChange('price', val);
                            handleNestedInputChange('pricingByGuests', 'finalPrice', val);
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Dynamic Guest Tiers */}
                  <div style={{ background: '#ffffff', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '15px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <h4 style={{ fontSize: '14px', color: 'var(--secondary-navy)', margin: 0 }}>
                        Faixas de Orçamento por Convidados (Tabela de Preços com R$)
                      </h4>
                      <button
                        type="button"
                        className="btn-outline-gold"
                        onClick={handleAddGuestTier}
                        style={{ padding: '4px 12px', fontSize: '12px' }}
                      >
                        <Plus size={14} /> Adicionar Faixa
                      </button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {currentProposal.pricingByGuests?.tiers && currentProposal.pricingByGuests.tiers.map((tier) => (
                        <div key={tier.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', background: tier.selected ? 'var(--primary-gold-light)' : '#f8fafc', border: tier.selected ? '1px solid var(--primary-gold)' : '1px solid var(--border-color)', padding: '10px', borderRadius: '8px' }}>

                          <div
                            onClick={() => handleSelectGuestTier(tier.id)}
                            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                            title="Selecionar esta faixa"
                          >
                            {tier.selected ? <CheckSquare size={18} color="var(--primary-gold)" /> : <Square size={18} color="#cbd5e1" />}
                          </div>

                          <input
                            type="text"
                            placeholder="Faixa (ex: Até 100 convidados)"
                            style={{ marginBottom: 0, flex: 2 }}
                            value={tier.range}
                            onChange={(e) => handleTierChange(tier.id, 'range', e.target.value)}
                          />

                          <input
                            type="text"
                            placeholder="R$ 0,00"
                            style={{ marginBottom: 0, flex: 1, fontWeight: 'bold', color: 'var(--secondary-navy)' }}
                            value={tier.price}
                            onChange={(e) => handleTierChange(tier.id, 'price', e.target.value)}
                          />

                          <button
                            type="button"
                            onClick={() => handleRemoveGuestTier(tier.id)}
                            style={{ background: 'transparent', color: '#ef4444', border: 'none', cursor: 'pointer' }}
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      ))}
                    </div>

                  </div>

                </div>
              )}
            </div>

            {/* ACCORDION 5: Formas de Pagamento */}
            <div style={{ background: 'var(--bg-page)', border: '1px solid var(--border-color)', borderRadius: '14px', marginBottom: '15px', overflow: 'hidden' }}>
              <div
                onClick={() => toggleAccordion('pagamento')}
                role="button" tabIndex={0} aria-expanded={openAccordions.pagamento}
                onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); toggleAccordion('pagamento'); } }}
                style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', background: '#ffffff', borderBottom: openAccordions.pagamento ? '1px solid var(--border-color)' : 'none' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <CreditCard size={20} color="var(--primary-gold)" />
                  <h3 className="serif-title" style={{ fontSize: '16px', color: 'var(--secondary-navy)', margin: 0 }}>
                    5. Formas de Pagamento
                  </h3>
                </div>
                {openAccordions.pagamento ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </div>

              {openAccordions.pagamento && (
                <div style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '15px' }}>
                    {currentProposal.paymentOptions?.methods && currentProposal.paymentOptions.methods.map((method) => (
                      <div key={method.id} style={{ background: '#ffffff', border: '1px solid var(--border-color)', padding: '12px', borderRadius: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                          <div onClick={() => handleTogglePaymentMethod(method.id)} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                            {method.enabled ? <CheckSquare size={18} color="var(--primary-gold)" /> : <Square size={18} color="#cbd5e1" />}
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 'bold', color: 'var(--secondary-navy)', fontSize: '13px' }}>
                            {method.type === 'pix' && <QrCode size={16} color="#10b981" />}
                            {method.type === 'card' && <CreditCard size={16} color="#3b82f6" />}
                            {method.type === 'bank' && <Landmark size={16} color="#8b5cf6" />}
                            {method.label}
                          </div>
                        </div>

                        <input
                          type="text"
                          style={{ marginBottom: 0, fontSize: '12px' }}
                          value={method.details}
                          onChange={(e) => handlePaymentMethodDetailsChange(method.id, e.target.value)}
                        />
                      </div>
                    ))}
                  </div>

                  <div>
                    <label style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px', display: 'block', fontWeight: '600' }}>
                      Condições Gerais de Pagamento
                    </label>
                    <textarea
                      rows="2"
                      value={currentProposal.paymentOptions?.terms || currentProposal.paymentTerms || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        handleInputChange('paymentTerms', val);
                        handleNestedInputChange('paymentOptions', 'terms', val);
                      }}
                    ></textarea>
                  </div>
                </div>
              )}
            </div>

            {/* ACCORDION 6: Saudação Final */}
            <div style={{ background: 'var(--bg-page)', border: '1px solid var(--border-color)', borderRadius: '14px', marginBottom: '20px', overflow: 'hidden' }}>
              <div
                onClick={() => toggleAccordion('saudacao')}
                role="button" tabIndex={0} aria-expanded={openAccordions.saudacao}
                onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); toggleAccordion('saudacao'); } }}
                style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', background: '#ffffff', borderBottom: openAccordions.saudacao ? '1px solid var(--border-color)' : 'none' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <MessageSquare size={20} color="var(--primary-gold)" />
                  <h3 className="serif-title" style={{ fontSize: '16px', color: 'var(--secondary-navy)', margin: 0 }}>
                    6. Saudação Final & Validade
                  </h3>
                </div>
                {openAccordions.saudacao ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </div>

              {openAccordions.saudacao && (
                <div style={{ padding: '20px' }}>
                  <div style={{ marginBottom: '12px' }}>
                    <label style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px', display: 'block', fontWeight: '600' }}>
                      Mensagem de Agradecimento Final
                    </label>
                    <textarea
                      rows="2"
                      value={currentProposal.finalGreeting?.message || ''}
                      onChange={(e) => handleNestedInputChange('finalGreeting', 'message', e.target.value)}
                    ></textarea>
                  </div>

                  <div>
                    <label style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px', display: 'block', fontWeight: '600' }}>
                      Nota de Validade
                    </label>
                    <input
                      type="text"
                      value={currentProposal.finalGreeting?.validity || ''}
                      onChange={(e) => handleNestedInputChange('finalGreeting', 'validity', e.target.value)}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="workspace-form-actions">
              <button
                type="button"
                className="btn-outline-gold"
                onClick={() => setPdfPreviewProposal(currentProposal)}
              >
                <Eye size={16} /> Visualizar PDF
              </button>

              <button type="submit" className="btn-gold">
                <Save size={16} /> Salvar Alterações
              </button>
            </div>

          </form>
        )}

        {/* Password Tab */}
        {activeTab === 'senha' && (
          <form onSubmit={handleChangePassword} className="form-clean" style={{ maxWidth: '400px', margin: 'auto', background: 'var(--bg-page)', padding: '25px', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
            <h3 className="serif-title" style={{ fontSize: '18px', color: 'var(--secondary-navy)', marginBottom: '15px', textAlign: 'center' }}>
              Alterar Senha do Administrador
            </h3>

            <input
              type="password"
              placeholder="Digite a nova senha..."
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Confirme a nova senha..."
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            <button type="submit" className="btn-gold" style={{ width: '100%', marginTop: '6px' }}>
              Salvar Nova Senha
            </button>
          </form>
        )}

      </div>
    </AdminLayout>
  );
}
