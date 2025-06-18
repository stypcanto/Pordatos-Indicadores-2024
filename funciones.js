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
          "value": ["#ffffff", "#4fc3f7", "#e0f7fa"] // Colores sutiles
        },
        "shape": {
          "type": "circle",
          "stroke": {
            "width": 0,
            "color": "#000000"
          }
        },
        "opacity": {
          "value": 0.5, // Más transparente
          "random": true,
          "anim": {
            "enable": true,
            "speed": 0.5,
            "opacity_min": 0.1,
            "sync": false
          }
        },
        "size": {
          "value": 3, // Más pequeñas
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
          "distance": 100, // Menor distancia
          "color": "#ffffff",
          "opacity": 0.2, // Más sutil
          "width": 1
        },
        "move": {
          "enable": true,
          "speed": 2, // Movimiento más lento
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
            "mode": "grab" // Efecto más sutil
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
            "particles_nb": 2 // Menos partículas al hacer click
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
    
    // Validación de campos
    if (!username || !password) {
      showLoginError(DOM.loginError, 'Por favor complete todos los campos');
      return;
    }
    
    // Simular autenticación (en un caso real sería una petición AJAX)
    simulateLogin(username, password, remember, DOM);
  }

  // Función para mostrar errores de login
  function showLoginError(element, message) {
    if (!element) return;
    element.textContent = message;
    element.classList.add('show');
    setTimeout(() => element.classList.remove('show'), 3000);
  }

// Lista de credenciales válidas (usuario: contraseña)
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
    // Verificar credenciales
    if (CREDENCIALES_VALIDAS[username] && CREDENCIALES_VALIDAS[username] === password) {
      // Login exitoso
      DOM.loginContainer.style.display = 'none';
      DOM.dashboardContainer.style.display = 'grid';
      
      // Guardar en localStorage si "Recordar sesión" está marcado
      if (remember) {
        localStorage.setItem('rememberedUser', username);
      } else {
        localStorage.removeItem('rememberedUser');
      }

      // Mostrar mensaje de bienvenida personalizado
      Swal.fire({
        title: `Bienvenido, ${username}`,
        text: 'Ha iniciado sesión correctamente',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });

      // Iniciar temporizador de inactividad
      initInactivityTimer(DOM.dashboardContainer);
    } else {
      // Credenciales incorrectas
      showLoginError(DOM.loginError, 'Usuario o contraseña incorrectos');
      
      // Efecto de vibración en el formulario
      DOM.loginForm.style.animation = 'shake 0.5s';
      setTimeout(() => {
        DOM.loginForm.style.animation = '';
      }, 500);
    }
  }, 800);
}

  // Configurar menú toggle para móviles
// Actualízala para incluir el overlay
function setupMenuToggle(toggle, sidebar) {
  if (toggle && sidebar) {
    toggle.addEventListener('click', function() {
      const isExpanded = sidebar.classList.toggle('show');
      this.setAttribute('aria-expanded', isExpanded);
      document.body.style.overflow = isExpanded ? 'hidden' : '';
      
      // Manejar overlay
      const overlay = document.querySelector('.sidebar-overlay');
      if (isExpanded) {
        overlay.style.display = 'block';
        setTimeout(() => overlay.style.opacity = '1', 10);
      } else {
        overlay.style.opacity = '0';
        setTimeout(() => overlay.style.display = 'none', 300);
      }
    });
    
    // Cerrar al hacer clic fuera (en el overlay)
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

// Crear overlay para el sidebar en móviles
function createSidebarOverlay(sidebar) {
  const existingOverlay = document.querySelector('.sidebar-overlay');
  if (existingOverlay) return;
  
  const overlay = document.createElement('div');
  overlay.className = 'sidebar-overlay';
  overlay.style.position = 'fixed';
  overlay.style.top = '70px';
  overlay.style.left = '0';
  overlay.style.right = '0';
  overlay.style.bottom = '0';
  overlay.style.backgroundColor = 'rgba(0,0,0,0.5)';
  overlay.style.zIndex = '80';
  overlay.style.transition = 'opacity 0.3s ease';
  
  overlay.addEventListener('click', () => {
    const toggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('adminSidebar');
    sidebar.classList.remove('show');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    removeSidebarOverlay();
  });
  
  document.body.appendChild(overlay);
  setTimeout(() => {
    overlay.style.opacity = '1';
  }, 10);
}

function removeSidebarOverlay() {
  const overlay = document.querySelector('.sidebar-overlay');
  if (overlay) {
    overlay.style.opacity = '0';
    setTimeout(() => {
      overlay.remove();
    }, 300);
  }
}

  // Configurar menú de usuario
  function setupUserMenu(userMenu) {
    if (userMenu) {
      userMenu.addEventListener('click', function(e) {
        e.stopPropagation();
        this.classList.toggle('active');
      });
      
      // Cerrar menú al hacer clic fuera
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
        // Animación de salida
        document.body.classList.add('session-exit');
        
        // Limpiar y redirigir
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
    
    // Eventos que resetearán el temporizador
    const events = ['mousedown', 'mousemove', 'keypress', 'click', 'scroll', 'touchstart'];
    events.forEach(event => {
      window.addEventListener(event, resetTimer);
    });
    
    resetTimer(); // Iniciar el temporizador
  }

  // Iniciar la aplicación
  initApp();
});