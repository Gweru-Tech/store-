// Ntando Store v7.0.0 - Enhanced Interactive JavaScript with Self-Contained Admin

// Global Variables
let isMusicPlaying = false;
let visitorStats = {
    count: 0,
    uptime: 0
};

// Admin Configuration
const ADMIN_CONFIG = {
    username: 'Ntando',
    password: 'Ntando',
    storageKey: 'ntandoAdmin_v7',
    settingsKey: 'ntandoSettings_v7',
    quotesKey: 'ntandoQuotes_v7'
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

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    loadAdminSettings();
    initializeLocalStats();
    startStatsUpdate();
    initializeAnimations();
    initializeCountdowns();
    checkAdminSession();
});

// Initialize App
function initializeApp() {
    setupEventListeners();
    initializeParticles();
    setupSmoothScrolling();
    setupFormValidation();
}

// Check if admin session exists
function checkAdminSession() {
    const session = localStorage.getItem(ADMIN_CONFIG.storageKey);
    if (session) {
        try {
            const sessionData = JSON.parse(session);
            if (sessionData.isLoggedIn && sessionData.expires > Date.now()) {
                // Auto-login if session is valid
                adminLogin.style.display = 'none';
                adminDashboard.style.display = 'block';
                loadAdminContent();
                showNotification('Welcome back to Admin Panel v7.0.0', 'success');
            }
        } catch (error) {
            console.log('Invalid session, clearing...');
            localStorage.removeItem(ADMIN_CONFIG.storageKey);
        }
    }
}

// Enhanced Admin Login System
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    // Add loading state
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span class="loading"></span> Authenticating...';
    submitBtn.disabled = true;
    
    setTimeout(() => {
        if (username === ADMIN_CONFIG.username && password === ADMIN_CONFIG.password) {
            // Create admin session
            const sessionData = {
                isLoggedIn: true,
                username: username,
                loginTime: Date.now(),
                expires: Date.now() + (24 * 60 * 60 * 1000), // 24 hours
                lastActivity: Date.now()
            };
            
            localStorage.setItem(ADMIN_CONFIG.storageKey, JSON.stringify(sessionData));
            
            adminLogin.style.display = 'none';
            adminDashboard.style.display = 'block';
            loadAdminContent();
            showNotification('Login successful! Welcome to Admin Panel v7.0.0', 'success');
            
            // Scroll to admin dashboard
            document.getElementById('admin').scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        } else {
            showNotification('Invalid credentials. Please try again.', 'error');
            // Add shake animation to form
            loginForm.style.animation = 'shake 0.5s ease';
            setTimeout(() => {
                loginForm.style.animation = '';
            }, 500);
        }
        
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }, 1000);
});

// Load Admin Content
function loadAdminContent() {
    const settings = getAdminSettings();
    
    // Load hero section content
    if (settings.heroTitle) {
        document.getElementById('edit-hero-title').value = settings.heroTitle;
    }
    if (settings.heroSubtitle) {
        document.getElementById('edit-hero-subtitle').value = settings.heroSubtitle;
    }
    
    // Load promo content
    if (settings.promoTitle) {
        document.getElementById('edit-promo-title').value = settings.promoTitle;
    }
    if (settings.promoContent) {
        document.getElementById('edit-promo-content').value = settings.promoContent;
    }
    
    // Load media settings
    if (settings.logo) {
        document.getElementById('edit-logo').value = settings.logo;
        document.getElementById('main-logo').src = settings.logo;
    }
    if (settings.music) {
        document.getElementById('edit-music').value = settings.music;
        bgMusic.src = settings.music;
    }
    
    // Load statistics
    loadQuoteRequests();
    updateAdminStats();
}

