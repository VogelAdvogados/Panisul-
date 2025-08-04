import React from 'react';
import { useStore } from '../../context/StoreContext';

/**
 * Página de Estoque: apresenta uma visão simples do estoque diário
 * (produtos finalizados) e dos estoques de insumos ainda a serem
 * implementados. Esta página será expandida para permitir ajustes de
 * estoque manual e visualização de consumo.
 */
export default function EstoquePage() {
  const { products } = useStore();
  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Estoque</h1>
      <h2 className="text-xl font-semibold">Produtos do dia</h2>
      {products.length === 0 ? (
        <p>Não há produtos em estoque hoje.</p>
      ) : (
        <ul className="space-y-2">
          {products.map(p => (
            <li key={p.name} className="border rounded p-3 bg-white">
              {p.name}: {p.dailyStock} un.
            </li>
          ))}
        </ul>
      )}
      <h2 className="text-xl font-semibold mt-4">Insumos</h2>
      <p>A gestão de insumos será adicionada em breve.</p>
    </div>
  );
}
