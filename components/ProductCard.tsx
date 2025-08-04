import React, { useState } from 'react';
import { Product } from '../types';
import { VendaModal } from './VendaModal';
import { TrocaModal } from './TrocaModal';

/**
 * Componente visual para representar um produto no Painel do Dia. Exibe
 * informações básicas e oferece ações rápidas de venda e troca por meio de
 * botões que abrem modais correspondentes. O estado interno controla a
 * visibilidade desses modais.
 */
interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [showVenda, setShowVenda] = useState(false);
  const [showTroca, setShowTroca] = useState(false);

  return (
    <div className="border rounded-lg p-4 shadow-sm bg-white space-y-2">
      <h3 className="text-lg font-semibold">{product.name}</h3>
      <p className="text-sm">Estoque do dia: <strong>{product.dailyStock}</strong> un.</p>
      <div className="flex space-x-2">
        <button
          className="flex-1 px-3 py-2 bg-green-600 text-white rounded"
          onClick={() => setShowVenda(true)}
        >
          Vender
        </button>
        <button
          className="flex-1 px-3 py-2 bg-yellow-500 text-white rounded"
          onClick={() => setShowTroca(true)}
        >
          Trocar
        </button>
      </div>
      {/* Modais */}
      <VendaModal
        isOpen={showVenda}
        onClose={() => setShowVenda(false)}
        productName={product.name}
      />
      <TrocaModal
        isOpen={showTroca}
        onClose={() => setShowTroca(false)}
        productName={product.name}
      />
    </div>
  );
};
