/* ============================================================
   ejercicios.js · ejercitación autocorregible de Arduino
   ============================================================ */
(function(){
  'use strict';

  function norm(s){
    return String(s).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
  }
  function tiene(c, re){ return re.test(c.t); }
  function requisito(d, re){ return { d:d, f:function(c){ return tiene(c, re); } }; }

  const setup = c => tiene(c, /void\s+setup\s*\(\s*\)\s*\{/);
  const loop = c => tiene(c, /void\s+loop\s*\(\s*\)\s*\{/);

  const EJERCICIOS = [
    /* ---------------------- DIGITAL ---------------------- */
    {
      id:'ard-dig1', modulo:'digital', titulo:'1.1 · Encender y apagar el LED integrado', nivel:'Fácil',
      consigna:'Escribí un sketch con <code>setup()</code> y <code>loop()</code>. En <code>setup()</code> configurá el pin 13 como salida. En <code>loop()</code> encendé el LED con <code>digitalWrite(13, HIGH)</code>, esperá 500 ms con <code>delay(500)</code>, apagalo con <code>digitalWrite(13, LOW)</code> y esperá otros 500 ms.',
      placeholder:'void setup() {\n  ...\n}\n\nvoid loop() {\n  ...\n}',
      requisitos:[
        { d:'Incluye setup()', f:setup },
        { d:'Incluye loop()', f:loop },
        { d:'Configura pinMode(13, OUTPUT)', f:c => tiene(c, /pinmode\s*\(\s*13\s*,\s*output\s*\)/) },
        { d:'Enciende con digitalWrite(13, HIGH)', f:c => tiene(c, /digitalwrite\s*\(\s*13\s*,\s*high\s*\)/) },
        { d:'Apaga con digitalWrite(13, LOW)', f:c => tiene(c, /digitalwrite\s*\(\s*13\s*,\s*low\s*\)/) },
        { d:'Usa delay(500) dos veces', f:c => (c.t.match(/delay\s*\(\s*500\s*\)/g) || []).length >= 2 }
      ]
    },
    {
      id:'ard-dig2', modulo:'digital', titulo:'1.2 · Botón con INPUT_PULLUP', nivel:'Medio',
      consigna:'Configurá el pin 2 con <code>INPUT_PULLUP</code> y el 13 como salida. En <code>loop()</code> leé el botón con <code>digitalRead(2)</code>. Con <code>if</code>, encendé el LED cuando el botón esté presionado (la lectura vale 0) y apagalo cuando esté suelto.',
      placeholder:'void setup() {\n  ...\n}\n\nvoid loop() {\n  int boton = ...;\n  if (...) { ... } else { ... }\n}',
      requisitos:[
        { d:'Incluye setup() y loop()', f:c => setup(c) && loop(c) },
        { d:'Usa pinMode(2, INPUT_PULLUP)', f:c => tiene(c, /pinmode\s*\(\s*2\s*,\s*input_pullup\s*\)/) },
        { d:'Usa pinMode(13, OUTPUT)', f:c => tiene(c, /pinmode\s*\(\s*13\s*,\s*output\s*\)/) },
        { d:'Lee el botón con digitalRead(2)', f:c => tiene(c, /digitalread\s*\(\s*2\s*\)/) },
        { d:'Decide con if y else', f:c => tiene(c, /\bif\s*\(/) && tiene(c, /\belse\b/) },
        { d:'Compara la lectura con 0', f:c => tiene(c, /==\s*0\b/) },
        { d:'Escribe digitalWrite(13, ...)', f:c => tiene(c, /digitalwrite\s*\(\s*13\s*,/) }
      ]
    },
    {
      id:'ard-dig3', modulo:'digital', titulo:'1.3 · Semáforo con tres LEDs', nivel:'Medio',
      consigna:'Usá los pines 8, 9 y 10 como salidas. En <code>loop()</code> encendé un LED a la vez con <code>digitalWrite</code> y apagá los otros dos. Entre cada cambio poné un <code>delay(1000)</code>. La idea es que nunca queden dos encendidos al mismo tiempo.',
      placeholder:'void setup() {\n  ...\n}\n\nvoid loop() {\n  ...\n}',
      requisitos:[
        { d:'Configura los pines 8, 9 y 10 como OUTPUT', f:c => [8,9,10].every(p => tiene(c, new RegExp('pinmode\\s*\\(\\s*' + p + '\\s*,\\s*output\\s*\\)'))) },
        { d:'Usa digitalWrite en los tres pines', f:c => [8,9,10].every(p => tiene(c, new RegExp('digitalwrite\\s*\\(\\s*' + p + '\\s*,'))) },
        { d:'Enciende con HIGH', f:c => tiene(c, /digitalwrite\s*\([^)]*,\s*high\s*\)/) },
        { d:'Apaga con LOW', f:c => tiene(c, /digitalwrite\s*\([^)]*,\s*low\s*\)/) },
        { d:'Usa delay(1000)', f:c => tiene(c, /delay\s*\(\s*1000\s*\)/) },
        { d:'Incluye setup() y loop()', f:c => setup(c) && loop(c) }
      ]
    },

    /* ---------------------- ANALÓGICO ---------------------- */
    {
      id:'ard-ana1', modulo:'analogico', titulo:'2.1 · Leer un potenciómetro', nivel:'Fácil',
      consigna:'Inicializá el puerto serie con <code>Serial.begin(9600)</code>. En <code>loop()</code> leé el potenciómetro de <code>A0</code> con <code>analogRead(A0)</code> y enviá el valor al monitor con <code>Serial.println()</code>. Recordá que la lectura va de 0 a 1023.',
      placeholder:'void setup() {\n  ...\n}\n\nvoid loop() {\n  ...\n}',
      requisitos:[
        { d:'Incluye setup() y loop()', f:c => setup(c) && loop(c) },
        { d:'Inicializa Serial.begin(9600)', f:c => tiene(c, /serial\.begin\s*\(\s*9600\s*\)/) },
        { d:'Lee analogRead(A0)', f:c => tiene(c, /analogread\s*\(\s*a0\s*\)/) },
        { d:'Guarda la lectura en una variable', f:c => tiene(c, /\bint\s+\w+\s*=\s*analogread\s*\(/) },
        { d:'Envía el valor con Serial.println()', f:c => tiene(c, /serial\.println\s*\(/) },
        { d:'Usa delay() para no saturar el monitor', f:c => tiene(c, /delay\s*\(/) }
      ]
    },
    {
      id:'ard-ana2', modulo:'analogico', titulo:'2.2 · PWM con map()', nivel:'Medio',
      consigna:'Leé <code>A0</code>, convertí el rango 0–1023 a 0–255 con <code>map()</code> y mandá el resultado al pin 9 con <code>analogWrite(9, brillo)</code>. Así el LED cambia de brillo en vez de solo encenderse o apagarse.',
      placeholder:'void setup() {\n  ...\n}\n\nvoid loop() {\n  int pot = ...;\n  int brillo = ...;\n  analogWrite(...);\n}',
      requisitos:[
        { d:'Lee analogRead(A0)', f:c => tiene(c, /analogread\s*\(\s*a0\s*\)/) },
        { d:'Usa map() de 0,1023 a 0,255', f:c => tiene(c, /map\s*\([^)]*0\s*,\s*1023\s*,\s*0\s*,\s*255\s*\)/) },
        { d:'Guarda el resultado en una variable', f:c => tiene(c, /\bint\s+\w+\s*=\s*map\s*\(/) },
        { d:'Aplica analogWrite(9, ...)', f:c => tiene(c, /analogwrite\s*\(\s*9\s*,/) },
        { d:'Configura el pin 9 como salida', f:c => tiene(c, /pinmode\s*\(\s*9\s*,\s*output\s*\)/) },
        { d:'Incluye setup() y loop()', f:c => setup(c) && loop(c) }
      ]
    },
    {
      id:'ard-ana3', modulo:'analogico', titulo:'2.3 · Umbral con if / else', nivel:'Medio',
      consigna:'Leé <code>A0</code>. Si el valor es mayor que 512, encendé el pin 13; si no, apagalo. Usá <code>if</code> y <code>else</code>, y enviá por serie el valor leído para poder comprobar el umbral.',
      placeholder:'void setup() {\n  ...\n}\n\nvoid loop() {\n  int valor = ...;\n  if (...) { ... } else { ... }\n}',
      requisitos:[
        { d:'Lee analogRead(A0)', f:c => tiene(c, /analogread\s*\(\s*a0\s*\)/) },
        { d:'Compara con > 512', f:c => tiene(c, />\s*512\b/) },
        { d:'Usa if y else', f:c => tiene(c, /\bif\s*\(/) && tiene(c, /\belse\b/) },
        { d:'Escribe digitalWrite(13, HIGH)', f:c => tiene(c, /digitalwrite\s*\(\s*13\s*,\s*high\s*\)/) },
        { d:'Escribe digitalWrite(13, LOW)', f:c => tiene(c, /digitalwrite\s*\(\s*13\s*,\s*low\s*\)/) },
        { d:'Configura el pin 13 como salida', f:c => tiene(c, /pinmode\s*\(\s*13\s*,\s*output\s*\)/) }
      ]
    },

    /* ---------------------- LCD ---------------------- */
    {
      id:'ard-lcd1', modulo:'lcd', titulo:'3.1 · Primer mensaje en el LCD', nivel:'Fácil',
      consigna:'En <code>setup()</code> iniciá la pantalla con <code>lcd.begin(16, 2)</code> y mostrá el texto <code>"Hola Arduino"</code> con <code>lcd.print()</code>. En <code>loop()</code> dejá solo un <code>delay()</code>: el mensaje debe quedarse fijo.',
      placeholder:'void setup() {\n  ...\n}\n\nvoid loop() {\n  ...\n}',
      requisitos:[
        { d:'Incluye setup() y loop()', f:c => setup(c) && loop(c) },
        { d:'Inicia lcd.begin(16, 2)', f:c => tiene(c, /lcd\.begin\s*\(\s*16\s*,\s*2\s*\)/) },
        { d:'Muestra texto con lcd.print()', f:c => tiene(c, /lcd\.print\s*\([^)]*["'][^"']+["']/) },
        { d:'Escribe Hola Arduino', f:c => tiene(c, /hola\s+arduino/) },
        { d:'Usa delay() en loop()', f:c => tiene(c, /delay\s*\(/) }
      ]
    },
    {
      id:'ard-lcd2', modulo:'lcd', titulo:'3.2 · Cursor y limpieza', nivel:'Medio',
      consigna:'Mostrá <code>"Listo"</code> en la fila 0, columna 0. Después limpiá la pantalla con <code>lcd.clear()</code>, mové el cursor a la fila 1, columna 3 con <code>lcd.setCursor(3, 1)</code> y escribí <code>"Fin"</code>. Recordá que <code>setCursor</code> recibe primero la columna y después la fila.',
      placeholder:'void setup() {\n  ...\n}\n\nvoid loop() {\n  ...\n}',
      requisitos:[
        { d:'Inicia lcd.begin(16, 2)', f:c => tiene(c, /lcd\.begin\s*\(\s*16\s*,\s*2\s*\)/) },
        { d:'Limpia con lcd.clear()', f:c => tiene(c, /lcd\.clear\s*\(\s*\)/) },
        { d:'Mueve el cursor con lcd.setCursor(3, 1)', f:c => tiene(c, /lcd\.setcursor\s*\(\s*3\s*,\s*1\s*\)/) },
        { d:'Escribe Listo', f:c => tiene(c, /lcd\.print\s*\([^)]*listo/) },
        { d:'Escribe Fin', f:c => tiene(c, /lcd\.print\s*\([^)]*fin/) },
        { d:'Incluye setup() y loop()', f:c => setup(c) && loop(c) }
      ]
    },
    {
      id:'ard-lcd3', modulo:'lcd', titulo:'3.3 · Mostrar una lectura', nivel:'Medio',
      consigna:'Leé el potenciómetro de <code>A0</code> y mostralo en la LCD: en la fila 0 escribí <code>"Valor:"</code> y en la fila 1 el número leído con <code>lcd.print(valor)</code>. Actualizá cada 300 ms.',
      placeholder:'void setup() {\n  ...\n}\n\nvoid loop() {\n  ...\n}',
      requisitos:[
        { d:'Inicia lcd.begin(16, 2)', f:c => tiene(c, /lcd\.begin\s*\(\s*16\s*,\s*2\s*\)/) },
        { d:'Lee analogRead(A0)', f:c => tiene(c, /analogread\s*\(\s*a0\s*\)/) },
        { d:'Guarda la lectura en valor', f:c => tiene(c, /\bint\s+valor\s*=\s*analogread\s*\(/) },
        { d:'Usa lcd.setCursor(...) para cambiar de fila', f:c => tiene(c, /lcd\.setcursor\s*\(/) },
        { d:'Imprime la variable con lcd.print(valor)', f:c => tiene(c, /lcd\.print\s*\(\s*valor\s*\)/) },
        { d:'Usa delay(300)', f:c => tiene(c, /delay\s*\(\s*300\s*\)/) }
      ]
    },

    /* ---------------------- MATRIZ ---------------------- */
    {
      id:'ard-mat1', modulo:'matriz', titulo:'4.1 · Un punto en la matriz', nivel:'Fácil',
      consigna:'En <code>setup()</code> limpiá la matriz con <code>matriz.clear()</code>. En <code>loop()</code> encendé el punto de la columna 3, fila 4 con <code>matriz.setPoint(3, 4, 1)</code> y dejá un <code>delay(500)</code>.',
      placeholder:'void setup() {\n  ...\n}\n\nvoid loop() {\n  ...\n}',
      requisitos:[
        { d:'Limpia con matriz.clear()', f:c => tiene(c, /matriz\.clear\s*\(\s*\)/) },
        { d:'Enciende matriz.setPoint(3, 4, 1)', f:c => tiene(c, /matriz\.setpoint\s*\(\s*3\s*,\s*4\s*,\s*1\s*\)/) },
        { d:'Usa delay(500)', f:c => tiene(c, /delay\s*\(\s*500\s*\)/) },
        { d:'Incluye setup() y loop()', f:c => setup(c) && loop(c) }
      ]
    },
    {
      id:'ard-mat2', modulo:'matriz', titulo:'4.2 · Dibujar una figura', nivel:'Medio',
      consigna:'Limpiá la matriz y dibujá una cruz: encendé los puntos <code>(3, 1)</code>, <code>(4, 1)</code>, <code>(3, 2)</code>, <code>(4, 2)</code>, <code>(3, 3)</code> y <code>(4, 3)</code> con <code>matriz.setPoint()</code>. Usá al menos seis llamadas a <code>setPoint</code>.',
      placeholder:'void setup() {\n  ...\n}\n\nvoid loop() {\n  ...\n}',
      requisitos:[
        { d:'Limpia con matriz.clear()', f:c => tiene(c, /matriz\.clear\s*\(\s*\)/) },
        { d:'Usa al menos seis matriz.setPoint()', f:c => (c.t.match(/matriz\.setpoint\s*\(/g) || []).length >= 6 },
        { d:'Incluye el punto (3, 1)', f:c => tiene(c, /matriz\.setpoint\s*\(\s*3\s*,\s*1\s*,/) },
        { d:'Incluye el punto (4, 3)', f:c => tiene(c, /matriz\.setpoint\s*\(\s*4\s*,\s*3\s*,/) },
        { d:'Enciende con el tercer argumento 1', f:c => tiene(c, /matriz\.setpoint\s*\([^)]*,\s*1\s*\)/) },
        { d:'Incluye setup() y loop()', f:c => setup(c) && loop(c) }
      ]
    },
    {
      id:'ard-mat3', modulo:'matriz', titulo:'4.3 · Animación con for', nivel:'Difícil',
      consigna:'Hacé recorrer un punto de izquierda a derecha. Usá un <code>for</code> con <code>int x = 0; x &lt; 8; x = x + 1</code>. Dentro, limpiá la matriz, encendé <code>matriz.setPoint(x, 3, 1)</code> y esperá 100 ms. Al terminar el <code>for</code>, limpiá otra vez.',
      placeholder:'void setup() {\n  ...\n}\n\nvoid loop() {\n  for (...) {\n    ...\n  }\n}',
      requisitos:[
        { d:'Usa un bucle for', f:c => tiene(c, /\bfor\s*\(/) },
        { d:'Inicia x en 0', f:c => tiene(c, /int\s+x\s*=\s*0\s*;/) },
        { d:'La condición es x < 8', f:c => tiene(c, /x\s*<\s*8\s*;/) },
        { d:'Actualiza x con x = x + 1', f:c => tiene(c, /x\s*=\s*x\s*\+\s*1\s*\)/) },
        { d:'Enciende matriz.setPoint(x, 3, 1)', f:c => tiene(c, /matriz\.setpoint\s*\(\s*x\s*,\s*3\s*,\s*1\s*\)/) },
        { d:'Usa delay(100) dentro del for', f:c => tiene(c, /delay\s*\(\s*100\s*\)/) },
        { d:'Limpia la matriz al menos dos veces', f:c => (c.t.match(/matriz\.clear\s*\(\s*\)/g) || []).length >= 2 }
      ]
    },

    /* ---------------------- SENSORES ---------------------- */
    {
      id:'ard-sen1', modulo:'sensores', titulo:'5.1 · Sensor de luz LDR', nivel:'Fácil',
      consigna:'Leé el sensor de luz de <code>A1</code> con <code>analogRead(A1)</code>. Si la lectura es menor que 300, encendé el pin 13; si no, apagalo. Enviá el valor por serie con <code>Serial.println()</code>.',
      placeholder:'void setup() {\n  ...\n}\n\nvoid loop() {\n  ...\n}',
      requisitos:[
        { d:'Inicializa Serial.begin(9600)', f:c => tiene(c, /serial\.begin\s*\(\s*9600\s*\)/) },
        { d:'Lee analogRead(A1)', f:c => tiene(c, /analogread\s*\(\s*a1\s*\)/) },
        { d:'Compara con < 300', f:c => tiene(c, /<\s*300\b/) },
        { d:'Usa if y else', f:c => tiene(c, /\bif\s*\(/) && tiene(c, /\belse\b/) },
        { d:'Escribe digitalWrite(13, HIGH) y LOW', f:c => tiene(c, /digitalwrite\s*\(\s*13\s*,\s*high\s*\)/) && tiene(c, /digitalwrite\s*\(\s*13\s*,\s*low\s*\)/) },
        { d:'Configura el pin 13 como salida', f:c => tiene(c, /pinmode\s*\(\s*13\s*,\s*output\s*\)/) }
      ]
    },
    {
      id:'ard-sen2', modulo:'sensores', titulo:'5.2 · Temperatura con float', nivel:'Medio',
      consigna:'Tomá la lectura de <code>A2</code>, dividila por 10.0 y guardala en una variable <code>float temperatura</code>. Mostrala por serie con <code>Serial.print()</code> y, si supera 25 grados, encendé el pin 13. Usá <code>delay(1000)</code> entre lecturas.',
      placeholder:'void setup() {\n  ...\n}\n\nvoid loop() {\n  ...\n}',
      requisitos:[
        { d:'Usa una variable float', f:c => tiene(c, /\bfloat\s+\w+/) },
        { d:'Lee analogRead(A2)', f:c => tiene(c, /analogread\s*\(\s*a2\s*\)/) },
        { d:'Divide por 10.0', f:c => tiene(c, /\/\s*10\.0\b/) },
        { d:'Compara la temperatura con > 25', f:c => tiene(c, />\s*25\b/) },
        { d:'Muestra por Serial.print()', f:c => tiene(c, /serial\.print\s*\(/) },
        { d:'Usa delay(1000)', f:c => tiene(c, /delay\s*\(\s*1000\s*\)/) }
      ]
    },
    {
      id:'ard-sen3', modulo:'sensores', titulo:'5.3 · Promediar el ultrasónido', nivel:'Difícil',
      consigna:'Leé tres veces el sensor de distancia de <code>A3</code> dentro de un <code>for</code>, sumá las lecturas en una variable <code>suma</code> y calculá el promedio dividiendo por 3. Mostrá el promedio por serie y esperá 500 ms.',
      placeholder:'void setup() {\n  ...\n}\n\nvoid loop() {\n  ...\n}',
      requisitos:[
        { d:'Usa un bucle for con tres vueltas', f:c => tiene(c, /\bfor\s*\([^)]*<\s*3\s*;/) },
        { d:'Lee analogRead(A3)', f:c => tiene(c, /analogread\s*\(\s*a3\s*\)/) },
        { d:'Acumula en una variable suma', f:c => tiene(c, /\bsuma\s*=\s*suma\s*\+/) },
        { d:'Calcula promedio dividiendo por 3', f:c => tiene(c, /promedio\s*=\s*suma\s*\/\s*3/) },
        { d:'Muestra el promedio por serie', f:c => tiene(c, /serial\.println\s*\(\s*promedio\s*\)/) },
        { d:'Usa delay(500)', f:c => tiene(c, /delay\s*\(\s*500\s*\)/) }
      ]
    },

    /* ---------------------- ROBÓTICA ---------------------- */
    {
      id:'ard-rob1', modulo:'robotica', titulo:'6.1 · Mover un servo', nivel:'Fácil',
      consigna:'En <code>setup()</code> conectá el servo con <code>servo.attach(9)</code>. En <code>loop()</code> movelo a 0 grados, esperá 500 ms, movelo a 180 grados y esperá otros 500 ms.',
      placeholder:'void setup() {\n  ...\n}\n\nvoid loop() {\n  ...\n}',
      requisitos:[
        { d:'Usa servo.attach(9)', f:c => tiene(c, /servo\.attach\s*\(\s*9\s*\)/) },
        { d:'Mueve a servo.write(0)', f:c => tiene(c, /servo\.write\s*\(\s*0\s*\)/) },
        { d:'Mueve a servo.write(180)', f:c => tiene(c, /servo\.write\s*\(\s*180\s*\)/) },
        { d:'Usa delay(500) dos veces', f:c => (c.t.match(/delay\s*\(\s*500\s*\)/g) || []).length >= 2 },
        { d:'Incluye setup() y loop()', f:c => setup(c) && loop(c) }
      ]
    },
    {
      id:'ard-rob2', modulo:'robotica', titulo:'6.2 · Motor con driver', nivel:'Medio',
      consigna:'Configurá el pin 7 como salida para la dirección del motor. En <code>loop()</code> lo ponés en <code>HIGH</code> durante 2 segundos, lo pasás a <code>LOW</code> y esperás 1 segundo. Usá <code>motor.write(200)</code> para indicar la velocidad en el simulador.',
      placeholder:'void setup() {\n  ...\n}\n\nvoid loop() {\n  ...\n}',
      requisitos:[
        { d:'Configura pinMode(7, OUTPUT)', f:c => tiene(c, /pinmode\s*\(\s*7\s*,\s*output\s*\)/) },
        { d:'Usa digitalWrite(7, HIGH)', f:c => tiene(c, /digitalwrite\s*\(\s*7\s*,\s*high\s*\)/) },
        { d:'Usa digitalWrite(7, LOW)', f:c => tiene(c, /digitalwrite\s*\(\s*7\s*,\s*low\s*\)/) },
        { d:'Usa motor.write(200)', f:c => tiene(c, /motor\.write\s*\(\s*200\s*\)/) },
        { d:'Usa delay(2000) y delay(1000)', f:c => tiene(c, /delay\s*\(\s*2000\s*\)/) && tiene(c, /delay\s*\(\s*1000\s*\)/) },
        { d:'Incluye setup() y loop()', f:c => setup(c) && loop(c) }
      ]
    },
    {
      id:'ard-rob3', modulo:'robotica', titulo:'6.3 · Robot con dos estados', nivel:'Difícil',
      consigna:'Usá una variable <code>int estado = 0</code>. En <code>loop()</code> leyé el botón de <code>D2</code> con <code>INPUT_PULLUP</code>. Si está presionado (0) pasá al estado 1; si no, volvé al estado 0. Con <code>if (estado == 1)</code> mové el servo a 135 grados y con <code>else</code> a 45 grados.',
      placeholder:'void setup() {\n  ...\n}\n\nvoid loop() {\n  int estado = 0;\n  ...\n}',
      requisitos:[
        { d:'Declara int estado = 0', f:c => tiene(c, /\bint\s+estado\s*=\s*0\s*;/) },
        { d:'Configura pinMode(2, INPUT_PULLUP)', f:c => tiene(c, /pinmode\s*\(\s*2\s*,\s*input_pullup\s*\)/) },
        { d:'Usa servo.attach(9)', f:c => tiene(c, /servo\.attach\s*\(\s*9\s*\)/) },
        { d:'Lee digitalRead(2)', f:c => tiene(c, /digitalread\s*\(\s*2\s*\)/) },
        { d:'Compara estado == 1', f:c => tiene(c, /estado\s*==\s*1/) },
        { d:'Mueve a servo.write(135) y servo.write(45)', f:c => tiene(c, /servo\.write\s*\(\s*135\s*\)/) && tiene(c, /servo\.write\s*\(\s*45\s*\)/) }
      ]
    }
  ];

  const PREGUNTAS = [
    { titulo:'¿Cuántas veces se ejecuta setup()?',
      opciones:['Una vez, al arrancar el Arduino','Una vez por cada vuelta de loop()','Dos veces','Nunca'],
      correcta:0, explicacion:'setup() se ejecuta una sola vez al iniciar; loop() se repite indefinitely.' },
    { titulo:'¿Qué hace digitalWrite(13, HIGH)?',
      opciones:['Lee el pin 13','Pone el pin 13 en 5 V (enciende el LED)','Configura el pin como entrada','Espera un segundo'],
      correcta:1, explicacion:'HIGH es nivel alto: el pin entrega 5 V si está configurado como salida.' },
    { titulo:'¿Qué rango devuelve analogRead() en Arduino Uno?',
      opciones:['0 a 255','0 a 1023','0 a 180','-1 a 1'],
      correcta:1, explicacion:'El convertidor analógico-digital de 10 bits devuelve 1024 valores: 0 a 1023.' },
    { titulo:'¿Para qué sirve INPUT_PULLUP?',
      opciones:['Para aumentar el brillo de un LED','Para conectar un servo','Para activar una resistencia interna y leer un botón sin resistencia externa','Para hacer PWM'],
      correcta:2, explicacion:'Con INPUT_PULLUP el pin queda en HIGH y el botón lo lleva a LOW al presionarse.' },
    { titulo:'En lcd.setCursor(3, 1), ¿qué significa cada número?',
      opciones:['Fila 3, columna 1','Columna 3, fila 1','Ancho 3, alto 1','Tiempo 3, velocidad 1'],
      correcta:1, explicacion:'El primer argumento es la columna (0 a 15) y el segundo la fila (0 o 1).' },
    { titulo:'¿Cuánto espera delay(1000)?',
      opciones:['1 milisegundo','100 milisegundos','1 segundo','10 segundos'],
      correcta:2, explicacion:'delay() recibe milisegundos: 1000 ms equivalen a 1 segundo.' }
  ];

  function contexto(articulo){
    const caja = articulo.querySelector('textarea.respuesta');
    return { caja:caja, t:norm(caja ? caja.value : '') };
  }

  function resultadosArticulo(articulo){
    const datos = EJERCICIOS.find(function(e){ return e.id === articulo.dataset.id; });
    if (!datos) return [];
    const c = contexto(articulo);
    return datos.requisitos.map(function(r){ return { texto:r.d, ok:!!r.f(c) }; });
  }

  function mostrarResultado(articulo, resultados){
    const bien = resultados.filter(function(r){ return r.ok; }).length;
    const total = resultados.length;
    articulo.classList.toggle('correcto', bien === total);
    articulo.querySelector('.resultado').innerHTML =
      '<div class="resumen' + (bien === total ? '' : ' parcial') + '">' +
      (bien === total ? '✅ ' : '✍️ ') + bien + ' de ' + total + ' requisitos cumplidos</div><ul>' +
      resultados.map(function(r){
        return '<li class="' + (r.ok ? 'si' : 'no') + '">' + (r.ok ? '✅' : '❌') + ' ' + r.texto + '</li>';
      }).join('') + '</ul>';
    return { bien:bien, total:total };
  }

  function renderEjercicios(){
    EJERCICIOS.forEach(function(e){
      const destino = document.getElementById('ej-' + e.modulo);
      if (!destino) return;
      const articulo = document.createElement('article');
      articulo.className = 'ejercicio';
      articulo.dataset.id = e.id;
      articulo.innerHTML =
        '<h3>' + e.titulo + ' <span class="nivel">' + e.nivel + '</span></h3>' +
        '<p class="consigna">' + e.consigna + '</p>' +
        '<textarea class="respuesta" spellcheck="false" data-placeholder="' + e.placeholder + '"></textarea>' +
        '<div class="acciones">' +
          '<button type="button" class="accion primaria corregir">✅ Corregir</button>' +
          '<button type="button" class="accion secundaria limpiar">Limpiar</button>' +
        '</div><div class="resultado" role="status" aria-live="polite"></div>';
      destino.appendChild(articulo);
    });
  }

  function renderQuiz(){
    const caja = document.getElementById('quiz-arduino');
    if (!caja) return;
    caja.innerHTML = PREGUNTAS.map(function(p, i){
      return '<div class="quiz-pregunta" data-indice="' + i + '">' +
        '<p><strong>' + (i + 1) + '.</strong> ' + p.titulo + '</p>' +
        p.opciones.map(function(op, j){
          return '<label><input type="radio" name="ard-q' + i + '" value="' + j + '"> ' + op + '</label>';
        }).join('') +
        '<div class="quiz-feedback"></div></div>';
    }).join('');
  }

  function corregirQuiz(mostrar){
    let bien = 0;
    PREGUNTAS.forEach(function(p, i){
      const elegida = document.querySelector('input[name="ard-q' + i + '"]:checked');
      const ok = !!elegida && Number(elegida.value) === p.correcta;
      if (ok) bien++;
      if (mostrar){
        const fb = document.querySelector('[data-indice="' + i + '"] .quiz-feedback');
        if (fb){
          fb.className = 'feedback ' + (ok ? 'si' : 'mal');
          fb.textContent = ok ? '✔ Correcto. ' + p.explicacion
            : '✘ La correcta es: ' + p.opciones[p.correcta] + '. ' + p.explicacion;
        }
      }
    });
    return { bien:bien, total:PREGUNTAS.length };
  }

  function corregirTodo(){
    const detalle = [], fallos = [], respuestas = {};
    let puntos = 0, total = 0;
    EJERCICIOS.forEach(function(e){
      const articulo = document.querySelector('.ejercicio[data-id="' + e.id + '"]');
      if (!articulo) return;
      const r = resultadosArticulo(articulo);
      const resumen = mostrarResultado(articulo, r);
      const c = contexto(articulo);
      respuestas[e.id] = c.t;
      r.forEach(function(x){
        detalle.push(e.id.toUpperCase() + ' · ' + x.texto + ': ' + (x.ok ? 'OK' : 'FALTA'));
        if (!x.ok) fallos.push(e.id + ': ' + x.texto);
      });
      puntos += resumen.bien;
      total += resumen.total;
    });
    const quiz = corregirQuiz(false);
    PREGUNTAS.forEach(function(p, i){
      const elegida = document.querySelector('input[name="ard-q' + i + '"]:checked');
      respuestas['quiz-' + i] = elegida ? p.opciones[Number(elegida.value)] : 'Sin responder';
    });
    puntos += quiz.bien;
    total += quiz.total;
    return {
      nota:total ? Math.round(puntos / total * 100) / 10 : 0,
      puntos:puntos, total:total, fallos:fallos,
      detalle:detalle.join('\n'), respuestas:respuestas
    };
  }

  function bloquearTodo(estado){
    document.querySelectorAll('#ejercicios button, #ejercicios textarea').forEach(function(el){ el.disabled = true; });
    document.querySelectorAll('#quiz-arduino input').forEach(function(el){ el.disabled = true; });
    document.querySelectorAll('#form-entrega-ejercicios input, #form-entrega-ejercicios button').forEach(function(el){ el.disabled = true; });
    if (estado) estado.textContent = '✅ Ejercitación enviada. Ya no se puede modificar.';
  }

  function configurarEntrega(){
    const form = document.getElementById('form-entrega-ejercicios');
    if (!form) return;
    const estado = document.getElementById('estado-entrega-ejercicios');
    const clave = 'arduino-portada-enviada-v1';
    try {
      if (localStorage.getItem(clave)){ bloquearTodo(estado); return; }
    } catch (e) {}
    form.addEventListener('submit', function(e){
      e.preventDefault();
      const nombre = form.elements.nombre.value.trim();
      const apellido = form.elements.apellido.value.trim();
      const curso = form.elements.curso.value.trim();
      if (!nombre || !apellido || !curso){
        estado.className = 'estado-eval error';
        estado.textContent = '❌ Completá nombre, apellido y curso.';
        return;
      }
      estado.className = 'estado-eval';
      estado.textContent = 'Corrigiendo y enviando…';
      const c = corregirTodo();
      const payload = {
        examen:'arduino-portada',
        titulo:'Ejercitación Arduino · Robótica',
        materia:window.ENTREGA_MATERIA || 'Arduino · Robótica',
        nombre:nombre, apellido:apellido, curso:curso,
        nota:c.nota, puntos:c.puntos, total:c.total,
        errores:c.fallos.join(' · ').slice(0,300) || 'Sin errores',
        detalle:c.detalle.slice(0,20000),
        respuestas:c.respuestas,
        momento:new Date().toISOString(),
        origen:location.href
      };
      window.enviarEntrega(payload).then(function(){
        try { localStorage.setItem(clave, new Date().toISOString()); } catch (e) {}
        bloquearTodo(estado);
        estado.className = 'estado-eval ok';
        estado.textContent = '✅ Enviado. Nota: ' + String(c.nota).replace('.', ',') + ' de 10. Se guardó en inform.';
      }).catch(function(error){
        estado.className = 'estado-eval error';
        estado.textContent = '❌ No se pudo enviar: ' + error.message;
      });
    });
  }

  renderEjercicios();
  renderQuiz();

  document.addEventListener('click', function(e){
    const corregir = e.target.closest('.ejercicio .corregir');
    if (corregir){
      const articulo = corregir.closest('.ejercicio');
      mostrarResultado(articulo, resultadosArticulo(articulo));
      return;
    }
    const limpiar = e.target.closest('.ejercicio .limpiar');
    if (limpiar){
      const articulo = limpiar.closest('.ejercicio');
      articulo.querySelector('textarea').value = '';
      articulo.querySelector('.resultado').innerHTML = '';
      articulo.classList.remove('correcto');
    }
  });

  const botonQuiz = document.getElementById('sim-corregir-quiz');
  if (botonQuiz) botonQuiz.addEventListener('click', function(){
    const r = corregirQuiz(true);
    document.getElementById('res-quiz').innerHTML =
      '<div class="resumen">' + r.bien + ' de ' + r.total + ' correctas</div>';
  });
  const limpiarQuiz = document.getElementById('sim-limpiar-quiz');
  if (limpiarQuiz) limpiarQuiz.addEventListener('click', function(){
    document.querySelectorAll('#quiz-arduino input').forEach(function(i){ i.checked = false; });
    document.querySelectorAll('#quiz-arduino .quiz-feedback').forEach(function(f){ f.textContent = ''; f.className = 'quiz-feedback'; });
    document.getElementById('res-quiz').innerHTML = '';
  });

  configurarEntrega();
})();
