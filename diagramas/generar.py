# Genera los diagramas de conexión SVG usados por la guía y la ejercitación.
# Ejecutar: python diagramas/generar.py
from pathlib import Path
from html import escape

OUT = Path(__file__).parent
W, H = 640, 290
PIN_X = 218

ROJO = '#dc2626'
NEGRO = '#0f172a'
SENAL = '#e8663d'
AZUL = '#2563eb'
VERDE = '#16a34a'
AMARILLO = '#d97706'

ESTILO = '''
  <style>
    text{font-family:"Segoe UI",Arial,sans-serif;fill:#1e293b}
    .titulo{font-size:19px;font-weight:700;fill:#00695c}
    .board{font-size:15px;font-weight:700;fill:#e0f2f1;letter-spacing:1px}
    .pin{font-size:10.5px;font-weight:700;fill:#f8fafc}
    .etq{font-size:12px;font-weight:600}
    .small{font-size:10.5px;fill:#64748b}
    .tiny{font-size:9px;fill:#334155}
    .solda{fill:#f59e0b;stroke:#ffffff;stroke-width:1.4}
    .patita{fill:#cbd5e1;stroke:#475569;stroke-width:1}
  </style>
'''

DEFS = '''
  <defs>
    <linearGradient id="tablero" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#00a6a6"/>
      <stop offset="100%" stop-color="#00796b"/>
    </linearGradient>
    <linearGradient id="pantalla" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#cfe8d8"/>
      <stop offset="100%" stop-color="#a9ccb8"/>
    </linearGradient>
  </defs>
'''


def txt(x, y, texto, clase='etq', ancla='middle'):
    return f'<text x="{x}" y="{y}" text-anchor="{ancla}" class="{clase}">{escape(str(texto))}</text>'


def wire(points, color=SENAL, width=3):
    pts = ' '.join(f'{x},{y}' for x, y in points)
    halo = (f'<polyline points="{pts}" fill="none" stroke="#ffffff" '
            f'stroke-width="{width + 4}" stroke-linejoin="round" stroke-linecap="round" opacity=".95"/>')
    linea = (f'<polyline points="{pts}" fill="none" stroke="{color}" '
             f'stroke-width="{width}" stroke-linejoin="round" stroke-linecap="round"/>')
    return halo + linea


def terminal(x, y, color=SENAL):
    return f'<circle cx="{x}" cy="{y}" r="3.2" fill="{color}" stroke="#ffffff" stroke-width="1.3"/>'


def nodo(x, y):
    return f'<circle cx="{x}" cy="{y}" r="3.6" fill="{NEGRO}" stroke="#ffffff" stroke-width="1.4"/>'


def resistor(x, y, label='220 Ω', color=SENAL):
    """Resistencia horizontal: bornes en (x, y+10) y (x+64, y+10)."""
    s = f'<rect x="{x}" y="{y}" width="64" height="20" rx="6" fill="#fff8e1" stroke="#94a3b8" stroke-width="1.5"/>'
    for dx, banda in ((12, '#7c2d12'), (23, '#111827'), (34, '#b91c1c'), (48, '#fbbf24')):
        s += f'<rect x="{x + dx}" y="{y + 2}" width="4" height="16" rx="1" fill="{banda}"/>'
    s += txt(x + 32, y - 6, label, 'tiny')
    s += terminal(x, y + 10, color) + terminal(x + 64, y + 10, color)
    return s


def resistor_v(x, y, label='10 kΩ', color=SENAL):
    """Resistencia vertical: bornes en (x, y) y (x, y+56)."""
    s = f'<rect x="{x - 10}" y="{y}" width="20" height="56" rx="5" fill="#fff8e1" stroke="#94a3b8" stroke-width="1.5"/>'
    for dy, banda in ((10, '#7c2d12'), (21, '#111827'), (32, '#b91c1c'), (44, '#fbbf24')):
        s += f'<rect x="{x - 8}" y="{y + dy}" width="16" height="4" rx="1" fill="{banda}"/>'
    s += txt(x + 18, y + 32, label, 'tiny', 'start')
    s += terminal(x, y, color) + terminal(x, y + 56, color)
    return s


