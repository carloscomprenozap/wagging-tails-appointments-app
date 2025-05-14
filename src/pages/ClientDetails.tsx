
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAppContext } from '@/context/AppContext';
import PageHeader from '@/components/layout/PageHeader';
import TabView from '@/components/common/TabView';
import EmptyState from '@/components/common/EmptyState';
import { formatPhone, formatDate, openWhatsApp } from '@/utils/helpers';
import { MapPin, Edit, PhoneCall, MessageSquare, Plus, Calendar } from 'lucide-react';
import { toast } from 'sonner';

const ClientDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { 
    getClientById, 
    getPetsByClientId, 
    getAppointmentsByClientId,
    getSalesByClientId,
    settlePendingPayment
  } = useAppContext();
  
  const [client, setClient] = useState(id ? getClientById(id) : undefined);
  const [clientPets, setClientPets] = useState(id ? getPetsByClientId(id) : []);
  const [clientAppointments, setClientAppointments] = useState(id ? getAppointmentsByClientId(id) : []);
  const [clientSales, setClientSales] = useState(id ? getSalesByClientId(id) : []);
  
  // Update data when context changes
  useEffect(() => {
    if (id) {
      setClient(getClientById(id));
      setClientPets(getPetsByClientId(id));
      setClientAppointments(getAppointmentsByClientId(id));
      setClientSales(getSalesByClientId(id));
    }
  }, [id, getClientById, getPetsByClientId, getAppointmentsByClientId, getSalesByClientId]);
  
  // Handle payment of pending balance
  const handlePayPendingBalance = () => {
    if (!client || client.pendingBalance <= 0) return;
    
    settlePendingPayment(client.id, client.pendingBalance, 'cash');
    toast.success('Pagamento do saldo pendente registrado com sucesso!');
  };
  
  if (!client || !id) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-gray-500">Cliente não encontrado</p>
          <Button 
            variant="link" 
            className="mt-2"
            onClick={() => navigate('/clientes')}
          >
            Voltar para clientes
          </Button>
        </div>
      </div>
    );
  }
  
  // Render client info
  const renderClientInfo = () => (
    <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-semibold">{client.name}</h2>
          <p className="text-sm text-gray-600">{formatPhone(client.phone)}</p>
          {client.email && (
            <p className="text-sm text-gray-600">{client.email}</p>
          )}
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={() => navigate(`/editar-cliente/${client.id}`)}
        >
          <Edit size={14} className="mr-1" /> Editar
        </Button>
      </div>
      
      <div className="mt-4 flex items-start text-sm text-gray-600">
        <MapPin size={16} className="mr-1 mt-0.5 flex-shrink-0" />
        <span>
          {client.address}, {client.neighborhood}, {client.city}
        </span>
      </div>
      
      {client.notes && (
        <div className="mt-3 p-3 bg-gray-50 rounded-md text-sm">
          <p className="text-gray-700">{client.notes}</p>
        </div>
      )}
      
      {client.pendingBalance > 0 && (
        <div className="mt-3 bg-yellow-50 p-3 rounded-md flex justify-between items-center">
          <div>
            <p className="text-yellow-800 font-medium">
              Saldo pendente: {client.pendingBalance.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </p>
          </div>
          <Button 
            size="sm"
            variant="outline"
            onClick={handlePayPendingBalance}
          >
            Quitar
          </Button>
        </div>
      )}
      
      <div className="mt-4 grid grid-cols-2 gap-2">
        <Button 
          size="sm" 
          variant="outline"
          className="w-full"
          onClick={() => window.location.href = `tel:${client.phone}`}
        >
          <PhoneCall size={16} className="mr-1" /> Ligar
        </Button>
        <Button 
          size="sm" 
          variant="outline"
          className="w-full"
          onClick={() => openWhatsApp(client.phone, `Olá ${client.name}, `)}
        >
          <MessageSquare size={16} className="mr-1" /> WhatsApp
        </Button>
      </div>
    </div>
  );
  
  // Render pets tab
  const renderPetsTab = () => (
    <div>
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-medium">Pets</h3>
        <Button 
          size="sm"
          variant="outline"
          onClick={() => navigate(`/novo-pet/${client.id}`)}
        >
          <Plus size={14} className="mr-1" /> Novo Pet
        </Button>
      </div>
      
      {clientPets.length === 0 ? (
        <EmptyState
          title="Nenhum pet cadastrado"
          description="Cadastre pets para este cliente."
          action={
            <Button onClick={() => navigate(`/novo-pet/${client.id}`)} size="sm">
              <Plus size={16} className="mr-1" /> Adicionar Pet
            </Button>
          }
        />
      ) : (
        <div className="space-y-3">
          {clientPets.map(pet => (
            <div 
              key={pet.id} 
              className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium">{pet.name}</h4>
                  <p className="text-sm text-gray-600">
                    {pet.species} - {pet.breed}
                  </p>
                </div>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => navigate(`/pet/${pet.id}`)}
                >
                  Detalhes
                </Button>
              </div>
              
              <div className="mt-2 flex flex-wrap gap-2">
                {pet.age && (
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                    {pet.age} anos
                  </span>
                )}
                {pet.weight && (
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                    {pet.weight} kg
                  </span>
                )}
              </div>
              
              {pet.notes && (
                <p className="text-sm text-gray-600 mt-2 bg-gray-50 p-2 rounded">
                  {pet.notes}
                </p>
              )}
              
              <div className="mt-3 pt-2 border-t border-gray-100">
                <Button 
                  size="sm"
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate('/novo-agendamento', { state: { clientId: client.id, petId: pet.id } })}
                >
                  <Calendar size={14} className="mr-1" /> Agendar Serviço
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
  
  // Render history tab
  const renderHistoryTab = () => (
    <div>
      <div className="mb-4">
        <h3 className="font-medium mb-2">Histórico de Atendimentos</h3>
        
        {clientAppointments.length === 0 ? (
          <p className="text-sm text-gray-500">Nenhum atendimento registrado.</p>
        ) : (
          <div className="space-y-3">
            {clientAppointments.map(appointment => {
              const pet = clientPets.find(p => p.id === appointment.petId);
              
              return (
                <div 
                  key={appointment.id} 
                  className="bg-white border border-gray-200 rounded-lg p-3 text-sm"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-medium">{formatDate(appointment.date)}</span>
                      <span className="text-gray-500 mx-1">•</span>
                      <span>{appointment.time}</span>
                    </div>
                    <div className={`px-2 py-0.5 rounded-full text-xs ${
                      appointment.status === 'agendado' ? 'bg-yellow-100 text-yellow-800' :
                      appointment.status === 'confirmado' ? 'bg-blue-100 text-blue-800' :
                      appointment.status === 'para_retirar' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {appointment.status === 'agendado' ? 'Agendado' :
                       appointment.status === 'confirmado' ? 'Confirmado' :
                       appointment.status === 'para_retirar' ? 'Para Retirar' : 'Finalizado'}
                    </div>
                  </div>
                  
                  <p className="mt-1">
                    Pet: <span className="font-medium">{pet?.name}</span>
                  </p>
                  
                  <div className="mt-2 flex justify-between">
                    <span>Valor: {appointment.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                    <span className={`${
                      appointment.paid ? 'text-green-600' : 'text-yellow-600'
                    }`}>
                      {appointment.paid ? 'Pago' : 'Pendente'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      
      <div>
        <h3 className="font-medium mb-2">Histórico de Compras</h3>
        
        {clientSales.length === 0 ? (
          <p className="text-sm text-gray-500">Nenhuma compra registrada.</p>
        ) : (
          <div className="space-y-3">
            {clientSales.map(sale => (
              <div 
                key={sale.id} 
                className="bg-white border border-gray-200 rounded-lg p-3 text-sm"
              >
                <div className="flex justify-between items-start">
                  <span className="font-medium">{formatDate(sale.date)}</span>
                  <span className={`${
                    sale.paid ? 'text-green-600' : 'text-yellow-600'
                  }`}>
                    {sale.paid ? 'Pago' : 'Pendente'}
                  </span>
                </div>
                
                <div className="mt-2">
                  {sale.products.map((product, idx) => (
                    <div key={idx} className="flex justify-between text-xs py-1">
                      <span>{product.quantity}x Produto</span>
                      <span>{product.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                    </div>
                  ))}
                  <div className="border-t border-gray-100 mt-1 pt-1 flex justify-between font-medium">
                    <span>Total</span>
                    <span>{sale.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div>
      <PageHeader title="Detalhes do Cliente" showBackButton />
      
      {renderClientInfo()}
      
      <TabView
        tabs={[
          {
            id: 'pets',
            title: 'Pets',
            content: renderPetsTab()
          },
          {
            id: 'history',
            title: 'Histórico',
            content: renderHistoryTab()
          }
        ]}
      />
    </div>
  );
};

export default ClientDetails;
