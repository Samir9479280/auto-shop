/**
 * AutoParts.uz — Мультиязычная база данных и логика
 */
const TG_CONFIG = {
    BOT_TOKEN: "8757607697:AAEazhbC-8JcC2J6VdP-YGPIm-rsBAzXAnU",     // Сюда токен от @BotFather (например: '123456:ABC-DEF...')
    CHAT_ID: "-1004436689296"        // Сюда ID группы или канала (например: '-100123456789' или '51234567')
  };
// ==========================================
// 1. СЛОВАРЬ ПЕРЕВОДА ИНТЕРФЕЙСА (UI TRANSLATIONS)
// ==========================================
const Translations = {
    ru: {
      "nav-catalog": "Каталог",
      "nav-order": "Оформление",
      "cart-units": "шт.",
      "hero-eyebrow": "Профессиональные компоненты",
      "hero-title": "Оригинальные запчасти и аналоги",
      "hero-sub": "Более 250 наименований деталей в наличии на складе в Ташкенте. Экспресс-доставка по всему Узбекистану.",
      "btn-go-catalog": "Перейти к каталогу",
      "btn-your-order": "Ваш заказ",
      "catalog-title": "Каталог запчастей",
      "catalog-sub": "Используйте фильтры и поиск для быстрого подбора нужной детали",
      "cat-all": "Все детали",
      "cat-engine": "Двигатель",
      "cat-brake": "Тормозная система",
      "cat-suspension": "Подвеска",
      "cat-electric": "Электрика",
      "no-results": "По вашему запросу ничего не найдено. Попробуйте изменить фильтры.",
      "order-title": "Оформление заказа",
      "receipt-spec": "Предварительный чек",
      "receipt-total": "Итого к оплате:",
      "form-name": "Имя получателя",
      "form-phone": "Номер телефона",
      "btn-submit": "Подтвердить заказ",
      "form-note": "Наш менеджер свяжется с вами для уточнения деталей доставки",
      "footer-text": "© 2026 AutoParts.uz. Разработано для профессионалов. Все права защищены.",
      "search-placeholder": "Поиск по названию, бренду или артикулу...",
      "btn-buy": "Купить",
      "btn-in-cart": "В корзине",
      "cart-empty": "Ваша корзина пуста. Выберите детали в каталоге.",
      "toast-add": "Запчасть добавлена в чек",
      "toast-remove": "Деталь удалена из корзины",
      "toast-success": "Заказ принят! Ожидайте звонка менеджера.",
      "sending": "Формирование заявки...",
      "success-btn": "Заказ отправлен!"
    },
    uz: {
      "nav-catalog": "Katalog",
      "nav-order": "Rasmiylashtirish",
      "cart-units": "dona",
      "hero-eyebrow": "Professional komponentlar",
      "hero-title": "Original qismlar va analoglar",
      "hero-sub": "Toshkentdagi omborda 250 dan ortiq turdagi butlovchi qismlar mavjud. O'zbekiston bo'ylab ekspress yetkazib berish.",
      "btn-go-catalog": "Katalogni ko'rish",
      "btn-your-order": "Sizning buyurtmangiz",
      "catalog-title": "Ehtiyot qismlar katalogi",
      "catalog-sub": "Kerakli qismni tezda topish uchun filtrlardan va qidiruvdan foydalaning",
      "cat-all": "Barcha qismlar",
      "cat-engine": "Dvigatel",
      "cat-brake": "Tormoz tizimi",
      "cat-suspension": "Podveska",
      "cat-electric": "Elektrika",
      "no-results": "Sizning so'rovingiz bo'yicha hech narsa topilmadi. Filtrlarni o'zgartirib ko'ring.",
      "order-title": "Buyurtmani rasmiylashtirish",
      "receipt-spec": "Dastlabki chek",
      "receipt-total": "To'lov uchun jami:",
      "form-name": "Qabul qiluvchining ismi",
      "form-phone": "Telefon raqami",
      "btn-submit": "Buyurtmani tasdiqlash",
      "form-note": "Yetkazib berish tafsilotlarini aniqlashtirish uchun menejerimiz siz bilan bog'lanadi",
      "footer-text": "© 2026 AutoParts.uz. Professionallar uchun ishlab chiqilgan. Barcha huquqlar himoyalangan.",
      "search-placeholder": "Nomi, brendi yoki artikuli bo'yicha qidirish...",
      "btn-buy": "Sotib olish",
      "btn-in-cart": "Savatchada",
      "cart-empty": "Savatchangiz bo'sh. Kataloqdan mahsulot tanlang.",
      "toast-add": "Ehtiyot qism chekka qo'shildi",
      "toast-remove": "Ma'lumot savatchadan o'chirildi",
      "toast-success": "Buyurtma qabul qilindi! Menejer qo'ng'irog'ini kuting.",
      "sending": "Ariza shakllantirilmoqda...",
      "success-btn": "Buyurtma yuborildi!"
    }
  };
  
  // ==========================================
  // 2. ДВУХЪЯЗЫЧНАЯ БАЗА АВТОЗАПЧАСТЕЙ
  // ==========================================
  const AppState = {
    products: [],
    cart: {},
    filters: { category: 'all', search: '' },
    currentLang: 'ru',
    DOM: {}
  };
  
  const REAL_PARTS_RAW = [
    { 
      cat: "engine", brand: "GM Original", price: 65000, 
      name_ru: "Фильтр масляный", name_uz: "Moy filtri",
      spec_ru: "Оригинальный заводской фильтр очистки масла.", spec_uz: "Original zavod moy tozalash filtri."
    },
    { 
      cat: "engine", brand: "Gates", price: 480000, 
      name_ru: "Ремень ГРМ (Комплект с роликами)", name_uz: "GHRM tasmasi (Roliklar to'plami)",
      spec_ru: "Усиленный ремень ГРМ, ресурс до 80 000 км.", spec_uz: "Kuchaytirilgan GHRM tasmasi, resursi 80 000 km gacha."
    },
    { 
      cat: "engine", brand: "NGK", price: 35000, 
      name_ru: "Свеча зажигания Nickel", name_uz: "O't oldirish shamchasi Nickel",
      spec_ru: "Стабильная искра, улучшенный холодный запуск.", spec_uz: "Barqaror uchqun, yaxshilangan sovuq ishga tushirish."
    },
    { 
      cat: "engine", brand: "Denso", price: 120000, 
      name_ru: "Свеча зажигания Иридиевая", name_uz: "O't oldirish shamchasi Iridium",
      spec_ru: "Сверхпрочный иридиевый наконечник.", spec_uz: "O'ta mustahkam iridium uchi."
    },
    { 
      cat: "engine", brand: "Hepu", price: 320000, 
      name_ru: "Помпа водяная (Насос охлаждения)", name_uz: "Suv pompasi (Suv nasosi)",
      spec_ru: "Металлическая крыльчатка, защита от протечек.", spec_uz: "Metall parrak, oqishdan himoya."
    },
    { 
      cat: "brake", brand: "Brembo", price: 380000, 
      name_ru: "Колодки тормозные передние", name_uz: "Old tormoz kolodkalari",
      spec_ru: "Керамическое напыление, отсутствие скрипа.", spec_uz: "Keramik qoplama, g'ichirlashlarsiz tormozlash."
    },
    { 
      cat: "brake", brand: "TRW", price: 260000, 
      name_ru: "Колодки тормозные задние", name_uz: "Orqa tormoz kolodkalari",
      spec_ru: "Оптимальное трение, бережное отношение к дискам.", spec_uz: "Optimal ishqalanish, disklarga zarar yetkazmaydi."
    },
    { 
      cat: "brake", brand: "Zimmermann", price: 920000, 
      name_ru: "Диск тормозной передний (Пара)", name_uz: "Old tormoz diski (Jufr)",
      spec_ru: "Перфорированные диски с повышенным охлаждением.", spec_uz: "Yuqori darajada sovutiladigan perforatsiyalangan disklar."
    },
    { 
      cat: "suspension", brand: "Kayaba", price: 590000, 
      name_ru: "Амортизатор передний газомасляный", name_uz: "Old gaz-moyli amortizator",
      spec_ru: "Идеальный баланс комфорта и управляемости.", spec_uz: "Komfort va boshqaruvning ideal balansi."
    },
    { 
      cat: "suspension", brand: "Sachs", price: 420000, 
      name_ru: "Амортизатор задний", name_uz: "Orqa amortizator",
      spec_ru: "Повышенная стойкость к высоким нагрузкам.", spec_uz: "Yuqori yuklamalarga chidamlilik."
    },
    { 
      cat: "suspension", brand: "CTR", price: 95000, 
      name_ru: "Стойка стабилизатора (Линк)", name_uz: "Stabilizator stoykasi (Link)",
      spec_ru: "Усиленный шарнир, защита от дорожной грязи.", spec_uz: "Kuchaytirilgan sharnir, yo'l loyidan himoya."
    },
    { 
      cat: "electric", brand: "Delco Remy", price: 1450000, 
      name_ru: "Генератор в сборе (100A)", name_uz: "Generator jamlanmasi (100A)",
      spec_ru: "Стабильная зарядка аккумулятора.", spec_uz: "Akkumulyatorning barqaror quvvatlanishi."
    },
    { 
      cat: "electric", brand: "Valeo", price: 980000, 
      name_ru: "Стартер двигателя (1.2 kW)", name_uz: "Dvigatel starteri (1.2 kW)",
      spec_ru: "Быстрый запуск двигателя в любые морозы.", spec_uz: "Har qanday sovuqda dvigatelni tez ishga tushirish."
    },
    { 
      cat: "electric", brand: "Delkor", price: 820000, 
      name_ru: "Аккумуляторная батарея 60Ah", name_uz: "Akkumulyator batareyasi 60Ah",
      spec_ru: "Кальциевый необслуживаемый аккумулятор.", spec_uz: "Kalsiyli xizmat ko'rsatilmaydigan akkumulyator."
    }
  ];
  
  const UZ_CARS = ["Cobalt", "Gentra", "Nexia 3", "Malibu 2", "Tracker 2", "Spark"];
  
  function compileProductDatabase() {
    let skuId = 320100;
    REAL_PARTS_RAW.forEach((part) => {
      UZ_CARS.forEach((car) => {
        let priceMultiplier = car === "Malibu 2" ? 2.4 : car === "Tracker 2" ? 1.8 : car === "Spark" ? 0.85 : 1.0;
        const finalPrice = Math.round((part.price * priceMultiplier) / 1000) * 1000;
  
        AppState.products.push({
          id: `p-${skuId}`,
          sku: `AP-${skuId}`,
          brand: part.brand,
          category: part.cat,
          price: finalPrice,
          name_ru: `${part.name_ru} на Chevrolet ${car}`,
          name_uz: `Chevrolet ${car} uchun ${part.name_uz}`,
          spec_ru: `${part.spec_ru} Полное соответствие OEM-стандартам UzAuto.`,
          spec_uz: `${part.spec_uz} UzAuto OEM standartlariga to'liq javob beradi.`
        });
        skuId++;
      });
    });
    AppState.products.sort(() => Math.random() - 0.5);
  }
  
  const formatSum = (num) => new Intl.NumberFormat('ru-RU').format(num);
  
  // ==========================================
  // 3. СИСТЕМА ПЕРЕКЛЮЧЕНИЯ ЯЗЫКА (ENGINE)
  // ==========================================
  function switchLanguage(lang) {
    AppState.currentLang = lang;
    
    // 1. Меняем активный класс на кнопках языков
    document.querySelectorAll('#lang-switcher .lang-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lang === lang);
    });
  
    // 2. Переводим все элементы с атрибутом data-i18n
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      if (Translations[lang][key]) {
        el.textContent = Translations[lang][key];
      }
    });
  
    // 3. Обновляем плейсхолдер поиска
    if (AppState.DOM.searchInput) {
      AppState.DOM.searchInput.placeholder = Translations[lang]["search-placeholder"];
    }
  
    // 4. Перерисовываем товары и корзину на новом языке
    renderProducts();
    renderCart();
  }
  
  // ==========================================
  // 4. ОТРИСОВКА ИНТЕРФЕЙСА
  // ==========================================
  function renderProducts() {
    const { products, filters, cart, currentLang, DOM } = AppState;
    const langText = Translations[currentLang];
  
    const filtered = products.filter(p => {
      const name = currentLang === 'ru' ? p.name_ru : p.name_uz;
      const matchCat = filters.category === 'all' || p.category === filters.category;
      const matchSearch = name.toLowerCase().includes(filters.search) || 
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
  
    DOM.productsContainer.innerHTML = filtered.slice(0, 80).map(product => {
      const inCart = cart[product.id];
      const btnClass = inCart ? 'btn-add added' : 'btn-add';
      const btnText = inCart ? langText["btn-in-cart"] : langText["btn-buy"];
      const name = currentLang === 'ru' ? product.name_ru : product.name_uz;
      const spec = currentLang === 'ru' ? product.spec_ru : product.spec_uz;
      
      return `
        <div class="product-card">
          <div class="product-card-top">
            <span class="product-sku">${product.sku}</span>
            <span class="product-brand">${product.brand}</span>
          </div>
          <h3>${name}</h3>
          <p class="product-spec">${spec}</p>
          <div class="product-card-bottom">
            <span class="product-price">${formatSum(product.price)} sum</span>
            <button class="${btnClass}" data-id="${product.id}">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>
              <span>${btnText}</span>
            </button>
          </div>
        </div>
      `;
    }).join('');
  }
  
  function renderCart() {
    const { cart, currentLang, DOM } = AppState;
    const items = Object.values(cart);
    const langText = Translations[currentLang];
    
    let totalItemsCount = 0;
    let totalPriceSum = 0;
  
    if (items.length === 0) {
      DOM.cartContainer.innerHTML = `<p class="receipt-empty">${langText["cart-empty"]}</p>`;
      DOM.submitBtn.disabled = true;
    } else {
      DOM.submitBtn.disabled = false;
      DOM.cartContainer.innerHTML = items.map(item => {
        totalItemsCount += item.quantity;
        totalPriceSum += item.price * item.quantity;
        const name = currentLang === 'ru' ? item.name_ru : item.name_uz;
        
        return `
          <div class="receipt-row">
            <div class="qty-stepper">
              <button data-action="minus" data-id="${item.id}">-</button>
              <span>${item.quantity}</span>
              <button data-action="plus" data-id="${item.id}">+</button>
            </div>
            <span class="receipt-item-name">${name}</span>
            <div class="receipt-leader"></div>
            <span class="receipt-item-price">${formatSum(item.price * item.quantity)} sum</span>
            <button class="receipt-remove" data-action="remove" data-id="${item.id}">&times;</button>
          </div>
        `;
      }).join('');
    }
  
    DOM.cartCount.textContent = totalItemsCount;
    DOM.cartTotalPrice.textContent = `${formatSum(totalPriceSum)} sum`;
  }
  
  // ==========================================
  // 5. ОБРАБОТКА СОБЫТИЙ И ИНИЦИАЛИЗАЦИЯ
  // ==========================================
  function bindStoreEvents() {
    const { DOM } = AppState;
  
    DOM.cartTotalBtn.addEventListener('click', () => {
      document.getElementById('order').scrollIntoView({ behavior: 'smooth' });
    });
  
    DOM.searchInput.addEventListener('input', (e) => {
      AppState.filters.search = e.target.value.toLowerCase().trim();
      renderProducts();
    });
  
    DOM.filterTabs.forEach(tab => {
      tab.addEventListener('click', (e) => {
        DOM.filterTabs.forEach(t => t.classList.remove('active'));
        e.target.classList.add('active');
        AppState.filters.category = e.target.dataset.category;
        renderProducts();
      });
    });
  
    // Переключение языков на лету
    document.getElementById('lang-switcher').addEventListener('click', (e) => {
      const btn = e.target.closest('.lang-btn');
      if (!btn) return;
      switchLanguage(btn.dataset.lang);
    });
  
    DOM.productsContainer.addEventListener('click', (e) => {
      const clickTarget = e.target.closest('.btn-add');
      if (!clickTarget) return;
      updateCartState(clickTarget.dataset.id);
    });
  
    DOM.cartContainer.addEventListener('click', (e) => {
      if (e.target.tagName !== 'BUTTON') return;
      const action = e.target.dataset.action;
      const id = e.target.dataset.id;
      if (action === 'plus') changeQty(id, 1);
      if (action === 'minus') changeQty(id, -1);
      if (action === 'remove') updateCartState(id, true);
    });
  
    DOM.orderForm.addEventListener('submit', sendOrderToManager);
  }
  
  function updateCartState(productId, forceRemove = false) {
    const langText = Translations[AppState.currentLang];
    if (AppState.cart[productId] || forceRemove) {
      delete AppState.cart[productId];
      fireToast(langText["toast-remove"]);
    } else {
      const targetProduct = AppState.products.find(p => p.id === productId);
      AppState.cart[productId] = { ...targetProduct, quantity: 1 };
      AppState.DOM.cartTotalBtn.classList.add('bump');
      setTimeout(() => AppState.DOM.cartTotalBtn.classList.remove('bump'), 220);
      fireToast(langText["toast-add"]);
    }
    renderCart();
    renderProducts();
  }
  
  function changeQty(productId, step) {
    const position = AppState.cart[productId];
    if (!position) return;
    position.quantity += step;
    if (position.quantity <= 0) delete AppState.cart[productId];
    renderCart();
  }
  
  function sendOrderToManager(e) {
    e.preventDefault();
    const { DOM, currentLang } = AppState;
    const langText = Translations[currentLang];
    
    DOM.submitBtn.classList.add('sending');
    DOM.submitBtn.querySelector('span').textContent = langText["sending"];
    DOM.submitBtn.disabled = true;
    
    setTimeout(() => {
      DOM.submitBtn.classList.remove('sending');
      DOM.submitBtn.querySelector('span').textContent = langText["success-btn"];
      fireToast(langText["toast-success"]);
      
      AppState.cart = {};
      renderCart();
      renderProducts();
      DOM.orderForm.reset();
      DOM.orderNumber.textContent = `#AP-UZ-${Math.floor(20000 + Math.random() * 79999)}`;
    }, 1800);
  }
  
  function fireToast(msg) {
    const toast = AppState.DOM.toast;
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toast.autoHideTimer);
    toast.autoHideTimer = setTimeout(() => toast.classList.remove('show'), 2000);
  }
  
  document.addEventListener('DOMContentLoaded', () => {
    compileProductDatabase();
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
    AppState.DOM.orderNumber.textContent = `#AP-UZ-${Math.floor(20000 + Math.random() * 79999)}`;
    bindStoreEvents();
    switchLanguage('ru'); // По умолчанию ставим русский
  });
