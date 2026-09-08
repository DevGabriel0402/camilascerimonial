import React from 'react';
import { maskPhone, maskCPFOrCNPJ, maskDate } from '../../utils/masks';

const Label = ({ children }) => (
  <label style={{
    display: 'block', fontSize: '11px', fontWeight: '600',
    color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.6px',
    marginBottom: '5px',
  }}>
    {children}
  </label>
);

const Field = ({ children, style = {} }) => (
  <div style={{ marginBottom: '0', ...style }}>{children}</div>
);

const inputStyle = {
  width: '100%', padding: '9px 12px',
  border: '1px solid #E3E8EF', borderRadius: '8px',
  fontSize: '13px', color: '#17345F',
  background: '#FAFBFC', outline: 'none',
  fontFamily: 'inherit',
};

export default function ClientSection({ proposal, onChange }) {
  const set = (field, value) => onChange(field, value);

  const EVENT_TYPES = ['Casamento', '15 Anos', 'Corporativo', 'Social', 'Outro'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

      {/* Título da proposta */}
      <Field>
        <Label>Título da Proposta</Label>
        <input
          style={inputStyle}
          type="text"
          value={proposal.title || ''}
          onChange={e => set('title', e.target.value)}
          placeholder="Ex: Proposta Completa – Assessoria & Cerimonial"
        />
      </Field>

      {/* Grid 2 cols */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
        <Field>
          <Label>Nome do Cliente / Noivos *</Label>
          <input
            style={inputStyle}
            type="text"
            placeholder="Ex: Maria & João"
            value={proposal.clientName || ''}
            onChange={e => set('clientName', e.target.value)}
          />
        </Field>

        <Field>
          <Label>CPF ou CNPJ</Label>
          <input
            style={inputStyle}
            type="text"
            placeholder="000.000.000-00"
            value={proposal.clientCpfCnpj || ''}
            onChange={e => set('clientCpfCnpj', maskCPFOrCNPJ(e.target.value))}
          />
        </Field>

        <Field>
          <Label>WhatsApp / Telefone</Label>
          <input
            style={inputStyle}
            type="text"
            placeholder="(31) 98516-5246"
            value={proposal.clientPhone || ''}
            onChange={e => set('clientPhone', maskPhone(e.target.value))}
          />
        </Field>

        <Field>
          <Label>E-mail</Label>
          <input
            style={inputStyle}
            type="email"
            placeholder="cliente@email.com"
            value={proposal.clientEmail || ''}
            onChange={e => set('clientEmail', e.target.value)}
          />
        </Field>

        <Field>
          <Label>Data do Evento</Label>
          <input
            style={inputStyle}
            type="text"
            placeholder="DD/MM/AAAA"
            value={proposal.eventDate || ''}
            onChange={e => set('eventDate', maskDate(e.target.value))}
          />
        </Field>

        <Field>
          <Label>Horário do Evento</Label>
          <input
            style={inputStyle}
            type="text"
            placeholder="Ex: 17h00"
            value={proposal.eventTime || ''}
            onChange={e => set('eventTime', e.target.value)}
          />
        </Field>

        <Field style={{ gridColumn: 'span 2' }}>
          <Label>Local do Evento</Label>
          <input
            style={inputStyle}
            type="text"
            placeholder="Ex: Fazenda Vale Verde, Belo Horizonte – MG"
            value={proposal.eventLocation || ''}
            onChange={e => set('eventLocation', e.target.value)}
          />
        </Field>

        <Field>
          <Label>Tipo de Evento</Label>
          <select
            style={{ ...inputStyle, cursor: 'pointer' }}
            value={proposal.eventType || 'Casamento'}
            onChange={e => set('eventType', e.target.value)}
          >
            {EVENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </Field>
      </div>

    </div>
  );
}
