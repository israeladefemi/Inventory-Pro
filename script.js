// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeCharts();
    initializeNavigation();
    initializeSearch();
    initializeAnimations();
});

// Initialize Charts
function initializeCharts() {
    const ctx = document.getElementById('salesChart');
    if (!ctx) return;

    const salesData = {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
            label: 'Sales (₦)',
            data: [2800000, 3200000, 2900000, 3500000, 4080000, 4200000, 3800000],
            borderColor: '#667eea',
            backgroundColor: 'rgba(102, 126, 234, 0.1)',
            borderWidth: 3,
            fill: true,
            tension: 0.4,
            pointBackgroundColor: '#667eea',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            pointRadius: 6,
            pointHoverRadius: 8
        }]
    };

    const config = {
        type: 'line',
        data: salesData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '₦' + (value / 1000000).toFixed(1) + 'M';
                        }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            }
        }
    };

    new Chart(ctx, config);
}

// Initialize Navigation
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage) {
            link.parentElement.classList.add('active');
        }

        link.addEventListener('click', function(e) {
            // Remove active class from all nav items
            document.querySelectorAll('.nav-item').forEach(item => {
                item.classList.remove('active');
            });

            // Add active class to clicked item
            this.parentElement.classList.add('active');
        });
    });
}

// Initialize Search Functionality
function initializeSearch() {
    const searchInput = document.querySelector('.search-bar input');
    if (!searchInput) return;

    searchInput.addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase();
        
        // Add search functionality here
        console.log('Searching for:', searchTerm);
        
        // Example: Highlight matching text
        if (searchTerm.length > 2) {
            highlightSearchResults(searchTerm);
        } else {
            removeSearchHighlights();
        }
    });

    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch(this.value);
        }
    });
}

// Highlight search results
function highlightSearchResults(searchTerm) {
    const elements = document.querySelectorAll('.stat-content h3, .product-info h4, .activity-content h4');
    
    elements.forEach(element => {
        const text = element.textContent;
        const regex = new RegExp(`(${searchTerm})`, 'gi');
        element.innerHTML = text.replace(regex, '<mark style="background-color: #fbbf24; padding: 2px 4px; border-radius: 3px;">$1</mark>');
    });
}

// Remove search highlights
function removeSearchHighlights() {
    const marks = document.querySelectorAll('mark');
    marks.forEach(mark => {
        mark.outerHTML = mark.textContent;
    });
}

// Perform search
function performSearch(searchTerm) {
    // This would typically make an API call
    console.log('Performing search for:', searchTerm);
    
    // Show search results modal or navigate to search page
    showNotification(`Searching for: ${searchTerm}`, 'info');
}

// Initialize Animations
function initializeAnimations() {
    // Animate stats cards on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe all stat cards
    document.querySelectorAll('.stat-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });

    // Add hover effects to activity items
    document.querySelectorAll('.activity-item').forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(5px)';
        });

        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0)';
        });
    });
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close">&times;</button>
    `;

    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#667eea'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 1000;
        display: flex;
        align-items: center;
        gap: 1rem;
        animation: slideIn 0.3s ease;
        max-width: 400px;
    `;

    document.body.appendChild(notification);

    // Auto remove after 5 seconds
    setTimeout(() => {
        removeNotification(notification);
    }, 5000);

    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        removeNotification(notification);
    });
}

// Remove notification
function removeNotification(notification) {
    notification.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }

    .notification-close {
        background: none;
        border: none;
        color: white;
        font-size: 1.2rem;
        cursor: pointer;
        padding: 0;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .notification-content {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
`;
document.head.appendChild(style);

// Utility functions
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN'
    }).format(amount);
}

function formatNumber(num) {
    return new Intl.NumberFormat('en-NG').format(num);
}

// Mock data for demonstration
const mockData = {
    products: [
        { id: 1, name: 'VISCA 100AH BATTERY', price: 80000, stock: 15, category: 'Car Batteries' },
        { id: 2, name: 'SOLITE 100AH', price: 125000, stock: 8, category: 'Car Batteries' },
        { id: 3, name: 'RUN ALL 90AH BATTERY', price: 70000, stock: 22, category: 'Car Batteries' },
        { id: 4, name: 'VISCA 80AH L Exe European Standard Batt', price: 85000, stock: 12, category: 'Car Batteries' },
        { id: 5, name: 'RUN-ALL 75AH BATTERY', price: 49500, stock: 45, category: 'Car Batteries' }
    ],
    customers: [
        { id: 1, name: 'EXPRESS AUTO', type: 'wholesale', email: 'contact@expressauto.com' },
        { id: 2, name: 'Premium Auto Parts', type: 'wholesale', email: 'info@premiumauto.com' },
        { id: 3, name: 'Walk-in Customer', type: 'retail', email: null }
    ],
    sales: [
        { id: 1, customer: 'EXPRESS AUTO', amount: 4080000, date: '2025-07-14', status: 'paid' },
        { id: 2, customer: 'Premium Auto Parts', amount: 1250000, date: '2025-07-13', status: 'pending' },
        { id: 3, customer: 'Walk-in Customer', amount: 78000, date: '2025-07-14', status: 'paid' }
    ]
};

// Export for use in other files
window.InventoryApp = {
    showNotification,
    formatCurrency,
    formatNumber,
    mockData
}; 