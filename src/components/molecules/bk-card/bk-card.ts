import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('bk-card')
export class BkCard extends LitElement {
  @property({ type: Boolean }) elevated = false;
  @property({ type: Boolean }) interactive = false;

  static styles = css`
    :host { display: block; }

    .card {
      background: var(--bk-color-surface-alt, #fff);
      border-radius: var(--bk-radius-card, 12px);
      padding: var(--bk-space-6, 1.5rem);
      box-shadow: var(--bk-shadow-card, 0 2px 8px rgba(0,0,0,0.08));
      transition: box-shadow var(--bk-transition, 150ms ease),
                  transform var(--bk-transition, 150ms ease);
    }

    .card.elevated {
      box-shadow: var(--bk-shadow-md, 0 4px 16px rgba(0,0,0,0.12));
    }

    .card.interactive {
      cursor: pointer;
    }

    .card.interactive:hover {
      box-shadow: var(--bk-shadow-md, 0 4px 16px rgba(0,0,0,0.12));
      transform: translateY(-1px);
    }

    .card.interactive:active {
      transform: translateY(0);
    }
  `;

  render() {
    const classes = [
      'card',
      this.elevated ? 'elevated' : '',
      this.interactive ? 'interactive' : '',
    ].filter(Boolean).join(' ');

    return html`<div class=${classes}><slot></slot></div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap { 'bk-card': BkCard; }
}
