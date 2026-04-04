import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import '../../atoms/bk-amount/bk-amount.ts';
import '../../atoms/bk-badge/bk-badge.ts';
import '../../atoms/bk-chip/bk-chip.ts';
import type { BadgeStatus } from '../../atoms/bk-badge/bk-badge.ts';

@customElement('bk-transaction-item')
export class BkTransactionItem extends LitElement {
  @property() concept = '';
  @property() date = '';
  @property() category = '';
  @property({ type: Number }) amount = 0;
  @property() currency = 'EUR';
  @property() status: BadgeStatus = 'completed';

  static styles = css`
    :host { display: block; }

    .item {
      display: flex;
      align-items: center;
      gap: var(--bk-space-4, 1rem);
      padding: var(--bk-space-4, 1rem) 0;
      border-bottom: 1px solid var(--bk-color-border, #d1d9e0);
    }

    :host(:last-child) .item {
      border-bottom: none;
    }

    .icon {
      width: 2.5rem;
      height: 2.5rem;
      border-radius: 50%;
      background: var(--bk-color-surface, #f4f6f9);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.1rem;
      flex-shrink: 0;
    }

    .info {
      flex: 1;
      min-width: 0;
    }

    .concept {
      font-family: var(--bk-font-sans, system-ui, sans-serif);
      font-size: var(--bk-font-size-sm, 0.875rem);
      font-weight: 600;
      color: var(--bk-color-text, #1a1a2e);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      margin: 0 0 0.25rem;
    }

    .meta {
      display: flex;
      align-items: center;
      gap: var(--bk-space-2, 0.5rem);
    }

    .date {
      font-family: var(--bk-font-sans, system-ui, sans-serif);
      font-size: var(--bk-font-size-xs, 0.75rem);
      color: var(--bk-color-text-muted, #6b7280);
    }

    .right {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 0.25rem;
      flex-shrink: 0;
    }
  `;

  private get categoryIcon(): string {
    const icons: Record<string, string> = {
      food:      '🛒',
      transport: '🚌',
      leisure:   '🎬',
      transfer:  '↔',
      health:    '💊',
      utilities: '💡',
    };
    return icons[this.category] ?? '💳';
  }

  render() {
    return html`
      <div class="item">
        <div class="icon" aria-hidden="true">${this.categoryIcon}</div>
        <div class="info">
          <p class="concept">${this.concept}</p>
          <div class="meta">
            <span class="date">${this.date}</span>
            ${this.category
              ? html`<bk-chip label=${this.category} value=${this.category}></bk-chip>`
              : ''}
          </div>
        </div>
        <div class="right">
          <bk-amount .value=${this.amount} currency=${this.currency}></bk-amount>
          <bk-badge status=${this.status}></bk-badge>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap { 'bk-transaction-item': BkTransactionItem; }
}
