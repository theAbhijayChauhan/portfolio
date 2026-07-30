// ══════════════════════════════════════════════════════════════════════════════
//  INTERACTIVE PARTICLE NETWORK — Mouse Repulsion & Dynamic Constellation
// ══════════════════════════════════════════════════════════════════════════════

const ParticleSystem = (() => {
    let canvas, ctx;
    let particles = [];
    let animId;
    const mouse = { x: -1000, y: -1000, active: false };
    const MOUSE_RADIUS = 150; // Distance within which particles repel from cursor
    const MAX_DIST = 140;     // Line connection distance between particles

    function getParticleCount() {
        const area = window.innerWidth * window.innerHeight;
        return Math.min(100, Math.max(50, Math.floor(area / 12000)));
    }

    function init() {
        // Check showSections config toggle
        const isEnabled = !(window.CONFIG && window.CONFIG.showSections && window.CONFIG.showSections.particles === false);

        canvas = document.getElementById('particleCanvas');
        if (!canvas) return;

        if (!isEnabled) {
            canvas.style.display = 'none';
            return;
        }

        // Disable particles on mobile/touch devices to prevent lag
        const isMobile = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (window.innerWidth < 768);
        if (isMobile) {
            canvas.style.display = 'none';
            return;
        }

        canvas.style.display = 'block';
        ctx = canvas.getContext('2d');
        resize();

        window.addEventListener('resize', resize, { passive: true });
        window.addEventListener('mousemove', e => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
            mouse.active = true;
        }, { passive: true });

        window.addEventListener('mouseleave', () => {
            mouse.active = false;
            mouse.x = -1000;
            mouse.y = -1000;
        }, { passive: true });

        createParticles();
        animate();
    }

    function resize() {
        if (!canvas) return;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    function createParticles() {
        particles = [];
        const count = getParticleCount();
        const colors = ['#00ffc8', '#00f0ff', '#f59e0b', '#3b82f6'];

        for (let i = 0; i < count; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.45,
                vy: (Math.random() - 0.5) * 0.45,
                baseVx: (Math.random() - 0.5) * 0.45,
                baseVy: (Math.random() - 0.5) * 0.45,
                size: Math.random() * 2.2 + 0.8,
                color: colors[Math.floor(Math.random() * colors.length)],
                alpha: Math.random() * 0.45 + 0.15,
            });
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];

            // Interactive Mouse Repulsion Logic
            if (mouse.active) {
                const dx = p.x - mouse.x;
                const dy = p.y - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < MOUSE_RADIUS && dist > 0) {
                    const force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS;
                    const angle = Math.atan2(dy, dx);
                    const pushX = Math.cos(angle) * force * 6;
                    const pushY = Math.sin(angle) * force * 6;

                    p.x += pushX;
                    p.y += pushY;
                }
            }

            // Normal Ambient Movement
            p.x += p.vx;
            p.y += p.vy;

            // Wrap around edges seamlessly
            if (p.x < -15) p.x = canvas.width + 15;
            if (p.x > canvas.width + 15) p.x = -15;
            if (p.y < -15) p.y = canvas.height + 15;
            if (p.y > canvas.height + 15) p.y = -15;

            // Render Particle Dot
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.globalAlpha = p.alpha;
            ctx.fill();

            // Connect nearby particles with glowing lines
            for (let j = i + 1; j < particles.length; j++) {
                const q = particles[j];
                const dx = p.x - q.x;
                const dy = p.y - q.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < MAX_DIST) {
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(q.x, q.y);
                    ctx.strokeStyle = p.color;
                    ctx.globalAlpha = 0.06 * (1 - dist / MAX_DIST);
                    ctx.lineWidth = 0.6;
                    ctx.stroke();
                }
            }
        }

        ctx.globalAlpha = 1;
        animId = requestAnimationFrame(animate);
    }

    return { init };
})();