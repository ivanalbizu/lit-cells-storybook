/**
 * BkAccountsManager — Data Manager de cuentas y transacciones.
 *
 * Patrón Open Cells: componente web sin UI que vive en el app shell
 * (fuera del router). En firstUpdated() carga los datos y los asigna
 * a sus propiedades, que gracias a `outbounds` publican automáticamente
 * en los canales correspondientes.
 *
 * Flujo completo con outbounds:
 *
 *   this.accounts = ACCOUNTS
 *         ↓  (setter generado por ElementController)
 *   publish('bk:accounts', ACCOUNTS)
 *         ↓  ReplaySubject(1)
 *   accounts-page.this.accounts  ← inbound declarativo (opción B)
 *   home-page.this.accounts      ← inbound declarativo (opción B)
 *
 * En producción: reemplazar los imports de mocks por llamadas fetch/API.
 */

import { LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import { PageController } from '@open-cells/page-controller';
import type { OutboundDef } from '@open-cells/page-controller';
import { CHANNEL_ACCOUNTS, CHANNEL_TRANSACTIONS } from '../../../services/accounts-service.ts';
import type { Account } from '../../../mocks/accounts.ts';
import type { Transaction } from '../../../mocks/transactions.ts';
import { ACCOUNTS } from '../../../mocks/accounts.ts';
import { TRANSACTIONS } from '../../../mocks/transactions.ts';

@customElement('bk-accounts-manager')
export class BkAccountsManager extends LitElement {
  /** PageController registra el componente en el bridge y habilita outbounds. */
  private _pc = new PageController(this);

  /**
   * outbounds — la otra cara de inbounds.
   *
   * ElementController genera un setter para cada propiedad listada.
   * Al hacer `this.accounts = [...]`, el setter llama a
   * `publish(channel, value)` automáticamente.
   */
  static outbounds: Record<string, OutboundDef> = {
    accounts: { channel: CHANNEL_ACCOUNTS },
    transactions: { channel: CHANNEL_TRANSACTIONS },
  };

  /** ElementController genera el setter; `declare` informa a TypeScript. */
  declare accounts: Account[];
  declare transactions: Transaction[];

  /**
   * Sin template visible — el manager vive en el DOM pero no renderiza nada.
   * Podría renderizar un elemento de debug en desarrollo.
   */
  protected override createRenderRoot() {
    return this;   // Evita shadow DOM — no hay nada que encapsular
  }

  override firstUpdated() {
    // Asignar la propiedad activa el setter generado por outbounds,
    // que publica en el canal. Como el canal es ReplaySubject(1),
    // cualquier suscriptor posterior recibirá este valor inmediatamente.
    void this._pc;  // referencia para evitar warning de unused field
    this.accounts = ACCOUNTS;
    this.transactions = TRANSACTIONS;
  }
}

declare global {
  interface HTMLElementTagNameMap { 'bk-accounts-manager': BkAccountsManager; }
}
