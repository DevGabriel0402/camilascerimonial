import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebase';

import LandingPage from './components/LandingPage';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import ProposalPdfGenerator from './components/ProposalPdfGenerator';

const defaultProposals = {
  completa: {
    id: 'completa',
    title: 'Proposta Completa - Assessoria & Cerimonial',
    description: 'Acompanhamento total do evento do início ao fim, incluindo planejamento, reuniões com fornecedores, logística, cronograma e execução impecável no grande dia.',
    price: 'R$ 3.500,00',
    paymentTerms: 'Entrada de 20% na assinatura do contrato + saldo em até 10x sem juros ou quitado até 15 dias antes do evento.',
    items: [
      'Reuniões ilimitadas de planejamento',
      'Indicação e cotação de fornecedores parceiros',
      'Gestão do orçamento do evento',
      'Elaboração de cronograma detalhado do dia',
      'Ensaio dos noivos / debutante',
      'Equipe completa no dia do evento (cerimonialistas + recepcionistas)',
      'Coordenação de cortejo, fotos e valsa',
      'Resolução de imprevistos em tempo real'
    ]
  },
  cerimonial: {
    id: 'cerimonial',
    title: 'Proposta Cerimonial do Dia',
    description: 'Foco na execução do dia do evento para garantir que tudo saia exatamente como você planejou, cuidando da equipe, cronograma e recepção dos convidados.',
    price: 'R$ 2.000,00',
    paymentTerms: 'Entrada de 30% na assinatura + saldo quitado até 10 dias antes do evento.',
    items: [
      '02 reuniões de alinhamento final (30 dias antes)',
      'Alinhamento com os fornecedores contratados',
      'Elaboração e validação do cronograma do dia',
      'Equipe de Cerimonial no dia do evento',
      'Recepção de convidados e controle de entrada',
      'Organização do cortejo e protocolo da festa'
    ]
  }
};

export default function App() {
  const navigate = useNavigate();
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [proposals, setProposals] = useState(() => {
    const localData = localStorage.getItem('camilas_proposals');
    return localData ? JSON.parse(localData) : defaultProposals;
  });
  const [selectedPdfProposal, setSelectedPdfProposal] = useState(null);

  // Load latest proposals from Firebase Firestore if available
  useEffect(() => {
    const fetchFirebaseProposals = async () => {
      try {
        const completaDoc = await getDoc(doc(db, "proposals", "completa"));
        const cerimonialDoc = await getDoc(doc(db, "proposals", "cerimonial"));

        let updated = { ...proposals };
        if (completaDoc.exists()) {
          updated.completa = completaDoc.data();
        }
        if (cerimonialDoc.exists()) {
          updated.cerimonial = cerimonialDoc.data();
        }

        setProposals(updated);
        localStorage.setItem('camilas_proposals', JSON.stringify(updated));
      } catch (err) {
        console.warn('Usando propostas locais/fallback:', err);
      }
    };

    fetchFirebaseProposals();
  }, []);

  const handleSelectProposalForPdf = (type) => {
    if (proposals[type]) {
      setSelectedPdfProposal(proposals[type]);
    }
  };

  return (
    <div>
      {/* Modal viewer for proposal PDF on landing page */}
      {selectedPdfProposal && (
        <ProposalPdfGenerator
          proposal={selectedPdfProposal}
          onClose={() => setSelectedPdfProposal(null)}
        />
      )}

      <Routes>
        <Route
          path="/"
          element={
            <LandingPage
              proposals={proposals}
              onSelectProposalForPdf={handleSelectProposalForPdf}
            />
          }
        />
        
        <Route
          path="/admin"
          element={
            isAdminAuthenticated ? (
              <AdminDashboard
                proposals={proposals}
                setProposals={setProposals}
                onLogout={() => {
                  setIsAdminAuthenticated(false);
                  navigate('/');
                }}
              />
            ) : (
              <AdminLogin
                onLoginSuccess={() => setIsAdminAuthenticated(true)}
              />
            )
          }
        />
      </Routes>
    </div>
  );
}
