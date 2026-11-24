/* ============================================================
   evaluacion.js · evaluaciones de Arduino sin corrección visible
   ids: arduino-general · arduino-practica
   ============================================================ */
(function(){
  'use strict';

  function norm(s){
    return String(s).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
  }
  function tiene(c, re){ return re.test(c.t); }
  function setup(c){ return tiene(c, /void\s+setup\s*\(\s*\)\s*\{/); }
  function loop(c){ return tiene(c, /void\s+loop\s*\(\s*\)\s*\{/); }

  const GENERAL = [
    {
      id:'evg-ard1', titulo:'1. LED intermitente',
      consigna:'Configurá el pin 13 como salida y, en loop(), encendé el LED, esperá 400 ms, apagalo y esperá 400 ms.',
      reqs:[
        ['setup() y loop()', c => setup(c) && loop(c)],
        ['pinMode(13, OUTPUT)', c => tiene(c, /pinmode\s*\(\s*13\s*,\s*output\s*\)/)],
        ['digitalWrite HIGH y LOW', c => tiene(c, /digitalwrite\s*\(\s*13\s*,\s*high\s*\)/) && tiene(c, /digitalwrite\s*\(\s*13\s*,\s*low\s*\)/)],
        ['delay(400) dos veces', c => (c.t.match(/delay\s*\(\s*400\s*\)/g) || []).length >= 2]
      ]
    },
    {
      id:'evg-ard2', titulo:'2. Botón con resistencia interna',
      consigna:'Configurá D2 con INPUT_PULLUP y D13 como salida. Si digitalRead(2) devuelve 0, encendé el LED; si no, apagalo.',
      reqs:[
        ['pinMode(2, INPUT_PULLUP)', c => tiene(c, /pinmode\s*\(\s*2\s*,\s*input_pullup\s*\)/)],
        ['pinMode(13, OUTPUT)', c => tiene(c, /pinmode\s*\(\s*13\s*,\s*output\s*\)/)],
        ['digitalRead(2)', c => tiene(c, /digitalread\s*\(\s*2\s*\)/)],
        ['if con comparación == 0 y else', c => tiene(c, /\bif\s*\(/) && tiene(c, /==\s*0\b/) && tiene(c, /\belse\b/)]
      ]
    },
    {
      id:'evg-ard3', titulo:'3. Potenciómetro y PWM',
      consigna:'Leé A0, convertí 0–1023 a 0–255 con map() y aplicá analogWrite() al pin 9. Configurá el pin 9 como salida.',
      reqs:[
        ['analogRead(A0)', c => tiene(c, /analogread\s*\(\s*a0\s*\)/)],
        ['map con 0, 1023, 0, 255', c => tiene(c, /map\s*\([^)]*0\s*,\s*1023\s*,\s*0\s*,\s*255\s*\)/)],
        ['analogWrite(9, ...)', c => tiene(c, /analogwrite\s*\(\s*9\s*,/)],
        ['pinMode(9, OUTPUT)', c => tiene(c, /pinmode\s*\(\s*9\s*,\s*output\s*\)/)]
      ]
    },
    {
      id:'evg-ard4', titulo:'4. LCD con dos filas',
      consigna:'Iniciá lcd.begin(16, 2). Escribí "Temperatura" en la fila 0 y un valor guardado en la variable temp en la fila 1 con lcd.print(temp).',
      reqs:[
        ['lcd.begin(16, 2)', c => tiene(c, /lcd\.begin\s*\(\s*16\s*,\s*2\s*\)/)],
        ['Texto Temperatura', c => tiene(c, /temperatura/)],
        ['lcd.setCursor(...)', c => tiene(c, /lcd\.setcursor\s*\(/)],
        ['lcd.print(temp)', c => tiene(c, /lcd\.print\s*\(\s*temp\s*\)/)]
      ]
    },
    {
      id:'evg-ard5', titulo:'5. Barrido en la matriz',
      consigna:'Con un for desde 0 hasta 7, limpiá la matriz, encendé matriz.setPoint(x, 2, 1), esperá 80 ms y limpiá al terminar.',
      reqs:[
        ['for con x < 8', c => tiene(c, /\bfor\s*\([^)]*<\s*8\s*;/)],
        ['matriz.setPoint(x, 2, 1)', c => tiene(c, /matriz\.setpoint\s*\(\s*x\s*,\s*2\s*,\s*1\s*\)/)],
        ['delay(80)', c => tiene(c, /delay\s*\(\s*80\s*\)/)],
        ['matriz.clear() dos veces', c => (c.t.match(/matriz\.clear\s*\(\s*\)/g) || []).length >= 2]
      ]
    },
    {
      id:'evg-ard6', titulo:'6. Servo y sensor',
      consigna:'Conectá el servo en el pin 9. Si la lectura de A1 es menor que 400, mové el servo a 30 grados; si no, a 150 grados.',
      reqs:[
        ['servo.attach(9)', c => tiene(c, /servo\.attach\s*\(\s*9\s*\)/)],
        ['analogRead(A1)', c => tiene(c, /analogread\s*\(\s*a1\s*\)/)],
        ['Comparación < 400', c => tiene(c, /<\s*400\b/)],
        ['servo.write(30) y servo.write(150)', c => tiene(c, /servo\.write\s*\(\s*30\s*\)/) && tiene(c, /servo\.write\s*\(\s*150\s*\)/)]
      ]
    }
  ];

  const QUIZ = [
    ['¿Cuántas veces se ejecuta setup()?', ['Una vez, al arrancar','En cada vuelta de loop()','Dos veces','Nunca'], 0],
    ['¿Qué hace digitalWrite(13, LOW)?', ['Lee el pin 13','Pone el pin en 0 V','Configura el pin como entrada','Espera un segundo'], 1],
    ['¿Qué rango devuelve analogRead()?', ['0 a 255','0 a 1023','0 a 180','-1 a 1'], 1],
    ['¿Qué activa INPUT_PULLUP?', ['El brillo de un LED','Una resistencia interna','El PWM','La LCD'], 1],
    ['En lcd.setCursor(3, 1), ¿qué es 1?', ['La columna','La fila','El contraste','El retardo'], 1],
    ['¿Cuánto espera delay(1000)?', ['1 ms','100 ms','1 s','10 s'], 2]
  ];

  const PRACTICA = [
    {
      id:'evp-ard1', titulo:'1. Semáforo',
      consigna:'Usá D8, D9 y D10 como salidas. Encendé un LED a la vez y apagá los otros dos. Entre cambios usá delay(1000).',
      reqs:[
        ['Pines 8, 9 y 10 como OUTPUT', c => [8,9,10].every(p => tiene(c, new RegExp('pinmode\\s*\\(\\s*' + p + '\\s*,\\s*output\\s*\\)')))],
        ['digitalWrite en los tres pines', c => [8,9,10].every(p => tiene(c, new RegExp('digitalwrite\\s*\\(\\s*' + p + '\\s*,')))],
        ['HIGH y LOW', c => tiene(c, /,\s*high\s*\)/) && tiene(c, /,\s*low\s*\)/)],
        ['delay(1000)', c => tiene(c, /delay\s*\(\s*1000\s*\)/)]
      ]
    },
    {
      id:'evp-ard2', titulo:'2. Sensor de luz',
      consigna:'Leé el LDR de A1. Si la lectura es menor que 300, encendé D13; si no, apagalo. Mostrá la lectura por Serial.',
      reqs:[
        ['Serial.begin(9600)', c => tiene(c, /serial\.begin\s*\(\s*9600\s*\)/)],
        ['analogRead(A1)', c => tiene(c, /analogread\s*\(\s*a1\s*\)/)],
        ['Comparación < 300', c => tiene(c, /<\s*300\b/)],
        ['Serial.println()', c => tiene(c, /serial\.println\s*\(/)]
      ]
    },
    {
      id:'evp-ard3', titulo:'3. Promedio del ultrasónido',
      consigna:'Leé tres veces A3 dentro de un for, acumulá en suma, calculá promedio = suma / 3 y mostralo por serie.',
      reqs:[
        ['for con tres vueltas', c => tiene(c, /\bfor\s*\([^)]*<\s*3\s*;/)],
        ['analogRead(A3)', c => tiene(c, /analogread\s*\(\s*a3\s*\)/)],
        ['suma = suma + ...', c => tiene(c, /suma\s*=\s*suma\s*\+/)],
        ['promedio = suma / 3', c => tiene(c, /promedio\s*=\s*suma\s*\/\s*3/)]
      ]
    },
    {
      id:'evp-ard4', titulo:'4. Robot con estados',
      consigna:'Declará int estado = 0. Leé el botón de D2 con INPUT_PULLUP. Si está presionado, estado vale 1; si no, 0. Con if (estado == 1) mové el servo a 135°, si no a 45°.',
      reqs:[
        ['int estado = 0', c => tiene(c, /\bint\s+estado\s*=\s*0\s*;/)],
        ['pinMode(2, INPUT_PULLUP)', c => tiene(c, /pinmode\s*\(\s*2\s*,\s*input_pullup\s*\)/)],
        ['estado == 1', c => tiene(c, /estado\s*==\s*1/)],
        ['servo.write(135) y servo.write(45)', c => tiene(c, /servo\.write\s*\(\s*135\s*\)/) && tiene(c, /servo\.write\s*\(\s*45\s*\)/)]
      ]
    }
  ];

  const CONSIGNAS = [
    { id:'evp-con1', texto:'Escribí la instrucción para configurar el pin 13 como salida.', re:/pinmode\s*\(\s*13\s*,\s*output\s*\)/ },
    { id:'evp-con2', texto:'Escribí la instrucción para iniciar el monitor serie a 9600 baudios.', re:/serial\.begin\s*\(\s*9600\s*\)/ },
    { id:'evp-con3', texto:'Escribí la instrucción para leer el potenciómetro de A0.', re:/analogread\s*\(\s*a0\s*\)/ },
    { id:'evp-con4', texto:'Escribí la instrucción para esperar 1 segundo.', re:/delay\s*\(\s*1000\s*\)/ },
    { id:'evp-con5', texto:'Escribí la instrucción para limpiar la pantalla LCD.', re:/lcd\.clear\s*\(\s*\)/ },
    { id:'evp-con6', texto:'Escribí la instrucción para colocar un servo en 90 grados.', re:/servo\.write\s*\(\s*90\s*\)/ }
  ];

  function renderActividades(destino, datos){
    const caja = document.getElementById(destino);
    if (!caja) return;
    datos.forEach(function(a){
      const articulo = document.createElement('article');
      articulo.className = 'eval-card';
      articulo.dataset.id = a.id;
      articulo.innerHTML = '<h3>' + a.titulo + '</h3><p class="consigna">' + a.consigna + '</p>' +
        '<textarea class="respuesta" spellcheck="false" placeholder="Escribí el sketch aquí..."></textarea>';
      caja.appendChild(articulo);
    });
  }

  function renderQuiz(){
    const caja = document.getElementById('evg-quiz');
    if (!caja) return;
    caja.innerHTML = QUIZ.map(function(q, i){
      return '<div class="quiz-pregunta" data-indice="' + i + '"><p><strong>' + (i + 1) + '.</strong> ' + q[0] + '</p>' +
        q[1].map(function(op, j){
          return '<label><input type="radio" name="evg-q' + i + '" value="' + j + '"> ' + op + '</label>';
        }).join('') + '</div>';
    }).join('');
  }

  function renderConsignas(){
    const caja = document.getElementById('evp-consignas');
    if (!caja) return;
    caja.innerHTML = CONSIGNAS.map(function(c){
      return '<div class="quiz-pregunta" data-id="' + c.id + '"><p>' + c.texto + '</p>' +
        '<textarea class="respuesta" spellcheck="false" style="min-height:70px" placeholder="Una sola instrucción"></textarea></div>';
    }).join('');
  }

  function contexto(textarea){
    return { t:norm(textarea ? textarea.value : '') };
  }

  function corregirActividades(datos, respuestas, detalle){
    let bien = 0, total = 0;
    datos.forEach(function(a){
      const articulo = document.querySelector('[data-id="' + a.id + '"]');
      const area = articulo ? articulo.querySelector('textarea') : null;
      const c = contexto(area);
      respuestas[a.id] = c.t;
      let parcial = 0;
      a.reqs.forEach(function(par){
        const ok = !!par[1](c);
        if (ok){ bien++; parcial++; }
        total++;
        detalle.push(a.id.toUpperCase() + ' · ' + par[0] + ': ' + (ok ? 'OK' : 'FALTA'));
      });
    });
    return { bien:bien, total:total };
  }

  function corregirGeneral(respuestas, detalle){
    const code = corregirActividades(GENERAL, respuestas, detalle);
    let quizBien = 0;
    QUIZ.forEach(function(q, i){
      const elegida = document.querySelector('input[name="evg-q' + i + '"]:checked');
      const ok = !!elegida && Number(elegida.value) === q[2];
      if (ok) quizBien++;
      respuestas['evg-q' + i] = elegida ? q[1][Number(elegida.value)] : 'Sin responder';
      detalle.push('EVG-Q' + (i + 1) + ': ' + (ok ? 'OK' : 'FALTA'));
    });
    return {
      nota:Math.round((code.bien + quizBien) / (code.total + QUIZ.length) * 100) / 10,
      puntosA:code.bien, puntosB:quizBien, puntosC:0,
      total:code.total + QUIZ.length
    };
  }

  function corregirPractica(respuestas, detalle){
    const code = corregirActividades(PRACTICA, respuestas, detalle);
    let cortas = 0;
    CONSIGNAS.forEach(function(c){
      const nodo = document.querySelector('[data-id="' + c.id + '"] textarea');
      const ctexto = contexto(nodo);
      const ok = c.re.test(ctexto.t);
      if (ok) cortas++;
      respuestas[c.id] = ctexto.t;
      detalle.push(c.id.toUpperCase() + ': ' + (ok ? 'OK' : 'FALTA'));
    });
    return {
      nota:Math.round((code.bien + cortas) / (code.total + CONSIGNAS.length) * 100) / 10,
      puntosA:code.bien, puntosB:0, puntosC:cortas,
      total:code.total + CONSIGNAS.length
    };
  }

  function bloquear(id, estado){
    document.querySelectorAll('[data-id^="evg-ard"], [data-id^="evp-ard"], [data-id^="evp-con"]').forEach(function(nodo){
      if (id === 'arduino-general' && nodo.dataset.id.indexOf('evg-') !== 0) return;
      if (id === 'arduino-practica' && nodo.dataset.id.indexOf('evp-') !== 0) return;
      nodo.querySelectorAll('textarea, input').forEach(function(el){ el.disabled = true; });
    });
    const form = document.querySelector('[data-form-eval="' + id + '"]');
    if (form) form.querySelectorAll('input, button').forEach(function(el){ el.disabled = true; });
    if (estado) estado.textContent = '✅ Evaluación enviada. Ya no se puede modificar.';
  }

  function configurar(id, titulo, corregir){
    const form = document.querySelector('[data-form-eval="' + id + '"]');
    if (!form) return;
    const estado = document.querySelector('[data-estado-eval="' + id + '"]');
    const clave = id + '-enviada-v1';
    try {
      if (localStorage.getItem(clave)){ bloquear(id, estado); return; }
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
      estado.textContent = 'Enviando…';
      const respuestas = {};
      const detalle = [];
      const c = corregir(respuestas, detalle);
      const payload = {
        examen:id, titulo:titulo, materia:window.ENTREGA_MATERIA || 'Arduino · Electrónica y Robótica',
        nombre:nombre, apellido:apellido, curso:curso,
        nota:c.nota, puntosA:c.puntosA, puntosB:c.puntosB, puntosC:c.puntosC,
        errores:'Corrección reservada al docente',
        detalle:detalle.join('\n').slice(0,20000), respuestas:respuestas,
        momento:new Date().toISOString(), origen:location.href
      };
      window.enviarEntrega(payload).then(function(){
        try { localStorage.setItem(clave, new Date().toISOString()); } catch (e) {}
        bloquear(id, estado);
        estado.className = 'estado-eval ok';
        estado.textContent = '✅ Evaluación enviada correctamente.';
      }).catch(function(error){
        estado.className = 'estado-eval error';
        estado.textContent = '❌ No se pudo enviar: ' + error.message;
      });
    });
  }

  renderActividades('evg-actividades', GENERAL);
  renderActividades('evp-actividades', PRACTICA);
  renderQuiz();
  renderConsignas();
  configurar('arduino-general', 'Evaluación general · Arduino y Robótica', corregirGeneral);
  configurar('arduino-practica', 'Evaluación práctica · Arduino y Robótica', corregirPractica);
})();
