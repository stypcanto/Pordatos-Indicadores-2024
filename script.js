// ========================================
// Código JS Principal para Navegación y UI
// Versión Mejorada y Limpia
// ========================================

document.addEventListener("DOMContentLoaded", () => {
  // Inicializaciones generales al cargar la página
  initMenuToggle();
  initNavLinks();
  initSubmenuToggles();
  initSectionNavigation();
  initVideoModal();
  initCerrarButton();
});

// ----------------------------------------
// 1. Toggle Menú Principal (Hamburguesa)
// ----------------------------------------
function initMenuToggle() {
  const toggle = document.getElementById('header-toggle');
  const nav = document.getElementById('navbar');

  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    nav.classList.toggle('show-menu');
    toggle.classList.toggle('bx-x');
    toggle.classList.toggle('bx-menu');
  });

  // Cierra menú al hacer clic en un enlace (en móviles)
  document.querySelectorAll('.nav__link, .nav__dropdown-item, .nav__dropdown-item1, .nav__dropdown-item2').forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        nav.classList.remove('show-menu');
        toggle.classList.replace('bx-x', 'bx-menu');
      }
    });
  });
}

// ----------------------------------------
// 2. Activar Clase "Active" en Links de Navegación
// ----------------------------------------
function initNavLinks() {
  const navLinks = document.querySelectorAll(".nav__link");

  navLinks.forEach(link => {
    link.addEventListener("click", function () {
      navLinks.forEach(item => item.classList.remove("active"));
      this.classList.add("active");
    });
  });

  // Manejo de active en submenús
  document.querySelectorAll(".sub-menu1 a, .sub-menu2 a").forEach(link => {
    link.addEventListener("click", function () {
      document.querySelectorAll(".sub-menu1 a, .sub-menu2 a").forEach(el =>
        el.classList.remove("active")
      );
      this.classList.add("active");
    });
  });
}

// ----------------------------------------
// 3. Toggle Submenús (Dropdowns)
// ----------------------------------------
function initSubmenuToggles() {
  document.querySelectorAll('.dropdown-toggle1, .dropdown-toggle2').forEach(toggle => {
    toggle.addEventListener('click', (e) => {
      e.preventDefault();
    
      const isFirst = toggle.classList.contains('dropdown-toggle1');
      const submenu = isFirst
        ? document.querySelector('.sub-menu1')
        : document.querySelector('.sub-menu2');
    
      submenu.classList.toggle('show-submenu');
    
      // Cerrar el otro submenú para evitar superposiciones
      const otherSubmenu = isFirst
        ? document.querySelector('.sub-menu2')
        : document.querySelector('.sub-menu1');
    
      otherSubmenu.classList.remove('show-submenu');
    });
    
  });
}

// ----------------------------------------
// 4. Navegación entre Secciones (mostrar/ocultar)
// ----------------------------------------
function initSectionNavigation() {
  const mainContent = document.getElementById("main-content");
  const librarytadContent = document.getElementById("librarytad-content");
  const subsections = Array.from({ length: 9 }, (_, i) =>
    document.getElementById(`subsection${i + 1}`)
  );

  const navLinks = document.querySelectorAll(
    ".nav__dropdown-item, .nav__dropdown-item1, .nav__link, .nav__dropdown-item2"
  );

  function showSection(targetSection) {
    // Ocultar todas las secciones
    if (mainContent) mainContent.style.display = "none";
    if (librarytadContent) librarytadContent.style.display = "none";
    subsections.forEach(sec => {
      if (sec) sec.style.display = "none";
    });

    // Mostrar la sección deseada
    if (targetSection) {
      targetSection.style.display = "block";
    }
  }

  // Mostrar sección principal por defecto al cargar la página
  showSection(mainContent);

  // Manejar clicks en links para navegar entre secciones
  navLinks.forEach(link => {
    link.addEventListener("click", function (event) {
      const sectionId = this.getAttribute("href");
  
      // Si no hay href o no comienza con #, no es navegación, es solo un toggle de dropdown
      if (!sectionId || !sectionId.startsWith("#")) return;
  
      event.preventDefault();
  
      let targetSection;
      if (sectionId === "#main-content") {
        targetSection = mainContent;
      } else if (sectionId === "#librarytad-content") {
        targetSection = librarytadContent;
      } else {
        targetSection = document.getElementById(sectionId.substring(1));
      }
  
      showSection(targetSection);
    });
  });
  
}

// ----------------------------------------
// 5. Modal de Video (Abrir/Cerrar)
// ----------------------------------------
function initVideoModal() {
  const modal = document.getElementById("videoModal");
  const video = document.getElementById("videoPlayer");

  window.openVideoModal = function () {
    if (modal) modal.style.display = "block";
  };

  window.closeVideoModal = function () {
    if (modal) modal.style.display = "none";
    if (video) {
      video.pause();
      video.currentTime = 0;
    }
  };

  window.addEventListener("click", function (event) {
    if (event.target === modal) {
      window.closeVideoModal();
    }
  });
}

// ----------------------------------------
// 6. Botón Cerrar - Volver a la Vista Inicial
// ----------------------------------------
function initCerrarButton() {
  const btnCerrar = document.getElementById('btnCerrar');
  if (!btnCerrar) return;

  btnCerrar.addEventListener('click', function(event) {
    event.preventDefault();
    showMainSection();
  });
}

// ----------------------------------------
// Función para mostrar solo la sección principal
// y resetear el estado visual de navegación
// ----------------------------------------
function showMainSection() {
  const mainContent = document.getElementById("main-content");
  const librarytadContent = document.getElementById("librarytad-content");
  const subsections = Array.from({ length: 9 }, (_, i) =>
    document.getElementById(`subsection${i + 1}`)
  );

  if (mainContent) mainContent.style.display = "block";
  if (librarytadContent) librarytadContent.style.display = "none";
  subsections.forEach(sec => {
    if (sec) sec.style.display = "none";
  });

  // Limpiar clases active de todos los enlaces de navegación
  document.querySelectorAll('.nav__link, .nav__dropdown-item, .nav__dropdown-item1, .nav__dropdown-item2').forEach(link => {
    link.classList.remove('active');
  });

  // Poner el link principal activo (vista inicial)
  const homeLink = document.querySelector('.nav__link[href="#main-content"]');
  if (homeLink) homeLink.classList.add('active');
}
