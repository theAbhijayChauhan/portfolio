// ══════════════════════════════════════════════════════════════
//  MOBILE JS — Powered 100% by CONFIG (js/config.js)
//  No hover events. No canvas loops. No custom cursor.
//  Retained: Typing, Counters, Progress Bars, Terminal,
//            Confetti Burst, Contact Form, Scroll Reveals.
// ══════════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
    // Run boot loader first
    initMobileBootLoader();
    populateMobileSite();
    initScrollReveals();
    initTyping(CONFIG.typingStrings);
    initBottomNav();
    initContactForm();
    initMobilePremiumFeatures();
    initTinderProjects();
});

// ── MOBILE BOOT LOADER ────────────────────────────────────────
function initMobileBootLoader() {
    const isBootEnabled = CONFIG && CONFIG.showSections && CONFIG.showSections.bootLoader !== false;
    const container = document.getElementById('mobileBootLogs');
    const loader = document.getElementById('mobileLoader');
    const logs = (CONFIG && CONFIG.bootLogs && CONFIG.bootLogs.length) ? CONFIG.bootLogs : [
        "[INIT] Mounting Mobile CSS v2.0...",
        "[OK] Initializing SRE Neural Network...",
        "[OK] Security Protocols Verified",
        "[READY] Welcome " + (CONFIG.name || 'User')
    ];

    if (isBootEnabled && container && loader) {
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
            loader.classList.add('hidden');
        }, totalDuration);
    } else if (loader) {
        loader.classList.add('hidden');
    }
}

// ── HELPER ────────────────────────────────────────────────────
function ensureProtocol(url) {
    if (!url) return '#';
    url = url.trim();
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    return 'https://' + url;
}

// ── POPULATE ALL CONTENT FROM CONFIG ──────────────────────────
function populateMobileSite() {
    const C = CONFIG;
    const S = C.showSections || {};

    // ── Title ──
    document.title = `${C.name} — ${C.title}`;

    // ── Header: Instagram Banner ──
    const instaBanner = document.getElementById('instaBanner');
    if (instaBanner) {
        if (S.instagramBanner === false) {
            instaBanner.style.display = 'none';
        } else if (C.instagramLink) {
            instaBanner.style.cursor = 'pointer';
            instaBanner.onclick = () => window.open(ensureProtocol(C.instagramLink), '_blank');
        }
    }

    // ── Header: Nav Logo → Instagram Link ──
    const navLogo = document.getElementById('navLogo');
    if (navLogo) {
        navLogo.innerHTML = `${C.initials}<span class="accent-dot">.</span>`;
        if (C.instagramLink) {
            navLogo.href = ensureProtocol(C.instagramLink);
            navLogo.target = '_blank';
            navLogo.rel = 'noopener noreferrer';
        }
    }

    // ── Resume Links (Header + Hero) ──
    const resumeHref = C.assets?.resume || C.resumeLink || '#';
    const resumeLink = document.getElementById('resumeLink');
    if (resumeLink) resumeLink.href = resumeHref;
    const resumeBtn = document.getElementById('resumeBtn');
    if (resumeBtn) resumeBtn.href = resumeHref;

    // ── Footer ──
    const footerYear = document.getElementById('footerYear');
    if (footerYear) footerYear.textContent = new Date().getFullYear();
    const footerName = document.getElementById('footerName');
    if (footerName) footerName.textContent = C.name;

    // ── Hero ──
    const photoSrc = C.assets?.profilePhoto || C.photo || '';
    const heroPhoto = document.getElementById('heroPhoto');
    if (heroPhoto) heroPhoto.src = photoSrc;

    // Hero Avatar visibility toggle
    const heroAvatarContainer = document.getElementById('heroAvatarContainer');
    if (heroAvatarContainer && S.heroAvatar === false) {
        heroAvatarContainer.style.display = 'none';
    }

    const heroName = document.getElementById('heroName');
    if (heroName) heroName.textContent = C.name;
    const heroTagline = document.getElementById('heroTagline');
    if (heroTagline) heroTagline.textContent = C.tagline;

    // ── Stats ──
    const statsSection = document.getElementById('statsSection');
    const statsGrid = document.getElementById('statsGrid');
    if (statsGrid) {
        if (S.stats !== false) {
            statsGrid.innerHTML = C.stats.map(s => `
                <div class="stat-card">
                    <div class="stat-num" data-target="${s.value}" data-suffix="${s.suffix || ''}">0${s.suffix || ''}</div>
                    <div class="stat-label">${s.label}</div>
                </div>
            `).join('');
        } else if (statsSection) {
            statsSection.style.display = 'none';
        }
    }

    // ── About ──
    const aboutSection = document.getElementById('about');
    if (S.about !== false) {
        const aboutP1 = document.getElementById('aboutP1');
        if (aboutP1) aboutP1.textContent = C.about[0] || '';
        const aboutP2 = document.getElementById('aboutP2');
        if (aboutP2) aboutP2.textContent = C.about[1] || '';

        // Availability Badge
        const availBadge = document.getElementById('availabilityBadge');
        if (availBadge) {
            if (C.available === false) {
                availBadge.style.display = 'none';
            } else {
                const profilePhoto = document.getElementById('profilePhoto');
                if (profilePhoto) profilePhoto.src = photoSrc;
            }
        }

        // Social Links (About section)
        const socialRow = document.getElementById('socialLinks');
        if (socialRow) socialRow.innerHTML = buildSocialLinks();

        // Terminal
        populateTerminal(C.terminal);

    } else if (aboutSection) {
        aboutSection.style.display = 'none';
    }

    // ── Skills ──
    const skillsSection = document.getElementById('skills');
    const skillsGrid = document.getElementById('skillsGrid');
    if (skillsGrid) {
        if (S.skills !== false) {
            skillsGrid.innerHTML = C.skills.map(s => `
                <div class="skill-item">
                    <div class="skill-header">
                        <span><i class="${s.icon} skill-icon"></i>${s.name}</span>
                        <span class="skill-level">${s.level}%</span>
                    </div>
                    <div class="skill-bar">
                        <div class="skill-fill" data-width="${s.level}"></div>
                    </div>
                </div>
            `).join('');
        } else if (skillsSection) {
            skillsSection.style.display = 'none';
        }
    }

    // ── Projects ──
    const projectsSection = document.getElementById('projects');
    const projectsGrid = document.getElementById('projectsGrid');
    if (projectsGrid) {
        if (S.projects !== false) {
            const showImg = (S.projectImages !== false);
            const imgKeys = ['project1Image', 'project2Image', 'project3Image', 'project4Image', 'project5Image', 'project6Image'];
            projectsGrid.innerHTML = C.projects.map((p, i) => {
                const imgPath = C.assets ? C.assets[imgKeys[i]] : p.image;
                const hasImg = showImg && imgPath;
                return `
                <div class="project-card">
                    ${hasImg
                        ? `<div class="project-img" style="background-image:url('${imgPath}')"></div>`
                        : `<div class="project-img"><i class="fas fa-code"></i></div>`
                    }
                    <div class="project-info">
                        <div class="project-title">${p.title}</div>
                        <div class="project-desc">${p.desc}</div>
                        <div class="project-tags">${p.tags.map(t => `<span class="tag">${t}</span>`).join('')}</div>
                        <a href="${ensureProtocol(p.link)}" target="_blank" rel="noopener" class="btn btn-secondary" style="margin-top:10px;font-size:0.8rem;padding:6px 12px">
                            <i class="fas fa-external-link-alt"></i> View Project
                        </a>
                    </div>
                </div>`;
            }).join('');
        } else if (projectsSection) {
            projectsSection.style.display = 'none';
        }
    }

    // ── Education ──
    const eduSection = document.getElementById('education');
    const eduTimeline = document.getElementById('educationTimeline');
    if (eduTimeline) {
        if (S.education !== false) {
            eduTimeline.innerHTML = C.education.map(e => `
                <div class="timeline-item">
                    <div class="timeline-dot"></div>
                    <div class="timeline-badge">${e.year}</div>
                    <div class="timeline-degree">${e.degree}</div>
                    <div class="timeline-school">${e.institution}</div>
                    <div class="timeline-gpa">GPA: ${e.gpa}</div>
                    ${e.highlights && e.highlights.length
                        ? `<ul class="timeline-highlights">${e.highlights.map(h => `<li>${h}</li>`).join('')}</ul>`
                        : ''}
                </div>
            `).join('');
        } else if (eduSection) {
            eduSection.style.display = 'none';
        }
    }

    // ── Certifications ──
    const certsSection = document.getElementById('certifications');
    const certsGrid = document.getElementById('certsGrid');
    if (certsGrid) {
        if (S.certifications !== false) {
            certsGrid.innerHTML = C.certifications.map(c => `
                <div class="cert-card">
                    <i class="${c.icon} cert-icon" style="color:${c.iconColor}"></i>
                    <div>
                        <div class="cert-title">${c.name}</div>
                        <div class="cert-meta">${c.issuer} &middot; ${c.year}</div>
                    </div>
                </div>
            `).join('');
        } else if (certsSection) {
            certsSection.style.display = 'none';
        }
    }

    // ── Achievements ──
    const achSection = document.getElementById('achievements');
    const achGrid = document.getElementById('achievementsGrid');
    if (achGrid) {
        if (S.achievements !== false) {
            achGrid.innerHTML = C.achievements.map(a => `
                <div class="achievement-card">
                    <i class="fas fa-bolt achievement-icon"></i>
                    <div class="achievement-title">${a}</div>
                </div>
            `).join('');
        } else if (achSection) {
            achSection.style.display = 'none';
        }
    }

    // ── Contact ──
    const contactSection = document.getElementById('contact');
    if (contactSection) {
        if (S.contact === false) {
            contactSection.style.display = 'none';
        } else {
            const emailEl = document.getElementById('contactEmail');
            if (emailEl) { emailEl.href = `mailto:${C.email}`; emailEl.textContent = C.email; }
            const phoneEl = document.getElementById('contactPhone');
            if (phoneEl) phoneEl.textContent = C.phone;
            const locEl = document.getElementById('contactLocation');
            if (locEl) locEl.textContent = C.location;

            // Contact Socials (mirrors About socials)
            const contactSocials = document.getElementById('contactSocials');
            if (contactSocials) contactSocials.innerHTML = buildSocialLinks();
        }
    }
}

// ── SOCIAL LINKS BUILDER ──────────────────────────────────────
function buildSocialLinks() {
    const C = CONFIG;
    const icons = {
        linkedin: 'fab fa-linkedin-in',
        github:   'fab fa-github',
        devto:    'fab fa-dev',
        youtube:  'fab fa-youtube',
    };
    return Object.entries(C.links)
        .filter(([, url]) => url)
        .map(([key, url]) => `
            <a href="${ensureProtocol(url)}" target="_blank" rel="noopener" class="social-link" aria-label="${key}">
                <i class="${icons[key] || 'fas fa-link'}"></i>
            </a>
        `).join('');
}

// ── TERMINAL POPULATION ───────────────────────────────────────
function populateTerminal(t) {
    if (!t) return;
    const termBody = document.getElementById('terminalBody');
    if (!termBody) return;

    let html = `<div class="t-line"><span class="t-prompt">$</span> <span class="t-cmd">cat profile.yaml</span></div>`;
    html += `<div class="t-line"><span class="t-dim">---</span></div>`;
    html += `<div class="t-line"><span class="t-key">name</span><span class="t-dim">:</span> <span class="t-val">"${t.name}"</span></div>`;
    html += `<div class="t-line"><span class="t-key">role</span><span class="t-dim">:</span> <span class="t-val">"${t.role}"</span></div>`;
    html += `<div class="t-line"><span class="t-key">location</span><span class="t-dim">:</span> <span class="t-val">"${t.location}"</span></div>`;
    html += `<div class="t-line"><span class="t-key">email</span><span class="t-dim">:</span> <span class="t-val">"${t.email}"</span></div>`;
    html += `<div class="t-line"><span class="t-key">education</span><span class="t-dim">:</span> <span class="t-val">"${t.education}"</span></div>`;
    html += `<div class="t-line"><span class="t-key">languages</span><span class="t-dim">:</span></div>`;
    t.languages.forEach(l => { html += `<div class="t-line"><span class="t-dim">  - ${l}</span></div>`; });
    html += `<div class="t-line"><span class="t-key">interests</span><span class="t-dim">:</span></div>`;
    t.interests.forEach(i => { html += `<div class="t-line"><span class="t-dim">  - ${i}</span></div>`; });
    html += `<div class="t-line"><span class="t-prompt">$</span> <span class="typing-cursor" style="color:var(--accent)"></span></div>`;
    termBody.innerHTML = html;
}

