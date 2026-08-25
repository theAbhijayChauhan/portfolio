// ╔══════════════════════════════════════════════════════════════════════════════╗
// ║  PORTFOLIO ENHANCEMENTS — Independent Module Logic                           ║
// ║  Implements:                                                                 ║
// ║  1. Left Social Bar & Right Magnetic Navigation Tracker                       ║
// ║  2. Command Palette / Spotlight Launcher (Ctrl+K) with Matrix controls       ║
// ║  3. Matrix Digital Rain Screen Effect (Toggleable On / Off)                   ║
// ║  4. Mouse Spotlight Gradient & Ambient Floating Blobs                         ║
// ║  5. Interactive DevOps Wire Connector Mini-Game                              ║
// ║  6. Red Glowing & Fading Theme Loop Dot on Navbar (Auto-Matrix Rain)          ║
// ╚══════════════════════════════════════════════════════════════════════════════╝

(function () {
    'use strict';

    // State
    let isMatrixActive = false;
    let matrixInterval = null;

    // ── INITIALIZE MODULES ON DOM CONTENT LOADED ──
    window.addEventListener('DOMContentLoaded', () => {
        const S = (window.CONFIG && window.CONFIG.showSections) ? window.CONFIG.showSections : {};

        if (S.sideWidgets !== false) initSideWidgets();
        if (S.commandPalette !== false) initCommandPalette();
        if (S.matrixRain !== false) initMatrixRain();
        if (S.cardSpotlight !== false) initSpotlightAndBlobs();
        if (S.miniGame !== false) initWireMiniGame();
        if (S.themeToggle !== false) initThemeToggleBtn();
        if (S.dynamicIsland !== false) initDynamicIsland();
        if (S.resumeDrawer !== false) initResumeDrawer();
        if (S.skillRadarChart !== false) initSkillRadarChart();
    });

    // ════════════════════════════════════════════════════════
    // 1. FLOATING SIDE MARGIN WIDGETS & MAGNETIC NAV
    // ════════════════════════════════════════════════════════
    function initSideWidgets() {
        // Left Social Bar
        const leftWidget = document.createElement('div');
        leftWidget.className = 'side-widget-left';
        leftWidget.innerHTML = `
            <div class="side-status-indicator" title="System Operational" onclick="if(window.showToast) window.showToast('🟢 System status: 100% Operational')"></div>
            <div class="side-vertical-line"></div>
            <a href="https://github.com/theAbhijayChauhan" target="_blank" class="side-social-icon" title="GitHub"><i class="fab fa-github"></i></a>
            <a href="https://linkedin.com/in/abhijaychauhan" target="_blank" class="side-social-icon" title="LinkedIn"><i class="fab fa-linkedin-in"></i></a>
            <a href="mailto:abhijaychauhan.dev@gmail.com" class="side-social-icon email-icon-tooltip" aria-label="abhijaychauhan.dev@gmail.com"><i class="fas fa-envelope"></i></a>
        `;
        document.body.appendChild(leftWidget);

        // Right Magnetic Nav Tracker
        const rightWidget = document.createElement('div');
        rightWidget.className = 'side-widget-right';

        const sections = [
            { id: 'home', label: 'Home' },
            { id: 'about', label: 'About' },
            { id: 'skills', label: 'Skills' },
            { id: 'projects', label: 'Projects' },
            { id: 'education', label: 'Education' },
            { id: 'certifications', label: 'Certs' },
            { id: 'achievements', label: 'Achievements' },
            { id: 'contact', label: 'Contact' }
        ];

        let navHTML = '';
        sections.forEach(sec => {
            navHTML += `
                <div class="nav-dot-container" data-sec="${sec.id}" onclick="document.getElementById('${sec.id}')?.scrollIntoView({behavior:'smooth'})">
                    <div class="nav-dot"></div>
                    <span class="nav-dot-tooltip">${sec.label}</span>
                </div>
            `;
        });

        navHTML += `
            <div class="side-vertical-line"></div>
            <div class="quick-action-btn" title="Command Palette (Ctrl+K)" onclick="window.openCmdPalette()">
                <i class="fas fa-terminal"></i>
            </div>
            <div class="quick-action-btn" title="SSL Certificate Expiry Runner Game" onclick="window.openWireGame()">
                <i class="fas fa-gamepad"></i>
            </div>
        `;

        rightWidget.innerHTML = navHTML;
        document.body.appendChild(rightWidget);

        // Magnetic Active Section Calculator (Snaps to nearest section on scroll)
        function updateMagneticActiveSection() {
            const containers = rightWidget.querySelectorAll('.nav-dot-container');
            const midScreen = window.scrollY + (window.innerHeight / 2);
            let closestSec = null;
            let minDistance = Infinity;

            sections.forEach(sec => {
                const el = document.getElementById(sec.id);
                if (el && el.offsetWidth > 0 && el.offsetHeight > 0) {
                    const rect = el.getBoundingClientRect();
                    const secCenter = window.scrollY + rect.top + (rect.height / 2);
                    const distance = Math.abs(midScreen - secCenter);

                    if (distance < minDistance) {
                        minDistance = distance;
                        closestSec = sec.id;
                    }
                }
            });

            if (closestSec) {
                containers.forEach(c => {
                    if (c.getAttribute('data-sec') === closestSec) {
                        c.classList.add('active');
                    } else {
                        c.classList.remove('active');
                    }
                });
            }
        }

        window.addEventListener('scroll', updateMagneticActiveSection, { passive: true });
        updateMagneticActiveSection();
    }

    // ════════════════════════════════════════════════════════
    // 2. COMMAND PALETTE MODAL & MATRIX CONTROLS
    // ════════════════════════════════════════════════════════
    function initCommandPalette() {
        const backdrop = document.createElement('div');
        backdrop.className = 'cmd-palette-backdrop';
        backdrop.id = 'cmdPalette';

        backdrop.innerHTML = `
            <div class="cmd-palette-modal">
                <div class="cmd-input-container">
                    <i class="fas fa-search cmd-search-icon"></i>
                    <input type="text" class="cmd-input" id="cmdInput" placeholder="Search commands, themes, matrix, or sections..." autocomplete="off">
                    <span class="cmd-kbd-badge">ESC to close</span>
                </div>
                <div class="cmd-results-list" id="cmdResults"></div>
                <div class="cmd-footer">
                    <span>Navigation: <kbd class="cmd-kbd-badge">↑</kbd> <kbd class="cmd-kbd-badge">↓</kbd> <kbd class="cmd-kbd-badge">Enter</kbd></span>
                    <span>Cyber Command v2.0</span>
                </div>
            </div>
        `;
        document.body.appendChild(backdrop);

        const input = document.getElementById('cmdInput');
        const results = document.getElementById('cmdResults');

        function getCommands() {
            return [
                {
                    icon: isMatrixActive ? 'fas fa-stop-circle' : 'fas fa-play-circle',
                    title: isMatrixActive ? '🛑 Stop Matrix Digital Rain Effect' : '🌧️ Start Matrix Digital Rain Effect',
                    category: 'Matrix Effect',
                    action: () => window.toggleMatrixRain()
                },
                { icon: 'fas fa-palette', title: 'Theme: Electric Mint (Default)', category: 'Theme', action: () => setTheme('default') },
                { icon: 'fas fa-adjust', title: 'Theme: Cyberpunk Neon', category: 'Theme', action: () => setTheme('cyberpunk') },
                { icon: 'fas fa-terminal', title: 'Theme: Matrix Green (Rain)', category: 'Theme', action: () => setTheme('matrix') },
                { icon: 'fas fa-moon', title: 'Theme: Midnight OLED', category: 'Theme', action: () => setTheme('oled') },
                { icon: 'fas fa-sun', title: 'Theme: Solarized Amber', category: 'Theme', action: () => setTheme('amber') },
                { icon: 'fas fa-gamepad', title: 'Play DevOps Node Wire Game', category: 'Game', action: () => window.openWireGame() },
                { icon: 'fas fa-file-download', title: 'Download Resume PDF', category: 'Action', action: () => document.getElementById('resumeLink')?.click() },
                { icon: 'fas fa-user', title: 'Jump to About Me', category: 'Navigation', action: () => scrollTo('about') },
                { icon: 'fas fa-laptop-code', title: 'Jump to Skills', category: 'Navigation', action: () => scrollTo('skills') },
                { icon: 'fas fa-layer-group', title: 'Jump to Projects', category: 'Navigation', action: () => scrollTo('projects') },
                { icon: 'fas fa-graduation-cap', title: 'Jump to Education', category: 'Navigation', action: () => scrollTo('education') },
                { icon: 'fas fa-certificate', title: 'Jump to Certifications', category: 'Navigation', action: () => scrollTo('certifications') },
                { icon: 'fas fa-trophy', title: 'Jump to Achievements', category: 'Navigation', action: () => scrollTo('achievements') },
                { icon: 'fas fa-envelope', title: 'Jump to Contact', category: 'Navigation', action: () => scrollTo('contact') },
            ];
        }

        function renderResults(filter = '') {
            results.innerHTML = '';
            const commandsList = getCommands();
            const filtered = commandsList.filter(c => c.title.toLowerCase().includes(filter.toLowerCase()) || c.category.toLowerCase().includes(filter.toLowerCase()));

            if (filtered.length === 0) {
                results.innerHTML = `<div class="cmd-item" style="color:var(--muted)">No matching commands found</div>`;
                return;
            }

            filtered.forEach((cmd, idx) => {
                const item = document.createElement('div');
                item.className = `cmd-item ${idx === 0 ? 'selected' : ''}`;
                item.innerHTML = `
                    <div class="cmd-item-left">
                        <div class="cmd-item-icon"><i class="${cmd.icon}"></i></div>
                        <span>${cmd.title}</span>
                    </div>
                    <span class="cmd-item-tag">${cmd.category}</span>
                `;
                item.onclick = () => {
                    cmd.action();
                    closePalette();
                };
                results.appendChild(item);
            });
        }

        function scrollTo(id) {
            document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
        }

        function setTheme(name) {
            document.body.className = name === 'default' ? '' : `theme-${name}`;
            if (name === 'matrix') {
                if (!isMatrixActive && window.toggleMatrixRain) window.toggleMatrixRain();
            } else {
                if (isMatrixActive && window.toggleMatrixRain) window.toggleMatrixRain();
            }
            if (window.showToast) window.showToast(`Theme changed to ${name.toUpperCase()}`);
        }

        window.openCmdPalette = () => {
            backdrop.classList.add('active');
            input.value = '';
            renderResults();
            setTimeout(() => input.focus(), 80);
        };

        function closePalette() {
            backdrop.classList.remove('active');
        }

        input.addEventListener('input', e => renderResults(e.target.value));

        document.addEventListener('keydown', e => {
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
                e.preventDefault();
                backdrop.classList.contains('active') ? closePalette() : window.openCmdPalette();
            } else if (e.key === 'Escape' && backdrop.classList.contains('active')) {
                closePalette();
            }
        });

        backdrop.addEventListener('click', e => {
            if (e.target === backdrop) closePalette();
        });
    }

    // ════════════════════════════════════════════════════════
    // 3. MATRIX DIGITAL RAIN EFFECT (CANVAS)
    // ════════════════════════════════════════════════════════
    function initMatrixRain() {
        const canvas = document.createElement('canvas');
        canvas.id = 'matrixCanvas';
        document.body.appendChild(canvas);

        const ctx = canvas.getContext('2d');

        window.toggleMatrixRain = () => {
            isMatrixActive = !isMatrixActive;
            canvas.classList.toggle('active', isMatrixActive);

            if (isMatrixActive) {
                startMatrix();
                if (window.showToast) window.showToast('🌧️ Matrix Digital Rain: ON');
            } else {
                clearInterval(matrixInterval);
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                if (window.showToast) window.showToast('🛑 Matrix Digital Rain: OFF');
            }
        };

        function startMatrix() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            const letters = '01ABCDEFGHIJKLMNOPQRSTUVWXYZ@#$%&*';
            const fontSize = 14;
            const columns = Math.floor(canvas.width / fontSize);
            const drops = Array(columns).fill(1);

            clearInterval(matrixInterval);
            matrixInterval = setInterval(() => {
                ctx.fillStyle = 'rgba(8, 11, 18, 0.06)';
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                ctx.fillStyle = '#00ffc8';
                ctx.font = `${fontSize}px monospace`;

                for (let i = 0; i < drops.length; i++) {
                    const text = letters.charAt(Math.floor(Math.random() * letters.length));
                    ctx.fillText(text, i * fontSize, drops[i] * fontSize);

                    if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                        drops[i] = 0;
                    }
                    drops[i]++;
                }
            }, 33);
        }

        window.addEventListener('resize', () => {
            if (isMatrixActive) {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
            }
        }, { passive: true });
    }

    // ════════════════════════════════════════════════════════
    // 4. MOUSE SPOTLIGHT GRADIENT & AMBIENT BLOBS
    // ════════════════════════════════════════════════════════
    function initSpotlightAndBlobs() {
        const b1 = document.createElement('div');
        b1.className = 'ambient-blob-1';
        const b2 = document.createElement('div');
        b2.className = 'ambient-blob-2';
        document.body.appendChild(b1);
        document.body.appendChild(b2);

        const cards = document.querySelectorAll('.skill-card, .project-card, .cert-card, .achievement-card');
        cards.forEach(card => {
            const spotlight = document.createElement('div');
            spotlight.className = 'card-spotlight';
            card.appendChild(spotlight);

            card.addEventListener('mousemove', e => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                card.style.setProperty('--mouse-x', `${x}px`);
                card.style.setProperty('--mouse-y', `${y}px`);
            }, { passive: true });
        });
    }

    // ════════════════════════════════════════════════════════
    // 5. MODERN SSL CERTIFICATE EXPIRY RUNNER GAME
    // ════════════════════════════════════════════════════════
    function initWireMiniGame() {
        const gameBackdrop = document.createElement('div');
        gameBackdrop.className = 'game-modal-backdrop';
        gameBackdrop.id = 'wireGameModal';

        gameBackdrop.innerHTML = `
            <div class="game-card ssl-runner-card" style="max-width: 660px; width: 95vw; background: rgba(13, 17, 23, 0.96); border: 1px solid var(--accent); border-radius: 16px; padding: 20px; box-shadow: 0 0 35px rgba(0, 255, 200, 0.25); position: relative;">
                <button class="game-close-btn" onclick="window.closeWireGame()" style="position: absolute; top: 14px; right: 18px; background: none; border: none; color: var(--text-dim); font-size: 22px; cursor: pointer;">&times;</button>
                
                <div class="game-title" style="font-family: 'Space Grotesk', sans-serif; font-size: 1.15rem; font-weight: 700; color: #ffffff; display: flex; align-items: center; gap: 10px; padding-right: 36px; flex-wrap: wrap;">
                    <i class="fas fa-gamepad" style="color: var(--accent);"></i> SSL Certificate Expiry Runner
                    <span style="font-size: 0.7rem; background: rgba(245, 158, 11, 0.15); color: #f59e0b; border: 1px solid rgba(245, 158, 11, 0.4); padding: 2px 8px; border-radius: 10px; font-family: 'JetBrains Mono', monospace;">CYBER RUNNER</span>
                </div>
                <div class="game-subtitle" style="font-size: 0.78rem; color: var(--text-dim); margin-top: 4px; margin-bottom: 12px;">
                    Jump over <strong>Expired 404s</strong>, Crouch under <strong>502 Gateways</strong>, and collect <strong>Yellow SSL Certificates</strong> to keep HTTPS active!
                </div>

                <!-- HUD BAR -->
                <div style="display: flex; justify-content: space-between; align-items: center; background: #080d18; border: 1px solid var(--border); border-radius: 10px; padding: 8px 14px; margin-bottom: 10px; font-family: 'JetBrains Mono', monospace; font-size: 0.78rem;">
                    <div>SCORE: <strong id="sslScore" style="color: var(--accent);">0</strong></div>
                    <div>SECURITY: <strong id="sslHealth" style="color: #00ffc8;">100%</strong></div>
                    <div>CERTS: <strong id="sslCerts" style="color: #f59e0b;">0</strong></div>
                    <div>HIGH SCORE: <strong id="sslHighScore" style="color: #a855f7;">0</strong></div>
                </div>

                <!-- CANVAS CONTAINER -->
                <div style="position: relative; width: 100%; height: 230px; background: #060911; border: 1px solid var(--border); border-radius: 12px; overflow: hidden;">
                    <canvas id="sslCanvas" style="width: 100%; height: 100%; display: block;"></canvas>
                    
                    <!-- OVERLAY START / GAME OVER -->
                    <div id="sslOverlay" style="position: absolute; inset: 0; background: rgba(6, 9, 17, 0.88); backdrop-filter: blur(4px); display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 15px;">
                        <h3 id="sslOverlayTitle" style="font-family: 'Space Grotesk', sans-serif; font-size: 1.3rem; color: var(--accent); margin-bottom: 6px;">🚀 READY TO RUN?</h3>
                        <p id="sslOverlayDesc" style="font-size: 0.8rem; color: var(--text-dim); margin-bottom: 14px;">Press <strong>SPACEBAR / UP</strong> to Jump. <strong>DOWN</strong> to Crouch!</p>
                        <button id="sslStartBtn" class="btn-primary" style="padding: 10px 24px; font-size: 0.85rem; font-weight: 700;">START RUNNER</button>
                    </div>
                </div>

                <!-- HUD CONTROLS FOR MOUSE USERS -->
                <div style="display: flex; gap: 10px; margin-top: 10px;">
                    <button id="sslJumpBtn" class="btn-primary" style="flex: 1; padding: 10px; font-weight: 700; font-size: 0.8rem; background: rgba(0, 255, 200, 0.15); border-color: var(--accent); color: var(--accent);">🚀 JUMP [SPACE / UP]</button>
                    <button id="sslSlideBtn" class="btn-primary" style="flex: 1; padding: 10px; font-weight: 700; font-size: 0.8rem; background: rgba(245, 158, 11, 0.15); border-color: #f59e0b; color: #f59e0b;">⚡ CROUCH / SLIDE [DOWN]</button>
                </div>
            </div>
        `;
        document.body.appendChild(gameBackdrop);

        const canvas = gameBackdrop.querySelector('#sslCanvas');
        const ctx = canvas.getContext('2d');
        const overlay = gameBackdrop.querySelector('#sslOverlay');
        const overlayTitle = gameBackdrop.querySelector('#sslOverlayTitle');
        const overlayDesc = gameBackdrop.querySelector('#sslOverlayDesc');
        const startBtn = gameBackdrop.querySelector('#sslStartBtn');
        const jumpBtn = gameBackdrop.querySelector('#sslJumpBtn');
        const slideBtn = gameBackdrop.querySelector('#sslSlideBtn');

        const scoreEl = gameBackdrop.querySelector('#sslScore');
        const healthEl = gameBackdrop.querySelector('#sslHealth');
        const certsEl = gameBackdrop.querySelector('#sslCerts');
        const highScoreEl = gameBackdrop.querySelector('#sslHighScore');

        let animFrameId = null;
        let isRunning = false;

        let score = 0;
        let health = 100;
        let certsCount = 0;
        let highScore = parseInt(localStorage.getItem('sslRunnerHighScore') || '0', 10);
        if (highScoreEl) highScoreEl.textContent = highScore;

        // Player physics
        const groundY = 150;
        let player = {
            x: 60,
            y: groundY,
            w: 28,
            h: 44,
            vy: 0,
            gravity: 0.85,
            jumpPower: -13.5,
            isJumping: false,
            isCrouching: false,
            jumpsLeft: 2,
            shieldTimer: 0
        };

        let obstacles = [];
        let collectibles = [];
        let particles = [];
        let floatingTexts = [];
        let gameSpeed = 5.5;
        let frameCount = 0;

        // INSTANT OPEN WITHOUT ARTIFICIAL TIMEOUT DELAY
        window.openWireGame = () => {
            gameBackdrop.classList.add('active');
            canvas.width = canvas.parentElement.clientWidth || 620;
            canvas.height = canvas.parentElement.clientHeight || 230;
            showOverlay('🚀 READY TO RUN?', 'Press SPACE / UP to Jump, DOWN to Crouch! Collect yellow SSL certs!');
        };

        window.closeWireGame = () => {
            gameBackdrop.classList.remove('active');
            stopGame();
        };

        function showOverlay(title, desc) {
            isRunning = false;
            if (animFrameId) cancelAnimationFrame(animFrameId);
            overlayTitle.textContent = title;
            overlayDesc.textContent = desc;
            overlay.style.display = 'flex';
        }

        let tutorialTimer = null;
        function startGame() {
            if (tutorialTimer) clearInterval(tutorialTimer);
            startBtn.style.display = 'none';

            let count = 5;
            overlayTitle.innerHTML = `📖 TUTORIAL: STARTING IN <span style="color:var(--accent);">${count}s</span>`;
            overlayDesc.innerHTML = `
                <div style="font-size:0.78rem;line-height:1.6;margin:6px 0;text-align:left;background:rgba(8,13,24,0.7);padding:8px 12px;border-radius:8px;border:1px solid var(--border)">
                    <div>🟢 <strong>Green Runner & 🛡️ Shield</strong>: Collecting 🛡️ Shield gives 6s Invincibility!</div>
                    <div>🔴 <strong>Avoid 404 & 🟡 502 Obstacles</strong> when Shield is inactive!</div>
                    <div>🟡 <strong>Yellow Certs</strong>: Collect for +350 PTS & Health!</div>
                </div>
            `;

            tutorialTimer = setInterval(() => {
                count--;
                if (count > 0) {
                    overlayTitle.innerHTML = `📖 TUTORIAL: STARTING IN <span style="color:var(--accent);">${count}s</span>`;
                } else {
                    clearInterval(tutorialTimer);
                    overlay.style.display = 'none';
                    startBtn.style.display = 'inline-block';

                    score = 0;
                    health = 100;
                    certsCount = 0;
                    gameSpeed = 5.5;
                    frameCount = 0;
                    obstacles = [];
                    collectibles = [];
                    particles = [];

                    player.y = groundY;
                    player.vy = 0;
                    player.isJumping = false;
                    player.isCrouching = false;
                    player.jumpsLeft = 2;
                    player.shieldTimer = 0;

                    if (scoreEl) scoreEl.textContent = '0';
                    if (healthEl) { healthEl.textContent = '100%'; healthEl.style.color = '#00ffc8'; }
                    if (certsEl) certsEl.textContent = '0';

                    isRunning = true;
                    loop();
                }
            }, 1000);
        }

        function doJump() {
            if (!isRunning) return;
            if (player.jumpsLeft > 0) {
                player.vy = player.jumpPower;
                player.isJumping = true;
                player.jumpsLeft--;
                for (let i = 0; i < 6; i++) {
                    particles.push({
                        x: player.x + player.w / 2,
                        y: player.y + player.h,
                        vx: (Math.random() - 0.5) * 4,
                        vy: Math.random() * 3,
                        size: Math.random() * 4 + 2,
                        color: '#00ffc8',
                        life: 1
                    });
                }
            }
        }

        function setCrouch(crouch) {
            if (!isRunning) return;
            player.isCrouching = crouch;
        }

        window.addEventListener('keydown', (e) => {
            if (!gameBackdrop.classList.contains('active')) return;
            if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') {
                e.preventDefault();
                doJump();
            } else if (e.code === 'ArrowDown' || e.code === 'KeyS') {
                e.preventDefault();
                setCrouch(true);
            }
        });

        window.addEventListener('keyup', (e) => {
            if (!gameBackdrop.classList.contains('active')) return;
            if (e.code === 'ArrowDown' || e.code === 'KeyS') {
                setCrouch(false);
            }
        });

        startBtn.onclick = startGame;
        jumpBtn.onclick = doJump;
        slideBtn.onmousedown = () => setCrouch(true);
        slideBtn.onmouseup = () => setCrouch(false);
        slideBtn.ontouchstart = (e) => { e.preventDefault(); setCrouch(true); };
        slideBtn.ontouchend = (e) => { e.preventDefault(); setCrouch(false); };

        function loop() {
            if (!isRunning) return;

            frameCount++;
            gameSpeed += 0.0008;

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Horizon Line & Moving Grid
            ctx.strokeStyle = 'rgba(30, 41, 59, 0.6)';
            ctx.lineWidth = 1;
            const lineY = groundY + 44;
            ctx.beginPath();
            ctx.moveTo(0, lineY);
            ctx.lineTo(canvas.width, lineY);
            ctx.stroke();

            const gridOffset = (frameCount * gameSpeed) % 30;
            ctx.strokeStyle = 'rgba(0, 255, 200, 0.12)';
            for (let x = canvas.width - gridOffset; x > 0; x -= 30) {
                ctx.beginPath();
                ctx.moveTo(x, lineY);
                ctx.lineTo(x - 40, canvas.height);
                ctx.stroke();
            }

            // Player Physics
            player.y += player.vy;
            player.vy += player.gravity;

            if (player.y >= groundY) {
                player.y = groundY;
                player.vy = 0;
                player.isJumping = false;
                player.jumpsLeft = 2;
            }

            if (player.shieldTimer > 0) player.shieldTimer--;

            const currentH = player.isCrouching ? 22 : 44;
            const currentY = player.isCrouching ? player.y + 22 : player.y;

            // Trail particles
            if (frameCount % 3 === 0) {
                particles.push({
                    x: player.x,
                    y: currentY + currentH / 2,
                    vx: -gameSpeed * 0.5,
                    vy: (Math.random() - 0.5) * 1.5,
                    size: Math.random() * 3 + 1,
                    color: player.shieldTimer > 0 ? '#22c55e' : '#00ffc8',
                    life: 1
                });
            }

            // Render Player
            ctx.shadowBlur = player.shieldTimer > 0 ? 22 : 10;
            ctx.shadowColor = player.shieldTimer > 0 ? '#22c55e' : '#00ffc8';
            ctx.fillStyle = player.shieldTimer > 0 ? '#22c55e' : '#00ffc8';

            ctx.beginPath();
            if (ctx.roundRect) {
                ctx.roundRect(player.x, currentY, player.w, currentH, 6);
            } else {
                ctx.rect(player.x, currentY, player.w, currentH);
            }
            ctx.fill();

            // Visor
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(player.x + 14, currentY + (player.isCrouching ? 5 : 10), 10, 4);
            ctx.shadowBlur = 0;

            // Spawn Obstacles
            if (frameCount % Math.max(42, Math.floor(800 / gameSpeed)) === 0) {
                const isOverhead = Math.random() > 0.5;
                obstacles.push({
                    x: canvas.width + 20,
                    y: isOverhead ? groundY - 26 : groundY + 12,
                    w: isOverhead ? 44 : 36,
                    h: isOverhead ? 30 : 32,
                    label: isOverhead ? '502' : '404',
                    color: isOverhead ? '#f59e0b' : '#ef4444',
                    type: isOverhead ? 'overhead' : 'ground'
                });
            }

            // Spawn Collectibles (SSL Certs in Yellow #f59e0b, Shields in Green #22c55e)
            if (frameCount % 120 === 0) {
                const isShield = Math.random() < 0.25;
                collectibles.push({
                    x: canvas.width + 20,
                    y: groundY - (Math.random() > 0.5 ? 40 : 10),
                    w: 22,
                    h: 22,
                    isShield: isShield,
                    color: isShield ? '#22c55e' : '#f59e0b'
                });
            }

            // Update & Render Obstacles
            for (let i = obstacles.length - 1; i >= 0; i--) {
                const obs = obstacles[i];
                obs.x -= gameSpeed;

                ctx.fillStyle = obs.color;
                ctx.shadowColor = obs.color;
                ctx.shadowBlur = 8;
                ctx.beginPath();
                if (ctx.roundRect) {
                    ctx.roundRect(obs.x, obs.y, obs.w, obs.h, 6);
                } else {
                    ctx.rect(obs.x, obs.y, obs.w, obs.h);
                }
                ctx.fill();

                ctx.fillStyle = '#ffffff';
                ctx.font = '700 11px Space Grotesk, sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText(obs.label, obs.x + obs.w / 2, obs.y + obs.h / 2 + 4);
                ctx.shadowBlur = 0;

                // AABB Collision
                if (
                    player.x < obs.x + obs.w &&
                    player.x + player.w > obs.x &&
                    currentY < obs.y + obs.h &&
                    currentY + currentH > obs.y
                ) {
                    if (player.shieldTimer > 0) {
                        for (let p = 0; p < 12; p++) {
                            particles.push({
                                x: obs.x, y: obs.y,
                                vx: (Math.random() - 0.5) * 8, vy: (Math.random() - 0.5) * 8,
                                size: 4, color: '#22c55e', life: 1
                            });
                        }
                        obstacles.splice(i, 1);
                        continue;
                    }

                    health = Math.max(0, health - 35);
                    if (healthEl) {
                        healthEl.textContent = `${health}%`;
                        healthEl.style.color = health <= 30 ? '#ef4444' : '#f59e0b';
                    }

                    for (let p = 0; p < 15; p++) {
                        particles.push({
                            x: obs.x, y: obs.y,
                            vx: (Math.random() - 0.5) * 10, vy: (Math.random() - 0.5) * 10,
                            size: 4, color: '#ef4444', life: 1
                        });
                    }

                    obstacles.splice(i, 1);

                    if (health <= 0) {
                        if (score > highScore) {
                            highScore = score;
                            localStorage.setItem('sslRunnerHighScore', highScore.toString());
                            if (highScoreEl) highScoreEl.textContent = highScore;
                        }
                        showOverlay('💥 SSL CERTIFICATE EXPIRED!', `Final Score: ${score} pts | Certs Renewed: ${certsCount}`);
                        return;
                    }
                }

                if (obs.x + obs.w < 0) obstacles.splice(i, 1);
            }

            // Update & Render Collectibles
            for (let i = collectibles.length - 1; i >= 0; i--) {
                const item = collectibles[i];
                item.x -= gameSpeed;

                ctx.fillStyle = item.color;
                ctx.shadowColor = item.color;
                ctx.shadowBlur = 10;

                if (item.isShield) {
                    // Custom Shield Shape instead of a circle
                    const w = item.w + 4, h = item.h + 4;
                    const x = item.x - 2, y = item.y - 2;
                    ctx.beginPath();
                    ctx.moveTo(x + w / 2, y);
                    ctx.lineTo(x + w, y + h * 0.28);
                    ctx.lineTo(x + w * 0.82, y + h * 0.72);
                    ctx.lineTo(x + w / 2, y + h);
                    ctx.lineTo(x + w * 0.18, y + h * 0.72);
                    ctx.lineTo(x, y + h * 0.28);
                    ctx.closePath();
                    ctx.fill();
                } else {
                    ctx.beginPath();
                    ctx.arc(item.x + item.w / 2, item.y + item.h / 2, item.w / 2, 0, Math.PI * 2);
                    ctx.fill();
                }

                ctx.fillStyle = '#ffffff';
                ctx.font = '10px sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText(item.isShield ? '🛡️' : '🔒', item.x + item.w / 2, item.y + item.h / 2 + 3);
                ctx.shadowBlur = 0;

                if (
                    player.x < item.x + item.w &&
                    player.x + player.w > item.x &&
                    currentY < item.y + item.h &&
                    currentY + currentH > item.y
                ) {
                    if (item.isShield) {
                        player.shieldTimer = 220;
                        if (window.showToast) window.showToast('🛡️ TLS 1.3 Shield Active!');
                    } else {
                        certsCount++;
                        score += 350;
                        health = Math.min(100, health + 15);
                        if (certsEl) certsEl.textContent = certsCount;
                        if (healthEl) {
                            healthEl.textContent = `${health}%`;
                            healthEl.style.color = '#00ffc8';
                        }
                    }

                    for (let p = 0; p < 10; p++) {
                        particles.push({
                            x: item.x, y: item.y,
                            vx: (Math.random() - 0.5) * 6, vy: (Math.random() - 0.5) * 6,
                            size: 3, color: item.color, life: 1
                        });
                    }

                    collectibles.splice(i, 1);
                }

                if (item.x + item.w < 0) collectibles.splice(i, 1);
            }

            // Update & Render Particles
            for (let i = particles.length - 1; i >= 0; i--) {
                const p = particles[i];
                p.x += p.vx;
                p.y += p.vy;
                p.life -= 0.04;

                ctx.fillStyle = p.color;
                ctx.globalAlpha = Math.max(0, p.life);
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.globalAlpha = 1;

                if (p.life <= 0) particles.splice(i, 1);
            }

            score += Math.round(gameSpeed * 0.4);
            if (scoreEl) scoreEl.textContent = score;

            animFrameId = requestAnimationFrame(loop);
        }

        function stopGame() {
            isRunning = false;
            if (animFrameId) cancelAnimationFrame(animFrameId);
        }
    }

    // ════════════════════════════════════════════════════════
    // 6. RED GLOWING & FADING THEME LOOP DOT ON NAVBAR
    // ════════════════════════════════════════════════════════
    function initThemeToggleBtn() {
        const navLinks = document.querySelector('.nav-links');
        if (!navLinks) return;

        const btn = document.createElement('button');
        btn.className = 'theme-toggle-btn';
        btn.id = 'themeToggleBtn';
        btn.title = 'Cycle Themes (Click to switch)';
        btn.setAttribute('aria-label', 'Theme Loop Toggle');
        btn.innerHTML = `<span class="theme-glow-dot"></span>`;

        const themes = [
            { name: 'default', label: 'Electric Mint', matrix: false },
            { name: 'cyberpunk', label: 'Cyberpunk Neon', matrix: false },
            { name: 'matrix', label: 'Matrix Green (Digital Rain)', matrix: true },
            { name: 'oled', label: 'Midnight OLED', matrix: false },
            { name: 'amber', label: 'Solarized Amber', matrix: false }
        ];

        let currentIdx = 0;

        btn.onclick = () => {
            currentIdx = (currentIdx + 1) % themes.length;
            const theme = themes[currentIdx];

            // Apply body theme
            document.body.className = theme.name === 'default' ? '' : `theme-${theme.name}`;

            // Automatic Matrix Digital Rain activation/deactivation
            if (theme.matrix) {
                if (!isMatrixActive && window.toggleMatrixRain) {
                    window.toggleMatrixRain();
                }
            } else {
                if (isMatrixActive && window.toggleMatrixRain) {
                    window.toggleMatrixRain();
                }
            }

            if (window.showToast) {
                window.showToast(`🎨 Theme: ${theme.label.toUpperCase()}`);
            }
        };

        navLinks.appendChild(btn);
    }

    // ════════════════════════════════════════════════════════
    // 7. APPLE-STYLE DYNAMIC ISLAND (Telegram, Instagram, Copy Email)
    // ════════════════════════════════════════════════════════
    function initDynamicIsland() {
        const island = document.getElementById('dynamicIsland');
        if (!island) return;

        // Desktop only
        if (window.innerWidth < 768) {
            island.style.display = 'none';
            return;
        }
        island.style.display = 'block';

        const telegramLink = document.getElementById('diTelegramLink');
        const instagramLink = document.getElementById('diInstagramLink');
        const copyEmailBtn = document.getElementById('diCopyEmailBtn');
        const copyEmailText = document.getElementById('diCopyEmailText');

        const cfg = window.CONFIG || {};
        const tLink = cfg.telegramLink || (cfg.links && cfg.links.telegram) || 'https://t.me/theabhijaychauhan';
        const iLink = cfg.instagramLink || (cfg.links && cfg.links.instagram) || 'https://instagram.com/theabhijaychauhan';
        const userEmail = cfg.email || 'abhijaychauhan.dev@gmail.com';

        if (telegramLink) telegramLink.href = tLink;
        if (instagramLink) instagramLink.href = iLink;

        // Scroll listener: only slide up into view after scrolling down past the landing hero screen
        function handleIslandScroll() {
            const scrollY = window.scrollY || window.pageYOffset;
            if (scrollY > 280) {
                island.classList.add('visible');
            } else {
                island.classList.remove('visible');
            }
        }
        window.addEventListener('scroll', handleIslandScroll, { passive: true });
        handleIslandScroll();

        if (copyEmailBtn) {
            copyEmailBtn.addEventListener('click', (e) => {
                e.preventDefault();
                navigator.clipboard.writeText(userEmail).then(() => {
                    if (copyEmailText) copyEmailText.textContent = 'Copied! ✓';
                    copyEmailBtn.style.background = 'rgba(34, 197, 94, 0.25)';
                    copyEmailBtn.style.borderColor = '#22c55e';
                    copyEmailBtn.style.color = '#22c55e';

                    if (window.showToast) {
                        window.showToast('📋 Email copied to clipboard: ' + userEmail);
                    }

                    setTimeout(() => {
                        if (copyEmailText) copyEmailText.textContent = 'Copy Email';
                        copyEmailBtn.style.background = '';
                        copyEmailBtn.style.borderColor = '';
                        copyEmailBtn.style.color = '';
                    }, 2200);
                }).catch(() => {
                    if (window.showToast) window.showToast('Email: ' + userEmail);
                });
            });
        }
    }

    // ════════════════════════════════════════════════════════
    // 8. ELECTRIC-MINT CYBER RESUME SLIDE-OVER DRAWER
    // ════════════════════════════════════════════════════════
    function initResumeDrawer() {
        const overlay = document.getElementById('resumeDrawerOverlay');
        const drawer = document.getElementById('resumeDrawer');
        const closeBtn = document.getElementById('closeResumeDrawer');
        const printBtn = document.getElementById('rdPrintBtn');
        const downloadBtn = document.getElementById('rdDownloadBtn');
        const body = document.getElementById('resumeDrawerBody');
        const resumeTrigger = document.getElementById('resumeLink');

        if (!overlay || !drawer) return;

        const cfg = window.CONFIG || {};
        const resumeUrl = (cfg.assets && cfg.assets.resume) || cfg.resumeLink || 'assets/resume.pdf';
        if (downloadBtn) downloadBtn.href = resumeUrl;

        // Build structured ATS resume content in the drawer
        if (body) {
            body.innerHTML = `
                <!-- 1. EXECUTIVE DOSSIER HEADER -->
                <div class="rd-card" style="border-left: 3px solid #00ffc8;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; flex-wrap: wrap; gap: 8px;">
                        <span class="rd-badge-pill"><i class="fas fa-shield-alt"></i> Cloud Engineer_DOSSIER // DEVOPS_ENGINEER</span>
                        <span class="rd-badge-pill" style="border-color: #22c55e; color: #22c55e;"><span class="di-pulse-dot" style="display:inline-block; margin-right:4px; background:#22c55e; box-shadow:0 0 10px #22c55e;"></span> ACTIVE & AVAILABLE</span>
                    </div>
                    <h2 style="font-size: 1.75rem; font-weight: 800; color: #ffffff; margin: 6px 0 8px 0; letter-spacing: 0.5px; text-shadow: 0 0 14px rgba(0, 255, 200, 0.4);">${cfg.name || 'Abhijay Chauhan'}</h2>
                    <p style="font-size: 1.15rem; color: #00ffc8; font-weight: 700; margin-bottom: 14px; font-family: 'JetBrains Mono', monospace;">${cfg.title || 'DevOps Engineer & Cloud Engineer'}</p>
                    <div style="display: flex; flex-wrap: wrap; gap: 14px; font-size: 0.98rem; color: #cbd5e1;">
                        <span><i class="fas fa-map-marker-alt" style="color: #00ffc8;"></i> ${cfg.location || 'Lucknow, UP, India'}</span>
                        <span><i class="fas fa-envelope" style="color: #00ffc8;"></i> ${cfg.email || 'Email'}</span>
                        <span><i class="fab fa-linkedin" style="color: #00ffc8;"></i> in/abhijaychauhan</span>
                        <span><i class="fab fa-github" style="color: #00ffc8;"></i> theAbhijayChauhan</span>
                    </div>
                </div>

                <!-- 2. TECHNICAL PROFILE SUMMARY -->
                <div class="rd-card">
                    <div class="rd-card-title"><i class="fas fa-terminal"></i> Executive Technical Summary</div>
                    <p class="rd-summary">
                        Results-driven <strong>DevOps Engineer & Cloud Engineer</strong> specializing in cloud-native infrastructure automation, zero-downtime Kubernetes deployments, and GitOps CI/CD delivery pipelines. Passionate about eliminating single points of failure, architecting self-healing clusters, and enforcing Infrastructure as Code (IaC) best practices.
                    </p>
                </div>

                <!-- 3. CORE TECHNICAL ARSENAL MATRIX -->
                <div class="rd-card">
                    <div class="rd-card-title"><i class="fas fa-microchip"></i> Hardcore Technical Arsenal</div>
                    <div style="display: flex; flex-direction: column; gap: 16px;">
                        <div>
                            <span style="font-size: 0.88rem; font-weight: 600; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; display: block; margin-bottom: 8px;">☁️ Cloud & Orchestration</span>
                            <div class="rd-skill-tags">
                                <span class="rd-tag">Kubernetes (EKS / K3s)</span>
                                <span class="rd-tag">Docker Containerization</span>
                                <span class="rd-tag">AWS (EC2, S3, IAM, VPC, ALB)</span>
                                <span class="rd-tag">Helm Charts</span>
                            </div>
                        </div>
                        <div>
                            <span style="font-size: 0.88rem; font-weight: 600; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; display: block; margin-bottom: 8px;">⚡ CI/CD & Infrastructure as Code</span>
                            <div class="rd-skill-tags">
                                <span class="rd-tag">Terraform (HCL Modules)</span>
                                <span class="rd-tag">GitHub Actions CI/CD</span>
                                <span class="rd-tag">Jenkins Pipelines</span>
                                <span class="rd-tag">Ansible Automation</span>
                                <span class="rd-tag">GitOps (ArgoCD)</span>
                            </div>
                        </div>
                        <div>
                            <span style="font-size: 0.88rem; font-weight: 600; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; display: block; margin-bottom: 8px;">📊 Observability, Security & Scripting</span>
                            <div class="rd-skill-tags">
                                <span class="rd-tag">Prometheus & Grafana</span>
                                <span class="rd-tag">Linux Kernel & Systemd</span>
                                <span class="rd-tag">Bash / Shell Scripting</span>
                                <span class="rd-tag">Python Automation</span>
                                <span class="rd-tag">SSL/TLS & IAM Security</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 4. PRODUCTION-GRADE PROJECTS & DEPLOYMENTS -->
                <div class="rd-card">
                    <div class="rd-card-title"><i class="fas fa-server"></i> Featured Production Deployments</div>
                    <div style="display: flex; flex-direction: column; gap: 16px;">
                        <div class="rd-experience-item">
                            <div class="rd-exp-header">
                                <span class="rd-exp-role">Kubernetes Multi-Cluster Auto-Scaler</span>
                                <span class="rd-exp-period">K8s • Go • Prometheus</span>
                            </div>
                            <p class="rd-bullet">Engineered custom Kubernetes Horizontal Pod Auto-scaler (HPA) using custom Prometheus metrics, scaling microservices seamlessly under 10k req/sec load spikes.</p>
                            <p class="rd-bullet">Decreased idle infrastructure AWS EC2 compute spend by <strong>42%</strong> through dynamic node provisioning.</p>
                        </div>
                        <div class="rd-experience-item">
                            <div class="rd-exp-header">
                                <span class="rd-exp-role">Enterprise GitOps CI/CD Delivery Pipeline</span>
                                <span class="rd-exp-period">GitHub Actions • ArgoCD • Docker</span>
                            </div>
                            <p class="rd-bullet">Architected fully automated zero-downtime canary deployment pipeline spanning staging and production AWS environments.</p>
                            <p class="rd-bullet">Accelerated artifact container build cycles by <strong>65%</strong> with multi-stage Docker caching and Trivy vulnerability security gating.</p>
                        </div>
                    </div>
                </div>

                <!-- 5. VALIDATED CREDENTIALS -->
                <div class="rd-card">
                    <div class="rd-card-title"><i class="fas fa-certificate"></i> Validated Certifications</div>
                    <ul style="list-style: none; padding: 0; display: flex; flex-direction: column; gap: 10px; font-size: 1.05rem; color: #f1f5f9;">
                        <li style="display: flex; align-items: center; gap: 10px;">
                            <span style="color: #00ffc8; font-weight: 800; font-size: 1.18rem;">✓</span>
                            <span><strong>TCS iON Certified</strong> — Industry Ready DevOps (2025)</span>
                        </li>
                        <li style="display: flex; align-items: center; gap: 10px;">
                            <span style="color: #00ffc8; font-weight: 800; font-size: 1.18rem;">✓</span>
                            <span><strong>Certified Kubernetes Administrator (CKA)</strong> — Foundations</span>
                        </li>
                        <li style="display: flex; align-items: center; gap: 10px;">
                            <span style="color: #00ffc8; font-weight: 800; font-size: 1.18rem;">✓</span>
                            <span><strong>AWS Certified Solutions Architect</strong> — Associate Level</span>
                        </li>
                        <li style="display: flex; align-items: center; gap: 10px;">
                            <span style="color: #00ffc8; font-weight: 800; font-size: 1.18rem;">✓</span>
                            <span><strong>HashiCorp Certified: Terraform Associate</strong></span>
                        </li>
                    </ul>
                </div>

                <!-- 6. FORMAL EDUCATION -->
                <div class="rd-card">
                    <div class="rd-card-title"><i class="fas fa-graduation-cap"></i> Formal Education</div>
                    <p style="font-size: 1.15rem; font-weight: 700; color: #ffffff; margin-bottom: 4px;">Bachelor of Technology (B.Tech) in Computer Science & Engineering</p>
                    <p style="font-size: 0.98rem; color: #00ffc8; font-family: 'JetBrains Mono', monospace;">Specialization: Cloud Computing, Distributed Systems & Cloud Engineer</p>
                </div>
            `;
        }

        function openDrawer(e) {
            if (e) e.preventDefault();
            overlay.style.display = 'flex';
            requestAnimationFrame(() => {
                overlay.classList.add('active');
            });
        }

        function closeDrawer() {
            overlay.classList.remove('active');
            setTimeout(() => {
                overlay.style.display = 'none';
            }, 350);
        }

        if (resumeTrigger) {
            resumeTrigger.addEventListener('click', openDrawer);
        }

        if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeDrawer();
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && overlay.classList.contains('active')) closeDrawer();
        });

        if (printBtn) {
            printBtn.addEventListener('click', () => {
                window.print();
            });
        }
    }

    // ════════════════════════════════════════════════════════
    // 9. 6-AXIS INTERACTIVE DEVOPS SKILL RADAR CHART
    // ════════════════════════════════════════════════════════
    function initSkillRadarChart() {
        const wrapper = document.getElementById('skillRadarWrapper');
        const canvas = document.getElementById('skillRadarCanvas');
        const tooltip = document.getElementById('radarTooltip');
        if (!wrapper || !canvas) return;

        wrapper.style.display = 'block';
        const ctx = canvas.getContext('2d');

        // 6 DevOps Competency Dimensions
        const dimensions = [
            { label: 'Cloud Architecture', score: 0.92, tech: 'AWS, GCP, VPC, Multi-Region Cloud Engineer' },
            { label: 'CI/CD Automation', score: 0.95, tech: 'GitHub Actions, Jenkins, ArgoCD, Pipelines' },
            { label: 'K8s & Containers', score: 0.90, tech: 'Kubernetes, Docker, Helm, Ingress, Pods' },
            { label: 'IaC & Terraform', score: 0.88, tech: 'Terraform Modules, Ansible, CloudFormation' },
            { label: 'Observability & Cloud Engineer', score: 0.86, tech: 'Prometheus, Grafana, Loki, Alertmanager' },
            { label: 'Linux & Security', score: 0.94, tech: 'Bash, Kernel Tuning, TLS, IAM, Hardening' }
        ];

        const totalAxes = dimensions.length;
        let progress = 0; // 0 to 1 anim progress
        let animStarted = false;
        let hoveredIndex = -1;

        function resizeCanvas() {
            const rect = canvas.getBoundingClientRect();
            const dpr = window.devicePixelRatio || 1;
            canvas.width = Math.min(540, rect.width || 480) * dpr;
            canvas.height = 360 * dpr;
            ctx.scale(dpr, dpr);
            drawRadar();
        }

        function drawRadar() {
            const w = canvas.width / (window.devicePixelRatio || 1);
            const h = canvas.height / (window.devicePixelRatio || 1);
            const cx = w * 0.5;
            const cy = h * 0.52;
            const maxRadius = Math.min(w * 0.35, h * 0.36, 130);

            ctx.clearRect(0, 0, w, h);

            // 1. Draw Concentric Background Polygon Grid Rings (20%, 40%, 60%, 80%, 100%)
            const levels = [0.2, 0.4, 0.6, 0.8, 1.0];
            levels.forEach((level, lvlIdx) => {
                ctx.beginPath();
                for (let i = 0; i < totalAxes; i++) {
                    const angle = (Math.PI * 2 / totalAxes) * i - Math.PI / 2;
                    const r = maxRadius * level;
                    const px = cx + Math.cos(angle) * r;
                    const py = cy + Math.sin(angle) * r;
                    if (i === 0) ctx.moveTo(px, py);
                    else ctx.lineTo(px, py);
                }
                ctx.closePath();
                ctx.strokeStyle = lvlIdx === levels.length - 1 ? 'rgba(0, 255, 200, 0.22)' : 'rgba(255, 255, 255, 0.07)';
                ctx.lineWidth = lvlIdx === levels.length - 1 ? 1.4 : 0.8;
                if (lvlIdx < levels.length - 1) {
                    ctx.setLineDash([3, 4]);
                } else {
                    ctx.setLineDash([]);
                }
                ctx.stroke();
                ctx.setLineDash([]);
            });

            // 2. Draw Axis Lines from Center to Outer Rim
            for (let i = 0; i < totalAxes; i++) {
                const angle = (Math.PI * 2 / totalAxes) * i - Math.PI / 2;
                const px = cx + Math.cos(angle) * maxRadius;
                const py = cy + Math.sin(angle) * maxRadius;

                ctx.beginPath();
                ctx.moveTo(cx, cy);
                ctx.lineTo(px, py);
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
                ctx.lineWidth = 1;
                ctx.stroke();

                // 3. Draw Axis Labels with Percentage Badges
                const labelRadius = maxRadius + 26;
                const lx = cx + Math.cos(angle) * labelRadius;
                const ly = cy + Math.sin(angle) * labelRadius;

                ctx.font = '700 11px "Space Grotesk", sans-serif';
                ctx.fillStyle = hoveredIndex === i ? '#00ffc8' : '#e2e8f0';
                ctx.textAlign = Math.abs(Math.cos(angle)) < 0.2 ? 'center' : (Math.cos(angle) > 0 ? 'left' : 'right');
                ctx.textBaseline = 'middle';

                const dim = dimensions[i];
                ctx.fillText(`${dim.label}`, lx, ly - 6);

                ctx.font = '600 10px "JetBrains Mono", monospace';
                ctx.fillStyle = '#fbbf24';
                ctx.fillText(`${Math.round(dim.score * 100)}%`, lx, ly + 8);
            }

            // 4. Draw Animated Skill Polygon
            ctx.beginPath();
            const currentPoints = [];
            for (let i = 0; i < totalAxes; i++) {
                const angle = (Math.PI * 2 / totalAxes) * i - Math.PI / 2;
                const score = dimensions[i].score * progress;
                const r = maxRadius * score;
                const px = cx + Math.cos(angle) * r;
                const py = cy + Math.sin(angle) * r;
                currentPoints.push({ x: px, y: py, score: dimensions[i].score });

                if (i === 0) ctx.moveTo(px, py);
                else ctx.lineTo(px, py);
            }
            ctx.closePath();

            // Gradient Fill
            const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxRadius);
            grad.addColorStop(0, 'rgba(0, 255, 200, 0.35)');
            grad.addColorStop(0.6, 'rgba(0, 240, 255, 0.2)');
            grad.addColorStop(1, 'rgba(245, 158, 11, 0.1)');
            ctx.fillStyle = grad;
            ctx.fill();

            ctx.strokeStyle = '#00ffc8';
            ctx.lineWidth = 2.2;
            ctx.stroke();

            // 5. Draw Glowing Vertices
            currentPoints.forEach((pt, idx) => {
                const isHovered = hoveredIndex === idx;

                ctx.beginPath();
                ctx.arc(pt.x, pt.y, isHovered ? 6 : 4, 0, Math.PI * 2);
                ctx.fillStyle = isHovered ? '#ffffff' : '#00ffc8';
                ctx.fill();

                ctx.beginPath();
                ctx.arc(pt.x, pt.y, isHovered ? 11 : 7, 0, Math.PI * 2);
                ctx.strokeStyle = isHovered ? '#fbbf24' : 'rgba(0, 255, 200, 0.5)';
                ctx.lineWidth = isHovered ? 2 : 1.2;
                ctx.stroke();
            });
        }

        // Animate radar polygon expansion on scroll reveal
        function startAnimation() {
            if (animStarted) return;
            animStarted = true;
            let start = null;
            const duration = 1200;

            function step(timestamp) {
                if (!start) start = timestamp;
                const elapsed = timestamp - start;
                const t = Math.min(1, elapsed / duration);
                progress = 1 - Math.pow(1 - t, 3);
                drawRadar();

                if (t < 1) {
                    requestAnimationFrame(step);
                } else {
                    progress = 1;
                    drawRadar();
                }
            }
            requestAnimationFrame(step);
        }

        // IntersectionObserver to trigger animation when visible
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        startAnimation();
                        observer.disconnect();
                    }
                });
            }, { threshold: 0.25 });
            observer.observe(wrapper);
        } else {
            startAnimation();
        }

        // Interactive Canvas Hover / Mousemove
        canvas.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;

            const w = canvas.width / (window.devicePixelRatio || 1);
            const h = canvas.height / (window.devicePixelRatio || 1);
            const cx = w * 0.5;
            const cy = h * 0.52;
            const maxRadius = Math.min(w * 0.35, h * 0.36, 130);

            let closestIdx = -1;
            let minDist = 36;

            for (let i = 0; i < totalAxes; i++) {
                const angle = (Math.PI * 2 / totalAxes) * i - Math.PI / 2;
                const r = maxRadius * dimensions[i].score * progress;
                const px = cx + Math.cos(angle) * r;
                const py = cy + Math.sin(angle) * r;
                const dist = Math.hypot(mouseX - px, mouseY - py);

                if (dist < minDist) {
                    minDist = dist;
                    closestIdx = i;
                }
            }

            hoveredIndex = closestIdx;
            drawRadar();

            if (closestIdx !== -1 && tooltip) {
                const dim = dimensions[closestIdx];
                tooltip.innerHTML = `<strong>${dim.label}</strong>: <span style="color:#00ffc8;">${Math.round(dim.score * 100)}%</span><br><span style="color:#94a3b8; font-size:10px;">${dim.tech}</span>`;
                tooltip.style.left = `${mouseX + 14}px`;
                tooltip.style.top = `${mouseY - 14}px`;
                tooltip.style.opacity = '1';
                tooltip.style.transform = 'translateY(0)';
            } else if (tooltip) {
                tooltip.style.opacity = '0';
                tooltip.style.transform = 'translateY(4px)';
            }
        });

        canvas.addEventListener('mouseleave', () => {
            hoveredIndex = -1;
            drawRadar();
            if (tooltip) tooltip.style.opacity = '0';
        });

        window.addEventListener('resize', resizeCanvas, { passive: true });
        resizeCanvas();
    }

})();
