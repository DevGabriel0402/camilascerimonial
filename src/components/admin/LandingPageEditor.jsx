import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { galleryPhotos } from '../../siteContent';

const Field = ({ label, children }) => <label className="site-editor-field"><span>{label}</span>{children}</label>;

export default function LandingPageEditor({ content, onChange }) {
  const update = (field, value) => onChange({ ...content, [field]: value });
  const updateStat = (index, field, value) => update('stats', content.stats.map((item, itemIndex) => itemIndex === index ? { ...item, [field]: value } : item));
  const updateGallery = (index, field, value) => update('gallery', content.gallery.map((item, itemIndex) => itemIndex === index ? { ...item, [field]: value } : item));

  return (
    <form id="admin-site-form" className="site-editor" onSubmit={event => { event.preventDefault(); onChange(content, true); }}>
      <section className="site-editor-card">
        <h2>Marca e apresentação</h2>
        <div className="site-editor-grid">
          <Field label="Nome da marca"><input value={content.brandName} onChange={event => update('brandName', event.target.value)} /></Field>
          <Field label="URL do logo (opcional)"><input type="url" placeholder="https://..." value={content.logoUrl || ''} onChange={event => update('logoUrl', event.target.value)} /></Field>
          <Field label="Texto do botão principal"><input value={content.contactButton} onChange={event => update('contactButton', event.target.value)} /></Field>
          <Field label="Título — primeira parte"><input value={content.heroLead} onChange={event => update('heroLead', event.target.value)} /></Field>
          <Field label="Título — destaque dourado"><input value={content.heroAccent} onChange={event => update('heroAccent', event.target.value)} /></Field>
          <Field label="Descrição principal"><textarea rows="3" value={content.heroSubtitle} onChange={event => update('heroSubtitle', event.target.value)} /></Field>
          <Field label="Texto da faixa animada"><textarea rows="3" value={content.marqueeText} onChange={event => update('marqueeText', event.target.value)} /></Field>
        </div>
      </section>

      <section className="site-editor-card">
        <h2>Números em destaque</h2>
        <div className="site-editor-grid site-editor-stat-grid">
          {content.stats.map((item, index) => <React.Fragment key={index}>
            <Field label={`Número ${index + 1}`}><input value={item.value} onChange={event => updateStat(index, 'value', event.target.value)} /></Field>
            <Field label={`Legenda ${index + 1}`}><input value={item.label} onChange={event => updateStat(index, 'label', event.target.value)} /></Field>
          </React.Fragment>)}
        </div>
      </section>

      <section className="site-editor-card">
        <h2>Galeria</h2>
        <div className="site-editor-grid">
          <Field label="Etiqueta da galeria"><input value={content.galleryTag} onChange={event => update('galleryTag', event.target.value)} /></Field>
          <Field label="Título — primeira parte"><input value={content.galleryLead} onChange={event => update('galleryLead', event.target.value)} /></Field>
          <Field label="Título — destaque"><input value={content.galleryAccent} onChange={event => update('galleryAccent', event.target.value)} /></Field>
        </div>
        <div className="site-editor-gallery">
          {content.gallery.map((item, index) => <div className="site-editor-gallery-row" key={`${item.photo}-${index}`}>
            <Field label={`Foto ${index + 1}`}><select value={item.photo} onChange={event => updateGallery(index, 'photo', event.target.value)}>{galleryPhotos.map(photo => <option value={photo} key={photo}>Imagem {photo}</option>)}</select></Field>
            <Field label="Descrição alternativa"><input value={item.title} onChange={event => updateGallery(index, 'title', event.target.value)} /></Field>
            <button type="button" className="site-editor-remove" aria-label={`Remover foto ${index + 1}`} disabled={content.gallery.length === 1} onClick={() => update('gallery', content.gallery.filter((_, itemIndex) => itemIndex !== index))}><Trash2 size={16} /></button>
          </div>)}
        </div>
        <button type="button" className="workspace-button workspace-button-secondary" onClick={() => update('gallery', [...content.gallery, { photo: '01', title: 'Novo momento especial' }])}><Plus size={16} /> Adicionar foto</button>
      </section>

      <section className="site-editor-card">
        <h2>Propostas e contato</h2>
        <div className="site-editor-grid">
          <Field label="Etiqueta das propostas"><input value={content.packagesTag} onChange={event => update('packagesTag', event.target.value)} /></Field>
          <Field label="Título — primeira parte"><input value={content.packagesLead} onChange={event => update('packagesLead', event.target.value)} /></Field>
          <Field label="Título — destaque"><input value={content.packagesAccent} onChange={event => update('packagesAccent', event.target.value)} /></Field>
          <Field label="Selo da proposta completa"><input value={content.completeBadge} onChange={event => update('completeBadge', event.target.value)} /></Field>
          <Field label="Botão da proposta completa"><input value={content.completeButton} onChange={event => update('completeButton', event.target.value)} /></Field>
          <Field label="Botão do cerimonial"><input value={content.ceremonyButton} onChange={event => update('ceremonyButton', event.target.value)} /></Field>
          <Field label="Título da chamada flutuante"><input value={content.calloutTitle} onChange={event => update('calloutTitle', event.target.value)} /></Field>
          <Field label="Texto da chamada flutuante"><input value={content.calloutText} onChange={event => update('calloutText', event.target.value)} /></Field>
          <Field label="Botão da chamada flutuante"><input value={content.calloutButton} onChange={event => update('calloutButton', event.target.value)} /></Field>
          <Field label="WhatsApp com DDD, apenas números"><input inputMode="numeric" value={content.whatsappPhone} onChange={event => update('whatsappPhone', event.target.value.replace(/\D/g, ''))} /></Field>
        </div>
      </section>

      <section className="site-editor-card">
        <h2>Rodapé</h2>
        <div className="site-editor-grid">
          <Field label="Texto de direitos"><input value={content.footerText} onChange={event => update('footerText', event.target.value)} /></Field>
          <Field label="Nome do desenvolvedor"><input value={content.developerName} onChange={event => update('developerName', event.target.value)} /></Field>
          <Field label="Link do desenvolvedor"><input type="url" value={content.developerUrl} onChange={event => update('developerUrl', event.target.value)} /></Field>
        </div>
      </section>
    </form>
  );
}
