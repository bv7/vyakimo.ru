// ============================================
// before-after.js
// Вертикальный слайдер для сравнения фото
// ============================================

document.addEventListener('DOMContentLoaded', function() {
  // Находим все слайдеры
  const handles = document.querySelectorAll('.ba-handle');
  
  handles.forEach(handle => {
    const card = handle.closest('.ba-card');
    const bwImage = card.querySelector('.ba-image-bw');
    let isDragging = false;
    
    // Функция обновления позиции
    function updatePosition(x, container) {
      const rect = container.getBoundingClientRect();
      let pos = ((x - rect.left) / rect.width) * 100;
      
      // Ограничиваем от 5% до 95%
      pos = Math.max(5, Math.min(95, pos));
      
      // Обновляем позицию ручки
      handle.style.left = pos + '%';
      
      // Обновляем ширину ч/б изображения
      bwImage.style.width = pos + '%';
    }
    
    // Начало перетаскивания
    handle.addEventListener('mousedown', (e) => {
      e.preventDefault();
      isDragging = true;
      const container = card.querySelector('.ba-comparison');
      
      // Добавляем класс для отключения выделения текста
      document.body.style.userSelect = 'none';
      
      // Обработчик движения мыши
      function onMouseMove(e) {
        if (!isDragging) return;
        updatePosition(e.clientX, container);
      }
      
      // Обработчик отпускания мыши
      function onMouseUp() {
        isDragging = false;
        document.body.style.userSelect = '';
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      }
      
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    });
    
    // Поддержка тач-событий для мобильных
    handle.addEventListener('touchstart', (e) => {
      e.preventDefault();
      isDragging = true;
      const container = card.querySelector('.ba-comparison');
      
      function onTouchMove(e) {
        if (!isDragging) return;
        const touch = e.touches[0];
        updatePosition(touch.clientX, container);
      }
      
      function onTouchEnd() {
        isDragging = false;
        document.removeEventListener('touchmove', onTouchMove);
        document.removeEventListener('touchend', onTouchEnd);
      }
      
      document.addEventListener('touchmove', onTouchMove);
      document.addEventListener('touchend', onTouchEnd);
    });
    
    // Клик по контейнеру для перемещения
    const container = card.querySelector('.ba-comparison');
    container.addEventListener('click', (e) => {
      // Не обрабатываем клик, если это было перетаскивание
      if (isDragging) return;
      
      // Обновляем позицию по клику
      updatePosition(e.clientX, container);
    });
  });
});