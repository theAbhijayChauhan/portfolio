// ═══════════════════════════════════════════════════════
//  MAIN — Populate from config, cursor, nav, form, init
// ═══════════════════════════════════════════════════════

// ── POPULATE SITE FROM CONFIG ──────────────────────────
function populateSite() {
    const C = CONFIG;

    // Sync assets from CONFIG.assets if defined
    if (C.assets) {
        if (C.assets.resume) C.resumeLink = C.assets.resume;
        if (C.assets.profilePhoto) C.photo = C.assets.profilePhoto;
        if (C.projects && Array.isArray(C.projects)) {
            const keys = ['project1Image', 'project2Image', 'project3Image', 'project4Image', 'project5Image', 'project6Image'];
            C.projects.forEach((proj, idx) => {
                if (C.assets[keys[idx]]) {
                    proj.image = C.assets[keys[idx]];
                }
            });
        }
    }

    // Title
    document.title = `${C.name} — ${C.title}`;

    // Nav logo
    document.getElementById('navLogo').innerHTML = C.initials + '<span style="color:var(--accent)">.</span>';

    // Hero
    const nameEl = document.getElementById('heroName');
    nameEl.textContent = C.name;
    document.getElementById('heroTagline').textContent = C.tagline;
    document.getElementById('resumeLink').href = C.resumeLink;

    // Stats
    const statsGrid = document.getElementById('statsGrid');
    statsGrid.innerHTML = C.stats.map((s, i) => `
        <div class="stat-item reveal reveal-d${i}">
            <div class="stat-number" data-target="${s.value}" data-suffix="${s.suffix || ''}">0${s.suffix || ''}</div>
            <div class="stat-label">${s.label}</div>
        </div>
    `).join('');

    // About
    document.getElementById('aboutP1').textContent = C.about[0] || '';
    document.getElementById('aboutP2').textContent = C.about[1] || '';

    // Photo
    document.getElementById('profilePhoto').src = C.photo;
    const heroMini = document.getElementById('heroMiniPhoto');
    if (heroMini) heroMini.src = C.photo;

    // Availability
    if (!C.available) {
        document.getElementById('availabilityBadge').style.display = 'none';
    }

    // Social links (about section)
    const socialRow = document.getElementById('socialLinks');
    const socialIcons = {
        linkedin: 'fab fa-linkedin-in',
        github: 'fab fa-github',
        devto: 'fab fa-dev',
        youtube: 'fab fa-youtube',
    };

    // Helper: auto-prepend https:// if user forgot the protocol in config.js
    function ensureProtocol(url) {
        if (!url) return url;
        url = url.trim();
        if (url.startsWith('http://') || url.startsWith('https://')) return url;
        return 'https://' + url;
    }

    socialRow.innerHTML = Object.entries(C.links)
        .filter(([, url]) => url)
        .map(([key, url]) => `
            <a href="${ensureProtocol(url)}" target="_blank" rel="noopener" class="social-link" aria-label="${key}">
                <i class="${socialIcons[key] || 'fas fa-link'}"></i>
            </a>
        `).join('');

    // Terminal
    const t = C.terminal;
    const termBody = document.getElementById('terminalBody');
    let termHTML = `<div class="t-line"><span class="t-prompt">$</span> <span class="t-cmd">cat profile.yaml</span></div>`;
    termHTML += `<div class="t-line"><span class="t-dim">---</span></div>`;
    termHTML += `<div class="t-line"><span class="t-key">name</span><span class="t-dim">:</span> <span class="t-val">"${t.name}"</span></div>`;
    termHTML += `<div class="t-line"><span class="t-key">role</span><span class="t-dim">:</span> <span class="t-val">"${t.role}"</span></div>`;
    termHTML += `<div class="t-line"><span class="t-key">location</span><span class="t-dim">:</span> <span class="t-val">"${t.location}"</span></div>`;
    termHTML += `<div class="t-line"><span class="t-key">email</span><span class="t-dim">:</span> <span class="t-val">"${t.email}"</span></div>`;
    termHTML += `<div class="t-line"><span class="t-key">education</span><span class="t-dim">:</span> <span class="t-val">"${t.education}"</span></div>`;
    termHTML += `<div class="t-line"><span class="t-key">languages</span><span class="t-dim">:</span></div>`;
    t.languages.forEach(l => { termHTML += `<div class="t-line"><span class="t-dim">  - ${l}</span></div>`; });
    termHTML += `<div class="t-line"><span class="t-key">interests</span><span class="t-dim">:</span></div>`;
    t.interests.forEach(i => { termHTML += `<div class="t-line"><span class="t-dim">  - ${i}</span></div>`; });
    termHTML += `<div class="t-line"><span class="t-prompt">$</span> <span class="typing-cursor" style="color:var(--accent)"></span></div>`;
    termBody.innerHTML = termHTML;

    // Skills
    const skillsGrid = document.getElementById('skillsGrid');
    skillsGrid.innerHTML = C.skills.map((s, i) => `
        <div class="skill-card reveal reveal-d${(i % 3) + 1}">
            <div class="skill-icon ic-${s.color}"><i class="${s.icon}"></i></div>
            <div class="skill-name">${s.name}</div>
            <div class="progress-track"><div class="progress-fill" data-width="${s.level}"></div></div>
            <div class="skill-level">${s.level}%</div>
        </div>
    `).join('');

    // Projects
    const projGrid = document.getElementById('projectsGrid');
    const imgKeys = ['project1Image', 'project2Image', 'project3Image', 'project4Image', 'project5Image', 'project6Image'];
    const showImg = (C.showSections && C.showSections.projectImages !== false);
    projGrid.innerHTML = C.projects.map((p, i) => {
        const imgPath = (C.assets && C.assets[imgKeys[i]]) ? C.assets[imgKeys[i]] : p.image;
        const hasImg = showImg && imgPath;
        return `
        <div class="project-card reveal reveal-d${(i % 3) + 1}">
            ${hasImg
                ? `<div class="project-img" style="background-image:url('${imgPath}')">
                       <a href="${ensureProtocol(p.link)}" target="_blank" rel="noopener" class="project-link"><i class="fas fa-external-link-alt"></i></a>
                   </div>`
                : `<div class="project-img-placeholder">
                       <i class="fas fa-code"></i>
                       <a href="${ensureProtocol(p.link)}" target="_blank" rel="noopener" class="project-link"><i class="fas fa-external-link-alt"></i></a>
                   </div>`
            }
            <div class="project-body">
                <div class="project-title">${p.title}</div>
                <div class="project-desc">${p.desc}</div>
                <div class="project-tags">
                    ${p.tags.map(t => `<span class="project-tag">${t}</span>`).join('')}
                </div>
            </div>
        </div>`;
    }).join('');

    // Education
    const eduTimeline = document.getElementById('educationTimeline');
    eduTimeline.innerHTML = C.education.map((e, i) => `
        <div class="timeline-item reveal reveal-d${(i % 3) + 1}">
            <div class="timeline-dot"></div>
            <div class="timeline-badge">${e.year}</div>
            <div class="timeline-degree">${e.degree}</div>
            <div class="timeline-school">${e.institution}</div>
            <div class="timeline-gpa">GPA: ${e.gpa}</div>
            ${e.highlights.length ? `<ul class="timeline-highlights">${e.highlights.map(h => `<li>${h}</li>`).join('')}</ul>` : ''}
        </div>
    `).join('');

    // Certifications
    const certsGrid = document.getElementById('certsGrid');
    certsGrid.innerHTML = C.certifications.map((c, i) => `
        <div class="cert-card reveal reveal-d${(i % 2) + 1}" data-index="${i}">
            <div class="cert-icon" style="background:${c.iconColor}15; color:${c.iconColor}">
                ${i + 1}
            </div>
            <div>
                <div class="cert-name">${c.name}</div>
                <div class="cert-meta">${c.issuer} &middot; ${c.year}</div>
            </div>
        </div>
    `).join('');

    // Achievements
    const achGrid = document.getElementById('achievementsGrid');
    achGrid.innerHTML = C.achievements.map((a, i) => `
        <div class="achievement-card reveal reveal-d${(i % 2) + 1}">
            <div class="achievement-icon"><i class="fas fa-bolt"></i></div>
            <div class="achievement-text">${a}</div>
        </div>
    `).join('');

    // Contact
    const emailEl = document.getElementById('contactEmail');
    emailEl.href = `mailto:${C.email}`;
    emailEl.textContent = C.email;
    const phoneEl = document.getElementById('contactPhone');
    phoneEl.href = `tel:${C.phone.replace(/\s/g, '')}`;
    phoneEl.textContent = C.phone;
    const origPhone = C.phone;
    const phoneCard = phoneEl.closest('.info-card') || phoneEl;
    phoneCard.addEventListener('mouseenter', () => {
        phoneEl.textContent = "Privacy matters — use Email or LinkedIn";
        phoneEl.style.fontSize = "13px";
        phoneEl.style.fontWeight = "600";
        phoneEl.style.color = "var(--accent)";
    });
    phoneCard.addEventListener('mouseleave', () => {
        phoneEl.textContent = origPhone;
        phoneEl.style.fontSize = "";
        phoneEl.style.fontWeight = "";
        phoneEl.style.color = "";
    });
    document.getElementById('contactLocation').textContent = C.location;

    // Contact socials
    const contactSoc = document.getElementById('contactSocials');
    contactSoc.innerHTML = socialRow.innerHTML;

    // Footer
    document.getElementById('footerYear').textContent = new Date().getFullYear();
    document.getElementById('footerName').textContent = C.name;

    // ── SECTION VISIBILITY TOGGLES ──────────────────────
    if (C.showSections) {
        const sectionMap = {
            stats: document.getElementById('statsSection'),
            about: document.getElementById('about'),
            skills: document.getElementById('skills'),
            projects: document.getElementById('projects'),
            education: document.getElementById('education'),
            certifications: document.getElementById('certifications'),
            achievements: document.getElementById('achievements'),
            contact: document.getElementById('contact'),
        };

        Object.entries(C.showSections).forEach(([key, isShown]) => {
            const secEl = sectionMap[key];
            if (secEl) {
                secEl.style.display = isShown ? '' : 'none';
            }

            // Hide matching navbar links (desktop)
            const navLink = document.querySelector(`.nav-link[href="#${key}"], .nav-btn[href="#${key}"]`);
            if (navLink) {
                navLink.style.display = isShown ? '' : 'none';
            }

            // Hide matching mobile menu links
            const mobileLink = document.querySelector(`.mobile-menu a[href="#${key}"]`);
            if (mobileLink) {
                mobileLink.style.display = isShown ? '' : 'none';
            }
        });

        if (C.showSections.themeToggle === false) {
            const themeBtn = document.getElementById('themeToggleBtn');
            if (themeBtn) themeBtn.style.display = 'none';
        }

        if (C.showSections.heroAvatar === false) {
            const avatarEl = document.getElementById('heroAvatarContainer');
            if (avatarEl) avatarEl.style.display = 'none';
        }

        if (C.showSections.particles === false) {
            const particleCanvas = document.getElementById('particleCanvas');
            if (particleCanvas) particleCanvas.style.display = 'none';
        }

        const instaBanner = document.getElementById('instaBanner');
        if (C.showSections.instagramBanner === false) {
            if (instaBanner) instaBanner.style.display = 'none';
        }

        if (C.showSections.desktopQuestions === false) {
            const dqBtn = document.getElementById('desktopQuestionsBtn');
            if (dqBtn) dqBtn.style.display = 'none';
        }
    }

    // ── ALWAYS apply Instagram link from config (outside showSections guard) ──
    const navLogo = document.getElementById('navLogo');
    if (navLogo && C.instagramLink) {
        navLogo.href = ensureProtocol(C.instagramLink);
        navLogo.target = '_blank';
        navLogo.rel = 'noopener noreferrer';
    }
}


