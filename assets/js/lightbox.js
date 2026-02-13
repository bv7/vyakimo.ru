// lightbox.js
// Полноэкранный просмотр фото с навигацией + ленивая загрузка

let lightboxState = {
  isOpen: false,
  currentIndex: 0,
  photos: [],
  categoryTitle: ''
};

// ============================================
// СОСТОЯНИЕ ГАЛЕРЕИ ДЛЯ ЛЕНИВОЙ ЗАГРУЗКИ
// ============================================
let galleryState = {
  allPhotos: [],        // Все фото из папки
  loadedCount: 12,      // Сколько уже загружено
  batchSize: 12,        // По сколько подгружаем
  isLoading: false,     // Флаг загрузки
  hasMore: true         // Есть ли еще фото
};

/**
 * ИНИЦИАЛИЗАЦИЯ ГАЛЕРЕИ (обновленная)
 */
function initGallery(data) {
  if (!data || !data.photos || !data.photos.length) {
    console.warn('⚠️ Нет данных для галереи');
    return;
  }
  
  console.log(`📸 Инициализация галереи: ${data.title}, фото: ${data.photos.length}`);
  
  // Сохраняем данные для лайтбокса
  lightboxState.photos = data.photos;
  lightboxState.categoryTitle = data.title;
  
  // Сохраняем данные для ленивой загрузки
  galleryState.allPhotos = data.photos;
  galleryState.loadedCount = Math.min(12, data.photos.length);
  galleryState.hasMore = galleryState.loadedCount < data.photos.length;
  
  // Отрисовываем первые фото
  renderGalleryItems(data.photos.slice(0, galleryState.loadedCount));
  
  // ========== ВАЖНО! ДОБАВЛЯЕМ ОБРАБОТЧИКИ КЛИКА ==========
  const galleryItems = document.querySelectorAll('.gallery-item');
  
  galleryItems.forEach((item, index) => {
    // Удаляем старые обработчики (чтобы не было дублей)
    const newItem = item.cloneNode(true);
    item.parentNode.replaceChild(newItem, item);
    
    newItem.addEventListener('click', (e) => {
      e.preventDefault();  // ← КЛЮЧЕВАЯ СТРОКА!
      e.stopPropagation();
      openLightbox(index);
    });
  });
  // ======================================================
  
  // Обновляем кнопку "Показать еще"
  updateLoadMoreButton();
  
  // Добавляем обработчик на кнопку
  initLoadMoreButton();
  
  // Инициализируем лайтбокс
  initLightbox();
}
/**
 * ОТРИСОВКА ЭЛЕМЕНТОВ ГАЛЕРЕИ
 */
function renderGalleryItems(photosToRender) {
  const galleryGrid = document.getElementById('galleryGrid');
  if (!galleryGrid) return;
  
  // Очищаем сетку
  galleryGrid.innerHTML = '';
  
  // Создаем элементы
  photosToRender.forEach((photo, index) => {
    const item = document.createElement('a');
    item.href = photo;
    item.className = 'gallery-item';
    item.dataset.index = index;
    
    const img = document.createElement('img');
    img.src = photo;
    img.alt = `${lightboxState.categoryTitle} - фото ${index + 1}`;
    img.className = 'gallery-image';
    img.loading = index < 6 ? 'eager' : 'lazy';
    img.width = 400;
    img.height = 300;
    
    item.appendChild(img);
    galleryGrid.appendChild(item);
  });
  
  // Добавляем обработчики клика для лайтбокса
  // document.querySelectorAll('.gallery-item').forEach((item, idx) => {
  //   item.addEventListener('click', (e) => {
  //     e.preventDefault();
  //     openLightbox(idx);
  //   });
  // });
}

/**
 * ИНИЦИАЛИЗАЦИЯ КНОПКИ "ПОКАЗАТЬ ЕЩЕ"
 */
function initLoadMoreButton() {
  const loadMoreBtn = document.getElementById('loadMoreBtn');
  if (!loadMoreBtn) return;
  
  // Удаляем старые обработчики
  const newBtn = loadMoreBtn.cloneNode(true);
  loadMoreBtn.parentNode.replaceChild(newBtn, loadMoreBtn);
  
  newBtn.addEventListener('click', loadMorePhotos);
}

