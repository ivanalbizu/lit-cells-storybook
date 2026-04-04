declare module '@open-cells/core' {
  export interface Route {
    path: string;
    name: string;
    component: string;
    import?: () => Promise<unknown>;
    [key: string]: unknown;
  }

  export interface StartAppOptions {
    routes: Route[];
    mainNode: string;
    persistentPages?: string[];
    interceptor?: {
      condition: (page: string) => boolean;
      redirect: { page: string };
    };
    skipNavigations?: Array<{ from?: string; to?: string }>;
    viewLimit?: number;
    [key: string]: unknown;
  }

  export function startApp(options: StartAppOptions): void;
  export function navigate(page: string, params?: Record<string, string>): void;

  /**
   * Publica un valor en un canal. El callback de los suscriptores recibe
   * el valor directamente (no envuelto). Requiere startApp() previo o
   * el comando se encola hasta que el bridge esté listo.
   */
  export function publish(channelName: string, value: unknown, options?: { sessionStorage?: boolean }): void;

  /**
   * Standalone subscribe — raramente usada directamente; normalmente se
   * usa `pageController.subscribe` (que enlaza automáticamente el host).
   */
  export function subscribe(channelName: string, node: EventTarget, callback: (value: unknown) => void): void;
}

declare module '@open-cells/core/types' {
  export { Route } from '@open-cells/core';
}

declare module '@open-cells/page-controller' {
  import type { ReactiveElement } from 'lit';

  /**
   * Definición de un canal de entrada (inbounds).
   * ElementController lo convierte en un getter en el host con
   * requestUpdate() automático.
   */
  export interface InboundDef {
    /** Nombre del canal al que suscribirse. */
    channel: string;
    /** Si true, no llama a requestUpdate() al recibir datos. */
    skipUpdate?: boolean;
    /** Función de transformación del valor recibido. */
    action?: (value: unknown) => unknown;
  }

  /**
   * Definición de un canal de salida (outbounds).
   * ElementController convierte la propiedad en un setter que publica
   * automáticamente en el canal al asignar un valor.
   */
  export interface OutboundDef {
    /** Nombre del canal donde publicar. */
    channel: string;
  }

  /** Reactive Controller — instanciar con `new PageController(this)` dentro de un LitElement. */
  export class PageController {
    constructor(host: ReactiveElement);
    navigate(page: string, params?: Record<string, string>): void;
    /**
     * Suscribe el host a un canal. El callback recibe el valor bruto publicado.
     * Uso imperativo (opción A). Para suscripciones declarativas, usar
     * `static inbounds` en la clase host (opción B).
     */
    subscribe<T = unknown>(channelName: string, callback: (value: T) => void): void;
    unsubscribe(channels: string[]): void;
    publish(channelName: string, value: unknown, options?: { sessionStorage?: boolean }): void;

    /**
     * Contexto del interceptor — útil para pasar datos entre páginas
     * durante flujos de navegación controlados por el interceptor.
     *
     * Ejemplo: almacenar el rol del usuario para que el interceptor
     * pueda tomar decisiones en la siguiente navegación.
     */
    updateInterceptorContext(ctx: Record<string, unknown>): void;
    getInterceptorContext(): Record<string, unknown>;
    setInterceptorContext(ctx: Record<string, unknown>): void;
    resetInterceptorContext(): void;
  }
}
