/* ═══════════════════════════════════════════════════════
   GANESAN P V — Premium Portfolio Script
   Inspired by Nothin' Studio
   ═══════════════════════════════════════════════════════ */

gsap.registerPlugin(ScrollTrigger);

// Initialize Lenis for Smooth Scroll
const lenis = new Lenis({
  lerp: 0.08,
  smoothWheel: true,
});

lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

/* ─────────────────────────────────────────
   LOADER
   ───────────────────────────────────────── */
const loaderProgress = document.getElementById("loader-progress");
const loader = document.getElementById("loader");

let progress = 0;
const updateProgress = () => {
  progress += Math.floor(Math.random() * 15) + 5;
  if (progress > 100) progress = 100;
  
  // Format as 3 digits (e.g. 008, 045, 100)
  loaderProgress.innerText = progress.toString().padStart(3, '0');

  if (progress < 100) {
    setTimeout(updateProgress, Math.random() * 50 + 20);
  } else {
    // Loader finished animation
    const tl = gsap.timeline({
      onComplete: () => {
        document.body.classList.remove('loading');
        loader.remove();
        initHeroAnimations();
      }
    });

    tl.to(".loader-content", { opacity: 0, duration: 0.5, ease: "power2.inOut" })
      .to(".loader-bg-top", { yPercent: -100, duration: 1, ease: "expo.inOut" }, "-=0.2")
      .to(".loader-bg-bottom", { yPercent: 100, duration: 1, ease: "expo.inOut" }, "-=1");
  }
};

setTimeout(updateProgress, 100);

/* ─────────────────────────────────────────
   CUSTOM CURSOR
   ───────────────────────────────────────── */
const cursor = document.getElementById("custom-cursor");
const cursorText = document.getElementById("cursor-text");
const cursorMedia = document.querySelector(".cursor-media");

document.addEventListener("mousemove", (e) => {
  gsap.to(cursor, {
    x: e.clientX,
    y: e.clientY,
    duration: 0.1,
    ease: "power2.out"
  });
});

// Cursor Hover Effects
document.querySelectorAll('[data-cursor]').forEach((el) => {
  el.addEventListener("mouseenter", () => {
    const type = el.getAttribute('data-cursor');
    if(type === 'hover') {
      cursor.classList.add("hover");
    } else if(type === 'explore') {
      cursor.classList.add("explore");
      
      // Image reveal on hover for works
      const imgSrc = el.getAttribute('data-img');
      if(imgSrc) {
        cursorMedia.innerHTML = `<img src="${imgSrc}" />`;
        cursor.classList.add("show-img");
      }
    }
  });
  
  el.addEventListener("mouseleave", () => {
    cursor.className = "custom-cursor";
    cursorMedia.innerHTML = '';
  });
});

/* ─────────────────────────────────────────
   MENU TOGGLE
   ───────────────────────────────────────── */
const navToggle = document.getElementById("nav-toggle");
const menuOverlay = document.getElementById("menu-overlay");
const menuLinks = document.querySelectorAll(".menu-link");

let menuOpen = false;

navToggle.addEventListener("click", () => {
  menuOpen = !menuOpen;
  if (menuOpen) {
    navToggle.classList.add("open");
    navToggle.querySelector(".nav-text").innerText = "CLOSE";
    menuOverlay.classList.add("active");
    document.body.classList.add("menu-open");
    lenis.stop();
    
    gsap.fromTo(menuLinks, 
      { y: 50, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "expo.out", delay: 0.3 }
    );
  } else {
    navToggle.classList.remove("open");
    navToggle.querySelector(".nav-text").innerText = "MENU";
    menuOverlay.classList.remove("active");
    document.body.classList.remove("menu-open");
    lenis.start();
  }
});

menuLinks.forEach(link => {
  link.addEventListener("click", () => {
    menuOpen = false;
    navToggle.classList.remove("open");
    navToggle.querySelector(".nav-text").innerText = "MENU";
    menuOverlay.classList.remove("active");
    document.body.classList.remove("menu-open");
    lenis.start();
  });
});

/* ─────────────────────────────────────────
   SCROLL ANIMATIONS
   ───────────────────────────────────────── */

function initHeroAnimations() {
  const heroMask = document.querySelector('.hero-mask');
  const wrappers = document.querySelectorAll('.hero-huge-wrapper');
  
  if (heroMask) {
    const liveCoords = document.getElementById('live-coords');
    const updateHeroInteractions = (x, y) => {
      heroMask.style.setProperty('--mouse-x', `${x}px`);
      heroMask.style.setProperty('--mouse-y', `${y}px`);
      
      // Update HUD Coordinates
      if (liveCoords) {
        liveCoords.textContent = `X:${String(Math.round(x)).padStart(3, '0')} Y:${String(Math.round(y)).padStart(3, '0')}`;
      }
      
      // 3D Parallax Tilt for both wrappers
      const rotateY = ((x / window.innerWidth) - 0.5) * 20;
      const rotateX = ((y / window.innerHeight) - 0.5) * -20;
      
      gsap.to(wrappers, { 
        rotateX: rotateX, 
        rotateY: rotateY, 
        duration: 0.8, 
        ease: "power2.out" 
      });
    };

    document.addEventListener('mousemove', (e) => {
      // Only track if it's a desktop/mouse device to save mobile battery and fix scroll lag
      if (window.innerWidth > 768) {
        updateHeroInteractions(e.clientX, e.clientY);
      }
    });
    // Removed heavy touchmove listener to completely eliminate mobile scroll lag
  }

  gsap.fromTo(".hero-minimal-content > *", 
    { opacity: 0, y: 30 },
    { opacity: 1, y: 0, duration: 1.5, stagger: 0.15, ease: "power3.out", delay: 0.3 }
  );

  gsap.fromTo(".hero-absolute-footer",
    { opacity: 0 },
    { opacity: 1, duration: 1, delay: 1, ease: "power2.out" }
  );
}

// ─────────────────────────────────────────
// DYNAMIC THEME SWITCHING
// ─────────────────────────────────────────
document.querySelectorAll(".theme-dark, .theme-light").forEach((section) => {
  const theme = section.classList.contains("theme-light") ? "light" : "dark";
  // hero <-> about is scrubbed below; a snap tween there would fight it.
  // (The page starts dark, so the hero needs no trigger of its own.)
  if (section.id === "hero") return;
  const isAbout = section.id === "about";

  ScrollTrigger.create({
    trigger: section,
    start: "top 50%",
    end: "bottom 50%",
    onEnter: isAbout ? undefined : () => setTheme(theme),
    onEnterBack: () => setTheme(theme)
  });
});