// ── CUSTOM CURSOR (Ultra-Fast 120 FPS Hardware Accelerated) ──
function initCursor() {
    const dot = document.getElementById('cursorDot');
    const ring = document.getElementById('cursorRing');
    if (!dot || !ring) return;

    let mx = -100, my = -100;
    let rx = -100, ry = -100;

    window.addEventListener('mousemove', e => {
        mx = e.clientX;
        my = e.clientY;
    }, { passive: true });

    function renderCursor() {
        dot.style.transform = `translate3d(${mx}px, ${my}px, 0)`;

        rx += (mx - rx) * 0.38;
        ry += (my - ry) * 0.38;
        ring.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;

        requestAnimationFrame(renderCursor);
    }
    requestAnimationFrame(renderCursor);

    // Fast Event Delegation for Hover Expand
    document.addEventListener('mouseover', e => {
        if (e.target.closest('a, button, .skill-card, .project-card, .cert-card, .achievement-card, .info-card, .quick-action-btn, .nav-dot-container, .interactive-node')) {
            ring.classList.add('hover');
        } else {
            ring.classList.remove('hover');
        }
    }, { passive: true });
}


// ── NAVBAR ─────────────────────────────────────────────
function initNav() {
    const nav = document.getElementById('navbar');
    const sections = document.querySelectorAll('section[id]');
    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                nav.classList.toggle('scrolled', window.scrollY > 80);

                // Active link
                sections.forEach(sec => {
                    const top = sec.offsetTop - 140;
                    const bottom = top + sec.offsetHeight;
                    const link = document.querySelector(`.nav-link[href="#${sec.id}"]`);
                    if (link) {
                        const isActive = window.scrollY >= top && window.scrollY < bottom;
                        link.classList.toggle('active', isActive);
                    }
                });
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
}


