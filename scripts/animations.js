document.addEventListener('DOMContentLoaded', function() {
    initializeParallaxEffects();
    initializeHoverAnimations();
    initializeCursorFollower();
    initializeScrollAnimations();
    initializeLoadingAnimations();
    initializeTextAnimations();
});

function initializeParallaxEffects() {
    const heroElement = document.querySelector('.hero');
    const aboutElement = document.querySelector('.about');
    
    if (window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            
            // Apply parallax only to hero section to prevent overlap
            if (heroElement) {
                const rate = scrolled * -0.3;
                heroElement.style.transform = `translateY(${rate}px)`;
            }
            
            // Remove parallax from about section to prevent overlap
            if (aboutElement) {
                aboutElement.style.transform = 'translateY(0)';
            }
        });
    }
}

function initializeHoverAnimations() {
    const projectCards = document.querySelectorAll('.project-card');
    const techItems = document.querySelectorAll('.tech-item');
    const contactLinks = document.querySelectorAll('.contact-link');
    
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-12px) scale(1.02)';
            this.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.15)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '';
        });
    });
    
    techItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            const icon = this.querySelector('.tech-icon');
            if (icon) {
                icon.style.transform = 'scale(1.3) rotate(10deg)';
            }
        });
        
        item.addEventListener('mouseleave', function() {
            const icon = this.querySelector('.tech-icon');
            if (icon) {
                icon.style.transform = 'scale(1) rotate(0deg)';
            }
        });
    });
    
    contactLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            const icon = this.querySelector('.contact-icon');
            if (icon) {
                icon.style.transform = 'scale(1.2) rotate(15deg)';
            }
        });
        
        link.addEventListener('mouseleave', function() {
            const icon = this.querySelector('.contact-icon');
            if (icon) {
                icon.style.transform = 'scale(1) rotate(0deg)';
            }
        });
    });
}

function initializeCursorFollower() {
    if (window.innerWidth > 768 && !('ontouchstart' in window)) {
        const cursor = document.createElement('div');
        cursor.className = 'cursor-follower';
        cursor.style.cssText = `
            position: fixed;
            width: 20px;
            height: 20px;
            background: rgba(37, 99, 235, 0.3);
            border-radius: 50%;
            pointer-events: none;
            z-index: 10000;
            transform: translate(-50%, -50%);
            transition: all 0.1s ease;
        `;
        document.body.appendChild(cursor);
        
        let mouseX = 0;
        let mouseY = 0;
        let cursorX = 0;
        let cursorY = 0;
        
        document.addEventListener('mousemove', function(e) {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });
        
        function animateCursor() {
            cursorX += (mouseX - cursorX) * 0.1;
            cursorY += (mouseY - cursorY) * 0.1;
            
            cursor.style.left = cursorX + 'px';
            cursor.style.top = cursorY + 'px';
            
            requestAnimationFrame(animateCursor);
        }
        
        animateCursor();
        
        const interactiveElements = document.querySelectorAll('a, button, .project-card, .tech-item');
        interactiveElements.forEach(element => {
            element.addEventListener('mouseenter', function() {
                cursor.style.width = '40px';
                cursor.style.height = '40px';
                cursor.style.backgroundColor = 'rgba(37, 99, 235, 0.5)';
            });
            
            element.addEventListener('mouseleave', function() {
                cursor.style.width = '20px';
                cursor.style.height = '20px';
                cursor.style.backgroundColor = 'rgba(37, 99, 235, 0.3)';
            });
        });
    }
}

function initializeScrollAnimations() {
    const animationObserver = new IntersectionObserver(
        function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                    
                    if (entry.target.classList.contains('tech-item')) {
                        const delay = Array.from(entry.target.parentElement.children).indexOf(entry.target) * 100;
                        entry.target.style.animationDelay = delay + 'ms';
                    }
                    
                    if (entry.target.classList.contains('project-card')) {
                        const delay = Array.from(entry.target.parentElement.children).indexOf(entry.target) * 200;
                        entry.target.style.animationDelay = delay + 'ms';
                    }
                }
            });
        },
        { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );
    
    const animatedElements = document.querySelectorAll('.tech-item, .project-card, .about-content, .contact-links');
    animatedElements.forEach(element => {
        element.classList.add('fade-in-up');
        animationObserver.observe(element);
    });
}

