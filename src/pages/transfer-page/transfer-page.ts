import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { PageController } from '@open-cells/page-controller';
import type { TransferData } from '@/components/organisms/bk-transfer-form/bk-transfer-form.ts';
import '@/components/organisms/bk-transfer-form/bk-transfer-form.ts';
import '@/components/molecules/bk-alert/bk-alert.ts';
import '@/components/atoms/bk-button/bk-button.ts';

@customElement('transfer-page')
export class TransferPage extends LitElement {
  private _pageController = new PageController(this);

  @state() _successMessage = '';
  @state() _errorMessage = '';
  @state() _loading = false;
  @state() _accessDenied = false;

  static styles = css`
    :host {
      display: block;
      padding: 1.5rem;
      max-width: 560px;
      margin: 0 auto;
      box-sizing: border-box;
      background: var(--bk-color-surface, #f4f6f9);
      color: var(--bk-color-text, #1a1a2e);
      min-height: 100%;
    }

    .back {
      margin-bottom: 1.5rem;
    }

    .card {
      background: var(--bk-color-surface-alt, #fff);
      border-radius: var(--bk-radius-card, 12px);
      padding: 2rem;
      box-shadow: var(--bk-shadow-card, 0 2px 8px rgba(0,0,0,0.08));
    }
  `;

  onPageEnter() {
    // Guardia de rol — autorización a nivel de página.
    // El interceptor garantiza que hay sesión; aquí verificamos el rol.
    // Este patrón complementa al interceptor cuando se necesitan permisos
    // más granulares que no caben en la condición estática de startApp.
    const user = this._getSession();
    if (user?.role !== 'admin') {
      this._accessDenied = true;
      this.requestUpdate();
      return;
    }

    this._accessDenied = false;
    this._successMessage = '';
    this._errorMessage = '';
    this._loading = false;
  }

  private _getSession(): { role: string } | null {
    try {
      return JSON.parse(sessionStorage.getItem('bk-user') ?? 'null') as { role: string } | null;
    } catch {
      return null;
    }
  }

  render() {
    if (this._accessDenied) {
      return html`
        <div class="back">
          <bk-button variant="ghost" size="sm" @bk-button-click=${() => this._pageController.navigate('home')}>
            ← Volver al inicio
          </bk-button>
        </div>
        <bk-alert
          type="warning"
          message="No tienes permisos para realizar transferencias. Contacta con tu gestor."
        ></bk-alert>
      `;
    }

    return html`
      <div class="back">
        <bk-button variant="ghost" size="sm" @bk-button-click=${() => this._pageController.navigate('home')}>
          ← Volver al inicio
        </bk-button>
      </div>

      <div class="card">
        <bk-transfer-form
          ?loading=${this._loading}
          successMessage=${this._successMessage}
          errorMessage=${this._errorMessage}
          @bk-transfer-submit=${this._handleSubmit}
          @bk-transfer-cancel=${() => this._pageController.navigate('home')}
        ></bk-transfer-form>
      </div>
    `;
  }

  private async _handleSubmit(e: CustomEvent<TransferData>) {
    this._loading = true;
    this._errorMessage = '';
    this._successMessage = '';

    // Simulated API call — replace with real service
    await new Promise(r => setTimeout(r, 1200));

    const { amount, iban } = e.detail;
    const formatted = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(amount);

    if (Math.random() > 0.1) {
      this._successMessage = `Transferencia de ${formatted} a ${iban.slice(-4)} enviada correctamente.`;
    } else {
      this._errorMessage = 'No se pudo procesar la transferencia. Inténtalo de nuevo.';
    }

    this._loading = false;
  }
}

declare global {
  interface HTMLElementTagNameMap { 'transfer-page': TransferPage; }
}
