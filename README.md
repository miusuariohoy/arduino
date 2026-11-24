# Arduino · Electrónica y Robótica

Sitio interactivo de Arduino Uno con guía de Teoría, diagramas de conexión en
cada tema y cada ejercicio, ejercitación autocorregible, simulación en
Tinkercad y evaluaciones con envío cifrado al repo privado `inform`.

## Estructura

| Archivo | Para qué sirve |
| --- | --- |
| `index.html` | Portada: 18 ejercicios con imagen de conexión, cuestionario y entrega. |
| `guia/index.html` | Guía de Teoría por temas, con esquemas de conexión de cada componente. |
| `tinkercad.html` | Ejercicios simulables en Tinkercad y alternativas para los que no. |
| `evaluacion.html` | Evaluación general y práctica, sin corrección visible. |
| `estilos.css` | Estilos compartidos. |
| `app.js` | Navegación activa. |
| `diagramas/*.svg` | Esquemas vectoriales de conexión usados en guía, ejercicios y Tinkercad. |
| `diagramas/generar.py` | Generador de los SVG; ejecutar con `python diagramas/generar.py`. |
| `ejercicios.js` | Correctores de la ejercitación y entrega. |
| `scripts/evaluacion.js` | Correctores internos de las evaluaciones. |
| `scripts/entrega.js` | Cifrado RSA-OAEP + AES-GCM y POST a `ntfy.sh`. |

## Temario

1. Sketch: `setup()`, `loop()`, tipos, `pinMode`, `delay`, Monitor Serie.
2. Digital: LED, botón, `INPUT_PULLUP`, semáforo.
3. Analógico: `analogRead`, `map`, `constrain`, PWM con `analogWrite`.
4. LCD 16x2: `begin`, `setCursor`, `print`, `clear`.
5. Matriz 8x8: coordenadas, puntos, frames y animación con `for`.
6. Sensores: LDR, temperatura, ultrasónido, umbrales y promedio.
7. Robótica: servo, motor con driver y máquina de estados.
8. Componentes: teoría y conexión de Arduino Uno, LED, botón, potenciómetro, LDR, LCD, matriz MAX7219, DHT11, HC-SR04, servo y L293D.

La página `tinkercad.html` marca qué actividades se pueden simular en Tinkercad Circuits y, para la matriz 8x8 y el DHT11, da la conexión y el programa para hardware real.

## Simulación

La simulación se hace en **Tinkercad Circuits** para las actividades
compatibles. La matriz 8x8 con MAX7219 y el sensor DHT11 no están disponibles
allí: esos ejercicios se resuelven con hardware real siguiendo el esquema y el
programa que se muestran en `tinkercad.html`.

## IDs de envío

| ID | Origen | Corrección visible |
| --- | --- | --- |
| `arduino-portada` | `index.html` | Sí, por requisitos, antes de enviar |
| `arduino-general` | `evaluacion.html#general` | No |
| `arduino-practica` | `evaluacion.html#practica` | No |

Claves de bloqueo en `localStorage`: `<id>-enviada-v1`. Después de enviar, la
página queda bloqueada.

Los tres IDs están registrados en `inform/scripts/guardar.js` dentro de
`ORDEN_EXAMENES` y en el README de `inform`.

## Publicación

El repo se publica con GitHub Pages desde la rama principal. La URL prevista es:

- `https://miusuariohoy.github.io/arduino/`
- `https://miusuariohoy.github.io/arduino/guia/`
- `https://miusuariohoy.github.io/arduino/evaluacion.html`
- `https://miusuariohoy.github.io/arduino/tinkercad.html`

El canal de entrega, la clave pública y la materia están en
`scripts/entrega.js`. La clave privada sigue solamente en `inform/claves/`.

## Crédito

Diseñado por la profesora Alejandra Moreira
