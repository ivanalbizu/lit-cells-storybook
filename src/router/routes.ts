import type { Route } from '@open-cells/core';

export const routes: Route[] = [
  {
    path: 'login',
    name: 'login',
    component: 'login-page',
    import: () => import('../pages/login-page/login-page.ts'),
  },
  {
    path: 'home',
    name: 'home',
    component: 'home-page',
    import: () => import('../pages/home-page/home-page.ts'),
  },
  {
    path: 'accounts',
    name: 'accounts',
    component: 'accounts-page',
    import: () => import('../pages/accounts-page/accounts-page.ts'),
  },
  {
    path: 'account/:id',
    name: 'account-detail',
    component: 'account-detail-page',
    import: () => import('../pages/account-detail-page/account-detail-page.ts'),
  },
  {
    path: 'transfer',
    name: 'transfer',
    component: 'transfer-page',
    import: () => import('../pages/transfer-page/transfer-page.ts'),
  },
];
