
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { 
  Appointment, 
  Client, 
  Pet, 
  Service, 
  Product, 
  TaxiDog, 
  Expense, 
  Sale,
  UserProfile, 
  PaymentMethod
} from '../models/types';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';

interface AppContextType {
  // Data
  clients: Client[];
  pets: Pet[];
  services: Service[];
  products: Product[];
  taxiDogs: TaxiDog[];
  appointments: Appointment[];
  expenses: Expense[];
  sales: Sale[];
  userProfile: UserProfile;
  
  // Client and Pet Methods
  addClient: (client: Omit<Client, 'id' | 'pendingBalance'>) => void;
  updateClient: (client: Client) => void;
  deleteClient: (id: string) => boolean;
  addPet: (pet: Omit<Pet, 'id'>) => void;
  updatePet: (pet: Pet) => void;
  deletePet: (id: string) => boolean;
  
  // Services and Products Methods
  addService: (service: Omit<Service, 'id'>) => void;
  updateService: (service: Service) => void;
  deleteService: (id: string) => boolean;
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => boolean;
  
  // TaxiDog Methods
  addTaxiDog: (taxiDog: Omit<TaxiDog, 'id'>) => void;
  updateTaxiDog: (taxiDog: TaxiDog) => void;
  deleteTaxiDog: (id: string) => boolean;
  
  // Appointment Methods
  addAppointment: (appointment: Omit<Appointment, 'id' | 'status' | 'paid'>) => void;
  updateAppointment: (appointment: Appointment) => void;
  deleteAppointment: (id: string) => boolean;
  confirmAppointment: (id: string) => void;
  markAppointmentReady: (id: string) => void;
  finalizeAppointment: (id: string, paymentMethod: PaymentMethod) => void;
  
  // Financial Methods
  addSale: (sale: Omit<Sale, 'id' | 'date'>) => void;
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  updateExpense: (expense: Expense) => void;
  deleteExpense: (id: string) => boolean;
  
  // Payment Methods
  registerPayment: (appointmentId: string, method: PaymentMethod) => void;
  settlePendingPayment: (clientId: string, amount: number, method: PaymentMethod) => void;
  
  // Profile Methods
  updateUserProfile: (profile: UserProfile) => void;
  
  // Helper Methods
  getClientById: (id: string) => Client | undefined;
  getPetById: (id: string) => Pet | undefined;
  getServiceById: (id: string) => Service | undefined;
  getProductById: (id: string) => Product | undefined;
  getTaxiDogById: (id: string) => TaxiDog | undefined;
  getPetsByClientId: (clientId: string) => Pet[];
  getAppointmentsByStatus: (status: Appointment['status']) => Appointment[];
  getAppointmentsByDate: (date: string) => Appointment[];
  getAppointmentsByClientId: (clientId: string) => Appointment[];
  getSalesByClientId: (clientId: string) => Sale[];
  getDailyIncome: (date: string) => number;
  getMonthlyIncome: (year: number, month: number) => number;
  getDailyExpenses: (date: string) => number;
  getMonthlyExpenses: (year: number, month: number) => number;
}

interface AppProviderProps {
  children: ReactNode;
}

// Create the context with default values
const AppContext = createContext<AppContextType | undefined>(undefined);

