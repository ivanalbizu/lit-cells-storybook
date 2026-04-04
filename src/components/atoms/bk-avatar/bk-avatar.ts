import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

export type AvatarSize = 'sm' | 'md' | 'lg';

@customElement('bk-avatar')
export class BkAvatar extends LitElement {
  @property() name = '';
  @property() src = '';
  @property() size: AvatarSize = 'md';

  static styles = css`
    :host { display: inline-flex; }

    .avatar {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      overflow: hidden;
      background: var(--bk-color-primary, #003087);
      color: var(--bk-color-text-inverse, #fff);
      font-family: var(--bk-font-sans, system-ui, sans-serif);
      font-weight: 700;
      flex-shrink: 0;
      user-select: none;
    }

    .avatar.sm { width: 2rem;   height: 2rem;   font-size: 0.75rem; }
    .avatar.md { width: 2.75rem; height: 2.75rem; font-size: 1rem; }
    .avatar.lg { width: 4rem;   height: 4rem;   font-size: 1.375rem; }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  `;

  private get initials(): string {
    return this.name
      .split(' ')
      .slice(0, 2)
      .map(w => w[0]?.toUpperCase() ?? '')
      .join('');
  }

  render() {
    return html`
      <div class="avatar ${this.size}" role="img" aria-label=${this.name || 'Avatar'}>
        ${this.src
          ? html`<img src=${this.src} alt=${this.name} />`
          : html`${this.initials}`}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap { 'bk-avatar': BkAvatar; }
}
