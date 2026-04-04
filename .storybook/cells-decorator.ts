import type { Decorator } from '@storybook/web-components';
import { fn } from 'storybook/test';

/**
 * Decorator que simula el Bridge de Open Cells en Storybook.
 *
 * Qué hace:
 *  1. Parchea `navigate` en el elemento de página con un spy (fn()) para
 *     que cada llamada aparezca en el panel Actions sin que el componente
 *     lance un error por no tener router.
 *  2. Expone `navigateFn` en args para que cada story pueda verificarlo.
 *
 * Uso en una story:
 *   decorators: [withCellsBridge]
 *
 * El componente no sabe que Storybook existe: sigue llamando a
 * `this.navigate('ruta', params)` con normalidad.
 */
export const withCellsBridge: Decorator = (story, context) => {
  const navigateFn = fn().mockName('navigate');
  context.args['navigateFn'] = navigateFn;
  return story();
};