def led(x, y, color='#ef4444', texto='LED'):
    """LED con ánodo a la izquierda (x-28, y) y cátodo abajo (x, y+30)."""
    s = f'<line x1="{x - 28}" y1="{y}" x2="{x - 13}" y2="{y}" class="lead"/>'
    s += f'<line x1="{x}" y1="{y + 13}" x2="{x}" y2="{y + 30}" class="lead"/>'
    s += f'<circle cx="{x}" cy="{y}" r="15" fill="{color}" stroke="{NEGRO}" stroke-width="1.6" opacity=".92"/>'
    s += (f'<path d="M{x - 5} {y + 7} L{x + 9} {y} L{x - 5} {y - 7} Z" fill="#ffffff" opacity=".92"/>'
          f'<line x1="{x + 9}" y1="{y - 8}" x2="{x + 9}" y2="{y + 8}" stroke="#ffffff" stroke-width="2"/>')
    s += txt(x, y + 46, texto, 'etq')
    s += terminal(x - 28, y, SENAL) + terminal(x, y + 30, NEGRO)
    return s


def pulsador(x, y):
    """Pulsador con cuatro patas; usamos las dos izquierdas en los esquemas."""
    s = f'<rect x="{x - 36}" y="{y - 22}" width="72" height="44" rx="7" fill="#ffffff" stroke="#475569" stroke-width="2"/>'
    for px, py in ((x - 24, y - 30), (x + 24, y - 30), (x - 24, y + 30), (x + 24, y + 30)):
        s += f'<line x1="{px}" y1="{py}" x2="{px}" y2="{y - 20 if py < y else y + 20}" class="lead"/>'
        s += f'<circle cx="{px}" cy="{py}" r="3.4" class="patita"/>'
    s += f'<circle cx="{x}" cy="{y}" r="14" fill="#e2e8f0" stroke="#94a3b8" stroke-width="2"/>'
    s += (f'<path d="M{x - 16} {y + 8} L{x + 12} {y - 10}" stroke="#e8663d" '
          f'stroke-width="3" stroke-linecap="round"/>')
    s += txt(x, y + 48, 'Pulsador', 'etq')
    return s


def potenciometro(x, y, texto='Potenciómetro 10 kΩ'):
    """Tres patas abajo: 5V, wiper(A0), GND."""
    s = f'<rect x="{x - 46}" y="{y - 32}" width="92" height="60" rx="9" fill="#ffffff" stroke="#475569" stroke-width="2"/>'
    s += f'<circle cx="{x}" cy="{y}" r="20" fill="#e2e8f0" stroke="#64748b" stroke-width="2"/>'
    s += f'<line x1="{x}" y1="{y}" x2="{x + 14}" y2="{y - 14}" stroke="#e8663d" stroke-width="3" stroke-linecap="round"/>'
    s += txt(x, y - 40, texto, 'etq')
    for px, etiqueta, color in ((x - 30, '5V', ROJO), (x, 'A0', SENAL), (x + 30, 'GND', NEGRO)):
        s += f'<line x1="{px}" y1="{y + 28}" x2="{px}" y2="{y + 38}" class="lead"/>'
        s += terminal(px, y + 38, color)
        s += txt(px, y + 52, etiqueta, 'tiny')
    return s