// ── SCROLL REVEALS + COUNTERS + SKILL BARS + TERMINAL ─────────
function initScrollReveals() {
    const sections = document.querySelectorAll('.mobile-section');
    let terminalAnimated = false;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('vis');

                // Animate stat counters
                entry.target.querySelectorAll('.stat-num').forEach(counter => {
                    animateCounter(counter,
                        +counter.getAttribute('data-target'),
                        counter.getAttribute('data-suffix') || '');
                });

                // Animate skill bars
                entry.target.querySelectorAll('.skill-fill').forEach(fill => {
                    fill.style.width = fill.getAttribute('data-width') + '%';
                });

                // Animate terminal lines (only once)
                if (!terminalAnimated && entry.target.querySelector('#terminalBody')) {
                    terminalAnimated = true;
                    const lines = entry.target.querySelectorAll('.t-line');
                    lines.forEach((line, i) => {
                        setTimeout(() => line.classList.add('vis'), i * 120);
                    });
                }

                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    sections.forEach(sec => observer.observe(sec));
}

// ── ANIMATED COUNTER ──────────────────────────────────────────
function animateCounter(el, target, suffix) {
    let current = 0;
    const increment = target / 60;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            el.innerText = target + suffix;
            clearInterval(timer);
        } else {
            el.innerText = Math.ceil(current) + suffix;
        }
    }, 18);
}

// ── TYPING ANIMATION ──────────────────────────────────────────
function initTyping(strings) {
    const el = document.getElementById('typingText');
    if (!el || !strings || !strings.length) return;
    let stringIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    const type = () => {
        const current = strings[stringIndex];
        if (isDeleting) {
            el.innerText = current.substring(0, charIndex - 1);
            charIndex--;
        } else {
            el.innerText = current.substring(0, charIndex + 1);
            charIndex++;
        }
        let speed = isDeleting ? 40 : 85;
        if (!isDeleting && charIndex === current.length) {
            speed = 1600; isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            stringIndex = (stringIndex + 1) % strings.length;
            speed = 400;
        }
        setTimeout(type, speed);
    };
    setTimeout(type, 1000);
}

// ── BOTTOM NAV ACTIVE STATE & SMOOTH NAVIGATION ───────────────
function initBottomNav() {
    const navItems = document.querySelectorAll('.nav-item');
    const sectionIds = ['home', 'about', 'skills', 'projects', 'education', 'certifications', 'achievements', 'contact'];
    
    // Add click handler to prevent any default anchor reload and smooth scroll instead
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const secId = item.getAttribute('data-sec');
            const targetSec = document.getElementById(secId);
            if (targetSec) {
                const headerOffset = 65;
                const elementPosition = targetSec.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });

                // Immediately update active class
                navItems.forEach(i => i.classList.remove('active'));
                item.classList.add('active');
            }
        });
    });

    // Scroll listener to update active item as user scrolls
    function updateActiveOnScroll() {
        const scrollPosition = window.pageYOffset + 150;
        
        let currentSection = 'home';
        sectionIds.forEach(id => {
            const sec = document.getElementById(id);
            if (sec) {
                const top = sec.offsetTop;
                const height = sec.offsetHeight;
                if (scrollPosition >= top && scrollPosition < top + height) {
                    currentSection = id;
                }
            }
        });
        
        // Edge case: reached bottom of page
        if ((window.innerHeight + window.pageYOffset) >= document.body.offsetHeight - 60) {
            currentSection = 'contact';
        }

        navItems.forEach(item => {
            const sec = item.getAttribute('data-sec');
            if (sec === currentSection) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }

    window.addEventListener('scroll', updateActiveOnScroll, { passive: true });
    updateActiveOnScroll(); // initial check
}

// ── TOAST ─────────────────────────────────────────────────────
function showToast(msg) {
    const t = document.getElementById('toast');
    if (!t) return;
    t.innerHTML = `<i class="fas fa-check-circle" style="color:var(--accent);margin-right:6px"></i>${msg}`;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 3500);
}

// ── CONFETTI BURST (Matching Desktop — Both Sides) ────────────
function triggerConfetti() {
    if (typeof confetti === 'undefined') return;
    const duration = 3000;
    const end = Date.now() + duration;
    const colors = ['#00ffc8', '#ff007f', '#ffbd2e', '#9d00ff', '#00e5ff', '#ffffff'];
    (function frame() {
        confetti({ particleCount: 5, angle: 60,  spread: 55, origin: { x: 0 }, colors });
        confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 }, colors });
        if (Date.now() < end) requestAnimationFrame(frame);
    }());
}

// ── CONTACT FORM ──────────────────────────────────────────────
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = document.getElementById('contactSubmitBtn');
        const origHTML = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        btn.disabled = true;

        const endpoint = CONFIG.formspreeEndpoint || '';
        const isConfigured = endpoint && !endpoint.includes('YOUR_FORMSPREE_ID');

        if (isConfigured) {
            try {
                const res = await fetch(endpoint, {
                    method: 'POST',
                    body: new FormData(form),
                    headers: { 'Accept': 'application/json' }
                });
                if (res.ok) {
                    showToast('🎉 Message sent! I\'ll reply soon.');
                    triggerConfetti();
                    form.reset();
                } else {
                    showToast('⚠️ Error sending. Please email directly.');
                }
            } catch {
                showToast('⚠️ Network error. Please email directly.');
            }
        } else {
            showToast('Message sent! (Demo Mode)');
            triggerConfetti();
            form.reset();
        }

        btn.innerHTML = origHTML;
        btn.disabled = false;
    });
}

// ══════════════════════════════════════════════════════════════
//  MOBILE PREMIUM FEATURES (Exclusive)
// ══════════════════════════════════════════════════════════════
function initMobilePremiumFeatures() {
    initMobileParticles();
    initMatrixMode();
    initLiveTelemetry();
    initStreakBadge();         // replaces local time
    initCyberpunkToggle();
    initHoldToDeploy();
    initQuestionsModal();      // new floating modal chatbot
    initTerminalSwipeUnlock(); // restored swipe-to-unlock for about_me
    initScratchCard();
    initSkillSphere();
    initPhonePrivacyFlip();
    initMobileGames();
}

// ── FEATURE 2: Matrix Mode (Konami Code Tap on Photo) ───────
function initMatrixMode() {
    const photo = document.getElementById('heroPhoto');
    if (!photo) return;
    let tapCount = 0;
    let tapTimeout;
    
    photo.addEventListener('click', (e) => {
        // Only trigger if they actually tapped fast, don't follow link yet if tapping
        tapCount++;
        clearTimeout(tapTimeout);
        
        if (tapCount >= 5) {
            e.preventDefault();
            document.body.classList.toggle('matrix-mode');
            if (navigator.vibrate) navigator.vibrate([100, 50, 100, 50, 100]); // heavy buzz
            showToast('🟢 Matrix Mode Toggled');
            tapCount = 0;
        } else {
            tapTimeout = setTimeout(() => { tapCount = 0; }, 400);
        }
    });
}

// ── FEATURE 3: Live Device Telemetry ───────────────────────
async function initLiveTelemetry() {
    const statusSpan = document.getElementById('heroTelemetry');
    if (!statusSpan) return;
    
    let telemetryString = '';
    
    // Check battery only
    if (navigator.getBattery) {
        try {
            const battery = await navigator.getBattery();
            const level = Math.round(battery.level * 100);
            const isCharging = battery.charging ? '⚡' : '🔋';
            telemetryString = `Your Device: ${isCharging} ${level}%`;
            
            // Listen for battery changes to update live
            battery.addEventListener('levelchange', () => initLiveTelemetry());
            battery.addEventListener('chargingchange', () => initLiveTelemetry());
        } catch (e) {
            telemetryString = 'System Operational';
        }
    } else {
        telemetryString = 'System Operational';
    }
    
    statusSpan.textContent = telemetryString;
}

// ── Streak Badge (replaces local time) ──────────────────
function initStreakBadge() {
    const icon = document.getElementById('streakIcon');
    const text = document.getElementById('streakText');
    if (!icon || !text) return;
    const msgs = [
        { i: '🔥', t: 'Day 1 streak — LFG!' },
        { i: '⚡', t: 'Building every day' },
        { i: '🛠️', t: 'Always automating' },
        { i: '🌱', t: 'Fresher. Not newbie.' },
    ];
    let idx = 0;
    function cycle() {
        icon.textContent = msgs[idx].i;
        text.textContent = msgs[idx].t;
        idx = (idx + 1) % msgs.length;
    }
    cycle();
    setInterval(cycle, 3500);
}

// ── Phone Privacy Flip ──────────────────────────────
function initPhonePrivacyFlip() {
    const phone = document.getElementById('contactPhone');
    const privacy = document.getElementById('contactPhonePrivacy');
    if (!phone || !privacy) return;
    let showPhone = true;
    setInterval(() => {
        showPhone = !showPhone;
        phone.style.display   = showPhone ? '' : 'none';
        privacy.style.display = showPhone ? 'none' : '';
    }, 2000);
}

// ── Terminal Swipe-to-Unlock (about_me) ──────────────
function initTerminalSwipeUnlock() {
    const overlay = document.getElementById('terminalOverlay');
    const thumb   = document.getElementById('swipeThumb');
    if (!overlay || !thumb) return;

    // Wait for layout to settle before reading width
    requestAnimationFrame(() => {
        const track = thumb.parentElement;
        const maxSwipe = track.offsetWidth - thumb.offsetWidth;
        let startX = 0, curX = 0;

        thumb.addEventListener('touchstart', e => {
            startX = e.touches[0].clientX - curX;
        }, { passive: true });

        thumb.addEventListener('touchmove', e => {
            curX = Math.min(maxSwipe, Math.max(0, e.touches[0].clientX - startX));
            thumb.style.transform = `translateX(${curX}px)`;
            if (curX >= maxSwipe * 0.92) {
                overlay.classList.add('unlocked');
                if (navigator.vibrate) navigator.vibrate(60);
            }
        }, { passive: true });

        thumb.addEventListener('touchend', () => {
            if (curX < maxSwipe * 0.92) {
                curX = 0;
                thumb.style.transition = 'transform 0.3s ease';
                thumb.style.transform  = 'translateX(0px)';
                setTimeout(() => { thumb.style.transition = 'none'; }, 300);
            }
        });
    });
}

