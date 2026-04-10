import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

export type AlertType = 'info' | 'success' | 'warning' | 'error';

@customElement('bk-alert')
export class BkAlert extends LitElement {
  @property() type: AlertType = 'info';
  @property() message = '';
  @property({ type: Boolean }) dismissible = false;

  private static readonly ICONS: Record<AlertType, string> = {
    info:    'ℹ',
    success: '✓',
    warning: '⚠',
    error:   '✕',
  };

  static styles = css`
    :host { display: block; }

    .alert {
      display: flex;
      align-items: flex-start;
      gap: var(--bk-space-3, 0.75rem);
      padding: var(--bk-space-4, 1rem);
      border-radius: var(--bk-radius-md, 8px);
      border-left: 4px solid;
      font-family: var(--bk-font-sans, system-ui, sans-serif);
      font-size: var(--bk-font-size-sm, 0.875rem);
      line-height: 1.5;
    }

    .alert.info {
      background: var(--bk-color-info-bg, #e8f0fe);
      border-color: var(--bk-color-info, #0066cc);
      color: var(--bk-color-info-text, #1a3a6b);
    }

    .alert.success {
      background: var(--bk-color-success-bg, #e6f4ee);
      border-color: var(--bk-color-success, #007a3d);
      color: var(--bk-color-success-text, #1a4d33);
    }

    .alert.warning {
      background: var(--bk-color-warning-bg, #fff8e1);
      border-color: var(--bk-color-warning, #f5a623);
      color: var(--bk-color-warning-text, #b45309);
    }

    .alert.error {
      background: var(--bk-color-danger-bg, #fdecea);
      border-color: var(--bk-color-danger, #c0392b);
      color: var(--bk-color-danger-text, #6b1a1a);
    }

    .icon {
      font-size: 1.1em;
      flex-shrink: 0;
      margin-top: 0.05em;
    }

    .body {
      flex: 1;
    }

    .dismiss {
      background: none;
      border: none;
      cursor: pointer;
      color: inherit;
      opacity: 0.6;
      font-size: 1rem;
      padding: 0;
      line-height: 1;
      flex-shrink: 0;
    }

    .dismiss:hover { opacity: 1; }
  `;

  render() {
    const icon = BkAlert.ICONS[this.type];
    return html`
      <div class="alert ${this.type}" role="alert">
        <span class="icon" aria-hidden="true">${icon}</span>
        <div class="body">
          ${this.message}
          <slot></slot>
        </div>
        ${this.dismissible
          ? html`<button class="dismiss" aria-label="Cerrar" @click=${this._dismiss}>✕</button>`
          : ''}
      </div>
    `;
  }

  private _dismiss() {
    this.dispatchEvent(new CustomEvent('bk-alert-dismiss', { bubbles: true, composed: true }));
    this.remove();
  }
}

declare global {
  interface HTMLElementTagNameMap { 'bk-alert': BkAlert; }
}
