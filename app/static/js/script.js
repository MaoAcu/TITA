// ===== OBJETO DE PRODUCTOS =====
const productos = [
  // ENTRADAS
  { id: 1, nombre: 'Plátano con queso', descripcion: 'Sencillo pero delicioso plátano maduro con queso y mantequilla', precio: 2800, categoria: 'entradas', imagen: 'images/platano_conqueso.jpg', destacado: true },
  { id: 2, nombre: 'Tamal de cerdo', descripcion: 'Masa con cerdo, arroz, garbanzos, pasas, hoja de plátano.', precio: 3500, categoria: 'entradas', imagen: 'https://i.ytimg.com/vi/e5D5j4_T-H4/maxresdefault.jpg', destacado: false },
  { id: 3, nombre: 'Gallo pinto campesino', descripcion: 'Arroz, frijoles negros, cebolla, chile, culantro.', precio: 2200, categoria: 'entradas', imagen: 'images/pinto.png', destacado: true },
  
  // PLATOS FUERTES
  { id: 4, nombre: 'Casado de pescado', descripcion: 'Corvina, arroz, frijoles, maduro, ensalada, tortillas.', precio: 5800, categoria: 'fuertes', imagen: 'images/casado_pescado.png', destacado: true },
  { id: 5, nombre: 'Olla de carne', descripcion: 'Sopa de res con elote, ayote, papa, yuca, chayote.', precio: 6200, categoria: 'fuertes', imagen: 'https://www.recetascostarica.com/base/stock/Recipe/olla-de-carne/olla-de-carne_web.jpg', destacado: true },
  { id: 6, nombre: 'Rice and Beans', descripcion: 'Delicioso Rice and Beans casero y de calidad.', precio: 4900, categoria: 'fuertes', imagen: 'images/riceandbeans.png', destacado: false },
  
  // BEBIDAS
  { id: 7, nombre: 'Fresco de cas', descripcion: 'Fruta de cas natural, agua/leche, endulzado.', precio: 1800, categoria: 'bebidas', imagen: 'https://riverside.cr/wp-content/uploads/Cas2.jpeg', destacado: false },
  { id: 8, nombre: 'Horchata de arroz', descripcion: 'Arroz, canela, leche, servida fría.', precio: 1700, categoria: 'bebidas', imagen: 'https://images.unsplash.com/photo-1544145945-f904253b9367?w=400&auto=format', destacado: false },
  { id: 9, nombre: 'Café chorreado', descripcion: 'Café de altura preparado en bolsita.', precio: 1500, categoria: 'bebidas', imagen: 'images/Cafecito-chorreado.webp', destacado: true }
];

// ===== VARIABLES GLOBALES =====
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

// ===== FUNCIONES =====

