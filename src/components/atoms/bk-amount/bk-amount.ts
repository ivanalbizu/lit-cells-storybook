import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('bk-amount')
export class BkAmount extends LitElement {
  @property({ type: Number }) value = 0;
  @property() currency = 'EUR';
  @property() locale = 'es-ES';
  @property({ type: Boolean }) colorize = true;

  static styles = css`
    :host { display: inline-block; }

    span {
      font-family: var(--bk-font-mono, 'Roboto Mono', monospace);
      font-size: inherit;
      font-weight: 600;
    }

    span.positive { color: var(--bk-color-success, #007a3d); }
    span.negative { color: var(--bk-color-danger,  #c0392b); }
    span.neutral  { color: var(--bk-color-text,    #1a1a2e); }
  `;

  render() {
    const formatted = new Intl.NumberFormat(this.locale, {
      style: 'currency',
      currency: this.currency,
    }).format(this.value);

    let colorClass = 'neutral';
    if (this.colorize) {
      colorClass = this.value > 0 ? 'positive' : this.value < 0 ? 'negative' : 'neutral';
    }

    return html`<span class=${colorClass}>${formatted}</span>`;
  }
}

declare global {
  interface HTMLElementTagNameMap { 'bk-amount': BkAmount; }
}