// Hero -> About: dark fades to light in step with the scroll instead of
// flipping at one point, so there's no flash and no hard edge.
// While the page is anywhere above the end of this range, the scrub OWNS the
// theme: setTheme() is ignored there and any running theme tween is killed.
// (Otherwise About's 1s "turn light" tween, started as you scroll up past it,
// could finish after the scrub had gone dark and leave the hero stuck white.)
let heroScrub = null;
let themeTween = null; // setTheme()'s current tween (declared here: the scrub callback uses it)
if (document.getElementById("about")) {
  heroScrub = gsap.fromTo("body",
    {
      "--c-bg-local": "#050505", "--c-text-local": "#f4f4f4", "--c-border": "rgba(255, 255, 255, 0.15)",
      backgroundColor: "#050505", color: "#f4f4f4"
    },
    {
      "--c-bg-local": "#f4f4f4", "--c-text-local": "#050505", "--c-border": "rgba(0, 0, 0, 0.15)",
      backgroundColor: "#f4f4f4", color: "#050505",
      ease: "none",
      immediateRender: false,
      scrollTrigger: {
        trigger: "#about", start: "top 95%", end: "top 25%", scrub: true,
        // only while actually inside the range; jumping past it must not kill
        // the tween the next section just started
        onUpdate: (self) => { if (self.progress < 1 && themeTween) { themeTween.kill(); themeTween = null; } }
      }
    }
  ).scrollTrigger;
}

// shorter tween on phones so a fast scroll across many sections doesn't queue
// a stack of overlapping 1s body-colour animations
const THEME_DUR = window.matchMedia("(max-width: 768px)").matches ? 0.25 : 1;
// Kill only our own previous tween. overwrite:"auto" could also kill the
// scrubbed hero->about tween (same properties) and break it for good.
function setTheme(theme) {
  // hero/about range: the scrub decides. Read the live scroll position, not
  // heroScrub.progress: triggers update in creation order, so during a jump
  // the scrub's progress can still be stale when this runs.
  if (heroScrub && heroScrub.scroll() < heroScrub.end - 1) return;
  if (themeTween) themeTween.kill();
  if(theme === 'light') {
    themeTween = gsap.to("body", {
      "--c-bg-local": "#f4f4f4",
      "--c-text-local": "#050505",
      "--c-border": "rgba(0, 0, 0, 0.15)",
      backgroundColor: "#f4f4f4",
      color: "#050505",
      duration: THEME_DUR,
      ease: "power2.out",
      overwrite: false
    });
  } else {
    themeTween = gsap.to("body", {
      "--c-bg-local": "#050505",
      "--c-text-local": "#f4f4f4",
      "--c-border": "rgba(255, 255, 255, 0.15)",
      backgroundColor: "#050505",
      color: "#f4f4f4",
      duration: THEME_DUR,
      ease: "power2.out",
      overwrite: false
    });
  }
}

// Section Headers Reveal
document.querySelectorAll(".section-header").forEach((header) => {
  gsap.fromTo(header, 
    { opacity: 0, y: 50 },
    {
      opacity: 1,
      y: 0,
      duration: 1.2,
      ease: "expo.out",
      scrollTrigger: {
        trigger: header,
        start: "top 85%",
      }
    }
  );
});

// Text Reveal Effect for About Section
document.querySelectorAll(".reveal-text").forEach((text) => {
  gsap.fromTo(text, 
    { opacity: 0, y: 30 },
    {
      opacity: 1,
      y: 0,
      duration: 1.5,
      ease: "power3.out",
      scrollTrigger: {
        trigger: text,
        start: "top 80%",
      }
    }
  );
});

// Works Row Reveal
document.querySelectorAll(".work-row").forEach((row) => {
  gsap.fromTo(row,
    { opacity: 0, x: -50 },
    {
      opacity: 1,
      x: 0,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: row,
        start: "top 90%",
      }
    }
  );
});

// Scrubbing Freeze Lines
const freezeScrub = document.querySelector(".freeze-scrub");
if(freezeScrub) { // Freeze Scrub Text
  gsap.to(".line-1", {
    x: "15vw",
    ease: "none",
    scrollTrigger: { trigger: ".freeze-scrub", start: "top bottom", end: "bottom top", scrub: 1 }
  });
  gsap.to(".line-2", {
    x: "-15vw",
    ease: "none",
    scrollTrigger: { trigger: ".freeze-scrub", start: "top bottom", end: "bottom top", scrub: 1 }
  });
  gsap.to(".line-3", {
    x: "15vw",
    ease: "none",
    scrollTrigger: { trigger: ".freeze-scrub", start: "top bottom", end: "bottom top", scrub: 1 }
  });
}

// Wins Infinite Marquee
const winsTrackLeft = document.querySelector(".marquee-left .wins-track");
if(winsTrackLeft) {
  gsap.to(winsTrackLeft, {
    xPercent: -50,
    ease: "none",
    duration: 20,
    repeat: -1
  });
}
const winsTrackRight = document.querySelector(".marquee-right .wins-track");
if(winsTrackRight) {
  gsap.set(winsTrackRight, { xPercent: -50 });
  gsap.to(winsTrackRight, {
    xPercent: 0,
    ease: "none",
    duration: 20,
    repeat: -1
  });
}

/* ═════════════════════════════════════════
   INFINITE MENU  (vanilla port of React Bits <InfiniteMenu />)
   WebGL2 draggable sphere of discs. Original: reactbits.dev
   ═════════════════════════════════════════ */