def lcd(x, y):
    """LCD 16x2 con 8 pads de conexión en el borde izquierdo."""
    s = f'<rect x="{x}" y="{y}" width="200" height="150" rx="8" fill="url(#pantalla)" stroke="#54776a" stroke-width="2.5"/>'
    s += f'<rect x="{x + 20}" y="{y + 18}" width="164" height="72" rx="4" fill="#a7cbb6" stroke="#6b8f7d" stroke-width="1.5"/>'
    s += txt(x + 102, y + 60, 'LCD 16x2', 'etq')
    s += txt(x + 102, y + 82, 'Hola Arduino', 'tiny')
    etiquetas = [('5V', ROJO), ('GND', NEGRO), ('RS', SENAL), ('E', SENAL),
                 ('D5', SENAL), ('D4', SENAL), ('D3', SENAL), ('D2', SENAL)]
    for i, (etq, color) in enumerate(etiquetas):
        py = y + 14 + i * 18
        s += f'<circle cx="{x}" cy="{py}" r="4.6" class="solda"/>'
        s += txt(x + 9, py + 3, etq, 'tiny', 'start')
        s += terminal(x, py, color)
    s += txt(x + 100, y + 168, 'RS D12 · E D11 · D4–D7 = 5, 4, 3, 2', 'small')
    return s


def matriz(x, y):
    """Módulo MAX7219 con pads en el borde izquierdo."""
    s = f'<rect x="{x}" y="{y}" width="122" height="122" rx="7" fill="#111827" stroke="#334155" stroke-width="2.5"/>'
    for fila in range(8):
        for col in range(8):
            enc = (fila == 3 and col in (3, 4)) or (fila in (1, 2) and col == 3)
            color = '#ef4444' if enc else '#374151'
            s += f'<circle cx="{x + 22 + col * 11}" cy="{y + 14 + fila * 11}" r="4" fill="{color}"/>'
    etiquetas = [('5V', ROJO), ('GND', NEGRO), ('DIN', SENAL), ('CS', SENAL), ('CLK', SENAL)]
    for i, (etq, color) in enumerate(etiquetas):
        py = y + 14 + i * 22
        s += f'<circle cx="{x}" cy="{py}" r="4.6" class="solda"/>'
        s += terminal(x, py, color)
        s += txt(x + 8, py + 3, etq, 'tiny', 'start')
    s += txt(x + 61, y + 141, 'Matriz 8x8 · MAX7219', 'etq')
    s += txt(x + 61, y + 157, 'DIN D11 · CS D10 · CLK D13', 'small')
    return s


def ldr(x, y):
    """LDR horizontal con bornes en x-28 y x+28."""
    s = f'<line x1="{x - 28}" y1="{y}" x2="{x - 16}" y2="{y}" class="lead"/>'
    s += f'<line x1="{x + 16}" y1="{y}" x2="{x + 28}" y2="{y}" class="lead"/>'
    s += f'<circle cx="{x}" cy="{y}" r="17" fill="#fde68a" stroke="#b45309" stroke-width="2"/>'
    for dx in (-8, 0, 8):
        s += f'<line x1="{x + dx - 6}" y1="{y - 6}" x2="{x + dx + 6}" y2="{y + 6}" stroke="#b45309" stroke-width="1.8"/>'
    s += terminal(x - 28, y, ROJO) + terminal(x + 28, y, SENAL)
    s += txt(x, y + 32, 'LDR', 'etq')
    return s


def dht(x, y):
    """DHT11 con tres patas abajo: VCC, DATA, GND."""
    s = f'<rect x="{x - 48}" y="{y - 38}" width="96" height="76" rx="6" fill="#ffffff" stroke="#475569" stroke-width="2"/>'
    for dx in (-30, -15, 0, 15, 30):
        s += f'<circle cx="{x + dx}" cy="{y - 20}" r="2.6" fill="#94a3b8"/>'
    s += txt(x, y + 8, 'DHT11', 'etq')
    for px, etiqueta, color in ((x - 24, 'VCC', ROJO), (x, 'DATA', SENAL), (x + 24, 'GND', NEGRO)):
        s += f'<line x1="{px}" y1="{y + 38}" x2="{px}" y2="{y + 48}" class="lead"/>'
        s += terminal(px, y + 48, color)
        s += txt(px, y + 62, etiqueta, 'tiny')
    return s


