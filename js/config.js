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
        projects: false,       // Featured Projects Grid (true = show, false = hide)
        education: true,      // Academic Background & Timeline (true = show, false = hide)
        certifications: false, // Validated Certifications (true = show, false = hide)
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
        instagramBanner: true, // Glowing Instagram banner next to header logo (true = show, false = hide)
    },

    // ── SYSTEM BOOT LOG TEXTS & DURATION ────────────────────
    // bootDuration: Total duration in milliseconds (3500 = 3.5 seconds)
    bootDuration: 3500,
    // Edit/Add text lines below to customize the bootup text on page load/refresh
    bootLogs: [
        "[INIT] Mounting Antigravity Infrastructure v2.0...",
        "[OK] Initializing SRE Neural Network...",
        "[OK] Security Protocols & Certificates Verified",
        "[READY] System Operational — Welcome Abhijay Chauhan"
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
    title: "DevOps Engineer & SRE",
    tagline: "Fresher with a professional mindset — automating everything, breaking nothing, and building infrastructure that just works.",
    email: "abhijay@example.com",
    phone: "+91 XXXXX XXXXX",
    location: "Lucknow, India",
    available: true,                         // true = shows "Open to opportunities" badge
    instagramLink: "https://instagram.com/YOUR_INSTAGRAM_HANDLE",
    instagramHandle: "@abhijay.chauhan",      // Clickable text next to glowing Insta logo

    // ── CONTACT FORM EMAIL DELIVERY ─────────────────────────
    // Create a free form at https://formspree.io and paste your Endpoint URL below
    // Example: "https://formspree.io/f/xayzvqwl"
    formspreeEndpoint: "https://formspree.io/f/YOUR_FORMSPREE_ID",

    // ── BACKWARDS-COMPATIBLE FALLBACKS (automatically linked to assets above)
    resumeLink: "assets/resume.pdf",
    photo: "assets/photo.jpg",

    // ── SOCIAL LINKS ───────────────────────────────────────
    //    Set any URL to "" to hide that social icon
    links: {
        linkedin: "www.linkedin.com/in/abhijaychauhan",
        github:   "https://github.com/theWitcher00",
        twitter:  "https://twitter.com/YOUR_HANDLE",
        medium:   "https://medium.com/@YOUR_HANDLE",
        devto:    "https://dev.to/YOUR_HANDLE",
        youtube:  "",                        // leave empty to hide
    },

    // ── HERO TYPING STRINGS ────────────────────────────────
    typingStrings: [
        "DevOps Engineer",
        "Site Reliability Engineer",
        "Cloud Enthusiast",
        "Automation Builder",
        "Linux Tinkerer",
        "Kubernetes Explorer",
    ],

    // ── STATS ──────────────────────────────────────────────
    stats: [
        { value: 3,  suffix: "+", label: "Projects Built" },
        { value: 8,   suffix: "+",  label: "Certifications" },
        { value: 10,  suffix: "+", label: "Technologies" },
        { value: 500, suffix: "+", label: "GitHub Commits" },
    ],

    // ── ABOUT ──────────────────────────────────────────────
    about: [
        "I'm a recent graduate passionate about DevOps, Site Reliability Engineering, and cloud-native technologies. While I may be a fresher by title, I've spent the last year building real infrastructure projects, earning industry certifications, and contributing to open source — because the best way to learn production systems is to build them.",
        "I believe in infrastructure as code, automation over manual work, and that every outage is a learning opportunity. I'm looking for a team where I can grow, contribute, and help build systems that are reliable at scale.",
    ],

    // ── TERMINAL INFO ──────────────────────────────────────
    terminal: {
        name: "Abhijay Chauhan",
        role: "DevOps Engineer & SRE",
        location: "Lucknow, Uttar Pradesh, India",
        email: "abhijaychauhan98@gmail.com",
        education: "B.Tech in Computer Science",
        languages: ["Python", "Git", "Shell", "Docker"],
        interests: ["Kubernetes", "CI/CD", "Cloud Native", "Observability"],
    },

    // ── SKILLS ─────────────────────────────────────────────
    //    color options: "accent" (teal) or "accent2" (amber)
    skills: [
        { name: "Docker & Containers",    icon: "fab fa-docker",         level: 85, color: "accent"  },
        { name: "Kubernetes",             icon: "fas fa-dharmachakra",   level: 75, color: "accent"  },
        { name: "CI/CD Pipelines",        icon: "fas fa-code-branch",    level: 80, color: "accent2" },
        { name: "AWS Cloud",              icon: "fab fa-aws",            level: 70, color: "accent2" },
        { name: "Terraform & IaC",        icon: "fas fa-cubes",          level: 72, color: "accent"  },
        { name: "Linux Administration",   icon: "fab fa-linux",          level: 82, color: "accent2" },
        { name: "Python Scripting",       icon: "fab fa-python",         level: 85, color: "accent"  },
        { name: "Git & GitHub",           icon: "fab fa-github",         level: 88, color: "accent2" },
        { name: "Monitoring & Logging",   icon: "fas fa-chart-area",     level: 68, color: "accent"  },
    ],

    // ── EDUCATION ──────────────────────────────────────────
    education: [
        {
            degree: "Bachelor of Technology in Computer Science",
            institution: "Babu Banarasi Das University",
            year: "2023 — 2027",
            gpa: "8.5 / 10",
            highlights: [
                "Relevant coursework: Operating Systems, Computer Networks, Cloud Computing, DBMS",
                "Published a paper on container orchestration in XYZ Journal",
                "Led the college Cloud Computing Club",
            ],
        },
        {
            degree: "Higher Secondary (XII) — Science (PCM + CS)",
            institution: "St. Joseph Montessori School",
            year: "2021 — 2023",
            gpa: "82%",
            highlights: [],
        },
    ],

    // ── PROJECTS ───────────────────────────────────────────
    projects: [
        {
            title: "K8s Auto-Scaler",
            desc: "Custom Kubernetes HPA controller using Prometheus metrics for intelligent, predictive auto-scaling based on historical traffic patterns.",
            tags: ["Go", "Kubernetes", "Prometheus"],
            image: "assets/projects/1.jpg",
            link: "https://github.com/YOUR_HANDLE/project1",
        },
        {
            title: "Terraform Module Library",
            desc: "Reusable Terraform modules for multi-region AWS setup — VPC, EKS, RDS, S3 — with CI-tested examples and documentation.",
            tags: ["Terraform", "AWS", "Python"],
            image: "assets/projects/2.jpg",
            link: "https://github.com/YOUR_HANDLE/project2",
        },
        {
            title: "Slack Incident Bot",
            desc: "Node.js bot for automated incident management — creates channels, pages on-call, tracks resolution time, and generates postmortems.",
            tags: ["Node.js", "Slack API", "MongoDB"],
            image: "assets/projects/3.jpg",
            link: "https://github.com/YOUR_HANDLE/project3",
        },
        {
            title: "GitOps Dashboard",
            desc: "Real-time React dashboard visualizing ArgoCD app states, sync status, deployment history, and rollback controls.",
            tags: ["React", "ArgoCD", "WebSocket"],
            image: "assets/projects/4.jpg",
            link: "https://github.com/YOUR_HANDLE/project4",
        },
        {
            title: "Log Aggregation Pipeline",
            desc: "Lightweight ELK alternative using Fluentd, Kafka, and ClickHouse for cost-effective log aggregation and querying.",
            tags: ["Fluentd", "Kafka", "ClickHouse"],
            image: "assets/projects/5.jpg",
            link: "https://github.com/YOUR_HANDLE/project5",
        },
        {
            title: "Infrastructure Monitoring Stack",
            desc: "Complete observability stack with Prometheus, Grafana, Alertmanager, and Loki — deployed via Helm with custom dashboards.",
            tags: ["Prometheus", "Grafana", "Helm"],
            image: "assets/projects/6.jpg",
            link: "https://github.com/YOUR_HANDLE/project6",
        },
    ],

    // ── CERTIFICATIONS ─────────────────────────────────────
    certifications: [
        { name: "AWS Solutions & EC2", issuer: "Amazon Web Services", year: "2026", icon: "fab fa-aws",          iconColor: "#ff9900" },
        { name: "Certified Kubernetes Administrator", issuer: "CNCF",                year: "2024", icon: "fas fa-dharmachakra", iconColor: "#326ce5" },
        { name: "HashiCorp Terraform Associate",     issuer: "HashiCorp",            year: "2023", icon: "fas fa-cubes",        iconColor: "#7b42bc" },
        { name: "AWS Cloud Practitioner",             issuer: "Amazon Web Services", year: "2023", icon: "fab fa-aws",          iconColor: "#ff9900" },
        { name: "GitHub Actions Certification",       issuer: "GitHub",               year: "2024", icon: "fab fa-github",       iconColor: "#e2e8f0" },
        { name: "Linux Foundation SysAdmin",          issuer: "Linux Foundation",     year: "2023", icon: "fab fa-linux",        iconColor: "#fcc624" },
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