// Función que gestiona la visualización del menú
const Mostrarmenu = (headerToggle, navbarId) => {
  const toggleBtn = document.getElementById(headerToggle);
  const nav = document.getElementById(navbarId);

  if (toggleBtn && nav) {
    toggleBtn.addEventListener("click", () => {
      nav.classList.toggle("show-menu");
      toggleBtn.classList.toggle("bx-x");
    });
  }
};

// Inicializa el menú pasando los IDs del botón y la barra de navegación
Mostrarmenu("header-toggle", "navbar");

document.addEventListener("DOMContentLoaded", function () {
  const linkcolor = document.querySelectorAll(".nav__link");

  // Cambia el color del enlace activo
  function colorLink() {
    linkcolor.forEach((item) => item.classList.remove("active"));
    this.classList.add("active");
  }

  linkcolor.forEach((item) => item.addEventListener("click", colorLink));

  // Función para mostrar u ocultar los dropdowns
  const dropdown1 = document.querySelector(".dropdown-toggle1");
  const dropdown2 = document.querySelector(".dropdown-toggle2");
  const submenu1 = document.querySelector(".sub-menu1");
  const submenu2 = document.querySelector(".sub-menu2");

  dropdown1.addEventListener("click", () => {
    submenu1.classList.toggle("show-submenu");
  });

  dropdown2.addEventListener("click", () => {
    submenu2.classList.toggle("show-submenu");
  });

  // Ocultar todas las secciones y mostrar la seleccionada
  const mainContent = document.getElementById("main-content");
  const librarytadContent = document.getElementById("librarytad-content");
  const subsections = [
    document.getElementById("subsection1"),
    document.getElementById("subsection2"),
    document.getElementById("subsection3"),
    document.getElementById("subsection4"),
    document.getElementById("subsection5"),
    document.getElementById("subsection6"),
    document.getElementById("subsection7"),
    document.getElementById("subsection8"),
    document.getElementById("subsection9"),
  ];

  function showSection(targetSection) {
    mainContent.style.display = "none";
    librarytadContent.style.display = "none";
    subsections.forEach((subsection) => {
      subsection.style.display = "none";
    });

    if (targetSection) {
      targetSection.style.display = "block";
    }
  }

  // Ajuste de selección de enlaces de navegación y dropdown
  const navLinks = document.querySelectorAll(
    ".nav__dropdown-item, .nav__dropdown-item1, .nav__link, .nav__dropdown-item2"
  );

  // Al hacer clic en un elemento de submenú, agrega la clase "active"
document.querySelectorAll(".sub-menu1 a, .sub-menu2 a").forEach((item) => {
  item.addEventListener("click", function () {
    // Remueve "active" de todos los elementos del submenú
    document.querySelectorAll(".sub-menu1 a, .sub-menu2 a").forEach((el) =>
      el.classList.remove("active")
    );
    // Añade "active" solo al elemento clicado
    this.classList.add("active");
  });
});


  navLinks.forEach((link) => {
    link.addEventListener("click", function (event) {
      event.preventDefault();
      const sectionId = this.getAttribute("href");

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
});


function openVideoModal() {
  const modal = document.getElementById("videoModal");
  modal.style.display = "block";
}

function closeVideoModal() {
  const modal = document.getElementById("videoModal");
  modal.style.display = "none";
  const video = document.getElementById("videoPlayer");
  video.pause(); // Pausar el video si se cierra el modal
  video.currentTime = 0; // Reiniciar el video
}

// Cerrar modal si se hace clic fuera de este
window.onclick = function (event) {
  const modal = document.getElementById("videoModal");
  if (event.target === modal) {
    closeVideoModal();
  }
};
