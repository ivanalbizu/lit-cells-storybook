export interface Account {
  id: string;
  alias: string;
  iban: string;
  balance: number;
  currency: string;
}

export const ACCOUNTS: Account[] = [
  {
    id: 'acc-001',
    alias: 'Cuenta Nómina',
    iban: 'ES12 3456 7890 1234 5678 9012',
    balance: 4250.80,
    currency: 'EUR',
  },
  {
    id: 'acc-002',
    alias: 'Cuenta Ahorro',
    iban: 'ES98 7654 3210 9876 5432 1098',
    balance: 12000.00,
    currency: 'EUR',
  },
  {
    id: 'acc-003',
    alias: 'Cuenta Crédito',
    iban: 'ES11 2233 4455 6677 8899 0011',
    balance: -450.20,
    currency: 'EUR',
  },
];
