/* ═══════════════════════════════════════════════════════
   GANESAN P V — Brutalist Portfolio · Immersive v3
   ─────────────────────────────────────────────────────
   Architecture:
     initIntro()              → cinematic intro overlay with sessionStorage
     initPageTransition()
     initCursor()
     initScrollProgress()
     initSectionNav()
     initSmoothScroll()
     initNavbar()
     initTextSplitting()
     initHeroAnimations()     → canvas, kinetic entrance, parallax, 3D tilt, gradients
     initAboutAnimations()    → parallax grid, clip-path reveals, accent glow
     initProjectAnimations()  → horizontal scroll, pin, SVG outlines, tilt
     initSkillAnimations()    → 3D cards, SVG bars, cloud, toggle, counters, marquee, accent glow
     initSignatureMoment()    → scroll-freeze text wipe between projects/skills
     initContactAnimations()  → scale-in, headline reveal
     initGlobalEffects()      → depth reveals, velocity skew, scroll cue, active nav, magnetic
     initPerformance()        → resize debounce, load refresh
     initSystemStatus()       → minimized terminal widget (expand/collapse, tooltip, sessionStorage)
     initDeepDive()           → project case study modal with rich data
     initExperience()         → layered card stack, glow pulse, tech tags
     initWins()               → horizontal scroll showcase, particle burst, trophy cards
     initFinale()              → cinematic scroll transition, pin + yPercent reveal
     initMicroInteractions()  → RGB split on fast scroll, magnetic cursor, keyboard shortcuts
     initDarkEnergy()         → easter egg (Konami code / "buildbreakrepeat")
     initPerfLog()            → console telemetry & session summary
   ═══════════════════════════════════════════════════════ */

