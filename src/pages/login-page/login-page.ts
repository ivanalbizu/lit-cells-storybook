import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { PageController } from '@open-cells/page-controller';
import '../../components/molecules/bk-form-field/bk-form-field.ts';
import '../../components/molecules/bk-alert/bk-alert.ts';
import '../../components/atoms/bk-button/bk-button.ts';

/**
 * Credenciales de demo:
 *   demo@bank.es  / 1234  → rol "regular"  (no puede acceder a /transfer)
 *   admin@bank.es / admin → rol "admin"    (acceso completo)
 */
const DEMO_USERS: Record<string, { name: string; role: 'regular' | 'admin' }> = {
  'demo@bank.es:1234':    { name: 'Ana García', role: 'regular' },
  'admin@bank.es:admin':  { name: 'Carlos Admin', role: 'admin' },
};

@customElement('login-page')
export class LoginPage extends LitElement {
  private _pageController = new PageController(this);

  @state() _email = '';
  @state() _password = '';
  @state() _error = '';
  @state() _loading = false;

  static styles = css`
    :host {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      background: var(--bk-color-surface, #f4f6f9);
      padding: 1rem;
      box-sizing: border-box;
    }

    .card {
      background: var(--bk-color-surface-alt, #fff);
      border-radius: var(--bk-radius-card, 12px);
      box-shadow: var(--bk-shadow-md, 0 4px 16px rgba(0,0,0,0.12));
      padding: 2.5rem;
      width: 100%;
      max-width: 400px;
    }

    .logo {
      font-family: var(--bk-font-sans, system-ui, sans-serif);
      font-size: 1.75rem;
      font-weight: 800;
      color: var(--bk-color-primary, #003087);
      margin: 0 0 0.25rem;
    }

    .subtitle {
      font-family: var(--bk-font-sans, system-ui, sans-serif);
      font-size: 0.875rem;
      color: var(--bk-color-text-muted, #6b7280);
      margin: 0 0 2rem;
    }

    .form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .hint {
      font-family: var(--bk-font-sans, system-ui, sans-serif);
      font-size: 0.75rem;
      color: var(--bk-color-text-muted, #6b7280);
      margin-top: 1rem;
      padding-top: 1rem;
      border-top: 1px solid #e5e7eb;
      line-height: 1.6;
    }

    bk-button {
      margin-top: 0.5rem;
    }
  `;

  render() {
    return html`
      <div class="card">
        <h1 class="logo">BankApp</h1>
        <p class="subtitle">Accede a tu banca online</p>

        ${this._error ? html`
          <bk-alert type="error" message=${this._error}></bk-alert>
        ` : ''}

        <div class="form">
          <bk-form-field
            label="Email"
            name="email"
            type="email"
            placeholder="tu@email.com"
            value=${this._email}
            required
            @bk-field-input=${(e: CustomEvent) => { this._email = e.detail.value; }}
          ></bk-form-field>

          <bk-form-field
            label="Contraseña"
            name="password"
            type="password"
            placeholder="••••••••"
            value=${this._password}
            required
            @bk-field-input=${(e: CustomEvent) => { this._password = e.detail.value; }}
          ></bk-form-field>

          <bk-button
            variant="primary"
            size="lg"
            ?loading=${this._loading}
            @bk-button-click=${this._login}
          >
            Entrar
          </bk-button>
        </div>

        <p class="hint">
          Demo regular: demo@bank.es / 1234<br>
          Demo admin: admin@bank.es / admin
        </p>
      </div>
    `;
  }

  private async _login() {
    if (!this._email || !this._password) {
      this._error = 'Por favor, introduce email y contraseña.';
      return;
    }
    this._loading = true;
    this._error = '';

    await new Promise(r => setTimeout(r, 800));

    const key = `${this._email}:${this._password}`;
    const user = DEMO_USERS[key];

    if (user) {
      sessionStorage.setItem('bk-user', JSON.stringify({ email: this._email, ...user }));

      // Interceptor avanzado — redirect-after-login:
      // Si el usuario intentaba acceder a una ruta protegida antes del login,
      // el interceptor guardó ese destino en 'bk-pending-page'. Navegamos allí
      // en lugar de ir siempre a 'home'.
      const pending = sessionStorage.getItem('bk-pending-page') ?? 'home';
      sessionStorage.removeItem('bk-pending-page');

      this._pageController.navigate(pending);
    } else {
      this._error = 'Credenciales incorrectas.';
      this._loading = false;
    }
  }
}

declare global {
  interface HTMLElementTagNameMap { 'login-page': LoginPage; }
}
