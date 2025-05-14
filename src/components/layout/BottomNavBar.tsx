
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Calendar, User, DollarSign, ShoppingCart, Settings } from 'lucide-react';

const BottomNavBar: React.FC = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center h-14 z-10">
      <NavLink 
        to="/agendamentos" 
        className={({ isActive }) => 
          `flex flex-col items-center justify-center w-1/5 py-1 ${isActive ? 'text-petblue-DEFAULT' : 'text-gray-500'}`
        }
      >
        <Calendar size={20} />
        <span className="text-xs mt-0.5">Agenda</span>
      </NavLink>
      <NavLink 
        to="/clientes" 
        className={({ isActive }) => 
          `flex flex-col items-center justify-center w-1/5 py-1 ${isActive ? 'text-petblue-DEFAULT' : 'text-gray-500'}`
        }
      >
        <User size={20} />
        <span className="text-xs mt-0.5">Clientes</span>
      </NavLink>
      <NavLink 
        to="/caixa" 
        className={({ isActive }) => 
          `flex flex-col items-center justify-center w-1/5 py-1 ${isActive ? 'text-petblue-DEFAULT' : 'text-gray-500'}`
        }
      >
        <DollarSign size={20} />
        <span className="text-xs mt-0.5">Caixa</span>
      </NavLink>
      <NavLink 
        to="/produtos-servicos" 
        className={({ isActive }) => 
          `flex flex-col items-center justify-center w-1/5 py-1 ${isActive ? 'text-petblue-DEFAULT' : 'text-gray-500'}`
        }
      >
        <ShoppingCart size={20} />
        <span className="text-xs mt-0.5">Produtos</span>
      </NavLink>
      <NavLink 
        to="/configuracoes" 
        className={({ isActive }) => 
          `flex flex-col items-center justify-center w-1/5 py-1 ${isActive ? 'text-petblue-DEFAULT' : 'text-gray-500'}`
        }
      >
        <Settings size={20} />
        <span className="text-xs mt-0.5">Config</span>
      </NavLink>
    </nav>
  );
};

export default BottomNavBar;
