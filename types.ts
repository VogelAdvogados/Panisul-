/**
 * Define interfaces and types used across the Panisul system.
 */

// Represents an individual product in the system. Each product has a unique
// name, a current stock level for the day and an optional identifier
// referencing its technical sheet (ficha técnica). Additional fields like
// price can be added later on.
export interface Product {
  /** Nome único do produto */
  name: string;
  /** Quantidade disponível no estoque diário */
  dailyStock: number;
  /** Identificador da ficha técnica associada, se existir */
  technicalSheetId?: string;
}

// Represents a client in the system. The legal identification (CPF/CNPJ) is
// optional at this stage but can be enforced later when integrating with
// Receita Federal. A history of purchases and swaps can be stored in other
// structures.
export interface Client {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  legalId?: string;
  address?: string;
}

// Represents a single sale transaction. Sales can be either cash or on
// credit. If the sale is on credit, the dueDate field stores the expected
// payment date.
export interface Sale {
  id: string;
  clientId: string;
  productName: string;
  quantity: number;
  paymentType: 'avistapix' | 'avistadinheiro' | 'prazo';
  dueDate?: Date;
  createdAt: Date;
}

// Represents a product swap (troca). A swap registers the quantity returned
// and, optionally, the product that was given back to the client. The
// reason field helps track why the exchange happened.
export interface Swap {
  id: string;
  clientId: string;
  productName: string;
  quantity: number;
  returnedProduct?: string;
  reason?: string;
  createdAt: Date;
}

// Interface describing the context data and actions available in the
// StoreContext. This design centralises the state of the application and
// provides methods to manipulate it. All updates to the state should go
// through these methods to ensure predictable behaviour.
export interface StoreContextType {
  products: Product[];
  clients: Client[];
  sales: Sale[];
  swaps: Swap[];
  registerProduction: (name: string, quantity: number) => void;
  registerSale: (
    clientId: string,
    productName: string,
    quantity: number,
    paymentType: Sale['paymentType'],
    dueDate?: Date,
  ) => void;
  registerSwap: (
    clientId: string,
    productName: string,
    quantity: number,
    returnedProduct?: string,
    reason?: string,
  ) => void;
  addClient: (client: Omit<Client, 'id'>) => string;
}
