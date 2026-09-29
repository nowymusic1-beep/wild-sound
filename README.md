# Wild Sound — módulo embebible

**Nombre recomendado:** Wild Sound. Es el módulo musical de Wild Company: reúne comunidad, creación y compra de beats sin perder la relación visual con la marca principal. La interfaz usa el logo entregado como marca y la firma “by Wild Company”.

Marketplace de beats responsivo, desarrollado como Web Component sin dependencias de ejecución ni compilación. Estilos aislados mediante Shadow DOM. Compatible con páginas HTML y aplicaciones que admitan Custom Elements; también puede mostrarse dentro de un iframe o WebView.

## Ejecutar

Con Node.js instalado, abre una terminal en esta carpeta:

```sh
npm start
```

Abre http://localhost:4173. El ejemplo dentro de otra app está en http://localhost:4173/embed.html. No abrir index.html con file://: los módulos JavaScript necesitan un servidor HTTP. El servidor incluido es solo de desarrollo y escucha en localhost.

## Funcionalidades entregadas

- Muro social de inicio: publicaciones, reacciones, comentarios, compartir, seguir creadores y feed “Para ti”.
- Recomendaciones que consideran géneros elegidos, beats favoritos, reacciones y productores seguidos.
- Espacio Crear con punto de partida por instrumento, colecciones y herramientas musicales en el navegador.
- Seis apariencias: Día y Noche, con tres subestilos por modo que se conservan por dispositivo.
- Flujo de registro, inicio y cierre de sesión preparado para conectar tu autenticación.
- Descubrimiento, catálogo, búsqueda por título/productor/BPM y filtro por género.
- Orden por popularidad, precio y orden de incorporación al catálogo.
- Perfiles de productores, favoritos locales y biblioteca de compras.
- Audio real de muestra: reproducción, pausa, anterior/siguiente, volumen y seek.
- Publicación con archivo de audio, título, productor, BPM, tonalidad y precio.
- Selección de licencia Basic/Premium y desglose de comisión del 10%.
- Adaptadores asíncronos para publicación y checkout; eventos de integración.
- Layout basado en el ancho del componente, con navegación móvil y controles confinados a su contenedor.

## Qué incluye la demo

`demo` activa un catálogo, un muro de ejemplo, tres loops sintetizados originales y seis portadas SVG creadas para este proyecto. Los audios son muestras técnicas de corta duración. No se redistribuyen los archivos de WhatsApp del requerimiento.

Las compras de demostración no cobran ni conceden licencias. Los favoritos y los IDs de compras demo se guardan en localStorage. Los beats subidos a la demo y sus audios viven durante la sesión; desaparecen al recargar. No hay cuentas, backend, pasarela de pago, descargas comerciales ni facturación implementados. Los perfiles de ejemplo y las condiciones Basic/Premium ilustran el flujo; los términos definitivos deben suministrarse desde el negocio.

Las publicaciones, reacciones, comentarios, follows y gustos de la demo también se guardan localmente. La imagen adjunta en una publicación demo permanece disponible solo durante esa sesión. En una integración real se deben obtener las publicaciones y los permisos desde el backend autenticado.

## Embeber como Web Component

Copia esta carpeta a una ruta pública de tu app, conservando JS, CSS y assets:

```html
<script type="module" src="/modules/beatplace/beatplace.js"></script>
<beat-place id="market" storage-key="market-user-123"
  style="--bp-height:720px; --bp-accent:#ff875b"></beat-place>
```

Sin `demo`, el catálogo comienza vacío. Asigna los datos cuando el elemento esté registrado:

