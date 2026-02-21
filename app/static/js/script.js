// ===== VARIABLES GLOBALES =====
let productos = [];
let carrito = [];
let filtroCategoria = 'todas';
let busqueda = '';

// Elementos del DOM
const cartCountHeaderDesktop = document.getElementById('cartCountHeaderDesktop');
const cartCountHeaderMobile = document.getElementById('cartCountHeaderMobile');
const cartModal = document.getElementById('cartModal');
const cartModalBody = document.getElementById('cartModalBody');
const modalTotal = document.getElementById('modalTotal');
const closeModalBtn = document.getElementById('closeModalBtn');
const cartIconHeaderDesktop = document.getElementById('cartIconHeaderDesktop');
const cartIconHeaderMobile = document.getElementById('cartIconHeaderMobile');
const modalWhatsAppBtn = document.getElementById('modalWhatsAppBtn');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const categoryFilters = document.getElementById('categoryFilters');
const menuContainer = document.getElementById('menuContainer');
const carouselContainer = document.getElementById('carouselContainer');
const homePage = document.getElementById('homePage');
const aboutPage = document.getElementById('aboutPage');
const linkHome = document.getElementById('linkHome');
const linkAbout = document.getElementById('linkAbout');
const backToHomeBtn = document.getElementById('backToHomeBtn');
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

// Elementos del modal de imagen
const imageModal = document.getElementById('imageModal');
const modalImage = document.getElementById('modalImage');
const modalImageTitle = document.getElementById('modalImageTitle');
const modalImagePrice = document.getElementById('modalImagePrice');
const closeImageModal = document.getElementById('closeImageModal');

// ===== FUNCIONES DE LOADER =====
function showLoader() {
    const loader = document.getElementById('loader');
    if (loader) loader.classList.remove('hidden');
}

function hideLoader() {
    const loader = document.getElementById('loader');
    if (loader) loader.classList.add('hidden');
}

// ===== FUNCIÓN PARA CARGAR MENÚ =====
async function cargarMenu() {
    showLoader();
    
    try {
        const response = await fetch('/menu/getmenu');
        
        if (!response.ok) {
            throw new Error('Error al obtener el menú');
        }

        const data = await response.json();
        
        productos = data.map(item => ({
            id: item.idmenu,
            nombre: item.nombre,
            descripcion: item.descripcion,
            precio: Number(item.precio),
            categoria: item.categoria,
            imagen: item.imagen ? `${URL_IMG_BASE}${item.imagen}` : URL_IMG_DEFAULT,
            destacado: Boolean(item.destacado),
            status: item.estado === '1' ? 'active' : 'inactive'
        }));
        
        init();
        
    } catch (error) {
        console.error('Error cargando menú:', error);
        productos = [];
        init();
        
    } finally {
        hideLoader();
    }
}

// ===== FUNCIONES DE MODAL DE IMAGEN =====
function abrirModalImagen(producto) {
    if (!imageModal || !modalImage || !modalImageTitle || !modalImagePrice) {
        console.error('Elementos del modal no encontrados');
        return;
    }
    
    modalImage.src = producto.imagen;
    modalImage.alt = producto.nombre;
    modalImageTitle.textContent = producto.nombre;
    modalImagePrice.textContent = '₡' + producto.precio.toLocaleString('es-CR');
    
    // Forzar estilos para asegurar visibilidad
    imageModal.style.display = 'flex';
    setTimeout(() => {
        imageModal.classList.add('active');
    }, 10);
}

function cerrarModalImagen() {
    if (!imageModal) return;
    
    imageModal.classList.remove('active');
    setTimeout(() => {
        imageModal.style.display = 'none';
    }, 300); // Coincide con la transición CSS
}

// Función global para abrir modal por ID
window.abrirModalImagenPorId = function(id) {
    const producto = productos.find(p => p.id === id);
    if (producto) {
        abrirModalImagen(producto);
    } else {
        console.error('Producto no encontrado:', id);
    }
};

