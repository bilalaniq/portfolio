document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("heroCanvas");
  const ctx = canvas.getContext("2d");

  const BLOCK_SIZE = 28;
  const STROKE_COLOR = "#27272a";
  const BASE_FILL = "#09090b";
  const colorA = "#355cb4";
  const colorB = "#d26de8";

  const PHASE_DURATION = 100;
  const EFFECT_DURATION = 300;
  const effects = [];

  function resizeCanvas() {
    const wrapper = document.querySelector(".hero-canvas-wrapper");
    let newWidth = Math.floor(wrapper.offsetWidth / BLOCK_SIZE) * BLOCK_SIZE;
    canvas.width = newWidth;
    canvas.height = Math.floor(wrapper.offsetHeight / BLOCK_SIZE) * BLOCK_SIZE;
  }

  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();

  function drawGrid() {
    const cols = Math.floor(canvas.width / BLOCK_SIZE);
    const rows = Math.floor(canvas.height / BLOCK_SIZE);
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = c * BLOCK_SIZE;
        const y = r * BLOCK_SIZE;
        ctx.fillStyle = BASE_FILL;
        ctx.fillRect(x, y, BLOCK_SIZE, BLOCK_SIZE);
        ctx.strokeStyle = STROKE_COLOR;
        ctx.lineWidth = 0.4;
        ctx.strokeRect(x, y, BLOCK_SIZE, BLOCK_SIZE);
      }
    }
  }

  function drawCheckerboard(x, y) {
    const mini = BLOCK_SIZE / 15;
    for (let i = 0; i < 15; i++) {
      for (let j = 0; j < 15; j++) {
        ctx.fillStyle = ((i + j) % 2 === 0) ? colorA : BASE_FILL;
        ctx.fillRect(x + j * mini, y + i * mini, mini, mini);
      }
    }
  }

  function drawDiagonalDither(x, y) {
    const mini = BLOCK_SIZE / 15;
    for (let i = 0; i < 15; i++) {
      for (let j = 0; j < 15; j++) {
        ctx.fillStyle = ( (i + j) % 3 === 0 ) ? STROKE_COLOR : BASE_FILL;
        ctx.fillRect(x + j * mini, y + i * mini, mini, mini);
      }
    }
  }

  function drawEffect(col, row, dt) {
    const x = col * BLOCK_SIZE;
    const y = row * BLOCK_SIZE;
    if (dt < PHASE_DURATION) drawCheckerboard(x, y);
    else if (dt < 2 * PHASE_DURATION) {
      ctx.fillStyle = colorB;
      ctx.fillRect(x, y, BLOCK_SIZE, BLOCK_SIZE);
    } else if (dt < EFFECT_DURATION) drawDiagonalDither(x, y);
  }

  const container = document.querySelector(".section_home-hero");
  container.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    const col = Math.floor(x / BLOCK_SIZE);
    const row = Math.floor(y / BLOCK_SIZE);
    effects.push({ col, row, startTime: Date.now() });
  });

  function animate() {
    requestAnimationFrame(animate);
    drawGrid();
    const now = Date.now();
    for (let i = effects.length - 1; i >= 0; i--) {
      const e = effects[i];
      const dt = now - e.startTime;
      if (dt < EFFECT_DURATION) drawEffect(e.col, e.row, dt);
      else effects.splice(i, 1);
    }
  }

  animate();
});
