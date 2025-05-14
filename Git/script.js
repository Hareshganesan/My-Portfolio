// Enhanced LIM London style intro animation
document.addEventListener('DOMContentLoaded', function() {
    const limIntro = document.getElementById('limIntro');
    const mainContent = document.querySelector('.main-content');
    const navbar = document.getElementById('mainNavbar');
    const textElements = document.querySelectorAll('.lim-text');
    const limSvgPaths = document.querySelectorAll('.lim-path');
    
    // Create loading animation elements
    createLoadingElements();
    
    // Ensure everything is properly hidden initially
    document.body.style.overflow = 'hidden';
    mainContent.style.opacity = '0';
    mainContent.style.visibility = 'hidden';
    navbar.style.display = 'none';
    
    // Create particle effect for intro
    createIntroParticles();
    
    // Add 3D tilt effect to the entire intro
    addIntroTiltEffect();
    
    // Add mouse-follow spotlight effect
    addSpotlightEffect();
    
    // Enhanced SVG path effects
    enhanceSvgPaths();
    
    // Add glitch effect to text occasionally
    addTextGlitchEffect();
    
    // Start the loading animation
    startLoadingAnimation();
    
    // Text transition
    let currentTextIndex = 0;
    
    function cycleText() {
        // Animate text out with a new effect
        gsap.to(textElements[currentTextIndex], {
            opacity: 0,
            y: -30,
            duration: 0.5,
            ease: "power2.in",
            onComplete: () => {
                textElements[currentTextIndex].classList.remove('active');
                
                // Update index and animate new text in
                currentTextIndex = (currentTextIndex + 1) % textElements.length;
                
                gsap.fromTo(textElements[currentTextIndex], 
                    {opacity: 0, y: 30}, 
                    {opacity: 1, y: 0, duration: 0.5, ease: "power2.out"}
                );
                textElements[currentTextIndex].classList.add('active');
            }
        });
    }
    
    // Initialize first text with a fade in
    gsap.fromTo(textElements[0], 
        {opacity: 0, y: 30}, 
        {opacity: 1, y: 0, duration: 1, delay: 2, ease: "power2.out"}
    );
    textElements[0].classList.add('active');
    
    // Cycle texts
    const textInterval = setInterval(cycleText, 3000);
    
    // Complete the intro after specific time
    const completeIntro = () => {
        clearInterval(textInterval);

        // Prevent double execution
        if (document.body.classList.contains('transition-in-progress')) return;
        document.body.classList.add('transition-in-progress');

        // 1. Create a multi-layered radial burst
        const burstLayers = [];
        const burstColors = [
            'rgba(255,214,0,0.7)',   // Yellow
            'rgba(255,235,59,0.5)',  // Lighter yellow
            'rgba(255,255,255,0.18)' // White for highlight
        ];
        for (let i = 0; i < 3; i++) {
            const burst = document.createElement('div');
            burst.className = 'lim-burst-layer';
            burst.style.cssText = `
                position: fixed;
                left: 50%; top: 50%;
                width: 0; height: 0;
                border-radius: 50%;
                background: radial-gradient(circle, ${burstColors[i]} 0%, transparent 80%);
                z-index: 10001;
                pointer-events: none;
                opacity: 0.7;
                filter: blur(${10 + i * 15}px);
                transform: translate(-50%, -50%) scale(0.2);
                will-change: width, height, opacity, filter, transform;
            `;
            document.body.appendChild(burst);
            burstLayers.push(burst);
        }

        // 2. Animate the bursts outward with stagger
        burstLayers.forEach((burst, i) => {
            setTimeout(() => {
                gsap.to(burst, {
                    width: '300vw',
                    height: '300vw',
                    opacity: 0,
                    scale: 1.2 + i * 0.2,
                    duration: 0.9 + i * 0.2,
                    ease: "power3.out",
                    onComplete: () => burst.remove()
                });
            }, i * 100);
        });

        // 3. Blur and scale out the intro content with will-change for smoothness
        const limContent = document.querySelector('.lim-content');
        limContent.style.willChange = 'filter, opacity, transform';
        gsap.to(limContent, {
            filter: 'blur(40px)',
            scale: 1.08,
            opacity: 0,
            duration: 0.8,
            delay: 0.25,
            ease: "expo.in"
        });

        // 4. Fade out the whole intro overlay with requestAnimationFrame for extra smoothness
        const limIntroEl = document.getElementById('limIntro');
        limIntroEl.style.willChange = 'opacity';
        let fadeStart = null;
        function fadeOutIntro(ts) {
            if (!fadeStart) fadeStart = ts;
            const progress = Math.min((ts - fadeStart) / 700, 1);
            limIntroEl.style.opacity = 1 - progress;
            if (progress < 1) {
                requestAnimationFrame(fadeOutIntro);
            } else {
                limIntroEl.style.opacity = 0;
                limIntroEl.style.display = 'none';
                document.body.classList.add('lim-intro-done');
                document.body.classList.remove('transition-in-progress');
                // Show main content and navbar with fade-in
                mainContent.style.opacity = '0';
                mainContent.style.visibility = 'visible';
                mainContent.style.display = 'block';
                navbar.style.opacity = '0';
                navbar.style.visibility = 'visible';
                navbar.style.display = '';
                // Fade in both main content and navbar
                gsap.to([mainContent, navbar], {
                    opacity: 1,
                    duration: 0.7,
                    ease: "expo.out",
                    onComplete: () => {
                        mainContent.style.opacity = '1';
                        navbar.style.opacity = '1';
                        limIntroEl.style.willChange = '';
                        limContent.style.willChange = '';
                    }
                });
                document.body.style.overflow = 'auto';
                setTimeout(() => {
                    if (typeof AOS !== 'undefined') AOS.refresh();
                    document.querySelectorAll('.reveal-text').forEach(el => {
                        el.style.opacity = '1';
                        el.style.transform = 'translateY(0)';
                    });
                    createGalaxyEffect();
                    addMagneticEffect();
                }, 100);
            }
        }
        setTimeout(() => requestAnimationFrame(fadeOutIntro), 1100);
    };

    // Create loading elements for the intro screen
    function createLoadingElements() {
        const limContent = document.querySelector('.lim-content');
        
        // Create loader container
        const loaderContainer = document.createElement('div');
        loaderContainer.className = 'lim-loader-container';
        
        // Create spinner
        const spinner = document.createElement('div');
        spinner.className = 'lim-spinner';
        spinner.innerHTML = `
            <div class="lim-spinner-ring"></div>
            <div class="lim-spinner-ring"></div>
            <div class="lim-spinner-ring"></div>
            <div class="lim-spinner-core"></div>
        `;
        
        // Create loading text
        const loadingText = document.createElement('div');
        loadingText.className = 'lim-loading-text';
        loadingText.innerHTML = `Initializing<span class="lim-loading-dots">
            <span class="lim-loading-dot"></span>
            <span class="lim-loading-dot"></span>
            <span class="lim-loading-dot"></span>
        </span>`;
        
        // Create progress bar
        const progressBar = document.createElement('div');
        progressBar.className = 'lim-progress-bar';
        progressBar.innerHTML = `
            <div class="lim-progress-fill"></div>
            <div class="lim-progress-glow"></div>
        `;
        
        // Create percentage text
        const percentageText = document.createElement('div');
        percentageText.className = 'lim-percentage';
        percentageText.textContent = '0%';
        
        // Create loading particles container
        const loadingParticles = document.createElement('div');
        loadingParticles.className = 'lim-loading-particles';
        
        // Add elements to container
        loaderContainer.appendChild(spinner);
        loaderContainer.appendChild(loadingText);
        loaderContainer.appendChild(progressBar);
        loaderContainer.appendChild(percentageText);
        
        // Add container to intro content
        limContent.appendChild(loaderContainer);
        limIntro.appendChild(loadingParticles);
        
        // Create loading particles
        createLoadingParticles();
    }
    
    // Create floating particles for loading animation
    function createLoadingParticles() {
        const particlesContainer = document.querySelector('.lim-loading-particles');
        
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.className = 'lim-loading-particle';
            
            // Random position around the spinner
            const angle = Math.random() * Math.PI * 2;
            const distance = 100 + Math.random() * 100;
            
            const x = Math.cos(angle) * distance;
            const y = Math.sin(angle) * distance;
            
            particle.style.left = `calc(50% + ${x / 2}px)`;
            particle.style.top = `calc(50% + ${y / 2}px)`;
            particle.style.setProperty('--x', `${x}px`);
            particle.style.setProperty('--y', `${y}px`);
            
            // Random animation delay
            particle.style.animationDelay = `${Math.random() * 2}s`;
            
            particlesContainer.appendChild(particle);
        }
    }
    
    // Start loading animation sequence
    function startLoadingAnimation() {
        const spinner = document.querySelector('.lim-spinner');
        const loadingText = document.querySelector('.lim-loading-text');
        const progressFill = document.querySelector('.lim-progress-fill');
        const progressGlow = document.querySelector('.lim-progress-glow');
        const percentageText = document.querySelector('.lim-percentage');
        
        // Loading messages to cycle through
        const loadingMessages = [
            "Initializing environment",
            "Loading neural networks",
            "Connecting particles",
            "Generating interface",
            "Calibrating animations",
            "Optimizing experience",
            "Preparing portfolio data",
            "Almost there"
        ];
        
        // Show spinner with delay
        setTimeout(() => {
            spinner.classList.add('active');
        }, 300);
        
        // Show loading text with delay
        setTimeout(() => {
            loadingText.classList.add('active');
        }, 600);
        
        // Simulate loading progress
        let progress = 0;
        const totalDuration = 8000; // 8 seconds total loading time
        const interval = 50; // Update every 50ms
        const incrementsPerSecond = 1000 / interval;
        const progressStep = 100 / (totalDuration / 1000 * incrementsPerSecond);
        
        // Current message index
        let messageIndex = 0;
        
        // Update loading message periodically
        function updateLoadingMessage() {
            loadingText.classList.remove('active');
            
            setTimeout(() => {
                messageIndex = (messageIndex + 1) % loadingMessages.length;
                loadingText.innerHTML = `${loadingMessages[messageIndex]}<span class="lim-loading-dots">
                    <span class="lim-loading-dot"></span>
                    <span class="lim-loading-dot"></span>
                    <span class="lim-loading-dot"></span>
                </span>`;
                loadingText.classList.add('active');
            }, 300);
        }
        
        // Set first message immediately
        loadingText.innerHTML = `${loadingMessages[0]}<span class="lim-loading-dots">
            <span class="lim-loading-dot"></span>
            <span class="lim-loading-dot"></span>
            <span class="lim-loading-dot"></span>
        </span>`;
        
        // Change message every ~1 second
        const messageInterval = setInterval(updateLoadingMessage, 1200);
        
        // Progress update interval
        const progressInterval = setInterval(() => {
            progress += progressStep;
            
            // Add some randomness to make it look more natural
            progress += Math.random() * 0.3;
            
            if (progress >= 100) {
                progress = 100;
                clearInterval(progressInterval);
                clearInterval(messageInterval);
                
                // Set final message
                loadingText.innerHTML = "Ready!";
                
                // Complete the intro after a short delay
                setTimeout(completeIntro, 500);
            }
            
            // Update progress bar and percentage text
            progressFill.style.width = `${progress}%`;
            progressGlow.style.left = `${progress}%`;
            percentageText.textContent = `${Math.floor(progress)}%`;
            
            // Add special effects at certain milestones
            if (Math.floor(progress) % 25 === 0) {
                // Pulse effect
                gsap.fromTo(spinner, 
                    { scale: 1 },
                    { scale: 1.2, duration: 0.3, yoyo: true, repeat: 1 }
                );
                
                // Flash the percentage text
                percentageText.style.textShadow = "0 0 20px rgba(255, 214, 0, 1)";
                setTimeout(() => {
                    percentageText.style.textShadow = "";
                }, 300);
            }
        }, interval);
    }
    
    // Allow clicking or scrolling to skip intro
    limIntro.addEventListener('click', () => {
        document.querySelector('.lim-progress-fill').style.width = '100%';
        document.querySelector('.lim-percentage').textContent = '100%';
        document.querySelector('.lim-loading-text').innerHTML = "Ready!";
        setTimeout(completeIntro, 300);
    });
    
    limIntro.addEventListener('wheel', () => {
        document.querySelector('.lim-progress-fill').style.width = '100%';
        document.querySelector('.lim-percentage').textContent = '100%';
        document.querySelector('.lim-loading-text').innerHTML = "Ready!";
        setTimeout(completeIntro, 300);
    });
    
    window.addEventListener('keydown', e => {
        if (e.key === 'Escape' || e.key === ' ' || e.key === 'Enter') {
            document.querySelector('.lim-progress-fill').style.width = '100%';
            document.querySelector('.lim-percentage').textContent = '100%';
            document.querySelector('.lim-loading-text').innerHTML = "Ready!";
            setTimeout(completeIntro, 300);
        }
    });
    
    // Function to create particle background
    function createIntroParticles() {
        const particlesContainer = document.createElement('div');
        particlesContainer.className = 'lim-particles';
        limIntro.appendChild(particlesContainer);
        
        for (let i = 0; i < 100; i++) {
            const particle = document.createElement('div');
            particle.className = 'lim-particle';
            particle.style.background = 'rgba(255,214,0,0.5)';
            
            // Random position, size and animation delay
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.top = `${Math.random() * 100}%`;
            particle.style.width = `${2 + Math.random() * 4}px`;
            particle.style.height = particle.style.width;
            particle.style.animationDelay = `${Math.random() * 5}s`;
            
            particlesContainer.appendChild(particle);
        }
    }
    
    // Function to add tilt effect to intro
    function addIntroTiltEffect() {
        limIntro.addEventListener('mousemove', (e) => {
            const xPos = (e.clientX / window.innerWidth - 0.5) * 20;
            const yPos = (e.clientY / window.innerHeight - 0.5) * 20;
            
            // Apply tilt to content
            gsap.to('.lim-content', {
                rotationY: xPos,
                rotationX: -yPos,
                transformPerspective: 1000,
                ease: "power1.out",
                duration: 0.5
            });
            
            // Move particles slightly
            gsap.to('.lim-particle', {
                x: xPos * 2,
                y: yPos * 2,
                ease: "power1.out",
                duration: 1
            });
        });
        
        limIntro.addEventListener('mouseleave', () => {
            gsap.to('.lim-content', {
                rotationY: 0,
                rotationX: 0,
                duration: 0.5
            });
            
            gsap.to('.lim-particle', {
                x: 0,
                y: 0,
                duration: 1
            });
        });
    }
    
    // Function to add spotlight effect
    function addSpotlightEffect() {
        const spotlight = document.createElement('div');
        spotlight.className = 'lim-spotlight';
        limIntro.appendChild(spotlight);
        
        limIntro.addEventListener('mousemove', (e) => {
            gsap.to(spotlight, {
                x: e.clientX,
                y: e.clientY,
                duration: 0.5,
                ease: "power2.out"
            });
        });
    }
    
    // Function to enhance SVG paths
    function enhanceSvgPaths() {
        limSvgPaths.forEach((path, index) => {
            // Randomize dash animation delays slightly for more organic feel
            path.style.animationDelay = `${0.5 + index * 0.2 + Math.random() * 0.2}s`;
            
            // Add glow filter to SVG paths
            path.setAttribute('filter', 'url(#glow)');
            path.setAttribute('stroke', '#FFD600');
            
            // Add hover effect
            path.addEventListener('mouseenter', () => {
                gsap.to(path, {
                    strokeWidth: 4,
                    ease: "elastic.out(1, 0.3)",
                    duration: 0.6
                });
            });
            
            path.addEventListener('mouseleave', () => {
                gsap.to(path, {
                    strokeWidth: 2,
                    ease: "power2.out",
                    duration: 0.6
                });
            });
        });
        
        // Create SVG filter for glow effect if not exists
        if (!document.getElementById('limSvgDefs')) {
            const svgElement = document.querySelector('.lim-svg');
            const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
            defs.id = 'limSvgDefs';
            
            defs.innerHTML = `
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="2" result="blur" />
                    <feComposite operator="over" in="SourceGraphic" />
                </filter>
            `;
            
            svgElement.insertBefore(defs, svgElement.firstChild);
        }
    }
    
    // Function to add text glitch effect
    function addTextGlitchEffect() {
        const glitchInterval = setInterval(() => {
            // Only apply glitch to active text
            const activeText = document.querySelector('.lim-text.active');
            if (!activeText) return;
            
            // Add glitch class
            activeText.classList.add('glitch');
            
            // Remove after short duration
            setTimeout(() => {
                activeText.classList.remove('glitch');
            }, 200);
        }, 5000);
        
        // Clear interval when intro completes
        setTimeout(() => {
            clearInterval(glitchInterval);
        }, 12000);
    }
    
    // Create a particle burst effect for intro exit
    function createParticleBurst() {
        const burstContainer = document.createElement('div');
        burstContainer.className = 'lim-particle-burst';
        limIntro.appendChild(burstContainer);
        
        // Reduce number of particles from 150 to 50 for better performance
        const particleCount = 50;
        
        // Create particles
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'burst-particle';
            
            // Center of screen
            particle.style.left = '50%';
            particle.style.top = '50%';
            
            // Random angle and distance
            const angle = Math.random() * Math.PI * 2;
            const distance = 50 + Math.random() * 150; // Reduced max distance
            const duration = 0.3 + Math.random() * 0.6; // Shorter duration
            const size = 2 + Math.random() * 4; // Smaller particles
            
            // Set size
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            
            // Add to container
            burstContainer.appendChild(particle);
            
            // Use requestAnimationFrame instead of GSAP for better performance
            const startTime = performance.now();
            const endTime = startTime + duration * 1000;
            
            function animateParticle(timestamp) {
                const elapsed = timestamp - startTime;
                const progress = Math.min(elapsed / (duration * 1000), 1);
                
                const currentX = Math.cos(angle) * distance * progress;
                const currentY = Math.sin(angle) * distance * progress;
                const currentOpacity = 1 - progress;
                const currentScale = 1 - progress;
                
                particle.style.transform = `translate(${currentX}px, ${currentY}px) scale(${currentScale})`;
                particle.style.opacity = currentOpacity;
                
                if (progress < 1) {
                    requestAnimationFrame(animateParticle);
                } else {
                    particle.remove(); // Clean up immediately after animation
                }
            }
            
            requestAnimationFrame(animateParticle);
        }
    }
    
    // Add this new function to create a ripple effect during transition
    function createRippleEffect() {
        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 10px;
            height: 10px;
            background: #5e17eb;
            border-radius: 50%;
            z-index: 1001;
            pointer-events: none;
        `;
        document.body.appendChild(ripple);
        
        gsap.to(ripple, {
            width: '300vw',
            height: '300vw',
            opacity: 0,
            duration: 0.8,
            ease: "power1.out",
            onComplete: () => ripple.remove()
        });
    }
    
    // Add galaxy dots effect to hero section
    function createGalaxyEffect() {
        const heroSection = document.querySelector('.hero-section');
        const galaxyContainer = document.createElement('div');
        galaxyContainer.className = 'hero-galaxy';
        heroSection.appendChild(galaxyContainer);
        
        for (let i = 0; i < 100; i++) {
            const dot = document.createElement('div');
            dot.className = 'galaxy-dot';
            
            // Random position and animation properties
            const size = 1 + Math.random() * 3;
            const distance = 50 + Math.random() * 200;
            const duration = 10 + Math.random() * 20;
            const delay = Math.random() * 10;
            const opacity = 0.1 + Math.random() * 0.5;
            
            dot.style.width = `${size}px`;
            dot.style.height = `${size}px`;
            dot.style.top = `${50 + (Math.random() - 0.5) * 20}%`;
            dot.style.left = `${50 + (Math.random() - 0.5) * 20}%`;
            dot.style.animationDuration = `${duration}s`;
            dot.style.animationDelay = `${delay}s`;
            dot.style.opacity = opacity;
            
            if (Math.random() > 0.7) {
                dot.style.background = `rgba(255,214,0, ${opacity + 0.2})`;
            }
            
            galaxyContainer.appendChild(dot);
        }
    }
    
    // Add magnetic effect to hero content
    function addMagneticEffect() {
        const heroContent = document.querySelector('.hero-content');
        const heroName = document.querySelector('.hero-name');
        
        heroContent.addEventListener('mousemove', (e) => {
            const bounds = heroContent.getBoundingClientRect();
            const mouseX = e.clientX - bounds.left;
            const mouseY = e.clientY - bounds.top;
            
            const centerX = bounds.width / 2;
            const centerY = bounds.height / 2;
            
            const moveX = (mouseX - centerX) / 25;
            const moveY = (mouseY - centerY) / 25;
            
            gsap.to(heroName, {
                x: moveX,
                y: moveY,
                duration: 0.5,
                ease: "power2.out"
            });
            
            // Add data-text attribute for 3D effect
            heroName.setAttribute('data-text', heroName.textContent);
        });
        
        heroContent.addEventListener('mouseleave', () => {
            gsap.to(heroName, {
                x: 0,
                y: 0,
                duration: 0.5,
                ease: "elastic.out(1, 0.5)"
            });
        });
        
        // Add hover effect to individual characters in the name
        heroName.querySelectorAll('.char').forEach((char, index) => {
            char.addEventListener('mouseenter', () => {
                gsap.to(char, {
                    y: -10,
                    scale: 1.2,
                    rotationZ: Math.random() * 10 - 5,
                    color: '#ffffff',
                    textShadow: '0 0 15px rgba(255, 214, 0, 0.8)',
                    duration: 0.3,
                    ease: "power2.out"
                });
            });
            
            char.addEventListener('mouseleave', () => {
                gsap.to(char, {
                    y: 0,
                    scale: 1,
                    rotationZ: 0,
                    color: '',
                    textShadow: '',
                    duration: 0.3,
                    ease: "power2.out"
                });
            });
        });
    }
    
    // Update hero image hover effect
    document.addEventListener('DOMContentLoaded', function() {
        const heroImg = document.querySelector('.hero-img');
        
        if (heroImg) {
            heroImg.addEventListener('mouseenter', () => {
                gsap.to(heroImg, {
                    scale: 1.05,
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4), 0 0 30px rgba(255, 214, 0, 0.6)',
                    borderColor: '#a78bfa',
                    duration: 0.4,
                    ease: "power2.out"
                });
            });
            
            heroImg.addEventListener('mouseleave', () => {
                gsap.to(heroImg, {
                    scale: 1,
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
                    borderColor: '#9c55ff',
                    duration: 0.4,
                    ease: "power2.out"
                });
            });
        }
    });
    
    // Enhanced interactive text effects for hero name
    document.addEventListener('DOMContentLoaded', function() {
        const heroName = document.querySelector('.hero-name');
        
        if (heroName) {
            // Set data-text attribute for 3D shadow effect
            heroName.setAttribute('data-text', heroName.textContent);
            
            // Split text into characters if not already done
            const spans = heroName.querySelectorAll('span');
            spans.forEach((span, i) => {
                if (!span.querySelector('.char')) { // Check if split is already done
                    const text = span.textContent;
                    const chars = text.split('');
                    span.innerHTML = chars.map((char, index) => 
                        `<span class="char" style="--char-index: ${index + (i * text.length)}">${char}</span>`
                    ).join('');
                }
            });
            
            // Add staggered animation to characters on page load
            const chars = heroName.querySelectorAll('.char');
            gsap.fromTo(chars, 
                { 
                    y: 100, 
                    opacity: 0, 
                    rotationX: 90
                },
                {
                    y: 0,
                    opacity: 1,
                    rotationX: 0,
                    stagger: 0.03,
                    delay: 0.5,
                    duration: 0.6,
                    ease: "back.out(1.7)",
                    onComplete: () => {
                        // Add hover interactions after animation completes
                        chars.forEach(char => {
                            char.style.transition = 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
                        });
                    }
                }
            );
        }
    });
});

// Initialize AOS
AOS.init({
    duration: 1000,
    once: true,
    mirror: false
});

// Particles.js Configuration
particlesJS('particles-js', {
    particles: {
        number: { value: 80, density: { enable: true, value_area: 800 } },
        color: { value: '#FFD600' },
        shape: { type: 'circle' },
        opacity: {
            value: 0.5,
            random: true,
            animation: { enable: true, speed: 1, opacity_min: 0.1, sync: false }
        },
        size: {
            value: 3,
            random: true,
            animation: { enable: true, speed: 4, size_min: 0.3, sync: false }
        },
        line_linked: {
            enable: true,
            distance: 150,
            color: '#FFD600',
            opacity: 0.4,
            width: 1
        },
        move: {
            enable: true,
            speed: 2,
            direction: 'none',
            random: false,
            straight: false,
            out_mode: 'out',
            bounce: false,
        }
    },
    interactivity: {
        detect_on: 'canvas',
        events: {
            onhover: { enable: true, mode: 'repulse' },
            onclick: { enable: true, mode: 'push' },
            resize: true
        },
        modes: {
            repulse: { distance: 100, duration: 0.4 },
            push: { particles_nb: 4 }
        }
    },
    retina_detect: true
});

// Enhanced scroll effect for navbar
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
        navbar.style.backdropFilter = 'blur(10px)';
    } else {
        navbar.classList.remove('scrolled');
        navbar.style.backdropFilter = 'none';
    }
});

// Add this to create an interactive background effect
document.addEventListener('mousemove', (e) => {
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;
    
    document.body.style.setProperty('--mouse-x', x);
    document.body.style.setProperty('--mouse-y', y);
    
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.style.backgroundPosition = `${x * 50}% ${y * 50}%`;
    });
});

// Enhanced interactive effects
document.addEventListener('mousemove', (e) => {
    // Update custom properties for gradient effects
    const x = (e.clientX / window.innerWidth) * 100;
    const y = (e.clientY / window.innerHeight) * 100;
    
    document.documentElement.style.setProperty('--mouse-x', `${x}%`);
    document.documentElement.style.setProperty('--mouse-y', `${y}%`);
    
    // Parallax effect for all sections
    document.querySelectorAll('section').forEach(section => {
        const rect = section.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const moveX = (e.clientX - centerX) * 0.01;
        const moveY = (e.clientY - centerY) * 0.01;
        
        section.style.transform = `translate(${moveX}px, ${moveY}px)`;
    });
});

// Reset transforms when mouse leaves the window
document.addEventListener('mouseleave', () => {
    document.querySelectorAll('section').forEach(section => {
        section.style.transform = 'translate(0, 0)';
    });
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// 3D Card Tilt Effect
document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const angleX = (y - centerY) / 30;
        const angleY = (centerX - x) / 30;
        
        card.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
    });
});

// Neural Network Background Animation
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
document.querySelector('.network-bg').appendChild(canvas);

let particles = [];
const particleCount = 100;

function initParticles() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    for(let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: Math.random() * 2 - 1,
            vy: Math.random() * 2 - 1
        });
    }
}

function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach(particle => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        if(particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if(particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;
        
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 214, 0, 0.5)';
        ctx.fill();
        
        particles.forEach(p2 => {
            const dx = particle.x - p2.x;
            const dy = particle.y - p2.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if(distance < 100) {
                ctx.beginPath();
                ctx.moveTo(particle.x, particle.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.strokeStyle = `rgba(255, 214, 0, ${1 - distance/100})`;
                ctx.stroke();
            }
        });
    });
    
    requestAnimationFrame(drawParticles);
}

initParticles();
drawParticles();
window.addEventListener('resize', initParticles);

// Enhanced Neural Network Background
function createNetworkBackground() {
    document.querySelectorAll('.network-bg').forEach((container, index) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        container.appendChild(canvas);

        const particles = [];
        const particleCount = 50; // Reduced count per section for better performance
        
        function initParticles() {
            canvas.width = container.offsetWidth;
            canvas.height = container.offsetHeight;
            
            particles.length = 0;
            for(let i = 0; i < particleCount; i++) {
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    vx: (Math.random() * 1 - 0.5),
                    vy: (Math.random() * 1 - 0.5),
                    size: Math.random() * 2 + 1
                });
            }
        }

        function drawParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            particles.forEach(particle => {
                particle.x += particle.vx;
                particle.y += particle.vy;
                
                if(particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
                if(particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;
                
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 214, 0, ${0.3 - index * 0.05})`;
                ctx.fill();
                
                particles.forEach(p2 => {
                    const dx = particle.x - p2.x;
                    const dy = particle.y - p2.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if(distance < 100) {
                        ctx.beginPath();
                        ctx.moveTo(particle.x, particle.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.strokeStyle = `rgba(255, 214, 0, ${(1 - distance/100) * (0.3 - index * 0.05)})`;
                        ctx.stroke();
                    }
                });
            });
            
            requestAnimationFrame(drawParticles);
        }

        initParticles();
        drawParticles();
        window.addEventListener('resize', initParticles);
    });
}

