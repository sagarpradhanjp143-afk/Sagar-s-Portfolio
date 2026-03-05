/**
 * Sagar Pradhan - Portfolio Website JavaScript
 * Main animation and interaction logic
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initPreloader();
    initSmoothScrolling();
    initNavigation();
    initScrollAnimations();
    initSkillBars();
    initContactForm();
    initCursorEffect();
    initScrollProgress();
    initHamburgerMenu();
    initializeSkillProgress();
});

/**
 * 1. Preloader Animation
 * Shows loading screen until page is fully loaded
 */
function initPreloader() {
    const preloader = document.querySelector('.preloader');
    
    if (preloader) {
        // Hide preloader after 2 seconds or when page loads
        window.addEventListener('load', () => {
            setTimeout(() => {
                preloader.style.opacity = '0';
                setTimeout(() => {
                    preloader.style.display = 'none';
                }, 500);
            }, 1000);
        });
    }
}

/**
 * 2. Smooth Scrolling Navigation
 * Smooth scroll to sections and update active nav links
 */
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');
    
    // Smooth scroll for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                // Calculate offset for fixed header
                const headerHeight = document.querySelector('.header').offsetHeight;
                const sectionTop = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: sectionTop,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                closeMobileMenu();
            }
        });
    });
    
    // Update active navigation based on scroll position
    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                // Remove active class from all links
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });
}

/**
 * 3. Navigation Header Effects
 * Change navbar background on scroll and handle mobile menu
 */
function initNavigation() {
    const header = document.querySelector('.header');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    
    // Change header background on scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // Mobile hamburger menu toggle
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Close menu when clicking on a link
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                closeMobileMenu();
            });
        });
    }
}

/**
 * 4. GSAP Scroll Animations
 * Animate elements as they enter viewport
 */
function initScrollAnimations() {
    // Check if GSAP is loaded
    if (typeof gsap === 'undefined') {
        console.warn('GSAP not loaded, animations disabled');
        return;
    }
    
    // Hero section animations
    gsap.from('.hero-title', {
        opacity: 0,
        y: 50,
        duration: 1,
        delay: 0.5,
        ease: 'power3.out'
    });
    
    gsap.from('.hero-subtitle', {
        opacity: 0,
        y: 30,
        duration: 1,
        delay: 0.8,
        ease: 'power3.out'
    });
    
    gsap.from('.hero-buttons', {
        opacity: 0,
        y: 30,
        duration: 1,
        delay: 1.1,
        ease: 'power3.out'
    });
    
    gsap.from('.scroll-indicator', {
        opacity: 0,
        y: 20,
        duration: 1,
        delay: 1.4,
        ease: 'power3.out'
    });
    
    // Scroll-triggered animations for sections
    const sections = document.querySelectorAll('.section');
    
    sections.forEach(section => {
        const elements = section.querySelectorAll('.skill-card, .achievement-card, .interest-card, .project-card, .timeline-content, .contact-item');
        
        elements.forEach((element, index) => {
            gsap.from(element, {
                opacity: 0,
                y: 50,
                duration: 0.8,
                delay: index * 0.1,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: element,
                    start: 'top 80%',
                    toggleActions: 'play none none reverse'
                }
            });
        });
    });
    
    // Floating animation for skill cards
    const skillCards = document.querySelectorAll('.skill-card');
    skillCards.forEach(card => {
        gsap.to(card, {
            y: -10,
            duration: 2,
            ease: 'power1.inOut',
            yoyo: true,
            repeat: -1,
            delay: Math.random() * 2
        });
    });
}

/**
 * 5. Skill Bars Animation
 * Animate skill progress bars when they enter viewport
 */
function initSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    
    if (skillBars.length === 0) return;
    
    // Use Intersection Observer for better performance
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBar = entry.target;
                const width = progressBar.getAttribute('data-width');
                
                // Animate width from 0 to target width
                let currentWidth = 0;
                const targetWidth = parseInt(width);
                const increment = targetWidth / 50; // Animation speed
                
                const animate = () => {
                    if (currentWidth < targetWidth) {
                        currentWidth += increment;
                        progressBar.style.width = currentWidth + '%';
                        requestAnimationFrame(animate);
                    } else {
                        progressBar.style.width = width;
                    }
                };
                
                animate();
                observer.unobserve(progressBar);
            }
        });
    }, {
        threshold: 0.5
    });
    
    skillBars.forEach(bar => observer.observe(bar));
}

/**
 * 6. Contact Form Validation
 * Validate and handle form submission
 */
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const subject = document.getElementById('subject').value.trim();
        const message = document.getElementById('message').value.trim();
        
        // Basic validation
        if (!name || !email || !subject || !message) {
            showMessage('Please fill in all fields.', 'error');
            return;
        }
        
        if (!isValidEmail(email)) {
            showMessage('Please enter a valid email address.', 'error');
            return;
        }
        
        // Simulate form submission
        showMessage('Message sent successfully!', 'success');
        form.reset();
    });
    
    // Email validation helper
    function isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    // Show message function
    function showMessage(message, type) {
        // Remove existing messages
        const existingMessage = document.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // Create message element
        const messageDiv = document.createElement('div');
        messageDiv.className = `form-message ${type}`;
        messageDiv.textContent = message;
        messageDiv.style.cssText = `
            margin-top: 15px;
            padding: 10px;
            border-radius: 5px;
            text-align: center;
            font-weight: 600;
            animation: fadeIn 0.3s ease;
        `;
        
        if (type === 'success') {
            messageDiv.style.backgroundColor = 'rgba(0, 243, 255, 0.1)';
            messageDiv.style.borderColor = 'var(--neon-cyan)';
            messageDiv.style.color = 'var(--neon-cyan)';
        } else {
            messageDiv.style.backgroundColor = 'rgba(255, 0, 85, 0.1)';
            messageDiv.style.borderColor = 'var(--neon-pink)';
            messageDiv.style.color = 'var(--neon-pink)';
        }
        
        form.appendChild(messageDiv);
        
        // Remove message after 3 seconds
        setTimeout(() => {
            messageDiv.style.opacity = '0';
            setTimeout(() => messageDiv.remove(), 300);
        }, 3000);
    }
}

