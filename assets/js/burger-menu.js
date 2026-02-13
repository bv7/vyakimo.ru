// burger-menu.js

/**
 * Инициализация бургер-меню
 * Вызывается вручную из loader.js после загрузки шапки
 */
function initBurgerMenu() {
  const burgerBtn = document.querySelector('.burger-menu-btn');
  const mobileMenu = document.querySelector('.mobile-menu');
  
  if (!burgerBtn || !mobileMenu) {
    console.warn('❌ Элементы бургер-меню не найдены');
    return;
  }
  
  console.log('✅ Бургер-меню инициализировано');
  
  // --------------------------------------------------------
  // 1. КЛОН - удаляем старые обработчики
  // --------------------------------------------------------
  const newBurgerBtn = burgerBtn.cloneNode(true);
  burgerBtn.parentNode.replaceChild(newBurgerBtn, burgerBtn);
  
  // --------------------------------------------------------
  // 2. ОБРАБОТЧИК КЛИКА ПО БУРГЕР-КНОПКЕ
  // --------------------------------------------------------
  newBurgerBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    
    const mobileMenu = document.getElementById('mobileMenu');
    mobileMenu.classList.toggle('active');
    
    // Анимация иконки бургера
    const spans = this.querySelectorAll('span');
    if (mobileMenu.classList.contains('active')) {
      // Меню открыто -> крестик
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
      document.body.style.overflow = 'hidden'; // блокируем скролл
    } else {
      // Меню закрыто -> бургер
      spans[0].style.transform = 'none';
      spans[1].style.opacity = '1';
      spans[2].style.transform = 'none';
      document.body.style.overflow = ''; // разблокируем скролл
    }
  });

  // --------------------------------------------------------
  // 3. ЗАКРЫТИЕ ПРИ КЛИКЕ НА ССЫЛКИ В МЕНЮ
  // --------------------------------------------------------
  document.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', function() {
      const mobileMenu = document.getElementById('mobileMenu');
      const burgerBtn = document.querySelector('.burger-menu-btn');
      
      mobileMenu.classList.remove('active');
      document.body.style.overflow = '';
      
      // Сбрасываем иконку в бургер
      const spans = burgerBtn.querySelectorAll('span');
      spans[0].style.transform = 'none';
      spans[1].style.opacity = '1';
      spans[2].style.transform = 'none';
    });
  });

  // --------------------------------------------------------
  // 4. ЗАКРЫТИЕ ПРИ КЛИКЕ ВНЕ МЕНЮ
  // --------------------------------------------------------
  document.addEventListener('click', function(event) {
    const mobileMenu = document.getElementById('mobileMenu');
    const burgerBtn = document.querySelector('.burger-menu-btn');
    
    if (!mobileMenu || !burgerBtn) return;
    
    const isClickInsideMenu = mobileMenu.contains(event.target);
    const isClickOnBurger = burgerBtn.contains(event.target);
    
    if (!isClickInsideMenu && !isClickOnBurger && mobileMenu.classList.contains('active')) {
      mobileMenu.classList.remove('active');
      document.body.style.overflow = '';
      
      const spans = burgerBtn.querySelectorAll('span');
      spans[0].style.transform = 'none';
      spans[1].style.opacity = '1';
      spans[2].style.transform = 'none';
    }
  });

  // --------------------------------------------------------
  // 5. ЗАКРЫТИЕ ПРИ НАЖАТИИ ESC
  // --------------------------------------------------------
  document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
      const mobileMenu = document.getElementById('mobileMenu');
      const burgerBtn = document.querySelector('.burger-menu-btn');
      
      if (mobileMenu && mobileMenu.classList.contains('active')) {
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
        
        const spans = burgerBtn.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
      }
    }
  });
}

// ============================================
// ЭКСПОРТ ФУНКЦИИ ДЛЯ ВЫЗОВА ИЗ loader.js
// ============================================
window.initBurgerMenu = initBurgerMenu;

// Убираем автоматический запуск
// Убираем MutationObserver
// Убираем DOMContentLoaded
// Только ручной вызов из loader.js!