// Initialize the enhanced network background
createNetworkBackground();

// Animated text reveal on scroll
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.reveal-text').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'all 0.8s ease-out';
    observer.observe(el);
});

// Dynamic text effect for role
const roles = ['Full Stack Developer', 'UI/UX Designer', 'Problem Solver', 'Tech Enthusiast'];
let roleIndex = 0;

function updateRole() {
    const roleElement = document.querySelector('.role-text');
    roleElement.style.animation = 'none';
    roleElement.offsetHeight; // Trigger reflow
    roleElement.textContent = roles[roleIndex];
    roleElement.style.animation = 'typing 3.5s steps(30, end)';
    roleIndex = (roleIndex + 1) % roles.length;
}

setInterval(updateRole, 4000);

// Split text into characters for animation
document.querySelectorAll('.hero-name span').forEach((span, i) => {
    const text = span.textContent;
    const chars = text.split('');
    span.innerHTML = chars.map((char, index) => 
        `<span class="char" style="--char-index: ${index + (i * text.length)}">${char}</span>`
    ).join('');
});

// Add particle effect to text
const heroName = document.querySelector('.hero-name');
heroName.addEventListener('mousemove', (e) => {
    const bounds = heroName.getBoundingClientRect();
    const x = e.clientX - bounds.left;
    const y = e.clientY - bounds.top;
    
    const particle = document.createElement('span');
    particle.className = 'particle';
    particle.style.cssText = `
        position: absolute;
        left: ${x}px;
        top: ${y}px;
        width: 4px;
        height: 4px;
        background: #FFD600;
        border-radius: 50%;
        pointer-events: none;
        transform: translate(-50%, -50%);
    `;
    
    heroName.appendChild(particle);
    
    gsap.to(particle, {
        duration: 1,
        x: x + (Math.random() - 0.5) * 100,
        y: y + (Math.random() - 0.5) * 100,
        opacity: 0,
        onComplete: () => particle.remove()
    });
});

const hero3DText = document.querySelector('.hero-3d-text');
if (hero3DText) {
    hero3DText.addEventListener('mousemove', (e) => {
        const bounds = e.target.getBoundingClientRect();
        const mouseX = e.clientX - bounds.left;
        const mouseY = e.clientY - bounds.top;
        const centerX = bounds.width / 2;
        const centerY = bounds.height / 2;

        const angleX = (mouseY - centerY) / 25;
        const angleY = (centerX - mouseX) / 25;

        gsap.to('.hero-name', {
            duration: 0.5,
            rotationX: -angleX,
            rotationY: angleY,
            transformPerspective: 1000,
            ease: 'power1.out'
        });
    });

    hero3DText.addEventListener('mouseleave', () => {
        gsap.to('.hero-name', {
            duration: 0.5,
            rotationX: 0,
            rotationY: 0,
            transformPerspective: 1000,
            transformOrigin: "center center",
            ease: 'power1.out'
        });
    });
}


// Initialize particles for both hero and contact sections
document.addEventListener('DOMContentLoaded', function() {
    // Add particles to hero section
    const heroSection = document.querySelector('#home .network-bg');
    if (heroSection) {
        const heroParticles = document.createElement('div');
        heroParticles.id = 'hero-particles-js';
        heroParticles.className = 'particles-container';
        heroSection.appendChild(heroParticles);
        
        particlesJS('hero-particles-js', {
            particles: {
                number: { value: 80, density: { enable: true, value_area: 800 } },
                color: { value: '#FFD600' },
                shape: { type: 'circle' },
                opacity: {
                    value: 0.5,
                    random: true,
                    animation: { enable: true, speed: 1, opacity_min: 0.1, sync: false }
                },
                size: {
                    value: 3,
                    random: true,
                    animation: { enable: true, speed: 4, size_min: 0.3, sync: false }
                },
                line_linked: {
                    enable: true,
                    distance: 150,
                    color: '#FFD600',
                    opacity: 0.4,
                    width: 1
                },
                move: {
                    enable: true,
                    speed: 2,
                    direction: 'none',
                    random: false,
                    straight: false,
                    out_mode: 'out',
                    bounce: false,
                }
            },
            interactivity: {
                detect_on: 'canvas',
                events: {
                    onhover: { enable: true, mode: 'repulse' },
                    onclick: { enable: true, mode: 'push' },
                    resize: true
                },
                modes: {
                    repulse: { distance: 100, duration: 0.4 },
                    push: { particles_nb: 4 }
                }
            },
            retina_detect: true
        });
        
        // Add particles to projects section with different settings
        particlesJS('particles-js', {
            particles: {
                number: { value: 40, density: { enable: true, value_area: 800 } },
                color: { value: '#FFD600' },
                shape: { type: 'circle' },
                opacity: {
                    value: 0.3,
                    random: true,
                    animation: { enable: true, speed: 0.5, opacity_min: 0.1, sync: false }
                },
                size: {
                    value: 2,
                    random: true,
                    animation: { enable: true, speed: 2, size_min: 0.1, sync: false }
                },
                line_linked: {
                    enable: true,
                    distance: 120,
                    color: '#FFD600',
                    opacity: 0.2,
                    width: 1
                },
                move: {
                    enable: true,
                    speed: 1,
                    direction: 'none',
                    random: true,
                    straight: false,
                    out_mode: 'out',
                    bounce: false,
                }
            },
            interactivity: {
                detect_on: 'canvas',
                events: {
                    onhover: { enable: true, mode: 'bubble' },
                    onclick: { enable: false },
                    resize: true
                },
                modes: {
                    bubble: { distance: 100, size: 5, duration: 2, opacity: 0.8, speed: 3 }
                }
            },
            retina_detect: true
        });
    }
});

// Mobile-specific optimizations
document.addEventListener('DOMContentLoaded', function() {
    // Optimize particles for mobile
    const isMobile = window.innerWidth < 768;
    
    // Apply simpler particle configurations on mobile
    if (isMobile) {
        // Reduced particle count for better performance
        const mobileParticleConfig = {
            particles: {
                number: { value: 30 },
                size: { value: 2 },
                line_linked: {
                    distance: 100,
                    opacity: 0.2
                }
            }
        };
        
        if (typeof particlesJS !== 'undefined') {
            if (document.getElementById('particles-js')) {
                particlesJS('particles-js', mobileParticleConfig);
            }
            
            if (document.getElementById('hero-particles-js')) {
                particlesJS('hero-particles-js', mobileParticleConfig);
            }
        }
        
        // Simplify neural network background on mobile
        const networkBgs = document.querySelectorAll('.network-bg canvas');
        networkBgs.forEach(canvas => {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.globalAlpha = 0.3; // Reduce opacity
            }
        });
    }
    
    // Handle touch interactions for project cards
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('touchstart', function() {
            this.querySelector('.project-overlay').style.opacity = '1';
        });
        
        card.addEventListener('touchend', function() {
            setTimeout(() => {
                this.querySelector('.project-overlay').style.opacity = '0';
            }, 1000);
        });
    });
    
    // Ensure navbar closes after clicking a link on mobile
    document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
        link.addEventListener('click', () => {
            const navbarCollapse = document.querySelector('.navbar-collapse');
            if (navbarCollapse.classList.contains('show')) {
                const bsCollapse = new bootstrap.Collapse(navbarCollapse);
                bsCollapse.toggle();
            }
        });
    });
});

// Add viewport height fix for mobile browsers
function setMobileViewportHeight() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}

window.addEventListener('resize', setMobileViewportHeight);
setMobileViewportHeight();

// Add animation for about section words
document.addEventListener('DOMContentLoaded', function() {
    // Animate about section words with random positions
    const words = document.querySelectorAll('.animated-word');
    const container = document.querySelector('.animated-word-cloud');
    
    if (container && words.length) {
        const containerWidth = container.offsetWidth;
        const containerHeight = container.offsetHeight;
        
        words.forEach(word => {
            // Random position within container boundaries with some padding
            const padding = 50;
            const randomX = Math.random() * (containerWidth - padding*2) + padding;
            const randomY = Math.random() * (containerHeight - padding*2) + padding;
            const randomZ = Math.random() * 100 - 50;
            const randomRotation = Math.random() * 20 - 10;
            
            word.style.left = `${randomX}px`;
            word.style.top = `${randomY}px`;
            word.style.transform = `translateZ(${randomZ}px) rotate(${randomRotation}deg)`;
        });
    }
    
    // Cycle through multiple quotes
    const quotes = [
        "Turning ideas into elegant digital solutions",
        "Code is poetry in the digital age",
        "Creating tomorrow's technology today",
        "Passionate about problem-solving through code",
        "Engineering solutions that matter"
    ];
    
    let quoteIndex = 0;
    const quoteElement = document.querySelector('.about-quote');
    
    if (quoteElement) {
        setInterval(() => {
            quoteElement.style.opacity = 0;
            setTimeout(() => {
                quoteElement.textContent = `"${quotes[quoteIndex]}"`;
                quoteElement.style.opacity = 1;
                quoteIndex = (quoteIndex + 1) % quotes.length;
            }, 4000);
        }, 8000);
    }
});

// Improved animation for about section words
document.addEventListener('DOMContentLoaded', function() {
    // No need for random positions now since we've predefined them in CSS
    
    // Cycle through multiple quotes with better timing
    const quotes = [
        "Turning ideas into elegant digital solutions",
        "Code is poetry in the digital age",
        "Creating tomorrow's technology today",
        "Passionate about problem-solving through code",
        "Engineering solutions that matter"
    ];
    
    let quoteIndex = 0;
    const quoteElement = document.querySelector('.about-quote');
    
    if (quoteElement) {
        // Show the first quote immediately
        quoteElement.textContent = `"${quotes[quoteIndex]}"`;
        quoteElement.style.opacity = 1;
        
        setInterval(() => {
            quoteElement.style.opacity = 0;
            
            setTimeout(() => {
                quoteIndex = (quoteIndex + 1) % quotes.length;
                quoteElement.textContent = `"${quotes[quoteIndex]}"`;
                quoteElement.style.opacity = 1;
            }, 1000); // Shorter fade time for better user experience
        }, 5000); // Shorter interval so users see more quotes
    }

    // Add 3D tilt effect to the about container
    const container = document.querySelector('.about-animation-container');
    if (container) {
        container.addEventListener('mousemove', (e) => {
            const rect = container.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const moveX = (x - centerX) / 20; // Subtle movement
            const moveY = (y - centerY) / 20;
            
            container.style.transform = `perspective(1000px) rotateX(${-moveY}deg) rotateY(${moveX}deg) scale(1.02)`;
        });
        
        container.addEventListener('mouseleave', () => {
            container.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
        });
    }
});

