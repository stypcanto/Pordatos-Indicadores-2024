document.addEventListener("DOMContentLoaded", () => {
  initMenuToggle();
  initNavLinks();
  initSubmenuToggles();
  initSectionNavigation();
  initVideoModal();
});

function initMenuToggle() {
  const toggle = document.getElementById('header-toggle');
  const nav = document.getElementById('navbar');

  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    nav.classList.toggle('show-menu');
    toggle.classList.toggle('bx-x');
    toggle.classList.toggle('bx-menu');
  });

  document.querySelectorAll('.nav__link, .nav__dropdown-item, .nav__dropdown-item1, .nav__dropdown-item2').forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        nav.classList.remove('show-menu');
        toggle.classList.replace('bx-x', 'bx-menu');
      }
    });
  });
}

function initNavLinks() {
  const navLinks = document.querySelectorAll(".nav__link");

  navLinks.forEach(link => {
    link.addEventListener("click", function () {
      navLinks.forEach(item => item.classList.remove("active"));
      this.classList.add("active");
    });
  });

  // Para submenús
  document.querySelectorAll(".sub-menu1 a, .sub-menu2 a").forEach(link => {
    link.addEventListener("click", function () {
      document.querySelectorAll(".sub-menu1 a, .sub-menu2 a").forEach(el =>
        el.classList.remove("active")
      );
      this.classList.add("active");
    });
  });
}

function initSubmenuToggles() {
  document.querySelectorAll('.dropdown-toggle1, .dropdown-toggle2').forEach(toggle => {
    toggle.addEventListener('click', (e) => {
      e.preventDefault();

      const isFirst = toggle.classList.contains('dropdown-toggle1');
      const submenu = isFirst
        ? document.querySelector('.sub-menu1')
        : document.querySelector('.sub-menu2');

      submenu.classList.toggle('show-submenu');

      // Cerrar el otro submenú
      const otherSubmenu = isFirst
        ? document.querySelector('.sub-menu2')
        : document.querySelector('.sub-menu1');

      otherSubmenu.classList.remove('show-submenu');
    });
  });
}

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
    mainContent.style.display = "none";
    librarytadContent.style.display = "none";
    subsections.forEach(sec => sec.style.display = "none");

    if (targetSection) {
      targetSection.style.display = "block";
    }
  }

  navLinks.forEach(link => {
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
}

function initVideoModal() {
  const modal = document.getElementById("videoModal");
  const video = document.getElementById("videoPlayer");

  window.openVideoModal = function () {
    modal.style.display = "block";
  };

  window.closeVideoModal = function () {
    modal.style.display = "none";
    if (video) {
      video.pause();
      video.currentTime = 0;
    }
  };

  window.addEventListener("click", function (event) {
    if (event.target === modal) {
      closeVideoModal();
    }
  });
}
