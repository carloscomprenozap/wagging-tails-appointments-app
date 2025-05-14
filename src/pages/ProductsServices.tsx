
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAppContext } from '@/context/AppContext';
import PageHeader from '@/components/layout/PageHeader';
import TabView from '@/components/common/TabView';
import EmptyState from '@/components/common/EmptyState';
import { formatCurrency } from '@/utils/helpers';
import { Plus, Search, Edit, Trash2, Clock } from 'lucide-react';
import { toast } from 'sonner';

const ProductsServices: React.FC = () => {
  const { 
    services, 
    products, 
    taxiDogs, 
    addService, 
    updateService, 
    deleteService,
    addProduct,
    updateProduct,
    deleteProduct,
    addTaxiDog,
    updateTaxiDog,
    deleteTaxiDog
  } = useAppContext();
  
  // State for search terms
  const [productSearchTerm, setProductSearchTerm] = useState('');
  const [serviceSearchTerm, setServiceSearchTerm] = useState('');
  const [taxiDogSearchTerm, setTaxiDogSearchTerm] = useState('');
  
  // Edit states for products, services, and taxiDogs
  const [editingProduct, setEditingProduct] = useState<typeof products[0] | null>(null);
  const [editingService, setEditingService] = useState<typeof services[0] | null>(null);
  const [editingTaxiDog, setEditingTaxiDog] = useState<typeof taxiDogs[0] | null>(null);
  
  // Add states
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [isAddingService, setIsAddingService] = useState(false);
  const [isAddingTaxiDog, setIsAddingTaxiDog] = useState(false);
  
  // New product form state
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    stock: ''
  });
  
  // New service form state
  const [newService, setNewService] = useState({
    name: '',
    description: '',
    price: '',
    duration: ''
  });
  
  // New taxi dog form state
  const [newTaxiDog, setNewTaxiDog] = useState({
    neighborhood: '',
    price: '',
    notes: ''
  });
  
  // Filter products, services, and taxiDogs based on search terms
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(productSearchTerm.toLowerCase()) ||
    (product.description && product.description.toLowerCase().includes(productSearchTerm.toLowerCase()))
  );
  
  const filteredServices = services.filter(service =>
    service.name.toLowerCase().includes(serviceSearchTerm.toLowerCase()) ||
    (service.description && service.description.toLowerCase().includes(serviceSearchTerm.toLowerCase()))
  );
  
  const filteredTaxiDogs = taxiDogs.filter(taxiDog =>
    taxiDog.neighborhood.toLowerCase().includes(taxiDogSearchTerm.toLowerCase())
  );
  
  // Handle adding a new product
  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.price || !newProduct.stock) {
      toast.error('Por favor, preencha todos os campos obrigatórios');
      return;
    }
    
    addProduct({
      name: newProduct.name,
      description: newProduct.description || undefined,
      price: parseFloat(newProduct.price),
      stock: parseInt(newProduct.stock, 10)
    });
    
    // Reset form and state
    setNewProduct({
      name: '',
      description: '',
      price: '',
      stock: ''
    });
    setIsAddingProduct(false);
    
    toast.success('Produto adicionado com sucesso!');
  };
  
  // Handle updating a product
  const handleUpdateProduct = () => {
    if (!editingProduct || !editingProduct.name || !editingProduct.price) {
      toast.error('Por favor, preencha todos os campos obrigatórios');
      return;
    }
    
    updateProduct({
      ...editingProduct,
      price: parseFloat(editingProduct.price as any),
      stock: parseInt(editingProduct.stock as any, 10)
    });
    
    setEditingProduct(null);
    
    toast.success('Produto atualizado com sucesso!');
  };
  
  // Handle adding a new service
  const handleAddService = () => {
    if (!newService.name || !newService.price || !newService.duration) {
      toast.error('Por favor, preencha todos os campos obrigatórios');
      return;
    }
    
    addService({
      name: newService.name,
      description: newService.description || undefined,
      price: parseFloat(newService.price),
      duration: parseInt(newService.duration, 10)
    });
    
    // Reset form and state
    setNewService({
      name: '',
      description: '',
      price: '',
      duration: ''
    });
    setIsAddingService(false);
    
    toast.success('Serviço adicionado com sucesso!');
  };
  
  // Handle updating a service
  const handleUpdateService = () => {
    if (!editingService || !editingService.name || !editingService.price) {
      toast.error('Por favor, preencha todos os campos obrigatórios');
      return;
    }
    
    updateService({
      ...editingService,
      price: parseFloat(editingService.price as any),
      duration: parseInt(editingService.duration as any, 10)
    });
    
    setEditingService(null);
    
    toast.success('Serviço atualizado com sucesso!');
  };
  
  // Handle adding a new taxi dog service
  const handleAddTaxiDog = () => {
    if (!newTaxiDog.neighborhood || !newTaxiDog.price) {
      toast.error('Por favor, preencha todos os campos obrigatórios');
      return;
    }
    
    addTaxiDog({
      neighborhood: newTaxiDog.neighborhood,
      price: parseFloat(newTaxiDog.price),
      notes: newTaxiDog.notes || undefined
    });
    
    // Reset form and state
    setNewTaxiDog({
      neighborhood: '',
      price: '',
      notes: ''
    });
    setIsAddingTaxiDog(false);
    
    toast.success('Serviço de Taxi Dog adicionado com sucesso!');
  };
  
  // Handle updating a taxi dog service
  const handleUpdateTaxiDog = () => {
    if (!editingTaxiDog || !editingTaxiDog.neighborhood || !editingTaxiDog.price) {
      toast.error('Por favor, preencha todos os campos obrigatórios');
      return;
    }
    
    updateTaxiDog({
      ...editingTaxiDog,
      price: parseFloat(editingTaxiDog.price as any)
    });
    
    setEditingTaxiDog(null);
    
    toast.success('Serviço de Taxi Dog atualizado com sucesso!');
  };
  
  // Render products tab
  const renderProductsTab = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="relative w-full max-w-xs">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            value={productSearchTerm}
            onChange={(e) => setProductSearchTerm(e.target.value)}
            placeholder="Buscar produtos..."
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md"
          />
        </div>
        <Button
          onClick={() => {
            setIsAddingProduct(true);
            setEditingProduct(null);
          }}
          disabled={isAddingProduct}
        >
          <Plus size={16} className="mr-1" /> Novo Produto
        </Button>
      </div>
      
      {isAddingProduct && (
        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <h3 className="font-medium mb-3">Novo Produto</h3>
          
          <div className="space-y-3">
            <div>
              <label htmlFor="product-name" className="block text-sm font-medium text-gray-700 mb-1">
                Nome *
              </label>
              <input
                type="text"
                id="product-name"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                className="border border-gray-300 rounded-md px-3 py-2 w-full"
                required
              />
            </div>
            
            <div>
              <label htmlFor="product-description" className="block text-sm font-medium text-gray-700 mb-1">
                Descrição
              </label>
              <input
                type="text"
                id="product-description"
                value={newProduct.description}
                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                className="border border-gray-300 rounded-md px-3 py-2 w-full"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="product-price" className="block text-sm font-medium text-gray-700 mb-1">
                  Preço *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    R$
                  </span>
                  <input
                    type="number"
                    id="product-price"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    className="border border-gray-300 rounded-md pl-9 pr-3 py-2 w-full"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="product-stock" className="block text-sm font-medium text-gray-700 mb-1">
                  Estoque *
                </label>
                <input
                  type="number"
                  id="product-stock"
                  value={newProduct.stock}
                  onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                  className="border border-gray-300 rounded-md px-3 py-2 w-full"
                  min="0"
                  step="1"
                  required
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-2 pt-2">
              <Button 
                type="button" 
                variant="outline"
                onClick={() => setIsAddingProduct(false)}
              >
                Cancelar
              </Button>
              <Button type="button" onClick={handleAddProduct}>
                Salvar
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {editingProduct && (
        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <h3 className="font-medium mb-3">Editar Produto</h3>
          
          <div className="space-y-3">
            <div>
              <label htmlFor="edit-product-name" className="block text-sm font-medium text-gray-700 mb-1">
                Nome *
              </label>
              <input
                type="text"
                id="edit-product-name"
                value={editingProduct.name}
                onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                className="border border-gray-300 rounded-md px-3 py-2 w-full"
                required
              />
            </div>
            
            <div>
              <label htmlFor="edit-product-description" className="block text-sm font-medium text-gray-700 mb-1">
                Descrição
              </label>
              <input
                type="text"
                id="edit-product-description"
                value={editingProduct.description || ''}
                onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                className="border border-gray-300 rounded-md px-3 py-2 w-full"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="edit-product-price" className="block text-sm font-medium text-gray-700 mb-1">
                  Preço *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    R$
                  </span>
                  <input
                    type="number"
                    id="edit-product-price"
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
                    className="border border-gray-300 rounded-md pl-9 pr-3 py-2 w-full"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="edit-product-stock" className="block text-sm font-medium text-gray-700 mb-1">
                  Estoque *
                </label>
                <input
                  type="number"
                  id="edit-product-stock"
                  value={editingProduct.stock}
                  onChange={(e) => setEditingProduct({ ...editingProduct, stock: e.target.value })}
                  className="border border-gray-300 rounded-md px-3 py-2 w-full"
                  min="0"
                  step="1"
                  required
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-2 pt-2">
              <Button 
                type="button" 
                variant="outline"
                onClick={() => setEditingProduct(null)}
              >
                Cancelar
              </Button>
              <Button type="button" onClick={handleUpdateProduct}>
                Atualizar
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {filteredProducts.length === 0 && !isAddingProduct && !editingProduct ? (
        <EmptyState
          title="Nenhum produto cadastrado"
          description="Adicione produtos para vender em sua loja."
          action={
            <Button onClick={() => setIsAddingProduct(true)} size="sm">
              <Plus size={16} className="mr-1" /> Adicionar Produto
            </Button>
          }
        />
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="grid grid-cols-[1fr,auto,auto,auto] gap-2 p-3 bg-gray-50 border-b border-gray-200 text-sm font-medium text-gray-600">
            <div>Nome</div>
            <div>Preço</div>
            <div>Estoque</div>
            <div></div>
          </div>
          <div className="divide-y divide-gray-100">
            {filteredProducts.map((product) => (
              <div key={product.id} className="p-3 hover:bg-gray-50">
                <div className="grid grid-cols-[1fr,auto,auto,auto] gap-2 items-center">
                  <div>
                    <div className="font-medium">{product.name}</div>
                    {product.description && (
                      <div className="text-xs text-gray-500">{product.description}</div>
                    )}
                  </div>
                  <div className="font-medium">{formatCurrency(product.price)}</div>
                  <div className="text-center">{product.stock}</div>
                  <div className="flex space-x-1">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="h-8 w-8 p-0 text-gray-500"
                      onClick={() => {
                        setEditingProduct(product);
                        setIsAddingProduct(false);
                      }}
                    >
                      <Edit size={16} />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="h-8 w-8 p-0 text-gray-500 hover:text-red-600"
                      onClick={() => {
                        const success = deleteProduct(product.id);
                        if (success) {
                          toast.success('Produto excluído com sucesso!');
                        }
                      }}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
  
  // Render services tab
  const renderServicesTab = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="relative w-full max-w-xs">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            value={serviceSearchTerm}
            onChange={(e) => setServiceSearchTerm(e.target.value)}
            placeholder="Buscar serviços..."
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md"
          />
        </div>
        <Button
          onClick={() => {
            setIsAddingService(true);
            setEditingService(null);
          }}
          disabled={isAddingService}
        >
          <Plus size={16} className="mr-1" /> Novo Serviço
        </Button>
      </div>
      
      {isAddingService && (
        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <h3 className="font-medium mb-3">Novo Serviço</h3>
          
          <div className="space-y-3">
            <div>
              <label htmlFor="service-name" className="block text-sm font-medium text-gray-700 mb-1">
                Nome *
              </label>
              <input
                type="text"
                id="service-name"
                value={newService.name}
                onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                className="border border-gray-300 rounded-md px-3 py-2 w-full"
                required
              />
            </div>
            
            <div>
              <label htmlFor="service-description" className="block text-sm font-medium text-gray-700 mb-1">
                Descrição
              </label>
              <input
                type="text"
                id="service-description"
                value={newService.description}
                onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                className="border border-gray-300 rounded-md px-3 py-2 w-full"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="service-price" className="block text-sm font-medium text-gray-700 mb-1">
                  Preço *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    R$
                  </span>
                  <input
                    type="number"
                    id="service-price"
                    value={newService.price}
                    onChange={(e) => setNewService({ ...newService, price: e.target.value })}
                    className="border border-gray-300 rounded-md pl-9 pr-3 py-2 w-full"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="service-duration" className="block text-sm font-medium text-gray-700 mb-1">
                  Duração (minutos) *
                </label>
                <input
                  type="number"
                  id="service-duration"
                  value={newService.duration}
                  onChange={(e) => setNewService({ ...newService, duration: e.target.value })}
                  className="border border-gray-300 rounded-md px-3 py-2 w-full"
                  min="0"
                  step="1"
                  required
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-2 pt-2">
              <Button 
                type="button" 
                variant="outline"
                onClick={() => setIsAddingService(false)}
              >
                Cancelar
              </Button>
              <Button type="button" onClick={handleAddService}>
                Salvar
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {editingService && (
        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <h3 className="font-medium mb-3">Editar Serviço</h3>
          
          <div className="space-y-3">
            <div>
              <label htmlFor="edit-service-name" className="block text-sm font-medium text-gray-700 mb-1">
                Nome *
              </label>
              <input
                type="text"
                id="edit-service-name"
                value={editingService.name}
                onChange={(e) => setEditingService({ ...editingService, name: e.target.value })}
                className="border border-gray-300 rounded-md px-3 py-2 w-full"
                required
              />
            </div>
            
            <div>
              <label htmlFor="edit-service-description" className="block text-sm font-medium text-gray-700 mb-1">
                Descrição
              </label>
              <input
                type="text"
                id="edit-service-description"
                value={editingService.description || ''}
                onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
                className="border border-gray-300 rounded-md px-3 py-2 w-full"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="edit-service-price" className="block text-sm font-medium text-gray-700 mb-1">
                  Preço *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    R$
                  </span>
                  <input
                    type="number"
                    id="edit-service-price"
                    value={editingService.price}
                    onChange={(e) => setEditingService({ ...editingService, price: e.target.value })}
                    className="border border-gray-300 rounded-md pl-9 pr-3 py-2 w-full"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="edit-service-duration" className="block text-sm font-medium text-gray-700 mb-1">
                  Duração (minutos) *
                </label>
                <input
                  type="number"
                  id="edit-service-duration"
                  value={editingService.duration}
                  onChange={(e) => setEditingService({ ...editingService, duration: e.target.value })}
                  className="border border-gray-300 rounded-md px-3 py-2 w-full"
                  min="0"
                  step="1"
                  required
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-2 pt-2">
              <Button 
                type="button" 
                variant="outline"
                onClick={() => setEditingService(null)}
              >
                Cancelar
              </Button>
              <Button type="button" onClick={handleUpdateService}>
                Atualizar
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {filteredServices.length === 0 && !isAddingService && !editingService ? (
        <EmptyState
          title="Nenhum serviço cadastrado"
          description="Adicione serviços que sua empresa oferece."
          action={
            <Button onClick={() => setIsAddingService(true)} size="sm">
              <Plus size={16} className="mr-1" /> Adicionar Serviço
            </Button>
          }
        />
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="grid grid-cols-[1fr,auto,auto,auto] gap-2 p-3 bg-gray-50 border-b border-gray-200 text-sm font-medium text-gray-600">
            <div>Nome</div>
            <div>Preço</div>
            <div>Duração</div>
            <div></div>
          </div>
          <div className="divide-y divide-gray-100">
            {filteredServices.map((service) => (
              <div key={service.id} className="p-3 hover:bg-gray-50">
                <div className="grid grid-cols-[1fr,auto,auto,auto] gap-2 items-center">
                  <div>
                    <div className="font-medium">{service.name}</div>
                    {service.description && (
                      <div className="text-xs text-gray-500">{service.description}</div>
                    )}
                  </div>
                  <div className="font-medium">{formatCurrency(service.price)}</div>
                  <div className="text-center whitespace-nowrap">
                    {service.duration} min
                  </div>
                  <div className="flex space-x-1">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="h-8 w-8 p-0 text-gray-500"
                      onClick={() => {
                        setEditingService(service);
                        setIsAddingService(false);
                      }}
                    >
                      <Edit size={16} />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="h-8 w-8 p-0 text-gray-500 hover:text-red-600"
                      onClick={() => {
                        const success = deleteService(service.id);
                        if (success) {
                          toast.success('Serviço excluído com sucesso!');
                        }
                      }}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
  
  // Render taxi dog tab
  const renderTaxiDogTab = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="relative w-full max-w-xs">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            value={taxiDogSearchTerm}
            onChange={(e) => setTaxiDogSearchTerm(e.target.value)}
            placeholder="Buscar bairros..."
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md"
          />
        </div>
        <Button
          onClick={() => {
            setIsAddingTaxiDog(true);
            setEditingTaxiDog(null);
          }}
          disabled={isAddingTaxiDog}
        >
          <Plus size={16} className="mr-1" /> Novo Taxi Dog
        </Button>
      </div>
      
      {isAddingTaxiDog && (
        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <h3 className="font-medium mb-3">Novo Serviço de Taxi Dog</h3>
          
          <div className="space-y-3">
            <div>
              <label htmlFor="taxidog-neighborhood" className="block text-sm font-medium text-gray-700 mb-1">
                Bairro *
              </label>
              <input
                type="text"
                id="taxidog-neighborhood"
                value={newTaxiDog.neighborhood}
                onChange={(e) => setNewTaxiDog({ ...newTaxiDog, neighborhood: e.target.value })}
                className="border border-gray-300 rounded-md px-3 py-2 w-full"
                required
              />
            </div>
            
            <div>
              <label htmlFor="taxidog-price" className="block text-sm font-medium text-gray-700 mb-1">
                Preço *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  R$
                </span>
                <input
                  type="number"
                  id="taxidog-price"
                  value={newTaxiDog.price}
                  onChange={(e) => setNewTaxiDog({ ...newTaxiDog, price: e.target.value })}
                  className="border border-gray-300 rounded-md pl-9 pr-3 py-2 w-full"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="taxidog-notes" className="block text-sm font-medium text-gray-700 mb-1">
                Observações
              </label>
              <input
                type="text"
                id="taxidog-notes"
                value={newTaxiDog.notes}
                onChange={(e) => setNewTaxiDog({ ...newTaxiDog, notes: e.target.value })}
                className="border border-gray-300 rounded-md px-3 py-2 w-full"
                placeholder="Ex: Até 5km do pet shop"
              />
            </div>
            
            <div className="flex justify-end space-x-2 pt-2">
              <Button 
                type="button" 
                variant="outline"
                onClick={() => setIsAddingTaxiDog(false)}
              >
                Cancelar
              </Button>
              <Button type="button" onClick={handleAddTaxiDog}>
                Salvar
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {editingTaxiDog && (
        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <h3 className="font-medium mb-3">Editar Serviço de Taxi Dog</h3>
          
          <div className="space-y-3">
            <div>
              <label htmlFor="edit-taxidog-neighborhood" className="block text-sm font-medium text-gray-700 mb-1">
                Bairro *
              </label>
              <input
                type="text"
                id="edit-taxidog-neighborhood"
                value={editingTaxiDog.neighborhood}
                onChange={(e) => setEditingTaxiDog({ ...editingTaxiDog, neighborhood: e.target.value })}
                className="border border-gray-300 rounded-md px-3 py-2 w-full"
                required
              />
            </div>
            
            <div>
              <label htmlFor="edit-taxidog-price" className="block text-sm font-medium text-gray-700 mb-1">
                Preço *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  R$
                </span>
                <input
                  type="number"
                  id="edit-taxidog-price"
                  value={editingTaxiDog.price}
                  onChange={(e) => setEditingTaxiDog({ ...editingTaxiDog, price: e.target.value })}
                  className="border border-gray-300 rounded-md pl-9 pr-3 py-2 w-full"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="edit-taxidog-notes" className="block text-sm font-medium text-gray-700 mb-1">
                Observações
              </label>
              <input
                type="text"
                id="edit-taxidog-notes"
                value={editingTaxiDog.notes || ''}
                onChange={(e) => setEditingTaxiDog({ ...editingTaxiDog, notes: e.target.value })}
                className="border border-gray-300 rounded-md px-3 py-2 w-full"
                placeholder="Ex: Até 5km do pet shop"
              />
            </div>
            
            <div className="flex justify-end space-x-2 pt-2">
              <Button 
                type="button" 
                variant="outline"
                onClick={() => setEditingTaxiDog(null)}
              >
                Cancelar
              </Button>
              <Button type="button" onClick={handleUpdateTaxiDog}>
                Atualizar
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {filteredTaxiDogs.length === 0 && !isAddingTaxiDog && !editingTaxiDog ? (
        <EmptyState
          title="Nenhum serviço de Taxi Dog cadastrado"
          description="Adicione bairros e valores para seus serviços de Taxi Dog."
          action={
            <Button onClick={() => setIsAddingTaxiDog(true)} size="sm">
              <Plus size={16} className="mr-1" /> Adicionar Taxi Dog
            </Button>
          }
        />
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="grid grid-cols-[1fr,auto,auto] gap-2 p-3 bg-gray-50 border-b border-gray-200 text-sm font-medium text-gray-600">
            <div>Bairro</div>
            <div>Preço</div>
            <div></div>
          </div>
          <div className="divide-y divide-gray-100">
            {filteredTaxiDogs.map((taxiDog) => (
              <div key={taxiDog.id} className="p-3 hover:bg-gray-50">
                <div className="grid grid-cols-[1fr,auto,auto] gap-2 items-center">
                  <div>
                    <div className="font-medium">{taxiDog.neighborhood}</div>
                    {taxiDog.notes && (
                      <div className="text-xs text-gray-500">{taxiDog.notes}</div>
                    )}
                  </div>
                  <div className="font-medium">{formatCurrency(taxiDog.price)}</div>
                  <div className="flex space-x-1">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="h-8 w-8 p-0 text-gray-500"
                      onClick={() => {
                        setEditingTaxiDog(taxiDog);
                        setIsAddingTaxiDog(false);
                      }}
                    >
                      <Edit size={16} />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="h-8 w-8 p-0 text-gray-500 hover:text-red-600"
                      onClick={() => {
                        const success = deleteTaxiDog(taxiDog.id);
                        if (success) {
                          toast.success('Serviço de Taxi Dog excluído com sucesso!');
                        }
                      }}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
  
  return (
    <div>
      <PageHeader title="Produtos e Serviços" />
      
      <TabView
        tabs={[
          {
            id: 'products',
            title: 'Produtos',
            content: renderProductsTab()
          },
          {
            id: 'services',
            title: 'Serviços',
            content: renderServicesTab()
          },
          {
            id: 'taxidog',
            title: 'Taxi Dog',
            content: renderTaxiDogTab()
          }
        ]}
      />
    </div>
  );
};

export default ProductsServices;
