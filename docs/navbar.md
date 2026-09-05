# Navbar

Barra de navegación fija de la landing. Es el único componente de sección que
existe en las cinco variantes del diseño y en los dos idiomas, y el que cambia
de forma en más breakpoints, así que concentra casi toda la lógica responsive
del sitio.

- **Contrato de diseño:** `DESIGN.md` → `components.navbar`, `navbar-lang-chip`,
  `navbar-drawer`
- **Diseño canónico:** `pencil.pen` → `j3SPJh` · `BWMwJ` · `ZBSNU` · `Mqgsa` ·
  `dNNus`, y el drawer en `nyRec` → `KCMkq`

---

## Estructura

Sigue la convención del repo: un componente de sección en `app/components/` y
sus piezas presentacionales en una carpeta con el nombre de la sección.

| Archivo | Capa | Cobertura |
|---|---|---|
| `app/components/AppNavbar.vue` | Sección — dueña de todo el estado y de los listeners | Sí, con test |
| `app/components/Navbar/links.ts` | Fuente única de los enlaces | Sí |
| `app/components/Navbar/NavLinks.vue` | Fila de enlaces de escritorio | Excluida |
| `app/components/Navbar/NavLangSwitch.vue` | Conmutador de idioma | Excluida |
| `app/components/Navbar/NavMobileMenu.vue` | Drawer móvil | Excluida |
| `app/components/Navbar/NavSignupLink.vue` | Enlace a `/signup` (barra y drawer) | Excluida |

`app/components/Navbar/**` está en el `exclude` de coverage de
`vitest.config.ts`, como el resto de subcarpetas de sección. El comportamiento
que merece test no vive ahí: está en `AppNavbar.vue` y en los composables.

### API

`AppNavbar` recibe el estado del modal de contacto y emite las intenciones; no
monta el modal. Quien lo monta es `app/components/LandingPage.vue`.

```vue
<AppNavbar
  :is-contact-modal-open="isContactModalOpen"
  @open-contact-modal="isContactModalOpen = true"
  @close-contact-modal="isContactModalOpen = false"
/>
```

Los subcomponentes son props-in / eventos-out, sin estado propio:

| Componente | Props | Emits |
|---|---|---|
| `NavLinks` | `links`, `activeHash` | `navigate` |
| `NavLangSwitch` | `locale`, `variant` (`desktop` \| `mobile`) | — |
| `NavSignupLink` | `variant` (`desktop` \| `mobile`) | `navigate` |
| `NavMobileMenu` | `open`, `links`, `activeHash`, `locale`, `isContactModalOpen` | `close`, `navigate`, `openContact` |

### Enlaces

`links.ts` es la **única** fuente. Antes la lista estaba duplicada entre
escritorio y móvil y ya había divergido: el drawer tenía un quinto enlace
"Products" que apuntaba al mismo `#features` que "Features". Un test verifica
que ambas superficies rinden exactamente los mismos `href`.

```ts
export const NAV_LINKS: readonly NavLink[] = [
  { id: 'who-we-are', href: '#who-we-are', labelKey: 'nav.who' },
  { id: 'benefits',   href: '#benefits',   labelKey: 'nav.benefits' },
  { id: 'features',   href: '#features',   labelKey: 'nav.features' },
  { id: 'pricing',    href: '#pricing',    labelKey: 'nav.pricing' },
] as const
```

### Enlace a `/signup` — y por qué no está en `NAV_LINKS`

La puerta a la web app (`/signup`) **no** es un quinto elemento de `NAV_LINKS`,
y no es una cuestión de gusto: los cuatro de esa lista son anclas de sección con
scroll-spy y `aria-current`. Una ruta a otro documento no tiene sección activa
que expresar, así que no lleva `aria-current`, no participa del `activeHash` y no
se emite por `@navigate` como los demás. Vive en su propio componente,
`NavSignupLink.vue`, que rinde las dos superficies.

Tratamiento y ubicación los fija `DESIGN.md` →
`components.navbar-signup-link` y la sección *Sign-up entry point*: enlace de
texto con los tokens de enlace de nav (`foreground` en reposo, `blue-sky` en
hover, peso 500), sin relleno, sin borde y sin radio. **No es un segundo botón**
— la barra lleva exactamente un CTA (`button-cta-marketing`).

