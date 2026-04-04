import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

export type BadgeStatus = 'pending' | 'completed' | 'failed';

@customElement('bk-badge')
export class BkBadge extends LitElement {
  @property() status: BadgeStatus = 'pending';

  private static readonly LABELS: Record<BadgeStatus, string> = {
    pending:   'Pendiente',
    completed: 'Completado',
    failed:    'Fallido',
  };

  static styles = css`
    :host { display: inline-block; }

    span {
      display: inline-flex;
      align-items: center;
      gap: 0.3rem;
      font-family: var(--bk-font-sans, system-ui, sans-serif);
      font-size: 0.75rem;
      font-weight: 600;
      padding: 0.25rem 0.625rem;
      border-radius: var(--bk-radius-full, 9999px);
      letter-spacing: 0.02em;
      white-space: nowrap;
    }

    span.pending {
      background: #fff8e1;
      color: #b45309;
    }

    span.completed {
      background: #e6f4ee;
      color: var(--bk-color-success, #007a3d);
    }

    span.failed {
      background: #fdecea;
      color: var(--bk-color-danger, #c0392b);
    }

    span::before {
      content: '';
      display: block;
      flex-shrink: 0;
      align-self: center;
      width: 6px;
      height: 6px;
      min-width: 6px;
      min-height: 6px;
      border-radius: 50%;
      background: currentColor;
    }
  `;

  render() {
    const label = BkBadge.LABELS[this.status] ?? this.status;
    return html`
      <span class=${this.status} role="status">${label}</span>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap { 'bk-badge': BkBadge; }
}
