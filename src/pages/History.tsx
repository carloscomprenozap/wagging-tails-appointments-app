
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '@/components/layout/PageHeader';
import { formatDate, formatCurrency } from '@/utils/helpers';
import { Search } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';

const History: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [appointments, setAppointments] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [pets, setPets] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Buscar apenas agendamentos finalizados
        const { data: appointmentsData, error: appointmentsError } = await supabase
          .from('appointments')
          .select('*')
          .eq('status', 'finalizado');
        
        if (appointmentsError) throw appointmentsError;
        
        // Buscar clientes e pets para exibição
        const { data: clientsData, error: clientsError } = await supabase
          .from('clients')
          .select('*');
        
        if (clientsError) throw clientsError;
        
        const { data: petsData, error: petsError } = await supabase
          .from('pets')
          .select('*');
        
        if (petsError) throw petsError;
        
        setAppointments(appointmentsData || []);
        setClients(clientsData || []);
        setPets(petsData || []);
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Erro ao carregar histórico",
          description: error.message || "Ocorreu um erro ao buscar os dados.",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Helper functions to get client and pet info
  const getClientById = (id: string) => clients.find(client => client.id === id);
  const getPetById = (id: string) => pets.find(pet => pet.id === id);
  
  // Filter appointments based on search term
  const filteredAppointments = appointments.filter(app => {
    const client = getClientById(app.client_id);
    const pet = getPetById(app.pet_id);
    
    const searchString = `${client?.name || ''} ${pet?.name || ''} ${pet?.breed || ''} ${app.date}`.toLowerCase();
    
    return searchString.includes(searchTerm.toLowerCase());
  });
  
  // Sort appointments by date (most recent first)
  const sortedAppointments = [...filteredAppointments].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
  
  return (
    <div>
      <PageHeader title="Histórico" />
      
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por cliente, pet ou data..."
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md"
          />
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-petblue-DEFAULT"></div>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="grid grid-cols-[auto,1fr,auto,auto] gap-2 p-3 bg-gray-50 border-b border-gray-200 text-sm font-medium text-gray-600">
            <div>Data</div>
            <div>Cliente / Pet</div>
            <div>Valor</div>
            <div>Pagamento</div>
          </div>
          <div className="divide-y divide-gray-100">
            {sortedAppointments.map((appointment) => {
              const client = getClientById(appointment.client_id);
              const pet = getPetById(appointment.pet_id);
              
              return (
                <div key={appointment.id} className="p-3 hover:bg-gray-50">
                  <div className="grid grid-cols-[auto,1fr,auto,auto] gap-4 items-center">
                    <div className="whitespace-nowrap">{formatDate(appointment.date)}</div>
                    <div>
                      <div className="font-medium">{client?.name || 'Cliente não encontrado'}</div>
                      <div className="text-xs text-gray-500">
                        {pet?.name || 'Pet não encontrado'} 
                        {pet?.breed ? ` (${pet.breed})` : ''}
                      </div>
                    </div>
                    <div className="font-medium">{appointment.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div>
                    <div>
                      <span className={`px-2 py-0.5 rounded-full text-xs ${
                        appointment.paid 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {appointment.paid 
                          ? appointment.payment_method === 'credit' ? 'Crédito'
                            : appointment.payment_method === 'debit' ? 'Débito'
                            : appointment.payment_method === 'cash' ? 'Dinheiro'
                            : appointment.payment_method === 'pix' ? 'PIX'
                            : 'Pago'
                          : 'Pendente'
                        }
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
            
            {sortedAppointments.length === 0 && (
              <div className="py-8 text-center text-gray-500">
                {searchTerm 
                  ? 'Nenhum atendimento encontrado para a pesquisa.'
                  : 'Nenhum atendimento concluído no histórico.'}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default History;
