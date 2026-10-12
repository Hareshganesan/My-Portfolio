/* ═══════════════════════════════════════════════════════
   CORE DOMAINS — a training run
   Scroll draws a (deterministically noisy) loss curve down the
   rail. When its tip passes a row's checkpoint the row converges:
   the title decodes from noise and fills, the metric counts up.
   Scrolling back up un-learns it, so the effect replays.
   ═══════════════════════════════════════════════════════ */
(function initCoreDomains() {
  const sec = document.getElementById("domains");
  if (!sec || typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;
  gsap.registerPlugin(ScrollTrigger);

  const board = sec.querySelector(".cd-board");
  const svg = sec.querySelector(".cd-curve");
  const path = svg.querySelector(".cd-loss");
  const ghost = svg.querySelector(".cd-loss-ghost");
  const tip = svg.querySelector(".cd-tip");
  const dotsG = svg.querySelector(".cd-dots");
  const rows = [...sec.querySelectorAll(".cd-row")];
  const lossEl = sec.querySelector(".cd-loss-val");
  const epochEl = sec.querySelector(".cd-epoch-val");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const NS = "http://www.w3.org/2000/svg";

  // Same curve every visit: fast early drop, noisy plateau.
  const SAMPLES = 140;
  const losses = (() => {
    let seed = 42;
    const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    const out = [];
    for (let i = 0; i < SAMPLES; i++) {
      const t = i / (SAMPLES - 1);
      const noise = (rand() - 0.5) * 0.09 * (1 - t * 0.6);
      out.push(Math.max(0.03, 0.05 + 0.87 * Math.exp(-3.4 * t) + noise));
    }
    // smooth the jitter so it reads like a logged curve, not a zigzag
    for (let pass = 0; pass < 3; pass++)
      for (let i = 1; i < SAMPLES - 1; i++) out[i] = (out[i - 1] + out[i] * 2 + out[i + 1]) / 4;
    out[0] = 0.92;
    return out;
  })();
  const lossAt = (t) => {
    const f = Math.min(1, Math.max(0, t)) * (SAMPLES - 1);
    const i = Math.floor(f), k = f - i;
    return losses[i] + ((losses[Math.min(i + 1, SAMPLES - 1)] - losses[i]) * k);
  };

  let len = 1, H = 1, W = 1, rowY = [], dots = [];

  // Unlearned rows show their real text until they first converge.
  rows.forEach((r) => { r._on = false; });

  function layout() {
    W = svg.getBoundingClientRect().width || 1;
    H = board.offsetHeight || 1;
    svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
    const pad = Math.min(24, W * 0.15);
    // keep the curve in the left ~60% of the rail, clear of the epoch labels
    const xOf = (l) => pad + (W * 0.6 - pad) * (l / 0.95);
    let d = "";
    losses.forEach((l, i) => {
      const y = (i / (SAMPLES - 1)) * H;
      d += (i ? "L" : "M") + xOf(l).toFixed(1) + " " + y.toFixed(1);
    });
    path.setAttribute("d", d);
    ghost.setAttribute("d", d);
    len = path.getTotalLength();
    path.style.strokeDasharray = len;

    dotsG.textContent = "";
    rowY = rows.map((r) => r.offsetTop + r.offsetHeight / 2);
    dots = rowY.map((y) => {
      const c = document.createElementNS(NS, "circle");
      c.setAttribute("cx", xOf(lossAt(y / H)).toFixed(1));
      c.setAttribute("cy", y.toFixed(1));
      c.setAttribute("r", 6);
      dotsG.appendChild(c);
      return c;
    });
    dots.forEach((c, i) => c.classList.toggle("is-on", rows[i]._on));
    apply(st ? st.progress : 0);
  }

  /* ── text decode ─────────────────────────────────── */
  const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*+=/<>";
  function decode(el) {
    const text = el.dataset.text;
    if (reduceMotion) { el.textContent = text; return; }
    const token = (el._token = (el._token || 0) + 1);
    const t0 = performance.now(), dur = 750;
    const step = (now) => {
      if (el._token !== token) return;
      const q = Math.min(1, (now - t0) / dur);
      let out = "";
      for (let i = 0; i < text.length; i++) {
        const ch = text[i];
        // characters lock in left to right
        out += ch === " " || q >= (i + 1) / text.length ? ch : GLYPHS[(Math.random() * GLYPHS.length) | 0];
      }
      el.textContent = q < 1 ? out : text;
      if (q < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  function countUp(el) {
    const to = parseFloat(el.dataset.to), dec = +(el.dataset.dec || 0), suf = el.dataset.suffix || "";
    if (reduceMotion) { el.textContent = to.toFixed(dec) + suf; return; }
    const o = { v: 0 };
    gsap.killTweensOf(el._o || {});
    el._o = o;
    gsap.to(o, {
      v: to, duration: 1.1, ease: "power3.out",
      onUpdate: () => { el.textContent = o.v.toFixed(dec) + suf; },
    });
  }

  function setRow(i, on) {
    const r = rows[i];
    if (r._on === on) return;
    r._on = on;
    r.classList.toggle("is-on", on);
    dots[i] && dots[i].classList.toggle("is-on", on);
    if (on) {
      decode(r.querySelector(".cd-title"));
      countUp(r.querySelector(".cd-val"));
    }
  }

  function apply(p) {
    path.style.strokeDashoffset = (len * (1 - p)).toFixed(1);
    const pt = path.getPointAtLength(len * p);
    tip.setAttribute("cx", pt.x.toFixed(1));
    tip.setAttribute("cy", pt.y.toFixed(1));
    tip.style.opacity = p > 0.001 && p < 0.999 ? 1 : 0;
    let epoch = 0;
    rowY.forEach((y, i) => {
      const on = p > 0 && pt.y >= y - 1;
      if (on) epoch = i + 1;
      setRow(i, on);
    });
    lossEl.textContent = lossAt(pt.y / H).toFixed(3);
    epochEl.textContent = epoch;
  }

  // Replay the decode on hover once a row has converged.
  rows.forEach((r) => {
    r.addEventListener("mouseenter", () => { if (r._on) decode(r.querySelector(".cd-title")); });
  });

  let st = null;
  layout();
  st = ScrollTrigger.create({
    trigger: board,
    start: "top 70%",
    end: "bottom 60%",
    onUpdate: (self) => apply(self.progress),
    onRefresh: layout,
  });
})();
