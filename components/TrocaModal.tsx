import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';

/**
 * Modal para registrar trocas (devoluções). Permite selecionar ou criar
 * cliente, informar a quantidade devolvida, o produto devolvido e o
 * motivo. Após confirmar, o registro é adicionado ao contexto global.
 */
interface TrocaModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
}

export const TrocaModal: React.FC<TrocaModalProps> = ({ isOpen, onClose, productName }) => {
  const { clients, addClient, registerSwap } = useStore();
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [clientName, setClientName] = useState('');
  const [quantity, setQuantity] = useState<number>(1);
  const [returnedProduct, setReturnedProduct] = useState('');
  const [reason, setReason] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let clientId = selectedClientId;
    if (!clientId) {
      clientId = addClient({ name: clientName });
    }
    if (!clientId) return;
    registerSwap(clientId, productName, quantity, returnedProduct || undefined, reason || undefined);
    setSelectedClientId(null);
    setClientName('');
    setQuantity(1);
    setReturnedProduct('');
    setReason('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Registrar Troca - {productName}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Cliente</label>
            <select
              className="w-full border rounded p-2"
              value={selectedClientId || ''}
              onChange={e => {
                const id = e.target.value;
                setSelectedClientId(id || null);
                if (id) {
                  const found = clients.find(c => c.id === id);
                  setClientName(found?.name || '');
                }
              }}
            >
              <option value="">Novo cliente…</option>
              {clients.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            {!selectedClientId && (
              <input
                type="text"
                className="w-full border rounded p-2 mt-2"
                placeholder="Nome do cliente"
                value={clientName}
                onChange={e => setClientName(e.target.value)}
                required
              />
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Quantidade devolvida</label>
            <input
              type="number"
              className="w-full border rounded p-2"
              min={1}
              value={quantity}
              onChange={e => setQuantity(parseInt(e.target.value, 10))}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Produto devolvido (opcional)</label>
            <input
              type="text"
              className="w-full border rounded p-2"
              value={returnedProduct}
              onChange={e => setReturnedProduct(e.target.value)}
              placeholder="Nome do produto devolvido"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Motivo (opcional)</label>
            <textarea
              className="w-full border rounded p-2"
              value={reason}
              onChange={e => setReason(e.target.value)}
              placeholder="Descreva o motivo da troca"
            ></textarea>
          </div>
          <div className="flex justify-end space-x-2">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded">
              Cancelar
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
              Registrar Troca
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
