import React from 'react';
import { DayPanel } from '../components/DayPanel';

/**
 * Página inicial da aplicação. Esta página apresenta o Painel do Dia,
 * permitindo registrar produções, realizar vendas rápidas e trocas sem
 * necessidade de navegar por outras telas. A intenção é concentrar o
 * trabalho principal do operador em uma única interface.
 */
export default function HomePage() {
  return <DayPanel />;
}
