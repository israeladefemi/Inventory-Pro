// Inventory Management JavaScript

// Global variables
let inventory = [];
let editingProduct = null;
let selectedProduct = null;

// Initialize inventory when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    loadInventory();
    setupEventListeners();
});

// Load sample inventory data
function loadInventory() {
    inventory = [
        {
            id: 1,
            name: 'VISCA 100AH BATTERY',
            sku: 'VISCA-100AH',
            category: 'batteries',
            brand: 'VISCA',
            price: 80000,
            stock: 15,
            minStock: 5,
            barcode: '1234567890',
            description: 'High-performance 100AH car battery',
            status: 'active',
            value: 1200000
        },
        {
            id: 2,
            name: 'SOLITE 100AH',
            sku: 'SOLITE-100AH',
            category: 'batteries',
            brand: 'SOLITE',
            price: 125000,
            stock: 8,
            minStock: 5,
            barcode: '1234567891',
            description: 'Premium 100AH battery for heavy vehicles',
            status: 'active',
            value: 1000000
        },
        {
            id: 3,
            name: 'RUN ALL 90AH BATTERY',
            sku: 'RUN-90AH',
            category: 'batteries',
            brand: 'RUN-ALL',
            price: 70000,
            stock: 22,
            minStock: 5,
            barcode: '1234567892',
            description: 'Reliable 90AH battery for standard vehicles',
            status: 'active',
            value: 1540000
        },
        {
            id: 4,
            name: 'VISCA 80AH L Exe European Standard Batt',
            sku: 'VISCA-80AH',
            category: 'batteries',
            brand: 'VISCA',
            price: 85000,
            stock: 12,
            minStock: 5,
            barcode: '1234567893',
            description: 'European standard 80AH battery',
            status: 'active',
            value: 1020000
        },
        {
            id: 5,
            name: 'RUN-ALL 75AH BATTERY',
            sku: 'RUN-75AH',
            category: 'batteries',
            brand: 'RUN-ALL',
            price: 49500,
            stock: 45,
            minStock: 5,
            barcode: '1234567894',
            description: 'Popular 75AH battery for small vehicles',
            status: 'active',
            value: 2227500
        },
        {
            id: 6,
            name: 'COOL TIGER 75AH BATTERY',
            sku: 'COOL-75AH',
            category: 'batteries',
            brand: 'COOL TIGER',
            price: 49500,
            stock: 30,
            minStock: 5,
            barcode: '1234567895',
            description: 'Cool running 75AH battery',
            status: 'active',
            value: 1485000
        },
        {
            id: 7,
            name: 'KINGLION 75 AH BATTERY',
            sku: 'KING-75AH',
            category: 'batteries',
            brand: 'KINGLION',
            price: 49500,
            stock: 18,
            minStock: 5,
            barcode: '1234567896',
            description: 'King Lion 75AH battery',
            status: 'active',
            value: 891000
        },
        {
            id: 8,
            name: 'VISCA 75AH EXE European Standard Battery',
            sku: 'VISCA-75AH',
            category: 'batteries',
            brand: 'VISCA',
            price: 78000,
            stock: 25,
            minStock: 5,
            barcode: '1234567897',
            description: 'European standard 75AH battery',
            status: 'active',
            value: 1950000
        },
        {
            id: 9,
            name: 'Battery Charger',
            sku: 'CHARGER-01',
            category: 'accessories',
            brand: 'Generic',
            price: 15000,
            stock: 10,
            minStock: 3,
            barcode: '1234567898',
            description: 'Universal battery charger',
            status: 'active',
            value: 150000
        },
        {
            id: 10,
            name: 'Jumper Cables',
            sku: 'JUMPER-01',
            category: 'accessories',
            brand: 'Generic',
            price: 8000,
            stock: 20,
            minStock: 5,
            barcode: '1234567899',
            description: 'Heavy-duty jumper cables',
            status: 'active',
            value: 160000
        }
    ];
    
    renderInventory();
}

// Setup event listeners
function setupEventListeners() {
    // Search functionality
    const searchInput = document.getElementById('inventorySearch');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            filterInventory();
        });
    }
    
    // Filter functionality
    const categoryFilter = document.getElementById('categoryFilter');
    const stockFilter = document.getElementById('stockFilter');
    const sortBy = document.getElementById('sortBy');
    
    if (categoryFilter) {
        categoryFilter.addEventListener('change', filterInventory);
    }
    if (stockFilter) {
        stockFilter.addEventListener('change', filterInventory);
    }
    if (sortBy) {
        sortBy.addEventListener('change', filterInventory);
    }
    
    // Form submission
    const productForm = document.getElementById('productForm');
    if (productForm) {
        productForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveProduct();
        });
    }
}