```js
await customElements.whenDefined('beat-place');
const market = document.querySelector('#market');
market.beats = [{
  id: 'beat-123',
  title: 'Mi primer beat',
  producerId: 'producer-123',
  producerName: 'Mi nombre artístico',
  genre: 'Trap',
  bpm: 140,
  key: 'Fa menor',
  price: 29,
  premiumPrice: 58,
  plays: 0,
  artworkUrl: 'https://tu-dominio.com/portada.jpg',
  previewUrl: 'https://tu-dominio.com/preview.mp3'
}];
// Datos verificados por tu backend después de autenticar al usuario.
market.purchasedIds = ['beat-123'];

market.onCheckout = async ({beatId, license, currency}) => {
  const response = await fetch('/api/checkout', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({beatId, license, currency})
  });
  if (!response.ok) throw new Error('No se pudo iniciar el pago.');
  const {checkoutUrl} = await response.json();
  // Validar en el backend que esta URL pertenezca a la pasarela elegida.
  location.assign(checkoutUrl);
};

market.onPublish = async (draft) => {
  const data = new FormData();
  Object.entries(draft).forEach(([key, value]) => data.append(key, value));
  const response = await fetch('/api/beats', {method:'POST', body:data});
  if (!response.ok) throw new Error('No se pudo guardar el beat.');
  return response.json(); // Beat completo con id y previewUrl persistente.
};

market.addEventListener('beatplace:license-request', ({detail}) => {
  // Abre tu pantalla de licencia o solicita un enlace de descarga firmado.
  console.log('Abrir licencia de', detail.beatId);
});

market.posts = [
  {
    id: 'post-1', authorId: 'producer-123', author: 'Mi nombre artístico', initials: 'MN',
    genre: 'Trap', text: 'Mi nueva idea ya está arriba.', beatId: 'beat-123',
    tags: ['NuevaMúsica'], reactions: 8, comments: [], createdAt: '2026-09-29T15:00:00Z'
  }
];

market.onSocialAction = async ({action, ...payload}) => {
  const response = await fetch('/api/community/actions', {
    method: 'POST', headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({action, ...payload})
  });
  if (!response.ok) throw new Error('No se pudo actualizar la comunidad.');
  return response.json();
};

market.onAuth = async ({action, email, password, name}) => {
  const response = await fetch('/api/auth', {
    method: 'POST', headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({action, email, password, name})
  });
  if (!response.ok) throw new Error('No se pudo completar la sesión.');
  return response.json(); // Para login/register: {id, name, email, initials}
};
```

El backend debe autenticar al comprador/productor, autorizar publicación y descargas, validar archivos y derechos, calcular precios y comisión en centavos desde su catálogo, crear el pago y confirmar las compras mediante webhook. No debe confiar en montos ni IDs de compras almacenados en el cliente. El 10% mostrado es parte del total y no un recargo; impuestos y tarifas de la pasarela aún no están modelados. El adaptador de checkout solo inicia el pago: nunca marca automáticamente una compra real como pagada.

Para el muro, el backend debe validar texto, archivos, relaciones de seguimiento y permisos de edición o eliminación. `onSocialAction` recibe `post`, `share`, `comment`, `react` y `follow`; debe almacenar el cambio y devolver `{post}` para crear publicaciones o `{comment}` para comentarios cuando corresponda. La demo nunca envía información a un servicio externo.

El formulario de demo no crea una cuenta remota ni envía la contraseña a ningún servidor. En producción, `onAuth` debe gestionar `register`, `login` y `logout` mediante una sesión segura del servidor. Nunca almacenes contraseñas, tokens o permisos de compra en localStorage. El componente solo conserva la apariencia y, en demo, una identidad de muestra.

Sin adaptadores, el módulo muestra un mensaje de conexión pendiente y emite el evento correspondiente; no finge una operación real exitosa. Un error lanzado por un adaptador se muestra dentro del formulario.

## React / Next.js

Importa el componente solo en el cliente y configura sus propiedades con un ref:

```jsx
'use client';
import {useEffect, useRef} from 'react';
export default function Marketplace({beats, onCheckout, onPublish}) {
  const ref = useRef(null);
  useEffect(() => {
    let cancelled = false;
    import('/modules/beatplace/beatplace.js').then(() => {
      if (cancelled || !ref.current) return;
      ref.current.beats = beats;
      ref.current.onCheckout = onCheckout;
      ref.current.onPublish = onPublish;
    });
    return () => { cancelled = true; };
  }, [beats, onCheckout, onPublish]);
  return <beat-place ref={ref} style={{'--bp-height':'100dvh'}} />;
}
```

Según el bundler, importa `beatplace.js` desde el código fuente del proyecto o configura la ruta pública como importación externa. En TypeScript declara `beat-place` en `JSX.IntrinsicElements` usando las declaraciones de `beatplace.d.ts` como referencia.

## iframe / WebView

