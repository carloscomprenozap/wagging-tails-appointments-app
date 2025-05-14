
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAppContext } from '@/context/AppContext';
import PageHeader from '@/components/layout/PageHeader';
import EmptyState from '@/components/common/EmptyState';
import TabView from '@/components/common/TabView';
import { formatPhone } from '@/utils/helpers';
import { Plus, Search, User, MapPin, Phone, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';

const Clients: React.FC = () => {
  const navigate = useNavigate();
  const { clients, pets, deleteClient, getPetsByClientId } = useAppContext();
  
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter clients based on search term
  const filteredClients = clients.filter(client => 
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.phone.includes(searchTerm)
  );
  
  // Handle client deletion
  const handleDeleteClient = (id: string) => {
    const success = deleteClient(id);
    if (success) {
      toast.success('Cliente excluído com sucesso!');
    }
  };
  
  // Render pet list for a client
  const renderPetsList = (clientId: string) => {
    const clientPets = getPetsByClientId(clientId);
    
    if (clientPets.length === 0) {
      return (
        <div className="text-sm text-gray-500 italic mt-2">
          Nenhum pet cadastrado
        </div>
      );
    }
    
    return (
      <div className="mt-2 space-y-2">
        {clientPets.map(pet => (
          <div 
            key={pet.id} 
            className="text-sm p-2 bg-gray-50 rounded-md flex items-center justify-between"
          >
            <div>
              <span className="font-medium">{pet.name}</span>
              <span className="text-gray-500 ml-2">
                {pet.species} - {pet.breed}
              </span>
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  // Render the client list
  const renderClientList = () => {
    if (filteredClients.length === 0) {
      return (
        <EmptyState
          title={searchTerm ? "Nenhum cliente encontrado" : "Nenhum cliente cadastrado"}
          description={searchTerm 
            ? "Tente ajustar sua busca para encontrar o que procura."
            : "Cadastre seu primeiro cliente para começar."
          }
          action={
            <Button onClick={() => navigate('/novo-cliente')} size="sm">
              <Plus size={16} className="mr-1" /> Cadastrar Cliente
            </Button>
          }
        />
      );
    }
    
    return (
      <div className="space-y-4">
        {filteredClients.map(client => (
          <div 
            key={client.id} 
            className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center">
                <div className="bg-gray-100 rounded-full p-2 mr-3">
                  <User size={20} />
                </div>
                <div>
                  <h3 className="font-medium">{client.name}</h3>
                  <p className="text-sm text-gray-600">{formatPhone(client.phone)}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => navigate(`/cliente/${client.id}`)}
                >
                  Detalhes
                </Button>
              </div>
            </div>
            
            {client.address && (
              <div className="flex items-start mt-3 text-sm text-gray-600">
                <MapPin size={14} className="mr-1 mt-0.5 flex-shrink-0" />
                <span>
                  {client.address}, {client.neighborhood}, {client.city}
                </span>
              </div>
            )}
            
            {client.pendingBalance > 0 && (
              <div className="mt-2 bg-yellow-50 p-2 rounded-md">
                <p className="text-yellow-800 text-sm font-medium">
                  Saldo pendente: {client.pendingBalance.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </p>
              </div>
            )}
            
            <div className="mt-3 border-t border-gray-100 pt-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium">Pets</h4>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => navigate(`/novo-pet/${client.id}`)}
                >
                  <Plus size={14} className="mr-1" /> Pet
                </Button>
              </div>
              {renderPetsList(client.id)}
            </div>
            
            <div className="mt-3 flex flex-wrap gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => window.location.href = `tel:${client.phone}`}
              >
                <Phone size={14} className="mr-1" /> Ligar
              </Button>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => window.open(`https://wa.me/55${client.phone.replace(/\D/g, '')}`, '_blank')}
              >
                <MessageSquare size={14} className="mr-1" /> WhatsApp
              </Button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderPetsTab = () => {
    return (
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Buscar pets..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        {/* Pet list here */}
        <div className="space-y-4">
          {pets.filter(pet => 
            pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            pet.breed.toLowerCase().includes(searchTerm.toLowerCase())
          ).map(pet => {
            const owner = clients.find(client => client.id === pet.ownerId);
            
            return (
              <div 
                key={pet.id} 
                className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium">{pet.name}</h3>
                    <p className="text-sm text-gray-600">
                      {pet.species} - {pet.breed}
                    </p>
                    {owner && (
                      <p className="text-xs text-gray-500 mt-1">
                        Dono: {owner.name}
                      </p>
                    )}
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => navigate(`/pet/${pet.id}`)}
                  >
                    Detalhes
                  </Button>
                </div>
                
                <div className="mt-2 flex flex-wrap text-sm">
                  {pet.age && (
                    <span className="bg-gray-100 px-2 py-1 rounded mr-2 mb-2">
                      {pet.age} anos
                    </span>
                  )}
                  {pet.weight && (
                    <span className="bg-gray-100 px-2 py-1 rounded mr-2 mb-2">
                      {pet.weight} kg
                    </span>
                  )}
                </div>
              </div>
            );
          })}
          
          {pets.length === 0 && (
            <EmptyState
              title="Nenhum pet cadastrado"
              description="Cadastre pets para seus clientes."
              action={
                <Button onClick={() => navigate('/novo-cliente')} size="sm">
                  <Plus size={16} className="mr-1" /> Cadastrar Cliente
                </Button>
              }
            />
          )}
        </div>
      </div>
    );
  };

  return (
    <div>
      <PageHeader 
        title="Clientes" 
        rightElement={
          <Button 
            size="sm"
            variant="default"
            onClick={() => navigate('/novo-cliente')}
          >
            <Plus size={16} className="mr-1" /> Novo
          </Button>
        }
      />
      
      <TabView
        tabs={[
          {
            id: 'clients',
            title: 'Clientes',
            content: (
              <>
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder="Buscar clientes..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                {renderClientList()}
              </>
            )
          },
          {
            id: 'pets',
            title: 'Pets',
            content: renderPetsTab()
          }
        ]}
      />
    </div>
  );
};

export default Clients;
