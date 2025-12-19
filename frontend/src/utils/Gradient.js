export default class Gradient {
  constructor(resolutionScale = 0.5) {
    this.canvas = null;
    this.gl = null;
    this.program = null;
    this.startTime = null;
    this.resolutionScale = resolutionScale;
    this.needsResUpdate = false;
  }

  initGradient(selector) {
    this.canvas = document.querySelector(selector);
    if (!this.canvas) return;
    this.gl = this.canvas.getContext("webgl", {
      antialias: false,
      powerPreference: "low-power"
    });
    if (!this.gl) return;

    const vertexShaderSource = `
      attribute vec2 position;
      void main() {
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

    const fragmentShaderSource = `
      precision highp float;
      uniform vec2 u_res;
      uniform float u_time;

      vec3 colorA = vec3(0.125, 0.176, 0.949); // #202DF2
      vec3 colorB = vec3(0.725, 0.208, 0.937); // #4e4d4fff
      vec3 colorC = vec3(0.0, 0.784, 1.0);     // #00C8FF
      vec3 colorD = vec3(0.431, 0.973, 0.796); // #6EF8CB
      vec3 colorE = vec3(1.0, 0.6, 0.2);       // #FF9933
      vec3 colorF = vec3(1.0, 0.2, 0.5);       // #FF3380

      void main() {
        vec2 uv = gl_FragCoord.xy / u_res.xy;
        uv = uv * 2.0 - 1.0;
        uv.x *= u_res.x / u_res.y;

        float t = u_time * 0.3; // animation speed

        float wave1 = sin((uv.x + t) * 2.0) * 0.3 + cos((uv.y + t) * 1.5) * 0.3;
        float wave2 = sin((uv.x - t*0.7) * 3.0) * 0.2 + cos((uv.y - t*0.8) * 2.0) * 0.2;
        float wave3 = sin((uv.x + t*0.9) * 1.5) * 0.25 + cos((uv.y + t*1.2) * 1.5) * 0.25;

        float combined = wave1 + wave2 + wave3;

        vec3 color = mix(colorA, colorB, smoothstep(-1.0, 1.0, combined));
        color = mix(color, colorC, 0.5 + 0.5 * sin(t + combined));
        color = mix(color, colorD, 0.5 + 0.5 * cos(t * 0.7 - combined));
        color = mix(color, colorE, 0.3 + 0.7 * sin(t * 1.2 + combined));
        color = mix(color, colorF, 0.2 + 0.8 * cos(t * 0.9 - combined));

        gl_FragColor = vec4(color, 1.0);
      }
    `;
    const vertexShader = this.createShader(this.gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = this.createShader(this.gl.FRAGMENT_SHADER, fragmentShaderSource);
    this.program = this.createProgram(vertexShader, fragmentShader);
    this.gl.useProgram(this.program);
    const positionBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      this.gl.STATIC_DRAW
    );
    const positionLocation = this.gl.getAttribLocation(this.program, "position");
    this.gl.enableVertexAttribArray(positionLocation);
    this.gl.vertexAttribPointer(positionLocation, 2, this.gl.FLOAT, false, 0, 0);
    this.resUniform = this.gl.getUniformLocation(this.program, "u_res");
    this.timeUniform = this.gl.getUniformLocation(this.program, "u_time");
    this.startTime = performance.now();
    this.animationFrame = requestAnimationFrame(this.render.bind(this));
    this.debouncedResize = this.debounce(this.resizeCanvas.bind(this), 100);
    window.addEventListener("resize", this.debouncedResize);
    this.resizeCanvas();
  }

  createShader(type, source) {
    const shader = this.gl.createShader(type);
    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);
    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      console.error('Shader compilation error:', this.gl.getShaderInfoLog(shader));
      this.gl.deleteShader(shader);
      return null;
    }
    return shader;
  }

  createProgram(vertexShader, fragmentShader) {
    const program = this.gl.createProgram();
    this.gl.attachShader(program, vertexShader);
    this.gl.attachShader(program, fragmentShader);
    this.gl.linkProgram(program);
    if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
      console.error('Program linking error:', this.gl.getProgramInfoLog(program));
      this.gl.deleteProgram(program);
      return null;
    }
    return program;
  }

  resizeCanvas() {
    const { canvas, gl, resolutionScale } = this;
    if (!canvas || !gl) return;
    const parent = canvas.parentElement;
    const displayWidth = parent.clientWidth;
    const displayHeight = parent.clientHeight;
    const renderWidth = Math.max(1, Math.floor(displayWidth * resolutionScale));
    const renderHeight = Math.max(1, Math.floor(displayHeight * resolutionScale));
    if (canvas.width !== renderWidth || canvas.height !== renderHeight) {
      canvas.width = renderWidth;
      canvas.height = renderHeight;
      canvas.style.width = displayWidth + 'px';
      canvas.style.height = displayHeight + 'px';
      gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
      this.needsResUpdate = true;
    }
  }

  render() {
    const { gl, resUniform, timeUniform, startTime } = this;
    if (!gl) return;
    const now = performance.now();
    const time = (now - startTime) / 1000;
    if (this.needsResUpdate || !this.lastWidth || !this.lastHeight ||
      gl.drawingBufferWidth !== this.lastWidth || gl.drawingBufferHeight !== this.lastHeight) {
      gl.uniform2f(resUniform, gl.drawingBufferWidth, gl.drawingBufferHeight);
      this.lastWidth = gl.drawingBufferWidth;
      this.lastHeight = gl.drawingBufferHeight;
      this.needsResUpdate = false;
    }
    gl.uniform1f(timeUniform, time);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    this.animationFrame = requestAnimationFrame(this.render.bind(this));
  }

  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  setResolutionScale(scale) {
    this.resolutionScale = Math.max(0.1, Math.min(1.0, scale)); // Clamp between 0.1 and 1.0
    this.resizeCanvas();
  }

  pause() {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }
  }

  resume() {
    if (!this.animationFrame && this.gl) {
      this.startTime = performance.now() - (this.pauseTime || 0);
      this.animationFrame = requestAnimationFrame(this.render.bind(this));
    }
  }

  destroy() {
    this.pause();
    if (this.debouncedResize) {
      window.removeEventListener("resize", this.debouncedResize);
    }
    if (this.gl && this.program) {
      this.gl.deleteProgram(this.program);
    }
  }
}