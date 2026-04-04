import { startApp } from '@open-cells/core';
import { routes } from './routes.ts';
import '../components/organisms/bk-header/bk-header.ts';
// bk-accounts-manager se importa en app.ts y publica en canales via outbounds

/**
 * Interceptor avanzado — autenticación + redirect-after-login.
 *
 * Responsabilidades:
 *   1. Sin sesión → guardar la ruta intentada en sessionStorage y redirigir a login.
 *   2. Tras login → login-page lee 'bk-pending-page' y navega a la ruta guardada.
 *
 * La autorización por rol (ej. transfer solo para admin) se delega a
 * cada página en su onPageEnter — es donde el componente tiene acceso
 * a navigate y puede mostrar feedback al usuario.
 *
 * Claves de sessionStorage:
 *   bk-user         → { email, name, role: 'regular' | 'admin' }
 *   bk-pending-page → nombre de la ruta intentada antes del login
 *
 * Gestión de memoria — persistentPages + viewLimit:
 *
 *   persistentPages: ['home']
 *     home-page nunca se destruye al navegar fuera de ella. Permanece en el
 *     DOM con state="inactive" (display:none via CSS). Al volver, onPageEnter
 *     se ejecuta de nuevo pero los datos suscritos vía inbounds siguen en
 *     memoria — no hay flash de loading.
 *     Las páginas persistentes NO cuentan para el viewLimit.
 *
 *   viewLimit: 2
 *     Open Cells mantiene en el DOM hasta 2 páginas no persistentes a la vez
 *     (además de la activa). Cuando se supera el límite, la más antigua con
 *     state="cached" se destruye y se elimina del DOM. El ciclo es:
 *       navegar accounts → cached
 *       navegar account-detail → cached, accounts cached
 *       navegar transfer → límite alcanzado: accounts destruida
 *     Esto reduce la memoria consumida en flujos largos de navegación.
 */

const PUBLIC_PAGES = ['login'];

startApp({
  routes,
  mainNode: 'app-content',
  persistentPages: ['home'],
  viewLimit: 2,
  interceptor: {
    condition: (page: string) => {
      const hasSession = Boolean(sessionStorage.getItem('bk-user'));

      if (!hasSession && !PUBLIC_PAGES.includes(page)) {
        // Guarda el destino para poder redirigir tras un login exitoso
        sessionStorage.setItem('bk-pending-page', page);
        return true;
      }

      return false;
    },
    redirect: { page: 'login' },
  },
  skipNavigations: [
    { from: 'login', to: 'login' },
  ],
});
