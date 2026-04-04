import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('bk-chip')
export class BkChip extends LitElement {
  @property() label = '';
  @property() value = '';
  @property({ type: Boolean, reflect: true }) selected = false;
  @property({ type: Boolean }) disabled = false;

  static styles = css`
    :host { display: inline-flex; }

    button {
      display: inline-flex;
      align-items: center;
      gap: 0.375rem;
      font-family: var(--bk-font-sans, system-ui, sans-serif);
      font-size: 0.8125rem;
      font-weight: 500;
      padding: 0.375rem 0.875rem;
      border-radius: var(--bk-radius-full, 9999px);
      border: 1.5px solid var(--bk-color-border, #d1d9e0);
      background: var(--bk-color-surface-alt, #fff);
      color: var(--bk-color-text-muted, #6b7280);
      cursor: pointer;
      transition: background-color var(--bk-transition, 150ms ease),
                  border-color var(--bk-transition, 150ms ease),
                  opacity var(--bk-transition, 150ms ease);
      white-space: nowrap;
    }

    /* Hover only on unselected chips — selected already has dark bg */
    button:hover:not(:disabled):not(.selected) {
      border-color: var(--bk-color-primary, #003087);
      color: var(--bk-color-primary, #003087);
      background: var(--bk-color-surface, #f4f6f9);
    }

    button.selected {
      background: var(--bk-color-primary, #003087);
      border-color: var(--bk-color-primary, #003087);
      color: var(--bk-color-text-inverse, #fff);
    }

    button.selected:hover:not(:disabled) {
      background: var(--bk-color-primary-hover, #00236b);
    }

    button:disabled {
      opacity: 0.45;
      cursor: not-allowed;
    }
  `;

  render() {
    return html`
      <button
        class=${this.selected ? 'selected' : ''}
        ?disabled=${this.disabled}
        aria-pressed=${this.selected ? 'true' : 'false'}
        @click=${this._handleClick}
      >
        <slot>${this.label}</slot>
      </button>
    `;
  }

  private _handleClick() {
    if (this.disabled) return;
    this.selected = !this.selected;
    this.dispatchEvent(new CustomEvent('bk-chip-change', {
      detail: { value: this.value || this.label, selected: this.selected },
      bubbles: true,
      composed: true,
    }));
  }
}

declare global {
  interface HTMLElementTagNameMap { 'bk-chip': BkChip; }
}