// Enhanced Admin Content Saving
document.querySelectorAll('.save-content').forEach(btn => {
    btn.addEventListener('click', () => {
        const target = btn.dataset.target;
        
        // Add loading state
        const originalText = btn.innerHTML;
        btn.innerHTML = '<span class="loading"></span> Saving...';
        btn.disabled = true;
        
        setTimeout(() => {
            let success = false;
            
            switch(target) {
                case 'hero':
                    const heroTitle = document.getElementById('edit-hero-title').value;
                    const heroSubtitle = document.getElementById('edit-hero-subtitle').value;
                    
                    // Update live content
                    document.getElementById('hero-title').textContent = heroTitle;
                    document.getElementById('hero-subtitle').textContent = heroSubtitle;
                    
                    // Save to admin settings
                    saveAdminSetting('heroTitle', heroTitle);
                    saveAdminSetting('heroSubtitle', heroSubtitle);
                    
                    success = true;
                    break;
                    
                case 'features':
                    const projects = document.getElementById('edit-projects').value;
                    const rating = document.getElementById('edit-rating').value;
                    
                    // Update stats display
                    document.querySelectorAll('.hero-stat')[0].querySelector('.stat-number').textContent = projects + '+';
                    document.querySelectorAll('.hero-stat')[2].querySelector('.stat-number').textContent = rating + '/5';
                    
                    // Save to admin settings
                    saveAdminSetting('projectsCompleted', projects);
                    saveAdminSetting('clientRating', rating);
                    
                    success = true;
                    break;
                    
                case 'promo':
                    const promoTitle = document.getElementById('edit-promo-title').value;
                    const promoContent = document.getElementById('edit-promo-content').value;
                    
                    // Update live content
                    document.getElementById('promo-title').textContent = promoTitle;
                    
                    // Update promo items
                    const promoContainer = document.getElementById('promo-content');
                    promoContainer.innerHTML = '';
                    
                    promoContent.split('\n').forEach((line, index) => {
                        if (line.trim()) {
                            const [title, desc] = line.split(':');
                            if (title && desc) {
                                const promoItem = document.createElement('div');
                                promoItem.className = index === 0 ? 'promo-item featured' : 'promo-item';
                                if (index === 0) {
                                    promoItem.innerHTML = `<div class="promo-badge">NEW</div><h3>${title.trim()}</h3><p>${desc.trim()}</p>`;
                                } else {
                                    promoItem.innerHTML = `<h3>${title.trim()}</h3><p>${desc.trim()}</p>`;
                                }
                                promoContainer.appendChild(promoItem);
                            }
                        }
                    });
                    
                    // Save to admin settings
                    saveAdminSetting('promoTitle', promoTitle);
                    saveAdminSetting('promoContent', promoContent);
                    
                    success = true;
                    break;
                    
                case 'pricing':
                    const basicPrice = document.getElementById('edit-basic-price').value;
                    const premiumPrice = document.getElementById('edit-premium-price').value;
                    
                    // Update pricing displays
                    document.querySelectorAll('.service-price .price')[0].textContent = '$' + basicPrice;
                    document.querySelectorAll('.service-price .price')[1].textContent = '$' + premiumPrice;
                    
                    // Save to admin settings
                    saveAdminSetting('basicPrice', basicPrice);
                    saveAdminSetting('premiumPrice', premiumPrice);
                    
                    success = true;
                    break;
                    
                case 'logo':
                    const logoUrl = document.getElementById('edit-logo').value;
                    
                    // Validate URL
                    if (isValidUrl(logoUrl)) {
                        document.getElementById('main-logo').src = logoUrl;
                        saveAdminSetting('logo', logoUrl);
                        success = true;
                    } else {
                        showNotification('Please enter a valid URL for the logo', 'error');
                    }
                    break;
                    
                case 'music':
                    const musicUrl = document.getElementById('edit-music').value;
                    
                    // Validate URL
                    if (isValidUrl(musicUrl)) {
                        bgMusic.src = musicUrl;
                        saveAdminSetting('music', musicUrl);
                        success = true;
                    } else {
                        showNotification('Please enter a valid URL for the music', 'error');
                    }
                    break;
                    
                case 'background':
                    const backgroundUrl = document.getElementById('edit-background').value;
                    
                    // Validate URL
                    if (isValidUrl(backgroundUrl)) {
                        document.querySelector('.hero-bg').style.backgroundImage = `url('${backgroundUrl}')`;
                        saveAdminSetting('background', backgroundUrl);
                        success = true;
                    } else {
                        showNotification('Please enter a valid URL for the background', 'error');
                    }
                    break;
            }
            
            if (success) {
                showNotification('Content updated successfully!', 'success');
                // Update last activity
                updateAdminSession();
                updateAdminStats();
            }
            
            btn.innerHTML = originalText;
            btn.disabled = false;
        }, 500);
    });
});