// ── MOBILE MENU ────────────────────────────────────────
let mobileOpen = false;
function toggleMobile() {
    mobileOpen = !mobileOpen;
    document.getElementById('mobileMenu').classList.toggle('open', mobileOpen);
    document.getElementById('menuToggle').innerHTML =
        mobileOpen ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
}
function closeMobile() {
    mobileOpen = false;
    document.getElementById('mobileMenu').classList.remove('open');
    document.getElementById('menuToggle').innerHTML = '<i class="fas fa-bars"></i>';
}


// ── CONTACT FORM ───────────────────────────────────────
function triggerConfetti() {
    if (typeof confetti !== 'undefined') {
        const duration = 3000;
        const end = Date.now() + duration;

        (function frame() {
            confetti({
                particleCount: 5,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: ['#00ffc8', '#ff007f', '#ffbd2e', '#9d00ff', '#00e5ff', '#ffffff']
            });
            confetti({
                particleCount: 5,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: ['#00ffc8', '#ff007f', '#ffbd2e', '#9d00ff', '#00e5ff', '#ffffff']
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        }());
    }
}

async function handleSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const btn = document.getElementById('contactSubmitBtn') || form.querySelector('button[type="submit"]');
    const origText = btn ? btn.innerHTML : '';

    const endpoint = (CONFIG && CONFIG.formspreeEndpoint) ? CONFIG.formspreeEndpoint : '';
    const isConfigured = endpoint && !endpoint.includes('YOUR_FORMSPREE_ID');

    if (isConfigured) {
        if (btn) {
            btn.disabled = true;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Sending...';
        }

        try {
            const data = new FormData(form);
            const response = await fetch(endpoint, {
                method: 'POST',
                body: data,
                headers: { 'Accept': 'application/json' }
            });

            if (response.ok) {
                showToast('🎉 Message sent successfully! I will reply soon.');
                triggerConfetti();
                form.reset();
            } else {
                showToast('⚠️ Error sending message. Please try emailing directly.');
            }
        } catch (err) {
            showToast('⚠️ Network error. Please try emailing directly.');
        } finally {
            if (btn) {
                btn.disabled = false;
                btn.innerHTML = origText;
            }
        }
    } else {
        showToast('Message sent. (Demo Mode) Thank you for connecting!');
        triggerConfetti();
        form.reset();
    }
}
function showToast(msg) {
    const t = document.getElementById('toast');
    t.innerHTML = '<i class="fas fa-check-circle" style="color:var(--accent);margin-right:8px"></i>' + msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 3500);
}


