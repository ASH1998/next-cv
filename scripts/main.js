document.addEventListener('DOMContentLoaded', function() {
    initializeTheme();
    initializeSmoothScrolling();
    initializeScrollIndicator();
    initializeBackToTop();
    initializeRevealAnimations();
    initializeMobileMenu();
    initializeTypewriterEffect();
    initializeTechStackToggle();
});

function initializeTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle.querySelector('.theme-icon');
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
        updateThemeIcon(savedTheme);
    } else {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const theme = prefersDark ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', theme);
        updateThemeIcon(theme);
    }
    
    themeToggle.addEventListener('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
        
        themeToggle.style.transform = 'rotate(360deg)';
        setTimeout(() => {
            themeToggle.style.transform = '';
        }, 300);
    });
    
    function updateThemeIcon(theme) {
        themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
    }
}

function initializeSmoothScrolling() {
    const navLinks = document.querySelectorAll('.nav-link, .mobile-menu-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                closeMobileMenu();
            }
        });
    });
    
    const ctaButtons = document.querySelectorAll('.hero-cta .btn');
    ctaButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const targetElement = document.querySelector(href);
                if (targetElement) {
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = targetElement.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

function initializeScrollIndicator() {
    const scrollIndicator = document.createElement('div');
    scrollIndicator.className = 'scroll-indicator';
    scrollIndicator.innerHTML = '<div class="scroll-progress"></div>';
    document.body.appendChild(scrollIndicator);
    
    const scrollProgress = scrollIndicator.querySelector('.scroll-progress');
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / scrollHeight) * 100;
        
        scrollProgress.style.width = scrollPercent + '%';
    });
}

function initializeBackToTop() {
    const backToTop = document.createElement('button');
    backToTop.className = 'back-to-top';
    backToTop.innerHTML = '↑';
    backToTop.setAttribute('aria-label', 'Back to top');
    document.body.appendChild(backToTop);
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });
    
    backToTop.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

function initializeRevealAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);
    
    const revealElements = document.querySelectorAll('.section-title, .project-card, .tech-item, .about-content, .contact-links');
    revealElements.forEach(element => {
        element.classList.add('reveal');
        observer.observe(element);
    });
    
    const staggerElements = document.querySelectorAll('.tech-item, .project-card');
    staggerElements.forEach((element, index) => {
        element.style.animationDelay = `${index * 0.1}s`;
    });
}

function initializeMobileMenu() {
    const mobileMenuToggle = document.createElement('button');
    mobileMenuToggle.className = 'mobile-menu-toggle';
    mobileMenuToggle.innerHTML = '☰';
    mobileMenuToggle.setAttribute('aria-label', 'Toggle mobile menu');
    
    const nav = document.querySelector('.nav');
    nav.appendChild(mobileMenuToggle);
    
    const mobileMenu = document.createElement('div');
    mobileMenu.className = 'mobile-menu';
    mobileMenu.innerHTML = `
        <button class="mobile-menu-close" aria-label="Close mobile menu">×</button>
        <ul class="mobile-menu-links">
            <li><a href="#about" class="mobile-menu-link">About</a></li>
            <li><a href="#projects" class="mobile-menu-link">Projects</a></li>
            <li><a href="#contact" class="mobile-menu-link">Contact</a></li>
        </ul>
    `;
    document.body.appendChild(mobileMenu);
    
    const mobileMenuClose = mobileMenu.querySelector('.mobile-menu-close');
    
    mobileMenuToggle.addEventListener('click', function() {
        mobileMenu.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
    
    mobileMenuClose.addEventListener('click', closeMobileMenu);
    
    mobileMenu.addEventListener('click', function(e) {
        if (e.target === mobileMenu) {
            closeMobileMenu();
        }
    });
    
    function closeMobileMenu() {
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    window.closeMobileMenu = closeMobileMenu;
}

function initializeTypewriterEffect() {
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const text = heroTitle.textContent;
        const highlight = heroTitle.querySelector('.highlight');
        
        if (highlight) {
            const beforeText = text.split(highlight.textContent)[0];
            const afterText = text.split(highlight.textContent)[1];
            
            heroTitle.innerHTML = `${beforeText}<span class="highlight typing-effect">${highlight.textContent}</span>${afterText}`;
            
            setTimeout(() => {
                const typingElement = heroTitle.querySelector('.typing-effect');
                if (typingElement) {
                    typingElement.classList.remove('typing-effect');
                }
            }, 3000);
        }
    }
}

function initializeTechStackToggle() {
    const techToggle = document.getElementById('tech-toggle');
    const techToggleText = document.getElementById('tech-toggle-text');
    const techFullStack = document.getElementById('tech-full-stack');
    const toggleIcon = techToggle.querySelector('.toggle-icon');
    
    let isExpanded = false;
    
    techToggle.addEventListener('click', function() {
        if (isExpanded) {
            // Hide full stack
            techFullStack.classList.remove('show');
            techFullStack.classList.add('hide');
            
            setTimeout(() => {
                techFullStack.style.display = 'none';
                techFullStack.classList.remove('hide');
            }, 300);
            
            techToggleText.textContent = 'Show More';
            techToggle.classList.remove('expanded');
            isExpanded = false;
        } else {
            // Show full stack
            techFullStack.style.display = 'grid';
            setTimeout(() => {
                techFullStack.classList.add('show');
            }, 10);
            
            techToggleText.textContent = 'Show Less';
            techToggle.classList.add('expanded');
            isExpanded = true;
            
            // Smooth scroll to show the expanded content
            setTimeout(() => {
                techFullStack.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'start' 
                });
            }, 200);
        }
    });
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

window.addEventListener('resize', debounce(function() {
    const mobileMenu = document.querySelector('.mobile-menu');
    if (mobileMenu && window.innerWidth > 768) {
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
    }
}, 250));

function preloadImages() {
    const images = [
        'assets/images/avatar.jpg',
        'assets/images/project1.jpg',
        'assets/images/project2.jpg',
        'assets/images/project3.jpg'
    ];
    
    images.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

window.addEventListener('load', preloadImages);

function addAccessibilityFeatures() {
    const focusableElements = document.querySelectorAll('a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])');
    
    focusableElements.forEach(element => {
        element.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                if (element.tagName === 'A' || element.tagName === 'BUTTON') {
                    element.click();
                }
            }
        });
    });
}

window.addEventListener('DOMContentLoaded', addAccessibilityFeatures);

function handleReducedMotion() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
        document.documentElement.style.setProperty('--transition-fast', '0.01ms');
        document.documentElement.style.setProperty('--transition-normal', '0.01ms');
        document.documentElement.style.setProperty('--transition-slow', '0.01ms');
    }
}

window.addEventListener('DOMContentLoaded', handleReducedMotion);