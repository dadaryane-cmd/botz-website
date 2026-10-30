/**
 * WebGL shaders for the hero fire (ported from the original site's FlameBackground).
 *
 * 2D simplex noise → fBm, domain-warped so the tongues sway and curl while scrolling upward;
 * heat is strongest at the bottom edge and falls off with height. Adds heat haze, rising embers
 * and a soft bloom. The light theme (uLight = 1) draws a calm warm glow with golden motes instead.
 * Output is premultiplied alpha, so the fire never darkens the page behind it.
 */

export const VERTEX_SHADER = `attribute vec2 aPos; void main(){ gl_Position = vec4(aPos, 0.0, 1.0); }`

export const FRAGMENT_SHADER = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform vec2 uRes;
uniform float uTime;
uniform float uLean;
uniform float uFade;
uniform float uIntensity;
uniform float uHeight;
uniform float uTurb;
uniform float uEmbers;
uniform float uLight; // 1.0 on the light theme

// 2D simplex noise (Ashima Arts / Stefan Gustavson, MIT).
vec3 permute(vec3 x){ return mod(((x * 34.0) + 1.0) * x, 289.0); }
float snoise(vec2 v){
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
  m = m * m; m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}
float fbm(vec2 p){
  float s = 0.0; float a = 0.5;
  for (int i = 0; i < 4; i++){ s += a * snoise(p); p = p * 2.03 + vec2(1.7, 9.2); a *= 0.48; }
  return s;
}
float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

// Heat → colour, the site palette: #66200C coal → #CC3713 ember → #EB7814 flame → #FF9F1C → #FFE7A8
vec3 ramp(float h){
  vec3 c0 = vec3(0.400, 0.125, 0.047);
  vec3 c1 = vec3(0.800, 0.216, 0.075);
  vec3 c2 = vec3(0.922, 0.471, 0.078);
  vec3 c3 = vec3(1.000, 0.624, 0.110);
  vec3 c4 = vec3(1.000, 0.906, 0.659);
  h = clamp(h, 0.0, 1.0) * 4.0;
  if (h < 1.0) return mix(c0, c1, h);
  if (h < 2.0) return mix(c1, c2, h - 1.0);
  if (h < 3.0) return mix(c2, c3, h - 2.0);
  return mix(c3, c4, h - 3.0);
}

// Light theme: no fire — a calm wash of warm light rising from the bottom, with golden motes.
vec4 warmGlow(vec2 uv, vec2 p, float t){
  float g = fbm(p * vec2(0.9, 0.7) + vec2(t * 0.05, -t * 0.07)) * 0.5 + 0.5;
  float g2 = fbm(p * 1.6 + vec2(-t * 0.04, -t * 0.11) + 3.7) * 0.5 + 0.5;
  float shape = 1.0 - smoothstep(0.0, uHeight * 1.25, uv.y);
  shape *= shape;
  vec3 col = mix(vec3(1.0, 0.851, 0.69), vec3(1.0, 0.624, 0.11), g * 0.55 + g2 * 0.25);
  float a = shape * (0.26 + 0.5 * g * g2) * uIntensity * uFade;
  vec3 pm = col * a;
  // Golden dust motes drifting slowly upward.
  float motes = 0.0;
  for (int i = 0; i < 2; i++){
    float fi = float(i);
    float k = 7.0 + fi * 6.0;
    vec2 st = vec2(p.x * k, (uv.y - t * (0.03 + fi * 0.02)) * k * 0.7);
    vec2 id = floor(st);
    vec2 f = fract(st);
    float rnd = hash(id + fi * 23.1);
    if (rnd > 0.78){
      vec2 pos = vec2(hash(id + 2.3), hash(id + 5.9)) * 0.7 + 0.15;
      pos.x += sin(t * 0.9 + rnd * 30.0) * 0.15;
      float d = length(f - pos);
      float life = 1.0 - smoothstep(uHeight * 0.9, uHeight * 1.8, uv.y);
      motes += smoothstep(0.06, 0.0, d) * life * (0.55 + 0.45 * sin(t * 2.0 + rnd * 50.0));
    }
  }
  float ma = clamp(motes * 0.75 * uEmbers * uFade, 0.0, 1.0);
  vec3 moteCol = vec3(1.0, 0.62, 0.18);
  pm = moteCol * ma + pm * (1.0 - ma);
  a = ma + a * (1.0 - ma);
  return vec4(pm, a);
}