/**
 * 7. Cursor Glow Effect
 * Custom cursor with glow effect
 */
function initCursorEffect() {
    const cursor = document.createElement('div');
    cursor.style.cssText = `
        position: fixed;
        width: 20px;
        height: 20px;
        background: radial-gradient(circle, var(--neon-cyan) 0%, transparent 70%);
        border: 2px solid var(--neon-cyan);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        mix-blend-mode: difference;
        transition: transform 0.1s ease, width 0.3s ease, height 0.3s ease;
        box-shadow: var(--neon-cyan-glow);
    `;
    
    document.body.appendChild(cursor);
    
    // Track mouse movement
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });
    
    // Cursor interaction effects
    document.addEventListener('mousedown', () => {
        cursor.style.transform = 'scale(0.5)';
    });
    
    document.addEventListener('mouseup', () => {
        cursor.style.transform = 'scale(1)';
    });
    
    // Hover effects for interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .nav-link, .skill-card, .project-card');
    
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            cursor.style.width = '40px';
            cursor.style.height = '40px';
            cursor.style.borderColor = 'var(--neon-purple)';
            cursor.style.background = 'radial-gradient(circle, var(--neon-purple) 0%, transparent 70%)';
        });
        
        element.addEventListener('mouseleave', () => {
            cursor.style.width = '20px';
            cursor.style.height = '20px';
            cursor.style.borderColor = 'var(--neon-cyan)';
            cursor.style.background = 'radial-gradient(circle, var(--neon-cyan) 0%, transparent 70%)';
        });
    });
}

/**
 * 8. Scroll Progress Indicator
 * Show scroll progress at top of page
 */
function initScrollProgress() {
    const progressContainer = document.createElement('div');
    progressContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 4px;
        background: linear-gradient(90deg, var(--neon-cyan), var(--neon-purple));
        z-index: 10000;
        box-shadow: var(--neon-cyan-glow);
        transition: width 0.1s ease;
    `;
    
    document.body.appendChild(progressContainer);
    
    window.addEventListener('scroll', () => {
        const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        progressContainer.style.width = scrolled + '%';
    });
}

/**
 * 9. Back to Top Button
 * Show/hide and animate back to top button
 */
function initBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');
    if (!backToTopBtn) return;
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });
    
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/**
 * 10. Mobile Menu Management
 * Helper function to close mobile menu
 */
function closeMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
}

/**
 * 11. Typing Effect for Hero Subtitle
 * Animate typing effect for dynamic text
 */
function initTypingEffect() {
    const subtitle = document.querySelector('.hero-subtitle');
    if (!subtitle) return;
    
    const text = subtitle.textContent;
    subtitle.textContent = '';
    
    let i = 0;
    const typeWriter = () => {
        if (i < text.length) {
            subtitle.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, 100);
        }
    };
    
    // Start typing effect after a delay
    setTimeout(typeWriter, 1000);
}

/**
 * 12. Performance Optimizations
 * Debounce scroll events and optimize animations
 */
function debounce(func, wait = 20, immediate = false) {
    let timeout;
    return function executedFunction() {
        const context = this;
        const args = arguments;
        const later = () => {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// Optimize scroll events
window.addEventListener('scroll', debounce(() => {
    // Navigation active state
    // Scroll progress update
    // Header scroll effects
}));

/**
 * 13. Accessibility Enhancements
 * Improve keyboard navigation and screen reader support
 */
function initAccessibility() {
    // Add skip to content link
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.style.cssText = `
        position: absolute;
        left: -9999px;
        top: 10px;
        background: var(--neon-cyan);
        color: var(--bg-color);
        padding: 10px 20px;
        text-decoration: none;
        border-radius: 5px;
        z-index: 99999;
        font-weight: bold;
    `;
    
    skipLink.addEventListener('focus', () => {
        skipLink.style.left = '10px';
    });
    
    skipLink.addEventListener('blur', () => {
        skipLink.style.left = '-9999px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Add ARIA labels
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.setAttribute('aria-label', link.textContent);
    });
    
    // Focus management for mobile menu
    const hamburger = document.getElementById('hamburger');
    if (hamburger) {
        hamburger.setAttribute('aria-label', 'Toggle navigation menu');
    }
}

// Initialize accessibility
initAccessibility();

// Initialize back to top
initBackToTop();

// Initialize typing effect
initTypingEffect();

// Initialize skill progress bars
function initializeSkillProgress() {
    const skillProgressBars = document.querySelectorAll('.skill-progress');
    
    skillProgressBars.forEach(bar => {
        const width = bar.getAttribute('data-width') || '0%';
        bar.style.width = width;
    });
}

console.log('Portfolio JavaScript loaded successfully!');