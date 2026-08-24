// ╔══════════════════════════════════════════════════════════════════════════════╗
// ║  CONFIGURATION & ASSETS GUIDE                                                ║
// ║  Edit ONLY this file to personalize your portfolio site.                    ║
// ╚══════════════════════════════════════════════════════════════════════════════╝

const CONFIG = {

    // ── SECTION & FEATURE VISIBILITY TOGGLES ────────────────
    // Set to true to show a section/feature, or false to completely hide it
    showSections: {
        // Page Sections
        stats: true,          // Quick Stats Counter Bar under Hero (true = show, false = hide)
        about: true,          // About Me & Terminal section (true = show, false = hide)
        skills: true,         // Technical Skills Arsenal (true = show, false = hide)
        projects: false,        // Featured Projects Grid (true = show, false = hide)
        education: true,      // Academic Background & Timeline (true = show, false = hide)
        certifications: true, // Validated Certifications (true = show, false = hide)
        achievements: true,   // Achievements & Highlights (true = show, false = hide)
        contact: true,        // Contact Form & Information (true = show, false = hide)

        // Supercool Features & Widgets
        sideWidgets: true,    // Left social bar & right magnetic nav dots (true = enable, false = disable)
        commandPalette: true, // Ctrl+K / Cmd+K Command Palette (true = enable, false = disable)
        matrixRain: true,     // Matrix digital rain canvas effect (true = enable, false = disable)
        cardSpotlight: true,  // Mouse spotlight glow on cards & background blobs (true = enable, false = disable)
        miniGame: true,       // Interactive DevOps Node Connector Mini-Game (true = enable, false = disable)
        themeToggle: true,    // Red glowing circular theme loop button in navbar (true = enable, false = disable)
        heroAvatar: true,     // Hero profile photo badge after mouse scroll button (true = show, false = hide)
        bootLoader: true,     // 2-Second Cyberpunk System Boot Log Loader (true = enable, false = disable)
        particles: true,      // Interactive background particle canvas effect (true = enable, false = disable)
        cyberGlobe: true,     // 3D Cyber Cloud Globe & Live Data Arc Streams (true = enable, false = disable)
        instagramBanner: true, // Glowing Instagram banner next to header logo (true = show, false = hide)
        mobileGames: true,    // Interactive Mobile Mini-Games Section (true = show, false = hide)
        desktopQuestions: true, // Ask Me Anything Terminal Modal button (true = enable, false = disable)
        resumeDrawer: true,   // Slide-Over Frosted Glass Resume Drawer (true = enable, false = disable)
        dynamicIsland: true,  // Apple-Style Dynamic Island Dock (Telegram, Instagram, Copy Email)
        skillRadarChart: true, // 6-Axis Interactive DevOps Skill Radar Chart (true = enable, false = disable)
        headerShade: true,    // Mint (#64e59a) top header shade tint on mobile (true = enable, false = disable)
        scratchCard: true,   // Mobile Scratch-Off Hidden Talent Card (true = show, false = hide)
        skillSphere: false,   // 3D Floating Skill Word Sphere on mobile (true = show, false = hide)
    },

    // ── MOBILE HEADER SHADE TOGGLE ─────────────────────────
    headerShade: true, // Set to false to disable #64e59a mint shade, true to enable

    // ── MOBILE SCRATCH CARD TOGGLE ─────────────────────────
    scratchCard: false, // Set to false to disable scratch card, true to enable

    // ── MOBILE SKILL SPHERE TOGGLE ─────────────────────────
    skillSphere: false, // Set to false to hide skill sphere on mobile, true to show

    // ── MOBILE MINI-GAMES TOGGLES (Set individual games to true/false) ──
    mobileGamesList: {
        bugSmasher: true,      // 👾 Server Bug Smasher (Tap to fix bugs)
        cyberSnake: false,     // 🐍 Terminal Cyber-Snake (Set to false per user request)
        rocketBalancer: true,  // 🚀 Rocket Payload Balancer (Keep rocket level)
        ddosDefense: true,     // 🛡️ DDoS Attack Tower Defense (Defend server from bad IPs)
        devTrivia: true,       // 🎲 Developer Trivia Quiz (Test DevOps knowledge)
        serverOptimizer: true, // 🔋 Battery & Server Optimizer (Balance CPU power & heat)
        spaceInvaders: true,   // 🌌 Space Invaders Cyber Edition (Shoot malware invaders)
    },

    // ── SYSTEM BOOT LOG TEXTS & DURATION ────────────────────
    // bootDuration: Total duration in milliseconds (3500 = 3.5 seconds)
    bootDuration: 3500,
    // Edit/Add text lines below to customize the bootup text on page load/refresh
    bootLogs: [
        "[INIT] Mounting in CSS v2.0...",
        "[OK] Initializing Cloud Engineer Neural Network...",
        "[OK] Security Protocols & Certificates Verified",
        "[READY] System Operational — Welcome to My Portfolio"
    ],

    // ── ASSETS & MEDIA FILES ────────────────────────────────
    // Change paths below or place your files in the assets/ folder with these names.
    assets: {
        // 📄 RESUME PDF FILE
        // File to place: assets/resume.pdf
        // Format: PDF (.pdf)
        // Usage: Downloaded when visitor clicks "Resume" button in Hero header
        resume: "assets/resume.pdf",

        // 👤 PROFILE PHOTO
        // File to place: assets/photo.jpg
        // Format: JPG or PNG (.jpg / .jpeg / .png)
        // Recommended size: 500x500 px (Square aspect ratio)
        // Usage: Displayed inside the "About Me" section (Currently Available badge)
        profilePhoto: "assets/photo.jpg",

        // 🖼️ PROJECT SCREENSHOTS / THUMBNAILS
        // Files to place inside: assets/projects/
        // Format: JPG, PNG, or WEBP (.jpg / .png / .webp)
        // Recommended size: 800x450 px or 600x400 px (Landscape aspect ratio)
        // Note: Set to "" if missing (displays fallback code icon)
        project1Image: "assets/projects/1.jpg", // K8s Auto-Scaler project thumbnail
        project2Image: "assets/projects/2.jpg", // Terraform Module Library thumbnail
        project3Image: "assets/projects/3.jpg", // Slack Incident Bot thumbnail
        project4Image: "assets/projects/4.jpg", // GitOps Dashboard thumbnail
        project5Image: "assets/projects/5.jpg", // Log Aggregation Pipeline thumbnail
        project6Image: "assets/projects/6.jpg", // Infrastructure Monitoring Stack thumbnail
    },

    // ── BASIC INFO ──────────────────────────────────────────
    name: "Abhijay Chauhan",
    initials: "theAbhijay",                          // 2-3 letters for top nav logo
    title: "DevOps Engineer & Cloud Engineer",
    tagline: "Building reliable software, analyzing data, and turning complex problems into practical solutions.",
    email: "abhijaychauhan.dev@gmail.com",
    phone: "+91 92XXX XXX48",
    location: "Lucknow, Uttar Pradesh, India",
    available: true,                         // true = shows "Open to opportunities" badge
    instagramLink: "https://instagram.com/theabhijaychauhan",
    instagramHandle: "@abhijay.chauhan",      // Clickable text next to glowing Insta logo
    telegramLink: "https://t.me/theabhijaychauhan",
    telegramHandle: "@theabhijaychauhan",

    // ── CONTACT FORM EMAIL DELIVERY ─────────────────────────
    // Create a free form at https://formspree.io and paste your Endpoint URL below
    // Example: "https://formspree.io/f/xayzvqwl"
    formspreeEndpoint: "https://formspree.io/f/xlgqqpbw",

    // ── BACKWARDS-COMPATIBLE FALLBACKS (automatically linked to assets above)
    resumeLink: "assets/resume.pdf",
    photo: "assets/photo.jpg",

    // ── SOCIAL LINKS ───────────────────────────────────────
    //    Set any URL to "" to hide that social icon
    links: {
        linkedin: "www.linkedin.com/in/abhijaychauhan",
        github: "https://github.com/theAbhijayChauhan",
        devto: "https://dev.to/theabhijaychauhan",
        youtube: "",                        // leave empty to hide
    },

    // ── HERO TYPING STRINGS ────────────────────────────────
    typingStrings: [
        "DevOps Engineer",
        "Cloud Engineer",
        "Cloud Enthusiast",
        "Automation Builder",
        "Linux Tinkerer",
        "QA/Test Engineer",
    ],

    // ── STATS ──────────────────────────────────────────────
    stats: [
        { value: 3, suffix: "+", label: "Projects Built" },
        { value: 8, suffix: "+", label: "Certifications" },
        { value: 10, suffix: "+", label: "Technologies" },
        { value: 500, suffix: "+", label: "GitHub Commits" },
    ],

    // ── ABOUT ──────────────────────────────────────────────
    about: [
        "I'm a recent graduate passionate about DevOps, and cloud-native technologies. While I may be a fresher by title, I've spent the last year building real infrastructure projects, earning industry certifications, and contributing to open source — because the best way to learn production systems is to build them.",
        "I believe in infrastructure as code, automation over manual work, and that every outage is a learning opportunity. I'm looking for a team where I can grow, contribute, and help build systems that are reliable at scale.",
    ],

    // ── TERMINAL INFO ──────────────────────────────────────
    terminal: {
        name: "Abhijay Chauhan",
        role: "DevOps Engineer & Cloud Engineer",
        location: "Lucknow, Uttar Pradesh, India",
        email: "abhijaychauhan.dev@gmail.com",
        education: "B.Tech in Computer Science",
        languages: ["Python", "C", "HTML5", "CSS3"],
        interests: ["Docker", "CI/CD", "Cloud Native & Containerization", "Observability"],
    },

    // ── SKILLS ─────────────────────────────────────────────
    //    color options: "accent" (teal) or "accent2" (amber)
    skills: [
        { name: "Docker & Containers", icon: "fab fa-docker", level: 85, color: "accent" },
        { name: "Kubernetes", icon: "fas fa-dharmachakra", level: 75, color: "accent" },
        { name: "CI/CD Pipelines", icon: "fas fa-code-branch", level: 80, color: "accent2" },
        { name: "AWS Cloud", icon: "fab fa-aws", level: 70, color: "accent2" },
        { name: "Terraform & IaC", icon: "fas fa-cubes", level: 72, color: "accent" },
        { name: "Linux Administration", icon: "fab fa-linux", level: 82, color: "accent2" },
        { name: "Python Scripting", icon: "fab fa-python", level: 85, color: "accent" },
        { name: "Git & GitHub", icon: "fab fa-github", level: 88, color: "accent2" },
        { name: "Monitoring & Logging", icon: "fas fa-chart-area", level: 68, color: "accent" },
    ],

    // ── EDUCATION ──────────────────────────────────────────
    education: [
        {
            degree: "Bachelor of Technology in Computer Science",
            institution: "Babu Banarasi Das University",
            year: "2023 — 2027",
            gpa: "8.5 / 10",
            highlights: [
                "Interested Subjects: Operating Systems, Computer Networks, Cloud Computing, DBMS",
                "Published a paper on container orchestration in College Paper Fest",
                "Led the college Cloud Computing Club",
            ],
        },
        {
            degree: "Higher Secondary (XII) — Science (PCM + CS)",
            institution: "St. Joseph Montessori School",
            year: "2021 — 2023",
            gpa: "7.2 / 10",
            highlights: [
                "Vice-Captain of the Cricket Team",
                "And more !"
            ],
        },
    ],

    // ── PROJECTS ───────────────────────────────────────────
    projects: [
        {
            title: "K8s Auto-Scaler",
            desc: "Custom Kubernetes HPA controller using Prometheus metrics for intelligent, predictive auto-scaling based on historical traffic patterns.",
            tags: ["Go", "Kubernetes", "Prometheus"],
            image: "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800&auto=format&fit=crop&q=80",
            link: "https://github.com/theAbhijayChauhan/k8s-autoscaler",
        },
        {
            title: "Terraform Module Library",
            desc: "Reusable Terraform modules for multi-region AWS setup — VPC, EKS, RDS, S3 — with CI-tested examples and documentation.",
            tags: ["Terraform", "AWS", "Python"],
            image: "https://images.unsplash.com/photo-1618401471353-b98aedd04e11?w=800&auto=format&fit=crop&q=80",
            link: "https://github.com/theAbhijayChauhan/terraform-aws-modules",
        },
        {
            title: "Slack Incident Bot",
            desc: "Node.js bot for automated incident management — creates channels, pages on-call, tracks resolution time, and generates postmortems.",
            tags: ["Node.js", "Slack API", "MongoDB"],
            image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80",
            link: "https://github.com/theAbhijayChauhan/slack-incident-bot",
        },
        {
            title: "GitOps Dashboard",
            desc: "Real-time React dashboard visualizing ArgoCD app states, sync status, deployment history, and rollback controls.",
            tags: ["React", "ArgoCD", "WebSocket"],
            image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80",
            link: "https://github.com/theAbhijayChauhan/gitops-dashboard",
        },
        {
            title: "Log Aggregation Pipeline",
            desc: "Lightweight ELK alternative using Fluentd, Kafka, and ClickHouse for cost-effective log aggregation and querying.",
            tags: ["Fluentd", "Kafka", "ClickHouse"],
            image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80",
            link: "https://github.com/theAbhijayChauhan/log-pipeline",
        },
        {
            title: "Infrastructure Monitoring Stack",
            desc: "Complete observability stack with Prometheus, Grafana, Alertmanager, and Loki — deployed via Helm with custom dashboards.",
            tags: ["Prometheus", "Grafana", "Helm"],
            image: "https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=800&auto=format&fit=crop&q=80",
            link: "https://github.com/theAbhijayChauhan/monitoring-stack",
        },
    ],

    // ── CERTIFICATIONS ─────────────────────────────────────
    certifications: [
        {
            name: "TCS iON Certified Communication Skills",
            issuer: "TCS iON",
            year: "2025",
            date: "Sep 2025",
            icon: "fas fa-comments",
            iconColor: "#0ea5e9",
            image: "assets/certifications/tcs_ion_communication.png",
            verificationId: "913006-29130727-1016",
            concepts: ["Communication", "Professional Communication", "Presentation Skills", "Workplace Communication"]
        },
        {
            name: "AWS Solutions & EC2",
            issuer: "Amazon Web Services",
            year: "2026",
            date: "Feb 2026",
            icon: "fab fa-aws",
            iconColor: "#ff9900",
            image: "assets/certifications/aws_solutions.png",
            verificationId: "AWS-SEC2-882910",
            concepts: ["Cloud Architecture", "Amazon EC2", "AWS VPC", "IAM Security", "Load Balancing"]
        },
        {
            name: "Certified Kubernetes Administrator",
            issuer: "CNCF",
            year: "2024",
            date: "Nov 2024",
            icon: "fas fa-dharmachakra",
            iconColor: "#326ce5",
            image: "assets/certifications/cka.png",
            verificationId: "CKA-44921-2024",
            concepts: ["Kubernetes", "Cluster Administration", "Pod Orchestration", "Troubleshooting", "Service Networking"]
        },
        {
            name: "HashiCorp Terraform Associate",
            issuer: "HashiCorp",
            year: "2023",
            date: "Jul 2023",
            icon: "fas fa-cubes",
            iconColor: "#7b42bc",
            image: "assets/certifications/terraform.png",
            verificationId: "TF-ASSOC-99102",
            concepts: ["Infrastructure as Code", "Terraform Cloud", "State Management", "Provider Configuration", "Modules"]
        },
        {
            name: "AWS Cloud Practitioner",
            issuer: "Amazon Web Services",
            year: "2023",
            date: "Mar 2023",
            icon: "fab fa-aws",
            iconColor: "#ff9900",
            image: "assets/certifications/aws_practitioner.png",
            verificationId: "AWS-CLF-338291",
            concepts: ["Cloud Economics", "AWS Core Services", "Security & Compliance", "Billing & Pricing", "Cloud Deployment"]
        },
        {
            name: "GitHub Actions Certification",
            issuer: "GitHub",
            year: "2024",
            date: "May 2024",
            icon: "fab fa-github",
            iconColor: "#e2e8f0",
            image: "assets/certifications/github_actions.png",
            verificationId: "GH-ACT-110294",
            concepts: ["CI/CD Pipelines", "GitHub Actions", "Workflows", "Runner Configuration", "Automated Testing"]
        },
    ],

    // ── ACHIEVEMENTS ───────────────────────────────────────
    achievements: [
        "Top 50 in Smart India Hackathon 2025",
        // "Open source contributor",
        "Won Best Infrastructure Project at college",
        "500+ GitHub contributions in the last year",
        "Active member of local DevOps Learning Community",
        // "Technical blog with 2000+ monthly readers on Dev.to",
    ],
};