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
      id:'ard-dig1', modulo:'digital', titulo:'1.1 · Encender y apagar el LED integrado', nivel:'Fácil', imagen:'led.svg', alt:'LED en D13 con resistencia de 220 Ω y cátodo a GND', electronica:'Ánodo del LED a D13 con resistencia de 220 Ω; cátodo a GND.', tink:true,
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
      id:'ard-dig2', modulo:'digital', titulo:'1.2 · Botón con INPUT_PULLUP', nivel:'Medio', imagen:'boton.svg', alt:'Botón entre D2 y GND con INPUT_PULLUP y LED en D13', electronica:'Botón entre D2 y GND con INPUT_PULLUP; LED en D13 con 220 Ω.', tink:true,
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
      id:'ard-dig3', modulo:'digital', titulo:'1.3 · Semáforo con tres LEDs', nivel:'Medio', imagen:'semaforo.svg', alt:'Tres LEDs en D8, D9 y D10 con resistencias de 220 Ω', electronica:'Cada LED con su resistencia de 220 Ω en D8, D9 y D10; cátodos a GND.', tink:true,
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
      id:'ard-ana1', modulo:'analogico', titulo:'2.1 · Leer un potenciómetro', nivel:'Fácil', imagen:'potenciometro.svg', alt:'Potenciómetro con extremos a 5 V y GND y wiper a A0', electronica:'Extremos del potenciómetro a 5 V y GND; wiper a A0.', tink:true,
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
      id:'ard-ana2', modulo:'analogico', titulo:'2.2 · PWM con map()', nivel:'Medio', imagen:'pwm.svg', alt:'Potenciómetro en A0 y LED con resistencia en D9', electronica:'Wiper del potenciómetro en A0; LED con resistencia de 220 Ω en D9.', tink:true,
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
      id:'ard-ana3', modulo:'analogico', titulo:'2.3 · Umbral con if / else', nivel:'Medio', imagen:'umbral.svg', alt:'Potenciómetro en A0 y LED indicador en D13', electronica:'Wiper en A0; LED con resistencia de 220 Ω en D13.', tink:true,
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
      id:'ard-lcd1', modulo:'lcd', titulo:'3.1 · Primer mensaje en el LCD', nivel:'Fácil', imagen:'lcd.svg', alt:'LCD 16x2 conectada a D12, D11, D5, D4, D3 y D2', electronica:'RS 12, E 11, D4–D7 en 5, 4, 3, 2; VO al potenciómetro de contraste.', tink:true,
      consigna:'En <code>setup()</code> iniciá la pantalla con <code>lcd.begin(16, 2)</code> y mostrá el texto <code>"Hola Arduino"</code> con <code>lcd.print()</code>. En <code>loop()</code> dejá solo un <code>delay()</code>: el mensaje debe quedarse fijo.',
      placeholder:'void setup() {\n  ...\n}\n\nvoid loop() {\n  ...\n}',
      requisitos:[
        { d:'Incluye LiquidCrystal.h y declara lcd(12, 11, 5, 4, 3, 2)', f:c => tiene(c, /#include\s*[<\"]liquidcrystal\.h[>\"]/) && tiene(c, /liquidcrystal\s+lcd\s*\(\s*12\s*,\s*11\s*,\s*5\s*,\s*4\s*,\s*3\s*,\s*2\s*\)/) },
        { d:'Incluye setup() y loop()', f:c => setup(c) && loop(c) },
        { d:'Inicia lcd.begin(16, 2)', f:c => tiene(c, /lcd\.begin\s*\(\s*16\s*,\s*2\s*\)/) },
        { d:'Muestra texto con lcd.print()', f:c => tiene(c, /lcd\.print\s*\([^)]*["'][^"']+["']/) },
        { d:'Escribe Hola Arduino', f:c => tiene(c, /hola\s+arduino/) },
        { d:'Usa delay() en loop()', f:c => tiene(c, /delay\s*\(/) }
      ]
    },
    {
      id:'ard-lcd2', modulo:'lcd', titulo:'3.2 · Cursor y limpieza', nivel:'Medio', imagen:'lcd.svg', alt:'LCD 16x2 conectada a D12, D11, D5, D4, D3 y D2', electronica:'RS 12, E 11, D4–D7 en 5, 4, 3, 2; VO al potenciómetro de contraste.', tink:true,
      consigna:'Mostrá <code>"Listo"</code> en la fila 0, columna 0. Después limpiá la pantalla con <code>lcd.clear()</code>, mové el cursor a la fila 1, columna 3 con <code>lcd.setCursor(3, 1)</code> y escribí <code>"Fin"</code>. Recordá que <code>setCursor</code> recibe primero la columna y después la fila.',
      placeholder:'void setup() {\n  ...\n}\n\nvoid loop() {\n  ...\n}',
      requisitos:[
        { d:'Incluye LiquidCrystal.h y declara lcd(12, 11, 5, 4, 3, 2)', f:c => tiene(c, /#include\s*[<\"]liquidcrystal\.h[>\"]/) && tiene(c, /liquidcrystal\s+lcd\s*\(\s*12\s*,\s*11\s*,\s*5\s*,\s*4\s*,\s*3\s*,\s*2\s*\)/) },
        { d:'Inicia lcd.begin(16, 2)', f:c => tiene(c, /lcd\.begin\s*\(\s*16\s*,\s*2\s*\)/) },
        { d:'Limpia con lcd.clear()', f:c => tiene(c, /lcd\.clear\s*\(\s*\)/) },
        { d:'Mueve el cursor con lcd.setCursor(3, 1)', f:c => tiene(c, /lcd\.setcursor\s*\(\s*3\s*,\s*1\s*\)/) },
        { d:'Escribe Listo', f:c => tiene(c, /lcd\.print\s*\([^)]*listo/) },
        { d:'Escribe Fin', f:c => tiene(c, /lcd\.print\s*\([^)]*fin/) },
        { d:'Incluye setup() y loop()', f:c => setup(c) && loop(c) }
      ]
    },
    {
      id:'ard-lcd3', modulo:'lcd', titulo:'3.3 · Mostrar una lectura', nivel:'Medio', imagen:'lcd.svg', alt:'LCD 16x2 y potenciómetro en A0', electronica:'LCD en modo paralelo como en las actividades anteriores; segundo potenciómetro en A0.', tink:true,
      consigna:'Leé el potenciómetro de <code>A0</code> y mostralo en la LCD: en la fila 0 escribí <code>"Valor:"</code> y en la fila 1 el número leído con <code>lcd.print(valor)</code>. Actualizá cada 300 ms.',
      placeholder:'void setup() {\n  ...\n}\n\nvoid loop() {\n  ...\n}',
      requisitos:[
        { d:'Incluye LiquidCrystal.h y declara lcd(12, 11, 5, 4, 3, 2)', f:c => tiene(c, /#include\s*[<\"]liquidcrystal\.h[>\"]/) && tiene(c, /liquidcrystal\s+lcd\s*\(\s*12\s*,\s*11\s*,\s*5\s*,\s*4\s*,\s*3\s*,\s*2\s*\)/) },
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
      id:'ard-mat1', modulo:'matriz', titulo:'4.1 · Un punto en la matriz', nivel:'Fácil', imagen:'matriz.svg', alt:'Matriz 8x8 con MAX7219: DIN 11, CS 10, CLK 13', electronica:'DIN en D11, CS en D10, CLK en D13, más 5 V y GND.', tink:false, alternativa:'En Tinkercad podés reemplazarla por 8 LEDs con un 74HC595.',
      consigna:'Incluí <code>LedControl.h</code> y declará <code>LedControl matriz = LedControl(11, 13, 10, 1);</code>. En <code>setup()</code> despertá el módulo con <code>matriz.shutdown(0, false)</code>, ajustá el brillo y limpiá con <code>matriz.clearDisplay(0)</code>. En <code>loop()</code> encendé la fila 4, columna 3 con <code>matriz.setLed(0, 4, 3, true)</code> y esperá <code>delay(500)</code>.',
      placeholder:'void setup() {\n  ...\n}\n\nvoid loop() {\n  ...\n}',
      requisitos:[
        { d:'Incluye LedControl.h', f:c => tiene(c, /#include\s*[<"]ledcontrol\.h[>"]/) },
        { d:'Declara LedControl matriz = LedControl(11, 13, 10, 1)', f:c => tiene(c, /ledcontrol\s+matriz\s*=\s*ledcontrol\s*\(\s*11\s*,\s*13\s*,\s*10\s*,\s*1\s*\)/) },
        { d:'Despierta y limpia el módulo en setup()', f:c => tiene(c, /matriz\.shutdown\s*\(\s*0\s*,\s*false\s*\)/) && tiene(c, /matriz\.cleardisplay\s*\(\s*0\s*\)/) },
        { d:'Enciende matriz.setLed(0, 4, 3, true)', f:c => tiene(c, /matriz\.setled\s*\(\s*0\s*,\s*4\s*,\s*3\s*,\s*true\s*\)/) },
        { d:'Usa delay(500)', f:c => tiene(c, /delay\s*\(\s*500\s*\)/) },
        { d:'Incluye setup() y loop()', f:c => setup(c) && loop(c) }
      ]
    },
    {
      id:'ard-mat2', modulo:'matriz', titulo:'4.2 · Dibujar una figura', nivel:'Medio', imagen:'matriz.svg', alt:'Matriz 8x8 con MAX7219: DIN 11, CS 10, CLK 13', electronica:'DIN en D11, CS en D10, CLK en D13, más 5 V y GND.', tink:false, alternativa:'En Tinkercad podés reemplazarla por 8 LEDs con un 74HC595.',
      consigna:'Usando <code>LedControl</code>, limpiá la matriz y dibujá una cruz: encendé las posiciones <code>(fila 1, columna 3)</code>, <code>(1, 4)</code>, <code>(2, 3)</code>, <code>(2, 4)</code>, <code>(3, 3)</code> y <code>(3, 4)</code> con <code>matriz.setLed(0, fila, columna, true)</code>. Usá al menos seis llamadas a <code>setLed</code>.',
      placeholder:'void setup() {\n  ...\n}\n\nvoid loop() {\n  ...\n}',
      requisitos:[
        { d:'Incluye LedControl.h y declara el objeto matriz', f:c => tiene(c, /#include\s*[<"]ledcontrol\.h[>"]/) && tiene(c, /ledcontrol\s+matriz\s*=\s*ledcontrol\s*\(/) },
        { d:'Limpia con matriz.clearDisplay(0)', f:c => tiene(c, /matriz\.cleardisplay\s*\(\s*0\s*\)/) },
        { d:'Usa al menos seis matriz.setLed()', f:c => (c.t.match(/matriz\.setled\s*\(/g) || []).length >= 6 },
        { d:'Incluye la posición (1, 3)', f:c => tiene(c, /matriz\.setled\s*\(\s*0\s*,\s*1\s*,\s*3\s*,/) },
        { d:'Incluye la posición (3, 4)', f:c => tiene(c, /matriz\.setled\s*\(\s*0\s*,\s*3\s*,\s*4\s*,/) },
        { d:'Enciende con true como cuarto argumento', f:c => tiene(c, /matriz\.setled\s*\([^)]*,\s*true\s*\)/) },
        { d:'Incluye setup() y loop()', f:c => setup(c) && loop(c) }
      ]
    },
    {
      id:'ard-mat3', modulo:'matriz', titulo:'4.3 · Animación con for', nivel:'Difícil', imagen:'matriz.svg', alt:'Matriz 8x8 con MAX7219: DIN 11, CS 10, CLK 13', electronica:'DIN en D11, CS en D10, CLK en D13, más 5 V y GND.', tink:false, alternativa:'En Tinkercad podés reemplazarla por 8 LEDs con un 74HC595.',
      consigna:'Con <code>LedControl</code>, hacé recorrer un punto de izquierda a derecha. Usá un <code>for</code> con <code>int x = 0; x &lt; 8; x = x + 1</code>. Dentro, limpiá la matriz, encendé <code>matriz.setLed(0, 3, x, true)</code>, esperá 100 ms y apagalo con <code>false</code>. Al terminar, limpiá otra vez.',
      placeholder:'void setup() {\n  ...\n}\n\nvoid loop() {\n  for (...) {\n    ...\n  }\n}',
      requisitos:[
        { d:'Incluye LedControl.h y declara el objeto matriz', f:c => tiene(c, /#include\s*[<"]ledcontrol\.h[>"]/) && tiene(c, /ledcontrol\s+matriz\s*=\s*ledcontrol\s*\(/) },
        { d:'Usa un bucle for con x < 8', f:c => tiene(c, /\bfor\s*\([^)]*x\s*<\s*8\s*;/) },
        { d:'Inicia x en 0 y actualiza con x = x + 1', f:c => tiene(c, /int\s+x\s*=\s*0\s*;/) && tiene(c, /x\s*=\s*x\s*\+\s*1\s*\)/) },
        { d:'Enciende con matriz.setLed(0, 3, x, true)', f:c => tiene(c, /matriz\.setled\s*\(\s*0\s*,\s*3\s*,\s*x\s*,\s*true\s*\)/) },
        { d:'Apaga con false', f:c => tiene(c, /matriz\.setled\s*\([^)]*false\s*\)/) },
        { d:'Usa delay(100)', f:c => tiene(c, /delay\s*\(\s*100\s*\)/) },
        { d:'Limpia con clearDisplay(0) al menos dos veces', f:c => (c.t.match(/matriz\.cleardisplay\s*\(\s*0\s*\)/g) || []).length >= 2 }
      ]
    },

    /* ---------------------- SENSORES ---------------------- */
    {
      id:'ard-sen1', modulo:'sensores', titulo:'5.1 · Sensor de luz LDR', nivel:'Fácil', imagen:'ldr.svg', alt:'LDR y resistencia de 10 kΩ en A1 con LED en D13', electronica:'5 V → LDR → A1 → resistencia de 10 kΩ → GND; LED indicador en D13.', tink:true,
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
      id:'ard-sen2', modulo:'sensores', titulo:'5.2 · Temperatura con float', nivel:'Medio', imagen:'dht.svg', alt:'DHT11 con DATA en D2 y resistencia pull-up de 4,7 kΩ', electronica:'VCC a 5 V, GND y DATA en D2 con resistencia pull-up de 4,7 kΩ.', tink:false, alternativa:'En Tinkercad usá un TMP36 en A2 y la fórmula (lectura * 5.0 / 1023 - 0.5) * 100.',
      consigna:'Incluí <code>DHT.h</code> y declará <code>DHT dht(2, DHT11);</code>. En <code>setup()</code> iniciá el puerto serie y llamá a <code>dht.begin()</code>. En <code>loop()</code> guardá <code>float temperatura = dht.readTemperature()</code>, mostrala por serie con <code>Serial.print()</code> y, si supera 25 grados, encendé el pin 13. Usá <code>delay(1000)</code> entre lecturas. En Tinkercad reemplazá el DHT11 por un TMP36 en A2 y aplicá la fórmula de la nota.',
      placeholder:'void setup() {\n  ...\n}\n\nvoid loop() {\n  ...\n}',
      requisitos:[
        { d:'Incluye DHT.h y declara DHT dht(2, DHT11)', f:c => tiene(c, /#include\s*[<"]dht\.h[>"]/) && tiene(c, /dht\s+dht\s*\(\s*2\s*,\s*dht11\s*\)/) },
        { d:'Inicia Serial y dht.begin()', f:c => tiene(c, /serial\.begin\s*\(\s*9600\s*\)/) && tiene(c, /dht\.begin\s*\(\s*\)/) },
        { d:'Usa float temperatura = dht.readTemperature()', f:c => tiene(c, /float\s+temperatura\s*=\s*dht\.readtemperature\s*\(\s*\)/) },
        { d:'Compara la temperatura con > 25', f:c => tiene(c, />\s*25\b/) },
        { d:'Muestra por Serial.print()', f:c => tiene(c, /serial\.print\s*\(/) },
        { d:'Configura el pin 13 como salida', f:c => tiene(c, /pinmode\s*\(\s*13\s*,\s*output\s*\)/) },
        { d:'Enciende y apaga con digitalWrite(13, ...)', f:c => tiene(c, /digitalwrite\s*\(\s*13\s*,\s*high\s*\)/) && tiene(c, /digitalwrite\s*\(\s*13\s*,\s*low\s*\)/) },
        { d:'Usa delay(1000)', f:c => tiene(c, /delay\s*\(\s*1000\s*\)/) }
      ]
    },
    {
      id:'ard-sen3', modulo:'sensores', titulo:'5.3 · Promediar el ultrasónido', nivel:'Difícil', imagen:'ultrasonido.svg', alt:'HC-SR04 con TRIG en D9 y ECHO en D10', electronica:'VCC a 5 V, GND, TRIG en D9 y ECHO en D10 (con divisor de voltaje en hardware real).', tink:true,
      consigna:'Usá el HC-SR04 con <code>TRIG</code> en D9 y <code>ECHO</code> en D10. En <code>setup()</code> configurá D9 como salida y D10 como entrada. En <code>loop()</code>, repetí tres veces con un <code>for</code>: enviá un pulso de 10 µs con <code>digitalWrite()</code> y <code>delayMicroseconds()</code>, medí con <code>pulseIn(10, HIGH)</code> y convertí con <code>duracion * 0.0343 / 2</code>. Sumá las tres distancias en <code>suma</code>, calculá <code>promedio = suma / 3</code>, mostralo por serie y esperá 500 ms.',
      placeholder:'void setup() {\n  ...\n}\n\nvoid loop() {\n  ...\n}',
      requisitos:[
        { d:'Configura D9 como salida y D10 como entrada', f:c => tiene(c, /pinmode\s*\(\s*9\s*,\s*output\s*\)/) && tiene(c, /pinmode\s*\(\s*10\s*,\s*input\s*\)/) },
        { d:'Envía el pulso con digitalWrite(9, ...) y delayMicroseconds()', f:c => tiene(c, /digitalwrite\s*\(\s*9\s*,\s*high\s*\)/) && tiene(c, /delaymicroseconds\s*\(\s*10\s*\)/) },
        { d:'Mide con pulseIn(10, HIGH)', f:c => tiene(c, /pulsein\s*\(\s*10\s*,\s*high\s*\)/) },
        { d:'Convierte con 0.0343 / 2', f:c => tiene(c, /0\.0343\s*\/\s*2/) },
        { d:'Usa un for de tres vueltas', f:c => tiene(c, /\bfor\s*\([^)]*<\s*3\s*;/) },
        { d:'Acumula en suma y calcula promedio / 3', f:c => tiene(c, /\bsuma\s*=\s*suma\s*\+/) && tiene(c, /promedio\s*=\s*suma\s*\/\s*3/) },
        { d:'Muestra el promedio por serie', f:c => tiene(c, /serial\.println\s*\(\s*promedio\s*\)/) },
        { d:'Usa delay(500)', f:c => tiene(c, /delay\s*\(\s*500\s*\)/) }
      ]
    },

    /* ---------------------- ROBÓTICA ---------------------- */
    {
      id:'ard-rob1', modulo:'robotica', titulo:'6.1 · Mover un servo', nivel:'Fácil', imagen:'servo.svg', alt:'Servo SG90 con señal en D9, 5 V y GND', electronica:'Señal en D9, 5 V y GND común con la Arduino.', tink:true,
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
      id:'ard-rob2', modulo:'robotica', titulo:'6.2 · Motor con driver', nivel:'Medio', imagen:'motor.svg', alt:'Motor DC con driver L293D: IN1 7, IN2 8, ENABLE 9', electronica:'IN1 en D7, IN2 en D8, ENABLE en D9 con PWM; motor alimentado por fuente externa y GND común.', tink:true,
      consigna:'Con el driver L293D configurá D7 y D8 como salidas de dirección y D9 como salida PWM. En <code>loop()</code> poné IN1 en <code>HIGH</code> e IN2 en <code>LOW</code>, aplicá <code>analogWrite(9, 200)</code> durante 2 segundos, después apagá el PWM con <code>analogWrite(9, 0)</code> y esperá 1 segundo.',
      placeholder:'void setup() {\n  ...\n}\n\nvoid loop() {\n  ...\n}',
      requisitos:[
        { d:'Configura los pines 7, 8 y 9 como OUTPUT', f:c => [7,8,9].every(p => tiene(c, new RegExp('pinmode\\s*\\(\\s*' + p + '\\s*,\\s*output\\s*\\)'))) },
        { d:'Usa digitalWrite(7, HIGH) y digitalWrite(8, LOW)', f:c => tiene(c, /digitalwrite\s*\(\s*7\s*,\s*high\s*\)/) && tiene(c, /digitalwrite\s*\(\s*8\s*,\s*low\s*\)/) },
        { d:'Aplica analogWrite(9, 200)', f:c => tiene(c, /analogwrite\s*\(\s*9\s*,\s*200\s*\)/) },
        { d:'Apaga con analogWrite(9, 0)', f:c => tiene(c, /analogwrite\s*\(\s*9\s*,\s*0\s*\)/) },
        { d:'Usa delay(2000) y delay(1000)', f:c => tiene(c, /delay\s*\(\s*2000\s*\)/) && tiene(c, /delay\s*\(\s*1000\s*\)/) },
        { d:'Incluye setup() y loop()', f:c => setup(c) && loop(c) }
      ]
    },
    {
      id:'ard-rob3', modulo:'robotica', titulo:'6.3 · Robot con dos estados', nivel:'Difícil', imagen:'robot.svg', alt:'Botón en D2 con INPUT_PULLUP y servo en D9', electronica:'Botón entre D2 y GND con INPUT_PULLUP; servo con señal en D9, 5 V y GND común.', tink:true,
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
      const figura = e.imagen
        ? '<figure class="figura-circuito">' +
            '<img src="diagramas/' + e.imagen + '" alt="' + e.alt + '">' +
            '<figcaption><strong>Conexión electrónica:</strong> ' + e.electronica + '</figcaption>' +
          '</figure>'
        : '';
      const notaTink = e.tink
        ? '<p class="nota"><strong>Tinkercad:</strong> esta actividad se puede armar y simular allí. ' +
          '<a href="tinkercad.html#si">Ver componentes y conexión ↗</a></p>'
        : '<p class="nota"><strong>Tinkercad:</strong> este componente no está disponible allí. ' +
          '<a href="tinkercad.html#no">Ver conexión real y programa ↗</a>' +
          (e.alternativa ? ' ' + e.alternativa : '') + '</p>';
      articulo.innerHTML =
        '<h3>' + e.titulo + ' <span class="nivel">' + e.nivel + '</span></h3>' +
        '<p class="consigna">' + e.consigna + '</p>' +
        figura + notaTink +
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
