import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { maskCurrency } from '../../utils/masks';

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

const BUDGET_MODES = [
  { value: 'single', label: 'Valor Único' },
  { value: 'table', label: 'Tabela por Convidados' },
  { value: 'both', label: 'Mostrar Ambos' },
];

export default function BudgetSection({ proposal, onChange, onNested }) {
  const tiers = proposal.pricingByGuests?.tiers || [];
  const budgetMode = proposal.budgetMode || 'both';

  const updateTiers = (updated) => {
    onNested('pricingByGuests', 'tiers', updated);
  };

  const addTier = () => {
    const newTier = {
      id: 'tier_' + Date.now(),
      range: '100 até 150 convidados',
      price: 'R$ 3.000,00',
      selected: false,
    };
    updateTiers([...tiers, newTier]);
  };

  const removeTier = (id) => updateTiers(tiers.filter(t => t.id !== id));

  const duplicateTier = (tier) => {
    const idx = tiers.findIndex(t => t.id === tier.id);
    const cloned = { ...tier, id: 'tier_' + Date.now(), selected: false };
    const updated = [...tiers];
    updated.splice(idx + 1, 0, cloned);
    updateTiers(updated);
  };

  const updateTierField = (id, field, rawValue) => {
    const value = field === 'price' ? maskCurrency(rawValue) : rawValue;
    updateTiers(tiers.map(t => {
      if (t.id !== id) return t;
      const updated = { ...t, [field]: value };
      // If this tier is selected and price changed, update main price too
      if (field === 'price' && t.selected) {
        onChange('price', value);
      }
      return updated;
    }));
  };

  const selectTier = (id) => {
    const selected = tiers.find(t => t.id === id);
    if (selected) onChange('price', selected.price);
    updateTiers(tiers.map(t => ({ ...t, selected: t.id === id })));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>

      {/* Budget Mode */}
      <div>
        <Label>Modo do Orçamento</Label>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '2px' }}>
          {BUDGET_MODES.map(mode => (
            <button
              key={mode.value}
              type="button"
              onClick={() => onChange('budgetMode', mode.value)}
              style={{
                padding: '7px 16px', borderRadius: '8px', fontSize: '12px', fontWeight: '600',
                cursor: 'pointer', transition: 'all 0.15s',
                background: budgetMode === mode.value ? '#17345F' : '#F7F8FA',
                color: budgetMode === mode.value ? '#FFFFFF' : '#64748B',
                border: budgetMode === mode.value ? '1px solid #17345F' : '1px solid #E3E8EF',
              }}
            >
              {mode.label}
            </button>
          ))}
        </div>
      </div>

      {/* Single value */}
      {(budgetMode === 'single' || budgetMode === 'both') && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
          <div>
            <Label>Estimativa de Convidados</Label>
            <input
              style={inputStyle}
              type="text"
              placeholder="Ex: 150 convidados"
              value={proposal.guestCount || ''}
              onChange={e => onChange('guestCount', e.target.value)}
            />
          </div>
          <div>
            <Label>Valor Final da Proposta (R$)</Label>
            <input
              style={{ ...inputStyle, fontWeight: '700', color: '#C9A35C' }}
              type="text"
              placeholder="R$ 0,00"
              value={proposal.price || ''}
              onChange={e => {
                const v = maskCurrency(e.target.value);
                onChange('price', v);
                onNested('pricingByGuests', 'finalPrice', v);
              }}
            />
          </div>
        </div>
      )}

      {/* Tiers table */}
      {(budgetMode === 'table' || budgetMode === 'both') && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <Label>Faixas por Número de Convidados</Label>
            <button
              type="button"
              onClick={addTier}
              style={{
                background: '#F4EBD8', color: '#C9A35C', border: '1px solid #E0C898',
                borderRadius: '7px', padding: '5px 12px', fontSize: '11px',
                fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px',
              }}
            >
              <Plus size={12} /> Adicionar Faixa
            </button>
          </div>

          {tiers.length === 0 && (
            <p style={{ color: '#94A3B8', fontSize: '12px', textAlign: 'center', padding: '16px' }}>
              Nenhuma faixa adicionada.
            </p>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {tiers.map((tier) => (
              <div key={tier.id} style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                background: tier.selected ? '#FDF7EE' : '#FAFBFC',
                border: tier.selected ? '1px solid #E0C898' : '1px solid #E3E8EF',
                borderRadius: '9px', padding: '8px 12px',
                transition: 'all 0.15s',
              }}>
                {/* Select radio */}
                <input
                  type="checkbox"
                  checked={tier.selected === true}
                  onChange={() => selectTier(tier.id)}
                  title="Selecionar como faixa ativa"
                  style={{ accentColor: '#C9A35C', cursor: 'pointer', flexShrink: 0 }}
                />

                {/* Range */}
                <input
                  type="text"
                  style={{ ...inputStyle, flex: 2, padding: '6px 10px', marginBottom: 0 }}
                  placeholder="Ex: 100 até 150 convidados"
                  value={tier.range}
                  onChange={e => updateTierField(tier.id, 'range', e.target.value)}
                />

                {/* Price */}
                <input
                  type="text"
                  style={{ ...inputStyle, flex: 1, fontWeight: '700', color: '#C9A35C', padding: '6px 10px', marginBottom: 0 }}
                  placeholder="R$ 0,00"
                  value={tier.price}
                  onChange={e => updateTierField(tier.id, 'price', e.target.value)}
                />

                {/* Duplicate */}
                <button type="button" onClick={() => duplicateTier(tier)} title="Duplicar"
                  style={{ background: 'none', border: 'none', color: '#CBD5E1', cursor: 'pointer', padding: '4px' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
                </button>

                {/* Delete */}
                <button type="button" onClick={() => removeTier(tier.id)} title="Excluir faixa"
                  style={{ background: 'none', border: 'none', color: '#EF6464', cursor: 'pointer', padding: '4px' }}>
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
