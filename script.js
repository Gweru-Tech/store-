// Ntando Store - Interactive JavaScript

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

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Music Player
let isMusicPlaying = false;
musicToggle.addEventListener('click', () => {
    if (isMusicPlaying) {
        bgMusic.pause();
        musicToggle.classList.remove('playing');
        musicToggle.innerHTML = '<i class="fas fa-music"></i>';
    } else {
        bgMusic.play().catch(e => {
            console.log('Audio play failed:', e);
        });
        musicToggle.classList.add('playing');
        musicToggle.innerHTML = '<i class="fas fa-pause"></i>';
    }
    isMusicPlaying = !isMusicPlaying;
});

// Navbar Scroll Effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 30px rgba(0, 0, 0, 0.15)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    }
});

// Admin Panel Login
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    // Admin credentials: username: Ntando, password: Ntando
    if (username === 'Ntando' && password === 'Ntando') {
        adminLogin.style.display = 'none';
        adminDashboard.style.display = 'block';
        showMessage('Login successful! Welcome to Admin Panel.', 'success');
    } else {
        showMessage('Invalid credentials. Please try again.', 'error');
    }
});

// Admin Tab Switching
tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const tabName = btn.dataset.tab;
        
        // Remove active class from all tabs and contents
        tabBtns.forEach(b => b.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));
        
        // Add active class to clicked tab and corresponding content
        btn.classList.add('active');
        document.getElementById(`${tabName}-tab`).classList.add('active');
    });
});

// Admin Content Editing
document.querySelectorAll('.save-content').forEach(btn => {
    btn.addEventListener('click', () => {
        const target = btn.dataset.target;
        
        switch(target) {
            case 'hero':
                const heroTitle = document.getElementById('edit-hero-title').value;
                const heroSubtitle = document.getElementById('edit-hero-subtitle').value;
                
                document.getElementById('hero-title').textContent = heroTitle;
                document.getElementById('hero-subtitle').textContent = heroSubtitle;
                
                showMessage('Hero section updated successfully!', 'success');
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
                
                showMessage('Promotions updated successfully!', 'success');
                break;
                
            case 'logo':
                const logoUrl = document.getElementById('edit-logo').value;
                document.getElementById('main-logo').src = logoUrl;
                showMessage('Logo updated successfully!', 'success');
                break;
                
            case 'music':
                const musicUrl = document.getElementById('edit-music').value;
                bgMusic.src = musicUrl;
                showMessage('Background music updated successfully!', 'success');
                break;
        }
    });
});

// Update Site Function
document.getElementById('update-site').addEventListener('click', () => {
    showMessage('Site is being updated with latest changes...', 'success');
    
    // Simulate site update
    setTimeout(() => {
        showMessage('Site updated successfully! All changes are now live.', 'success');
        // Refresh page content
        location.reload();
    }, 2000);
});

// Admin Logout
logoutBtn.addEventListener('click', () => {
    adminDashboard.style.display = 'none';
    adminLogin.style.display = 'block';
    loginForm.reset();
    showMessage('Logged out successfully.', 'success');
    
    // Scroll to admin section
    document.getElementById('admin').scrollIntoView({
        behavior: 'smooth'
    });
});

// Quote Form Submission
quoteForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = new FormData(quoteForm);
    const name = quoteForm.querySelector('input[type="text"]').value;
    const email = quoteForm.querySelector('input[type="email"]').value;
    const service = quoteForm.querySelector('select').value;
    const message = quoteForm.querySelector('textarea').value;
    
    // Create quote request object
    const quoteRequest = {
        name,
        email,
        service,
        message,
        timestamp: new Date().toISOString()
    };
    
    // Save quote request to localStorage (for demo purposes)
    let quoteRequests = JSON.parse(localStorage.getItem('quoteRequests') || '[]');
    quoteRequests.push(quoteRequest);
    localStorage.setItem('quoteRequests', JSON.stringify(quoteRequests));
    
    showMessage('Quote request submitted successfully! We will contact you soon.', 'success');
    quoteForm.reset();
    
    // Log the quote request
    console.log('New quote request:', quoteRequest);
});

