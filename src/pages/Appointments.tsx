
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAppContext } from '@/context/AppContext';
import PageHeader from '@/components/layout/PageHeader';
import KanbanBoard from '@/components/common/KanbanBoard';
import { getCurrentDate, formatDate, openWhatsApp, openGoogleMaps, generateReminderMessage, generatePetReadyMessage } from '@/utils/helpers';
import { Plus, MessageSquare, Map, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/components/ui/use-toast';

const Appointments: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState<string>(getCurrentDate());
  const [appointments, setAppointments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [clients, setClients] = useState<any[]>([]);
  const [pets, setPets] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [taxiDogs, setTaxiDogs] = useState<any[]>([]);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Buscar todos os agendamentos para a data selecionada
        const { data: appointmentsData, error: appointmentsError } = await supabase
          .from('appointments')
          .select('*')
          .eq('date', selectedDate);
        
        if (appointmentsError) throw appointmentsError;
        
        // Buscar clientes, pets, serviços e taxi dogs
        const { data: clientsData, error: clientsError } = await supabase
          .from('clients')
          .select('*');
        
        if (clientsError) throw clientsError;
        
        const { data: petsData, error: petsError } = await supabase
          .from('pets')
          .select('*');
        
        if (petsError) throw petsError;
        
        const { data: servicesData, error: servicesError } = await supabase
          .from('services')
          .select('*');
        
        if (servicesError) throw servicesError;
        
        const { data: taxiDogsData, error: taxiDogsError } = await supabase
          .from('taxi_dogs')
          .select('*');
        
        if (taxiDogsError) throw taxiDogsError;
        
        setAppointments(appointmentsData || []);
        setClients(clientsData || []);
        setPets(petsData || []);
        setServices(servicesData || []);
        setTaxiDogs(taxiDogsData || []);
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Erro ao carregar dados",
          description: error.message || "Ocorreu um erro ao buscar os dados.",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [selectedDate]);
  
  // Filter appointments by status
  const scheduledAppointments = appointments.filter(app => app.status === 'agendado');
  const confirmedAppointments = appointments.filter(app => app.status === 'confirmado');
  const readyForPickupAppointments = appointments.filter(app => app.status === 'para_retirar');
  
  const getClientById = (id: string) => clients.find(client => client.id === id);
  const getPetById = (id: string) => pets.find(pet => pet.id === id);
  const getServiceById = (id: string) => services.find(service => service.id === id);
  const getTaxiDogById = (id: string) => taxiDogs.find(taxiDog => taxiDog.id === id);
  
  const confirmAppointment = async (id: string) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status: 'confirmado' })
        .eq('id', id);
      
      if (error) throw error;
      
      setAppointments(prev => 
        prev.map(app => app.id === id ? { ...app, status: 'confirmado' } : app)
      );
      
      toast({
        title: "Agendamento confirmado!"
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao confirmar agendamento",
        description: error.message
      });
    }
  };
  
  const markAppointmentReady = async (id: string) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status: 'para_retirar' })
        .eq('id', id);
      
      if (error) throw error;
      
      setAppointments(prev => 
        prev.map(app => app.id === id ? { ...app, status: 'para_retirar' } : app)
      );
      
      toast({
        title: "Pet pronto para retirada!"
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao marcar como pronto",
        description: error.message
      });
    }
  };
  
  // Handle sending reminder
  const handleSendReminder = (appointmentId: string) => {
    const appointment = appointments.find(app => app.id === appointmentId);
    if (!appointment) return;
    
    const client = getClientById(appointment.client_id);
    const pet = getPetById(appointment.pet_id);
    
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
    
    const client = getClientById(appointment.client_id);
    const pet = getPetById(appointment.pet_id);
    
    if (!client || !pet) return;
    
    const message = generatePetReadyMessage(client.name, pet.name);
    
    openWhatsApp(client.phone, message);
  };
  
  // Render appointment card
  const renderAppointmentCard = (appointment: any, status: 'agendado' | 'confirmado' | 'para_retirar') => {
    const client = getClientById(appointment.client_id);
    const pet = getPetById(appointment.pet_id);
    const appointmentServices = appointment.services.map((id: string) => {
      const service = getServiceById(id);
      return service ? service.name : '';
    }).filter(Boolean).join(', ');
    const taxiDog = appointment.taxi_dog_id ? getTaxiDogById(appointment.taxi_dog_id) : null;
    
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
      
      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-petblue-DEFAULT"></div>
        </div>
      ) : (
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
      )}
    </div>
  );
};

export default Appointments;
