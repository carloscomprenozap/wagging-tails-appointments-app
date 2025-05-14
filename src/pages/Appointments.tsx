
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAppContext } from '@/context/AppContext';
import PageHeader from '@/components/layout/PageHeader';
import KanbanBoard from '@/components/common/KanbanBoard';
import { getCurrentDate, formatDate, openWhatsApp, openGoogleMaps, generateReminderMessage, generatePetReadyMessage } from '@/utils/helpers';
import { Plus, MessageSquare, Map, Clock } from 'lucide-react';

const Appointments: React.FC = () => {
  const navigate = useNavigate();
  const { 
    appointments, 
    clients, 
    pets, 
    services,
    taxiDogs,
    getAppointmentsByStatus,
    getAppointmentsByDate,
    getClientById,
    getPetById,
    getServiceById,
    getTaxiDogById,
    confirmAppointment,
    markAppointmentReady,
    finalizeAppointment
  } = useAppContext();
  
  const [selectedDate, setSelectedDate] = useState<string>(getCurrentDate());
  const [todayAppointments, setTodayAppointments] = useState(getAppointmentsByDate(selectedDate));
  
  // Update todayAppointments when selectedDate or appointments change
  useEffect(() => {
    setTodayAppointments(getAppointmentsByDate(selectedDate));
  }, [selectedDate, appointments, getAppointmentsByDate]);
  
  // Filter appointments by status for today
  const scheduledAppointments = todayAppointments.filter(app => app.status === 'agendado');
  const confirmedAppointments = todayAppointments.filter(app => app.status === 'confirmado');
  const readyForPickupAppointments = todayAppointments.filter(app => app.status === 'para_retirar');
  
  // Handle sending reminder
  const handleSendReminder = (appointmentId: string) => {
    const appointment = appointments.find(app => app.id === appointmentId);
    if (!appointment) return;
    
    const client = getClientById(appointment.clientId);
    const pet = getPetById(appointment.petId);
    
    if (!client || !pet) return;
    
    const message = generateReminderMessage(
      client.name,
      pet.name,
      appointment.date,
      appointment.time
    );
    
    openWhatsApp(client.phone, message);
  };
  
  // Handle sending pet ready notification
  const handleSendReadyNotification = (appointmentId: string) => {
    const appointment = appointments.find(app => app.id === appointmentId);
    if (!appointment) return;
    
    const client = getClientById(appointment.clientId);
    const pet = getPetById(appointment.petId);
    
    if (!client || !pet) return;
    
    const message = generatePetReadyMessage(client.name, pet.name);
    
    openWhatsApp(client.phone, message);
  };
  
  // Render appointment card
  const renderAppointmentCard = (appointment: typeof appointments[0], status: 'agendado' | 'confirmado' | 'para_retirar') => {
    const client = getClientById(appointment.clientId);
    const pet = getPetById(appointment.petId);
    const appointmentServices = appointment.services.map(id => getServiceById(id)?.name).filter(Boolean).join(', ');
    const taxiDog = appointment.taxiDogId ? getTaxiDogById(appointment.taxiDogId) : null;
    
    if (!client || !pet) return null;
    
    return (
      <div className="bg-white rounded-lg shadow p-4 relative">
        <div className="flex justify-between items-start">
          <div>
            <p className="font-semibold">{pet.name} ({pet.breed})</p>
            <p className="text-sm text-gray-600">{client.name}</p>
            <p className="text-xs text-gray-500 mt-1">
              <Clock size={12} className="inline mr-1" />
              {appointment.time}
            </p>
          </div>
        </div>
        
        <div className="text-xs text-gray-700 mt-2">
          <strong>Serviços:</strong> {appointmentServices}
          {taxiDog && <div><strong>Taxi Dog:</strong> {taxiDog.neighborhood} - {taxiDog.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div>}
        </div>
        
        <div className="flex mt-3 pt-3 border-t border-gray-100 gap-2 flex-wrap">
          {status === 'agendado' && (
            <>
              <Button size="sm" variant="outline" onClick={() => confirmAppointment(appointment.id)}>
                Confirmar
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => handleSendReminder(appointment.id)}
              >
                <MessageSquare size={14} className="mr-1" /> Lembrar
              </Button>
            </>
          )}
          
          {status === 'confirmado' && (
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => markAppointmentReady(appointment.id)}
            >
              Pronto
            </Button>
          )}
          
          {status === 'para_retirar' && (
            <>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => handleSendReadyNotification(appointment.id)}
              >
                <MessageSquare size={14} className="mr-1" /> Avisar
              </Button>
              <Button 
                size="sm" 
                variant="default"
                onClick={() => navigate(`/pagamento/${appointment.id}`)}
              >
                Finalizar
              </Button>
            </>
          )}
          
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => openGoogleMaps(`${client.address}, ${client.neighborhood}, ${client.city}`)}
          >
            <Map size={14} className="mr-1" /> Mapa
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div>
      <PageHeader 
        title="Agendamentos" 
        rightElement={
          <Button 
            size="sm" 
            variant="default"
            onClick={() => navigate('/novo-agendamento')}
          >
            <Plus size={16} className="mr-1" /> Novo
          </Button>
        }
      />
      
      <div className="mb-4">
        <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
          Data
        </label>
        <input
          type="date"
          id="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 w-full"
        />
      </div>
      
      <div className="overflow-x-auto -mx-4 px-4">
        <KanbanBoard
          columns={[
            {
              id: 'scheduled',
              title: 'Agendado',
              items: scheduledAppointments,
              renderItem: (appointment) => renderAppointmentCard(appointment, 'agendado')
            },
            {
              id: 'confirmed',
              title: 'Confirmado',
              items: confirmedAppointments,
              renderItem: (appointment) => renderAppointmentCard(appointment, 'confirmado')
            },
            {
              id: 'ready',
              title: 'Para Retirar',
              items: readyForPickupAppointments,
              renderItem: (appointment) => renderAppointmentCard(appointment, 'para_retirar')
            }
          ]}
        />
      </div>
    </div>
  );
};

export default Appointments;
