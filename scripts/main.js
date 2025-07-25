document.addEventListener('DOMContentLoaded', function() {
    initializeTheme();
    initializeSmoothScrolling();
    initializeScrollIndicator();
    initializeBackToTop();
    initializeRevealAnimations();
    initializeTypewriterEffect();
    initializeTechStackToggle();
    initializeStarField();
    initializeCardStars();
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
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            // Only prevent default and apply smooth scrolling for same-page anchor links
            if (targetId && targetId.startsWith('#') && !targetId.includes('index.html') && !targetId.includes('blogs.html')) {
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    e.preventDefault();
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = targetElement.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: Math.max(0, targetPosition),
                        behavior: 'smooth'
                    });
                }
            }
            
            // Close mobile menu for all navigation links
            if (window.closeMobileMenu) {
                window.closeMobileMenu();
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
                        top: Math.max(0, targetPosition),
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

function initializeScrollIndicator() {
    // Create the scroll indicator element
    const scrollIndicator = document.createElement('div');
    scrollIndicator.className = 'scroll-indicator';
    scrollIndicator.innerHTML = '<div class="scroll-progress"></div>';
    
    // Insert as the first child of body to ensure it's at the top
    document.body.insertBefore(scrollIndicator, document.body.firstChild);
    
    const scrollProgress = scrollIndicator.querySelector('.scroll-progress');
    
    function updateScrollIndicator() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const documentHeight = Math.max(
            document.body.scrollHeight,
            document.body.offsetHeight,
            document.documentElement.clientHeight,
            document.documentElement.scrollHeight,
            document.documentElement.offsetHeight
        );
        const windowHeight = window.innerHeight;
        const scrollableHeight = documentHeight - windowHeight;
        
        if (scrollableHeight <= 0) {
            scrollProgress.style.width = '0%';
            return;
        }
        
        const scrollPercent = (scrollTop / scrollableHeight) * 100;
        const clampedPercent = Math.min(100, Math.max(0, scrollPercent));
        
        scrollProgress.style.width = clampedPercent + '%';
        
        // Force visibility at all times
        scrollIndicator.style.opacity = '1';
        scrollIndicator.style.visibility = 'visible';
        scrollIndicator.style.display = 'block';
        scrollProgress.style.opacity = '1';
        scrollProgress.style.display = 'block';
    }
    
    // Force initial visibility
    scrollIndicator.style.opacity = '1';
    scrollIndicator.style.visibility = 'visible';
    scrollIndicator.style.display = 'block';
    scrollIndicator.style.zIndex = '1002';
    
    // Initial update
    setTimeout(updateScrollIndicator, 50);
    
    // Update on scroll
    window.addEventListener('scroll', updateScrollIndicator, { passive: true });
    
    // Update on resize
    window.addEventListener('resize', () => {
        setTimeout(updateScrollIndicator, 50);
    });
    
    // Update after page load
    window.addEventListener('load', updateScrollIndicator);
    
    // Ensure it stays visible and on top
    setInterval(() => {
        if (scrollIndicator.style.zIndex !== '1002') {
            scrollIndicator.style.zIndex = '1002';
        }
        if (scrollIndicator.style.opacity !== '1') {
            scrollIndicator.style.opacity = '1';
        }
        if (scrollIndicator.style.visibility !== 'visible') {
            scrollIndicator.style.visibility = 'visible';
        }
        if (scrollIndicator.style.display !== 'block') {
            scrollIndicator.style.display = 'block';
        }
    }, 1000);
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

function initializeStarField() {
    const heroStars = document.querySelector('.hero-stars');
    const numberOfStars = 60;
    
    for (let i = 0; i < numberOfStars; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        
        // Random position
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        
        // Random size (1-4px) with weighted distribution for smaller stars
        const sizeRandom = Math.random();
        let size;
        if (sizeRandom < 0.7) {
            size = Math.random() * 1.5 + 1; // 1-2.5px (70% chance)
        } else if (sizeRandom < 0.9) {
            size = Math.random() * 1 + 2.5; // 2.5-3.5px (20% chance)
        } else {
            size = Math.random() * 1 + 3.5; // 3.5-4.5px (10% chance)
        }
        
        // Random animation duration
        const twinkleDuration = Math.random() * 4 + 3; // 3-7 seconds
        const swayDuration = Math.random() * 8 + 8; // 8-16 seconds
        
        star.style.left = `${x}%`;
        star.style.top = `${y}%`;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.animationDuration = `${twinkleDuration}s, ${swayDuration}s`;
        
        // Random delay
        const delay = Math.random() * 6;
        star.style.animationDelay = `${delay}s`;
        
        heroStars.appendChild(star);
    }
    
    // Add some shooting stars occasionally
    setInterval(() => {
        if (Math.random() < 0.3) { // 30% chance every 8 seconds
            createShootingStar();
        }
    }, 8000);
}

function createShootingStar() {
    const heroStars = document.querySelector('.hero-stars');
    const shootingStar = document.createElement('div');
    shootingStar.className = 'shooting-star';
    
    // Random starting position (from top or left edge)
    const startFromTop = Math.random() < 0.5;
    if (startFromTop) {
        shootingStar.style.left = Math.random() * 100 + '%';
        shootingStar.style.top = '0%';
    } else {
        shootingStar.style.left = '0%';
        shootingStar.style.top = Math.random() * 100 + '%';
    }
    
    heroStars.appendChild(shootingStar);
    
    // Remove after animation
    setTimeout(() => {
        if (shootingStar.parentNode) {
            shootingStar.parentNode.removeChild(shootingStar);
        }
    }, 2000);
}

function initializeCardStars() {
    const cards = document.querySelectorAll('.tech-item, .tech-item.highlighted, .experience-card, .project-card');
    
    cards.forEach(card => {
        // Create stars container
        const starsContainer = document.createElement('div');
        starsContainer.className = 'card-stars';
        
        // Add 10-15 small stars per card
        const numberOfStars = Math.floor(Math.random() * 6) + 10;
        
        for (let i = 0; i < numberOfStars; i++) {
            const star = document.createElement('div');
            star.className = 'card-star';
            
            // Random position
            const x = Math.random() * 100;
            const y = Math.random() * 100;
            
            // Slightly larger size (1-2.5px)
            const size = Math.random() * 1.5 + 1;
            
            // Random animation duration
            const duration = Math.random() * 2 + 2; // 2-4 seconds
            
            star.style.left = `${x}%`;
            star.style.top = `${y}%`;
            star.style.width = `${size}px`;
            star.style.height = `${size}px`;
            star.style.animationDuration = `${duration}s`;
            
            // Random delay
            const delay = Math.random() * 3;
            star.style.animationDelay = `${delay}s`;
            
            starsContainer.appendChild(star);
        }
        
        card.appendChild(starsContainer);
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
    // Handle any resize-specific functionality if needed in the future
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