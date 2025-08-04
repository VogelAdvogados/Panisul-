import React, { createContext, useCallback, useContext, useState } from 'react';
import { Client, Product, Sale, StoreContextType, Swap } from '../types';

/**
 * Cria um contexto React responsável por armazenar o estado central do
 * aplicativo Panisul. Este contexto contém listas de produtos, clientes,
 * vendas e trocas, bem como funções para manipular esses dados. Ao utilizar
 * este contexto, os componentes filhos podem consumir e alterar o estado
 * global de forma controlada.
 */
const StoreContext = createContext<StoreContextType | undefined>(undefined);

/**
 * Provedor do contexto. Encapsula todo o estado do aplicativo e fornece
 * métodos para registrarem produção, vendas e trocas. O estado é
 * armazenado em variáveis useState e alterado através dos métodos
 * correspondentes.
 */
export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [swaps, setSwaps] = useState<Swap[]>([]);

  // Gera um identificador simples baseado em timestamp. Em um ambiente
  // real, recomenda‑se usar bibliotecas como uuid para IDs mais robustos.
  const generateId = () => `${Date.now()}-${Math.random().toString(16).slice(2)}`;

  /**
   * Registra a produção de um produto. Se o produto já existir no estoque
   * do dia, soma a quantidade; caso contrário, adiciona um novo produto ao
   * array com o estoque inicial correspondente. O nome do produto deve
   * estar previamente cadastrado na lista de produtos base, mas aqui
   * permitimos criação ad hoc para simplificação.
   */
  const registerProduction = useCallback((name: string, quantity: number) => {
    setProducts(prev => {
      const existing = prev.find(p => p.name === name);
      if (existing) {
        return prev.map(p => (p.name === name ? { ...p, dailyStock: p.dailyStock + quantity } : p));
      }
      const newProduct: Product = { name, dailyStock: quantity };
      return [...prev, newProduct];
    });
  }, []);

  /**
   * Registra uma venda. Atualiza o estoque diário do produto, adiciona o
   * registro de venda à lista de vendas e associa a venda ao cliente
   * existente ou cria um novo cliente se necessário. Em vendas a prazo, a
   * data de vencimento deve ser fornecida.
   */
  const registerSale = useCallback(
    (
      clientId: string,
      productName: string,
      quantity: number,
      paymentType: Sale['paymentType'],
      dueDate?: Date,
    ) => {
      setProducts(prev => prev.map(p => (p.name === productName ? { ...p, dailyStock: p.dailyStock - quantity } : p)));
      const sale: Sale = {
        id: generateId(),
        clientId,
        productName,
        quantity,
        paymentType,
        dueDate,
        createdAt: new Date(),
      };
      setSales(prev => [...prev, sale]);
    },
    [],
  );

  /**
   * Registra uma troca (devolução). Diminui a quantidade do produto atual e
   * adiciona o registro à lista de trocas. A lógica de adicionar um
   * "produto devolvido" ao estoque pode ser implementada conforme a
   * necessidade.
   */
  const registerSwap = useCallback(
    (
      clientId: string,
      productName: string,
      quantity: number,
      returnedProduct?: string,
      reason?: string,
    ) => {
      setProducts(prev => prev.map(p => (p.name === productName ? { ...p, dailyStock: p.dailyStock - quantity } : p)));
      const swap: Swap = {
        id: generateId(),
        clientId,
        productName,
        quantity,
        returnedProduct,
        reason,
        createdAt: new Date(),
      };
      setSwaps(prev => [...prev, swap]);
    },
    [],
  );

  /**
   * Adiciona um novo cliente ao cadastro e retorna o ID gerado. Esta
   * função aceita um objeto contendo os dados do cliente (excluindo o id).
   */
  const addClient = useCallback((client: Omit<Client, 'id'>) => {
    const id = generateId();
    setClients(prev => [...prev, { id, ...client }]);
    return id;
  }, []);

  const value: StoreContextType = {
    products,
    clients,
    sales,
    swaps,
    registerProduction,
    registerSale,
    registerSwap,
    addClient,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
};

/**
 * Hook auxiliar para consumir o contexto. Retorna o contexto se estiver
 * disponível; caso contrário, lança um erro informando que o componente
 * precisa estar dentro de um StoreProvider.
 */
export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) {
    throw new Error('useStore deve ser usado dentro de um StoreProvider');
  }
  return ctx;
}