void main(){
  vec2 uv = gl_FragCoord.xy / uRes;          // (0,0) bottom-left
  float aspect = uRes.x / uRes.y;
  vec2 p = vec2(uv.x * aspect, uv.y);
  float t = uTime;
  p.x -= uLean * uv.y * aspect;               // lean grows with height
  if (uLight > 0.5) { gl_FragColor = warmGlow(uv, p, t); return; }

  // Domain warp: the flow field that makes the tongues sway and curl.
  vec2 q = vec2(fbm(p * vec2(1.1, 0.8) + vec2(0.0, -t * 0.22)), fbm(p * vec2(1.1, 0.8) + vec2(5.2, 1.3 - t * 0.19)));
  vec2 r = p + uTurb * vec2(0.42, 0.22) * q;
  // Stretched vertically → long, flowing tongues rather than noisy blobs.
  float n = fbm(vec2(r.x * 1.7, r.y * 0.85 - t * 0.55)) * 0.5 + 0.5;

  // Shape: hottest at the bottom edge, fading out with height.
  float h = uHeight * (0.55 + 0.75 * n);
  float shape = pow(1.0 - smoothstep(0.0, h, uv.y), 1.35);
  float heat = shape * (0.3 + 0.95 * n);
  heat = smoothstep(0.2, 1.15, heat);
  heat = min(heat, 0.93) * uIntensity * uFade;   // white-hot only at rare peaks

  // Compose layers in premultiplied space with "over", so nothing darkens the page.
  vec3 fireCol = ramp(heat);
  // On the light theme the coolest tips lean ember-red instead of near-black.
  fireCol = mix(fireCol, ramp(0.25 + heat * 0.75), uLight * (1.0 - smoothstep(0.2, 0.55, heat)));
  fireCol += vec3(1.0, 0.86, 0.6) * pow(clamp(heat, 0.0, 1.0), 3.0) * 0.22;   // bloom on hottest parts
  float fireA = smoothstep(0.02, mix(0.36, 0.26, uLight), heat);
  vec3 pm = fireCol * fireA;
  float alpha = fireA;

  // Soft glow hugging the bottom edge (behind the flames).
  float glow = exp(-uv.y / max(uHeight * 0.45, 0.01)) * 0.22 * uIntensity * uFade * mix(1.0, 0.6, uLight);
  pm += vec3(1.0, 0.42, 0.12) * glow * (1.0 - alpha);
  alpha += glow * (1.0 - alpha);

  // Heat haze: a faint shimmering band just above the flames.
  float band = smoothstep(uHeight * 0.6, uHeight * 0.9, uv.y) * (1.0 - smoothstep(uHeight * 0.9, uHeight * 1.3, uv.y));
  float haze = (snoise(vec2(p.x * 7.0, p.y * 11.0 - t * 1.6)) * 0.5 + 0.5) * band * 0.035 * uFade * mix(1.0, 0.5, uLight);
  pm += vec3(1.0, 0.62, 0.28) * haze * (1.0 - alpha);
  alpha += haze * (1.0 - alpha);

  // Embers: sparse procedural sparks rising at different speeds, fading out (drawn on top).
  float sparks = 0.0;
  for (int i = 0; i < 3; i++){
    float fi = float(i);
    float k = 9.0 + fi * 5.0;
    vec2 st = vec2(p.x * k, (uv.y - t * (0.07 + fi * 0.035)) * k * 0.6);
    vec2 id = floor(st);
    vec2 f = fract(st);
    float rnd = hash(id + fi * 17.3);
    if (rnd > 0.8){
      vec2 pos = vec2(hash(id + 3.1), hash(id + 7.7)) * 0.7 + 0.15;
      pos.x += sin(t * 1.7 + rnd * 40.0) * 0.12;
      float d = length(f - pos);
      float life = smoothstep(0.0, 0.12, uv.y) * (1.0 - smoothstep(uHeight * 0.55, uHeight * 1.5, uv.y));
      float twinkle = 0.6 + 0.4 * sin(t * 6.0 + rnd * 60.0);
      sparks += smoothstep(0.075 - fi * 0.015, 0.0, d) * life * twinkle;
    }
  }
  float sa = clamp(sparks * uEmbers * uFade, 0.0, 1.0);
  vec3 sparkCol = mix(vec3(1.0, 0.82, 0.45), vec3(1.0, 0.45, 0.12), uLight);
  pm = sparkCol * sa + pm * (1.0 - sa);
  alpha = sa + alpha * (1.0 - sa);

  gl_FragColor = vec4(pm, alpha);   // premultiplied
}
`
