import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

export type SkeletonVariant = 'line' | 'circle' | 'rect';

@customElement('bk-skeleton')
export class BkSkeleton extends LitElement {
  @property() variant: SkeletonVariant = 'line';

  /** Anchura CSS: '60%', '120px', '100%' (default) */
  @property() width = '100%';

  /** Altura CSS. Defaults: line → 1rem · circle → igual que width · rect → 4rem */
  @property() height = '';

  static styles = css`
    :host {
      display: block;
    }

    .skeleton {
      background: linear-gradient(
        90deg,
        var(--bk-skeleton-base,    var(--bk-color-border,  #d1d9e0)) 25%,
        var(--bk-skeleton-shine,   var(--bk-color-surface, #f4f6f9)) 50%,
        var(--bk-skeleton-base,    var(--bk-color-border,  #d1d9e0)) 75%
      );
      background-size: 200% 100%;
      animation: shimmer 1.5s ease-in-out infinite;
    }

    .line {
      border-radius: var(--bk-radius-full, 9999px);
      height: 1rem;
    }

    .circle {
      border-radius: 50%;
    }

    .rect {
      border-radius: var(--bk-radius-md, 8px);
      height: 4rem;
    }

    @keyframes shimmer {
      0%   { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
  `;

  private get _height(): string {
    if (this.height) return this.height;
    if (this.variant === 'line')   return '1rem';
    if (this.variant === 'circle') return this.width;   // cuadrado → circular
    return '4rem';
  }

  render() {
    return html`
      <div
        class="skeleton ${this.variant}"
        style="width:${this.width};height:${this._height}"
        aria-hidden="true"
      ></div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap { 'bk-skeleton': BkSkeleton; }
}
