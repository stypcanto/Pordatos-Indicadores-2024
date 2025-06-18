document.addEventListener('DOMContentLoaded', function() {
  // Eliminar clase no-js para evitar FOUC
  document.documentElement.classList.remove('no-js');
  
  // Cargar SweetAlert2 dinámicamente con manejo de errores
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

  // Función principal de inicialización
  async function initApp() {
    // Crear overlay dinámicamente
    const overlay = document.createElement('div');
    overlay.className = 'sidebar-overlay';
    document.getElementById('dashboard-container').appendChild(overlay);
    
    try {
      await loadSweetAlert();
      
      // Inicializar partículas con manejo de errores
      initParticles();
      
      // Obtener elementos del DOM
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
        loginError: document.getElementById('login-error')
      };

      // Configurar visibilidad de contraseña
      setupPasswordToggle(DOM.togglePassword, DOM.passwordInput);
      
      // Configurar formulario de login
      if (DOM.loginForm) {
        DOM.loginForm.addEventListener('submit', (e) => handleLogin(e, DOM));
      }

      // Configurar menú toggle para móviles
      setupMenuToggle(DOM.menuToggle, DOM.adminSidebar);
      
      // Configurar menú de usuario
      setupUserMenu(DOM.userMenu);
      
      // Configurar botón de logout
      if (DOM.logoutBtn) {
        DOM.logoutBtn.addEventListener('click', (e) => {
          e.preventDefault();
          performLogout();
        });
      }

      // Cargar usuario recordado si existe
      loadRememberedUser(DOM.usernameInput, DOM.rememberCheckbox);
      
      // ==============================================
      // Configuración para mostrar cards por categoría
      // ==============================================
      
      // Función para mostrar/ocultar cards según categoría
      function showCategory(category) {
        const allCards = document.querySelectorAll('.card');
        
        allCards.forEach(card => {
          if(card.dataset.category === category) {
            card.style.display = 'flex'; // Usar flex para mantener el diseño
          } else {
            card.style.display = 'none';
          }
        });
        
        // Actualizar el título del dashboard según la categoría
        const titles = {
          'aplicativo': 'Aplicativos CENATE',
          'bienes': 'Bienes Tecnológicos',
          'manuales': 'Manuales y Documentación',
          'instaladores': 'Instaladores y Software',
          'videos': 'Videos Tutoriales',
          'contraseñas': 'Gestión de Contraseñas'
        };
        
        const headerTitle = document.querySelector('.dashboard-header h2');
        if (headerTitle && titles[category]) {
          headerTitle.textContent = titles[category];
        }
      }

      // Mostrar aplicativos al inicio (ya que es la opción activa por defecto)
      if (document.querySelector('.sidebar-nav li.active a')) {
        const initialCategory = document.querySelector('.sidebar-nav li.active a').getAttribute('href').substring(1);
        showCategory(initialCategory);
      }

      // Manejar clicks en el sidebar para cambiar categorías
      const menuItems = document.querySelectorAll('.sidebar-nav .menu-item');
      
      menuItems.forEach(item => {
        item.addEventListener('click', function(e) {
          e.preventDefault();
          
          // Remover clase active de todos los items
          document.querySelectorAll('.sidebar-nav li').forEach(li => {
            li.classList.remove('active');
          });
          
          // Agregar clase active al item seleccionado
          this.parentElement.classList.add('active');
          
          // Obtener la categoría del href (#aplicativo -> "aplicativo")
          const category = this.getAttribute('href').substring(1);
          showCategory(category);
        });
      });
      
      // ==============================================
      // Configuración para los modales de las cards
      // ==============================================
      
      // Modal principal
      const cardRemoto = document.getElementById('cardRemoto');
      const modalRemoto = document.getElementById('modalRemoto');
      const cerrarRemotoModal = document.getElementById('cerrarRemotoModal');
      
      // Submodal de firma digital
      const firmaDigitalTrigger = document.getElementById('firmaDigitalTrigger');
      const submodalFirma = document.getElementById('submodalFirma');
      const cerrarSubmodal = document.getElementById('cerrarSubmodal');
      
      if (cardRemoto && modalRemoto) {
        // Abrir modal principal
        cardRemoto.addEventListener('click', function() {
          modalRemoto.style.display = 'flex';
          document.body.classList.add('body-modal-open');
        });
        
        // Cerrar modal principal
        cerrarRemotoModal.addEventListener('click', function() {
          modalRemoto.style.display = 'none';
          document.body.classList.remove('body-modal-open');
        });
      }
      
      if (firmaDigitalTrigger && submodalFirma) {
        // Abrir submodal
        firmaDigitalTrigger.addEventListener('click', function(e) {
          e.stopPropagation(); // Evita que se cierre el modal principal
          submodalFirma.style.display = 'flex';
        });
        
        // Cerrar submodal
        cerrarSubmodal.addEventListener('click', function() {
          submodalFirma.style.display = 'none';
        });
      }
      
      // Cerrar modales al hacer clic fuera del contenido
      window.addEventListener('click', function(event) {
        if (modalRemoto && event.target === modalRemoto) {
          modalRemoto.style.display = 'none';
          document.body.classList.remove('body-modal-open');
        }
        if (submodalFirma && event.target === submodalFirma) {
          submodalFirma.style.display = 'none';
        }
      });
      
    } catch (error) {
      console.error('Error al inicializar la aplicación:', error);
      if (typeof Swal !== 'undefined') {
        Swal.fire({
          title: 'Error',
          text: 'Ocurrió un error al cargar la aplicación',
          icon: 'error'
        });
      }
    }
  }

  // Función para inicializar partículas
  function initParticles() {
    if (typeof particlesJS !== 'undefined') {
      particlesJS('particles-js', {
        "particles": {
          "number": {
            "value": 60,
            "density": {
              "enable": true,
              "value_area": 800
            }
          },
          "color": {
            "value": ["#ffffff", "#4fc3f7", "#e0f7fa"]
          },
          "shape": {
            "type": "circle",
            "stroke": {
              "width": 0,
              "color": "#000000"
            }
          },
          "opacity": {
            "value": 0.5,
            "random": true,
            "anim": {
              "enable": true,
              "speed": 0.5,
              "opacity_min": 0.1,
              "sync": false
            }
          },
          "size": {
            "value": 3,
            "random": true,
            "anim": {
              "enable": true,
              "speed": 2,
              "size_min": 0.1,
              "sync": false
            }
          },
          "line_linked": {
            "enable": true,
            "distance": 100,
            "color": "#ffffff",
            "opacity": 0.2,
            "width": 1
          },
          "move": {
            "enable": true,
            "speed": 2,
            "direction": "none",
            "random": true,
            "straight": false,
            "out_mode": "out",
            "bounce": false,
            "attract": {
              "enable": true,
              "rotateX": 600,
              "rotateY": 1200
            }
          }
        },
        "interactivity": {
          "detect_on": "canvas",
          "events": {
            "onhover": {
              "enable": true,
              "mode": "grab"
            },
            "onclick": {
              "enable": true,
              "mode": "push"
            },
            "resize": true
          },
          "modes": {
            "grab": {
              "distance": 120,
              "line_linked": {
                "opacity": 0.5
              }
            },
            "bubble": {
              "distance": 400,
              "size": 40,
              "duration": 2,
              "opacity": 8,
              "speed": 3
            },
            "repulse": {
              "distance": 100,
              "duration": 0.4
            },
            "push": {
              "particles_nb": 2
            }
          }
        },
        "retina_detect": true
      });
    }
  }

  // Función para mostrar/ocultar contraseña
  function setupPasswordToggle(toggle, passwordInput) {
    if (toggle && passwordInput) {
      toggle.addEventListener('click', function() {
        const isPassword = passwordInput.type === 'password';
        passwordInput.type = isPassword ? 'text' : 'password';
        this.innerHTML = isPassword 
          ? '<i class="bx bx-show"></i>' 
          : '<i class="bx bx-hide"></i>';
        this.setAttribute('aria-label', isPassword ? 'Ocultar contraseña' : 'Mostrar contraseña');
      });
    }
  }

  // Función para manejar el login
  function handleLogin(e, DOM) {
    e.preventDefault();
    
    const username = DOM.usernameInput.value.trim();
    const password = DOM.passwordInput.value;
    const remember = DOM.rememberCheckbox.checked;
    
    if (!username || !password) {
      showLoginError(DOM.loginError, 'Por favor complete todos los campos');
      return;
    }
    
    simulateLogin(username, password, remember, DOM);
  }

  // Función para mostrar errores de login
  function showLoginError(element, message) {
    if (!element) return;
    element.textContent = message;
    element.classList.add('show');
    setTimeout(() => element.classList.remove('show'), 3000);
  }

  // Lista de credenciales válidas
  const CREDENCIALES_VALIDAS = {
    'admin': 'admin123',
    'soporte': 'SoporteTI#2024',
    'desarrollo': 'Dev$2024',
    'redes': 'Redes1Segura',
    'jefe': 'JefeArea$2024',
    'analista1': 'Analista_1',
    'analista2': 'Analista_2',
    'consultor': 'Consultor@2024',
    'invitado': 'Invitado123',
    'auditor': 'Auditoria.2024'
  };

  function simulateLogin(username, password, remember, DOM) {
    setTimeout(() => {
      if (CREDENCIALES_VALIDAS[username] && CREDENCIALES_VALIDAS[username] === password) {
        DOM.loginContainer.style.display = 'none';
        DOM.dashboardContainer.style.display = 'grid';
        
        if (remember) {
          localStorage.setItem('rememberedUser', username);
        } else {
          localStorage.removeItem('rememberedUser');
        }

        Swal.fire({
          title: `Bienvenido, ${username}`,
          text: 'Ha iniciado sesión correctamente',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });

        initInactivityTimer(DOM.dashboardContainer);
      } else {
        showLoginError(DOM.loginError, 'Usuario o contraseña incorrectos');
        DOM.loginForm.style.animation = 'shake 0.5s';
        setTimeout(() => {
          DOM.loginForm.style.animation = '';
        }, 500);
      }
    }, 800);
  }

  // Configurar menú toggle para móviles
  function setupMenuToggle(toggle, sidebar) {
    if (toggle && sidebar) {
      toggle.addEventListener('click', function() {
        const isExpanded = sidebar.classList.toggle('show');
        this.setAttribute('aria-expanded', isExpanded);
        document.body.style.overflow = isExpanded ? 'hidden' : '';
        
        const overlay = document.querySelector('.sidebar-overlay');
        if (isExpanded) {
          overlay.style.display = 'block';
          setTimeout(() => overlay.style.opacity = '1', 10);
        } else {
          overlay.style.opacity = '0';
          setTimeout(() => overlay.style.display = 'none', 300);
        }
      });
      
      document.querySelector('.sidebar-overlay').addEventListener('click', () => {
        sidebar.classList.remove('show');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        const overlay = document.querySelector('.sidebar-overlay');
        overlay.style.opacity = '0';
        setTimeout(() => overlay.style.display = 'none', 300);
      });
    }
  }

  // Configurar menú de usuario
  function setupUserMenu(userMenu) {
    if (userMenu) {
      userMenu.addEventListener('click', function(e) {
        e.stopPropagation();
        this.classList.toggle('active');
      });
      
      document.addEventListener('click', function() {
        userMenu.classList.remove('active');
      });
    }
  }

  // Cargar usuario recordado
  function loadRememberedUser(usernameInput, rememberCheckbox) {
    const rememberedUser = localStorage.getItem('rememberedUser');
    if (rememberedUser && usernameInput && rememberCheckbox) {
      usernameInput.value = rememberedUser;
      rememberCheckbox.checked = true;
    }
  }

  // Función para cerrar sesión
  async function performLogout() {
    try {
      const result = await Swal.fire({
        title: '¿Cerrar sesión?',
        text: "¿Estás seguro que deseas salir del sistema?",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#f44336',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Sí, cerrar sesión',
        cancelButtonText: 'Cancelar',
        allowOutsideClick: false
      });
      
      if (result.isConfirmed) {
        document.body.classList.add('session-exit');
        setTimeout(() => {
          localStorage.removeItem('rememberedUser');
          sessionStorage.clear();
          window.location.href = 'datosti.html';
        }, 500);
      }
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      window.location.href = 'datosti.html';
    }
  }

  // Temporizador de inactividad
  function initInactivityTimer(container) {
    if (!container) return;
    
    let inactivityTimer;
    const timeoutDuration = 1800000; // 30 minutos
    
    function resetTimer() {
      clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(logoutDueToInactivity, timeoutDuration);
    }
    
    function logoutDueToInactivity() {
      if (container.style.display === 'grid') {
        Swal.fire({
          title: 'Sesión expirada',
          text: 'Su sesión ha caducado por inactividad',
          icon: 'info',
          confirmButtonColor: '#4361ee'
        }).then(() => {
          performLogout();
        });
      }
    }
    
    const events = ['mousedown', 'mousemove', 'keypress', 'click', 'scroll', 'touchstart'];
    events.forEach(event => {
      window.addEventListener(event, resetTimer);
    });
    
    resetTimer();
  }

  // Iniciar la aplicación
  initApp();
});