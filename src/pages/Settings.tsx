
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAppContext } from '@/context/AppContext';
import PageHeader from '@/components/layout/PageHeader';
import TabView from '@/components/common/TabView';
import { toast } from 'sonner';

const Settings: React.FC = () => {
  const { userProfile, updateUserProfile } = useAppContext();
  
  // Form state
  const [name, setName] = useState(userProfile.name);
  const [businessName, setBusinessName] = useState(userProfile.businessName);
  const [email, setEmail] = useState(userProfile.email);
  const [phone, setPhone] = useState(userProfile.phone);
  const [address, setAddress] = useState(userProfile.address);
  
  // Handle profile update
  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !businessName) {
      toast.error('Por favor, preencha os campos obrigatórios');
      return;
    }
    
    updateUserProfile({
      ...userProfile,
      name,
      businessName,
      email,
      phone,
      address
    });
    
    toast.success('Perfil atualizado com sucesso!');
  };
  
  // Render profile tab
  const renderProfileTab = () => (
    <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
      <h3 className="font-medium mb-4">Meu Perfil</h3>
      
      <form onSubmit={handleUpdateProfile}>
        <div className="space-y-4">
          <div>
            <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-1">
              Nome da Empresa *
            </label>
            <input
              type="text"
              id="businessName"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 w-full"
              required
            />
          </div>
          
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Seu Nome *
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
          
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Telefone
            </label>
            <input
              type="tel"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 w-full"
            />
          </div>
          
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
              Endereço
            </label>
            <input
              type="text"
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 w-full"
            />
          </div>
          
          <div>
            <Button type="submit" className="w-full">
              Salvar Alterações
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
  
  // Render about tab
  const renderAboutTab = () => (
    <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
      <h3 className="font-medium mb-4">Sobre o PetTime</h3>
      
      <div className="space-y-4 text-sm">
        <p>
          O PetTime é um sistema de gestão para pet shops e serviços de banho e tosa que visa simplificar o gerenciamento de agendamentos e clientes.
        </p>
        
        <p>
          Com o PetTime, você pode:
        </p>
        
        <ul className="list-disc pl-5 space-y-1">
          <li>Gerenciar agendamentos de forma visual</li>
          <li>Cadastrar clientes e seus pets</li>
          <li>Enviar lembretes via WhatsApp</li>
          <li>Registrar pagamentos</li>
          <li>Controlar estoque de produtos</li>
          <li>Gerar relatórios financeiros</li>
          <li>E muito mais!</li>
        </ul>
        
        <p className="pt-2">
          Versão: 1.0.0
        </p>
      </div>
    </div>
  );
  
  return (
    <div>
      <PageHeader title="Configurações" />
      
      <TabView
        tabs={[
          {
            id: 'profile',
            title: 'Meu Perfil',
            content: renderProfileTab()
          },
          {
            id: 'about',
            title: 'Sobre',
            content: renderAboutTab()
          }
        ]}
      />
    </div>
  );
};

export default Settings;
