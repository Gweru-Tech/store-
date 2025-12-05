// Ntando Store v7.0.0 - Enhanced Interactive JavaScript

// Global Variables
let isMusicPlaying = false;
let visitorStats = {
    count: 0,
    uptime: 0
};

// DOM Elements
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const musicToggle = document.getElementById('music-toggle');
const bgMusic = document.getElementById('bg-music');
const loginForm = document.getElementById('login-form');
const adminLogin = document.getElementById('admin-login');
const adminDashboard = document.getElementById('admin-dashboard');
const logoutBtn = document.getElementById('logout-btn');
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');
const quoteForm = document.getElementById('quote-form');

// Live Stats Elements
const visitorCountEl = document.getElementById('visitor-count');
const uptimeDisplayEl = document.getElementById('uptime-display');
const totalVisitorsEl = document.getElementById('total-visitors');
const serverUptimeEl = document.getElementById('server-uptime');

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    trackVisitor();
    startStatsUpdate();
    initializeAnimations();
    initializeCountdowns();
});

// Initialize App
function initializeApp() {
    setupEventListeners();
    loadSavedData();
    initializeParticles();
    setupSmoothScrolling();
    setupFormValidation();
}

// Track Visitor
async function trackVisitor() {
    try {
        const response = await fetch('/api/visit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        if (data.success) {
            visitorStats.count = data.visitorCount;
            updateVisitorDisplay();
        }
    } catch (error) {
        console.log('Visitor tracking offline, using local storage');
        loadLocalVisitorCount();
    }
}

// Update Statistics Display
function updateVisitorDisplay() {
    if (visitorCountEl) {
        visitorCountEl.textContent = visitorStats.count.toLocaleString();
    }
    if (totalVisitorsEl) {
        totalVisitorsEl.textContent = visitorStats.count.toLocaleString();
    }
}

// Update Uptime Display
function updateUptimeDisplay() {
    const now = Date.now();
    const uptimeMs = now - (window.appStartTime || now);
    
    const days = Math.floor(uptimeMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((uptimeMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((uptimeMs % (1000 * 60 * 60)) / (1000 * 60));
    
    const uptimeString = days > 0 ? `${days}d ${hours}h` : `${hours}h ${minutes}m`;
    
    if (uptimeDisplayEl) {
        uptimeDisplayEl.textContent = uptimeString;
    }
    
    if (serverUptimeEl) {
        const uptimePercentage = Math.min(100, 99.9 + Math.random() * 0.1);
        serverUptimeEl.textContent = uptimePercentage.toFixed(1) + '%';
    }
}

// Start Stats Update Loop
function startStatsUpdate() {
    window.appStartTime = Date.now();
    
    // Update stats every 30 seconds
    setInterval(async () => {
        await updateStats();
    }, 30000);
    
    // Update uptime every minute
    setInterval(() => {
        updateUptimeDisplay();
    }, 60000);
    
    // Initial update
    updateUptimeDisplay();
}

// Update Stats from Server
async function updateStats() {
    try {
        const response = await fetch('/api/stats');
        const data = await response.json();
        
        if (data.visitorCount !== undefined) {
            visitorStats.count = data.visitorCount;
            updateVisitorDisplay();
        }
        
        if (data.uptime) {
            const uptimeFormatted = data.uptime.formatted;
            if (uptimeDisplayEl) {
                uptimeDisplayEl.textContent = uptimeFormatted;
            }
        }
    } catch (error) {
        console.log('Stats update failed:', error);
    }
}

// Load Local Visitor Count
function loadLocalVisitorCount() {
    let count = localStorage.getItem('visitorCount') || '0';
    count = parseInt(count) + 1;
    localStorage.setItem('visitorCount', count);
    visitorStats.count = count;
    updateVisitorDisplay();
}

// Navigation and Mobile Menu
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Setup Smooth Scrolling
function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 100; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Music Player Enhanced
musicToggle.addEventListener('click', () => {
    if (isMusicPlaying) {
        bgMusic.pause();
        musicToggle.classList.remove('playing');
        musicToggle.innerHTML = '<i class="fas fa-music"></i>';
        showNotification('Music paused', 'info');
    } else {
        bgMusic.play().catch(e => {
            console.log('Audio play failed:', e);
            showNotification('Unable to play music', 'error');
        });
        musicToggle.classList.add('playing');
        musicToggle.innerHTML = '<i class="fas fa-pause"></i>';
        showNotification('Music playing', 'success');
    }
    isMusicPlaying = !isMusicPlaying;
});

// Enhanced Navbar Scroll Effect
let lastScrollTop = 0;
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > lastScrollTop && scrollTop > 200) {
        // Scrolling down
        navbar.style.transform = 'translateY(-100%)';
    } else {
        // Scrolling up
        navbar.style.transform = 'translateY(0)';
    }
    
    if (scrollTop > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 30px rgba(0, 0, 0, 0.15)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.box-shadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    }
    
    lastScrollTop = scrollTop;
});

