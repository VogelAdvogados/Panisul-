import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';

/**
 * Componente responsável por registrar a produção de um produto. Ele é
 * exibido como um modal que recebe o nome e a quantidade produzida. Ao
 * confirmar, utiliza a função registerProduction do contexto para
 * atualizar o estoque diário. O modal possui um botão de fechar para
 * cancelar a operação.
 */
interface ProductionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProductionModal: React.FC<ProductionModalProps> = ({ isOpen, onClose }) => {
  const { registerProduction } = useStore();
  const [productName, setProductName] = useState('');
  const [quantity, setQuantity] = useState<number>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productName || quantity <= 0) return;
    registerProduction(productName, quantity);
    setProductName('');
    setQuantity(0);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Registrar Produção</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Produto</label>
            <input
              type="text"
              value={productName}
              onChange={e => setProductName(e.target.value)}
              className="w-full border rounded p-2"
              placeholder="Nome do produto"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Quantidade</label>
            <input
              type="number"
              value={quantity}
              onChange={e => setQuantity(parseInt(e.target.value, 10))}
              className="w-full border rounded p-2"
              placeholder="0"
              min={0}
              required
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded">
              Cancelar
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
              Registrar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
