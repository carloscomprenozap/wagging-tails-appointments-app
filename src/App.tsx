
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "@/context/AppContext";
import MobileLayout from "@/components/layout/MobileLayout";
import Index from "@/pages/Index";
import Appointments from "@/pages/Appointments";
import NewAppointment from "@/pages/NewAppointment";
import PaymentScreen from "@/pages/PaymentScreen";
import Clients from "@/pages/Clients";
import ClientForm from "@/pages/ClientForm";
import ClientDetails from "@/pages/ClientDetails";
import PetForm from "@/pages/PetForm";
import CashRegister from "@/pages/CashRegister";
import ProductsServices from "@/pages/ProductsServices";
import Expenses from "@/pages/Expenses";
import History from "@/pages/History";
import Settings from "@/pages/Settings";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AppProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<MobileLayout />}>
              <Route index element={<Index />} />
              <Route path="agendamentos" element={<Appointments />} />
              <Route path="novo-agendamento" element={<NewAppointment />} />
              <Route path="pagamento/:id" element={<PaymentScreen />} />
              <Route path="clientes" element={<Clients />} />
              <Route path="novo-cliente" element={<ClientForm />} />
              <Route path="editar-cliente/:id" element={<ClientForm />} />
              <Route path="cliente/:id" element={<ClientDetails />} />
              <Route path="novo-pet/:clientId?" element={<PetForm />} />
              <Route path="pet/:id" element={<PetForm />} />
              <Route path="caixa" element={<CashRegister />} />
              <Route path="produtos-servicos" element={<ProductsServices />} />
              <Route path="despesas" element={<Expenses />} />
              <Route path="historico" element={<History />} />
              <Route path="configuracoes" element={<Settings />} />
            </Route>
            
            {/* Catch-all route for 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AppProvider>
  </QueryClientProvider>
);

export default App;