// ── SMOOTH SCROLL ──────────────────────────────────────
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        // Skip links that also have an external href (e.g. navLogo pointing to Instagram)
        const href = a.getAttribute('href');
        if (!href || href === '#') return;
        // Only attach smooth scroll to internal anchor links
        a.addEventListener('click', e => {
            // If the href was dynamically changed to an external URL, don't intercept
            const currentHref = a.getAttribute('href');
            if (currentHref && !currentHref.startsWith('#')) return; // let browser handle external link
            e.preventDefault();
            const target = document.querySelector(currentHref);
            if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });
}


// ── INITIALIZE EVERYTHING ──────────────────────────────
window.addEventListener('DOMContentLoaded', () => {
    // 1. Populate all content from config
    populateSite();

    // 2. Start particle canvas
    ParticleSystem.init();

    // 3. Start animations (after DOM is populated)
    Animations.initReveals();
    Animations.initCounters();
    Animations.initProgressBars();
    Animations.initTyping(CONFIG.typingStrings);
    Animations.initTerminal();
    Animations.initTilt();

    // 4. UI interactions
    // Skip custom cursor on touch/mobile devices to avoid lag
    const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    if (!isTouchDevice) {
        initCursor();
    }
    initNav();
    initSmoothScroll();
    initDesktopQuestions();
    initCertificateVerification();
    initMobiusRibbonFavicon();
});

