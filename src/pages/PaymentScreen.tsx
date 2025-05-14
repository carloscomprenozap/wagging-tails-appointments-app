
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAppContext } from '@/context/AppContext';
import PageHeader from '@/components/layout/PageHeader';
import { formatCurrency } from '@/utils/helpers';
import { Check, CreditCard, Wallet, DollarSign } from 'lucide-react';
import { toast } from 'sonner';
import type { PaymentMethod } from '@/models/types';

const PaymentScreen: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { 
    appointments, 
    clients, 
    pets, 
    services,
    taxiDogs,
    getClientById,
    getPetById,
    getServiceById,
    getTaxiDogById,
    finalizeAppointment
  } = useAppContext();
  
  const [appointment, setAppointment] = useState(
    appointments.find(app => app.id === id)
  );
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>('cash');
  
  // Redirect if appointment not found
  useEffect(() => {
    if (!appointment) {
      toast.error('Agendamento não encontrado');
      navigate('/agendamentos');
      return;
    }
    
    if (appointment.status !== 'para_retirar') {
      toast.error('Este agendamento não está pronto para finalização');
      navigate('/agendamentos');
      return;
    }
  }, [appointment, navigate]);
  
  // Load client and pet data
  const client = appointment ? getClientById(appointment.clientId) : undefined;
  const pet = appointment ? getPetById(appointment.petId) : undefined;
  
  // Calculate services price
  const appointmentServices = appointment?.services.map(id => getServiceById(id)).filter(Boolean) || [];
  const servicesTotal = appointmentServices.reduce((sum, service) => sum + (service?.price || 0), 0);
  
  // Calculate taxi dog price
  const taxiDog = appointment?.taxiDogId ? getTaxiDogById(appointment.taxiDogId) : undefined;
  const taxiDogPrice = taxiDog?.price || 0;
  
  // Total price
  const totalPrice = servicesTotal + taxiDogPrice;
  
  // Handle payment selection
  const handleSelectPayment = (method: PaymentMethod) => {
    setSelectedPayment(method);
  };
  
  // Handle finalizing the appointment
  const handleFinalize = () => {
    if (!appointment || !id) return;
    
    finalizeAppointment(id, selectedPayment);
    navigate('/agendamentos');
  };
  
  if (!appointment || !client || !pet) {
    return <div>Carregando...</div>;
  }
  
  return (
    <div>
      <PageHeader title="Finalizar Atendimento" showBackButton />
      
      <div className="space-y-6">
        {/* Appointment details */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="font-medium text-lg mb-3">Dados do Atendimento</h3>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Cliente:</span>
              <span className="font-medium">{client.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Pet:</span>
              <span className="font-medium">{pet.name} ({pet.breed})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Serviços:</span>
              <span className="font-medium">{appointmentServices.map(s => s?.name).join(', ')}</span>
            </div>
            {taxiDog && (
              <div className="flex justify-between">
                <span className="text-gray-600">Taxi Dog:</span>
                <span className="font-medium">{taxiDog.neighborhood}</span>
              </div>
            )}
            {appointment.notes && (
              <div className="flex justify-between">
                <span className="text-gray-600">Observações:</span>
                <span className="font-medium">{appointment.notes}</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Price details */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="font-medium text-lg mb-3">Valores</h3>
          
          <div className="space-y-2">
            {appointmentServices.map(service => service && (
              <div key={service.id} className="flex justify-between">
                <span className="text-gray-600">{service.name}</span>
                <span>{formatCurrency(service.price)}</span>
              </div>
            ))}
            
            {taxiDog && (
              <div className="flex justify-between">
                <span className="text-gray-600">Taxi Dog - {taxiDog.neighborhood}</span>
                <span>{formatCurrency(taxiDog.price)}</span>
              </div>
            )}
            
            <div className="border-t border-gray-200 pt-2 mt-2 flex justify-between font-semibold">
              <span>Total</span>
              <span>{formatCurrency(totalPrice)}</span>
            </div>
          </div>
        </div>
        
        {/* Payment method */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="font-medium text-lg mb-3">Forma de Pagamento</h3>
          
          <div className="grid grid-cols-2 gap-3 mb-2">
            <button
              type="button"
              className={`border rounded-md p-3 flex flex-col items-center justify-center h-24 ${
                selectedPayment === 'credit' ? 'border-petblue-DEFAULT bg-blue-50' : 'border-gray-200'
              }`}
              onClick={() => handleSelectPayment('credit')}
            >
              <CreditCard size={24} className="mb-2" />
              <span className="text-sm">Cartão de Crédito</span>
              {selectedPayment === 'credit' && (
                <Check size={16} className="absolute top-2 right-2 text-petblue-DEFAULT" />
              )}
            </button>
            
            <button
              type="button"
              className={`border rounded-md p-3 flex flex-col items-center justify-center h-24 ${
                selectedPayment === 'debit' ? 'border-petblue-DEFAULT bg-blue-50' : 'border-gray-200'
              }`}
              onClick={() => handleSelectPayment('debit')}
            >
              <Wallet size={24} className="mb-2" />
              <span className="text-sm">Cartão de Débito</span>
              {selectedPayment === 'debit' && (
                <Check size={16} className="absolute top-2 right-2 text-petblue-DEFAULT" />
              )}
            </button>
            
            <button
              type="button"
              className={`border rounded-md p-3 flex flex-col items-center justify-center h-24 ${
                selectedPayment === 'cash' ? 'border-petblue-DEFAULT bg-blue-50' : 'border-gray-200'
              }`}
              onClick={() => handleSelectPayment('cash')}
            >
              <DollarSign size={24} className="mb-2" />
              <span className="text-sm">Dinheiro</span>
              {selectedPayment === 'cash' && (
                <Check size={16} className="absolute top-2 right-2 text-petblue-DEFAULT" />
              )}
            </button>
            
            <button
              type="button"
              className={`border rounded-md p-3 flex flex-col items-center justify-center h-24 ${
                selectedPayment === 'pix' ? 'border-petblue-DEFAULT bg-blue-50' : 'border-gray-200'
              }`}
              onClick={() => handleSelectPayment('pix')}
            >
              <span className="text-lg font-bold mb-1">PIX</span>
              <span className="text-sm">Transferência</span>
              {selectedPayment === 'pix' && (
                <Check size={16} className="absolute top-2 right-2 text-petblue-DEFAULT" />
              )}
            </button>
            
            <button
              type="button"
              className={`border rounded-md p-3 flex flex-col items-center justify-center h-24 col-span-2 ${
                selectedPayment === 'pending' ? 'border-yellow-400 bg-yellow-50' : 'border-gray-200'
              }`}
              onClick={() => handleSelectPayment('pending')}
            >
              <span className="text-lg font-bold mb-1">Pagamento Pendente</span>
              <span className="text-sm">Será adicionado ao saldo devedor do cliente</span>
              {selectedPayment === 'pending' && (
                <Check size={16} className="absolute top-2 right-2 text-yellow-600" />
              )}
            </button>
          </div>
        </div>
        
        {/* Action buttons */}
        <Button 
          className="w-full"
          onClick={handleFinalize}
        >
          Finalizar Atendimento
        </Button>
      </div>
    </div>
  );
};

export default PaymentScreen;
