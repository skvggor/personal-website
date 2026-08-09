import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  bindAttribute,
  compileShader,
  createProgram,
  uploadBuffer,
} from "@/components/study/particles/webgl";

const VERTEX_SHADER = 35633;
const FRAGMENT_SHADER = 35632;
const COMPILE_STATUS = 35713;
const LINK_STATUS = 35714;
const ARRAY_BUFFER = 34962;
const STATIC_DRAW = 35044;
const FLOAT = 5126;

interface MockContextOptions {
  readonly shader?: WebGLShader | null;
  readonly program?: WebGLProgram | null;
  readonly compileStatus?: boolean;
  readonly linkStatus?: boolean;
  readonly shaderLog?: string;
  readonly programLog?: string;
}

function createMockContext(
  options: MockContextOptions = {},
): WebGLRenderingContext {
  const shader = (
    options.shader === undefined ? {} : options.shader
  ) as WebGLShader;
  const program = options.program === undefined ? {} : options.program;
  return {
    createShader: vi.fn(() => shader),
    createProgram: vi.fn(() => program),
    shaderSource: vi.fn(),
    compileShader: vi.fn(),
    getShaderParameter: vi.fn(() => options.compileStatus ?? true),
    getShaderInfoLog: vi.fn(() => options.shaderLog ?? "shader log"),
    deleteShader: vi.fn(),
    attachShader: vi.fn(),
    linkProgram: vi.fn(),
    getProgramParameter: vi.fn(() => options.linkStatus ?? true),
    getProgramInfoLog: vi.fn(() => options.programLog ?? "program log"),
    deleteProgram: vi.fn(),
    createBuffer: vi.fn(() => ({})),
    bindBuffer: vi.fn(),
    bufferData: vi.fn(),
    enableVertexAttribArray: vi.fn(),
    vertexAttribPointer: vi.fn(),
    VERTEX_SHADER,
    FRAGMENT_SHADER,
    COMPILE_STATUS,
    LINK_STATUS,
    ARRAY_BUFFER,
    STATIC_DRAW,
    FLOAT,
  } as unknown as WebGLRenderingContext;
}

describe("compileShader", () => {
  it("compiles and returns the shader on success", () => {
    const context = createMockContext();
    const shader = compileShader(context, VERTEX_SHADER, "source");
    expect(shader).toEqual({});
    expect(context.compileShader).toHaveBeenCalled();
  });

  it("throws when the shader cannot be allocated", () => {
    const context = createMockContext({ shader: null });
    expect(() => compileShader(context, VERTEX_SHADER, "source")).toThrow(
      "Failed to allocate shader",
    );
  });

  it("throws and deletes the shader when compilation fails", () => {
    const context = createMockContext({
      compileStatus: false,
      shaderLog: "bad source",
    });
    expect(() => compileShader(context, VERTEX_SHADER, "source")).toThrow(
      /Shader compilation failed: bad source/,
    );
    expect(context.deleteShader).toHaveBeenCalled();
  });
});

describe("createProgram", () => {
  it("links and returns the program on success", () => {
    const context = createMockContext();
    const program = createProgram(context);
    expect(program).toEqual({});
    expect(context.linkProgram).toHaveBeenCalled();
  });

  it("throws when the program cannot be allocated", () => {
    const context = createMockContext({ program: null });
    expect(() => createProgram(context)).toThrow("Failed to allocate program");
  });

  it("throws and deletes the program when linking fails", () => {
    const context = createMockContext({
      linkStatus: false,
      programLog: "bad link",
    });
    expect(() => createProgram(context)).toThrow(
      /Program link failed: bad link/,
    );
    expect(context.deleteProgram).toHaveBeenCalled();
  });
});

describe("uploadBuffer", () => {
  it("creates, binds and fills the buffer", () => {
    const context = createMockContext();
    const data = new Float32Array([1, 2, 3]);
    const buffer = uploadBuffer(context, data);
    expect(buffer).toEqual({});
    expect(context.bindBuffer).toHaveBeenCalledWith(ARRAY_BUFFER, buffer);
    expect(context.bufferData).toHaveBeenCalledWith(
      ARRAY_BUFFER,
      data,
      STATIC_DRAW,
    );
  });
});

describe("bindAttribute", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("enables and points the attribute at the given buffer", () => {
    const context = createMockContext();
    const buffer = uploadBuffer(context, new Float32Array([0]));
    bindAttribute(context, buffer, 2, 3);
    expect(context.enableVertexAttribArray).toHaveBeenCalledWith(2);
    expect(context.vertexAttribPointer).toHaveBeenCalledWith(
      2,
      3,
      FLOAT,
      false,
      0,
      0,
    );
  });
});
