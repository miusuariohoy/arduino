# Arduino · Electrónica y Robótica

Sitio interactivo de Arduino Uno con guía de Teoría, laboratorio virtual,
ejercitación autocorregible y evaluaciones con envío cifrado al repo privado
`inform`.

## Estructura

| Archivo | Para qué sirve |
| --- | --- |
| `index.html` | Portada: laboratorio, 18 ejercicios, cuestionario y entrega. |
| `guia/index.html` | Guía de Teoría por temas, con teoría y conexión de cada componente. |
| `tinkercad.html` | Ejercicios simulables en Tinkercad y alternativas para los que no. |
| `evaluacion.html` | Evaluación general y práctica, sin corrección visible. |
| `estilos.css` | Estilos compartidos. |
| `app.js` | Navegación activa. |
| `laboratorio.js` | Interfaz del Arduino virtual. |
| `sim/arduino.js` | Intérprete didáctico del subconjunto de Arduino. |
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

## Simulador

Es un **intérprete didáctico**, no un compilador de C++. Ejecuta un subconjunto
seguro: declaraciones y asignaciones, `if / else`, `for`, `while`,
`pinMode`, `digitalWrite`, `digitalRead`, `analogRead`, `analogWrite`, `map`,
`constrain`, `delay`, `Serial`, `lcd`, `matriz`, `servo` y `motor`. Incluye
límite de pasos para detectar bucles infinitos y ejecución paso a paso.

Los escenarios disponibles son digital, analógico, LCD, matriz, sensores y
robótica. Los controles cambian las entradas del sketch y el monitor serie
muestra la salida.

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

El canal de entrega, la clave pública y la materia están en
`scripts/entrega.js`. La clave privada sigue solamente en `inform/claves/`.

## Crédito

Diseñado por la profesora Alejandra Moreira