// Load Quote Requests in Admin Panel
function loadQuoteRequests() {
    const quotesContainer = document.getElementById('quotes-list');
    const requests = getQuoteRequests();
    
    if (requests.length === 0) {
        quotesContainer.innerHTML = '<p>No quote requests yet.</p>';
        return;
    }
    
    quotesContainer.innerHTML = '';
    requests.slice(-5).reverse().forEach(request => {
        const quoteItem = document.createElement('div');
        quoteItem.className = 'quote-item';
        quoteItem.innerHTML = `
            <div class="quote-header">
                <span class="quote-name">${request.name}</span>
                <span class="quote-date">${new Date(request.timestamp).toLocaleDateString()}</span>
            </div>
            <div class="quote-service">${request.service}</div>
            <div class="quote-message">${request.message || 'No message provided'}</div>
            <div style="margin-top: 0.5rem; font-size: 0.8rem; color: var(--text-light);">
                Email: ${request.email}
            </div>
        `;
        quotesContainer.appendChild(quoteItem);
    });
}

// Update Admin Stats Display
function updateAdminStats() {
    const stats = adminFunctions.getStatistics();
    
    // Update admin dashboard stats
    const adminVisitorsEl = document.getElementById('admin-visitors');
    const adminQuotesEl = document.getElementById('admin-quotes');
    const adminUptimeEl = document.getElementById('admin-uptime');
    
    if (adminVisitorsEl) adminVisitorsEl.textContent = stats.visitors;
    if (adminQuotesEl) adminQuotesEl.textContent = stats.quoteRequests;
    if (adminUptimeEl) adminUptimeEl.textContent = stats.uptime + 'd';
    
    // Update analytics section
    const analyticsVisitorsEl = document.getElementById('analytics-visitors');
    const analyticsQuotesEl = document.getElementById('analytics-quotes');
    const analyticsUptimeEl = document.getElementById('analytics-uptime');
    
    if (analyticsVisitorsEl) analyticsVisitorsEl.textContent = stats.visitors;
    if (analyticsQuotesEl) analyticsQuotesEl.textContent = stats.quoteRequests;
    if (analyticsUptimeEl) analyticsUptimeEl.textContent = stats.uptime + ' days';
    
    // Update last updated timestamp
    const lastUpdatedEl = document.getElementById('last-updated');
    if (lastUpdatedEl && stats.lastUpdate) {
        lastUpdatedEl.textContent = new Date(stats.lastUpdate).toLocaleString();
    }
}

// Load Admin Content
function loadAdminContent() {
    const settings = getAdminSettings();
    
    // Load hero section content
    if (settings.heroTitle) {
        document.getElementById('edit-hero-title').value = settings.heroTitle;
    }
    if (settings.heroSubtitle) {
        document.getElementById('edit-hero-subtitle').value = settings.heroSubtitle;
    }
    
    // Load features section
    if (settings.projectsCompleted) {
        document.getElementById('edit-projects').value = settings.projectsCompleted;
    }
    if (settings.clientRating) {
        document.getElementById('edit-rating').value = settings.clientRating;
    }
    
    // Load promo content
    if (settings.promoTitle) {
        document.getElementById('edit-promo-title').value = settings.promoTitle;
    }
    if (settings.promoContent) {
        document.getElementById('edit-promo-content').value = settings.promoContent;
    }
    
    // Load pricing
    if (settings.basicPrice) {
        document.getElementById('edit-basic-price').value = settings.basicPrice;
    }
    if (settings.premiumPrice) {
        document.getElementById('edit-premium-price').value = settings.premiumPrice;
    }
    
    // Load media settings
    if (settings.logo) {
        document.getElementById('edit-logo').value = settings.logo;
        document.getElementById('main-logo').src = settings.logo;
    }
    if (settings.music) {
        document.getElementById('edit-music').value = settings.music;
        bgMusic.src = settings.music;
    }
    if (settings.background) {
        document.getElementById('edit-background').value = settings.background;
        document.querySelector('.hero-bg').style.backgroundImage = `url('${settings.background}')`;
    }
    
    // Load statistics
    loadQuoteRequests();
    updateAdminStats();
}

