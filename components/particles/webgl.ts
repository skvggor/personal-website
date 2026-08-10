import {
  fragmentShaderSource,
  vertexShaderSource,
} from "@/components/particles/shaders";

export function compileShader(
  renderingContext: WebGLRenderingContext,
  type: number,
  source: string,
): WebGLShader {
  const shader = renderingContext.createShader(type);
  if (!shader) {
    throw new Error("Failed to allocate shader");
  }
  renderingContext.shaderSource(shader, source);
  renderingContext.compileShader(shader);
  if (
    !renderingContext.getShaderParameter(
      shader,
      renderingContext.COMPILE_STATUS,
    )
  ) {
    const information = renderingContext.getShaderInfoLog(shader);
    renderingContext.deleteShader(shader);
    throw new Error(`Shader compilation failed: ${information}`);
  }
  return shader;
}

export function createProgram(
  renderingContext: WebGLRenderingContext,
): WebGLProgram {
  const program = renderingContext.createProgram();
  if (!program) {
    throw new Error("Failed to allocate program");
  }
  const vertexShader = compileShader(
    renderingContext,
    renderingContext.VERTEX_SHADER,
    vertexShaderSource,
  );
  const fragmentShader = compileShader(
    renderingContext,
    renderingContext.FRAGMENT_SHADER,
    fragmentShaderSource,
  );
  renderingContext.attachShader(program, vertexShader);
  renderingContext.attachShader(program, fragmentShader);
  renderingContext.linkProgram(program);
  if (
    !renderingContext.getProgramParameter(program, renderingContext.LINK_STATUS)
  ) {
    const information = renderingContext.getProgramInfoLog(program);
    renderingContext.deleteProgram(program);
    throw new Error(`Program link failed: ${information}`);
  }
  renderingContext.deleteShader(vertexShader);
  renderingContext.deleteShader(fragmentShader);
  return program;
}

export function uploadBuffer(
  renderingContext: WebGLRenderingContext,
  data: Float32Array,
): WebGLBuffer {
  const buffer = renderingContext.createBuffer();
  renderingContext.bindBuffer(renderingContext.ARRAY_BUFFER, buffer);
  renderingContext.bufferData(
    renderingContext.ARRAY_BUFFER,
    data,
    renderingContext.STATIC_DRAW,
  );
  return buffer;
}

export function bindAttribute(
  renderingContext: WebGLRenderingContext,
  buffer: WebGLBuffer,
  location: number,
  size: number,
): void {
  renderingContext.bindBuffer(renderingContext.ARRAY_BUFFER, buffer);
  renderingContext.enableVertexAttribArray(location);
  renderingContext.vertexAttribPointer(
    location,
    size,
    renderingContext.FLOAT,
    false,
    0,
    0,
  );
}
