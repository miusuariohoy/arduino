# Genera los diagramas de conexión SVG usados por la guía y la ejercitación.
# Ejecutar: python diagramas/generar.py
from pathlib import Path

OUT = Path(__file__).parent

ESTILO = '''
  <style>
    text{font-family:"Segoe UI",Arial,sans-serif;fill:#1e293b}
    .titulo{font-size:20px;font-weight:700;fill:#00695c}
    .pin{font-size:13px;font-weight:700;fill:#f8fafc}
    .etq{font-size:13px}
    .small{font-size:11px;fill:#64748b}
    .board{font-size:16px;font-weight:700;fill:#e0f2f1;letter-spacing:1px}
  </style>
'''

def board(pins):
    s = '<rect x="24" y="52" width="210" height="170" rx="18" fill="#00979c" stroke="#00695c" stroke-width="3"/>'
    s += '<text x="129" y="82" text-anchor="middle" class="board">ARDUINO UNO</text>'
    s += '<rect x="42" y="96" width="168" height="104" rx="8" fill="#e0f2f1" opacity=".35"/>'
    for label, y in pins:
        s += f'<circle cx="234" cy="{y}" r="7" fill="#fde047" stroke="#ffffff" stroke-width="2"/>'
        s += f'<text x="222" y="{y + 5}" text-anchor="end" class="pin">{label}</text>'
    return s

def wire(points, color='#334155', width=3):
    pts = ' '.join(f'{x},{y}' for x, y in points)
    return f'<polyline points="{pts}" fill="none" stroke="{color}" stroke-width="{width}" stroke-linejoin="round" stroke-linecap="round"/>'

def resistor(x, y, label='220 Ω'):
    return (f'<rect x="{x}" y="{y}" width="64" height="22" rx="5" fill="#ffffff" stroke="#334155" stroke-width="2"/>'
            f'<text x="{x + 32}" y="{y + 16}" text-anchor="middle" class="etq">{label}</text>')

def led(x, y, color='#ef4444', texto='LED'):
    return (f'<circle cx="{x}" cy="{y}" r="17" fill="{color}" opacity=".85" stroke="#991b1b" stroke-width="2"/>'
            f'<path d="M{x - 7} {y + 7} L{x + 7} {y - 7} M{x + 1} {y - 8} L{x + 8} {y - 8} L{x + 8} {y - 1}" stroke="#ffffff" stroke-width="2" fill="none"/>'
            f'<text x="{x}" y="{y + 38}" text-anchor="middle" class="etq">{texto}</text>')

def pushbutton(x, y):
    return (f'<rect x="{x - 34}" y="{y - 20}" width="68" height="40" rx="6" fill="#ffffff" stroke="#334155" stroke-width="2"/>'
            f'<circle cx="{x - 22}" cy="{y}" r="5" fill="#94a3b8"/><circle cx="{x + 22}" cy="{y}" r="5" fill="#94a3b8"/>'
            f'<path d="M{x - 22} {y} L{x + 10} {y - 12}" stroke="#e8663d" stroke-width="3"/>'
            f'<text x="{x}" y="{y + 46}" text-anchor="middle" class="etq">Pulsador</text>')

def potenciometro(x, y, texto='Potenciómetro 10 kΩ'):
    return (f'<rect x="{x - 40}" y="{y - 28}" width="80" height="56" rx="8" fill="#ffffff" stroke="#334155" stroke-width="2"/>'
            f'<circle cx="{x}" cy="{y}" r="18" fill="#e2e8f0" stroke="#64748b" stroke-width="2"/>'
            f'<path d="M{x} {y} L{x + 13} {y - 13}" stroke="#e8663d" stroke-width="3"/>'
            f'<text x="{x}" y="{y + 52}" text-anchor="middle" class="etq">{texto}</text>')

