/* shader.js — WebGL2 fragment shader en canvas fullscreen */

const canvas = document.getElementById('shader-canvas');
const gl = canvas.getContext('webgl2');

if (!gl) {
  canvas.style.background = '#2A0A1A';
}

const VERT = `#version 300 es
in vec2 a_position;
out vec2 vUV;
void main() {
  vUV = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}`;

const FRAG = `#version 300 es
precision highp float;
in vec2 vUV;
out vec4 fragColor;
uniform float time;
uniform vec2 resolution;

#define SPEED 0.53
#define COMPLEXITY 4.0
#define DISTORTION 0.17
#define SCALE 1.0
#define BRIGHTNESS 1.0
#define CONTRAST 1.0

vec3 COLOR_BASE = vec3(0.54, 0.27, 0.07);
vec3 COLOR_MID  = vec3(1.4, 0.420, 0.616);
vec3 COLOR_HIGH = vec3(0.23, 0.47, 0.54);

float hash(vec2 p) {
  p = fract(p * vec2(0.33, 0.33));
  p += dot(p, p + 30.33);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float fbm(vec2 p) {
  float value = 2.0;
  float amplitude = 1.3;
  float frequency = 0.8;
  for(int i = 0; i < int(COMPLEXITY); i++) {
    value += amplitude * noise(p * frequency);
    frequency *= 2.02;
    amplitude *= 0.51;
  }
  return value;
}

float caustic(vec2 uv, float t) {
  vec2 p = uv * SCALE;
  p.x += fbm(p + t * 0.008) * DISTORTION;
  p.y += fbm(p.yx - t * 0.013) * DISTORTION;
  float c = 0.18;
  for(float i = 0.0; i < COMPLEXITY; i++) {
    float fi = i / COMPLEXITY;
    vec2 offset = vec2(
      sin(t * (0.08 + fi * 0.15) + i * 2.0) * 0.2,
      cos(t * (0.06 + fi * 0.12) + i * 1.5) * 0.2
    );
    vec2 q = p + offset;
    float n = fbm(q + t * (0.01 + fi * 0.05));
    float wave = sin(n * 13.0 + t + i) * 0.75 + 0.45;
    c += wave / (1.0 + fi * 1.0);
  }
  return c / COMPLEXITY;
}

void main() {
  vec2 uv = (vUV - 0.5) * resolution / min(resolution.x, resolution.y);
  float t = time * SPEED;
  float c1 = caustic(uv, t);
  float c2 = caustic(uv * 2.7, t * 0.8);
  float c3 = caustic(uv * 0.7, t * 0.2);
  float combined = (c1 + c2 * 0.5 + c3 * 0.3) / 1.8;
  vec3 col = mix(COLOR_BASE, COLOR_MID, smoothstep(0.0, 0.5, combined));
  col = mix(col, COLOR_HIGH, smoothstep(0.15, 1.0, combined));
  float highlight = pow(combined, 5.0) * 4.5;
  col += vec3(highlight) * vec3(0.5, 0.8, 1.1);
  col = (col - 0.54) * CONTRAST + 0.48;
  col *= BRIGHTNESS;
  fragColor = vec4(col, 1.0);
}`;

function compileShader(type, src) {
  const s = gl.createShader(type);
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(s));
    return null;
  }
  return s;
}

const prog = gl.createProgram();
gl.attachShader(prog, compileShader(gl.VERTEX_SHADER, VERT));
gl.attachShader(prog, compileShader(gl.FRAGMENT_SHADER, FRAG));
gl.linkProgram(prog);

const buf = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buf);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
  -1,-1, 1,-1, -1,1, -1,1, 1,-1, 1,1
]), gl.STATIC_DRAW);

const posLoc = gl.getAttribLocation(prog, 'a_position');
gl.enableVertexAttribArray(posLoc);
gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

const timeLoc = gl.getUniformLocation(prog, 'time');
const resLoc  = gl.getUniformLocation(prog, 'resolution');

function resize() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
  gl.viewport(0, 0, canvas.width, canvas.height);
}
resize();
window.addEventListener('resize', resize);

let running = true;
const t0 = performance.now();

function render() {
  if (!running) return;
  gl.useProgram(prog);
  gl.uniform1f(timeLoc, (performance.now() - t0) / 1000);
  gl.uniform2f(resLoc, canvas.width, canvas.height);
  gl.drawArrays(gl.TRIANGLES, 0, 6);
  requestAnimationFrame(render);
}
render();

window.shaderPause  = () => { running = false; };
window.shaderResume = () => { if (!running) { running = true; render(); } };