// Super creative interactive About section
document.addEventListener('DOMContentLoaded', function() {
    // Create cosmic background dots
    const cosmicBackground = document.getElementById('cosmic-background');
    if (cosmicBackground) {
        for (let i = 0; i < 100; i++) {
            const dot = document.createElement('div');
            dot.className = 'cosmic-dot';
            dot.style.top = `${Math.random() * 100}%`;
            dot.style.left = `${Math.random() * 100}%`;
            dot.style.animationDelay = `${Math.random() * 5}s`;
            cosmicBackground.appendChild(dot);
        }
    }

    // Create binary rain effect
    const binaryRain = document.getElementById('binary-rain');
    if (binaryRain) {
        const columnCount = Math.floor(binaryRain.offsetWidth / 20);
        for (let i = 0; i < columnCount; i++) {
            const column = document.createElement('div');
            column.className = 'binary-column';
            
            // Create random binary string
            let binaryString = '';
            const length = 15 + Math.floor(Math.random() * 20);
            for (let j = 0; j < length; j++) {
                binaryString += Math.round(Math.random());
            }
            
            column.textContent = binaryString;
            column.style.left = `${i * 20}px`;
            column.style.animationDuration = `${4 + Math.random() * 6}s`;
            column.style.animationDelay = `${Math.random() * 5}s`;
            binaryRain.appendChild(column);
        }
    }

    // Terminal Typing Animation with Command Cycling
    const terminalText = document.getElementById('terminal-text');
    if (terminalText) {
        const commands = [
            "npm start portfolio.js --mode=awesome",
            "git commit -m",
            "python -c 'import talent;",
            "./deploy_creativity.sh --force",
            "docker run -d --name "
        ];
        
        let commandIndex = 0;
        
        function cycleCommand() {
            terminalText.style.animation = 'none';
            terminalText.offsetHeight; // Force reflow
            
            // Set new command
            terminalText.textContent = commands[commandIndex];
            commandIndex = (commandIndex + 1) % commands.length;
            
            // Restart animation
            terminalText.style.animation = 'typing 3s steps(40) forwards';
            
            // Schedule next command
            setTimeout(cycleCommand, 4000);
        }
        
        // Start the cycle
        setTimeout(cycleCommand, 3000);
    }

    // Interactive 3D container effect
    const container = document.querySelector('.about-animation-container');
    if (container) {
        container.addEventListener('mousemove', (e) => {
            const rect = container.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            // Subtle tilt effect
            const tiltX = (y - centerY) / centerY * 5;
            const tiltY = (x - centerX) / centerX * -5;
            
            // Apply transform
            container.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.02)`;
            
            // Move binary columns slightly based on mouse
            const binaryColumns = document.querySelectorAll('.binary-column');
            binaryColumns.forEach(col => {
                col.style.transform = `translateX(${(x - centerX) / 20}px)`;
            });
            
            // Make code block follow mouse slightly
            const codeBlock = document.querySelector('.code-block-3d');
            if (codeBlock) {
                codeBlock.style.transform = `translate(-50%, -50%) rotateX(${15 + tiltX/2}deg) rotateY(${-10 + tiltY/2}deg)`;
            }
        });
        
        container.addEventListener('mouseleave', () => {
            container.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
            
            const binaryColumns = document.querySelectorAll('.binary-column');
            binaryColumns.forEach(col => {
                col.style.transform = 'translateX(0)';
            });
            
            const codeBlock = document.querySelector('.code-block-3d');
            if (codeBlock) {
                codeBlock.style.transform = 'translate(-50%, -50%) rotateX(15deg) rotateY(-10deg)';
            }
        });
        
        // Make skill orbs interactive
        const skillOrbs = document.querySelectorAll('.skill-orb');
        skillOrbs.forEach(orb => {
            orb.addEventListener('mouseenter', () => {
                orb.style.transform = 'scale(1.3) translateZ(20px)';
            });
            
            orb.addEventListener('mouseleave', () => {
                orb.style.transform = 'scale(1) translateZ(0)';
            });
        });
    }
});

// Super creative interactive About section with enhanced terminal
document.addEventListener('DOMContentLoaded', function() {
    // Create cosmic background dots
    const cosmicBackground = document.getElementById('cosmic-background');
    if (cosmicBackground) {
        for (let i = 0; i < 100; i++) {
            const dot = document.createElement('div');
            dot.className = 'cosmic-dot';
            dot.style.top = `${Math.random() * 100}%`;
            dot.style.left = `${Math.random() * 100}%`;
            dot.style.animationDelay = `${Math.random() * 5}s`;
            cosmicBackground.appendChild(dot);
        }
    }

    // Create binary rain effect with varied patterns
    const binaryRain = document.getElementById('binary-rain');
    if (binaryRain) {
        const columnCount = Math.floor(binaryRain.offsetWidth / 15);
        
        // More varied binary characters for a more interesting effect
        const binaryChars = ['0', '1', '0', '1', '+', '-', '|', '*'];
        
        for (let i = 0; i < columnCount; i++) {
            const column = document.createElement('div');
            column.className = 'binary-column';
            
            // Create random binary string
            let binaryString = '';
            const length = 10 + Math.floor(Math.random() * 25);
            for (let j = 0; j < length; j++) {
                binaryString += binaryChars[Math.floor(Math.random() * binaryChars.length)];
            }
            
            column.textContent = binaryString;
            column.style.left = `${i * 15}px`;
            column.style.animationDuration = `${4 + Math.random() * 8}s`;
            column.style.animationDelay = `${Math.random() * 5}s`;
            column.style.opacity = `${0.3 + Math.random() * 0.7}`;
            binaryRain.appendChild(column);
        }
    }

    // Enhanced Terminal Interface with multiple commands and outputs
    const terminalCommands = document.getElementById('terminal-commands');
    if (terminalCommands) {
        // Command sequence with responses and timing
        const commandSequence = [
            {
                prompt: '<span class="terminal-user">ganesan</span><span class="terminal-at">@</span><span class="terminal-machine">dev</span><span class="terminal-path">:~/projects$</span>',
                command: 'node --version',
                output: 'v16.14.2',
                outputType: 'normal',
                delay: 0
            },
            {
                prompt: '<span class="terminal-user">ganesan</span><span class="terminal-at">@</span><span class="terminal-machine">dev</span><span class="terminal-path">:~/projects$</span>',
                command: 'npm init creative-portfolio --yes',
                output: 'Creating portfolio project...\nInstalling dependencies...\n✓ Project setup complete!',
                outputType: 'success',
                delay: 3000
            },
            {
                prompt: '<span class="terminal-user">ganesan</span><span class="terminal-at">@</span><span class="terminal-machine">dev</span><span class="terminal-path">:~/projects$</span>',
                command: 'python -c "import skills; print(skills.level)"',
                output: "AdvancedDeveloper(expertise=['frontend', 'backend', 'cloud'])",
                outputType: 'highlight',
                delay: 6000
            },
            {
                prompt: '<span class="terminal-user">ganesan</span><span class="terminal-at">@</span><span class="terminal-machine">dev</span><span class="terminal-path">:~/projects$</span>',
                command: 'git commit -m "Always improving and innovating"',
                output: '[main 3ab5d71] Always improving and innovating\n4 files changed, 230 insertions(+)',
                outputType: 'normal',
                delay: 9000
            }
        ];
        
        // Clear any existing content
        terminalCommands.innerHTML = '';
        
        // Display each command in sequence
        commandSequence.forEach((cmdInfo, index) => {
            // Create command line
            const cmdLine = document.createElement('div');
            cmdLine.className = 'terminal-command-line';
            cmdLine.innerHTML = `${cmdInfo.prompt} <span class="terminal-text">${cmdInfo.command}</span>`;
            
            // Create output line
            const outputLines = cmdInfo.output.split('\n');
            const outputElements = outputLines.map(line => {
                const output = document.createElement('div');
                output.className = `terminal-output terminal-${cmdInfo.outputType}`;
                output.textContent = line;
                return output;
            });
            
            // Append with delay for realistic typing effect
            setTimeout(() => {
                terminalCommands.appendChild(cmdLine);
                cmdLine.classList.add('active');
                
                // Add output after command typing completes
                setTimeout(() => {
                    outputElements.forEach(output => {
                        terminalCommands.appendChild(output);
                        output.classList.add('active');
                    });
                }, 1000); // Delay after command before showing output
            }, cmdInfo.delay);
        });
    }

    // Interactive 3D container effect
    const container = document.querySelector('.about-animation-container');
    if (container) {
        container.addEventListener('mousemove', (e) => {
            const rect = container.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            // Subtle tilt effect
            const tiltX = (y - centerY) / centerY * 5;
            const tiltY = (x - centerX) / centerX * -5;
            
            // Apply transform
            container.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.02)`;
            
            // Move binary columns slightly based on mouse
            const binaryColumns = document.querySelectorAll('.binary-column');
            binaryColumns.forEach(col => {
                col.style.transform = `translateX(${(x - centerX) / 20}px)`;
            });
            
            // Make code block follow mouse slightly
            const codeBlock = document.querySelector('.code-block-3d');
            if (codeBlock) {
                codeBlock.style.transform = `translate(-50%, -50%) rotateX(${15 + tiltX/2}deg) rotateY(${-10 + tiltY/2}deg)`;
            }
            
            // Increase glow on holographic name when mouse is near
            const holoName = document.querySelector('.holographic-name');
            if (holoName) {
                const distToHolo = Math.hypot(x - centerX, y - (rect.height - 50));
                const glowIntensity = Math.max(0.5, 1 - (distToHolo / 200));
                holoName.style.textShadow = `0 0 ${15 * glowIntensity}px rgba(255, 214, 0, ${0.5 * glowIntensity + 0.5})`;
            }
        });
        
        container.addEventListener('mouseleave', () => {
            container.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
            
            const binaryColumns = document.querySelectorAll('.binary-column');
            binaryColumns.forEach(col => {
                col.style.transform = 'translateX(0)';
            });
            
            const codeBlock = document.querySelector('.code-block-3d');
            if (codeBlock) {
                codeBlock.style.transform = 'translate(-50%, -50%) rotateX(15deg) rotateY(-10deg)';
            }
            
            const holoName = document.querySelector('.holographic-name');
            if (holoName) {
                holoName.style.textShadow = '0 0 15px rgba(255, 214, 0, 0.5)';
            }
        });
        
        // Make skill orbs interactive with enhanced effects
        const skillOrbs = document.querySelectorAll('.skill-orb');
        skillOrbs.forEach(orb => {
            orb.addEventListener('mouseenter', () => {
                orb.style.transform = 'scale(1.5) translateZ(40px)';
                orb.style.boxShadow = '0 0 30px rgba(255, 214, 0, 0.9)';
                orb.querySelector('i').style.transform = 'rotate(360deg)';
            });
            
            orb.addEventListener('mouseleave', () => {
                orb.style.transform = 'scale(1) translateZ(0)';
                orb.style.boxShadow = '0 0 15px rgba(255, 214, 0, 0.6)';
                orb.querySelector('i').style.transform = 'rotate(0deg)';
            });
        });
    }
});

// Add dynamic particles to the hero section
document.addEventListener('DOMContentLoaded', function () {
    const heroSection = document.querySelector('.hero-section');
    const particleContainer = document.createElement('div');
    particleContainer.className = 'glowing-particles';
    heroSection.appendChild(particleContainer);

    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.top = `${Math.random() * 100}vh`;
        particle.style.left = `${Math.random() * 100}vw`;
        particle.style.animationDelay = `${Math.random() * 10}s`;
        particleContainer.appendChild(particle);
    }

    // Add stars to the starry background
    const starryBg = document.createElement('div');
    starryBg.className = 'starry-bg';
    heroSection.appendChild(starryBg);

    for (let i = 0; i < 100; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.top = `${Math.random() * 100}vh`;
        star.style.left = `${Math.random() * 100}vw`;
        star.style.animationDelay = `${Math.random() * 3}s`;
        starryBg.appendChild(star);
    }

    // Add a holographic wave
    const holographicWave = document.createElement('div');
    holographicWave.className = 'holographic-wave';
    heroSection.appendChild(holographicWave);

    // Add a glowing ring
    const glowingRing = document.createElement('div');
    glowingRing.className = 'glowing-ring';
    heroSection.appendChild(glowingRing);
});

// Neural Network Animation
document.addEventListener('DOMContentLoaded', function() {
    const heroNetwork = document.querySelector('.hero-network');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    heroNetwork.appendChild(canvas);

    let width, height, nodes = [], connections = [];
    const nodeCount = 50;
    const connectionDistance = 150;
    const nodeSpeed = 0.5;

    function initNetwork() {
        width = heroNetwork.offsetWidth;
        height = heroNetwork.offsetHeight;
        canvas.width = width;
        canvas.height = height;
        
        nodes = Array.from({ length: nodeCount }, () => ({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() * 2 - 1) * nodeSpeed,
            vy: (Math.random() * 2 - 1) * nodeSpeed
        }));
    }

    function drawNetwork() {
        ctx.clearRect(0, 0, width, height);
        
        nodes.forEach(node => {
            node.x += node.vx;
            node.y += node.vy;
            
            if(node.x < 0 || node.x > width) node.vx *= -1;
            if(node.y < 0 || node.y > height) node.vy *= -1;
            
            ctx.beginPath();
            ctx.arc(node.x, node.y, 2, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 214, 0, 0.6)';
            ctx.fill();
        });
        
        nodes.forEach((node, i) => {
            nodes.slice(i + 1).forEach(other => {
                const dx = other.x - node.x;
                const dy = other.y - node.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if(distance < connectionDistance) {
                    ctx.beginPath();
                    ctx.moveTo(node.x, node.y);
                    ctx.lineTo(other.x, other.y);
                    ctx.strokeStyle = `rgba(255, 214, 0, ${1 - distance/connectionDistance})`;
                    ctx.stroke();
                }
            });
        });
        
        requestAnimationFrame(drawNetwork);
    }

    initNetwork();
    drawNetwork();
    window.addEventListener('resize', initNetwork);

    // Interactive effect
    heroNetwork.addEventListener('mousemove', (e) => {
        const rect = heroNetwork.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        nodes.forEach(node => {
            const dx = mouseX - node.x;
            const dy = mouseY - node.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if(distance < 100) {
                const angle = Math.atan2(dy, dx);
                const force = (100 - distance) * 0.02;
                node.vx -= Math.cos(angle) * force;
                node.vy -= Math.sin(angle) * force;
            }
        });
    });
});

// Initialize sophisticated background effects
document.addEventListener('DOMContentLoaded', function() {
    // Create geometric shapes
    const geometricShapes = document.getElementById('geometricShapes');
    for (let i = 0; i < 15; i++) {
        const shape = document.createElement('div');
        shape.className = 'geometric-shape';
        
        // Random size between 100px and 300px
        const size = 100 + Math.random() * 200;
        shape.style.width = `${size}px`;
        shape.style.height = `${size}px`;
        
        // Random position
        shape.style.left = `${Math.random() * 100}%`;
        shape.style.top = `${Math.random() * 100}%`;
        
        // Random animation delay and duration
        shape.style.animationDelay = `${Math.random() * 20}s`;
        shape.style.animationDuration = `${30 + Math.random() * 30}s`;
        
        geometricShapes.appendChild(shape);
    }
    
    // Create gradient orbs
    const gradientOrbs = document.getElementById('gradientOrbs');
    for (let i = 0; i < 5; i++) {
        const orb = document.createElement('div');
        orb.className = 'gradient-orb';
        
        // Random size between 200px and 500px
        const size = 200 + Math.random() * 300;
        orb.style.width = `${size}px`;
        orb.style.height = `${size}px`;
        
        // Random position
        orb.style.left = `${Math.random() * 100}%`;
        orb.style.top = `${Math.random() * 100}%`;
        
        // Random animation delay
        orb.style.animationDelay = `${Math.random() * 10}s`;
        
        gradientOrbs.appendChild(orb);
    }
    
    // Create digital rain
    const digitalRain = document.getElementById('digitalRain');
    const characters = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
    
    for (let i = 0; i < 25; i++) {
        const column = document.createElement('div');
        column.className = 'rain-column';
        
        // Random position
        column.style.left = `${i * 4}%`;
        
        // Generate random characters
        let string = '';
        const length = 20 + Math.floor(Math.random() * 20);
        for (let j = 0; j < length; j++) {
            string += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        column.textContent = string;
        
        // Animation delay and duration
        column.style.animationDelay = `${Math.random() * 8}s`;
        column.style.animationDuration = `${5 + Math.random() * 5}s`;
        
        digitalRain.appendChild(column);
    }
    
    // Create constellation
    const constellation = document.getElementById('constellation');
    for (let i = 0; i < 100; i++) {
        const star = document.createElement('div');
        star.className = 'star-dot';
        
        // Random position
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        
        // Random animation delay
        star.style.animationDelay = `${Math.random() * 4}s`;
        
        constellation.appendChild(star);
    }
    
    // WebGL Canvas Background
    const canvas = document.getElementById('bgCanvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    
    if (gl) {
        // Setup canvas size
        const setCanvasSize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            gl.viewport(0, 0, canvas.width, canvas.height);
        };
        
        setCanvasSize();
        window.addEventListener('resize', setCanvasSize);
        
        // Vertex shader program
        const vsSource = `
            attribute vec4 aVertexPosition;
            varying vec2 vUV;
            
            void main() {
                gl_Position = aVertexPosition;
                vUV = aVertexPosition.xy * 0.5 + 0.5;
            }
        `;
        
        // Fragment shader program
        const fsSource = `
            precision highp float;
            varying vec2 vUV;
            uniform float uTime;
            
            void main() {
                vec2 uv = vUV;
                float time = uTime * 0.05;
                
                vec3 color = vec3(0.0);
                
                // Create multiple waves
                for (float i = 1.0; i <= 3.0; i++) {
                    float intensity = 1.0 / i;
                    float speed = time * (0.5 / i);
                    float scale = 20.0 * i;
                    
                    float wave = abs(sin(uv.x * scale + speed) + sin(uv.y * scale + speed));
                    
                    color += vec3(
                        wave * 0.3 * intensity, 
                        wave * 0.1 * intensity, 
                        wave * 0.5 * intensity
                    ) * 0.2;
                }
                
                gl_FragColor = vec4(color, 0.05);
            }
        `;
        
        // Create shader program
        function createShader(gl, type, source) {
            const shader = gl.createShader(type);
            gl.shaderSource(shader, source);
            gl.compileShader(shader);
            
            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                console.error('Shader compilation failed: ' + gl.getShaderInfoLog(shader));
                gl.deleteShader(shader);
                return null;
            }
            
            return shader;
        }
        
        const vertexShader = createShader(gl, gl.VERTEX_SHADER, vsSource);
        const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fsSource);
        
        const shaderProgram = gl.createProgram();
        gl.attachShader(shaderProgram, vertexShader);
        gl.attachShader(shaderProgram, fragmentShader);
        gl.linkProgram(shaderProgram);
        
        if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
            console.error('Shader program linking failed: ' + gl.getProgramInfoLog(shaderProgram));
            return;
        }
        
        // Positions for a square covering the entire canvas
        const positions = [
            -1.0, -1.0,
             1.0, -1.0,
            -1.0,  1.0,
             1.0,  1.0
        ];
        
        // Create buffer
        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
        
        // Shader program info
        const programInfo = {
            program: shaderProgram,
            attribLocations: {
                vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
            },
            uniformLocations: {
                time: gl.getUniformLocation(shaderProgram, 'uTime'),
            },
        };
        
        // Render loop
        let startTime = Date.now();
        
        function render() {
            const currentTime = Date.now();
            const elapsedTime = (currentTime - startTime) / 1000; // Time in seconds
            
            // Clear the canvas
            gl.clearColor(0.0, 0.0, 0.0, 0.0);
            gl.clear(gl.COLOR_BUFFER_BIT);
            
            // Set shader program
            gl.useProgram(programInfo.program);
            
            // Set position attribute
            gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
            gl.vertexAttribPointer(
                programInfo.attribLocations.vertexPosition,
                2, // 2 components per vertex (x, y)
                gl.FLOAT,
                false,
                0,
                0
            );
            gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
            
            // Set time uniform
            gl.uniform1f(programInfo.uniformLocations.time, elapsedTime);
            
            // Draw the square
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
            
            // Request next frame
            requestAnimationFrame(render);
        }
        
        // Start rendering
        render();
    } else {
        console.warn('WebGL not available, some effects will be disabled');
        canvas.style.display = 'none';
    }

    // Parallax effect for background elements
    document.addEventListener('mousemove', (e) => {
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;
        
        // Apply parallax effect to different layers with varying intensity
        document.querySelector('.nebula-bg').style.transform = 
            `translate(${x * -20}px, ${y * -20}px)`;
            
        document.querySelector('.neural-grid').style.transform = 
            `translate3d(${x * -10}px, ${y * -10}px, 0) rotateX(${y * 5}deg) rotateY(${-x * 5}deg)`;
            
        // Move constellation stars slightly
        document.querySelectorAll('.star-dot').forEach(star => {
            const speedFactor = parseFloat(star.getAttribute('data-speed') || Math.random() * 2);
            star.style.transform = `translate(${x * speedFactor * 20}px, ${y * speedFactor * 20}px)`;
        });
    });
});

// Add intro screen functionality
document.addEventListener('DOMContentLoaded', function() {
    const introScreen = document.querySelector('.intro-screen');
    const mainContent = document.querySelector('.main-content');
    const introCta = document.querySelector('.intro-cta');
    
    // Split text animation preparation
    const splitTextElements = document.querySelectorAll('.split-text span');
    splitTextElements.forEach((element, index) => {
        element.style.setProperty('--index', index + 1);
    });
    
    // Handle intro button click
    introCta.addEventListener('click', function() {
        introScreen.classList.add('fade-out');
        mainContent.classList.add('visible');
        
        // Initialize AOS and other animations after intro
        setTimeout(() => {
            if (typeof AOS !== 'undefined') {
                AOS.refresh();
            }
            // Trigger any animations that depend on the main content being visible
            const revealElements = document.querySelectorAll('.reveal-text');
            revealElements.forEach(el => {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            });
        }, 1000);
    });
    
    // Auto-advance intro after 10 seconds if no interaction
    const autoAdvanceTimeout = setTimeout(() => {
        introCta.click();
    }, 10000);
    
    // Clear timeout if button is clicked
    introCta.addEventListener('click', () => {
        clearTimeout(autoAdvanceTimeout);
    });
    
    // Interactive shine effect on headline
    const headline = document.querySelector('.intro-headline');
    introScreen.addEventListener('mousemove', (e) => {
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;
        
        headline.style.textShadow = `
            ${x * 10 - 5}px ${y * 10 - 5}px 15px rgba(255, 214, 0, 0.3),
            ${-x * 10 + 5}px ${-y * 10 + 5}px 15px rgba(255, 235, 59, 0.3)
        `;
    });

    // Fallback: if intro is hidden (e.g. after reload), show main content
    setTimeout(() => {
        if (window.getComputedStyle(introScreen).opacity === "0" || introScreen.style.display === "none") {
            mainContent.classList.add('visible');
        }
    }, 1200);
});

function scrollToContent() {
    const mainContent = document.querySelector('.main-content');
    mainContent.scrollIntoView({ behavior: 'smooth' });
}

// Remove the intro screen fade handling
document.addEventListener('DOMContentLoaded', function() {
    const introScreen = document.querySelector('.intro-screen');
    const mainContent = document.querySelector('.main-content');
    mainContent.style.display = 'block';
    // Remove any automatic fade-out of intro screen
});

