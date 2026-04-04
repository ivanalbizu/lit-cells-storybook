import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import '../../atoms/bk-input/bk-input.ts';

export type InputType = 'text' | 'number' | 'password' | 'email';

@customElement('bk-form-field')
export class BkFormField extends LitElement {
  @property() label = '';
  @property() name = '';
  @property() type: InputType = 'text';
  @property() placeholder = '';
  @property() value = '';
  @property() error = '';
  @property() hint = '';
  @property({ type: Boolean }) required = false;
  @property({ type: Boolean }) disabled = false;

  static styles = css`
    :host { display: block; }

    .field {
      display: flex;
      flex-direction: column;
      gap: var(--bk-space-1, 0.25rem);
    }

    .label-row {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
    }

    label {
      font-family: var(--bk-font-sans, system-ui, sans-serif);
      font-size: var(--bk-font-size-sm, 0.875rem);
      font-weight: 600;
      color: var(--bk-color-text, #1a1a2e);
    }

    label .required {
      color: var(--bk-color-danger, #c0392b);
      margin-left: 0.2rem;
    }

    .hint {
      font-family: var(--bk-font-sans, system-ui, sans-serif);
      font-size: var(--bk-font-size-xs, 0.75rem);
      color: var(--bk-color-text-muted, #6b7280);
    }
  `;

  render() {
    const fieldId = this.name || 'bk-field';
    return html`
      <div class="field">
        <div class="label-row">
          ${this.label
            ? html`<label for=${fieldId}>
                ${this.label}
                ${this.required ? html`<span class="required">*</span>` : ''}
              </label>`
            : ''}
          ${this.hint && !this.error
            ? html`<span class="hint">${this.hint}</span>`
            : ''}
        </div>
        <bk-input
          id=${fieldId}
          name=${this.name}
          type=${this.type}
          placeholder=${this.placeholder}
          value=${this.value}
          error=${this.error}
          ?required=${this.required}
          ?disabled=${this.disabled}
          @bk-input-input=${this._onInput}
          @bk-input-change=${this._onChange}
        ></bk-input>
      </div>
    `;
  }

  private _onInput(e: CustomEvent) {
    this.value = e.detail.value;
    this.dispatchEvent(new CustomEvent('bk-field-input', {
      detail: { name: this.name, value: this.value },
      bubbles: true,
      composed: true,
    }));
  }

  private _onChange(e: CustomEvent) {
    this.dispatchEvent(new CustomEvent('bk-field-change', {
      detail: { name: this.name, value: e.detail.value },
      bubbles: true,
      composed: true,
    }));
  }
}

declare global {
  interface HTMLElementTagNameMap { 'bk-form-field': BkFormField; }
}
