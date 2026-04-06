/**
 * Constantes de nombre de canal para Open Cells.
 *
 * Canales:
 *   bk:accounts     → Account[]
 *   bk:transactions → Transaction[]
 *
 * La publicación de datos la realiza BkAccountsManager (outbounds, opción C).
 */

export const CHANNEL_ACCOUNTS = 'bk:accounts';
export const CHANNEL_TRANSACTIONS = 'bk:transactions';
