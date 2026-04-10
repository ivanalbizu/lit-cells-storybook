import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import { PageController } from '@open-cells/page-controller';
import type { InboundDef } from '@open-cells/page-controller';
import { CHANNEL_ACCOUNTS, CHANNEL_TRANSACTIONS } from '@/services/accounts-service.ts';
import type { Account } from '@/mocks/accounts.ts';
import type { Transaction } from '@/mocks/transactions.ts';
import '@/components/organisms/bk-account-summary/bk-account-summary.ts';
import '@/components/organisms/bk-transaction-list/bk-transaction-list.ts';

@customElement('home-page')
export class HomePage extends LitElement {
  private _pageController = new PageController(this);

  /**
   * OPCIÓN B — dos inbounds: uno por canal.
   *
   * El inbound de 'transactions' usa `action` para filtrar y limitar
   * los datos antes de guardarlos, evitando hacerlo en el render.
   */
  static inbounds: Record<string, InboundDef> = {
    accounts: {
      channel: CHANNEL_ACCOUNTS,
    },
    recentTransactions: {
      channel: CHANNEL_TRANSACTIONS,
      action: (all) =>
        (all as Transaction[])
          .filter(t => t.accountId === 'acc-001')
          .slice(0, 5),
    },
  };

  declare accounts: Account[] | undefined;
  declare recentTransactions: Transaction[] | undefined;

  static styles = css`
    :host {
      display: block;
      padding: 1.5rem;
      max-width: 900px;
      margin: 0 auto;
      box-sizing: border-box;
      background: var(--bk-color-surface, #f4f6f9);
      color: var(--bk-color-text, #1a1a2e);
      min-height: 100%;
    }

    h2 {
      font-family: var(--bk-font-sans, system-ui, sans-serif);
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--bk-color-text, #1a1a2e);
      margin: 0 0 1.5rem;
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .section {
      background: var(--bk-color-surface-alt, #fff);
      border-radius: var(--bk-radius-card, 12px);
      padding: 1.5rem;
      box-shadow: var(--bk-shadow-card, 0 2px 8px rgba(0,0,0,0.08));
    }
  `;

  render() {
    const user = JSON.parse(sessionStorage.getItem('bk-user') ?? '{}');

    return html`
      <h2>Hola, ${user.name ?? 'bienvenido'}</h2>

      <div class="grid">
        ${(this.accounts ?? []).map(acc => html`
          <bk-account-summary
            alias=${acc.alias}
            iban=${acc.iban}
            .balance=${acc.balance}
            currency=${acc.currency}
            ?loading=${!this.accounts}
            @bk-summary-transfer=${() => this._pageController.navigate('transfer')}
            @bk-summary-details=${() => this._pageController.navigate('account-detail', { id: acc.id })}
          ></bk-account-summary>
        `)}
      </div>

      <div class="section">
        <bk-transaction-list
          .transactions=${this.recentTransactions ?? []}
          ?loading=${!this.recentTransactions}
        ></bk-transaction-list>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap { 'home-page': HomePage; }
}
