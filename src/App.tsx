
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from "@/components/ui/sonner";
import { AppProvider } from '@/context/AppContext';
import { AuthProvider } from '@/context/AuthContext';
import MobileLayout from '@/components/layout/MobileLayout';
import ProtectedRoute from '@/components/layout/ProtectedRoute';

// Páginas
import Index from '@/pages/Index';
import Clients from '@/pages/Clients';
import ClientForm from '@/pages/ClientForm';
import ClientDetails from '@/pages/ClientDetails';
import PetForm from '@/pages/PetForm';
import Appointments from '@/pages/Appointments';
import NewAppointment from '@/pages/NewAppointment';
import PaymentScreen from '@/pages/PaymentScreen';
import CashRegister from '@/pages/CashRegister';
import Expenses from '@/pages/Expenses';
import History from '@/pages/History';
import ProductsServices from '@/pages/ProductsServices';
import Settings from '@/pages/Settings';
import NotFound from '@/pages/NotFound';
import Auth from '@/pages/Auth';

import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppProvider>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/" element={<Navigate to="/agendamentos" />} />
            
            <Route element={<ProtectedRoute><MobileLayout /></ProtectedRoute>}>
              <Route path="/inicio" element={<Index />} />
              <Route path="/clientes" element={<Clients />} />
              <Route path="/cliente/novo" element={<ClientForm />} />
              <Route path="/cliente/editar/:id" element={<ClientForm />} />
              <Route path="/cliente/:id" element={<ClientDetails />} />
              <Route path="/pet/novo/:clientId" element={<PetForm />} />
              <Route path="/pet/editar/:id" element={<PetForm />} />
              <Route path="/agendamentos" element={<Appointments />} />
              <Route path="/novo-agendamento" element={<NewAppointment />} />
              <Route path="/pagamento/:id" element={<PaymentScreen />} />
              <Route path="/caixa" element={<CashRegister />} />
              <Route path="/despesas" element={<Expenses />} />
              <Route path="/historico" element={<History />} />
              <Route path="/produtos-servicos" element={<ProductsServices />} />
              <Route path="/configuracoes" element={<Settings />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
          <Toaster />
        </AppProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