// ── DEVOPS MÖBIUS RIBBON ANIMATED FAVICON ENGINE (120 FPS) ──
function initMobiusRibbonFavicon() {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let link = document.querySelector("link[rel*='icon']");
    if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
    }

    let isPaused = false;
    document.addEventListener('visibilitychange', () => {
        isPaused = document.hidden;
        if (!isPaused) requestAnimationFrame(drawFavicon);
    });

    let lastDrawTime = 0;
    const TARGET_INTERVAL = 1000 / 60; // 60-120 FPS adaptive

    // Lemniscate of Gerono (Infinity Curve) Point Calculation
    function getMobiusPoint(t, a = 20, b = 13) {
        const x = 32 + a * Math.cos(t);
        const y = 32 + b * Math.sin(2 * t) * 0.5;
        return { x, y };
    }

    function drawFavicon(now) {
        if (isPaused) return;

        if (!lastDrawTime || now - lastDrawTime >= TARGET_INTERVAL) {
            lastDrawTime = now;
            const time = (now || performance.now()) * 0.0028;

            ctx.clearRect(0, 0, 64, 64);

            // 1. Dark Obsidian Rounded Squircle Container
            ctx.beginPath();
            if (ctx.roundRect) {
                ctx.roundRect(2, 2, 60, 60, 16);
            } else {
                ctx.rect(2, 2, 60, 60);
            }
            ctx.fillStyle = '#060913';
            ctx.fill();

            // Gradient perimeter border
            const rimGrad = ctx.createLinearGradient(0, 0, 64, 64);
            rimGrad.addColorStop(0, '#00ffc8');
            rimGrad.addColorStop(0.5, '#00f0ff');
            rimGrad.addColorStop(1, '#fbbf24');
            ctx.strokeStyle = rimGrad;
            ctx.lineWidth = 2.2;
            ctx.stroke();

            // 2. Ambient Dual-Lobe Glow Aura
            ctx.beginPath();
            ctx.arc(22, 32, 12, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(0, 255, 200, 0.12)';
            ctx.fill();

            ctx.beginPath();
            ctx.arc(42, 32, 12, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(251, 191, 36, 0.12)';
            ctx.fill();

            // 3. Draw 3D DevOps Mobius Infinity Ribbon Path
            ctx.beginPath();
            const totalSteps = 64;
            for (let i = 0; i <= totalSteps; i++) {
                const t = (i / totalSteps) * Math.PI * 2;
                const pt = getMobiusPoint(t);
                if (i === 0) ctx.moveTo(pt.x, pt.y);
                else ctx.lineTo(pt.x, pt.y);
            }
            ctx.closePath();

            // Gradient along the ribbon
            const ribbonGrad = ctx.createLinearGradient(10, 32, 54, 32);
            ribbonGrad.addColorStop(0, '#00ffc8');
            ribbonGrad.addColorStop(0.48, '#00f0ff');
            ribbonGrad.addColorStop(0.52, '#ffffff');
            ribbonGrad.addColorStop(1, '#fbbf24');
            ctx.strokeStyle = ribbonGrad;
            ctx.lineWidth = 4.5;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.stroke();

            // 4. Central Intersection Depth Highlight
            ctx.beginPath();
            ctx.arc(32, 32, 2.5, 0, Math.PI * 2);
            ctx.fillStyle = '#ffffff';
            ctx.fill();

            // 5. Circulating High-Voltage Energy Photon Particle along Mobius Curve
            const photonT = time % (Math.PI * 2);
            const photonPt = getMobiusPoint(photonT);

            // Photon Comet Tail (3 trail dots)
            for (let trail = 3; trail >= 1; trail--) {
                const trailT = (photonT - trail * 0.12 + Math.PI * 2) % (Math.PI * 2);
                const trailPt = getMobiusPoint(trailT);
                ctx.beginPath();
                ctx.arc(trailPt.x, trailPt.y, 2.0 - trail * 0.4, 0, Math.PI * 2);
                ctx.fillStyle = trailPt.x < 32 ? `rgba(0, 255, 200, ${0.4 - trail * 0.1})` : `rgba(251, 191, 36, ${0.4 - trail * 0.1})`;
                ctx.fill();
            }

            // Photon Glow Halo
            ctx.beginPath();
            ctx.arc(photonPt.x, photonPt.y, 6.0, 0, Math.PI * 2);
            ctx.fillStyle = photonPt.x < 32 ? 'rgba(0, 255, 200, 0.4)' : 'rgba(251, 191, 36, 0.4)';
            ctx.fill();

            // Photon Core
            ctx.beginPath();
            ctx.arc(photonPt.x, photonPt.y, 3.2, 0, Math.PI * 2);
            ctx.fillStyle = '#ffffff';
            ctx.fill();

            link.href = canvas.toDataURL('image/png');
        }

        requestAnimationFrame(drawFavicon);
    }

    requestAnimationFrame(drawFavicon);
}

// Hide loader with Cyberpunk Bootup Sequence
window.addEventListener('load', () => {
    const isBootEnabled = (CONFIG && CONFIG.showSections && CONFIG.showSections.bootLoader !== false);
    const container = document.getElementById('bootLogsContainer');
    const logs = (CONFIG && CONFIG.bootLogs && CONFIG.bootLogs.length) ? CONFIG.bootLogs : [
        "[INIT] Mounting in CSS v2.0...",
        "[OK] Initializing Cloud Engineer Neural Network...",
        "[OK] Security Protocols Verified",
        "[READY] Welcome Abhijay Chauhan"
    ];

    if (isBootEnabled && container) {
        const totalDuration = (CONFIG && CONFIG.bootDuration) ? CONFIG.bootDuration : 3500;
        let delay = 250;
        const targetActiveTime = Math.max(1000, totalDuration - 650);
        const interval = Math.floor(targetActiveTime / logs.length);

        logs.forEach((logText, idx) => {
            setTimeout(() => {
                const line = document.createElement('div');
                line.className = 'boot-log-line';
                line.textContent = logText;
                container.appendChild(line);
                setTimeout(() => line.classList.add('vis'), 50);
            }, delay + (idx * interval));
        });

        setTimeout(() => {
            const loader = document.getElementById('loader');
            if (loader) loader.classList.add('hidden');
        }, totalDuration);
    } else {
        setTimeout(() => {
            const loader = document.getElementById('loader');
            if (loader) loader.classList.add('hidden');
        }, 600);
    }
});

// ── MODAL CONVEYOR ANIMATION HELPERS ──────────────────────
function openModalConveyor(modal) {
    if (!modal) return;
    modal.classList.add('prep-left');
    modal.classList.remove('active');
    void modal.offsetWidth; // Force CSS reflow
    modal.classList.remove('prep-left');
    modal.classList.add('active');
}

function closeModalConveyor(modal) {
    if (!modal) return;
    modal.classList.remove('active');
}

// ── DESKTOP ASK ME ANYTHING TERMINAL ──────────────────────
function initDesktopQuestions() {
    const openBtn = document.getElementById('desktopQuestionsBtn');
    const modal = document.getElementById('desktopQModal');
    const closeBtn = document.getElementById('closeDesktopQModal');
    const body = document.getElementById('desktopQModalBody');
    if (!openBtn || !modal || !closeBtn || !body) return;

    const responses = {
        strength: [
            '── Query: Biggest Strength',
            '> Automating repetitive infrastructure tasks so teams can focus on shipping features.',
            '> Deep troubleshooting mindset: tracing system calls, packet drops, & memory leaks under pressure.',
            '> Building self-healing Kubernetes clusters with automated fallback & proactive autoscaling.',
            '> Writing clean, reusable IaC modules in Terraform & Ansible with 100% test coverage.',
            '> Relentless pursuit of 99.99% uptime with zero-downtime blue/green deployment strategies.'
        ],
        weakness: [
            '── Query: Honest Weakness',
            '> Over-engineering shell scripts and IaC modules just to optimize execution by 50ms.',
            '> Under-estimating documentation timelines because I prefer writing code over Markdown.',
            '> Working on it: strict time-boxing on rabbit holes & using automated docs generators.',
            '> Learning to delegate early instead of solo-fixing edge-case infrastructure bottlenecks.'
        ],
        hire: [
            '── Query: Why Hire You?',
            '> I treat your production infrastructure with the highest level of care & ownership.',
            '> Fresher drive combined with a professional Cloud Engineer mindset — 10x energy, 0 ego, fast learner.',
            '> I don\'t just patch symptoms; I perform root-cause analysis so bugs never recur.',
            '> Multi-cloud fluency across AWS, GCP, Docker, Kubernetes, Prometheus, and Terraform.',
            '> Ready to contribute to your CI/CD pipelines & on-call reliability from Day 1.'
        ],
        devops: [
            '── Query: Why DevOps & Cloud Engineer?',
            '> Closing the gap between software development & production ops is the ultimate challenge.',
            '> Owning the full lifecycle: local dev → containerization → CI/CD → multi-region cloud ship.',
            '> Infrastructure as Code turns hardware provisioning into version-controlled software.',
            '> Monitoring systems live with real-time telemetry brings incredible satisfaction under load.'
        ],
        stack: [
            '── Query: Favorite Tech Stack',
            '> Core Cloud: AWS (EC2, EKS, S3, IAM, CloudFront, VPC) & GCP Cloud Run.',
            '> Containerization & Orchestration: Docker, Kubernetes, Helm, ArgoCD GitOps.',
            '> Infrastructure as Code: Terraform, Ansible, CloudFormation.',
            '> Scripting & Code: Python (Boto3/FastAPI), Go (Microservices), Bash (Automation).',
            '> Observability: Prometheus, Grafana, ELK Stack (Elasticsearch, Logstash, Kibana), Loki.'
        ],
        coffee: [
            '── Query: Coffee or Code First?',
            '> System Initialization Sequence:',
            '> 1. Execute brew_coffee.sh --type=espresso --shots=2',
            '> 2. Hydrate & parse system metrics for the morning standup',
            '> 3. Compile mental stack → Run tests → Ship production-ready code',
            '> Status: 1 cup of dark roast yields ~350 lines of validated, lint-clean YAML & Python.'
        ],
        future: [
            '── Query: 5-Year Vision',
            '> Lead Cloud Infrastructure & Reliability Architect for high-throughput global platforms.',
            '> Architect zero-downtime, multi-region failover systems handling millions of requests/sec.',
            '> Author open-source Cloud Engineer tools & contribute back to CNCF cloud projects.',
            '> Mentor aspiring DevOps engineers and drive DevOps culture across engineering teams.'
        ],
        outage: [
            '── Query: Handling Outages & Incident Response',
            '> Rule 1: Stay calm. Clear communication > panicking during P0 incidents.',
            '> Rule 2: Triage telemetry logs (Prometheus metrics, Grafana dashboards, Loki aggregators).',
            '> Rule 3: Isolate blast radius & trigger automatic rollback to last stable build if needed.',
            '> Rule 4: Conduct a blameless post-mortem analysis to build preventive automation.'
        ],
        learning: [
            '── Query: How Do You Learn?',
            '> Hands-on lab experimentation beats passive video lectures every single time.',
            '> Build a project from scratch → deliberate chaos breaking tests → read official docs to fix.',
            '> Study production outages from Big Tech post-mortems to learn real-world architecture patterns.',
            '> Write technical write-ups to solidify conceptual understanding and share knowledge.'
        ],
        os: [
            '── Query: Linux vs Windows for Servers?',
            '> Linux 100%. POSIX CLI pipelines, systemd services, and SSH keys feel like home.',
            '> Ubuntu Server & Alpine Linux for ultra-lightweight Docker microservice base images.',
            '> Windows is fine for workstation gaming; Linux powers 99.9% of the cloud edge.'
        ],
        fun: [
            '── Query: Fun Fact',
            '> I once wrote a bash script to auto-trigger coffee brewing whenever CPU load stayed > 85%.',
            '> My very first Kubernetes cluster ran on 3 Raspberry Pi 4 nodes taped to my desk wall.',
            '> I name all my local test Virtual Machines after ships & characters from Sci-Fi movies.'
        ]
    };

    openBtn.addEventListener('click', () => {
        openModalConveyor(modal);
    });
    closeBtn.addEventListener('click', () => { closeModalConveyor(modal); });
    modal.addEventListener('click', e => { if (e.target === modal) closeModalConveyor(modal); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && modal.classList.contains('active')) closeModalConveyor(modal); });

    modal.querySelectorAll('.dq-chat-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const q = btn.getAttribute('data-q');
            if (!responses[q]) return;
            body.innerHTML = '';
            let delay = 0;
            responses[q].forEach(line => {
                setTimeout(() => {
                    const el = document.createElement('div');
                    el.className = 't-line vis ' + (line.startsWith('─') ? 't-dim' : 't-cmd');
                    el.textContent = line;
                    body.appendChild(el);
                    body.scrollTop = body.scrollHeight;
                }, delay);
                delay += 400;
            });
        });
    });
}

