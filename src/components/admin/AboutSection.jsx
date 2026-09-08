import React from 'react';

const inputStyle = {
  width: '100%', padding: '9px 12px',
  border: '1px solid #E3E8EF', borderRadius: '8px',
  fontSize: '13px', color: '#17345F',
  background: '#FAFBFC', outline: 'none',
  fontFamily: 'inherit',
  resize: 'vertical',
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

export default function AboutSection({ proposal, onChange }) {
  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 400 * 1024) {
      alert('Logo muito grande. Use uma imagem abaixo de 400KB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => onChange('logoBase64', ev.target.result);
    reader.readAsDataURL(file);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

      {/* Logo Upload */}
      <div>
        <Label>Logo da Empresa (PNG/JPG — máx 400KB)</Label>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
          {proposal.logoBase64 ? (
            <div style={{ position: 'relative' }}>
              <img
                src={proposal.logoBase64}
                alt="Logo preview"
                style={{ width: '70px', height: '70px', objectFit: 'contain', borderRadius: '8px', border: '1px solid #E3E8EF', background: '#F7F8FA', padding: '4px' }}
              />
              <button
                type="button"
                onClick={() => onChange('logoBase64', '')}
                style={{
                  position: 'absolute', top: '-6px', right: '-6px',
                  background: '#EF6464', color: '#fff', border: 'none',
                  borderRadius: '50%', width: '20px', height: '20px',
                  fontSize: '11px', cursor: 'pointer', display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                }}
                title="Remover logo"
              >×</button>
            </div>
          ) : (
            <div style={{
              width: '70px', height: '70px', borderRadius: '8px',
              border: '2px dashed #CBD5E1', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              color: '#94A3B8', fontSize: '24px',
            }}>🖼</div>
          )}
          <label style={{
            background: '#F4EBD8', color: '#C9A35C', border: '1px solid #E8D5B0',
            borderRadius: '8px', padding: '8px 14px', fontSize: '12px',
            fontWeight: '600', cursor: 'pointer',
          }}>
            {proposal.logoBase64 ? 'Substituir Logo' : 'Fazer Upload da Logo'}
            <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleLogoUpload} />
          </label>
        </div>
      </div>

      {/* Texto sobre nós */}
      <div>
        <Label>Texto Institucional (Sobre Nós)</Label>
        <textarea
          rows={5}
          style={inputStyle}
          placeholder="Na Camila's Cerimonial, nossa missão é transformar seus sonhos em realidade com sofisticação, organização impecável e carinho em cada detalhe..."
          value={proposal.aboutUs || ''}
          onChange={e => onChange('aboutUs', e.target.value)}
        />
        <p style={{ fontSize: '11px', color: '#94A3B8', marginTop: '4px' }}>
          {(proposal.aboutUs || '').length} caracteres
        </p>
      </div>

    </div>
  );
}
