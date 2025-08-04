import React, { createContext, useCallback, useContext, useState, useEffect } from 'react';
import { Client, Product, Sale, StoreContextType, Swap } from '../types';

// Cria um contexto para armazenar o estado global do aplicativo. Esse contexto
// inclui listas de produtos, clientes, vendas e trocas, além de funções que
// manipulam esses dados. Os componentes filhos consomem e atualizam esses
// estados através do contexto.
const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [swaps, setSwaps] = useState<Swap[]>([]);

  // Gera IDs simples baseados em timestamp. Para ambientes reais, use uuids.
  const generateId = () => `${Date.now()}-${Math.random().toString(16).slice(2)}`;

  // Carrega dados iniciais das APIs na montagem do componente.
  useEffect(() => {
    const fetchData = async () => {
      const productsData = await fetch('/api/products').then(res => res.json());
      setProducts(productsData);
      const clientsData = await fetch('/api/clients').then(res => res.json());
      setClients(clientsData);
      const salesData = await fetch('/api/sales').then(res => res.json());
      setSales(salesData);
      const swapsData = await fetch('/api/swaps').then(res => res.json());
      setSwaps(swapsData);
    };
    fetchData();
  }, []);

  // Registra produção de produtos. Se existir, soma ao estoque diário;
  // caso contrário, cria novo produto e persiste no backend.
  const registerProduction = useCallback((name: string, quantity: number) => {
    setProducts(prev => {
      const existing = prev.find(p => p.name === name);
      if (existing) {
        return prev.map(p => (p.name === name ? { ...p, dailyStock: p.dailyStock + quantity } : p));
      }
      const newProduct: Product = { name, dailyStock: quantity };
      fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct),
      });
      return [...prev, newProduct];
    });
  }, []);

  // Registra uma venda. Atualiza estoque, adiciona à lista e persiste via API.
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
      fetch('/api/sales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sale),
      });
    },
    [],
  );

  // Registra uma troca (devolução). Atualiza estoque, salva localmente e via API.
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
      fetch('/api/swaps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(swap),
      });
    },
    [],
  );

  // Adiciona um novo cliente ao estado e persiste no backend.
  const addClient = useCallback((client: Omit<Client, 'id'>) => {
    const id = generateId();
    const newClient = { id, ...client };
    setClients(prev => [...prev, newClient]);
    fetch('/api/clients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newClient),
    });
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

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) {
    throw new Error('useStore deve ser usado dentro de um StoreProvider');
  }
  return ctx;
}