// Render inventory table
function renderInventory(filteredInventory = null) {
    const tableBody = document.getElementById('inventoryTableBody');
    const inventoryToRender = filteredInventory || inventory;
    
    if (inventoryToRender.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="8">
                    <div class="empty-inventory">
                        <i class="fas fa-box-open"></i>
                        <h3>No products found</h3>
                        <p>Try adjusting your search or filters</p>
                        <button class="btn btn-primary" onclick="openAddProductModal()">
                            <i class="fas fa-plus"></i> Add First Product
                        </button>
                    </div>
                </td>
            </tr>
        `;
        return;
    }
    
    tableBody.innerHTML = '';
    
    inventoryToRender.forEach(product => {
        const row = document.createElement('tr');
        
        const stockStatus = getStockStatus(product);
        const stockBadgeClass = getStockBadgeClass(stockStatus);
        
        row.innerHTML = `
            <td>
                <div class="product-cell">
                    <div class="product-image">
                        <i class="fas fa-battery-full"></i>
                    </div>
                    <div class="product-info">
                        <h4>${product.name}</h4>
                        <p>${product.brand} • ${product.description}</p>
                    </div>
                </div>
            </td>
            <td>${product.sku}</td>
            <td>${formatCategory(product.category)}</td>
            <td>
                <div class="stock-cell">
                    <span class="stock-badge ${stockBadgeClass}">${product.stock}</span>
                    ${stockStatus === 'low' ? '<i class="fas fa-exclamation-triangle" style="color: #f59e0b;"></i>' : ''}
                </div>
            </td>
            <td class="price-cell">₦${formatNumber(product.price)}</td>
            <td class="value-cell">₦${formatNumber(product.value)}</td>
            <td>
                <div class="status-cell">
                    <div class="status-indicator ${product.status}"></div>
                    <span>${product.status}</span>
                </div>
            </td>
            <td>
                <div class="actions-cell">
                    <button class="action-btn edit" onclick="editProduct(${product.id})" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn stock" onclick="openStockModal(${product.id})" title="Adjust Stock">
                        <i class="fas fa-boxes"></i>
                    </button>
                    <button class="action-btn delete" onclick="deleteProduct(${product.id})" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
}

// Filter inventory
function filterInventory() {
    const searchTerm = document.getElementById('inventorySearch').value.toLowerCase();
    const categoryFilter = document.getElementById('categoryFilter').value;
    const stockFilter = document.getElementById('stockFilter').value;
    const sortBy = document.getElementById('sortBy').value;
    
    let filtered = inventory.filter(product => {
        // Search filter
        const matchesSearch = !searchTerm || 
            product.name.toLowerCase().includes(searchTerm) ||
            product.sku.toLowerCase().includes(searchTerm) ||
            product.brand.toLowerCase().includes(searchTerm);
        
        // Category filter
        const matchesCategory = !categoryFilter || product.category === categoryFilter;
        
        // Stock filter
        const stockStatus = getStockStatus(product);
        const matchesStock = !stockFilter || stockStatus === stockFilter;
        
        return matchesSearch && matchesCategory && matchesStock;
    });
    
    // Sort results
    filtered.sort((a, b) => {
        switch (sortBy) {
            case 'name':
                return a.name.localeCompare(b.name);
            case 'stock':
                return b.stock - a.stock;
            case 'price':
                return b.price - a.price;
            case 'value':
                return b.value - a.value;
            default:
                return 0;
        }
    });
    
    renderInventory(filtered);
}

// Get stock status
function getStockStatus(product) {
    if (product.stock === 0) return 'out';
    if (product.stock <= product.minStock) return 'low';
    return 'in';
}

// Get stock badge class
function getStockBadgeClass(status) {
    switch (status) {
        case 'out': return 'out-of-stock';
        case 'low': return 'low-stock';
        default: return 'in-stock';
    }
}

// Format category
function formatCategory(category) {
    return category.charAt(0).toUpperCase() + category.slice(1);
}

// Format number
function formatNumber(num) {
    return new Intl.NumberFormat('en-NG').format(num);
}

// Open add product modal
function openAddProductModal() {
    editingProduct = null;
    document.getElementById('modalTitle').textContent = 'Add New Product';
    document.getElementById('productForm').reset();
    document.getElementById('productModal').style.display = 'block';
}

// Edit product
function editProduct(productId) {
    editingProduct = inventory.find(p => p.id === productId);
    if (!editingProduct) return;
    
    document.getElementById('modalTitle').textContent = 'Edit Product';
    
    // Fill form with product data
    document.getElementById('productName').value = editingProduct.name;
    document.getElementById('productSku').value = editingProduct.sku;
    document.getElementById('productCategory').value = editingProduct.category;
    document.getElementById('productBrand').value = editingProduct.brand;
    document.getElementById('productPrice').value = editingProduct.price;
    document.getElementById('productStock').value = editingProduct.stock;
    document.getElementById('productMinStock').value = editingProduct.minStock;
    document.getElementById('productBarcode').value = editingProduct.barcode;
    document.getElementById('productDescription').value = editingProduct.description;
    
    document.getElementById('productModal').style.display = 'block';
}

// Save product
function saveProduct() {
    const formData = {
        name: document.getElementById('productName').value,
        sku: document.getElementById('productSku').value,
        category: document.getElementById('productCategory').value,
        brand: document.getElementById('productBrand').value,
        price: parseFloat(document.getElementById('productPrice').value),
        stock: parseInt(document.getElementById('productStock').value),
        minStock: parseInt(document.getElementById('productMinStock').value),
        barcode: document.getElementById('productBarcode').value,
        description: document.getElementById('productDescription').value
    };
    
    if (editingProduct) {
        // Update existing product
        Object.assign(editingProduct, formData);
        editingProduct.value = editingProduct.price * editingProduct.stock;
        showNotification('Product updated successfully', 'success');
    } else {
        // Add new product
        const newProduct = {
            ...formData,
            id: Date.now(),
            status: 'active',
            value: formData.price * formData.stock
        };
        inventory.push(newProduct);
        showNotification('Product added successfully', 'success');
    }
    
    closeProductModal();
    renderInventory();
    filterInventory();
}

// Close product modal
function closeProductModal() {
    document.getElementById('productModal').style.display = 'none';
    editingProduct = null;
}

// Delete product
function deleteProduct(productId) {
    if (confirm('Are you sure you want to delete this product?')) {
        inventory = inventory.filter(p => p.id !== productId);
        renderInventory();
        filterInventory();
        showNotification('Product deleted successfully', 'success');
    }
}

// Open stock modal
function openStockModal(productId) {
    selectedProduct = inventory.find(p => p.id === productId);
    if (!selectedProduct) return;
    
    document.getElementById('stockProductName').textContent = selectedProduct.name;
    document.getElementById('currentStock').textContent = selectedProduct.stock;
    document.getElementById('stockAdjustment').value = '';
    document.getElementById('stockReason').value = 'adjustment';
    document.getElementById('stockNotes').value = '';
    
    document.getElementById('stockModal').style.display = 'block';
}

// Close stock modal
function closeStockModal() {
    document.getElementById('stockModal').style.display = 'none';
    selectedProduct = null;
}

// Save stock adjustment
function saveStockAdjustment() {
    if (!selectedProduct) return;
    
    const adjustment = parseInt(document.getElementById('stockAdjustment').value);
    const reason = document.getElementById('stockReason').value;
    const notes = document.getElementById('stockNotes').value;
    
    if (isNaN(adjustment)) {
        showNotification('Please enter a valid adjustment quantity', 'error');
        return;
    }
    
    const newStock = selectedProduct.stock + adjustment;
    if (newStock < 0) {
        showNotification('Stock cannot be negative', 'error');
        return;
    }
    
    selectedProduct.stock = newStock;
    selectedProduct.value = selectedProduct.price * selectedProduct.stock;
    
    closeStockModal();
    renderInventory();
    filterInventory();
    
    showNotification(`Stock adjusted by ${adjustment > 0 ? '+' : ''}${adjustment}`, 'success');
}

// Export inventory
function exportInventory() {
    const csvContent = generateCSV();
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `inventory-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    showNotification('Inventory exported successfully', 'success');
}

// Generate CSV
function generateCSV() {
    const headers = ['Name', 'SKU', 'Category', 'Brand', 'Price', 'Stock', 'Min Stock', 'Value', 'Status'];
    const rows = inventory.map(product => [
        product.name,
        product.sku,
        product.category,
        product.brand,
        product.price,
        product.stock,
        product.minStock,
        product.value,
        product.status
    ]);
    
    return [headers, ...rows].map(row => row.join(',')).join('\n');
}

// Import inventory
function importInventory() {
    showNotification('Import functionality would be implemented here', 'info');
}

// Show notification
function showNotification(message, type = 'info') {
    if (window.InventoryApp && window.InventoryApp.showNotification) {
        window.InventoryApp.showNotification(message, type);
    } else {
        alert(message);
    }
}

// Close modals when clicking outside
window.onclick = function(event) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
}; 