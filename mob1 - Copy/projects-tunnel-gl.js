/* ═══════════════════════════════════════════════════════
   WORKS — Project Tunnel, WebGL renderer (phones)
   Same corridor as the CSS-3D version, drawn as one canvas: all
   geometry and textures are uploaded once, and each frame only
   changes the camera offset uniform. Mobile GPUs choke on ~100
   CSS 3D layers being re-rastered as they fly at the camera; this
   is a single cheap draw instead.

   Coordinates match the CSS version: x right, y down, z toward the
   viewer, camera eye at z = P (the CSS perspective distance).
   ═══════════════════════════════════════════════════════ */
(function () {
  const BG = [5 / 255, 5 / 255, 5 / 255];

  const VS_WALL = `
    attribute vec3 aPos; attribute vec2 aGrid;
    uniform float uT, uP, uHW, uHH;
    varying vec2 vGrid; varying float vDist;
    void main() {
      float z = aPos.z + uT;
      vDist = uP - z;
      vGrid = aGrid;
      gl_Position = vec4(aPos.x / uHW, -aPos.y / uHH, 0.0, vDist / uP);
    }`;
  const FS_WALL = `
    #extension GL_OES_standard_derivatives : enable
    #ifdef GL_FRAGMENT_PRECISION_HIGH
    precision highp float;
    #else
    precision mediump float;
    #endif
    uniform float uC, uFogNear, uFogFar;
    varying vec2 vGrid; varying float vDist;
    void main() {
      vec2 g = vGrid / uC;
      vec2 fw = max(fwidth(g), vec2(1e-4));
      vec2 a = abs(fract(g - 0.5) - 0.5) / fw;
      float line = 1.0 - min(min(a.x, a.y), 1.0);
      float f = 1.0 - clamp((vDist - uFogNear) / (uFogFar - uFogNear), 0.0, 1.0);
      f *= f;
      vec3 bg = vec3(${BG.join(",")});
      gl_FragColor = vec4(bg + (vec3(0.957) - bg) * line * 0.13 * f, 1.0);
    }`;

  const VS_TILE = `
    attribute vec3 aPos; attribute vec2 aUV; attribute vec4 aRect; attribute float aDim;
    uniform float uT, uP, uHW, uHH;
    varying vec2 vUV; varying vec2 vTex; varying float vDist; varying float vDim;
    void main() {
      float z = aPos.z + uT;
      vDist = uP - z;
      vUV = aUV;
      vTex = aRect.xy + aUV * aRect.zw;
      vDim = aDim;
      gl_Position = vec4(aPos.x / uHW, -aPos.y / uHH, 0.0, vDist / uP);
    }`;
  const FS_TILE = `
    #ifdef GL_FRAGMENT_PRECISION_HIGH
    precision highp float;
    #else
    precision mediump float;
    #endif
    uniform sampler2D uAtlas;
    uniform float uFogNear, uFogFar, uRadius;
    varying vec2 vUV; varying vec2 vTex; varying float vDist; varying float vDim;
    void main() {
      // rounded corners
      vec2 q = abs(vUV - 0.5) - (0.5 - uRadius);
      float d = length(max(q, 0.0)) - uRadius;
      float edge = 1.0 - smoothstep(-0.006, 0.006, d);
      vec4 t = texture2D(uAtlas, vTex);
      float f = 1.0 - clamp((vDist - uFogNear) / (uFogFar - uFogNear), 0.0, 1.0);
      f *= f;
      gl_FragColor = vec4(t.rgb * vDim, t.a * edge * f);
    }`;

  function compile(gl, type, src) {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
    return s;
  }
  function program(gl, vs, fs) {
    const p = gl.createProgram();
    gl.attachShader(p, compile(gl, gl.VERTEX_SHADER, vs));
    gl.attachShader(p, compile(gl, gl.FRAGMENT_SHADER, fs));
    gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p));
    return p;
  }
  function loadImage(src) {
    return new Promise((res) => {
      const im = new Image();
      im.onload = () => res(im);
      im.onerror = () => res(null);
      im.src = src;
    });
  }

  /* Texture atlas, 2048². Photos get 512px slots (indices 0-7, top half);
     number/word tiles get 256px slots in the bottom half. */
  async function buildAtlas(projects, labels) {
    const S = 2048, cv = document.createElement("canvas");
    cv.width = cv.height = S;
    const g = cv.getContext("2d");
    const rects = { photo: [], label: new Map() };
    const imgs = await Promise.all(projects.map((p) => loadImage(p.tex)));
    imgs.forEach((im, k) => {
      const x = (k % 4) * 512, y = Math.floor(k / 4) * 512;
      if (im) {
        // cover-fit into the square slot
        const s = Math.max(512 / im.naturalWidth, 512 / im.naturalHeight);
        const w = im.naturalWidth * s, h = im.naturalHeight * s;
        g.drawImage(im, x + (512 - w) / 2, y + (512 - h) / 2, w, h);
      } else {
        g.fillStyle = "#111"; g.fillRect(x, y, 512, 512);
      }
      rects.photo[k] = [x / S, y / S, 512 / S, 512 / S];
    });
    try {
      await Promise.all([
        document.fonts.load('italic 140px "Instrument Serif"'),
        document.fonts.load('22px "JetBrains Mono"'),
      ]);
    } catch (e) { /* fall back to whatever is available */ }
    let slot = 0;
    labels.forEach((lab) => {
      const x = (slot % 8) * 256, y = 1024 + Math.floor(slot / 8) * 256;
      slot++;
      if (lab.kind === "num") {
        g.fillStyle = "#f4f4f4"; g.fillRect(x, y, 256, 256);
        g.fillStyle = "#050505";
        g.font = 'italic 150px "Instrument Serif", serif';
        g.textBaseline = "alphabetic";
        g.fillText(lab.text, x + 20, y + 236);
      } else {
        g.strokeStyle = "rgba(244,244,244,0.28)"; g.lineWidth = 3;
        g.strokeRect(x + 2, y + 2, 252, 252);
        g.fillStyle = "rgba(244,244,244,0.75)";
        g.font = '22px "JetBrains Mono", monospace';
        g.textBaseline = "top";
        const t = lab.text.toUpperCase().split("").join(String.fromCharCode(8202)); // hair-space tracking
        g.fillText(t, x + 22, y + 24, 212);
      }
      rects.label.set(lab.key, [x / S, y / S, 256 / S, 256 / S]);
    });
    return { canvas: cv, rects };
  }

  /* opts: { canvas, W, H, P, c, TW, TH, L, gap, dpr, cells, projects, fogNear, fogFar }
     cells: [{ wall: "floor"|"ceil"|"left"|"right", r, i, kind, project, text, bx, by }] */
  window.PTGL = {
    create(opts) {
      const { canvas, W, H, P, c, TW, TH, L, gap, dpr, cells, projects } = opts;
      const gl = canvas.getContext("webgl", { antialias: true, alpha: false, premultipliedAlpha: false, powerPreference: "high-performance" });
      if (!gl) return null;
      gl.getExtension("OES_standard_derivatives");
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);

      let wallProg, tileProg;
      try {
        wallProg = program(gl, VS_WALL, FS_WALL);
        tileProg = program(gl, VS_TILE, FS_TILE);
      } catch (e) { console.warn("Tunnel WebGL unavailable:", e); return null; }

      /* walls: 4 long quads; aGrid = in-plane coords for the grid lines */
      const hw = TW / 2, hh = TH / 2, zf = -L;
      const wallV = [];
      const quad = (p0, p1, p2, p3, g0, g1, g2, g3) => {
        [[p0, g0], [p1, g1], [p2, g2], [p0, g0], [p2, g2], [p3, g3]].forEach(([p, gg]) => wallV.push(...p, ...gg));
      };
      quad([-hw, hh, 0], [hw, hh, 0], [hw, hh, zf], [-hw, hh, zf], [0, 0], [TW, 0], [TW, L], [0, L]);        // floor
      quad([-hw, -hh, 0], [hw, -hh, 0], [hw, -hh, zf], [-hw, -hh, zf], [0, 0], [TW, 0], [TW, L], [0, L]);    // ceiling
      quad([-hw, -hh, 0], [-hw, hh, 0], [-hw, hh, zf], [-hw, -hh, zf], [0, 0], [TH, 0], [TH, L], [0, L]);    // left
      quad([hw, -hh, 0], [hw, hh, 0], [hw, hh, zf], [hw, -hh, zf], [0, 0], [TH, 0], [TH, L], [0, L]);        // right
      const wallBuf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, wallBuf);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(wallV), gl.STATIC_DRAW);
      const wallCount = wallV.length / 5;

      /* tiles: corners in world space, oriented like the CSS faces */
      const size = c - gap * 2;
      const tileCorners = (cell) => {
        const zn = -cell.r * c - gap, zfar = -(cell.r + 1) * c + gap; // near / far edge of the tile
        const a = cell.i * c + gap, b = a + size;                    // across the wall
        // returns [topLeft, topRight, bottomRight, bottomLeft] in texture orientation
        switch (cell.wall) {
          case "floor": return [[-hw + a, hh, zfar], [-hw + b, hh, zfar], [-hw + b, hh, zn], [-hw + a, hh, zn]];
          case "ceil":  return [[-hw + a, -hh, zn], [-hw + b, -hh, zn], [-hw + b, -hh, zfar], [-hw + a, -hh, zfar]];
          case "left":  return [[-hw, -hh + a, zn], [-hw, -hh + a, zfar], [-hw, -hh + b, zfar], [-hw, -hh + b, zn]];
          default:      return [[hw, -hh + a, zfar], [hw, -hh + a, zn], [hw, -hh + b, zn], [hw, -hh + b, zfar]];
        }
      };
      // nudge tiles 0.5px off the wall toward the tunnel axis so lines never show through
      const inset = (p, wall) => {
        const q = p.slice();
        if (wall === "floor") q[1] -= 0.5; else if (wall === "ceil") q[1] += 0.5;
        else if (wall === "left") q[0] += 0.5; else q[0] -= 0.5;
        return q;
      };

      const labels = [], labelKey = (k) => k.kind + ":" + k.text;
      cells.forEach((cell) => {
        if (cell.kind === "photo") return;
        const key = labelKey(cell);
        if (!labels.some((l) => l.key === key)) labels.push({ key, kind: cell.kind, text: cell.text });
      });

      let tileBuf = null, tileCount = 0, tex = null, ready = false;
      const readyP = buildAtlas(projects, labels).then(({ canvas: atlas, rects }) => {
        const v = [];
        const ZOOM = 1 / 1.6; // photo crop: show 62% of the image, like a zoomed background
        cells.forEach((cell) => {
          let rect, dim = 1;
          if (cell.kind === "photo") {
            const pr = rects.photo[cell.project];
            const s = ZOOM;
            rect = [pr[0] + pr[2] * (1 - s) * cell.bx, pr[1] + pr[3] * (1 - s) * cell.by, pr[2] * s, pr[3] * s];
            dim = 0.58; // same darkening as the CSS overlay
          } else {
            rect = rects.label.get(labelKey(cell));
          }
          const [p0, p1, p2, p3] = tileCorners(cell).map((p) => inset(p, cell.wall));
          const uv = [[0, 0], [1, 0], [1, 1], [0, 1]];
          [[p0, uv[0]], [p1, uv[1]], [p2, uv[2]], [p0, uv[0]], [p2, uv[2]], [p3, uv[3]]]
            .forEach(([p, t]) => v.push(...p, ...t, ...rect, dim));
        });
        tileBuf = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, tileBuf);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(v), gl.STATIC_DRAW);
        tileCount = v.length / 10;

        tex = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, atlas);
        gl.generateMipmap(gl.TEXTURE_2D);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        ready = true;
      });

      const U = (prog, names) => Object.fromEntries(names.map((n) => [n, gl.getUniformLocation(prog, n)]));
      const wu = U(wallProg, ["uT", "uP", "uHW", "uHH", "uC", "uFogNear", "uFogFar"]);
      const tu = U(tileProg, ["uT", "uP", "uHW", "uHH", "uAtlas", "uFogNear", "uFogFar", "uRadius"]);
      const wa = { pos: gl.getAttribLocation(wallProg, "aPos"), grid: gl.getAttribLocation(wallProg, "aGrid") };
      const ta = {
        pos: gl.getAttribLocation(tileProg, "aPos"), uv: gl.getAttribLocation(tileProg, "aUV"),
        rect: gl.getAttribLocation(tileProg, "aRect"), dim: gl.getAttribLocation(tileProg, "aDim"),
      };
      const fogNear = opts.fogNear, fogFar = opts.fogFar;

      function draw(T) {
        gl.clearColor(BG[0], BG[1], BG[2], 1);
        gl.clear(gl.COLOR_BUFFER_BIT);

        // walls (the tunnel is convex from inside, so painter's order is enough: no depth buffer)
        gl.disable(gl.BLEND);
        gl.useProgram(wallProg);
        gl.uniform1f(wu.uT, T); gl.uniform1f(wu.uP, P);
        gl.uniform1f(wu.uHW, W / 2); gl.uniform1f(wu.uHH, H / 2);
        gl.uniform1f(wu.uC, c); gl.uniform1f(wu.uFogNear, fogNear); gl.uniform1f(wu.uFogFar, fogFar);
        gl.bindBuffer(gl.ARRAY_BUFFER, wallBuf);
        gl.enableVertexAttribArray(wa.pos); gl.vertexAttribPointer(wa.pos, 3, gl.FLOAT, false, 20, 0);
        gl.enableVertexAttribArray(wa.grid); gl.vertexAttribPointer(wa.grid, 2, gl.FLOAT, false, 20, 12);
        gl.drawArrays(gl.TRIANGLES, 0, wallCount);
        gl.disableVertexAttribArray(wa.grid);

        if (!ready) return;
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        gl.useProgram(tileProg);
        gl.uniform1f(tu.uT, T); gl.uniform1f(tu.uP, P);
        gl.uniform1f(tu.uHW, W / 2); gl.uniform1f(tu.uHH, H / 2);
        gl.uniform1f(tu.uFogNear, fogNear); gl.uniform1f(tu.uFogFar, fogFar);
        gl.uniform1f(tu.uRadius, 0.04);
        gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, tex); gl.uniform1i(tu.uAtlas, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, tileBuf);
        const st = 40;
        gl.enableVertexAttribArray(ta.pos); gl.vertexAttribPointer(ta.pos, 3, gl.FLOAT, false, st, 0);
        gl.enableVertexAttribArray(ta.uv); gl.vertexAttribPointer(ta.uv, 2, gl.FLOAT, false, st, 12);
        gl.enableVertexAttribArray(ta.rect); gl.vertexAttribPointer(ta.rect, 4, gl.FLOAT, false, st, 20);
        gl.enableVertexAttribArray(ta.dim); gl.vertexAttribPointer(ta.dim, 1, gl.FLOAT, false, st, 36);
        gl.drawArrays(gl.TRIANGLES, 0, tileCount);
        gl.disableVertexAttribArray(ta.uv); gl.disableVertexAttribArray(ta.rect); gl.disableVertexAttribArray(ta.dim);
      }

      // world point -> screen px (relative to the canvas), or null if behind the eye
      function project(p, T) {
        const w = (P - (p[2] + T)) / P;
        if (w <= 0.01) return null;
        return [W / 2 + p[0] / w, H / 2 + p[1] / w];
      }

      /* Tap -> photo tile. The walls are axis-aligned planes, so cast the ray
         analytically instead of reading pixels back. */
      const lookup = new Map();
      cells.forEach((cell) => lookup.set(cell.wall + ":" + cell.r + ":" + cell.i, cell));
      function pick(sx, sy, T) {
        const dx = sx - W / 2, dy = sy - H / 2;  // ray dir (dx, dy, -P) from eye (0, 0, P - T)
        const hits = [];
        if (dy > 0) hits.push(["floor", hh / dy]);
        if (dy < 0) hits.push(["ceil", -hh / dy]);
        if (dx < 0) hits.push(["left", -hw / dx]);
        if (dx > 0) hits.push(["right", hw / dx]);
        hits.sort((a, b) => a[1] - b[1]);
        for (const [wall, t] of hits) {
          const x = dx * t, y = dy * t, z = P - T - P * t;
          if (Math.abs(x) > hw + 0.5 || Math.abs(y) > hh + 0.5) continue;
          const r = Math.floor(-z / c);
          const across = wall === "floor" || wall === "ceil" ? x + hw : y + hh;
          const i = Math.floor(across / c);
          const cell = lookup.get(wall + ":" + r + ":" + i);
          if (!cell || cell.kind !== "photo") return null;
          // screen-space bounds of that tile, for the open/close animation
          const pts = tileCorners(cell).map((p) => project(p, T)).filter(Boolean);
          if (pts.length < 4) return null;
          const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]);
          return { project: cell.project, rect: { left: Math.min(...xs), top: Math.min(...ys), width: Math.max(...xs) - Math.min(...xs), height: Math.max(...ys) - Math.min(...ys) } };
        }
        return null;
      }

      function destroy() {
        const ext = gl.getExtension("WEBGL_lose_context");
        if (ext) ext.loseContext();
      }

      return { draw, pick, ready: readyP, destroy };
    },
  };
})();