// Modify the intro button click handler to show navbar
document.addEventListener('DOMContentLoaded', function() {
    const introScreen = document.querySelector('.intro-screen');
    const mainContent = document.querySelector('.main-content');
    const introCta = document.querySelector('.intro-cta');
    const navbar = document.getElementById('mainNavbar');
    
    // Function to show main content and navbar
    function showMainContent() {
        introScreen.classList.add('fade-out');
        mainContent.classList.add('visible');
        navbar.style.display = 'block'; // Show navbar
        
        // Initialize AOS and other animations after intro
        setTimeout(() => {
            if (typeof AOS !== 'undefined') {
                AOS.refresh();
            }
            // Trigger any animations that depend on the main content being visible
            const revealElements = document.querySelectorAll('.reveal-text');
            revealElements.forEach(el => {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            });
        }, 500);
    }
    
    // Handle intro button click
    if (introCta) {
        introCta.addEventListener('click', showMainContent);
    }
    
    // Auto-advance intro after 10 seconds if no interaction
    const autoAdvanceTimeout = setTimeout(showMainContent, 10000);
    
    // Clear timeout if button is clicked
    if (introCta) {
        introCta.addEventListener('click', () => {
            clearTimeout(autoAdvanceTimeout);
        });
    }
    
    // Function to start the site directly (skip intro)
    function scrollToContent() {
        showMainContent();
    }
    
    // Make the function globally available
    window.scrollToContent = scrollToContent;
});

// Function to show main content and make it globally available
function scrollToContent() {
    const introScreen = document.querySelector('.intro-screen');
    const mainContent = document.querySelector('.main-content');
    const navbar = document.getElementById('mainNavbar');
    
    // Hide intro screen
    if (introScreen) {
        introScreen.classList.add('fade-out');
    }
    
    // Show main content
    if (mainContent) {
        mainContent.classList.add('visible');
    }
    
    // Show navbar
    if (navbar) {
        navbar.style.display = 'block';
    }
    
    // Initialize AOS and other animations
    setTimeout(() => {
        if (typeof AOS !== 'undefined') {
            AOS.refresh();
        }
        
        // Trigger animations
        document.querySelectorAll('.reveal-text').forEach(el => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        });
    }, 500);
}

// Ensure the function is available globally
window.scrollToContent = scrollToContent;

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const introScreen = document.querySelector('.intro-screen');
    const introCta = document.querySelector('.intro-cta');
    
    // Explicitly bind click event to intro button
    if (introCta) {
        introCta.onclick = function(e) {
            e.preventDefault();
            scrollToContent();
        };
    }
    
    // Auto-advance intro after 10 seconds
    const autoAdvanceTimeout = setTimeout(scrollToContent, 10000);
    
    // Clear timeout if button is clicked
    if (introCta) {
        introCta.addEventListener('click', () => {
            clearTimeout(autoAdvanceTimeout);
        });
    }
    
    // ...existing code...
});

// Enhanced Intro CTA Button Effects
document.addEventListener('DOMContentLoaded', function() {
    const introCta = document.querySelector('.intro-cta');
    
    if (introCta) {
        // 1. Add gradient animated border
        introCta.style.position = 'relative';
        introCta.style.zIndex = '5';
        introCta.style.transition = 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
        
        const borderGlow = document.createElement('div');
        borderGlow.className = 'cta-border-glow';
        borderGlow.style.cssText = `
            position: absolute;
            inset: -3px;
            border-radius: 50px;
            z-index: -1;
            background: linear-gradient(45deg, #FFD600, #FFC107, #FFEB3B, #FFD600);
            background-size: 400% 400%;
            filter: blur(5px);
            opacity: 0;
            transition: opacity 0.4s ease;
            animation: ctaBorderFlow 3s linear infinite;
        `;
        introCta.insertAdjacentElement('afterend', borderGlow);
        
        // 2. Create pulse animation
        const pulseElement = document.createElement('div');
        pulseElement.className = 'cta-pulse';
        pulseElement.style.cssText = `
            position: absolute;
            inset: -3px;
            border-radius: 50px;
            z-index: -2;
            background: rgba(255, 214, 0, 0.5);
            transform: scale(1);
            opacity: 0;
        `;
        introCta.insertAdjacentElement('afterend', pulseElement);
        
        // 3. Add hover state effects
        introCta.addEventListener('mouseenter', function() {
            introCta.style.transform = 'translateY(-5px) scale(1.05)';
            introCta.style.boxShadow = '0 10px 25px rgba(255, 214, 0, 0.4)';
            borderGlow.style.opacity = '1';
            
            // Add particle sparkles on hover
            const numSparkles = 10;
            for (let i = 0; i < numSparkles; i++) {
                const sparkle = document.createElement('div');
                sparkle.className = 'cta-sparkle';
                sparkle.style.cssText = `
                    position: absolute;
                    width: 4px;
                    height: 4px;
                    border-radius: 50%;
                    background: white;
                    box-shadow: 0 0 10px #FFD600;
                    z-index: -1;
                    opacity: 0;
                    top: ${Math.random() * 100}%;
                    left: ${Math.random() * 100}%;
                `;
                introCta.appendChild(sparkle);
                
                // Animate the sparkle
                const delay = Math.random() * 0.5;
                setTimeout(() => {
                    sparkle.style.transition = 'all 0.6s ease';
                    sparkle.style.opacity = '1';
                    sparkle.style.transform = `translate(${(Math.random() - 0.5) * 50}px, ${(Math.random() - 0.5) * 50}px) scale(${Math.random() + 0.5})`;
                    
                    setTimeout(() => {
                        sparkle.style.opacity = '0';
                        setTimeout(() => sparkle.remove(), 600);
                    }, 400);
                }, delay * 1000);
            }
        });
        
        introCta.addEventListener('mouseleave', function() {
            introCta.style.transform = '';
            introCta.style.boxShadow = '';
            borderGlow.style.opacity = '0';
            
            // Remove any remaining sparkles
            document.querySelectorAll('.cta-sparkle').forEach(el => el.remove());
        });
        
        // 4. Add magnetic effect on hover
        introCta.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const maxMove = 10; // max pixels to move
            const moveX = (x - centerX) / centerX * maxMove;
            const moveY = (y - centerY) / centerY * maxMove;
            
            this.style.transform = `translate(${moveX}px, ${moveY - 5}px) scale(1.05)`;
        });
        
        // 5. Add click effects with particle explosion
        introCta.addEventListener('click', function(e) {
            // Pulse effect
            pulseElement.style.animation = 'ctaPulse 0.8s forwards';
            
            // Create particle explosion
            const particles = 20;
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            for (let i = 0; i < particles; i++) {
                const particle = document.createElement('div');
                const size = Math.random() * 3 + 2;
                const angle = Math.random() * Math.PI * 2;
                const velocity = Math.random() * 60 + 30;
                const hue = 50 + Math.random() * 60; // Yellow to orange hues
                
                particle.className = 'cta-explosion-particle';
                particle.style.cssText = `
                    position: absolute;
                    width: ${size}px;
                    height: ${size}px;
                    border-radius: 50%;
                    background: hsla(${hue}, 80%, 60%, 0.8);
                    box-shadow: 0 0 ${size * 2}px hsla(${hue}, 80%, 60%, 0.6);
                    top: ${y}px;
                    left: ${x}px;
                    z-index: 10;
                    pointer-events: none;
                `;
                document.body.appendChild(particle);
                
                // Animate particles
                const vx = Math.cos(angle) * velocity;
                const vy = Math.sin(angle) * velocity;
                const duration = Math.random() * 0.6 + 0.4;
                
                gsap.to(particle, {
                    x: vx * duration,
                    y: vy * duration,
                    opacity: 0,
                    scale: 0,
                    duration: duration,
                    ease: "power2.out",
                    onComplete: () => particle.remove()
                });
            }
            
            // Reset pulse animation
            setTimeout(() => {
                pulseElement.style.animation = '';
            }, 800);
        });
        
        // 6. Add subtle continuous glow animation when idle
        let glowIntensity = 0;
        let increasingGlow = true;
        
        function animateButtonGlow() {
            if (!introCta.matches(':hover')) {
                if (increasingGlow) {
                    glowIntensity += 0.01;
                    if (glowIntensity >= 1) increasingGlow = false;
                } else {
                    glowIntensity -= 0.01;
                    if (glowIntensity <= 0.2) increasingGlow = true;
                }
                
                introCta.style.boxShadow = `0 0 ${15 * glowIntensity}px rgba(255, 214, 0, ${0.3 * glowIntensity + 0.2})`;
            }
            requestAnimationFrame(animateButtonGlow);
        }
        
        animateButtonGlow();
        
        // Add the necessary CSS animations
        const styleElement = document.createElement('style');
        styleElement.textContent = `
            @keyframes ctaBorderFlow {
                0% { background-position: 0% 50%; }
                100% { background-position: 400% 50%; }
            }
            
            @keyframes ctaPulse {
                0% { opacity: 0.8; transform: scale(1); }
                100% { opacity: 0; transform: scale(2); }
            }
            
            .intro-cta {
                backface-visibility: hidden;
                transform-style: preserve-3d;
                perspective: 1000px;
            }
            
            .intro-cta::before {
                content: '';
                position: absolute;
                inset: 0;
                background: linear-gradient(45deg, var(--primary-color), #9c55ff);
                border-radius: 50px;
                transition: opacity 0.4s ease;
                opacity: 0;
                z-index: -1;
            }
            
            .intro-cta:hover::before {
                opacity: 1;
            }
        `;
        document.head.appendChild(styleElement);
    }
});

// Animate finance tracker SVG overlay and numbers
document.addEventListener('DOMContentLoaded', function () {
    // Animate pie chart
    setTimeout(() => {
        const pie = document.querySelector('.finance-pie');
        const pie2 = document.querySelector('.finance-pie2');
        if (pie) pie.style.strokeDashoffset = 188.4 * 0.35; // 65% filled
        if (pie2) pie2.style.strokeDashoffset = 138.2 * 0.75; // 25% filled
    }, 800);

    // Animate glowing line
    const glowLine = document.querySelector('.finance-glow-line');
    if (glowLine) {
        glowLine.style.strokeDasharray = "300";
        glowLine.style.strokeDashoffset = "300";
        setTimeout(() => {
            glowLine.style.transition = "stroke-dashoffset 1.5s cubic-bezier(.4,0,.2,1)";
            glowLine.style.strokeDashoffset = "0";
        }, 1200);
    }

    // Animate numbers
    function animateNumber(el, target, duration = 1200) {
        let start = 0;
        let startTime = null;
        function step(ts) {
            if (!startTime) startTime = ts;
            let progress = Math.min((ts - startTime) / duration, 1);
            let value = Math.floor(progress * target);
            el.textContent = "$" + value;
            if (progress < 1) requestAnimationFrame(step);
            else el.textContent = "$" + target;
        }
        requestAnimationFrame(step);
    }
    document.querySelectorAll('.finance-value').forEach(el => {
        const target = parseInt(el.getAttribute('data-target'), 10);
        animateNumber(el, target);
    });
});

// Unique animated sparkles for project card hover overlay
document.querySelectorAll('.project-card').forEach(card => {
    const overlay = card.querySelector('.project-hover-overlay');
    if (!overlay) return;

    // Helper to create sparkles
    function createSparkles() {
        // Remove old sparkles
        overlay.querySelectorAll('.sparkle').forEach(s => s.remove());
        // Add 6-10 sparkles at random positions
        for (let i = 0; i < 7 + Math.floor(Math.random() * 3); i++) {
            const sparkle = document.createElement('div');
            sparkle.className = 'sparkle';
            const size = 8 + Math.random() * 10;
            sparkle.style.width = `${size}px`;
            sparkle.style.height = `${size}px`;
            sparkle.style.left = `${Math.random() * 90 + 5}%`;
            sparkle.style.top = `${Math.random() * 80 + 10}%`;
            sparkle.style.animationDelay = `${Math.random() * 1.5}s`;
            overlay.appendChild(sparkle);
        }
    }

    card.addEventListener('mouseenter', createSparkles);
    card.addEventListener('mouseleave', () => {
        overlay.querySelectorAll('.sparkle').forEach(s => s.remove());
    });
});

// Add CSS for the new burst effect (inject if not present)
if (!document.getElementById('lim-burst-style')) {
    const style = document.createElement('style');
    style.id = 'lim-burst-style';
    style.textContent = `
        .lim-burst-layer {
            pointer-events: none;
            will-change: width, height, opacity, filter, transform;
        }
    `;
    document.head.appendChild(style);
}

// --- Performance Optimizations ---

// Throttle mousemove events for parallax and gradients
let lastMouseMove = 0;
document.addEventListener('mousemove', (e) => {
    const now = performance.now();
    if (now - lastMouseMove < 30) return;
    lastMouseMove = now;
    // ...existing code for mousemove...
});

// Throttle scroll event for navbar
let lastScroll = 0;
window.addEventListener('scroll', function() {
    const now = performance.now();
    if (now - lastScroll < 50) return;
    lastScroll = now;
    // ...existing code for navbar scroll...
});



// Reduce cosmic dots and binary rain columns
document.addEventListener('DOMContentLoaded', function() {
    const cosmicBackground = document.getElementById('cosmic-background');
    if (cosmicBackground) {
        for (let i = 0; i < 30; i++) { // was 100
            // ...existing code...
        }
    }
    const binaryRain = document.getElementById('binary-rain');
    if (binaryRain) {
        const columnCount = Math.floor(binaryRain.offsetWidth / 40); // was / 15
        for (let i = 0; i < columnCount; i++) {
            // ...existing code...
        }
    }
    // ...existing code...
});

// Reduce geometric shapes and gradient orbs
document.addEventListener('DOMContentLoaded', function() {
    const geometricShapes = document.getElementById('geometricShapes');
    for (let i = 0; i < 6; i++) { // was 15
        // ...existing code...
    }
    const gradientOrbs = document.getElementById('gradientOrbs');
    for (let i = 0; i < 2; i++) { // was 5
        // ...existing code...
    }
    // ...existing code...
});

// Remove heavy transform/translate on all sections on mousemove
// ...existing code...
// Remove this block entirely:
// document.addEventListener('mousemove', (e) => {
//     ...parallax effect for all sections...
// });

// Remove redundant transform reset on mouseleave for sections
// ...existing code...
// Remove this block entirely:
// document.addEventListener('mouseleave', () => {
//     ...reset transforms...
// });

// Remove or limit sparkle/particle overlays on project card hover
document.querySelectorAll('.project-card').forEach(card => {
    const overlay = card.querySelector('.project-hover-overlay');
    if (!overlay) return;

    function createSparkles() {
        overlay.querySelectorAll('.sparkle').forEach(s => s.remove());
        // Reduce to 3-4 sparkles
        for (let i = 0; i < 3 + Math.floor(Math.random() * 2); i++) {
            // ...existing code...
        }
    }
    // ...existing code...
});

// Remove excessive will-change on elements that animate rarely
// ...existing code...

// ...existing code...

// --- REMOVE CUSTOM CURSOR FUNCTIONALITY ---

// Remove custom cursor DOM elements if present
document.addEventListener('DOMContentLoaded', function() {
    const cursor = document.querySelector('.custom-cursor');
    const cursorDot = document.querySelector('.cursor-dot');
    if (cursor) cursor.remove();
    if (cursorDot) cursorDot.remove();
});

// Remove all event listeners and code related to .custom-cursor and .cursor-dot
// Remove or comment out the following blocks:

/*
// Enhanced Custom Cursor with auto-hide
const cursor = document.querySelector('.custom-cursor');
const cursorDot = document.querySelector('.cursor-dot');
let cursorTimeout;

// Hide cursors initially
cursor.style.opacity = '0';
cursorDot.style.opacity = '0';

document.addEventListener('mousemove', (e) => {
    // Show cursors
    cursor.style.opacity = '1';
    cursorDot.style.opacity = '1';
    
    // Update cursor positions
    cursor.style.transform = `translate(${e.clientX - 10}px, ${e.clientY - 10}px)`;
    cursorDot.style.transform = `translate(${e.clientX - 2}px, ${e.clientY - 2}px)`;
    
    // Clear existing timeout
    clearTimeout(cursorTimeout);
    
    // Set new timeout to hide cursors after 2 seconds of inactivity
    cursorTimeout = setTimeout(() => {
        cursor.style.opacity = '0';
        cursorDot.style.opacity = '0';
    }, 2000);
});

// Hide cursors when mouse leaves the window
document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
    cursorDot.style.opacity = '0';
});
*/

// Remove hover effect handlers that reference cursor
/*
const interactiveElements = document.querySelectorAll('a, button, .skill-item, .project-card');
interactiveElements.forEach(element => {
    element.addEventListener('mouseenter', () => {
        cursor.style.transform = 'scale(2)';
        cursor.style.border = '1px solid var(--primary-color)';
    });
    element.addEventListener('mouseleave', () => {
        cursor.style.transform = 'scale(1)';
        cursor.style.border = '2px solid var(--primary-color)';
    });
});
*/

// ...existing code...

// --- REMOVE PARALLAX AND MOUSEMOVE SECTION TRANSFORMS ---
// Remove the mousemove event that causes sections to move/shake
document.addEventListener('DOMContentLoaded', function() {
  // Clean up existing mousemove handlers that affect sections
  const oldMouseMove = document.onmousemove;
  document.onmousemove = function(e) {
    if (typeof oldMouseMove === 'function') {
      // Call original handler but prevent it from transforming sections
      const sections = document.querySelectorAll('section');
      const originalTransforms = [];
      
      // Save original transforms
      sections.forEach((section, i) => {
        originalTransforms[i] = section.style.transform;
        section.style.transform = 'none';
      });
      
      // Call original handler
      oldMouseMove(e);
      
      // Restore original transforms
      sections.forEach((section, i) => {
        section.style.transform = originalTransforms[i];
      });
    }
  };
  
  // Remove hero particles that cause performance issues
  const particleContainers = [
    '.glowing-particles',
    '.starry-bg',
    '.holographic-wave',
    '.glowing-ring'
  ];
  
  particleContainers.forEach(selector => {
    const container = document.querySelector(selector);
    if (container) container.remove();
  });
});

// Override the existing mousemove handlers with simplified versions
// This replaces the function that adds transforms to sections
document.addEventListener('mousemove', (e) => {
  const x = e.clientX / window.innerWidth;
  const y = e.clientY / window.innerHeight;
  
  // Only update CSS variables, don't transform sections
  document.body.style.setProperty('--mouse-x', x);
  document.body.style.setProperty('--mouse-y', y);
  
  // REMOVE section transforms that cause shaking
  // sections.forEach(section => {
  //   section.style.transform = `translate(${moveX}px, ${moveY}px)`;
  // });
});

// Remove the existing enhanced interactive effects that cause sections to move
// Override with an empty handler
document.removeEventListener('mousemove', function(e) {
  // This removes any handlers that were setting section transforms
});

// Clear any transforms on the window mouseleave event
document.addEventListener('mouseleave', () => {
  // Don't reset transforms - they're already disabled
});

// Disable the function that creates hero section particles
const originalCreateGalaxyEffect = window.createGalaxyEffect || function(){};
window.createGalaxyEffect = function() {
  // Do nothing - this disables galaxy particle creation
  console.log("Galaxy effect disabled for better performance");
};

// Disable the original hero particles creation
document.removeEventListener('DOMContentLoaded', function() {
  const heroSection = document.querySelector('.hero-section');
  const particleContainer = document.createElement('div');
  particleContainer.className = 'glowing-particles';
  // This is now disabled
});

// Simplify neural network animations for better performance
document.addEventListener('DOMContentLoaded', function() {
  const heroNetwork = document.querySelector('.hero-network');
  if (heroNetwork) {
    const canvas = heroNetwork.querySelector('canvas');
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Reduce number of nodes and connections
        const originalDrawNetwork = window.drawNetwork;
        window.drawNetwork = function() {
          // Simplify rendering
          ctx.globalAlpha = 0.3;
          // Use less CPU by reducing fps
          setTimeout(() => requestAnimationFrame(window.drawNetwork), 100);
        };
      }
    }
  }
});

// ...existing code...

