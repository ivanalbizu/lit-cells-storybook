import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { PageController } from '@open-cells/page-controller';
import { CHANNEL_ACCOUNTS, CHANNEL_TRANSACTIONS } from '../../services/accounts-service.ts';
import type { Account } from '../../mocks/accounts.ts';
import type { Transaction } from '../../mocks/transactions.ts';
import '../../components/organisms/bk-account-summary/bk-account-summary.ts';
import '../../components/organisms/bk-transaction-list/bk-transaction-list.ts';
import '../../components/atoms/bk-button/bk-button.ts';

@customElement('account-detail-page')
export class AccountDetailPage extends LitElement {
  private _pageController = new PageController(this);

  @state() _account: Account | null = null;
  @state() _transactions: Transaction[] = [];
  @state() _loading = true;

  static styles = css`
    :host {
      display: block;
      padding: 1.5rem;
      max-width: 700px;
      margin: 0 auto;
      box-sizing: border-box;
    }

    .back {
      margin-bottom: 1.5rem;
    }

    .section {
      background: #fff;
      border-radius: var(--bk-radius-card, 12px);
      padding: 1.5rem;
      box-shadow: var(--bk-shadow-card, 0 2px 8px rgba(0,0,0,0.08));
      margin-top: 1.5rem;
    }

    .not-found {
      font-family: var(--bk-font-sans, system-ui, sans-serif);
      color: var(--bk-color-text-muted, #6b7280);
      text-align: center;
      padding: 3rem 0;
    }
  `;

  onPageEnter(params?: Record<string, string>) {
    this._loading = true;
    const id = params?.id ?? '';

    // Las dos suscripciones se resuelven de forma independiente.
    // Como el canal es ReplaySubject(1), si los datos ya fueron publicados
    // por AccountsService, el callback se invoca inmediatamente.
    // El callback recibe el dato bruto publicado en el canal (no envuelto)
    this._pageController.subscribe<Account[]>(
      CHANNEL_ACCOUNTS,
      (accounts) => {
        this._account = accounts.find(a => a.id === id) ?? null;
        this._loading = false;
      },
    );

    this._pageController.subscribe<Transaction[]>(
      CHANNEL_TRANSACTIONS,
      (transactions) => {
        this._transactions = transactions.filter(t => t.accountId === id);
      },
    );
  }

  onPageLeave() {
    this._pageController.unsubscribe([CHANNEL_ACCOUNTS, CHANNEL_TRANSACTIONS]);
  }

  render() {
    if (!this._loading && !this._account) {
      return html`<p class="not-found">Cuenta no encontrada.</p>`;
    }

    return html`
      <div class="back">
        <bk-button variant="ghost" size="sm" @bk-button-click=${() => this._pageController.navigate('accounts')}>
          ← Volver a cuentas
        </bk-button>
      </div>

      <bk-account-summary
        alias=${this._account?.alias ?? ''}
        iban=${this._account?.iban ?? ''}
        .balance=${this._account?.balance ?? 0}
        currency=${this._account?.currency ?? 'EUR'}
        ?loading=${this._loading}
        @bk-summary-transfer=${() => this._pageController.navigate('transfer')}
      ></bk-account-summary>

      <div class="section">
        <bk-transaction-list
          .transactions=${this._transactions}
          ?loading=${this._loading}
        ></bk-transaction-list>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap { 'account-detail-page': AccountDetailPage; }
}
