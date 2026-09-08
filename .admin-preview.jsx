import React from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter } from 'react-router-dom';
import AdminDashboard from './src/components/AdminDashboard';
import { defaultProposals } from './src/App';
import './src/App.css';
createRoot(document.getElementById('root')).render(<MemoryRouter><AdminDashboard proposals={defaultProposals} setProposals={() => {}} onLogout={() => {}} /></MemoryRouter>);