// Enhanced Admin Panel with More Features
document.getElementById('update-site').addEventListener('click', () => {
    showNotification('Updating website with latest changes...', 'info');
    
    // Simulate site update
    setTimeout(() => {
        showNotification('Site updated successfully! All changes are now live.', 'success');
        
        // Update last modified timestamp
        saveAdminSetting('lastUpdated', new Date().toISOString());
        updateAdminStats();
        
        // Refresh page after delay
        setTimeout(() => {
            location.reload();
        }, 2000);
    }, 2000);
});

// Enhanced Admin Logout with Session Cleanup
logoutBtn.addEventListener('click', () => {
    showNotification('Logging out and cleaning session...', 'info');
    
    setTimeout(() => {
        // Clear admin session
        localStorage.removeItem(ADMIN_CONFIG.storageKey);
        
        adminDashboard.style.display = 'none';
        adminLogin.style.display = 'block';
        loginForm.reset();
        
        showNotification('Logged out successfully. Session cleared.', 'success');
        
        // Scroll to top
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }, 1000);
});

// Admin Settings Management
function getAdminSettings() {
    try {
        return JSON.parse(localStorage.getItem(ADMIN_CONFIG.settingsKey) || '{}');
    } catch (error) {
        return {};
    }
}

function saveAdminSetting(key, value) {
    const settings = getAdminSettings();
    settings[key] = value;
    settings.lastModified = new Date().toISOString();
    localStorage.setItem(ADMIN_CONFIG.settingsKey, JSON.stringify(settings));
}

function loadAdminSettings() {
    const settings = getAdminSettings();
    
    // Apply saved settings to live content
    if (settings.heroTitle) {
        document.getElementById('hero-title').textContent = settings.heroTitle;
    }
    if (settings.heroSubtitle) {
        document.getElementById('hero-subtitle').textContent = settings.heroSubtitle;
    }
    if (settings.promoTitle) {
        document.getElementById('promo-title').textContent = settings.promoTitle;
    }
    if (settings.logo) {
        document.getElementById('main-logo').src = settings.logo;
    }
    if (settings.music) {
        bgMusic.src = settings.music;
    }
}

function updateAdminSession() {
    const session = localStorage.getItem(ADMIN_CONFIG.storageKey);
    if (session) {
        try {
            const sessionData = JSON.parse(session);
            sessionData.lastActivity = Date.now();
            localStorage.setItem(ADMIN_CONFIG.storageKey, JSON.stringify(sessionData));
        } catch (error) {
            console.log('Failed to update session');
        }
    }
}

// Enhanced Quote Request System
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
        id: generateId(),
        name,
        email,
        service,
        message,
        timestamp: new Date().toISOString(),
        status: 'pending',
        version: '7.0.0',
        source: window.location.href
    };
    
    // Simulate form submission
    setTimeout(() => {
        // Save quote request to localStorage
        let quoteRequests = getQuoteRequests();
        quoteRequests.push(quoteRequest);
        localStorage.setItem(ADMIN_CONFIG.quotesKey, JSON.stringify(quoteRequests));
        
        showNotification('Quote request submitted successfully! We will contact you soon.', 'success');
        quoteForm.reset();
        
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        console.log('New quote request:', quoteRequest);
    }, 1500);
});

