import React from 'react';
import { Plus, Trash2 } from 'lucide-react';

const inputStyle = {
  width: '100%', padding: '9px 12px',
  border: '1px solid #E3E8EF', borderRadius: '8px',
  fontSize: '13px', color: '#17345F',
  background: '#FAFBFC', outline: 'none',
  fontFamily: 'inherit',
};

const Label = ({ children }) => (
  <label style={{
    display: 'block', fontSize: '11px', fontWeight: '600',
    color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.6px',
    marginBottom: '5px',
  }}>
    {children}
  </label>
);

const METHOD_ICONS = { pix: '📱', card: '💳', bank: '🏦' };

export default function PaymentSection({ proposal, onChange, onNested }) {
  const methods = proposal.paymentOptions?.methods || [];
  const terms = proposal.paymentOptions?.terms || proposal.paymentTerms || '';

  const updateMethods = (updated) => {
    onNested('paymentOptions', 'methods', updated);
  };

  const toggleMethod = (id) => {
    updateMethods(methods.map(m => m.id === id ? { ...m, enabled: !m.enabled } : m));
  };

  const updateMethodField = (id, field, value) => {
    updateMethods(methods.map(m => m.id === id ? { ...m, [field]: value } : m));
  };

  const removeMethod = (id) => {
    updateMethods(methods.filter(m => m.id !== id));
  };

  const addMethod = () => {
    const newMethod = {
      id: 'method_' + Date.now(),
      type: 'other',
      label: 'Nova Forma de Pagamento',
      details: '',
      enabled: true,
    };
    updateMethods([...methods, newMethod]);
  };

  const updateTerms = (value) => {
    onChange('paymentTerms', value);
    onNested('paymentOptions', 'terms', value);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

      {methods.map((method) => (
        <div key={method.id} style={{
          background: method.enabled ? '#FAFBFC' : '#F7F8FA',
          border: method.enabled ? '1px solid #E3E8EF' : '1px dashed #E3E8EF',
          borderRadius: '10px', padding: '14px',
          opacity: method.enabled ? 1 : 0.6,
          transition: 'all 0.15s',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            {/* Enable toggle */}
            <input
              type="checkbox"
              checked={method.enabled !== false}
              onChange={() => toggleMethod(method.id)}
              style={{ width: '15px', height: '15px', accentColor: '#16A36A', cursor: 'pointer', flexShrink: 0 }}
            />

            <span style={{ fontSize: '18px' }}>
              {METHOD_ICONS[method.type] || '💰'}
            </span>

            {/* Method label */}
            <input
              type="text"
              style={{ ...inputStyle, flex: 1, fontWeight: '700', padding: '5px 9px' }}
              value={method.label}
              onChange={e => updateMethodField(method.id, 'label', e.target.value)}
              placeholder="Nome da forma de pagamento"
            />

            {/* Type selector */}
            <select
              style={{ ...inputStyle, width: 'auto', padding: '5px 8px', fontSize: '12px' }}
              value={method.type}
              onChange={e => updateMethodField(method.id, 'type', e.target.value)}
            >
              <option value="pix">PIX</option>
              <option value="card">Cartão</option>
              <option value="bank">Boleto/Transf.</option>
              <option value="other">Outro</option>
            </select>

            <button type="button" onClick={() => removeMethod(method.id)} title="Excluir"
              style={{ background: 'none', border: 'none', color: '#EF6464', cursor: 'pointer', padding: '4px' }}>
              <Trash2 size={14} />
            </button>
          </div>

          {/* Details */}
          <div>
            <Label>Detalhes / Descrição</Label>
            <input
              type="text"
              style={inputStyle}
              placeholder="Ex: Parcelamento em até 10x no cartão"
              value={method.details || ''}
              onChange={e => updateMethodField(method.id, 'details', e.target.value)}
            />
          </div>
        </div>
      ))}

      {/* Add method */}
      <button type="button" onClick={addMethod}
        style={{
          width: '100%', padding: '10px',
          background: 'none', border: '1px dashed #CBD5E1',
          borderRadius: '9px', color: '#64748B',
          fontSize: '12px', fontWeight: '600', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
        }}>
        <Plus size={13} /> Adicionar Forma de Pagamento
      </button>

      {/* General conditions */}
      <div style={{ marginTop: '4px' }}>
        <Label>Condições Gerais de Pagamento</Label>
        <textarea
          rows={3}
          style={{ ...inputStyle, resize: 'vertical' }}
          placeholder="Ex: Entrada de 30% na assinatura do contrato e o restante até 15 dias antes do evento."
          value={terms}
          onChange={e => updateTerms(e.target.value)}
        />
      </div>

    </div>
  );
}
