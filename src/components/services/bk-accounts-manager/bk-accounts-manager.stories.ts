import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import { ACCOUNTS } from '../../../mocks/accounts.ts';
import { TRANSACTIONS } from '../../../mocks/transactions.ts';
import './bk-accounts-manager.ts';

/**
 * BkAccountsManager es un Data Manager — componente web sin UI que actúa
 * como capa de datos entre los mocks/API y las páginas.
 *
 * Patrón Open Cells completo (A + B + C):
 *
 *  C) bk-accounts-manager  (outbounds — escribe en canales)
 *       this.accounts = [...]  →  publish('bk:accounts', [...])
 *                                          ↓ ReplaySubject(1)
 *  B) home-page / accounts-page  (inbounds — lee de canales)
 *       static inbounds = { accounts: { channel: 'bk:accounts' } }
 *       → this.accounts = [...]  →  requestUpdate()
 *
 * La story muestra el estado interno del manager como tabla de datos,
 * porque el componente no renderiza nada en la SPA.
 */
const meta: Meta = {
  title: 'Services/BkAccountsManager',
  component: 'bk-accounts-manager',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
**Data Manager** — componente web sin UI que vive en el app shell.

Usa \`outbounds\` para publicar datos en canales al arrancar:

\`\`\`ts
static outbounds = {
  accounts:     { channel: 'bk:accounts' },
  transactions: { channel: 'bk:transactions' },
};

firstUpdated() {
  this.accounts = ACCOUNTS;       // → publish('bk:accounts', ACCOUNTS)
  this.transactions = TRANSACTIONS; // → publish('bk:transactions', ...)
}
\`\`\`

En producción, \`firstUpdated\` haría una llamada fetch a la API en lugar
de importar los mocks.
        `,
      },
    },
  },
};
export default meta;

// ─── Default — estado del manager ─────────────────────────────────────────────

export const Default: StoryObj = {
  name: 'Default',
  render: () => html`
    <bk-accounts-manager></bk-accounts-manager>

    <!-- El manager no renderiza nada; mostramos el estado de los datos mock -->
    <div style="font-family: var(--bk-font-mono, monospace); font-size: 0.8rem; padding: 1rem;">
      <h3 style="font-family: system-ui; margin-bottom: 0.5rem;">
        Datos que publicaría en canales:
      </h3>

      <details open style="margin-bottom: 0.75rem;">
        <summary style="cursor: pointer; font-weight: 600; margin-bottom: 0.5rem;">
          bk:accounts (${ACCOUNTS.length} cuentas)
        </summary>
        <pre style="background:#f4f6f9; padding:0.75rem; border-radius:8px; overflow:auto;">
${JSON.stringify(ACCOUNTS, null, 2)}</pre>
      </details>

      <details>
        <summary style="cursor: pointer; font-weight: 600; margin-bottom: 0.5rem;">
          bk:transactions (${TRANSACTIONS.length} movimientos)
        </summary>
        <pre style="background:#f4f6f9; padding:0.75rem; border-radius:8px; overflow:auto;">
${JSON.stringify(TRANSACTIONS.slice(0, 3), null, 2)}
  ... y ${TRANSACTIONS.length - 3} más</pre>
      </details>
    </div>
  `,
};
