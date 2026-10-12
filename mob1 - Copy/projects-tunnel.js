/* ═══════════════════════════════════════════════════════
   WORKS — Project Tunnel
   Scrolling pins the stage and flies a camera down a CSS-3D
   corridor whose walls are tiled with project frames. Each
   project owns a stretch of the corridor; its title surfaces
   while you pass through it. Click a frame to pull it out.
   Project data is read from the .pt-station articles in HTML.
   ═══════════════════════════════════════════════════════ */
(function initProjectTunnel() {
  const section = document.getElementById("projects");
  const stage = section && section.querySelector(".pt-stage");
  if (!stage || typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;
  gsap.registerPlugin(ScrollTrigger);

  const view = stage.querySelector(".pt-view");
  const cam = stage.querySelector(".pt-cam");
  const world = stage.querySelector(".pt-world");
  const stationEls = [...stage.querySelectorAll(".pt-station")];
  const indexEl = stage.querySelector(".pt-index");
  const progressEl = stage.querySelector(".pt-progress span");

  // Deterministic layout so the corridor looks the same on every visit.
  function rng(seed) {
    return function () {
      seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

  /* Cover art for projects without a photo: drawn once to a canvas,
     dark with one warm accent, so they sit alongside the real photos. */
  function makeArt(kind) {
    const S = 512, cv = document.createElement("canvas");
    cv.width = cv.height = S;
    const g = cv.getContext("2d");
    const r = rng(kind.length * 97 + 13);
    g.fillStyle = "#0b0b0b"; g.fillRect(0, 0, S, S);

    if (kind === "retina") {
      // fundus: warm disc, branching vessels, OCT scan ticks
      const grd = g.createRadialGradient(S * 0.5, S * 0.5, 10, S * 0.5, S * 0.5, S * 0.48);
      grd.addColorStop(0, "#ff9a4d"); grd.addColorStop(0.55, "#a8321c"); grd.addColorStop(1, "#1a0705");
      g.fillStyle = grd; g.beginPath(); g.arc(S / 2, S / 2, S * 0.46, 0, Math.PI * 2); g.fill();
      g.fillStyle = "#ffe2b8"; g.beginPath(); g.arc(S * 0.62, S * 0.47, S * 0.07, 0, Math.PI * 2); g.fill();
      g.strokeStyle = "rgba(70,8,4,0.85)"; g.lineCap = "round";
      const vessel = (x, y, ang, w, d) => {
        if (d > 6 || w < 0.6) return;
        const len = 30 + r() * 40, nx = x + Math.cos(ang) * len, ny = y + Math.sin(ang) * len;
        g.lineWidth = w; g.beginPath(); g.moveTo(x, y); g.lineTo(nx, ny); g.stroke();
        vessel(nx, ny, ang + (r() - 0.5) * 0.9, w * 0.78, d + 1);
        if (r() < 0.55) vessel(nx, ny, ang + (r() < 0.5 ? -1 : 1) * (0.5 + r() * 0.5), w * 0.6, d + 1);
      };
      for (let i = 0; i < 7; i++) vessel(S * 0.62, S * 0.47, (i / 7) * Math.PI * 2, 6, 0);
      g.strokeStyle = "rgba(244,244,244,0.5)"; g.lineWidth = 1;
      for (let y = 40; y < S; y += 9) { g.beginPath(); g.moveTo(24, y); g.lineTo(24 + 40 + r() * 30, y); g.stroke(); }
    } else if (kind === "voxel") {
      // MRI slice: a lesion rendered as a voxel grid
      const cells = 28, cs = S / cells, cx = 0.56 * cells, cy = 0.44 * cells;
      for (let y = 0; y < cells; y++) for (let x = 0; x < cells; x++) {
        const head = Math.hypot((x - cells / 2) / 11, (y - cells / 2) / 13);
        if (head > 1) continue;
        const les = Math.exp(-((x - cx) ** 2 + (y - cy) ** 2) / 10);
        const v = Math.round(40 + 120 * (1 - head) + r() * 30);
        g.fillStyle = les > 0.25 ? `rgba(255,${Math.round(150 - les * 90)},60,${0.5 + les * 0.5})` : `rgb(${v},${v},${v})`;
        g.fillRect(x * cs + 1, y * cs + 1, cs - 2, cs - 2);
      }
      g.strokeStyle = "#ff8a3c"; g.lineWidth = 2;
      g.strokeRect((cx - 3) * cs, (cy - 3) * cs, 6 * cs, 6 * cs);
    } else {
      // inbox: message rows sorted into labelled categories
      const tags = ["#f4f4f4", "#ff8a3c", "#7a7a7a"];
      for (let i = 0; i < 16; i++) {
        const y = 36 + i * 28, t = Math.floor(r() * 3);
        g.fillStyle = tags[t]; g.fillRect(36, y, 14, 14);
        g.fillStyle = "rgba(244,244,244,0.75)"; g.fillRect(64, y + 2, 60 + r() * 90, 4);
        g.fillStyle = "rgba(244,244,244,0.28)"; g.fillRect(64, y + 10, 140 + r() * 180, 3);
      }
      g.fillStyle = "#ff8a3c"; g.font = "bold 64px monospace"; g.fillText("98.5%", S - 230, S - 40);
    }
    return cv.toDataURL("image/jpeg", 0.86);
  }

  const projects = stationEls
    .filter((el) => el.dataset.img || el.dataset.art)
    .map((el) => {
      const link = el.querySelector(".pt-link");
      return {
        el,
        img: el.dataset.img || makeArt(el.dataset.art),
        href: link ? link.href : "",
        linkText: link ? link.textContent.trim() : "",
        num: el.querySelector(".pt-num").textContent.trim(),
        title: el.querySelector(".pt-title").textContent.trim(),
        meta: el.querySelector(".pt-meta").textContent.trim(),
      };
    });
  const n = projects.length;
  if (!n) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const FOV = 70;

  // Scroll progress windows: intro, one per project, outro.
  const S_IN = 0.1, S_OUT = 0.9;
  const stationS = projects.map((_, k) => S_IN + (S_OUT - S_IN) * (k + 0.5) / n);


  let W, H, P, c, rows = [], endWall, Tmax = 1;
  // Phones/touch: draw the corridor with WebGL (projects-tunnel-gl.js). Mobile
  // GPUs can't keep ~100 CSS 3D layers smooth as they fly at the camera.
  let useGL = !!window.PTGL && (window.matchMedia("(hover: none), (pointer: coarse)").matches || window.innerWidth < 768);
  let glr = null, glCanvas = null;
  let T = 0, Tt = 0, prevT = 0;
  let mx = 0, my = 0, tmx = 0, tmy = 0;
  let visible = false, activeStation = -1;
  let st;

  function el(tag, cls, parent) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (parent) parent.appendChild(e);
    return e;
  }

  function build() {
    world.textContent = "";
    rows = [];
    if (glr) { glr.destroy(); glr = null; }
    if (glCanvas) { glCanvas.remove(); glCanvas = null; }
    const cells = []; // GL mode collects tile data instead of creating DOM
    // Hidden/unlaid-out page reports 0×0; fall back to the window so c is never 0.
    W = view.clientWidth || window.innerWidth || 1280;
    H = view.clientHeight || window.innerHeight || 720;
    const lanes = W < 640 ? 3 : W < 1100 ? 4 : 5;
    c = W / lanes;
    const vCells = clamp(Math.round(H / c), 2, 8);
    const TW = W, TH = vCells * c;
    P = (H / 2) / Math.tan((FOV / 2) * Math.PI / 180);
    const N = (W < 640 ? 5 : 6) * n + 10; // ~6 rows of corridor per project
    const L = N * c;
    Tmax = L - 6 * c;
    view.style.perspective = P + "px";
    stage.style.setProperty("--c", c + "px");

    // Which project owns the cells around a given travel distance.
    const ownerAt = (t) => {
      const s = t / Tmax;
      let best = 0;
      stationS.forEach((ss, k) => { if (Math.abs(ss - s) < Math.abs(stationS[best] - s)) best = k; });
      return best;
    };

    const rand = rng(1729);
    const gap = c * 0.07;
    const walls = [
      { cells: lanes,  w: TW, h: c,  tf: `translate3d(${-TW / 2}px, ${TH / 2}px, ${-c}px) rotateX(90deg)`, across: "x", name: "floor" },
      { cells: lanes,  w: TW, h: c,  tf: `translate3d(${-TW / 2}px, ${-TH / 2}px, 0) rotateX(-90deg)`,     across: "x", name: "ceil" },
      { cells: vCells, w: c,  h: TH, tf: `translate3d(${-TW / 2}px, ${-TH / 2}px, 0) rotateY(90deg)`,      across: "y", name: "left" },
      { cells: vCells, w: c,  h: TH, tf: `translate3d(${TW / 2}px, ${-TH / 2}px, ${-c}px) rotateY(-90deg)`, across: "y", name: "right" },
    ];

    // Each wall strip is one flat layer placed straight into the world (no
    // per-row wrapper, no nested 3D): ~4 GPU layers per row instead of ~10.
    for (let r = 0; r < N; r++) {
      const owner = ownerAt((r - 3.5) * c);
      const p = projects[owner];
      const words = p.meta.split(/[,·]/).map((s) => s.trim()).filter((w) => w.length < 16);
      const strips = [];

      walls.forEach((wall) => {
        let strip = null;
        if (!useGL) {
          strip = el("div", "pt-strip", world);
          strip.style.width = wall.w + "px";
          strip.style.height = wall.h + "px";
          strip.style.transform = `translate3d(0, 0, ${-r * c}px) ${wall.tf}`;
          strips.push(strip);
        }
        if (r < 2) return; // keep the mouth of the tunnel clear

        for (let i = 0; i < wall.cells; i++) {
          const roll = rand();
          let kind = null;
          if (roll < 0.27) kind = "photo";
          else if (roll < 0.305) kind = "num";
          else if (roll < 0.345) kind = "word";
          if (!kind) continue;

          // Mostly the owner's image, sometimes a neighbour's, so stretches blend.
          const pick = rand() < 0.8 ? owner : Math.floor(rand() * n);
          if (useGL) {
            const cell = { wall: wall.name, r, i, kind, project: pick, text: "", bx: 0, by: 0 };
            if (kind === "photo") { cell.bx = rand(); cell.by = rand(); }
            else if (kind === "num") cell.text = projects[pick].num;
            else cell.text = words[Math.floor(rand() * words.length)];
            cells.push(cell);
            continue;
          }
          const tile = el("div", "pt-tile", strip);
          const size = c - gap * 2;
          tile.style.width = tile.style.height = size + "px";
          tile.style.left = (wall.across === "x" ? i * c : 0) + gap + "px";
          tile.style.top = (wall.across === "y" ? i * c : 0) + gap + "px";

          const face = el("div", "pt-face is-" + kind, tile);
          if (kind === "photo") {
            face.style.backgroundImage = `url("${projects[pick].tex}")`;
            face.style.backgroundPosition = `${Math.round(rand() * 100)}% ${Math.round(rand() * 100)}%`;
            face.dataset.project = pick;
            face.setAttribute("role", "button");
            face.setAttribute("aria-label", "Open " + projects[pick].title);
          } else if (kind === "num") {
            face.textContent = projects[pick].num;
          } else {
            face.textContent = words[Math.floor(rand() * words.length)];
          }
        }
      });
      if (!useGL) rows.push({ strips, r, f: -1, shown: true });
    }

    if (useGL) {
      glCanvas = document.createElement("canvas");
      glCanvas.className = "pt-gl";
      glCanvas.setAttribute("aria-hidden", "true");
      view.insertBefore(glCanvas, view.firstChild);
      glr = window.PTGL.create({
        canvas: glCanvas, W, H, P, c, TW, TH, L, gap,
        dpr: Math.min(2, window.devicePixelRatio || 1),
        cells, projects, fogNear: P + 2 * c, fogFar: P + 12 * c,
      });
      if (!glr) { useGL = false; return build(); } // no WebGL: fall back to CSS 3D
      glr.ready.then(() => render(true));
    }

    endWall = el("div", "pt-end", world);
    endWall.style.width = TW + "px";
    endWall.style.height = TH + "px";
    endWall.style.transform = `translate3d(${-TW / 2}px, ${-TH / 2}px, ${-L}px)`;
    endWall.innerHTML =
      '<p>That\'s the<br/><span class="italic">shortlist.</span></p>' +
      '<a href="https://github.com/Hareshganesan" target="_blank" rel="noopener" data-cursor="hover">More on GitHub &#8599;</a>';

    T = prevT = Tt;
    render(true);
  }

  function setStation(i) {
    if (i === activeStation) return;
    activeStation = i;
    stationEls.forEach((s, k) => s.classList.toggle("is-active", k === i));
    indexEl.querySelectorAll("button").forEach((b, k) => b.classList.toggle("is-active", k + 1 === i));
  }

  function render(force) {
    prevT = T;
    world.style.transform = `translate3d(0, 0, ${T.toFixed(2)}px)`;
    if (glr) glr.draw(T);

    if (!reduceMotion) {
      cam.style.transform =
        `translateZ(${P}px) rotateX(${(-my * 4).toFixed(3)}deg) rotateY(${(mx * 6).toFixed(3)}deg) translateZ(${-P}px)`;
    }

    const fogNear = P + 2 * c, fogFar = P + 12 * c;
    for (const row of rows) {
      const zNear = -row.r * c + T;          // near edge, relative to the z=0 plane
      // Cull a row once even its far edge has slid off-screen, well before it
      // reaches the eye. Otherwise scrolling back re-shows it right in front of
      // the camera at 3–5× scale and the browser has to re-raster huge layers.
      const passed = zNear - c > P * 0.25;
      const dist = P - (zNear - c / 2);
      let f = passed ? 0 : 1 - clamp((dist - fogNear) / (fogFar - fogNear), 0, 1);
      f = Math.round(f * f * 20) / 20;
      const show = f > 0;
      if (show !== row.shown || force) {
        for (const s of row.strips) s.style.visibility = show ? "" : "hidden";
        row.shown = show;
      }
      if (show && (f !== row.f || force)) {
        for (const s of row.strips) s.style.setProperty("--f", f);
        row.f = f;
      }
    }
    if (endWall) {
      const s = T / Tmax;
      const endF = Math.round(clamp((s - 0.8) / 0.18, 0, 1) * 40) / 40;
      endWall.style.setProperty("--f", endF.toFixed(3));
      stage.style.setProperty("--fogc", (1 - endF * 0.9).toFixed(3));
    }

    const s = clamp(T / Tmax, 0, 1);
    progressEl.style.transform = `scaleX(${s.toFixed(4)})`;
    let station = -1;
    if (s < S_IN * 0.8) station = 0;
    else {
      const half = (S_OUT - S_IN) / n / 2;
      stationS.forEach((ss, k) => { if (Math.abs(s - ss) < half * 0.82) station = k + 1; });
    }
    setStation(station);
  }

  // Lenis already eases the scroll, so at normal speeds the camera follows it
  // 1:1 (a second easing layer made the tunnel feel laggy). A hard flick,
  // though, would jump several rows per frame and force the browser to draw
  // all of those new walls at once. So the camera has a speed limit: past it,
  // it travels at most MAX_ROWS_PER_SEC and then glides onto the scroll
  // position.
  const MAX_ROWS_PER_SEC = 9;
  let catching = false;
  function tick(time, deltaMs) {
    if (!visible || !built) return;
    if (st) Tt = st.progress * Tmax;
    const dt = Math.min(deltaMs || 16.7, 50) / 1000;
    const maxStep = MAX_ROWS_PER_SEC * c * dt;
    const d = Tt - T;
    if (!catching && Math.abs(d) > maxStep) catching = true;
    if (catching) {
      // exponential glide, capped at the speed limit
      const step = Math.min(maxStep, Math.max(Math.abs(d) * 0.1, 1));
      if (Math.abs(d) <= step) { T = Tt; catching = false; }
      else T += Math.sign(d) * step;
    } else {
      T = Tt;
    }
    const lookMoving = Math.abs(tmx - mx) > 0.0005 || Math.abs(tmy - my) > 0.0005;
    if (lookMoving) { mx += (tmx - mx) * 0.08; my += (tmy - my) * 0.08; }
    if (T !== prevT || lookMoving) render();
  }

  /* ── Index (jump to a project) ───────────────────── */
  projects.forEach((p, k) => {
    const li = el("li", null, indexEl);
    const b = el("button", null, li);
    b.type = "button";
    b.innerHTML = `${p.num}<span> ${p.title.split(" ")[0]}</span>`;
    b.setAttribute("aria-label", "Go to " + p.title);
    b.addEventListener("click", () => goTo(k));
  });

  // Fly to project k (0-based). Also used by the Core Domains rows.
  function goTo(k, duration = 1.6) {
    if (!st || k < 0 || k >= n) return;
    const y = st.start + (st.end - st.start) * stationS[k];
    if (typeof lenis !== "undefined" && lenis && lenis.scrollTo) lenis.scrollTo(y, { duration });
    else window.scrollTo({ top: y, behavior: "smooth" });
  }
  window.ptGoTo = goTo;

  /* ── Pointer look ────────────────────────────────── */
  if (finePointer && !reduceMotion) {
    stage.addEventListener("mousemove", (e) => {
      const r = stage.getBoundingClientRect();
      tmx = ((e.clientX - r.left) / r.width - 0.5) * 2;
      tmy = ((e.clientY - r.top) / r.height - 0.5) * 2;
    });
    stage.addEventListener("mouseleave", () => { tmx = tmy = 0; });
  }

  /* ── Custom cursor for generated tiles ───────────── */
  const cursor = document.getElementById("custom-cursor");
  if (cursor) {
    stage.addEventListener("mouseover", (e) => {
      if (e.target.closest(".pt-face.is-photo")) cursor.classList.add("explore");
      else if (e.target.closest(".pt-end a, .pt-index button")) cursor.classList.add("hover");
    });
    stage.addEventListener("mouseout", (e) => {
      if (e.target.closest(".pt-face.is-photo, .pt-end a, .pt-index button")) cursor.classList.remove("explore", "hover");
    });
  }

  /* ── Focus view ──────────────────────────────────── */
  const focus = el("div", "pt-focus", document.body);
  focus.setAttribute("role", "dialog");
  focus.setAttribute("aria-modal", "true");
  focus.innerHTML =
    '<div class="pt-focus-backdrop"></div>' +
    '<button class="pt-focus-close" type="button">Close &middot; Esc</button>' +
    '<figure class="pt-focus-card">' +
      '<img class="pt-focus-img" alt="" />' +
      '<figcaption class="pt-focus-cap">' +
        '<span class="pt-focus-num"></span><h3></h3><a target="_blank" rel="noopener">Open &#8599;</a>' +
        '<span class="pt-focus-meta"></span>' +
      '</figcaption>' +
    '</figure>';
  const fBackdrop = focus.querySelector(".pt-focus-backdrop");
  const fImg = focus.querySelector(".pt-focus-img");
  const fCap = focus.querySelector(".pt-focus-cap");
  const fClose = focus.querySelector(".pt-focus-close");
  let focusFrom = null, focusOpen = false, lastFocus = null;

  function flipFrom(rect) {
    const to = fImg.getBoundingClientRect();
    return { x: rect.left - to.left, y: rect.top - to.top, scaleX: rect.width / to.width, scaleY: rect.height / to.height };
  }

  // projectIdx + the tile's on-screen rect; `face` (DOM mode) lets the close
  // animation fly back to wherever the tile is by then.
  function openFocus(projectIdx, rect, face) {
    const p = projects[projectIdx];
    fImg.src = p.img;
    fImg.alt = p.title;
    focus.querySelector(".pt-focus-num").textContent = p.num;
    focus.querySelector("h3").textContent = p.title;
    focus.querySelector(".pt-focus-meta").textContent = p.meta;
    const a = focus.querySelector("a");
    a.hidden = !p.href;
    if (p.href) { a.href = p.href; a.textContent = p.linkText; }

    lastFocus = face || null;
    focusOpen = true;
    focus.classList.add("is-open");
    if (typeof lenis !== "undefined" && lenis && lenis.stop) lenis.stop();
    focusFrom = rect;
    const dur = reduceMotion ? 0 : 0.9;
    gsap.killTweensOf([fImg, fBackdrop, fCap, fClose]);
    gsap.fromTo(fImg, flipFrom(focusFrom), { x: 0, y: 0, scaleX: 1, scaleY: 1, duration: dur, ease: "expo.out" });
    gsap.to(fBackdrop, { opacity: 1, duration: dur * 0.6 });
    gsap.to([fCap, fClose], { opacity: 1, duration: dur * 0.6, delay: dur * 0.35 });
    fClose.focus({ preventScroll: true });
  }

  function closeFocus() {
    if (!focusOpen) return;
    focusOpen = false;
    const dur = reduceMotion ? 0 : 0.6;
    const back = lastFocus ? lastFocus.getBoundingClientRect() : focusFrom;
    gsap.to([fCap, fClose], { opacity: 0, duration: dur * 0.4 });
    gsap.to(fBackdrop, { opacity: 0, duration: dur, delay: dur * 0.2 });
    gsap.to(fImg, {
      ...flipFrom(back), duration: dur, ease: "expo.inOut",
      onComplete: () => {
        focus.classList.remove("is-open");
        gsap.set(fImg, { clearProps: "transform" });
      },
    });
    if (typeof lenis !== "undefined" && lenis && lenis.start) lenis.start();
  }

  stage.addEventListener("click", (e) => {
    if (glr) {
      // WebGL: ray-cast the tap against the walls (links/buttons keep working)
      if (e.target.closest("a, button, .pt-station")) return;
      const r = view.getBoundingClientRect();
      const hit = glr.pick(e.clientX - r.left, e.clientY - r.top, T);
      if (hit) {
        const h = hit.rect;
        openFocus(hit.project, { left: h.left + r.left, top: h.top + r.top, width: h.width, height: h.height });
      }
      return;
    }
    const face = e.target.closest(".pt-face.is-photo");
    if (face) openFocus(+face.dataset.project, face.getBoundingClientRect(), face);
  });
  fBackdrop.addEventListener("click", closeFocus);
  fClose.addEventListener("click", closeFocus);
  window.addEventListener("keydown", (e) => { if (e.key === "Escape") closeFocus(); });
  focus.addEventListener("wheel", (e) => { e.preventDefault(); closeFocus(); }, { passive: false });

  /* ── Textures ────────────────────────────────────── */
  // Tiles never show more than ~600px of a photo, so they share a 640px copy
  // instead of each rastering the full-size original. The focus view still
  // uses the original file.
  function downscale(p) {
    if (p.img.startsWith("data:")) { p.tex = p.img; return null; }
    // onload rather than img.decode(): decode() can stall in a background tab.
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        try {
          const k = Math.min(1, 640 / Math.max(img.naturalWidth, img.naturalHeight));
          const cv = document.createElement("canvas");
          cv.width = Math.round(img.naturalWidth * k);
          cv.height = Math.round(img.naturalHeight * k);
          cv.getContext("2d").drawImage(img, 0, 0, cv.width, cv.height);
          p.tex = cv.toDataURL("image/jpeg", 0.85);
        } catch (e) { p.tex = p.img; }
        resolve();
      };
      img.onerror = () => { p.tex = p.img; resolve(); };
      img.src = p.img;
    });
  }

  /* ── Scroll wiring ───────────────────────────────── */
  let built = false;
  Promise.all(projects.map(downscale)).then(() => {
    build();
    built = true;
    if (st) Tt = st.progress * Tmax;
  });

  st = ScrollTrigger.create({
    trigger: stage,
    start: "top top",
    end: () => "+=" + window.innerHeight * (n * 0.8 + 1.2),
    pin: true,
    anticipatePin: 1,
    refreshPriority: 1, // pin first so later triggers (theme, sections below) see the added height
    onUpdate: (self) => { Tt = self.progress * Tmax; },
  });
  ScrollTrigger.sort();
  ScrollTrigger.refresh();

  // Away from this section the whole 3D scene is display:none, so the rest of
  // the site doesn't pay for compositing it or for style recalcs (the theme
  // switcher tweens CSS variables on <body>, which would otherwise cascade
  // into every tile). It comes back a screen early so it's ready on arrival.
  world.style.display = "none";
  ScrollTrigger.create({
    trigger: section,
    start: "top 200%",
    end: "bottom -100%",
    onToggle: (self) => {
      visible = self.isActive;
      world.style.display = visible ? "" : "none";
      if (visible && built) render(true);
    },
  });
  gsap.ticker.add(tick);

  let lastW = window.innerWidth, resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      // Mobile URL-bar show/hide only changes height; avoid a full rebuild for that.
      if (!built || (window.innerWidth === lastW && Math.abs(view.clientHeight - H) < 120)) return;
      lastW = window.innerWidth;
      build();
      Tt = st.progress * Tmax;
      ScrollTrigger.refresh();
    }, 200);
  });
})();
