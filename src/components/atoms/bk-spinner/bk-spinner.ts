import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

export type SpinnerSize = 'sm' | 'md' | 'lg';

@customElement('bk-spinner')
export class BkSpinner extends LitElement {
  @property() size: SpinnerSize = 'md';
  @property() label = 'Cargando...';

  static styles = css`
    :host { display: inline-flex; }

    .spinner {
      border-radius: 50%;
      border-style: solid;
      border-color: var(--bk-color-border, #d1d9e0);
      border-top-color: var(--bk-color-primary, #003087);
      animation: spin 0.7s linear infinite;
    }

    .spinner.sm { width: 1rem;   height: 1rem;   border-width: 2px; }
    .spinner.md { width: 1.75rem; height: 1.75rem; border-width: 3px; }
    .spinner.lg { width: 2.75rem; height: 2.75rem; border-width: 4px; }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `;

  render() {
    return html`
      <div
        class="spinner ${this.size}"
        role="status"
        aria-label=${this.label}
      ></div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap { 'bk-spinner': BkSpinner; }
}
