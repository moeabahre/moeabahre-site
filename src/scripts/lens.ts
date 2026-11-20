// The lens: a square (the logo's blue dot) that redraws the portrait the way a designer sees it,
// as a grid of blue blocks sized by tone. It wanders on its own until a pointer takes over.

const BLUE = '#2332FF';
const PAPER = '#F2F1EC';

export function initLens({ calm, fine }: { calm: boolean; fine: boolean }) {
  const port = document.getElementById('port');
  const img = document.getElementById('photo') as HTMLImageElement | null;
  const cv = document.getElementById('lens') as HTMLCanvasElement | null;
  if (!port || !img || !cv) return;
  const ctx = cv.getContext('2d')!;
  const dpr = Math.min(devicePixelRatio || 1, 2);

  let W = 0, H = 0;
  let pix: { cell: number; cw: number; ch: number; data: Uint8ClampedArray } | null = null;
  let mx = 0, my = 0, tx = 0, ty = 0;   // current and target centre
  let size = 0, tsize = 0;               // current and target lens size
  let auto = true, visible = true;

  const base = () => Math.round(Math.min(W, H) * 0.32);

  function build() {
    const r = port!.getBoundingClientRect();
    W = r.width; H = r.height;
    if (!W || !H) return;
    cv!.width = Math.round(W * dpr); cv!.height = Math.round(H * dpr);
    const cell = Math.max(6, Math.round(W / 64));
    const cw = Math.ceil(W / cell), ch = Math.ceil(H / cell);
    const t = document.createElement('canvas');
    t.width = cw; t.height = ch;
    const tc = t.getContext('2d', { willReadFrequently: true })!;
    try {
      tc.drawImage(img!, 0, 0, cw, ch);
      const data = tc.getImageData(0, 0, cw, ch).data;
      // stretch the tones of the visible pixels to the full range, so a bright photo still reads
      let lo = 1, hi = 0;
      for (let k = 0; k < data.length; k += 4) {
        if (data[k + 3] < 40) continue;
        const l = (0.3 * data[k] + 0.59 * data[k + 1] + 0.11 * data[k + 2]) / 255;
        if (l < lo) lo = l; if (l > hi) hi = l;
      }
      const span = Math.max(0.05, hi - lo);
      for (let k = 0; k < data.length; k += 4) {
        const l = (0.3 * data[k] + 0.59 * data[k + 1] + 0.11 * data[k + 2]) / 255;
        const v = Math.round(Math.pow(Math.min(1, Math.max(0, (l - lo) / span)), 1.25) * 255);
        data[k] = data[k + 1] = data[k + 2] = v;
      }
      pix = { cell, cw, ch, data };
    } catch { pix = null; }
    tsize = base();
    if (!size) { size = tsize; mx = tx = W * 0.5; my = ty = H * 0.3; }
  }

  function draw() {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    if (!pix) return;
    const L = size, x0 = mx - L / 2, y0 = my - L / 2;
    const { cell, cw, ch, data } = pix;
    ctx.save();
    ctx.beginPath(); ctx.rect(x0, y0, L, L); ctx.clip();
    ctx.fillStyle = PAPER; ctx.fillRect(x0, y0, L, L);
    // faint construction grid
    ctx.strokeStyle = 'rgba(35,50,255,.12)'; ctx.lineWidth = 1;
    ctx.beginPath();
    for (let x = Math.floor(x0 / cell) * cell; x < x0 + L; x += cell) { ctx.moveTo(x + 0.5, y0); ctx.lineTo(x + 0.5, y0 + L); }
    for (let y = Math.floor(y0 / cell) * cell; y < y0 + L; y += cell) { ctx.moveTo(x0, y + 0.5); ctx.lineTo(x0 + L, y + 0.5); }
    ctx.stroke();
    const j0 = Math.max(0, Math.floor(y0 / cell)), j1 = Math.min(ch, Math.ceil((y0 + L) / cell));
    const i0 = Math.max(0, Math.floor(x0 / cell)), i1 = Math.min(cw, Math.ceil((x0 + L) / cell));
    for (let j = j0; j < j1; j++) {
      for (let i = i0; i < i1; i++) {
        const k = (j * cw + i) * 4;
        if (data[k + 3] < 40) continue;
        const lum = (0.3 * data[k] + 0.59 * data[k + 1] + 0.11 * data[k + 2]) / 255;
        const s = cell * (0.22 + 0.78 * (1 - lum));   // darker tone, bigger block
        ctx.fillStyle = lum > 0.8 ? '#FFFFFF' : BLUE;
        ctx.fillRect(i * cell + (cell - s) / 2, j * cell + (cell - s) / 2, s, s);
      }
    }
    ctx.restore();
    // frame, corner ticks and a size label, like a selection in a design tool
    ctx.strokeStyle = BLUE; ctx.lineWidth = 1.5;
    ctx.strokeRect(x0, y0, L, L);
    ctx.fillStyle = BLUE;
    const h = 7;
    for (const [cx, cy] of [[x0, y0], [x0 + L, y0], [x0, y0 + L], [x0 + L, y0 + L], [x0 + L / 2, y0], [x0 + L / 2, y0 + L], [x0, y0 + L / 2], [x0 + L, y0 + L / 2]]) {
      ctx.fillStyle = '#fff'; ctx.fillRect(cx - h / 2, cy - h / 2, h, h);
      ctx.strokeRect(cx - h / 2, cy - h / 2, h, h);
    }
    const label = `${Math.round(L)} × ${Math.round(L)}`;
    ctx.font = '700 11px "Archivo Variable", Arial, sans-serif';
    const tw = ctx.measureText(label).width + 12;
    ctx.fillStyle = BLUE; ctx.fillRect(x0 + L / 2 - tw / 2, y0 + L + 10, tw, 18);
    ctx.fillStyle = '#fff'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(label, x0 + L / 2, y0 + L + 19.5);
  }

  function tick(t: number) {
    if (visible) {
      if (auto && !calm) {
        const s = t / 1000;
        tx = W * 0.5 + Math.cos(s * 0.55) * W * 0.2;
        ty = H * 0.3 + Math.sin(s * 0.85) * H * 0.09;
      }
      const e = auto ? 0.06 : 0.2;
      mx += (tx - mx) * e; my += (ty - my) * e; size += (tsize - size) * 0.12;
      draw();
    }
    requestAnimationFrame(tick);
  }

  const toLocal = (e: PointerEvent) => {
    const r = port.getBoundingClientRect();
    tx = e.clientX - r.left; ty = e.clientY - r.top;
  };
  port.addEventListener('pointerenter', (e) => { toLocal(e); auto = false; tsize = base() * 1.15; });
  port.addEventListener('pointermove', (e) => { toLocal(e); auto = false; });
  port.addEventListener('pointerdown', () => { tsize = base() * 1.6; });
  port.addEventListener('pointerup', () => { tsize = base() * 1.15; });
  port.addEventListener('pointerleave', () => { auto = true; tsize = base(); });

  // pause drawing while the hero is off-screen
  new IntersectionObserver(([en]) => { visible = en.isIntersecting; }).observe(port);

  const start = () => {
    build();
    if (calm) draw();
    else requestAnimationFrame(tick);
  };
  if (img.complete && img.naturalWidth) start();
  else img.addEventListener('load', start, { once: true });
  let rt = 0;
  addEventListener('resize', () => { clearTimeout(rt); rt = window.setTimeout(build, 150); });
  void fine;
}
