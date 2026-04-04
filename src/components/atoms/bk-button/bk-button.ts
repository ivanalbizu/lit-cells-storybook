import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

@customElement('bk-button')
export class BkButton extends LitElement {
  @property() variant: ButtonVariant = 'primary';
  @property() size: ButtonSize = 'md';
  @property({ type: Boolean }) disabled = false;
  @property({ type: Boolean }) loading = false;

  static styles = css`
    :host {
      display: inline-block;
    }

    button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      font-family: var(--bk-font-sans, system-ui, sans-serif);
      font-weight: 600;
      border: 2px solid transparent;
      border-radius: var(--bk-radius-md, 8px);
      cursor: pointer;
      transition: background-color var(--bk-transition, 150ms ease),
                  border-color var(--bk-transition, 150ms ease),
                  opacity var(--bk-transition, 150ms ease);
      white-space: nowrap;
    }

    button:disabled {
      opacity: 0.45;
      cursor: not-allowed;
    }

    /* Sizes */
    button.sm { padding: 0.375rem 0.875rem; font-size: 0.8125rem; }
    button.md { padding: 0.625rem 1.25rem;  font-size: 0.9375rem; }
    button.lg { padding: 0.875rem 1.75rem;  font-size: 1.0625rem; }

    /* Variants */
    button.primary {
      background: var(--bk-color-primary, #003087);
      color: var(--bk-color-text-inverse, #fff);
    }
    button.primary:hover:not(:disabled) {
      background: var(--bk-color-primary-hover, #00236b);
    }

    button.secondary {
      background: transparent;
      border-color: var(--bk-color-primary, #003087);
      color: var(--bk-color-primary, #003087);
    }
    button.secondary:hover:not(:disabled) {
      background: var(--bk-color-surface, #f4f6f9);
    }

    button.ghost {
      background: transparent;
      color: var(--bk-color-primary, #003087);
    }
    button.ghost:hover:not(:disabled) {
      background: var(--bk-color-surface, #f4f6f9);
    }

    button.danger {
      background: var(--bk-color-danger, #c0392b);
      color: var(--bk-color-text-inverse, #fff);
    }
    button.danger:hover:not(:disabled) {
      background: #a93226;
    }

    .spinner {
      width: 1em;
      height: 1em;
      border: 2px solid currentColor;
      border-top-color: transparent;
      border-radius: 50%;
      animation: spin 0.6s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `;

  render() {
    return html`
      <button
        class="${this.variant} ${this.size}"
        ?disabled=${this.disabled || this.loading}
        @click=${this._handleClick}
      >
        ${this.loading ? html`<span class="spinner"></span>` : ''}
        <slot></slot>
      </button>
    `;
  }

  private _handleClick(e: Event) {
    if (this.disabled || this.loading) {
      e.stopPropagation();
      return;
    }
    this.dispatchEvent(new CustomEvent('bk-button-click', { bubbles: true, composed: true }));
  }
}

declare global {
  interface HTMLElementTagNameMap { 'bk-button': BkButton; }
}