// Inicializar filtros de categoría
function initCategoryFilters() {
  const categorias = ['todas', ...new Set(productos.map(p => p.categoria))];
  const nombresCategoria = { 'todas': 'Todas', 'entradas': 'Entradas', 'fuertes': 'Platos fuertes', 'bebidas': 'Bebidas' };
  
  categoryFilters.innerHTML = '';
  categorias.forEach(cat => {
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
searchInput.addEventListener('input', () => {
  busqueda = searchInput.value.trim();
  filtrarProductos();
});
// Abrir modal de imagen
function abrirModalImagen(producto) {
  modalImage.src = producto.imagen;
  modalImage.alt = producto.nombre;
  modalImageTitle.textContent = producto.nombre;
  modalImagePrice.textContent = '₡' + producto.precio.toLocaleString('es-CR');
  imageModal.classList.add('active');
}

// Cerrar modal de imagen
function cerrarModalImagen() {
  imageModal.classList.remove('active');
}

// Renderizar menú
function renderizarMenu(productosAMostrar) {
  // Agrupar por categoría
  const agrupados = {};
  productosAMostrar.forEach(p => {
    if (!agrupados[p.categoria]) agrupados[p.categoria] = [];
    agrupados[p.categoria].push(p);
  });

  const nombresCategoria = { 'entradas': 'Entradas', 'fuertes': 'Platos fuertes', 'bebidas': 'Bebidas tradicionales' };
  const iconosCategoria = { 'entradas': 'fa-utensils', 'fuertes': 'fa-bowl-food', 'bebidas': 'fa-mug-hot' };

  let html = '';
  
  // Título principal
  html += '<h2 class="section-title"><i class="fas fa-leaf"></i> Nuestra cocina</h2>';
  
  // Cada categoría
  for (const [categoria, items] of Object.entries(agrupados)) {
    html += `<section><h3 class="category-title"><i class="fas ${iconosCategoria[categoria] || 'fa-circle'}"></i> ${nombresCategoria[categoria] || categoria}</h3>`;
    html += '<div class="menu-grid">';
    
    items.forEach(p => {
      html += `
        <div class="menu-card" data-id="${p.id}" onclick="abrirModalImagenPorId(${p.id})">
          <img class="card-img" src="${p.imagen}" alt="${p.nombre}" onerror="this.src='${URL_IMG}'">
          <div class="card-content">
            <h4>${p.nombre}</h4>
            <p class="card-desc">${p.descripcion}</p>
            <div class="card-footer-row">
              <span class="card-precio">₡${p.precio.toLocaleString('es-CR')}</span>
              <button class="add-btn" onclick="event.stopPropagation(); agregarAlCarrito(${p.id}, this)"><i class="fas fa-plus"></i></button>
            </div>
          </div>
        </div>
      `;
    });
    
    html += '</div></section>';
  }
  
  menuContainer.innerHTML = html;
}

// Función para abrir modal por ID (global para que funcione desde onclick)
window.abrirModalImagenPorId = function(id) {
  const producto = productos.find(p => p.id === id);
  if (producto) {
    abrirModalImagen(producto);
  }
};

// Renderizar carrusel de destacados
function renderizarCarrusel() {
  const destacados = productos.filter(p => p.destacado).slice(0, 5);
  let html = '';
  
  destacados.forEach(p => {
    html += `
      <div class="carousel-item" onclick="abrirModalImagenPorId(${p.id})">
        <img class="carousel-img" src="${p.imagen}" alt="${p.nombre}" onerror="this.src='https://via.placeholder.com/400x300?text=Imagen+no+disponible'">
        <div class="carousel-caption">
          <h3>${p.nombre}</h3>
          <p>${p.descripcion.substring(0, 40)}...</p>
           <div class="card-footer-row">
              <span class="card-precio">₡${p.precio.toLocaleString('es-CR')}</span>
              <button class="add-btn" onclick="event.stopPropagation(); agregarAlCarrito(${p.id}, this)"><i class="fas fa-plus"></i></button>
            </div>
        </div>
      </div>
    `;
  });
  
  carouselContainer.innerHTML = html;
}

// Agregar al carrito
window.agregarAlCarrito = function(id, boton) {
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

// Quitar del carrito
window.quitarDelCarrito = function(carritoId) {
  carrito = carrito.filter(item => item.carritoId !== carritoId);
  actualizarCarritoUI();
  renderizarModalCarrito();
};

// Actualizar UI del carrito (contador)
function actualizarCarritoUI() {
  const totalProductos = carrito.length;
  
  // Actualizar ambos contadores
  if (cartCountHeaderDesktop) {
    cartCountHeaderDesktop.innerText = totalProductos;
  }
  if (cartCountHeaderMobile) {
    cartCountHeaderMobile.innerText = totalProductos;
  }
}

// Renderizar modal del carrito
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

// Abrir modal carrito
function abrirModalCarrito() {
  renderizarModalCarrito();
  cartModal.classList.add('active');
}

// Cerrar modal carrito
function cerrarModalCarrito() {
  cartModal.classList.remove('active');
}

// Enviar por WhatsApp
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

// Búsqueda
function buscar() {
  busqueda = searchInput.value.trim();
  filtrarProductos();
}

// Navegación entre páginas
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

// ===== EVENT LISTENERS =====
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

closeModalBtn.addEventListener('click', cerrarModalCarrito);

modalWhatsAppBtn.addEventListener('click', () => {
  enviarWhatsApp();
});

// Cerrar modal carrito al hacer clic fuera
cartModal.addEventListener('click', (e) => {
  if (e.target === cartModal) cerrarModalCarrito();
});

// Cerrar modal imagen al hacer clic en botón o fuera
closeImageModal.addEventListener('click', cerrarModalImagen);
imageModal.addEventListener('click', (e) => {
  if (e.target === imageModal) cerrarModalImagen();
});

searchBtn.addEventListener('click', buscar);
searchInput.addEventListener('keyup', (e) => {
  if (e.key === 'Enter') buscar();
});

linkHome.addEventListener('click', (e) => { e.preventDefault(); mostrarHome(); });
linkAbout.addEventListener('click', (e) => { e.preventDefault(); mostrarAbout(); });
backToHomeBtn.addEventListener('click', (e) => { e.preventDefault(); mostrarHome(); });

menuToggle.addEventListener('click', () => {
  navLinks.classList.toggle('active');
});

// ===== INICIALIZACIÓN =====
function init() {
  initCategoryFilters();
  renderizarCarrusel();
  filtrarProductos();  
  actualizarCarritoUI();
  mostrarHome();
}

init();