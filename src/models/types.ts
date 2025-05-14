
export interface Pet {
  id: string;
  name: string;
  species: string;
  breed: string;
  age?: number;
  weight?: number;
  notes?: string;
  ownerId: string;
}

export interface Client {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address: string;
  neighborhood: string;
  city: string;
  pendingBalance: number;
  notes?: string;
}

export interface Service {
  id: string;
  name: string;
  description?: string;
  price: number;
  duration: number; // in minutes
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
}

export interface TaxiDog {
  id: string;
  neighborhood: string;
  price: number;
  notes?: string;
}

export interface Appointment {
  id: string;
  petId: string;
  clientId: string;
  date: string;
  time: string;
  services: string[];
  taxiDogId?: string;
  status: 'agendado' | 'confirmado' | 'para_retirar' | 'finalizado';
  price: number;
  paid: boolean;
  paymentMethod?: PaymentMethod;
  notes?: string;
}

export type PaymentMethod = 'credit' | 'debit' | 'cash' | 'pix' | 'pending';

export interface Sale {
  id: string;
  clientId?: string;
  products: {
    productId: string;
    quantity: number;
    price: number;
  }[];
  date: string;
  total: number;
  paymentMethod: PaymentMethod;
  paid: boolean;
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
  notes?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  businessName: string;
  email: string;
  phone: string;
  address: string;
  logo?: string;
}
