// ══════════════════════════════════════════════════════════════════════════════
//  SEO & GOOGLE KNOWLEDGE GRAPH INJECTION ENGINE
//  Location: presence/seo.js
//  Automatically injects JSON-LD Structured Data (schema.org/Person & WebSite),
//  canonical links, and Google Knowledge Graph entity linking without cluttering index.html.
// ══════════════════════════════════════════════════════════════════════════════

(function initGooglePresenceSEO() {
    // 1. Target Data from CONFIG if available, with resilient fallbacks
    const name = (window.CONFIG && window.CONFIG.name) || 'Abhijay Chauhan';
    const title = (window.CONFIG && window.CONFIG.title) || 'DevOps Engineer & SRE';
    const email = (window.CONFIG && window.CONFIG.email) || 'abhijaychauhan.dev@gmail.com';
    const siteUrl = 'https://theabhijaychauhan.github.io/portfolio/';
    
    // Connected social and professional profiles (sameAs Entity Linking)
    const sameAsLinks = [
        'https://www.linkedin.com/in/abhijaychauhan',
        'https://github.com/theAbhijayChauhan',
        'https://dev.to/theabhijaychauhan',
        'https://instagram.com/theabhijaychauhan',
        'https://t.me/theabhijaychauhan'
    ];

    // 2. Build JSON-LD Structured Data (Person + WebSite)
    const structuredData = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "Person",
                "@id": `${siteUrl}#person`,
                "name": name,
                "alternateName": ["theAbhijay", "theAbhijayChauhan", "Abhijay"],
                "url": siteUrl,
                "image": `${siteUrl}assets/photo.jpg`,
                "jobTitle": title,
                "email": `mailto:${email}`,
                "address": {
                    "@type": "PostalAddress",
                    "addressLocality": "Lucknow",
                    "addressRegion": "Uttar Pradesh",
                    "addressCountry": "IN"
                },
                "sameAs": sameAsLinks,
                "knowsAbout": [
                    "DevOps",
                    "Site Reliability Engineering (SRE)",
                    "Kubernetes",
                    "Docker",
                    "CI/CD Pipelines",
                    "Terraform",
                    "AWS (Amazon Web Services)",
                    "Linux System Administration",
                    "Infrastructure as Code (IaC)",
                    "GitHub Actions",
                    "Prometheus & Grafana"
                ],
                "description": "Fresher with a hacker's mindset — automating everything, breaking nothing, and building reliable infrastructure that just works."
            },
            {
                "@type": "WebSite",
                "@id": `${siteUrl}#website`,
                "url": siteUrl,
                "name": `${name} — ${title} Portfolio`,
                "description": "Official interactive portfolio website of Abhijay Chauhan, showcasing DevOps projects, validated cloud certifications, and technical skillset.",
                "publisher": {
                    "@id": `${siteUrl}#person`
                }
            }
        ]
    };

    // 3. Inject JSON-LD Script tag into document <head>
    const jsonLdScript = document.createElement('script');
    jsonLdScript.type = 'application/ld+json';
    jsonLdScript.text = JSON.stringify(structuredData, null, 2);
    document.head.appendChild(jsonLdScript);

    // 4. Inject Meta Keywords & Author Tags if not already present
    function ensureMetaTag(nameOrProperty, value, isProperty = false) {
        const attr = isProperty ? `meta[property='${nameOrProperty}']` : `meta[name='${nameOrProperty}']`;
        if (!document.querySelector(attr)) {
            const meta = document.createElement('meta');
            if (isProperty) meta.setAttribute('property', nameOrProperty);
            else meta.setAttribute('name', nameOrProperty);
            meta.setAttribute('content', value);
            document.head.appendChild(meta);
        }
    }

    ensureMetaTag('author', name);
    ensureMetaTag('keywords', 'Abhijay Chauhan, theAbhijay, theAbhijayChauhan, Abhijay Chauhan DevOps, Abhijay Chauhan GitHub, Abhijay Chauhan LinkedIn, DevOps Engineer Lucknow, SRE Portfolio, Kubernetes, Cloud Engineer');
    ensureMetaTag('robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');

    // 5. Inject Canonical Link if missing
    if (!document.querySelector("link[rel='canonical']")) {
        const canonical = document.createElement('link');
        canonical.rel = 'canonical';
        canonical.href = siteUrl;
        document.head.appendChild(canonical);
    }
})();
