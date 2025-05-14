
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAppContext } from '@/context/AppContext';
import PageHeader from '@/components/layout/PageHeader';
import { toast } from 'sonner';

const PetForm: React.FC = () => {
  const { id, clientId } = useParams<{ id?: string, clientId?: string }>();
  const navigate = useNavigate();
  const { 
    clients, 
    pets, 
    addPet, 
    updatePet, 
    getPetById,
    getClientById 
  } = useAppContext();
  
  // Form state
  const [name, setName] = useState('');
  const [species, setSpecies] = useState('Cachorro');
  const [breed, setBreed] = useState('');
  const [age, setAge] = useState<number | ''>('');
  const [weight, setWeight] = useState<number | ''>('');
  const [notes, setNotes] = useState('');
  const [ownerId, setOwnerId] = useState(clientId || '');
  
  // Check if editing existing pet
  const isEditing = !!id;
  
  // Load pet data if editing
  useEffect(() => {
    if (isEditing) {
      const pet = getPetById(id);
      if (pet) {
        setName(pet.name);
        setSpecies(pet.species);
        setBreed(pet.breed);
        setAge(pet.age || '');
        setWeight(pet.weight || '');
        setNotes(pet.notes || '');
        setOwnerId(pet.ownerId);
      } else {
        toast.error('Pet não encontrado');
        navigate('/clientes');
      }
    }
  }, [id, isEditing, pets, getPetById, navigate]);
  
  // Form validation
  const isValid = name && species && breed && ownerId;
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isValid) {
      toast.error('Por favor, preencha todos os campos obrigatórios');
      return;
    }
    
    const petData = {
      name,
      species,
      breed,
      age: age || undefined,
      weight: weight || undefined,
      notes: notes || undefined,
      ownerId
    };
    
    if (isEditing && id) {
      updatePet({
        ...petData,
        id
      });
      toast.success('Pet atualizado com sucesso!');
    } else {
      addPet(petData);
      toast.success('Pet adicionado com sucesso!');
    }
    
    navigate(ownerId ? `/cliente/${ownerId}` : '/clientes');
  };
  
  return (
    <div>
      <PageHeader 
        title={isEditing ? 'Editar Pet' : 'Novo Pet'} 
        showBackButton
      />
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          {/* Owner */}
          <div>
            <label htmlFor="owner" className="block text-sm font-medium text-gray-700 mb-1">
              Dono *
            </label>
            <select
              id="owner"
              value={ownerId}
              onChange={(e) => setOwnerId(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 w-full"
              required
              disabled={!!clientId}
            >
              <option value="">Selecione um cliente</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name}
                </option>
              ))}
            </select>
          </div>
          
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Nome *
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
          
          {/* Species */}
          <div>
            <label htmlFor="species" className="block text-sm font-medium text-gray-700 mb-1">
              Espécie *
            </label>
            <select
              id="species"
              value={species}
              onChange={(e) => setSpecies(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 w-full"
              required
            >
              <option value="Cachorro">Cachorro</option>
              <option value="Gato">Gato</option>
              <option value="Ave">Ave</option>
              <option value="Roedor">Roedor</option>
              <option value="Outro">Outro</option>
            </select>
          </div>
          
          {/* Breed */}
          <div>
            <label htmlFor="breed" className="block text-sm font-medium text-gray-700 mb-1">
              Raça *
            </label>
            <input
              type="text"
              id="breed"
              value={breed}
              onChange={(e) => setBreed(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 w-full"
              required
            />
          </div>
          
          {/* Age and Weight */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
                Idade (anos)
              </label>
              <input
                type="number"
                id="age"
                value={age}
                onChange={(e) => setAge(e.target.value ? Number(e.target.value) : '')}
                min="0"
                step="1"
                className="border border-gray-300 rounded-md px-3 py-2 w-full"
              />
            </div>
            <div>
              <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-1">
                Peso (kg)
              </label>
              <input
                type="number"
                id="weight"
                value={weight}
                onChange={(e) => setWeight(e.target.value ? Number(e.target.value) : '')}
                min="0"
                step="0.1"
                className="border border-gray-300 rounded-md px-3 py-2 w-full"
              />
            </div>
          </div>
          
          {/* Notes */}
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
              Observações
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 w-full"
              rows={3}
              placeholder="Alergias, comportamento, preferências, etc."
            />
          </div>
          
          {/* Submit button */}
          <div>
            <Button 
              type="submit" 
              className="w-full"
              disabled={!isValid}
            >
              {isEditing ? 'Atualizar Pet' : 'Adicionar Pet'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PetForm;
