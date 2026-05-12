// POS System JavaScript

// Global variables
let cart = [];
let currentCustomer = { name: 'Walk-in Customer', type: 'retail' };
let currentDiscount = { type: 'percentage', value: 0 };
let products = [];
let customers = [];

// Initialize POS when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializePOS();
    loadProducts();
    loadCustomers();
    setupEventListeners();
});

// Initialize POS System
function initializePOS() {
    // Set up product search
    const productSearch = document.getElementById('productSearch');
    if (productSearch) {
        productSearch.addEventListener('input', function(e) {
            filterProducts(e.target.value);
        });
        
        productSearch.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                const searchTerm = e.target.value.trim();
                if (searchTerm) {
                    addProductBySearch(searchTerm);
                }
            }
        });
    }

    // Set up category tabs
    const categoryTabs = document.querySelectorAll('.category-tab');
    categoryTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const category = this.dataset.category;
            filterByCategory(category);
            
            // Update active tab
            categoryTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Set up customer search
    const customerSearch = document.getElementById('customerSearch');
    if (customerSearch) {
        customerSearch.addEventListener('input', function(e) {
            filterCustomers(e.target.value);
        });
    }
}

// Load sample products
function loadProducts() {
    products = [
        {
            id: 1,
            name: 'VISCA 100AH BATTERY',
            price: 80000,
            stock: 15,
            category: 'batteries',
            sku: 'VISCA-100AH',
            barcode: '1234567890'
        },
        {
            id: 2,
            name: 'SOLITE 100AH',
            price: 125000,
            stock: 8,
            category: 'batteries',
            sku: 'SOLITE-100AH',
            barcode: '1234567891'
        },
        {
            id: 3,
            name: 'RUN ALL 90AH BATTERY',
            price: 70000,
            stock: 22,
            category: 'batteries',
            sku: 'RUN-90AH',
            barcode: '1234567892'
        },
        {
            id: 4,
            name: 'VISCA 80AH L Exe European Standard Batt',
            price: 85000,
            stock: 12,
            category: 'batteries',
            sku: 'VISCA-80AH',
            barcode: '1234567893'
        },
        {
            id: 5,
            name: 'RUN-ALL 75AH BATTERY',
            price: 49500,
            stock: 45,
            category: 'batteries',
            sku: 'RUN-75AH',
            barcode: '1234567894'
        },
        {
            id: 6,
            name: 'COOL TIGER 75AH BATTERY',
            price: 49500,
            stock: 30,
            category: 'batteries',
            sku: 'COOL-75AH',
            barcode: '1234567895'
        },
        {
            id: 7,
            name: 'KINGLION 75 AH BATTERY',
            price: 49500,
            stock: 18,
            category: 'batteries',
            sku: 'KING-75AH',
            barcode: '1234567896'
        },
        {
            id: 8,
            name: 'VISCA 75AH EXE European Standard Battery',
            price: 78000,
            stock: 25,
            category: 'batteries',
            sku: 'VISCA-75AH',
            barcode: '1234567897'
        },
        {
            id: 9,
            name: 'Battery Charger',
            price: 15000,
            stock: 10,
            category: 'accessories',
            sku: 'CHARGER-01',
            barcode: '1234567898'
        },
        {
            id: 10,
            name: 'Jumper Cables',
            price: 8000,
            stock: 20,
            category: 'accessories',
            sku: 'JUMPER-01',
            barcode: '1234567899'
        }
    ];
    
    renderProducts();
}

