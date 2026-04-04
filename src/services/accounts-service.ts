/**
 * AccountsService — Data Manager de cuentas y transacciones.
 *
 * Publica los datos de cuentas y transacciones en los canales de Open Cells
 * al arrancar la aplicación. Como el canal es un ReplaySubject(1), cualquier
 * componente que se suscriba después recibirá el último valor publicado.
 *
 * Canales:
 *   bk:accounts     → Account[]
 *   bk:transactions → Transaction[]
 *
 * En producción, reemplazar los imports de mocks por llamadas a la API real.
 */

import { publish } from '@open-cells/core';
import { ACCOUNTS } from '../mocks/accounts.ts';
import { TRANSACTIONS } from '../mocks/transactions.ts';

export const CHANNEL_ACCOUNTS = 'bk:accounts';
export const CHANNEL_TRANSACTIONS = 'bk:transactions';

export function initAccountsService(): void {
  publish(CHANNEL_ACCOUNTS, ACCOUNTS);
  publish(CHANNEL_TRANSACTIONS, TRANSACTIONS);
}
