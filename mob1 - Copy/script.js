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
      updateHeroInteractions(e.clientX, e.clientY);
    });

    // Mobile touch support
    document.addEventListener('touchmove', (e) => {
      if(e.touches.length > 0) {
        updateHeroInteractions(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });
  }

  gsap.fromTo(".hero-base .hero-line", 
    { opacity: 0, y: "20%" },
    { opacity: 1, y: "0%", duration: 1.5, stagger: 0.1, ease: "power3.out", delay: 0.2 }
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
  
  ScrollTrigger.create({
    trigger: section,
    start: "top 50%",
    end: "bottom 50%",
    onEnter: () => setTheme(theme),
    onEnterBack: () => setTheme(theme)
  });
});

function setTheme(theme) {
  if(theme === 'light') {
    gsap.to("body", {
      "--c-bg-local": "#f4f4f4",
      "--c-text-local": "#050505",
      "--c-border": "rgba(0, 0, 0, 0.15)",
      backgroundColor: "#f4f4f4",
      color: "#050505",
      duration: 1,
      ease: "power2.out",
      overwrite: "auto"
    });
  } else {
    gsap.to("body", {
      "--c-bg-local": "#050505",
      "--c-text-local": "#f4f4f4",
      "--c-border": "rgba(255, 255, 255, 0.15)",
      backgroundColor: "#050505",
      color: "#f4f4f4",
      duration: 1,
      ease: "power2.out",
      overwrite: "auto"
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

// Parallax Image
gsap.to(".about-img-box img", {
  yPercent: 15,
  ease: "none",
  scrollTrigger: {
    trigger: ".about-visual",
    start: "top bottom",
    end: "bottom top",
    scrub: true
  }
});
