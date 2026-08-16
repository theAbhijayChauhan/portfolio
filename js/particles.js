// ══════════════════════════════════════════════════════════════════════════════
//  3D CYBER CLOUD GLOBE & LIVE DATA ARC STREAMS ENGINE
//  Features:
//  - 3D Holographic Fibonacci Sphere with Depth Perspective
//  - Global Cloud Region Server Nodes (AWS/K8s: US-East, EU, AP-South, Tokyo, etc.)
//  - Real-Time 3D Curved Laser Data Packet Arcs pulsing between continents
//  - Interactive 3D Cursor Tilt & Smooth Auto-Rotation
//  - Clean Landing Screen Protection (Smoothly emerges when scrolled past hero)
//  - Ambient Constellation Starfield Layer
// ══════════════════════════════════════════════════════════════════════════════

const ParticleSystem = (() => {
    let canvas, ctx;
    let animId;
    let globeOpacity = 0; // Smooth fade-in on scroll

    // ── ROTATION STATE ──
    let angleX = 0.32; // Pitch tilt
    let angleY = 0.0;  // Yaw rotation
    let targetAngleX = 0.32;
    let targetAngleY = 0.0;
    const ROTATION_SPEED = 0.0035;

    const mouse = { x: -1000, y: -1000, active: false };
    const MOUSE_RADIUS = 140;

    // ── LAYER 1: Ambient Constellation Stars ──
    let ambientStars = [];
    const CONST_COLORS = ['#00ffc8', '#00f0ff', '#f59e0b', '#3b82f6'];
    const MAX_CONST_DIST = 130;

    // ── LAYER 2: 3D Cyber Globe Data ──
    let spherePoints = [];
    const TOTAL_POINTS = 520;

    // Cloud Region Datacenter Nodes (lat/lon in degrees)
    const CLOUD_NODES = [
        { id: 'USE1', label: 'AWS US-EAST (VA)',      lat: 38.0,  lon: -78.0,  color: '#00ffc8' }, // 0
        { id: 'USW2', label: 'AWS US-WEST (OR)',      lat: 45.5,  lon: -122.6, color: '#00f0ff' }, // 1
        { id: 'USC1', label: 'AWS US-CENTRAL (OH)',   lat: 40.0,  lon: -83.0,  color: '#38bdf8' }, // 2
        { id: 'EUC1', label: 'AWS EU-CENTRAL (FRA)',  lat: 50.1,  lon: 8.6,    color: '#fbbf24' }, // 3
        { id: 'EUW1', label: 'AWS EU-WEST (LON)',     lat: 51.5,  lon: -0.1,   color: '#00ffc8' }, // 4
        { id: 'EUN1', label: 'AWS EU-NORTH (STO)',    lat: 59.3,  lon: 18.0,   color: '#38bdf8' }, // 5
        { id: 'APS1', label: 'AWS AP-SOUTH (MUMBAI)', lat: 19.0,  lon: 72.8,   color: '#00ffc8' }, // 6
        { id: 'APSE1', label: 'AWS AP-SE (SG)',       lat: 1.35,  lon: 103.8,  color: '#fbbf24' }, // 7
        { id: 'APE1', label: 'AWS AP-EAST (TOKYO)',   lat: 35.6,  lon: 139.6,  color: '#00f0ff' }, // 8
        { id: 'APNE2', label: 'AWS AP-NE (SEOUL)',    lat: 37.5,  lon: 127.0,  color: '#38bdf8' }, // 9
        { id: 'APSE2', label: 'AWS AP-SE (SYDNEY)',   lat: -33.8, lon: 151.2,  color: '#00ffc8' }, // 10
        { id: 'SAE1', label: 'AWS SA-EAST (SP)',      lat: -23.5, lon: -46.6,  color: '#f59e0b' }, // 11
        { id: 'MES1', label: 'AWS ME-SOUTH (BHR)',    lat: 26.0,  lon: 50.5,   color: '#fbbf24' }, // 12
        { id: 'AFS1', label: 'AWS AF-SOUTH (CT)',     lat: -33.9, lon: 18.4,   color: '#00f0ff' }, // 13
        { id: 'CAC1', label: 'AWS CA-CENTRAL (MTL)',  lat: 45.5,  lon: -73.5,  color: '#00ffc8' }  // 14
    ];

    // Node Connection Arcs & Active Data Packets (High-Density Multi-Directional Fiber Mesh)
    const ARCS = [
        // Transatlantic & Americas
        { from: 0, to: 3, packets: [{ t: 0.1, speed: 0.009 }, { t: 0.6, speed: 0.009 }] }, // US-East <-> Frankfurt
        { from: 0, to: 4, packets: [{ t: 0.25, speed: 0.008 }, { t: 0.75, speed: 0.008 }] }, // US-East <-> London
        { from: 0, to: 1, packets: [{ t: 0.05, speed: 0.011 }, { t: 0.55, speed: 0.011 }] }, // US-East <-> US-West
        { from: 0, to: 2, packets: [{ t: 0.3, speed: 0.012 }] },                            // US-East <-> Ohio
        { from: 0, to: 14, packets: [{ t: 0.4, speed: 0.01 }] },                            // US-East <-> Montreal
        { from: 0, to: 11, packets: [{ t: 0.2, speed: 0.008 }, { t: 0.7, speed: 0.008 }] }, // US-East <-> São Paulo
        { from: 14, to: 4, packets: [{ t: 0.2, speed: 0.009 }, { t: 0.7, speed: 0.009 }] }, // Montreal <-> London
        { from: 14, to: 1, packets: [{ t: 0.35, speed: 0.01 }] },                           // Montreal <-> US-West
        { from: 11, to: 1, packets: [{ t: 0.45, speed: 0.008 }] },                          // São Paulo <-> US-West
        { from: 11, to: 13, packets: [{ t: 0.5, speed: 0.007 }, { t: 0.95, speed: 0.007 }] }, // São Paulo <-> Cape Town

        // Europe, Middle East & Africa
        { from: 3, to: 4, packets: [{ t: 0.15, speed: 0.013 }, { t: 0.65, speed: 0.013 }] }, // Frankfurt <-> London
        { from: 3, to: 5, packets: [{ t: 0.35, speed: 0.01 }, { t: 0.85, speed: 0.01 }] },   // Frankfurt <-> Stockholm
        { from: 4, to: 5, packets: [{ t: 0.2, speed: 0.012 }] },                            // London <-> Stockholm
        { from: 3, to: 12, packets: [{ t: 0.1, speed: 0.009 }, { t: 0.6, speed: 0.009 }] },  // Frankfurt <-> Bahrain
        { from: 4, to: 12, packets: [{ t: 0.4, speed: 0.008 }] },                           // London <-> Bahrain
        { from: 3, to: 13, packets: [{ t: 0.3, speed: 0.008 }, { t: 0.8, speed: 0.008 }] },  // Frankfurt <-> Cape Town
        { from: 12, to: 13, packets: [{ t: 0.25, speed: 0.009 }] },                         // Bahrain <-> Cape Town
        { from: 12, to: 6, packets: [{ t: 0.3, speed: 0.01 }, { t: 0.8, speed: 0.01 }] },    // Bahrain <-> Mumbai
        { from: 3, to: 6, packets: [{ t: 0.2, speed: 0.008 }, { t: 0.7, speed: 0.008 }] },   // Frankfurt <-> Mumbai

        // Asia-Pacific & Trans-Pacific Mesh
        { from: 6, to: 7, packets: [{ t: 0.05, speed: 0.01 }, { t: 0.55, speed: 0.01 }] },   // Mumbai <-> Singapore
        { from: 6, to: 9, packets: [{ t: 0.35, speed: 0.008 }] },                           // Mumbai <-> Seoul
        { from: 7, to: 8, packets: [{ t: 0.4, speed: 0.009 }, { t: 0.9, speed: 0.009 }] },   // Singapore <-> Tokyo
        { from: 7, to: 10, packets: [{ t: 0.25, speed: 0.009 }, { t: 0.75, speed: 0.009 }] }, // Singapore <-> Sydney
        { from: 8, to: 9, packets: [{ t: 0.2, speed: 0.014 }, { t: 0.7, speed: 0.014 }] },  // Tokyo <-> Seoul
        { from: 8, to: 10, packets: [{ t: 0.1, speed: 0.008 }, { t: 0.6, speed: 0.008 }] },  // Tokyo <-> Sydney
        { from: 9, to: 10, packets: [{ t: 0.45, speed: 0.008 }] },                          // Seoul <-> Sydney
        { from: 1, to: 8, packets: [{ t: 0.15, speed: 0.007 }, { t: 0.65, speed: 0.007 }] }, // US-West <-> Tokyo
        { from: 1, to: 9, packets: [{ t: 0.3, speed: 0.008 }] },                            // US-West <-> Seoul
        { from: 1, to: 10, packets: [{ t: 0.45, speed: 0.007 }, { t: 0.9, speed: 0.007 }] }, // US-West <-> Sydney
        { from: 13, to: 10, packets: [{ t: 0.2, speed: 0.007 }] },                          // Cape Town <-> Sydney
        { from: 5, to: 8, packets: [{ t: 0.15, speed: 0.007 }] },                           // Stockholm <-> Tokyo (Polar Route)
        { from: 2, to: 4, packets: [{ t: 0.35, speed: 0.009 }] },                           // Ohio <-> London
        // Additional Intercontinental Laser Trunk Lines (Paths only, no packets)
        { from: 6, to: 13, packets: [] }, // Mumbai <-> Cape Town (Direct Indian Ocean Line)
        { from: 11, to: 10, packets: [] }, // São Paulo <-> Sydney (Trans-South Pacific Line)
        { from: 2, to: 8, packets: [] }   // Ohio <-> Tokyo (Trans-Pacific Northern Route)
    ];

    // Node Pings (visual radar rings when packets arrive)
    let nodePings = [];

    function init() {
        const isEnabled = !(window.CONFIG && window.CONFIG.showSections && window.CONFIG.showSections.particles === false);
        canvas = document.getElementById('particleCanvas');
        if (!canvas) return;

        if (!isEnabled) {
            canvas.style.display = 'none';
            return;
        }

        // Disable heavy canvas effects on mobile to preserve battery & performance
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

            // Subtle interactive 3D tilt
            const normX = (e.clientX / window.innerWidth) - 0.5;
            const normY = (e.clientY / window.innerHeight) - 0.5;
            targetAngleX = 0.32 + normY * 0.45;
            targetAngleY = angleY + normX * 0.45;
        }, { passive: true });

        window.addEventListener('mouseleave', () => {
            mouse.active = false;
            mouse.x = -1000;
            mouse.y = -1000;
            targetAngleX = 0.32;
        }, { passive: true });

        createAmbientStars();
        build3DGlobeModel();

        animate();
    }

    function resize() {
        if (!canvas) return;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    // ── 1. Create Ambient Starfield (Background Constellation) ──
    function createAmbientStars() {
        ambientStars = [];
        const count = Math.min(85, Math.max(45, Math.floor((window.innerWidth * window.innerHeight) / 14000)));

        for (let i = 0; i < count; i++) {
            ambientStars.push({
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                vx: (Math.random() - 0.5) * 0.4,
                vy: (Math.random() - 0.5) * 0.4,
                baseVx: (Math.random() - 0.5) * 0.4,
                baseVy: (Math.random() - 0.5) * 0.4,
                size: Math.random() * 2.0 + 0.8,
                color: CONST_COLORS[Math.floor(Math.random() * CONST_COLORS.length)],
                alpha: Math.random() * 0.4 + 0.15
            });
        }
    }

    // ── 2. Build 3D Fibonacci Sphere Point Cloud ──
    function build3DGlobeModel() {
        spherePoints = [];
        const phi = Math.PI * (3 - Math.sqrt(5)); // Golden angle

        for (let i = 0; i < TOTAL_POINTS; i++) {
            const y = 1 - (i / (TOTAL_POINTS - 1)) * 2; // y goes from 1 to -1
            const radiusAtY = Math.sqrt(1 - y * y);
            const theta = phi * i;

            const x = Math.cos(theta) * radiusAtY;
            const z = Math.sin(theta) * radiusAtY;

            spherePoints.push({
                x, y, z,
                baseAlpha: Math.random() * 0.5 + 0.3,
                size: Math.random() * 1.3 + 0.9,
                color: Math.random() > 0.85 ? '#fbbf24' : (Math.random() > 0.4 ? '#00ffc8' : '#00b4d8')
            });
        }
    }

    // Helper: Convert Lat/Lon to 3D Sphere Vector
    function latLonToVector3D(lat, lon) {
        const phi = (90 - lat) * (Math.PI / 180);
        const theta = (lon + 180) * (Math.PI / 180);
        return {
            x: -(Math.sin(phi) * Math.cos(theta)),
            y: Math.cos(phi),
            z: Math.sin(phi) * Math.sin(theta)
        };
    }

    // Helper: Rotate a 3D Point by (angleX, angleY) and Project to 2D Screen
    function project3D(p, radius, cx, cy, fov = 600) {
        // Rotate X (Pitch)
        const cosX = Math.cos(angleX);
        const sinX = Math.sin(angleX);
        const y1 = p.y * cosX - p.z * sinX;
        const z1 = p.y * sinX + p.z * cosX;

        // Rotate Y (Yaw)
        const cosY = Math.cos(angleY);
        const sinY = Math.sin(angleY);
        const x2 = p.x * cosY + z1 * sinY;
        const z2 = -p.x * sinY + z1 * cosY;

        // 3D perspective scale
        const scale = fov / (fov + (z2 * radius));
        const projX = cx + (x2 * radius) * scale;
        const projY = cy + (y1 * radius) * scale;

        return {
            projX, projY,
            z: z2, // Depth for sorting & front/back hemisphere shading
            scale,
            isFront: z2 > -0.15
        };
    }

    // Helper: 3D Quadratic Bezier Curve interpolation
    function get3DBezierPoint(p0, p1, p2, t) {
        const invT = 1 - t;
        return {
            x: invT * invT * p0.x + 2 * invT * t * p1.x + t * t * p2.x,
            y: invT * invT * p0.y + 2 * invT * t * p1.y + t * t * p2.y,
            z: invT * invT * p0.z + 2 * invT * t * p1.z + t * t * p2.z
        };
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Continuous yaw rotation + smooth interactive tilt
        angleY += ROTATION_SPEED;
        angleX += (targetAngleX - angleX) * 0.04;

        // Check if user scrolled past the hero landing screen
        const isGlobeConfigEnabled = !(window.CONFIG && window.CONFIG.showSections && window.CONFIG.showSections.cyberGlobe === false);
        const scrolledPastHero = window.scrollY > (window.innerHeight * 0.35);

        // Smooth fade-in/fade-out on scroll
        const targetOpacity = (scrolledPastHero && isGlobeConfigEnabled) ? 1 : 0;
        globeOpacity += (targetOpacity - globeOpacity) * 0.06;

        // ═════════════════════════════════════════════════════════════════════
        //  LAYER 1: Ambient Constellation Stars (Runs smoothly everywhere)
        // ═════════════════════════════════════════════════════════════════════
        for (let i = 0; i < ambientStars.length; i++) {
            const p = ambientStars[i];

            // Mouse Repulsion
            if (mouse.active) {
                const dx = p.x - mouse.x;
                const dy = p.y - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < MOUSE_RADIUS && dist > 0) {
                    const force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS;
                    const angle = Math.atan2(dy, dx);
                    p.x += Math.cos(angle) * force * 5;
                    p.y += Math.sin(angle) * force * 5;
                }
            }

            p.x += p.vx;
            p.y += p.vy;

            if (p.x < -15) p.x = canvas.width + 15;
            if (p.x > canvas.width + 15) p.x = -15;
            if (p.y < -15) p.y = canvas.height + 15;
            if (p.y > canvas.height + 15) p.y = -15;

            // Render Dot
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.globalAlpha = p.alpha;
            ctx.fill();

            // Connect nearby stars
            for (let j = i + 1; j < ambientStars.length; j++) {
                const q = ambientStars[j];
                const dx = p.x - q.x;
                const dy = p.y - q.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < MAX_CONST_DIST) {
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(q.x, q.y);
                    ctx.strokeStyle = p.color;
                    ctx.globalAlpha = 0.06 * (1 - dist / MAX_CONST_DIST);
                    ctx.lineWidth = 0.6;
                    ctx.stroke();
                }
            }
        }

        // ═════════════════════════════════════════════════════════════════════
        //  LAYER 2: 3D CYBER CLOUD GLOBE & LIVE DATA ARCS
        // ═════════════════════════════════════════════════════════════════════
        if (globeOpacity > 0.02) {
            const cx = canvas.width * 0.5;
            const cy = canvas.height * 0.52;
            const radius = Math.min(canvas.width * 0.44, canvas.height * 0.48, 420);

            // ── A. Render Outer Holographic Atmospheric Glow ──
            const haloGrad = ctx.createRadialGradient(cx, cy, radius * 0.7, cx, cy, radius * 1.35);
            haloGrad.addColorStop(0, 'rgba(0, 255, 200, ' + (0.04 * globeOpacity) + ')');
            haloGrad.addColorStop(0.6, 'rgba(0, 180, 216, ' + (0.02 * globeOpacity) + ')');
            haloGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
            ctx.beginPath();
            ctx.arc(cx, cy, radius * 1.35, 0, Math.PI * 2);
            ctx.fillStyle = haloGrad;
            ctx.globalAlpha = globeOpacity;
            ctx.fill();

            // ── B. Render Orbital Equatorial Ring ──
            ctx.beginPath();
            const ringSteps = 48;
            for (let i = 0; i <= ringSteps; i++) {
                const theta = (i / ringSteps) * Math.PI * 2;
                const rx = Math.cos(theta);
                const rz = Math.sin(theta);
                const ringProj = project3D({ x: rx, y: 0, z: rz }, radius * 1.18, cx, cy);
                if (i === 0) ctx.moveTo(ringProj.projX, ringProj.projY);
                else ctx.lineTo(ringProj.projX, ringProj.projY);
            }
            ctx.strokeStyle = 'rgba(0, 255, 200, 0.12)';
            ctx.lineWidth = 1.0;
            ctx.setLineDash([4, 6]);
            ctx.globalAlpha = globeOpacity * 0.6;
            ctx.stroke();
            ctx.setLineDash([]);

            // ── C. Render 3D Sphere Surface Point Cloud ──
            for (let i = 0; i < spherePoints.length; i++) {
                const sp = spherePoints[i];
                const proj = project3D(sp, radius, cx, cy);

                // Front hemisphere is bright; back hemisphere is dim for depth
                const depthAlpha = proj.isFront
                    ? sp.baseAlpha * (0.45 + proj.z * 0.55)
                    : sp.baseAlpha * 0.12;

                const dotSize = Math.max(0.6, sp.size * proj.scale * (proj.isFront ? 1.0 : 0.65));

                ctx.beginPath();
                ctx.arc(proj.projX, proj.projY, dotSize, 0, Math.PI * 2);
                ctx.fillStyle = sp.color;
                ctx.globalAlpha = depthAlpha * globeOpacity;
                ctx.fill();
            }

            // ── D. Render Projected Cloud Region Server Nodes ──
            const projectedNodes = CLOUD_NODES.map(node => {
                const vec = latLonToVector3D(node.lat, node.lon);
                const proj = project3D(vec, radius, cx, cy);
                return { ...node, vec, proj };
            });

            // ── E. Render 3D Curved Laser Data Packet Arcs ──
            ARCS.forEach(arc => {
                const n1 = projectedNodes[arc.from];
                const n2 = projectedNodes[arc.to];
                if (!n1 || !n2) return;

                // 3D midpoint lifted above surface for arch
                const midVec = {
                    x: (n1.vec.x + n2.vec.x) * 0.5,
                    y: (n1.vec.y + n2.vec.y) * 0.5,
                    z: (n1.vec.z + n2.vec.z) * 0.5
                };
                const midLen = Math.sqrt(midVec.x * midVec.x + midVec.y * midVec.y + midVec.z * midVec.z) || 1;
                const arcAltitude = 1.32; // Height of arc curve above surface
                const p1 = {
                    x: (midVec.x / midLen) * arcAltitude,
                    y: (midVec.y / midLen) * arcAltitude,
                    z: (midVec.z / midLen) * arcAltitude
                };

                // Draw 3D Curved Arc Path
                ctx.beginPath();
                const arcSteps = 24;
                let isArcVisible = false;

                for (let step = 0; step <= arcSteps; step++) {
                    const t = step / arcSteps;
                    const curve3D = get3DBezierPoint(n1.vec, p1, n2.vec, t);
                    const ptProj = project3D(curve3D, radius, cx, cy);

                    if (ptProj.isFront) isArcVisible = true;

                    if (step === 0) ctx.moveTo(ptProj.projX, ptProj.projY);
                    else ctx.lineTo(ptProj.projX, ptProj.projY);
                }

                ctx.strokeStyle = isArcVisible ? 'rgba(0, 255, 200, 0.22)' : 'rgba(0, 255, 200, 0.05)';
                ctx.lineWidth = 1.2;
                ctx.globalAlpha = globeOpacity * (isArcVisible ? 0.8 : 0.25);
                ctx.stroke();

                // Animate Glowing Laser Data Packets along the Arc
                arc.packets.forEach(pkt => {
                    pkt.t += pkt.speed;
                    if (pkt.t > 1.0) {
                        pkt.t = 0.0;
                        // Trigger Ping wave on target node
                        nodePings.push({
                            nodeIdx: arc.to,
                            radius: 3,
                            maxRadius: 22,
                            alpha: 1.0
                        });
                    }

                    const pkt3D = get3DBezierPoint(n1.vec, p1, n2.vec, pkt.t);
                    const pktProj = project3D(pkt3D, radius, cx, cy);

                    if (pktProj.isFront) {
                        // Packet Glow Core
                        ctx.beginPath();
                        ctx.arc(pktProj.projX, pktProj.projY, 3.2 * pktProj.scale, 0, Math.PI * 2);
                        ctx.fillStyle = '#fbbf24'; // Glowing Gold Packet
                        ctx.globalAlpha = globeOpacity * 0.95;
                        ctx.fill();

                        // Packet Halo
                        ctx.beginPath();
                        ctx.arc(pktProj.projX, pktProj.projY, 6.5 * pktProj.scale, 0, Math.PI * 2);
                        ctx.fillStyle = 'rgba(251, 191, 36, 0.35)';
                        ctx.fill();
                    }
                });
            });

            // ── F. Render Cloud Nodes & Active Radar Pulse Pings ──
            projectedNodes.forEach((node, idx) => {
                if (node.proj.isFront) {
                    const nodeScale = node.proj.scale;
                    const dotRadius = Math.max(4.0, 5.5 * nodeScale);

                    // Core Server Marker
                    ctx.beginPath();
                    ctx.arc(node.proj.projX, node.proj.projY, dotRadius, 0, Math.PI * 2);
                    ctx.fillStyle = node.color;
                    ctx.globalAlpha = globeOpacity * 0.98;
                    ctx.fill();

                    // Outer Halo Ring
                    ctx.beginPath();
                    ctx.arc(node.proj.projX, node.proj.projY, dotRadius * 2.2, 0, Math.PI * 2);
                    ctx.strokeStyle = node.color;
                    ctx.lineWidth = 1.4;
                    ctx.globalAlpha = globeOpacity * 0.75;
                    ctx.stroke();

                    // HUD High-Contrast Tag Badge
                    const fontSize = Math.max(12, Math.floor(14 * nodeScale));
                    ctx.font = `800 ${fontSize}px "JetBrains Mono", monospace`;
                    const textWidth = ctx.measureText(node.id).width;
                    const tagX = node.proj.projX + dotRadius * 2.2;
                    const tagY = node.proj.projY - (fontSize * 0.5) - 3;

                    // Micro Pill Background for crisp contrast
                    ctx.fillStyle = 'rgba(8, 11, 18, 0.85)';
                    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
                    ctx.lineWidth = 1.0;
                    ctx.beginPath();
                    if (ctx.roundRect) {
                        ctx.roundRect(tagX - 5, tagY, textWidth + 10, fontSize + 6, 4);
                    } else {
                        ctx.rect(tagX - 5, tagY, textWidth + 10, fontSize + 6);
                    }
                    ctx.globalAlpha = globeOpacity * 0.92;
                    ctx.fill();
                    ctx.stroke();

                    // Crisp White Tag Text
                    ctx.fillStyle = '#ffffff';
                    ctx.globalAlpha = globeOpacity * 1.0;
                    ctx.textBaseline = 'top';
                    ctx.fillText(node.id, tagX, tagY + 3);
                }
            });

            // ── G. Update & Render Node Ping Waves ──
            for (let i = nodePings.length - 1; i >= 0; i--) {
                const ping = nodePings[i];
                const targetNode = projectedNodes[ping.nodeIdx];

                if (targetNode && targetNode.proj.isFront) {
                    ctx.beginPath();
                    ctx.arc(targetNode.proj.projX, targetNode.proj.projY, ping.radius * targetNode.proj.scale, 0, Math.PI * 2);
                    ctx.strokeStyle = 'rgba(251, 191, 36, ' + (ping.alpha * globeOpacity) + ')';
                    ctx.lineWidth = 1.4;
                    ctx.stroke();
                }

                ping.radius += 0.8;
                ping.alpha -= 0.035;

                if (ping.alpha <= 0 || ping.radius >= ping.maxRadius) {
                    nodePings.splice(i, 1);
                }
            }
        }

        ctx.globalAlpha = 1;
        animId = requestAnimationFrame(animate);
    }

    function boost(active) {
        if (!canvas) return;

        if (active) {
            canvas.classList.add('particles-blurred');
            if (ambientStars.some(p => p.isExtra)) return;

            ambientStars.forEach(p => {
                p.vx = p.baseVx * 2.8;
                p.vy = p.baseVy * 2.8;
            });

            const extraCount = 60;
            for (let i = 0; i < extraCount; i++) {
                ambientStars.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    vx: (Math.random() - 0.5) * 2.8,
                    vy: (Math.random() - 0.5) * 2.8,
                    baseVx: (Math.random() - 0.5) * 0.6,
                    baseVy: (Math.random() - 0.5) * 0.6,
                    size: Math.random() * 3.2 + 1.2,
                    color: CONST_COLORS[Math.floor(Math.random() * CONST_COLORS.length)],
                    alpha: Math.random() * 0.55 + 0.25,
                    isExtra: true
                });
            }
        } else {
            canvas.classList.remove('particles-blurred');
            ambientStars = ambientStars.filter(p => !p.isExtra);
            ambientStars.forEach(p => {
                p.vx = p.baseVx;
                p.vy = p.baseVy;
            });
        }
    }

    return { init, boost };
})();