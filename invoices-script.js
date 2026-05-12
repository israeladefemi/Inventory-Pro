// Invoices Management JavaScript

// Sample invoice data
let invoices = [
    {
        id: 1,
        invoiceNumber: 'INV-2025-007',
        customer: 'EXPRESS AUTO',
        date: '2025-07-14',
        dueDate: '2025-08-13',
        amount: 4080000,
        status: 'paid'
    },
    {
        id: 2,
        invoiceNumber: 'INV-2025-008',
        customer: 'Premium Auto Parts',
        date: '2025-07-15',
        dueDate: '2025-08-14',
        amount: 1250000,
        status: 'pending'
    },
    {
        id: 3,
        invoiceNumber: 'INV-2025-009',
        customer: 'City Motors',
        date: '2025-07-10',
        dueDate: '2025-08-09',
        amount: 2500000,
        status: 'overdue'
    }
];

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    renderInvoices();
    setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
    // Search functionality
    const searchInput = document.getElementById('invoiceSearch');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            filterInvoices();
        });
    }
    
    // Filter functionality
    const statusFilter = document.getElementById('statusFilter');
    const customerFilter = document.getElementById('customerFilter');
    const dateFilter = document.getElementById('dateFilter');
    
    if (statusFilter) statusFilter.addEventListener('change', filterInvoices);
    if (customerFilter) customerFilter.addEventListener('change', filterInvoices);
    if (dateFilter) dateFilter.addEventListener('change', filterInvoices);
}

// Render invoices table
function renderInvoices(filteredInvoices = null) {
    const tableBody = document.getElementById('invoiceTableBody');
    const invoicesToRender = filteredInvoices || invoices;
    
    if (invoicesToRender.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="8" style="text-align: center; padding: 2rem;">
                    <div style="color: #64748b;">
                        <i class="fas fa-file-invoice" style="font-size: 2rem; margin-bottom: 1rem; display: block;"></i>
                        <h3>No invoices found</h3>
                        <p>Try adjusting your search or filters</p>
                    </div>
                </td>
            </tr>
        `;
        return;
    }
    
    tableBody.innerHTML = '';
    
    invoicesToRender.forEach(invoice => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>
                <input type="checkbox" value="${invoice.id}">
            </td>
            <td>
                <strong>${invoice.invoiceNumber}</strong>
            </td>
            <td>${invoice.customer}</td>
            <td>${formatDate(invoice.date)}</td>
            <td>${formatDate(invoice.dueDate)}</td>
            <td>₦${formatNumber(invoice.amount)}</td>
            <td>
                <span class="status-badge ${invoice.status}">${invoice.status}</span>
            </td>
            <td>
                <div style="display: flex; gap: 0.5rem;">
                    <button class="action-btn edit" onclick="viewInvoice(${invoice.id})" title="View">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="action-btn edit" onclick="editInvoice(${invoice.id})" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete" onclick="deleteInvoice(${invoice.id})" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
}

// Filter invoices
function filterInvoices() {
    const searchTerm = document.getElementById('invoiceSearch').value.toLowerCase();
    const statusFilter = document.getElementById('statusFilter').value;
    const customerFilter = document.getElementById('customerFilter').value;
    
    let filtered = invoices.filter(invoice => {
        const matchesSearch = !searchTerm || 
            invoice.invoiceNumber.toLowerCase().includes(searchTerm) ||
            invoice.customer.toLowerCase().includes(searchTerm);
        
        const matchesStatus = !statusFilter || invoice.status === statusFilter;
        const matchesCustomer = !customerFilter || invoice.customer === customerFilter;
        
        return matchesSearch && matchesStatus && matchesCustomer;
    });
    
    renderInvoices(filtered);
}

// Format date
function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-NG');
}

// Format number
function formatNumber(num) {
    return new Intl.NumberFormat('en-NG').format(num);
}

// Toggle select all
function toggleSelectAll() {
    const selectAll = document.getElementById('selectAll');
    const checkboxes = document.querySelectorAll('#invoiceTableBody input[type="checkbox"]');
    
    checkboxes.forEach(checkbox => {
        checkbox.checked = selectAll.checked;
    });
}

// Open create invoice modal
function openCreateInvoiceModal() {
    document.getElementById('invoiceModalTitle').textContent = 'Create New Invoice';
    document.getElementById('invoiceForm').reset();
    
    // Set default dates
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('invoiceDate').value = today;
    
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 30);
    document.getElementById('dueDate').value = dueDate.toISOString().split('T')[0];
    
    document.getElementById('invoiceModal').style.display = 'block';
}

// Close invoice modal
function closeInvoiceModal() {
    document.getElementById('invoiceModal').style.display = 'none';
}

// Close invoice preview modal
function closeInvoicePreviewModal() {
    document.getElementById('invoicePreviewModal').style.display = 'none';
}

// View invoice
function viewInvoice(id) {
    const invoice = invoices.find(inv => inv.id === id);
    if (!invoice) return;
    
    // Generate preview content
    const preview = document.getElementById('invoicePreview');
    preview.innerHTML = `
        <div style="text-align: center; margin-bottom: 2rem;">
            <h2>MIGHTY RISE AUTO POINT</h2>
            <p>Zone D Exodus Block, Suite 17<br>
            Aspamda Plaza Trade Fair Complex<br>
            Badagry Expressway, Ojo Lagos</p>
        </div>
        
        <div style="margin-bottom: 2rem;">
            <strong>Invoice #:</strong> ${invoice.invoiceNumber}<br>
            <strong>Date:</strong> ${formatDate(invoice.date)}<br>
            <strong>Due Date:</strong> ${formatDate(invoice.dueDate)}<br>
            <strong>Customer:</strong> ${invoice.customer}
        </div>
        
        <div style="border-top: 1px solid #e2e8f0; padding-top: 1rem;">
            <div style="display: flex; justify-content: space-between; font-weight: bold;">
                <span>Total Amount:</span>
                <span>₦${formatNumber(invoice.amount)}</span>
            </div>
        </div>
    `;
    
    document.getElementById('invoicePreviewModal').style.display = 'block';
}

// Edit invoice
function editInvoice(id) {
    showNotification('Edit functionality would be implemented here', 'info');
}

// Delete invoice
function deleteInvoice(id) {
    if (confirm('Are you sure you want to delete this invoice?')) {
        invoices = invoices.filter(inv => inv.id !== id);
        renderInvoices();
        showNotification('Invoice deleted successfully', 'success');
    }
}

// Export invoices
function exportInvoices() {
    showNotification('Export functionality would be implemented here', 'info');
}

// Bulk actions
function bulkActions() {
    showNotification('Bulk actions would be implemented here', 'info');
}

// Print invoice
function printInvoice() {
    showNotification('Print functionality would be implemented here', 'info');
}

// Send invoice
function sendInvoice() {
    showNotification('Send functionality would be implemented here', 'info');
}

// Save as draft
function saveAsDraft() {
    showNotification('Save as draft functionality would be implemented here', 'info');
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