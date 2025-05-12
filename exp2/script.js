// Initialize AOS
        AOS.init({
            duration: 1000,
            once: true,
            mirror: false
        });

        // Custom Cursor
        const cursor = document.querySelector('.custom-cursor');
        const cursorDot = document.querySelector('.cursor-dot');

        document.addEventListener('mousemove', (e) => {
            cursor.style.transform = `translate(${e.clientX - 10}px, ${e.clientY - 10}px)`;
            cursorDot.style.transform = `translate(${e.clientX - 2}px, ${e.clientY - 2}px)`;
        });

        // Particles.js Configuration
        particlesJS('particles-js', {
            particles: {
                number: { value: 80, density: { enable: true, value_area: 800 } },
                color: { value: '#5e17eb' },
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
                    color: '#5e17eb',
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

        // Add hover effect to all interactive elements
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
                ctx.fillStyle = 'rgba(94, 23, 235, 0.5)';
                ctx.fill();
                
                particles.forEach(p2 => {
                    const dx = particle.x - p2.x;
                    const dy = particle.y - p2.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if(distance < 100) {
                        ctx.beginPath();
                        ctx.moveTo(particle.x, particle.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.strokeStyle = `rgba(94, 23, 235, ${1 - distance/100})`;
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
                        ctx.fillStyle = `rgba(94, 23, 235, ${0.3 - index * 0.05})`;
                        ctx.fill();
                        
                        particles.forEach(p2 => {
                            const dx = particle.x - p2.x;
                            const dy = particle.y - p2.y;
                            const distance = Math.sqrt(dx * dx + dy * dy);
                            
                            if(distance < 100) {
                                ctx.beginPath();
                                ctx.moveTo(particle.x, particle.y);
                                ctx.lineTo(p2.x, p2.y);
                                ctx.strokeStyle = `rgba(94, 23, 235, ${(1 - distance/100) * (0.3 - index * 0.05)})`;
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
            roleElement.style.animation = 'typing 3.5s steps(30, end), blink .75s step-end infinite';
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
                background: #5e17eb;
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

        // 3D text rotation effect
        document.querySelector('.hero-3d-text').addEventListener('mousemove', (e) => {
            const bounds = e.target.getBoundingClientRect();
            const mouseX = e.clientX - bounds.left;
            const mouseY = e.clientY - bounds.top;
            const centerX = bounds.width / 2;
            const centerY = bounds.height / 2;
            
            const angleX = (mouseY - centerY) / 25;
            const angleY = (centerX - mouseX) / 25;
            
            gsap.to('.hero-name', {
                duration: 0.5,
                rotateX: -angleX,
                rotateY: angleY,
                transform: 'perspective(1000px)',
                ease: 'power1.out'
            });
        });

        document.querySelector('.hero-3d-text').addEventListener('mouseleave', () => {
            gsap.to('.hero-name', {
                duration: 0.5,
                rotateX: 0,
                rotateY: 0,
                ease: 'power1.out'
            });
        });

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
                        color: { value: '#5e17eb' },
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
                            color: '#5e17eb',
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
                        color: { value: '#5e17eb' },
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
                            color: '#5e17eb',
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
                    "git commit -m 'Always improving my skills'",
                    "python -c 'import talent; print(talent.level)'",
                    "./deploy_creativity.sh --force",
                    "docker run -d --name future dreams:latest"
                ];
                
                let commandIndex = 0;
                
                function cycleCommand() {
                    terminalText.style.animation = 'none';
                    terminalText.offsetHeight; // Force reflow
                    
                    // Set new command
                    terminalText.textContent = commands[commandIndex];
                    commandIndex = (commandIndex + 1) % commands.length;
                    
                    // Restart animation
                    terminalText.style.animation = 'typing 3s steps(40) forwards, blink 1s step-end infinite';
                    
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
                        holoName.style.textShadow = `0 0 ${15 * glowIntensity}px rgba(94, 23, 235, ${0.5 * glowIntensity + 0.5})`;
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
                        holoName.style.textShadow = '0 0 15px rgba(94, 23, 235, 0.5)';
                    }
                });
                
                // Make skill orbs interactive with enhanced effects
                const skillOrbs = document.querySelectorAll('.skill-orb');
                skillOrbs.forEach(orb => {
                    orb.addEventListener('mouseenter', () => {
                        orb.style.transform = 'scale(1.5) translateZ(40px)';
                        orb.style.boxShadow = '0 0 30px rgba(94, 23, 235, 0.9)';
                        orb.querySelector('i').style.transform = 'rotate(360deg)';
                    });
                    
                    orb.addEventListener('mouseleave', () => {
                        orb.style.transform = 'scale(1) translateZ(0)';
                        orb.style.boxShadow = '0 0 15px rgba(94, 23, 235, 0.6)';
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
                    vx: (Math.random() - 0.5) * nodeSpeed,
                    vy: (Math.random() - 0.5) * nodeSpeed
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
                    ctx.fillStyle = 'rgba(94, 23, 235, 0.6)';
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
                            ctx.strokeStyle = `rgba(94, 23, 235, ${1 - distance/connectionDistance})`;
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
                for (let j = 0; j < 20; j++) {
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
                    ${x * 10 - 5}px ${y * 10 - 5}px 15px rgba(94, 23, 235, 0.3),
                    ${-x * 10 + 5}px ${-y * 10 + 5}px 15px rgba(156, 85, 255, 0.3)
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
                    background: linear-gradient(45deg, #5e17eb, #9c55ff, #4a11c9, #7c3aed);
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
                    background: rgba(94, 23, 235, 0.5);
                    transform: scale(1);
                    opacity: 0;
                `;
                introCta.insertAdjacentElement('afterend', pulseElement);
                
                // 3. Add hover state effects
                introCta.addEventListener('mouseenter', function() {
                    introCta.style.transform = 'translateY(-5px) scale(1.05)';
                    introCta.style.boxShadow = '0 10px 25px rgba(94, 23, 235, 0.4)';
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
                            box-shadow: 0 0 10px #5e17eb;
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
                        const hue = 260 + Math.random() * 60; // Purple to violet hues
                        
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
                        
                        introCta.style.boxShadow = `0 0 ${15 * glowIntensity}px rgba(94, 23, 235, ${0.3 * glowIntensity + 0.2})`;
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

// Neural Network Background Animation
class NeuralNetwork {
    constructor() {
        this.canvas = document.getElementById('networkCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.resizeCanvas();
        this.nodes = [];
        this.connections = [];
        this.animationFrame = null;
        
        this.init();
        this.animate();
        
        window.addEventListener('resize', () => this.resizeCanvas());
    }
    
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    init() {
        // Create nodes
        const numNodes = Math.floor(window.innerWidth * window.innerHeight / 50000);
        
        for(let i = 0; i < numNodes; i++) {
            this.nodes.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                radius: Math.random() * 2 + 1
            });
        }
    }
    
    drawNode(node) {
        this.ctx.beginPath();
        this.ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        this.ctx.fillStyle = 'rgba(94, 23, 235, 0.5)';
        this.ctx.fill();
    }
    
    drawConnections(node1, node2, distance) {
        const opacity = 1 - (distance / 150);
        if(opacity > 0) {
            this.ctx.beginPath();
            this.ctx.moveTo(node1.x, node1.y);
            this.ctx.lineTo(node2.x, node2.y);
            this.ctx.strokeStyle = `rgba(94, 23, 235, ${opacity * 0.5})`;
            this.ctx.lineWidth = opacity;
            this.ctx.stroke();
        }
    }
    
    updateNodes() {
        this.nodes.forEach(node => {
            node.x += node.vx;
            node.y += node.vy;
            
            // Bounce off walls
            if(node.x < 0 || node.x > this.canvas.width) node.vx *= -1;
            if(node.y < 0 || node.y > this.canvas.height) node.vy *= -1;
        });
    }
    
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw connections
        this.nodes.forEach((node1, i) => {
            this.nodes.slice(i + 1).forEach(node2 => {
                const distance = Math.hypot(node1.x - node2.x, node1.y - node2.y);
                if(distance < 150) {
                    this.drawConnections(node1, node2, distance);
                }
            });
        });
        
        // Draw nodes
        this.nodes.forEach(node => this.drawNode(node));
    }
    
    animate() {
        this.updateNodes();
        this.draw();
        this.animationFrame = requestAnimationFrame(() => this.animate());
    }
    
    destroy() {
        if(this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
    }
}

// Initialize the neural network background when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const neuralNetwork = new NeuralNetwork();
});
