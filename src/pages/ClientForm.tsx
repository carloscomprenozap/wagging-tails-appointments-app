
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAppContext } from '@/context/AppContext';
import PageHeader from '@/components/layout/PageHeader';
import { toast } from 'sonner';

const ClientForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { clients, addClient, updateClient, getClientById } = useAppContext();
  
  // Form state
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [city, setCity] = useState('');
  const [notes, setNotes] = useState('');
  
  // Check if editing existing client
  const isEditing = !!id;
  
  // Load client data if editing
  useEffect(() => {
    if (isEditing) {
      const client = getClientById(id);
      if (client) {
        setName(client.name);
        setPhone(client.phone);
        setEmail(client.email || '');
        setAddress(client.address);
        setNeighborhood(client.neighborhood);
        setCity(client.city);
        setNotes(client.notes || '');
      } else {
        toast.error('Cliente não encontrado');
        navigate('/clientes');
      }
    }
  }, [id, isEditing, clients, getClientById, navigate]);
  
  // Phone mask
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    
    if (value.length > 11) {
      value = value.substring(0, 11);
    }
    
    // Format: (XX) XXXXX-XXXX or (XX) XXXX-XXXX
    if (value.length > 0) {
      value = `(${value.substring(0, 2)}${value.length > 2 ? ') ' : ''}${value.substring(2, 
        value.length > 7 ? 7 : value.length)}${value.length > 7 ? `-${value.substring(7)}` : ''}`;
    }
    
    setPhone(value);
  };
  
  // Form validation
  const isValid = name && phone && address && neighborhood && city;
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isValid) {
      toast.error('Por favor, preencha todos os campos obrigatórios');
      return;
    }
    
    const clientData = {
      name,
      phone: phone.replace(/\D/g, ''), // Store raw phone number
      email: email || undefined,
      address,
      neighborhood,
      city,
      notes: notes || undefined
    };
    
    if (isEditing && id) {
      updateClient({
        ...clientData,
        id,
        pendingBalance: getClientById(id)?.pendingBalance || 0
      });
      toast.success('Cliente atualizado com sucesso!');
    } else {
      addClient(clientData);
      toast.success('Cliente adicionado com sucesso!');
    }
    
    navigate('/clientes');
  };
  
  return (
    <div>
      <PageHeader 
        title={isEditing ? 'Editar Cliente' : 'Novo Cliente'} 
        showBackButton
      />
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Nome *
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 w-full"
              required
            />
          </div>
          
          {/* Phone */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Telefone *
            </label>
            <input
              type="tel"
              id="phone"
              value={phone}
              onChange={handlePhoneChange}
              placeholder="(00) 00000-0000"
              className="border border-gray-300 rounded-md px-3 py-2 w-full"
              required
            />
          </div>
          
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              E-mail
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 w-full"
            />
          </div>
          
          {/* Address */}
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
              Endereço *
            </label>
            <input
              type="text"
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 w-full"
              required
            />
          </div>
          
          {/* Neighborhood and City */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="neighborhood" className="block text-sm font-medium text-gray-700 mb-1">
                Bairro *
              </label>
              <input
                type="text"
                id="neighborhood"
                value={neighborhood}
                onChange={(e) => setNeighborhood(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 w-full"
                required
              />
            </div>
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                Cidade *
              </label>
              <input
                type="text"
                id="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 w-full"
                required
              />
            </div>
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
          
          {/* Submit button */}
          <div>
            <Button 
              type="submit" 
              className="w-full"
              disabled={!isValid}
            >
              {isEditing ? 'Atualizar Cliente' : 'Adicionar Cliente'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ClientForm;
