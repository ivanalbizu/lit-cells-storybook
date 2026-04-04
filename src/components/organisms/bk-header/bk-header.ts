import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import '../../atoms/bk-avatar/bk-avatar.ts';
import '../../atoms/bk-button/bk-button.ts';

export interface NavItem {
  label: string;
  route: string;
}

@customElement('bk-header')
export class BkHeader extends LitElement {
  @property() appName = 'BankApp';
  @property() userName = '';
  @property() activeRoute = '';
  @property({ type: Array }) navItems: NavItem[] = [];

  static styles = css`
    :host { display: block; }

    header {
      display: flex;
      align-items: center;
      gap: var(--bk-space-6, 1.5rem);
      padding: 0 var(--bk-space-6, 1.5rem);
      height: 64px;
      background: var(--bk-color-primary, #003087);
      box-shadow: 0 2px 8px rgba(0,0,0,0.15);
    }

    .logo {
      font-family: var(--bk-font-sans, system-ui, sans-serif);
      font-size: var(--bk-font-size-lg, 1.125rem);
      font-weight: 800;
      color: var(--bk-color-text-inverse, #fff);
      letter-spacing: -0.02em;
      text-decoration: none;
      white-space: nowrap;
    }

    nav {
      display: flex;
      align-items: center;
      gap: var(--bk-space-1, 0.25rem);
      flex: 1;
    }

    .nav-link {
      font-family: var(--bk-font-sans, system-ui, sans-serif);
      font-size: var(--bk-font-size-sm, 0.875rem);
      font-weight: 500;
      color: rgba(255,255,255,0.75);
      text-decoration: none;
      padding: 0.375rem 0.75rem;
      border-radius: var(--bk-radius-md, 8px);
      transition: background-color var(--bk-transition, 150ms ease),
                  color var(--bk-transition, 150ms ease);
      white-space: nowrap;
      cursor: pointer;
      background: none;
      border: none;
    }

    .nav-link:hover {
      background: rgba(255,255,255,0.1);
      color: #fff;
    }

    .nav-link.active {
      background: rgba(255,255,255,0.15);
      color: #fff;
      font-weight: 700;
    }

    .user {
      display: flex;
      align-items: center;
      gap: var(--bk-space-3, 0.75rem);
      margin-left: auto;
    }

    .user-name {
      font-family: var(--bk-font-sans, system-ui, sans-serif);
      font-size: var(--bk-font-size-sm, 0.875rem);
      color: rgba(255,255,255,0.85);
      white-space: nowrap;
    }

    .logout {
      font-family: var(--bk-font-sans, system-ui, sans-serif);
      font-size: var(--bk-font-size-xs, 0.75rem);
      color: rgba(255,255,255,0.6);
      background: none;
      border: 1px solid rgba(255,255,255,0.3);
      border-radius: var(--bk-radius-md, 8px);
      padding: 0.25rem 0.625rem;
      cursor: pointer;
      transition: border-color var(--bk-transition, 150ms ease),
                  color var(--bk-transition, 150ms ease);
      white-space: nowrap;
    }

    .logout:hover {
      border-color: rgba(255,255,255,0.7);
      color: #fff;
    }
  `;

  render() {
    return html`
      <header>
        <span class="logo">${this.appName}</span>

        ${this.navItems.length > 0 ? html`
          <nav>
            ${this.navItems.map(item => html`
              <button
                class="nav-link ${this.activeRoute === item.route ? 'active' : ''}"
                @click=${() => this._navigate(item.route)}
              >${item.label}</button>
            `)}
          </nav>
        ` : ''}

        <div class="user">
          ${this.userName ? html`
            <span class="user-name">${this.userName}</span>
            <bk-avatar name=${this.userName} size="sm"></bk-avatar>
          ` : ''}
          <button class="logout" @click=${this._logout}>Salir</button>
        </div>
      </header>
    `;
  }

  private _navigate(route: string) {
    this.dispatchEvent(new CustomEvent('bk-header-navigate', {
      detail: { route },
      bubbles: true,
      composed: true,
    }));
  }

  private _logout() {
    this.dispatchEvent(new CustomEvent('bk-header-logout', { bubbles: true, composed: true }));
  }
}

declare global {
  interface HTMLElementTagNameMap { 'bk-header': BkHeader; }
}
