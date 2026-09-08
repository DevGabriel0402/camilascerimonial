import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { db, auth } from './firebase';

import LandingPage from './components/LandingPage';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import ProposalPdfGenerator from './components/ProposalPdfGenerator';

export const defaultProposals = {
  completa: {
    id: 'completa',
    title: 'Proposta Completa - Assessoria & Cerimonial',
    clientName: 'Noivos Especial',
    clientCpfCnpj: '',
    clientPhone: '',
    eventDate: 'A definir',
    eventType: 'Casamento',
    guestCount: '150',
    aboutUs: 'Na Camila\'s Cerimonial, nossa missão é transformar seus sonhos em realidade com sofisticação, organização impecável e carinho em cada detalhe. Acompanhamos o seu evento desde o primeiro planejamento até a última música da festa.',
    categorizedItems: [
      {
        id: 'cat_1',
        category: '1. Planejamento & Assessoria Pré-Evento',
        subitems: [
          { id: 'sub_1', name: 'Reuniões ilimitadas de planejamento presencial/online', selected: true },
          { id: 'sub_2', name: 'Indicação e cotação detalhada de fornecedores parceiros', selected: true },
          { id: 'sub_3', name: 'Análise de contratos e gestão do orçamento', selected: true },
          { id: 'sub_4', name: 'Elaboração do cronograma oficial do dia', selected: true }
        ]
      },
      {
        id: 'cat_2',
        category: '2. Cerimonial & Execução no Dia',
        subitems: [
          { id: 'sub_5', name: 'Ensaio técnico dos noivos e padrinhos', selected: true },
          { id: 'sub_6', name: 'Equipe de cerimonialistas treinada no local', selected: true },
          { id: 'sub_7', name: 'Coordenação de cortejo, protocolo de fotos e valsa', selected: true },
          { id: 'sub_8', name: 'Recepção de convidados e controle de entrada', selected: true },
          { id: 'sub_9', name: 'Resolução de imprevistos e gestão da equipe de apoio', selected: true }
        ]
      }
    ],
    pricingByGuests: {
      guestCount: '150',
      finalPrice: 'R$ 3.500,00',
      tiers: []
    },
    price: 'R$ 3.500,00',
    paymentOptions: {
      terms: 'Entrada de 20% na assinatura do contrato + saldo parcelado em até 10x sem juros ou quitado até 15 dias antes do evento.',
      methods: [
        { id: 'pix', type: 'pix', label: 'Pix / À Vista', details: 'Desconto de 5% para pagamento à vista.', enabled: true },
        { id: 'card', type: 'card', label: 'Cartão de Crédito', details: 'Parcelamento em até 10x no cartão.', enabled: true },
        { id: 'bank', type: 'bank', label: 'Boleto / Transferência', details: 'Parcelamento mensal direto sem juros.', enabled: true }
      ]
    },
    finalGreeting: {
      message: 'Estamos ansiosos e honrados em fazer parte desse capítulo inesquecível da sua história! Conte com toda a nossa dedicação.',
      validity: 'Esta proposta comercial é válida por 15 dias a partir da data de emissão.'
    }
  },
  cerimonial: {
    id: 'cerimonial',
    title: 'Proposta Cerimonial do Dia',
    clientName: 'Cliente Especial',
    clientCpfCnpj: '',
    clientPhone: '',
    eventDate: 'A definir',
    eventType: 'Casamento / 15 Anos',
    guestCount: '150',
    aboutUs: 'A Camila\'s Cerimonial garante a execução perfeita do seu grande dia. Cuidamos do cronograma, fornecedores e convidados para que você aproveite cada segundo sem preocupações.',
    categorizedItems: [
      {
        id: 'cat_1',
        category: '1. Alinhamento Final (30 Dias Antes)',
        subitems: [
          { id: 'sub_1', name: '02 reuniões presenciais/online de alinhamento', selected: true },
          { id: 'sub_2', name: 'Contato e alinhamento prévio com todos os fornecedores contratados', selected: true },
          { id: 'sub_3', name: 'Validação e envio do cronograma para a equipe do evento', selected: true }
        ]
      },
      {
        id: 'cat_2',
        category: '2. Execução no Dia do Evento',
        subitems: [
          { id: 'sub_4', name: 'Equipe de Cerimonial dedicada no dia', selected: true },
          { id: 'sub_5', name: 'Organização do cortejo e protocolo da festa', selected: true },
          { id: 'sub_6', name: 'Recepção de convidados e conferência de lista', selected: true },
          { id: 'sub_7', name: 'Supervisão do cumprimento do cronograma', selected: true }
        ]
      }
    ],
    pricingByGuests: {
      guestCount: '150',
      finalPrice: 'R$ 2.000,00',
      tiers: []
    },
    price: 'R$ 2.000,00',
    paymentOptions: {
      terms: 'Entrada de 30% na assinatura do contrato + saldo quitado em até 10 dias antes do evento.',
      methods: [
        { id: 'pix', type: 'pix', label: 'Pix / À Vista', details: 'Chave Pix da empresa com confirmação imediata.', enabled: true },
        { id: 'card', type: 'card', label: 'Cartão de Crédito', details: 'Parcelamento disponível.', enabled: true },
        { id: 'bank', type: 'bank', label: 'Boleto / Transferência', details: 'Boleto bancário mensal.', enabled: true }
      ]
    },
    finalGreeting: {
      message: 'Será uma imensa alegria cuidar de cada detalhe do seu evento com todo o nosso profissionalismo e carinho!',
      validity: 'Esta proposta comercial é válida por 15 dias a partir da data de emissão.'
    }
  }
};

