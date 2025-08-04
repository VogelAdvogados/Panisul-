import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ProductionModal } from './ProductionModal';
import { ProductCard } from './ProductCard';

/**
 * Painel central do dia. Este componente reúne os cards de produtos
 * produzidos e fornece um botão para registrar nova produção. Também
 * apresenta uma mensagem quando não há produtos registrados. O objetivo é
 * oferecer uma visão consolidada e interativa do dia em uma única tela.
 */
export const DayPanel: React.FC = () => {
  const { products } = useStore();
  const [showProductionModal, setShowProductionModal] = useState(false);

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Painel do Dia</h1>
        <button
          onClick={() => setShowProductionModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          + Registrar Produção
        </button>
      </div>
      {products.length === 0 ? (
        <p className="text-gray-600">Nenhuma produção registrada hoje. Use o botão acima para começar.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {products.map(product => (
            <ProductCard key={product.name} product={product} />
          ))}
        </div>
      )}
      <ProductionModal isOpen={showProductionModal} onClose={() => setShowProductionModal(false)} />
    </div>
  );
};
