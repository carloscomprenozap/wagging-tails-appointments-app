
import React, { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import PageHeader from '@/components/layout/PageHeader';
import { formatDate, formatCurrency } from '@/utils/helpers';
import { Search } from 'lucide-react';

const History: React.FC = () => {
  const { 
    appointments, 
    clients,
    pets,
    getClientById,
    getPetById
  } = useAppContext();
  
  const [searchTerm, setSearchTerm] = useState('');
  
  // Get only finalized appointments
  const completedAppointments = appointments.filter(app => app.status === 'finalizado');
  
  // Filter appointments based on search term
  const filteredAppointments = completedAppointments.filter(app => {
    const client = getClientById(app.clientId);
    const pet = getPetById(app.petId);
    
    const searchString = `${client?.name || ''} ${pet?.name || ''} ${pet?.breed || ''} ${formatDate(app.date)}`.toLowerCase();
    
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
      
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="grid grid-cols-[auto,1fr,auto,auto] gap-2 p-3 bg-gray-50 border-b border-gray-200 text-sm font-medium text-gray-600">
          <div>Data</div>
          <div>Cliente / Pet</div>
          <div>Valor</div>
          <div>Pagamento</div>
        </div>
        <div className="divide-y divide-gray-100">
          {sortedAppointments.map((appointment) => {
            const client = getClientById(appointment.clientId);
            const pet = getPetById(appointment.petId);
            
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
                  <div className="font-medium">{formatCurrency(appointment.price)}</div>
                  <div>
                    <span className={`px-2 py-0.5 rounded-full text-xs ${
                      appointment.paid 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {appointment.paid 
                        ? appointment.paymentMethod === 'credit' ? 'Crédito'
                          : appointment.paymentMethod === 'debit' ? 'Débito'
                          : appointment.paymentMethod === 'cash' ? 'Dinheiro'
                          : appointment.paymentMethod === 'pix' ? 'PIX'
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
    </div>
  );
};

export default History;
