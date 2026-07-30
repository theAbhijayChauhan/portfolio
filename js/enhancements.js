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
            <a href="https://github.com/theWitcher00" target="_blank" class="side-social-icon" title="GitHub"><i class="fab fa-github"></i></a>
            <a href="https://linkedin.com/in/abhijaychauhan" target="_blank" class="side-social-icon" title="LinkedIn"><i class="fab fa-linkedin-in"></i></a>
            <a href="mailto:abhijay@example.com" class="side-social-icon" title="Email"><i class="fas fa-envelope"></i></a>
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
            <div class="quick-action-btn" title="DevOps Node Connector Game" onclick="window.openWireGame()">
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
    // 5. INTERACTIVE DEVOPS WIRE CONNECTOR MINI-GAME
    // ════════════════════════════════════════════════════════
    function initWireMiniGame() {
        const gameBackdrop = document.createElement('div');
        gameBackdrop.className = 'game-modal-backdrop';
        gameBackdrop.id = 'wireGameModal';

        gameBackdrop.innerHTML = `
            <div class="game-card">
                <button class="game-close-btn" onclick="window.closeWireGame()">&times;</button>
                <div class="game-title"><i class="fas fa-network-wired text-[var(--accent)]"></i> DevOps Pipeline Wire Connector</div>
                <div class="game-subtitle">Connect the pipeline nodes in sequence (Source ➔ Docker ➔ K8s ➔ Security) to deploy infrastructure!</div>

                <div class="game-wire-canvas-container">
                    <canvas id="wireCanvas"></canvas>
                    <div class="game-nodes-grid" id="wireNodesGrid">
                        <div class="interactive-node" data-id="1" onclick="window.wireNodeClick(1)">
                            <i class="fas fa-code node-icon"></i>
                            <div class="node-label">1. Source</div>
                        </div>
                        <div class="interactive-node" data-id="2" onclick="window.wireNodeClick(2)">
                            <i class="fab fa-docker node-icon"></i>
                            <div class="node-label">2. Build</div>
                        </div>
                        <div class="interactive-node" data-id="3" onclick="window.wireNodeClick(3)">
                            <i class="fas fa-dharmachakra node-icon"></i>
                            <div class="node-label">3. Deploy</div>
                        </div>
                        <div class="interactive-node" data-id="4" onclick="window.wireNodeClick(4)">
                            <i class="fas fa-shield-alt node-icon"></i>
                            <div class="node-label">4. Secure</div>
                        </div>
                    </div>
                </div>

                <div class="game-footer">
                    <span class="game-status-text" id="wireGameMsg">Click Node 1 (Source) to start wiring!</span>
                    <button class="btn-primary" onclick="window.resetWireGame()">Reset Wires</button>
                </div>
            </div>
        `;
        document.body.appendChild(gameBackdrop);

        let connectedNodes = [];
        const maxNodes = 4;

        window.openWireGame = () => {
            gameBackdrop.classList.add('active');
            setTimeout(() => {
                resizeWireCanvas();
                window.resetWireGame();
            }, 100);
        };

        window.closeWireGame = () => {
            gameBackdrop.classList.remove('active');
        };

        function resizeWireCanvas() {
            const canvas = document.getElementById('wireCanvas');
            const container = canvas?.parentElement;
            if (canvas && container) {
                canvas.width = container.clientWidth;
                canvas.height = container.clientHeight;
            }
        }

        window.resetWireGame = () => {
            connectedNodes = [];
            document.querySelectorAll('.interactive-node').forEach(node => {
                node.className = 'interactive-node';
            });
            drawWires();
            document.getElementById('wireGameMsg').innerText = 'Click Node 1 (Source) to start wiring!';
            document.getElementById('wireGameMsg').style.color = 'var(--accent)';
        };

        window.wireNodeClick = (id) => {
            const expectedNext = connectedNodes.length + 1;

            if (id === expectedNext) {
                connectedNodes.push(id);
                const nodeEl = document.querySelector(`.interactive-node[data-id="${id}"]`);
                if (nodeEl) nodeEl.classList.add('connected');
                drawWires();

                if (connectedNodes.length === maxNodes) {
                    document.getElementById('wireGameMsg').innerText = '🎉 PIPELINE CONNECTED! All services operational!';
                    document.getElementById('wireGameMsg').style.color = 'var(--success)';
                    if (window.showToast) window.showToast('🏆 Certified System Architect Badge Unlocked!');
                } else {
                    document.getElementById('wireGameMsg').innerText = `Great! Now connect Node ${connectedNodes.length + 1}...`;
                }
            } else if (!connectedNodes.includes(id)) {
                document.getElementById('wireGameMsg').innerText = `⚠️ Sequence error! Connect Node ${expectedNext} next!`;
                document.getElementById('wireGameMsg').style.color = 'var(--danger)';
            }
        };

        function drawWires() {
            const canvas = document.getElementById('wireCanvas');
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            if (connectedNodes.length < 2) return;

            ctx.lineWidth = 4;
            ctx.strokeStyle = '#00ffc8';
            ctx.shadowColor = '#00ffc8';
            ctx.shadowBlur = 12;

            for (let i = 0; i < connectedNodes.length - 1; i++) {
                const n1 = document.querySelector(`.interactive-node[data-id="${connectedNodes[i]}"]`);
                const n2 = document.querySelector(`.interactive-node[data-id="${connectedNodes[i+1]}"]`);

                if (n1 && n2) {
                    const r1 = n1.getBoundingClientRect();
                    const r2 = n2.getBoundingClientRect();
                    const cRect = canvas.getBoundingClientRect();

                    const x1 = r1.left + r1.width/2 - cRect.left;
                    const y1 = r1.top + r1.height/2 - cRect.top;
                    const x2 = r2.left + r2.width/2 - cRect.left;
                    const y2 = r2.top + r2.height/2 - cRect.top;

                    ctx.beginPath();
                    ctx.moveTo(x1, y1);
                    ctx.bezierCurveTo(x1 + 40, y1 - 30, x2 - 40, y2 + 30, x2, y2);
                    ctx.stroke();
                }
            }
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

})();