// Load sample customers
function loadCustomers() {
    customers = [
        {
            id: 1,
            name: 'EXPRESS AUTO',
            email: 'contact@expressauto.com',
            phone: '+234-801-234-5678',
            type: 'wholesale'
        },
        {
            id: 2,
            name: 'Premium Auto Parts',
            email: 'info@premiumauto.com',
            phone: '+234-802-345-6789',
            type: 'wholesale'
        },
        {
            id: 3,
            name: 'City Motors',
            email: 'sales@citymotors.com',
            phone: '+234-803-456-7890',
            type: 'wholesale'
        },
        {
            id: 4,
            name: 'John Doe',
            email: 'john.doe@email.com',
            phone: '+234-804-567-8901',
            type: 'retail'
        },
        {
            id: 5,
            name: 'Jane Smith',
            email: 'jane.smith@email.com',
            phone: '+234-805-678-9012',
            type: 'retail'
        }
    ];
}

// Render products in grid
function renderProducts(filteredProducts = null) {
    const productGrid = document.getElementById('productGrid');
    const productsToRender = filteredProducts || products;
    
    productGrid.innerHTML = '';
    
    productsToRender.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.onclick = () => addToCart(product);
        
        productCard.innerHTML = `
            <div class="product-image">
                <i class="fas fa-battery-full"></i>
            </div>
            <div class="product-name">${product.name}</div>
            <div class="product-price">₦${formatNumber(product.price)}</div>
            <div class="product-stock ${product.stock < 10 ? 'low' : ''}">
                ${product.stock} in stock
            </div>
        `;
        
        productGrid.appendChild(productCard);
    });
}

// Filter products by search term
function filterProducts(searchTerm) {
    if (!searchTerm) {
        renderProducts();
        return;
    }
    
    const filtered = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.barcode.includes(searchTerm)
    );
    
    renderProducts(filtered);
}

// Filter products by category
function filterByCategory(category) {
    if (category === 'all') {
        renderProducts();
        return;
    }
    
    const filtered = products.filter(product => product.category === category);
    renderProducts(filtered);
}

// Add product to cart
function addToCart(product) {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    updateCartDisplay();
    updateCartSummary();
    
    // Show notification
    showNotification(`${product.name} added to cart`, 'success');
}

// Add product by search
function addProductBySearch(searchTerm) {
    const product = products.find(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.barcode === searchTerm
    );
    
    if (product) {
        addToCart(product);
        document.getElementById('productSearch').value = '';
        renderProducts();
    } else {
        showNotification('Product not found', 'error');
    }
}

