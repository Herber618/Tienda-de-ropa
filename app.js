/**
 * Aplicación Principal - Sistema de Tienda de Ropa
 * Maneja la interfaz de usuario y las interacciones del inventario
 */

if (!window.TiendaApp) {
    class TiendaApp {
    constructor() {
        this.currentEditId = null;
        this.currentDeleteId = null;
        this.searchTimeout = null;
        this.productos = [];
        this.filteredProductos = [];
        
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }

    async init() {
        console.log(' Inicializando aplicación de tienda...');
        
        // Verificar conexión disponible
        if (!window.supabaseConnection || !window.supabaseConnection.isInitialized) {
            console.error(' Conexión con Supabase no disponible');
            this.renderTable();
            return;
        }

        this.setupEventListeners();
        
        // Intentar cargar productos, pero no fallar si hay error
        try {
            await this.loadProductos();
        } catch (err) {
            console.error(' Error inicial al cargar productos:', err);
            this.renderTable(); // Mostrar tabla vacía al menos
        }
        
        console.log(' Aplicación inicializada correctamente');
    }

    setupEventListeners() {
        const productForm = document.getElementById('productForm');
        if (productForm) {
            productForm.addEventListener('submit', (e) => this.handleFormSubmit(e));
        }

        const editForm = document.getElementById('editProductForm');
        if (editForm) {
            editForm.addEventListener('submit', (e) => this.handleEditSubmit(e));
        }

        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => this.handleSearch(e));
        }

        const refreshBtn = document.getElementById('refreshTable');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => this.loadProductos());
        }

        const closeButtons = document.querySelectorAll('.close');
        closeButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.closeModal(e.target.closest('.modal')));
        });

        const cancelEditBtn = document.getElementById('cancelEdit');
        const saveEditBtn = document.getElementById('saveEdit');
        if (cancelEditBtn) {
            cancelEditBtn.addEventListener('click', () => this.closeEditModal());
        }
        if (saveEditBtn) {
            saveEditBtn.addEventListener('click', () => this.handleEditSubmit());
        }

        const confirmDeleteBtn = document.getElementById('confirmDelete');
        const cancelDeleteBtn = document.getElementById('cancelDelete');
        
        if (confirmDeleteBtn) {
            confirmDeleteBtn.addEventListener('click', () => this.confirmDelete());
        }
        
        if (cancelDeleteBtn) {
            cancelDeleteBtn.addEventListener('click', () => this.closeDeleteModal());
        }

        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeModal(e.target);
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAllModals();
            }
        });
    }

    async handleFormSubmit(e) {
        e.preventDefault();
        
        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        try {
            submitBtn.innerHTML = '<span class="loading"></span>Guardando...';
            submitBtn.disabled = true;

            const formData = new FormData(e.target);
            const productoData = Object.fromEntries(formData.entries());

            const result = await window.supabaseConnection.createProducto(productoData);

            if (result.success) {
                this.showNotification(' Producto agregado exitosamente', 'success');
                e.target.reset();
                await this.loadProductos();
            } else {
                this.showNotification(result.message, 'error');
            }

        } catch (error) {
            console.error('Error en formulario:', error);
            this.showNotification(' Error inesperado: ' + error.message, 'error');
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }

    async handleEditSubmit(e) {
        if (e) e.preventDefault();
        
        if (!this.currentEditId) {
            this.showNotification('Error: ID de producto no válido', 'error');
            return;
        }

        const submitBtn = document.getElementById('saveEdit');
        const originalText = submitBtn.innerHTML;
        
        try {
            submitBtn.innerHTML = '<span class="loading"></span>Guardando...';
            submitBtn.disabled = true;

            const formData = new FormData(document.getElementById('editProductForm'));
            const productoData = Object.fromEntries(formData.entries());

            const result = await window.supabaseConnection.updateProducto(this.currentEditId, productoData);

            if (result.success) {
                this.showNotification(' Producto actualizado exitosamente', 'success');
                this.closeEditModal();
                await this.loadProductos();
            } else {
                this.showNotification(result.message, 'error');
            }

        } catch (error) {
            console.error('Error al actualizar:', error);
            this.showNotification(' Error inesperado: ' + error.message, 'error');
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }

    handleSearch(e) {
        const searchTerm = e.target.value.trim().toLowerCase();
        
        clearTimeout(this.searchTimeout);
        this.searchTimeout = setTimeout(() => {
            this.filterProductos(searchTerm);
        }, 300);
    }

    filterProductos(searchTerm) {
        if (!searchTerm) {
            this.filteredProductos = [...this.productos];
        } else {
            this.filteredProductos = this.productos.filter(producto => {
                const searchText = (producto.nombre + ' ' + producto.categoria + ' ' + producto.color + ' ' + producto.sku).toLowerCase();
                return searchText.includes(searchTerm);
            });
        }
        
        this.renderTable();
    }

    async loadProductos() {
        const refreshBtn = document.getElementById('refreshTable');
        let originalText = '';
        
        try {
            // Verificar que la conexión está disponible
            if (!window.supabaseConnection || !window.supabaseConnection.isInitialized) {
                console.warn(' Conexión no inicializada');
                this.productos = [];
                this.filteredProductos = [];
                this.renderTable();
                return;
            }

            originalText = refreshBtn ? refreshBtn.innerHTML : 'Actualizar';
            
            if (refreshBtn) {
                refreshBtn.innerHTML = '<span class="loading"></span>Cargando...';
                refreshBtn.disabled = true;
            }

            // Timeout máximo de 10 segundos
            const timeoutPromise = new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Timeout al cargar productos')), 10000)
            );

            const result = await Promise.race([
                window.supabaseConnection.getAllProductos(),
                timeoutPromise
            ]);

            if (result.success) {
                this.productos = result.data || [];
                this.filteredProductos = [...this.productos];
                this.renderTable();
                
                if (result.count !== undefined) {
                    this.showNotification(' ' + result.count + ' productos cargados', 'info');
                }
            } else {
                console.warn('Error cargando productos:', result.message);
                this.showNotification(result.message, 'error');
                this.productos = [];
                this.filteredProductos = [];
                this.renderTable();
            }

        } catch (error) {
            console.error('Error al cargar productos:', error);
            this.showNotification(' Verifica que la tabla "productos" existe en Supabase', 'error');
            this.productos = [];
            this.filteredProductos = [];
            this.renderTable();
        } finally {
            if (refreshBtn) {
                refreshBtn.innerHTML = originalText;
                refreshBtn.disabled = false;
            }
        }
    }

    renderTable() {
        const tableBody = document.getElementById('productosTableBody');
        if (!tableBody) return;

        tableBody.innerHTML = '';

        if (this.filteredProductos.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="10" style="text-align: center; padding: 40px; color: #666;"><strong>No se encontraron productos en el inventario</strong></td></tr>';
            return;
        }

        this.filteredProductos.forEach(producto => {
            const row = this.createTableRow(producto);
            tableBody.appendChild(row);
        });
    }

    createTableRow(producto) {
        const row = document.createElement('tr');
        
        let stockClass = 'stock-ok';
        if (producto.stock === 0) {
            stockClass = 'stock-agotado';
        } else if (producto.stock < 10) {
            stockClass = 'stock-bajo';
        }

        row.innerHTML = '<td>' + producto.id + '</td><td>' + this.escapeHtml(producto.nombre) + '</td><td>' + this.escapeHtml(producto.categoria) + '</td><td>' + this.escapeHtml(producto.talla) + '</td><td>' + this.escapeHtml(producto.color) + '</td><td>' + this.escapeHtml(producto.material) + '</td><td>$' + parseFloat(producto.precio).toFixed(2) + '</td><td class="' + stockClass + '">' + producto.stock + '</td><td>' + this.escapeHtml(producto.sku) + '</td><td><button class="btn btn-edit" onclick="app.editProducto(' + producto.id + ')" title="Editar"></button><button class="btn btn-delete" onclick="app.deleteProducto(' + producto.id + ', \'' + this.escapeHtml(producto.nombre) + '\');" title="Eliminar"></button></td>';

        return row;
    }

    async editProducto(id) {
        try {
            const result = await window.supabaseConnection.getProductoById(id);

            if (result.success && result.data) {
                this.currentEditId = id;
                this.fillEditForm(result.data);
                this.openEditModal();
            } else {
                this.showNotification(' Error al cargar datos del producto', 'error');
            }

        } catch (error) {
            console.error('Error al editar producto:', error);
            this.showNotification(' Error inesperado: ' + error.message, 'error');
        }
    }

    fillEditForm(producto) {
        document.getElementById('editNombre').value = producto.nombre;
        document.getElementById('editCategoria').value = producto.categoria;
        document.getElementById('editTalla').value = producto.talla;
        document.getElementById('editColor').value = producto.color;
        document.getElementById('editMaterial').value = producto.material;
        document.getElementById('editSku').value = producto.sku;
        document.getElementById('editPrecio').value = producto.precio;
        document.getElementById('editStock').value = producto.stock;
        document.getElementById('editDescripcion').value = producto.descripcion || '';
    }

    deleteProducto(id, name) {
        this.currentDeleteId = id;
        document.getElementById('deleteProductName').textContent = name;
        this.openDeleteModal();
    }

    async confirmDelete() {
        if (!this.currentDeleteId) {
            this.showNotification('Error: ID de producto no válido', 'error');
            return;
        }

        const confirmBtn = document.getElementById('confirmDelete');
        const originalText = confirmBtn.innerHTML;

        try {
            confirmBtn.innerHTML = '<span class="loading"></span>Eliminando...';
            confirmBtn.disabled = true;

            const result = await window.supabaseConnection.deleteProducto(this.currentDeleteId);

            if (result.success) {
                this.showNotification(' Producto eliminado correctamente', 'success');
                this.closeDeleteModal();
                await this.loadProductos();
            } else {
                this.showNotification(result.message, 'error');
            }

        } catch (error) {
            console.error('Error al eliminar:', error);
            this.showNotification(' Error inesperado: ' + error.message, 'error');
        } finally {
            confirmBtn.innerHTML = originalText;
            confirmBtn.disabled = false;
        }
    }

    openEditModal() {
        const modal = document.getElementById('editModal');
        if (modal) {
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }
    }

    closeEditModal() {
        const modal = document.getElementById('editModal');
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
            this.currentEditId = null;
            document.getElementById('editProductForm').reset();
        }
    }

    openDeleteModal() {
        const modal = document.getElementById('deleteModal');
        if (modal) {
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }
    }

    closeDeleteModal() {
        const modal = document.getElementById('deleteModal');
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
            this.currentDeleteId = null;
        }
    }

    closeModal(modal) {
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }

    closeAllModals() {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            modal.style.display = 'none';
        });
        document.body.style.overflow = 'auto';
        this.currentEditId = null;
        this.currentDeleteId = null;
    }

    showNotification(message, type) {
        if (!type) type = 'info';
        const container = document.getElementById('notificationContainer');
        if (!container) return;

        const notification = document.createElement('div');
        notification.className = 'notification ' + type;
        notification.textContent = message;
        
        container.appendChild(notification);

        setTimeout(() => {
            notification.style.opacity = '1';
        }, 10);

        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, (window.APP_CONFIG && window.APP_CONFIG.notifications && window.APP_CONFIG.notifications.duration) || 4000);
    }

    escapeHtml(unsafe) {
        if (typeof unsafe !== 'string') return '';
        return unsafe.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
    }
}

window.showNotification = function(message, type) {
    if (window.app && typeof window.app.showNotification === 'function') {
        window.app.showNotification(message, type);
    }
};

    window.app = new TiendaApp();
}
