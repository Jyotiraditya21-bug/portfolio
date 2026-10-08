/* ==========================================================================
   AESTHETIC PORTFOLIO ENGINE - EMERALD CYBERNETIC (main.js)
   ========================================================================== */

// --- EmailJS Credentials Config ---
// Replace these with your actual keys from emailjs.com
const EMAILJS_SERVICE_ID = "service_liq0auo";
const EMAILJS_TEMPLATE_ID = "template_bvkby4d";
const EMAILJS_PUBLIC_KEY = "JNexhLJcaLjAqPBFG";

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Initialize Lenis Smooth Scroll ---
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // easeOutExpo
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        smoothTouch: false,
        wheelMultiplier: 1,
        touchMultiplier: 2
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Lenis smooth scroll anchor link clicks
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);
            if (target) {
                lenis.scrollTo(target);
            }
        });
    });

    // --- 2. Spotlight Tracking with Fluid Spring Easing ---
    const heroSection = document.getElementById('home');
    const heroSpotlight = document.getElementById('hero-spotlight');
    
    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let currentX = targetX;
    let currentY = targetY;
    const lerpFactor = 0.08; // Soft, misty lag ease factor
    
    if (heroSection && heroSpotlight) {
        heroSection.addEventListener('mousemove', (e) => {
            const rect = heroSection.getBoundingClientRect();
            targetX = e.clientX - rect.left;
            targetY = e.clientY - rect.top;
        });
        
        // Dynamic spring animation loop
        function animateSpotlight() {
            currentX += (targetX - currentX) * lerpFactor;
            currentY += (targetY - currentY) * lerpFactor;
            
            heroSpotlight.style.setProperty('--mx', `${currentX}px`);
            heroSpotlight.style.setProperty('--my', `${currentY}px`);
            
            requestAnimationFrame(animateSpotlight);
        }
        animateSpotlight();
    }

    // --- 3. Aesthetic Cursor Follower ---
    const follower = document.getElementById('cursor-follower');
    let mousePos = { x: -100, y: -100 };
    let followerPos = { x: -100, y: -100 };
    const cursorSpeed = 0.15;
    
    document.addEventListener('mousemove', (e) => {
        mousePos.x = e.clientX;
        mousePos.y = e.clientY;
        if (follower && follower.style.opacity === '0') {
            follower.style.opacity = '1';
            followerPos.x = e.clientX;
            followerPos.y = e.clientY;
        }
    });

    document.addEventListener('mouseleave', () => {
        if (follower) follower.style.opacity = '0';
    });

    function animateCursor() {
        followerPos.x += (mousePos.x - followerPos.x) * cursorSpeed;
        followerPos.y += (mousePos.y - followerPos.y) * cursorSpeed;
        if (follower) {
            follower.style.transform = `translate3d(${followerPos.x}px, ${followerPos.y}px, 0) translate(-50%, -50%)`;
        }
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Attach hover listener for interactive classes
    function setupCursorHovers() {
        const interactives = document.querySelectorAll('a, button, .theme-toggle, #neural-canvas, input, textarea, .hud-btn');
        interactives.forEach(el => {
            el.addEventListener('mouseenter', () => {
                if (!follower) return;
                follower.classList.add('hovered');
                if (el.tagName === 'A' || el.tagName === 'BUTTON' || el.classList.contains('hud-btn')) {
                    follower.style.borderColor = 'transparent';
                    follower.style.backgroundColor = 'rgba(var(--accent-rgb), 0.15)';
                    follower.style.width = '48px';
                    follower.style.height = '48px';
                } else if (el.id === 'neural-canvas') {
                    follower.style.borderColor = 'var(--accent-2)';
                    follower.style.width = '32px';
                    follower.style.height = '32px';
                }
            });
            el.addEventListener('mouseleave', () => {
                if (!follower) return;
                follower.classList.remove('hovered');
                follower.style.borderColor = 'var(--accent)';
                follower.style.backgroundColor = 'transparent';
                follower.style.width = '20px';
                follower.style.height = '20px';
            });
        });
    }
    setupCursorHovers();

    // --- 4. Magnetic Hover Attraction ---
    const magneticElements = document.querySelectorAll('.magnetic');
    magneticElements.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left - (rect.width / 2);
            const y = e.clientY - rect.top - (rect.height / 2);
            
            // Subtle offset pull
            el.style.transform = `translate(${x * 0.35}px, ${y * 0.35}px)`;
        });
        
        el.addEventListener('mouseleave', () => {
            el.style.transform = 'translate(0px, 0px)';
        });
    });

    // --- 5. Theme Toggle Switcher ---
    const themeToggleBtn = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;
    
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
        htmlElement.setAttribute('data-theme', savedTheme);
    } else {
        const defaultTheme = systemPrefersDark ? 'dark' : 'light';
        htmlElement.setAttribute('data-theme', defaultTheme);
    }
    
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = htmlElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            htmlElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }

    // --- 6. Reveal-on-Scroll Observer ---
    const revealElements = document.querySelectorAll('.reveal, .reveal-heading');
    
    const revealObserverOptions = {
        root: null,
        threshold: 0.08, // Trigger slightly early
        rootMargin: '0px 0px -50px 0px' // Soft fade margin offset
    };
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in');
                
                // If stats are nested in this section, trigger progress bar fill
                const stats = entry.target.querySelectorAll('.stat-bar__fill');
                if (stats.length > 0) {
                    stats.forEach(bar => {
                        const progress = bar.getAttribute('data-progress');
                        bar.style.width = progress;
                    });
                }
                
                observer.unobserve(entry.target);
            }
        });
    }, revealObserverOptions);
    
    revealElements.forEach(element => {
        revealObserver.observe(element);
    });

    // --- 7. Navbar Scroll Polish ---
    const navbar = document.getElementById('main-nav');
    
    function polishNavbarOnScroll() {
        if (window.scrollY > 40) {
            navbar.classList.add('is-scrolled');
        } else {
            navbar.classList.remove('is-scrolled');
        }
    }
    
    window.addEventListener('scroll', polishNavbarOnScroll);
    polishNavbarOnScroll(); // Trigger initially

    // --- 8. Top Grid Navigation Active Section Syncing ---
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav__links a');
    
    const sectionObserverOptions = {
        root: null,
        threshold: 0.35 // Active when 35% of the section is visible
    };
    
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const currentActiveSectionId = entry.target.getAttribute('id');
                
                navLinks.forEach(link => {
                    const targetHref = link.getAttribute('href');
                    if (targetHref === `#${currentActiveSectionId}`) {
                        link.classList.add('active');
                        link.style.color = 'var(--text)'; // Highlight active link
                    } else {
                        link.classList.remove('active');
                        link.style.color = 'var(--text-mute)';
                    }
                });
            }
        });
    }, sectionObserverOptions);
    
    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    // --- 9. 3D Card Perspectival Tilt ---
    const cardViews = document.querySelectorAll('.pv');
    cardViews.forEach(card => {
        const wrapper = card.parentElement;
        wrapper.addEventListener('mousemove', (e) => {
            const rect = wrapper.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const xc = ((x / rect.width) - 0.5) * 2; // -1 to 1
            const yc = (((y / rect.height) - 0.5) * 2) * -1; // -1 to 1 (inverted Y)
            
            const tiltX = yc * 6; // Max 6deg
            const tiltY = xc * 6;
            
            card.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.02, 1.02, 1.02)`;
        });
        
        wrapper.addEventListener('mouseleave', () => {
            card.style.transform = 'rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        });
    });

    // --- 10. Neural Node Canvas Particle Animation & HUD Dashboard ---
    const canvas = document.getElementById('neural-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        let mouse = { x: null, y: null, active: false };
        let gravityAttractorActive = true;
        
        const labels = ['agent', 'llm', 'planner', 'memory', 'router', 'tool', 'reasoner', 'neural-link', 'generator', 'RAG'];
        
        function resizeCanvas() {
            const rect = canvas.getBoundingClientRect();
            const dpr = window.devicePixelRatio || 1;
            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;
            ctx.scale(dpr, dpr);
        }
        
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        
        const resizeObserver = new ResizeObserver(() => {
            resizeCanvas();
        });
        if (canvas.parentElement) {
            resizeObserver.observe(canvas.parentElement);
        }
        
        class Particle {
            constructor(x, y, label = '') {
                const dpr = window.devicePixelRatio || 1;
                const w = canvas.width / dpr;
                const h = canvas.height / dpr;
                
                this.x = x !== undefined ? x : Math.random() * w;
                this.y = y !== undefined ? y : Math.random() * h;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.radius = Math.random() * 2 + 2;
                this.label = label || (Math.random() < 0.35 ? labels[Math.floor(Math.random() * labels.length)] : '');
            }
            
            update() {
                const dpr = window.devicePixelRatio || 1;
                const w = canvas.width / dpr;
                const h = canvas.height / dpr;
                
                this.x += this.vx;
                this.y += this.vy;
                
                if (this.x < 0 || this.x > w) this.vx *= -1;
                if (this.y < 0 || this.y > h) this.vy *= -1;
                
                if (mouse.active && mouse.x !== null && mouse.y !== null && gravityAttractorActive) {
                    const dx = mouse.x - this.x;
                    const dy = mouse.y - this.y;
                    const dist = Math.hypot(dx, dy);
                    if (dist < 100) {
                        this.vx += (dx / dist) * 0.015;
                        this.vy += (dy / dist) * 0.015;
                        const speed = Math.hypot(this.vx, this.vy);
                        if (speed > 1.2) {
                            this.vx = (this.vx / speed) * 1.2;
                            this.vy = (this.vy / speed) * 1.2;
                        }
                    }
                }
            }
            
            draw() {
                const accentColor = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#dfc27d';
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = accentColor;
                
                // Pulsing glow ring
                const pulse = Math.sin(Date.now() * 0.0035 + this.x) * 0.3 + 0.7;
                ctx.shadowColor = accentColor;
                ctx.shadowBlur = 6 * pulse;
                ctx.fill();
                ctx.shadowBlur = 0;
                
                if (this.label) {
                    const textColor = getComputedStyle(document.documentElement).getPropertyValue('--text-mute').trim() || '#a3a3a3';
                    ctx.fillStyle = textColor;
                    ctx.font = '500 8.5px "JetBrains Mono", monospace';
                    ctx.fillText(this.label, this.x + 8, this.y + 3);
                }
            }
        }
        
        const dprVal = window.devicePixelRatio || 1;
        const initCount = 22;
        for (let i = 0; i < initCount; i++) {
            particles.push(new Particle());
        }
        
        canvas.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
            mouse.active = true;
        });
        
        canvas.addEventListener('mouseleave', () => {
            mouse.active = false;
        });
        
        canvas.addEventListener('click', (e) => {
            const rect = canvas.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const clickY = e.clientY - rect.top;
            
            for (let i = 0; i < 5; i++) {
                const label = labels[Math.floor(Math.random() * labels.length)];
                const p = new Particle(clickX, clickY, label);
                p.vx = (Math.random() - 0.5) * 1.8;
                p.vy = (Math.random() - 0.5) * 1.8;
                particles.push(p);
            }
            
            if (particles.length > 55) {
                particles.splice(0, particles.length - 55);
            }
            
            addLogTickerLine(`> click detected: spawned 5 agentic nodes`);
        });
        
        // Connect UI Buttons
        const gravityBtn = document.getElementById('hud-gravity-btn');
        const resetBtn = document.getElementById('hud-reset-btn');
        const tickerLogs = document.getElementById('ticker-logs');
        
        if (gravityBtn) {
            gravityBtn.classList.toggle('active', gravityAttractorActive);
            gravityBtn.addEventListener('click', () => {
                gravityAttractorActive = !gravityAttractorActive;
                gravityBtn.classList.toggle('active', gravityAttractorActive);
                addLogTickerLine(gravityAttractorActive ? '> cursor attractor: active' : '> cursor attractor: offline');
            });
        }
        
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                particles = [];
                for (let i = 0; i < initCount; i++) {
                    particles.push(new Particle());
                }
                addLogTickerLine('> agent network core reset complete');
            });
        }
        
        const logMessages = [
            'querying ChromaDB: matching embeddings...',
            'Tavily search API request sent...',
            'writer_agent: compiling citation blocks...',
            'LLM synthesis output: token streaming...',
            'routing agent state graph transition...',
            'local database: chromadb index updated',
            'cryptographic verification handshake...',
            'secured sockets: channel validated',
            'planner_agent: updating execution queue',
            'agent network: status green'
        ];
        
        function addLogTickerLine(text) {
            if (!tickerLogs) return;
            const newLine = document.createElement('div');
            newLine.className = 'ticker__line active-log';
            newLine.textContent = text;
            tickerLogs.appendChild(newLine);
            
            if (tickerLogs.children.length > 4) {
                tickerLogs.removeChild(tickerLogs.firstChild);
            }
            
            Array.from(tickerLogs.children).forEach((child, index) => {
                if (index < tickerLogs.children.length - 1) {
                    child.classList.remove('active-log');
                }
            });
            
            tickerLogs.scrollTop = tickerLogs.scrollHeight;
        }
        
        // Randomly add system logs every 4 seconds
        setInterval(() => {
            const msg = logMessages[Math.floor(Math.random() * logMessages.length)];
            addLogTickerLine(`> ${msg}`);
        }, 4000);
        
        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            const rgb = getComputedStyle(document.documentElement).getPropertyValue('--accent-rgb').trim() || '223, 194, 125';
            
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.hypot(dx, dy);
                    
                    if (dist < 80) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(${rgb}, ${0.16 * (1 - dist / 80)})`;
                        ctx.lineWidth = 0.75;
                        ctx.stroke();
                        
                        // Traveling data packets
                        const progress = (Date.now() * 0.00065 * (1 + (i % 3) * 0.35)) % 1;
                        const px = particles[i].x + (particles[j].x - particles[i].x) * progress;
                        const py = particles[i].y + (particles[j].y - particles[i].y) * progress;
                        
                        ctx.beginPath();
                        ctx.arc(px, py, 1.2, 0, Math.PI * 2);
                        ctx.fillStyle = `rgba(${rgb}, 0.8)`;
                        ctx.fill();
                    }
                }
                
                if (mouse.active && mouse.x !== null && mouse.y !== null && gravityAttractorActive) {
                    const dx = mouse.x - particles[i].x;
                    const dy = mouse.y - particles[i].y;
                    const dist = Math.hypot(dx, dy);
                    if (dist < 110) {
                        ctx.beginPath();
                        ctx.moveTo(mouse.x, mouse.y);
                        ctx.lineTo(particles[i].x, particles[i].y);
                        ctx.strokeStyle = `rgba(${rgb}, ${0.28 * (1 - dist / 110)})`;
                        ctx.lineWidth = 1;
                        ctx.stroke();
                    }
                }
            }
            
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            
            requestAnimationFrame(animate);
        }
        
        animate();
    }

    // Refresh cursor hover listeners since new buttons may have been rendered dynamically
    setTimeout(setupCursorHovers, 500);

    // --- 11. Cycle Active Nodes in Agentic Flow Visual ---
    const flowNodes = document.querySelectorAll('.flow-node');
    let activeNodeIndex = 0;
    
    function cycleFlowNodes() {
        if (flowNodes.length === 0) return;
        flowNodes.forEach((node, idx) => {
            node.classList.toggle('active', idx === activeNodeIndex);
        });
        activeNodeIndex = (activeNodeIndex + 1) % flowNodes.length;
    }
    
    // Cycle every 2.5 seconds
    setInterval(cycleFlowNodes, 2500);

});