export default function App() {
  const navigate = useNavigate();
  const [adminUser, setAdminUser] = useState(null);
  const [proposals, setProposals] = useState(() => {
    const localData = localStorage.getItem('camilas_proposals_v3');
    return localData ? JSON.parse(localData) : defaultProposals;
  });
  const [selectedPdfProposal, setSelectedPdfProposal] = useState(null);

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setAdminUser(user);
    });
    return () => unsubscribe();
  }, []);

  // Load latest proposals from Firebase Firestore if available
  useEffect(() => {
    const fetchFirebaseProposals = async () => {
      try {
        const completaDoc = await getDoc(doc(db, "proposals", "completa"));
        const cerimonialDoc = await getDoc(doc(db, "proposals", "cerimonial"));

        let updated = { ...proposals };
        if (completaDoc.exists()) {
          updated.completa = { ...defaultProposals.completa, ...completaDoc.data() };
        }
        if (cerimonialDoc.exists()) {
          updated.cerimonial = { ...defaultProposals.cerimonial, ...cerimonialDoc.data() };
        }

        setProposals(updated);
        localStorage.setItem('camilas_proposals_v3', JSON.stringify(updated));
      } catch (err) {
        console.warn('Usando propostas locais:', err);
      }
    };

    fetchFirebaseProposals();
  }, []);

  const handleSelectProposalForPdf = (proposalOrType) => {
    // Accepts either a full proposal object (from LandingPage with client data)
    // or a string key (from AdminDashboard)
    if (typeof proposalOrType === 'string') {
      if (proposals[proposalOrType]) {
        setSelectedPdfProposal(proposals[proposalOrType]);
      }
    } else if (proposalOrType && typeof proposalOrType === 'object') {
      setSelectedPdfProposal(proposalOrType);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setAdminUser(null);
      navigate('/');
    } catch (err) {
      console.error('Erro ao sair:', err);
    }
  };

  return (
    <div>
      {/* Modal viewer for proposal PDF */}
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
            adminUser ? (
              <AdminDashboard
                proposals={proposals}
                setProposals={setProposals}
                onLogout={handleLogout}
              />
            ) : (
              <AdminLogin
                onLoginSuccess={() => {}}
              />
            )
          }
        />
      </Routes>
    </div>
  );
}