// ===== FUNCIONES DE FILTROS =====
function initCategoryFilters() {
    const categoriasUnicas = ['todas', ...new Set(productos.map(p => p.categoria))];
    
    const nombresCategoria = {
        'todas': 'Todas',
        'entradas': 'Entradas',
        'fuertes': 'Platos fuertes',
        'bebidas': 'Bebidas',
        'desayunos': 'Desayunos',
        'promos': 'Promociones'
    };
    
    categoryFilters.innerHTML = '';
    categoriasUnicas.forEach(cat => {
        const chip = document.createElement('span');
        chip.className = `filter-chip ${cat === 'todas' ? 'active' : ''}`;
        chip.dataset.categoria = cat;
        chip.textContent = nombresCategoria[cat] || cat;
        chip.addEventListener('click', () => {
            document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            filtroCategoria = cat;
            filtrarProductos();
        });
        categoryFilters.appendChild(chip);
    });
}

function filtrarProductos() {
    let productosFiltrados = productos;

    if (filtroCategoria !== 'todas') {
        productosFiltrados = productosFiltrados.filter(
            p => p.categoria === filtroCategoria
        );
    }

    if (busqueda !== '') {
        const busquedaLower = busqueda.toLowerCase();
        productosFiltrados = productosFiltrados.filter(p =>
            p.nombre.toLowerCase().includes(busquedaLower) ||
            p.descripcion.toLowerCase().includes(busquedaLower)
        );
    }

    renderizarMenu(productosFiltrados);
}

// ===== FUNCIÓN TOGGLE DESCRIPCIÓN =====
window.toggleDescripcion = function(id, event) {
    if (event) {
        event.stopPropagation();
    }
    
    const desc = document.getElementById(`desc-${id}`);
    const btn = event ? event.target : document.querySelector(`[onclick*="toggleDescripcion(${id})"]`);
    
    if (!desc || !btn) return;
    
    desc.classList.toggle('expandido');
    
    if (desc.classList.contains('expandido')) {
        btn.textContent = 'Ver menos';
    } else {
        btn.textContent = 'Ver más';
    }
};