// Update cart display
function updateCartDisplay() {
    const cartItems = document.getElementById('cartItems');
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<div class="empty-cart">No items in cart</div>';
        return;
    }
    
    cartItems.innerHTML = '';
    
    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        
        cartItem.innerHTML = `
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">₦${formatNumber(item.price)} each</div>
            </div>
            <div class="cart-item-controls">
                <div class="quantity-controls">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                    <span class="quantity-display">${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                </div>
                <div class="cart-item-total">₦${formatNumber(item.price * item.quantity)}</div>
                <button class="remove-item" onclick="removeFromCart(${item.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        
        cartItems.appendChild(cartItem);
    });
}

// Update item quantity
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    
    if (item) {
        item.quantity += change;
        
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            updateCartDisplay();
            updateCartSummary();
        }
    }
}

// Remove item from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartDisplay();
    updateCartSummary();
    
    showNotification('Item removed from cart', 'info');
}

// Update cart summary
function updateCartSummary() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.075; // 7.5% tax
    const discountAmount = calculateDiscount(subtotal);
    const total = subtotal + tax - discountAmount;
    
    document.getElementById('subtotal').textContent = `₦${formatNumber(subtotal)}`;
    document.getElementById('tax').textContent = `₦${formatNumber(tax)}`;
    document.getElementById('total').textContent = `₦${formatNumber(total)}`;
    
    // Show/hide discount row
    const discountRow = document.querySelector('.discount-row');
    if (discountAmount > 0) {
        discountRow.style.display = 'flex';
        document.getElementById('discount').textContent = `-₦${formatNumber(discountAmount)}`;
    } else {
        discountRow.style.display = 'none';
    }
}

// Calculate discount
function calculateDiscount(subtotal) {
    if (currentDiscount.type === 'percentage') {
        return subtotal * (currentDiscount.value / 100);
    } else {
        return Math.min(currentDiscount.value, subtotal);
    }
}

// Clear cart
function clearCart() {
    if (cart.length === 0) {
        showNotification('Cart is already empty', 'info');
        return;
    }
    
    if (confirm('Are you sure you want to clear the cart?')) {
        cart = [];
        currentDiscount = { type: 'percentage', value: 0 };
        updateCartDisplay();
        updateCartSummary();
        showNotification('Cart cleared', 'success');
    }
}

// Customer modal functions
function openCustomerModal() {
    const modal = document.getElementById('customerModal');
    modal.style.display = 'block';
    renderCustomerList();
}

function closeCustomerModal() {
    const modal = document.getElementById('customerModal');
    modal.style.display = 'none';
}

function renderCustomerList() {
    const customerList = document.getElementById('customerList');
    customerList.innerHTML = '';
    
    customers.forEach(customer => {
        const customerItem = document.createElement('div');
        customerItem.className = 'customer-item';
        customerItem.onclick = () => selectCustomer(customer);
        
        customerItem.innerHTML = `
            <div class="customer-item-name">${customer.name}</div>
            <div class="customer-item-email">${customer.email} • ${customer.type}</div>
        `;
        
        customerList.appendChild(customerItem);
    });
}

function selectCustomer(customer) {
    currentCustomer = customer;
    document.getElementById('customerName').textContent = customer.name;
    closeCustomerModal();
    showNotification(`Customer selected: ${customer.name}`, 'success');
}

function filterCustomers(searchTerm) {
    const customerList = document.getElementById('customerList');
    customerList.innerHTML = '';
    
    const filtered = customers.filter(customer => 
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    filtered.forEach(customer => {
        const customerItem = document.createElement('div');
        customerItem.className = 'customer-item';
        customerItem.onclick = () => selectCustomer(customer);
        
        customerItem.innerHTML = `
            <div class="customer-item-name">${customer.name}</div>
            <div class="customer-item-email">${customer.email} • ${customer.type}</div>
        `;
        
        customerList.appendChild(customerItem);
    });
}

// Discount modal functions
function openDiscountModal() {
    const modal = document.getElementById('discountModal');
    modal.style.display = 'block';
    document.getElementById('discountValue').value = currentDiscount.value;
}

function closeDiscountModal() {
    const modal = document.getElementById('discountModal');
    modal.style.display = 'none';
}

function applyDiscount() {
    const value = parseFloat(document.getElementById('discountValue').value) || 0;
    const type = document.querySelector('input[name="discountType"]:checked').value;
    
    currentDiscount = { type, value };
    updateCartSummary();
    closeDiscountModal();
    
    showNotification(`Discount applied: ${value}${type === 'percentage' ? '%' : '₦'}`, 'success');
}

// Complete sale
function completeSale() {
    if (cart.length === 0) {
        showNotification('Cart is empty', 'error');
        return;
    }
    
    const paymentMethod = document.querySelector('input[name="payment"]:checked').value;
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.075;
    const discountAmount = calculateDiscount(subtotal);
    const total = subtotal + tax - discountAmount;
    
    // Generate sale data
    const sale = {
        id: Date.now(),
        customer: currentCustomer,
        items: cart,
        subtotal,
        tax,
        discount: discountAmount,
        total,
        paymentMethod,
        date: new Date().toISOString(),
        saleNumber: `POS-${Date.now().toString().slice(-6)}`
    };
    
    // Show receipt
    showReceipt(sale);
    
    // Clear cart
    cart = [];
    currentDiscount = { type: 'percentage', value: 0 };
    updateCartDisplay();
    updateCartSummary();
    
    showNotification('Sale completed successfully!', 'success');
}

// Show receipt
function showReceipt(sale) {
    const modal = document.getElementById('receiptModal');
    const receiptContent = document.getElementById('receiptContent');
    
    receiptContent.innerHTML = `
        <div class="receipt-header">
            <div class="receipt-title">MIGHTY RISE AUTO POINT</div>
            <div class="receipt-info">
                Zone D Exodus Block, Suite 17<br>
                Aspamda Plaza Trade Fair Complex<br>
                Badagry Expressway, Ojo Lagos<br>
                Tel: 09030009568, 09030009569
            </div>
        </div>
        
        <div class="receipt-info">
            <strong>Sale #:</strong> ${sale.saleNumber}<br>
            <strong>Date:</strong> ${new Date(sale.date).toLocaleDateString()}<br>
            <strong>Time:</strong> ${new Date(sale.date).toLocaleTimeString()}<br>
            <strong>Customer:</strong> ${sale.customer.name}<br>
            <strong>Payment:</strong> ${sale.paymentMethod.toUpperCase()}
        </div>
        
        <div class="receipt-items">
            ${sale.items.map(item => `
                <div class="receipt-item">
                    <span>${item.name} x${item.quantity}</span>
                    <span>₦${formatNumber(item.price * item.quantity)}</span>
                </div>
            `).join('')}
        </div>
        
        <div class="receipt-total">
            <div class="receipt-item">
                <span>Subtotal:</span>
                <span>₦${formatNumber(sale.subtotal)}</span>
            </div>
            <div class="receipt-item">
                <span>Tax (7.5%):</span>
                <span>₦${formatNumber(sale.tax)}</span>
            </div>
            ${sale.discount > 0 ? `
                <div class="receipt-item">
                    <span>Discount:</span>
                    <span>-₦${formatNumber(sale.discount)}</span>
                </div>
            ` : ''}
            <div class="receipt-item">
                <span><strong>TOTAL:</strong></span>
                <span><strong>₦${formatNumber(sale.total)}</strong></span>
            </div>
        </div>
        
        <div class="receipt-info" style="text-align: center; margin-top: 1rem;">
            Thank you for your purchase!<br>
            Please come again.
        </div>
    `;
    
    modal.style.display = 'block';
}

function closeReceiptModal() {
    const modal = document.getElementById('receiptModal');
    modal.style.display = 'none';
}

// Utility functions
function formatNumber(num) {
    return new Intl.NumberFormat('en-NG').format(num);
}

function showNotification(message, type = 'info') {
    if (window.InventoryApp && window.InventoryApp.showNotification) {
        window.InventoryApp.showNotification(message, type);
    } else {
        alert(message);
    }
}

// Simulate barcode scan
function simulateBarcodeScan() {
    const barcodes = ['1234567890', '1234567891', '1234567892', '1234567893', '1234567894'];
    const randomBarcode = barcodes[Math.floor(Math.random() * barcodes.length)];
    
    document.getElementById('productSearch').value = randomBarcode;
    addProductBySearch(randomBarcode);
    
    showNotification(`Barcode scanned: ${randomBarcode}`, 'info');
}

// Hold sale
function holdSale() {
    if (cart.length === 0) {
        showNotification('Cart is empty', 'error');
        return;
    }
    
    showNotification('Sale held successfully', 'success');
}

// Print receipt
function printReceipt() {
    if (cart.length === 0) {
        showNotification('No sale to print', 'error');
        return;
    }
    
    // Simulate printing
    showNotification('Printing receipt...', 'info');
    setTimeout(() => {
        showNotification('Receipt printed successfully', 'success');
    }, 2000);
}

// Add new customer
function addNewCustomer() {
    showNotification('Add new customer functionality would be implemented here', 'info');
}

// Setup event listeners
function setupEventListeners() {
    // Close modals when clicking outside
    window.onclick = function(event) {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });
    };
    
    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + Enter to complete sale
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            completeSale();
        }
        
        // Escape to close modals
        if (e.key === 'Escape') {
            const modals = document.querySelectorAll('.modal');
            modals.forEach(modal => {
                if (modal.style.display === 'block') {
                    modal.style.display = 'none';
                }
            });
        }
    });
} 