function getQuoteRequests() {
    try {
        return JSON.parse(localStorage.getItem(ADMIN_CONFIG.quotesKey) || '[]');
    } catch (error) {
        return [];
    }
}

function loadQuoteRequests() {
    const requests = getQuoteRequests();
    console.log(`Loaded ${requests.length} quote requests`);
    return requests;
}

function updateAdminStats() {
    const settings = getAdminSettings();
    const requests = getQuoteRequests();
    
    // Update admin dashboard stats if elements exist
    const statsElements = document.querySelectorAll('.admin-stat');
    if (statsElements.length > 0) {
        // You can add more stats display here
        console.log('Admin Stats:', {
            quotes: requests.length,
            lastUpdate: settings.lastUpdated,
            version: '7.0.0'
        });
    }
}

// Enhanced Local Statistics (works without backend)
function initializeLocalStats() {
    let stats = JSON.parse(localStorage.getItem('ntandoStats_v7') || '{"visitors":0,"startTime":"' + new Date().toISOString() + '"}');
    
    // Increment visitor count
    stats.visitors = (stats.visitors || 0) + 1;
    stats.lastVisit = new Date().toISOString();
    
    localStorage.setItem('ntandoStats_v7', JSON.stringify(stats));
    
    // Update display
    updateLocalStatsDisplay(stats);
}

function updateLocalStatsDisplay(stats) {
    const visitorCountEl = document.getElementById('visitor-count');
    const totalVisitorsEl = document.getElementById('total-visitors');
    const uptimeDisplayEl = document.getElementById('uptime-display');
    
    if (visitorCountEl) {
        visitorCountEl.textContent = stats.visitors.toLocaleString();
    }
    if (totalVisitorsEl) {
        totalVisitorsEl.textContent = stats.visitors.toLocaleString();
    }
    
    // Calculate uptime
    if (stats.startTime && uptimeDisplayEl) {
        const startTime = new Date(stats.startTime);
        const now = new Date();
        const uptimeMs = now - startTime;
        
        const days = Math.floor(uptimeMs / (1000 * 60 * 60 * 24));
        const hours = Math.floor((uptimeMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((uptimeMs % (1000 * 60 * 60)) / (1000 * 60));
        
        const uptimeString = days > 0 ? `${days}d ${hours}h` : `${hours}h ${minutes}m`;
        uptimeDisplayEl.textContent = uptimeString;
    }
}

// Stats Update Loop
function startStatsUpdate() {
    setInterval(() => {
        const stats = JSON.parse(localStorage.getItem('ntandoStats_v7') || '{}');
        updateLocalStatsDisplay(stats);
    }, 30000); // Update every 30 seconds
}

// Enhanced Tab Switching with Animation
tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const tabName = btn.dataset.tab;
        
        // Remove active class from all tabs and contents
        tabBtns.forEach(b => b.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));
        
        // Add active class to clicked tab and corresponding content
        btn.classList.add('active');
        const contentEl = document.getElementById(`${tabName}-tab`);
        contentEl.classList.add('active');
        
        // Add animation
        contentEl.style.animation = 'fadeInUp 0.5s ease';
        
        // Update admin session
        updateAdminSession();
    });
});

