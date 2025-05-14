
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAppContext } from '@/context/AppContext';
import PageHeader from '@/components/layout/PageHeader';
import TabView from '@/components/common/TabView';
import EmptyState from '@/components/common/EmptyState';
import { getCurrentDate, formatCurrency, formatDate } from '@/utils/helpers';
import { Plus, Search, ShoppingBag, CreditCard, Clock } from 'lucide-react';
import { toast } from 'sonner';
import type { PaymentMethod } from '@/models/types';

const CashRegister: React.FC = () => {
  const navigate = useNavigate();
  const { 
    clients,
    products,
    appointments,
    sales,
    addSale,
    getDailyIncome,
    getDailyExpenses,
    getProductById
  } = useAppContext();
  
  const [selectedDate, setSelectedDate] = useState(getCurrentDate());
  const [searchTerm, setSearchTerm] = useState('');
  
  // POS state
  const [selectedClientId, setSelectedClientId] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<
    Array<{ productId: string; quantity: number; price: number }>
  >([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>('cash');
  
  // Summary calculations
  const dailyIncome = getDailyIncome(selectedDate);
  const dailyExpenses = getDailyExpenses(selectedDate);
  const dailyProfit = dailyIncome - dailyExpenses;
  
  // Filter products based on search
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Calculate total for POS
  const posTotal = selectedProducts.reduce(
    (sum, item) => sum + item.price * item.quantity, 
    0
  );
  
  // Add product to cart
  const addProductToCart = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = selectedProducts.find(item => item.productId === productId);
    
    if (existingItem) {
      setSelectedProducts(
        selectedProducts.map(item => 
          item.productId === productId 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        )
      );
    } else {
      setSelectedProducts([
        ...selectedProducts,
        { productId, quantity: 1, price: product.price }
      ]);
    }
  };
  
  // Remove product from cart
  const removeProductFromCart = (productId: string) => {
    const existingItem = selectedProducts.find(item => item.productId === productId);
    
    if (existingItem && existingItem.quantity > 1) {
      setSelectedProducts(
        selectedProducts.map(item => 
          item.productId === productId 
            ? { ...item, quantity: item.quantity - 1 } 
            : item
        )
      );
    } else {
      setSelectedProducts(
        selectedProducts.filter(item => item.productId !== productId)
      );
    }
  };
  
  // Complete sale
  const completeSale = () => {
    if (selectedProducts.length === 0) {
      toast.error('Selecione pelo menos um produto');
      return;
    }
    
    addSale({
      clientId: selectedClientId || undefined,
      products: selectedProducts,
      total: posTotal,
      paymentMethod: selectedPaymentMethod,
      paid: selectedPaymentMethod !== 'pending'
    });
    
    // Reset state
    setSelectedClientId('');
    setSelectedProducts([]);
    setSelectedPaymentMethod('cash');
    
    toast.success('Venda registrada com sucesso!');
  };
  
  // Render POS tab
  const renderPosTab = () => (
    <div className="space-y-4">
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <h3 className="font-medium mb-3">Cliente (opcional)</h3>
        <select
          value={selectedClientId}
          onChange={(e) => setSelectedClientId(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2"
        >
          <option value="">Sem cliente vinculado</option>
          {clients.map(client => (
            <option key={client.id} value={client.id}>{client.name}</option>
          ))}
        </select>
      </div>
      
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-medium">Produtos</h3>
          <div className="relative w-48">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar produtos..."
              className="pl-8 pr-4 py-1 w-full border border-gray-300 rounded-md text-sm"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-2 mb-4">
          {filteredProducts.map(product => (
            <div 
              key={product.id}
              className="border border-gray-200 rounded-md p-2 cursor-pointer hover:bg-gray-50"
              onClick={() => addProductToCart(product.id)}
            >
              <div className="font-medium text-sm">{product.name}</div>
              <div className="flex justify-between items-center mt-1">
                <span className="text-xs text-gray-500">
                  Estoque: {product.stock}
                </span>
                <span className="text-sm font-medium">
                  {formatCurrency(product.price)}
                </span>
              </div>
            </div>
          ))}
          
          {filteredProducts.length === 0 && (
            <div className="col-span-2 py-4 text-center text-gray-500">
              Nenhum produto encontrado
            </div>
          )}
        </div>
      </div>
      
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <h3 className="font-medium mb-3">Carrinho</h3>
        
        {selectedProducts.length === 0 ? (
          <div className="py-4 text-center text-gray-500">
            Nenhum produto adicionado
          </div>
        ) : (
          <div className="space-y-2 mb-4">
            {selectedProducts.map(item => {
              const product = getProductById(item.productId);
              return product ? (
                <div key={item.productId} className="flex justify-between items-center p-2 border-b border-gray-100">
                  <div className="flex-1">
                    <div className="font-medium">{product.name}</div>
                    <div className="text-sm text-gray-500">
                      {formatCurrency(item.price)} cada
                    </div>
                  </div>
                  <div className="flex items-center">
                    <button
                      type="button"
                      className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeProductFromCart(item.productId);
                      }}
                    >
                      -
                    </button>
                    <span className="mx-3">{item.quantity}</span>
                    <button
                      type="button"
                      className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100"
                      onClick={(e) => {
                        e.stopPropagation();
                        addProductToCart(item.productId);
                      }}
                    >
                      +
                    </button>
                    <div className="ml-4 text-right w-24 font-medium">
                      {formatCurrency(item.price * item.quantity)}
                    </div>
                  </div>
                </div>
              ) : null;
            })}
          </div>
        )}
        
        <div className="border-t border-gray-200 pt-3">
          <div className="flex justify-between items-center mb-4">
            <span className="font-medium">Total</span>
            <span className="text-xl font-semibold">{formatCurrency(posTotal)}</span>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Forma de Pagamento</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                className={`border rounded-md p-2 ${
                  selectedPaymentMethod === 'credit' ? 'border-petblue-DEFAULT bg-blue-50' : 'border-gray-200'
                }`}
                onClick={() => setSelectedPaymentMethod('credit')}
              >
                <CreditCard size={16} className="mb-1 mx-auto" />
                <span className="text-xs">Cartão de Crédito</span>
              </button>
              <button
                type="button"
                className={`border rounded-md p-2 ${
                  selectedPaymentMethod === 'debit' ? 'border-petblue-DEFAULT bg-blue-50' : 'border-gray-200'
                }`}
                onClick={() => setSelectedPaymentMethod('debit')}
              >
                <CreditCard size={16} className="mb-1 mx-auto" />
                <span className="text-xs">Cartão de Débito</span>
              </button>
              <button
                type="button"
                className={`border rounded-md p-2 ${
                  selectedPaymentMethod === 'cash' ? 'border-petblue-DEFAULT bg-blue-50' : 'border-gray-200'
                }`}
                onClick={() => setSelectedPaymentMethod('cash')}
              >
                <ShoppingBag size={16} className="mb-1 mx-auto" />
                <span className="text-xs">Dinheiro</span>
              </button>
              <button
                type="button"
                className={`border rounded-md p-2 ${
                  selectedPaymentMethod === 'pix' ? 'border-petblue-DEFAULT bg-blue-50' : 'border-gray-200'
                }`}
                onClick={() => setSelectedPaymentMethod('pix')}
              >
                <span className="text-md block mb-1">PIX</span>
                <span className="text-xs">Transferência</span>
              </button>
              <button
                type="button"
                className={`border rounded-md p-2 col-span-2 ${
                  selectedPaymentMethod === 'pending' ? 'border-yellow-400 bg-yellow-50' : 'border-gray-200'
                }`}
                onClick={() => setSelectedPaymentMethod('pending')}
              >
                <Clock size={16} className="mb-1 mx-auto" />
                <span className="text-xs">Pagamento Pendente</span>
              </button>
            </div>
          </div>
          
          <Button 
            className="w-full"
            onClick={completeSale}
            disabled={selectedProducts.length === 0}
          >
            Finalizar Venda
          </Button>
        </div>
      </div>
    </div>
  );
  
  // Render summary tab
  const renderSummaryTab = () => (
    <div className="space-y-4">
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
      
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <h3 className="text-sm text-gray-600 mb-1">Receita</h3>
          <p className="font-bold text-xl text-green-600">
            {formatCurrency(dailyIncome)}
          </p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <h3 className="text-sm text-gray-600 mb-1">Despesas</h3>
          <p className="font-bold text-xl text-red-600">
            {formatCurrency(dailyExpenses)}
          </p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <h3 className="text-sm text-gray-600 mb-1">Lucro</h3>
          <p className={`font-bold text-xl ${dailyProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatCurrency(dailyProfit)}
          </p>
        </div>
      </div>
      
      <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
        <h3 className="font-medium mb-3">Pagamentos do Dia</h3>
        
        <div className="space-y-2">
          {appointments
            .filter(app => app.date === selectedDate && app.paid)
            .map(app => (
              <div key={app.id} className="flex justify-between p-2 border-b border-gray-100">
                <div>
                  <span className="text-sm">Atendimento</span>
                  <span className="text-xs text-gray-500 block">{app.time}</span>
                </div>
                <div className="text-right">
                  <span className="block font-medium">{formatCurrency(app.price)}</span>
                  <span className="text-xs text-gray-500">
                    {app.paymentMethod === 'credit' ? 'Cartão de Crédito' :
                     app.paymentMethod === 'debit' ? 'Cartão de Débito' :
                     app.paymentMethod === 'cash' ? 'Dinheiro' :
                     app.paymentMethod === 'pix' ? 'PIX' : 'Pendente'}
                  </span>
                </div>
              </div>
            ))}
            
          {sales
            .filter(sale => sale.date === selectedDate && sale.paid)
            .map(sale => (
              <div key={sale.id} className="flex justify-between p-2 border-b border-gray-100">
                <div>
                  <span className="text-sm">Venda de Produtos</span>
                  <span className="text-xs text-gray-500 block">
                    {sale.products.reduce((sum, p) => sum + p.quantity, 0)} itens
                  </span>
                </div>
                <div className="text-right">
                  <span className="block font-medium">{formatCurrency(sale.total)}</span>
                  <span className="text-xs text-gray-500">
                    {sale.paymentMethod === 'credit' ? 'Cartão de Crédito' :
                     sale.paymentMethod === 'debit' ? 'Cartão de Débito' :
                     sale.paymentMethod === 'cash' ? 'Dinheiro' :
                     sale.paymentMethod === 'pix' ? 'PIX' : 'Pendente'}
                  </span>
                </div>
              </div>
            ))}
          
          {appointments.filter(app => app.date === selectedDate && app.paid).length === 0 && 
           sales.filter(sale => sale.date === selectedDate && sale.paid).length === 0 && (
            <div className="py-4 text-center text-gray-500">
              Nenhum pagamento registrado para esta data
            </div>
          )}
        </div>
      </div>
    </div>
  );
  
  return (
    <div>
      <PageHeader title="Caixa" />
      
      <TabView
        tabs={[
          {
            id: 'summary',
            title: 'Resumo',
            content: renderSummaryTab()
          },
          {
            id: 'pos',
            title: 'PDV',
            content: renderPosTab()
          }
        ]}
      />
    </div>
  );
};

export default CashRegister;