function initializeLoadingAnimations() {
    const style = document.createElement('style');
    style.textContent = `
        .fade-in-up {
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.8s ease-out;
        }
        
        .fade-in-up.animate {
            opacity: 1;
            transform: translateY(0);
        }
        
        .bounce-in {
            animation: bounceIn 0.6s ease-out;
        }
        
        @keyframes bounceIn {
            0% { transform: scale(0.3); opacity: 0; }
            50% { transform: scale(1.05); opacity: 1; }
            70% { transform: scale(0.9); }
            100% { transform: scale(1); opacity: 1; }
        }
        
        .slide-in-left {
            animation: slideInLeft 0.8s ease-out;
        }
        
        @keyframes slideInLeft {
            0% { transform: translateX(-100px); opacity: 0; }
            100% { transform: translateX(0); opacity: 1; }
        }
        
        .slide-in-right {
            animation: slideInRight 0.8s ease-out;
        }
        
        @keyframes slideInRight {
            0% { transform: translateX(100px); opacity: 0; }
            100% { transform: translateX(0); opacity: 1; }
        }
        
        .zoom-in {
            animation: zoomIn 0.6s ease-out;
        }
        
        @keyframes zoomIn {
            0% { transform: scale(0); opacity: 0; }
            100% { transform: scale(1); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
    
    window.addEventListener('load', function() {
        const heroContent = document.querySelector('.hero-content');
        if (heroContent) {
            heroContent.classList.add('slide-in-left');
        }
        
        const avatar = document.querySelector('.avatar-container');
        if (avatar) {
            avatar.classList.add('zoom-in');
        }
    });
}

function initializeTextAnimations() {
    function animateCounter(element, target, duration = 2000) {
        let start = 0;
        const startTime = performance.now();
        
        function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const current = Math.floor(start + (target - start) * easeOutQuart);
            
            element.textContent = current + (element.textContent.includes('+') ? '+' : '');
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target + (element.textContent.includes('+') ? '+' : '');
            }
        }
        
        requestAnimationFrame(updateCounter);
    }
    
    const counterObserver = new IntersectionObserver(
        function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const statNumber = entry.target.querySelector('.stat-number');
                    if (statNumber && !statNumber.classList.contains('animated')) {
                        statNumber.classList.add('animated');
                        const text = statNumber.textContent;
                        const number = parseInt(text.replace(/\D/g, ''));
                        if (number) {
                            animateCounter(statNumber, number);
                        }
                    }
                }
            });
        },
        { threshold: 0.5 }
    );
    
    const statItems = document.querySelectorAll('.stat-item');
    statItems.forEach(item => {
        counterObserver.observe(item);
    });
}

function createFloatingElements() {
    const floatingContainer = document.createElement('div');
    floatingContainer.className = 'floating-elements';
    floatingContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: -1;
        overflow: hidden;
    `;
    
    for (let i = 0; i < 5; i++) {
        const element = document.createElement('div');
        element.className = 'floating-element';
        element.style.cssText = `
            position: absolute;
            width: ${Math.random() * 20 + 10}px;
            height: ${Math.random() * 20 + 10}px;
            background: rgba(37, 99, 235, 0.1);
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: float ${Math.random() * 3 + 2}s ease-in-out infinite;
            animation-delay: ${Math.random() * 2}s;
        `;
        floatingContainer.appendChild(element);
    }
    
    document.body.appendChild(floatingContainer);
    
    const floatingStyle = document.createElement('style');
    floatingStyle.textContent = `
        @keyframes float {
            0%, 100% {
                transform: translateY(0px) rotate(0deg);
            }
            50% {
                transform: translateY(-20px) rotate(180deg);
            }
        }
    `;
    document.head.appendChild(floatingStyle);
}

function initializePageTransitions() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                document.body.style.opacity = '0.8';
                document.body.style.transform = 'scale(0.98)';
                
                setTimeout(() => {
                    target.scrollIntoView({ behavior: 'smooth' });
                    
                    setTimeout(() => {
                        document.body.style.opacity = '1';
                        document.body.style.transform = 'scale(1)';
                    }, 300);
                }, 150);
            }
        });
    });
}

function initializeMouseTrail() {
    if (window.innerWidth > 768 && !('ontouchstart' in window)) {
        const trail = [];
        const trailLength = 10;
        
        for (let i = 0; i < trailLength; i++) {
            const dot = document.createElement('div');
            dot.className = 'trail-dot';
            dot.style.cssText = `
                position: fixed;
                width: 4px;
                height: 4px;
                background: rgba(37, 99, 235, ${1 - i / trailLength});
                border-radius: 50%;
                pointer-events: none;
                z-index: 10000;
                transform: translate(-50%, -50%);
                transition: all 0.1s ease;
            `;
            document.body.appendChild(dot);
            trail.push(dot);
        }
        
        let mouseX = 0;
        let mouseY = 0;
        let positions = [];
        
        document.addEventListener('mousemove', function(e) {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            positions.unshift({ x: mouseX, y: mouseY });
            if (positions.length > trailLength) {
                positions.pop();
            }
            
            trail.forEach((dot, index) => {
                if (positions[index]) {
                    dot.style.left = positions[index].x + 'px';
                    dot.style.top = positions[index].y + 'px';
                }
            });
        });
    }
}

if (window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
    window.addEventListener('load', function() {
        createFloatingElements();
        initializePageTransitions();
        initializeMouseTrail();
    });
}

function addRippleEffect() {
    const buttons = document.querySelectorAll('.btn, .contact-link');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const ripple = document.createElement('div');
            ripple.style.cssText = `
                position: absolute;
                width: 4px;
                height: 4px;
                background: rgba(255, 255, 255, 0.6);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s linear;
                left: ${x}px;
                top: ${y}px;
                pointer-events: none;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    const rippleStyle = document.createElement('style');
    rippleStyle.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(rippleStyle);
}

window.addEventListener('load', addRippleEffect);