const Animations = {
    initReveals: function() {
        const reveals = document.querySelectorAll('.reveal, .timeline-item');
        if (reveals.length === 0) return;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('vis');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            root: null,
            rootMargin: '0px 0px -50px 0px',
            threshold: 0
        });
        
        reveals.forEach(reveal => observer.observe(reveal));
    },
    
    initCounters: function() {
        const counters = document.querySelectorAll('.stat-number');
        if (counters.length === 0) return;
        
        const animateCounters = () => {
            counters.forEach(counter => {
                const target = +counter.getAttribute('data-target');
                const suffix = counter.getAttribute('data-suffix') || '';
                const c = +counter.innerText.replace(suffix, '');
                const increment = target / 200;
                
                if (c < target) {
                    counter.innerText = `${Math.ceil(c + increment)}${suffix}`;
                    setTimeout(() => animateCounters(), 10);
                } else {
                    counter.innerText = `${target}${suffix}`;
                }
            });
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    observer.unobserve(entry.target);
                }
            });
        });
        
        const section = document.getElementById('statsSection');
        if (section) observer.observe(section);
    },
    
    initProgressBars: function() {
        const fills = document.querySelectorAll('.progress-fill');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if(entry.isIntersecting) {
                    const width = entry.target.getAttribute('data-width');
                    if (width) {
                        entry.target.style.width = width + '%';
                    }
                    observer.unobserve(entry.target);
                }
            });
        });
        fills.forEach(fill => observer.observe(fill));
    },
    
    initTyping: function(strings) {
        const el = document.getElementById('typingText');
        if (!el || !strings || !strings.length) return;
        let stringIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        
        const type = () => {
            const currentString = strings[stringIndex];
            if (isDeleting) {
                el.innerText = currentString.substring(0, charIndex - 1);
                charIndex--;
            } else {
                el.innerText = currentString.substring(0, charIndex + 1);
                charIndex++;
            }
            
            let typingSpeed = isDeleting ? 50 : 100;
            
            if (!isDeleting && charIndex === currentString.length) {
                typingSpeed = 2000;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                stringIndex = (stringIndex + 1) % strings.length;
                typingSpeed = 500;
            }
            
            setTimeout(type, typingSpeed);
        };
        setTimeout(type, 1000);
    },
    
    initTerminal: function() {
        const lines = document.querySelectorAll('.t-line');
        if (lines.length === 0) return;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    lines.forEach((line, index) => {
                        setTimeout(() => {
                            line.classList.add('vis');
                        }, index * 200);
                    });
                    observer.unobserve(entry.target);
                }
            });
        });
        
        const term = document.getElementById('terminalBody');
        if (term) observer.observe(term);
    },
    
    initTilt: function() {
        // Disable tilt on mobile/touch devices to save performance and prevent jitter
        const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
        if (isTouchDevice) return;

        // Simple tilt effect for cards
        const cards = document.querySelectorAll('.skill-card, .project-card, .cert-card');
        cards.forEach(card => {
            card.addEventListener('mousemove', e => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = ((y - centerY) / centerY) * -10;
                const rotateY = ((x - centerX) / centerX) * 10;
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
                setTimeout(() => {
                    card.style.transition = '';
                }, 300);
            });
            
            card.addEventListener('mouseenter', () => {
                card.style.transition = 'transform 0.1s ease';
            });
        });
    }
};