def ultrasonido(x, y):
    """HC-SR04 con cuatro patas abajo."""
    s = f'<rect x="{x - 70}" y="{y - 45}" width="140" height="90" rx="9" fill="#1e293b" stroke="#475569" stroke-width="2"/>'
    for dx in (-30, 30):
        s += f'<circle cx="{x + dx}" cy="{y - 10}" r="18" fill="#94a3b8" stroke="#e2e8f0" stroke-width="2"/>'
        s += f'<circle cx="{x + dx}" cy="{y - 10}" r="9" fill="#64748b"/>'
    s += (f'<text x="{x}" y="{y + 27}" text-anchor="middle" '
          f'class="etq" fill="#e2e8f0">HC-SR04</text>')
    for px, etiqueta, color in ((x - 45, 'VCC', ROJO), (x - 15, 'TRIG', SENAL),
                                (x + 15, 'ECHO', SENAL), (x + 45, 'GND', NEGRO)):
        s += f'<line x1="{px}" y1="{y + 45}" x2="{px}" y2="{y + 55}" class="lead"/>'
        s += terminal(px, y + 55, color)
        s += txt(px, y + 69, etiqueta, 'tiny')
    return s


def servo(x, y):
    """Servo con tres cables que llegan a x-70 en y-50, y e y+50."""
    s = ''
    for py, color in ((y - 50, ROJO), (y, '#f59e0b'), (y + 50, NEGRO)):
        s += wire([(x - 70, py), (x - 26, py)], color, 4)
        s += terminal(x - 70, py, color)
    s += f'<circle cx="{x}" cy="{y}" r="34" fill="#e8663d" stroke="#9a3412" stroke-width="2.2"/>'
    s += f'<circle cx="{x}" cy="{y}" r="11" fill="#fed7aa" stroke="#9a3412"/>'
    s += (f'<path d="M{x} {y - 10} L{x + 36} {y - 30} L{x + 46} {y - 18}" '
          f'fill="none" stroke="#475569" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>')
    s += txt(x, y + 58, 'Micro servo SG90', 'etq')
    s += txt(x, y + 74, 'Señal D9 · 5 V · GND', 'small')
    return s


def motor(x, y):
    """Driver L293D + motor, con pads en el borde izquierdo."""
    s = f'<rect x="{x - 68}" y="{y - 42}" width="136" height="42" rx="6" fill="#1e293b" stroke="#475569" stroke-width="2"/>'
    s += f'<text x="{x}" y="{y - 15}" text-anchor="middle" class="etq" fill="#e2e8f0">Driver L293D</text>'
    etiquetas = [('IN1', 80, SENAL), ('IN2', 105, SENAL), ('ENA', 130, SENAL),
                 ('5V', 155, ROJO), ('GND', 180, NEGRO)]
    for etq, py, color in etiquetas:
        s += f'<circle cx="{x - 68}" cy="{py}" r="4.6" class="solda"/>'
        s += terminal(x - 68, py, color)
        s += txt(x - 60, py + 3, etq, 'tiny', 'start')
    s += f'<circle cx="{x}" cy="{y + 42}" r="30" fill="#e2e8f0" stroke="#475569" stroke-width="2"/>'
    s += txt(x, y + 49, 'M', 'etq')
    s += wire([(x - 12, y + 12), (x - 20, y + 32)], AZUL, 2.5)
    s += wire([(x + 12, y + 12), (x + 20, y + 32)], AZUL, 2.5)
    s += txt(x + 4, y + 86, 'Fuente externa para el motor · GND común', 'small')
    return s