| Superficie | Rango | Posición | Tipografía |
|---|---|---|---|
| Barra | desde 1280 | primer elemento del clúster derecho, antes del CTA | nav-md 1280–1439, nav-lg desde 1440 |
| Drawer | bajo 768 | Grupo 2 (acción), **encima** del CTA | nav-md |
| — | **768–1279** | **no existe superficie** — ver *Deuda conocida* | — |

**La etiqueta es `"Sign Up"` en los dos locales**, Title Case, por decisión de
producto: es un préstamo asentado en el español técnico, como "login", y está
registrado como deliberado en `DESIGN.md` y en el `IDENTICAL_BY_DESIGN` de
`tests/translations.spec.ts`. Si algún día se traduce, hay que volver a medir la
tabla de abajo: `"Registrarse"` mide 68.3px a 12px contra los 45.9 de
`"Sign Up"`.

`barVisibleFrom: 1280px` es un valor **medido**, no una preferencia. Holgura
libre del row tras descontar los gaps existentes, con el enlace en la barra
desde 768; negativo = el row excede su caja:

| Viewport | EN | ES |
|---|---|---|
| 390 | en el drawer | en el drawer |
| 768 | +21 cabe | **−64**, y 3 elementos salen del viewport |
| 843 | +96 cabe | +11 cabe |
| 844 | +56 cabe | **−35**, y 3 elementos salen del viewport |
| 1024 | +87 cabe | **−4**, el row excede; nada sale ni hay scroll |
| 1280 | cabe | +92 cabe |
| 1440 | +304 cabe | +206 cabe |

El español despeja, por bisección, en **exactamente 1028px** — 4px por encima de
`lg`, y entre `lg` y `xl` no hay parada de Tailwind. **La restricción no es la
etiqueta del enlace**: son los cuatro enlaces de sección en español
(`Plataforma / Beneficios / Funciones / Precios`, 283px a 768) y sobre todo el
CTA `Hablar con Ventas`, ~190px de los 249 del clúster derecho. Por eso acortar
la etiqueta del sign-up no cerró la franja, y por eso 1028 no se adoptó como
umbral: sería una sexta anchura de `Layout` cuya única justificación es el ancho
renderizado de una cadena, movible por cualquier edición de copy.

En el drawer el enlace va **encima** del CTA porque ambos son nav-md y el tamaño
no puede jerarquizarlos: lo hacen el orden y el cromado, y el primario va último
(la regla de los modales). El grupo crece 48px exactos (44 de fila + 4 de gap),
así que el ritmo `24 + 1 + 24` entre grupos no se mueve. **No** es un cuarto
grupo: eso exigiría una cuarta hairline y un escalón de tipo por debajo de
`nav-sm`, que no existe.

---

## Escala responsive

Cinco variantes, no dos. Los valores salen de `DESIGN.md`; el pen tiene algún
valor fuera de escala que **no** debe copiarse (ver *Adjudicación*).

| | 390 | 768 | 844 | 1024 | 1440 |
|---|---|---|---|---|---|
| Alto de barra | 64 | 80 | 80 | 80 | 80 |
| Padding lateral | 20 | 32 | 32 | 48 | 80 |
| Logo (ancho) | 130 | 150 | 150 | 190 | 238 |
| Enlaces | drawer | 12 | 14 | 14 | 16 |
| Gap entre enlaces | — | 16 | 16 | 24 | 32 |

**844 es un móvil en horizontal**, no una tablet: es el iPhone 12/13/14 girado
(390×844 → 844 de ancho por 390 de alto). Tiene 76px más de ancho que una
tablet vertical y el contrato los gasta en subir los enlaces a 14px y en dar
aire entre el logo y el grupo de enlaces. **No es una copia de 768.**

Tailwind no tiene parada en 844, así que el escalón vive en una media query
dentro de `NavLinks.vue`, deliberadamente acotada al componente:

```css
@media (min-width: 844px) { .nav-link { font-size: 14px; line-height: 1.429; } }
@media (min-width: 1440px) { .nav-link { font-size: 16px; line-height: 1.5; } }
```

Es un puente. Cuando exista un `tailwind.config` con los `screens` del contrato,
se sustituye por utilidades y el bloque desaparece.

> **El logo se dimensiona por ancho en 390.** `navbar.logoWidth` es un token de
> ancho. Dimensionarlo con `h-[30px]` lo re-derivaba a 132.2px vía el ratio
> 4.409 del SVG. De 768 en adelante las alturas ya aterrizan en los anchos del
> token y se quedan como están.

---

## Superficie y estados