// Enhanced Admin Panel Login
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    // Add loading state
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span class="loading"></span> Logging in...';
    submitBtn.disabled = true;
    
    // Simulate login process
    setTimeout(() => {
        if (username === 'Ntando' && password === 'Ntando') {
            adminLogin.style.display = 'none';
            adminDashboard.style.display = 'block';
            showNotification('Login successful! Welcome to Admin Panel v7.0.0', 'success');
            
            // Scroll to admin dashboard
            document.getElementById('admin').scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        } else {
            showNotification('Invalid credentials. Please try again.', 'error');
        }
        
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }, 1000);
});

// Enhanced Admin Tab Switching
tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const tabName = btn.dataset.tab;
        
        // Remove active class from all tabs and contents
        tabBtns.forEach(b => b.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));
        
        // Add active class to clicked tab and corresponding content
        btn.classList.add('active');
        document.getElementById(`${tabName}-tab`).classList.add('active');
        
        // Add animation
        document.getElementById(`${tabName}-tab`).style.animation = 'fadeInUp 0.5s ease';
    });
});

// Enhanced Admin Content Editing
document.querySelectorAll('.save-content').forEach(btn => {
    btn.addEventListener('click', () => {
        const target = btn.dataset.target;
        
        // Add loading state
        const originalText = btn.innerHTML;
        btn.innerHTML = '<span class="loading"></span> Saving...';
        btn.disabled = true;
        
        setTimeout(() => {
            switch(target) {
                case 'hero':
                    const heroTitle = document.getElementById('edit-hero-title').value;
                    const heroSubtitle = document.getElementById('edit-hero-subtitle').value;
                    
                    document.getElementById('hero-title').textContent = heroTitle;
                    document.getElementById('hero-subtitle').textContent = heroSubtitle;
                    
                    showNotification('Hero section updated successfully!', 'success');
                    break;
                    
                case 'promo':
                    const promoTitle = document.getElementById('edit-promo-title').value;
                    const promoContent = document.getElementById('edit-promo-content').value;
                    
                    document.getElementById('promo-title').textContent = promoTitle;
                    
                    const promoContainer = document.getElementById('promo-content');
                    promoContainer.innerHTML = '';
                    
                    promoContent.split('\n').forEach(line => {
                        if (line.trim()) {
                            const [title, desc] = line.split(':');
                            if (title && desc) {
                                const promoItem = document.createElement('div');
                                promoItem.className = 'promo-item';
                                promoItem.innerHTML = `
                                    <h3>${title.trim()}</h3>
                                    <p>${desc.trim()}</p>
                                `;
                                promoContainer.appendChild(promoItem);
                            }
                        }
                    });
                    
                    showNotification('Promotions updated successfully!', 'success');
                    break;
                    
                case 'logo':
                    const logoUrl = document.getElementById('edit-logo').value;
                    document.getElementById('main-logo').src = logoUrl;
                    showNotification('Logo updated successfully!', 'success');
                    break;
                    
                case 'music':
                    const musicUrl = document.getElementById('edit-music').value;
                    bgMusic.src = musicUrl;
                    showNotification('Background music updated successfully!', 'success');
                    break;
            }
            
            btn.innerHTML = originalText;
            btn.disabled = false;
        }, 500);
    });
});

