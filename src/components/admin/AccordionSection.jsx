// Accordion reutilizável com toggle habilitar/desabilitar
import React from 'react';
import { ChevronDown, ChevronUp, Eye, EyeOff } from 'lucide-react';

export default function AccordionSection({
  number,
  icon,
  title,
  isOpen,
  onToggle,
  enabled = true,
  onToggleEnabled,
  children,
  accentColor = '#C9A35C',
}) {
  return (
    <div style={{
      background: '#FFFFFF',
      border: '1px solid #E3E8EF',
      borderRadius: '12px',
      marginBottom: '12px',
      overflow: 'hidden',
      opacity: enabled ? 1 : 0.65,
      transition: 'opacity 0.2s',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        padding: '14px 18px',
        cursor: 'pointer',
        background: isOpen ? '#FAFBFC' : '#FFFFFF',
        borderBottom: isOpen ? '1px solid #E3E8EF' : 'none',
        userSelect: 'none',
      }}>
        {/* Left: icon + number + title */}
        <div
          style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}
          onClick={onToggle}
        >
          <div style={{
            width: '32px', height: '32px', borderRadius: '8px',
            background: enabled ? '#F4EBD8' : '#F1F5F9',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <span style={{ fontSize: '16px' }}>{icon}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
            <span style={{
              fontSize: '10px', fontWeight: '700', color: accentColor,
              textTransform: 'uppercase', letterSpacing: '1px',
            }}>
              {String(number).padStart(2, '0')}
            </span>
            <h3 style={{
              margin: 0, fontSize: '14px', fontWeight: '600',
              color: enabled ? '#17345F' : '#94A3B8',
            }}>
              {title}
            </h3>
          </div>
        </div>

        {/* Right: enable toggle + chevron */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {onToggleEnabled && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onToggleEnabled(); }}
              title={enabled ? 'Seção habilitada no PDF — clique para desabilitar' : 'Seção desabilitada no PDF — clique para habilitar'}
              style={{
                background: enabled ? '#E6F4EE' : '#F1F5F9',
                border: `1px solid ${enabled ? '#A7E3C4' : '#CBD5E1'}`,
                color: enabled ? '#16A36A' : '#94A3B8',
                borderRadius: '6px', padding: '4px 10px',
                fontSize: '11px', fontWeight: '600',
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px',
                whiteSpace: 'nowrap',
              }}
            >
              {enabled
                ? <><Eye size={12} /> No PDF</>
                : <><EyeOff size={12} /> Oculto</>
              }
            </button>
          )}
          <div onClick={onToggle} style={{ color: '#94A3B8', display: 'flex' }}>
            {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </div>
        </div>
      </div>

      {/* Body */}
      {isOpen && (
        <div style={{ padding: '20px 18px' }}>
          {children}
        </div>
      )}
    </div>
  );
}
