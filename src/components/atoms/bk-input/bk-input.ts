import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

export type InputType = 'text' | 'number' | 'password' | 'email';

@customElement('bk-input')
export class BkInput extends LitElement {
  @property() type: InputType = 'text';
  @property() label = '';
  @property() placeholder = '';
  @property() value = '';
  @property() error = '';
  @property() name = '';
  @property({ type: Boolean }) disabled = false;
  @property({ type: Boolean }) required = false;

  static styles = css`
    :host {
      display: block;
    }

    .wrapper {
      display: flex;
      flex-direction: column;
      gap: 0.375rem;
    }

    label {
      font-family: var(--bk-font-sans, system-ui, sans-serif);
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--bk-color-text, #1a1a2e);
    }

    label .required {
      color: var(--bk-color-danger, #c0392b);
      margin-left: 0.2rem;
    }

    input {
      font-family: var(--bk-font-sans, system-ui, sans-serif);
      font-size: 1rem;
      color: var(--bk-color-text, #1a1a2e);
      background: var(--bk-color-surface-alt, #fff);
      border: 1.5px solid var(--bk-color-border, #d1d9e0);
      border-radius: var(--bk-radius-md, 8px);
      padding: 0.625rem 0.875rem;
      width: 100%;
      box-sizing: border-box;
      transition: border-color var(--bk-transition, 150ms ease),
                  box-shadow var(--bk-transition, 150ms ease);
      outline: none;
    }

    input:focus {
      border-color: var(--bk-color-primary, #003087);
      box-shadow: 0 0 0 3px rgba(0, 48, 135, 0.12);
    }

    input:disabled {
      background: var(--bk-color-surface, #f4f6f9);
      opacity: 0.6;
      cursor: not-allowed;
    }

    input.has-error {
      border-color: var(--bk-color-danger, #c0392b);
    }

    input.has-error:focus {
      box-shadow: 0 0 0 3px rgba(192, 57, 43, 0.12);
    }

    .error-msg {
      font-family: var(--bk-font-sans, system-ui, sans-serif);
      font-size: 0.8125rem;
      color: var(--bk-color-danger, #c0392b);
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }
  `;

  render() {
    return html`
      <div class="wrapper">
        ${this.label
          ? html`<label for=${this.name || 'bk-input'}>
              ${this.label}
              ${this.required ? html`<span class="required">*</span>` : ''}
            </label>`
          : ''}
        <input
          id=${this.name || 'bk-input'}
          type=${this.type}
          name=${this.name}
          placeholder=${this.placeholder}
          .value=${this.value}
          ?disabled=${this.disabled}
          ?required=${this.required}
          class=${this.error ? 'has-error' : ''}
          aria-invalid=${this.error ? 'true' : 'false'}
          aria-describedby=${this.error ? `${this.name}-error` : ''}
          @input=${this._handleInput}
          @change=${this._handleChange}
        />
        ${this.error
          ? html`<span class="error-msg" id="${this.name}-error" role="alert">
              ⚠ ${this.error}
            </span>`
          : ''}
      </div>
    `;
  }

  private _handleInput(e: Event) {
    const target = e.target as HTMLInputElement;
    this.value = target.value;
    this.dispatchEvent(new CustomEvent('bk-input-input', {
      detail: { value: this.value },
      bubbles: true,
      composed: true,
    }));
  }

  private _handleChange(e: Event) {
    const target = e.target as HTMLInputElement;
    this.dispatchEvent(new CustomEvent('bk-input-change', {
      detail: { value: target.value },
      bubbles: true,
      composed: true,
    }));
  }
}

declare global {
  interface HTMLElementTagNameMap { 'bk-input': BkInput; }
}
