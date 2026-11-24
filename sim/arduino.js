/* ============================================================
   arduino.js · intérprete didáctico de un subconjunto de Arduino
   No compila C++: ejecuta las instrucciones que se usan en clase.
   Expone window.ArduinoSim.
   ============================================================ */
(function(){
  'use strict';

  const CONSTANTES = {
    HIGH:1, LOW:0, INPUT:0, OUTPUT:1, INPUT_PULLUP:2,
    LED_BUILTIN:13, A0:0, A1:1, A2:2, A3:3, A4:4, A5:5,
    true:true, false:false
  };

  const TIPOS = new Set([
    'void','int','long','float','double','bool','boolean','byte',
    'char','string','String','unsigned','const','short','auto'
  ]);

  function tokenizar(codigo){
    const tokens = [];
    let i = 0, linea = 1;
    const n = codigo.length;
    while (i < n){
      const ch = codigo[i];
      if (ch === '\n'){ linea++; i++; continue; }
      if (/\s/.test(ch)){ i++; continue; }
      if (ch === '/' && codigo[i+1] === '/'){
        while (i < n && codigo[i] !== '\n') i++;
        continue;
      }
      if (ch === '/' && codigo[i+1] === '*'){
        i += 2;
        while (i < n && !(codigo[i] === '*' && codigo[i+1] === '/')){
          if (codigo[i] === '\n') linea++;
          i++;
        }
        i += 2;
        continue;
      }
      if (ch === '"' || ch === "'"){
        const comilla = ch;
        i++;
        let texto = '';
        while (i < n && codigo[i] !== comilla){
          if (codigo[i] === '\\'){
            i++;
            const e = codigo[i];
            texto += e === 'n' ? '\n' : e === 't' ? '\t' : e;
            i++;
          } else {
            texto += codigo[i++];
          }
        }
        i++;
        tokens.push({ tipo:'cadena', valor:texto, linea:linea });
        continue;
      }
      if (/[0-9]/.test(ch)){
        let j = i;
        while (j < n && /[0-9.]/.test(codigo[j])) j++;
        tokens.push({ tipo:'numero', valor:Number(codigo.slice(i,j)), linea:linea });
        i = j;
        continue;
      }
      if (/[A-Za-z_]/.test(ch)){
        let j = i;
        while (j < n && /[A-Za-z0-9_]/.test(codigo[j])) j++;
        tokens.push({ tipo:'id', valor:codigo.slice(i,j), linea:linea });
        i = j;
        continue;
      }
      const dobles = ['==','!=','<=','>=','&&','||','++','--','+=','-=','*=','/='];
      let operador = null;
      for (const op of dobles){
        if (codigo.startsWith(op, i)){ operador = op; break; }
      }
      if (operador){
        tokens.push({ tipo:'op', valor:operador, linea:linea });
        i += operador.length;
        continue;
      }
      if ('=+-*/%<>!(){};,.'.indexOf(ch) >= 0){
        tokens.push({ tipo:'punc', valor:ch, linea:linea });
        i++;
        continue;
      }
      throw new Error('Carácter no reconocido "' + ch + '" en la línea ' + linea);
    }
    tokens.push({ tipo:'fin', valor:'<fin>', linea:linea });
    return tokens;
  }

  function Parser(tokens){
    this.tokens = tokens;
    this.i = 0;
  }

  Parser.prototype.actual = function(){ return this.tokens[this.i]; };
  Parser.prototype.aceptar = function(valor){
    const t = this.actual();
    if (t.valor === valor){ this.i++; return t; }
    return null;
  };
  Parser.prototype.esperar = function(valor){
    const t = this.aceptar(valor);
    if (!t) throw new Error('Se esperaba "' + valor + '" en la línea ' + this.actual().linea);
    return t;
  };
  Parser.prototype.esTipo = function(v){ return TIPOS.has(v); };
  Parser.prototype.consumirTipos = function(){
    while (this.actual().tipo === 'id' && this.esTipo(this.actual().valor)) this.i++;
  };

  Parser.prototype.programa = function(){
    const cuerpo = [];
    while (this.actual().tipo !== 'fin'){
      if (this.actual().tipo === 'id' && this.esTipo(this.actual().valor)){
        const guardado = this.i;
        this.consumirTipos();
        if (this.actual().tipo === 'id' &&
            this.tokens[this.i+1] && this.tokens[this.i+1].valor === '('){
          this.i = guardado;
          cuerpo.push(this.funcion());
        } else {
          this.i = guardado;
          cuerpo.push(this.declaracionVariable());
        }
      } else if (this.actual().valor === ';'){
        this.i++;
      } else {
        cuerpo.push(this.instruccion());
      }
    }
    return cuerpo;
  };

  Parser.prototype.funcion = function(){
    const inicio = this.actual().linea;
    this.consumirTipos();
    const nombre = this.actual().valor;
    if (this.actual().tipo !== 'id') throw new Error('Nombre de función inválido en la línea ' + inicio);
    this.i++;
    this.esperar('(');
    const parametros = [];
    while (this.actual().valor !== ')'){
      this.consumirTipos();
      parametros.push(this.actual().valor);
      this.i++;
      if (this.aceptar(',')) continue;
      break;
    }
    this.esperar(')');
    const cuerpo = this.bloque();
    return { tipo:'funcion', nombre:nombre, parametros:parametros, cuerpo:cuerpo, linea:inicio };
  };

  Parser.prototype.declaracionVariable = function(){
    const inicio = this.actual().linea;
    this.consumirTipos();
    const nombre = this.actual();
    if (!nombre || nombre.tipo !== 'id') throw new Error('Declaración de variable inválida en la línea ' + inicio);
    this.i++;
    let inicial = null;
    if (this.aceptar('=')) inicial = this.expresion();
    this.esperar(';');
    return { tipo:'variable', nombre:nombre.valor, inicial:inicial, linea:inicio };
  };

  Parser.prototype.bloque = function(){
    this.esperar('{');
    const cuerpo = [];
    while (this.actual().valor !== '}'){
      if (this.actual().tipo === 'fin') throw new Error('Falta cerrar el bloque abierto en la línea ' + this.actual().linea);
      cuerpo.push(this.instruccion());
    }
    this.esperar('}');
    return cuerpo;
  };

  Parser.prototype.instruccion = function(){
    const t = this.actual();
    if (t.valor === '{') return { tipo:'bloque', cuerpo:this.bloque(), linea:t.linea };
    if (t.valor === 'if') return this.si();
    if (t.valor === 'for') return this.para();
    if (t.valor === 'while') return this.mientras();
    if (t.valor === 'return') return this.retorno();
    if (t.valor === 'break' || t.valor === 'continue'){
      this.i++;
      this.esperar(';');
      return { tipo:t.valor === 'break' ? 'romper' : 'seguir', linea:t.linea };
    }
    if (t.tipo === 'id' && this.esTipo(t.valor)) return this.declaracionVariable();
    if (t.valor === ';'){ this.i++; return { tipo:'vacio', linea:t.linea }; }
    const expr = this.expresion();
    this.esperar(';');
    return { tipo:'expresion', expresion:expr, linea:t.linea };
  };

  Parser.prototype.si = function(){
    const inicio = this.esperar('if').linea;
    this.esperar('(');
    const condicion = this.expresion();
    this.esperar(')');
    const entonces = this.instruccion();
    let siNo = null;
    if (this.aceptar('else')) siNo = this.instruccion();
    return { tipo:'si', condicion:condicion, entonces:entonces, siNo:siNo, linea:inicio };
  };

  Parser.prototype.para = function(){
    const inicio = this.esperar('for').linea;
    this.esperar('(');
    let inicial = null;
    if (this.actual().valor !== ';'){
      inicial = (this.actual().tipo === 'id' && this.esTipo(this.actual().valor))
        ? this.declaracionVariable() : this.instruccionExpresion();
    } else this.i++;
    const prueba = this.actual().valor === ';' ? null : this.expresion();
    this.esperar(';');
    const actualizacion = this.actual().valor === ')' ? null : this.expresion();
    this.esperar(')');
    const cuerpo = this.instruccion();
    return { tipo:'para', inicial:inicial, prueba:prueba, actualizacion:actualizacion, cuerpo:cuerpo, linea:inicio };
  };

  Parser.prototype.instruccionExpresion = function(){
    const inicio = this.actual().linea;
    const expr = this.expresion();
    this.esperar(';');
    return { tipo:'expresion', expresion:expr, linea:inicio };
  };

  Parser.prototype.mientras = function(){
    const inicio = this.esperar('while').linea;
    this.esperar('(');
    const condicion = this.expresion();
    this.esperar(')');
    const cuerpo = this.instruccion();
    return { tipo:'mientras', condicion:condicion, cuerpo:cuerpo, linea:inicio };
  };

  Parser.prototype.retorno = function(){
    const inicio = this.esperar('return').linea;
    const valor = this.actual().valor === ';' ? null : this.expresion();
    this.esperar(';');
    return { tipo:'retorno', valor:valor, linea:inicio };
  };

  Parser.prototype.expresion = function(){ return this.asignacion(); };

  Parser.prototype.asignacion = function(){
    const izq = this.or();
    const t = this.actual();
    if (t.valor === '=' || t.valor === '+=' || t.valor === '-=' || t.valor === '*=' || t.valor === '/='){
      this.i++;
      const der = this.asignacion();
      return { tipo:'asignacion', izq:izq, operador:t.valor, der:der, linea:t.linea };
    }
    return izq;
  };

  function binario(metodo, operadores){
    return function(){
      let nodo = this[metodo]();
      while (this.actual().valor && operadores.indexOf(this.actual().valor) >= 0){
        const op = this.actual();
        this.i++;
        nodo = { tipo:'binario', operador:op.valor, izq:nodo, der:this[metodo](), linea:op.linea };
      }
      return nodo;
    };
  }

  Parser.prototype.or = binario('and', ['||']);
  Parser.prototype.and = binario('igualdad', ['&&']);
  Parser.prototype.igualdad = binario('relacional', ['==','!=']);
  Parser.prototype.relacional = binario('adicion', ['<','>','<=','>=']);
  Parser.prototype.adicion = binario('multiplicacion', ['+','-']);
  Parser.prototype.multiplicacion = binario('unario', ['*','/','%']);

  Parser.prototype.unario = function(){
    const t = this.actual();
    if (t.valor === '!' || t.valor === '-' || t.valor === '+' || t.valor === '++' || t.valor === '--'){
      this.i++;
      return { tipo:'unario', operador:t.valor, expresion:this.unario(), linea:t.linea };
    }
    return this.postfijo();
  };

  Parser.prototype.postfijo = function(){
    let nodo = this.primario();
    while (true){
      if (this.aceptar('(')){
        const args = [];
        while (this.actual().valor !== ')'){
          args.push(this.expresion());
          if (this.aceptar(',')) continue;
          break;
        }
        this.esperar(')');
        nodo = { tipo:'llamada', callee:nodo, argumentos:args, linea:nodo.linea };
      } else if (this.aceptar('.')){
        const prop = this.actual();
        this.i++;
        nodo = { tipo:'miembro', objeto:nodo, propiedad:prop.valor, linea:prop.linea };
      } else if (this.actual().valor === '++' || this.actual().valor === '--'){
        const op = this.actual();
        this.i++;
        nodo = { tipo:'postfijo', operador:op.valor, expresion:nodo, linea:op.linea };
      } else break;
    }
    return nodo;
  };

  Parser.prototype.primario = function(){
    const t = this.actual();
    if (t.tipo === 'numero' || t.tipo === 'cadena'){ this.i++; return { tipo:'literal', valor:t.valor, linea:t.linea }; }
    if (t.tipo === 'id'){
      this.i++;
      return { tipo:'identificador', nombre:t.valor, linea:t.linea };
    }
    if (this.aceptar('(')){
      const e = this.expresion();
      this.esperar(')');
      return e;
    }
    throw new Error('No entiendo la expresión en la línea ' + t.linea);
  };

  function estadoInicial(){
    return {
      paso:0, vuelta:0, tiempo:0,
      pines:{},
      entradas:{ 2:0, 3:0, A0:512, A1:260, A2:23, A3:45 },
      serial:[],
      lcd:{ buffer:Array.from({length:2}, function(){ return Array(16).fill(' '); }), fila:0, columna:0 },
      matriz:Array.from({length:8}, function(){ return Array(8).fill(0); }),
      servo:90,
      motor:0
    };
  }

  function formatear(valor){
    if (valor === true) return 'true';
    if (valor === false) return 'false';
    if (typeof valor === 'number' && Math.abs(valor - Math.round(valor)) < 0.0001) return String(Math.round(valor));
    return String(valor);
  }

  function claveAnalogica(pin){
    if (typeof pin === 'number' && pin >= 0 && pin <= 5) return 'A' + pin;
    return String(pin);
  }

  function Evaluador(funciones, estado, limites){
    this.vars = Object.assign({}, CONSTANTES);
    this.funciones = funciones;
    this.estado = estado;
    this.limites = limites || {};
  }

  Evaluador.prototype.obtener = function(nombre){
    if (Object.prototype.hasOwnProperty.call(this.vars, nombre)) return this.vars[nombre];
    throw new Error('La variable "' + nombre + '" no fue declarada');
  };

  Evaluador.prototype.resolver = function(nodo){
    if (!nodo) return undefined;
    switch (nodo.tipo){
      case 'literal': return nodo.valor;
      case 'identificador': return this.obtener(nodo.nombre);
      case 'binario': {
        const a = this.resolver(nodo.izq), b = this.resolver(nodo.der);
        switch (nodo.operador){
          case '+': return Number(a) + Number(b);
          case '-': return Number(a) - Number(b);
          case '*': return Number(a) * Number(b);
          case '/': return Number(b) === 0 ? 0 : Number(a) / Number(b);
          case '%': return Number(b) === 0 ? 0 : Number(a) % Number(b);
          case '<': return Number(a) < Number(b);
          case '>': return Number(a) > Number(b);
          case '<=': return Number(a) <= Number(b);
          case '>=': return Number(a) >= Number(b);
          case '==': return a === b;
          case '!=': return a !== b;
          case '&&': return !!a && !!b;
          case '||': return !!a || !!b;
        }
        return undefined;
      }
      case 'unario': {
        const v = this.resolver(nodo.expresion);
        if (nodo.operador === '!') return !v;
        if (nodo.operador === '-') return -Number(v);
        if (nodo.operador === '++'){ const r = Number(v) + 1; this.asignarNombre(nodo.expresion, r); return r; }
        if (nodo.operador === '--'){ const r = Number(v) - 1; this.asignarNombre(nodo.expresion, r); return r; }
        return Number(v);
      }
      case 'postfijo': {
        const v = Number(this.resolver(nodo.expresion));
        this.asignarNombre(nodo.expresion, nodo.operador === '++' ? v + 1 : v - 1);
        return v;
      }
      case 'asignacion': {
        const valorActual = this.resolver(nodo.der);
        let valor = valorActual;
        if (nodo.operador !== '='){
          const anterior = Number(this.resolver(nodo.izq));
          if (nodo.operador === '+=') valor = anterior + Number(valorActual);
          if (nodo.operador === '-=') valor = anterior - Number(valorActual);
          if (nodo.operador === '*=') valor = anterior * Number(valorActual);
          if (nodo.operador === '/=') valor = Number(valorActual) === 0 ? anterior : anterior / Number(valorActual);
        }
        this.asignarNombre(nodo.izq, valor);
        return valor;
      }
      case 'llamada': return this.llamada(nodo);
      case 'miembro': return this.leerMiembro(nodo);
    }
    return undefined;
  };

  Evaluador.prototype.asignarNombre = function(nodo, valor){
    if (!nodo || nodo.tipo !== 'identificador') return;
    this.vars[nodo.nombre] = valor;
  };

  Evaluador.prototype.leerMiembro = function(nodo){
    const nombre = nodo.objeto && nodo.objeto.tipo === 'identificador' ? nodo.objeto.nombre : '';
    if (nombre === 'Serial' && nodo.propiedad === 'available') return 0;
    return undefined;
  };

  Evaluador.prototype.llamada = function(nodo){
    const args = nodo.argumentos.map(function(a){ return this.resolver(a); }, this);
    const callee = nodo.callee;
    if (callee.tipo === 'identificador'){
      const nombre = callee.nombre;
      if (this.funciones[nombre]) return undefined;
      return this.builtin(nombre, args);
    }
    if (callee.tipo === 'miembro'){
      const obj = callee.objeto && callee.objeto.tipo === 'identificador' ? callee.objeto.nombre : '';
      return this.metodo(obj, callee.propiedad, args);
    }
    return undefined;
  };

  Evaluador.prototype.builtin = function(nombre, a){
    const s = this.estado;
    switch (nombre){
      case 'pinMode': s.pines[String(a[0])] = Object.assign({ valor:0, pwm:0 }, s.pines[String(a[0])], { modo:a[1] }); return;
      case 'digitalWrite': {
        const pin = String(a[0]);
        s.pines[pin] = Object.assign({ modo:1, pwm:0 }, s.pines[pin], { valor:a[1] ? 1 : 0 });
        return;
      }
      case 'digitalRead': return Number(s.entradas[String(a[0])] || 0);
      case 'analogRead': {
        const clave = claveAnalogica(a[0]);
        return Number(s.entradas[clave] || 0);
      }
      case 'analogWrite': {
        const pin = String(a[0]);
        s.pines[pin] = Object.assign({ modo:1, valor:0 }, s.pines[pin], { pwm:Number(a[1]) || 0 });
        return;
      }
      case 'delay': s.tiempo += Number(a[0]) || 0; return;
      case 'millis': return s.tiempo;
      case 'map': {
        const x = Number(a[0]);
        const r1 = Number(a[2]) - Number(a[1]);
        const r2 = Number(a[4]) - Number(a[3]);
        return r1 === 0 ? Number(a[3]) : Number(a[3]) + (x - Number(a[1])) * r2 / r1;
      }
      case 'constrain': return Math.min(Math.max(Number(a[0]), Number(a[1])), Number(a[2]));
      case 'min': return Math.min.apply(null, a.map(Number));
      case 'max': return Math.max.apply(null, a.map(Number));
      case 'abs': return Math.abs(Number(a[0]));
      case 'round': return Math.round(Number(a[0]));
      case 'random': return Math.floor(Math.random() * ((Number(a[1]) || 1) - (Number(a[0]) || 0))) + (Number(a[0]) || 0);
      case 'tone': case 'noTone': return;
      default:
        throw new Error('La función "' + nombre + '" no está incluida en el simulador');
    }
  };

  Evaluador.prototype.metodo = function(objeto, metodo, a){
    const s = this.estado;
    if (objeto === 'Serial'){
      if (metodo === 'begin') return;
      if (metodo === 'print'){
        const texto = formatear(a[0]);
        const ultimo = s.serial[s.serial.length - 1];
        if (ultimo !== undefined && !ultimo.finLinea) ultimo.texto += texto;
        else s.serial.push({ texto:texto, finLinea:false });
        return;
      }
      if (metodo === 'println'){
        s.serial.push({ texto:a.length ? formatear(a[0]) : '', finLinea:true });
        return;
      }
      throw new Error('Serial.' + metodo + ' no está incluido en el simulador');
    }
    if (objeto === 'lcd'){
      const buf = s.lcd.buffer;
      if (metodo === 'begin'){ s.lcd.fila = 0; s.lcd.columna = 0; return; }
      if (metodo === 'clear'){
        s.lcd.buffer = Array.from({length:2}, function(){ return Array(16).fill(' '); });
        s.lcd.fila = 0; s.lcd.columna = 0;
        return;
      }
      if (metodo === 'setCursor'){ s.lcd.columna = Number(a[0]) || 0; s.lcd.fila = Number(a[1]) === 1 ? 1 : 0; return; }
      if (metodo === 'print' || metodo === 'write'){
        const texto = formatear(a[0]);
        for (const ch of texto){
          if (s.lcd.columna >= 16){ s.lcd.columna = 0; s.lcd.fila = s.lcd.fila === 0 ? 1 : 0; }
          buf[s.lcd.fila][s.lcd.columna] = ch;
          s.lcd.columna++;
        }
        return;
      }
      throw new Error('lcd.' + metodo + ' no está incluido en el simulador');
    }
    if (objeto === 'matriz'){
      if (metodo === 'clear'){ s.matriz = Array.from({length:8}, function(){ return Array(8).fill(0); }); return; }
      if (metodo === 'fill'){
        const valor = a.length ? (a[0] ? 1 : 0) : 1;
        s.matriz = Array.from({length:8}, function(){ return Array(8).fill(valor); });
        return;
      }
      if (metodo === 'setPoint'){
        const x = Number(a[0]), y = Number(a[1]);
        if (x >= 0 && x < 8 && y >= 0 && y < 8) s.matriz[y][x] = a[2] ? 1 : 0;
        return;
      }
      if (metodo === 'show') return;
      throw new Error('matriz.' + metodo + ' no está incluido en el simulador');
    }
    if (objeto === 'servo'){
      if (metodo === 'attach') return;
      if (metodo === 'write'){ s.servo = Math.max(0, Math.min(180, Number(a[0]) || 0)); return; }
      throw new Error('servo.' + metodo + ' no está incluido en el simulador');
    }
    if (objeto === 'motor'){
      if (metodo === 'write'){ s.motor = Math.max(-255, Math.min(255, Number(a[0]) || 0)); return; }
      throw new Error('motor.' + metodo + ' no está incluido en el simulador');
    }
    throw new Error('El objeto "' + objeto + '" no existe en el simulador');
  };

  function crearGenerador(cuerpo, estado, opciones){
    const funciones = {};
    cuerpo.forEach(function(n){ if (n.tipo === 'funcion') funciones[n.nombre] = n; });
    const ev = new Evaluador(funciones, estado, opciones);
    const maxPasos = opciones.maxPasos || 6000;

    function* bloque(instrucciones){
      for (const instruccion of instrucciones){
        if (estado.control) break;
        yield* ejecutar(instruccion);
      }
    }

    function* ejecutar(instruccion){
      estado.paso++;
      if (estado.paso > maxPasos) throw new Error('Demasiadas instrucciones: revisá si hay un bucle infinito');
      yield { linea:instruccion.linea, tipo:instruccion.tipo };
      switch (instruccion.tipo){
        case 'vacio': return;
        case 'bloque': yield* bloque(instruccion.cuerpo); return;
        case 'variable':
          ev.vars[instruccion.nombre] = instruccion.inicial ? ev.resolver(instruccion.inicial) : 0;
          return;
        case 'expresion': {
          const e = instruccion.expresion;
          if (e.tipo === 'llamada' && e.callee.tipo === 'identificador' && funciones[e.callee.nombre]){
            yield* llamar(e.callee.nombre);
          } else ev.resolver(e);
          return;
        }
        case 'si':
          if (ev.resolver(instruccion.condicion)) yield* ejecutar(instruccion.entonces);
          else if (instruccion.siNo) yield* ejecutar(instruccion.siNo);
          return;
        case 'para':
          if (instruccion.inicial) yield* ejecutar(instruccion.inicial);
          let vueltas = 0;
          while (!instruccion.prueba || ev.resolver(instruccion.prueba)){
            if (++vueltas > 2000) throw new Error('Un bucle for superó el límite seguro de 2000 vueltas');
            yield* ejecutar(instruccion.cuerpo);
            if (estado.control === 'romper'){ estado.control = null; break; }
            if (estado.control === 'seguir'){ estado.control = null; }
            if (instruccion.actualizacion) ev.resolver(instruccion.actualizacion);
          }
          return;
        case 'mientras': {
          let vueltas = 0;
          while (ev.resolver(instruccion.condicion)){
            if (++vueltas > 2000) throw new Error('Un bucle while superó el límite seguro de 2000 vueltas');
            yield* ejecutar(instruccion.cuerpo);
            if (estado.control === 'romper'){ estado.control = null; break; }
            if (estado.control === 'seguir') estado.control = null;
          }
          return;
        }
        case 'romper': estado.control = 'romper'; return;
        case 'seguir': estado.control = 'seguir'; return;
        case 'retorno': return;
      }
    }

    function* llamar(nombre){
      const fn = funciones[nombre];
      if (!fn) return;
      fn.parametros.forEach(function(p){ ev.vars[p] = 0; });
      yield* bloque(fn.cuerpo);
    }

    return function*(){
      yield* llamar('setup');
      for (let v = 0; v < (opciones.vueltas || 6); v++){
        estado.vuelta = v + 1;
        yield* llamar('loop');
      }
      estado.terminado = true;
    };
  }

  function crearSketch(codigo, opciones, estadoExterno){
    const tokens = tokenizar(codigo);
    const cuerpo = new Parser(tokens).programa();
    const estado = estadoExterno || estadoInicial();
    estado.terminado = false;
    estado.control = null;
    estado.paso = 0;
    estado.vuelta = 0;
    estado.tiempo = 0;
    estado.serial = [];
    // Los pines de salida vuelven a cero, pero conservamos las entradas del alumno.
    Object.keys(estado.pines).forEach(function(p){
      estado.pines[p].valor = 0;
      estado.pines[p].pwm = 0;
    });
    const gen = crearGenerador(cuerpo, estado, opciones || {})();
    return {
      estado:estado,
      paso:function(){ return gen.next(); },
      ejecutar:function(maxPasos){
        const limite = maxPasos || (opciones && opciones.maxPasos) || 6000;
        let n = 0;
        while (n < limite){
          const r = gen.next();
          n++;
          if (r.done) break;
        }
        return { pasos:n, terminado:!!estado.terminado };
      }
    };
  }

  window.ArduinoSim = {
    estadoInicial: estadoInicial,
    crearSketch: crearSketch,
    tokenizar: tokenizar,
    parsear: function(codigo){ return new Parser(tokenizar(codigo)).programa(); }
  };
})();
