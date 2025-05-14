
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAppContext } from '@/context/AppContext';
import PageHeader from '@/components/layout/PageHeader';
import { formatDate, formatCurrency } from '@/utils/helpers';
import { Plus, Trash2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

const Expenses: React.FC = () => {
  const { expenses, addExpense, deleteExpense } = useAppContext();
  
  // Form state
  const [isAdding, setIsAdding] = useState(false);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  
  // Handle adding new expense
  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!description || !amount || !category || !date) {
      toast.error('Por favor, preencha todos os campos obrigatórios');
      return;
    }
    
    addExpense({
      description,
      amount: parseFloat(amount),
      category,
      date,
      notes: notes || undefined
    });
    
    // Reset form
    setDescription('');
    setAmount('');
    setCategory('');
    setDate(new Date().toISOString().split('T')[0]);
    setNotes('');
    setIsAdding(false);
    
    toast.success('Despesa registrada com sucesso!');
  };
  
  // Handle expense deletion
  const handleDeleteExpense = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta despesa?')) {
      deleteExpense(id);
      toast.success('Despesa excluída com sucesso!');
    }
  };
  
  // Sort expenses by date (newest first)
  const sortedExpenses = [...expenses].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
  
  return (
    <div>
      <PageHeader 
        title="Despesas" 
        rightElement={
          !isAdding && (
            <Button 
              size="sm"
              variant="default"
              onClick={() => setIsAdding(true)}
            >
              <Plus size={16} className="mr-1" /> Nova
            </Button>
          )
        }
      />
      
      {isAdding ? (
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4 shadow-sm">
          <h3 className="font-medium mb-3">Nova Despesa</h3>
          
          <form onSubmit={handleAddExpense}>
            <div className="space-y-4">
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Descrição *
                </label>
                <input
                  type="text"
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2 w-full"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                  Valor *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    R$
                  </span>
                  <input
                    type="number"
                    id="amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="border border-gray-300 rounded-md pl-9 pr-3 py-2 w-full"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                    Categoria *
                  </label>
                  <select
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-2 w-full"
                    required
                  >
                    <option value="">Selecione</option>
                    <option value="Aluguel">Aluguel</option>
                    <option value="Produtos">Produtos</option>
                    <option value="Equipamentos">Equipamentos</option>
                    <option value="Salários">Salários</option>
                    <option value="Serviços">Serviços</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Manutenção">Manutenção</option>
                    <option value="Impostos">Impostos</option>
                    <option value="Outros">Outros</option>
                  </select>
                </div>
                
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
              </div>
              
              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                  Observações
                </label>
                <textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2 w-full"
                  rows={2}
                />
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => setIsAdding(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit">
                  Salvar
                </Button>
              </div>
            </div>
          </form>
        </div>
      ) : null}
      
      <div className="space-y-4">
        {sortedExpenses.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
            <AlertCircle className="mx-auto text-gray-400 mb-2" size={24} />
            <h3 className="text-lg font-medium text-gray-900 mb-1">Nenhuma despesa registrada</h3>
            <p className="text-gray-500">
              Adicione suas despesas para manter um controle financeiro eficiente.
            </p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => setIsAdding(true)}
            >
              <Plus size={16} className="mr-1" /> Adicionar Despesa
            </Button>
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <div className="grid grid-cols-[1fr,auto,auto] gap-2 p-3 bg-gray-50 border-b border-gray-200 text-sm font-medium text-gray-600">
              <div>Descrição</div>
              <div>Data</div>
              <div className="text-right">Valor</div>
            </div>
            <div className="divide-y divide-gray-100">
              {sortedExpenses.map((expense) => (
                <div key={expense.id} className="p-3 hover:bg-gray-50">
                  <div className="grid grid-cols-[1fr,auto,auto] gap-2 mb-1">
                    <div className="font-medium">{expense.description}</div>
                    <div className="text-sm text-gray-600">{formatDate(expense.date)}</div>
                    <div className="text-right font-medium text-red-600">
                      {formatCurrency(expense.amount)}
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <div className="flex items-center">
                      <span className="bg-gray-100 text-gray-800 text-xs px-2 py-0.5 rounded">
                        {expense.category}
                      </span>
                      {expense.notes && (
                        <span className="ml-2 text-xs text-gray-500">
                          {expense.notes}
                        </span>
                      )}
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="h-8 w-8 p-0 text-gray-500 hover:text-red-600"
                      onClick={() => handleDeleteExpense(expense.id)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Expenses;