El relleno y la hairline **no** están en el `<nav>`, sino en un hijo
(`.nav-surface`). Con el drawer abierto el `<nav>` también *contiene* el panel,
así que un relleno arriba pintaría el mismo `#001751` detrás de las esquinas
2xl del panel: el recorte se aplica y el `<nav>` lo vuelve a rellenar con el
mismo color, con lo que el radio se vuelve invisible y el drawer termina en
línea recta.

| Estado | Fondo | Hairline inferior |
|---|---|---|
| Arriba del scroll | `#001751` al 50% + `blur(8px)` | `#B7CDF51F` |
| Con scroll (>20px) | `#001751` opaco | `#B7CDF51F` |
| Drawer abierto | `#001751` opaco | transparente |

La barra **se vuelve opaca al abrir el drawer**. El panel es `surface` opaco por
contrato, y una barra translúcida encima partía la superficie en dos dejando ver
contenido sin atenuar.

Y **cede su hairline** mientras el drawer está abierto: la línea de esa junta
pertenece al borde redondeado del panel, y mantener también la de la barra
dibujaba una segunda línea recta cruzando las esquinas. Se apaga por **color, no
por ancho**, para que abrir y cerrar no desplace un píxel.

---

## Drawer móvil

Solo existe bajo 768 (`md:hidden`). Tres grupos con jerarquía descendente:

| Grupo | Tipografía | Contenido |
|---|---|---|
| Navegación | `nav-lg` 16/500 | los 4 enlaces, filas de 44px, `itemGap` 4 |
| Acción | `nav-md` 14/500 | el CTA |
| Utilidad | `nav-sm` 12/500 | el conmutador de idioma |

Panel: `surface #001751` opaco, `border-y` de 1px, esquinas **superiores
cuadradas** (a ras de la barra) e **inferiores de 16px**, padding 20.

### El `groupGap` vale 49px, no 24 — y es correcto

Es el detalle que más veces se ha entendido mal. `groupGap: {spacing.24}` es el
**gap flex del panel**, no la distancia total contenido-a-contenido. El diseño
canónico apila *navegación · regla · acción · regla · conmutador* con 24 entre
cada par adyacente, así que dos grupos quedan a **24 + 1 + 24 = 49px** con la
regla centrada.

En el código eso es `gap-6` en el contenedor más `pt-6` en los dos grupos que
llevan regla. Colapsarlo a `12 + 1 + 12` gasta el token una sola vez y deja el
drawer 48px corto. Ya se "corrigió" así una vez por error y hubo que revertirlo.

### Scrim

`#01051DCC`, arranca en el borde inferior de la **barra** (`top-0` del
contenedor, que empieza donde acaba la barra) y se pinta **detrás** del panel
opaco — es un hermano anterior en el DOM y ambos son cajas posicionadas
`z-auto`, así que el panel gana el orden de pintado.

Eso es justo lo que necesitan las esquinas de 16px: los dos recortes forman
parte del campo atenuado. Arrancándolo en `top-full` se veía el hero sin
atenuar dentro de los recortes.

Es `absolute` dentro de un `<nav>` `fixed`, así que **no añade overflow
scrollable al documento y no puede mover el CLS**. Se descartó `Teleport to="body"`
por añadir una ruta de hidratación SSR para algo que la geometría ya resuelve.

---

## Comportamiento

Todo el estado vive en `AppNavbar.vue`:

| Estado | Qué hace |
|---|---|
| `mobileMenuOpen` | Abre el drawer. Se resetea al cruzar a ≥768 vía `matchMedia`, para que no reaparezca ya abierto al re-estrechar |
| `isTop` | `scrollY < 20`. Listener `{ passive: true }`, retirado en `onBeforeUnmount` |
| `activeHash` | Marca el enlace activo con `aria-current="page"`. Escucha `hashchange` |

**Composables reutilizados** — compartidos con `ContactModal`, no reimplementar:

```ts
useBodyScrollLock(active: Ref<boolean>)
useFocusTrap(container: Ref<HTMLElement | null>, active: Ref<boolean>, onEscape?: () => void)
```

`useFocusTrap` mete el foco en el panel al abrir, cicla con Tab en ambos
sentidos, cierra con Escape y **devuelve el foco al botón hamburguesa**.
`useBodyScrollLock` lleva contador de referencias y restaura el `overflow`
previo.