// ── CERTIFICATE VERIFICATION MODAL ────────────────────────
function initCertificateVerification() {
    const cards = document.querySelectorAll('.cert-card');
    const modal = document.getElementById('certModal');
    const closeBtn = document.getElementById('closeCertModal');
    const body = document.getElementById('certModalBody');
    if (!modal || !closeBtn || !body) return;

    cards.forEach(card => {
        card.addEventListener('click', () => {
            const idx = parseInt(card.getAttribute('data-index'), 10);
            const c = CONFIG.certifications[idx];
            if (!c) return;

            body.innerHTML = `
                <div class="cert-verify-container">
                    <div class="cert-image-wrapper">
                        <img src="${c.image || 'assets/favicon.svg'}" alt="${c.name}" class="cert-image">
                    </div>
                    <h3 class="cert-verify-name">${c.name}</h3>
                    <p class="cert-verify-issuer">Issued by: <strong>${c.issuer}</strong> (Issued ${c.date || c.year})</p>
                    
                    <div class="cert-verify-id-box">
                        <span class="cert-verify-id-label">Verification ID:</span>
                        <span class="cert-verify-id-value">${c.verificationId || 'N/A'}</span>
                    </div>
                    
                    <h4 class="cert-verify-concepts-title">Core concepts covered:</h4>
                    <div class="cert-verify-concepts-grid">
                        ${c.concepts ? c.concepts.map(concept => `<span class="cert-verify-concept-tag">${concept}</span>`).join('') : '<span class="cert-verify-concept-tag">N/A</span>'}
                    </div>
                </div>
            `;

            openModalConveyor(modal);
            if (typeof ParticleSystem !== 'undefined' && typeof ParticleSystem.boost === 'function') {
                ParticleSystem.boost(true);
            }
        });
    });

    const closeModal = () => {
        closeModalConveyor(modal);
        if (typeof ParticleSystem !== 'undefined' && typeof ParticleSystem.boost === 'function') {
            ParticleSystem.boost(false);
        }
    };

    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && modal.classList.contains('active')) closeModal(); });
}