// Initialize the enhanced skills section
document.addEventListener('DOMContentLoaded', function() {
  // Setup skill progress bars
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const progressBars = entry.target.querySelectorAll('.skill-progress');
        progressBars.forEach(bar => {
          const value = bar.getAttribute('data-value');
          setTimeout(() => {
            bar.style.width = `${value}%`;
          }, 300);
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  document.querySelectorAll('.skills-category').forEach(category => {
    observer.observe(category);
  });

  // Create scrolling tracks
  createScrollingTracks();

  // Create animated background shapes
  createSkillShapes();

  // Initialize skill statistics counter
  animateStatNumbers();
});

// Function to create infinite scrolling tracks
function createScrollingTracks() {
  const containers = document.querySelectorAll('.infinite-scroll-container');
  
  containers.forEach(container => {
    const track = container.querySelector('.scroll-track');
    
    // Clone the track content for seamless looping
    const clone = track.cloneNode(true);
    container.appendChild(clone);
    
    // Adjust animation duration based on content width
    const contentWidth = track.scrollWidth;
    const duration = contentWidth / 50; // Adjust speed here
    
    // Set animation duration dynamically
    track.style.animationDuration = `${duration}s`;
    clone.style.animationDuration = `${duration}s`;
    
    // Set animation direction for clone
    clone.style.animationDirection = 'reverse';
  });
}

// Function to create animated background shapes for skills section
function createSkillShapes() {
  const shapesContainer = document.querySelector('.skills-shapes');
  if (!shapesContainer) return;
  
  // Clear any existing shapes
  shapesContainer.innerHTML = '';
  
  // Create multiple shapes with different sizes and positions
  for (let i = 0; i < 15; i++) {
    const shape = document.createElement('div');
    shape.className = 'skill-shape';
    
    // Random size between 50px and 200px
    const size = 50 + Math.random() * 150;
    shape.style.width = `${size}px`;
    shape.style.height = `${size}px`;
    
    // Random position
    shape.style.left = `${Math.random() * 100}%`;
    shape.style.top = `${Math.random() * 100}%`;
    
    // Random animation properties
    shape.style.animationDelay = `${Math.random() * 5}s`;
    shape.style.animationDuration = `${10 + Math.random() * 10}s`;
    
    // Random opacity
    shape.style.opacity = 0.1 + Math.random() * 0.3;
    
    // Add to container
    shapesContainer.appendChild(shape);
  }
}

// Function to animate statistic numbers
function animateStatNumbers() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const numberElements = entry.target.querySelectorAll('.stats-number');
        
        numberElements.forEach(el => {
          const target = parseInt(el.getAttribute('data-value'), 10);
          const duration = 2000; // 2 seconds
          const start = 0;
          const startTime = performance.now();
          
          const animateCount = (timestamp) => {
            const runTime = timestamp - startTime;
            const progress = Math.min(runTime / duration, 1);
            
            // Easing function - easeOutExpo
            const easeProgress = 1 - Math.pow(2, -10 * progress);
            const currentCount = Math.floor(start + (target - start) * easeProgress);
            
            el.textContent = currentCount;
            
            if (progress < 1) {
              requestAnimationFrame(animateCount);
            } else {
              el.textContent = target;
            }
          };
          
          requestAnimationFrame(animateCount);
        });
        
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  const statsSection = document.querySelector('.skills-stats');
  if (statsSection) {
    observer.observe(statsSection);
  }
}

// Update existing mousemove event to add cursor interaction with skill cards
document.addEventListener('mousemove', function(e) {
  // ...existing code...
  
  // Add 3D tilt effect to skill cards
  const skillCards = document.querySelectorAll('.skill-card');
  skillCards.forEach(card => {
    const rect = card.getBoundingClientRect();
    
    // Check if mouse is near the card
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    
    if (
      mouseX > rect.left - 100 && 
      mouseX < rect.right + 100 && 
      mouseY > rect.top - 100 && 
      mouseY < rect.bottom + 100
    ) {
      // Calculate distance from center
      const cardX = rect.left + rect.width / 2;
      const cardY = rect.top + rect.height / 2;
      
      const distX = mouseX - cardX;
      const distY = mouseY - cardY;
      
      // Scale the tilt effect based on distance
      const tiltX = distY / 10;
      const tiltY = -distX / 10;
      
      card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-10px)`;
    } else {
      card.style.transform = '';
    }
  });
});

// ...existing code...

// Initialize the enhanced contact section
document.addEventListener('DOMContentLoaded', function() {
  // Create animated background elements for contact section
  createContactEffects();
  
  // Add 3D tilt effect to contact card
  addContactCardTilt();
  
  // Animate form labels for better UX
  initFormLabels();
  
  // Create interactive particles
  createContactParticles();
  
  // Initialize magnetic social icons
  initMagneticSocial();
});

// Function to create contact section background effects
function createContactEffects() {
  const contactSection = document.getElementById('contact');
  if (!contactSection) return;
  
  // Create background grid
  const gridElement = document.createElement('div');
  gridElement.className = 'contact-grid';
  contactSection.appendChild(gridElement);
  
  // Create animated lines
  for (let i = 0; i < 3; i++) {
    const lineElement = document.createElement('div');
    lineElement.className = 'contact-line';
    lineElement.style.animationDelay = `${i * 2.5}s`;
    contactSection.appendChild(lineElement);
  }
  
  // Create floating message bubbles
  for (let i = 1; i <= 3; i++) {
    const messageElement = document.createElement('div');
    messageElement.className = `floating-message msg${i}`;
    contactSection.appendChild(messageElement);
  }
  
  // Add contact background
  const bgElement = document.createElement('div');
  bgElement.className = 'contact-bg';
  contactSection.prepend(bgElement);
  
  // Add parallax effect to grid
  contactSection.addEventListener('mousemove', function(e) {
    const rect = contactSection.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    
    gridElement.style.transform = `perspective(1000px) rotateX(${60 + y * 5}deg) rotateY(${-5 + x * 10}deg) scale(1.5)`;
  });
}

// Function to add 3D tilt effect to contact card
function addContactCardTilt() {
  const contactCards = document.querySelectorAll('.contact-card');
  contactCards.forEach(card => {
    card.addEventListener('mousemove', function(e) {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const angleX = (y - centerY) / 20;
      const angleY = (centerX - x) / 20;
      
      this.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg) translateZ(10px)`;
      
      // Dynamic shadow based on mouse position
      const shadowX = (x - centerX) / 10;
      const shadowY = (y - centerY) / 10;
      this.style.boxShadow = `${shadowX}px ${shadowY}px 30px rgba(0, 0, 0, 0.2), 0 0 20px rgba(201, 161, 74, 0.2)`;
    });
    
    card.addEventListener('mouseleave', function() {
      this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
      this.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.2)';
    });
  });
}

// Function to initialize form labels
function initFormLabels() {
  const formControls = document.querySelectorAll('.contact-form .form-control');
  formControls.forEach(control => {
    // Create floating label
    const label = document.createElement('label');
    label.className = 'form-label';
    label.textContent = control.getAttribute('placeholder');
    control.parentNode.insertBefore(label, control.nextSibling);
    
    // Set up event listeners
    control.addEventListener('focus', function() {
      label.classList.add('active');
    });
    
    control.addEventListener('blur', function() {
      if (!this.value) {
        label.classList.remove('active');
      }
    });
    
    // Check if input already has a value
    if (control.value) {
      label.classList.add('active');
    }
  });
}

// Function to create contact particles
function createContactParticles() {
  const contactSection = document.getElementById('contact');
  if (!contactSection) return;
  
  // Create particle container
  const particlesContainer = document.createElement('div');
  particlesContainer.className = 'contact-particles';
  contactSection.appendChild(particlesContainer);
  
  // Create particles
  for (let i = 0; i < 20; i++) {
    const particle = document.createElement('div');
    particle.className = 'contact-particle';
    
    // Random position, size and animation properties
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.top = `${Math.random() * 100}%`;
    particle.style.width = `${2 + Math.random() * 5}px`;
    particle.style.height = particle.style.width;
    particle.style.opacity = `${0.1 + Math.random() * 0.5}`;
    particle.style.animationDuration = `${10 + Math.random() * 20}s`;
    particle.style.animationDelay = `${Math.random() * 10}s`;
    
    particlesContainer.appendChild(particle);
  }
  
  // Create particles on mouse move
  contactSection.addEventListener('mousemove', function(e) {
    if (Math.random() > 0.9) { // Only create particles 10% of the time
      const particle = document.createElement('div');
      particle.className = 'contact-particle';
      
      // Position at mouse pointer
      const rect = contactSection.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      particle.style.left = `${x}px`;
      particle.style.top = `${y}px`;
      particle.style.width = `${2 + Math.random() * 3}px`;
      particle.style.height = particle.style.width;
      particle.style.opacity = '0.5';
      particle.style.transform = 'scale(0)';
      
      particlesContainer.appendChild(particle);
      
      // Animate and remove particle
      gsap.timeline()
        .to(particle, {
          duration: 0.2,
          scale: 1,
          ease: "power2.out"
        })
        .to(particle, {
          duration: 2,
          y: -100 - Math.random() * 100,
          x: (Math.random() - 0.5) * 100,
          opacity: 0,
          ease: "power1.out",
          onComplete: () => particle.remove()
        });
    }
  });
}

// Function to initialize magnetic social icons
function initMagneticSocial() {
  const socialIcons = document.querySelectorAll('.social-icon');
  
  socialIcons.forEach(icon => {
    icon.addEventListener('mousemove', function(e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const distance = Math.sqrt(
        Math.pow(x - centerX, 2) + 
        Math.pow(y - centerY, 2)
      );
      
      // Only apply magnetic effect when mouse is close to center
      if (distance < rect.width) {
        const moveX = (x - centerX) * 0.3;
        const moveY = (y - centerY) * 0.3;
        
        gsap.to(this, {
          x: moveX,
          y: moveY,
          duration: 0.3,
          ease: "power2.out"
        });
        
        // Scale icon based on proximity to center
        const scale = 1 + (1 - distance / rect.width) * 0.2;
        gsap.to(this.querySelector('i'), {
          scale: scale,
          duration: 0.3,
          ease: "power2.out"
        });
      }
    });
    
    icon.addEventListener('mouseleave', function() {
      gsap.to(this, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: "elastic.out(1, 0.3)"
      });
      
      gsap.to(this.querySelector('i'), {
        scale: 1,
        duration: 0.5,
        ease: "elastic.out(1, 0.3)"
      });
    });
  });
}

// Enhance the form submission with animation
document.addEventListener('DOMContentLoaded', function() {
  const contactForm = document.querySelector('.contact-form');
  if (!contactForm) return;
  
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get the submit button
    const submitBtn = this.querySelector('.btn-submit');
    if (!submitBtn) return;
    
    // Store the original text
    const originalText = submitBtn.innerHTML;
    
    // Change button text and disable
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i> Sending...';
    submitBtn.disabled = true;
    
    // Create success animation elements
    const formElements = contactForm.querySelectorAll('.form-control');
    
    // Simulate form submission with delay
    setTimeout(() => {
      // Success animation
      gsap.to(formElements, {
        y: -20,
        opacity: 0,
        stagger: 0.1,
        duration: 0.5,
        ease: "power2.inOut"
      });
      
      // Change button to success state
      submitBtn.innerHTML = '<i class="fas fa-check me-2"></i> Message Sent!';
      submitBtn.classList.add('success');
      
      // Create success particles
      createSuccessParticles(submitBtn);
      
      // Reset form after animation completes
      setTimeout(() => {
        contactForm.reset();
        
        gsap.to(formElements, {
          y: 0,
          opacity: 1,
          stagger: 0.1,
          duration: 0.5,
          ease: "power2.out",
          delay: 0.5
        });
        
        // Reset button after delay
        setTimeout(() => {
          submitBtn.innerHTML = originalText;
          submitBtn.disabled = false;
          submitBtn.classList.remove('success');
        }, 3000);
      }, 1500);
    }, 2000);
  });
});

