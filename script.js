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
  const openBtn = document.getElementById("openVideoBtn");

  //window.openVideoModal = function () {
  // if (modal) modal.style.display = "block";
  //};

  if (openBtn) {
    openBtn.addEventListener('click', () => {
      if (modal) modal.style.display = "block";
    });
  }


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

  btnCerrar.addEventListener('click', function (event) {
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
  // Elementos principales
  const card = document.getElementById("cardSeguimiento");
  const modal = document.getElementById("popupModal");
  const cerrarTop = document.getElementById("cerrarModalTop");
  const cerrarBottom = document.getElementById("cerrarModal");
  const medicinaCard = document.querySelector('[data-profesion="medicina"]');
  const medicinaLista = document.getElementById("medicina-lista");
  const buscador = document.getElementById("buscadorMedicos");
  const lista = document.getElementById("listaMedicos");

  const btnCriterio = document.getElementById('btnCriterio');
  const contenedorCriterios = document.getElementById('contenedorCriterios');
  const btnCerrarCriterios = document.getElementById('cerrarCriterios');
  const btnContainer = document.querySelector('.btn-container');

  const enfermeriaCard = document.querySelector('[data-profesion="enfermeria"]');
  const enfermeriaLista = document.getElementById("enfermeria-lista");
  const buscadorEnfermeria = document.getElementById("buscadorEnfermeria");
  const listaEnfermeria = document.getElementById("listaEnfermeria");
  const btnFlujo = document.getElementById('btnFlujo');
  const contenedorFlujo = document.getElementById('contenedorFlujo');
  const btnCerrarFlujo = document.getElementById('cerrarFlujo');

  const btnMesaAyuda = document.getElementById("btnMesaAyuda");
  const contenedorMesaAyuda = document.getElementById("contenedorMesaAyuda");
  const cerrarMesaAyuda = document.getElementById("cerrarMesaAyuda");


  const profesionales = [
    { nombre: "Machuca Bazan Dhalia Del Rocio", url: "https://docs.google.com/spreadsheets/d/1vQm05ucuNpFvu4rzaGXM4h22sxDwYr2qwozN66P1S-w/edit?gid=1418781266#gid=1418781266" },
    { nombre: "Cueva Lopez, Raquel Johanna", url: "https://docs.google.com/spreadsheets/d/1vQm05ucuNpFvu4rzaGXM4h22sxDwYr2qwozN66P1S-w/edit?gid=1101181357#gid=1101181357" },
    { nombre: "Flores Machaca Jaime Raul", url: "https://docs.google.com/spreadsheets/d/1vQm05ucuNpFvu4rzaGXM4h22sxDwYr2qwozN66P1S-w/edit?gid=1429308899#gid=1429308899" },
    { nombre: "Medina Leiva, Jorge Ramiro", url: "https://docs.google.com/spreadsheets/d/1vQm05ucuNpFvu4rzaGXM4h22sxDwYr2qwozN66P1S-w/edit?gid=985270562#gid=985270562" },
    { nombre: "Mayo Arpi Diana Alisson", url: "https://docs.google.com/spreadsheets/d/1vQm05ucuNpFvu4rzaGXM4h22sxDwYr2qwozN66P1S-w/edit?gid=859488515#gid=859488515" },
    { nombre: "Herrera Palmi Carolina Raquel", url: "https://docs.google.com/spreadsheets/d/1vQm05ucuNpFvu4rzaGXM4h22sxDwYr2qwozN66P1S-w/edit?gid=1751033990#gid=1751033990" },
    { nombre: "Silva Toribio Rut Judit", url: "https://docs.google.com/spreadsheets/d/1vQm05ucuNpFvu4rzaGXM4h22sxDwYr2qwozN66P1S-w/edit?gid=648295653#gid=648295653" },
    { nombre: "Roldan Montes Stephanie Karina", url: "https://docs.google.com/spreadsheets/d/1vQm05ucuNpFvu4rzaGXM4h22sxDwYr2qwozN66P1S-w/edit?gid=1692554361#gid=1692554361" },
    { nombre: "Abraham Hurtado, Sairah Carolina", url: "https://docs.google.com/spreadsheets/d/1vQm05ucuNpFvu4rzaGXM4h22sxDwYr2qwozN66P1S-w/edit?gid=13441560#gid=13441560" },
    { nombre: "Acosta Hurtado, Xiomara Alexandra", url: "https://docs.google.com/spreadsheets/d/1vQm05ucuNpFvu4rzaGXM4h22sxDwYr2qwozN66P1S-w/edit?gid=1458555454#gid=1458555454" },
    { nombre: "Anicama Budiel, Daniel", url: "https://docs.google.com/spreadsheets/d/1vQm05ucuNpFvu4rzaGXM4h22sxDwYr2qwozN66P1S-w/edit?gid=29124731#gid=29124731" },
    { nombre: "Aragon Arriola, Victor", url: "https://docs.google.com/spreadsheets/d/1vQm05ucuNpFvu4rzaGXM4h22sxDwYr2qwozN66P1S-w/edit?gid=1039294332#gid=1039294332" },
    { nombre: "Arones Santayana, Tania Milagros", url: "https://docs.google.com/spreadsheets/d/1vQm05ucuNpFvu4rzaGXM4h22sxDwYr2qwozN66P1S-w/edit?gid=1808632685#gid=1808632685" },
    { nombre: "Bastidas Ramos Evelyn Paola", url: "https://docs.google.com/spreadsheets/d/1vQm05ucuNpFvu4rzaGXM4h22sxDwYr2qwozN66P1S-w/edit?gid=652116364#gid=652116364" },
    { nombre: "Canales Vasquez Bryam", url: "https://docs.google.com/spreadsheets/d/1vQm05ucuNpFvu4rzaGXM4h22sxDwYr2qwozN66P1S-w/edit?gid=1914875513#gid=1914875513" },
    { nombre: "Cecinario Lopez, Elena Milagros", url: "https://docs.google.com/spreadsheets/d/1vQm05ucuNpFvu4rzaGXM4h22sxDwYr2qwozN66P1S-w/edit?gid=1925676282#gid=1925676282" },
    { nombre: "Diaz Garcia Silvia Isabel", url: "https://docs.google.com/spreadsheets/d/1vQm05ucuNpFvu4rzaGXM4h22sxDwYr2qwozN66P1S-w/edit?gid=886179292#gid=886179292" },
    { nombre: "García Marcano, Ennifer Karina", url: "https://docs.google.com/spreadsheets/d/1vQm05ucuNpFvu4rzaGXM4h22sxDwYr2qwozN66P1S-w/edit?gid=2013866336#gid=2013866336" },
    { nombre: "Herrera Moncada, Sindy Romina", url: "https://docs.google.com/spreadsheets/d/1vQm05ucuNpFvu4rzaGXM4h22sxDwYr2qwozN66P1S-w/edit?gid=1597740568#gid=1597740568" },
    { nombre: "Jimenez Tornero, Ximena", url: "https://docs.google.com/spreadsheets/d/1vQm05ucuNpFvu4rzaGXM4h22sxDwYr2qwozN66P1S-w/edit?gid=1034229989#gid=1034229989" },
    { nombre: "Laban Leiva, Diana Emperatriz", url: "https://docs.google.com/spreadsheets/d/1vQm05ucuNpFvu4rzaGXM4h22sxDwYr2qwozN66P1S-w/edit?gid=1468718713#gid=1468718713" },
    { nombre: "Leonardo Gonzales, Roxana", url: "https://docs.google.com/spreadsheets/d/1vQm05ucuNpFvu4rzaGXM4h22sxDwYr2qwozN66P1S-w/edit?gid=489483443#gid=489483443" },
    { nombre: "Medina Lopez Nathaly", url: "https://docs.google.com/spreadsheets/d/1vQm05ucuNpFvu4rzaGXM4h22sxDwYr2qwozN66P1S-w/edit?gid=926826109#gid=926826109" },
    { nombre: "Rodriguez Bravo Marixandra", url: "https://docs.google.com/spreadsheets/d/1vQm05ucuNpFvu4rzaGXM4h22sxDwYr2qwozN66P1S-w/edit?gid=1075082221#gid=1075082221" },
    { nombre: "Sánchez Del Hierro, Maria Pia Sthefany", url: "https://docs.google.com/spreadsheets/d/1vQm05ucuNpFvu4rzaGXM4h22sxDwYr2qwozN66P1S-w/edit?gid=927285602#gid=927285602" },
    { nombre: "Tinajeros Vega, Ivette Marilyn", url: "https://docs.google.com/spreadsheets/d/1vQm05ucuNpFvu4rzaGXM4h22sxDwYr2qwozN66P1S-w/edit?gid=1187901923#gid=1187901923" },
    { nombre: "Feijoo Galvez Sergio Mauricio", url: "https://docs.google.com/spreadsheets/d/1vQm05ucuNpFvu4rzaGXM4h22sxDwYr2qwozN66P1S-w/edit?gid=1612924707#gid=1612924707" },
    { nombre: "Gallegos Alvarado Karla Patricia", url: "https://docs.google.com/spreadsheets/d/1vQm05ucuNpFvu4rzaGXM4h22sxDwYr2qwozN66P1S-w/edit?gid=892155851#gid=892155851" },
    { nombre: "Zegarra Inchausti Vanessa Daphne", url: "https://docs.google.com/spreadsheets/d/1vQm05ucuNpFvu4rzaGXM4h22sxDwYr2qwozN66P1S-w/edit?gid=2101624040#gid=2101624040" },
    { nombre: "Mendoza Saldaña Juan", url: "https://docs.google.com/spreadsheets/d/1vQm05ucuNpFvu4rzaGXM4h22sxDwYr2qwozN66P1S-w/edit?gid=1568390888#gid=1568390888" },
    { nombre: "Cornejo Agama Marco", url: "https://docs.google.com/spreadsheets/d/1vQm05ucuNpFvu4rzaGXM4h22sxDwYr2qwozN66P1S-w/edit?gid=1812840858#gid=1812840858" },
    { nombre: "Toro Lozano, Yasany Madeleydy", url: "https://docs.google.com/spreadsheets/d/1vQm05ucuNpFvu4rzaGXM4h22sxDwYr2qwozN66P1S-w/edit?gid=1183433806#gid=1183433806" },
    { nombre: "Tatiana Emperatriz Avalos Cruz", url: "https://docs.google.com/spreadsheets/d/1vQm05ucuNpFvu4rzaGXM4h22sxDwYr2qwozN66P1S-w/edit?gid=591337825#gid=591337825" },
    { nombre: "Yosselyn Gabriela Flores Perez", url: "https://docs.google.com/spreadsheets/d/1vQm05ucuNpFvu4rzaGXM4h22sxDwYr2qwozN66P1S-w/edit?gid=1904161931#gid=1904161931" },
    { nombre: "Jose Enrique Castañeda Apolinario", url: "https://docs.google.com/spreadsheets/d/1vQm05ucuNpFvu4rzaGXM4h22sxDwYr2qwozN66P1S-w/edit?gid=1536927381#gid=1536927381" },
    { nombre: "Gonzales Graus Ivan", url: "https://docs.google.com/spreadsheets/d/1vQm05ucuNpFvu4rzaGXM4h22sxDwYr2qwozN66P1S-w/edit?gid=1187237906#gid=1187237906" },
    { nombre: "Aquino Grande Dayhan Jennifer", url: "https://docs.google.com/spreadsheets/d/1vQm05ucuNpFvu4rzaGXM4h22sxDwYr2qwozN66P1S-w/edit?gid=786045073#gid=786045073" },
    { nombre: "Raiza Fiorella Atoccsa Rojas ", url: "https://docs.google.com/spreadsheets/d/1vQm05ucuNpFvu4rzaGXM4h22sxDwYr2qwozN66P1S-w/edit?gid=1914875513#gid=1914875513" },
    { nombre: "Andrea Lorena Chavez Delgado ", url: "https://docs.google.com/spreadsheets/d/1vQm05ucuNpFvu4rzaGXM4h22sxDwYr2qwozN66P1S-w/edit?gid=844668857#gid=844668857" }
  
  ];

  const profesionalesEnfermeria = [
    { nombre: "Baquero Rodriguez Tania", url: "https://docs.google.com/spreadsheets/d/1NPti10knKUkohXwIJVTTE8OV3xQK6Zeh-cj2yBTN200/edit?gid=1243032331#gid=1243032331" },
    { nombre: "Caceres Valdez Ilda", url: "https://docs.google.com/spreadsheets/d/1NPti10knKUkohXwIJVTTE8OV3xQK6Zeh-cj2yBTN200/edit?gid=1368772361#gid=1368772361" },
    { nombre: "Casique Carbajal Karla Betsabe", url: "https://docs.google.com/spreadsheets/d/1NPti10knKUkohXwIJVTTE8OV3xQK6Zeh-cj2yBTN200/edit?gid=1504212023#gid=1504212023" },
    { nombre: "Cieza Huisa Elizabeth Jackeline", url: "https://docs.google.com/spreadsheets/d/1NPti10knKUkohXwIJVTTE8OV3xQK6Zeh-cj2yBTN200/edit?gid=1048287853#gid=1048287853" },
    { nombre: "Goñas Sopla Ceida", url: "https://docs.google.com/spreadsheets/d/1NPti10knKUkohXwIJVTTE8OV3xQK6Zeh-cj2yBTN200/edit?gid=963096201#gid=963096201" },
    { nombre: "Orellana Gutierrez Sandra Rocio", url: "https://docs.google.com/spreadsheets/d/1NPti10knKUkohXwIJVTTE8OV3xQK6Zeh-cj2yBTN200/edit?gid=633431742#gid=633431742" },
    { nombre: "Quispe Evangelista Maria", url: "https://docs.google.com/spreadsheets/d/1NPti10knKUkohXwIJVTTE8OV3xQK6Zeh-cj2yBTN200/edit?gid=192149304#gid=192149304" },
    { nombre: "Vasquez Venancino Rocio", url: "https://docs.google.com/spreadsheets/d/1NPti10knKUkohXwIJVTTE8OV3xQK6Zeh-cj2yBTN200/edit?gid=172090975#gid=172090975" }
  ];



  // Función para cerrar modal y limpiar buscador/lista
  function cerrarModal() {
    modal.style.display = "none";
    medicinaLista.style.display = "none";
    buscador.value = "";
    lista.innerHTML = "";
  }

  // Abrir modal
  card.addEventListener("click", () => {
    modal.style.display = "flex";
  });

  // Cerrar modal con botones
  [cerrarTop, cerrarBottom].forEach(btn => {
    if (btn) {
      btn.addEventListener("click", cerrarModal);
    }
  });

  // Mostrar buscador de Medicina
  if (medicinaCard && medicinaLista && buscador && enfermeriaLista) {
    medicinaCard.addEventListener("click", () => {
      medicinaLista.style.display = "block";
      buscador.focus();
      enfermeriaLista.style.display = "none"; // Oculta Enfermería
    });
  }

  // Mostrar buscador de Enfermería
  if (enfermeriaCard && enfermeriaLista && buscadorEnfermeria && medicinaLista) {
    enfermeriaCard.addEventListener("click", () => {
      enfermeriaLista.style.display = "block";
      buscadorEnfermeria.focus();
      medicinaLista.style.display = "none"; // Oculta Medicina
    });
  }


  const cards = document.querySelectorAll(".profile-card");

  cards.forEach((card) => {
    card.addEventListener("click", () => {
      // Oculta todos los desplegables primero
      medicinaLista.style.display = "none";
      enfermeriaLista.style.display = "none";

      // Elimina clase activa de todas las tarjetas
      cards.forEach((c) => c.classList.remove("active"));

      // Marca esta tarjeta como activa
      card.classList.add("active");

      const profesion = card.dataset.profesion;

      if (profesion === "medicina") {
        medicinaLista.style.display = "block";
      } else if (profesion === "enfermeria") {
        enfermeriaLista.style.display = "block";
      }
    });
  });



  // Buscar profesionales medicos
  if (buscador && lista) {
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
            window.open(p.url, "_blank");
          });
          lista.appendChild(li);
        });
    });
  }

  buscadorEnfermeria.addEventListener("input", () => {
    const filtro = buscadorEnfermeria.value.toLowerCase();
    listaEnfermeria.innerHTML = "";

    profesionalesEnfermeria.forEach((prof) => {
      if (prof.nombre.toLowerCase().includes(filtro)) {
        const li = document.createElement("li");
        li.textContent = prof.nombre;
        li.classList.add("doctor-name");
        li.addEventListener("click", () => {
          window.open(prof.url, "_blank");
        });
        listaEnfermeria.appendChild(li);
      }
    });
  });


  // Cerrar modal haciendo clic fuera
  window.addEventListener("click", (e) => {
    if (e.target === modal) cerrarModal();
  });

  // Mostrar criterios
  if (btnCriterio && contenedorCriterios && btnCerrarCriterios && btnContainer && cerrarTop) {
    btnCriterio.addEventListener('click', () => {
      contenedorCriterios.style.display = 'flex';
      btnContainer.style.display = 'none';
      cerrarTop.style.display = 'none';
    });

    btnCerrarCriterios.addEventListener('click', () => {
      contenedorCriterios.style.display = 'none';
      btnContainer.style.display = 'flex';
      cerrarTop.style.display = 'inline-block';
    });
  }

  // Lógica para abrir el popup de Flujo
  btnFlujo.addEventListener('click', () => {
    contenedorFlujo.style.display = 'flex';
  });

  // Lógica para cerrar el popup de Flujo
  btnCerrarFlujo.addEventListener('click', () => {
    contenedorFlujo.style.display = 'none';
  });


  if (btnMesaAyuda && contenedorMesaAyuda && cerrarMesaAyuda) {
    btnMesaAyuda.addEventListener("click", () => {
      contenedorMesaAyuda.style.display = "flex";
    });

    cerrarMesaAyuda.addEventListener("click", () => {
      contenedorMesaAyuda.style.display = "none";
    });
  }



});



// ----------------------------------------
// 8. VIDEOS TUTORIALES
// ----------------------------------------


function openVideoModal() {
  const modal = document.getElementById('videoModal');
  modal.style.display = 'flex';
}

function closeVideoModal() {
  const modal = document.getElementById("videoModal");
  modal.style.display = "none";

  // Detener los videos: reiniciar los src con un pequeño delay
  const iframes = modal.querySelectorAll("iframe");
  iframes.forEach((iframe) => {
    const src = iframe.src;
    iframe.src = ""; // Limpia primero

    // Espera un poquito para recargar
    setTimeout(() => {
      iframe.src = src;
    }, 100);
  });
}



// Cerrar modal si haces clic fuera del contenido
window.addEventListener('click', function (event) {
  const modal = document.getElementById('videoModal');
  const content = document.querySelector('.tutoriales-content');
  if (event.target === modal) {
    closeVideoModal();
  }
});