(() => {
  'use strict';

  /* ─────────────────────────────────────────
     CONFIG & UTILITIES
     ───────────────────────────────────────── */
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

  /* Standardized easing — reduced variety for cohesion */
  const EASE = {
    smooth:  'power2.out',
    expo:    'expo.out',
    inOut:   'power3.inOut',
    scrub:   'none',
  };

  const isTouchDevice = () => 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const isTouch = isTouchDevice();
  const isMobile = () => window.innerWidth < 768;

  function debounce(fn, ms = 100) {
    let t;
    return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); };
  }
  function lerp(a, b, t) { return a + (b - a) * t; }

  const $ = (s, p = document) => p.querySelector(s);
  const $$ = (s, p = document) => [...p.querySelectorAll(s)];

  /* ─── Shared DOM refs ─── */
  const nav          = $('#nav');
  const navToggle    = $('#navToggle');
  const navLinks     = $('#navLinks');
  const cursor       = $('#cursor');
  const scrollProg   = $('#scrollProgress');
  const heroSection  = $('.hero');
  const heroName     = $('.hero__name');
  const heroImg      = $('.hero__img');
  const scrollCue    = $('.hero__scroll-cue');
  const marquee      = $('.marquee');
  const marqueeTrack = $('.marquee__track');


  /* ═════════════════════════════════════════
     0 · CINEMATIC INTRO
     ═════════════════════════════════════════ */
  function initIntro() {
    const intro     = $('#intro');
    const skipBtn   = $('#introSkip');
    const progress  = $('#introProgress');
    if (!intro) return Promise.resolve();

    /* Skip if already seen this session */
    if (sessionStorage.getItem('introSeen')) {
      intro.remove();
      return Promise.resolve();
    }

    /* Lock scrolling during intro */
    document.body.style.overflow = 'hidden';

    return new Promise(resolve => {
      const chars = $$('.intro__char');
      const lineTop = $('.intro__line--top');
      const lineBot = $('.intro__line--bottom');

      const tl = gsap.timeline({
        onComplete: () => {
          sessionStorage.setItem('introSeen', '1');
          document.body.style.overflow = '';
          resolve();
        }
      });

      /* Progress bar across bottom */
      tl.to(progress, { width: '100%', duration: 2.6, ease: 'power1.inOut' }, 0);

      /* Top line fades in */
      tl.to(lineTop, { opacity: 1, duration: 0.6, ease: EASE.smooth }, 0.1);

      /* Characters scale in from massive */
      tl.fromTo(chars, {
        opacity: 0, scale: 6, y: 40, rotateX: -30, filter: 'blur(8px)',
      }, {
        opacity: 1, scale: 1, y: 0, rotateX: 0, filter: 'blur(0px)',
        stagger: 0.06, duration: 1, ease: EASE.inOut,
      }, 0.3);

      /* Bottom line fades in */
      tl.to(lineBot, { opacity: 1, duration: 0.6, ease: EASE.smooth }, 1.4);

      /* Skip button appears */
      tl.to(skipBtn, { opacity: 1, duration: 0.3 }, 0.8);

      /* Hold beat */
      tl.to({}, { duration: 0.5 }, '+=0.3');

      /* Exit: chars scale down and blur out */
      tl.to(chars, {
        opacity: 0, scale: 0.7, y: -20, filter: 'blur(4px)',
        stagger: 0.02, duration: 0.5, ease: EASE.inOut,
      });
      tl.to([lineTop, lineBot, skipBtn], { opacity: 0, duration: 0.3 }, '<');

      /* Final wipe */
      tl.to(intro, {
        clipPath: 'inset(0 0 100% 0)', duration: 0.7, ease: EASE.inOut,
        onComplete: () => intro.remove(),
      });

      /* Skip handler */
      function skipIntro() {
        tl.progress(1);
      }
      if (skipBtn) skipBtn.addEventListener('click', skipIntro);
    });
  }


  /* ═════════════════════════════════════════
     1 · PAGE TRANSITION
     ═════════════════════════════════════════ */
  function initPageTransition() {
    const overlay = $('#pageTransition');
    if (!overlay) return;
    gsap.set(overlay, { scaleY: 1, transformOrigin: 'top' });
    gsap.to(overlay, {
      scaleY: 0,
      duration: 0.9,
      ease: 'power4.inOut',
      delay: 0.15,
      onComplete: () => overlay.remove(),
    });
  }


  /* ═════════════════════════════════════════
     2 · CUSTOM CURSOR
     ═════════════════════════════════════════ */
  function initCursor() {
    if (isTouch || !cursor) return;

    let mx = 0, my = 0, cx = 0, cy = 0;

    document.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
    }, { passive: true });

    function tick() {
      cx = lerp(cx, mx, 0.15);
      cy = lerp(cy, my, 0.15);
      cursor.style.transform = `translate(${cx}px,${cy}px) translate(-50%,-50%)`;
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);

    document.addEventListener('mousemove', function show() {
      cursor.classList.add('visible');
      document.removeEventListener('mousemove', show);
    });

    const hoverSel = 'a, button, [data-magnetic], .project, .contact__social a, .nav__link, .skills__card';
    const textSel  = 'p, li, dd, dt, h3, .about__lead, .contact__sub, .hero__tagline, .skills__card-desc';

    $$(hoverSel).forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('cursor--hover'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('cursor--hover'));
    });
    $$(textSel).forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('cursor--text'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('cursor--text'));
    });
  }


  /* ═════════════════════════════════════════
     3 · SCROLL PROGRESS
     ═════════════════════════════════════════ */
  function initScrollProgress() {
    if (!scrollProg) return;
    gsap.to(scrollProg, {
      width: '100%',
      ease: EASE.scrub,
      scrollTrigger: {
        trigger: document.body,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.3,
      }
    });
  }


  /* ═════════════════════════════════════════
     4 · SECTION NAV — Side dots
     ═════════════════════════════════════════ */
  function initSectionNav() {
    const dots = $$('.section-nav__dot');
    if (!dots.length) return;

    /* Click to scroll */
    dots.forEach(dot => {
      dot.addEventListener('click', () => {
        const target = $(dot.dataset.target);
        if (target) {
          gsap.to(window, {
            scrollTo: { y: target, offsetY: 0 },
            duration: 1.2,
            ease: EASE.inOut,
          });
        }
      });
    });

    /* Update active on scroll */
    const sections = ['#hero', '#about', '#projects', '#skills', '#contact'];
    sections.forEach((id, i) => {
      const el = $(id);
      if (!el) return;
      ScrollTrigger.create({
        trigger: el,
        start: 'top 50%',
        end: 'bottom 50%',
        onEnter:     () => setDot(i),
        onEnterBack: () => setDot(i),
      });
    });

    function setDot(idx) {
      dots.forEach((d, i) => d.classList.toggle('active', i === idx));
    }
  }


  /* ═════════════════════════════════════════
     5 · SMOOTH SCROLL — Anchor links
     ═════════════════════════════════════════ */
  function initSmoothScroll() {
    $$('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', e => {
        e.preventDefault();
        const target = $(anchor.getAttribute('href'));
        if (!target) return;
        if (navLinks && navLinks.classList.contains('open')) toggleMenu();
        gsap.to(window, {
          scrollTo: { y: target, offsetY: 60 },
          duration: 1.2,
          ease: EASE.inOut,
        });
      });
    });
  }


  /* ═════════════════════════════════════════
     6 · NAVBAR — Hide/show + mobile toggle
     ═════════════════════════════════════════ */
  let lastScrollY = 0;

  function initNavbar() {
    ScrollTrigger.create({
      trigger: document.body,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: self => {
        const y = self.scroll();
        if (y > lastScrollY && y > 100)      nav.classList.add('nav--hidden');
        else if (y < lastScrollY - 5)        nav.classList.remove('nav--hidden');
        lastScrollY = y;
      }
    });

    navToggle.addEventListener('click', toggleMenu);
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && navLinks.classList.contains('open')) toggleMenu();
    });
  }

  function toggleMenu() {
    const open = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', open);
  }


  /* ═════════════════════════════════════════
     7 · TEXT SPLITTING — Kinetic typography
     ═════════════════════════════════════════ */
  function initTextSplitting() {
    $$('[data-split]').forEach(el => {
      const fragment = document.createElement('div');
      fragment.innerHTML = el.innerHTML;
      let result = '', idx = 0;

      function walk(node) {
        if (node.nodeType === Node.TEXT_NODE) {
          node.textContent.split('').forEach(ch => {
            if (ch === ' ') result += ' ';
            else { result += `<span class="char" style="--i:${idx}">${ch}</span>`; idx++; }
          });
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          const tag = node.tagName.toLowerCase();
          const attrs = Array.from(node.attributes).map(a => `${a.name}="${a.value}"`).join(' ');
          result += `<${tag}${attrs ? ' ' + attrs : ''}>`;
          node.childNodes.forEach(walk);
          result += `</${tag}>`;
        }
      }
      fragment.childNodes.forEach(walk);
      el.innerHTML = result;
    });
  }


  /* ═════════════════════════════════════════
     8 · HERO ANIMATIONS
         Canvas grid · kinetic entrance ·
         scroll depth · 3D tilt · gradient
     ═════════════════════════════════════════ */
  function initHeroAnimations() {

    /* ── 8a. Canvas grid background ── */
    if (!isTouch && !isMobile()) {
      const canvas = $('#heroCanvas');
      if (canvas) {
        const ctx = canvas.getContext('2d');
        let W, H, cols, rows, dots = [];
        const SP = 45, DOT = 1.5;
        let mouseX = -1000, mouseY = -1000;

        function resize() {
          W = canvas.width  = canvas.offsetWidth;
          H = canvas.height = canvas.offsetHeight;
          cols = Math.ceil(W / SP);
          rows = Math.ceil(H / SP);
          dots = [];
          for (let r = 0; r < rows; r++)
            for (let c = 0; c < cols; c++)
              dots.push({ x: c * SP + SP/2, y: r * SP + SP/2,
                          ox: c * SP + SP/2, oy: r * SP + SP/2, vx: 0, vy: 0 });
        }

        canvas.parentElement.addEventListener('mousemove', e => {
          const rect = canvas.getBoundingClientRect();
          mouseX = e.clientX - rect.left;
          mouseY = e.clientY - rect.top;
        }, { passive: true });
        canvas.parentElement.addEventListener('mouseleave', () => {
          mouseX = -1000; mouseY = -1000;
        });

        function drawLine(a, b) {
          const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
          const d = Math.sqrt((mouseX - mx) ** 2 + (mouseY - my) ** 2);
          if (d > 180) return;
          const alpha = Math.max(0, 1 - d / 180) * 0.1;
          ctx.strokeStyle = `rgba(255,45,32,${alpha})`;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }

        function draw() {
          ctx.clearRect(0, 0, W, H);
          dots.forEach(dot => {
            const dx = mouseX - dot.x, dy = mouseY - dot.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 140) {
              const f = (1 - dist / 140) * 0.15;
              dot.vx += dx * f * 0.01;
              dot.vy += dy * f * 0.01;
            }
            dot.vx += (dot.ox - dot.x) * 0.04; dot.vy += (dot.oy - dot.y) * 0.04;
            dot.vx *= 0.88; dot.vy *= 0.88;
            dot.x += dot.vx; dot.y += dot.vy;

            const prox = Math.max(0, 1 - dist / 140);
            const s = DOT + prox * 2.5;
            ctx.fillStyle = prox > 0.1
              ? `rgba(255,45,32,${0.15 + prox * 0.5})`
              : 'rgba(255,255,255,0.08)';
            ctx.fillRect(dot.x - s/2, dot.y - s/2, s, s);
          });

          /* Grid-neighbor connection lines */
          ctx.lineWidth = 0.5;
          for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
              const i = r * cols + c;
              if (c < cols - 1) drawLine(dots[i], dots[i + 1]);
              if (r < rows - 1) drawLine(dots[i], dots[i + cols]);
            }
          }
          requestAnimationFrame(draw);
        }

        resize(); draw();
        window.addEventListener('resize', debounce(resize, 250));
      }
    }

    /* ── 8b. Dynamic gradient follows mouse ── */
    if (!isTouch) {
      const gradTop = $('.hero__gradient--top');
      if (gradTop) {
        heroSection.addEventListener('mousemove', e => {
          const x = (e.clientX / window.innerWidth) * 100;
          const y = (e.clientY / window.innerHeight) * 100;
          gradTop.style.background = `radial-gradient(ellipse at ${x}% ${y}%, rgba(255,45,32,0.07) 0%, transparent 60%)`;
        }, { passive: true });
      }
    }

    /* ── 8c. Kinetic char-by-char entrance ── */
    const heroChars = $$('.hero__name .char');
    const tl = gsap.timeline({ defaults: { ease: EASE.expo } });

    tl.set('.hero__tag',      { opacity: 0, y: 15 })
      .set('.hero__role',     { opacity: 0, x: -20 })
      .set('.hero__tagline',  { opacity: 0, y: 20 })
      .set('.hero__img-wrap', { opacity: 0, scale: 1.15, transformOrigin: 'center' })
      .set('.hero__stat',     { opacity: 0, y: 25 })
      .set(scrollCue,         { opacity: 0 });

    tl.from(heroChars, {
        opacity: 0, y: 100, rotateX: -60,
        stagger: 0.035, duration: 1.1, ease: 'power4.out',
      }, 0.3)
      .to('.hero__tag',      { opacity: 1, y: 0, duration: 0.6 }, 0.5)
      .to('.hero__role',     { opacity: 1, x: 0, duration: 0.7 }, 0.7)
      .fromTo('.hero__rule', { scaleX: 0, transformOrigin: 'left' },
                             { scaleX: 1, duration: 0.8, ease: EASE.inOut }, 0.7)
      .to('.hero__tagline',  { opacity: 1, y: 0, duration: 0.7 }, 1)
      .to('.hero__img-wrap', { opacity: 1, scale: 1, duration: 1.2, ease: EASE.smooth }, 0.6)
      .to('.hero__stat',     { opacity: 1, y: 0, duration: 0.5, stagger: 0.08 }, 1.1)
      .to(scrollCue,         { opacity: 1, duration: 0.6 }, 1.4);

    /* ── 8d. Scroll depth compression (reduced amplitude) ── */
    if (heroName) {
      gsap.to(heroName, {
        scale: 0.85, opacity: 0.15, y: -30,
        ease: EASE.scrub,
        scrollTrigger: { trigger: heroSection, start: 'top top', end: 'bottom 20%', scrub: 1.5 }
      });
    }

    /* ── 8e. Hero image subtle parallax ── */
    if (heroImg) {
      gsap.to(heroImg, {
        yPercent: 15, scale: 1.05,
        ease: EASE.scrub,
        scrollTrigger: { trigger: '.hero__img-wrap', start: 'top bottom', end: 'bottom top', scrub: 1 }
      });
    }

    /* ── 8f. Hero 3D tilt on mousemove (reduced) ── */
    if (!isTouch && heroSection) {
      heroSection.addEventListener('mousemove', e => {
        const rect = heroSection.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        gsap.to('.hero__grid', {
          rotateY: x * 2.5, rotateX: -y * 2,
          transformPerspective: 1200, duration: 0.8, ease: EASE.smooth,
        });
      }, { passive: true });
      heroSection.addEventListener('mouseleave', () => {
        gsap.to('.hero__grid', { rotateY: 0, rotateX: 0, duration: 1, ease: EASE.smooth });
      });
    }

    /* ── 8g. Cinematic fade layers ── */
    [
      { el: '.hero__tag',     end: '40%' },
      { el: '.hero__role',    end: '50%' },
      { el: '.hero__tagline', end: '55%' },
      { el: '.hero__stats',   end: '60%' },
    ].forEach(({ el, end }) => {
      gsap.to(el, {
        opacity: 0, y: -30, ease: EASE.scrub,
        scrollTrigger: { trigger: heroSection, start: 'top top', end: `${end} top`, scrub: 1.5 }
      });
    });
  }


  /* ═════════════════════════════════════════
     9 · ABOUT ANIMATIONS
         Parallax grid · stagger reveals ·
         clip-path info rows · inversion
     ═════════════════════════════════════════ */
  function initAboutAnimations() {
    const section = $('#about');
    if (!section) return;

    /* Parallax background grid (reduced amplitude) */
    const bgGrid = section.querySelector('.about__bg-grid');
    if (bgGrid) {
      gsap.to(bgGrid, {
        y: -60,
        ease: 'none',
        scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: true }
      });
    }

    /* About lead text — clip-path mask reveal */
    const lead = section.querySelector('.about__lead');
    if (lead) {
      gsap.fromTo(lead,
        { clipPath: 'inset(0 100% 0 0)', opacity: 0 },
        { clipPath: 'inset(0 0% 0 0)', opacity: 1, duration: 1.2, ease: EASE.inOut,
          scrollTrigger: { trigger: lead, start: 'top 82%', end: 'top 50%', scrub: 1 }
        }
      );
    }

    /* Body paragraphs — stagger + fade + rotate */
    $$('.about__text p:not(.about__lead)').forEach((p, i) => {
      gsap.fromTo(p,
        { opacity: 0, y: 35, rotateX: 5 },
        { opacity: 1, y: 0, rotateX: 0, duration: 0.8,
          scrollTrigger: { trigger: p, start: 'top 88%', toggleActions: 'play none none none' }
        }
      );
    });

    /* Philosophy blocks — clip-path from bottom + rotateX */
    $$('.about__philosophy-block').forEach((block, i) => {
      gsap.fromTo(block,
        { clipPath: 'inset(0 0 100% 0)', opacity: 0, rotateX: 8 },
        { clipPath: 'inset(0 0 0% 0)', opacity: 1, rotateX: 0,
          duration: 0.7, delay: i * 0.1,
          ease: EASE.smooth,
          scrollTrigger: { trigger: block, start: 'top 90%', toggleActions: 'play none none none' }
        }
      );
    });

    /* Download button reveal */
    const btn = section.querySelector('.btn');
    if (btn) {
      gsap.fromTo(btn,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: EASE.smooth,
          scrollTrigger: { trigger: btn, start: 'top 90%', toggleActions: 'play none none none' }
        }
      );
    }

    /* Subtle accent glow — replaces harsh inversion */
    ScrollTrigger.create({
      trigger: section,
      start: '30% center',
      end: '70% center',
      onEnter:     () => section.classList.add('section--accent-glow'),
      onLeave:     () => section.classList.remove('section--accent-glow'),
      onEnterBack: () => section.classList.add('section--accent-glow'),
      onLeaveBack: () => section.classList.remove('section--accent-glow'),
    });
  }


  /* ═════════════════════════════════════════
     10 · PROJECT ANIMATIONS
          Horizontal scroll · pinning ·
          SVG outlines · hover tilt
     ═════════════════════════════════════════ */
  function initProjectAnimations() {
    const wrap  = $('.projects-wrap');
    const track = $('#projectsTrack');
    const projects = $$('[data-project]');
    if (!wrap || !track) return;

    /* ── Section header reveal ── */
    const header = wrap.querySelector('.section__header');
    if (header) {
      const title = header.querySelector('.section__title');
      const num   = header.querySelector('.section__num');
      if (title) {
        gsap.fromTo(title,
          { clipPath: 'inset(0 100% 0 0)', opacity: 0 },
          { clipPath: 'inset(0 0% 0 0)', opacity: 1,
            ease: EASE.inOut,
            scrollTrigger: { trigger: header, start: 'top 82%', end: 'top 45%', scrub: 1 }
          }
        );
      }
      if (num) {
        gsap.fromTo(num, { x: -20, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.6, ease: EASE.smooth,
            scrollTrigger: { trigger: header, start: 'top 80%',
              onEnter: () => num.classList.add('active'),
              onLeaveBack: () => num.classList.remove('active'),
            }
          }
        );
      }
    }

    /* ── Per-project: subtle fade & scale on scroll ── */
    projects.forEach((project) => {
      const card    = project.querySelector('.project__card');
      const svgRect = project.querySelector('.project__svg-rect');
      if (!card) return;

      /* Fade + scale entrance */
      gsap.fromTo(card,
        { opacity: 0, scale: 0.95, y: 40 },
        { opacity: 1, scale: 1, y: 0,
          ease: EASE.smooth,
          scrollTrigger: {
            trigger: project,
            start: 'top 80%',
            end: 'top 30%',
            scrub: 1,
          }
        }
      );

      /* SVG outline draw */
      if (svgRect) {
        ScrollTrigger.create({
          trigger: project,
          start: 'top 60%',
          onEnter: () => project.classList.add('is-visible'),
          once: true,
        });
      }

      /* Hover tilt (desktop) */
      if (!isTouch) {
        card.addEventListener('mousemove', e => {
          const rect = card.getBoundingClientRect();
          const x = (e.clientX - rect.left) / rect.width - 0.5;
          const y = (e.clientY - rect.top) / rect.height - 0.5;
          gsap.to(card, {
            rotateY: x * 3, rotateX: -y * 2.5,
            transformPerspective: 900,
            boxShadow: `${-x * 12}px ${y * 12}px 30px rgba(0,0,0,0.2)`,
            duration: 0.5, ease: EASE.smooth,
          });
        });
        card.addEventListener('mouseleave', () => {
          gsap.to(card, {
            rotateY: 0, rotateX: 0, boxShadow: 'none',
            duration: 0.7, ease: EASE.smooth,
          });
        });
      }
    });
  }


  /* ═════════════════════════════════════════
     11 · SKILL ANIMATIONS
          3D Cards · SVG bars · floating cloud ·
          view toggle · counters · marquee ·
          color inversion
     ═════════════════════════════════════════ */
  function initSkillAnimations() {
    const section    = $('#skills');
    const cards      = $$('.skills__card');
    if (!section) return;

    /* ── Background grid parallax (reduced) ── */
    const bgGrid = section.querySelector('.skills__bg-grid');
    if (bgGrid) {
      gsap.to(bgGrid, {
        y: -40,
        ease: 'none',
        scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: true }
      });
    }

    /* ── Section header ── */
    const header = section.querySelector('.section__header');
    if (header) {
      const title = header.querySelector('.section__title');
      const num   = header.querySelector('.section__num');
      if (title) {
        gsap.fromTo(title,
          { clipPath: 'inset(0 100% 0 0)', opacity: 0 },
          { clipPath: 'inset(0 0% 0 0)', opacity: 1,
            ease: EASE.inOut,
            scrollTrigger: { trigger: header, start: 'top 82%', end: 'top 45%', scrub: 1 }
          }
        );
      }
      if (num) {
        gsap.fromTo(num, { x: -20, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.6, ease: EASE.smooth,
            scrollTrigger: { trigger: header, start: 'top 80%',
              onEnter: () => num.classList.add('active'),
              onLeaveBack: () => num.classList.remove('active'),
            }
          }
        );
      }
    }

    /* ── Signal-Meter Skill Cards — scroll reveal + bar animation ── */
    cards.forEach((card, i) => {
      const level = parseInt(card.dataset.val, 10);
      const bars  = card.querySelectorAll('.skills__signal-bar');

      /* Staggered entrance */
      gsap.fromTo(card,
        { opacity: 0, y: 50, rotateX: 10, scale: 0.95 },
        { opacity: 1, y: 0, rotateX: 0, scale: 1,
          duration: 0.7, delay: i * 0.05,
          ease: EASE.smooth,
          scrollTrigger: {
            trigger: card, start: 'top 90%',
            toggleActions: 'play none none none',
          },
          onComplete: () => {
            card.classList.add('revealed');
            /* Activate bars up to --level */
            bars.forEach((bar, bi) => {
              if (bi < level) {
                setTimeout(() => bar.classList.add('active'), bi * 60);
              }
            });
          },
        }
      );

      /* 3D tilt on hover (desktop) */
      if (!isTouch) {
        card.addEventListener('mousemove', e => {
          const rect = card.getBoundingClientRect();
          const x = (e.clientX - rect.left) / rect.width - 0.5;
          const y = (e.clientY - rect.top) / rect.height - 0.5;
          gsap.to(card, {
            rotateY: x * 6, rotateX: -y * 4,
            transformPerspective: 800,
            z: 15,
            duration: 0.4, ease: EASE.smooth,
          });
        });
        card.addEventListener('mouseleave', () => {
          gsap.to(card, {
            rotateY: 0, rotateX: 0, z: 0,
            duration: 0.6, ease: EASE.smooth,
          });
        });

        /* Magnetic cursor attraction per card */
        card.addEventListener('mousemove', e => {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left - rect.width / 2;
          const y = e.clientY - rect.top - rect.height / 2;
          gsap.to(card, {
            x: x * 0.08, y: y * 0.08,
            duration: 0.3, ease: EASE.smooth,
          });
        });
        card.addEventListener('mouseleave', () => {
          gsap.to(card, { x: 0, y: 0, duration: 0.5, ease: EASE.smooth });
        });
      }
    });

    /* ── Stat Counters ── */
    $$('[data-count]').forEach(el => {
      const target = parseInt(el.dataset.count, 10);
      ScrollTrigger.create({
        trigger: el,
        start: 'top 88%',
        once: true,
        onEnter: () => {
          gsap.to({ val: 0 }, {
            val: target,
            duration: 2,
            ease: 'power3.out',
            onUpdate() { el.textContent = Math.round(this.targets()[0].val); },
            onComplete() { el.textContent = target + '+'; }
          });
        }
      });
    });

    /* ── Marquee — velocity-aware ── */
    if (marquee && marqueeTrack) {
      marquee.addEventListener('mouseenter', () => marqueeTrack.style.animationPlayState = 'paused');
      marquee.addEventListener('mouseleave', () => marqueeTrack.style.animationPlayState = 'running');

      ScrollTrigger.create({
        trigger: section,
        start: 'top bottom',
        end: 'bottom top',
        onUpdate: self => {
          const vel = Math.min(Math.abs(self.getVelocity()) / 2000, 3);
          marqueeTrack.style.animationDuration = Math.max(20 - vel * 8, 5) + 's';
        }
      });
    }

    /* ── Accent glow — replaces harsh black/white inversion ── */
    ScrollTrigger.create({
      trigger: section,
      start: 'top 55%',
      end: 'bottom 45%',
      onEnter:     () => section.classList.add('section--accent-glow'),
      onLeave:     () => section.classList.remove('section--accent-glow'),
      onEnterBack: () => section.classList.add('section--accent-glow'),
      onLeaveBack: () => section.classList.remove('section--accent-glow'),
    });
  }


  /* ═════════════════════════════════════════
     11.5 · SIGNATURE MOMENT — Scroll Freeze
           Text wipe between projects & skills
     ═════════════════════════════════════════ */
  function initSignatureMoment() {
    const freeze = $('#freeze');
    if (!freeze) return;

    const words = $$('.freeze__word');
    const maskL = $('.freeze__mask--left');
    const maskR = $('.freeze__mask--right');

    /* Pin the section and animate words on scroll */
    const freezeTl = gsap.timeline({
      scrollTrigger: {
        trigger: freeze,
        start: 'top top',
        end: '+=200%',
        pin: true,
        scrub: 1,
      }
    });

    /* Masks pull apart */
    freezeTl.to(maskL, {
      xPercent: -100, ease: EASE.scrub,
    }, 0);
    freezeTl.to(maskR, {
      xPercent: 100, ease: EASE.scrub,
    }, 0);

    /* Each word fades in & scales at different rates */
    words.forEach((word, i) => {
      const speed = parseFloat(word.dataset.speed) || 1;
      freezeTl.fromTo(word, {
        opacity: 0.08,
        scale: 1.3 + i * 0.1,
        y: 30 * (i % 2 === 0 ? 1 : -1),
      }, {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.4,
        ease: EASE.scrub,
      }, i * 0.1);
    });

    /* Hold with full visibility */
    freezeTl.to({}, { duration: 0.3 });

    /* Words compress and exit */
    words.forEach((word, i) => {
      freezeTl.to(word, {
        opacity: 0,
        scale: 0.8,
        y: -40 * (i % 2 === 0 ? 1 : -1),
        letterSpacing: '-0.1em',
        duration: 0.3,
        ease: EASE.scrub,
      }, '>' + (i * 0.03));
    });

    /* Masks close back */
    freezeTl.to(maskL, { xPercent: 0, ease: EASE.scrub }, '>-0.2');
    freezeTl.to(maskR, { xPercent: 0, ease: EASE.scrub }, '<');
  }


  /* ═════════════════════════════════════════
     12 · CONTACT ANIMATIONS
          Scale-in · headline clip · reveal
     ═════════════════════════════════════════ */
  function initContactAnimations() {
    const section = $('#contact');
    if (!section) return;

    /* Wrap in gsap.context scoped to #contact for clean lifecycle */
    const ctx = gsap.context(() => {

      /* Section header */
      const header = section.querySelector('.section__header');
      if (header) {
        const title = header.querySelector('.section__title');
        const num   = header.querySelector('.section__num');
        if (title) {
          gsap.fromTo(title,
            { clipPath: 'inset(0 100% 0 0)', opacity: 0 },
            { clipPath: 'inset(0 0% 0 0)', opacity: 1, ease: EASE.inOut,
              scrollTrigger: { trigger: header, start: 'top 82%', end: 'top 45%', scrub: 1, invalidateOnRefresh: true }
            }
          );
        }
        if (num) {
          gsap.fromTo(num, { x: -20, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.6, ease: EASE.smooth,
              scrollTrigger: { trigger: header, start: 'top 80%', invalidateOnRefresh: true,
                onEnter: () => num.classList.add('active'),
                onLeaveBack: () => num.classList.remove('active'),
              }
            }
          );
        }
      }

      /* Headline — dramatic scale + clip reveal */
      const headline = section.querySelector('.contact__headline');
      if (headline) {
        gsap.fromTo(headline,
          { clipPath: 'inset(0 0 100% 0)', opacity: 0, scale: 1.12 },
          { clipPath: 'inset(0 0 0% 0)', opacity: 1, scale: 1,
            duration: 1.4, ease: EASE.inOut,
            scrollTrigger: { trigger: headline, start: 'top 80%', end: 'top 40%', scrub: 1, invalidateOnRefresh: true }
          }
        );
      }

      /* Generic reveal-up for other contact elements */
      section.querySelectorAll('.reveal-up').forEach(el => {
        const children = el.querySelectorAll('p, dl > div, .contact__social, .btn');

        if (children.length > 1) {
          gsap.set(children, { opacity: 0, y: 40 });
          gsap.set(el, { opacity: 1, transform: 'none' });
          ScrollTrigger.create({
            trigger: el,
            start: 'top 85%',
            once: true,
            invalidateOnRefresh: true,
            onEnter: () => {
              gsap.to(children, {
                opacity: 1, y: 0, duration: 0.7, stagger: 0.08, ease: EASE.smooth,
              });
            }
          });
        } else {
          gsap.to(el, {
            opacity: 1, y: 0, duration: 0.9, ease: EASE.smooth,
            scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none', invalidateOnRefresh: true }
          });
        }
      });

      /* Social links stagger */
      const socials = section.querySelectorAll('.contact__social a');
      if (socials.length) {
        gsap.fromTo(socials,
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: EASE.smooth,
            scrollTrigger: { trigger: socials[0].parentElement, start: 'top 88%', toggleActions: 'play none none none', invalidateOnRefresh: true }
          }
        );
      }

    }, section); /* end gsap.context scoped to #contact */

    /* Refresh triggers after fonts are ready to fix layout positioning */
    document.fonts.ready.then(() => ScrollTrigger.refresh());
  }


  /* ═════════════════════════════════════════
     12b · FINALE — Cinematic scroll transition
           Pin + single master timeline
     ═════════════════════════════════════════ */
  function initFinale() {
    const section = $('#finale');
    if (!section) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* Reduced motion — no pin, just show text */
    if (prefersReduced) {
      gsap.set('.line1, .line2', { opacity: 1, y: 0 });
      gsap.set('.finale__divider', { height: '60px' });
      return;
    }

    const ctx = gsap.context(() => {

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: '#finale',
          start: 'top top',
          end: '+=120%',
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        }
      });

      /* Phase 1 — Line 1 fades in */
      tl.to('.line1', {
        opacity: 1,
        y: 0,
        duration: 0.4,
      })

      /* Phase 2 — Line 2 fades in */
      .to('.line2', {
        opacity: 1,
        y: 0,
        duration: 0.4,
      }, '+=0.2')

      /* Phase 3 — Red divider grows */
      .to('.finale__divider', {
        height: '60vh',
        duration: 0.6,
        ease: 'none',
      })

      /* Phase 4 — Subtle zoom */
      .to('#finale', {
        scale: 1.05,
        duration: 0.6,
        ease: 'none',
      })

      /* Phase 5 — Fade content out */
      .to('.finale__content', {
        opacity: 0,
        duration: 0.4,
      })

      /* Phase 6 — Slide finale up to reveal contact */
      .to('#finale', {
        yPercent: -100,
        ease: 'none',
        duration: 0.8,
      });

    });

    /* Refresh after layout settles */
    ScrollTrigger.refresh();

    return () => ctx.revert();
  }


  /* ═════════════════════════════════════════
     13 · GLOBAL EFFECTS
          Depth reveals · velocity skew ·
          scroll cue · active nav · magnetic
     ═════════════════════════════════════════ */
  function initGlobalEffects() {

    /* ── Depth-based section reveals (reduced amplitude) ── */
    ['#about', '#skills', '#contact'].forEach(id => {
      const el = $(id);
      if (!el) return;
      gsap.fromTo(el, {
        scale: 0.97, opacity: 0.5, z: -30,
        transformOrigin: 'center top', transformPerspective: 1200,
      }, {
        scale: 1, opacity: 1, z: 0, ease: EASE.scrub,
        scrollTrigger: { trigger: el, start: 'top 95%', end: 'top 40%', scrub: 1.2 }
      });
    });

    /* ── Velocity-aware skew ── */
    if (!isTouch) {
      let currentSkew = 0;
      ScrollTrigger.create({
        trigger: document.body,
        start: 'top top', end: 'bottom bottom',
        onUpdate: self => {
          const vel = self.getVelocity();
          const target = gsap.utils.clamp(-1, 1, vel / 1200);
          currentSkew = lerp(currentSkew, target, 0.1);
          gsap.set('.section, .projects-wrap', { skewY: currentSkew });
        }
      });

      let resetTimer;
      window.addEventListener('scroll', () => {
        clearTimeout(resetTimer);
        resetTimer = setTimeout(() => {
          gsap.to('.section, .projects-wrap', { skewY: 0, duration: 0.4, ease: EASE.smooth });
          currentSkew = 0;
        }, 150);
      }, { passive: true });
    }

    /* ── Scroll cue fade ── */
    if (scrollCue) {
      ScrollTrigger.create({
        trigger: heroSection,
        start: 'top top', end: '+=250',
        onLeave:     () => gsap.to(scrollCue, { opacity: 0, y: -10, duration: 0.4 }),
        onEnterBack: () => gsap.to(scrollCue, { opacity: 1, y: 0, duration: 0.4 }),
      });
    }

    /* ── Active nav link ── */
    const allNavLinks = $$('.nav__link');
    const sectionIDs  = ['about', 'projects', 'skills', 'contact'];

    sectionIDs.forEach(id => {
      const el = $(`#${id}`);
      if (!el) return;
      ScrollTrigger.create({
        trigger: el,
        start: 'top 50%', end: 'bottom 50%',
        onEnter:     () => setActive(id),
        onEnterBack: () => setActive(id),
      });
    });

    function setActive(id) {
      allNavLinks.forEach(link => {
        const active = link.getAttribute('href') === `#${id}`;
        link.style.color = active ? 'var(--c-text)' : '';
      });
    }

    /* ── Magnetic buttons ── */
    if (!isTouch) {
      $$('[data-magnetic]').forEach(btn => {
        btn.addEventListener('mousemove', e => {
          const rect = btn.getBoundingClientRect();
          const x = e.clientX - rect.left - rect.width / 2;
          const y = e.clientY - rect.top  - rect.height / 2;
          gsap.to(btn, { x: x * 0.3, y: y * 0.3, duration: 0.4, ease: EASE.smooth });
        });
        btn.addEventListener('mouseleave', () => {
          gsap.to(btn, { x: 0, y: 0, duration: 0.6, ease: EASE.smooth });
        });
      });
    }

    /* ── Dynamic accent intensity on scroll ── */
    const accentPulse = $('.skills__accent-pulse');
    if (accentPulse) {
      ScrollTrigger.create({
        trigger: '#skills',
        start: 'top bottom', end: 'bottom top',
        onUpdate: self => {
          const progress = self.progress;
          const intensity = 0.5 + Math.sin(progress * Math.PI) * 0.5;
          accentPulse.style.opacity = intensity;
        }
      });
    }

    /* ── Clip-path transition between sections ── */
    $$('.section').forEach(section => {
      gsap.fromTo(section, {
        clipPath: 'inset(4% 0 0 0)',
      }, {
        clipPath: 'inset(0% 0 0 0)',
        ease: EASE.scrub,
        scrollTrigger: { trigger: section, start: 'top 90%', end: 'top 50%', scrub: 1 }
      });
    });
  }


  /* ═════════════════════════════════════════
     14 · PERFORMANCE
     ═════════════════════════════════════════ */
  function initPerformance() {
    const handleResize = debounce(() => ScrollTrigger.refresh(), 200);
    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('load',   () => ScrollTrigger.refresh());
  }


  /* ═════════════════════════════════════════
     15 · SYSTEM STATUS PANEL — Minimized Default
          Expandable terminal widget with tooltip,
          scanline, typing effect, sessionStorage
     ═════════════════════════════════════════ */
  function initSystemStatus() {
    const panel    = $('#systemStatus');
    const dotBtn   = $('#systatDotBtn');
    const tooltip  = $('#systatTooltip');
    const expanded = $('#systatExpanded');
    const minBtn   = $('#systatMinimize');
    const body     = $('#systatBody');
    if (!panel || isMobile()) return;

    const elVel     = $('#systatVel');
    const elFps     = $('#systatFps');
    const elCursor  = $('#systatCursor');
    const elSection = $('#systatSection');
    const elTime    = $('#systatTime');

    let isOpen = sessionStorage.getItem('systatOpen') === '1';
    let firstOpen = !sessionStorage.getItem('systatOpened');

    function setOpen(open) {
      isOpen = open;
      panel.classList.toggle('systat--mini', !open);
      panel.classList.toggle('systat--open', open);
      sessionStorage.setItem('systatOpen', open ? '1' : '0');
      if (open && firstOpen) {
        firstOpen = false;
        sessionStorage.setItem('systatOpened', '1');
        typeEffect();
      }
    }

    /* Typing effect on first open */
    function typeEffect() {
      const rows = $$('.systat__row', body);
      rows.forEach(r => { r.style.opacity = '0'; });
      rows.forEach((r, i) => {
        gsap.to(r, { opacity: 1, duration: 0.15, delay: i * 0.12 });
      });
    }

    /* Open / close handlers */
    if (dotBtn) {
      dotBtn.addEventListener('click', () => {
        gsap.fromTo(expanded, { scaleY: 0.3, scaleX: 0.6, opacity: 0, transformOrigin: 'bottom left' },
          { scaleY: 1, scaleX: 1, opacity: 1, duration: 0.35, ease: EASE.smooth });
        setOpen(true);
      });
    }
    if (minBtn) {
      minBtn.addEventListener('click', () => {
        setOpen(false);
      });
    }

    /* Initialize state */
    setOpen(isOpen);

    /* Tooltip after 3s, fade after 5s */
    if (!isOpen) {
      setTimeout(() => {
        if (!isOpen && tooltip) tooltip.classList.add('systat__tooltip--visible');
      }, 3000);
      setTimeout(() => {
        if (tooltip) tooltip.classList.remove('systat__tooltip--visible');
      }, 8000);
    }

    /* FPS counter */
    let frames = 0, lastFpsTime = performance.now(), fps = 60;
    function countFrame() {
      frames++;
      const now = performance.now();
      if (now - lastFpsTime >= 1000) {
        fps = frames;
        frames = 0;
        lastFpsTime = now;
      }
      requestAnimationFrame(countFrame);
    }
    requestAnimationFrame(countFrame);

    /* Scroll velocity */
    let scrollVel = 0;
    ScrollTrigger.create({
      trigger: document.body,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: self => { scrollVel = Math.round(Math.abs(self.getVelocity())); }
    });

    /* Active section tracking */
    let activeSection = 'hero';
    const sectionIds = ['hero', 'about', 'experience', 'projects', 'freeze', 'skills', 'wins', 'finale', 'contact'];
    sectionIds.forEach(id => {
      const el = $(`#${id}`);
      if (!el) return;
      ScrollTrigger.create({
        trigger: el,
        start: 'top 50%',
        end: 'bottom 50%',
        onEnter:     () => { activeSection = id; },
        onEnterBack: () => { activeSection = id; },
      });
    });

    /* Cursor state */
    let cursorState = 'default';
    if (cursor) {
      const observer = new MutationObserver(() => {
        const cls = cursor.className;
        if (cls.includes('hover'))    cursorState = 'hover';
        else if (cls.includes('click')) cursorState = 'click';
        else cursorState = 'default';
      });
      observer.observe(cursor, { attributes: true, attributeFilter: ['class'] });
    }

    /* Time on page */
    const startTime = Date.now();

    /* Smooth number roll helper */
    function rollTo(el, newText) {
      if (!el || el.textContent === String(newText)) return;
      el.textContent = newText;
    }

    /* Throttled UI update — 10fps */
    let lastUpdate = 0;
    function updatePanel(now) {
      if (document.hidden) { requestAnimationFrame(updatePanel); return; }
      if (now - lastUpdate >= 100) {
        lastUpdate = now;
        if (isOpen) {
          rollTo(elVel, scrollVel);
          rollTo(elFps, fps);
          rollTo(elCursor, cursorState);
          rollTo(elSection, activeSection);
          if (elTime) {
            const elapsed = Math.floor((Date.now() - startTime) / 1000);
            const m = String(Math.floor(elapsed / 60)).padStart(2, '0');
            const s = String(elapsed % 60).padStart(2, '0');
            rollTo(elTime, `${m}:${s}`);
          }
        }
      }
      requestAnimationFrame(updatePanel);
    }
    requestAnimationFrame(updatePanel);

    /* Glitch flicker every 20-40s */
    function scheduleGlitch() {
      const delay = 20000 + Math.random() * 20000;
      setTimeout(() => {
        if (!document.hidden) {
          panel.classList.add('systat--glitch');
          setTimeout(() => panel.classList.remove('systat--glitch'), 200);
        }
        scheduleGlitch();
      }, delay);
    }
    scheduleGlitch();

    /* Pause on visibility change */
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) panel.classList.add('systat--paused');
      else panel.classList.remove('systat--paused');
    });
  }


  /* ═════════════════════════════════════════
     16 · PROJECT DEEP DIVE MODAL
          Case study expansion with rich data
     ═════════════════════════════════════════ */
  function initDeepDive() {
    const modal     = $('#deepDive');
    const backdrop  = modal ? modal.querySelector('.deepdive__backdrop') : null;
    const content   = modal ? modal.querySelector('.deepdive__content') : null;
    const inner     = $('#deepDiveInner');
    const closeBtn  = $('#deepDiveClose');
    if (!modal || !inner) return;

    /* Case study data */
    const studies = {
      waste: {
        title: 'Object Categorizer & Waste Manager',
        problem: 'Urban waste management lacks real-time sorting. Manual segregation is slow, error-prone, and unsanitary — leading to contamination of recyclable streams.',
        approach: 'Built a computer vision pipeline using TensorFlow and OpenCV with MobileNetV2 transfer learning. Achieved 98% precision in real-time waste segregation with sensor fusion, deployed on Raspberry Pi for edge inference.',
        architecture: 'Camera → Preprocessing → CNN (MobileNetV2) → Classification → Sensor Fusion → Raspberry Pi Output',
        challenges: [
          'Handling varied lighting conditions in real-world capture',
          'Reducing model size for Raspberry Pi edge deployment',
          'Sensor fusion integration with image classification pipeline',
        ],
        metrics: [
          { label: 'Precision', value: '98%' },
          { label: 'Inference', value: '< 200ms' },
          { label: 'Platform', value: 'Raspberry Pi' },
          { label: 'Pipeline', value: 'CNN + Sensor Fusion' },
        ],
        github: 'https://github.com/Hareshganesan/Object_Segregration',
      },
      platoon: {
        title: 'Autonomous Vehicle Platoon',
        problem: 'Highway fuel efficiency drops with uncoordinated vehicle spacing. Manual platooning is dangerous and inconsistent. V2V communication latency introduces coordination risks.',
        approach: 'Implemented PPO-based reinforcement learning in CARLA 0.9.12 for multi-agent platoon coordination. Achieved 95%+ control efficiency with 30% reduction in simulated traffic delay through V2V state sharing.',
        architecture: 'CARLA Sim → Sensor Suite → State Encoder → PPO Agent → V2V Broadcast → Platoon Coordinator',
        challenges: [
          'Sim-to-real gap in sensor noise and physics',
          'Training stability with multi-agent RL across 5+ vehicles',
          'Maintaining safe following distance at varying speeds',
        ],
        metrics: [
          { label: 'Control Efficiency', value: '95%+' },
          { label: 'Traffic Delay', value: '-30%' },
          { label: 'Simulator', value: 'CARLA 0.9.12' },
          { label: 'Framework', value: 'PPO' },
        ],
        github: 'https://github.com/Hareshganesan/Vehicle_Platoon',
      },
      finance: {
        title: 'Multi-Agent Financial Portfolio Assistant',
        problem: 'Retail investors lack tools that combine real-time data, AI analysis, and natural language interaction for portfolio decisions across Asian tech markets.',
        approach: 'Built a 6-agent AI architecture analyzing 19 Asian tech stocks. Uses FAISS-based RAG for context retrieval and Gemini LLM for natural language insights, served via Streamlit dashboard with voice interface.',
        architecture: 'Data Agents (6) → FAISS RAG Pipeline → Gemini LLM → Analysis Engine → Streamlit UI + Voice I/O',
        challenges: [
          'Coordinating 6 specialized agents without state conflicts',
          'Building efficient FAISS index for real-time stock context retrieval',
          'Integrating voice I/O with Streamlit\u0027s synchronous rendering',
        ],
        metrics: [
          { label: 'Agents', value: '6' },
          { label: 'Stocks Tracked', value: '19' },
          { label: 'RAG Engine', value: 'FAISS' },
          { label: 'LLM', value: 'Gemini' },
        ],
        github: 'https://github.com/Hareshganesan/ai-finance-tracker',
        live: 'https://ai-finance-tracker-demo.vercel.app/',
      },
    };

    let isOpen = false;

    function openModal(key) {
      const data = studies[key];
      if (!data || isOpen) return;
      isOpen = true;

      /* Populate content */
      inner.innerHTML = `
        <h3 class="deepdive__title">${data.title}</h3>
        <div class="deepdive__section">
          <h4>The Problem</h4>
          <p>${data.problem}</p>
        </div>
        <div class="deepdive__section">
          <h4>Approach</h4>
          <p>${data.approach}</p>
        </div>
        <div class="deepdive__section deepdive__architecture">
          <h4>Architecture</h4>
          <pre>${data.architecture}</pre>
        </div>
        <div class="deepdive__section">
          <h4>Challenges</h4>
          <ul>${data.challenges.map(c => `<li>${c}</li>`).join('')}</ul>
        </div>
        <div class="deepdive__metrics">
          ${data.metrics.map(m => `<div class="deepdive__metric"><span class="deepdive__metric-val">${m.value}</span><span class="deepdive__metric-label">${m.label}</span></div>`).join('')}
        </div>
        <div class="deepdive__links">
          <a href="${data.github}" target="_blank" rel="noopener" class="btn">GitHub &nearr;</a>
          ${data.live ? `<a href="${data.live}" target="_blank" rel="noopener" class="btn">Live Demo &nearr;</a>` : ''}
        </div>
      `;

      /* Show modal */
      document.body.style.overflow = 'hidden';
      modal.classList.add('active');
      modal.setAttribute('aria-hidden', 'false');

      /* Disable ScrollTrigger while open */
      ScrollTrigger.getAll().forEach(t => t.disable());

      /* Animate in */
      gsap.fromTo(content,
        { scale: 0.92, opacity: 0, y: 40 },
        { scale: 1, opacity: 1, y: 0, duration: 0.5, ease: EASE.expo }
      );
      gsap.fromTo(backdrop,
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: 'power1.out' }
      );
    }

    function closeModal() {
      if (!isOpen) return;
      gsap.to(content, {
        scale: 0.95, opacity: 0, y: 20, duration: 0.3, ease: EASE.inOut,
        onComplete: () => {
          modal.classList.remove('active');
          modal.setAttribute('aria-hidden', 'true');
          document.body.style.overflow = '';
          isOpen = false;
          /* Re-enable ScrollTrigger */
          ScrollTrigger.getAll().forEach(t => t.enable());
          ScrollTrigger.refresh();
        }
      });
      gsap.to(backdrop, { opacity: 0, duration: 0.25 });
    }

    /* Click on project cards */
    $$('[data-casestudy]').forEach(card => {
      card.addEventListener('click', e => {
        /* Don't intercept link clicks */
        if (e.target.closest('a')) return;
        openModal(card.dataset.casestudy);
      });
      card.style.cursor = 'pointer';
    });

    /* Close handlers */
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (backdrop) backdrop.addEventListener('click', closeModal);
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && isOpen) closeModal();
    });
  }


  /* ═════════════════════════════════════════
     17 · EXPERIENCE — Enhanced Card Stack
          Layered depth, glow pulse, tech tags
     ═════════════════════════════════════════ */
  function initExperience() {
    const section = $('#experience');
    if (!section) return;

    const ctx = gsap.context(() => {
      /* Depth reveal */
      gsap.fromTo(section,
        { scale: 0.97, opacity: 0.5, z: -30, transformOrigin: 'center top', transformPerspective: 1200 },
        { scale: 1, opacity: 1, z: 0, ease: EASE.scrub,
          scrollTrigger: { trigger: section, start: 'top 95%', end: 'top 40%', scrub: 1.2 }
        }
      );

      /* Header */
      const header = section.querySelector('.section__header');
      if (header) {
        const title = header.querySelector('.section__title');
        const num   = header.querySelector('.section__num');
        if (title) {
          gsap.fromTo(title,
            { clipPath: 'inset(0 100% 0 0)', opacity: 0 },
            { clipPath: 'inset(0 0% 0 0)', opacity: 1, ease: EASE.inOut,
              scrollTrigger: { trigger: header, start: 'top 82%', end: 'top 45%', scrub: 1 }
            }
          );
        }
        if (num) {
          gsap.fromTo(num, { x: -20, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.6, ease: EASE.smooth,
              scrollTrigger: { trigger: header, start: 'top 80%',
                onEnter: () => num.classList.add('active'),
                onLeaveBack: () => num.classList.remove('active'),
              }
            }
          );
        }
      }

      /* Main card reveal */
      const card = section.querySelector('.experience__card');
      if (card) {
        gsap.fromTo(card,
          { opacity: 0, y: 60, scale: 0.95 },
          { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: EASE.smooth,
            scrollTrigger: { trigger: card, start: 'top 85%', toggleActions: 'play none none reverse' }
          }
        );

        /* Corner brackets scale in */
        const corners = $$('.experience__corner', card);
        corners.forEach((c, i) => {
          gsap.fromTo(c,
            { scale: 0 },
            { scale: 1, duration: 0.4, ease: 'back.out(2)',
              scrollTrigger: { trigger: card, start: 'top 80%', toggleActions: 'play none none reverse' },
              delay: 0.3 + i * 0.08,
            }
          );
        });
      }

      /* Layered card stack animation */
      const layers = $$('.experience__layer', section);
      layers.forEach((layer, i) => {
        gsap.fromTo(layer,
          { opacity: 0, x: 20 + i * 10, y: 20 + i * 10 },
          { opacity: [0.3, 0.2, 0.1][i] || 0.1, x: 0, y: 0, duration: 0.6, ease: EASE.smooth,
            scrollTrigger: { trigger: section, start: 'top 80%', toggleActions: 'play none none reverse' },
            delay: 0.5 + i * 0.1,
          }
        );
      });

      /* Tech tags stagger */
      const tags = $$('.experience__tag', section);
      tags.forEach((tag, i) => {
        gsap.fromTo(tag,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.3, ease: EASE.smooth,
            scrollTrigger: { trigger: tag, start: 'top 92%', toggleActions: 'play none none reverse' },
            delay: 0.6 + i * 0.08,
          }
        );
      });

      /* Glow pulse on first reveal */
      const stack = section.querySelector('.experience__stack');
      if (stack) {
        ScrollTrigger.create({
          trigger: stack,
          start: 'top 75%',
          once: true,
          onEnter: () => {
            gsap.fromTo(stack,
              { boxShadow: '0 0 0 0 rgba(255,45,32,0)' },
              { boxShadow: '0 0 60px 10px rgba(255,45,32,0.25)', duration: 0.6, ease: EASE.smooth,
                onComplete: () => {
                  gsap.to(stack, { boxShadow: '0 0 0 0 rgba(255,45,32,0)', duration: 1, delay: 0.5 });
                }
              }
            );
          }
        });
      }
    }, section);
  }


  /* ═════════════════════════════════════════
     17.1 · WINS — Horizontal Scroll Showcase
            Pinned section, particle burst canvas,
            trophy reveal, card scaling
     ═════════════════════════════════════════ */
  function initWins() {
    const section = $('#wins');
    if (!section) return;

    const track   = $('#winsTrack');
    const counter = $('#winsCounter');
    const canvas  = section.querySelector('.wins__particles');
    const cards   = $$('.wins__card', section);
    const total   = cards.length;
    if (!track || !total) return;

    /* Header reveal */
    const header = section.querySelector('.section__header');
    if (header) {
      const title = header.querySelector('.section__title');
      const num   = header.querySelector('.section__num');
      if (title) {
        gsap.fromTo(title,
          { clipPath: 'inset(0 100% 0 0)', opacity: 0 },
          { clipPath: 'inset(0 0% 0 0)', opacity: 1, ease: EASE.inOut,
            scrollTrigger: { trigger: header, start: 'top 82%', end: 'top 45%', scrub: 1 }
          }
        );
      }
      if (num) {
        gsap.fromTo(num, { x: -20, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.6, ease: EASE.smooth,
            scrollTrigger: { trigger: header, start: 'top 80%',
              onEnter: () => num.classList.add('active'),
              onLeaveBack: () => num.classList.remove('active'),
            }
          }
        );
      }
    }

    /* Horizontal scroll pin */
    const scrollWidth = track.scrollWidth - section.offsetWidth;
    let activeIdx = 0;

    gsap.to(track, {
      x: () => -scrollWidth,
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: () => `+=${scrollWidth * 2}`,
        scrub: 1,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: self => {
          const progress = self.progress;
          const idx = Math.min(Math.floor(progress * total), total - 1);
          if (idx !== activeIdx) {
            cards[activeIdx].classList.remove('wins__card--active');
            cards[idx].classList.add('wins__card--active');
            burstParticles(cards[idx]);
            activeIdx = idx;
          }
          if (counter) {
            counter.textContent = `${String(idx + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}`;
          }
        }
      }
    });

    /* Set first card active */
    if (cards[0]) cards[0].classList.add('wins__card--active');

    /* Card scale on proximity */
    cards.forEach((card, i) => {
      gsap.fromTo(card,
        { scale: 0.88, opacity: 0.6 },
        { scale: 1, opacity: 1, duration: 0.4, ease: EASE.smooth,
          scrollTrigger: { trigger: card, start: 'left 80%', end: 'left 40%', scrub: 1,
            containerAnimation: gsap.getById && gsap.getById('winsScroll') || undefined,
          }
        }
      );
    });

    /* Trophy SVG fade in */
    const trophies = $$('.wins__trophy', section);
    trophies.forEach(t => {
      gsap.fromTo(t, { opacity: 0, scale: 0.7 },
        { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.5)',
          scrollTrigger: { trigger: t, start: 'top 90%', toggleActions: 'play none none reverse' }
        }
      );
    });

    /* ── Canvas Particle Burst ── */
    let ctx2d = null;
    let particles = [];
    let rafId = null;

    if (canvas) {
      canvas.width  = section.offsetWidth;
      canvas.height = section.offsetHeight;
      ctx2d = canvas.getContext('2d');

      window.addEventListener('resize', () => {
        canvas.width  = section.offsetWidth;
        canvas.height = section.offsetHeight;
      });
    }

    function burstParticles(card) {
      if (!ctx2d) return;
      const rect = card.getBoundingClientRect();
      const secRect = section.getBoundingClientRect();
      const cx = rect.left - secRect.left + rect.width / 2;
      const cy = rect.top - secRect.top + rect.height / 2;

      for (let i = 0; i < 15; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 1.5 + Math.random() * 3;
        particles.push({
          x: cx, y: cy,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1,
          size: 2 + Math.random() * 3,
        });
      }
      if (!rafId) animateParticles();
    }

    function animateParticles() {
      if (!ctx2d) return;
      ctx2d.clearRect(0, 0, canvas.width, canvas.height);
      particles = particles.filter(p => p.life > 0);
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.02;
        p.vy += 0.05; /* gravity */
        ctx2d.beginPath();
        ctx2d.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
        ctx2d.fillStyle = `rgba(255,45,32,${p.life * 0.8})`;
        ctx2d.fill();
      });
      if (particles.length > 0) {
        rafId = requestAnimationFrame(animateParticles);
      } else {
        rafId = null;
        ctx2d.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
  }


  /* ═════════════════════════════════════════
     17.3 · MICRO-INTERACTIONS
            RGB split, magnetic cursor, shortcuts
     ═════════════════════════════════════════ */
  function initMicroInteractions() {
    /* ── RGB Split on fast scroll ── */
    const headings = $$('.section__title');
    let lastScroll = 0;
    let rgbTimeout = null;

    ScrollTrigger.create({
      trigger: document.body,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: self => {
        const vel = Math.abs(self.getVelocity());
        if (vel > 2500) {
          headings.forEach(h => h.classList.add('rgb-split'));
          clearTimeout(rgbTimeout);
          rgbTimeout = setTimeout(() => {
            headings.forEach(h => h.classList.remove('rgb-split'));
          }, 300);
        }
      }
    });

    /* ── Magnetic cursor on win cards ── */
    if (!isTouch) {
      const winCards = $$('.wins__card');
      winCards.forEach(card => {
        card.addEventListener('mousemove', e => {
          const rect = card.getBoundingClientRect();
          const dx = (e.clientX - rect.left - rect.width / 2) * 0.08;
          const dy = (e.clientY - rect.top - rect.height / 2) * 0.08;
          gsap.to(card, { x: dx, y: dy, duration: 0.3, ease: EASE.smooth });
        });
        card.addEventListener('mouseleave', () => {
          gsap.to(card, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.5)' });
        });
      });
    }

    /* ── Keyboard shortcuts ── */
    document.addEventListener('keydown', e => {
      /* Skip if input focused */
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      const key = e.key.toLowerCase();
      if (key === 'f') gsap.to(window, { scrollTo: '#finale', duration: 1, ease: EASE.smooth });
      if (key === 'w') gsap.to(window, { scrollTo: '#wins', duration: 1, ease: EASE.smooth });
      if (key === 's' && !e.ctrlKey && !e.metaKey) gsap.to(window, { scrollTo: '#skills', duration: 1, ease: EASE.smooth });
    });
  }


  /* ═════════════════════════════════════════
     19 · DARK ENERGY MODE (Easter Egg)
          Konami code + "buildbreakrepeat"
     ═════════════════════════════════════════ */
  function initDarkEnergy() {
    const badge = $('#darkEnergyBadge');
    let darkActive = false;

    /* Konami Code: ↑↑↓↓←→←→BA */
    const konami = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
    let konamiIdx = 0;

    /* Typing: "buildbreakrepeat" */
    const phrase = 'buildbreakrepeat';
    let phraseBuffer = '';

    function toggleDarkEnergy() {
      darkActive = !darkActive;
      document.body.classList.toggle('dark-energy', darkActive);
      if (badge) {
        badge.classList.toggle('active', darkActive);
      }
      /* Log it */
      if (darkActive) {
        console.log('%c⚡ DARK ENERGY MODE ACTIVATED', 'color: #00b4ff; font-size: 16px; font-weight: bold;');
      } else {
        console.log('%c⚡ Dark Energy Mode deactivated', 'color: #777; font-size: 12px;');
      }
    }

    document.addEventListener('keydown', e => {
      /* Konami check */
      if (e.key === konami[konamiIdx]) {
        konamiIdx++;
        if (konamiIdx === konami.length) {
          konamiIdx = 0;
          toggleDarkEnergy();
          return;
        }
      } else {
        konamiIdx = 0;
      }

      /* Phrase check */
      if (e.key.length === 1) {
        phraseBuffer += e.key.toLowerCase();
        if (phraseBuffer.length > phrase.length) {
          phraseBuffer = phraseBuffer.slice(-phrase.length);
        }
        if (phraseBuffer === phrase) {
          phraseBuffer = '';
          toggleDarkEnergy();
        }
      }
    });
  }


  /* ═════════════════════════════════════════
     20 · PERFORMANCE MONITORING LOG
          Console telemetry — section times,
          interaction heat, scroll stats
     ═════════════════════════════════════════ */
  function initPerfLog() {
    const LOG_PREFIX = '[PerfLog]';
    const sectionEnterTimes = {};
    const sectionTotalTimes = {};
    let interactionCount = 0;
    let scrollSamples = [];
    let lastLoggedSection = null;

    /* Track section enter/leave times */
    const sectionIds = ['hero', 'about', 'experience', 'projects', 'freeze', 'skills', 'wins', 'finale', 'contact'];
    sectionIds.forEach(id => {
      const el = $(`#${id}`);
      if (!el) return;
      sectionTotalTimes[id] = 0;

      ScrollTrigger.create({
        trigger: el,
        start: 'top 50%',
        end: 'bottom 50%',
        onEnter: () => {
          sectionEnterTimes[id] = Date.now();
          if (id !== lastLoggedSection) {
            console.log(`${LOG_PREFIX} Entered: ${id}`);
            lastLoggedSection = id;
          }
        },
        onLeave: () => {
          if (sectionEnterTimes[id]) {
            sectionTotalTimes[id] += Date.now() - sectionEnterTimes[id];
            delete sectionEnterTimes[id];
          }
        },
        onEnterBack: () => {
          sectionEnterTimes[id] = Date.now();
          if (id !== lastLoggedSection) {
            console.log(`${LOG_PREFIX} Re-entered: ${id}`);
            lastLoggedSection = id;
          }
        },
        onLeaveBack: () => {
          if (sectionEnterTimes[id]) {
            sectionTotalTimes[id] += Date.now() - sectionEnterTimes[id];
            delete sectionEnterTimes[id];
          }
        },
      });
    });

    /* Scroll velocity sampling */
    ScrollTrigger.create({
      trigger: document.body,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: self => {
        const vel = Math.abs(self.getVelocity());
        if (vel > 10) scrollSamples.push(vel);
        if (scrollSamples.length > 500) scrollSamples = scrollSamples.slice(-500);
      }
    });

    /* Interaction heat counter */
    ['click', 'mousemove', 'keydown'].forEach(evt => {
      document.addEventListener(evt, () => interactionCount++, { passive: true });
    });

    /* Deep dive open logging */
    const deepDive = $('#deepDive');
    if (deepDive) {
      const observer = new MutationObserver(() => {
        if (deepDive.classList.contains('active')) {
          console.log(`${LOG_PREFIX} Deep Dive modal opened`);
        }
      });
      observer.observe(deepDive, { attributes: true, attributeFilter: ['class'] });
    }

    /* Summary dump on page unload */
    window.addEventListener('beforeunload', () => {
      /* Flush any currently-active section */
      Object.keys(sectionEnterTimes).forEach(id => {
        sectionTotalTimes[id] = (sectionTotalTimes[id] || 0) + (Date.now() - sectionEnterTimes[id]);
      });

      const avgScroll = scrollSamples.length
        ? Math.round(scrollSamples.reduce((a, b) => a + b, 0) / scrollSamples.length)
        : 0;

      console.groupCollapsed(`${LOG_PREFIX} Session Summary`);
      console.table(sectionTotalTimes);
      console.log(`Avg scroll velocity: ${avgScroll} px/s`);
      console.log(`Total interactions: ${interactionCount}`);
      console.groupEnd();
    });
  }


  /* ═════════════════════════════════════════
     BOOT SEQUENCE
     ═════════════════════════════════════════ */
  initIntro().then(() => {
    initPageTransition();
    initTextSplitting();
    initCursor();
    initScrollProgress();
    initSectionNav();
    initSmoothScroll();
    initNavbar();
    initHeroAnimations();
    initAboutAnimations();
    initProjectAnimations();
    initSkillAnimations();
    initSignatureMoment();
    initContactAnimations();
    initGlobalEffects();
    initPerformance();

    /* ── New feature modules ── */
    initSystemStatus();
    initDeepDive();
    initExperience();
    initWins();
    initMicroInteractions();
    initDarkEnergy();
    initPerfLog();

    /* Finale: init after fonts loaded + layout stabilized */
    document.fonts.ready.then(() => {
      requestAnimationFrame(() => {
        initFinale();
        ScrollTrigger.refresh();
      });
    });
  });

})();