def lcd(x, y):
    s = f'<rect x="{x}" y="{y}" width="180" height="90" rx="6" fill="#a9c7b6" stroke="#54776a" stroke-width="3"/>'
    s += f'<rect x="{x + 12}" y="{y + 12}" width="156" height="64" rx="3" fill="#b9d8c4" stroke="#54776a"/>'
    s += f'<text x="{x + 90}" y="{y + 52}" text-anchor="middle" class="etq">LCD 16x2</text>'
    s += f'<text x="{x + 90}" y="{y + 112}" text-anchor="middle" class="etq">RS 12 · E 11 · D4-D7 = 5,4,3,2</text>'
    return s

def matriz(x, y):
    s = f'<rect x="{x}" y="{y}" width="104" height="104" rx="6" fill="#111827" stroke="#334155" stroke-width="3"/>'
    for fila in range(8):
        for col in range(8):
            enc = (fila == 3 and col in (3, 4)) or (fila in (1, 2) and col == 3)
            color = '#ef4444' if enc else '#374151'
            s += f'<circle cx="{x + 10 + col * 12}" cy="{y + 10 + fila * 12}" r="4" fill="{color}"/>'
    s += f'<text x="{x + 52}" y="{y + 130}" text-anchor="middle" class="etq">Matriz 8x8 MAX7219</text>'
    s += f'<text x="{x + 52}" y="{y + 148}" text-anchor="middle" class="small">DIN 11 · CS 10 · CLK 13</text>'
    return s

def ldr(x, y):
    return (f'<circle cx="{x}" cy="{y}" r="19" fill="#fde68a" stroke="#b45309" stroke-width="2"/>'
            f'<path d="M{x - 32} {y} L{x - 19} {y} M{x + 19} {y} L{x + 32} {y}" stroke="#334155" stroke-width="3"/>'
            f'<path d="M{x - 10} {y - 10} L{x + 10} {y + 10} M{x + 10} {y - 10} L{x - 10} {y + 10}" stroke="#b45309" stroke-width="2"/>'
            f'<text x="{x}" y="{y + 42}" text-anchor="middle" class="etq">LDR</text>')

def dht(x, y):
    s = f'<rect x="{x - 45}" y="{y - 38}" width="90" height="76" rx="5" fill="#ffffff" stroke="#334155" stroke-width="2"/>'
    for dx in (-28, -14, 0, 14, 28):
        s += f'<circle cx="{x + dx}" cy="{y - 20}" r="3" fill="#94a3b8"/>'
    s += f'<text x="{x}" y="{y + 10}" text-anchor="middle" class="etq">DHT11</text>'
    s += f'<text x="{x}" y="{y + 58}" text-anchor="middle" class="small">DATA D2 + pull-up 4,7 kΩ</text>'
    return s

def ultrasonido(x, y):
    s = f'<rect x="{x - 62}" y="{y - 40}" width="124" height="80" rx="8" fill="#1e293b" stroke="#334155" stroke-width="2"/>'
    s += f'<circle cx="{x - 28}" cy="{y - 6}" r="16" fill="#94a3b8" stroke="#e2e8f0" stroke-width="2"/>'
    s += f'<circle cx="{x + 28}" cy="{y - 6}" r="16" fill="#94a3b8" stroke="#e2e8f0" stroke-width="2"/>'
    s += f'<text x="{x}" y="{y + 28}" text-anchor="middle" fill="#e2e8f0" class="etq">HC-SR04</text>'
    s += f'<text x="{x}" y="{y + 62}" text-anchor="middle" class="small">TRIG D9 · ECHO D10</text>'
    return s

def servo(x, y):
    s = f'<circle cx="{x}" cy="{y}" r="34" fill="#e8663d" stroke="#9a3412" stroke-width="2"/>'
    s += f'<circle cx="{x}" cy="{y}" r="11" fill="#fed7aa"/>'
    s += f'<path d="M{x} {y - 10} L{x + 36} {y - 30} M{x + 36} {y - 30} L{x + 46} {y - 18}" stroke="#334155" stroke-width="4" fill="none"/>'
    s += f'<text x="{x}" y="{y + 60}" text-anchor="middle" class="etq">Micro servo SG90</text>'
    s += f'<text x="{x}" y="{y + 78}" text-anchor="middle" class="small">Señal D9 · 5 V · GND</text>'
    return s