(function initInfiniteMenu() {
  const wrap = document.getElementById("infinite-menu");
  const canvas = document.getElementById("infinite-grid-menu-canvas");
  if (!wrap || !canvas) return;

  const showFallback = (err) => {
    if (err) console.error("InfiniteMenu:", err);
    // the full list below stays; just drop the (broken) sphere
    wrap.style.display = "none";
    if (window.ScrollTrigger) ScrollTrigger.refresh();
  };

  if (!window.glMatrix) return showFallback("gl-matrix not loaded");
  const { mat4, quat, vec2, vec3 } = window.glMatrix;

  /* ---- achievement data → generated card textures ---- */
  const ACHIEVEMENTS = [
    { prize: "2026",      title: "Amazon ML\nSummer School", tag: "ML PROGRAM",        highlight: true,  desc: "Selected among top students nationwide for advanced Machine Learning training." },
    { prize: "1st Prize", title: "Ingenium 5.0",            tag: "Hackathon",          highlight: false, desc: "National level hackathon winner for building scalable AI solutions." },
    { prize: "1st Prize", title: "Logical Nexus",           tag: "Competitive Prog.",  highlight: false, desc: "Top algorithmic problem solver in advanced competitive programming." },
    { prize: "1st Prize", title: "Infinity\nGauntlet",      tag: "System Design",      highlight: true,  desc: "Advanced coding competition focused on system architecture and optimization." },
    { prize: "2nd Prize", title: "Crazy Syntax",            tag: "Web Development",     highlight: true,  desc: "State-level web development and creative coding challenge." },
    { prize: "2nd Prize", title: "HackQuest CTF",           tag: "Cybersecurity",      highlight: false, desc: "Cybersecurity Capture The Flag competition runner-up." },
    { prize: "3rd Prize", title: "Code of Duty",            tag: "Algorithms",         highlight: false, desc: "Rapid prototyping and algorithmic challenge." },
    { prize: "Winner",    title: "Black Pearl",             tag: "Invite Only",        highlight: true,  desc: "Exclusive invitation-only developer tournament champion." }
  ];

  const wrapLines = (ctx, text, maxWidth) => {
    const out = [];
    text.split("\n").forEach((para) => {
      const words = para.split(/\s+/);
      let line = "";
      words.forEach((w) => {
        const test = line ? line + " " + w : w;
        if (ctx.measureText(test).width > maxWidth && line) {
          out.push(line);
          line = w;
        } else {
          line = test;
        }
      });
      out.push(line);
    });
    return out;
  };

  const makeTile = (a) => {
    const S = 512;
    const c = document.createElement("canvas");
    c.width = c.height = S;
    const x = c.getContext("2d");
    const fg = "#f4f4f4";
    const dim = a.highlight ? "rgba(244,244,244,0.72)" : "rgba(244,244,244,0.45)";
    const ring = a.highlight ? "rgba(255,255,255,0.55)" : "rgba(255,255,255,0.16)";

    x.fillStyle = "#0a0a0a";
    x.fillRect(0, 0, S, S);
    x.beginPath();
    x.arc(S / 2, S / 2, 250, 0, Math.PI * 2);
    x.fillStyle = "#141414";
    x.fill();
    x.lineWidth = a.highlight ? 3 : 2;
    x.strokeStyle = ring;
    x.stroke();

    x.textAlign = "center";

    // prize (top)
    x.fillStyle = dim;
    x.font = '600 26px "JetBrains Mono", ui-monospace, monospace';
    try { x.letterSpacing = "4px"; } catch (e) {}
    x.fillText((a.prize + (a.highlight ? "  ★" : "")).toUpperCase(), S / 2, 150);
    try { x.letterSpacing = "0px"; } catch (e) {}

    // title (centre)
    x.fillStyle = fg;
    x.font = '500 46px "Space Grotesk", "PP Neue Montreal", sans-serif';
    const lines = wrapLines(x, a.title, 360);
    const lh = 52;
    let ty = S / 2 - ((lines.length - 1) * lh) / 2 + 4;
    lines.forEach((ln) => { x.fillText(ln, S / 2, ty); ty += lh; });

    // tag (below)
    x.fillStyle = dim;
    x.font = '400 20px "JetBrains Mono", ui-monospace, monospace';
    try { x.letterSpacing = "3px"; } catch (e) {}
    x.fillText(a.tag.toUpperCase(), S / 2, ty + 22);
    try { x.letterSpacing = "0px"; } catch (e) {}

    return c.toDataURL("image/png");
  };

  /* ============ engine (ported from React Bits) ============ */
  const discVertShaderSource = `#version 300 es

uniform mat4 uWorldMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;
uniform vec3 uCameraPosition;
uniform vec4 uRotationAxisVelocity;

in vec3 aModelPosition;
in vec3 aModelNormal;
in vec2 aModelUvs;
in mat4 aInstanceMatrix;

out vec2 vUvs;
out float vAlpha;
flat out int vInstanceId;

#define PI 3.141593

void main() {
    vec4 worldPosition = uWorldMatrix * aInstanceMatrix * vec4(aModelPosition, 1.);

    vec3 centerPos = (uWorldMatrix * aInstanceMatrix * vec4(0., 0., 0., 1.)).xyz;
    float radius = length(centerPos.xyz);

    if (gl_VertexID > 0) {
        vec3 rotationAxis = uRotationAxisVelocity.xyz;
        float rotationVelocity = min(.15, uRotationAxisVelocity.w * 15.);
        vec3 stretchDir = normalize(cross(centerPos, rotationAxis));
        vec3 relativeVertexPos = normalize(worldPosition.xyz - centerPos);
        float strength = dot(stretchDir, relativeVertexPos);
        float invAbsStrength = min(0., abs(strength) - 1.);
        strength = rotationVelocity * sign(strength) * abs(invAbsStrength * invAbsStrength * invAbsStrength + 1.);
        worldPosition.xyz += stretchDir * strength;
    }

    worldPosition.xyz = radius * normalize(worldPosition.xyz);

    gl_Position = uProjectionMatrix * uViewMatrix * worldPosition;

    vAlpha = smoothstep(0.5, 1., normalize(worldPosition.xyz).z) * .9 + .1;
    vUvs = aModelUvs;
    vInstanceId = gl_InstanceID;
}
`;

  const discFragShaderSource = `#version 300 es
precision highp float;

uniform sampler2D uTex;
uniform int uItemCount;
uniform int uAtlasSize;

out vec4 outColor;

in vec2 vUvs;
in float vAlpha;
flat in int vInstanceId;

void main() {
    int itemIndex = vInstanceId % uItemCount;
    int cellsPerRow = uAtlasSize;
    int cellX = itemIndex % cellsPerRow;
    int cellY = itemIndex / cellsPerRow;
    vec2 cellSize = vec2(1.0) / vec2(float(cellsPerRow));
    vec2 cellOffset = vec2(float(cellX), float(cellY)) * cellSize;

    ivec2 texSize = textureSize(uTex, 0);
    float imageAspect = float(texSize.x) / float(texSize.y);
    float containerAspect = 1.0;

    float scale = max(imageAspect / containerAspect,
                     containerAspect / imageAspect);

    vec2 st = vec2(vUvs.x, 1.0 - vUvs.y);
    st = (st - 0.5) * scale + 0.5;

    st = clamp(st, 0.0, 1.0);

    st = st * cellSize + cellOffset;

    outColor = texture(uTex, st);
    outColor.a *= vAlpha;
}
`;

  class Face {
    constructor(a, b, c) { this.a = a; this.b = b; this.c = c; }
  }

  class Vertex {
    constructor(x, y, z) {
      this.position = vec3.fromValues(x, y, z);
      this.normal = vec3.create();
      this.uv = vec2.create();
    }
  }

  class Geometry {
    constructor() { this.vertices = []; this.faces = []; }

    addVertex(...args) {
      for (let i = 0; i < args.length; i += 3) {
        this.vertices.push(new Vertex(args[i], args[i + 1], args[i + 2]));
      }
      return this;
    }

    addFace(...args) {
      for (let i = 0; i < args.length; i += 3) {
        this.faces.push(new Face(args[i], args[i + 1], args[i + 2]));
      }
      return this;
    }

    get lastVertex() { return this.vertices[this.vertices.length - 1]; }

    subdivide(divisions = 1) {
      const midPointCache = {};
      let f = this.faces;

      for (let div = 0; div < divisions; ++div) {
        const newFaces = new Array(f.length * 4);

        f.forEach((face, ndx) => {
          const mAB = this.getMidPoint(face.a, face.b, midPointCache);
          const mBC = this.getMidPoint(face.b, face.c, midPointCache);
          const mCA = this.getMidPoint(face.c, face.a, midPointCache);

          const i = ndx * 4;
          newFaces[i + 0] = new Face(face.a, mAB, mCA);
          newFaces[i + 1] = new Face(face.b, mBC, mAB);
          newFaces[i + 2] = new Face(face.c, mCA, mBC);
          newFaces[i + 3] = new Face(mAB, mBC, mCA);
        });

        f = newFaces;
      }

      this.faces = f;
      return this;
    }

    spherize(radius = 1) {
      this.vertices.forEach((vertex) => {
        vec3.normalize(vertex.normal, vertex.position);
        vec3.scale(vertex.position, vertex.normal, radius);
      });
      return this;
    }

    get data() {
      return { vertices: this.vertexData, indices: this.indexData, normals: this.normalData, uvs: this.uvData };
    }

    get vertexData() {
      return new Float32Array(this.vertices.flatMap((v) => Array.from(v.position)));
    }

    get normalData() {
      return new Float32Array(this.vertices.flatMap((v) => Array.from(v.normal)));
    }

    get uvData() {
      return new Float32Array(this.vertices.flatMap((v) => Array.from(v.uv)));
    }

    get indexData() {
      return new Uint16Array(this.faces.flatMap((f) => [f.a, f.b, f.c]));
    }

    getMidPoint(ndxA, ndxB, cache) {
      const cacheKey = ndxA < ndxB ? `k_${ndxB}_${ndxA}` : `k_${ndxA}_${ndxB}`;
      if (Object.prototype.hasOwnProperty.call(cache, cacheKey)) return cache[cacheKey];
      const a = this.vertices[ndxA].position;
      const b = this.vertices[ndxB].position;
      const ndx = this.vertices.length;
      cache[cacheKey] = ndx;
      this.addVertex((a[0] + b[0]) * 0.5, (a[1] + b[1]) * 0.5, (a[2] + b[2]) * 0.5);
      return ndx;
    }
  }

  class IcosahedronGeometry extends Geometry {
    constructor() {
      super();
      const t = Math.sqrt(5) * 0.5 + 0.5;
      this.addVertex(
        -1, t, 0, 1, t, 0, -1, -t, 0, 1, -t, 0,
        0, -1, t, 0, 1, t, 0, -1, -t, 0, 1, -t,
        t, 0, -1, t, 0, 1, -t, 0, -1, -t, 0, 1
      ).addFace(
        0, 11, 5, 0, 5, 1, 0, 1, 7, 0, 7, 10, 0, 10, 11,
        1, 5, 9, 5, 11, 4, 11, 10, 2, 10, 7, 6, 7, 1, 8,
        3, 9, 4, 3, 4, 2, 3, 2, 6, 3, 6, 8, 3, 8, 9,
        4, 9, 5, 2, 4, 11, 6, 2, 10, 8, 6, 7, 9, 8, 1
      );
    }
  }

  class DiscGeometry extends Geometry {
    constructor(steps = 4, radius = 1) {
      super();
      steps = Math.max(4, steps);
      const alpha = (2 * Math.PI) / steps;

      this.addVertex(0, 0, 0);
      this.lastVertex.uv[0] = 0.5;
      this.lastVertex.uv[1] = 0.5;

      for (let i = 0; i < steps; ++i) {
        const x = Math.cos(alpha * i);
        const y = Math.sin(alpha * i);
        this.addVertex(radius * x, radius * y, 0);
        this.lastVertex.uv[0] = x * 0.5 + 0.5;
        this.lastVertex.uv[1] = y * 0.5 + 0.5;
        if (i > 0) this.addFace(0, i, i + 1);
      }
      this.addFace(0, steps, 1);
    }
  }

  function createShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return shader;
    console.error(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }

  function createProgram(gl, shaderSources, transformFeedbackVaryings, attribLocations) {
    const program = gl.createProgram();
    [gl.VERTEX_SHADER, gl.FRAGMENT_SHADER].forEach((type, ndx) => {
      const shader = createShader(gl, type, shaderSources[ndx]);
      if (shader) gl.attachShader(program, shader);
    });
    if (transformFeedbackVaryings) {
      gl.transformFeedbackVaryings(program, transformFeedbackVaryings, gl.SEPARATE_ATTRIBS);
    }
    if (attribLocations) {
      for (const attrib in attribLocations) gl.bindAttribLocation(program, attribLocations[attrib], attrib);
    }
    gl.linkProgram(program);
    if (gl.getProgramParameter(program, gl.LINK_STATUS)) return program;
    console.error(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return null;
  }

  function makeVertexArray(gl, bufLocNumElmPairs, indices) {
    const va = gl.createVertexArray();
    gl.bindVertexArray(va);
    for (const [buffer, loc, numElem] of bufLocNumElmPairs) {
      if (loc === -1) continue;
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, numElem, gl.FLOAT, false, 0, 0);
    }
    if (indices) {
      const indexBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
    }
    gl.bindVertexArray(null);
    return va;
  }

  function resizeCanvasToDisplaySize(canvas) {
    const dpr = Math.min(2, window.devicePixelRatio);
    const displayWidth = Math.round(canvas.clientWidth * dpr);
    const displayHeight = Math.round(canvas.clientHeight * dpr);
    const needResize = canvas.width !== displayWidth || canvas.height !== displayHeight;
    if (needResize) {
      canvas.width = displayWidth;
      canvas.height = displayHeight;
    }
    return needResize;
  }

  function makeBuffer(gl, sizeOrData, usage) {
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, sizeOrData, usage);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    return buf;
  }

  function createAndSetupTexture(gl, minFilter, magFilter, wrapS, wrapT) {
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrapS);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrapT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, minFilter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, magFilter);
    return texture;
  }

  class ArcballControl {
    isPointerDown = false;
    orientation = quat.create();
    pointerRotation = quat.create();
    rotationVelocity = 0;
    rotationAxis = vec3.fromValues(1, 0, 0);
    snapDirection = vec3.fromValues(0, 0, -1);
    snapTargetDirection;
    EPSILON = 0.1;
    IDENTITY_QUAT = quat.create();

    constructor(canvas, updateCallback) {
      this.canvas = canvas;
      this.updateCallback = updateCallback || (() => null);
      this.pointerPos = vec2.create();
      this.previousPointerPos = vec2.create();
      this._rotationVelocity = 0;
      this._combinedQuat = quat.create();

      // Hover-driven: plain mouse movement over the canvas spins the sphere —
      // no click/drag needed. Pausing or leaving lets it settle and snap to
      // the nearest disc so its label can show.
      let idleTimer = null;
      const engage = (e) => {
        vec2.set(this.pointerPos, e.clientX, e.clientY);
        if (!this.isPointerDown) vec2.copy(this.previousPointerPos, this.pointerPos);
        this.isPointerDown = true;
        clearTimeout(idleTimer);
        idleTimer = setTimeout(() => { this.isPointerDown = false; }, 140);
      };
      const release = () => { clearTimeout(idleTimer); this.isPointerDown = false; };
      canvas.addEventListener("pointerenter", engage);
      canvas.addEventListener("pointermove", engage);
      canvas.addEventListener("pointerdown", engage);
      canvas.addEventListener("pointerleave", release);
      canvas.style.touchAction = "none";
    }

    update(deltaTime, targetFrameDuration = 16) {
      const timeScale = deltaTime / targetFrameDuration + 0.00001;
      let angleFactor = timeScale;
      let snapRotation = quat.create();

      if (this.isPointerDown) {
        const INTENSITY = 0.3 * timeScale;
        const ANGLE_AMPLIFICATION = 5 / timeScale;

        const midPointerPos = vec2.sub(vec2.create(), this.pointerPos, this.previousPointerPos);
        vec2.scale(midPointerPos, midPointerPos, INTENSITY);

        if (vec2.sqrLen(midPointerPos) > this.EPSILON) {
          vec2.add(midPointerPos, this.previousPointerPos, midPointerPos);
          const p = this.#project(midPointerPos);
          const q = this.#project(this.previousPointerPos);
          const a = vec3.normalize(vec3.create(), p);
          const b = vec3.normalize(vec3.create(), q);
          vec2.copy(this.previousPointerPos, midPointerPos);
          angleFactor *= ANGLE_AMPLIFICATION;
          this.quatFromVectors(a, b, this.pointerRotation, angleFactor);
        } else {
          quat.slerp(this.pointerRotation, this.pointerRotation, this.IDENTITY_QUAT, INTENSITY);
        }
      } else {
        const INTENSITY = 0.1 * timeScale;
        quat.slerp(this.pointerRotation, this.pointerRotation, this.IDENTITY_QUAT, INTENSITY);

        if (this.snapTargetDirection) {
          const SNAPPING_INTENSITY = 0.2;
          const a = this.snapTargetDirection;
          const b = this.snapDirection;
          const sqrDist = vec3.squaredDistance(a, b);
          const distanceFactor = Math.max(0.1, 1 - sqrDist * 10);
          angleFactor *= SNAPPING_INTENSITY * distanceFactor;
          this.quatFromVectors(a, b, snapRotation, angleFactor);
        }
      }

      const combinedQuat = quat.multiply(quat.create(), snapRotation, this.pointerRotation);
      this.orientation = quat.multiply(quat.create(), combinedQuat, this.orientation);
      quat.normalize(this.orientation, this.orientation);

      const RA_INTENSITY = 0.8 * timeScale;
      quat.slerp(this._combinedQuat, this._combinedQuat, combinedQuat, RA_INTENSITY);
      quat.normalize(this._combinedQuat, this._combinedQuat);

      const rad = Math.acos(this._combinedQuat[3]) * 2.0;
      const s = Math.sin(rad / 2.0);
      let rv = 0;
      if (s > 0.000001) {
        rv = rad / (2 * Math.PI);
        this.rotationAxis[0] = this._combinedQuat[0] / s;
        this.rotationAxis[1] = this._combinedQuat[1] / s;
        this.rotationAxis[2] = this._combinedQuat[2] / s;
      }

      const RV_INTENSITY = 0.5 * timeScale;
      this._rotationVelocity += (rv - this._rotationVelocity) * RV_INTENSITY;
      this.rotationVelocity = this._rotationVelocity / timeScale;

      this.updateCallback(deltaTime);
    }

    quatFromVectors(a, b, out, angleFactor = 1) {
      const axis = vec3.cross(vec3.create(), a, b);
      vec3.normalize(axis, axis);
      const d = Math.max(-1, Math.min(1, vec3.dot(a, b)));
      const angle = Math.acos(d) * angleFactor;
      quat.setAxisAngle(out, axis, angle);
      return { q: out, axis, angle };
    }

    #project(pos) {
      const r = 2;
      const w = this.canvas.clientWidth;
      const h = this.canvas.clientHeight;
      const s = Math.max(w, h) - 1;
      const x = (2 * pos[0] - w - 1) / s;
      const y = (2 * pos[1] - h - 1) / s;
      let z = 0;
      const xySq = x * x + y * y;
      const rSq = r * r;
      if (xySq <= rSq / 2.0) z = Math.sqrt(rSq - xySq);
      else z = rSq / Math.sqrt(xySq);
      return vec3.fromValues(-x, y, z);
    }
  }

  class InfiniteGridMenu {
    TARGET_FRAME_DURATION = 1000 / 60;
    SPHERE_RADIUS = 2;

    #time = 0;
    #deltaTime = 0;
    #deltaFrames = 0;
    #frames = 0;

    camera = {
      matrix: mat4.create(),
      near: 0.1,
      far: 40,
      fov: Math.PI / 4,
      aspect: 1,
      position: vec3.fromValues(0, 0, 3),
      up: vec3.fromValues(0, 1, 0),
      matrices: { view: mat4.create(), projection: mat4.create(), inversProjection: mat4.create() }
    };

    nearestVertexIndex = null;
    smoothRotationVelocity = 0;
    scaleFactor = 1.0;
    movementActive = false;

    idleSpin = false;
    autoSpinActive = false;
    paused = false;
    _raf = 0;
    #lastInteraction = 0;

    constructor(canvas, items, onActiveItemChange, onMovementChange, onInit = null, scale = 1.0, idleSpin = false) {
      this.canvas = canvas;
      this.items = items || [];
      this.onActiveItemChange = onActiveItemChange || (() => {});
      this.onMovementChange = onMovementChange || (() => {});
      this.scaleFactor = scale;
      this.idleSpin = idleSpin;
      this.autoSpinAxis = vec3.normalize(vec3.create(), vec3.fromValues(0.25, 1, 0.12));
      this.#lastInteraction = (typeof performance !== "undefined" ? performance.now() : Date.now());
      this.camera.position[2] = 3 * scale;
      this.#init(onInit);
    }

    resize() {
      this.viewportSize = vec2.set(this.viewportSize || vec2.create(), this.canvas.clientWidth, this.canvas.clientHeight);
      const gl = this.gl;
      const needsResize = resizeCanvasToDisplaySize(gl.canvas);
      if (needsResize) gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
      this.#updateProjectionMatrix(gl);
    }

    run(time = 0) {
      if (this.paused) { this._raf = 0; return; }
      this.#deltaTime = Math.min(32, time - this.#time);
      this.#time = time;
      this.#deltaFrames = this.#deltaTime / this.TARGET_FRAME_DURATION;
      this.#frames += this.#deltaFrames;
      this.#animate(this.#deltaTime);
      this.#render();
      this._raf = requestAnimationFrame((t) => this.run(t));
    }

    // stop the render loop entirely while the sphere is off-screen or the tab
    // is hidden — a permanently running WebGL loop is the main mobile scroll cost
    setPaused(p) {
      if (p === this.paused) return;
      this.paused = p;
      if (!p && !this._raf) {
        this.#time = (typeof performance !== "undefined" ? performance.now() : Date.now());
        this._raf = requestAnimationFrame((t) => this.run(t));
      }
    }

    #init(onInit) {
      this.gl = this.canvas.getContext("webgl2", { antialias: true, alpha: true });
      const gl = this.gl;
      if (!gl) throw new Error("No WebGL 2 context!");

      this.viewportSize = vec2.fromValues(this.canvas.clientWidth, this.canvas.clientHeight);
      this.drawBufferSize = vec2.clone(this.viewportSize);

      this.discProgram = createProgram(gl, [discVertShaderSource, discFragShaderSource], null, {
        aModelPosition: 0,
        aModelNormal: 1,
        aModelUvs: 2,
        aInstanceMatrix: 3
      });

      this.discLocations = {
        aModelPosition: gl.getAttribLocation(this.discProgram, "aModelPosition"),
        aModelUvs: gl.getAttribLocation(this.discProgram, "aModelUvs"),
        aInstanceMatrix: gl.getAttribLocation(this.discProgram, "aInstanceMatrix"),
        uWorldMatrix: gl.getUniformLocation(this.discProgram, "uWorldMatrix"),
        uViewMatrix: gl.getUniformLocation(this.discProgram, "uViewMatrix"),
        uProjectionMatrix: gl.getUniformLocation(this.discProgram, "uProjectionMatrix"),
        uCameraPosition: gl.getUniformLocation(this.discProgram, "uCameraPosition"),
        uScaleFactor: gl.getUniformLocation(this.discProgram, "uScaleFactor"),
        uRotationAxisVelocity: gl.getUniformLocation(this.discProgram, "uRotationAxisVelocity"),
        uTex: gl.getUniformLocation(this.discProgram, "uTex"),
        uFrames: gl.getUniformLocation(this.discProgram, "uFrames"),
        uItemCount: gl.getUniformLocation(this.discProgram, "uItemCount"),
        uAtlasSize: gl.getUniformLocation(this.discProgram, "uAtlasSize")
      };

      this.discGeo = new DiscGeometry(56, 1);
      this.discBuffers = this.discGeo.data;
      this.discVAO = makeVertexArray(
        gl,
        [
          [makeBuffer(gl, this.discBuffers.vertices, gl.STATIC_DRAW), this.discLocations.aModelPosition, 3],
          [makeBuffer(gl, this.discBuffers.uvs, gl.STATIC_DRAW), this.discLocations.aModelUvs, 2]
        ],
        this.discBuffers.indices
      );

      this.icoGeo = new IcosahedronGeometry();
      this.icoGeo.subdivide(1).spherize(this.SPHERE_RADIUS);
      this.instancePositions = this.icoGeo.vertices.map((v) => v.position);
      this.DISC_INSTANCE_COUNT = this.icoGeo.vertices.length;
      this.#initDiscInstances(this.DISC_INSTANCE_COUNT);

      this.worldMatrix = mat4.create();
      this.#initTexture();

      this.control = new ArcballControl(this.canvas, (deltaTime) => this.#onControlUpdate(deltaTime));

      this.#updateCameraMatrix();
      this.#updateProjectionMatrix(gl);
      this.resize();

      if (onInit) onInit(this);
    }

    #initTexture() {
      const gl = this.gl;
      this.tex = createAndSetupTexture(gl, gl.LINEAR, gl.LINEAR, gl.CLAMP_TO_EDGE, gl.CLAMP_TO_EDGE);

      const itemCount = Math.max(1, this.items.length);
      this.atlasSize = Math.ceil(Math.sqrt(itemCount));
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const cellSize = 512;

      canvas.width = this.atlasSize * cellSize;
      canvas.height = this.atlasSize * cellSize;

      Promise.all(
        this.items.map(
          (item) =>
            new Promise((resolve) => {
              const img = new Image();
              img.crossOrigin = "anonymous";
              img.onload = () => resolve(img);
              img.src = item.image;
            })
        )
      ).then((images) => {
        images.forEach((img, i) => {
          const x = (i % this.atlasSize) * cellSize;
          const y = Math.floor(i / this.atlasSize) * cellSize;
          ctx.drawImage(img, x, y, cellSize, cellSize);
        });
        gl.bindTexture(gl.TEXTURE_2D, this.tex);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, canvas);
        gl.generateMipmap(gl.TEXTURE_2D);
      });
    }

    #initDiscInstances(count) {
      const gl = this.gl;
      this.discInstances = {
        matricesArray: new Float32Array(count * 16),
        matrices: [],
        buffer: gl.createBuffer()
      };
      for (let i = 0; i < count; ++i) {
        const instanceMatrixArray = new Float32Array(this.discInstances.matricesArray.buffer, i * 16 * 4, 16);
        instanceMatrixArray.set(mat4.create());
        this.discInstances.matrices.push(instanceMatrixArray);
      }
      gl.bindVertexArray(this.discVAO);
      gl.bindBuffer(gl.ARRAY_BUFFER, this.discInstances.buffer);
      gl.bufferData(gl.ARRAY_BUFFER, this.discInstances.matricesArray.byteLength, gl.DYNAMIC_DRAW);
      const mat4AttribSlotCount = 4;
      const bytesPerMatrix = 16 * 4;
      for (let j = 0; j < mat4AttribSlotCount; ++j) {
        const loc = this.discLocations.aInstanceMatrix + j;
        gl.enableVertexAttribArray(loc);
        gl.vertexAttribPointer(loc, 4, gl.FLOAT, false, bytesPerMatrix, j * 4 * 4);
        gl.vertexAttribDivisor(loc, 1);
      }
      gl.bindBuffer(gl.ARRAY_BUFFER, null);
      gl.bindVertexArray(null);
    }

    #animate(deltaTime) {
      const gl = this.gl;
      this.control.update(deltaTime, this.TARGET_FRAME_DURATION);

      // gentle idle auto-rotation (used on touch devices that can't hover)
      if (this.autoSpinActive && !this.control.isPointerDown) {
        const step = 0.0022 * (deltaTime / this.TARGET_FRAME_DURATION);
        const q = quat.setAxisAngle(quat.create(), this.autoSpinAxis, step);
        quat.multiply(this.control.orientation, q, this.control.orientation);
        quat.normalize(this.control.orientation, this.control.orientation);
      }

      const positions = this.instancePositions.map((p) => vec3.transformQuat(vec3.create(), p, this.control.orientation));
      const scale = 0.25;
      const SCALE_INTENSITY = 0.6;
      positions.forEach((p, ndx) => {
        const s = (Math.abs(p[2]) / this.SPHERE_RADIUS) * SCALE_INTENSITY + (1 - SCALE_INTENSITY);
        const finalScale = s * scale;
        const matrix = mat4.create();
        mat4.multiply(matrix, matrix, mat4.fromTranslation(mat4.create(), vec3.negate(vec3.create(), p)));
        mat4.multiply(matrix, matrix, mat4.targetTo(mat4.create(), [0, 0, 0], p, [0, 1, 0]));
        mat4.multiply(matrix, matrix, mat4.fromScaling(mat4.create(), [finalScale, finalScale, finalScale]));
        mat4.multiply(matrix, matrix, mat4.fromTranslation(mat4.create(), [0, 0, -this.SPHERE_RADIUS]));
        mat4.copy(this.discInstances.matrices[ndx], matrix);
      });

      gl.bindBuffer(gl.ARRAY_BUFFER, this.discInstances.buffer);
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.discInstances.matricesArray);
      gl.bindBuffer(gl.ARRAY_BUFFER, null);

      this.smoothRotationVelocity = this.control.rotationVelocity;
    }

    #render() {
      const gl = this.gl;
      gl.useProgram(this.discProgram);
      gl.enable(gl.CULL_FACE);
      gl.enable(gl.DEPTH_TEST);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      gl.uniformMatrix4fv(this.discLocations.uWorldMatrix, false, this.worldMatrix);
      gl.uniformMatrix4fv(this.discLocations.uViewMatrix, false, this.camera.matrices.view);
      gl.uniformMatrix4fv(this.discLocations.uProjectionMatrix, false, this.camera.matrices.projection);
      gl.uniform3f(this.discLocations.uCameraPosition, this.camera.position[0], this.camera.position[1], this.camera.position[2]);
      gl.uniform4f(
        this.discLocations.uRotationAxisVelocity,
        this.control.rotationAxis[0],
        this.control.rotationAxis[1],
        this.control.rotationAxis[2],
        this.smoothRotationVelocity * 1.1
      );

      gl.uniform1i(this.discLocations.uItemCount, this.items.length);
      gl.uniform1i(this.discLocations.uAtlasSize, this.atlasSize);
      gl.uniform1f(this.discLocations.uFrames, this.#frames);
      gl.uniform1f(this.discLocations.uScaleFactor, this.scaleFactor);
      gl.uniform1i(this.discLocations.uTex, 0);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, this.tex);

      gl.bindVertexArray(this.discVAO);
      gl.drawElementsInstanced(gl.TRIANGLES, this.discBuffers.indices.length, gl.UNSIGNED_SHORT, 0, this.DISC_INSTANCE_COUNT);
    }

    #updateCameraMatrix() {
      mat4.targetTo(this.camera.matrix, this.camera.position, [0, 0, 0], this.camera.up);
      mat4.invert(this.camera.matrices.view, this.camera.matrix);
    }

    #updateProjectionMatrix(gl) {
      this.camera.aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
      const height = this.SPHERE_RADIUS * 0.35;
      const distance = this.camera.position[2];
      if (this.camera.aspect > 1) this.camera.fov = 2 * Math.atan(height / distance);
      else this.camera.fov = 2 * Math.atan(height / this.camera.aspect / distance);
      mat4.perspective(this.camera.matrices.projection, this.camera.fov, this.camera.aspect, this.camera.near, this.camera.far);
      mat4.invert(this.camera.matrices.inversProjection, this.camera.matrices.projection);
    }

    #onControlUpdate(deltaTime) {
      const timeScale = deltaTime / this.TARGET_FRAME_DURATION + 0.0001;
      let damping = 5 / timeScale;
      let cameraTargetZ = 3 * this.scaleFactor;

      const now = (typeof performance !== "undefined" ? performance.now() : Date.now());
      if (this.control.isPointerDown) this.#lastInteraction = now;
      this.autoSpinActive = this.idleSpin && !this.control.isPointerDown && now - this.#lastInteraction > 2200;

      const isMoving = this.control.isPointerDown || Math.abs(this.smoothRotationVelocity) > 0.01;
      if (isMoving !== this.movementActive) {
        this.movementActive = isMoving;
        this.onMovementChange(isMoving);
      }

      if (!this.control.isPointerDown) {
        const nearestVertexIndex = this.#findNearestVertexIndex();
        const itemIndex = nearestVertexIndex % Math.max(1, this.items.length);
        this.onActiveItemChange(itemIndex);
        if (this.autoSpinActive) {
          // let it drift freely while idle-spinning
          this.control.snapTargetDirection = null;
        } else {
          const snapDirection = vec3.normalize(vec3.create(), this.#getVertexWorldPosition(nearestVertexIndex));
          this.control.snapTargetDirection = snapDirection;
        }
      } else {
        cameraTargetZ += this.control.rotationVelocity * 80 + 2.5;
        damping = 7 / timeScale;
      }

      this.camera.position[2] += (cameraTargetZ - this.camera.position[2]) / damping;
      this.#updateCameraMatrix();
    }

    #findNearestVertexIndex() {
      const n = this.control.snapDirection;
      const inversOrientation = quat.conjugate(quat.create(), this.control.orientation);
      const nt = vec3.transformQuat(vec3.create(), n, inversOrientation);
      let maxD = -1;
      let nearestVertexIndex;
      for (let i = 0; i < this.instancePositions.length; ++i) {
        const d = vec3.dot(nt, this.instancePositions[i]);
        if (d > maxD) { maxD = d; nearestVertexIndex = i; }
      }
      return nearestVertexIndex;
    }

    #getVertexWorldPosition(index) {
      const nearestVertexPos = this.instancePositions[index];
      return vec3.transformQuat(vec3.create(), nearestVertexPos, this.control.orientation);
    }
  }

  /* ---- boot ---- */
  const boot = () => {
    let items;
    try {
      items = ACHIEVEMENTS.map((a) => ({
        image: makeTile(a),
        link: "",
        title: a.title.replace(/\n/g, " "),
        description: a.desc,
        prize: a.prize,
        tag: a.tag,
        highlight: a.highlight
      }));
    } catch (e) { return showFallback(e); }

    const touch = window.matchMedia("(hover: none)").matches;

    const titleEl = wrap.querySelector(".face-title");
    const descEl = wrap.querySelector(".face-description");

    // mobile caption (below the sphere, where the side labels can't fit)
    const cap = document.querySelector(".menu-caption");
    const capInner = cap && cap.querySelector(".cap-inner");
    const capPrize = cap && cap.querySelector(".cap-prize");
    const capTitle = cap && cap.querySelector(".cap-title");
    const capDesc = cap && cap.querySelector(".cap-desc");

    // sphere ↔ list sync
    const listCards = Array.prototype.slice.call(document.querySelectorAll(".wins-list .win-card"));

    let moving = false;
    let shownIdx = -1;
    let capTimer = null;

    const paint = () => {
      const state = moving ? "inactive" : "active";
      if (titleEl) titleEl.className = "face-title " + state;
      if (descEl) descEl.className = "face-description " + state;
      wrap.classList.toggle("is-settled", !moving);
    };

    const setCaption = (it) => {
      if (!cap || !capInner) return;
      capInner.classList.add("swap");
      clearTimeout(capTimer);
      capTimer = setTimeout(() => {
        if (capPrize) capPrize.textContent = [it.prize, it.tag].filter(Boolean).join("  ·  ");
        if (capTitle) capTitle.textContent = it.title;
        if (capDesc) capDesc.textContent = it.description;
        capInner.classList.remove("swap");
      }, 180);
    };

    const onActive = (index) => {
      const i = ((index % items.length) + items.length) % items.length;
      const it = items[i];
      if (!it) return;
      if (titleEl) titleEl.textContent = it.title;
      if (descEl) descEl.textContent = it.description;
      if (i !== shownIdx) {
        shownIdx = i;
        setCaption(it);
        listCards.forEach((c, n) => c.classList.toggle("is-current", n === i));
      }
      paint();
    };
    const onMove = (m) => { moving = m; paint(); };

    let sketch;
    try {
      sketch = new InfiniteGridMenu(canvas, items, onActive, onMove, (sk) => sk.run(), touch ? 1.35 : 1.6, touch);
    } catch (e) { return showFallback(e); }

    // dismiss the swipe hint after the first touch
    const hint = wrap.querySelector(".menu-hint");
    if (hint) {
      canvas.addEventListener("pointerdown", () => hint.classList.add("gone"), { once: true });
    }

    const onResize = () => sketch.resize();
    window.addEventListener("resize", onResize);
    onResize();
    if (window.ScrollTrigger) ScrollTrigger.refresh();

    // Only render the sphere while it's actually on (or near) the screen and the
    // tab is visible. Off-screen it stops completely — this is what keeps fast
    // scrolling (e.g. flicking back up to the hero) smooth on phones.
    let inView = true;
    let docVisible = !document.hidden;
    const applyPause = () => sketch.setPaused(!(inView && docVisible));
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(
        (entries) => { inView = entries[0].isIntersecting; applyPause(); },
        { rootMargin: "300px 0px" }
      ).observe(wrap);
    }
    document.addEventListener("visibilitychange", () => {
      docVisible = !document.hidden;
      applyPause();
    });
  };

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(boot).catch(boot);
  } else {
    boot();
  }
})();


