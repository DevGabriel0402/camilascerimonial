import React from 'react';
import { Plus, Trash2, GripVertical, ChevronDown, ChevronUp } from 'lucide-react';

const inputStyle = {
  width: '100%', padding: '8px 11px',
  border: '1px solid #E3E8EF', borderRadius: '7px',
  fontSize: '13px', color: '#17345F',
  background: '#FAFBFC', outline: 'none',
  fontFamily: 'inherit',
};

export default function ServicesSection({ proposal, onChange }) {
  const categories = proposal.categorizedItems || [];

  const updateCategories = (updated) => onChange('categorizedItems', updated);

  /* ── Category handlers ── */
  const addCategory = () => {
    const newCat = {
      id: 'cat_' + Date.now(),
      category: 'Nova Categoria',
      enabled: true,
      subitems: [{ id: 'sub_' + Date.now(), name: 'Novo item de serviço', selected: true }],
    };
    updateCategories([...categories, newCat]);
  };

  const removeCategory = (catId) => {
    if (!window.confirm('Remover esta categoria e todos os seus itens?')) return;
    updateCategories(categories.filter(c => c.id !== catId));
  };

  const updateCategoryField = (catId, field, value) => {
    updateCategories(categories.map(c => c.id === catId ? { ...c, [field]: value } : c));
  };

  const duplicateCategory = (cat) => {
    const cloned = {
      ...cat,
      id: 'cat_' + Date.now(),
      category: cat.category + ' (cópia)',
      subitems: cat.subitems.map(s => ({ ...s, id: 'sub_' + Date.now() + Math.random() })),
    };
    updateCategories([...categories, cloned]);
  };

  /* ── Subitem handlers ── */
  const addSubitem = (catId) => {
    updateCategories(categories.map(c => {
      if (c.id !== catId) return c;
      return { ...c, subitems: [...c.subitems, { id: 'sub_' + Date.now(), name: 'Novo item', selected: true }] };
    }));
  };

  const removeSubitem = (catId, subId) => {
    updateCategories(categories.map(c => {
      if (c.id !== catId) return c;
      return { ...c, subitems: c.subitems.filter(s => s.id !== subId) };
    }));
  };

  const toggleSubitem = (catId, subId) => {
    updateCategories(categories.map(c => {
      if (c.id !== catId) return c;
      return { ...c, subitems: c.subitems.map(s => s.id === subId ? { ...s, selected: !s.selected } : s) };
    }));
  };

  const updateSubitemText = (catId, subId, text) => {
    updateCategories(categories.map(c => {
      if (c.id !== catId) return c;
      return { ...c, subitems: c.subitems.map(s => s.id === subId ? { ...s, name: text } : s) };
    }));
  };

  const duplicateSubitem = (catId, sub) => {
    updateCategories(categories.map(c => {
      if (c.id !== catId) return c;
      const idx = c.subitems.findIndex(s => s.id === sub.id);
      const cloned = { ...sub, id: 'sub_' + Date.now() };
      const updated = [...c.subitems];
      updated.splice(idx + 1, 0, cloned);
      return { ...c, subitems: updated };
    }));
  };

  return (
    <div>
      {categories.length === 0 && (
        <div style={{ textAlign: 'center', padding: '30px', color: '#94A3B8', fontSize: '13px' }}>
          Nenhuma categoria adicionada. Clique em "+ Adicionar Categoria" para começar.
        </div>
      )}

      {categories.map((cat, catIdx) => (
        <div key={cat.id} style={{
          background: '#F7F8FA', border: '1px solid #E3E8EF',
          borderRadius: '10px', marginBottom: '12px', overflow: 'hidden',
        }}>
          {/* Category Header */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '10px 12px', background: '#FFFFFF',
            borderBottom: '1px solid #E3E8EF',
          }}>
            <GripVertical size={16} color="#CBD5E1" style={{ flexShrink: 0, cursor: 'grab' }} />

            {/* Enable checkbox */}
            <input
              type="checkbox"
              checked={cat.enabled !== false}
              onChange={() => updateCategoryField(cat.id, 'enabled', !(cat.enabled !== false))}
              title="Habilitar/desabilitar categoria no PDF"
              style={{ width: '15px', height: '15px', cursor: 'pointer', accentColor: '#C9A35C', flexShrink: 0 }}
            />

            {/* Category title input */}
            <input
              type="text"
              style={{ ...inputStyle, flex: 1, fontWeight: '700', color: '#17345F', background: 'transparent', border: 'none', padding: '4px 6px' }}
              value={cat.category}
              onChange={e => updateCategoryField(cat.id, 'category', e.target.value)}
              placeholder="Nome da categoria"
            />

            {/* Actions */}
            <button type="button" onClick={() => duplicateCategory(cat)} title="Duplicar categoria"
              style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: '4px' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
            </button>
            <button type="button" onClick={() => removeCategory(cat.id)} title="Excluir categoria"
              style={{ background: 'none', border: 'none', color: '#EF6464', cursor: 'pointer', padding: '4px' }}>
              <Trash2 size={14} />
            </button>
          </div>

          {/* Subitems */}
          <div style={{ padding: '10px 12px 6px 12px' }}>
            {(cat.subitems || []).map((sub) => (
              <div key={sub.id} style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '5px 4px', borderBottom: '1px dashed #EFF2F7',
              }}>
                <GripVertical size={14} color="#CBD5E1" style={{ flexShrink: 0, cursor: 'grab' }} />

                <input
                  type="checkbox"
                  checked={sub.selected !== false}
                  onChange={() => toggleSubitem(cat.id, sub.id)}
                  style={{ width: '14px', height: '14px', cursor: 'pointer', accentColor: '#C9A35C', flexShrink: 0 }}
                />

                <input
                  type="text"
                  style={{
                    ...inputStyle, flex: 1, padding: '5px 8px', fontSize: '12px',
                    opacity: sub.selected !== false ? 1 : 0.45,
                    textDecoration: sub.selected !== false ? 'none' : 'line-through',
                  }}
                  value={sub.name}
                  onChange={e => updateSubitemText(cat.id, sub.id, e.target.value)}
                />

                <button type="button" onClick={() => duplicateSubitem(cat.id, sub)} title="Duplicar item"
                  style={{ background: 'none', border: 'none', color: '#CBD5E1', cursor: 'pointer', padding: '2px' }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                </button>
                <button type="button" onClick={() => removeSubitem(cat.id, sub.id)} title="Excluir item"
                  style={{ background: 'none', border: 'none', color: '#EF6464', cursor: 'pointer', padding: '2px' }}>
                  <Trash2 size={13} />
                </button>
              </div>
            ))}

            <button type="button" onClick={() => addSubitem(cat.id)}
              style={{
                background: 'none', border: '1px dashed #CBD5E1', color: '#64748B',
                borderRadius: '6px', padding: '5px 12px', fontSize: '11px',
                cursor: 'pointer', marginTop: '8px', display: 'flex',
                alignItems: 'center', gap: '4px', width: '100%', justifyContent: 'center',
              }}>
              <Plus size={12} /> Adicionar Subitem
            </button>
          </div>
        </div>
      ))}

      {/* Add category */}
      <button
        type="button"
        onClick={addCategory}
        style={{
          width: '100%', padding: '11px', marginTop: '4px',
          background: '#F4EBD8', color: '#C9A35C',
          border: '1px dashed #E0C898', borderRadius: '10px',
          fontSize: '13px', fontWeight: '600', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
        }}
      >
        <Plus size={15} /> Adicionar Nova Categoria
      </button>
    </div>
  );
}