// Message Display Function
function showMessage(message, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `${type}-message`;
    messageDiv.textContent = message;
    messageDiv.style.position = 'fixed';
    messageDiv.style.top = '20px';
    messageDiv.style.right = '20px';
    messageDiv.style.zIndex = '9999';
    messageDiv.style.maxWidth = '400px';
    messageDiv.style.padding = '1rem';
    messageDiv.style.borderRadius = '10px';
    messageDiv.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15)';
    messageDiv.style.animation = 'fadeInUp 0.5s ease';
    
    if (type === 'success') {
        messageDiv.style.background = '#10b981';
        messageDiv.style.color = 'white';
    } else if (type === 'error') {
        messageDiv.style.background = '#ef4444';
        messageDiv.style.color = 'white';
    }
    
    document.body.appendChild(messageDiv);
    
    // Remove message after 5 seconds
    setTimeout(() => {
        messageDiv.style.animation = 'fadeOutDown 0.5s ease';
        setTimeout(() => {
            document.body.removeChild(messageDiv);
        }, 500);
    }, 5000);
}

// Animation on Scroll
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

// Observe all service cards and pricing cards
document.querySelectorAll('.service-card, .pricing-card, .promo-item').forEach(card => {
    card.style.opacity = '0';
    observer.observe(card);
});

// Add fade out animation
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeOutDown {
        from {
            opacity: 1;
            transform: translateY(0);
        }
        to {
            opacity: 0;
            transform: translateY(20px);
        }
    }
`;
document.head.appendChild(style);

// Promo Slider Auto-play
const promoSlider = document.querySelector('.promo-slider');
if (promoSlider) {
    let scrollAmount = 0;
    const scrollStep = 1;
    
    setInterval(() => {
        if (promoSlider.scrollWidth > promoSlider.clientWidth) {
            scrollAmount += scrollStep;
            if (scrollAmount >= promoSlider.scrollWidth - promoSlider.clientWidth) {
                scrollAmount = 0;
            }
            promoSlider.scrollLeft = scrollAmount;
        }
    }, 50);
}

// Currency formatter for pricing display
function formatCurrency(amount, currency = 'USD') {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
    }).format(amount);
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    // Add loading animation
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
    
    // Initialize tooltips
    const tooltips = document.querySelectorAll('[title]');
    tooltips.forEach(tooltip => {
        tooltip.addEventListener('mouseenter', (e) => {
            const title = e.target.getAttribute('title');
            const tooltipEl = document.createElement('div');
            tooltipEl.className = 'tooltip';
            tooltipEl.textContent = title;
            tooltipEl.style.cssText = `
                position: absolute;
                background: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 0.5rem;
                border-radius: 5px;
                font-size: 0.9rem;
                z-index: 10000;
                pointer-events: none;
            `;
            document.body.appendChild(tooltipEl);
            
            const rect = e.target.getBoundingClientRect();
            tooltipEl.style.left = rect.left + (rect.width / 2) - (tooltipEl.offsetWidth / 2) + 'px';
            tooltipEl.style.top = rect.top - tooltipEl.offsetHeight - 10 + 'px';
            
            e.target.removeAttribute('title');
            e.target.dataset.tooltip = title;
        });
        
        tooltip.addEventListener('mouseleave', (e) => {
            const tooltipEl = document.querySelector('.tooltip');
            if (tooltipEl) {
                document.body.removeChild(tooltipEl);
            }
            e.target.setAttribute('title', e.target.dataset.tooltip || '');
        });
    });
});

// Export quote requests for admin viewing
window.viewQuoteRequests = function() {
    const requests = JSON.parse(localStorage.getItem('quoteRequests') || '[]');
    console.log('Quote Requests:', requests);
    return requests;
};

// Clear all data function for admin
window.clearAllData = function() {
    if (confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
        localStorage.clear();
        showMessage('All data cleared successfully.', 'success');
        setTimeout(() => {
            location.reload();
        }, 2000);
    }
};

// Export admin functions to global scope for debugging
window.adminFunctions = {
    viewQuoteRequests,
    clearAllData,
    showMessage
};