// ── Questions Modal ─────────────────────────────────
function initQuestionsModal() {
    const openBtn  = document.getElementById('questionsBtn');
    const modal    = document.getElementById('questionsModal');
    const closeBtn = document.getElementById('closeQModal');
    const body     = document.getElementById('qmodalBody');
    if (!openBtn || !modal || !closeBtn || !body) return;

    const responses = {
        strength: [
            '── Query: Biggest Strength',
            '> I automate the boring stuff so humans can do the creative stuff.',
            '> I build systems that don\'t wake you up at 3 AM.',
            '> I learn faster when I\'m building than when I\'m reading.'
        ],
        weakness: [
            '── Query: Honest Weakness',
            '> I sometimes over-engineer simple scripts just for fun.',
            '> I underestimate how long documentation takes.',
            '> Working on it: time-boxing my rabbit holes.'
        ],
        hire: [
            '── Query: Why Hire You?',
            '> Because I treat your infrastructure like it\'s my own.',
            '> I\'m a fresher with a hacker\'s mindset and 10x the drive.',
            '> I don\'t just fix things — I prevent them from breaking.'
        ],
        devops: [
            '── Query: Why DevOps?',
            '> Because the gap between dev and ops was frustrating me.',
            '> I love owning the full lifecycle: code → build → ship → monitor.',
            '> Infrastructure is just code that people don\'t take seriously enough.'
        ],
        stack: [
            '── Query: Favorite Tech Stack',
            '> Primary: Docker + Kubernetes + Terraform + AWS.',
            '> Code: Python for automation, Go for microservices, Bash for glue.',
            '> Observability: Prometheus + Grafana + Loki for full visibility.'
        ],
        coffee: [
            '── Query: Coffee or Code First?',
            '> Execute coffee.sh -> hydrate -> compile thoughts -> ship code.',
            '> Current caffeine-to-code ratio: 1 espresso = 200 lines of clean YAML.'
        ],
        future: [
            '── Query: 5-Year Goal',
            '> Lead cloud infrastructure architect for scalable platforms.',
            '> Master multi-cloud resilience & zero-downtime deployment pipelines.',
            '> Mentor the next wave of DevOps & SRE engineers.'
        ],
        outage: [
            '── Query: Handling Outages',
            '> Rule 1: Stay calm. Panic breaks more than it fixes.',
            '> Rule 2: Inspect telemetry logs, isolate root cause, roll back if needed.',
            '> Rule 3: Write a blameless postmortem so it NEVER happens twice.'
        ],
        learning: [
            '── Query: How Do You Learn?',
            '> Build first, break it on purpose, read docs to fix it.',
            '> Hands-on lab projects beat passive video lectures every time.'
        ],
        os: [
            '── Query: Linux vs Windows for Servers?',
            '> Linux 100%. Bash & terminal pipelines are home.',
            '> Windows is fine for gaming; Linux runs the modern world.'
        ],
        fun: [
            '── Query: Fun Fact',
            '> I once wrote a bash script to auto-order coffee when my CPU hits 80%.',
            '> My first Kubernetes cluster ran on 3 Raspberry Pis taped to a wall.',
            '> I name my VMs after characters from The Matrix.'
        ]
    };

    openBtn.addEventListener('click', () => {
        modal.style.display = 'flex';
        if (navigator.vibrate) navigator.vibrate(30);
    });
    closeBtn.addEventListener('click', () => { modal.style.display = 'none'; });
    modal.addEventListener('click', e => { if (e.target === modal) modal.style.display = 'none'; });

    modal.querySelectorAll('.chat-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const q = btn.getAttribute('data-q');
            if (!responses[q]) return;
            if (navigator.vibrate) navigator.vibrate(25);
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

// ── FEATURE 6: Cyberpunk Toggle ──────────────────────
function initCyberpunkToggle() {
    const toggle = document.getElementById('themeToggle');
    if (!toggle) return;
    toggle.addEventListener('click', () => {
        document.body.classList.toggle('matrix-mode');
        if (navigator.vibrate) navigator.vibrate([40, 40]);
        if (document.body.classList.contains('matrix-mode')) {
            showToast('⚡ Cyberpunk Mode Activated');
            toggle.innerHTML = '<i class="fas fa-power-off"></i>';
        } else {
            showToast('Standard Mode');
            toggle.innerHTML = '<i class="fas fa-bolt"></i>';
        }
    });
}

// ── Helper: Slow Smooth Scroll to Top ─────────────────────────
function slowScrollToTop(durationMs = 1500) {
    const startPos = window.pageYOffset;
    const startTime = performance.now();
    
    function step(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / durationMs, 1);
        
        // Cubic ease-out for a smooth deceleration
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        
        window.scrollTo(0, startPos * (1 - easeProgress));
        
        if (progress < 1) {
            requestAnimationFrame(step);
        }
    }
    requestAnimationFrame(step);
}

// ── FEATURE 2 (New): Hold to Deploy Rocket ───────────
function initHoldToDeploy() {
    const btn = document.getElementById('deployBtn');
    const progress = btn?.querySelector('.deploy-progress');
    if (!btn || !progress) return;
    
    let holdTimer;
    let percent = 0;
    let isHolding = false;
    
    function updateProgress() {
        if (!isHolding) return;
        percent += 2;
        progress.style.width = `${percent}%`;
        
        if (percent > 30) btn.classList.add('launching');
        
        if (percent >= 100) {
            isHolding = false;
            percent = 0;
            progress.style.width = '0%';
            btn.classList.remove('launching');
            
            // Balanced festive confetti burst
            if (typeof confetti !== 'undefined') {
                confetti({
                    particleCount: 75,
                    spread: 70,
                    origin: { y: 0.85 },
                    colors: ['#00ffc8', '#ff007f', '#ffbd2e', '#9d00ff', '#00e5ff', '#ffffff']
                });
            }
            
            // Slow smooth scroll back to top
            slowScrollToTop(1500);
            showToast('🚀 Deployment Successful!');
        } else {
            holdTimer = requestAnimationFrame(updateProgress);
        }
    }
    
    const startHold = (e) => { e.preventDefault(); isHolding = true; percent = 0; updateProgress(); };
    const stopHold = () => { isHolding = false; percent = 0; progress.style.width = '0%'; btn.classList.remove('launching'); cancelAnimationFrame(holdTimer); };
    
    btn.addEventListener('touchstart', startHold, { passive: false });
    btn.addEventListener('touchend', stopHold);
    btn.addEventListener('touchcancel', stopHold);
    btn.addEventListener('mousedown', startHold);
    btn.addEventListener('mouseup', stopHold);
    btn.addEventListener('mouseleave', stopHold);
}

// ── FEATURE 5: Terminal Chatbot ──────────────────────
function initTerminalChatbot() {
    const chatUI = document.getElementById('terminalChatUI');
    const termBody = document.getElementById('terminalBody');
    if (!chatUI || !termBody) return;
    
    const responses = {
        strength: ["My biggest strength?", "> I automate the boring stuff so humans can do the creative stuff.", "> I build systems that don't wake you up at 3 AM."],
        weakness: ["My weakness?", "> I sometimes over-engineer simple scripts just for fun.", "> I drink too much coffee."],
        hire: ["Why hire me?", "> Because I treat your infrastructure like it's my own.", "> I'm a fresher with a hacker's mindset and 10x the drive."]
    };
    
    chatUI.querySelectorAll('.chat-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const q = btn.getAttribute('data-q');
            if (navigator.vibrate) navigator.vibrate(30);
            termBody.innerHTML = ''; // clear terminal
            let delay = 0;
            responses[q].forEach((line, i) => {
                setTimeout(() => {
                    const el = document.createElement('span');
                    el.className = 't-line vis t-cmd';
                    el.textContent = line;
                    termBody.appendChild(el);
                    termBody.scrollTop = termBody.scrollHeight;
                }, delay);
                delay += 600;
            });
        });
    });
}

// ── MOBILE SLOW BACKGROUND PARTICLES ──────────────────────────
function initMobileParticles() {
    const canvas = document.getElementById('mobileParticleCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }, { passive: true });

    const particleCount = Math.min(28, Math.max(16, Math.floor((width * height) / 18000)));
    const particles = [];

    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.35,
            vy: (Math.random() - 0.5) * 0.35,
            radius: Math.random() * 1.5 + 1
        });
    }

    let particlesPaused = false;
    document.addEventListener('visibilitychange', () => {
        particlesPaused = document.hidden;
        if (!particlesPaused) animate(); // Resume when tab comes back
    }, { passive: true });

    function animate() {
        if (particlesPaused) return; // Pause when tab hidden — saves battery!
        ctx.clearRect(0, 0, width, height);

        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            p.x += p.vx;
            p.y += p.vy;

            if (p.x < 0 || p.x > width) p.vx = -p.vx;
            if (p.y < 0 || p.y > height) p.vy = -p.vy;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(0, 255, 200, 0.45)';
            ctx.fill();

            for (let j = i + 1; j < particles.length; j++) {
                const p2 = particles[j];
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 90) {
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.strokeStyle = `rgba(0, 255, 200, ${0.15 * (1 - dist / 90)})`;
                    ctx.lineWidth = 0.8;
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(animate);
    }
    animate();
}

// ── FEATURE 1: Scratch-Off Card with Multi-Talents ──────────────
function initScratchCard() {
    const canvas = document.getElementById('scratchCanvas');
    const textEl = document.getElementById('scratchTalentText');
    const numEl  = document.getElementById('scratchTalentNum');
    const nextBtn = document.getElementById('scratchNextBtn');
    if (!canvas || !textEl) return;

    const talents = [
        "I automated my own coffee machine using an IoT relay & cron job! ☕",
        "I can play piano by ear & compose synthwave beats! 🎹",
        "I can debug complex Kubernetes YAML errors in my sleep! ⚡",
        "I once ran a Linux server cluster on 3 Raspberry Pis taped to a wall! 🛠️",
        "I write Bash scripts for any task that takes more than 2 minutes! 💻"
    ];
    let currentIdx = 0;

    function resetScratch() {
        canvas.style.opacity = '1';
        canvas.style.pointerEvents = 'auto';
        const ctx = canvas.getContext('2d');
        const rect = canvas.parentElement.getBoundingClientRect();
        canvas.width = rect.width; canvas.height = rect.height;
        ctx.globalCompositeOperation = 'source-over';
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.font = '600 13px sans-serif'; ctx.fillStyle = '#94a3b8'; ctx.textAlign = 'center';
        ctx.fillText('✨ Scratch here to reveal talent', canvas.width/2, canvas.height/2 + 4);
        ctx.globalCompositeOperation = 'destination-out';
    }

    resetScratch();

    let isScratching = false;
    let scratchedPixels = 0;

    const scratch = (e) => {
        if (!isScratching) return;
        const touch = e.touches ? e.touches[0] : e;
        const bcr = canvas.getBoundingClientRect();
        const x = touch.clientX - bcr.left;
        const y = touch.clientY - bcr.top;
        const ctx = canvas.getContext('2d');
        ctx.beginPath();
        ctx.arc(x, y, 24, 0, Math.PI * 2);
        ctx.fill();

        scratchedPixels++;
        if (scratchedPixels > 25) {
            canvas.style.opacity = '0';
            canvas.style.pointerEvents = 'none';
        }
    };

    canvas.addEventListener('touchstart', (e) => { isScratching = true; scratch(e); }, { passive: true });
    canvas.addEventListener('touchmove', scratch, { passive: true });
    canvas.addEventListener('touchend', () => { isScratching = false; });
    canvas.addEventListener('mousedown', (e) => { isScratching = true; scratch(e); });
    canvas.addEventListener('mousemove', scratch);
    canvas.addEventListener('mouseup', () => { isScratching = false; });

    if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            scratchedPixels = 0;
            currentIdx = (currentIdx + 1) % talents.length;
            textEl.textContent = talents[currentIdx];
            if (numEl) numEl.textContent = `#${currentIdx + 1}`;
            resetScratch();
        });
    }
}

// ── FEATURE 9: Skill Sphere (Original Centered Fibonacci 3D Rotation — Non-Interactive) ──
function initSkillSphere() {
    const container = document.getElementById('skillSphereContainer');
    if (!container || !CONFIG.skills || !CONFIG.skills.length) return;

    container.innerHTML = '';
    const tags = CONFIG.skills.map(s => s.name);
    const radius = 100;
    let angleX = 0, angleY = 0;
    const velX = 0.005, velY = 0.005;

    // Create elements evenly on Fibonacci sphere
    const elements = tags.map((tag, i) => {
        const el = document.createElement('div');
        el.className = 'sphere-tag';
        el.textContent = tag;
        container.appendChild(el);

        const phi = Math.acos(1 - 2 * (i + 0.5) / tags.length);
        const theta = Math.PI * (1 + Math.sqrt(5)) * i;
        return {
            el,
            x: radius * Math.cos(theta) * Math.sin(phi),
            y: radius * Math.sin(theta) * Math.sin(phi),
            z: radius * Math.cos(phi)
        };
    });

    function render() {
        angleX += velX;
        angleY += velY;

        const cosX = Math.cos(angleX), sinX = Math.sin(angleX);
        const cosY = Math.cos(angleY), sinY = Math.sin(angleY);

        elements.forEach(item => {
            let x1 = item.x * cosY - item.z * sinY;
            let z1 = item.z * cosY + item.x * sinY;
            let y1 = item.y * cosX - z1 * sinX;
            let z2 = z1 * cosX + item.y * sinX;

            const scale = 190 / (190 + z2);
            item.el.style.transform = `translate(-50%, -50%) translate3d(${x1 * scale}px, ${y1 * scale}px, 0) scale(${scale})`;
            item.el.style.opacity = Math.max(0.25, scale - 0.4);
            item.el.style.zIndex = Math.round(scale * 100);
        });

        requestAnimationFrame(render);
    }

    render();
    // NO touch drag or mouse move listeners attached -> 100% NON-INTERACTIVE!
}