def board_base(pins):
    s = '<rect x="20" y="52" width="220" height="190" rx="16" fill="url(#tablero)" stroke="#005b52" stroke-width="3"/>'
    # Conector USB y entrada de alimentación.
    s += '<rect x="4" y="88" width="30" height="38" rx="4" fill="#cbd5e1" stroke="#64748b" stroke-width="2"/>'
    s += '<rect x="9" y="94" width="20" height="26" rx="2" fill="#94a3b8"/>'
    s += '<rect x="8" y="196" width="36" height="28" rx="5" fill="#111827" stroke="#475569" stroke-width="2"/>'
    s += '<circle cx="26" cy="210" r="7" fill="#0f172a" stroke="#64748b" stroke-width="2"/>'
    # Plaque y circuitos decorativos.
    s += '<rect x="60" y="150" width="66" height="20" rx="3" fill="#111827" stroke="#334155"/>'
    s += '<rect x="132" y="152" width="38" height="16" rx="2" fill="#111827" stroke="#334155"/>'
    s += '<rect x="60" y="102" width="16" height="16" rx="2" fill="#111827" stroke="#334155"/>'
    for dx, color, etq in ((0, '#22c55e', 'ON'), (22, '#facc15', 'L'), (44, '#facc15', 'TX'), (66, '#facc15', 'RX')):
        s += f'<rect x="{60 + dx}" y="128" width="12" height="8" rx="2" fill="{color}" stroke="#ffffff" stroke-width="1"/>'
        s += txt(66 + dx, 126, etq, 'tiny')
    # Header derecho donde salen los cables.
    s += '<rect x="204" y="62" width="28" height="166" rx="4" fill="#111827" opacity=".96"/>'
    s += txt(112, 74, 'ARDUINO UNO', 'board')
    s += txt(112, 190, 'DIGITAL  ·  ANALÓGICO', 'tiny')
    return s


def board_pins(pins):
    s = ''
    for etiqueta, y in pins:
        s += txt(198, y + 4, etiqueta, 'pin', 'end')
        s += f'<circle cx="{PIN_X}" cy="{y}" r="5.4" fill="#ffffff" opacity=".16"/>'
        s += f'<circle cx="{PIN_X}" cy="{y}" r="3.6" class="solda"/>'
    return s


def leyenda():
    s = '<line x1="32" y1="272" x2="58" y2="272" stroke="' + ROJO + '" stroke-width="4" stroke-linecap="round"/>'
    s += txt(64, 276, '5 V', 'tiny', 'start')
    s += '<line x1="104" y1="272" x2="130" y2="272" stroke="' + NEGRO + '" stroke-width="4" stroke-linecap="round"/>'
    s += txt(136, 276, 'GND', 'tiny', 'start')
    s += '<line x1="182" y1="272" x2="208" y2="272" stroke="' + SENAL + '" stroke-width="4" stroke-linecap="round"/>'
    s += txt(214, 276, 'Señal', 'tiny', 'start')
    s += '<line x1="266" y1="272" x2="292" y2="272" stroke="' + AZUL + '" stroke-width="4" stroke-linecap="round"/>'
    s += txt(298, 276, 'Datos', 'tiny', 'start')
    s += txt(608, 276, 'Esquema de conexión · Arduino Uno', 'tiny', 'end')
    return s


def svg(titulo, pins, cuerpo):
    return f'''<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}" role="img" aria-label="{escape(titulo, quote=True)}">
{DEFS}{ESTILO}
  <rect width="{W}" height="{H}" rx="14" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
  {txt(32, 34, titulo, 'titulo', 'start')}
  {board_base(pins)}
  {cuerpo}
  {board_pins(pins)}
  {leyenda()}
</svg>
'''


def diagrama(nombre, titulo, pins, cuerpo):
    (OUT / nombre).write_text(svg(titulo, pins, cuerpo), encoding='utf-8')


# 1. LED integrado / LED externo en D13.
diagrama('led.svg', 'LED intermitente en D13',
         [('5V', 78), ('D13', 130), ('GND', 190)],
         wire([(PIN_X, 130), (330, 130)], SENAL) +
         resistor(330, 120, '220 Ω') +
         wire([(394, 130), (442, 130)], SENAL) +
         led(470, 130, '#ef4444', 'LED D13') +
         wire([(470, 160), (520, 160), (520, 190), (PIN_X, 190)], NEGRO) +
         txt(362, 186, 'Ánodo → D13   Cátodo → GND', 'small'))