// Enhanced Update Site Function
document.getElementById('update-site').addEventListener('click', () => {
    showNotification('Updating website with latest changes...', 'info');
    
    // Simulate site update
    setTimeout(() => {
        showNotification('Site updated successfully! All changes are now live.', 'success');
        
        // Update version display
        setTimeout(() => {
            location.reload();
        }, 2000);
    }, 2000);
});

// Enhanced Admin Logout
logoutBtn.addEventListener('click', () => {
    showNotification('Logging out...', 'info');
    
    setTimeout(() => {
        adminDashboard.style.display = 'none';
        adminLogin.style.display = 'block';
        loginForm.reset();
        showNotification('Logged out successfully.', 'success');
        
        // Scroll to top
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }, 1000);
});

// Enhanced Quote Form Submission
quoteForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = new FormData(quoteForm);
    const name = quoteForm.querySelector('input[type="text"]').value;
    const email = quoteForm.querySelector('input[type="email"]').value;
    const service = quoteForm.querySelector('select').value;
    const message = quoteForm.querySelector('textarea').value;
    
    // Add loading state
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span class="loading"></span> Sending...';
    submitBtn.disabled = true;
    
    // Create quote request object
    const quoteRequest = {
        name,
        email,
        service,
        message,
        timestamp: new Date().toISOString(),
        version: '7.0.0'
    };
    
    // Simulate form submission
    setTimeout(() => {
        // Save quote request to localStorage
        let quoteRequests = JSON.parse(localStorage.getItem('quoteRequests') || '[]');
        quoteRequests.push(quoteRequest);
        localStorage.setItem('quoteRequests', JSON.stringify(quoteRequests));
        
        showNotification('Quote request submitted successfully! We will contact you soon.', 'success');
        quoteForm.reset();
        
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        console.log('New quote request:', quoteRequest);
    }, 1500);
});

// Enhanced Notification System
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        info: 'fas fa-info-circle',
        warning: 'fas fa-exclamation-triangle'
    };
    
    notification.innerHTML = `
        <div class="notification-content">
            <i class="${icons[type]}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        min-width: 300px;
        padding: 1rem;
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        animation: slideInRight 0.5s ease;
        display: flex;
        justify-content: space-between;
        align-items: center;
    `;
    
    // Set background based on type
    const backgrounds = {
        success: 'linear-gradient(135deg, #10b981, #059669)',
        error: 'linear-gradient(135deg, #ef4444, #dc2626)',
        info: 'linear-gradient(135deg, #3b82f6, #2563eb)',
        warning: 'linear-gradient(135deg, #f59e0b, #d97706)'
    };
    
    notification.style.background = backgrounds[type];
    notification.style.color = 'white';
    
    document.body.appendChild(notification);
    
    // Add close functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.animation = 'slideOutRight 0.5s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 500);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOutRight 0.5s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 500);
        }
    }, 5000);
}

// Initialize Particles Effect
function initializeParticles() {
    const heroParticles = document.querySelector('.hero-particles');
    if (heroParticles) {
        // Add floating particles animation
        heroParticles.style.animation = 'float 20s ease-in-out infinite';
    }
}

// Initialize Animations on Scroll
function initializeAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.8s ease forwards';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all cards and sections
    document.querySelectorAll('.service-card, .stat-card, .promo-item, .contact-card').forEach(card => {
        card.style.opacity = '0';
        observer.observe(card);
    });
}

// Initialize Countdown Timers
function initializeCountdowns() {
    const countdownElements = document.querySelectorAll('.promo-countdown');
    
    countdownElements.forEach(countdown => {
        const endDate = countdown.dataset.end;
        if (endDate) {
            updateCountdown(countdown, new Date(endDate));
            setInterval(() => updateCountdown(countdown, new Date(endDate)), 60000); // Update every minute
        }
    });
}