// Mock data for initial load
const mockData = {
  clients: [
    {
      id: '1',
      name: 'João Silva',
      phone: '11987654321',
      email: 'joao.silva@example.com',
      address: 'Rua das Flores, 123',
      neighborhood: 'Centro',
      city: 'São Paulo',
      pendingBalance: 0,
      notes: 'Cliente preferencial'
    },
    {
      id: '2',
      name: 'Maria Oliveira',
      phone: '11912345678',
      email: 'maria.oliveira@example.com',
      address: 'Av. Paulista, 1000',
      neighborhood: 'Bela Vista',
      city: 'São Paulo',
      pendingBalance: 50,
      notes: ''
    }
  ],
  pets: [
    {
      id: '1',
      name: 'Rex',
      species: 'Cachorro',
      breed: 'Golden Retriever',
      age: 3,
      weight: 25,
      ownerId: '1',
      notes: 'Alérgico a certos shampoos'
    },
    {
      id: '2',
      name: 'Miau',
      species: 'Gato',
      breed: 'Persa',
      age: 2,
      weight: 4,
      ownerId: '2',
      notes: 'Não gosta de banho'
    },
    {
      id: '3',
      name: 'Toby',
      species: 'Cachorro',
      breed: 'Poodle',
      age: 5,
      weight: 8,
      ownerId: '1',
      notes: ''
    }
  ],
  services: [
    {
      id: '1',
      name: 'Banho',
      description: 'Banho completo com secagem',
      price: 40,
      duration: 60
    },
    {
      id: '2',
      name: 'Tosa',
      description: 'Tosa higiênica ou completa',
      price: 60,
      duration: 90
    },
    {
      id: '3',
      name: 'Banho e Tosa',
      description: 'Banho completo com tosa',
      price: 90,
      duration: 120
    }
  ],
  products: [
    {
      id: '1',
      name: 'Ração Premium',
      description: 'Ração premium para cães adultos',
      price: 120,
      stock: 15
    },
    {
      id: '2',
      name: 'Shampoo Pet',
      description: 'Shampoo para cães com pelos sensíveis',
      price: 35,
      stock: 20
    }
  ],
  taxiDogs: [
    {
      id: '1',
      neighborhood: 'Centro',
      price: 15,
      notes: 'Até 5km'
    },
    {
      id: '2',
      neighborhood: 'Bela Vista',
      price: 20,
      notes: 'Até 10km'
    }
  ],
  appointments: [
    {
      id: '1',
      petId: '1',
      clientId: '1',
      date: new Date().toISOString().split('T')[0],
      time: '10:00',
      services: ['1', '2'],
      status: 'agendado',
      price: 100,
      paid: false,
      notes: 'Primeira visita'
    },
    {
      id: '2',
      petId: '2',
      clientId: '2',
      date: new Date().toISOString().split('T')[0],
      time: '14:00',
      services: ['1'],
      taxiDogId: '1',
      status: 'confirmado',
      price: 55,
      paid: false,
      notes: ''
    }
  ],
  expenses: [
    {
      id: '1',
      description: 'Compra de shampoo para estoque',
      amount: 200,
      category: 'Produtos',
      date: new Date().toISOString().split('T')[0],
      notes: 'Fornecedor: PetClean'
    }
  ],
  sales: [
    {
      id: '1',
      clientId: '1',
      products: [
        {
          productId: '1',
          quantity: 1,
          price: 120
        }
      ],
      date: new Date().toISOString().split('T')[0],
      total: 120,
      paymentMethod: 'credit',
      paid: true
    }
  ],
  userProfile: {
    id: '1',
    name: 'Administrador',
    businessName: 'PetTime - Pet Shop',
    email: 'admin@pettime.com',
    phone: '11999999999',
    address: 'Rua dos Pets, 100 - São Paulo'
  }
};