# 2. Botón con resistencia pull-up interna.
diagrama('boton.svg', 'Botón con INPUT_PULLUP en D2',
         [('D2', 100), ('D13', 150), ('GND', 200)],
         wire([(PIN_X, 100), (356, 100)], SENAL) +
         wire([(356, 100), (356, 75), (426, 75)], SENAL) +
         pulsador(450, 105) +
         wire([(426, 135), (426, 200), (PIN_X, 200)], NEGRO) +
         wire([(PIN_X, 150), (320, 150)], SENAL) +
         resistor(320, 140, '220 Ω') +
         wire([(384, 150), (442, 150)], SENAL) +
         led(470, 150, '#22c55e', 'LED D13') +
         wire([(470, 180), (550, 180), (550, 200), (426, 200)], NEGRO) +
         txt(450, 232, 'Sin resistencia externa en el botón: INPUT_PULLUP', 'small'))

# 3. Semáforo con tres LEDs.
diagrama('semaforo.svg', 'Semáforo con tres LEDs',
         [('D8', 82), ('D9', 130), ('D10', 178), ('GND', 220)],
         wire([(PIN_X, 82), (310, 82)], SENAL) + resistor(310, 72, '220 Ω') +
         wire([(374, 82), (412, 82)], SENAL) + led(440, 82, '#ef4444', 'Rojo') +
         wire([(PIN_X, 130), (310, 130)], SENAL) + resistor(310, 120, '220 Ω') +
         wire([(374, 130), (412, 130)], SENAL) + led(440, 130, '#facc15', 'Amarillo') +
         wire([(PIN_X, 178), (310, 178)], SENAL) + resistor(310, 168, '220 Ω') +
         wire([(374, 178), (412, 178)], SENAL) + led(440, 178, '#22c55e', 'Verde') +
         wire([(440, 112), (500, 112), (500, 220), (PIN_X, 220)], NEGRO) +
         wire([(440, 160), (500, 160)], NEGRO) +
         wire([(440, 208), (500, 208)], NEGRO) +
         txt(500, 244, 'Un LED encendido a la vez · delay(1000)', 'small'))

# 4. Potenciómetro en A0.
diagrama('potenciometro.svg', 'Potenciómetro en A0',
         [('5V', 82), ('A0', 140), ('GND', 198)],
         wire([(PIN_X, 82), (398, 82), (398, 130), (435, 130)], ROJO) +
         wire([(PIN_X, 198), (510, 198), (510, 130), (495, 130)], NEGRO) +
         wire([(PIN_X, 140), (465, 130)], SENAL) +
         potenciometro(465, 92, 'Potenciómetro 10 kΩ') +
         txt(465, 226, 'analogRead(A0) devuelve 0 – 1023', 'small'))

# 5. PWM: potenciómetro + LED.
diagrama('pwm.svg', 'PWM: potenciómetro y LED en D9',
         [('5V', 70), ('A0', 112), ('D9', 168), ('GND', 214)],
         wire([(PIN_X, 70), (390, 70), (390, 110), (410, 110)], ROJO) +
         wire([(PIN_X, 214), (520, 214), (520, 110), (470, 110)], NEGRO) +
         wire([(PIN_X, 112), (440, 110)], SENAL) +
         potenciometro(440, 72, 'Potenciómetro 10 kΩ') +
         wire([(PIN_X, 168), (300, 168)], SENAL) +
         resistor(300, 158, '220 Ω') +
         wire([(364, 168), (412, 168)], SENAL) +
         led(440, 168, '#60a5fa', 'Brillo PWM') +
         wire([(440, 198), (520, 198), (520, 214)], NEGRO) +
         txt(470, 232, 'analogWrite(9, brillo)', 'small'))

