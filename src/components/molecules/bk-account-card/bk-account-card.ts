import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import '../../atoms/bk-amount/bk-amount.ts';

@customElement('bk-account-card')
export class BkAccountCard extends LitElement {
  @property() alias = '';
  @property() iban = '';
  @property({ type: Number }) balance = 0;
  @property() currency = 'EUR';
  @property({ type: Boolean }) loading = false;

  static styles = css`
    :host { display: block; }

    .card {
      background: var(--bk-color-account-bg, #003087);
      border-radius: var(--bk-radius-card, 12px);
      padding: var(--bk-space-6, 1.5rem);
      color: #fff;
      box-shadow: var(--bk-shadow-md, 0 4px 16px rgba(0,0,0,0.12));
      min-width: 260px;
    }

    .alias {
      font-family: var(--bk-font-sans, system-ui, sans-serif);
      font-size: var(--bk-font-size-sm, 0.875rem);
      font-weight: 500;
      opacity: 0.8;
      margin: 0 0 var(--bk-space-4, 1rem);
    }

    .balance {
      font-family: var(--bk-font-mono, 'Roboto Mono', monospace);
      font-size: 2rem;
      font-weight: 700;
      margin: 0 0 var(--bk-space-4, 1rem);
      color: #fff;
    }

    .balance bk-amount {
      color: #fff;
      --bk-color-success: #fff;
      --bk-color-danger: #ffc5c5;
    }

    .iban {
      font-family: var(--bk-font-mono, 'Roboto Mono', monospace);
      font-size: var(--bk-font-size-xs, 0.75rem);
      opacity: 0.65;
      letter-spacing: 0.05em;
    }

    /* Skeleton — fondo oscuro: shimmer en blanco semitransparente */
    .sk {
      border-radius: var(--bk-radius-full, 9999px);
      background: linear-gradient(
        90deg,
        rgba(255,255,255,0.15) 25%,
        rgba(255,255,255,0.35) 50%,
        rgba(255,255,255,0.15) 75%
      );
      background-size: 200% 100%;
      animation: shimmer 1.5s ease-in-out infinite;
    }

    .sk-alias   { height: 0.75rem; width: 80px;  margin-bottom: var(--bk-space-4, 1rem); }
    .sk-balance { height: 2rem;    width: 140px; margin-bottom: var(--bk-space-4, 1rem); }
    .sk-iban    { height: 0.6rem;  width: 110px; }

    @keyframes shimmer {
      0%   { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
  `;

  private get maskedIban(): string {
    if (!this.iban) return '';
    const clean = this.iban.replace(/\s/g, '');
    const last4 = clean.slice(-4);
    return `•••• •••• •••• ${last4}`;
  }

  render() {
    if (this.loading) {
      return html`
        <div class="card">
          <div class="sk sk-alias"></div>
          <div class="sk sk-balance"></div>
          <div class="sk sk-iban"></div>
        </div>
      `;
    }

    return html`
      <div class="card">
        <p class="alias">${this.alias || 'Cuenta corriente'}</p>
        <div class="balance">
          <bk-amount .value=${this.balance} currency=${this.currency} ?colorize=${false}></bk-amount>
        </div>
        <p class="iban">${this.maskedIban}</p>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap { 'bk-account-card': BkAccountCard; }
}
