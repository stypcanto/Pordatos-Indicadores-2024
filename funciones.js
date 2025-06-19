// Espera a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function () {
  document.documentElement.classList.remove('no-js'); // Remueve clase si JavaScript está habilitado

  let currentCategory = 'aplicativo'; // Categoría activa inicial

  // Cargar librería SweetAlert si no está cargada aún
  function loadSweetAlert() {
    return new Promise((resolve, reject) => {
      if (typeof Swal === 'undefined') {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/sweetalert2@11';
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      } else {
        resolve();
      }
    });
  }

  // Inicialización principal
  async function initApp() {
    const overlay = document.createElement('div');
    overlay.className = 'sidebar-overlay';
    document.getElementById('dashboard-container').appendChild(overlay);

    try {
      await loadSweetAlert();
      initParticles();

      // Referencias DOM claves
      const DOM = {
        loginForm: document.getElementById('login-form'),
        loginContainer: document.getElementById('login-container'),
        dashboardContainer: document.getElementById('dashboard-container'),
        menuToggle: document.getElementById('menuToggle'),
        adminSidebar: document.getElementById('adminSidebar'),
        userMenu: document.getElementById('userMenu'),
        logoutBtn: document.getElementById('logoutBtn'),
        togglePassword: document.querySelector('.toggle-password'),
        passwordInput: document.getElementById('password'),
        usernameInput: document.getElementById('username'),
        rememberCheckbox: document.getElementById('remember'),
        loginError: document.getElementById('login-error'),
        searchInput: document.getElementById('searchInput'),
        cardsContainer: document.getElementById('cards-container')
      };

      // Restaurar sesión si ya hay un usuario logueado
      const userData = sessionStorage.getItem('currentUser');
      if (userData) {
        const { categories } = JSON.parse(userData);
        updateUIForUser(categories);
        DOM.loginContainer.style.display = 'none';
        DOM.dashboardContainer.style.display = 'grid';
      }

      // Configurar visibilidad de contraseña
      setupPasswordToggle(DOM.togglePassword, DOM.passwordInput);

      // Evento para iniciar sesión
      if (DOM.loginForm) {
        DOM.loginForm.addEventListener('submit', (e) => handleLogin(e, DOM));
      }

      // Eventos para menú lateral y usuario
      setupMenuToggle(DOM.menuToggle, DOM.adminSidebar);
      setupUserMenu(DOM.userMenu);

      // Evento para cerrar sesión
      if (DOM.logoutBtn) {
        DOM.logoutBtn.addEventListener('click', (e) => {
          e.preventDefault();
          performLogout();
        });
      }

      loadRememberedUser(DOM.usernameInput, DOM.rememberCheckbox);

      // Cargar categoría activa al iniciar
      const initialLink = document.querySelector('.sidebar-nav li.active a');
      if (initialLink) {
        currentCategory = initialLink.getAttribute('href').substring(1);
        showCategory(currentCategory, DOM);
      }

      // Navegación entre categorías
      document.querySelectorAll('.sidebar-nav .menu-item').forEach(item => {
        item.addEventListener('click', function (e) {
          e.preventDefault();
          document.querySelectorAll('.sidebar-nav li').forEach(li => li.classList.remove('active'));
          this.parentElement.classList.add('active');
          currentCategory = this.getAttribute('href').substring(1);
          showCategory(currentCategory, DOM);
          if (DOM.searchInput) DOM.searchInput.value = '';
        });
      });

      // Inicializar modales
      setupModalUtilities();

      // Buscador en tiempo real
      if (DOM.searchInput) {
        DOM.searchInput.addEventListener('input', function () {
          filterCardsBySearch(this.value.toLowerCase(), currentCategory, DOM.cardsContainer);
        });
      }

    } catch (error) {
      console.error('Error al iniciar la app:', error);
      if (typeof Swal !== 'undefined') {
        Swal.fire({ title: 'Error', text: 'No se pudo cargar la app', icon: 'error' });
      }
    }
  }

  // Mostrar/ocultar contraseña
  function setupPasswordToggle(toggle, passwordInput) {
    if (!toggle || !passwordInput) return;
    toggle.addEventListener('click', function () {
      const isHidden = passwordInput.type === 'password';
      passwordInput.type = isHidden ? 'text' : 'password';
      this.innerHTML = isHidden ? '<i class="bx bx-show"></i>' : '<i class="bx bx-hide"></i>';
    });
  }

  // Evento de login
  function handleLogin(e, DOM) {
    e.preventDefault();
    const user = DOM.usernameInput.value.trim();
    const pass = DOM.passwordInput.value;
    const remember = DOM.rememberCheckbox.checked;

    if (!user || !pass) {
      showLoginError(DOM.loginError, 'Por favor complete todos los campos');
      return;
    }

    simulateLogin(user, pass, remember, DOM);
  }

  // Mostrar error en login
  function showLoginError(element, message) {
    if (!element) return;
    element.textContent = message;
    element.classList.add('show');
    setTimeout(() => element.classList.remove('show'), 3000);
  }

  // Simulación de login con usuarios predefinidos
 const CREDENCIALES_VALIDAS = {
    'Styp': { password: 'admin12345', categories: ['aplicativo', 'bienes', 'manuales', 'instaladores', 'videos', 'contraseñas'] },
    'Geraldo': { password: 'Cenate@2025', categories: ['aplicativo', 'bienes', 'manuales', 'instaladores', 'videos', 'contraseñas'] },
    'Jesus': { password: 'Cenate2025!', categories: ['aplicativo', 'bienes', 'manuales', 'instaladores', 'videos', 'contraseñas'] },
    'Luis': { password: 'Cenate2025!', categories: ['aplicativo', 'bienes', 'manuales', 'instaladores', 'videos', 'contraseñas'] },
    'Jesus': { password: 'Cenate2025!', categories: ['aplicativo', 'bienes', 'manuales', 'instaladores', 'videos', 'contraseñas'] },
    'Joel': { password: 'admin345', categories: ['aplicativo', 'bienes', 'manuales', 'instaladores', 'videos', 'contraseñas'] },
    'Erick': { password: 'admin234', categories: ['aplicativo', 'bienes', 'manuales', 'instaladores', 'videos', 'contraseñas'] },
    'Enrique': { password: 'admin1233', categories: ['aplicativo', 'bienes', 'manuales', 'instaladores', 'videos', 'contraseñas'] },
    'Robinson': { password: 'SoporteTI#2024', categories: ['aplicativo', 'bienes', 'manuales', 'instaladores', 'videos', 'contraseñas'] },
    'Gala': { password: 'Cenate@2024', categories: ['aplicativo', 'bienes', 'manuales', 'instaladores', 'videos', 'contraseñas'] },
    'Axel': { password: 'Cenate@2024', categories: ['aplicativo', 'bienes', 'manuales', 'instaladores', 'videos', 'contraseñas'] },
    'Daniela': { password: 'Cenate@2024', categories: ['aplicativo',  'manuales', 'instaladores'] },
    'Gabriela': { password: 'Cenate@2024', categories: ['aplicativo',  'manuales', 'instaladores'] },
    'Franshesca': { password: 'Cenate@2024', categories: ['aplicativo',  'manuales', 'instaladores'] },
 
  };



  function simulateLogin(user, pass, remember, DOM) {
    setTimeout(() => {
      const userData = CREDENCIALES_VALIDAS[user];
      if (userData && userData.password === pass) {
        sessionStorage.setItem('currentUser', JSON.stringify({
          username: user,
          categories: userData.categories
        }));

        DOM.loginContainer.style.display = 'none';
        DOM.dashboardContainer.style.display = 'grid';

        if (remember) localStorage.setItem('rememberedUser', user);
        else localStorage.removeItem('rememberedUser');

        Swal.fire({ title: `Bienvenido, ${user}`, icon: 'success', timer: 2000, showConfirmButton: false });
        initInactivityTimer(DOM.dashboardContainer);
        updateUIForUser(userData.categories);
      } else {
        showLoginError(DOM.loginError, 'Usuario o contraseña incorrectos');
        DOM.loginForm.style.animation = 'shake 0.5s';
        setTimeout(() => DOM.loginForm.style.animation = '', 500);
      }
    }, 800);
  }

  // Filtrar tarjetas según término de búsqueda
  function filterCardsBySearch(searchTerm, category, container) {
    if (!container) return;
    const cards = container.querySelectorAll('.card');
    cards.forEach(card => {
      if (card.dataset.category === category) {
        const text = card.textContent.toLowerCase();
        card.style.display = text.includes(searchTerm) ? 'flex' : 'none';
      }
    });
  }

  // Mostrar categoría seleccionada
  function showCategory(category, DOM) {
    const allCards = DOM.cardsContainer.querySelectorAll('.card');
    allCards.forEach(card => {
      card.style.display = (card.dataset.category === category) ? 'flex' : 'none';
    });

    const titles = {
      'aplicativo': 'Aplicativos CENATE',
      'bienes': 'Bienes Tecnológicos',
      'manuales': 'Manuales y Documentación',
      'instaladores': 'Instaladores y Software',
      'videos': 'Videos Tutoriales',
      'contraseñas': 'Gestión de Contraseñas'
    };

    const titleEl = document.querySelector('.dashboard-header h2');
    if (titleEl && titles[category]) {
      titleEl.textContent = titles[category];
    }

    if (DOM.searchInput && DOM.searchInput.value) {
      filterCardsBySearch(DOM.searchInput.value.toLowerCase(), category, DOM.cardsContainer);
    }
  }

  // Modales de Utilitarios y Firma Digital
  function setupModalUtilities() {
  // ======= TRABAJO REMOTO ========
  const cardRemoto = document.getElementById('cardRemoto');
  const modalRemoto = document.getElementById('modalRemoto');
  const cerrarRemotoModal = document.getElementById('cerrarRemotoModal');

  if (cardRemoto && modalRemoto) {
    cardRemoto.addEventListener('click', () => {
      modalRemoto.style.display = 'flex';
      document.body.classList.add('body-modal-open');
    });

    cerrarRemotoModal?.addEventListener('click', () => {
      modalRemoto.style.display = 'none';
      document.body.classList.remove('body-modal-open');
    });
  }

  // ======= UTILITARIOS ========
  const cardUtil = document.getElementById('cardUtilitarios');
  const modalUtil = document.getElementById('modalUtilitarios');
  const cerrarUtil = document.getElementById('cerrarUtilitariosModal');

  if (cardUtil && modalUtil) {
    cardUtil.addEventListener('click', () => {
      modalUtil.style.display = 'flex';
      document.body.classList.add('body-modal-open');
    });

    cerrarUtil?.addEventListener('click', () => {
      modalUtil.style.display = 'none';
      document.body.classList.remove('body-modal-open');
    });
  }

  // ======= ZOOM ========
  const cardZoom = document.getElementById('cardZoom');
  const modalZoom = document.getElementById('modalZoom');
  const cerrarZoom = document.getElementById('cerrarZoomModal');

  if (cardZoom && modalZoom) {
    cardZoom.addEventListener('click', () => {
      modalZoom.style.display = 'flex';
      document.body.classList.add('body-modal-open');
    });

    cerrarZoom?.addEventListener('click', () => {
      modalZoom.style.display = 'none';
      document.body.classList.remove('body-modal-open');
    });
  }

  // ======= Firma Digital (Submodal) ========
  const firmaDigitalTrigger = document.getElementById('firmaDigitalTrigger');
  const submodalFirma = document.getElementById('submodalFirma');
  const cerrarSubmodal = document.getElementById('cerrarSubmodal');

  if (firmaDigitalTrigger && submodalFirma) {
    firmaDigitalTrigger.addEventListener('click', function (e) {
      e.stopPropagation();
      submodalFirma.style.display = 'flex';
    });

    cerrarSubmodal?.addEventListener('click', () => {
      submodalFirma.style.display = 'none';
    });
  }

  // Cerrar cualquier modal si se hace clic fuera de él
  window.addEventListener('click', function (event) {
    if (event.target === modalRemoto) {
      modalRemoto.style.display = 'none';
      document.body.classList.remove('body-modal-open');
    }
    if (event.target === modalUtil) {
      modalUtil.style.display = 'none';
      document.body.classList.remove('body-modal-open');
    }
    if (event.target === modalZoom) {
      modalZoom.style.display = 'none';
      document.body.classList.remove('body-modal-open');
    }
    if (event.target === submodalFirma) {
      submodalFirma.style.display = 'none';
    }
  });
}


  // Mostrar solo accesos permitidos por usuario
  function updateUIForUser(allowedCategories) {
    document.querySelectorAll('.sidebar-nav li').forEach(li => {
      const category = li.querySelector('a').getAttribute('href').substring(1);
      li.style.display = allowedCategories.includes(category) ? 'block' : 'none';
    });

    const cardsContainer = document.getElementById('cards-container');
    if (cardsContainer) {
      cardsContainer.querySelectorAll('.card').forEach(card => {
        card.style.display = allowedCategories.includes(card.dataset.category) ? 'flex' : 'none';
      });
    }

    const firstAllowedCategory = document.querySelector(`.sidebar-nav li a[href="#${allowedCategories[0]}"]`);
    if (firstAllowedCategory) {
      firstAllowedCategory.click();
    }
  }

  // Menú lateral responsive
  function setupMenuToggle(toggle, sidebar) {
    if (!toggle || !sidebar) return;

    toggle.addEventListener('click', () => {
      const isExpanded = sidebar.classList.toggle('show');
      toggle.setAttribute('aria-expanded', isExpanded);
      document.body.style.overflow = isExpanded ? 'hidden' : '';

      const overlay = document.querySelector('.sidebar-overlay');
      overlay.style.display = isExpanded ? 'block' : 'none';
      overlay.style.opacity = isExpanded ? '1' : '0';
    });

    document.querySelector('.sidebar-overlay').addEventListener('click', () => {
      sidebar.classList.remove('show');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      document.querySelector('.sidebar-overlay').style.opacity = '0';
    });
  }

  // Menú de usuario (esquina superior)
  function setupUserMenu(userMenu) {
    if (!userMenu) return;
    userMenu.addEventListener('click', (e) => {
      e.stopPropagation();
      userMenu.classList.toggle('active');
    });
    document.addEventListener('click', () => userMenu.classList.remove('active'));
  }

  // Guardar usuario recordado
  function loadRememberedUser(usernameInput, rememberCheckbox) {
    const remembered = localStorage.getItem('rememberedUser');
    if (remembered) {
      usernameInput.value = remembered;
      rememberCheckbox.checked = true;
    }
  }

  // Logout del usuario
  function performLogout() {
    Swal.fire({
      title: '¿Cerrar sesión?',
      text: '¿Estás seguro que deseas salir del sistema?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, cerrar sesión'
    }).then(result => {
      if (result.isConfirmed) {
        document.body.classList.add('session-exit');
        setTimeout(() => {
          localStorage.removeItem('rememberedUser');
          sessionStorage.removeItem('currentUser');
          window.location.href = 'datosti.html';
        }, 500);
      }
    });
  }

  // Cierre de sesión por inactividad
  function initInactivityTimer(container) {
    let inactivityTimer;
    const timeout = 30 * 60 * 1000; // 30 minutos

    function resetTimer() {
      clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(logoutDueToInactivity, timeout);
    }

    function logoutDueToInactivity() {
      if (container.style.display === 'grid') {
        Swal.fire({
          title: 'Sesión expirada',
          text: 'Su sesión ha caducado por inactividad',
          icon: 'info'
        }).then(() => performLogout());
      }
    }

    ['mousedown', 'mousemove', 'keypress', 'click', 'scroll', 'touchstart'].forEach(evt => {
      window.addEventListener(evt, resetTimer);
    });

    resetTimer();
  }

  // Inicializar partículas (decoración de fondo)
  function initParticles() {
    if (typeof particlesJS !== 'undefined') {
      particlesJS('particles-js', {
        particles: {
          number: { value: 60, density: { enable: true, value_area: 800 } },
          color: { value: ['#ffffff', '#4fc3f7', '#e0f7fa'] },
          shape: { type: 'circle' },
          opacity: { value: 0.5, random: true },
          size: { value: 3, random: true },
          line_linked: { enable: true, distance: 100, color: '#fff', opacity: 0.2, width: 1 },
          move: { enable: true, speed: 2, random: true }
        },
        interactivity: {
          events: {
            onhover: { enable: true, mode: 'grab' },
            onclick: { enable: true, mode: 'push' },
            resize: true
          }
        },
        retina_detect: true
      });
    }
  }

  // Iniciar la app al cargar todo
  initApp();
});

// Función global para copiar texto (por ID)
function copiarTexto(idElemento) {
  const texto = document.getElementById(idElemento).textContent;
  navigator.clipboard.writeText(texto)
    .then(() => alert('Copiado: ' + texto))
    .catch(err => console.error('Error al copiar:', err));
}