> **Limitación conocida:** `useFocusTrap` no atrapa el foco si el componente
> **monta ya abierto** — su watcher `immediate` corre antes de que exista el
> `ref` del contenedor. Hoy no afecta a nadie porque el drawer y el modal
> siempre arrancan cerrados, pero tenlo en cuenta antes de reusarlo.

---

## Internacionalización

Cada idioma es **su propia URL indexable**: `/` sirve inglés y `/es` español.
El locale sale de la ruta, no de `Accept-Language`.

El conmutador son **enlaces reales** (`<a href>` vía `NuxtLink`), no botones:
tiene que ser rastreable y funcionar sin JavaScript. Lleva `hreflang`, `lang` y
`aria-current="page"` en el activo. Ver `app/composables/useLocaleRoutes.ts`.

El logo apunta al home **del locale activo**, no siempre a `/`.

### Claves

Todo texto —incluidos los nombres accesibles— vive en los locales. Añádelo
siempre a `locales/en.json` **y** `locales/es.json`; `tests/translations.spec.ts`
verifica paridad exacta contra los archivos reales.

| Clave | EN | ES |
|---|---|---|
| `nav.who` | Platform | Plataforma |
| `nav.benefits` | Benefits | Beneficios |
| `nav.features` | Features | Funciones |
| `nav.pricing` | Pricing | Precios |
| `nav.cta` | Talk to Sales | Hablar con Ventas |
| `nav.aria.main` | Main navigation | Navegación principal |
| `nav.aria.home` | Hermes - Home | Hermes - Inicio |
| `nav.aria.logo` | Hermes Logistics logo | Logotipo de Hermes Logistics |
| `nav.aria.toggleMenu` | Toggle navigation menu | Abrir o cerrar menú de navegación |
| `nav.aria.languageSwitch` | Language | Idioma |
| `nav.aria.switchToEnglish` | Switch to English | Cambiar a inglés |
| `nav.aria.switchToSpanish` | Switch to Spanish | Cambiar a español |

El CTA dice **"Talk to Sales"**, no "Schedule a Demo": el hero ya usa esa
etiqueta y dos CTAs idénticos en el mismo viewport rompen la jerarquía. El del
navbar es el compromiso bajo y persistente; el del hero, el alto.

---

## Accesibilidad

- `<nav role="navigation">` con `aria-label` traducido.
- Hamburguesa con `aria-expanded` y `aria-controls="mobile-menu"`.
- CTA con `aria-haspopup="dialog"` y `aria-expanded` atado al estado del modal.
- Enlace activo por **color + `aria-current`**, nunca por peso.
- Anillo de foco global en `assets/css/tailwind.css`:
  `outline: 2px solid #61F0FF; outline-offset: 2px`. El offset es funcional —
  `#61F0FF` sobre el relleno `#FF734D` del CTA da 1.97:1, y el offset apoya el
  anillo sobre el fondo. **No lo quites.**

### Contraste: mídelo contra la barra en reposo

Es la regla que más fácil se incumple. La barra tiene **dos** superficies —
translúcida sobre el hero, y `#001751` opaca con scroll — y el peor caso es la
primera. Medir solo contra la opaca es lo que dejó pasar un chip de idioma en
2.97:1, por debajo del 3:1 que exige WCAG 1.4.11.

| Elemento | En reposo |
|---|---|
| Chip activo `#6C8AD0` | 4.40–4.53:1 |
| Etiqueta del chip `#01051D` sobre el chip | 5.94:1 |
| Enlaces `#EBF2FF` | 13.33:1 |
| Enlace activo `#61F0FF` | 11.00:1 |
| Chip inactivo `#94A4C2` | 5.96:1 |
| Trazo del CTA `#FF734D` | 5.57:1 |

El hover del CTA usa `#01051D` sobre el relleno naranja (7.51:1). **Blanco sobre
`#FF734D` da 2.69:1 y está prohibido por contrato.**

---

## Tests

`tests/components/AppNavbar.spec.ts` cubre: paridad de `href` entre escritorio y
drawer, toggle y `aria-expanded`, emisión de `open-contact-modal`, cierre al
pulsar un enlace, Escape, reset al cruzar a desktop, `aria-current`, transición
`nav-transparent` ↔ `nav-solid`, listener `passive` y su limpieza, el contrato
del drawer, los `aria-label` desde `nav.aria.*`, y que el `<nav>` no lleve
relleno propio.

Un test que no puede fallar no cuenta. Este archivo llegó a tener un
`expect(hasNav || hasLinks).toBe(true)` que pasaba con cualquiera de las dos
ramas. Si dudas de un test, rompe el componente a propósito y comprueba que cae.