# 6. Umbral analógico con LED.
diagrama('umbral.svg', 'Umbral analógico con LED en D13',
         [('5V', 70), ('A0', 112), ('D13', 168), ('GND', 214)],
         wire([(PIN_X, 70), (390, 70), (390, 110), (410, 110)], ROJO) +
         wire([(PIN_X, 214), (520, 214), (520, 110), (470, 110)], NEGRO) +
         wire([(PIN_X, 112), (440, 110)], SENAL) +
         potenciometro(440, 72, 'Potenciómetro 10 kΩ') +
         wire([(PIN_X, 168), (300, 168)], SENAL) +
         resistor(300, 158, '220 Ω') +
         wire([(364, 168), (412, 168)], SENAL) +
         led(440, 168, '#22c55e', 'LED D13') +
         wire([(440, 198), (520, 198), (520, 214)], NEGRO) +
         txt(470, 232, 'if (valor &gt; 512) enciende', 'small'))

# 7. LCD 16x2.
diagrama('lcd.svg', 'Pantalla LCD 16x2',
         [('5V', 70), ('GND', 88), ('D12', 106), ('D11', 124),
          ('D5', 142), ('D4', 160), ('D3', 178), ('D2', 196)],
         wire([(PIN_X, 70), (350, 70)], ROJO) +
         wire([(PIN_X, 88), (350, 88)], NEGRO) +
         wire([(PIN_X, 106), (350, 106)], SENAL) +
         wire([(PIN_X, 124), (350, 124)], SENAL) +
         wire([(PIN_X, 142), (350, 142)], SENAL) +
         wire([(PIN_X, 160), (350, 160)], SENAL) +
         wire([(PIN_X, 178), (350, 178)], SENAL) +
         wire([(PIN_X, 196), (350, 196)], SENAL) +
         lcd(350, 56))

# 8. Matriz 8x8 con MAX7219.
diagrama('matriz.svg', 'Matriz LED 8x8 con MAX7219',
         [('5V', 74), ('GND', 96), ('D11', 118), ('D10', 140), ('D13', 162)],
         wire([(PIN_X, 74), (420, 74)], ROJO) +
         wire([(PIN_X, 96), (420, 96)], NEGRO) +
         wire([(PIN_X, 118), (420, 118)], SENAL) +
         wire([(PIN_X, 140), (420, 140)], SENAL) +
         wire([(PIN_X, 162), (420, 162)], SENAL) +
         matriz(420, 60))

# 9. Divisor con LDR y LED indicador.
diagrama('ldr.svg', 'Sensor de luz LDR en A1',
         [('5V', 74), ('A1', 112), ('GND', 154), ('D13', 196)],
         wire([(PIN_X, 74), (392, 74), (392, 80)], ROJO) +
         ldr(420, 80) +
         wire([(448, 80), (470, 80)], SENAL) +
         resistor(470, 70, '10 kΩ', SENAL) +
         wire([(534, 80), (560, 80), (560, 154), (PIN_X, 154)], NEGRO) +
         wire([(459, 80), (459, 112), (PIN_X, 112)], SENAL) + nodo(459, 80) +
         wire([(PIN_X, 196), (300, 196)], SENAL) +
         resistor(300, 186, '220 Ω') +
         wire([(364, 196), (412, 196)], SENAL) +
         led(440, 196, '#facc15', 'LED D13') +
         wire([(440, 226), (560, 226), (560, 154)], NEGRO))

# 10. DHT11 real con pull-up y LED indicador.
diagrama('dht.svg', 'Sensor DHT11 real',
         [('5V', 70), ('D2', 110), ('GND', 150), ('D13', 192)],
         wire([(PIN_X, 70), (386, 70), (386, 138), (406, 138)], ROJO) +
         wire([(PIN_X, 110), (430, 110), (430, 138)], SENAL) +
         wire([(PIN_X, 150), (474, 150), (474, 138), (454, 138)], NEGRO) +
         dht(430, 90) +
         wire([(386, 70), (520, 70), (520, 82)], ROJO) +
         resistor_v(520, 82, '4,7 kΩ', ROJO) +
         wire([(520, 138), (520, 138), (430, 138)], ROJO) +
         wire([(PIN_X, 192), (300, 192)], SENAL) +
         resistor(300, 182, '220 Ω') +
         wire([(364, 192), (412, 192)], SENAL) +
         led(440, 192, '#22c55e', 'LED D13') +
         wire([(440, 222), (560, 222), (560, 150), (474, 150)], NEGRO) +
         txt(520, 196, 'En Tinkercad usar TMP36 en A2', 'small'))

