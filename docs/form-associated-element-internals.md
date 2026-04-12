# Form-Associated Custom Elements y ElementInternals

## El problema que resuelven

Los Web Components con Shadow DOM crean un árbol DOM aislado. Esto rompe dos cosas fundamentales que los elementos de formulario nativos (`<input>`, `<select>`, `<textarea>`) hacen automáticamente:

1. **Asociación con `<label>`** — `<label for="id">` solo funciona dentro del mismo árbol DOM. Si el `<input>` está en shadow DOM, el `for` no llega.
2. **Participación en formularios** — un custom element no aparece en `form.elements`, su valor no se envía con `form.submit()` y `form.reset()` no lo resetea.

```html
<!-- Sin formAssociated: el for no llega al <input> del shadow DOM -->
<label for="campo">Nombre</label>
<mi-input id="campo"></mi-input>  <!-- <input> interno invisible para el label -->
```

---

## `formAssociated = true`

Declarar `static formAssociated = true` en una clase de custom element le dice al browser que el componente es un **control de formulario** y debe tratarse como tal:

```ts
export class MiInput extends LitElement {
  static formAssociated = true;
}
```

Con esto activado, el browser:

- Asocia cualquier `<label for="id">` que apunte al host del componente, propagando el nombre accesible al árbol de accesibilidad (ARIA)
- Incluye el componente en `form.elements`
- Envía su valor en `form.submit()`
- Lo resetea con `form.reset()`
- Lo deshabilita cuando está dentro de un `<fieldset disabled>`

Es la declaración de intención: "este componente es un campo de formulario".

---

## `ElementInternals` — la API de control nativo

`attachInternals()` devuelve un objeto `ElementInternals` que expone las APIs internas que normalmente solo tienen los elementos nativos:

```ts
export class MiInput extends LitElement {
  static formAssociated = true;
  private _internals = this.attachInternals();
}
```

### `setFormValue(value)`

Establece el valor que el formulario enviará para este campo:

```ts
// En el handler de input:
this._internals.setFormValue(nuevoValor);

// El formulario incluirá: name=nuevoValor en el submit
```

Sin esto, aunque `formAssociated` esté activo, el valor no se enviaría.

### `setValidity(flags, mensaje, ancla)`

Controla el estado de validación del elemento, igual que la Constraint Validation API nativa:

```ts
// Campo requerido vacío
this._internals.setValidity(
  { valueMissing: true },
  'Campo requerido',
  this.shadowRoot.querySelector('input')  // ancla visual para el tooltip del browser
);

// Error externo (validación del servidor, por ejemplo)
this._internals.setValidity(
  { customError: true },
  'El IBAN no existe',
  inputEl
);

// Sin errores
this._internals.setValidity({});
```

Los flags disponibles son los mismos que `ValidityState` nativo:

| Flag | Cuándo usarlo |
|---|---|
| `valueMissing` | Campo `required` vacío |
| `typeMismatch` | Formato incorrecto (email, url) |
| `patternMismatch` | No cumple el `pattern` |
| `tooShort` / `tooLong` | Longitud fuera de rango |
| `rangeUnderflow` / `rangeOverflow` | Valor numérico fuera de rango |
| `customError` | Cualquier error personalizado |

Una vez establecida la validez, el elemento responde a `:invalid` / `:valid` en CSS y a `form.checkValidity()`.

### `formValue` y `validity` (solo lectura)

Propiedades de lectura que exponen el estado actual:

```ts
console.log(this._internals.formValue);   // valor actual
console.log(this._internals.validity);    // ValidityState
console.log(this._internals.validationMessage); // mensaje de error
```

---

## Callbacks del ciclo de vida del formulario

Con `formAssociated = true` el browser llama a estos métodos si están definidos:

### `formResetCallback()`

Llamado cuando el formulario hace `reset()`. Debe restaurar el valor al estado inicial:

```ts
formResetCallback() {
  this.value = '';
  this._internals.setFormValue('');
}
```

### `formDisabledCallback(disabled: boolean)`