---

## Verificación

```bash
bun run lint
bun run test
bun run test:coverage
```

Criterios que deben seguir cumpliéndose:

- **Sin desbordamiento**, `nav.scrollWidth === nav.clientWidth`, en
  390/768/843/844/1024/1440 × `/` y `/es` — **12 combinaciones**, y también con
  el drawer abierto. El español es el caso justo: sus etiquetas son más largas.
- **CLS 0.00** en ambas rutas, en carga y al abrir/cerrar el drawer.
- **Consola limpia**, sin errores ni warnings.
- **Cero cadenas en inglés en `/es`**, nombres accesibles incluidos.

> **Trampa de entorno.** No midas en el puerto donde corre el `bun dev` de otra
> persona, y **reinicia el servidor tras cada `bun run build`**: uno que siga
> vivo de un build anterior devuelve 404 en los assets con hash nuevo y hace
> parecer que el CSS está roto. Nos costó dos diagnósticos falsos.
>
> Y mide **píxeles renderizados**, no estilos declarados. Las esquinas de 16px
> del drawer daban `border-radius: 16px` en el computed style mientras no se
> veían; hizo falta `elementFromPoint` para descubrir que algo las repintaba.

---

## Adjudicación diseño ↔ código

Donde pen y código discrepen **gana el código**, salvo que el código viole
`DESIGN.md` — en ese caso se corrige el código, no se propaga el error al
diseño. `DESIGN.md` es el contrato; el pen es una representación de él y también
puede equivocarse.

El pen ha tenido valores fuera de escala (`padding [0,56]`, `strokeWidth 1.5`,
`fontSize 15/13`, un logo a 130×30 que estira el ratio un 1,7%) y en su momento
un artboard de 844 que era copia literal del de 768. Contrasta siempre contra
`DESIGN.md` antes de copiar del canvas.

## Deuda conocida

- **No existe `tailwind.config`.** Los colores del navbar son hex literales; son
  tokens reales de `DESIGN.md`, pero sin resolver por nombre. Entra en la
  migración global, no en un parche local.
- El punto activo del carrusel usa `#FF734D`, naranja fuera del navbar de
  marketing, que es donde la excepción lo acota.
- La aritmética de `DESIGN.md` para el CTA olvida los bordes: declara 36px de
  alto y el control mide 38.
- **De 768 a 1279 la barra no tiene puerta a la web app**, y **no es un problema
  de longitud de etiqueta**: se probó acortarla al inglés `"Sign Up"` en ambos
  locales y el déficit apenas se movió, porque vive en los enlaces de sección
  españoles y en el CTA. Ninguna etiqueta del sign-up lo cierra. Las dos salidas
  honestas son (A) extender el rango del drawer de `< 768` a `< 1280`, que es lo
  que prescribe el propio principio del contrato ("el tamaño sigue al espacio
  disponible, no a la clase de dispositivo") y obliga a rehacer los artboards de
  768/844/1024 y el pen; o (B) dejar la barra sin puerta ahí y servir esa banda
  desde un punto de entrada en página. Requiere decisión de producto; no la tomes
  de paso. `navbar-signup-link.typography` mantiene `null` en 768/844/1024, pero
  ya no anota una pregunta abierta: significa lo mismo que en `linkTypography` a
  390 — el elemento no está en la barra a esa anchura.
- Se descartaron, con motivo, tres atajos: bajar el umbral a **1024** (deja el
  español a −4, con cero holgura: la siguiente palabra que crezca lo rompe
  visiblemente), recuperar esos 4px bajando `navbar.groupGap` a 20 en `lg` (lo
  pondría por debajo de `navbar.linkGap` 24, y como en esta barra la agrupación
  la carga solo el espaciado, invertirlos hace que se lea como cinco elementos
  sueltos), y acortar el CTA español (invierte el ranking que fija el contrato:
  el CTA es la acción primaria y el sign-up "un enlace a su lado").
- **La fila de 768 en español ya excede su caja de 704px en 2px** y sobrevive
  pinchando el gap del grupo a 12 cuando `navbar.groupGap` fija 16. Nada sale
  del viewport y no hay scroll horizontal, pero holgura no queda: la barra a
  768–1023 está un elemento por encima de su presupuesto antes de añadirle
  nada. Preexistente, no consecuencia del enlace de sign-up.
