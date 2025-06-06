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
    const isMobile = window.innerWidth <= 768;
    nav.classList.toggle('show-menu');
    toggle.classList.toggle('bx-x');
    toggle.classList.toggle('bx-menu');

    // Solo para móviles, mostrar automáticamente Información General y submenús
    if (isMobile && nav.classList.contains('show-menu')) {
      // Mostrar sección principal
      showMainSection();

      // Agregar clase active al link principal si aplica
      const homeLink = document.querySelector('.nav__link[href="#main-content"]');
      if (homeLink) {
        document.querySelectorAll('.nav__link').forEach(link => link.classList.remove('active'));
        homeLink.classList.add('active');
      }

      // Desplegar submenús automáticamente
      const subMenu1 = document.querySelector('.sub-menu1');
      const subMenu2 = document.querySelector('.sub-menu2');
      if (subMenu1) subMenu1.classList.add('show-submenu');
      if (subMenu2) subMenu2.classList.add('show-submenu');
    }
  });

  // Desactivar cierre de menú en enlaces que expanden submenús
  document.querySelectorAll('.nav__link, .nav__dropdown-item, .nav__dropdown-item1, .nav__dropdown-item2').forEach(link => {
    link.addEventListener('click', (event) => {
      // Si es el link "Información General" no hacer nada (no cerrar el menú)
      if (link.classList.contains('nav__link') && link.getAttribute('href') === '#main-content') {
        event.preventDefault(); // Evitar navegación y cierre
        return; // No hacer nada más
      }
  
      if (!link.classList.contains('dropdown-toggle1') && !link.classList.contains('dropdown-toggle2')) {
        if (window.innerWidth <= 768) {
          nav.classList.remove('show-menu');
          toggle.classList.replace('bx-x', 'bx-menu');
        }
      } else {
        event.preventDefault(); // evitar cerrar al hacer clic en toggle
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

// ----------------------------------------
// 7. POP UP DE PACIENTES CRONICOS
// ----------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  const card = document.getElementById("cardSeguimiento");
  const modal = document.getElementById("popupModal");
  const cerrarTop = document.getElementById("cerrarModalTop");
  const cerrarBottom = document.getElementById("cerrarModal");
  const medicinaCard = document.querySelector('[data-profesion="medicina"]');
  const medicinaLista = document.getElementById("medicina-lista");
  const buscador = document.getElementById("buscadorMedicos");
  const lista = document.getElementById("listaMedicos");

  const profesionales = [
    { nombre: "ABRAHAM HURTADO, SAIRAH CAROLINA", url: "https://docs.google.com/spreadsheets/d/1vQm05ucuNpFvu4rzaGXM4h22sxDwYr2qwozN66P1S-w/edit?gid=13441560#gid=13441560" },
    { nombre: "ANICAMA BUDIEL, DANIEL", url: "https://docs.google.com/spreadsheets/d/1vQm05ucuNpFvu4rzaGXM4h22sxDwYr2qwozN66P1S-w/edit?gid=29124731#gid=29124731" },
    { nombre: "FEIJOO GALVEZ SERGIO MAURICIO", url: "https://docs.google.com/spreadsheets/d/1vQm05ucuNpFvu4rzaGXM4h22sxDwYr2qwozN66P1S-w/edit?gid=1612924707#gid=1612924707" },
    { nombre: "FLORES PEREZ, YOSSELYN GABRIELA", url: "https://docs.google.com/spreadsheets/d/1vQm05ucuNpFvu4rzaGXM4h22sxDwYr2qwozN66P1S-w/edit?gid=1904161931#gid=1904161931" },
    { nombre: "GARCÍA MARCANO, ENNIFER KARINA", url: "https://docs.google.com/spreadsheets/d/1vQm05ucuNpFvu4rzaGXM4h22sxDwYr2qwozN66P1S-w/edit?gid=2013866336#gid=2013866336" },
    { nombre: "HERRERA MONCADA, SINDY ROMINA", url: "https://docs.google.com/spreadsheets/d/1vQm05ucuNpFvu4rzaGXM4h22sxDwYr2qwozN66P1S-w/edit?gid=1597740568#gid=1597740568" },
    { nombre: "JIMENEZ TORNERO, XIMENA", url: "https://docs.google.com/spreadsheets/d/1vQm05ucuNpFvu4rzaGXM4h22sxDwYr2qwozN66P1S-w/edit?gid=1034229989#gid=1034229989" },
    { nombre: "LABAN LEIVA, DIANA EMPERATRIZ", url: "https://docs.google.com/spreadsheets/d/1vQm05ucuNpFvu4rzaGXM4h22sxDwYr2qwozN66P1S-w/edit?gid=1468718713#gid=1468718713" },
    { nombre: "MENDOZA SALDAÑA JUAN", url: "https://docs.google.com/spreadsheets/d/1vQm05ucuNpFvu4rzaGXM4h22sxDwYr2qwozN66P1S-w/edit?gid=1568390888#gid=1568390888" },
    { nombre: "RODRIGUEZ BRAVO MARIXANDRA", url: "https://docs.google.com/spreadsheets/d/1vQm05ucuNpFvu4rzaGXM4h22sxDwYr2qwozN66P1S-w/edit?gid=1075082221#gid=1075082221" },
    { nombre: "TINAJEROS VEGA, IVETTE MARILYN", url: "https://docs.google.com/spreadsheets/d/1vQm05ucuNpFvu4rzaGXM4h22sxDwYr2qwozN66P1S-w/edit?gid=1187901923#gid=1187901923" },
  ];

  // Mostrar el modal
  card.addEventListener("click", () => {
    modal.style.display = "flex";
  });

  // Cerrar el modal desde X o botón inferior
  [cerrarTop, cerrarBottom].forEach(btn =>
    btn.addEventListener("click", () => {
      cerrarModal();
    })
  );

  // Mostrar buscador al hacer clic en Medicina
  medicinaCard.addEventListener("click", () => {
    medicinaLista.style.display = "block";
    buscador.focus();
  });

  // Buscar profesionales por nombre
  buscador.addEventListener("input", () => {
    const texto = buscador.value.toLowerCase().trim();
    lista.innerHTML = "";

    if (texto.length === 0) return;

    profesionales
      .filter(p => p.nombre.toLowerCase().includes(texto))
      .forEach(p => {
        const li = document.createElement("li");
        li.textContent = p.nombre;
        li.style.cursor = "pointer";
        li.addEventListener("click", () => {
          window.open(p.url, "_blank"); // ✅ Abre en nueva pestaña
        });
        lista.appendChild(li);
      });
  });

  // Cerrar modal haciendo clic fuera
  window.addEventListener("click", (e) => {
    if (e.target === modal) cerrarModal();
  });

  function cerrarModal() {
    modal.style.display = "none";
    medicinaLista.style.display = "none";
    buscador.value = "";
    lista.innerHTML = "";
  }
});
