/* ═══════════════════════════════════════════════════════
   MOBILE HERO — "train it, then break it"
   Phones only. The name is ~1000 points that fly in and settle
   (training); dragging a finger through scatters them (breaking),
   hot points turn orange, and they spring back.

   Performance notes:
   - one 2D canvas, typed arrays, two batched fills per frame
   - the rAF loop STOPS once everything has settled and no finger is
     down, so an idle hero costs nothing; it also stops off-screen and
     in background tabs
   - passive touch listeners, so scrolling is never blocked
   ═══════════════════════════════════════════════════════ */
(function initMobileHero() {
  if (!window.matchMedia("(max-width: 768px)").matches) return;
  const hero = document.getElementById("hero");
  const content = hero && hero.querySelector(".hero-minimal-content");
  const sub = hero && hero.querySelector(".hero-subtitle");
  if (!content || !sub) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const cv = document.createElement("canvas");
  cv.className = "mh-canvas";
  cv.setAttribute("aria-hidden", "true");
  hero.insertBefore(cv, content);
  hero.classList.add("has-mh");
  const ctx = cv.getContext("2d");

  const hint = document.createElement("p");
  hint.className = "mh-hint";
  hint.innerHTML = 'Touch the name <span>&middot; loss <b>0.000</b></span>';
  content.appendChild(hint);
  const lossEl = hint.querySelector("b");

  const HOT = "#ff8a3c";
  let W = 0, H = 0, dpr = 1, N = 0, dot = 1.8;
  let hx, hy, px, py, vx, vy, delay;
  let t0 = 0, maxDelay = 0, started = false, running = false, inView = true, frameNo = 0;
  let scale = 1; // px, used to normalise the loss readout
  const finger = { x: -1e4, y: -1e4, down: false };
  const R = 70, R2 = R * R;

  function sampleText() {
    W = hero.clientWidth;
    H = hero.clientHeight;
    dpr = Math.min(2, window.devicePixelRatio || 1);
    cv.width = Math.round(W * dpr);
    cv.height = Math.round(H * dpr);

    const off = document.createElement("canvas");
    off.width = W; off.height = H;
    const o = off.getContext("2d");
    const font = (s) => `800 ${s}px Syne, "Space Grotesk", sans-serif`;
    o.font = font(100);
    const widest = Math.max(o.measureText("GANESAN").width, o.measureText("P.V.").width);
    const size = (100 * W * 0.86) / widest;
    const sy = 1.25;                        // same vertical stretch as the desktop title
    const lineH = size * 0.9 * sy;
    // offsetTop ignores the intro's translateY, so the layout doesn't jump
    const subTop = content.offsetTop + sub.offsetTop;
    const bottom = subTop - size * 0.35;
    o.font = font(size);
    o.textAlign = "center";
    o.fillStyle = "#fff";
    [["GANESAN", bottom - lineH], ["P.V.", bottom]].forEach(([txt, base]) => {
      o.save(); o.translate(W / 2, base); o.scale(1, sy); o.fillText(txt, 0, 0); o.restore();
    });
    scale = size;

    const data = o.getImageData(0, 0, W, H).data;
    let gap = 3, pts;
    // aim for ~900-1300 points regardless of screen size
    for (;;) {
      pts = [];
      for (let y = 0; y < H; y += gap)
        for (let x = 0; x < W; x += gap)
          if (data[((y | 0) * W + (x | 0)) * 4 + 3] > 140) pts.push(x, y);
      if (pts.length / 2 <= 1300 || gap > 8) break;
      gap += 0.5;
    }
    dot = Math.max(1.4, gap * 0.62);
    N = pts.length / 2;
    hx = new Float32Array(N); hy = new Float32Array(N);
    px = new Float32Array(N); py = new Float32Array(N);
    vx = new Float32Array(N); vy = new Float32Array(N);
    delay = new Float32Array(N);
    maxDelay = 0;
    for (let i = 0; i < N; i++) {
      hx[i] = pts[i * 2]; hy[i] = pts[i * 2 + 1];
      // start as noise spread over the screen
      px[i] = Math.random() * W; py[i] = Math.random() * H;
      vx[i] = vy[i] = 0;
      // converge in a left-to-right sweep, with jitter
      delay[i] = (hx[i] / W) * 0.7 + Math.random() * 0.45;
      if (delay[i] > maxDelay) maxDelay = delay[i];
    }
    if (reduceMotion) { px.set(hx); py.set(hy); }
  }

  function draw() {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    const s = dot, h = s / 2;
    ctx.beginPath();
    for (let i = 0; i < N; i++) if (vx[i] * vx[i] + vy[i] * vy[i] <= 6) ctx.rect(px[i] - h, py[i] - h, s, s);
    ctx.fillStyle = "rgba(244,244,244,0.92)";
    ctx.fill();
    ctx.beginPath();
    for (let i = 0; i < N; i++) if (vx[i] * vx[i] + vy[i] * vy[i] > 6) ctx.rect(px[i] - h, py[i] - h, s, s);
    ctx.fillStyle = HOT;
    ctx.fill();
  }

  // returns true when the system has settled
  function step(t) {
    let err = 0, motion = 0;
    const fx = finger.x, fy = finger.y, touching = finger.down;
    for (let i = 0; i < N; i++) {
      const since = t - delay[i];
      const k = since <= 0 ? 0 : since >= 0.8 ? 0.055 : (since / 0.8) * 0.055;
      let ax = (hx[i] - px[i]) * k, ay = (hy[i] - py[i]) * k;
      if (touching) {
        const dx = px[i] - fx, dy = py[i] - fy, d2 = dx * dx + dy * dy;
        if (d2 < R2) {
          const d = Math.sqrt(d2) || 1, f = (1 - d / R) * 5;
          ax += (dx / d) * f; ay += (dy / d) * f;
        }
      }
      vx[i] = (vx[i] + ax) * 0.86;
      vy[i] = (vy[i] + ay) * 0.86;
      px[i] += vx[i]; py[i] += vy[i];
      err += Math.abs(hx[i] - px[i]) + Math.abs(hy[i] - py[i]);
      motion += Math.abs(vx[i]) + Math.abs(vy[i]);
    }
    if ((frameNo++ & 7) === 0) lossEl.textContent = Math.min(9.999, err / N / (scale * 0.5)).toFixed(3);
    return !touching && t > maxDelay + 0.9 && err / N < 0.15 && motion / N < 0.02;
  }

  function frame(now) {
    if (!inView || document.hidden) { running = false; return; }
    const settled = step((now - t0) / 1000);
    if (settled) {
      px.set(hx); py.set(hy); vx.fill(0); vy.fill(0);
      lossEl.textContent = "0.000";
      draw();
      running = false;
      return;
    }
    draw();
    requestAnimationFrame(frame);
  }

  function kick() {
    if (running || !started || reduceMotion || !inView || document.hidden) return;
    running = true;
    requestAnimationFrame(frame);
  }

  /* ── input (passive: never blocks scroll) ───────── */
  function setFinger(e) {
    const t = e.touches[0];
    if (!t) return;
    const r = cv.getBoundingClientRect();
    finger.x = t.clientX - r.left;
    finger.y = t.clientY - r.top;
    finger.down = true;
    kick();
  }
  function release() { finger.down = false; finger.x = finger.y = -1e4; kick(); }
  hero.addEventListener("touchstart", setFinger, { passive: true });
  hero.addEventListener("touchmove", setFinger, { passive: true });
  hero.addEventListener("touchend", release, { passive: true });
  hero.addEventListener("touchcancel", release, { passive: true });
  // Mouse too, so a narrow desktop window behaves the same. A resting mouse
  // must not count as a held finger, or the name never settles and the loop
  // never sleeps, so it lets go 120ms after the last movement.
  let mouseIdle;
  hero.addEventListener("pointermove", (e) => {
    if (e.pointerType !== "mouse") return;
    const r = cv.getBoundingClientRect();
    finger.x = e.clientX - r.left; finger.y = e.clientY - r.top; finger.down = true;
    clearTimeout(mouseIdle);
    mouseIdle = setTimeout(release, 120);
    kick();
  });
  hero.addEventListener("pointerleave", (e) => { if (e.pointerType === "mouse") release(); });

  new IntersectionObserver((entries) => {
    inView = entries[0].isIntersecting;
    kick();
  }).observe(hero);
  document.addEventListener("visibilitychange", kick);

  let lastW = 0;
  window.addEventListener("resize", () => {
    // URL-bar show/hide only changes height; only rebuild on a real width change
    if (hero.clientWidth === lastW) return;
    lastW = hero.clientWidth;
    sampleText();
    px.set(hx); py.set(hy);
    draw();
  });

  /* ── start once the loader is gone ──────────────── */
  function start() {
    if (started) return;
    started = true;
    t0 = performance.now();
    if (reduceMotion) { draw(); return; }
    kick();
  }
  const fontReady = document.fonts && document.fonts.load
    ? document.fonts.load('800 100px Syne').catch(() => {})
    : Promise.resolve();
  fontReady.then(() => {
    sampleText();
    lastW = hero.clientWidth;
    draw(); // scattered noise until training starts
    if (!document.body.classList.contains("loading")) start();
    else {
      const mo = new MutationObserver(() => {
        if (!document.body.classList.contains("loading")) { mo.disconnect(); setTimeout(start, 350); }
      });
      mo.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    }
  });
})();
