import { LitElement, html, css } from 'lit';
import { html as staticHtml, unsafeStatic } from 'lit/static-html.js';
import { customElement, property, state } from 'lit/decorators.js';

export type HeadingTag = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'div' | 'p';
const ALLOWED_TAGS: readonly HeadingTag[] = ['h1','h2','h3','h4','h5','h6','div','p'];
import '../../molecules/bk-transaction-item/bk-transaction-item.ts';
import '../../atoms/bk-chip/bk-chip.ts';
import '../../atoms/bk-spinner/bk-spinner.ts';

export interface Transaction {
  id: string;
  concept: string;
  date: string;
  category: string;
  amount: number;
  currency?: string;
  status: 'pending' | 'completed' | 'failed';
}

const CATEGORY_LABELS: Record<string, string> = {
  food:      'Alimentación',
  transport: 'Transporte',
  leisure:   'Ocio',
  transfer:  'Transferencias',
  health:    'Salud',
  utilities: 'Suministros',
};

@customElement('bk-transaction-list')
export class BkTransactionList extends LitElement {
  @property() heading = 'Movimientos';
  @property() headingTag: HeadingTag = 'h3';
  @property({ type: Array }) transactions: Transaction[] = [];
  @property({ type: Boolean }) loading = false;
  @property() emptyMessage = 'No hay movimientos para mostrar.';

  @state() private _activeFilter = 'all';

  static styles = css`
    :host { display: block; }

    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: var(--bk-space-4, 1rem);
    }

    .title {
      font-family: var(--bk-font-sans, system-ui, sans-serif);
      font-size: var(--bk-font-size-lg, 1.125rem);
      font-weight: 700;
      color: var(--bk-color-text, #1a1a2e);
      margin: 0;
    }

    .filters {
      display: flex;
      gap: var(--bk-space-2, 0.5rem);
      flex-wrap: wrap;
      margin-bottom: var(--bk-space-4, 1rem);
    }

    .list {
      display: flex;
      flex-direction: column;
    }

    .empty {
      font-family: var(--bk-font-sans, system-ui, sans-serif);
      font-size: var(--bk-font-size-sm, 0.875rem);
      color: var(--bk-color-text-muted, #6b7280);
      text-align: center;
      padding: var(--bk-space-8, 2rem) 0;
    }

    .loading-wrap {
      display: flex;
      justify-content: center;
      padding: var(--bk-space-8, 2rem) 0;
    }
  `;

  private get _categories(): string[] {
    const cats = new Set(this.transactions.map(t => t.category).filter(Boolean));
    return Array.from(cats);
  }

  private get _filtered(): Transaction[] {
    if (this._activeFilter === 'all') return this.transactions;
    return this.transactions.filter(t => t.category === this._activeFilter);
  }

  private _onFilterChange(e: CustomEvent) {
    this._activeFilter = e.detail.selected ? e.detail.value : 'all';
  }

  render() {
    const filtered = this._filtered;
    const tag = unsafeStatic(ALLOWED_TAGS.includes(this.headingTag) ? this.headingTag : 'h3');

    return staticHtml`
      <div class="header">
        <${tag} class="title">${this.heading}</${tag}>
      </div>

      ${this._categories.length > 0 ? html`
        <div class="filters">
          <bk-chip
            label="Todos"
            value="all"
            ?selected=${this._activeFilter === 'all'}
            @bk-chip-change=${(e: CustomEvent) => { if (e.detail.selected) this._activeFilter = 'all'; }}
          ></bk-chip>
          ${this._categories.map(cat => html`
            <bk-chip
              label=${CATEGORY_LABELS[cat] ?? cat}
              value=${cat}
              ?selected=${this._activeFilter === cat}
              @bk-chip-change=${this._onFilterChange}
            ></bk-chip>
          `)}
        </div>
      ` : ''}

      ${this.loading ? html`
        <div class="loading-wrap">
          <bk-spinner size="lg" label="Cargando movimientos..."></bk-spinner>
        </div>
      ` : filtered.length === 0 ? html`
        <p class="empty">${this.emptyMessage}</p>
      ` : html`
        <div class="list">
          ${filtered.map(t => html`
            <bk-transaction-item
              concept=${t.concept}
              date=${t.date}
              category=${t.category}
              .amount=${t.amount}
              currency=${t.currency ?? 'EUR'}
              status=${t.status}
            ></bk-transaction-item>
          `)}
        </div>
      `}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap { 'bk-transaction-list': BkTransactionList; }
}
