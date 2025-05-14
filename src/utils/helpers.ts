
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Format a date to Brazilian format (dd/mm/yyyy)
export const formatDate = (dateString: string): string => {
  try {
    const date = parseISO(dateString);
    return format(date, 'dd/MM/yyyy', { locale: ptBR });
  } catch (error) {
    return dateString;
  }
};

// Format a price to Brazilian currency
export const formatCurrency = (value: number): string => {
  return value.toLocaleString('pt-BR', { 
    style: 'currency', 
    currency: 'BRL' 
  });
};

// Format a phone number to Brazilian format
export const formatPhone = (phone: string): string => {
  if (!phone) return '';
  
  // Remove non-numeric characters
  const numbers = phone.replace(/\D/g, '');
  
  // Format according to length
  if (numbers.length === 11) {
    // Mobile: (XX) XXXXX-XXXX
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`;
  } else if (numbers.length === 10) {
    // Landline: (XX) XXXX-XXXX
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`;
  }
  
  // Return original if not standard format
  return phone;
};

// Open WhatsApp with a pre-filled message
export const openWhatsApp = (phone: string, message: string): void => {
  // Remove any formatting from the phone
  const cleanPhone = phone.replace(/\D/g, '');
  
  // Ensure phone has country code
  const phoneWithCountryCode = cleanPhone.startsWith('55') 
    ? cleanPhone 
    : `55${cleanPhone}`;
  
  // Encode the message
  const encodedMessage = encodeURIComponent(message);
  
  // Create the WhatsApp URL and open it
  const whatsappUrl = `https://wa.me/${phoneWithCountryCode}?text=${encodedMessage}`;
  window.open(whatsappUrl, '_blank');
};

// Open Google Maps with an address
export const openGoogleMaps = (address: string): void => {
  const encodedAddress = encodeURIComponent(address);
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
  window.open(mapsUrl, '_blank');
};

// Get color based on appointment status
export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'agendado':
      return 'bg-petyellow-DEFAULT text-black';
    case 'confirmado':
      return 'bg-petblue-DEFAULT text-white';
    case 'para_retirar':
      return 'bg-petgreen-DEFAULT text-white';
    case 'finalizado':
      return 'bg-gray-500 text-white';
    default:
      return 'bg-gray-200 text-black';
  }
};

// Get payment method name in Portuguese
export const getPaymentMethodName = (method: string | undefined): string => {
  if (!method) return 'Não pago';
  
  switch (method) {
    case 'credit':
      return 'Cartão de Crédito';
    case 'debit':
      return 'Cartão de Débito';
    case 'cash':
      return 'Dinheiro';
    case 'pix':
      return 'PIX';
    case 'pending':
      return 'Pendente';
    default:
      return method;
  }
};

// Generate a reminder message for an appointment
export const generateReminderMessage = (
  clientName: string, 
  petName: string, 
  date: string, 
  time: string
): string => {
  return `Olá ${clientName}, gostaríamos de lembrar que o ${petName} tem um agendamento para o dia ${formatDate(date)} às ${time}. Por favor, confirme sua presença. Obrigado!`;
};

// Generate a pet ready message
export const generatePetReadyMessage = (
  clientName: string, 
  petName: string
): string => {
  return `Olá ${clientName}, o ${petName} já está pronto para ser retirado. Estamos aguardando sua visita!`;
};

// Get current date in ISO format (YYYY-MM-DD)
export const getCurrentDate = (): string => {
  return new Date().toISOString().split('T')[0];
};

// Get month name in Portuguese
export const getMonthName = (month: number): string => {
  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 
    'Maio', 'Junho', 'Julho', 'Agosto', 
    'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];
  return months[month - 1];
};

// Generate month/year options for reports
export const generateMonthYearOptions = (): { label: string, value: string }[] => {
  const options = [];
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;
  
  // Generate options for the current year and the previous year
  for (let year = currentYear; year >= currentYear - 1; year--) {
    const lastMonth = year === currentYear ? currentMonth : 12;
    for (let month = lastMonth; month >= 1; month--) {
      const monthStr = month < 10 ? `0${month}` : `${month}`;
      const label = `${getMonthName(month)} ${year}`;
      const value = `${year}-${monthStr}`;
      options.push({ label, value });
    }
  }
  
  return options;
};