// --- 11. Form Submission via EmailJS (Secured Cybernetic Beacon Signal) ---
function handleFormSubmit() {
    const feedback = document.getElementById('form-feedback');
    const submitBtn = document.getElementById('form-submit-btn');
    const nameInput = document.getElementById('form-name');
    const emailInput = document.getElementById('form-email');
    const msgInput = document.getElementById('form-message');
    
    if (!feedback || !submitBtn) return;
    
    // Check if EmailJS credentials are configured
    if (EMAILJS_SERVICE_ID === "YOUR_SERVICE_ID" || EMAILJS_TEMPLATE_ID === "YOUR_TEMPLATE_ID" || EMAILJS_PUBLIC_KEY === "YOUR_PUBLIC_KEY") {
        feedback.classList.remove('hidden', 'success');
        feedback.style.color = '#ef4444';
        feedback.textContent = 'ERROR: EMAILJS CREDENTIALS NOT CONFIGURED IN MAIN.JS.';
        console.error('Please configure your EmailJS credentials (EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, EMAILJS_PUBLIC_KEY) at the top of main.js');
        return;
    }
    
    feedback.classList.remove('hidden', 'success');
    feedback.style.color = ''; // Reset custom color inline overrides
    feedback.textContent = 'TRANSMITTING SECURED BEACON SIGNAL...';
    submitBtn.disabled = true;
    
    // Aesthetic step delay before firing network request
    setTimeout(() => {
        feedback.textContent = 'CONNECTING COMPUTATION MATRIX...';
        
        fetch("https://api.emailjs.com/api/v1.0/email/send", {
            method: "POST",
            headers: { 
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                service_id: EMAILJS_SERVICE_ID,
                template_id: EMAILJS_TEMPLATE_ID,
                user_id: EMAILJS_PUBLIC_KEY,
                template_params: {
                    from_name: nameInput ? nameInput.value : '',
                    reply_to: emailInput ? emailInput.value : '',
                    message: msgInput ? msgInput.value : ''
                }
            })
        })
        .then(response => {
            if (response.ok) {
                return response.text();
            }
            return response.text().then(errText => {
                throw new Error(errText || 'Network response was not ok.');
            });
        })
        .then(data => {
            feedback.classList.add('success');
            feedback.textContent = 'TRANSMISSION SECURED successfully! CYBERNETIC LINK ONLINE.';
            
            if (nameInput) nameInput.value = '';
            if (emailInput) emailInput.value = '';
            if (msgInput) msgInput.value = '';
            
            setTimeout(() => {
                feedback.classList.add('hidden');
                submitBtn.disabled = false;
            }, 5000);
        })
        .catch(error => {
            console.error('Submission error:', error);
            feedback.style.color = '#ef4444'; // Red error alert color
            feedback.textContent = 'TRANSMISSION FAILED. PLEASE TRY AGAIN OR EMAIL DIRECTLY.';
            submitBtn.disabled = false;
            
            setTimeout(() => {
                feedback.classList.add('hidden');
            }, 6000);
        });
    }, 1000);
}

