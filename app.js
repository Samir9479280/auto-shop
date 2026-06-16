/**
 * AutoParts.uz — Core Logic
 * Архитектура: Vanilla JS (ES6+)
 */

// ==========================================
// 1. БАЗА ДАННЫХ И СОСТОЯНИЕ (STATE)
// ==========================================
const AppState = {
    products: [],
    cart: {},
    filters: { category: 'all', search: '' },
    DOM: {}
  };
  
  // Генератор 250+ реалистичных товаров
  function generateDatabase() {
    const blueprint = {
      engine: { name: 'Двигатель', brands: ['Bosch', 'Motul', 'Mahle', 'NGK'], items: ['Поршень', 'Ремень ГРМ', 'Свеча зажигания', 'Фильтр масляный', 'Прокладка ГБЦ', 'Масляный насос'] },
      brake: { name: 'Тормозная система', brands: ['Brembo', 'TRW', 'ATE', 'Zimmermann'], items: ['Тормозные колодки', 'Тормозной диск', 'Суппорт', 'Тормозной шланг', 'Датчик ABS'] },
      suspension: { name: 'Подвеска', brands: ['Lemforder', 'Kayaba', 'Bilstein', 'Sachs'], items: ['Амортизатор', 'Пружина подвески', 'Рычаг передний', 'Шаровая опора', 'Сайлентблок'] },
      electric: { name: 'Электрика', brands: ['Bosch', 'Denso', 'Valeo', 'Magneti Marelli'], items: ['Генератор', 'Стартер', 'Аккумулятор', 'Катушка зажигания', 'Датчик кислорода'] }
    };
  
    const modifications = ['OEM', 'Premium', 'Sport HD', 'Eco'];
    let skuCounter = 100100;
  
    Object.entries(blueprint).forEach(([catId, catData]) => {
      catData.items.forEach(item => {
        catData.brands.forEach(brand => {
          modifications.forEach(mod => {
            // Цена от 50,000 до 2,500,000 с шагом 5000
            const price = Math.floor(Math.random() * 490 + 10) * 5000; 
            
            AppState.products.push({
              id: `p-${skuCounter}`,
              sku: `AP-${skuCounter}`,
              name: `${item} ${brand} ${mod}`,
              brand: brand,
              category: catId,
              price: price,
              spec: 'Сертифицированная деталь. Гарантия качества производителя.'
            });
            skuCounter++;
          });
        });
      });
    });
    
    // Перемешаем товары для красивой выдачи
    AppState.products.sort(() => Math.random() - 0.5);
  }
  
  // Форматтер цен (1200000 -> 1 200 000)
  const formatPrice = (price) => new Intl.NumberFormat('ru-RU').format(price);
  
  // ==========================================
  // 2. ИНИЦИАЛИЗАЦИЯ И КЭШИРОВАНИЕ DOM
  // ==========================================
  document.addEventListener('DOMContentLoaded', () => {
    generateDatabase();
    
    // Кэшируем элементы DOM
    AppState.DOM = {
      productsContainer: document.getElementById('products-container'),
      noResults: document.getElementById('no-results'),
      searchInput: document.getElementById('search-input'),
      filterTabs: document.querySelectorAll('.tab-btn'),
      cartContainer: document.getElementById('cart-items-container'),
      cartCount: document.getElementById('cart-count'),
      cartTotalBtn: document.getElementById('cart-total-btn'),
      cartTotalPrice: document.getElementById('cart-total-price'),
      orderForm: document.getElementById('order-form'),
      submitBtn: document.getElementById('submit-btn'),
      orderNumber: document.getElementById('order-number'),
      toast: document.getElementById('toast')
    };
  
    // Устанавливаем номер заказа
    AppState.DOM.orderNumber.textContent = `#UZ-${Math.floor(10000 + Math.random() * 90000)}`;
  
    bindEvents();
    renderProducts();
    renderCart();
  });
  
  // ==========================================
  // 3. ОТРИСОВКА ИНТЕРФЕЙСА (UI RENDER)
  // ==========================================
  function renderProducts() {
    const { products, filters, cart, DOM } = AppState;
    
    const filtered = products.filter(p => {
      const matchCat = filters.category === 'all' || p.category === filters.category;
      const matchSearch = p.name.toLowerCase().includes(filters.search) || 
                          p.sku.toLowerCase().includes(filters.search) ||
                          p.brand.toLowerCase().includes(filters.search);
      return matchCat && matchSearch;
    });
  
    DOM.productsContainer.innerHTML = '';
  
    if (filtered.length === 0) {
      DOM.noResults.style.display = 'block';
      return;
    }
    
    DOM.noResults.style.display = 'none';
  
    // Оптимизация: рендерим максимум 60 товаров за раз, чтобы не перегружать DOM
    const toRender = filtered.slice(0, 60);
  
    const html = toRender.map(product => {
      const isAdded = cart[product.id] ? 'added' : '';
      const btnText = cart[product.id] ? 'В корзине' : 'Купить';
      
      return `
        <div class="product-card">
          <div class="product-card-top">
            <span class="product-sku">${product.sku}</span>
            <span class="product-brand">${product.brand}</span>
          </div>
          <h3>${product.name}</h3>
          <p class="product-spec">${product.spec}</p>
          <div class="product-card-bottom">
            <span class="product-price">${formatPrice(product.price)} сум</span>
            <button class="btn-add ${isAdded}" data-id="${product.id}">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>
              <span>${btnText}</span>
            </button>
          </div>
        </div>
      `;
    }).join('');
  
    DOM.productsContainer.innerHTML = html;
  }
  
  function renderCart() {
    const { cart, DOM } = AppState;
    const items = Object.values(cart);
    
    let totalCount = 0;
    let totalPrice = 0;
  
    if (items.length === 0) {
      DOM.cartContainer.innerHTML = `<p class="receipt-empty">Корзина пуста. Выберите детали в каталоге.</p>`;
      DOM.submitBtn.disabled = true;
    } else {
      DOM.submitBtn.disabled = false;
      DOM.cartContainer.innerHTML = items.map(item => {
        totalCount += item.quantity;
        totalPrice += item.price * item.quantity;
        
        return `
          <div class="receipt-row">
            <div class="qty-stepper">
              <button data-action="minus" data-id="${item.id}">-</button>
              <span>${item.quantity}</span>
              <button data-action="plus" data-id="${item.id}">+</button>
            </div>
            <span class="receipt-item-name">${item.name}</span>
            <div class="receipt-leader"></div>
            <span class="receipt-item-price">${formatPrice(item.price * item.quantity)}</span>
            <button class="receipt-remove" data-action="remove" data-id="${item.id}">&times;</button>
          </div>
        `;
      }).join('');
    }
  
    DOM.cartCount.textContent = totalCount;
    DOM.cartTotalPrice.textContent = `${formatPrice(totalPrice)} сум`;
  }
  
  // ==========================================
  // 4. КОНТРОЛЛЕРЫ И СОБЫТИЯ (EVENTS)
  // ==========================================
  function bindEvents() {
    const { DOM } = AppState;
  
    // Плавный скролл к корзине
    DOM.cartTotalBtn.addEventListener('click', () => {
      document.getElementById('order').scrollIntoView({ behavior: 'smooth' });
    });
  
    // Поиск
    DOM.searchInput.addEventListener('input', (e) => {
      AppState.filters.search = e.target.value.toLowerCase().trim();
      renderProducts();
    });
  
    // Фильтры категорий
    DOM.filterTabs.forEach(btn => {
      btn.addEventListener('click', (e) => {
        DOM.filterTabs.forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        AppState.filters.category = e.target.dataset.category;
        renderProducts();
      });
    });
  
    // Делегирование событий для карточек товаров (Add to Cart)
    DOM.productsContainer.addEventListener('click', (e) => {
      const btn = e.target.closest('.btn-add');
      if (!btn) return;
  
      const productId = btn.dataset.id;
      toggleCart(productId);
    });
  
    // Делегирование событий для управления корзиной (Чек)
    DOM.cartContainer.addEventListener('click', (e) => {
      if (e.target.tagName !== 'BUTTON') return;
      
      const action = e.target.dataset.action;
      const productId = e.target.dataset.id;
  
      if (action === 'plus') updateQuantity(productId, 1);
      if (action === 'minus') updateQuantity(productId, -1);
      if (action === 'remove') toggleCart(productId);
    });
  
    // Оформление заказа
    DOM.orderForm.addEventListener('submit', handleOrder);
  }
  
  // ==========================================
  // 5. БИЗНЕС-ЛОГИКА
  // ==========================================
  function toggleCart(productId) {
    if (AppState.cart[productId]) {
      delete AppState.cart[productId];
      showToast('Товар удален из заказа');
    } else {
      const product = AppState.products.find(p => p.id === productId);
      AppState.cart[productId] = { ...product, quantity: 1 };
      
      // Анимация кнопки в шапке
      AppState.DOM.cartTotalBtn.classList.add('bump');
      setTimeout(() => AppState.DOM.cartTotalBtn.classList.remove('bump'), 200);
      
      showToast('Добавлено в заказ');
    }
    
    renderCart();
    renderProducts(); // Обновляем состояние кнопок на карточках
  }
  
  function updateQuantity(productId, delta) {
    const item = AppState.cart[productId];
    if (!item) return;
  
    item.quantity += delta;
    if (item.quantity <= 0) {
      delete AppState.cart[productId];
    }
    
    renderCart();
  }
  
  function handleOrder(e) {
    e.preventDefault();
    const { DOM } = AppState;
    
    DOM.submitBtn.classList.add('sending');
    DOM.submitBtn.querySelector('span').textContent = 'Обработка данных...';
    DOM.submitBtn.disabled = true;
    
    // Эмуляция отправки на сервер
    setTimeout(() => {
      DOM.submitBtn.classList.remove('sending');
      DOM.submitBtn.querySelector('span').textContent = 'Успешно!';
      
      showToast('Заказ принят! Ожидайте звонка менеджера.');
      
      AppState.cart = {}; // Очищаем корзину
      renderCart();
      renderProducts();
      DOM.orderForm.reset();
      
      // Генерируем новый номер заказа для следующей покупки
      DOM.orderNumber.textContent = `#UZ-${Math.floor(10000 + Math.random() * 90000)}`;
    }, 2000);
  }
  
  // ==========================================
  // 6. УТИЛИТЫ
  // ==========================================
  function showToast(message) {
    const toast = AppState.DOM.toast;
    toast.textContent = message;
    toast.classList.add('show');
    
    // Сбрасываем таймер, если кликают быстро
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => toast.classList.remove('show'), 2500);
  }