// Function to create success particles
function createSuccessParticles(button) {
  const rect = button.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  
  // Create particle container if it doesn't exist
  let particleContainer = document.getElementById('success-particles');
  if (!particleContainer) {
    particleContainer = document.createElement('div');
    particleContainer.id = 'success-particles';
    particleContainer.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 9999;
    `;
    document.body.appendChild(particleContainer);
  }
  
  // Create multiple particles
  for (let i = 0; i < 40; i++) {
    const particle = document.createElement('div');
    particle.style.cssText = `
      position: absolute;
      left: ${centerX}px;
      top: ${centerY}px;
      width: ${3 + Math.random() * 5}px;
      height: ${3 + Math.random() * 5}px;
      background: ${Math.random() > 0.5 ? '#C9A14A' : '#f5e7b2'};
      border-radius: 50%;
      pointer-events: none;
      opacity: ${0.6 + Math.random() * 0.4};
    `;
    particleContainer.appendChild(particle);
    
    // Random direction and speed
    const angle = Math.random() * Math.PI * 2;
    const speed = 10 + Math.random() * 30;
    const vx = Math.cos(angle) * speed;
    const vy = Math.sin(angle) * speed;
    const rotation = Math.random() * 360;
    
    // Animate with GSAP
    gsap.to(particle, {
      x: vx,
      y: vy,
      opacity: 0,
      rotation: rotation,
      duration: 1 + Math.random(),
      ease: "power2.out",
      onComplete: () => particle.remove()
    });
  }
}

// ...existing code...

// Initialize contact section animations
document.addEventListener('DOMContentLoaded', function() {
  // Create animated wave background
  createWaveBackground();
  
  // Initialize animated dots
  createAnimatedDots();
  
  // Handle form interactions
  initializeContactForm();
});

// Create the wave background animation
function createWaveBackground() {
  const contactSection = document.getElementById('contact');
  if (!contactSection) return;
  
  const waveBg = document.createElement('div');
  waveBg.className = 'wave-bg';
  
  // Create three waves for layered effect
  for (let i = 0; i < 3; i++) {
    const wave = document.createElement('div');
    wave.className = 'wave';
    waveBg.appendChild(wave);
  }
  
  contactSection.querySelector('.contact-container').appendChild(waveBg);
}

// Create animated dots in the background
function createAnimatedDots() {
  const contactSection = document.getElementById('contact');
  if (!contactSection) return;
  
  const dotsContainer = document.createElement('div');
  dotsContainer.className = 'animated-dots';
  
  // Create dots with random positions, sizes and animations
  for (let i = 0; i < 20; i++) {
    const dot = document.createElement('div');
    dot.className = 'dot';
    
    // Random size between 3-10px
    const size = 3 + Math.random() * 7;
    dot.style.width = `${size}px`;
    dot.style.height = `${size}px`;
    
    // Random position
    dot.style.left = `${Math.random() * 100}%`;
    dot.style.top = `${Math.random() * 100}%`;
    
    // Random animation
    const duration = 15 + Math.random() * 25;
    const xMovement = 10 + Math.random() * 30;
    const yMovement = 10 + Math.random() * 30;
    const delay = Math.random() * 5;
    
    // Create keyframe animation
    dot.animate([
      { transform: 'translate(0, 0)', opacity: 0.1 },
      { transform: `translate(${xMovement}px, ${-yMovement}px)`, opacity: 0.3 },
      { transform: `translate(${xMovement * 2}px, 0)`, opacity: 0.1 },
      { transform: `translate(${xMovement}px, ${yMovement}px)`, opacity: 0.3 },
      { transform: 'translate(0, 0)', opacity: 0.1 }
    ], {
      duration: duration * 1000,
      delay: delay * 1000,
      iterations: Infinity,
      easing: 'ease-in-out'
    });
    
    dotsContainer.appendChild(dot);
  }
  
  contactSection.querySelector('.contact-container').appendChild(dotsContainer);
}

// Initialize contact form with animations and validation
function initializeContactForm() {
  const form = document.querySelector('.contact-form');
  if (!form) return;
  
  // Handle floating labels
  const formControls = form.querySelectorAll('.form-control');
  formControls.forEach(input => {
    // Create label if not exists
    if (!input.nextElementSibling || !input.nextElementSibling.tagName === 'LABEL') {
      const label = document.createElement('label');
      label.textContent = input.getAttribute('placeholder');
      input.insertAdjacentElement('afterend', label);
      
      // Clear placeholder to avoid double text
      input.setAttribute('placeholder', ' ');
    }
    
    // Handle focus and blur events
    input.addEventListener('focus', function() {
      this.nextElementSibling.classList.add('active');
    });
    
    input.addEventListener('blur', function() {
      if (!this.value) {
        this.nextElementSibling.classList.remove('active');
      }
    });
    
    // Check initial state
    if (input.value) {
      input.nextElementSibling.classList.add('active');
    }
  });
  
  // Handle form submission
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Simple validation
    let isValid = true;
    const requiredInputs = form.querySelectorAll('[required]');
    
    requiredInputs.forEach(input => {
      if (!input.value.trim()) {
        isValid = false;
        input.classList.add('is-invalid');
        // Shake animation for invalid fields
        input.animate([
          { transform: 'translateX(0)' },
          { transform: 'translateX(-5px)' },
          { transform: 'translateX(5px)' },
          { transform: 'translateX(-5px)' },
          { transform: 'translateX(0)' }
        ], {
          duration: 300,
          easing: 'ease-in-out'
        });
      } else {
        input.classList.remove('is-invalid');
      }
    });
    
    if (!isValid) return;
    
    // If valid, show success animation
    const submitBtn = form.querySelector('.btn-submit');
    const originalText = submitBtn.innerHTML;
    
    // Change button text and disable
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i> Sending...';
    submitBtn.disabled = true;
    
    // Simulate form submission (would be replaced with actual AJAX call)
    setTimeout(() => {
      // Find or create success message
      let successMessage = form.querySelector('.success-message');
      
      if (!successMessage) {
        successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.innerHTML = `
          <div class="success-icon">
            <i class="fas fa-check"></i>
          </div>
          <h3>Message Sent!</h3>
          <p>Thank you for reaching out. I'll get back to you as soon as possible.</p>
        `;
        form.closest('.contact-card').appendChild(successMessage);
      }
      
      // Show success message
      successMessage.classList.add('active');
      
      // Reset button and form after delay
      setTimeout(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        // Hide success message with fade out
        successMessage.style.opacity = '0';
        
        setTimeout(() => {
          successMessage.classList.remove('active');
          form.reset();
          
          // Reset labels
          formControls.forEach(input => {
            input.nextElementSibling.classList.remove('active');
          });
        }, 500);
      }, 3000);
    }, 1500);
  });
  
  // Add ripple effect to submit button
  const submitBtn = form.querySelector('.btn-submit');
  if (submitBtn) {
    submitBtn.addEventListener('click', function(e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const ripple = document.createElement('span');
      ripple.className = 'ripple';
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      
      this.appendChild(ripple);
      
      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  }
  
  // Add subtle hover animation to contact info items
  const contactInfoItems = document.querySelectorAll('.contact-info-item');
  contactInfoItems.forEach(item => {
    item.addEventListener('mouseenter', function() {
      const icon = this.querySelector('i');
      
      icon.animate([
        { transform: 'scale(1) rotate(0)' },
        { transform: 'scale(1.2) rotate(10deg)' },
        { transform: 'scale(1.1) rotate(5deg)' }
      ], {
        duration: 500,
        easing: 'ease-out',
        fill: 'forwards'
      });
    });
    
    item.addEventListener('mouseleave', function() {
      const icon = this.querySelector('i');
      
      icon.animate([
        { transform: 'scale(1.1) rotate(5deg)' },
        { transform: 'scale(1) rotate(0)' }
      ], {
        duration: 300,
        easing: 'ease-out',
        fill: 'forwards'
      });
    });
  });
}

// ...existing code...

// Interactive Signature Animation
document.addEventListener('DOMContentLoaded', function() {
  const canvas = document.getElementById('signatureCanvas');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  const container = document.querySelector('.signature-container');
  const replayButton = document.getElementById('replaySignature');
  const signatureCta = document.querySelector('.signature-cta');
  const lightEffect = document.querySelector('.signature-light-effect');
  
  // Add signature wave background
  const waveEl = document.createElement('div');
  waveEl.className = 'signature-wave';
  container.appendChild(waveEl);
  
  // Create drawing point element
  const drawingPoint = document.createElement('div');
  drawingPoint.className = 'drawing-point';
  container.appendChild(drawingPoint);
  
  // Set canvas dimensions and styles
  ctx.lineWidth = 2;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  
  // Define your signature path - array of coordinate points forming the signature
  // This would be your stylized "Ganesan PV" signature in points
  const signaturePath = defineSignaturePath();
  
  // Signature state
  let isAnimating = false;
  let particleInterval;
  let currentPointIndex = 0;
  let previousX = 0;
  let previousY = 0;
  let lastTimestamp = 0;
  
  // Initialize animation
  initSignatureAnimation();
  
  // Replay button
  replayButton.addEventListener('click', function() {
    if (!isAnimating) {
      resetSignature();
      setTimeout(() => {
        startSignatureAnimation();
      }, 500);
    }
  });
  
  // Functions
  function initSignatureAnimation() {
    resetSignature();
    setTimeout(() => {
      startSignatureAnimation();
    }, 1000);
  }
  
  function startSignatureAnimation() {
    if (isAnimating) return;
    isAnimating = true;
    
    // Hide UI elements
    replayButton.classList.remove('visible');
    signatureCta.classList.remove('visible');
    
    // Reset drawing point and start animation
    drawingPoint.style.left = `${signaturePath[0].x}px`;
    drawingPoint.style.top = `${signaturePath[0].y}px`;
    drawingPoint.classList.add('active');
    
    // Start animation
    currentPointIndex = 0;
    previousX = signaturePath[0].x;
    previousY = signaturePath[0].y;
    
    // Set up ink particles
    startParticleEffect();
    
    // Start animated drawing
    requestAnimationFrame(drawNextSegment);
  }
  
  function drawNextSegment(timestamp) {
    if (!isAnimating) return;
    
    // Calculate time-based speed
    const elapsed = timestamp - lastTimestamp;
    const speed = elapsed * 0.2; // Adjust for speed
    
    // If we're at the end of the path
    if (currentPointIndex >= signaturePath.length - 1) {
      finishSignature();
      return;
    }
    
    // Move to next point with easing
    currentPointIndex++;
    const point = signaturePath[currentPointIndex];
    
    // Draw line segment
    ctx.beginPath();
    ctx.strokeStyle = getGoldenGradient(previousX, previousY, point.x, point.y);
    ctx.moveTo(previousX, previousY);
    ctx.lineTo(point.x, point.y);
    ctx.stroke();
    
    // Move the drawing point
    drawingPoint.style.left = `${point.x}px`;
    drawingPoint.style.top = `${point.y}px`;
    
    // Handle pen lifting if needed (for multi-part signatures)
    if (point.penUp) {
      previousX = point.x;
      previousY = point.y;
      requestAnimationFrame(drawNextSegment);
      return;
    }
    
    // Update previous position
    previousX = point.x;
    previousY = point.y;
    
    // Add ink splatter occasionally
    if (Math.random() < 0.1) {
      createInkSplatter(point.x, point.y);
    }
    
    // Continue animation
    lastTimestamp = timestamp;
    requestAnimationFrame(drawNextSegment);
  }
  
  function finishSignature() {
    isAnimating = false;
    
    // Add finishing touches
    addFinishingFlourish();
    
    // Show light effect
    lightEffect.classList.add('active');
    
    // Hide drawing point
    drawingPoint.classList.remove('active');
    
    // Stop particle effect
    clearInterval(particleInterval);
    
    // Show UI elements
    setTimeout(() => {
      replayButton.classList.add('visible');
      signatureCta.classList.add('visible');
    }, 1000);
  }
  
  function resetSignature() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Reset state
    isAnimating = false;
    currentPointIndex = 0;
    
    // Hide UI elements
    replayButton.classList.remove('visible');
    signatureCta.classList.remove('visible');
    drawingPoint.classList.remove('active');
    lightEffect.classList.remove('active');
    
    // Remove any existing particles
    clearInterval(particleInterval);
    document.querySelectorAll('.ink-particle, .ink-splatter, .signature-flourish').forEach(el => {
      el.remove();
    });
  }
  
  function getGoldenGradient(x1, y1, x2, y2) {
    const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
    gradient.addColorStop(0, 'rgba(201, 161, 74, 0.8)');
    gradient.addColorStop(0.5, 'rgba(255, 215, 0, 0.9)');
    gradient.addColorStop(1, 'rgba(201, 161, 74, 0.8)');
    return gradient;
  }
  
  function startParticleEffect() {
    clearInterval(particleInterval);
    
    particleInterval = setInterval(() => {
      if (!isAnimating) return;
      
      // Create a particle at the current drawing point
      const particle = document.createElement('div');
      particle.className = 'ink-particle';
      particle.style.left = drawingPoint.style.left;
      particle.style.top = drawingPoint.style.top;
      
      // Add to container
      document.querySelector('.signature-particles').appendChild(particle);
      
      // Animate particle
      const angle = Math.random() * Math.PI * 2;
      const distance = 20 + Math.random() * 30;
      const duration = 1000 + Math.random() * 1000;
      
      // Use GSAP for smooth animation
      gsap.to(particle, {
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance,
        opacity: 0,
        duration: duration / 1000,
        ease: "power2.out",
        onComplete: () => particle.remove()
      });
    }, 100);
  }
  
  function createInkSplatter(x, y) {
    const splatter = document.createElement('div');
    splatter.className = 'ink-splatter';
    
    // Random size between 10px and 30px
    const size = 10 + Math.random() * 20;
    splatter.style.width = `${size}px`;
    splatter.style.height = `${size}px`;
    
    // Position
    splatter.style.left = `${x - size/2}px`;
    splatter.style.top = `${y - size/2}px`;
    
    // Add to container
    container.appendChild(splatter);
    
    // Animate
    gsap.to(splatter, {
      opacity: 0.7,
      duration: 0.2,
      ease: "power1.out",
      onComplete: () => {
        gsap.to(splatter, {
          opacity: 0,
          duration: 0.8,
          delay: 0.5,
          ease: "power2.in",
          onComplete: () => splatter.remove()
        });
      }
    });
  }
  
  function addFinishingFlourish() {
    // Add a decorative line under the signature
    const flourish = document.createElement('div');
    flourish.className = 'signature-flourish';
    
    // Position under the signature
    flourish.style.left = `${canvas.width * 0.2}px`;
    flourish.style.top = `${canvas.height * 0.8}px`;
    flourish.style.width = `${canvas.width * 0.6}px`;
    
    // Add to container
    container.appendChild(flourish);
    
    // Animate
    setTimeout(() => {
      flourish.classList.add('active');
    }, 200);
    
    // Final glowing effect
    setTimeout(() => {
      // Create a glow effect that follows the signature path
      const glow = document.createElement('div');
      glow.className = 'signature-glow';
      glow.style.width = '100px';
      glow.style.height = '100px';
      glow.style.left = `${signaturePath[0].x - 50}px`;
      glow.style.top = `${signaturePath[0].y - 50}px`;
      container.appendChild(glow);
      
      // Animate glow along the path
      let pathIndex = 0;
      const pathLength = signaturePath.length;
      const glowInterval = setInterval(() => {
        pathIndex += 5; // Skip points for speed
        if (pathIndex >= pathLength) {
          clearInterval(glowInterval);
          
          // Final fade out
          gsap.to(glow, {
            opacity: 0,
            duration: 1,
            ease: "power2.out",
            onComplete: () => glow.remove()
          });
          return;
        }
        
        const point = signaturePath[pathIndex];
        gsap.to(glow, {
          left: `${point.x - 50}px`,
          top: `${point.y - 50}px`,
          opacity: 0.8,
          duration: 0.1,
          ease: "none"
        });
      }, 20);
    }, 500);
  }
  
  // Function to define the path of your signature
  function defineSignaturePath() {
    // This creates a stylized "Ganesan P V" signature
    // You can customize these points to match your actual signature
    const path = [];
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const scale = 0.9; // Scale the signature to fit the canvas
    
    // "G" letter
    for (let i = 0; i < 20; i++) {
      const angle = Math.PI * 1.5 - (i / 19) * Math.PI * 1.2;
      const x = centerX - 150 * scale + Math.cos(angle) * 30 * scale;
      const y = centerY - 30 * scale + Math.sin(angle) * 30 * scale;
      path.push({ x, y });
    }
    
    // Add a horizontal line for the G
    for (let i = 0; i < 10; i++) {
      const x = centerX - 150 * scale + (i / 9) * 30 * scale;
      const y = centerY - 30 * scale;
      path.push({ x, y });
    }
    
    // Lift pen to move to "a"
    path.push({ x: centerX - 100 * scale, y: centerY, penUp: true });
    
    // "a" letter
    for (let i = 0; i < 15; i++) {
      const angle = Math.PI + (i / 14) * Math.PI * 2;
      const x = centerX - 100 * scale + Math.cos(angle) * 15 * scale;
      const y = centerY + Math.sin(angle) * 15 * scale;
      path.push({ x, y });
    }
    
    // Right line of "a"
    for (let i = 0; i < 10; i++) {
      const x = centerX - 85 * scale;
      const y = centerY - 15 * scale + (i / 9) * 30 * scale;
      path.push({ x, y });
    }
    
    // Move to "n"
    path.push({ x: centerX - 70 * scale, y: centerY + 15 * scale, penUp: true });
    
    // "n" letter
    for (let i = 0; i < 10; i++) {
      const x = centerX - 70 * scale;
      const y = centerY + 15 * scale - (i / 9) * 30 * scale;
      path.push({ x, y });
    }
    
    // Arc of "n"
    for (let i = 0; i < 10; i++) {
      const angle = -Math.PI / 2 + (i / 9) * Math.PI / 2;
      const x = centerX - 70 * scale + Math.cos(angle) * 15 * scale;
      const y = centerY - 15 * scale + Math.sin(angle) * 15 * scale;
      path.push({ x, y });
    }
    
    // Right line of "n"
    for (let i = 0; i < 10; i++) {
      const x = centerX - 55 * scale;
      const y = centerY - 15 * scale + (i / 9) * 30 * scale;
      path.push({ x, y });
    }
    
    // Move to "e"
    path.push({ x: centerX - 40 * scale, y: centerY, penUp: true });
    
    // "e" letter
    for (let i = 0; i < 20; i++) {
      const angle = Math.PI - (i / 19) * Math.PI * 2;
      const x = centerX - 40 * scale + Math.cos(angle) * 15 * scale;
      const y = centerY + Math.sin(angle) * 15 * scale;
      path.push({ x, y });
    }
    
    // Horizontal line of "e"
    for (let i = 0; i < 10; i++) {
      const x = centerX - 40 * scale - 15 * scale + (i / 9) * 30 * scale;
      const y = centerY;
      path.push({ x, y });
    }
    
    // Move to "s"
    path.push({ x: centerX - 10 * scale, y: centerY - 15 * scale, penUp: true });
    
    // "s" letter - top curve
    for (let i = 0; i < 10; i++) {
      const angle = Math.PI + (i / 9) * Math.PI;
      const x = centerX - 10 * scale + Math.cos(angle) * 15 * scale;
      const y = centerY - 15 * scale + Math.sin(angle) * 15 * scale;
      path.push({ x, y });
    }
    
    // "s" letter - bottom curve
    for (let i = 0; i < 10; i++) {
      const angle = 0 + (i / 9) * Math.PI;
      const x = centerX - 10 * scale + Math.cos(angle) * 15 * scale;
      const y = centerY + 15 * scale + Math.sin(angle) * 15 * scale;
      path.push({ x, y });
    }
    
    // Move to "a"
    path.push({ x: centerX + 20 * scale, y: centerY, penUp: true });
    
    // "a" letter
    for (let i = 0; i < 15; i++) {
      const angle = Math.PI + (i / 14) * Math.PI * 2;
      const x = centerX + 20 * scale + Math.cos(angle) * 15 * scale;
      const y = centerY + Math.sin(angle) * 15 * scale;
      path.push({ x, y });
    }
    
    // Right line of "a"
    for (let i = 0; i < 10; i++) {
      const x = centerX + 35 * scale;
      const y = centerY - 15 * scale + (i / 9) * 30 * scale;
      path.push({ x, y });
    }
    
    // Move to "n"
    path.push({ x: centerX + 50 * scale, y: centerY + 15 * scale, penUp: true });
    
    // "n" letter
    for (let i = 0; i < 10; i++) {
      const x = centerX + 50 * scale;
      const y = centerY + 15 * scale - (i / 9) * 30 * scale;
      path.push({ x, y });
    }
    
    // Arc of "n"
    for (let i = 0; i < 10; i++) {
      const angle = -Math.PI / 2 + (i / 9) * Math.PI / 2;
      const x = centerX + 50 * scale + Math.cos(angle) * 15 * scale;
      const y = centerY - 15 * scale + Math.sin(angle) * 15 * scale;
      path.push({ x, y });
    }
    
    // Right line of "n"
    for (let i = 0; i < 10; i++) {
      const x = centerX + 65 * scale;
      const y = centerY - 15 * scale + (i / 9) * 30 * scale;
      path.push({ x, y });
    }
    
    // Move to "P" (big letter)
    path.push({ x: centerX + 100 * scale, y: centerY + 15 * scale, penUp: true });
    
    // "P" letter - vertical line
    for (let i = 0; i < 10; i++) {
      const x = centerX + 100 * scale;
      const y = centerY + 15 * scale - (i / 9) * 60 * scale;
      path.push({ x, y });
    }
    
    // "P" letter - curved part
    for (let i = 0; i < 15; i++) {
      const angle = -Math.PI / 2 + (i / 14) * Math.PI;
      const x = centerX + 100 * scale + Math.cos(angle) * 20 * scale;
      const y = centerY - 30 * scale + Math.sin(angle) * 20 * scale;
      path.push({ x, y });
    }
    
    // Move to "V"
    path.push({ x: centerX + 135 * scale, y: centerY - 45 * scale, penUp: true });
    
    // "V" letter - first line down
    for (let i = 0; i < 10; i++) {
      const x = centerX + 135 * scale + (i / 9) * 15 * scale;
      const y = centerY - 45 * scale + (i / 9) * 60 * scale;
      path.push({ x, y });
    }
    
    // "V" letter - second line up
    for (let i = 0; i < 10; i++) {
      const x = centerX + 150 * scale + (i / 9) * 15 * scale;
      const y = centerY + 15 * scale - (i / 9) * 60 * scale;
      path.push({ x, y });
    }
    
    // Add a flourish under the signature
    path.push({ x: centerX - 100 * scale, y: centerY + 40 * scale, penUp: true });
    
    // Curved flourish line
    for (let i = 0; i < 30; i++) {
      const x = centerX - 100 * scale + (i / 29) * 200 * scale;
      const y = centerY + 40 * scale + Math.sin((i / 29) * Math.PI) * 5 * scale;
      path.push({ x, y });
    }
    
    return path;
  }
});

// ...existing code...

// Initialize 3D Globe Animation
document.addEventListener('DOMContentLoaded', function() {
  const canvas = document.getElementById('globeCanvas');
  if (!canvas) return;
  
  // Initialize the globe
  initGlobe();
  
  // Add particles around the globe
  createGlobeParticles();
  
  // Add flight paths
  createFlightPaths();
  
  // Add location markers
  createLocationMarkers();
  
  // Add atmosphere glow effect
  enhanceAtmosphere();
  
  // Add interactive effect
  addGlobeInteractivity();
});

// Initialize Globe
function initGlobe() {
  const canvas = document.getElementById('globeCanvas');
  const ctx = canvas.getContext('2d');
  
  // Set canvas dimensions
  canvas.width = 300;
  canvas.height = 300;
  
  // Function to draw the globe
  function drawGlobe() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Create gradient background for the globe
    const gradient = ctx.createRadialGradient(
      150, 120, 50,
      150, 150, 150
    );
    gradient.addColorStop(0, '#1e47c8');
    gradient.addColorStop(0.5, '#162d72');
    gradient.addColorStop(1, '#0a1d4e');
    
    // Draw the globe circle
    ctx.beginPath();
    ctx.arc(150, 150, 145, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();
    
    // Draw latitude lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    
    for (let i = 0; i < 8; i++) {
      const y = 20 + i * 40;
      ctx.beginPath();
      ctx.ellipse(150, 150, 145, 40 + i * 15, 0, 0, Math.PI * 2);
      ctx.stroke();
    }
    
    // Draw longitude lines
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      const startX = 150 + Math.cos(angle) * 145;
      const startY = 150 + Math.sin(angle) * 40;
      const endX = 150 + Math.cos(angle) * 145;
      const endY = 150 + Math.sin(angle) * 145;
      
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.bezierCurveTo(
        150 + Math.cos(angle) * 145,
        150 + Math.sin(angle) * 80,
        150 + Math.cos(angle) * 145,
        150 + Math.sin(angle) * 120,
        endX,
        endY
      );
      ctx.stroke();
    }
    
    // Draw continents (simplified shapes)
    ctx.fillStyle = 'rgba(94, 23, 235, 0.4)';
    
    // Draw North America
    ctx.beginPath();
    ctx.moveTo(70, 120);
    ctx.bezierCurveTo(80, 100, 100, 90, 110, 100);
    ctx.bezierCurveTo(120, 110, 100, 130, 90, 150);
    ctx.bezierCurveTo(70, 140, 60, 130, 70, 120);
    ctx.fill();
    
    // Draw South America
    ctx.beginPath();
    ctx.moveTo(100, 160);
    ctx.bezierCurveTo(110, 170, 120, 190, 110, 210);
    ctx.bezierCurveTo(90, 200, 85, 180, 100, 160);
    ctx.fill();
    
    // Draw Europe and Africa
    ctx.beginPath();
    ctx.moveTo(150, 100);
    ctx.bezierCurveTo(160, 110, 170, 130, 160, 150);
    ctx.bezierCurveTo(160, 170, 150, 200, 145, 210);
    ctx.bezierCurveTo(130, 190, 125, 170, 130, 140);
    ctx.bezierCurveTo(140, 120, 145, 110, 150, 100);
    ctx.fill();
    
    // Draw Asia and Australia
    ctx.beginPath();
    ctx.moveTo(200, 110);
    ctx.bezierCurveTo(220, 120, 230, 140, 220, 160);
    ctx.bezierCurveTo(210, 170, 190, 160, 180, 150);
    ctx.bezierCurveTo(175, 130, 185, 120, 200, 110);
    ctx.fill();
    
    ctx.beginPath();
    ctx.moveTo(230, 180);
    ctx.bezierCurveTo(240, 190, 235, 200, 225, 195);
    ctx.bezierCurveTo(220, 185, 225, 175, 230, 180);
    ctx.fill();
    
    // Draw highlight/specular effect
    const highlightGradient = ctx.createRadialGradient(
      120, 100, 10,
      120, 100, 80
    );
    highlightGradient.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
    highlightGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    
    ctx.fillStyle = highlightGradient;
    ctx.beginPath();
    ctx.arc(120, 100, 80, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw subtle edge glow
    ctx.strokeStyle = 'rgba(94, 23, 235, 0.3)';
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.arc(150, 150, 141, 0, Math.PI * 2);
    ctx.stroke();
  }
  
  // Draw the initial globe
  drawGlobe();
  
  // Add subtle animation to redraw the globe with slightly different shading
  let rotationOffset = 0;
  setInterval(() => {
    rotationOffset += 0.02;
    
    // This simulates the rotation by adjusting the canvas transform
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(150, 150);
    ctx.rotate(rotationOffset);
    ctx.translate(-150, -150);
    drawGlobe();
    ctx.restore();
  }, 50);
}

// Create particles around the globe
function createGlobeParticles() {
  const particlesContainer = document.querySelector('.globe-particles');
  if (!particlesContainer) return;
  
  // Calculate the globe center and radius
  const globeWrapper = document.querySelector('.globe-wrapper');
  const globeRect = globeWrapper.getBoundingClientRect();
  const globeRadius = globeRect.width / 2;
  
  // Create particles
  for (let i = 0; i < 100; i++) {
    const particle = document.createElement('div');
    particle.className = 'globe-particle';
    
    // Calculate 3D position around the globe
    const theta = Math.random() * Math.PI * 2; // longitude
    const phi = Math.random() * Math.PI - Math.PI/2; // latitude
    const distance = globeRadius * (1 + Math.random() * 0.3); // slightly outside the globe
    
    const x = distance * Math.cos(phi) * Math.cos(theta);
    const y = distance * Math.sin(phi);
    const z = distance * Math.cos(phi) * Math.sin(theta);
    
    // Generate random size
    const size = 1 + Math.random() * 2;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    
    // Position the particle
    particle.style.transform = `translate3d(${x + 150}px, ${y + 150}px, ${z}px)`;
    
    // Add subtle pulsing animation
    const animationDuration = 3 + Math.random() * 5;
    particle.style.animation = `pulse ${animationDuration}s ease-in-out infinite`;
    particle.style.animationDelay = `${Math.random() * 5}s`;
    
    // Add to container
    particlesContainer.appendChild(particle);
  }
}

// Create flight paths around the globe
function createFlightPaths() {
  const pathsContainer = document.querySelector('.flight-paths-container');
  if (!pathsContainer) return;
  
  // Create a few random flight paths
  for (let i = 0; i < 8; i++) {
    const path = document.createElement('div');
    path.className = 'flight-path';
    
    // Random rotation and position to make it look 3D
    const rotateY = Math.random() * 360;
    const rotateX = Math.random() * 40 - 20;
    const width = 140 + Math.random() * 40;
    
    path.style.width = `${width}%`;
    path.style.transform = `rotateY(${rotateY}deg) rotateX(${rotateX}deg) translateZ(140px)`;
    
    // Add flight dot that moves along the path
    const dot = document.createElement('div');
    dot.className = 'flight-dot';
    
    // Animate the dot along the path
    const duration = 5 + Math.random() * 10;
    dot.style.animation = `moveAlongPath ${duration}s linear infinite`;
    dot.style.animationDelay = `${Math.random() * 5}s`;
    
    // Add to the container
    path.appendChild(dot);
    pathsContainer.appendChild(path);
  }
}

// Create location markers on the globe
function createLocationMarkers() {
  const markersContainer = document.querySelector('.globe-markers');
  if (!markersContainer) return;
  
  // Define some major cities with their approximate positions
  const cities = [
    { name: 'New York', x: -70, y: -30, z: 140 },
    { name: 'London', x: -20, y: -50, z: 140 },
    { name: 'Tokyo', x: 110, y: -40, z: 90 },
    { name: 'Sydney', x: 100, y: 90, z: 90 },
    { name: 'Rio', x: -30, y: 90, z: 110 },
    { name: 'Chennai', x: 50, y: 30, z: 130 },
    { name: 'Cape Town', x: 20, y: 100, z: 110 },
    { name: 'Moscow', x: 30, y: -60, z: 130 }
  ];
  
  // Create markers for each city
  cities.forEach((city, index) => {
    const marker = document.createElement('div');
    marker.className = 'location-marker';
    marker.setAttribute('data-city', city.name);
    
    // Position the marker
    marker.style.transform = `translate3d(${city.x + 150}px, ${city.y + 150}px, ${city.z}px)`;
    
    // Add pulse animation
    const pulse = document.createElement('div');
    pulse.className = 'marker-pulse';
    marker.appendChild(pulse);
    
    // Create and add label
    const label = document.createElement('div');
    label.className = 'globe-label';
    label.textContent = city.name;
    label.style.setProperty('--delay', `${0.5 + index * 0.2}s`);
    
    // Position label next to marker
    label.style.transform = `translate3d(${city.x + 160}px, ${city.y + 150}px, ${city.z}px)`;
    
    // Add elements to the container
    markersContainer.appendChild(marker);
    markersContainer.appendChild(label);
    
    // If it's Chennai, create a connection to it
    if (city.name === 'Chennai') {
      // Create connections from random cities to Chennai
      cities.forEach((otherCity) => {
        if (otherCity.name !== 'Chennai' && Math.random() > 0.5) {
          createConnection(otherCity, city);
        }
      });
    }
  });
  
  // Special animation for Chennai marker
  const chennaiMarker = document.querySelector('.my-location-marker');
  if (chennaiMarker) {
    // Add a special glow effect
    chennaiMarker.innerHTML = `
      <div class="ping-circle"></div>
      <div class="location-label">Chennai</div>
    `;
  }
}

// Create connection between two cities
function createConnection(city1, city2) {
  const pathsContainer = document.querySelector('.flight-paths-container');
  if (!pathsContainer) return;
  
  // Create a connection line
  const connection = document.createElement('div');
  connection.className = 'connection-line';
  
  // Calculate distance and angle between cities
  const dx = city2.x - city1.x;
  const dy = city2.y - city1.y;
  const dz = city2.z - city1.z;
  
  const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
  
  // Calculate angle in 3D space
  const angleY = Math.atan2(dz, dx) * (180 / Math.PI);
  const angleX = Math.atan2(dy, Math.sqrt(dx * dx + dz * dz)) * (180 / Math.PI);
  
  // Set the line properties
  connection.style.width = `${distance}px`;
  connection.style.transform = `translate3d(${city1.x + 150}px, ${city1.y + 150}px, ${city1.z}px) rotateY(${angleY}deg) rotateX(${angleX}deg)`;
  
  // Add to container
  pathsContainer.appendChild(connection);
  
  // Animate a dot along the connection
  const dot = document.createElement('div');
  dot.className = 'flight-dot';
  
  // Random animation duration
  const duration = 5 + Math.random() * 5;
  dot.style.animation = `moveAlongPath ${duration}s linear infinite`;
  dot.style.animationDelay = `${Math.random() * 5}s`;
  
  connection.appendChild(dot);
}

// Enhance the atmosphere effect
function enhanceAtmosphere() {
  const atmosphere = document.querySelector('.globe-atmosphere');
  if (!atmosphere) return;
  
  // Create subtle waves in the atmosphere
  for (let i = 0; i < 3; i++) {
    const wave = document.createElement('div');
    wave.className = 'atmosphere-wave';
    wave.style.animationDelay = `${i * 1.5}s`;
    atmosphere.appendChild(wave);
  }
  
  // Add subtle glow pulses
  const glowPulse = document.createElement('div');
  glowPulse.className = 'glow-pulse';
  atmosphere.appendChild(glowPulse);
}

// Add interactivity to the globe
function addGlobeInteractivity() {
  const globeWrapper = document.querySelector('.globe-wrapper');
  const globeContainer = document.querySelector('.globe-container');
  if (!globeWrapper || !globeContainer) return;
  
  // Add mousemove event to rotate the globe slightly
  globeContainer.addEventListener('mousemove', (e) => {
    const rect = globeContainer.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    
    const angleY = (mouseX - centerX) / 10;
    const angleX = (mouseY - centerY) / 10;
    
    // Apply rotation
    globeWrapper.style.transform = `translateY(0) rotateX(${20 - angleX/3}deg) rotateY(${angleY/3}deg)`;
    
    // Add light glare based on mouse position
    const atmosphere = document.querySelector('.globe-atmosphere');
    if (atmosphere) {
      const percentX = (mouseX - rect.left) / rect.width;
      const percentY = (mouseY - rect.top) / rect.height;
      
      atmosphere.style.background = `radial-gradient(circle at ${percentX * 100}% ${percentY * 100}%, rgba(255, 255, 255, 0.1) 0%, rgba(21, 101, 192, 0.2) 40%, rgba(94, 23, 235, 0.3) 100%)`;
    }
  });
  
  // Reset on mouseleave
  globeContainer.addEventListener('mouseleave', () => {
    globeWrapper.style.transform = '';
    
    // Reset atmosphere
    const atmosphere = document.querySelector('.globe-atmosphere');
    if (atmosphere) {
      atmosphere.style.background = '';
    }
  });
  
  // Add click event to create new connection
  globeContainer.addEventListener('click', (e) => {
    // Create a small burst effect on click
    const burst = document.createElement('div');
    burst.className = 'globe-burst';
    
    const rect = globeContainer.getBoundingClientRect();
    burst.style.left = `${e.clientX - rect.left}px`;
    burst.style.top = `${e.clientY - rect.top}px`;
    
    globeContainer.appendChild(burst);
    
    // Remove after animation completes
    setTimeout(() => {
      burst.remove();
    }, 1000);
    
    // Add a random new connection
    const markers = document.querySelectorAll('.location-marker');
    if (markers.length > 1) {
      const randomMarker1 = Math.floor(Math.random() * markers.length);
      let randomMarker2 = Math.floor(Math.random() * markers.length);
      
      // Ensure we don't connect to the same marker
      while (randomMarker2 === randomMarker1) {
        randomMarker2 = Math.floor(Math.random() * markers.length);
      }
      
      const marker1 = markers[randomMarker1];
      const marker2 = markers[randomMarker2];
      
      // Get positions from the style transform
      const transformToPosition = (transform) => {
        const match = transform.match(/translate3d\(([^)]+)\)/);
        if (match) {
          const values = match[1].split(',').map(v => parseFloat(v));
          return {
            x: values[0] - 150,
            y: values[1] - 150,
            z: values[2]
          };
        }
        return { x: 0, y: 0, z: 0 };
      };
      
      const pos1 = transformToPosition(marker1.style.transform);
      const pos2 = transformToPosition(marker2.style.transform);
      
      createConnection(pos1, pos2);
    }
  });
}

// Style for globe burst effect
const globeBurstStyle = document.createElement('style');
globeBurstStyle.textContent = `
  .globe-burst {
    position: absolute;
    width: 2px;
    height: 2px;
    border-radius: 50%;
    background: transparent;
    box-shadow: 0 0 0 0 rgba(201, 161, 74, 0.5);
    pointer-events: none;
    z-index: 10;
    animation: globeBurst 1s ease-out forwards;
  }
  
  @keyframes globeBurst {
    0% { box-shadow: 0 0 0 0 rgba(201, 161, 74, 0.8); }
    100% { box-shadow: 0 0 0 100px rgba(201, 161, 74, 0); }
  }
  
  .atmosphere-wave {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: transparent;
    border: 1px solid rgba(255, 255, 255, 0.1);
    transform-origin: center;
    animation: waveExpand 8s ease-out infinite;
  }
  
  @keyframes waveExpand {
    0% { transform: scale(1); opacity: 0.6; }
    100% { transform: scale(1.2); opacity: 0; }
  }
  
  .glow-pulse {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(94, 23, 235, 0.3) 0%, transparent 70%);
    animation: glowPulse 5s ease-in-out infinite;
  }
  
  @keyframes glowPulse {
    0%, 100% { opacity: 0.2; transform: scale(1); }
    50% { opacity: 0.5; transform: scale(1.1); }
  }
  
  @keyframes moveAlongPath {
    from { left: 0; }
    to { left: 100%; }
  }
  
  .marker-pulse {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: transparent;
    border: 2px solid rgba(201, 161, 74, 0.8);
    transform: translate(-50%, -50%);
    animation: markerPulse 2s ease-out infinite;
  }
  
  @keyframes markerPulse {
    0% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
    100% { transform: translate(-50%, -50%) scale(2.5); opacity: 0; }
  }
  
  .location-label {
    position: absolute;
    top: -20px;
    left: 0;
    color: #FFD600;
    font-size: 12px;
    text-shadow: 0 0 5px rgba(0, 0, 0, 0.8);
    white-space: nowrap;
  }
`;
document.head.appendChild(globeBurstStyle);

// ...existing code...

// Animate floating fun facts and icons
document.addEventListener('DOMContentLoaded', function() {
  // Animate each fact with a staggered entrance and floating effect
  const facts = document.querySelectorAll('.animated-fact');
  facts.forEach((fact, i) => {
    fact.style.opacity = '0';
    fact.style.transform = 'translateY(40px) scale(0.95)';
    setTimeout(() => {
      fact.style.transition = 'all 0.7s cubic-bezier(.6,.2,.4,1)';
      fact.style.opacity = '1';
      fact.style.transform = 'translateY(0) scale(1)';
    }, 400 + i * 180);
  });

  // Animate the underline
  const underline = document.querySelector('.fun-facts-underline');
  if (underline) {
    underline.style.opacity = '0';
    underline.style.transform = 'scaleX(0.5)';
    setTimeout(() => {
      underline.style.transition = 'all 0.7s cubic-bezier(.6,.2,.4,1)';
      underline.style.opacity = '1';
      underline.style.transform = 'scaleX(1)';
    }, 300);
  }

  // Animate floating shapes
  const floaters = document.querySelector('.fun-facts-floaters');
  if (floaters) {
    floaters.style.opacity = '0';
    setTimeout(() => {
      floaters.style.transition = 'opacity 1s cubic-bezier(.6,.2,.4,1)';
      floaters.style.opacity = '1';
    }, 800);
  }

  // Animate CTA button pulse on mount
  const ctaBtn = document.querySelector('.fun-facts-cta-btn');
  if (ctaBtn) {
    ctaBtn.style.opacity = '0';
    setTimeout(() => {
      ctaBtn.style.transition = 'opacity 0.7s cubic-bezier(.6,.2,.4,1)';
      ctaBtn.style.opacity = '1';
    }, 1200);
  }
});

// ...existing code...

// --- Fun Facts Card: 3D Animated Globe ---
document.addEventListener('DOMContentLoaded', function() {
  const canvas = document.getElementById('globeCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let width = canvas.width, height = canvas.height;
  let rotation = 0;
  let animationFrame;

  // City data: name, lat, lon, color
  const cities = [
    { name: 'Chennai', lat: 13.08, lon: 80.27, color: '#FFD600' },
    { name: 'London', lat: 51.5, lon: -0.1, color: '#5e17eb' },
    { name: 'New York', lat: 40.7, lon: -74, color: '#5e17eb' },
    { name: 'Tokyo', lat: 35.7, lon: 139.7, color: '#5e17eb' },
    { name: 'Sydney', lat: -33.9, lon: 151.2, color: '#5e17eb' },
    { name: 'Berlin', lat: 52.5, lon: 13.4, color: '#5e17eb' },
    { name: 'Cape Town', lat: -33.9, lon: 18.4, color: '#5e17eb' }
  ];

  // Convert lat/lon to 3D sphere coordinates
  function latLonToXYZ(lat, lon, r, rot) {
    const phi = (90 - lat) * Math.PI / 180;
    const theta = (lon + rot) * Math.PI / 180;
    return {
      x: r * Math.sin(phi) * Math.cos(theta),
      y: r * Math.cos(phi),
      z: r * Math.sin(phi) * Math.sin(theta)
    };
  }

  // Project 3D to 2D
  function project(x, y, z) {
    const scale = 0.8;
    const viewer = 400;
    const factor = viewer / (viewer - z);
    return {
      x: width / 2 + x * factor * scale,
      y: height / 2 + y * factor * scale
    };
  }

  // Draw globe, cities, and connections
  function drawGlobe() {
    ctx.clearRect(0, 0, width, height);

    // Draw sphere
    ctx.save();
    ctx.beginPath();
    ctx.arc(width/2, height/2, width/2-5, 0, Math.PI*2);
    ctx.fillStyle = '#181a2a';
    ctx.shadowColor = '#FFD60044';
    ctx.shadowBlur = 18;
    ctx.fill();
    ctx.restore();

    // Draw latitude/longitude lines
    ctx.save();
    ctx.strokeStyle = 'rgba(255,255,255,0.08)';
    ctx.lineWidth = 1;
    for (let i = -60; i <= 60; i += 30) {
      ctx.beginPath();
      for (let j = 0; j <= 360; j += 5) {
        const p = latLonToXYZ(i, j, width/2-10, rotation);
        const pt = project(p.x, p.y, p.z);
        if (j === 0) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
      }
      ctx.stroke();
    }
    for (let j = 0; j < 360; j += 30) {
      ctx.beginPath();
      for (let i = -90; i <= 90; i += 5) {
        const p = latLonToXYZ(i, j, width/2-10, rotation);
        const pt = project(p.x, p.y, p.z);
        if (i === -90) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
      }
      ctx.stroke();
    }
    ctx.restore();

    // Draw connections from Chennai to others
    const chennai = cities[0];
    for (let i = 1; i < cities.length; i++) {
      const from = latLonToXYZ(chennai.lat, chennai.lon, width/2-12, rotation);
      const to = latLonToXYZ(cities[i].lat, cities[i].lon, width/2-12, rotation);
      const from2d = project(from.x, from.y, from.z);
      const to2d = project(to.x, to.y, to.z);

      ctx.save();
      ctx.strokeStyle = 'rgba(255,214,0,0.18)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(from2d.x, from2d.y);
      // Curve for arc
      ctx.bezierCurveTo(
        (from2d.x + to2d.x)/2, from2d.y-40,
        (from2d.x + to2d.x)/2, to2d.y-40,
        to2d.x, to2d.y
      );
      ctx.stroke();
      ctx.restore();

      // Animate a dot along the path
      const t = (Date.now()/1200 + i*0.2) % 1;
      const cx = from2d.x + (to2d.x-from2d.x)*t;
      const cy = from2d.y + (to2d.y-from2d.y)*t - Math.sin(Math.PI*t)*40;
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, 4, 0, Math.PI*2);
      ctx.fillStyle = '#FFD600';
      ctx.globalAlpha = 0.7;
      ctx.shadowColor = '#FFD600';
      ctx.shadowBlur = 8;
      ctx.fill();
      ctx.restore();
    }

    // Draw city markers
    cities.forEach((city, idx) => {
      const p = latLonToXYZ(city.lat, city.lon, width/2-12, rotation);
      const pt = project(p.x, p.y, p.z);
      ctx.save();
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 8, 0, Math.PI*2);
      ctx.fillStyle = city.color;
      ctx.globalAlpha = 0.85;
      ctx.shadowColor = city.color;
      ctx.shadowBlur = 12;
      ctx.fill();
      ctx.restore();

      // Animate pulse
      ctx.save();
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 12 + Math.sin(Date.now()/600 + idx)*2, 0, Math.PI*2);
      ctx.strokeStyle = city.color;
      ctx.globalAlpha = 0.18;
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.restore();
    });
  }

  // Animate globe
  function animate() {
    rotation += 0.2;
    drawGlobe();
    animationFrame = requestAnimationFrame(animate);
  }
  animate();

  // Responsive
  window.addEventListener('resize', () => {
    width = canvas.width = canvas.offsetWidth;
    height = canvas.height = canvas.offsetHeight;
  });

  // Interactive: rotate on mouse move
  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    rotation += x * 2;
  });
});

// ...existing code...

// --- Music Player UI: Animated Lyrics and Progress ---
document.addEventListener('DOMContentLoaded', function () {
  // Lyrics lines for the "Now Playing" UI
  const lyrics = [
    "In the silence, keys begin to play,",
    "A code symphony, night and day.",
    "Logic flows like a melody,",
    "Building dreams in binary.",
    "Every bug, a note to bend,",
    "Music and code, they never end."
  ];
  let lineIdx = 0, charIdx = 0, typing = false;
  const lyricsLine = document.getElementById('lyricsLine');
  const lyricsCursor = document.getElementById('lyricsCursor');
  const progressBar = document.getElementById('musicProgressBar');
  const bars = document.querySelectorAll('.music-bars .bar');

  function typeLyrics() {
    if (!lyricsLine || !lyricsCursor) return;
    typing = true;
    lyricsLine.textContent = '';
    charIdx = 0;
    let line = lyrics[lineIdx];
    function typeChar() {
      if (charIdx <= line.length) {
        lyricsLine.textContent = line.slice(0, charIdx);
        charIdx++;
        setTimeout(typeChar, 35 + Math.random() * 40);
      } else {
        typing = false;
        setTimeout(nextLine, 1200);
      }
    }
    typeChar();
  }
  function nextLine() {
    lineIdx = (lineIdx + 1) % lyrics.length;
    typeLyrics();
    updateProgress();
  }
  function updateProgress() {
    if (!progressBar) return;
    const percent = ((lineIdx + 1) / lyrics.length) * 100;
    progressBar.style.width = percent + '%';
  }
  // Animate music bars with random heights
  function animateBars() {
    bars.forEach((bar, i) => {
      bar.style.height = (12 + Math.random() * 14) + 'px';
    });
    setTimeout(animateBars, 350);
  }
  if (lyricsLine && lyricsCursor) {
    typeLyrics();
    animateBars();
  }
});

// ...existing code...

// Noting OS achievement pulse effect on click
document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.noting-os-item').forEach(item => {
    item.addEventListener('click', function () {
      this.classList.remove('active');
      void this.offsetWidth; // trigger reflow
      this.classList.add('active');
      setTimeout(() => this.classList.remove('active'), 400);
    });
  });
});

// ...existing code...

// ...existing code...

// --- Improved Code Galaxy Achievement Visualization ---
document.addEventListener('DOMContentLoaded', function() {
  const canvas = document.getElementById('codeGalaxyCanvas');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  const width = canvas.width;
  const height = canvas.height;
  
  // Achievement data with improved info
  const achievements = [
    { id: 'web', name: 'Web Development', icon: 'fa-globe', details: 'Built 10+ responsive websites with modern frameworks.', color: '#61dafb' },
    { id: 'mobile', name: 'Mobile Apps', icon: 'fa-mobile-alt', details: 'Developed cross-platform mobile applications.', color: '#3c873a' },
    { id: 'ai', name: 'AI Projects', icon: 'fa-brain', details: 'Created ML algorithms for real-world problems.', color: '#ff6384' },
    { id: 'ui', name: 'UI/UX Design', icon: 'fa-palette', details: 'Designed intuitive user interfaces with Figma.', color: '#9c55ff' },
    { id: 'cloud', name: 'Cloud Solutions', icon: 'fa-cloud', details: 'Deployed applications on AWS and Azure.', color: '#ff9e41' },
    { id: 'data', name: 'Data Science', icon: 'fa-chart-line', details: 'Analyzed complex datasets to extract insights.', color: '#4bc0c0' },
    { id: 'security', name: 'Cybersecurity', icon: 'fa-shield-alt', details: 'Implemented secure authentication systems.', color: '#f7df1e' },
    { id: 'hackathon', name: 'Hackathon Wins', icon: 'fa-trophy', details: 'Won 3 hackathons with innovative solutions.', color: '#FFD600' }
  ];
  
  // Create achievement badges in the UI with improved styling and interaction
  const achievementsContainer = document.getElementById('achievements-container');
  if (achievementsContainer) {
    achievementsContainer.innerHTML = ''; // Clear existing content
    
    achievements.forEach((achievement) => {
      const badge = document.createElement('div');
      badge.className = 'achievement-badge';
      badge.dataset.id = achievement.id;
      badge.innerHTML = `
        <div class="achievement-icon" style="color: ${achievement.color}">
          <i class="fas ${achievement.icon}"></i>
        </div>
        <div class="achievement-name">${achievement.name}</div>
      `;
      achievementsContainer.appendChild(badge);
      
      // Enhanced tooltip functionality with detail cards
      badge.addEventListener('mouseenter', (e) => {
        // Highlight corresponding planet
        planets.forEach(planet => {
          if (planet.id === achievement.id) {
            planet.highlighted = true;
            planet.pulseEffect = true;
          }
        });
        
        // Show detailed tooltip
        const tooltip = document.getElementById('galaxyTooltip');
        if (tooltip) {
          tooltip.innerHTML = `
            <div class="galaxy-tooltip-header">
              <i class="fas ${achievement.icon}"></i>
              <h4>${achievement.name}</h4>
            </div>
            <div class="galaxy-tooltip-body">${achievement.details}</div>
          `;
          tooltip.style.borderColor = achievement.color;
          tooltip.style.boxShadow = `0 0 10px ${achievement.color}80`;
          
          // Position tooltip
          const rect = badge.getBoundingClientRect();
          const containerRect = achievementsContainer.getBoundingClientRect();
          tooltip.style.left = `${rect.left - containerRect.left + rect.width/2}px`;
          tooltip.style.top = `${rect.top - containerRect.top - tooltip.offsetHeight - 10}px`;
          tooltip.classList.add('visible');
        }
        
        // Create connection line between badge and planet
        createConnectionLine(achievement.id);
      });
      
      badge.addEventListener('mouseleave', () => {
        // Reset planet highlight
        planets.forEach(planet => {
          if (planet.id === achievement.id) {
            planet.highlighted = false;
            planet.pulseEffect = false;
          }
        });
        
        // Hide tooltip
        const tooltip = document.getElementById('galaxyTooltip');
        if (tooltip) {
          tooltip.classList.remove('visible');
        }
        
        // Remove connection line
        const line = document.querySelector('.galaxy-connection-line');
        if (line) line.remove();
      });
    });
  }
  
  // Create connection line between badge and planet
  function createConnectionLine(id) {
    // Remove any existing lines
    const existingLine = document.querySelector('.galaxy-connection-line');
    if (existingLine) existingLine.remove();
    
    // Find the badge and matching planet
    const badge = document.querySelector(`.achievement-badge[data-id="${id}"]`);
    if (!badge) return;
    
    const targetPlanet = planets.find(planet => planet.id === id);
    if (!targetPlanet) return;
    
    // Create SVG line
    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("class", "galaxy-connection-line");
    svg.style.position = "absolute";
    svg.style.top = "0";
    svg.style.left = "0";
    svg.style.width = "100%";
    svg.style.height = "100%";
    svg.style.pointerEvents = "none";
    svg.style.zIndex = "1";
    
    // Calculate positions
    const badgeRect = badge.getBoundingClientRect();
    const canvasRect = canvas.getBoundingClientRect();
    const containerRect = achievementsContainer.parentElement.getBoundingClientRect();
    
    const x1 = badgeRect.left + badgeRect.width/2 - containerRect.left;
    const y1 = badgeRect.top + badgeRect.height/2 - containerRect.top;
    const x2 = canvasRect.left + targetPlanet.x - containerRect.left;
    const y2 = canvasRect.top + targetPlanet.y - containerRect.top;
    
    // Create the path
    const path = document.createElementNS(svgNS, "path");
    const midX = (x1 + x2) / 2;
    const curveY = Math.min(y1, y2) - 30;
    
    path.setAttribute("d", `M${x1},${y1} Q${midX},${curveY} ${x2},${y2}`);
    path.setAttribute("fill", "none");
    path.setAttribute("stroke", targetPlanet.color);
    path.setAttribute("stroke-width", "2");
    path.setAttribute("stroke-dasharray", "5,5");
    path.setAttribute("stroke-linecap", "round");
    
    // Add animation
    const animateMotion = document.createElementNS(svgNS, "animate");
    animateMotion.setAttribute("attributeName", "stroke-dashoffset");
    animateMotion.setAttribute("from", "0");
    animateMotion.setAttribute("to", "20");
    animateMotion.setAttribute("dur", "1s");
    animateMotion.setAttribute("repeatCount", "indefinite");
    
    path.appendChild(animateMotion);
    svg.appendChild(path);
    
    // Add to container
    achievementsContainer.parentElement.appendChild(svg);
  }
  
  // Galaxy visualization objects
  let stars = [];
  let nebulae = [];
  let planets = [];
  let comets = [];
  let activeTechFilter = null;
  
  // Improved Star class with better performance
  class Star {
    constructor() {
      this.reset();
      // Start with random opacity
      this.opacity = 0.2 + Math.random() * 0.6;
    }
    
    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = 0.5 + Math.random() * 1;
      this.color = this.getRandomColor();
      this.pulseSpeed = 0.02 + Math.random() * 0.03;
      this.pulsePhase = Math.random() * Math.PI * 2;
      
      // Add z-coordinate for parallax
      this.z = Math.random() * 0.5 + 0.5;
      this.originalX = this.x;
      this.originalY = this.y;
    }
    
    getRandomColor() {
      const colors = [
        'rgba(255, 255, 255, alpha)', // White
        'rgba(255, 214, 0, alpha)',   // Gold
        'rgba(94, 23, 235, alpha)',   // Purple
        'rgba(61, 218, 255, alpha)'   // Light blue
      ];
      return colors[Math.floor(Math.random() * colors.length)];
    }
    
    update(time, mouseX, mouseY) {
      // Pulsing effect
      const pulse = (Math.sin(time * this.pulseSpeed + this.pulsePhase) * 0.5 + 0.5) * 0.7;
      this.currentSize = this.size * (1 + pulse * 0.3);
      this.currentOpacity = this.opacity * (0.6 + pulse * 0.4);
      
      // Subtle parallax effect based on mouse position if available
      if (mouseX !== undefined && mouseY !== undefined) {
        const parallaxStrength = 15 * (1 - this.z);
        const deltaX = (mouseX - width/2) / width * parallaxStrength;
        const deltaY = (mouseY - height/2) / height * parallaxStrength;
        this.x = this.originalX - deltaX;
        this.y = this.originalY - deltaY;
      }
    }
    
    draw(ctx) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.currentSize, 0, Math.PI * 2);
      ctx.fillStyle = this.color.replace('alpha', this.currentOpacity);
      ctx.fill();
      
      // Add glow effect for brighter stars
      if (this.size > 1) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.currentSize * 2, 0, Math.PI * 2);
        ctx.fillStyle = this.color.replace('alpha', this.currentOpacity * 0.2);
        ctx.fill();
      }
    }
  }
  
  // New Nebula class for cloudy background
  class Nebula {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.radius = 50 + Math.random() * 70;
      this.color = this.getRandomColor();
      this.opacity = 0.05 + Math.random() * 0.1;
      this.pulseSpeed = 0.001 + Math.random() * 0.002;
      this.pulsePhase = Math.random() * Math.PI * 2;
      this.rotationSpeed = 0.0005 + Math.random() * 0.001;
      this.rotationAngle = Math.random() * Math.PI * 2;
    }
    
    getRandomColor() {
      const colors = [
        'rgba(94, 23, 235, alpha)',   // Purple
        'rgba(255, 214, 0, alpha)',   // Gold
        'rgba(61, 218, 255, alpha)',  // Light blue
        'rgba(0, 210, 126, alpha)'    // Teal
      ];
      return colors[Math.floor(Math.random() * colors.length)];
    }
    
    update(time) {
      // Subtle pulsing effect
      const pulse = Math.sin(time * this.pulseSpeed + this.pulsePhase) * 0.5 + 0.5;
      this.currentOpacity = this.opacity * (0.8 + pulse * 0.4);
      this.currentRadius = this.radius * (0.9 + pulse * 0.15);
      this.rotationAngle += this.rotationSpeed;
    }
    
    draw(ctx) {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotationAngle);
      
      // Use gradients for more natural nebula look
      const gradient = ctx.createRadialGradient(0, 0, 1, 0, 0, this.currentRadius);
      gradient.addColorStop(0, this.color.replace('alpha', this.currentOpacity * 1.5));
      gradient.addColorStop(0.5, this.color.replace('alpha', this.currentOpacity * 0.7));
      gradient.addColorStop(1, this.color.replace('alpha', 0));
      
      ctx.beginPath();
      // Create a slightly elliptical shape
      ctx.ellipse(0, 0, this.currentRadius, this.currentRadius * 0.7, 0, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();
      
      ctx.restore();
    }
  }
  
  // Improved Planet class for achievements
  class Planet {
    constructor(achievement, index) {
      this.id = achievement.id;
      this.name = achievement.name;
      this.details = achievement.details;
      this.color = achievement.color;
      this.icon = achievement.icon;
      
      // Visual properties
      this.size = 5 + Math.random() * 3;
      // Position in a distributed manner around center
      this.orbitDistance = 60 + (index * 20) % 80 + Math.random() * 15;
      this.angle = (index / achievements.length) * Math.PI * 2;
      this.speed = 0.0003 + Math.random() * 0.0002;
      
      // Calculate position
      this.updatePosition();
      
      // Create orbital ring
      this.hasRing = Math.random() > 0.6;
      this.ringWidth = this.size * (Math.random() * 1 + 1.5);
      this.ringAngle = Math.random() * Math.PI / 4;
      this.ringOpacity = 0.3 + Math.random() * 0.3;
      
      // State
      this.highlighted = false;
      this.pulseEffect = false;
      this.opacity = 0.7;
      this.targetOpacity = 0.7;
      
      // Initialize moons
      this.moons = [];
      this.moonCount = Math.floor(Math.random() * 3);
      for (let i = 0; i < this.moonCount; i++) {
        this.moons.push({
          size: this.size * 0.3 * (Math.random() * 0.5 + 0.5),
          distance: this.size * 2 + Math.random() * this.size * 2,
          angle: Math.random() * Math.PI * 2,
          speed: 0.01 + Math.random() * 0.02
        });
      }
    }
    
    updatePosition() {
      this.x = width / 2 + Math.cos(this.angle) * this.orbitDistance;
      this.y = height / 2 + Math.sin(this.angle) * this.orbitDistance;
    }
    
    update(time) {
      // Update orbit position
      this.angle += this.speed;
      this.updatePosition();
      
      // Update moons
      for (let moon of this.moons) {
        moon.angle += moon.speed;
      }
      
      // Smooth opacity transitions
      if (this.highlighted) {
        this.targetOpacity = 1;
      } else {
        this.targetOpacity = 0.7;
      }
      this.opacity += (this.targetOpacity - this.opacity) * 0.1;
      
      // Pulse effect when highlighted
      if (this.pulseEffect) {
        this.currentSize = this.size * (1 + Math.sin(time * 0.1) * 0.1);
      } else {
        this.currentSize = this.size;
      }
    }
    
    draw(ctx) {
      // Draw orbit path (only for highlighted planets)
      if (this.highlighted) {
        ctx.beginPath();
        ctx.arc(width / 2, height / 2, this.orbitDistance, 0, Math.PI * 2);
        ctx.strokeStyle = `${this.color}40`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
      
      // Draw ring if planet has one
      if (this.hasRing) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.ringAngle);
        ctx.scale(1, 0.3);
        ctx.beginPath();
        ctx.arc(0, 0, this.currentSize + this.ringWidth, 0, Math.PI * 2);
        ctx.strokeStyle = `${this.color}${Math.floor(this.ringOpacity * 255).toString(16).padStart(2, '0')}`;
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.restore();
      }
      
      // Draw shadow/glow
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.currentSize + 3, 0, Math.PI * 2);
      ctx.fillStyle = `${this.color}33`;
      ctx.fill();
      
      // Draw planet
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.currentSize, 0, Math.PI * 2);
      
      // Create gradient fill for more realistic planet
      const gradient = ctx.createRadialGradient(
        this.x - this.currentSize * 0.3, this.y - this.currentSize * 0.3, 0,
        this.x, this.y, this.currentSize
      );
      gradient.addColorStop(0, `${this.color}FF`);
      gradient.addColorStop(1, `${this.color}AA`);
      
      ctx.fillStyle = gradient;
      ctx.globalAlpha = this.opacity;
      ctx.fill();
      ctx.globalAlpha = 1;
      
      // Draw moons
      for (let moon of this.moons) {
        const moonX = this.x + Math.cos(moon.angle) * moon.distance;
        const moonY = this.y + Math.sin(moon.angle) * moon.distance;
        
        ctx.beginPath();
        ctx.arc(moonX, moonY, moon.size, 0, Math.PI * 2);
        ctx.fillStyle = `#ffffff${Math.floor(this.opacity * 200).toString(16).padStart(2, '0')}`;
        ctx.fill();
      }
      
      // Draw icon for highlighted planets
      if (this.highlighted) {
        // Just a small indicator, the actual icon is in the badge
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.currentSize * 0.6, 0, Math.PI * 2);
        ctx.fillStyle = "#ffffff90";
        ctx.fill();
      }
    }
  }
  
  // Improved Comet class with trail effect
  class Comet {
    constructor() {
      this.reset();
      // Start at a random position along the path
      this.progress = Math.random();
    }
    
    reset() {
      this.startAngle = Math.random() * Math.PI * 2;
      this.endAngle = this.startAngle + Math.PI + Math.random() * Math.PI;
      this.startDistance = 30 + Math.random() * 70;
      this.endDistance = 30 + Math.random() * 70;
      this.size = 1.5 + Math.random() * 1;
      this.speed = 0.002 + Math.random() * 0.004;
      this.progress = 0;
      this.maxTrailPoints = 20; // Reduced for performance
      this.trailPoints = [];
      this.color = this.getRandomColor();
      this.active = true;
    }
    
    getRandomColor() {
      const colors = [
        'rgba(255, 214, 0, 1)',   // Gold
        'rgba(255, 214, 0, 1)',   // Double weight for gold
        'rgba(94, 23, 235, 1)',   // Purple
        'rgba(61, 218, 255, 1)'   // Light blue
      ];
      return colors[Math.floor(Math.random() * colors.length)];
    }
    
    update() {
      if (!this.active) return;
      
      this.progress += this.speed;
      
      if (this.progress >= 1) {
        this.reset();
        return;
      }
      
      // Calculate position along the path
      const angle = this.startAngle + (this.endAngle - this.startAngle) * this.progress;
      const distance = this.startDistance + (this.endDistance - this.startDistance) * this.progress;
      
      this.x = width / 2 + Math.cos(angle) * distance;
      this.y = height / 2 + Math.sin(angle) * distance;
      
      // Add current position to trail points
      this.trailPoints.unshift({ x: this.x, y: this.y });
      
      // Limit trail length
      if (this.trailPoints.length > this.maxTrailPoints) {
        this.trailPoints.pop();
      }
    }
    
    draw(ctx) {
      if (!this.active || this.trailPoints.length < 2) return;
      
      // Draw trail with gradient
      ctx.beginPath();
      ctx.moveTo(this.trailPoints[0].x, this.trailPoints[0].y);
      
      for (let i = 1; i < this.trailPoints.length; i++) {
        ctx.lineTo(this.trailPoints[i].x, this.trailPoints[i].y);
      }
      
      // Create gradient for trail
      const gradient = ctx.createLinearGradient(
        this.trailPoints[0].x, this.trailPoints[0].y, 
        this.trailPoints[this.trailPoints.length-1].x, this.trailPoints[this.trailPoints.length-1].y
      );
      
      gradient.addColorStop(0, this.color);
      gradient.addColorStop(1, this.color.replace('1)', '0)'));
      
      ctx.strokeStyle = gradient;
      ctx.lineWidth = this.size;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();
      
      // Draw comet head with glow
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size * 1.5, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
      
      // Draw glow
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
      const glowColor = this.color.replace('1)', '0.3)');
      ctx.fillStyle = glowColor;
      ctx.fill();
    }
  }
  
  // Initialize galaxy objects
  function initGalaxy() {
    // Create stars based on canvas size (reduced count for better performance)
    const starCount = Math.min(100, Math.floor((width * height) / 3000));
    stars = [];
    for (let i = 0; i < starCount; i++) {
      stars.push(new Star());
    }
    
    // Create nebulae
    nebulae = [];
    for (let i = 0; i < 5; i++) {
      nebulae.push(new Nebula());
    }
    
    // Create planets from achievements
    planets = [];
    achievements.forEach((achievement, index) => {
      planets.push(new Planet(achievement, index));
    });
    
    // Create comets
    comets = [];
    for (let i = 0; i < 3; i++) {
      comets.push(new Comet());
    }
  }
  
  // Draw galaxy center (black hole)
  function drawGalaxyCenter(ctx, time) {
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = 8;
    
    // Pulsing effect
    const pulse = Math.sin(time * 0.5) * 0.5 + 0.5;
    
    // Draw outer glow
    const gradient = ctx.createRadialGradient(
      centerX, centerY, radius * 0.5,
      centerX, centerY, radius * 4
    );
    gradient.addColorStop(0, `rgba(94, 23, 235, ${0.3 + pulse * 0.2})`);
    gradient.addColorStop(0.5, `rgba(94, 23, 235, ${0.1 + pulse * 0.1})`);
    gradient.addColorStop(1, 'rgba(94, 23, 235, 0)');
    
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 4, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();
    
    // Draw inner core
    const innerGradient = ctx.createRadialGradient(
      centerX, centerY, 0,
      centerX, centerY, radius
    );
    innerGradient.addColorStop(0, 'rgba(255, 214, 0, 1)');
    innerGradient.addColorStop(0.5, 'rgba(94, 23, 235, 0.8)');
    innerGradient.addColorStop(1, 'rgba(24, 26, 42, 0.8)');
    
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fillStyle = innerGradient;
    ctx.fill();
    
    // Draw accretion disk
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(time * 0.1);
    ctx.scale(1, 0.3);
    ctx.beginPath();
    ctx.arc(0, 0, radius * 3, 0, Math.PI * 2);
    ctx.lineWidth = 2;
    ctx.strokeStyle = `rgba(255, 214, 0, ${0.5 + pulse * 0.2})`;
    ctx.stroke();
    ctx.restore();
    
    // Draw light rays occasionally
    if (Math.random() < 0.05) {
      const rayCount = 3 + Math.floor(Math.random() * 3);
      const rayLength = 20 + Math.random() * 30;
      
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(Math.random() * Math.PI * 2);
      
      for (let i = 0; i < rayCount; i++) {
        const angle = (i / rayCount) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos(angle) * rayLength, Math.sin(angle) * rayLength);
        ctx.strokeStyle = 'rgba(255, 214, 0, 0.5)';
        ctx.lineWidth = 1 + Math.random();
        ctx.stroke();
      }
      ctx.restore();
    }
  }
  
  // Track mouse position for parallax
  let mouseX = width / 2;
  let mouseY = height / 2;
  document.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
  });
  
  // Animation loop with improved performance
  let time = 0;
  let lastFrameTime = 0;
  
  function animate(currentTime) {
    // Calculate delta time for smoother animation
    const deltaTime = currentTime - lastFrameTime;
    lastFrameTime = currentTime;
    
    // Only update time if we have a reasonable delta
    if (deltaTime < 100) { // Skip huge jumps
      time += deltaTime * 0.001;
    }
    
    ctx.clearRect(0, 0, width, height);
    
    // Draw nebulae in the background
    nebulae.forEach(nebula => {
      nebula.update(time);
      nebula.draw(ctx);
    });
    
    // Draw stars
    stars.forEach(star => {
      star.update(time, mouseX, mouseY);
      star.draw(ctx);
    });
    
    // Draw comets
    comets.forEach(comet => {
      comet.update();
      comet.draw(ctx);
    });
    
    // Draw galaxy center
    drawGalaxyCenter(ctx, time);
    
    // Draw planets
    planets.forEach(planet => {
      planet.update(time);
      planet.draw(ctx);
    });
    
    requestAnimationFrame(animate);
  }
  
  // Initialize and start animation
  initGalaxy();
  requestAnimationFrame(animate);
  
  // Responsive handling
  window.addEventListener('resize', () => {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    // Update width and height variables
    //width = canvas.width;
    //height = canvas.height;
    
    // Reinitialize galaxy
    initGalaxy();
  });
  
  // Add achievement counter animations with improved code
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counters = entry.target.querySelectorAll('.achievement-counter');
        counters.forEach(counter => {
          const target = parseInt(counter.getAttribute('data-count'), 10);
          animateCounter(counter, target);
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  
  // Observe the galaxy container
  const galaxyStats = document.querySelector('.galaxy-statistics');
  if (galaxyStats) {
    observer.observe(galaxyStats);
  }
  
  // Improved counter animation
  function animateCounter(element, target) {
    let current = 0;
    const duration = 1500; // 1.5 seconds
    const start = performance.now();
    
    function updateCounter(timestamp) {
      const elapsed = timestamp - start;
      const progress = Math.min(elapsed / duration, 1);
      
      // Use easeOutCubic for more natural counting effect
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      current = Math.floor(easedProgress * target);
      
      element.textContent = current + '+';
      
      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        element.textContent = target + '+';
      }
    }
    
    requestAnimationFrame(updateCounter);
  }
});

document.addEventListener('DOMContentLoaded', function () {
  console.log("DOM fully loaded ✅");

  const connectTerminal = document.getElementById('connect-terminal');
  console.log("connectTerminal found:", connectTerminal);

  if (connectTerminal) {
    connectTerminal.addEventListener('keydown', function (e) {
      console.log("Key pressed:", e.key);

      if (e.key === 'Enter') {
        e.preventDefault();
        const input = connectTerminal.value.trim().toLowerCase();
        console.log("User input:", input);

        let output = "";
        switch (input) {
          case "contact":
            output = "📧 Reach me at: your.email@example.com";
            break;
          case "linkedin":
            output = "🔗 https://linkedin.com/in/yourprofile";
            break;
          case "hello":
            output = "👋 Hello! Thanks for connecting.";
            break;
          default:
            output = "❌ Unknown command. Try: contact, linkedin, hello";
        }

        console.log("Output:", output);
        connectTerminal.value = output;

        // Reset after 3 seconds
        setTimeout(() => {
          connectTerminal.value = "";
        }, 3000);
      }
    });
  }
});
