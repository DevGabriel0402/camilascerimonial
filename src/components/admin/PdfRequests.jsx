import { CalendarDays, FileText, Mail, Phone, Users } from 'lucide-react';

const serviceLabel = request => request.serviceType || (request.proposalType === 'completa' ? 'Assessoria e Cerimonial Completo' : 'Cerimonial');

const formatDate = value => {
  if (!value) return 'Agora mesmo';
  const date = typeof value.toDate === 'function' ? value.toDate() : new Date(value);
  return Number.isNaN(date.getTime()) ? 'Agora mesmo' : date.toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
};

export default function PdfRequests({ requests, loading, error }) {
  if (loading) return <div className="pdf-requests-empty">Carregando solicitações...</div>;
  if (error) return <div className="pdf-requests-empty pdf-requests-error">{error}</div>;
  if (!requests.length) return <div className="pdf-requests-empty">Ainda não há PDFs gerados pelo site.</div>;

  return (
    <section className="pdf-requests" aria-label="Solicitações de PDF">
      <div className="pdf-requests-summary"><FileText size={19} /><span>{requests.length} {requests.length === 1 ? 'solicitação registrada' : 'solicitações registradas'}</span></div>
      <div className="pdf-requests-list">
        {requests.map(request => (
          <article key={request.id} className="pdf-request-card">
            <div className="pdf-request-card-header"><div><strong>{request.clientName || 'Cliente não informado'}</strong><span>{serviceLabel(request)}</span></div><time><CalendarDays size={15} />{formatDate(request.createdAt)}</time></div>
            <div className="pdf-request-details">
              <span><Phone size={16} />{request.clientPhone || 'Telefone não informado'}</span>
              {request.clientEmail && <span><Mail size={16} />{request.clientEmail}</span>}
              <span><Users size={16} />{request.guestRange || 'Convidados não informados'}</span>
            </div>
            <div className="pdf-request-footer"><span>CPF: {request.clientCpf || 'Não informado'}</span><span>{request.proposalTitle || 'Proposta comercial'}</span></div>
          </article>
        ))}
      </div>
    </section>
  );
}