// --- RepoMind Repo Tree Scanner Animation ---
(function initRepoMindTree() {
    const tree = document.getElementById('rm-tree');
    if (!tree) return;

    const statusEl      = document.getElementById('rm-status');
    const filesEl       = document.getElementById('rm-files-scanned');
    const classesEl     = document.getElementById('rm-classes');
    const doneEl        = document.getElementById('rm-done');
    const progressFill  = document.getElementById('rm-progress-fill');

    // Only scan .rm-file rows (not dirs / root)
    const fileRows = Array.from(tree.querySelectorAll('.rm-row.rm-file'));
    const TOTAL    = fileRows.length; // 9 files

    let currentIdx    = 0;
    let filesScanned  = 0;
    let classCount    = 0;
    let scanTimer     = null;
    let started       = false;

    const CLASS_COUNTS = [3, 2, 1, 1, 2, 1, 0, 0, 0]; // per file

    function resetTree() {
        fileRows.forEach(row => {
            row.classList.remove('rm-scanning', 'rm-scanned');
            const ann = row.querySelector('.rm-ann');
            if (ann) { ann.style.display = 'none'; ann.classList.remove('visible'); }
        });
        currentIdx   = 0;
        filesScanned = 0;
        classCount   = 0;
        if (filesEl)      filesEl.textContent   = '0';
        if (classesEl)    classesEl.textContent  = '0';
        if (progressFill) progressFill.style.width = '0%';
        if (doneEl)       { doneEl.textContent = 'indexing…'; doneEl.style.color = '#4ade80'; }
        if (statusEl)     statusEl.textContent  = '● scanning';
    }

    function scanNext() {
        if (currentIdx >= TOTAL) {
            // All done
            if (statusEl)  statusEl.textContent = '● indexed';
            if (doneEl)    { doneEl.textContent = 'complete ✓'; doneEl.style.color = '#a3e635'; }

            // Restart after 3s
            scanTimer = setTimeout(() => {
                resetTree();
                scanTimer = setTimeout(scanNext, 400);
            }, 3200);
            return;
        }

        const row = fileRows[currentIdx];

        // Remove scanning from previous
        if (currentIdx > 0) {
            fileRows[currentIdx - 1].classList.remove('rm-scanning');
            fileRows[currentIdx - 1].classList.add('rm-scanned');
            // Show annotation badge on previous row with slight delay
            const prevAnn = fileRows[currentIdx - 1].querySelector('.rm-ann');
            if (prevAnn) {
                prevAnn.style.display = 'inline-block';
                requestAnimationFrame(() => {
                    setTimeout(() => prevAnn.classList.add('visible'), 60);
                });
            }
        }

        // Activate current row
        row.classList.add('rm-scanning');

        // Update counters
        filesScanned++;
        classCount += CLASS_COUNTS[currentIdx] || 0;
        if (filesEl)      filesEl.textContent   = filesScanned;
        if (classesEl)    classesEl.textContent  = classCount;
        if (progressFill) progressFill.style.width = `${(filesScanned / TOTAL) * 100}%`;

        currentIdx++;

        // Speed varies slightly per row for realism
        const delay = 520 + Math.random() * 340;
        scanTimer = setTimeout(scanNext, delay);
    }

    function startScan() {
        if (started) return;
        started = true;
        resetTree();
        // Small initial pause so user notices the card before it starts
        scanTimer = setTimeout(scanNext, 900);
    }

    // Kick off when section scrolls into view
    const observer = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) {
            startScan();
            observer.disconnect();
        }
    }, { threshold: 0.15 });
    observer.observe(tree);
})();