// Local storage keys
const STORAGE_KEYS = {
  CLIENTS: 'petTime_clients',
  PETS: 'petTime_pets',
  SERVICES: 'petTime_services',
  PRODUCTS: 'petTime_products',
  TAXIDOGS: 'petTime_taxidogs',
  APPOINTMENTS: 'petTime_appointments',
  EXPENSES: 'petTime_expenses',
  SALES: 'petTime_sales',
  USER_PROFILE: 'petTime_userProfile'
};

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [pets, setPets] = useState<Pet[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [taxiDogs, setTaxiDogs] = useState<TaxiDog[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    id: '1',
    name: '',
    businessName: 'PetTime',
    email: '',
    phone: '',
    address: ''
  });
  
  // Load data from localStorage on first render
  useEffect(() => {
    const loadedClients = localStorage.getItem(STORAGE_KEYS.CLIENTS);
    const loadedPets = localStorage.getItem(STORAGE_KEYS.PETS);
    const loadedServices = localStorage.getItem(STORAGE_KEYS.SERVICES);
    const loadedProducts = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    const loadedTaxiDogs = localStorage.getItem(STORAGE_KEYS.TAXIDOGS);
    const loadedAppointments = localStorage.getItem(STORAGE_KEYS.APPOINTMENTS);
    const loadedExpenses = localStorage.getItem(STORAGE_KEYS.EXPENSES);
    const loadedSales = localStorage.getItem(STORAGE_KEYS.SALES);
    const loadedUserProfile = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
    
    // If there's no data in localStorage, use the mock data
    setClients(loadedClients ? JSON.parse(loadedClients) : mockData.clients);
    setPets(loadedPets ? JSON.parse(loadedPets) : mockData.pets);
    setServices(loadedServices ? JSON.parse(loadedServices) : mockData.services);
    setProducts(loadedProducts ? JSON.parse(loadedProducts) : mockData.products);
    setTaxiDogs(loadedTaxiDogs ? JSON.parse(loadedTaxiDogs) : mockData.taxiDogs);
    setAppointments(loadedAppointments ? JSON.parse(loadedAppointments) : mockData.appointments);
    setExpenses(loadedExpenses ? JSON.parse(loadedExpenses) : mockData.expenses);
    setSales(loadedSales ? JSON.parse(loadedSales) : mockData.sales);
    setUserProfile(loadedUserProfile ? JSON.parse(loadedUserProfile) : mockData.userProfile);
  }, []);
  
  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(clients));
  }, [clients]);
  
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PETS, JSON.stringify(pets));
  }, [pets]);
  
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(services));
  }, [services]);
  
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  }, [products]);
  
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TAXIDOGS, JSON.stringify(taxiDogs));
  }, [taxiDogs]);
  
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(appointments));
  }, [appointments]);
  
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expenses));
  }, [expenses]);
  
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SALES, JSON.stringify(sales));
  }, [sales]);
  
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(userProfile));
  }, [userProfile]);
  
  // Clients and Pets Methods
  const addClient = (clientData: Omit<Client, 'id' | 'pendingBalance'>) => {
    const newClient: Client = {
      ...clientData,
      id: uuidv4(),
      pendingBalance: 0
    };
    setClients([...clients, newClient]);
    toast.success('Cliente adicionado com sucesso!');
  };
  
  const updateClient = (updatedClient: Client) => {
    setClients(clients.map(client => 
      client.id === updatedClient.id ? updatedClient : client
    ));
    toast.success('Cliente atualizado com sucesso!');
  };
  
  const deleteClient = (id: string): boolean => {
    const clientHasPets = pets.some(pet => pet.ownerId === id);
    const clientHasAppointments = appointments.some(app => app.clientId === id);
    
    if (clientHasPets || clientHasAppointments) {
      toast.error('Não é possível excluir o cliente pois existem pets ou agendamentos associados.');
      return false;
    }
    
    setClients(clients.filter(client => client.id !== id));
    toast.success('Cliente excluído com sucesso!');
    return true;
  };
  
  const addPet = (petData: Omit<Pet, 'id'>) => {
    const newPet: Pet = {
      ...petData,
      id: uuidv4()
    };
    setPets([...pets, newPet]);
    toast.success('Pet adicionado com sucesso!');
  };
  
  const updatePet = (updatedPet: Pet) => {
    setPets(pets.map(pet => 
      pet.id === updatedPet.id ? updatedPet : pet
    ));
    toast.success('Pet atualizado com sucesso!');
  };
  
  const deletePet = (id: string): boolean => {
    const petHasAppointments = appointments.some(app => app.petId === id);
    
    if (petHasAppointments) {
      toast.error('Não é possível excluir o pet pois existem agendamentos associados.');
      return false;
    }
    
    setPets(pets.filter(pet => pet.id !== id));
    toast.success('Pet excluído com sucesso!');
    return true;
  };
  
  // Services and Products Methods
  const addService = (serviceData: Omit<Service, 'id'>) => {
    const newService: Service = {
      ...serviceData,
      id: uuidv4()
    };
    setServices([...services, newService]);
    toast.success('Serviço adicionado com sucesso!');
  };
  
  const updateService = (updatedService: Service) => {
    setServices(services.map(service => 
      service.id === updatedService.id ? updatedService : service
    ));
    toast.success('Serviço atualizado com sucesso!');
  };
  
  const deleteService = (id: string): boolean => {
    const serviceIsInUse = appointments.some(app => app.services.includes(id));
    
    if (serviceIsInUse) {
      toast.error('Não é possível excluir o serviço pois está sendo usado em agendamentos.');
      return false;
    }
    
    setServices(services.filter(service => service.id !== id));
    toast.success('Serviço excluído com sucesso!');
    return true;
  };
  
  const addProduct = (productData: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...productData,
      id: uuidv4()
    };
    setProducts([...products, newProduct]);
    toast.success('Produto adicionado com sucesso!');
  };
  
  const updateProduct = (updatedProduct: Product) => {
    setProducts(products.map(product => 
      product.id === updatedProduct.id ? updatedProduct : product
    ));
    toast.success('Produto atualizado com sucesso!');
  };
  
  const deleteProduct = (id: string): boolean => {
    // Check if product is in any sales
    const productIsInUse = sales.some(sale => 
      sale.products.some(p => p.productId === id)
    );
    
    if (productIsInUse) {
      toast.error('Não é possível excluir o produto pois está sendo usado em vendas.');
      return false;
    }
    
    setProducts(products.filter(product => product.id !== id));
    toast.success('Produto excluído com sucesso!');
    return true;
  };
  
  // TaxiDog Methods
  const addTaxiDog = (taxiDogData: Omit<TaxiDog, 'id'>) => {
    const newTaxiDog: TaxiDog = {
      ...taxiDogData,
      id: uuidv4()
    };
    setTaxiDogs([...taxiDogs, newTaxiDog]);
    toast.success('Serviço de Taxi Dog adicionado com sucesso!');
  };
  
  const updateTaxiDog = (updatedTaxiDog: TaxiDog) => {
    setTaxiDogs(taxiDogs.map(taxiDog => 
      taxiDog.id === updatedTaxiDog.id ? updatedTaxiDog : taxiDog
    ));
    toast.success('Serviço de Taxi Dog atualizado com sucesso!');
  };
  
  const deleteTaxiDog = (id: string): boolean => {
    const taxiDogIsInUse = appointments.some(app => app.taxiDogId === id);
    
    if (taxiDogIsInUse) {
      toast.error('Não é possível excluir o serviço de Taxi Dog pois está sendo usado em agendamentos.');
      return false;
    }
    
    setTaxiDogs(taxiDogs.filter(taxiDog => taxiDog.id !== id));
    toast.success('Serviço de Taxi Dog excluído com sucesso!');
    return true;
  };
  
  // Appointment Methods
  const addAppointment = (appointmentData: Omit<Appointment, 'id' | 'status' | 'paid'>) => {
    const newAppointment: Appointment = {
      ...appointmentData,
      id: uuidv4(),
      status: 'agendado',
      paid: false
    };
    setAppointments([...appointments, newAppointment]);
    toast.success('Agendamento criado com sucesso!');
  };
  
  const updateAppointment = (updatedAppointment: Appointment) => {
    setAppointments(appointments.map(appointment => 
      appointment.id === updatedAppointment.id ? updatedAppointment : appointment
    ));
    toast.success('Agendamento atualizado com sucesso!');
  };
  
  const deleteAppointment = (id: string): boolean => {
    // Only allow deletion of appointments that are not finalized
    const appointment = appointments.find(app => app.id === id);
    
    if (appointment && appointment.status === 'finalizado') {
      toast.error('Não é possível excluir um agendamento finalizado.');
      return false;
    }
    
    setAppointments(appointments.filter(appointment => appointment.id !== id));
    toast.success('Agendamento excluído com sucesso!');
    return true;
  };
  
  const confirmAppointment = (id: string) => {
    setAppointments(appointments.map(app => 
      app.id === id ? { ...app, status: 'confirmado' } : app
    ));
    toast.success('Agendamento confirmado!');
  };
  
  const markAppointmentReady = (id: string) => {
    setAppointments(appointments.map(app => 
      app.id === id ? { ...app, status: 'para_retirar' } : app
    ));
    toast.success('Pet pronto para retirada!');
  };
  
  const finalizeAppointment = (id: string, paymentMethod: PaymentMethod) => {
    const appointment = appointments.find(app => app.id === id);
    
    if (!appointment) {
      toast.error('Agendamento não encontrado.');
      return;
    }
    
    if (paymentMethod === 'pending') {
      // Add to client's pending balance
      const client = clients.find(c => c.id === appointment.clientId);
      if (client) {
        updateClient({
          ...client,
          pendingBalance: client.pendingBalance + appointment.price
        });
      }
    }
    
    setAppointments(appointments.map(app => 
      app.id === id ? { 
        ...app, 
        status: 'finalizado', 
        paid: paymentMethod !== 'pending', 
        paymentMethod 
      } : app
    ));
    
    toast.success('Atendimento finalizado com sucesso!');
  };
  
  // Financial Methods
  const addSale = (saleData: Omit<Sale, 'id' | 'date'>) => {
    const newSale: Sale = {
      ...saleData,
      id: uuidv4(),
      date: new Date().toISOString().split('T')[0]
    };
    setSales([...sales, newSale]);
    
    // Update product stock
    saleData.products.forEach(item => {
      const product = products.find(p => p.id === item.productId);
      if (product) {
        updateProduct({
          ...product,
          stock: Math.max(0, product.stock - item.quantity)
        });
      }
    });
    
    // If sale is pending, add to client's pending balance
    if (saleData.clientId && !saleData.paid) {
      const client = clients.find(c => c.id === saleData.clientId);
      if (client) {
        updateClient({
          ...client,
          pendingBalance: client.pendingBalance + saleData.total
        });
      }
    }
    
    toast.success('Venda registrada com sucesso!');
  };
  
  const addExpense = (expenseData: Omit<Expense, 'id'>) => {
    const newExpense: Expense = {
      ...expenseData,
      id: uuidv4()
    };
    setExpenses([...expenses, newExpense]);
    toast.success('Despesa adicionada com sucesso!');
  };
  
  const updateExpense = (updatedExpense: Expense) => {
    setExpenses(expenses.map(expense => 
      expense.id === updatedExpense.id ? updatedExpense : expense
    ));
    toast.success('Despesa atualizada com sucesso!');
  };
  
  const deleteExpense = (id: string): boolean => {
    setExpenses(expenses.filter(expense => expense.id !== id));
    toast.success('Despesa excluída com sucesso!');
    return true;
  };
  
  // Payment Methods
  const registerPayment = (appointmentId: string, method: PaymentMethod) => {
    const appointment = appointments.find(app => app.id === appointmentId);
    
    if (!appointment) {
      toast.error('Agendamento não encontrado.');
      return;
    }
    
    if (method === 'pending') {
      // Add to client's pending balance
      const client = clients.find(c => c.id === appointment.clientId);
      if (client) {
        updateClient({
          ...client,
          pendingBalance: client.pendingBalance + appointment.price
        });
      }
    }
    
    setAppointments(appointments.map(app => 
      app.id === appointmentId ? { 
        ...app, 
        paid: method !== 'pending',
        paymentMethod: method
      } : app
    ));
    
    toast.success('Pagamento registrado com sucesso!');
  };
  
  const settlePendingPayment = (clientId: string, amount: number, method: PaymentMethod) => {
    const client = clients.find(c => c.id === clientId);
    
    if (!client) {
      toast.error('Cliente não encontrado.');
      return;
    }
    
    if (amount > client.pendingBalance) {
      toast.error('Valor maior que o débito pendente.');
      return;
    }
    
    updateClient({
      ...client,
      pendingBalance: client.pendingBalance - amount
    });
    
    toast.success('Pagamento do saldo pendente registrado com sucesso!');
  };
  
  // Profile Methods
  const updateUserProfile = (profile: UserProfile) => {
    setUserProfile(profile);
    toast.success('Perfil atualizado com sucesso!');
  };
  
  // Helper Methods
  const getClientById = (id: string) => clients.find(client => client.id === id);
  const getPetById = (id: string) => pets.find(pet => pet.id === id);
  const getServiceById = (id: string) => services.find(service => service.id === id);
  const getProductById = (id: string) => products.find(product => product.id === id);
  const getTaxiDogById = (id: string) => taxiDogs.find(taxiDog => taxiDog.id === id);
  
  const getPetsByClientId = (clientId: string) => 
    pets.filter(pet => pet.ownerId === clientId);
  
  const getAppointmentsByStatus = (status: Appointment['status']) => 
    appointments.filter(app => app.status === status);
  
  const getAppointmentsByDate = (date: string) => 
    appointments.filter(app => app.date === date);
  
  const getAppointmentsByClientId = (clientId: string) => 
    appointments.filter(app => app.clientId === clientId);
  
  const getSalesByClientId = (clientId: string) => 
    sales.filter(sale => sale.clientId === clientId);
  
  const getDailyIncome = (date: string) => {
    const todaySales = sales.filter(sale => 
      sale.date === date && sale.paid
    );
    
    const todayPaidAppointments = appointments.filter(app => 
      app.date === date && app.paid
    );
    
    const salesTotal = todaySales.reduce((acc, sale) => acc + sale.total, 0);
    const appointmentsTotal = todayPaidAppointments.reduce((acc, app) => acc + app.price, 0);
    
    return salesTotal + appointmentsTotal;
  };
  
  const getMonthlyIncome = (year: number, month: number) => {
    const monthStr = month < 10 ? `0${month}` : `${month}`;
    const datePrefix = `${year}-${monthStr}`;
    
    const monthlySales = sales.filter(sale => 
      sale.date.startsWith(datePrefix) && sale.paid
    );
    
    const monthlyPaidAppointments = appointments.filter(app => 
      app.date.startsWith(datePrefix) && app.paid
    );
    
    const salesTotal = monthlySales.reduce((acc, sale) => acc + sale.total, 0);
    const appointmentsTotal = monthlyPaidAppointments.reduce((acc, app) => acc + app.price, 0);
    
    return salesTotal + appointmentsTotal;
  };
  
  const getDailyExpenses = (date: string) => {
    const dailyExpenses = expenses.filter(expense => expense.date === date);
    return dailyExpenses.reduce((acc, expense) => acc + expense.amount, 0);
  };
  
  const getMonthlyExpenses = (year: number, month: number) => {
    const monthStr = month < 10 ? `0${month}` : `${month}`;
    const datePrefix = `${year}-${monthStr}`;
    
    const monthlyExpenses = expenses.filter(expense => 
      expense.date.startsWith(datePrefix)
    );
    
    return monthlyExpenses.reduce((acc, expense) => acc + expense.amount, 0);
  };
  
  const value: AppContextType = {
    // Data
    clients,
    pets,
    services,
    products,
    taxiDogs,
    appointments,
    expenses,
    sales,
    userProfile,
    
    // Client and Pet Methods
    addClient,
    updateClient,
    deleteClient,
    addPet,
    updatePet,
    deletePet,
    
    // Services and Products Methods
    addService,
    updateService,
    deleteService,
    addProduct,
    updateProduct,
    deleteProduct,
    
    // TaxiDog Methods
    addTaxiDog,
    updateTaxiDog,
    deleteTaxiDog,
    
    // Appointment Methods
    addAppointment,
    updateAppointment,
    deleteAppointment,
    confirmAppointment,
    markAppointmentReady,
    finalizeAppointment,
    
    // Financial Methods
    addSale,
    addExpense,
    updateExpense,
    deleteExpense,
    
    // Payment Methods
    registerPayment,
    settlePendingPayment,
    
    // Profile Methods
    updateUserProfile,
    
    // Helper Methods
    getClientById,
    getPetById,
    getServiceById,
    getProductById,
    getTaxiDogById,
    getPetsByClientId,
    getAppointmentsByStatus,
    getAppointmentsByDate,
    getAppointmentsByClientId,
    getSalesByClientId,
    getDailyIncome,
    getMonthlyIncome,
    getDailyExpenses,
    getMonthlyExpenses
  };
  
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
