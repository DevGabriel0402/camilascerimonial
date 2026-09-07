import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Save, LogOut, FileText, Plus, Trash2, Eye, Key, CheckCircle, Home } from 'lucide-react';
import ProposalPdfGenerator from './ProposalPdfGenerator';

export default function AdminDashboard({ proposals, setProposals, onLogout }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('completa'); // 'completa' | 'cerimonial' | 'nova' | 'senha'
  const [currentProposal, setCurrentProposal] = useState(proposals.completa);
  const [pdfPreviewProposal, setPdfPreviewProposal] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');

  // Password change state
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Sync tab change
  useEffect(() => {
    if (activeTab === 'completa') {
      setCurrentProposal(proposals.completa);
    } else if (activeTab === 'cerimonial') {
      setCurrentProposal(proposals.cerimonial);
    } else if (activeTab === 'nova') {
      setCurrentProposal({
        id: 'custom_' + Date.now(),
        title: 'Nova Proposta Personalizada',
        description: 'Descrição detalhada dos serviços contratados...',
        price: 'R$ 0,00',
        paymentTerms: 'Entrada de 30% + saldo até a data do evento.',
        clientName: '',
        eventDate: '',
        eventType: 'Casamento',
        guestCount: '',
        items: ['Reuniões de alinhamento', 'Organização do cronograma', 'Presença da equipe no dia']
      });
    }
  }, [activeTab, proposals]);

  const handleInputChange = (field, value) => {
    setCurrentProposal(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleItemChange = (index, value) => {
    const newItems = [...currentProposal.items];
    newItems[index] = value;
    setCurrentProposal(prev => ({ ...prev, items: newItems }));
  };

  const handleAddItem = () => {
    setCurrentProposal(prev => ({
      ...prev,
      items: [...prev.items, 'Novo item do serviço']
    }));
  };

  const handleRemoveItem = (index) => {
    const newItems = currentProposal.items.filter((_, idx) => idx !== index);
    setCurrentProposal(prev => ({ ...prev, items: newItems }));
  };

  // Save changes to Firebase Firestore & LocalStorage
  const handleSaveProposal = async (e) => {
    e.preventDefault();
    try {
      const updatedProposals = {
        ...proposals,
        [activeTab]: currentProposal
      };

      setProposals(updatedProposals);
      localStorage.setItem('camilas_proposals', JSON.stringify(updatedProposals));

      // Save to Firebase Firestore
      await setDoc(doc(db, "proposals", activeTab), currentProposal);

      setSuccessMsg('Proposta salva com sucesso no banco de dados e localmente!');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      console.error('Erro ao salvar no Firebase:', err);
      // Fallback local save works anyway
      const updatedProposals = {
        ...proposals,
        [activeTab]: currentProposal
      };
      setProposals(updatedProposals);
      localStorage.setItem('camilas_proposals', JSON.stringify(updatedProposals));
      setSuccessMsg('Proposta salva localmente!');
      setTimeout(() => setSuccessMsg(''), 4000);
    }
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

  return (
    <div style={{ background: '#f1f5f9', minHeight: '100vh', padding: '20px' }}>
      
      {/* PDF Modal Viewer */}
      {pdfPreviewProposal && (
        <ProposalPdfGenerator
          proposal={pdfPreviewProposal}
          onClose={() => setPdfPreviewProposal(null)}
        />
      )}

      <div className="admin-container">
        
        {/* Header */}
        <div className="admin-header">
          <div>
            <h2><FileText color="var(--primary-color)" /> Painel de Gerenciamento de Propostas</h2>
            <p style={{ color: '#64748b', fontSize: '14px', marginTop: '4px' }}>
              Modifique os valores, descrições e gere PDFs personalizados para os clientes.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <Link to="/" className="btn-secondary" style={{ textDecoration: 'none' }}>
              <Home size={16} /> Ver Site
            </Link>
            <button className="btn-secondary" onClick={onLogout} style={{ color: '#ef4444' }}>
              <LogOut size={16} /> Sair
            </button>
          </div>
        </div>

        {/* Notifications */}
        {successMsg && (
          <div style={{ background: '#dcfce7', color: '#15803d', padding: '12px 18px', borderRadius: '8px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 'bold' }}>
            <CheckCircle size={20} /> {successMsg}
          </div>
        )}

        {/* Navigation Tabs */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '25px', flexWrap: 'wrap' }}>
          <button
            className={activeTab === 'completa' ? 'btn-primary' : 'btn-secondary'}
            onClick={() => setActiveTab('completa')}
          >
            Proposta Completa
          </button>
          <button
            className={activeTab === 'cerimonial' ? 'btn-primary' : 'btn-secondary'}
            onClick={() => setActiveTab('cerimonial')}
          >
            Proposta Cerimonial
          </button>
          <button
            className={activeTab === 'nova' ? 'btn-primary' : 'btn-secondary'}
            onClick={() => setActiveTab('nova')}
          >
            <Plus size={16} /> Gerar PDF para Cliente Específico
          </button>
          <button
            className={activeTab === 'senha' ? 'btn-primary' : 'btn-secondary'}
            onClick={() => setActiveTab('senha')}
            style={{ marginLeft: 'auto' }}
          >
            <Key size={16} /> Alterar Senha
          </button>
        </div>

        {/* Tab 1, 2 & 3: Proposal Editor Form */}
        {activeTab !== 'senha' && currentProposal && (
          <form onSubmit={handleSaveProposal}>
            
            <div className="admin-card">
              <h3>Informações Básicas da Proposta</h3>
              
              <div className="form-group">
                <label>Título da Proposta</label>
                <input
                  type="text"
                  value={currentProposal.title || ''}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  required
                />
              </div>

              {activeTab === 'nova' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  <div className="form-group">
                    <label>Nome do Cliente / Noivos</label>
                    <input
                      type="text"
                      placeholder="Ex: Maria & João"
                      value={currentProposal.clientName || ''}
                      onChange={(e) => handleInputChange('clientName', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Data do Evento</label>
                    <input
                      type="text"
                      placeholder="Ex: 25/11/2026"
                      value={currentProposal.eventDate || ''}
                      onChange={(e) => handleInputChange('eventDate', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Tipo do Evento</label>
                    <input
                      type="text"
                      placeholder="Ex: Casamento, 15 anos"
                      value={currentProposal.eventType || ''}
                      onChange={(e) => handleInputChange('eventType', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Qtd. Estimada de Convidados</label>
                    <input
                      type="text"
                      placeholder="Ex: 150"
                      value={currentProposal.guestCount || ''}
                      onChange={(e) => handleInputChange('guestCount', e.target.value)}
                    />
                  </div>
                </div>
              )}

              <div className="form-group">
                <label>Descrição detalhada dos serviços</label>
                <textarea
                  rows="4"
                  value={currentProposal.description || ''}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                ></textarea>
              </div>
            </div>

            {/* Included Items Section */}
            <div className="admin-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h3 style={{ margin: 0 }}>Itens Inclusos no Pacote</h3>
                <button type="button" className="btn-secondary" onClick={handleAddItem}>
                  <Plus size={16} /> Adicionar Item
                </button>
              </div>

              {currentProposal.items && currentProposal.items.map((item, index) => (
                <div key={index} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                  <input
                    type="text"
                    style={{ flex: 1, padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                    value={item}
                    onChange={(e) => handleItemChange(index, e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(index)}
                    style={{ background: '#fee2e2', color: '#ef4444', border: 'none', borderRadius: '6px', padding: '0 12px', cursor: 'pointer' }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>

            {/* Pricing Section */}
            <div className="admin-card">
              <h3>Valores & Formas de Pagamento</h3>
              
              <div className="form-group">
                <label>Investimento Total (Valor)</label>
                <input
                  type="text"
                  placeholder="Ex: R$ 3.500,00"
                  value={currentProposal.price || ''}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Condições e Formas de Pagamento</label>
                <textarea
                  rows="3"
                  placeholder="Ex: Entrada de 30% na assinatura do contrato + parcelamento até 15 dias antes do evento."
                  value={currentProposal.paymentTerms || ''}
                  onChange={(e) => handleInputChange('paymentTerms', e.target.value)}
                ></textarea>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '15px', justifyContent: 'flex-end' }}>
              <button
                type="button"
                className="btn-success"
                onClick={() => setPdfPreviewProposal(currentProposal)}
              >
                <Eye size={18} /> Visualizar & Baixar PDF
              </button>
              
              <button type="submit" className="btn-primary">
                <Save size={18} /> Salvar Alterações
              </button>
            </div>

          </form>
        )}

        {/* Tab 4: Change Password Form */}
        {activeTab === 'senha' && (
          <form onSubmit={handleChangePassword} className="admin-card" style={{ maxWidth: '500px', margin: 'auto' }}>
            <h3>Alterar Senha do Administrador</h3>
            
            <div className="form-group">
              <label>Nova Senha</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Confirme a Nova Senha</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '10px' }}>
              Salvar Nova Senha
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