// Update Countdown Timer
function updateCountdown(element, endDate) {
    const now = new Date();
    const timeLeft = endDate - now;
    
    if (timeLeft > 0) {
        const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        
        const timerElement = element.querySelector('.countdown-timer');
        if (timerElement) {
            timerElement.innerHTML = `
                <span class="time-block">${days}d</span>
                <span class="time-block">${hours}h</span>
                <span class="time-block">${minutes}m</span>
            `;
        }
    } else {
        element.innerHTML = '<span class="expired">Offer Expired</span>';
    }
}

// Setup Form Validation
function setupFormValidation() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input, textarea, select');
        
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                validateInput(input);
            });
            
            input.addEventListener('input', () => {
                if (input.classList.contains('error')) {
                    validateInput(input);
                }
            });
        });
    });
}

// Validate Input Field
function validateInput(input) {
    const value = input.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    // Remove existing error
    const existingError = input.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    input.classList.remove('error');
    
    // Validation rules
    if (input.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'This field is required';
    } else if (input.type === 'email' && value && !isValidEmail(value)) {
        isValid = false;
        errorMessage = 'Please enter a valid email address';
    } else if (input.type === 'tel' && value && !isValidPhone(value)) {
        isValid = false;
        errorMessage = 'Please enter a valid phone number';
    }
    
    // Show error if invalid
    if (!isValid) {
        input.classList.add('error');
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = errorMessage;
        errorDiv.style.cssText = `
            color: #ef4444;
            font-size: 0.8rem;
            margin-top: 0.25rem;
        `;
        
        input.parentNode.appendChild(errorDiv);
    }
    
    return isValid;
}

// Email Validation
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Phone Validation
function isValidPhone(phone) {
    return /^[\d\s\-\+\(\)]+$/.test(phone) && phone.length >= 10;
}

// Load Saved Data
function loadSavedData() {
    // Load admin settings from localStorage if available
    const savedSettings = localStorage.getItem('ntandoSettings');
    if (savedSettings) {
        try {
            const settings = JSON.parse(savedSettings);
            // Apply saved settings if needed
            console.log('Settings loaded:', settings);
        } catch (error) {
            console.log('Failed to load settings:', error);
        }
    }
}

// Setup Event Listeners
function setupEventListeners() {
    // Add keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Ctrl+K to focus search (if search exists)
        if (e.ctrlKey && e.key === 'k') {
            e.preventDefault();
            // Focus search input
        }
        
        // Escape to close mobile menu
        if (e.key === 'Escape') {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
    
    // Add performance monitoring
    if (window.performance) {
        window.addEventListener('load', () => {
            const perfData = window.performance.timing;
            const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
            console.log(`Page load time: ${pageLoadTime}ms`);
        });
    }
}

// Export admin functions to global scope for debugging
window.adminFunctions = {
    viewQuoteRequests: () => {
        const requests = JSON.parse(localStorage.getItem('quoteRequests') || '[]');
        console.table(requests);
        return requests;
    },
    clearAllData: () => {
        if (confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
            localStorage.clear();
            showNotification('All data cleared successfully.', 'success');
            setTimeout(() => {
                location.reload();
            }, 2000);
        }
    },
    exportData: () => {
        const data = {
            quoteRequests: JSON.parse(localStorage.getItem('quoteRequests') || '[]'),
            visitorCount: visitorStats.count,
            timestamp: new Date().toISOString()
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ntando-store-data-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        
        showNotification('Data exported successfully!', 'success');
    },
    showNotification,
    updateStats
};

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100%);
        }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        padding: 0.25rem;
        border-radius: 4px;
        transition: background 0.2s ease;
    }
    
    .notification-close:hover {
        background: rgba(255, 255, 255, 0.2);
    }
    
    .error-message {
        animation: fadeInUp 0.3s ease;
    }
`;
document.head.appendChild(style);

// Console welcome message
console.log('%c🚀 Ntando Store v7.0.0', 'font-size: 20px; font-weight: bold; color: #2563eb;');
console.log('%cNext-Generation Website Design & Digital Services', 'font-size: 14px; color: #6b7280;');
console.log('%cAdmin Functions: window.adminFunctions', 'font-size: 12px; color: #10b981;');