/**
 * ЗАГРУЗКА СЛЕДУЮЩИХ ФОТО
 */
function loadMorePhotos() {
  if (galleryState.isLoading || !galleryState.hasMore) return;
  
  galleryState.isLoading = true;
  
  // Показываем спиннер, скрываем кнопку
  const loadMoreBtn = document.getElementById('loadMoreBtn');
  const loadingSpinner = document.getElementById('loadingSpinner');
  const loadMoreContainer = document.getElementById('loadMoreContainer');
  
  if (loadMoreBtn) loadMoreBtn.style.display = 'none';
  if (loadingSpinner) loadingSpinner.style.display = 'flex';
  
  // Небольшая задержка для плавности
  setTimeout(() => {
    // Сколько еще фото можем загрузить
    const remaining = galleryState.allPhotos.length - galleryState.loadedCount;
    const nextBatch = Math.min(galleryState.batchSize, remaining);
    
    if (nextBatch > 0) {
      // Добавляем новые фото к существующим
      const currentPhotos = galleryState.allPhotos.slice(0, galleryState.loadedCount);
      const newPhotos = galleryState.allPhotos.slice(
        galleryState.loadedCount, 
        galleryState.loadedCount + nextBatch
      );
      
      galleryState.loadedCount += nextBatch;
      galleryState.hasMore = galleryState.loadedCount < galleryState.allPhotos.length;
      
      // Обновляем lightboxState.photos (для лайтбокса)
      lightboxState.photos = galleryState.allPhotos.slice(0, galleryState.loadedCount);
      
      // Перерисовываем галерею со всеми фото
      renderGalleryItems([...currentPhotos, ...newPhotos]);
    }
    
    // Обновляем состояние кнопки
    updateLoadMoreButton();
    
    galleryState.isLoading = false;
  }, 400);
}

/**
 * ОБНОВЛЕНИЕ ВИДИМОСТИ КНОПКИ "ПОКАЗАТЬ ЕЩЕ"
 */
function updateLoadMoreButton() {
  const loadMoreBtn = document.getElementById('loadMoreBtn');
  const loadingSpinner = document.getElementById('loadingSpinner');
  const loadMoreContainer = document.getElementById('loadMoreContainer');
  
  if (!loadMoreContainer) return;
  
  if (galleryState.hasMore) {
    // Есть еще фото — показываем кнопку
    loadMoreContainer.classList.remove('hidden');
    if (loadMoreBtn) loadMoreBtn.style.display = 'inline-flex';
    if (loadingSpinner) loadingSpinner.style.display = 'none';
  } else {
    // Нет фото — скрываем контейнер
    loadMoreContainer.classList.add('hidden');
  }
}

// ============================================
// ЛАЙТБОКС (БЕЗ ИЗМЕНЕНИЙ, КРОМЕ updateLightboxImage)
// ============================================

/**
 * Инициализация лайтбокса
 */