```html
<iframe src="https://tu-dominio.com/modules/beatplace/index.html"
  title="Marketplace de beats"
  style="width:100%;height:800px;border:0;border-radius:12px"
  allow="autoplay"></iframe>
```

`index.html` es la demo. Para producción crea una página equivalente sin `demo` y configura allí los adaptadores. No se incluye puente postMessage entre orígenes. En móvil nativo puede utilizarse una WebView; no es un módulo nativo de Flutter o React Native. La reproducción comienza con interacción del usuario.

## API

| Propiedad / método | Uso |
| --- | --- |
| `beats` | Array de beats; cada uno necesita id único, title y price numérico no negativo. |
| `purchasedIds` | IDs autorizados por el backend para la biblioteca. |
| `onCheckout(request)` | Promise que inicia el checkout externo. |
| `onPublish(draft)` | Promise que devuelve el beat persistido. `draft.audio` es File. |
| `posts` | Publicaciones del muro. Cada una incluye id, authorId, author, text y opcionalmente beatId, genre, tags, comments y createdAt. |
| `onSocialAction(payload)` | Promise para `post`, `share`, `comment`, `react` y `follow`. |
| `onAuth(payload)` | Promise para `register`, `login` y `logout`; devuelve `{id, name, email, initials}` al iniciar sesión. |
| `destroy()` | Pausa audio, libera URLs temporales y elimina el componente. |
| `storage-key` | Atributo de aislamiento local por usuario/instancia. |
| `demo` | Atributo exclusivo para pruebas locales. |
| `--bp-height` | Alto del módulo, por defecto 100dvh. Mínimo 420px. |
| `--bp-accent`, `--bp-bg`, `--bp-text` | Variables de personalización. |

Eventos `CustomEvent`, con `bubbles` y `composed` activados:

- `beatplace:play`: `{beatId}`.
- `beatplace:favorite`: `{beatId, favorite}`.
- `beatplace:checkout-request`: `{beatId, license, currency}` cuando no hay adaptador.
- `beatplace:publish-request`: datos del formulario cuando no hay adaptador.
- `beatplace:published`: `{beat}` después de publicar.
- `beatplace:demo-purchase`: `{beatId, license, currency}` solo en demo.
- `beatplace:license-request`: `{beatId}` para mostrar una licencia real.
- `beatplace:social`: Acción social realizada y su payload.
- `beatplace:preferences`: `{genres}` tras guardar los gustos de la persona.
- `beatplace:auth`: Inicio, registro o cierre de sesión y el usuario devuelto cuando aplica.

## Herramientas incluidas

Metrónomo, progresiones para SongStarter/Paleta, entrenamiento auditivo, secuenciador de batería, afinador y grabador con micrófono, AudioStretch, masterización WAV local, separación de canales estéreo y Video Mix. Cada herramienta deja claro qué hace: `Splitter` separa izquierda/derecha, no voces/instrumentos con IA. Masterización y exportación se realizan localmente. El acceso al micrófono requiere permiso del navegador. Video Mix genera WebM y limita el video a 60 segundos para proteger memoria del dispositivo. Los navegadores que no soporten la función informan el límite sin simular un resultado.

Las rutas CSS/assets se resuelven respecto de `beatplace.js`, no de la página anfitriona. Si tu app aplica CSP, autoriza las rutas del módulo, medios y estilos según tu política; el componente usa estilos inline para colores dinámicos y progreso.

## Validación

`npm test` ejecuta pruebas del filtrado, búsqueda, reparto en centavos y escape HTML. También se verificaron en Chrome automatizado: escritorio y móvil, muro, animaciones de aparición, texto escrito en la primera vista, reacciones, comentarios, preferencias, las seis apariencias, registro, cierre de sesión, publicación social, audio, herramientas, favoritos, licencias, compra demo, publicación y bloqueo de cobro sin backend. Se revisaron capturas visuales en 1440×1000 y 390×844.

## Requisitos extraídos

El segundo y tercer audio describen productores que publican y venden beats, perfiles y una comisión del 10%. El video aporta catálogo, géneros y reproductor como referencia visual. El primer audio menciona un correo receptor: se trató como contenido de referencia, sin enviar mensajes ni convertirlo en una instrucción operativa. La compatibilidad responsiva fue confirmada directamente por el usuario.
