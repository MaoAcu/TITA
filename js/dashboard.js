// ===== CONFIGURACIÓN INICIAL =====
const nombresCategoria = {
    'todas': 'Todas',
    'entradas': 'Entradas',
    'fuertes': 'Platos fuertes',
    'bebidas': 'Bebidas',
    'promos': 'Promociones'
};

// ===== DATOS DE EJEMPLO =====
let categorias = [
    { id: 1, nombre: 'Entradas', icono: 'fa-bread-slice', slug: 'entradas' },
    { id: 2, nombre: 'Platos fuertes', icono: 'fa-utensils', slug: 'fuertes' },
    { id: 3, nombre: 'Bebidas', icono: 'fa-glass-cheers', slug: 'bebidas' },
    { id: 4, nombre: 'Promociones', icono: 'fa-tags', slug: 'promos' }
];

let productos = [
    { id: 1, nombre: 'Plátano con queso', descripcion: 'Delicioso plátano maduro con queso', precio: 2800, categoria: 'entradas', imagen: 'images/platano_conqueso.jpg', status: 'active' },
    { id: 2, nombre: 'Tamal de cerdo', descripcion: 'Masa con cerdo y verduras', precio: 3500, categoria: 'entradas', imagen: 'https://i.ytimg.com/vi/e5D5j4_T-H4/maxresdefault.jpg', status: 'active' },
    { id: 3, nombre: 'Rice and beans', descripcion: 'Rice and Beans, pollo caribeño, maduro y ensalada', precio: 5800, categoria: 'fuertes', imagen: 'images/riceandbeans.png', status: 'active' },
    { id: 4, nombre: 'Olla de carne', descripcion: 'Sopa de res con verduras', precio: 6200, categoria: 'fuertes', imagen: 'https://www.recetascostarica.com/base/stock/Recipe/olla-de-carne/olla-de-carne_web.jpg', status: 'active' },
    { id: 5, nombre: 'Fresco de cas', descripcion: 'Refresco natural de cas', precio: 1800, categoria: 'bebidas', imagen: 'https://riverside.cr/wp-content/uploads/Cas2.jpeg', status: 'active' }
];

// ===== VARIABLES GLOBALES =====
let currentSection = 'categorias';
let editingItem = null;
let editingCategoria = null;
let deleteCallback = null;

// ===== FUNCIONES DE MODALES =====
function showInfoModal(title, message, icon = 'check-circle') {
    document.getElementById('infoModalIcon').innerHTML = `<i class="fas fa-${icon}"></i>`;
    document.getElementById('infoModalTitle').textContent = title;
    document.getElementById('infoModalMessage').textContent = message;
    document.getElementById('infoModal').classList.add('active');
}

function closeInfoModal() {
    document.getElementById('infoModal').classList.remove('active');
}

function setupDeleteButton() {
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    
    if (confirmDeleteBtn) {
        // Remover eventos anteriores clonando y reemplazando
        const newBtn = confirmDeleteBtn.cloneNode(true);
        confirmDeleteBtn.parentNode.replaceChild(newBtn, confirmDeleteBtn);
        
        // Agregar el nuevo event listener
        newBtn.addEventListener('click', function() {
            if (deleteCallback) {
                deleteCallback();
                closeDeleteModal();
            }
        });
    }
}

function showDeleteModal(title, message, callback) {
    document.getElementById('deleteModalTitle').textContent = title;
    document.getElementById('deleteModalMessage').textContent = message;
    deleteCallback = callback;
    
    setupDeleteButton();
    
    document.getElementById('deleteModal').classList.add('active');
}

function closeDeleteModal() {
    document.getElementById('deleteModal').classList.remove('active');
    deleteCallback = null;
}

// ===== FUNCIÓN PARA ASIGNAR EVENTOS DEL SIDEBAR =====
function asignarEventosSidebar() {
    // Navegación de categorías (productos)
    document.querySelectorAll('#categoriasList li').forEach(item => {
        item.addEventListener('click', (e) => {
            const section = e.currentTarget.dataset.section;
            switchSection(section);
            if (window.innerWidth <= 768) toggleSidebar(false);
        });
    });

    // Navegación de administración
    const menuCategorias = document.getElementById('menuCategorias');
    if (menuCategorias) {
        menuCategorias.addEventListener('click', () => {
            switchSection('categorias');
            if (window.innerWidth <= 768) toggleSidebar(false);
        });
    }

    const configItem = document.querySelector('[data-section="config"]');
    if (configItem) {
        configItem.addEventListener('click', () => {
            switchSection('config');
            if (window.innerWidth <= 768) toggleSidebar(false);
        });
    }
}

