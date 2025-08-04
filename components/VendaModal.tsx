import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Sale } from '../types';

/**
 * Componente de modal para registrar uma venda rápida. Recebe o nome do
 * produto e fornece campos para selecionar/registrar cliente, quantidade e
 * forma de pagamento. Ao confirmar, utiliza a função registerSale para
 * atualizar o estado global e encerra o modal.
 */
interface VendaModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
}

export const VendaModal: React.FC<VendaModalProps> = ({ isOpen, onClose, productName }) => {
  const { clients, addClient, registerSale } = useStore();
  const [clientName, setClientName] = useState('');
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [paymentType, setPaymentType] = useState<Sale['paymentType']>('avistapix');
  const [dueDate, setDueDate] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let clientId = selectedClientId;
    // cria cliente se o nome não estiver selecionado
    if (!clientId) {
      clientId = addClient({ name: clientName });
    }
    if (!clientId) return;
    registerSale(clientId, productName, quantity, paymentType, paymentType === 'prazo' ? new Date(dueDate) : undefined);
    // limpar e fechar
    setClientName('');
    setSelectedClientId(null);
    setQuantity(1);
    setPaymentType('avistapix');
    setDueDate('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md overflow-y-auto max-h-full">
        <h2 className="text-xl font-semibold mb-4">Venda Rápida - {productName}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Cliente selection */}
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
          {/* Quantidade */}
          <div>
            <label className="block text-sm font-medium mb-1">Quantidade</label>
            <input
              type="number"
              className="w-full border rounded p-2"
              min={1}
              value={quantity}
              onChange={e => setQuantity(parseInt(e.target.value, 10))}
              required
            />
          </div>
          {/* Pagamento */}
          <div>
            <label className="block text-sm font-medium mb-1">Pagamento</label>
            <div className="flex space-x-2">
              <button
                type="button"
                className={`flex-1 p-2 border rounded ${paymentType === 'avistapix' ? 'bg-blue-600 text-white' : ''}`}
                onClick={() => setPaymentType('avistapix')}
              >
                À vista (PIX)
              </button>
              <button
                type="button"
                className={`flex-1 p-2 border rounded ${paymentType === 'avistadinheiro' ? 'bg-blue-600 text-white' : ''}`}
                onClick={() => setPaymentType('avistadinheiro')}
              >
                À vista (Dinheiro)
              </button>
              <button
                type="button"
                className={`flex-1 p-2 border rounded ${paymentType === 'prazo' ? 'bg-blue-600 text-white' : ''}`}
                onClick={() => setPaymentType('prazo')}
              >
                A prazo
              </button>
            </div>
            {paymentType === 'prazo' && (
              <div className="mt-2">
                <label className="block text-sm font-medium mb-1">Data de vencimento</label>
                <input
                  type="date"
                  className="w-full border rounded p-2"
                  value={dueDate}
                  onChange={e => setDueDate(e.target.value)}
                  required
                />
              </div>
            )}
          </div>
          {/* Ações */}
          <div className="flex justify-end space-x-2">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded">
              Cancelar
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
              Registrar Venda
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