// Utility Functions
function generateId() {
    return 'req_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}

// Enhanced Notification System with More Types
function showNotification(message, type = 'info', duration = 5000) {
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
        warning: 'fas fa-exclamation-triangle',
        premium: 'fas fa-crown'
    };
    
    notification.innerHTML = `
        <div class="notification-content">
            <i class="${icons[type] || icons.info}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 80px;
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
        warning: 'linear-gradient(135deg, #f59e0b, #d97706)',
        premium: 'linear-gradient(135deg, #8b5cf6, #7c3aed)'
    };
    
    notification.style.background = backgrounds[type] || backgrounds.info;
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
    
    // Auto remove after specified duration
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOutRight 0.5s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 500);
        }
    }, duration);
}

// Music Player Enhanced
musicToggle.addEventListener('click', () => {
    if (isMusicPlaying) {
        bgMusic.pause();
        musicToggle.classList.remove('playing');
        musicToggle.innerHTML = '<i class="fas fa-music"></i>';
        showNotification('Music paused', 'info', 3000);
    } else {
        bgMusic.play().catch(e => {
            console.log('Audio play failed:', e);
            showNotification('Unable to play music', 'error', 3000);
        });
        musicToggle.classList.add('playing');
        musicToggle.innerHTML = '<i class="fas fa-pause"></i>';
        showNotification('Music playing', 'success', 3000);
    }
    isMusicPlaying = !isMusicPlaying;
});

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
                const offsetTop = target.offsetTop - 140; // Account for fixed navbar and stats bar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

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

// Initialize Particles Effect
function initializeParticles() {
    const heroParticles = document.querySelector('.hero-particles');
    if (heroParticles) {
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
            setInterval(() => updateCountdown(countdown, new Date(endDate)), 60000);
        }
    });
}

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

function validateInput(input) {
    const value = input.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    const existingError = input.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    input.classList.remove('error');
    
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
    
    if (!isValid) {
        input.classList.add('error');
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = errorMessage;
        errorDiv.style.cssText = `
            color: #ef4444;
            font-size: 0.8rem;
            margin-top: 0.25rem;
            animation: fadeInUp 0.3s ease;
        `;
        
        input.parentNode.appendChild(errorDiv);
    }
    
    return isValid;
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone) {
    return /^[\d\s\-\+\(\)]+$/.test(phone) && phone.length >= 10;
}

// Enhanced Admin Functions Export
window.adminFunctions = {
    // Quote Management
    viewQuoteRequests: () => {
        const requests = getQuoteRequests();
        console.table(requests);
        return requests;
    },
    
    exportQuoteRequests: () => {
        const requests = getQuoteRequests();
        const data = {
            quoteRequests: requests,
            exportDate: new Date().toISOString(),
            version: '7.0.0'
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ntando-quotes-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        
        showNotification('Quote requests exported successfully!', 'success');
    },
    
    // Settings Management
    exportSettings: () => {
        const settings = getAdminSettings();
        const stats = JSON.parse(localStorage.getItem('ntandoStats_v7') || '{}');
        
        const data = {
            settings: settings,
            statistics: stats,
            exportDate: new Date().toISOString(),
            version: '7.0.0'
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ntando-settings-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        
        showNotification('Settings exported successfully!', 'success');
    },
    
    importSettings: (settingsData) => {
        try {
            if (typeof settingsData === 'string') {
                settingsData = JSON.parse(settingsData);
            }
            
            // Import settings
            if (settingsData.settings) {
                localStorage.setItem(ADMIN_CONFIG.settingsKey, JSON.stringify(settingsData.settings));
            }
            
            // Import statistics
            if (settingsData.statistics) {
                localStorage.setItem('ntandoStats_v7', JSON.stringify(settingsData.statistics));
            }
            
            showNotification('Settings imported successfully! Refreshing...', 'info');
            setTimeout(() => location.reload(), 2000);
            
        } catch (error) {
            showNotification('Failed to import settings: ' + error.message, 'error');
        }
    },
    
    // Data Management
    clearAllData: () => {
        if (confirm('⚠️ Are you sure you want to clear ALL data? This includes:\n\n• Admin settings\n• Quote requests\n• Visitor statistics\n\nThis action cannot be undone!')) {
            localStorage.removeItem(ADMIN_CONFIG.storageKey);
            localStorage.removeItem(ADMIN_CONFIG.settingsKey);
            localStorage.removeItem(ADMIN_CONFIG.quotesKey);
            localStorage.removeItem('ntandoStats_v7');
            
            showNotification('All data cleared successfully. Refreshing...', 'warning');
            setTimeout(() => location.reload(), 2000);
        }
    },
    
    // Statistics
    getStatistics: () => {
        const settings = getAdminSettings();
        const stats = JSON.parse(localStorage.getItem('ntandoStats_v7') || '{}');
        const requests = getQuoteRequests();
        
        return {
            visitors: stats.visitors || 0,
            uptime: stats.startTime ? Math.floor((Date.now() - new Date(stats.startTime)) / (1000 * 60 * 60 * 24)) : 0,
            quoteRequests: requests.length,
            lastUpdate: settings.lastUpdated,
            version: '7.0.0'
        };
    },
    
    // Premium Features
    enablePremiumMode: () => {
        const settings = getAdminSettings();
        settings.premiumMode = true;
        settings.premiumActivated = new Date().toISOString();
        localStorage.setItem(ADMIN_CONFIG.settingsKey, JSON.stringify(settings));
        
        showNotification('🎉 Premium mode activated! Enjoy all advanced features.', 'premium');
        setTimeout(() => location.reload(), 2000);
    },
    
    // Quick Actions
    quickBackup: () => {
        const backup = {
            settings: getAdminSettings(),
            quotes: getQuoteRequests(),
            stats: JSON.parse(localStorage.getItem('ntandoStats_v7') || '{}'),
            timestamp: new Date().toISOString(),
            version: '7.0.0'
        };
        
        localStorage.setItem('ntandoBackup_v7', JSON.stringify(backup));
        showNotification('Quick backup created successfully!', 'success');
    },
    
    restoreBackup: () => {
        try {
            const backup = JSON.parse(localStorage.getItem('ntandoBackup_v7'));
            if (!backup) {
                showNotification('No backup found!', 'error');
                return;
            }
            
            localStorage.setItem(ADMIN_CONFIG.settingsKey, JSON.stringify(backup.settings));
            localStorage.setItem(ADMIN_CONFIG.quotesKey, JSON.stringify(backup.quotes));
            localStorage.setItem('ntandoStats_v7', JSON.stringify(backup.stats));
            
            showNotification('Backup restored successfully! Refreshing...', 'info');
            setTimeout(() => location.reload(), 2000);
            
        } catch (error) {
            showNotification('Failed to restore backup!', 'error');
        }
    },
    
    // Utility
    showNotification,
    updateStats: updateLocalStatsDisplay
};

// Add keyboard shortcuts for admin
document.addEventListener('keydown', (e) => {
    // Ctrl+Shift+A to open admin panel (if logged in)
    if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        e.preventDefault();
        const session = localStorage.getItem(ADMIN_CONFIG.storageKey);
        if (session) {
            document.getElementById('admin').scrollIntoView({ behavior: 'smooth' });
        } else {
            showNotification('Please login to admin panel first', 'info');
        }
    }
    
    // Ctrl+Shift+E to export data
    if (e.ctrlKey && e.shiftKey && e.key === 'E') {
        e.preventDefault();
        window.adminFunctions.exportSettings();
    }
    
    // Escape to close mobile menu
    if (e.key === 'Escape') {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
});

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideOutRight {
        from { opacity: 1; transform: translateX(0); }
        to { opacity: 0; transform: translateX(100%); }
    }
    
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
        20%, 40%, 60%, 80% { transform: translateX(10px); }
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
    
    .admin-stat {
        padding: 1rem;
        background: var(--bg-light);
        border-radius: 8px;
        margin-bottom: 1rem;
    }
`;
document.head.appendChild(style);

// Console welcome message
console.log('%c🚀 Ntando Store v7.0.0 - Enhanced Admin', 'font-size: 20px; font-weight: bold; color: #8b5cf6;');
console.log('%cSelf-contained admin system with local storage', 'font-size: 14px; color: #6b7280;');
console.log('%cAdmin Functions: window.adminFunctions', 'font-size: 12px; color: #10b981;');
console.log('%cKeyboard Shortcuts: Ctrl+Shift+A (Admin), Ctrl+Shift+E (Export)', 'font-size: 11px; color: #f59e0b;');