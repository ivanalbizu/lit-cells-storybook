import { LitElement, html, css, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize    = 'sm' | 'md' | 'lg';
export type ButtonType    = 'button' | 'submit' | 'reset';

@customElement('bk-button')
export class BkButton extends LitElement {
  @property() variant: ButtonVariant = 'primary';
  @property() size: ButtonSize = 'md';
  @property() type: ButtonType = 'button';
  @property() href = '';
  @property({ type: Boolean }) disabled = false;
  @property({ type: Boolean }) loading = false;

  static styles = css`
    :host {
      display: inline-block;
    }

    /* Estilos compartidos entre <button> y <a> */
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      font-family: var(--bk-font-sans, system-ui, sans-serif);
      font-weight: 600;
      border: 2px solid transparent;
      border-radius: var(--bk-radius-md, 8px);
      cursor: pointer;
      text-decoration: none;
      transition: background-color var(--bk-transition, 150ms ease),
                  border-color var(--bk-transition, 150ms ease),
                  opacity var(--bk-transition, 150ms ease);
      white-space: nowrap;
    }

    /* <button> resetea sus propios estilos por defecto */
    button.btn {
      background: none;
    }

    /* Disabled — :disabled para button, aria-disabled para <a> */
    .btn:disabled,
    .btn[aria-disabled='true'] {
      opacity: 0.45;
      cursor: not-allowed;
      pointer-events: none;
    }

    /* Sizes */
    .btn.sm { padding: 0.375rem 0.875rem; font-size: 0.8125rem; }
    .btn.md { padding: 0.625rem 1.25rem;  font-size: 0.9375rem; }
    .btn.lg { padding: 0.875rem 1.75rem;  font-size: 1.0625rem; }

    /* Variants */
    .btn.primary {
      background: var(--bk-color-primary, #003087);
      color: var(--bk-color-text-inverse, #fff);
    }
    .btn.primary:hover:not(:disabled):not([aria-disabled='true']) {
      background: var(--bk-color-primary-hover, #00236b);
    }

    .btn.secondary {
      background: transparent;
      border-color: var(--bk-color-primary, #003087);
      color: var(--bk-color-primary, #003087);
    }
    .btn.secondary:hover:not(:disabled):not([aria-disabled='true']) {
      background: var(--bk-color-surface-alt, #f4f6f9);
    }

    .btn.ghost {
      background: transparent;
      color: var(--bk-color-primary, #003087);
    }
    .btn.ghost:hover:not(:disabled):not([aria-disabled='true']) {
      background: var(--bk-color-surface-alt, #f4f6f9);
    }

    .btn.danger {
      background: var(--bk-color-danger, #c0392b);
      color: var(--bk-color-text-inverse, #fff);
    }
    .btn.danger:hover:not(:disabled):not([aria-disabled='true']) {
      background: var(--bk-color-danger-hover, #a93226);
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

  private get _isDisabled() {
    return this.disabled || this.loading;
  }

  private get _inner() {
    return html`
      ${this.loading ? html`<span class="spinner"></span>` : ''}
      <slot></slot>
    `;
  }

  render() {
    if (this.href) {
      return html`
        <a
          class="btn ${this.variant} ${this.size}"
          href=${this._isDisabled ? nothing : this.href}
          aria-disabled=${this._isDisabled ? 'true' : nothing}
          tabindex=${this._isDisabled ? '-1' : nothing}
          @click=${this._handleClick}
        >${this._inner}</a>
      `;
    }

    return html`
      <button
        class="btn ${this.variant} ${this.size}"
        type=${this.type}
        ?disabled=${this._isDisabled}
        @click=${this._handleClick}
      >${this._inner}</button>
    `;
  }

  private _handleClick(e: Event) {
    if (this._isDisabled) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    this.dispatchEvent(new CustomEvent('bk-button-click', { bubbles: true, composed: true }));
  }
}

declare global {
  interface HTMLElementTagNameMap { 'bk-button': BkButton; }
}