// ── TINDER-STYLE PROJECTS CARDS ─────────────────────────────
function initTinderProjects() {
    const grid = document.getElementById('projectsGrid');
    const passBtn = document.getElementById('tinderPassBtn');
    const likeBtn = document.getElementById('tinderLikeBtn');
    if (!grid) return;

    const cards = Array.from(grid.querySelectorAll('.project-card'));
    if (!cards.length) return;

    let currentIndex = cards.length - 1; // Top card is last in stack HTML

    function updateCardStack() {
        cards.forEach((card, idx) => {
            if (idx > currentIndex) return;
            const offset = currentIndex - idx;
            if (offset === 0) {
                card.style.transform = 'translate3d(0, 0, 0) scale(1)';
                card.style.zIndex = '10';
                card.style.opacity = '1';
                card.style.pointerEvents = 'auto';
            } else if (offset === 1) {
                card.style.transform = 'translate3d(0, 12px, -20px) scale(0.95)';
                card.style.zIndex = '9';
                card.style.opacity = '0.85';
                card.style.pointerEvents = 'none';
            } else {
                card.style.transform = 'translate3d(0, 24px, -40px) scale(0.9)';
                card.style.zIndex = '8';
                card.style.opacity = '0.6';
                card.style.pointerEvents = 'none';
            }
        });
    }

    updateCardStack();

    function swipeCard(direction) {
        if (currentIndex < 0) {
            cards.forEach(card => card.classList.remove('swiped-left', 'swiped-right'));
            currentIndex = cards.length - 1;
            updateCardStack();
            showToast('🔄 Deck reset!');
            return;
        }
        const topCard = cards[currentIndex];
        if (!topCard) return;

        if (direction === 'left') {
            topCard.classList.add('swiped-left');
        } else {
            topCard.classList.add('swiped-right');
            showToast('💖 Liked Project!');
        }

        if (navigator.vibrate) navigator.vibrate(30);

        currentIndex--;
        updateCardStack();

        if (currentIndex < 0) {
            setTimeout(() => {
                cards.forEach(card => card.classList.remove('swiped-left', 'swiped-right'));
                currentIndex = cards.length - 1;
                updateCardStack();
            }, 600);
        }
    }

    // Touch & Mouse Drag on Cards
    cards.forEach(card => {
        let startX = 0, startY = 0, currentX = 0, isDragging = false;

        const onStart = (e) => {
            const touch = e.touches ? e.touches[0] : e;
            startX = touch.clientX;
            startY = touch.clientY;
            isDragging = true;
            card.style.transition = 'none';
        };

        const onMove = (e) => {
            if (!isDragging) return;
            const touch = e.touches ? e.touches[0] : e;
            currentX = touch.clientX - startX;
            const rotate = currentX * 0.08;
            card.style.transform = `translate3d(${currentX}px, 0, 0) rotate(${rotate}deg)`;
        };

        const onEnd = () => {
            if (!isDragging) return;
            isDragging = false;
            card.style.transition = 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.3s ease';

            if (currentX > 80) {
                swipeCard('right');
            } else if (currentX < -80) {
                swipeCard('left');
            } else {
                card.style.transform = 'translate3d(0, 0, 0) scale(1) rotate(0deg)';
            }
            currentX = 0;
        };

        card.addEventListener('touchstart', onStart, { passive: true });
        card.addEventListener('touchmove', onMove, { passive: true });
        card.addEventListener('touchend', onEnd);
        card.addEventListener('mousedown', onStart);
        window.addEventListener('mousemove', onMove);
        window.addEventListener('mouseup', onEnd);
    });

    if (passBtn) passBtn.onclick = () => swipeCard('left');
    if (likeBtn) likeBtn.onclick = () => swipeCard('right');
}

