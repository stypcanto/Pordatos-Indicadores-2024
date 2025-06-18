document.addEventListener('DOMContentLoaded', function() {
  // Eliminar clase no-js
  document.documentElement.classList.remove('no-js');
  
  // Cargar SweetAlert2 si no está cargado
  if (typeof Swal === 'undefined') {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/sweetalert2@11';
    script.onload = initApp;
    document.head.appendChild(script);
  } else {
    initApp();
  }

  function initApp() {
    // Inicializar partículas
    if (typeof particlesJS !== 'undefined') {
      particlesJS.load('particles-js', 'assets/particles.json', function() {
        console.log('Partículas cargadas correctamente');
      });
    }

    // Elementos del DOM
    const loginForm = document.getElementById('login-form');
    const loginContainer = document.getElementById('login-container');
    const dashboardContainer = document.getElementById('dashboard-container');
    const menuToggle = document.getElementById('menuToggle');
    const adminSidebar = document.getElementById('adminSidebar');
    const userMenu = document.getElementById('userMenu');
    const logoutBtn = document.getElementById('logoutBtn');
    const togglePassword = document.querySelector('.toggle-password');
    const passwordInput = document.getElementById('password');

    // Mostrar/ocultar contraseña
    if (togglePassword && passwordInput) {
      togglePassword.addEventListener('click', function() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        this.innerHTML = type === 'password' ? '<i class="bx bx-hide"></i>' : '<i class="bx bx-show"></i>';
      });
    }

    // Login simulation
    if (loginForm) {
      loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const remember = document.getElementById('remember').checked;
        const errorMessage = document.getElementById('login-error');
        
        // Validación simple
        if (!username || !password) {
          errorMessage.textContent = 'Por favor complete todos los campos';
          errorMessage.classList.add('show');
          return;
        }
        
        // Simular autenticación
        setTimeout(() => {
          if (username === 'admin' && password === 'admin123') {
            // Login exitoso
            loginContainer.style.display = 'none';
            dashboardContainer.style.display = 'grid';
            
            // Guardar en localStorage si "Recordar sesión" está marcado
            if (remember) {
              localStorage.setItem('rememberedUser', username);
            } else {
              localStorage.removeItem('rememberedUser');
            }

            // Iniciar temporizador de inactividad
            initInactivityTimer(dashboardContainer);
          } else {
            // Credenciales incorrectas
            errorMessage.textContent = 'Usuario o contraseña incorrectos';
            errorMessage.classList.add('show');
          }
        }, 800);
      });
    }

    // Toggle sidebar en móviles
    if (menuToggle && adminSidebar) {
      menuToggle.addEventListener('click', function() {
        adminSidebar.classList.toggle('show');
        this.setAttribute('aria-expanded', adminSidebar.classList.contains('show'));
      });
    }

    // Toggle user dropdown
    if (userMenu) {
      userMenu.addEventListener('click', function() {
        this.classList.toggle('active');
      });
      
      // Cerrar al hacer clic fuera
      document.addEventListener('click', function(e) {
        if (!userMenu.contains(e.target)) {
          userMenu.classList.remove('active');
        }
      });
    }

    // Logout
    if (logoutBtn) {
      logoutBtn.addEventListener('click', function(e) {
        e.preventDefault();
        performLogout();
      });
    }

    // Verificar si hay un usuario recordado
    if (localStorage.getItem('rememberedUser')) {
      document.getElementById('username').value = localStorage.getItem('rememberedUser');
      document.getElementById('remember').checked = true;
    }
  }

  function performLogout() {
    Swal.fire({
      title: '¿Cerrar sesión?',
      text: "¿Estás seguro que deseas salir del sistema?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#f44336',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, cerrar sesión',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        // Añadir animación de salida
        document.body.classList.add('session-exit');
        
        // Limpiar datos y redirigir
        setTimeout(() => {
          localStorage.removeItem('rememberedUser');
          sessionStorage.clear();
          window.location.href = 'datosti.html'; // Usar siempre la misma página
        }, 500);
      }
    });
  }

  function initInactivityTimer(container) {
    let inactivityTimer;
    
    function resetTimer() {
      clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(logoutDueToInactivity, 1800000); // 30 minutos
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
    window.addEventListener('load', resetTimer);
    document.addEventListener('mousemove', resetTimer);
    document.addEventListener('keypress', resetTimer);
    document.addEventListener('click', resetTimer);
    document.addEventListener('scroll', resetTimer);
    
    resetTimer(); // Iniciar el temporizador
  }
});