import { LitElement, html, css } from 'lit';
import { html as staticHtml, unsafeStatic } from 'lit/static-html.js';
import { customElement, property, state } from 'lit/decorators.js';

export type HeadingTag = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'div' | 'p';

const HEADING_TAGS: readonly string[] = ['h1','h2','h3','h4','h5','h6'];
const ALLOWED_TAGS: readonly HeadingTag[] = ['h1','h2','h3','h4','h5','h6','div','p'];
import '../../molecules/bk-form-field/bk-form-field.ts';
import '../../molecules/bk-alert/bk-alert.ts';
import '../../atoms/bk-button/bk-button.ts';

export interface TransferData {
  iban: string;
  amount: number;
  concept: string;
}

@customElement('bk-transfer-form')
export class BkTransferForm extends LitElement {
  @property() heading: string = 'Nueva transferencia';
  @property() headingTag: HeadingTag = 'h3';
  @property() successMessage = '';
  @property() errorMessage = '';
  @property({ type: Boolean }) loading = false;

  @state() private _iban = '';
  @state() private _amount = '';
  @state() private _concept = '';
  @state() private _errors: Record<string, string> = {};

  static styles = css`
    :host { display: block; }

    .form {
      display: flex;
      flex-direction: column;
      gap: var(--bk-space-4, 1rem);
    }

    fieldset {
      border: none;
      margin: 0;
      padding: 0;
      min-width: 0;
      display: contents;
    }

    .title {
      font-family: var(--bk-font-sans, system-ui, sans-serif);
      font-size: var(--bk-font-size-lg, 1.125rem);
      font-weight: 700;
      color: var(--bk-color-text, #1a1a2e);
      margin: 0 0 var(--bk-space-2, 0.5rem);
    }

    legend {
      font-family: var(--bk-font-sans, system-ui, sans-serif);
      font-size: var(--bk-font-size-lg, 1.125rem);
      font-weight: 700;
      color: var(--bk-color-text, #1a1a2e);
      margin: 0 0 var(--bk-space-2, 0.5rem);
      padding: 0;
      float: left;
      width: 100%;
    }

    legend + * { clear: both; }

    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
    }

    .actions {
      display: flex;
      gap: var(--bk-space-3, 0.75rem);
      margin-top: var(--bk-space-2, 0.5rem);
    }
  `;

  render() {
    const isHeading = HEADING_TAGS.includes(this.headingTag);
    const tag = unsafeStatic(ALLOWED_TAGS.includes(this.headingTag) ? this.headingTag : 'h3');

    return staticHtml`
      <div class="form">
        ${isHeading ? staticHtml`<${tag} class="title">${this.heading}</${tag}>` : ''}

        <fieldset ?disabled=${this.loading}>
          <legend class=${isHeading ? 'sr-only' : ''}>${this.heading}</legend>


          ${this.successMessage ? html`
            <bk-alert type="success" message=${this.successMessage} dismissible></bk-alert>
          ` : ''}
          ${this.errorMessage ? html`
            <bk-alert type="error" message=${this.errorMessage}></bk-alert>
          ` : ''}

          <bk-form-field
            label="IBAN destinatario"
            name="iban"
            type="text"
            placeholder="ES00 0000 0000 0000 0000 0000"
            value=${this._iban}
            error=${this._errors.iban ?? ''}
            ?disabled=${this.loading}
            required
            @bk-field-input=${(e: CustomEvent) => { this._iban = e.detail.value; }}
          ></bk-form-field>

          <bk-form-field
            label="Importe"
            name="amount"
            type="number"
            placeholder="0,00"
            value=${this._amount}
            error=${this._errors.amount ?? ''}
            hint="Máximo 10.000 € por transferencia"
            ?disabled=${this.loading}
            required
            @bk-field-input=${(e: CustomEvent) => { this._amount = e.detail.value; }}
          ></bk-form-field>

          <bk-form-field
            label="Concepto"
            name="concept"
            type="text"
            placeholder="Ej: Alquiler mayo"
            value=${this._concept}
            error=${this._errors.concept ?? ''}
            hint="Opcional"
            ?disabled=${this.loading}
            @bk-field-input=${(e: CustomEvent) => { this._concept = e.detail.value; }}
          ></bk-form-field>

          <div class="actions">
            <bk-button variant="primary" ?loading=${this.loading} @bk-button-click=${this._submit}>
              Enviar transferencia
            </bk-button>
            <bk-button variant="ghost" @bk-button-click=${this._reset}>
              Cancelar
            </bk-button>
          </div>
        </fieldset>
      </div>
    `;
  }

  private _validate(): boolean {
    const errors: Record<string, string> = {};

    if (!this._iban.trim()) {
      errors.iban = 'El IBAN es obligatorio.';
    } else if (!/^[A-Z]{2}\d{2}[\dA-Z]{1,30}$/.test(this._iban.replace(/\s/g, ''))) {
      errors.iban = 'El formato del IBAN no es válido.';
    }

    const amount = parseFloat(this._amount);
    if (!this._amount) {
      errors.amount = 'El importe es obligatorio.';
    } else if (isNaN(amount) || amount <= 0) {
      errors.amount = 'El importe debe ser mayor que 0.';
    } else if (amount > 10000) {
      errors.amount = 'El importe supera el límite de 10.000 €.';
    }

    this._errors = errors;
    return Object.keys(errors).length === 0;
  }

  private _submit() {
    if (!this._validate()) return;

    this.dispatchEvent(new CustomEvent<TransferData>('bk-transfer-submit', {
      detail: {
        iban:    this._iban.replace(/\s/g, ''),
        amount:  parseFloat(this._amount),
        concept: this._concept,
      },
      bubbles: true,
      composed: true,
    }));
  }

  private _reset() {
    this._iban = '';
    this._amount = '';
    this._concept = '';
    this._errors = {};
    this.dispatchEvent(new CustomEvent('bk-transfer-cancel', { bubbles: true, composed: true }));
  }
}

declare global {
  interface HTMLElementTagNameMap { 'bk-transfer-form': BkTransferForm; }
}