// ── MOBILE GAMES SECTION (Play A Game ?) ──────────────────────
function initMobileGames() {
    const section = document.getElementById('mobileGamesSection');
    const triggerBtn = document.getElementById('openArcadeBtn');
    const modal = document.getElementById('gameModal');
    const titleEl = document.getElementById('gameModalTitle');
    const bodyEl = document.getElementById('gameModalBody');
    const backBtn = document.getElementById('backArcadeBtn');
    const closeBtn = document.getElementById('closeGameModal');

    if (section && CONFIG.showSections && CONFIG.showSections.mobileGames === false) {
        section.style.display = 'none';
        return;
    }

    if (!section || !triggerBtn || !modal || !bodyEl || !closeBtn) return;

    let activeGameLoop = null;
    let ecg120FpsAnimId = null;

    function stopActiveGame() {
        if (activeGameLoop) {
            clearInterval(activeGameLoop);
            activeGameLoop = null;
        }
        if (ecg120FpsAnimId) {
            cancelAnimationFrame(ecg120FpsAnimId);
            ecg120FpsAnimId = null;
        }
    }

    const gamesConfig = (CONFIG && CONFIG.mobileGamesList) ? CONFIG.mobileGamesList : {
        bugSmasher: true,
        cyberSnake: true,
        rocketBalancer: true,
        ddosDefense: true,
        devTrivia: true,
        serverOptimizer: true,
        spaceInvaders: true
    };

    // 👾 Game 1: Server Bug Smasher
    function startBugSmasherGame(container) {
        let score = 0;
        let cpuLoad = 0;
        let isGameOver = false;
        let currentSpeed = 850;
        let bugCount = 1;

        container.innerHTML = `
            <div class="smasher-container">
                <div class="smasher-score-bar">
                    <span>SCORE: <strong id="smasherScore" style="color:var(--accent)">0</strong></span>
                    <span>LEVEL: <strong id="smasherLevel" style="color:var(--accent2)">LVL 1</strong></span>
                    <span>CPU LOAD: <strong id="smasherCpu" style="color:#00ffc8">0%</strong></span>
                </div>
                <div class="smasher-grid">
                    ${Array(9).fill(0).map((_, i) => `<div class="smasher-cell" data-idx="${i}">🖥️</div>`).join('')}
                </div>
                <p id="smasherHint" style="font-size:0.75rem;color:var(--text-dim)">Tap bugs before CPU reaches 100%!</p>
            </div>
        `;

        const cells = container.querySelectorAll('.smasher-cell');
        const scoreEl = container.querySelector('#smasherScore');
        const levelEl = container.querySelector('#smasherLevel');
        const cpuEl = container.querySelector('#smasherCpu');
        const hintEl = container.querySelector('#smasherHint');

        function startLoop(speed) {
            stopActiveGame();
            activeGameLoop = setInterval(spawnBug, speed);
        }

        function checkDifficultyProgression() {
            if (score >= 200 && bugCount < 2) {
                bugCount = 2;
                currentSpeed = 450;
                if (levelEl) levelEl.textContent = '🔥 LVL 3 (2 Bugs!)';
                if (hintEl) hintEl.innerHTML = '<span style="color:#ff4444;font-weight:bold">🔥 DUAL BUG INVASION! 2 Bugs spawning at once!</span>';
                startLoop(currentSpeed);
            } else if (score >= 100 && score < 200 && currentSpeed > 500) {
                currentSpeed = 500;
                if (levelEl) levelEl.textContent = '⚡ LVL 2 (Fast)';
                if (hintEl) hintEl.innerHTML = '<span style="color:var(--accent2);font-weight:bold">⚡ SPEED UP! Spawn rate accelerated to 500ms!</span>';
                startLoop(currentSpeed);
            }
        }

        function spawnBug() {
            if (isGameOver) return;

            const bugCells = container.querySelectorAll('.smasher-cell.has-bug');
            if (bugCells.length > 0) {
                cpuLoad += Math.min(100, bugCells.length * 10);
                if (cpuEl) {
                    cpuEl.textContent = `${cpuLoad}%`;
                    cpuEl.style.color = cpuLoad > 70 ? '#ff4444' : (cpuLoad > 40 ? '#ffbd2e' : '#00ffc8');
                }

                if (cpuLoad >= 100) {
                    isGameOver = true;
                    stopActiveGame();
                    container.innerHTML += `
                        <div style="margin-top:10px;color:#ff4444;font-family:'Space Grotesk',sans-serif;font-weight:700">
                            🚨 SERVER CRASH! CPU OVERLOADED!
                            <br>
                            <span style="color:var(--text);font-size:0.85rem">Final Score: ${score} pts</span>
                            <br>
                            <button id="restartSmasher" class="game-play-btn" style="margin-top:10px">Try Again</button>
                        </div>
                    `;
                    const rBtn = container.querySelector('#restartSmasher');
                    if (rBtn) rBtn.onclick = () => startBugSmasherGame(container);
                    return;
                }
            }

            cells.forEach(c => { c.classList.remove('has-bug'); c.textContent = '🖥️'; });

            const indices = [];
            while (indices.length < bugCount) {
                const idx = Math.floor(Math.random() * 9);
                if (!indices.includes(idx)) indices.push(idx);
            }

            indices.forEach(idx => {
                const targetCell = cells[idx];
                targetCell.classList.add('has-bug');
                targetCell.textContent = '🐛';
            });
        }

        cells.forEach(cell => {
            cell.addEventListener('click', () => {
                if (isGameOver) return;
                if (cell.classList.contains('has-bug')) {
                    cell.classList.remove('has-bug');
                    cell.textContent = '✅';
                    score += 10;
                    if (scoreEl) scoreEl.textContent = score;
                    checkDifficultyProgression();
                    setTimeout(() => { if (!cell.classList.contains('has-bug')) cell.textContent = '🖥️'; }, 300);
                }
            });
        });

        startLoop(currentSpeed);
    }

    // 🐍 Game 2: Terminal Cyber-Snake
    function startCyberSnakeGame(container) {
        container.innerHTML = `
            <div class="snake-container">
                <div class="snake-score-bar">
                    <span>UPTIME SCORE: <strong id="snakeScore" style="color:var(--accent)">0</strong></span>
                    <span>PACKETS: <strong id="snakeLength" style="color:var(--accent2)">3</strong></span>
                </div>
                <canvas id="snakeCanvas" class="snake-canvas" width="240" height="240"></canvas>
                <div class="snake-controls">
                    <div></div><button class="snake-btn" id="snakeUp"><i class="fas fa-chevron-up"></i></button><div></div>
                    <button class="snake-btn" id="snakeLeft"><i class="fas fa-chevron-left"></i></button>
                    <button class="snake-btn" id="snakeDown"><i class="fas fa-chevron-down"></i></button>
                    <button class="snake-btn" id="snakeRight"><i class="fas fa-chevron-right"></i></button>
                </div>
            </div>
        `;

        const canvas = container.querySelector('#snakeCanvas');
        const ctx = canvas.getContext('2d');
        const scoreEl = container.querySelector('#snakeScore');
        const lengthEl = container.querySelector('#snakeLength');

        const gridSize = 12;
        const tileSize = 20;
        let snake = [{ x: 6, y: 6 }, { x: 5, y: 6 }, { x: 4, y: 6 }];
        let food = { x: 9, y: 6 };
        let dx = 1, dy = 0;
        let score = 0;
        let isGameOver = false;

        function moveSnake() {
            if (isGameOver) return;

            const head = { x: snake[0].x + dx, y: snake[0].y + dy };

            if (head.x < 0 || head.x >= gridSize || head.y < 0 || head.y >= gridSize ||
                snake.some(segment => segment.x === head.x && segment.y === head.y)) {
                isGameOver = true;
                stopActiveGame();
                ctx.fillStyle = 'rgba(255, 68, 68, 0.85)';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = '#ffffff';
                ctx.font = '700 13px Space Grotesk';
                ctx.textAlign = 'center';
                ctx.fillText('CONNECTION LOST (GAME OVER)', canvas.width / 2, canvas.height / 2 - 10);
                ctx.font = '11px JetBrains Mono';
                ctx.fillText(`Final Uptime: ${score} pts`, canvas.width / 2, canvas.height / 2 + 15);
                return;
            }

            snake.unshift(head);

            if (head.x === food.x && head.y === food.y) {
                score += 10;
                if (scoreEl) scoreEl.textContent = score;
                if (lengthEl) lengthEl.textContent = snake.length;
                food = {
                    x: Math.floor(Math.random() * gridSize),
                    y: Math.floor(Math.random() * gridSize)
                };
            } else {
                snake.pop();
            }

            ctx.fillStyle = '#080d18';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.strokeStyle = '#1e293b';
            ctx.lineWidth = 0.5;
            for (let i = 0; i <= gridSize; i++) {
                ctx.beginPath(); ctx.moveTo(i * tileSize, 0); ctx.lineTo(i * tileSize, canvas.height); ctx.stroke();
                ctx.beginPath(); ctx.moveTo(0, i * tileSize); ctx.lineTo(canvas.width, i * tileSize); ctx.stroke();
            }

            ctx.fillStyle = '#00ffcc';
            ctx.shadowColor = '#00ffcc'; ctx.shadowBlur = 8;
            ctx.fillRect(food.x * tileSize + 2, food.y * tileSize + 2, tileSize - 4, tileSize - 4);
            ctx.shadowBlur = 0;

            // Draw Snake
            snake.forEach((seg, i) => {
                ctx.fillStyle = i === 0 ? '#00ffc8' : 'rgba(0, 255, 200, 0.6)';
                ctx.fillRect(seg.x * tileSize + 1, seg.y * tileSize + 1, tileSize - 2, tileSize - 2);
            });
        }

        // Controls
        const setDir = (newDx, newDy) => {
            if (dx === -newDx && dy === -newDy) return; // prevent 180 flip
            dx = newDx; dy = newDy;
        };

        container.querySelector('#snakeUp').onclick = () => setDir(0, -1);
        container.querySelector('#snakeDown').onclick = () => setDir(0, 1);
        container.querySelector('#snakeLeft').onclick = () => setDir(-1, 0);
        container.querySelector('#snakeRight').onclick = () => setDir(1, 0);

        // Touch Swipe Gesture on Canvas
        let startX = 0, startY = 0;
        canvas.addEventListener('touchstart', e => {
            startX = e.touches[0].clientX; startY = e.touches[0].clientY;
        }, { passive: true });

        canvas.addEventListener('touchend', e => {
            const diffX = e.changedTouches[0].clientX - startX;
            const diffY = e.changedTouches[0].clientY - startY;
            if (Math.abs(diffX) > Math.abs(diffY)) {
                if (diffX > 20) setDir(1, 0);
                else if (diffX < -20) setDir(-1, 0);
            } else {
                if (diffY > 20) setDir(0, 1);
                else if (diffY < -20) setDir(0, -1);
            }
        }, { passive: true });

        activeGameLoop = setInterval(moveSnake, 160);
    }

    // 🚀 Game 3: Rocket Payload Balancer
    function startRocketBalancerGame(container) {
        container.innerHTML = `
            <div style="width:100%;text-align:center">
                <div style="display:flex;justify-content:space-between;font-family:'JetBrains Mono',monospace;font-size:0.8rem;margin-bottom:8px">
                    <span>ALTITUDE: <strong id="rocketAlt" style="color:#ffbd2e">0 km</strong></span>
                    <span>TILT: <strong id="rocketAngle" style="color:#00ffc8">0°</strong></span>
                </div>
                <canvas id="rocketCanvas" width="240" height="190" style="background:#080d18;border:1px solid var(--border);border-radius:10px"></canvas>
                <div style="display:flex;gap:12px;margin-top:10px;justify-content:center">
                    <button id="rocketThrustL" class="game-play-btn" style="flex:1">◄ THRUST L</button>
                    <button id="rocketThrustR" class="game-play-btn" style="flex:1">THRUST R ►</button>
                </div>
            </div>
        `;

        const canvas = container.querySelector('#rocketCanvas');
        const ctx = canvas.getContext('2d');
        const altEl = container.querySelector('#rocketAlt');
        const angleEl = container.querySelector('#rocketAngle');

        let angle = 0;
        let angleVel = 0;
        let altitude = 0;
        let isGameOver = false;

        function updateRocket() {
            if (isGameOver) return;

            angleVel += (Math.random() - 0.5) * 0.4;
            angle += angleVel;
            altitude += 3;

            if (altEl) altEl.textContent = `${altitude} km`;
            if (angleEl) {
                angleEl.textContent = `${Math.round(angle)}°`;
                angleEl.style.color = Math.abs(angle) > 18 ? '#ff4444' : '#00ffc8';
            }

            if (Math.abs(angle) > 28) {
                isGameOver = true;
                stopActiveGame();
                ctx.fillStyle = 'rgba(255, 68, 68, 0.85)';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = '#ffffff';
                ctx.font = '700 13px Space Grotesk';
                ctx.textAlign = 'center';
                ctx.fillText('CRITICAL TILT! ROCKET CRASHED', canvas.width/2, canvas.height/2 - 10);
                ctx.font = '11px JetBrains Mono';
                ctx.fillText(`Altitude: ${altitude} km`, canvas.width/2, canvas.height/2 + 15);
                return;
            }

            if (altitude >= 350) {
                isGameOver = true;
                stopActiveGame();
                ctx.fillStyle = 'rgba(0, 255, 200, 0.9)';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = '#080d18';
                ctx.font = '700 14px Space Grotesk';
                ctx.textAlign = 'center';
                ctx.fillText('🚀 ORBIT ACHIEVED! VICTORY!', canvas.width/2, canvas.height/2);
                return;
            }

            ctx.fillStyle = '#080d18';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.save();
            ctx.translate(canvas.width / 2, canvas.height / 2 + 25);
            ctx.rotate((angle * Math.PI) / 180);

            ctx.fillStyle = '#ffffff';
            ctx.fillRect(-8, -30, 16, 45);
            ctx.fillStyle = '#ff4444';
            ctx.beginPath(); ctx.moveTo(-8, -30); ctx.lineTo(0, -45); ctx.lineTo(8, -30); ctx.fill();
            ctx.fillStyle = '#ffbd2e';
            ctx.fillRect(-5, 15, 10, 12 + Math.random() * 8);

            ctx.restore();
        }

        container.querySelector('#rocketThrustL').onclick = () => { angleVel -= 1.8; };
        container.querySelector('#rocketThrustR').onclick = () => { angleVel += 1.8; };

        stopActiveGame();
        activeGameLoop = setInterval(updateRocket, 80);
    }

    // 🛡️ Game 4: DDoS Attack Defense
    function startDdosDefenseGame(container) {
        let score = 0;
        let hp = 3;
        let packets = [];
        let isGameOver = false;

        container.innerHTML = `
            <div style="width:100%;text-align:center">
                <div style="display:flex;justify-content:space-between;font-family:'JetBrains Mono',monospace;font-size:0.82rem;margin-bottom:8px">
                    <span>SCORE: <strong id="ddosScore" style="color:var(--accent)">0</strong></span>
                    <span>SERVER HEALTH: <strong id="ddosHp" style="color:#ff4444">❤️❤️❤️</strong></span>
                </div>
                <canvas id="ddosCanvas" width="240" height="210" style="background:#080d18;border:1px solid var(--border);border-radius:10px"></canvas>
                <p style="font-size:0.75rem;color:var(--text-dim);margin-top:6px">Tap BAD packets (👾 red)! Ignore GOOD (✅ green)!</p>
            </div>
        `;

        const canvas = container.querySelector('#ddosCanvas');
        const ctx = canvas.getContext('2d');
        const scoreEl = container.querySelector('#ddosScore');
        const hpEl = container.querySelector('#ddosHp');

        function updateDdos() {
            if (isGameOver) return;

            if (Math.random() < 0.25) {
                const isBad = Math.random() > 0.35;
                packets.push({
                    x: 20 + Math.random() * 200,
                    y: 0,
                    isBad,
                    speed: 1.5 + Math.random() * 1.5
                });
            }

            ctx.fillStyle = '#080d18';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = 'rgba(0, 255, 200, 0.2)';
            ctx.fillRect(0, canvas.height - 25, canvas.width, 25);
            ctx.fillStyle = '#00ffc8';
            ctx.font = '10px JetBrains Mono'; ctx.textAlign = 'center';
            ctx.fillText('SERVER CORE PROTECTED', canvas.width / 2, canvas.height - 8);

            for (let i = packets.length - 1; i >= 0; i--) {
                const p = packets[i];
                p.y += p.speed;

                ctx.font = '14px sans-serif';
                ctx.fillText(p.isBad ? '👾' : '✅', p.x, p.y);

                if (p.y >= canvas.height - 25) {
                    if (p.isBad) {
                        hp--;
                        if (hpEl) hpEl.textContent = '❤️'.repeat(Math.max(0, hp));
                        if (hp <= 0) {
                            isGameOver = true;
                            stopActiveGame();
                            ctx.fillStyle = 'rgba(255, 68, 68, 0.9)';
                            ctx.fillRect(0, 0, canvas.width, canvas.height);
                            ctx.fillStyle = '#ffffff';
                            ctx.font = '700 13px Space Grotesk';
                            ctx.fillText('SERVER DOWN! DDOS OVERWHELMED', canvas.width / 2, canvas.height / 2);
                            return;
                        }
                    }
                    packets.splice(i, 1);
                }
            }
        }

        canvas.onclick = e => {
            if (isGameOver) return;
            const rect = canvas.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const clickY = e.clientY - rect.top;

            for (let i = packets.length - 1; i >= 0; i--) {
                const p = packets[i];
                if (Math.abs(p.x - clickX) < 22 && Math.abs(p.y - clickY) < 22) {
                    if (p.isBad) {
                        score += 10;
                        if (scoreEl) scoreEl.textContent = score;
                    } else {
                        hp--;
                        if (hpEl) hpEl.textContent = '❤️'.repeat(Math.max(0, hp));
                    }
                    packets.splice(i, 1);
                    break;
                }
            }
        };

        stopActiveGame();
        activeGameLoop = setInterval(updateDdos, 70);
    }

    // 🎲 Game 5: DevOps Trivia Quiz (Exactly 10 Questions)
    function startDevTriviaGame(container) {
        stopActiveGame();
        const questions = [
            { q: 'Command to check open ports on Linux?', opts: ['netstat -tuln', 'docker ps', 'cat /proc/cpu', 'df -h'], ans: 0 },
            { q: 'Default Kubernetes API Server port?', opts: ['8080', '6443', '3000', '22'], ans: 1 },
            { q: 'HashiCorp tool for Infrastructure as Code?', opts: ['Ansible', 'Docker', 'Terraform', 'Jenkins'], ans: 2 },
            { q: 'HTTP status code for "Unauthorized"?', opts: ['404', '500', '401', '200'], ans: 2 },
            { q: 'Command to view human-readable disk usage?', opts: ['df -h', 'ls -la', 'top', 'uname -r'], ans: 0 },
            { q: 'Command to list running Docker containers?', opts: ['docker run', 'docker ps', 'docker build', 'docker logs'], ans: 1 },
            { q: 'Package manager for Debian & Ubuntu?', opts: ['yum', 'brew', 'apt', 'pacman'], ans: 2 },
            { q: 'Git command to create and switch to a new branch?', opts: ['git checkout -b', 'git branch new', 'git init', 'git push'], ans: 0 },
            { q: 'Default SSH port?', opts: ['21', '80', '22', '443'], ans: 2 },
            { q: 'Command to follow live logs of a file?', opts: ['cat', 'tail -f', 'head -n', 'grep'], ans: 1 }
        ];

        let qIdx = 0;
        let score = 0;

        function renderQuestion() {
            if (qIdx >= questions.length) {
                container.innerHTML = `
                    <div style="text-align:center;padding:10px">
                        <h3 style="color:var(--accent);font-family:'Space Grotesk',sans-serif">🎯 TRIVIA COMPLETE!</h3>
                        <p style="margin:10px 0;font-size:0.9rem">Your Score: <strong>${score} / ${questions.length * 10} pts</strong></p>
                        <button id="restartTrivia" class="game-play-btn">Play Again</button>
                    </div>
                `;
                const rBtn = container.querySelector('#restartTrivia');
                if (rBtn) rBtn.onclick = () => startDevTriviaGame(container);
                return;
            }

            const curr = questions[qIdx];
            container.innerHTML = `
                <div style="width:100%">
                    <div style="font-family:'JetBrains Mono',monospace;font-size:0.78rem;color:var(--accent2);margin-bottom:8px">Question ${qIdx + 1} of ${questions.length}</div>
                    <p style="font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:0.88rem;margin-bottom:12px;color:var(--text)">${curr.q}</p>
                    <div style="display:flex;flex-direction:column;gap:6px">
                        ${curr.opts.map((opt, i) => `<button class="trivia-opt-btn game-play-btn" style="text-align:left;width:100%;font-size:0.78rem;padding:7px 12px" data-idx="${i}">${opt}</button>`).join('')}
                    </div>
                </div>
            `;

            container.querySelectorAll('.trivia-opt-btn').forEach(b => {
                b.onclick = () => {
                    const selected = parseInt(b.getAttribute('data-idx'));
                    if (selected === curr.ans) score += 10;
                    qIdx++;
                    renderQuestion();
                };
            });
        }

        renderQuestion();
    }

    // 🔋 Game 6: Server Load Optimizer (6 Sliders, 10-15s Escalating Challenges & Slider Spikes)
    function startServerOptimizerGame(container) {
        let cpuFreq = 3.5;
        let fans = 60;
        let gpuClock = 1200;
        let voltage = 1.15;
        let threads = 8;
        let busSpeed = 3.0;

        let extraHeat = 0;
        let nitroBoost = 0;
        let throttleActive = false;
        let powerSaver = false;
        let turboFans = false;
        let autoShield = false;

        let score = 300; // Start at 300 Uptime
        let isGameOver = false;
        let challengeTimer = null;
        let challengeCount = 0;
        const totalWaves = 8;

        const challengesList = [
            { title: "🚨 50+ CHROME TABS OPENED!", desc: "Memory overload! Heat +24°C. Lower CPU & Threads!", heat: 24 },
            { title: "⚡ NETWORK TRAFFIC SURGE!", desc: "Traffic spike! Heat +30°C. ⚠️ IF ECO MODE IS OFF: CPU Frequency & Voltage spike +50% extra!", heat: 30, checkEco: true },
            { title: "💥 CRYPTOMINER MALWARE INTRUSION!", desc: "Malware detected! Heat +32°C. Use 🧹 RAM Flush & Nitro!", heat: 32 },
            { title: "💣 DDOS SYN FLOOD ATTACK!", desc: "Packet flood! Heat +35°C. ⚠️ IF THROTTLING IS OFF: Voltage locks to max 1.45V & RAM leaks!", heat: 35, checkThrottle: true },
            { title: "🔥 HEAVY KUBERNETES COMPILATION!", desc: "Cluster build! Heat +36°C. ⚠️ IF ECO MODE IS OFF: Cooling efficiency is cut by 50%!", heat: 36, checkEcoCooling: true },
            { title: "⚠️ UNHANDLED MEMORY LEAK!", desc: "Buffer leak! Heat +30°C. Lower Bus Speed & GPU!", heat: 30 },
            { title: "🌋 MULTI-REGION CLOUD SURGE!", desc: "System overload! Heat +40°C. ⚠️ IF BOTH ECO & THROTTLE ARE OFF: Continuous thermal runaway (+4°C/sec)!", heat: 40, checkDual: true },
            { title: "🔥 GOD-LEVEL NIGHTMARE OVERLOAD!", desc: "👑 FINAL WAVE! System breakdown! Heat +50°C, Voltage 1.45V, CPU 5.0GHz! Turn ON Eco Mode + Nitro + Throttling immediately to survive!", heat: 50, godLevel: true }
        ];

        container.innerHTML = `
            <div style="width:100%;text-align:center">
                <div style="font-family:'JetBrains Mono',monospace;font-size:0.82rem;margin-bottom:6px;display:flex;justify-content:space-between">
                    <span>UPTIME: <strong id="optScore" style="color:var(--accent)">300</strong></span>
                    <span>WAVE: <strong id="optWave" style="color:var(--accent2)">0 / ${totalWaves}</strong></span>
                    <span>TEMP: <strong id="optTemp" style="color:#00ffc8">55°C</strong></span>
                </div>

                <!-- DYNAMIC CHALLENGE ALERT BOX (Tutorial Mode for 5s) -->
                <div id="optChallengeBox" style="background:var(--card);border:1px solid var(--border);border-radius:10px;padding:7px 10px;margin-bottom:8px;font-size:0.78rem;font-family:'Space Grotesk',sans-serif">
                    <span id="optChallengeTitle" style="font-weight:700;color:var(--accent);display:block;font-size:0.82rem">📖 TUTORIAL: STARTING IN 5 SECONDS</span>
                    <span id="optChallengeDesc" style="color:var(--text-dim);font-size:0.75rem">Lower sliders to keep Core Temp < 90°C! Use ❄️ Nitro & 🧹 RAM Flush when heat spikes!</span>
                </div>

                <!-- REAL-TIME ELECTROCARDIOGRAM (ECG) THERMAL MONITOR GRAPH -->
                <canvas id="optEcgCanvas" style="width:100%;height:45px;background:#050912;border:1px solid var(--border);border-radius:8px;margin-bottom:8px;display:block"></canvas>

                <div style="background:var(--card);border:1px solid var(--border);border-radius:12px;padding:8px;margin-bottom:8px;display:grid;grid-template-columns:1fr 1fr;gap:6px;text-align:left">
                    <div>
                        <label style="font-size:0.72rem;color:var(--text-dim);display:block;font-weight:600">1. CPU: <span id="valCpu" style="color:var(--accent);font-weight:700">3.5 GHz</span></label>
                        <input type="range" id="sliderCpu" min="1" max="5" step="0.5" value="3.5" style="width:100%">
                    </div>
                    <div>
                        <label style="font-size:0.72rem;color:var(--text-dim);display:block;font-weight:600">2. FANS: <span id="valFans" style="color:var(--accent);font-weight:700">60%</span></label>
                        <input type="range" id="sliderFans" min="0" max="100" step="10" value="60" style="width:100%">
                    </div>
                    <div>
                        <label style="font-size:0.72rem;color:var(--text-dim);display:block;font-weight:600">3. GPU: <span id="valGpu" style="color:var(--accent2);font-weight:700">1200 MHz</span></label>
                        <input type="range" id="sliderGpu" min="200" max="2000" step="100" value="1200" style="width:100%">
                    </div>
                    <div>
                        <label style="font-size:0.72rem;color:var(--text-dim);display:block;font-weight:600">4. VOLT: <span id="valVolt" style="color:#a855f7;font-weight:700">1.15 V</span></label>
                        <input type="range" id="sliderVolt" min="0.80" max="1.45" step="0.05" value="1.15" style="width:100%">
                    </div>
                    <div>
                        <label style="font-size:0.72rem;color:var(--text-dim);display:block;font-weight:600">5. THREADS: <span id="valThreads" style="color:#00ffc8;font-weight:700">8 Cores</span></label>
                        <input type="range" id="sliderThreads" min="1" max="16" step="1" value="8" style="width:100%">
                    </div>
                    <div>
                        <label style="font-size:0.72rem;color:var(--text-dim);display:block;font-weight:600">6. BUS SPEED: <span id="valBus" style="color:#f59e0b;font-weight:700">Gen 3.0</span></label>
                        <input type="range" id="sliderBus" min="1.0" max="5.0" step="0.5" value="3.0" style="width:100%">
                    </div>
                </div>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:4px;margin-bottom:6px">
                    <button id="btnNitro" class="game-play-btn" style="font-size:0.72rem;padding:6px">❄️ 1. Liquid Nitrogen</button>
                    <button id="btnFlush" class="game-play-btn" style="font-size:0.72rem;padding:6px">🧹 2. Flush RAM & VRAM</button>
                    <button id="btnThrottle" class="game-play-btn" style="font-size:0.72rem;padding:6px">⚙️ 3. Throttle: OFF</button>
                    <button id="btnPower" class="game-play-btn" style="font-size:0.72rem;padding:6px">⚡ 4. Eco Mode: OFF</button>
                    <button id="btnTurbo" class="game-play-btn" style="font-size:0.72rem;padding:6px">🚀 5. Turbo Fans: OFF</button>
                    <button id="btnShield" class="game-play-btn" style="font-size:0.72rem;padding:6px">🛡️ 6. Auto Shield: OFF</button>
                </div>
                <p id="optStatusText" style="font-size:0.72rem;color:var(--text-dim)">Warning: >90°C drains Uptime! Adjust sliders quickly!</p>
            </div>
        `;

        const sliderCpu = container.querySelector('#sliderCpu');
        const sliderFans = container.querySelector('#sliderFans');
        const sliderGpu = container.querySelector('#sliderGpu');
        const sliderVolt = container.querySelector('#sliderVolt');
        const sliderThreads = container.querySelector('#sliderThreads');
        const sliderBus = container.querySelector('#sliderBus');

        const valCpu = container.querySelector('#valCpu');
        const valFans = container.querySelector('#valFans');
        const valGpu = container.querySelector('#valGpu');
        const valVolt = container.querySelector('#valVolt');
        const valThreads = container.querySelector('#valThreads');
        const valBus = container.querySelector('#valBus');

        const tempEl = container.querySelector('#optTemp');
        const scoreEl = container.querySelector('#optScore');
        const waveEl = container.querySelector('#optWave');
        const btnNitro = container.querySelector('#btnNitro');
        const btnFlush = container.querySelector('#btnFlush');
        const btnThrottle = container.querySelector('#btnThrottle');
        const btnPower = container.querySelector('#btnPower');
        const btnTurbo = container.querySelector('#btnTurbo');
        const btnShield = container.querySelector('#btnShield');
        const statusText = container.querySelector('#optStatusText');
        const challengeTitle = container.querySelector('#optChallengeTitle');
        const challengeDesc = container.querySelector('#optChallengeDesc');

        const ecgCanvas = container.querySelector('#optEcgCanvas');
        let ecgCtx = ecgCanvas ? ecgCanvas.getContext('2d') : null;
        ecg120FpsAnimId = null; // Reset the module-level variable (not re-declared, so stopActiveGame can cancel it)
        let nodeProgress = 0;
        let passPath = [];
        let lastPassPath = null;
        let currentTemp = 55;
        let countdown = 5;

        function start120FpsNodeTracerLoop() {
            if (ecg120FpsAnimId) cancelAnimationFrame(ecg120FpsAnimId);

            function animFrame() {
                if (!ecgCanvas || !ecgCtx || !container.querySelector('#optEcgCanvas')) return;

                const w = ecgCanvas.clientWidth || 280;
                const h = 45;
                if (ecgCanvas.width !== w) ecgCanvas.width = w;
                if (ecgCanvas.height !== h) ecgCanvas.height = h;

                const isTutorial = countdown > 0;
                const isCritical = currentTemp >= 88;
                const isWarning = currentTemp > 75;
                const nodeColor = isTutorial ? '#00ffc8' : (isCritical ? '#ef4444' : (isWarning ? '#f59e0b' : '#00ffc8'));

                // Fast 120 FPS smooth travel (Sweeps Left to Right every ~0.4 seconds)
                nodeProgress += 0.024;

                if (nodeProgress >= 1.0) {
                    lastPassPath = passPath;
                    passPath = [];
                    nodeProgress = 0;
                }

                // X position clamped inside 4px to w-4px
                const currentX = 4 + (nodeProgress * (w - 8));

                // Middle Y = h / 2 (Middle of the box)
                const centerY = h / 2;
                const minY = 6;
                const maxY = h - 6;
                const normTemp = Math.min(1.0, Math.max(0.0, (currentTemp - 20) / 80));

                let rawTargetY = isTutorial ? centerY : (maxY - (normTemp * (maxY - minY)));
                if (isCritical && !isTutorial) {
                    rawTargetY += (Math.random() - 0.5) * 4;
                }
                rawTargetY = Math.max(minY, Math.min(maxY, rawTargetY));

                // ENVELOPE: Starts at middle (centerY), waves out in middle, ends at middle (centerY)!
                const envelope = Math.sin(nodeProgress * Math.PI);
                const finalY = centerY + (rawTargetY - centerY) * envelope;

                passPath.push({ x: currentX, y: finalY, color: nodeColor });

                ecgCtx.clearRect(0, 0, w, h);

                // 1. Cyber Grid Background
                ecgCtx.strokeStyle = 'rgba(0, 255, 200, 0.05)';
                ecgCtx.lineWidth = 0.5;
                for (let x = 0; x <= w; x += 25) {
                    ecgCtx.beginPath(); ecgCtx.moveTo(x, 0); ecgCtx.lineTo(x, h); ecgCtx.stroke();
                }

                // 2. Faint Previous Pass Trail
                if (lastPassPath && lastPassPath.length > 1) {
                    ecgCtx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
                    ecgCtx.lineWidth = 1.0;
                    ecgCtx.beginPath();
                    lastPassPath.forEach((pt, idx) => {
                        if (idx === 0) ecgCtx.moveTo(pt.x, pt.y);
                        else ecgCtx.lineTo(pt.x, pt.y);
                    });
                    ecgCtx.stroke();
                }

                // 3. Active Node Graph Trail
                if (passPath.length > 1) {
                    ecgCtx.strokeStyle = nodeColor;
                    ecgCtx.shadowColor = nodeColor;
                    ecgCtx.shadowBlur = isCritical ? 8 : 4;
                    ecgCtx.lineWidth = isCritical ? 2.0 : 1.6;
                    ecgCtx.beginPath();

                    passPath.forEach((pt, idx) => {
                        if (idx === 0) ecgCtx.moveTo(pt.x, pt.y);
                        else ecgCtx.lineTo(pt.x, pt.y);
                    });
                    ecgCtx.stroke();
                    ecgCtx.shadowBlur = 0;
                }

                // 4. Traveling Core Node Point (Starts at middle, waves out, ends at middle!)
                if (passPath.length > 0) {
                    const head = passPath[passPath.length - 1];
                    ecgCtx.fillStyle = '#ffffff';
                    ecgCtx.shadowColor = nodeColor;
                    ecgCtx.shadowBlur = 10;
                    ecgCtx.beginPath();
                    ecgCtx.arc(head.x, head.y, 3, 0, Math.PI * 2);
                    ecgCtx.fill();
                    ecgCtx.shadowBlur = 0;
                }

                if (!isGameOver && !document.hidden) {
                    ecg120FpsAnimId = requestAnimationFrame(animFrame);
                } else if (!isGameOver && document.hidden) {
                    // Tab hidden — pause rAF, resume on visibilitychange
                    const resumeEcg = () => {
                        if (!document.hidden && !isGameOver) {
                            document.removeEventListener('visibilitychange', resumeEcg);
                            ecg120FpsAnimId = requestAnimationFrame(animFrame);
                        }
                    };
                    document.addEventListener('visibilitychange', resumeEcg, { passive: true });
                }
            }

            ecg120FpsAnimId = requestAnimationFrame(animFrame);
        }

        function updateSliderDisplays() {
            sliderCpu.value = cpuFreq; valCpu.textContent = `${cpuFreq.toFixed(1)} GHz`;
            sliderFans.value = fans; valFans.textContent = `${fans}%`;
            sliderGpu.value = gpuClock; valGpu.textContent = `${gpuClock} MHz`;
            sliderVolt.value = voltage; valVolt.textContent = `${voltage.toFixed(2)} V`;
            sliderThreads.value = threads; valThreads.textContent = `${threads} Cores`;
            sliderBus.value = busSpeed; valBus.textContent = `Gen ${busSpeed.toFixed(1)}`;
        }

        sliderCpu.oninput = () => { cpuFreq = parseFloat(sliderCpu.value); valCpu.textContent = `${cpuFreq.toFixed(1)} GHz`; };
        sliderFans.oninput = () => { fans = parseInt(sliderFans.value); valFans.textContent = `${fans}%`; };
        sliderGpu.oninput = () => { gpuClock = parseInt(sliderGpu.value); valGpu.textContent = `${gpuClock} MHz`; };
        sliderVolt.oninput = () => { voltage = parseFloat(sliderVolt.value); valVolt.textContent = `${voltage.toFixed(2)} V`; };
        sliderThreads.oninput = () => { threads = parseInt(sliderThreads.value); valThreads.textContent = `${threads} Cores`; };
        sliderBus.oninput = () => { busSpeed = parseFloat(sliderBus.value); valBus.textContent = `Gen ${busSpeed.toFixed(1)}`; };

        btnNitro.onclick = () => { nitroBoost = 30; extraHeat = Math.max(0, extraHeat - 15); };
        btnFlush.onclick = () => { nitroBoost += 16; extraHeat = Math.max(0, extraHeat - 10); };
        btnThrottle.onclick = () => {
            throttleActive = !throttleActive;
            btnThrottle.textContent = `⚙️ 3. Throttle: ${throttleActive ? 'ON' : 'OFF'}`;
            btnThrottle.style.borderColor = throttleActive ? '#00ffc8' : 'var(--border)';
        };
        btnPower.onclick = () => {
            powerSaver = !powerSaver;
            btnPower.textContent = `⚡ 4. Eco Mode: ${powerSaver ? 'ON' : 'OFF'}`;
            btnPower.style.borderColor = powerSaver ? '#f59e0b' : 'var(--border)';
        };
        btnTurbo.onclick = () => {
            turboFans = !turboFans;
            btnTurbo.textContent = `🚀 5. Turbo Fans: ${turboFans ? 'ON' : 'OFF'}`;
            btnTurbo.style.borderColor = turboFans ? '#00ffc8' : 'var(--border)';
        };
        btnShield.onclick = () => {
            autoShield = !autoShield;
            btnShield.textContent = `🛡️ 6. Auto Shield: ${autoShield ? 'ON' : 'OFF'}`;
            btnShield.style.borderColor = autoShield ? '#3b82f6' : 'var(--border)';
        };

        function scheduleNextChallenge() {
            if (isGameOver) return;

            challengeCount++;
            if (waveEl) waveEl.textContent = `${challengeCount} / ${totalWaves}`;

            const ch = challengesList[(challengeCount - 1) % challengesList.length];
            extraHeat += ch.heat + (challengeCount * 4);

            // Force stress on sliders
            cpuFreq = 5.0;
            threads = 16;
            voltage = Math.min(1.45, voltage + 0.20);
            gpuClock = Math.min(2000, gpuClock + 400);
            busSpeed = 5.0;
            fans = Math.max(0, fans - 30);

            // Apply Mode Consequences
            if (ch.checkEco && !powerSaver) {
                cpuFreq = 5.0;
                voltage = 1.45;
                if (statusText) statusText.innerHTML = '<span style="color:#ef4444;font-weight:bold">⚠️ ECO MODE WAS OFF! CPU & Voltage Force Spiked to Max!</span>';
            }
            if (ch.checkThrottle && !throttleActive) {
                voltage = 1.45;
                extraHeat += 20;
                if (statusText) statusText.innerHTML = '<span style="color:#ef4444;font-weight:bold">⚠️ THROTTLING WAS OFF! Voltage locked to 1.45V & RAM Leaked!</span>';
            }
            if (ch.checkEcoCooling && !powerSaver) {
                extraHeat += 22;
                if (statusText) statusText.innerHTML = '<span style="color:#f59e0b;font-weight:bold">⚠️ ECO MODE WAS OFF! Cooling Efficiency Cut By 50%!</span>';
            }
            if (ch.checkDual && (!powerSaver || !throttleActive)) {
                extraHeat += 35;
                if (statusText) statusText.innerHTML = '<span style="color:#ef4444;font-weight:bold">🚨 DUAL SAFETY OFF! Extreme Thermal Runaway Initiated!</span>';
            }
            if (ch.godLevel) {
                cpuFreq = 5.0;
                threads = 16;
                voltage = 1.45;
                gpuClock = 2000;
                busSpeed = 5.0;
                fans = 10;
                extraHeat += 50;
                if (statusText) statusText.innerHTML = '<span style="color:#ef4444;font-weight:bold;font-size:0.8rem">🔥 GOD-LEVEL NIGHTMARE OVERLOAD! ACTIVATE ALL COOLING SYSTEMS NOW!</span>';
            }

            updateSliderDisplays();

            if (challengeTitle) challengeTitle.textContent = `WAVE ${challengeCount}: ${ch.title}`;
            if (challengeDesc) challengeDesc.textContent = ch.desc;

            const nextDelay = ch.godLevel ? 14000 : Math.floor(8000 + Math.random() * 4000);
            challengeTimer = setTimeout(scheduleNextChallenge, nextDelay);
        }

        stopActiveGame();

        // Launch 120 FPS continuous envelope node tracer loop
        start120FpsNodeTracerLoop();

        let tutorialInterval = setInterval(() => {
            if (isGameOver) return;
            countdown--;
            if (countdown > 0) {
                if (challengeTitle) challengeTitle.textContent = `📖 TUTORIAL: GAME STARTING IN ${countdown}s`;
            } else {
                clearInterval(tutorialInterval);
                scheduleNextChallenge();

                // 0.1 SECOND (100ms) GAME LOOP FOR CONTINUOUS SCORE UPDATES & TEMP CALCULATION
                activeGameLoop = setInterval(() => {
                    if (isGameOver) return;

                    let effectiveFans = fans + (turboFans ? 35 : 0);
                    let coolingFactor = (chEco => (!powerSaver && chEco ? 0.18 : 0.35))(challengesList[Math.min(challengesList.length - 1, challengeCount - 1)]?.checkEcoCooling);
                    
                    let baseTemp = 20 + (cpuFreq * 10) + (gpuClock * 0.012) + (voltage * 18) + (threads * 1.8) + (busSpeed * 3.0) + extraHeat - (effectiveFans * coolingFactor);

                    if (throttleActive) baseTemp -= 14;
                    if (powerSaver) baseTemp -= 10;
                    if (nitroBoost > 0) {
                        baseTemp -= nitroBoost;
                        nitroBoost = Math.max(0, nitroBoost - 5);
                    }

                    if (!powerSaver && challengeCount >= 7) {
                        extraHeat += 0.5; // Smooth thermal runaway if Eco is off
                    }

                    extraHeat = Math.max(0, extraHeat - 0.2);
                    currentTemp = Math.max(20, Math.round(baseTemp));

                    if (autoShield && currentTemp >= 88) {
                        currentTemp = 76;
                        extraHeat = 0;
                        if (statusText) statusText.innerHTML = '<span style="color:#3b82f6;font-weight:bold">🛡️ AUTO SHIELD TRIP! Prevented CPU Destruction!</span>';
                    }

                    if (tempEl) {
                        tempEl.textContent = `${currentTemp}°C`;
                        tempEl.style.color = currentTemp >= 90 ? '#ff4444' : (currentTemp > 75 ? '#f59e0b' : '#00ffc8');
                    }

                    if (currentTemp >= 90) {
                        score = Math.max(0, score - 5); // Smooth drain per 0.1s loop
                        if (scoreEl) scoreEl.textContent = score;
                        if (statusText) statusText.innerHTML = '<span style="color:#ff4444;font-weight:bold">🚨 OVERHEAT CRITICAL (>90°C)! LOWER SLIDERS IMMEDIATELY!</span>';

                        if (score <= 0) {
                            isGameOver = true;
                            if (challengeTimer) clearTimeout(challengeTimer);
                            stopActiveGame();
                            container.innerHTML = `
                                <div style="padding:18px 12px;text-align:center;color:#ff4444;font-family:'Space Grotesk',sans-serif">
                                    <h3 style="font-size:1.35rem;margin-bottom:6px;font-weight:700">💥 OOPS! SYSTEM CRASHED!</h3>
                                    <p style="color:var(--text);font-size:0.84rem;margin-bottom:14px">Core Temp hit <strong>${currentTemp}°C</strong> under server challenges! CPU melted!</p>
                                    <button id="restartOpt" class="game-play-btn" style="background:#ff4444;color:#fff;border:none;padding:10px 22px;font-size:0.85rem">Reboot & Try Again</button>
                                </div>
                            `;
                            const rBtn = container.querySelector('#restartOpt');
                            if (rBtn) rBtn.onclick = () => startServerOptimizerGame(container);
                            return;
                        }
                    } else {
                        // UPTIME MULTIPLIERS (Updated every 0.1s):
                        // ❄️ < 40°C: 6x Uptime boost! (cpuFreq * 2.4)
                        // 🟢 < 75°C: 4x Uptime boost! (cpuFreq * 1.6)
                        // 🟡 75°C - 89°C: 3x Uptime boost! (cpuFreq * 1.2)
                        const uptimeMultiplier = currentTemp < 40 ? 2.4 : (currentTemp < 75 ? 1.6 : 1.2);
                        score += Math.max(1, Math.round(cpuFreq * uptimeMultiplier));
                        if (scoreEl) scoreEl.textContent = score;

                        if (challengeCount >= totalWaves && extraHeat <= 2) {
                            isGameOver = true;
                            if (challengeTimer) clearTimeout(challengeTimer);
                            stopActiveGame();
                            container.innerHTML = `
                                <div style="padding:18px 12px;text-align:center;color:#00ffc8;font-family:'Space Grotesk',sans-serif">
                                    <h3 style="font-size:1.4rem;margin-bottom:6px;font-weight:700">👑 GOD-LEVEL VICTORY! SYSTEM SAFE!</h3>
                                    <p style="color:var(--text);font-size:0.88rem;margin-bottom:14px">You conquered all <strong>${totalWaves} Nightmare Waves</strong> with <strong>${score} Uptime pts</strong>!</p>
                                    <button id="restartOpt" class="game-play-btn" style="background:var(--accent);color:var(--bg);border:none;padding:10px 22px;font-size:0.85rem;font-weight:700">Play Again</button>
                                </div>
                            `;
                            const rBtn = container.querySelector('#restartOpt');
                            if (rBtn) rBtn.onclick = () => startServerOptimizerGame(container);
                            return;
                        }
                    }
                }, 100);
            }
        }, 1000);
    }

    // 🌌 Game 7: Space Invaders Cyber Edition (20 Malwares + Fast Downward Descent)
    function startSpaceInvadersGame(container) {
        container.innerHTML = `
            <div style="width:100%;text-align:center">
                <div style="font-family:'JetBrains Mono',monospace;font-size:0.8rem;margin-bottom:6px;display:flex;justify-content:space-between">
                    <span>SCORE: <strong id="spaceScore" style="color:var(--accent)">0</strong></span>
                    <span>SHIELDS: <strong id="spaceShields" style="color:#00ffc8">🛡️🛡️🛡️</strong></span>
                </div>
                <canvas id="spaceCanvas" width="240" height="210" style="background:#080d18;border:1px solid var(--border);border-radius:10px"></canvas>
                <div style="display:flex;gap:8px;margin-top:8px;justify-content:center">
                    <button id="spaceL" class="game-play-btn" style="flex:1">◄ LEFT</button>
                    <button id="spaceFire" class="game-play-btn" style="flex:2;background:var(--accent);color:var(--bg);font-weight:700">🚀 FAST LASER</button>
                    <button id="spaceR" class="game-play-btn" style="flex:1">RIGHT ►</button>
                </div>
            </div>
        `;

        const canvas = container.querySelector('#spaceCanvas');
        const ctx = canvas.getContext('2d');
        const scoreEl = container.querySelector('#spaceScore');
        const shieldsEl = container.querySelector('#spaceShields');

        let shipX = 110;
        let shields = 3;
        let bullets = [];
        let particles = [];
        let invaders = [];
        let invaderDx = 1.4; // Fast marching
        let score = 0;
        let isGameOver = false;

        // 4 rows of 5 invaders (20 total malwares)
        for (let r = 0; r < 4; r++) {
            for (let c = 0; c < 5; c++) {
                invaders.push({
                    x: 18 + c * 42,
                    y: 18 + r * 22,
                    alive: true,
                    type: r === 0 ? '👾' : (r === 1 ? '👾' : (r === 2 ? '🐛' : '👾'))
                });
            }
        }

        function createExplosion(x, y) {
            for (let i = 0; i < 7; i++) {
                particles.push({
                    x, y,
                    vx: (Math.random() - 0.5) * 5,
                    vy: (Math.random() - 0.5) * 5,
                    life: 1.0,
                    color: Math.random() > 0.5 ? '#00ffc8' : '#ffbd2e'
                });
            }
        }

        function fireLaser() {
            if (isGameOver) return;
            bullets.push({ x: shipX + 3, y: 178 });
            bullets.push({ x: shipX + 17, y: 178 });
        }

        function updateSpace() {
            if (isGameOver) return;

            ctx.fillStyle = '#080d18';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Neon Grid Line
            ctx.strokeStyle = 'rgba(0, 255, 200, 0.12)'; ctx.lineWidth = 0.5;
            ctx.beginPath(); ctx.moveTo(0, 185); ctx.lineTo(canvas.width, 185); ctx.stroke();

            // Ship
            ctx.shadowColor = '#00ffc8'; ctx.shadowBlur = 10;
            ctx.fillStyle = '#00ffc8';
            ctx.fillRect(shipX, 180, 20, 10);
            ctx.fillRect(shipX + 8, 173, 4, 7);
            ctx.shadowBlur = 0;

            // Fast Lasers (10px/frame)
            for (let i = bullets.length - 1; i >= 0; i--) {
                const b = bullets[i];
                b.y -= 10;

                ctx.fillStyle = '#00ffc8';
                ctx.shadowColor = '#00ffc8'; ctx.shadowBlur = 8;
                ctx.fillRect(b.x, b.y, 2, 8);
                ctx.shadowBlur = 0;

                if (b.y < 0) { bullets.splice(i, 1); continue; }

                invaders.forEach(inv => {
                    if (inv.alive && Math.abs(inv.x - b.x) < 15 && Math.abs(inv.y - b.y) < 15) {
                        inv.alive = false;
                        score += 15;
                        createExplosion(inv.x, inv.y);
                        bullets.splice(i, 1);
                        if (scoreEl) scoreEl.textContent = score;
                    }
                });
            }

            // Explosion Sparks
            for (let i = particles.length - 1; i >= 0; i--) {
                const p = particles[i];
                p.x += p.vx; p.y += p.vy; p.life -= 0.08;
                if (p.life <= 0) { particles.splice(i, 1); continue; }
                ctx.fillStyle = p.color;
                ctx.globalAlpha = p.life;
                ctx.fillRect(p.x, p.y, 3, 3);
                ctx.globalAlpha = 1.0;
            }

            // Fast Downward Invader Movement
            let edgeHit = false;
            let activeCount = 0;

            invaders.forEach(inv => {
                if (inv.alive) {
                    activeCount++;
                    inv.x += invaderDx;
                    if (inv.x > canvas.width - 20 || inv.x < 10) edgeHit = true;

                    ctx.font = '13px sans-serif';
                    ctx.fillText(inv.type, inv.x, inv.y);

                    // Downward Breach Check
                    if (inv.y >= 175) {
                        shields--;
                        if (shieldsEl) shieldsEl.textContent = '🛡️'.repeat(Math.max(0, shields));
                        inv.alive = false;
                        if (shields <= 0) {
                            isGameOver = true;
                            stopActiveGame();
                            ctx.fillStyle = 'rgba(255, 68, 68, 0.9)';
                            ctx.fillRect(0, 0, canvas.width, canvas.height);
                            ctx.fillStyle = '#ffffff';
                            ctx.font = '700 13px Space Grotesk'; ctx.textAlign = 'center';
                            ctx.fillText('MALWARE BREACH! GAME OVER', canvas.width / 2, canvas.height / 2);
                            return;
                        }
                    }
                }
            });

            // Fast Downward Descent when hitting walls
            if (edgeHit) {
                invaderDx = -invaderDx * 1.05; // Slightly accelerate speed
                invaders.forEach(inv => { inv.y += 14; }); // Descend fast by 14px!
            }

            if (shieldsEl) shieldsEl.textContent = '🛡️'.repeat(Math.max(0, shields));

            if (activeCount === 0) {
                isGameOver = true;
                stopActiveGame();
                ctx.fillStyle = 'rgba(0, 255, 200, 0.9)';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = '#080d18';
                ctx.font = '700 14px Space Grotesk'; ctx.textAlign = 'center';
                ctx.fillText('⚡ 20 MALWARES DESTROYED! VICTORY!', canvas.width / 2, canvas.height / 2);
            }
        }

        container.querySelector('#spaceL').onclick = () => { shipX = Math.max(10, shipX - 18); };
        container.querySelector('#spaceR').onclick = () => { shipX = Math.min(210, shipX + 18); };
        container.querySelector('#spaceFire').onclick = fireLaser;

        stopActiveGame();
        activeGameLoop = setInterval(updateSpace, 40);
    }

    const gamesData = [
        { id: 'serverOptimizer', name: 'Server Load Optimizer', iconClass: 'ic-opt', icon: 'fa-tachometer-alt', desc: 'Balance CPU clock & thermal controls for max uptime!', fn: startServerOptimizerGame },
        { id: 'bugSmasher', name: 'Server Bug Smasher', iconClass: 'ic-bug', icon: 'fa-bug', desc: 'Tap & fix server bugs before CPU overloads!', fn: startBugSmasherGame },
        { id: 'cyberSnake', name: 'Terminal Cyber-Snake', iconClass: 'ic-snake', icon: 'fa-terminal', desc: 'Swipe to guide snake & collect data packets!', fn: startCyberSnakeGame },
        { id: 'rocketBalancer', name: 'Rocket Payload Balancer', iconClass: 'ic-rocket', icon: 'fa-rocket', desc: 'Keep rocket level during launch turbulence!', fn: startRocketBalancerGame },
        { id: 'ddosDefense', name: 'DDoS Attack Defense', iconClass: 'ic-ddos', icon: 'fa-shield-alt', desc: 'Tap bad IP packets before they hit server core!', fn: startDdosDefenseGame },
        { id: 'devTrivia', name: 'DevOps & Linux Trivia', iconClass: 'ic-trivia', icon: 'fa-question-circle', desc: 'Test your DevOps knowledge in 60 seconds!', fn: startDevTriviaGame },
        { id: 'spaceInvaders', name: 'Space Invaders Cyber', iconClass: 'ic-space', icon: 'fa-gamepad', desc: 'Shoot down incoming malware space invaders!', fn: startSpaceInvadersGame }
    ];

    function showArcadeMenu() {
        stopActiveGame();
        titleEl.innerHTML = '<i class="fas fa-gamepad"></i> Cyber Arcade';
        if (backBtn) backBtn.style.display = 'none';

        const enabledGames = gamesData.filter(g => gamesConfig[g.id] !== false);

        if (enabledGames.length === 0) {
            bodyEl.innerHTML = '<p style="color:var(--text-dim);font-size:0.85rem">No games currently enabled in config.js</p>';
            return;
        }

        bodyEl.innerHTML = `
            <div class="arcade-list">
                ${enabledGames.map(g => `
                    <div class="game-card ${g.id === 'serverOptimizer' ? 'featured-game-card' : ''}">
                        <div class="game-icon ${g.iconClass}"><i class="fas ${g.icon}"></i></div>
                        <div class="game-info">
                            <h3>${g.name} ${g.id === 'serverOptimizer' ? '<span class="rec-badge">⭐ Recommended</span>' : ''}</h3>
                            <p>${g.desc}</p>
                        </div>
                        <button class="game-play-btn" data-gameid="${g.id}"><i class="fas fa-play"></i> Play</button>
                    </div>
                `).join('')}
            </div>
        `;

        bodyEl.querySelectorAll('.game-play-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const gId = btn.getAttribute('data-gameid');
                const gameObj = enabledGames.find(g => g.id === gId);
                if (gameObj) {
                    if (backBtn) backBtn.style.display = 'inline-block';
                    titleEl.innerHTML = `<i class="fas ${gameObj.icon}"></i> ${gameObj.name}`;
                    gameObj.fn(bodyEl);
                }
            });
        });
    }

    triggerBtn.addEventListener('click', () => {
        modal.style.display = 'flex';
        showArcadeMenu();
    });

    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
        stopActiveGame();
        bodyEl.innerHTML = '';
    });

    if (backBtn) {
        backBtn.addEventListener('click', () => {
            showArcadeMenu();
        });
    }
}