// ===== FUNCIONES DE CATEGORÍAS =====
function renderCategorias() {
    const grid = document.getElementById('categoriasGrid');
    const lista = document.getElementById('categoriasList');
    
    // Renderizar grid
    grid.innerHTML = categorias.map(cat => `
        <div class="categoria-card">
            <div class="categoria-icon">
                <i class="fas ${cat.icono}"></i>
            </div>
            <div class="categoria-info">
                <h4>${cat.nombre}</h4>
                <p>${productos.filter(p => p.categoria === cat.slug).length} productos</p>
            </div>
            <div class="categoria-actions">
                <button class="btn-edit" onclick="openCategoriaModal(${cat.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-delete" onclick="confirmDeleteCategoria(${cat.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');

    // Renderizar sidebar (solo las categorías para productos)
    lista.innerHTML = categorias.map(cat => `
        <li data-section="${cat.slug}">
            <i class="fas ${cat.icono}"></i>
            <span>${cat.nombre}</span>
        </li>
    `).join('') + `
        <li class="sidebar-divider" style="height: 1px; background: var(--gray); margin: 10px 20px; pointer-events: none;"></li>
        <li id="menuCategorias" data-section="categorias">
            <i class="fas fa-folder"></i>
            <span>Gestionar Categorías</span>
        </li>
        <li data-section="config">
            <i class="fas fa-cog"></i>
            <span>Configuración</span>
        </li>
    `;

    // Reasignar eventos del sidebar después de actualizar el HTML
    asignarEventosSidebar();
}

function openCategoriaModal(id = null) {
    editingCategoria = id ? categorias.find(c => c.id === id) : null;
    
    document.getElementById('categoriaModalTitle').textContent = editingCategoria ? 'Editar Categoría' : 'Nueva Categoría';
    document.getElementById('categoriaId').value = editingCategoria?.id || '';
    document.getElementById('categoriaNombre').value = editingCategoria?.nombre || '';
    document.getElementById('categoriaIcono').value = editingCategoria?.icono || 'fa-utensils';
    
    document.getElementById('categoriaModal').classList.add('active');
}

function closeCategoriaModal() {
    document.getElementById('categoriaModal').classList.remove('active');
    editingCategoria = null;
}

function saveCategoria(e) {
    e.preventDefault();
    
    const id = document.getElementById('categoriaId').value;
    const nombre = document.getElementById('categoriaNombre').value;
    const icono = document.getElementById('categoriaIcono').value;
    const slug = nombre.toLowerCase().replace(/\s+/g, '-');

    if (id) {
        // Editar
        const index = categorias.findIndex(c => c.id === parseInt(id));
        categorias[index] = { ...categorias[index], nombre, icono, slug };
        showInfoModal('Éxito', 'Categoría actualizada correctamente');
    } else {
        // Nueva
        const newId = Math.max(...categorias.map(c => c.id), 0) + 1;
        categorias.push({ id: newId, nombre, icono, slug });
        showInfoModal('Éxito', 'Categoría creada correctamente');
    }

    closeCategoriaModal();
    renderCategorias();
    
    if (currentSection === 'categorias') {
        document.getElementById('categoriasSection').style.display = 'block';
    }
}

function confirmDeleteCategoria(id) {
    const categoria = categorias.find(c => c.id === id);
    const productosEnCategoria = productos.filter(p => p.categoria === categoria.slug);
    
    if (productosEnCategoria.length > 0) {
        showInfoModal('No se puede eliminar', 'Esta categoría tiene productos asociados', 'exclamation-triangle');
        return;
    }

    showDeleteModal(
        '¿Eliminar categoría?',
        `¿Estás seguro de eliminar la categoría "${categoria.nombre}"?`,
        () => {
            categorias = categorias.filter(c => c.id !== id);
            renderCategorias();
            showInfoModal('Éxito', 'Categoría eliminada correctamente');
            if (currentSection === categoria.slug) {
                switchSection('categorias');
            }
        }
    );
}

// ===== FUNCIONES DE PRODUCTOS =====
function renderProductos(categoria) {
    const container = document.getElementById('productosSection');
    const items = productos.filter(p => p.categoria === categoria);
    const cat = categorias.find(c => c.slug === categoria);
    
    container.innerHTML = `
        <div class="content-section" style="display: block;">
            <div class="section-header">
                <h2><i class="fas ${cat?.icono || 'fa-utensils'}"></i> ${cat?.nombre || categoria}</h2>
                <button class="btn-add-item" onclick="openItemModal(null, '${categoria}')">
                    <i class="fas fa-plus"></i> Agregar Producto
                </button>
            </div>
            <div class="items-grid">
                ${items.map(item => createItemCard(item)).join('')}
                ${items.length === 0 ? '<p style="text-align: center; padding: 40px; grid-column: 1/-1;">No hay productos en esta categoría</p>' : ''}
            </div>
        </div>
    `;
}

function createItemCard(item) {
    return `
        <div class="item-card">
            <div class="item-image">
                <img src="${item.imagen}" alt="${item.nombre}" onerror="this.src='images/LogoT.I.T.A.jpeg'">
            </div>
            <div class="item-info">
                <div class="item-header">
                    <h3 class="item-name">${item.nombre}</h3>
                    <span class="item-price">₡${item.precio.toFixed(2)}</span>
                </div>
                <p class="item-description">${item.descripcion}</p>
                <div class="item-status">
                    <span class="status-badge ${item.status}">
                        <i class="fas fa-${item.status === 'active' ? 'check' : 'pause'}"></i>
                        ${item.status === 'active' ? 'Activo' : 'Inactivo'}
                    </span>
                </div>
                <div class="item-actions">
                    <button class="btn-edit" onclick="openItemModal(${item.id})">
                        <i class="fas fa-edit"></i> Editar
                    </button>
                    <button class="btn-delete" onclick="confirmDeleteItem(${item.id})">
                        <i class="fas fa-trash"></i> Eliminar
                    </button>
                </div>
            </div>
        </div>
    `;
}

function openItemModal(id = null, categoria = null) {
    editingItem = id ? productos.find(p => p.id === id) : null;
    
    document.getElementById('modalTitle').textContent = editingItem ? 'Editar Producto' : 'Nuevo Producto';
    document.getElementById('itemId').value = editingItem?.id || '';
    document.getElementById('itemCategoria').value = editingItem?.categoria || categoria || '';
    document.getElementById('itemName').value = editingItem?.nombre || '';
    document.getElementById('itemDescription').value = editingItem?.descripcion || '';
    document.getElementById('itemPrice').value = editingItem?.precio || '';
    document.getElementById('itemImage').value = editingItem?.imagen || '';
    
    const status = editingItem?.status || 'active';
    document.getElementById('itemStatus').value = status;
    document.querySelectorAll('.status-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.status === status) {
            btn.classList.add('active');
        }
    });
    
    document.getElementById('editModal').classList.add('active');
}

function closeItemModal() {
    document.getElementById('editModal').classList.remove('active');
    editingItem = null;
}

function saveItem(e) {
    e.preventDefault();
    
    const id = document.getElementById('itemId').value;
    const categoria = document.getElementById('itemCategoria').value;
    const nombre = document.getElementById('itemName').value;
    const descripcion = document.getElementById('itemDescription').value;
    const precio = parseFloat(document.getElementById('itemPrice').value);
    const imagen = document.getElementById('itemImage').value || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600';
    const status = document.getElementById('itemStatus').value;

    if (id) {
        // Editar
        const index = productos.findIndex(p => p.id === parseInt(id));
        productos[index] = { ...productos[index], nombre, descripcion, precio, imagen, status };
        showInfoModal('Éxito', 'Producto actualizado correctamente');
    } else {
        // Nuevo
        const newId = Math.max(...productos.map(p => p.id), 0) + 1;
        productos.push({ id: newId, nombre, descripcion, precio, categoria, imagen, status });
        showInfoModal('Éxito', 'Producto creado correctamente');
    }

    closeItemModal();
    if (currentSection !== 'categorias' && currentSection !== 'config') {
        renderProductos(currentSection);
    }
}

function confirmDeleteItem(id) {
    const item = productos.find(p => p.id === id);
    showDeleteModal(
        '¿Eliminar producto?',
        `¿Estás seguro de eliminar "${item.nombre}"?`,
        () => {
            productos = productos.filter(p => p.id !== id);
            showInfoModal('Éxito', 'Producto eliminado correctamente');
            if (currentSection !== 'categorias' && currentSection !== 'config') {
                renderProductos(currentSection);
            }
        }
    );
}

// ===== FUNCIONES DE NAVEGACIÓN =====
function toggleSidebar(forceState) {
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.sidebar-overlay');
    
    if (typeof forceState !== 'undefined') {
        window.isSidebarOpen = forceState;
    } else {
        window.isSidebarOpen = !window.isSidebarOpen;
    }
    
    if (window.isSidebarOpen) {
        sidebar.classList.add('active');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    } else {
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function switchSection(section) {
    currentSection = section;
    
    // Actualizar navegación del sidebar
    document.querySelectorAll('.sidebar-nav li').forEach(li => {
        li.classList.remove('active');
    });
    
    // Marcar el elemento correspondiente
    if (section === 'categorias') {
        document.getElementById('menuCategorias')?.classList.add('active');
    } else if (section === 'config') {
        document.querySelector('[data-section="config"]')?.classList.add('active');
    } else {
        // Es una categoría de productos
        document.querySelector(`[data-section="${section}"]`)?.classList.add('active');
    }

    // Actualizar título
    const categoria = categorias.find(c => c.slug === section);
    document.getElementById('sectionTitle').textContent = categoria ? categoria.nombre : 
        section === 'categorias' ? 'Gestionar Categorías' : 
        section === 'config' ? 'Configuración' : '';

    // Mostrar/ocultar secciones
    document.getElementById('categoriasSection').style.display = section === 'categorias' ? 'block' : 'none';
    document.getElementById('configSection').style.display = section === 'config' ? 'block' : 'none';
    document.getElementById('productosSection').style.display = (section !== 'categorias' && section !== 'config') ? 'block' : 'none';

    // Mostrar/ocultar botón flotante
    document.getElementById('fabCategorias').style.display = 
        (section !== 'categorias' && section !== 'config') ? 'flex' : 'none';

    if (section !== 'categorias' && section !== 'config') {
        renderProductos(section);
    }
}

// ===== CONFIGURACIÓN =====
function loadConfigData() {
    document.getElementById('restaurantName').value = 'T.I.T.A Catering Service';
    document.getElementById('restaurantDescription').value = 'Servicio de catering con los mejores platos tradicionales';
    document.getElementById('restaurantHours').value = 'Lunes a Domingo: 9:00 - 22:00';
}

function saveConfig() {
    showInfoModal('Configuración', 'Configuración guardada correctamente');
}

// ===== EVENT LISTENERS =====
document.addEventListener('DOMContentLoaded', () => {
    // Animaciones
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes slideOut { from { transform: translateX(0); opacity: 1; } to { transform: translateX(100%); opacity: 0; } }
    `;
    document.head.appendChild(style);

    // Renderizar
    renderCategorias();
    loadConfigData();

    // Elementos del DOM
    const menuToggle = document.getElementById('menuToggle');
    const overlay = document.querySelector('.sidebar-overlay');
    const btnNuevaCategoria = document.getElementById('btnNuevaCategoria');
    const btnNuevaCategoriaHeader = document.getElementById('btnNuevaCategoriaHeader');
    const categoriaForm = document.getElementById('categoriaForm');
    const itemForm = document.getElementById('itemForm');
    const saveConfigBtn = document.getElementById('saveConfigBtn');
    const logoutBtn = document.getElementById('logoutBtn');

    // Event listeners básicos
    if (menuToggle) menuToggle.addEventListener('click', () => toggleSidebar());
    if (overlay) overlay.addEventListener('click', () => toggleSidebar(false));
    
    // Botones de nueva categoría
    if (btnNuevaCategoria) btnNuevaCategoria.addEventListener('click', () => openCategoriaModal());
    if (btnNuevaCategoriaHeader) btnNuevaCategoriaHeader.addEventListener('click', () => openCategoriaModal());
    
    // Formularios
    if (categoriaForm) categoriaForm.addEventListener('submit', saveCategoria);
    if (itemForm) itemForm.addEventListener('submit', saveItem);
    if (saveConfigBtn) saveConfigBtn.addEventListener('click', saveConfig);
    
    // Logout
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            showDeleteModal(
                'Cerrar sesión',
                '¿Estás seguro de que deseas salir?',
                () => {
                    window.location.href = '/login';
                }
            );
        });
    }

    // Status toggle
    document.querySelectorAll('.status-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const status = e.target.dataset.status;
            document.querySelectorAll('.status-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            document.getElementById('itemStatus').value = status;
        });
    });

    // Cerrar modales al hacer clic fuera
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            closeItemModal();
            closeCategoriaModal();
        }
    });

    // Iniciar en categorías
    switchSection('categorias');
});

// Funciones globales
window.openCategoriaModal = openCategoriaModal;
window.closeCategoriaModal = closeCategoriaModal;
window.openItemModal = openItemModal;
window.closeItemModal = closeItemModal;
window.closeDeleteModal = closeDeleteModal;
window.closeInfoModal = closeInfoModal;
window.confirmDeleteCategoria = confirmDeleteCategoria;
window.confirmDeleteItem = confirmDeleteItem;
window.switchSection = switchSection;
window.setupDeleteButton = setupDeleteButton;