def motor(x, y):
    s = f'<rect x="{x - 60}" y="{y - 45}" width="120" height="34" rx="5" fill="#ffffff" stroke="#334155" stroke-width="2"/>'
    s += f'<text x="{x}" y="{y - 23}" text-anchor="middle" class="etq">Driver L293D</text>'
    s += f'<circle cx="{x}" cy="{y + 18}" r="30" fill="#e2e8f0" stroke="#334155" stroke-width="2"/>'
    s += f'<text x="{x}" y="{y + 25}" text-anchor="middle" class="etq">M</text>'
    s += f'<text x="{x}" y="{y + 66}" text-anchor="middle" class="small">IN1 D7 · IN2 D8 · ENA D9</text>'
    return s

def svg(title, body):
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 260" role="img" aria-label="{title}">
{ESTILO}
  <rect width="640" height="260" rx="14" fill="#ffffff" stroke="#cbd5e1" stroke-width="2"/>
  <text x="32" y="36" class="titulo">{title}</text>
  <text x="608" y="36" text-anchor="end" class="small">Rojo = 5 V · Negro = GND · Naranja = señal</text>
{board(body[0])}
{body[1]}
</svg>
'''

def diagrama(nombre, titulo, pins, cuerpo):
    (OUT / nombre).write_text(svg(titulo, (pins, cuerpo)), encoding='utf-8')

diagrama('led.svg', 'LED intermitente en D13', [('D13', 130), ('GND', 200)],
    wire([(241, 130), (330, 130)], '#e8663d') + resistor(330, 119) +
    wire([(394, 130), (440, 130)], '#e8663d') + led(470, 130) +
    wire([(470, 147), (470, 200), (241, 200)], '#0f172a') +
    '<text x="330" y="104" class="small">Resistencia limitadora</text>')

diagrama('boton.svg', 'Botón con INPUT_PULLUP en D2', [('D2', 130), ('GND', 200), ('D13', 100)],
    wire([(241, 130), (380, 130)], '#e8663d') + pushbutton(450, 130) +
    wire([(450, 150), (450, 200), (241, 200)], '#0f172a') +
    wire([(241, 100), (330, 100)], '#e8663d') + resistor(330, 89) +
    wire([(394, 100), (440, 100)], '#e8663d') + led(470, 100, '#22c55e', 'LED D13') +
    wire([(470, 117), (540, 117), (540, 200), (470, 200)], '#0f172a') +
    '<text x="450" y="232" text-anchor="middle" class="small">Sin resistencia externa: INPUT_PULLUP</text>')

diagrama('semaforo.svg', 'Semáforo con tres LEDs', [('D8', 90), ('D9', 140), ('D10', 190), ('GND', 220)],
    wire([(241, 90), (320, 90)], '#e8663d') + resistor(320, 79) + wire([(384, 90), (420, 90)], '#e8663d') + led(450, 90, '#ef4444', 'Rojo') +
    wire([(241, 140), (320, 140)], '#e8663d') + resistor(320, 129) + wire([(384, 140), (420, 140)], '#e8663d') + led(450, 140, '#facc15', 'Amarillo') +
    wire([(241, 190), (320, 190)], '#e8663d') + resistor(320, 179) + wire([(384, 190), (420, 190)], '#e8663d') + led(450, 190, '#22c55e', 'Verde') +
    wire([(450, 207), (520, 207), (520, 220), (241, 220)], '#0f172a') +
    '<text x="450" y="245" text-anchor="middle" class="small">Un LED encendido a la vez · delay(1000)</text>')

diagrama('potenciometro.svg', 'Potenciómetro en A0', [('A0', 140), ('5V', 90), ('GND', 200)],
    wire([(241, 90), (420, 90), (420, 104)], '#dc2626') + wire([(241, 200), (360, 200), (360, 164)], '#0f172a') +
    wire([(241, 140), (450, 140)], '#e8663d') + potenciometro(450, 135) +
    '<text x="450" y="208" text-anchor="middle" class="small">0 – 1023 en analogRead(A0)</text>')

diagrama('pwm.svg', 'PWM: potenciómetro y LED en D9', [('A0', 120), ('D9', 180), ('GND', 220), ('5V', 80)],
    wire([(241, 80), (390, 80), (390, 118)], '#dc2626') + wire([(241, 220), (330, 220), (330, 150)], '#0f172a') +
    wire([(241, 120), (450, 120)], '#e8663d') + potenciometro(450, 135) +
    wire([(241, 180), (330, 180)], '#e8663d') + resistor(330, 169) + wire([(394, 180), (430, 180)], '#e8663d') + led(460, 180, '#60a5fa', 'Brillo PWM') +
    wire([(460, 197), (500, 197), (500, 220), (241, 220)], '#0f172a'))

diagrama('umbral.svg', 'Umbral analógico con LED en D13', [('A0', 120), ('D13', 180), ('GND', 220), ('5V', 80)],
    wire([(241, 80), (390, 80), (390, 118)], '#dc2626') + wire([(241, 220), (330, 220), (330, 150)], '#0f172a') +
    wire([(241, 120), (450, 120)], '#e8663d') + potenciometro(450, 135) +
    wire([(241, 180), (330, 180)], '#e8663d') + resistor(330, 169) + wire([(394, 180), (430, 180)], '#e8663d') + led(460, 180, '#22c55e', 'LED D13') +
    wire([(460, 197), (505, 197), (505, 220), (241, 220)], '#0f172a') +
    '<text x="470" y="232" text-anchor="middle" class="small">if (valor &gt; 512) enciende</text>')

diagrama('lcd.svg', 'Pantalla LCD 16x2', [('D12', 78), ('D11', 100), ('D5', 122), ('D4', 144), ('D3', 166), ('D2', 188), ('GND', 212), ('5V', 62)],
    wire([(241, 78), (330, 78), (330, 96), (350, 96)], '#e8663d') +
    wire([(241, 100), (350, 100)], '#e8663d') +
    wire([(241, 122), (350, 122)], '#e8663d') +
    wire([(241, 144), (350, 144)], '#e8663d') +
    wire([(241, 166), (350, 166)], '#e8663d') +
    wire([(241, 188), (350, 188)], '#e8663d') +
    wire([(241, 212), (350, 212)], '#0f172a') +
    wire([(241, 62), (350, 62)], '#dc2626') + lcd(350, 70))

diagrama('matriz.svg', 'Matriz LED 8x8 con MAX7219', [('D11', 100), ('D10', 140), ('D13', 180), ('GND', 215), ('5V', 70)],
    wire([(241, 100), (390, 100), (390, 108), (420, 108)], '#e8663d') +
    wire([(241, 140), (420, 140)], '#e8663d') +
    wire([(241, 180), (390, 180), (390, 172), (420, 172)], '#e8663d') +
    wire([(241, 215), (420, 215)], '#0f172a') +
    wire([(241, 70), (420, 70)], '#dc2626') + matriz(420, 70))

diagrama('ldr.svg', 'Sensor de luz LDR en A1', [('A1', 130), ('GND', 200), ('D13', 90), ('5V', 70)],
    wire([(241, 70), (400, 70), (400, 112)], '#dc2626') + ldr(400, 132) +
    wire([(400, 152), (400, 200), (241, 200)], '#0f172a') +
    resistor(430, 186, '10 kΩ') + wire([(241, 130), (470, 130), (470, 142), (430 + 64, 197)], '#e8663d') +
    wire([(241, 90), (330, 90)], '#e8663d') + resistor(330, 79) + wire([(394, 90), (430, 90)], '#e8663d') + led(460, 90, '#facc15', 'LED D13') +
    wire([(460, 107), (540, 107), (540, 200), (470, 200)], '#0f172a'))

diagrama('dht.svg', 'Sensor DHT11 real', [('D2', 130), ('GND', 200), ('5V', 80), ('D13', 95)],
    wire([(241, 80), (430, 80), (430, 100)], '#dc2626') +
    wire([(241, 200), (420, 200), (420, 155)], '#0f172a') +
    wire([(241, 130), (470, 130), (470, 110), (445, 110)], '#e8663d') + resistor(470, 150, '4,7 kΩ') +
    wire([(470, 161), (470, 200), (420, 200)], '#dc2626') + dht(430, 130) +
    wire([(241, 95), (320, 95)], '#e8663d') + resistor(320, 84) + wire([(384, 95), (330, 95)], '#e8663d') +
    '<text x="470" y="232" text-anchor="middle" class="small">En Tinkercad usar TMP36 en A2</text>')

diagrama('ultrasonido.svg', 'Sensor ultrasónico HC-SR04', [('D9', 110), ('D10', 150), ('GND', 200), ('5V', 75)],
    wire([(241, 110), (390, 110), (390, 102), (420, 102)], '#e8663d') +
    wire([(241, 150), (420, 150)], '#e8663d') +
    wire([(241, 200), (420, 200)], '#0f172a') +
    wire([(241, 75), (420, 75)], '#dc2626') + ultrasonido(500, 135))

diagrama('servo.svg', 'Servo SG90 en D9', [('D9', 130), ('GND', 200), ('5V', 80)],
    wire([(241, 80), (430, 80), (430, 112)], '#dc2626') +
    wire([(241, 200), (430, 200), (430, 160)], '#0f172a') +
    wire([(241, 130), (430, 130)], '#e8663d') + servo(490, 135))

diagrama('motor.svg', 'Motor DC con driver L293D', [('D7', 95), ('D8', 130), ('D9', 165), ('GND', 210), ('5V', 70)],
    wire([(241, 95), (390, 95), (390, 88), (420, 88)], '#e8663d') +
    wire([(241, 130), (420, 130)], '#e8663d') +
    wire([(241, 165), (390, 165), (390, 102), (420, 102)], '#e8663d') +
    wire([(241, 210), (420, 210)], '#0f172a') +
    wire([(241, 70), (420, 70)], '#dc2626') + motor(500, 145))

diagrama('arduino.svg', 'Arduino Uno: recursos usados en el curso', [('D13', 90), ('A0', 140), ('5V', 180), ('GND', 220)],
    '<text x="300" y="86" class="etq">14 pines digitales (D0–D13)</text>' +
    '<text x="300" y="120" class="etq">6 entradas analógicas (A0–A5)</text>' +
    '<text x="300" y="154" class="etq">PWM: pines 3, 5, 6, 9, 10 y 11</text>' +
    '<text x="300" y="188" class="etq">Regulares 5 V y 3,3 V · varios GND</text>' +
    '<text x="300" y="222" class="small">LED integrado en D13 · carga por USB</text>')

diagrama('robot.svg', 'Robot con dos estados: botón y servo', [('D2', 110), ('D9', 160), ('GND', 215), ('5V', 75)],
    wire([(241, 110), (340, 110)], '#e8663d') + pushbutton(390, 110) +
    wire([(390, 130), (390, 215), (241, 215)], '#0f172a') +
    wire([(241, 160), (470, 160)], '#e8663d') +
    wire([(241, 75), (470, 75), (470, 110)], '#dc2626') +
    wire([(420, 215), (470, 215), (470, 170)], '#0f172a') + servo(500, 135) +
    '<text x="390" y="232" text-anchor="middle" class="small">estado 0 / estado 1 con servo.write()</text>')

print(f'Generados {len(list(OUT.glob("*.svg")))} diagramas en {OUT}')
