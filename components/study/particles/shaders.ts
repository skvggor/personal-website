export const vertexShaderSource = /* glsl */ `
  attribute vec2 aPositionFrom;
  attribute vec2 aPositionTo;
  attribute vec3 aColorFrom;
  attribute vec3 aColorTo;
  attribute float aSeed;
  attribute vec2 aHoverPosition;
  attribute vec3 aHoverColor;

  uniform float uProgress;
  uniform float uTime;
  uniform float uFloatingAmplitude;
  uniform float uPointSize;
  uniform float uHover;
  uniform float uPhotoWeight;

  varying vec3 vColor;

  void main() {
    vec2 basePosition = mix(aPositionFrom, aPositionTo, uProgress);
    vec2 position = mix(basePosition, aHoverPosition, uHover);
    position.x += sin(uTime * 1.5 + aSeed * 6.2832) * uFloatingAmplitude;
    position.y += cos(uTime * 1.2 + aSeed * 12.5664) * uFloatingAmplitude;

    float excursionActive = uPhotoWeight;
    float eligible = step(aSeed, 0.012);
    float excursionPhase = fract(uTime / 11.0 + aSeed * 80.0);
    float excursionBell = smoothstep(0.40, 0.5, excursionPhase)
      * (1.0 - smoothstep(0.5, 0.60, excursionPhase));
    vec2 outward = position / (length(position) + 0.0001);
    position += outward * excursionBell * 0.18 * eligible * excursionActive;

    gl_Position = vec4(position, 0.0, 1.0);
    gl_PointSize = uPointSize
      * (1.0 + excursionBell * 2.0 * eligible * excursionActive);
    vec3 baseColor = mix(aColorFrom, aColorTo, uProgress);
    vColor = mix(baseColor, aHoverColor, uHover);
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
