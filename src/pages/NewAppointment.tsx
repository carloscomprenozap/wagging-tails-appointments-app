
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAppContext } from '@/context/AppContext';
import PageHeader from '@/components/layout/PageHeader';
import { getCurrentDate } from '@/utils/helpers';
import { Check } from 'lucide-react';
import { toast } from 'sonner';

const NewAppointment: React.FC = () => {
  const navigate = useNavigate();
  const { 
    clients, 
    pets, 
    services, 
    taxiDogs,
    getPetsByClientId,
    addAppointment 
  } = useAppContext();
  
  // Form state
  const [clientId, setClientId] = useState<string>('');
  const [petId, setPetId] = useState<string>('');
  const [date, setDate] = useState<string>(getCurrentDate());
  const [time, setTime] = useState<string>('');
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [taxiDogId, setTaxiDogId] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  
  // Derived state
  const [clientPets, setClientPets] = useState<typeof pets>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  
  // Update client pets when clientId changes
  useEffect(() => {
    if (clientId) {
      const petsList = getPetsByClientId(clientId);
      setClientPets(petsList);
      
      // Clear petId if the previously selected pet doesn't belong to this client
      if (petId && !petsList.some(pet => pet.id === petId)) {
        setPetId('');
      }
    } else {
      setClientPets([]);
      setPetId('');
    }
  }, [clientId, getPetsByClientId, petId]);
  
  // Update total price when services or taxiDog change
  useEffect(() => {
    let price = 0;
    
    // Add service prices
    selectedServices.forEach(serviceId => {
      const service = services.find(s => s.id === serviceId);
      if (service) {
        price += service.price;
      }
    });
    
    // Add taxiDog price if selected
    if (taxiDogId) {
      const taxiDog = taxiDogs.find(t => t.id === taxiDogId);
      if (taxiDog) {
        price += taxiDog.price;
      }
    }
    
    setTotalPrice(price);
  }, [selectedServices, taxiDogId, services, taxiDogs]);
  
  // Toggle service selection
  const toggleService = (serviceId: string) => {
    setSelectedServices(prev => 
      prev.includes(serviceId)
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!clientId || !petId || !date || !time || selectedServices.length === 0) {
      toast.error('Por favor, preencha todos os campos obrigatórios');
      return;
    }
    
    // Create appointment
    addAppointment({
      clientId,
      petId,
      date,
      time,
      services: selectedServices,
      taxiDogId: taxiDogId || undefined,
      price: totalPrice,
      notes
    });
    
    // Navigate back to appointments page
    navigate('/agendamentos');
  };
  
  return (
    <div>
      <PageHeader title="Novo Agendamento" showBackButton />
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          {/* Client selection */}
          <div>
            <label htmlFor="client" className="block text-sm font-medium text-gray-700 mb-1">
              Cliente *
            </label>
            <select
              id="client"
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 w-full"
              required
            >
              <option value="">Selecione um cliente</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name}
                </option>
              ))}
            </select>
          </div>
          
          {/* Pet selection */}
          <div>
            <label htmlFor="pet" className="block text-sm font-medium text-gray-700 mb-1">
              Pet *
            </label>
            <select
              id="pet"
              value={petId}
              onChange={(e) => setPetId(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 w-full"
              disabled={!clientId}
              required
            >
              <option value="">Selecione um pet</option>
              {clientPets.map((pet) => (
                <option key={pet.id} value={pet.id}>
                  {pet.name} ({pet.breed})
                </option>
              ))}
            </select>
            {clientId && clientPets.length === 0 && (
              <p className="text-xs text-yellow-600 mt-1">
                Este cliente não tem pets cadastrados.
              </p>
            )}
          </div>
          
          {/* Date and time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                Data *
              </label>
              <input
                type="date"
                id="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 w-full"
                required
              />
            </div>
            <div>
              <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
                Horário *
              </label>
              <input
                type="time"
                id="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 w-full"
                required
              />
            </div>
          </div>
          
          {/* Services */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Serviços *
            </label>
            <div className="grid grid-cols-1 gap-2 mt-1">
              {services.map((service) => (
                <div
                  key={service.id}
                  className={`border rounded-md p-3 cursor-pointer flex justify-between items-center ${
                    selectedServices.includes(service.id)
                      ? 'border-petblue-DEFAULT bg-blue-50'
                      : 'border-gray-300'
                  }`}
                  onClick={() => toggleService(service.id)}
                >
                  <div>
                    <p className="font-medium">{service.name}</p>
                    <p className="text-sm text-gray-600">{service.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                  </div>
                  {selectedServices.includes(service.id) && (
                    <Check size={20} className="text-petblue-DEFAULT" />
                  )}
                </div>
              ))}
            </div>
            {services.length === 0 && (
              <p className="text-xs text-yellow-600 mt-1">
                Nenhum serviço cadastrado. Adicione serviços em Produtos e Serviços.
              </p>
            )}
          </div>
          
          {/* Taxi Dog */}
          <div>
            <label htmlFor="taxiDog" className="block text-sm font-medium text-gray-700 mb-1">
              Taxi Dog (opcional)
            </label>
            <select
              id="taxiDog"
              value={taxiDogId}
              onChange={(e) => setTaxiDogId(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 w-full"
            >
              <option value="">Sem Taxi Dog</option>
              {taxiDogs.map((taxiDog) => (
                <option key={taxiDog.id} value={taxiDog.id}>
                  {taxiDog.neighborhood} - {taxiDog.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </option>
              ))}
            </select>
          </div>
          
          {/* Notes */}
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
              Observações
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 w-full"
              rows={3}
            />
          </div>
          
          {/* Total */}
          <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
            <p className="text-sm text-gray-700">Valor Total:</p>
            <p className="text-xl font-semibold text-gray-900">
              {totalPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </p>
          </div>
          
          {/* Submit button */}
          <div>
            <Button type="submit" className="w-full">
              Criar Agendamento
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default NewAppointment;
