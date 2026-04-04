import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import '../../molecules/bk-account-card/bk-account-card.ts';
import '../../atoms/bk-button/bk-button.ts';

@customElement('bk-account-summary')
export class BkAccountSummary extends LitElement {
  @property() alias = '';
  @property() iban = '';
  @property({ type: Number }) balance = 0;
  @property() currency = 'EUR';
  @property({ type: Boolean }) loading = false;

  static styles = css`
    :host { display: block; }

    .summary {
      display: flex;
      flex-direction: column;
      gap: var(--bk-space-4, 1rem);
    }

    .actions {
      display: flex;
      gap: var(--bk-space-3, 0.75rem);
      flex-wrap: wrap;
    }

    .actions bk-button {
      flex: 1;
      min-width: 120px;
    }
  `;

  render() {
    return html`
      <div class="summary">
        <bk-account-card
          alias=${this.alias}
          iban=${this.iban}
          .balance=${this.balance}
          currency=${this.currency}
          ?loading=${this.loading}
        ></bk-account-card>

        <div class="actions">
          <bk-button variant="primary" @click=${this._onTransfer}>
            Transferir
          </bk-button>
          <bk-button variant="secondary" @click=${this._onWithdraw}>
            Retirar
          </bk-button>
          <bk-button variant="ghost" @click=${this._onDetails}>
            Ver detalle
          </bk-button>
        </div>
      </div>
    `;
  }

  private _onTransfer() {
    this.dispatchEvent(new CustomEvent('bk-summary-transfer', { bubbles: true, composed: true }));
  }

  private _onWithdraw() {
    this.dispatchEvent(new CustomEvent('bk-summary-withdraw', { bubbles: true, composed: true }));
  }

  private _onDetails() {
    this.dispatchEvent(new CustomEvent('bk-summary-details', { bubbles: true, composed: true }));
  }
}

declare global {
  interface HTMLElementTagNameMap { 'bk-account-summary': BkAccountSummary; }
}