function initLightbox() {
  // Создаем HTML лайтбокса, если его нет
  if (!document.getElementById('lightbox')) {
    const lightboxHTML = `
      <div class="lightbox-overlay" id="lightbox">
        <button class="lightbox-close" id="closeLightbox" aria-label="Закрыть">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M18 6L6 18M6 6l12 12" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
        
        <button class="lightbox-nav lightbox-prev" id="prevPhoto" aria-label="Предыдущее фото">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M15 18l-6-6 6-6" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
        
        <button class="lightbox-nav lightbox-next" id="nextPhoto" aria-label="Следующее фото">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M9 18l6-6-6-6" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
        
        <div class="lightbox-content">
          <img id="lightboxImage" src="" alt="" class="lightbox-image">
          <div class="lightbox-info">
            <p id="photoCounter"></p>
            <p id="photoName"></p>
          </div>
        </div>
      </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', lightboxHTML);
  }
  
  // Получаем элементы
  const lightbox = document.getElementById('lightbox');
  const closeBtn = document.getElementById('closeLightbox');
  const prevBtn = document.getElementById('prevPhoto');
  const nextBtn = document.getElementById('nextPhoto');
  
  // Удаляем старые обработчики
  if (closeBtn) {
    closeBtn.replaceWith(closeBtn.cloneNode(true));
    document.getElementById('closeLightbox').addEventListener('click', closeLightbox);
  }
  
  if (prevBtn) {
    prevBtn.replaceWith(prevBtn.cloneNode(true));
    document.getElementById('prevPhoto').addEventListener('click', showPrevPhoto);
  }
  
  if (nextBtn) {
    nextBtn.replaceWith(nextBtn.cloneNode(true));
    document.getElementById('nextPhoto').addEventListener('click', showNextPhoto);
  }
  
  // Закрытие по клику на фон
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });
  
  // Клавиатурная навигация
  document.addEventListener('keydown', handleKeyDown);
}

/**
 * Открыть лайтбокс
 */
function openLightbox(index) {
  if (!lightboxState.photos.length) return;
  
  lightboxState.isOpen = true;
  lightboxState.currentIndex = index;
  
  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightboxImage');
  
  // Устанавливаем изображение
  updateLightboxImage();
  
  // Показываем лайтбокс
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}

/**
 * Закрыть лайтбокс
 */
function closeLightbox() {
  lightboxState.isOpen = false;
  
  const lightbox = document.getElementById('lightbox');
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
}

/**
 * Показать предыдущее фото
 */
function showPrevPhoto() {
  if (!lightboxState.isOpen) return;
  
  lightboxState.currentIndex--;
  if (lightboxState.currentIndex < 0) {
    lightboxState.currentIndex = lightboxState.photos.length - 1;
  }
  
  updateLightboxImage();
}

/**
 * Показать следующее фото
 */
function showNextPhoto() {
  if (!lightboxState.isOpen) return;
  
  lightboxState.currentIndex++;
  if (lightboxState.currentIndex >= lightboxState.photos.length) {
    lightboxState.currentIndex = 0;
  }
  
  updateLightboxImage();
}

/**
 * Обновить изображение в лайтбоксе (обновлено)
 */
function updateLightboxImage() {
  const lightboxImage = document.getElementById('lightboxImage');
  const photoCounter = document.getElementById('photoCounter');
  
  const currentPhoto = lightboxState.photos[lightboxState.currentIndex];
  
  // Обновляем изображение
  lightboxImage.src = currentPhoto;
  lightboxImage.alt = `${lightboxState.categoryTitle} - фото ${lightboxState.currentIndex + 1}`;
  
  // Обновляем счетчик
  photoCounter.textContent = `Фото ${lightboxState.currentIndex + 1} из ${lightboxState.photos.length}`;
  
  // Предзагрузка соседних фото
  preloadAdjacentImages(lightboxState.currentIndex);
}

/**
 * Обработка клавиатуры
 */
function handleKeyDown(e) {
  if (!lightboxState.isOpen) return;
  
  switch(e.key) {
    case 'Escape':
      closeLightbox();
      break;
    case 'ArrowLeft':
      e.preventDefault();
      showPrevPhoto();
      break;
    case 'ArrowRight':
      e.preventDefault();
      showNextPhoto();
      break;
  }
}

// ============================================
// ПОДДЕРЖКА СВАЙПА ДЛЯ МОБИЛЬНЫХ
// ============================================
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', (e) => {
  if (!lightboxState.isOpen) return;
  touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', (e) => {
  if (!lightboxState.isOpen) return;
  touchEndX = e.changedTouches[0].screenX;
  handleSwipe();
});

function handleSwipe() {
  const swipeThreshold = 50;
  const diff = touchStartX - touchEndX;
  
  if (Math.abs(diff) > swipeThreshold) {
    if (diff > 0) {
      showNextPhoto();
    } else {
      showPrevPhoto();
    }
  }
}

// ============================================
// ПРЕДЗАГРУЗКА СОСЕДНИХ ФОТО
// ============================================
function preloadAdjacentImages(index) {
  const photos = lightboxState.photos;
  
  if (index < photos.length - 1) {
    const nextImg = new Image();
    nextImg.src = photos[index + 1];
  }
  
  if (index > 0) {
    const prevImg = new Image();
    prevImg.src = photos[index - 1];
  }
}

// ============================================
// ЭКСПОРТ ФУНКЦИЙ
// ============================================
window.initGallery = initGallery;
window.openLightbox = openLightbox;
window.closeLightbox = closeLightbox;
window.showPrevPhoto = showPrevPhoto;
window.showNextPhoto = showNextPhoto;
window.loadMorePhotos = loadMorePhotos; // Экспортируем для кнопки