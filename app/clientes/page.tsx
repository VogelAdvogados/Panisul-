import React from 'react';
import { useStore } from '../../context/StoreContext';

/**
 * Página Clientes & Vendas: exibe a lista de clientes cadastrados e
 * fornece um resumo simples de compras e saldo devedor. Esta é uma
 * visualização inicial que poderá ser expandida com filtros e gráficos.
 */
export default function ClientesPage() {
  const { clients, sales } = useStore();
  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Clientes & Vendas</h1>
      {clients.length === 0 ? (
        <p>Nenhum cliente cadastrado até o momento.</p>
      ) : (
        <ul className="space-y-2">
          {clients.map(client => {
            const clienteSales = sales.filter(s => s.clientId === client.id);
            const totalPurchases = clienteSales.reduce((sum, s) => sum + s.quantity, 0);
            return (
              <li key={client.id} className="border rounded p-3 bg-white">
                <h2 className="font-semibold">{client.name}</h2>
                <p>Compras: {totalPurchases} itens</p>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