# 11. HC-SR04.
diagrama('ultrasonido.svg', 'Sensor ultrasónico HC-SR04',
         [('5V', 70), ('D9', 110), ('D10', 150), ('GND', 190)],
         wire([(PIN_X, 70), (455, 70), (455, 120)], ROJO) +
         wire([(PIN_X, 110), (485, 110), (485, 120)], SENAL) +
         wire([(PIN_X, 150), (515, 150), (515, 120)], SENAL) +
         wire([(PIN_X, 190), (545, 190), (545, 120)], NEGRO) +
         ultrasonido(500, 65) +
         txt(500, 208, 'TRIG D9 · ECHO D10 · 5 V · GND', 'small'))

# 12. Servo SG90.
diagrama('servo.svg', 'Servo SG90 en D9',
         [('5V', 80), ('D9', 130), ('GND', 180)],
         wire([(PIN_X, 80), (430, 80)], ROJO) +
         wire([(PIN_X, 130), (430, 130)], SENAL) +
         wire([(PIN_X, 180), (430, 180)], NEGRO) +
         servo(500, 130))

# 13. Motor con driver L293D.
diagrama('motor.svg', 'Motor DC con driver L293D',
         [('D7', 80), ('D8', 105), ('D9', 130), ('5V', 155), ('GND', 180)],
         wire([(PIN_X, 80), (432, 80)], SENAL) +
         wire([(PIN_X, 105), (432, 105)], SENAL) +
         wire([(PIN_X, 130), (432, 130)], SENAL) +
         wire([(PIN_X, 155), (432, 155)], ROJO) +
         wire([(PIN_X, 180), (432, 180)], NEGRO) +
         motor(500, 110))

# 14. Recursos de la placa.
diagrama('arduino.svg', 'Arduino Uno: recursos usados en el curso',
         [('D13', 90), ('A0', 140), ('5V', 180), ('GND', 220)],
         txt(300, 84, '14 pines digitales D0–D13', 'etq', 'start') +
         txt(300, 120, '6 entradas analógicas A0–A5', 'etq', 'start') +
         txt(300, 156, 'PWM: 3, 5, 6, 9, 10 y 11', 'etq', 'start') +
         txt(300, 192, 'Regulares 5 V, 3,3 V y varios GND', 'etq', 'start') +
         txt(300, 228, 'LED integrado en D13 · carga por USB', 'small', 'start') +
         wire([(PIN_X, 90), (286, 90)], '#94a3b8', 2) +
         wire([(PIN_X, 140), (286, 140)], '#94a3b8', 2) +
         wire([(PIN_X, 180), (286, 180)], '#94a3b8', 2) +
         wire([(PIN_X, 220), (286, 220)], '#94a3b8', 2))

# 15. Robot con dos estados: botón + servo.
diagrama('robot.svg', 'Robot con dos estados: botón y servo',
         [('5V', 80), ('D2', 120), ('D9', 160), ('GND', 210)],
         wire([(PIN_X, 80), (430, 80)], ROJO) +
         wire([(PIN_X, 120), (340, 120), (340, 75), (426, 75)], SENAL) +
         pulsador(450, 105) +
         wire([(426, 135), (426, 210), (PIN_X, 210)], NEGRO) +
         wire([(PIN_X, 160), (430, 130)], SENAL) +
         wire([(PIN_X, 210), (400, 210), (400, 180), (430, 180)], NEGRO) +
         servo(500, 130) +
         txt(450, 246, 'estado 0 / estado 1 con servo.write()', 'small'))

print(f'Generados {len(list(OUT.glob("*.svg")))} diagramas en {OUT}')