// ===== RENDERIZAR MENÚ =====
function renderizarMenu(productosAMostrar) {
    const agrupados = {};
    productosAMostrar.forEach(p => {
        if (!agrupados[p.categoria]) agrupados[p.categoria] = [];
        agrupados[p.categoria].push(p);
    });

    const nombresCategoria = {
        'entradas': 'Entradas',
        'fuertes': 'Platos fuertes',
        'bebidas': 'Bebidas',
        'desayunos': 'Desayunos',
        'promos': 'Promociones'
    };
    
    const iconosCategoria = {
        'entradas': 'fa-utensils',
        'fuertes': 'fa-bowl-food',
        'bebidas': 'fa-mug-hot',
        'desayunos': 'fa-coffee',
        'promos': 'fa-tags'
    };

    let html = '';
    
    html += '<h2 class="section-title"><i class="fas fa-leaf"></i> Nuestra cocina</h2>';
    
    for (const [categoria, items] of Object.entries(agrupados)) {
        html += `<section><h3 class="category-title"><i class="fas ${iconosCategoria[categoria] || 'fa-circle'}"></i> ${nombresCategoria[categoria] || categoria}</h3>`;
        html += '<div class="menu-grid">';
        
        items.forEach(p => {
            const esDescripcionLarga = p.descripcion.length > 110;
            // Escapar comillas para evitar errores HTML
            const descripcionEscapada = p.descripcion.replace(/"/g, '&quot;');
            
            html += `
                <div class="menu-card" data-id="${p.id}">
                    <div class="img-container" onclick="abrirModalImagenPorId(${p.id})">
                        <img class="card-img" src="${p.imagen}" alt="${p.nombre}" onerror="this.src='${URL_IMG_DEFAULT}'">
                    </div>
                    <div class="card-content">
                        <h4 onclick="abrirModalImagenPorId(${p.id})">${p.nombre}</h4>
                        <div class="descripcion-container">
                            <p class="card-desc ${esDescripcionLarga ? 'descripcion-larga' : ''}" id="desc-${p.id}" title="${descripcionEscapada}">${p.descripcion}</p>
                            ${esDescripcionLarga ? 
                                `<button class="ver-mas-btn" onclick="toggleDescripcion(${p.id}, event)">Ver más</button>` 
                                : ''}
                        </div>
                        <div class="card-footer-row">
                            <span class="card-precio">₡${p.precio.toLocaleString('es-CR')}</span>
                            <button class="add-btn" onclick="agregarAlCarrito(${p.id}, this, event)"><i class="fas fa-plus"></i></button>
                        </div>
                    </div>
                </div>
            `;
        });
        
        html += '</div></section>';
    }
    
    menuContainer.innerHTML = html;
}

// ===== RENDERIZAR CARRUSEL DE DESTACADOS =====
function renderizarCarrusel() {
    const destacados = productos.filter(p => p.destacado === true).slice(0, 5);
    let html = '';
    
    if (destacados.length === 0) {
        carouselContainer.innerHTML = '<p style="text-align: center; padding: 20px;">No hay productos destacados</p>';
        return;
    }
    
    destacados.forEach(p => {
        html += `
            <div class="carousel-item" onclick="abrirModalImagenPorId(${p.id})">
                <img class="carousel-img" src="${p.imagen}" alt="${p.nombre}" onerror="this.src='${URL_IMG_DEFAULT}'">
                <div class="carousel-caption">
                    <h3>${p.nombre}</h3>
                    <p>${p.descripcion.substring(0, 40)}...</p>
                    <div class="card-footer-row">
                        <span class="card-precio">₡${p.precio.toLocaleString('es-CR')}</span>
                        <button class="add-btn" onclick="event.stopPropagation(); agregarAlCarrito(${p.id}, this, event)"><i class="fas fa-plus"></i></button>
                    </div>
                </div>
            </div>
        `;
    });
    
    carouselContainer.innerHTML = html;
}

// ===== FUNCIONES DEL CARRITO =====
window.agregarAlCarrito = function(id, boton, event) {
    if (event) {
        event.stopPropagation();
    }
    
    const producto = productos.find(p => p.id === id);
    if (!producto) return;
    
    carrito.push({ ...producto, carritoId: Date.now() + Math.random() });
    
    // Feedback visual
    boton.style.background = '#2b7a4b';
    boton.innerHTML = '<i class="fas fa-check"></i>';
    setTimeout(() => {
        boton.style.background = '#1f2a2f';
        boton.innerHTML = '<i class="fas fa-plus"></i>';
    }, 400);
    
    actualizarCarritoUI();
};

window.quitarDelCarrito = function(carritoId) {
    carrito = carrito.filter(item => item.carritoId !== carritoId);
    actualizarCarritoUI();
    renderizarModalCarrito();
};

function actualizarCarritoUI() {
    const totalProductos = carrito.length;
    
    if (cartCountHeaderDesktop) {
        cartCountHeaderDesktop.innerText = totalProductos;
    }
    if (cartCountHeaderMobile) {
        cartCountHeaderMobile.innerText = totalProductos;
    }
}

function renderizarModalCarrito() {
    if (carrito.length === 0) {
        cartModalBody.innerHTML = '<div style="text-align: center; padding: 40px; color: #888;">Carrito vacío</div>';
        modalTotal.innerText = '₡0';
        return;
    }
    
    let html = '';
    let total = 0;
    
    carrito.forEach(item => {
        total += item.precio;
        html += `
            <div class="cart-modal-item">
                <div class="cart-modal-item-info">
                    <h4>${item.nombre}</h4>
                    <p>₡${item.precio.toLocaleString('es-CR')}</p>
                </div>
                <button class="cart-modal-item-remove" onclick="quitarDelCarrito(${item.carritoId})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
    });
    
    cartModalBody.innerHTML = html;
    modalTotal.innerText = '₡' + total.toLocaleString('es-CR');
}

function abrirModalCarrito() {
    renderizarModalCarrito();
    cartModal.classList.add('active');
}

function cerrarModalCarrito() {
    cartModal.classList.remove('active');
}

function enviarWhatsApp() {
    if (carrito.length === 0) return;
    const telefono = '50684523300';
    let mensaje = '¡Hola T.I.T.A! Quiero pedir para catering:%0A%0A';
    carrito.forEach(item => {
        mensaje += `📍 ${item.nombre} - ₡${item.precio.toLocaleString('es-CR')}%0A`;
    });
    const total = carrito.reduce((acc, i) => acc + i.precio, 0);
    mensaje += `%0A*Total: ₡${total.toLocaleString('es-CR')}*%0A%0A_Enviado desde el menú digital_`;
    window.open(`https://wa.me/${telefono}?text=${mensaje}`, '_blank');
}

// ===== FUNCIONES DE NAVEGACIÓN =====
function buscar() {
    busqueda = searchInput.value.trim();
    filtrarProductos();
}

function mostrarHome() {
    homePage.classList.remove('hidden');
    homePage.style.display = 'block';
    aboutPage.classList.remove('active-page');
    aboutPage.style.display = 'none';
    linkHome.classList.add('active');
    linkAbout.classList.remove('active');
    cerrarModalCarrito();
    cerrarModalImagen();
}

function mostrarAbout() {
    homePage.classList.add('hidden');
    homePage.style.display = 'none';
    aboutPage.classList.add('active-page');
    aboutPage.style.display = 'block';
    linkAbout.classList.add('active');
    linkHome.classList.remove('active');
    cerrarModalCarrito();
    cerrarModalImagen();
}

// ===== FUNCIÓN DE INICIALIZACIÓN =====
function init() {
    if (productos.length > 0) {
        initCategoryFilters();
        renderizarCarrusel();
        filtrarProductos();
    } else {
        menuContainer.innerHTML = '<p style="text-align: center; padding: 50px;">No hay productos disponibles</p>';
        carouselContainer.innerHTML = '<p style="text-align: center; padding: 20px;">No hay productos destacados</p>';
    }
    
    actualizarCarritoUI();
    mostrarHome();
}

// ===== EVENT LISTENERS =====
document.addEventListener('DOMContentLoaded', () => {
    // Cargar menú
    cargarMenu();
    
    // Event listeners del carrito
    if (cartIconHeaderDesktop) {
        cartIconHeaderDesktop.addEventListener('click', (e) => {
            e.preventDefault();
            abrirModalCarrito();
        });
    }

    if (cartIconHeaderMobile) {
        cartIconHeaderMobile.addEventListener('click', (e) => {
            e.preventDefault();
            abrirModalCarrito();
        });
    }

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', cerrarModalCarrito);
    }

    if (modalWhatsAppBtn) {
        modalWhatsAppBtn.addEventListener('click', enviarWhatsApp);
    }

    // Cerrar modal carrito al hacer clic fuera
    if (cartModal) {
        cartModal.addEventListener('click', (e) => {
            if (e.target === cartModal) cerrarModalCarrito();
        });
    }

    // Event listeners del modal de imagen
    if (closeImageModal) {
        closeImageModal.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            cerrarModalImagen();
        });
    }

    if (imageModal) {
        imageModal.addEventListener('click', (e) => {
            if (e.target === imageModal) cerrarModalImagen();
        });
    }

    // Búsqueda
    if (searchBtn) {
        searchBtn.addEventListener('click', buscar);
    }
    
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            busqueda = searchInput.value.trim();
            filtrarProductos();
        });
    }

    // Navegación
    if (linkHome) {
        linkHome.addEventListener('click', (e) => { 
            e.preventDefault(); 
            mostrarHome(); 
        });
    }
    
    if (linkAbout) {
        linkAbout.addEventListener('click', (e) => { 
            e.preventDefault(); 
            mostrarAbout(); 
        });
    }
    
    if (backToHomeBtn) {
        backToHomeBtn.addEventListener('click', (e) => { 
            e.preventDefault(); 
            mostrarHome(); 
        });
    }

    // Menú hamburguesa
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }
});

// Funciones globales
window.abrirModalCarrito = abrirModalCarrito;
window.cerrarModalCarrito = cerrarModalCarrito;
window.enviarWhatsApp = enviarWhatsApp;
window.abrirModalImagenPorId = abrirModalImagenPorId;
window.agregarAlCarrito = agregarAlCarrito;
window.quitarDelCarrito = quitarDelCarrito;
window.toggleDescripcion = toggleDescripcion;