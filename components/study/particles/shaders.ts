export const vertexShaderSource = /* glsl */ `
  attribute vec2 aPositionFrom;
  attribute vec2 aPositionTo;
  attribute vec3 aColorFrom;
  attribute vec3 aColorTo;
  attribute float aSeed;

  uniform float uProgress;
  uniform float uTime;
  uniform float uFloatingAmplitude;
  uniform float uPointSize;
  uniform vec2 uMouse;
  uniform float uMagnet;
  uniform float uPhotoWeight;
  uniform vec3 uMagnetColor;

  varying vec3 vColor;

  void main() {
    vec2 position = mix(aPositionFrom, aPositionTo, uProgress);
    position.x += sin(uTime * 1.5 + aSeed * 6.2832) * uFloatingAmplitude;
    position.y += cos(uTime * 1.2 + aSeed * 12.5664) * uFloatingAmplitude;

    float diskAngle = fract(aSeed * 127.1 + 0.31) * 6.2831853;
    float diskRadius = sqrt(fract(aSeed * 269.5 + 0.71));
    vec2 diskPosition = uMouse + vec2(cos(diskAngle), sin(diskAngle)) * diskRadius;

    float mass = 0.35 + 0.65 * aSeed;
    float arrival = clamp(uMagnet / mass, 0.0, 1.0);
    position = mix(position, diskPosition, arrival);

    float excursionActive = uPhotoWeight * (1.0 - uMagnet);
    float eligible = step(aSeed, 0.012);
    float excursionPhase = fract(uTime / 11.0 + aSeed * 80.0);
    float excursionBell = smoothstep(0.40, 0.5, excursionPhase)
      * (1.0 - smoothstep(0.5, 0.60, excursionPhase));
    vec2 outward = position / (length(position) + 0.0001);
    position += outward * excursionBell * 0.18 * eligible * excursionActive;

    gl_Position = vec4(position, 0.0, 1.0);
    gl_PointSize = uPointSize
      * (1.0 + arrival * 1.5 + excursionBell * 2.0 * eligible * excursionActive);
    vec3 photoColor = mix(aColorFrom, aColorTo, uProgress);
    vColor = mix(photoColor, uMagnetColor, arrival);
  }
`;

export const fragmentShaderSource = /* glsl */ `
  precision mediump float;

  varying vec3 vColor;

  uniform float uFillRatio;

  void main() {
    vec2 coordinate = abs(gl_PointCoord - vec2(0.5));
    if (max(coordinate.x, coordinate.y) > 0.5 * uFillRatio) {
      discard;
    }
    gl_FragColor = vec4(vColor, 1.0);
  }
`;
