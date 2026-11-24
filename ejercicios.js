/* ============================================================
   ejercicios.js · actividades de Arduino para armar en Tinkercad
   ============================================================ */
(function(){
  'use strict';


  const EJERCICIOS = [
    /* ---------------------- DIGITAL ---------------------- */
    {
      id:'ard-dig1', modulo:'digital', titulo:'1.1 · Encender y apagar el LED integrado', nivel:'Fácil', imagen:'imagenes/led-breadboard.jpg', alt:'Arduino y protoboard con un LED encendido', electronica:'Ánodo del LED a D13 con resistencia de 220 Ω; cátodo a GND.', tink:true,
      consigna:'Escribí un sketch con <code>setup()</code> y <code>loop()</code>. En <code>setup()</code> configurá el pin 13 como salida. En <code>loop()</code> encendé el LED con <code>digitalWrite(13, HIGH)</code>, esperá 500 ms con <code>delay(500)</code>, apagalo con <code>digitalWrite(13, LOW)</code> y esperá otros 500 ms.',
    },
    {
      id:'ard-dig2', modulo:'digital', titulo:'1.2 · Botón con INPUT_PULLUP', nivel:'Medio', imagen:'imagenes/boton-breadboard.jpg', alt:'Manos armando un circuito con botón en protoboard', electronica:'Botón entre D2 y GND con INPUT_PULLUP; LED en D13 con 220 Ω.', tink:true,
      consigna:'Configurá el pin 2 con <code>INPUT_PULLUP</code> y el 13 como salida. En <code>loop()</code> leé el botón con <code>digitalRead(2)</code>. Con <code>if</code>, encendé el LED cuando el botón esté presionado (la lectura vale 0) y apagalo cuando esté suelto.',
    },
    {
      id:'ard-dig3', modulo:'digital', titulo:'1.3 · Semáforo con tres LEDs', nivel:'Medio', imagen:'imagenes/semaforo-leds.jpg', alt:'Arduino con varios LEDs encendidos en protoboard', electronica:'Cada LED con su resistencia de 220 Ω en D8, D9 y D10; cátodos a GND.', tink:true,
      consigna:'Usá los pines 8, 9 y 10 como salidas. En <code>loop()</code> encendé un LED a la vez con <code>digitalWrite</code> y apagá los otros dos. Entre cada cambio poné un <code>delay(1000)</code>. La idea es que nunca queden dos encendidos al mismo tiempo.',
    },

    /* ---------------------- ANALÓGICO ---------------------- */
    {
      id:'ard-ana1', modulo:'analogico', titulo:'2.1 · Leer un potenciómetro', nivel:'Fácil', imagen:'imagenes/potenciometro-cables.jpg', alt:'Protoboard con cables y componentes analógicos', electronica:'Extremos del potenciómetro a 5 V y GND; wiper a A0.', tink:true,
      consigna:'Inicializá el puerto serie con <code>Serial.begin(9600)</code>. En <code>loop()</code> leé el potenciómetro de <code>A0</code> con <code>analogRead(A0)</code> y enviá el valor al monitor con <code>Serial.println()</code>. Recordá que la lectura va de 0 a 1023.',
    },
    {
      id:'ard-ana2', modulo:'analogico', titulo:'2.2 · PWM con map()', nivel:'Medio', imagen:'imagenes/pwm-led.jpg', alt:'Arduino conectado a un LED con brillo variable', electronica:'Wiper del potenciómetro en A0; LED con resistencia de 220 Ω en D9.', tink:true,
      consigna:'Leé <code>A0</code>, convertí el rango 0–1023 a 0–255 con <code>map()</code> y mandá el resultado al pin 9 con <code>analogWrite(9, brillo)</code>. Así el LED cambia de brillo en vez de solo encenderse o apagarse.',
    },
    {
      id:'ard-ana3', modulo:'analogico', titulo:'2.3 · Umbral con if / else', nivel:'Medio', imagen:'imagenes/umbral-cableado.jpg', alt:'Circuitos con cables de colores en protoboard', electronica:'Wiper en A0; LED con resistencia de 220 Ω en D13.', tink:true,
      consigna:'Leé <code>A0</code>. Si el valor es mayor que 512, encendé el pin 13; si no, apagalo. Usá <code>if</code> y <code>else</code>, y enviá por serie el valor leído para poder comprobar el umbral.',
    },

    /* ---------------------- LCD ---------------------- */
    {
      id:'ard-lcd1', modulo:'lcd', titulo:'3.1 · Primer mensaje en el LCD', nivel:'Fácil', imagen:'imagenes/lcd-display.jpg', alt:'Placa electrónica con pantalla y componentes', electronica:'RS 12, E 11, D4–D7 en 5, 4, 3, 2; VO al potenciómetro de contraste.', tink:true,
      consigna:'En <code>setup()</code> iniciá la pantalla con <code>lcd.begin(16, 2)</code> y mostrá el texto <code>"Hola Arduino"</code> con <code>lcd.print()</code>. En <code>loop()</code> dejá solo un <code>delay()</code>: el mensaje debe quedarse fijo.',
    },
    {
      id:'ard-lcd2', modulo:'lcd', titulo:'3.2 · Cursor y limpieza', nivel:'Medio', imagen:'imagenes/lcd-circuito.jpg', alt:'Circuito electrónico armado con display', electronica:'RS 12, E 11, D4–D7 en 5, 4, 3, 2; VO al potenciómetro de contraste.', tink:true,
      consigna:'Mostrá <code>"Listo"</code> en la fila 0, columna 0. Después limpiá la pantalla con <code>lcd.clear()</code>, mové el cursor a la fila 1, columna 3 con <code>lcd.setCursor(3, 1)</code> y escribí <code>"Fin"</code>. Recordá que <code>setCursor</code> recibe primero la columna y después la fila.',
    },
    {
      id:'ard-lcd3', modulo:'lcd', titulo:'3.3 · Mostrar una lectura', nivel:'Medio', imagen:'imagenes/lcd-componentes.jpg', alt:'Componentes electrónicos y circuito con pantalla', electronica:'LCD en modo paralelo como en las actividades anteriores; segundo potenciómetro en A0.', tink:true,
      consigna:'Leé el potenciómetro de <code>A0</code> y mostralo en la LCD: en la fila 0 escribí <code>"Valor:"</code> y en la fila 1 el número leído con <code>lcd.print(valor)</code>. Actualizá cada 300 ms.',
    },

    /* ---------------------- MATRIZ ---------------------- */
    {
      id:'ard-mat1', modulo:'matriz', titulo:'4.1 · Un punto en la matriz', nivel:'Fácil', imagen:'imagenes/matriz-leds.jpg', alt:'Conjunto de LEDs y cables en un circuito', electronica:'DIN en D11, CS en D10, CLK en D13, más 5 V y GND.', tink:false, alternativa:'En Tinkercad podés reemplazarla por 8 LEDs con un 74HC595.',
      consigna:'Incluí <code>LedControl.h</code> y declará <code>LedControl matriz = LedControl(11, 13, 10, 1);</code>. En <code>setup()</code> despertá el módulo con <code>matriz.shutdown(0, false)</code>, ajustá el brillo y limpiá con <code>matriz.clearDisplay(0)</code>. En <code>loop()</code> encendé la fila 4, columna 3 con <code>matriz.setLed(0, 4, 3, true)</code> y esperá <code>delay(500)</code>.',
    },
    {
      id:'ard-mat2', modulo:'matriz', titulo:'4.2 · Dibujar una figura', nivel:'Medio', imagen:'imagenes/matriz-cables.jpg', alt:'Cables de colores y LEDs en una placa de pruebas', electronica:'DIN en D11, CS en D10, CLK en D13, más 5 V y GND.', tink:false, alternativa:'En Tinkercad podés reemplazarla por 8 LEDs con un 74HC595.',
      consigna:'Usando <code>LedControl</code>, limpiá la matriz y dibujá una cruz: encendé las posiciones <code>(fila 1, columna 3)</code>, <code>(1, 4)</code>, <code>(2, 3)</code>, <code>(2, 4)</code>, <code>(3, 3)</code> y <code>(3, 4)</code> con <code>matriz.setLed(0, fila, columna, true)</code>. Usá al menos seis llamadas a <code>setLed</code>.',
    },
    {
      id:'ard-mat3', modulo:'matriz', titulo:'4.3 · Animación con for', nivel:'Difícil', imagen:'imagenes/matriz-armado.jpg', alt:'Armado de un circuito con LEDs en protoboard', electronica:'DIN en D11, CS en D10, CLK en D13, más 5 V y GND.', tink:false, alternativa:'En Tinkercad podés reemplazarla por 8 LEDs con un 74HC595.',
      consigna:'Con <code>LedControl</code>, hacé recorrer un punto de izquierda a derecha. Usá un <code>for</code> con <code>int x = 0; x &lt; 8; x = x + 1</code>. Dentro, limpiá la matriz, encendé <code>matriz.setLed(0, 3, x, true)</code>, esperá 100 ms y apagalo con <code>false</code>. Al terminar, limpiá otra vez.',
    },

    /* ---------------------- SENSORES ---------------------- */
    {
      id:'ard-sen1', modulo:'sensores', titulo:'5.1 · Sensor de luz LDR', nivel:'Fácil', imagen:'imagenes/ldr-sensores.jpg', alt:'Módulos sensores sobre una superficie de madera', electronica:'5 V → LDR → A1 → resistencia de 10 kΩ → GND; LED indicador en D13.', tink:true,
      consigna:'Leé el sensor de luz de <code>A1</code> con <code>analogRead(A1)</code>. Si la lectura es menor que 300, encendé el pin 13; si no, apagalo. Enviá el valor por serie con <code>Serial.println()</code>.',
    },
    {
      id:'ard-sen2', modulo:'sensores', titulo:'5.2 · Temperatura con float', nivel:'Medio', imagen:'imagenes/dht-sensor.jpg', alt:'Módulo sensor de temperatura y humedad', electronica:'VCC a 5 V, GND y DATA en D2 con resistencia pull-up de 4,7 kΩ.', tink:false, alternativa:'En Tinkercad usá un TMP36 en A2 y la fórmula (lectura * 5.0 / 1023 - 0.5) * 100.',
      consigna:'Incluí <code>DHT.h</code> y declará <code>DHT dht(2, DHT11);</code>. En <code>setup()</code> iniciá el puerto serie y llamá a <code>dht.begin()</code>. En <code>loop()</code> guardá <code>float temperatura = dht.readTemperature()</code>, mostrala por serie con <code>Serial.print()</code> y, si supera 25 grados, encendé el pin 13. Usá <code>delay(1000)</code> entre lecturas. En Tinkercad reemplazá el DHT11 por un TMP36 en A2 y aplicá la fórmula de la nota.',
    },
    {
      id:'ard-sen3', modulo:'sensores', titulo:'5.3 · Promediar el ultrasónido', nivel:'Difícil', imagen:'imagenes/hc-sr04.jpg', alt:'Sensor ultrasónico HC-SR04', electronica:'VCC a 5 V, GND, TRIG en D9 y ECHO en D10 (con divisor de voltaje en hardware real).', tink:true,
      consigna:'Usá el HC-SR04 con <code>TRIG</code> en D9 y <code>ECHO</code> en D10. En <code>setup()</code> configurá D9 como salida y D10 como entrada. En <code>loop()</code>, repetí tres veces con un <code>for</code>: enviá un pulso de 10 µs con <code>digitalWrite()</code> y <code>delayMicroseconds()</code>, medí con <code>pulseIn(10, HIGH)</code> y convertí con <code>duracion * 0.0343 / 2</code>. Sumá las tres distancias en <code>suma</code>, calculá <code>promedio = suma / 3</code>, mostralo por serie y esperá 500 ms.',
    },

    /* ---------------------- ROBÓTICA ---------------------- */
    {
      id:'ard-rob1', modulo:'robotica', titulo:'6.1 · Mover un servo', nivel:'Fácil', imagen:'imagenes/servo-motor.jpg', alt:'Componentes de motor para robótica', electronica:'Señal en D9, 5 V y GND común con la Arduino.', tink:true,
      consigna:'En <code>setup()</code> conectá el servo con <code>servo.attach(9)</code>. En <code>loop()</code> movelo a 0 grados, esperá 500 ms, movelo a 180 grados y esperá otros 500 ms.',
    },
    {
      id:'ard-rob2', modulo:'robotica', titulo:'6.2 · Motor con driver', nivel:'Medio', imagen:'imagenes/motor-driver.jpg', alt:'Arduino con placa de control y herramientas', electronica:'IN1 en D7, IN2 en D8, ENABLE en D9 con PWM; motor alimentado por fuente externa y GND común.', tink:true,
      consigna:'Con el driver L293D configurá D7 y D8 como salidas de dirección y D9 como salida PWM. En <code>loop()</code> poné IN1 en <code>HIGH</code> e IN2 en <code>LOW</code>, aplicá <code>analogWrite(9, 200)</code> durante 2 segundos, después apagá el PWM con <code>analogWrite(9, 0)</code> y esperá 1 segundo.',
    },
    {
      id:'ard-rob3', modulo:'robotica', titulo:'6.3 · Robot con dos estados', nivel:'Difícil', imagen:'imagenes/robot-sensores.jpg', alt:'Robot con sensores y cableado', electronica:'Botón entre D2 y GND con INPUT_PULLUP; servo con señal en D9, 5 V y GND común.', tink:true,
      consigna:'Usá una variable <code>int estado = 0</code>. En <code>loop()</code> leyé el botón de <code>D2</code> con <code>INPUT_PULLUP</code>. Si está presionado (0) pasá al estado 1; si no, volvé al estado 0. Con <code>if (estado == 1)</code> mové el servo a 135 grados y con <code>else</code> a 45 grados.',
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


  function renderEjercicios(){
    EJERCICIOS.forEach(function(e){
      const destino = document.getElementById('ej-' + e.modulo);
      if (!destino) return;
      const articulo = document.createElement('article');
      articulo.className = 'ejercicio';
      articulo.dataset.id = e.id;
      const figura = e.imagen
        ? '<figure class="figura-circuito">' +
            '<img src="' + e.imagen + '" alt="' + e.alt + '">' +
            '<figcaption><strong>Conexión de referencia:</strong> ' + e.electronica + '</figcaption>' +
          '</figure>'
        : '';
      const enlaceTink = '<a href="https://www.tinkercad.com/circuits" target="_blank" rel="noopener">Abrir Tinkercad ↗</a>';
      const notaTink = e.tink
        ? '<p class="nota"><strong>Tinkercad:</strong> armá el circuito y escribí el sketch allí. ' +
          enlaceTink + ' · <a href="tinkercad.html#si">Ver componentes y conexión ↗</a></p>'
        : '<p class="nota"><strong>Tinkercad:</strong> este componente no está disponible allí. ' +
          '<a href="tinkercad.html#no">Ver conexión real y consignas de programa ↗</a>' +
          (e.alternativa ? ' ' + e.alternativa : '') + ' ' + enlaceTink + '</p>';
      articulo.innerHTML =
        '<h3>' + e.titulo + ' <span class="nivel">' + e.nivel + '</span></h3>' +
        '<p class="consigna">' + e.consigna + '</p>' +
        figura + notaTink;
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
    const r = corregirQuiz(false);
    const respuestas = {};
    PREGUNTAS.forEach(function(p, i){
      const elegida = document.querySelector('input[name="ard-q' + i + '"]:checked');
      respuestas['quiz-' + i] = elegida ? p.opciones[Number(elegida.value)] : 'Sin responder';
    });
    return {
      nota:r.total ? Math.round(r.bien / r.total * 100) / 10 : 0,
      puntos:r.bien, total:r.total, fallos:[],
      detalle:'Cuestionario: ' + r.bien + ' de ' + r.total + ' correctas',
      respuestas:respuestas
    };
  }

  function bloquearTodo(estado){
    document.querySelectorAll('#ejercicios button').forEach(function(el){ el.disabled = true; });
    document.querySelectorAll('#quiz-arduino input').forEach(function(el){ el.disabled = true; });
    document.querySelectorAll('#form-entrega-ejercicios input, #form-entrega-ejercicios button').forEach(function(el){ el.disabled = true; });
    if (estado) estado.textContent = '✅ Cuestionario enviado. Ya no se puede modificar.';
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
        titulo:'Cuestionario Arduino · Robótica',
        materia:window.ENTREGA_MATERIA || 'Arduino · Robótica',
        nombre:nombre, apellido:apellido, curso:curso,
        nota:c.nota, puntos:c.puntos, total:c.total,
        errores:'Sin errores de código: las actividades se realizan en Tinkercad',
        detalle:c.detalle.slice(0,20000),
        respuestas:c.respuestas,
        momento:new Date().toISOString(),
        origen:location.href
      };
      window.enviarEntrega(payload).then(function(){
        try { localStorage.setItem(clave, new Date().toISOString()); } catch (e) {}
        bloquearTodo(estado);
        estado.className = 'estado-eval ok';
        estado.textContent = '✅ Enviado. Nota del cuestionario: ' + String(c.nota).replace('.', ',') + ' de 10. Se guardó en inform.';
      }).catch(function(error){
        estado.className = 'estado-eval error';
        estado.textContent = '❌ No se pudo enviar: ' + error.message;
      });
    });
  }

  renderEjercicios();
  renderQuiz();

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