Llamado cuando el elemento entra o sale del estado deshabilitado (por `<fieldset disabled>` o por cambiar el atributo `disabled` del propio elemento):

```ts
formDisabledCallback(disabled: boolean) {
  this.disabled = disabled;
  this.requestUpdate();
}
```

### `formAssociatedCallback(form: HTMLFormElement | null)`

Llamado cuando el elemento se asocia o desasocia de un formulario. Útil para reaccionar al contexto del formulario:

```ts
formAssociatedCallback(form: HTMLFormElement | null) {
  // form !== null → asociado a un <form>
  // form === null → desconectado del formulario
}
```

---

## `delegatesFocus: true`

Complementario a `formAssociated`. Cuando el host recibe el foco (por ejemplo porque un `<label for>` se ha clicado), lo delega automáticamente al primer elemento focusable del shadow DOM:

```ts
static override shadowRootOptions = {
  ...LitElement.shadowRootOptions,
  delegatesFocus: true,
};
```

Sin esto, el click en el label enfocaría el host (`<mi-input>`) pero no el `<input>` interno. Con ambas opciones activas, la experiencia es idéntica a un `<input>` nativo.

---

## Implementación completa en `bk-input`

```ts
export class BkInput extends LitElement {
  static formAssociated = true;
  static override shadowRootOptions = {
    ...LitElement.shadowRootOptions,
    delegatesFocus: true,
  };

  private readonly _internals = this.attachInternals();

  @property() value = '';
  @property() error = '';
  @property({ type: Boolean }) required = false;

  override updated(changed: Map<string, unknown>) {
    if (changed.has('value') || changed.has('error') || changed.has('required')) {
      this._internals.setFormValue(this.value);
      this._updateValidity();
    }
  }

  formResetCallback() {
    this.value = '';
    this._internals.setFormValue('');
  }

  formDisabledCallback(disabled: boolean) {
    this.disabled = disabled;
  }

  private _updateValidity() {
    const input = this.shadowRoot?.querySelector('input') ?? undefined;
    if (this.required && !this.value) {
      this._internals.setValidity({ valueMissing: true }, 'Campo requerido', input);
    } else if (this.error) {
      this._internals.setValidity({ customError: true }, this.error, input);
    } else {
      this._internals.setValidity({});
    }
  }
}
```

---

## Por qué los testers de accesibilidad reportan falsos positivos

Herramientas como **axe** o el addon **@storybook/addon-a11y** analizan el DOM estático. Cuando ven:

```html
<label for="mi-campo">Nombre</label>
<bk-input id="mi-campo"></bk-input>
```

Buscan un elemento `labelable` con `id="mi-campo"` (input, select, textarea…) y no lo encuentran porque el `<input>` real está en el shadow DOM. Reportan error.

Lo que no pueden ver es que en runtime el browser construye el árbol de accesibilidad correctamente gracias a `formAssociated`, haciendo que el nombre accesible "Nombre" quede asociado al control. Los screen readers reales (VoiceOver, NVDA, JAWS) usan este árbol de accesibilidad en runtime — no el DOM estático — por lo que anuncian el campo correctamente.

**Conclusión:** el falso positivo se debe a una limitación del análisis estático, no a un error de accesibilidad real.

---

## Soporte de navegadores

`formAssociated` y `ElementInternals` están soportados en todos los navegadores modernos:

| Navegador | Soporte desde |
|---|---|
| Chrome / Edge | 77 |
| Firefox | 98 |
| Safari | 16.4 |

Para proyectos que deban soportar versiones anteriores existe el polyfill [`element-internals-polyfill`](https://github.com/calebdwilliams/element-internals-polyfill).

---

## Referencias

- [MDN — Using the internals object](https://developer.mozilla.org/en-US/docs/Web/API/ElementInternals)
- [MDN — More capable form controls](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/attachInternals)
- [web.dev — More capable form controls](https://web.dev/articles/more-capable-form-controls)
- [WHATWG spec — Form-associated custom elements](https://html.spec.whatwg.org/multipage/custom-elements.html#form-associated-custom-elements)
