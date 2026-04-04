export interface Transaction {
  id: string;
  accountId: string;
  concept: string;
  date: string;
  category: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed';
}

export const TRANSACTIONS: Transaction[] = [
  { id: 't-01', accountId: 'acc-001', concept: 'Nómina abril',          date: '01/04/2026', category: 'transfer',  amount:  2350.00, currency: 'EUR', status: 'completed' },
  { id: 't-02', accountId: 'acc-001', concept: 'Supermercado Mercadona', date: '01/04/2026', category: 'food',      amount:   -67.40, currency: 'EUR', status: 'completed' },
  { id: 't-03', accountId: 'acc-001', concept: 'Metro mensual',          date: '31/03/2026', category: 'transport', amount:   -54.60, currency: 'EUR', status: 'completed' },
  { id: 't-04', accountId: 'acc-001', concept: 'Netflix',                date: '30/03/2026', category: 'leisure',   amount:   -15.99, currency: 'EUR', status: 'completed' },
  { id: 't-05', accountId: 'acc-001', concept: 'Transferencia a Pedro',  date: '29/03/2026', category: 'transfer',  amount:  -300.00, currency: 'EUR', status: 'pending'   },
  { id: 't-06', accountId: 'acc-001', concept: 'Farmacia',               date: '28/03/2026', category: 'health',    amount:   -23.50, currency: 'EUR', status: 'completed' },
  { id: 't-07', accountId: 'acc-001', concept: 'Luz y gas',              date: '27/03/2026', category: 'utilities', amount:   -89.00, currency: 'EUR', status: 'failed'    },
  { id: 't-08', accountId: 'acc-002', concept: 'Depósito ahorro',        date: '01/04/2026', category: 'transfer',  amount:  500.00,  currency: 'EUR', status: 'completed' },
  { id: 't-09', accountId: 'acc-002', concept: 'Intereses',              date: '31/03/2026', category: 'transfer',  amount:   12.50,  currency: 'EUR', status: 'completed' },
  { id: 't-10', accountId: 'acc-003', concept: 'Compra El Corte Inglés', date: '02/04/2026', category: 'leisure',   amount:  -150.00, currency: 'EUR', status: 'completed' },
];
