// loader.js
document.addEventListener('DOMContentLoaded', async () => {
  try {
    console.log('🔄 Загружаю шапку и подвал...');
    
    // 1. Находим контейнеры ДО загрузки
    const headerContainer = document.getElementById('header-container');
    const footerContainer = document.getElementById('footer-container');
    
    if (!headerContainer || !footerContainer) {
      throw new Error('Контейнеры для шапки или подвала не найдены в HTML');
    }
    
    // 2. Загружаем шапку
    const headerResponse = await fetch('/includes/header.html');
    if (!headerResponse.ok) {
      throw new Error(`HTTP ${headerResponse.status}: Не удалось загрузить шапку`);
    }
    const headerHtml = await headerResponse.text();
    
    // 3. Загружаем подвал
    const footerResponse = await fetch('/includes/footer.html');
    if (!footerResponse.ok) {
      throw new Error(`HTTP ${footerResponse.status}: Не удалось загрузить подвал`);
    }
    const footerHtml = await footerResponse.text();
    
    // 4. Вставляем шапку в контейнер
    headerContainer.innerHTML = headerHtml;
    
    // 5. ДОБАВЛЯЕМ МОБИЛЬНОЕ МЕНЮ ВРУЧНУЮ В ШАПКУ
    const mobileMenuHTML = `
      <div class="mobile-menu" id="mobileMenu">
        <ul class="mobile-nav-list">
          <li><a href="/" class="mobile-nav-link">Главная</a></li>
          <li><a href="/#categories" class="mobile-nav-link">Портфолио</a></li>
          <li><a href="/#about" class="mobile-nav-link">Обо мне</a></li>
          <li><a href="/#contacts" class="mobile-nav-link">Контакты</a></li>
        </ul>
      </div>
    `;
    
    // Находим шапку и добавляем мобильное меню
    const siteHeader = headerContainer.querySelector('.site-header');
    if (siteHeader) {
      siteHeader.insertAdjacentHTML('beforeend', mobileMenuHTML);
    }
    
    // 6. Вставляем подвал
    footerContainer.innerHTML = footerHtml;
    
    console.log('✅ Шапка и подвал успешно загружены');
    
    // 7. ИНИЦИАЛИЗИРУЕМ БУРГЕР-МЕНЮ ПОСЛЕ ЗАГРУЗКИ
    if (window.initBurgerMenu) {
      // Небольшая задержка для гарантии полного обновления DOM
      setTimeout(() => {
        window.initBurgerMenu();
      }, 50);
    }
    
    // 8. Инициализируем плавный скролл для всех страниц
    initSmoothScroll();
    
    // 9. Инициализируем активное состояние текущей страницы
    highlightCurrentPage();
    
  } catch (error) {
    console.error('❌ Ошибка загрузки компонентов:', error);
    
    // Создаем простую шапку и подвал в случае ошибки
    createFallbackHeaderFooter();
  }
});

// ============================================
// ФУНКЦИЯ ПЛАВНОГО СКРОЛЛА
// ============================================
function initSmoothScroll() {
  // Плавный скролл для якорных ссылок
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      
      // Пропускаем якорь на ту же страницу
      if (href === '#') return;
      
      // ЕСЛИ МЫ НЕ НА ГЛАВНОЙ СТРАНИЦЕ — ПЕРЕХОДИМ НА ГЛАВНУЮ С ЯКОРЕМ
      if (!window.location.pathname.endsWith('/') && 
          !window.location.pathname.endsWith('index.html')) {
        
        // Закрываем мобильное меню
        const mobileMenu = document.getElementById('mobileMenu');
        const burgerBtn = document.getElementById('burgerBtn');
        if (mobileMenu && mobileMenu.classList.contains('active')) {
          mobileMenu.classList.remove('active');
          burgerBtn?.classList.remove('active');
        }
        
        // Переходим на главную с якорем
        window.location.href = '/' + href;
        return;
      }
      
      // МЫ НА ГЛАВНОЙ — ПЛАВНЫЙ СКРОЛЛ
      const targetElement = document.querySelector(href);
      if (targetElement) {
        e.preventDefault();
        
        // Закрываем мобильное меню если открыто
        const mobileMenu = document.getElementById('mobileMenu');
        const burgerBtn = document.getElementById('burgerBtn');
        if (mobileMenu && mobileMenu.classList.contains('active')) {
          mobileMenu.classList.remove('active');
          burgerBtn?.classList.remove('active');
        }
        
        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: 'smooth'
        });
      }
    });
  });
}

// ============================================
// ФУНКЦИЯ ПОДСВЕТКИ АКТИВНОЙ СТРАНИЦЫ
// ============================================
function highlightCurrentPage() {
  // Определяем текущую страницу
  const currentPath = window.location.pathname;
  
  // Находим все ссылки в навигации
  document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(link => {
    const linkPath = link.getAttribute('href');
    
    // Если это главная страница
    if (currentPath === '/' || currentPath === '/index.html') {
      if (linkPath === '/' || linkPath === '/index.html') {
        link.classList.add('active');
      }
    }
    // Если это страница портфолио
    else if (currentPath.includes('portfolio')) {
      if (linkPath.includes('portfolio')) {
        link.classList.add('active');
      }
    }
    // Если это страница "Обо мне"
    else if (currentPath.includes('about')) {
      if (linkPath.includes('about')) {
        link.classList.add('active');
      }
    }
  });
}

// ============================================
// ФУНКЦИЯ РЕЗЕРВНОЙ ШАПКИ/ПОДВАЛА
// ============================================
function createFallbackHeaderFooter() {
  console.log('🔄 Создаю резервную шапку и подвал...');
  
  const headerContainer = document.getElementById('header-container');
  const footerContainer = document.getElementById('footer-container');
  
  if (headerContainer) {
    headerContainer.innerHTML = `
      <div style="
        background: #fff; 
        padding: 1rem; 
        text-align: center;
        border-bottom: 1px solid #eee;
        height: 80px;
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <a href="/" style="font-weight: bold; text-decoration: none; color: #000; font-size: 1.5rem;">
          Vitale Yakimо
        </a>
      </div>
    `;
  }
  
  if (footerContainer) {
    footerContainer.innerHTML = `
      <div style="
        background: #000; 
        color: #fff; 
        padding: 2rem; 
        text-align: center;
        margin-top: 3rem;
      ">
        <p>© ${new Date().getFullYear()} Vitale Yakimо</p>
      </div>
    `;
  }
}