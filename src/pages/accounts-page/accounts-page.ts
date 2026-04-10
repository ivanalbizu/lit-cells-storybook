import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import { PageController } from '@open-cells/page-controller';
import type { InboundDef } from '@open-cells/page-controller';
import { CHANNEL_ACCOUNTS } from '@/services/accounts-service.ts';
import type { Account } from '@/mocks/accounts.ts';
import '@/components/molecules/bk-account-card/bk-account-card.ts';

@customElement('accounts-page')
export class AccountsPage extends LitElement {
  private _pageController = new PageController(this);

  /**
   * OPCIÓN B — inbounds declarativos.
   *
   * ElementController lee esta propiedad estática en el constructor y:
   *   1. Define un getter en el host: `this.accounts`
   *   2. En hostConnected(), suscribe el host a 'bk:accounts'
   *   3. Cuando llega un valor, lo almacena y llama a requestUpdate()
   *   4. En hostDisconnected(), desuscribe automáticamente
   *
   * No hay subscribe/unsubscribe manual. El componente no sabe que existe
   * el canal: simplemente lee `this.accounts` como cualquier otra propiedad.
   */
  static inbounds: Record<string, InboundDef> = {
    accounts: { channel: CHANNEL_ACCOUNTS },
  };

  /**
   * `declare` informa a TypeScript del tipo sin crear una propiedad real
   * (la crea ElementController vía Object.defineProperties).
   * Lit reacciona porque ElementController llama a requestUpdate().
   */
  declare accounts: Account[] | undefined;

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
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1rem;
    }

    .card-wrapper {
      cursor: pointer;
      transition: transform 150ms ease;
    }

    .card-wrapper:hover {
      transform: translateY(-2px);
    }
  `;

  render() {
    // ReplaySubject(1): si el servicio ya publicó, this.accounts llega en el
    // primer ciclo de render. Sin datos todavía → spinner de carga.
    if (!this.accounts) {
      return html`<bk-spinner></bk-spinner>`;
    }

    return html`
      <h2>Mis cuentas</h2>
      <div class="grid">
        ${this.accounts.map(acc => html`
          <div
            class="card-wrapper"
            role="button"
            tabindex="0"
            @click=${() => this._pageController.navigate('account-detail', { id: acc.id })}
            @keydown=${(e: KeyboardEvent) => e.key === 'Enter' && this._pageController.navigate('account-detail', { id: acc.id })}
          >
            <bk-account-card
              alias=${acc.alias}
              iban=${acc.iban}
              .balance=${acc.balance}
              currency=${acc.currency}
            ></bk-account-card>
          </div>
        `)}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap { 'accounts-page': AccountsPage; }
}
