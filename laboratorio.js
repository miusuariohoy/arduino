/* ============================================================
   laboratorio.js · interfaz del Arduino virtual
   Usa ArduinoSim (sim/arduino.js) y dibuja pines, LCD, matriz,
   servo y monitor serie.
   ============================================================ */
(function(){
  'use strict';

  const ESCENARIOS = {
    digital:{
      etiqueta:'Digital: LED y botón',
      codigo:`void setup() {
  pinMode(13, OUTPUT);
  pinMode(2, INPUT_PULLUP);
  Serial.begin(9600);
}

void loop() {
  int boton = digitalRead(2);
  Serial.println(boton);
  if (boton == 0) {
    digitalWrite(13, HIGH);
  } else {
    digitalWrite(13, LOW);
  }
  delay(200);
}`,
      controles:[{ tipo:'boton', pin:'2', etiqueta:'Botón D2' }]
    },
    analogico:{
      etiqueta:'Analógico: potenciómetro y PWM',
      codigo:`void setup() {
  Serial.begin(9600);
}

void loop() {
  int pot = analogRead(A0);
  int brillo = map(pot, 0, 1023, 0, 255);
  analogWrite(9, brillo);
  Serial.println(brillo);
  delay(150);
}`,
      controles:[{ tipo:'rango', pin:'A0', min:0, max:1023, valor:512, etiqueta:'Potenciómetro A0' }]
    },
    lcd:{
      etiqueta:'Pantalla LCD 16x2',
      codigo:`void setup() {
  lcd.begin(16, 2);
  lcd.print("Hola Arduino");
  lcd.setCursor(0, 1);
  lcd.print("LCD 16x2 listo");
}

void loop() {
  delay(500);
}`,
      controles:[]
    },
    matriz:{
      etiqueta:'Matriz LED 8x8',
      codigo:`void setup() {
  matriz.clear();
}

void loop() {
  for (int x = 0; x < 8; x = x + 1) {
    matriz.setPoint(x, 3, 1);
    delay(100);
  }
  matriz.clear();
}`,
      controles:[]
    },
    sensores:{
      etiqueta:'Sensores: luz, temperatura y distancia',
      codigo:`void setup() {
  Serial.begin(9600);
}

void loop() {
  int luz = analogRead(A1);
  float temp = analogRead(A2) / 10.0;
  int dist = analogRead(A3);
  Serial.print("Luz ");
  Serial.println(luz);
  Serial.print("Temp ");
  Serial.println(temp);
  Serial.print("Dist ");
  Serial.println(dist);
  if (luz < 300) {
    digitalWrite(13, HIGH);
  } else {
    digitalWrite(13, LOW);
  }
  delay(300);
}`,
      controles:[
        { tipo:'rango', pin:'A1', min:0, max:1023, valor:260, etiqueta:'LDR A1' },
        { tipo:'rango', pin:'A2', min:0, max:500, valor:230, etiqueta:'Temperatura A2 (x10)' },
        { tipo:'rango', pin:'A3', min:0, max:400, valor:45, etiqueta:'Distancia A3 (cm)' }
      ]
    },
    robotica:{
      etiqueta:'Robótica: servo con botón',
      codigo:`void setup() {
  servo.attach(9);
  pinMode(2, INPUT_PULLUP);
}

void loop() {
  int b = digitalRead(2);
  if (b == 0) {
    servo.write(135);
  } else {
    servo.write(45);
  }
  delay(200);
}`,
      controles:[{ tipo:'boton', pin:'2', etiqueta:'Botón D2' }]
    }
  };

  const PINES_DIGITALES = [2,3,4,5,6,7,8,9,10,11,12,13];
  const PINES_ANALOGICOS = [0,1,2,3,4,5];

  let estado = null;
  let sketch = null;
  let escenarioActual = 'digital';

  function elem(id){ return document.getElementById(id); }
  function editor(){ return elem('codigo-arduino'); }
  function estadoMensaje(){ return elem('sim-estado'); }

  function construirPines(){
    const digital = elem('pines-digitales');
    const analogico = elem('pines-analogicos');
    if (!digital || !analogico) return;
    digital.innerHTML = PINES_DIGITALES.map(function(p){
      return '<div class="pin" data-pin="' + p + '">D' + p + '<span></span></div>';
    }).join('');
    analogico.innerHTML = PINES_ANALOGICOS.map(function(p){
      return '<div class="pin" data-pin="A' + p + '">A' + p + '<span></span></div>';
    }).join('');
  }

  function construirPantallas(){
    const lcd = elem('panel-lcd');
    if (lcd) lcd.innerHTML = Array.from({length:32}, function(_, i){
      return '<span data-celda="' + i + '"></span>';
    }).join('');
    const matriz = elem('panel-matriz');
    if (matriz) matriz.innerHTML = Array.from({length:64}, function(_, i){
      return '<span data-led="' + i + '"></span>';
    }).join('');
  }

  function construirControles(){
    const caja = elem('controles-sim');
    if (!caja) return;
    const config = ESCENARIOS[escenarioActual].controles;
    caja.innerHTML = config.map(function(c){
      if (c.tipo === 'boton'){
        return '<button type="button" class="accion secundaria" data-boton-pin="' + c.pin + '">' +
          c.etiqueta + ': suelto (1)</button>';
      }
      return '<label>' + c.etiqueta +
        '<input type="range" data-entrada="' + c.pin + '" min="' + c.min + '" max="' + c.max +
        '" value="' + c.valor + '"><b data-valor="' + c.pin + '">' + c.valor + '</b></label>';
    }).join('') || '<span>Sin controles: este escenario solo muestra la salida.</span>';

    caja.querySelectorAll('[data-entrada]').forEach(function(input){
      input.addEventListener('input', function(){
        estado.entradas[input.dataset.entrada] = Number(input.value);
        const salida = caja.querySelector('[data-valor="' + input.dataset.entrada + '"]');
        if (salida) salida.textContent = input.value;
      });
    });
    caja.querySelectorAll('[data-boton-pin]').forEach(function(boton){
      boton.addEventListener('click', function(){
        const pin = boton.dataset.botonPin;
        const presionado = Number(estado.entradas[pin]) === 0;
        estado.entradas[pin] = presionado ? 0 : 1;
        boton.textContent = boton.textContent.split(':')[0] + ': ' + (presionado ? 'presionado (0)' : 'suelto (1)');
      });
    });
    aplicarControles();
  }

  function aplicarControles(){
    const caja = elem('controles-sim');
    if (!caja || !estado) return;
    caja.querySelectorAll('[data-entrada]').forEach(function(input){
      estado.entradas[input.dataset.entrada] = Number(input.value);
    });
    caja.querySelectorAll('[data-boton-pin]').forEach(function(boton){
      const texto = boton.textContent;
      estado.entradas[boton.dataset.botonPin] = texto.indexOf('presionado') >= 0 ? 0 : 1;
    });
  }

  function render(){
    if (!estado) return;
    document.querySelectorAll('#pines-digitales .pin').forEach(function(nodo){
      const pin = estado.pines[nodo.dataset.pin] || {};
      nodo.classList.toggle('encendido', Number(pin.valor) > 0);
      nodo.classList.toggle('pwm', Number(pin.pwm) > 0);
    });
    document.querySelectorAll('#pines-analogicos .pin').forEach(function(nodo){
      const valor = Number(estado.entradas[nodo.dataset.pin] || 0);
      nodo.classList.toggle('pwm', valor > 0);
      nodo.title = String(valor);
    });
    const monitor = elem('monitor-serial');
    if (monitor){
      monitor.textContent = estado.serial.length
        ? estado.serial.map(function(linea){ return linea.texto + (linea.finLinea ? '\n' : ''); }).join('')
        : '(sin datos todavía: ejecutá el sketch)';
    }
    document.querySelectorAll('#panel-lcd [data-celda]').forEach(function(celda){
      const i = Number(celda.dataset.celda);
      const fila = Math.floor(i / 16), columna = i % 16;
      const ch = estado.lcd.buffer[fila][columna];
      celda.textContent = ch === ' ' ? '' : ch;
      celda.classList.toggle('lleno', ch !== ' ');
    });
    document.querySelectorAll('#panel-matriz [data-led]').forEach(function(led){
      const i = Number(led.dataset.led);
      const fila = Math.floor(i / 8), columna = i % 8;
      led.classList.toggle('lleno', !!estado.matriz[fila][columna]);
    });
    const servoBarra = elem('servo-barra');
    const servoValor = elem('servo-valor');
    if (servoBarra) servoBarra.firstElementChild.style.width = Math.max(0, Math.min(100, estado.servo / 180 * 100)) + '%';
    if (servoValor) servoValor.textContent = Math.round(estado.servo) + '°';
    const motorValor = elem('motor-valor');
    if (motorValor) motorValor.textContent = estado.motor > 0 ? 'adelante' : estado.motor < 0 ? 'atrás' : 'detenido';
  }

  function mensaje(texto, error){
    const nodo = estadoMensaje();
    if (!nodo) return;
    nodo.textContent = texto;
    nodo.className = 'sim-estado' + (error ? ' error' : '');
  }

  function descTipo(tipo){
    const nombres = {
      variable:'declarar variable', expresion:'ejecutar instrucción', si:'evaluar condición',
      para:'bucle for', mientras:'bucle while', funcion:'llamar función',
      bloque:'abrir bloque', romper:'romper bucle', seguir:'continuar bucle'
    };
    return nombres[tipo] || tipo;
  }

  function crearSketch(){
    aplicarControles();
    const vueltas = Number((elem('sim-vueltas') || {}).value || 6);
    sketch = window.ArduinoSim.crearSketch(editor().value, { vueltas:vueltas, maxPasos:9000 }, estado);
    return sketch;
  }

  function cargarEscenario(nombre){
    escenarioActual = nombre;
    document.querySelectorAll('#sim-tabs button').forEach(function(b){
      b.classList.toggle('activo', b.dataset.sim === nombre);
    });
    editor().value = ESCENARIOS[nombre].codigo;
    estado = window.ArduinoSim.estadoInicial();
    sketch = null;
    construirControles();
    render();
    mensaje('Escenario: ' + ESCENARIOS[nombre].etiqueta + '. Editá el código y presioná Ejecutar.');
  }

  function iniciar(){
    if (!window.ArduinoSim || !editor()) return;
    construirPines();
    construirPantallas();
    const tabs = elem('sim-tabs');
    if (tabs){
      tabs.innerHTML = Object.keys(ESCENARIOS).map(function(clave){
        return '<button type="button" data-sim="' + clave + '">' + ESCENARIOS[clave].etiqueta + '</button>';
      }).join('');
      tabs.addEventListener('click', function(e){
        const boton = e.target.closest('button[data-sim]');
        if (boton) cargarEscenario(boton.dataset.sim);
      });
    }
    const ejecutar = elem('sim-ejecutar');
    if (ejecutar) ejecutar.addEventListener('click', function(){
      try {
        const r = crearSketch().ejecutar(9000);
        render();
        const aviso = r.terminado ? '✅ Programa terminado' : '⚠️ Se alcanzó el límite de pasos';
        mensaje(aviso + '. ' + estado.paso + ' instrucciones, ' + estado.vuelta + ' vueltas de loop, ' + estado.tiempo + ' ms simulados.');
      } catch (error){
        mensaje('❌ ' + error.message, true);
        render();
      }
    });
    const paso = elem('sim-paso');
    if (paso) paso.addEventListener('click', function(){
      try {
        if (!sketch) crearSketch();
        const r = sketch.paso();
        render();
        if (r.done) mensaje('✅ Programa terminado. ' + estado.paso + ' instrucciones ejecutadas.');
        else mensaje('Paso ' + estado.paso + ': ' + descTipo(r.value.tipo) + ' (línea ' + r.value.linea + ').');
      } catch (error){
        mensaje('❌ ' + error.message, true);
      }
    });
    const reiniciar = elem('sim-reiniciar');
    if (reiniciar) reiniciar.addEventListener('click', function(){
      estado = window.ArduinoSim.estadoInicial();
      sketch = null;
      construirControles();
      render();
      mensaje('Simulador reiniciado. Las entradas volvieron a su valor inicial.');
    });
    cargarEscenario('digital');
  }

  iniciar();
})();