/* ═════════════════════════════════════════
   ABOUT ID CARD — monochrome tilt + parallax depth
   Cursor (or device tilt on mobile) drives --rx/--ry for the 3D
   rotation and --px/--py for the per-layer parallax offsets.
   ═════════════════════════════════════════ */
(function initIdCard() {
  const wrap = document.getElementById("about-idcard");
  if (!wrap) return;
  const shell = wrap.querySelector(".idcard-shell");
  if (!shell) return;

  // Contact button → jump to the contact section
  const btn = wrap.querySelector(".idcard-contact");
  if (btn) {
    btn.addEventListener("click", () => {
      const target = document.getElementById("contact");
      if (!target) return;
      if (typeof lenis !== "undefined" && lenis && lenis.scrollTo) lenis.scrollTo(target);
      else target.scrollIntoView({ behavior: "smooth" });
    });
  }

  // Reveal-on-enter. Base CSS keeps the card visible; `js-ready` is what hides
  // it, so if any of this fails the card still shows rather than staying blank.
  wrap.classList.add("js-ready");
  const reveal = () => wrap.classList.add("is-revealed");
  setTimeout(reveal, 4000); // hard safety net

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced) return;

  const touch = window.matchMedia("(hover: none)").matches;
  const clamp01 = (v) => Math.min(1, Math.max(0, v));
  const round = (v, p = 3) => parseFloat(v.toFixed(p));

  const MAX_RX = 9;   // deg — tilt back/forward
  const MAX_RY = 11;  // deg — tilt left/right
  const TAU = 0.13, TAU0 = 0.55, INITIAL_MS = 1100;
  const TILT_SENSITIVITY = 4.5;

  let rafId = null, running = false, lastTs = 0, paused = false;
  let curX = 0, curY = 0, tgtX = 0, tgtY = 0, initialUntil = 0;

  const applyXY = (x, y) => {
    const w = shell.clientWidth || 1;
    const h = shell.clientHeight || 1;
    const nx = clamp01(x / w);
    const ny = clamp01(y / h);
    const px = nx - 0.5;
    const py = ny - 0.5;
    const s = wrap.style;
    s.setProperty("--px", round(px));
    s.setProperty("--py", round(py));
    s.setProperty("--pointer-x", round(nx * 100) + "%");
    s.setProperty("--pointer-y", round(ny * 100) + "%");
    s.setProperty("--rx", round(-py * MAX_RX) + "deg");
    s.setProperty("--ry", round(px * MAX_RY) + "deg");
  };

  const step = (ts) => {
    if (!running) return;
    if (!lastTs) lastTs = ts;
    const dt = (ts - lastTs) / 1000;
    lastTs = ts;
    const k = 1 - Math.exp(-dt / (ts < initialUntil ? TAU0 : TAU));
    curX += (tgtX - curX) * k;
    curY += (tgtY - curY) * k;
    applyXY(curX, curY);
    if (Math.abs(tgtX - curX) > 0.05 || Math.abs(tgtY - curY) > 0.05) {
      rafId = requestAnimationFrame(step);
    } else {
      running = false; lastTs = 0; rafId = null;
    }
  };
  const start = () => {
    if (running || paused) return;
    running = true; lastTs = 0;
    rafId = requestAnimationFrame(step);
  };
  const setTarget = (x, y) => { tgtX = x; tgtY = y; start(); };
  const toCenter = () => setTarget(shell.clientWidth / 2, shell.clientHeight / 2);

  const setPaused = (p) => {
    paused = p;
    wrap.classList.toggle("is-paused", p);
    if (p && rafId) { cancelAnimationFrame(rafId); rafId = null; running = false; lastTs = 0; }
  };

  // Pointer tilt — fine pointers only, so touch scrolling stays untouched
  if (!touch) {
    let leaveRaf = null;
    const off = (e) => {
      const r = shell.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    shell.addEventListener("pointerenter", (e) => {
      wrap.classList.add("is-active");
      const p = off(e); setTarget(p.x, p.y);
    });
    shell.addEventListener("pointermove", (e) => { const p = off(e); setTarget(p.x, p.y); });
    shell.addEventListener("pointerleave", () => {
      toCenter();
      const settle = () => {
        if (Math.hypot(tgtX - curX, tgtY - curY) < 0.8) {
          wrap.classList.remove("is-active");
          leaveRaf = null;
        } else {
          leaveRaf = requestAnimationFrame(settle);
        }
      };
      if (leaveRaf) cancelAnimationFrame(leaveRaf);
      leaveRaf = requestAnimationFrame(settle);
    });
  }

  // Device-orientation tilt on mobile — armed on first tap (iOS needs HTTPS)
  const onOrient = (e) => {
    if (e.beta == null || e.gamma == null) return;
    const cx = shell.clientWidth / 2;
    const cy = shell.clientHeight / 2;
    setTarget(
      Math.min(shell.clientWidth, Math.max(0, cx + e.gamma * TILT_SENSITIVITY)),
      Math.min(shell.clientHeight, Math.max(0, cy + (e.beta - 20) * TILT_SENSITIVITY))
    );
  };
  shell.addEventListener("click", () => {
    wrap.classList.add("is-active");
    const DME = window.DeviceMotionEvent;
    if (DME && typeof DME.requestPermission === "function") {
      DME.requestPermission()
        .then((st) => { if (st === "granted") window.addEventListener("deviceorientation", onOrient); })
        .catch(() => {});
    } else if ("DeviceOrientationEvent" in window) {
      window.addEventListener("deviceorientation", onOrient);
    }
  });

  // Entrance sweep — light rakes across the card once, then settles flat
  curX = (shell.clientWidth || 0) - 70;
  curY = 60;
  applyXY(curX, curY);
  initialUntil = performance.now() + INITIAL_MS;
  toCenter();

  // Reveal on first entry; also pause the sheen + rAF while off-screen
  // or while the tab is hidden.
  let inView = true, vis = !document.hidden;
  const applyPause = () => setPaused(!(inView && vis));
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(
      (es) => {
        inView = es[0].isIntersecting;
        if (inView) reveal();
        applyPause();
      },
      { rootMargin: "200px 0px" }
    ).observe(wrap);
  } else {
    reveal();
  }
  document.addEventListener("visibilitychange", () => { vis = !document.hidden; applyPause(); });
})();
// Dock Dark Mode observer
(function initDockColor() {
  const dock = document.querySelector(".dock");
  if (!dock) return;
  const sections = document.querySelectorAll(".theme-light, .theme-dark");
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Hide dock if the hero section is behind it
        if (entry.target.id === "hero") {
          dock.classList.add("dock-hidden");
        } else {
          dock.classList.remove("dock-hidden");
        }
        
        // Update text color based on section theme
        if (entry.target.classList.contains("theme-light")) {
          dock.classList.add("dock-dark-text");
        } else {
          dock.classList.remove("dock-dark-text");
        }
      }
    });
  }, {
    rootMargin: "-80% 0px -10% 0px", 
    threshold: 0
  });
  sections.forEach(sec => observer.observe(sec));
})();



