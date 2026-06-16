/* ============================================
   НАСТРОЙКИ TELEGRAM
   ============================================ */
   const BOT_TOKEN ='8757607697:AAEazhbC-8JcC2J6VdP-YGPIm-rsBAzXAnU';
   const CHAT_ID ='-1004436689296';
   
   /* ============================================
      СЛОВАРЬ ИНТЕРФЕЙСА
      ============================================ */
   const LANG = {
       ru: {
         all: 'Все',
         addToCart: 'В корзину',
         added: 'Добавлено',
         emptyCart: 'Корзина пуста — выберите детали в <a href="#catalog">каталоге выше</a>.',
         sendOrder: 'Отправить заказ',
         sending: 'Отправка…',
         orderSent: 'Заказ отправлен! Мы скоро свяжемся с вами.',
         addItem: 'Добавьте хотя бы одну деталь в корзину',
         noResults: 'По запросу ничего не найдено. Попробуйте другое слово или категорию.'
       },
     
       uz: {
         all: 'Barchasi',
         addToCart: 'Savatga',
         added: "Qo'shildi",
         emptyCart: "Savat bo'sh — yuqoridagi <a href='#catalog'>katalogdan</a> mahsulot tanlang.",
         sendOrder: 'Buyurtmani yuborish',
         sending: 'Yuborilmoqda…',
         orderSent: "Buyurtma yuborildi! Tez orada siz bilan bog'lanamiz.",
         addItem: "Kamida bitta mahsulot qo'shing",
         noResults: "So'rov bo'yicha hech narsa topilmadi. Boshqa so'z yoki turkum sinab ko'ring."
       }
   };
   
   /* Словарь для динамического перевода категорий */
   const CATEGORY_MAP = {
     'Все': { ru: 'Все', uz: 'Barchasi' },
     'Свечи зажигания': { ru: 'Свечи зажигания', uz: "O't oldirish shamchalari" },
     'Тормозная система': { ru: 'Тормозная система', uz: 'Tormoz tizimi' },
     'Фильтры': { ru: 'Фильтры', uz: 'Filtrlar' },
     'Масла и жидкости': { ru: 'Масла и жидкости', uz: 'Moylar va suyuqliklar' },
     'Аккумуляторы': { ru: 'Аккумуляторы', uz: 'Akkumulyatorlar' }
   };
     
   let currentLang = 'ru';
   
   /* ============================================
      ДВУЯЗЫЧНЫЙ КАТАЛОГ ТОВАРОВ
      ============================================ */
   const PRODUCTS = [
     { id: 1, sku: '0231', brand: 'NGK', name_ru: 'Свечи зажигания, комплект 4 шт', name_uz: "O't oldirish shamchalari, 4 dona to'plam", spec_ru: 'Для бензиновых двигателей, зазор 0.8 мм', spec_uz: 'Benzinli dvigatellar uchun, tirqish 0.8 mm', price: 120000, category: 'Свечи зажигания' },
     { id: 2, sku: '0456', brand: 'Brembo', name_ru: 'Колодки тормозные передние', name_uz: 'Old tormoz kalodkalari', spec_ru: 'Комплект на 1 ось, керамический состав', spec_uz: "1 ta o'q uchun to'plam, keramika tarkibli", price: 450000, category: 'Тормозная система' },
     { id: 3, sku: '0789', brand: 'Shell', name_ru: 'Фильтр масляный', name_uz: 'Moy filtri', spec_ru: 'Подходит для большинства бензиновых двигателей', spec_uz: "Ko'pchilik benzinli dvigatellar uchun mos keladi", price: 85000, category: 'Фильтры' },
     { id: 4, sku: '1012', brand: 'Mobil 1', name_ru: 'Масло моторное 5W-40, 4 л', name_uz: 'Motor moyi 5W-40, 4 l', spec_ru: 'Синтетика, для турбированных двигателей', spec_uz: 'Sintetika, turbodvigatellar uchun', price: 380000, category: 'Масла и жидкости' },
     { id: 5, sku: '1140', brand: 'Mann-Filter', name_ru: 'Фильтр воздушный', name_uz: 'Havo filtri', spec_ru: 'Оригинальная замена, качество OEM', spec_uz: 'Original almashtirish, OEM sifati', price: 65000, category: 'Фильтры' },
     { id: 6, sku: '1273', brand: 'Bosch', name_ru: 'Диски тормозные задние, 2 шт', name_uz: 'Orqa tormoz disklari, 2 dona', spec_ru: 'Вентилируемые, для регулярной эксплуатации', spec_uz: 'Ventilyatsiyalanadigan, muntazam foydalanish uchun', price: 620000, category: 'Тормозная система' },
     { id: 7, sku: '1305', brand: 'Varta', name_ru: 'Аккумулятор Blue Dynamic 60Ah', name_uz: 'Blue Dynamic 60Ah akkumulyatori', spec_ru: 'Пусковой ток 540А, гарантия 2 года', spec_uz: "Boshlang'ich tok 540A, 2 yil kafolat", price: 890000, category: 'Аккумуляторы' },
     { id: 8, sku: '1356', brand: 'Bosch', name_ru: 'Свечи накаливания, комплект 4 шт', name_uz: 'Qizdirish shamchalari, 4 dona to\'plam', spec_ru: 'Для дизельных двигателей', spec_uz: 'Dizel dvigatellari uchun', price: 145000, category: 'Свечи зажигания' },
     { id: 9, sku: '1402', brand: 'Mann-Filter', name_ru: 'Фильтр салонный угольный', name_uz: 'Salon ko\'mir filtri', spec_ru: 'Угольный слой, защита от запахов', spec_uz: 'Ko\'mir qatlami, hidlardan himoya', price: 55000, category: 'Фильтры' },
   ];
   
   const CATEGORIES = ['Все', ...new Set(PRODUCTS.map(p => p.category))];
   
   let activeCategory = 'Все';
   let searchTerm = '';
   let cart = []; // { id, qty }
   
   /* ---------- Хелперы ---------- */
   function formatSum(n) {
     const currency = currentLang === 'ru' ? ' сум' : ' soʻm';
     return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + currency;
   }
   
   function showToast(message, isError = false) {
     const toast = document.getElementById('toast');
     toast.textContent = message;
     toast.classList.toggle('error', isError);
     toast.classList.add('show');
     clearTimeout(showToast._t);
     showToast._t = setTimeout(() => toast.classList.remove('show'), 2600);
   }
   
   /* ---------- Табы категорий ---------- */
   function renderCategoryTabs() {
     const wrap = document.getElementById('category-tabs');
     wrap.innerHTML = '';
     CATEGORIES.forEach(cat => {
       const btn = document.createElement('button');
       btn.className = 'tab-btn' + (cat === activeCategory ? ' active' : '');
       
       // Подтягиваем перевод названия вкладки из карты соответствия
       btn.textContent = CATEGORY_MAP[cat] ? CATEGORY_MAP[cat][currentLang] : cat;
       
       btn.type = 'button';
       btn.setAttribute('role', 'tab');
       btn.setAttribute('aria-selected', cat === activeCategory);
       btn.addEventListener('click', () => {
         activeCategory = cat;
         renderCategoryTabs();
         renderProducts();
       });
       wrap.appendChild(btn);
     });
   }
   
   /* ---------- Сетка товаров ---------- */
   function renderProducts() {
     const grid = document.getElementById('products-grid');
     const noResults = document.getElementById('no-results');
     const term = searchTerm.trim().toLowerCase();
   
     const filtered = PRODUCTS.filter(p => {
       const inCategory = activeCategory === 'Все' || p.category === activeCategory;
       // Ищем соответствия по выбранному в данный момент языку
       const currentName = p[`name_${currentLang}`].toLowerCase();
       const inSearch = !term || currentName.includes(term) || p.brand.toLowerCase().includes(term);
       return inCategory && inSearch;
     });
   
     grid.innerHTML = '';
     noResults.hidden = filtered.length !== 0;
     noResults.textContent = LANG[currentLang].noResults;
   
     filtered.forEach((p, i) => {
       const card = document.createElement('div');
       card.className = 'product-card';
       card.style.animationDelay = (i * 0.04) + 's';
       card.innerHTML = `
         <div class="product-card-top">
           <span class="product-sku">${currentLang === 'ru' ? 'Арт. №' : 'Art. №'}${p.sku}</span>
           <span class="product-brand">${p.brand}</span>
         </div>
         <h3>${p[`name_${currentLang}`]}</h3>
         <p class="product-spec">${p[`spec_${currentLang}`]}</p>
         <div class="product-card-bottom">
           <span class="product-price">${formatSum(p.price)}</span>
           <button class="btn-add" type="button" data-id="${p.id}">
             <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 4h2l2.4 12.4a2 2 0 0 0 2 1.6h7.2a2 2 0 0 0 2-1.6L20 8H6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
             <span>${LANG[currentLang].addToCart}</span>
           </button>
         </div>
       `;
       grid.appendChild(card);
     });
   
     grid.querySelectorAll('.btn-add').forEach(btn => {
       btn.addEventListener('click', () => addToCart(Number(btn.dataset.id), btn));
     });
   }
   
   /* ---------- Корзина ---------- */
   function addToCart(id, btnEl) {
     const existing = cart.find(i => i.id === id);
     if (existing) {
       existing.qty += 1;
     } else {
       cart.push({ id, qty: 1 });
     }
     updateCartUI();
   
     const product = PRODUCTS.find(p => p.id === id);
     const actionText = currentLang === 'ru' ? 'Добавлено' : "Qo'shildi";
     showToast(`${actionText}: ${product[`name_${currentLang}`]}`);
   
     if (btnEl) {
       btnEl.classList.add('added');
       setTimeout(() => btnEl.classList.remove('added'), 700);
     }
   
     const pill = document.getElementById('cart-pill');
     pill.classList.add('bump');
     setTimeout(() => pill.classList.remove('bump'), 250);
   }
   
   function changeQty(id, delta) {
     const item = cart.find(i => i.id === id);
     if (!item) return;
     item.qty += delta;
     if (item.qty <= 0) {
       cart = cart.filter(i => i.id !== id);
     }
     updateCartUI();
   }
   
   function removeFromCart(id) {
     cart = cart.filter(i => i.id !== id);
     updateCartUI();
   }
   
   function updateCartUI() {
     const itemsWrap = document.getElementById('receipt-items');
     const totalEl = document.getElementById('cart-total');
     const cartCount = document.getElementById('cart-count');
     const submitBtn = document.getElementById('submit-btn');
   
     const totalQty = cart.reduce((sum, i) => sum + i.qty, 0);
     cartCount.textContent = totalQty;
   
     if (cart.length === 0) {
       itemsWrap.innerHTML = `<p class="receipt-empty" id="receipt-empty">${LANG[currentLang].emptyCart}</p>`;
       totalEl.textContent = formatSum(0);
       submitBtn.disabled = true;
       return;
     }
   
     let total = 0;
     itemsWrap.innerHTML = '';
     cart.forEach(item => {
       const product = PRODUCTS.find(p => p.id === item.id);
       if (!product) return;
       const lineTotal = product.price * item.qty;
       total += lineTotal;
   
       const row = document.createElement('div');
       row.className = 'receipt-row';
       row.innerHTML = `
         <div class="qty-stepper">
           <button type="button" data-action="dec" aria-label="${currentLang === 'ru' ? 'Уменьшить количество' : 'Kamaytirish'}">−</button>
           <span>${item.qty}</span>
           <button type="button" data-action="inc" aria-label="${currentLang === 'ru' ? 'Увеличить количество' : 'Koʻpaytirish'}">+</button>
         </div>
         <span class="receipt-item-name">${product[`name_${currentLang}`]}</span>
         <span class="receipt-leader"></span>
         <span class="receipt-item-price">${formatSum(lineTotal)}</span>
         <button type="button" class="receipt-remove" aria-label="${currentLang === 'ru' ? 'Удалить' : 'Oʻchirish'}">×</button>
       `;
       row.querySelector('[data-action="dec"]').addEventListener('click', () => changeQty(item.id, -1));
       row.querySelector('[data-action="inc"]').addEventListener('click', () => changeQty(item.id, 1));
       row.querySelector('.receipt-remove').addEventListener('click', () => removeFromCart(item.id));
       itemsWrap.appendChild(row);
     });
   
     totalEl.textContent = formatSum(total);
     submitBtn.disabled = false;
   }
   
   /* ---------- Наряд-заказ дата/номер ---------- */
   function initReceiptHeader() {
     const num = 'AP-' + Math.floor(1000 + Math.random() * 9000);
     document.getElementById('order-number').textContent = num;
     
     const currentLocale = currentLang === 'ru' ? 'ru-RU' : 'uz-UZ';
     document.getElementById('order-date').textContent = new Date().toLocaleDateString(currentLocale);
   }
   
   /* ---------- Отправка заказа в Telegram ---------- */
   document.getElementById('order-form').addEventListener('submit', function (e) {
     e.preventDefault();
   
     if (cart.length === 0) {
       showToast(LANG[currentLang].addItem, true);
       return;
     }
   
     const name = document.getElementById('username').value.trim();
     const phone = document.getElementById('phone').value.trim();
     const email = document.getElementById('email').value.trim();
   
     const submitBtn = document.getElementById('submit-btn');
     const label = submitBtn.querySelector('.btn-label');
     submitBtn.disabled = true;
     submitBtn.classList.add('sending');
     label.textContent = LANG[currentLang].sending;
   
     // Формируем текст отчета в зависимости от выбранного пользователем языка
     let message = currentLang === 'ru'
       ? `🔧 НОВЫЙ ЗАКАЗ AutoParts.uz\n\nИмя: ${name}\nТелефон: ${phone}\n`
       : `🔧 YANGI BUYURTMA AutoParts.uz\n\nIsm: ${name}\nTelefon: ${phone}\n`;
       
     if (email) message += `Email: ${email}\n`;
     message += currentLang === 'ru' ? `\nТовары:\n` : `\nMahsulotlar:\n`;
     
     cart.forEach(item => {
       const product = PRODUCTS.find(p => p.id === item.id);
       if (product) {
         message += `• ${product[`name_${currentLang}`]} — ${item.qty} шт × ${formatSum(product.price)} = ${formatSum(product.price * item.qty)}\n`;
       }
     });
     
     const total = cart.reduce((sum, item) => {
       const product = PRODUCTS.find(p => p.id === item.id);
       return sum + (product ? product.price * item.qty : 0);
     }, 0);
     
     message += currentLang === 'ru' ? `\nИТОГО: ${formatSum(total)}` : `\nJAMI: ${formatSum(total)}`;
   
     fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({ chat_id: CHAT_ID, text: message }),
     })
       .then(r => r.json())
       .then(data => {
         if (data.ok) {
           showToast(LANG[currentLang].orderSent);
           cart = [];
           updateCartUI();
           e.target.reset();
           initReceiptHeader();
         } else {
           const errText = currentLang === 'ru' ? 'Ошибка отправки: ' : 'Yuborishda xatolik: ';
           showToast(errText + (data.description || 'error'), true);
         }
       })
       .catch(() => {
         const netErr = currentLang === 'ru' 
           ? 'Не удалось отправить заказ. Проверьте интернет-соединение.' 
           : 'Buyurtmani yuborib boʻlmadi. Internet aloqasini tekshiring.';
         showToast(netErr, true);
       })
       .finally(() => {
         submitBtn.classList.remove('sending');
         label.textContent = LANG[currentLang].sendOrder;
         submitBtn.disabled = cart.length === 0;
       });
   });
   
   /* ---------- Поиск ---------- */
   document.getElementById('search-input').addEventListener('input', e => {
     searchTerm = e.target.value;
     renderProducts();
   });
   
   /* ---------- Скролл к корзине ---------- */
   document.getElementById('cart-pill').addEventListener('click', () => {
     document.getElementById('order').scrollIntoView({ behavior: 'smooth', block: 'start' });
   });
   
   /* ============================================
      ФУНКЦИЯ СМЕНЫ ЯЗЫКА (ПОЛНАЯ СБОРКА)
      ============================================ */
   function setLang(lang) {
       currentLang = lang;
     
       document.querySelectorAll('.lang-btn').forEach(btn => {
         btn.classList.remove('active');
         if (btn.textContent.toLowerCase() === lang) {
           btn.classList.add('active');
         }
       });
     
       if (lang === 'uz') {
         // Шапка
         document.querySelector('a[href="#catalog"]').textContent = 'Katalog';
         document.querySelector('a[href="#order"]').textContent = 'Buyurtma';
         document.querySelector('a[href="#footer"]').textContent = 'Kontaktlar';
     
         // Главный экран (Hero)
         document.querySelector('.hero-content .eyebrow').textContent = 'Ehtiyot qismlar katalogi · Oʻzbekiston';
         document.querySelector('.hero-content h1').innerHTML = 'Original ehtiyot qismlar.<br>Soxtasiz va ortiqcha toʻlovsiz.';
         document.querySelector('.hero-sub').textContent = 'NGK, Brembo, Bosch, Shell, Mann-Filter va Varta brendlarining original mahsulotlari. Buyurtma bir daqiqada rasmiylashtiriladi.';
         document.querySelector('.hero-actions .btn-primary').textContent = 'Katalogni koʻrish';
         document.querySelector('.hero-actions .btn-ghost').textContent = 'Buyurtmaga oʻtish →';
     
         // Преимущества
         document.querySelectorAll('.trust-row li')[0].lastChild.textContent = 'Oʻzbekiston bo‘ylab yetkazib berish';
         document.querySelectorAll('.trust-row li')[1].lastChild.textContent = 'Faqat original mahsulotlar';
         document.querySelectorAll('.trust-row li')[2].lastChild.textContent = 'Qabul qilganda toʻlov';
         
         // Чертёж
         document.querySelector('.hero-visual .bp-label-sm').textContent = '2 DONA TOʻPLAM';
     
         // Секция Каталога
         document.querySelector('#catalog .eyebrow').textContent = 'Katalog';
         document.querySelector('#catalog h2').textContent = 'Kerakli ehtiyot qismini tanlang';
         document.querySelector('#catalog .section-sub').textContent = 'Barcha mahsulotlar Toshkent omborida mavjud, buyurtma kunining oʻzida yuboriladi.';
         document.getElementById('search-input').placeholder = 'Mahsulot yoki brendni qidiring…';
     
         // Секция Оформления заказа
         document.querySelector('#order .eyebrow').textContent = 'Buyurtma rasmiylashtirish';
         document.querySelector('#order h2').textContent = 'Sizning buyurtmangiz';
         document.querySelector('#order .section-sub').textContent = 'Kontakt maʼlumotlarini toʻldiring — menejer tasdiqlash va yetkazib berishni hisoblash uchun bogʻlanadi.';
         
         // Текст чека
         document.querySelector('.receipt-header span:first-child').childNodes[0].textContent = 'BUYURTMA-NARYAD ';
         document.querySelector('.receipt-total-row span:first-child').textContent = 'JAMI';
   
         // Поля формы
         document.querySelector('label[for="username"]').textContent = 'Ism';
         document.getElementById('username').placeholder = 'Ismingizni kiriting';
         document.querySelector('label[for="phone"]').textContent = 'Telefon';
         document.querySelector('label[for="email"]').innerHTML = 'Email <span class="optional">(ixtiyoriy)</span>';
         document.getElementById('email').placeholder = 'you@example.com';
         
         // Кнопка и примечание формы
         document.querySelector('.form-note').textContent = 'Buyurtmalar qoʻlda qayta ishlanadi, ish vaqtida 30 daqiqa ichida javob beramiz.';
         document.querySelector('.btn-submit .btn-label').textContent = 'Buyurtmani yuborish';
         
         // Подвал (Footer)
         document.querySelector('.footer-brand p').textContent = 'Sinalgan brendlarning avtoehtiyot qismlari Oʻzbekiston boʻylab yetkazib berish bilan.';
         document.querySelectorAll('.footer-col h3')[0].textContent = 'Kontaktlar';
         document.querySelectorAll('.footer-col p')[1].textContent = 'Guliston';
         document.querySelectorAll('.footer-col h3')[1].textContent = 'Ish tartibi';
         document.querySelectorAll('.footer-col p')[2].textContent = 'Dush–Yak: 9:00–19:00';
         document.querySelector('.footer-bottom span').textContent = '© 2026 AutoParts.uz';
       } else {
         // Шапка
         document.querySelector('a[href="#catalog"]').textContent = 'Каталог';
         document.querySelector('a[href="#order"]').textContent = 'Заказ';
         document.querySelector('a[href="#footer"]').textContent = 'Контакты';
     
         // Главный экран (Hero)
         document.querySelector('.hero-content .eyebrow').textContent = 'Каталог запчастей · Узбекистан';
         document.querySelector('.hero-content h1').innerHTML = 'Оригинальные детали.<br>Без подделок и переплат.';
         document.querySelector('.hero-sub').textContent = 'Свечи, тормозная система, фильтры, масла и аккумуляторы проверенных брендов — NGK, Brembo, Bosch, Shell, Mann-Filter, Varta. Заказ оформляется за минуту.';
         document.querySelector('.hero-actions .btn-primary').textContent = 'Смотреть каталог';
         document.querySelector('.hero-actions .btn-ghost').textContent = 'Перейти к заказу →';
     
         // Преимущества
         document.querySelectorAll('.trust-row li')[0].lastChild.textContent = 'Доставка по Узбекистану';
         document.querySelectorAll('.trust-row li')[1].lastChild.textContent = 'Только оригинал';
         document.querySelectorAll('.trust-row li')[2].lastChild.textContent = 'Оплата при получении';
         
         // Чертёж
         document.querySelector('.hero-visual .bp-label-sm').textContent = 'КОМПЛЕКТ 2 ШТ';
     
         // Секция Каталога
         document.querySelector('#catalog .eyebrow').textContent = 'Каталог';
         document.querySelector('#catalog h2').textContent = 'Подберите деталь';
         document.querySelector('#catalog .section-sub').textContent = 'Все позиции в наличии на складе в Ташкенте, отправка в день заказа.';
         document.getElementById('search-input').placeholder = 'Найти деталь или бренд…';
     
         // Секция Оформления заказа
         document.querySelector('#order .eyebrow').textContent = 'Оформление';
         document.querySelector('#order h2').textContent = 'Ваш заказ';
         document.querySelector('#order .section-sub').textContent = 'Заполните контакты — менеджер свяжется для подтверждения и расчёта доставки.';
         
         // Текст чека
         document.querySelector('.receipt-header span:first-child').childNodes[0].textContent = 'НАРЯД-ЗАКАЗ ';
         document.querySelector('.receipt-total-row span:first-child').textContent = 'ИТОГО';
   
         // Поля формы
         document.querySelector('label[for="username"]').textContent = 'Имя';
         document.getElementById('username').placeholder = 'Как к вам обращаться';
         document.querySelector('label[for="phone"]').textContent = 'Телефон';
         document.querySelector('label[for="email"]').innerHTML = 'Email <span class="optional">(необязательно)</span>';
         document.getElementById('email').placeholder = 'you@example.com';
         
         // Кнопка и примечание формы
         document.querySelector('.form-note').textContent = 'Заказы обрабатываются вручную, ответим в течение 30 минут в рабочее время.';
         document.querySelector('.btn-submit .btn-label').textContent = 'Отправить заказ';
         
         // Подвал (Footer)
         document.querySelector('.footer-brand p').textContent = 'Автозапчасти проверенных брендов с доставкой по Узбекистану.';
         document.querySelectorAll('.footer-col h3')[0].textContent = 'Контакты';
         document.querySelectorAll('.footer-col p')[1].textContent = 'Гулистан';
         document.querySelectorAll('.footer-col h3')[1].textContent = 'Режим работы';
         document.querySelectorAll('.footer-col p')[2].textContent = 'Пн–Вс: 9:00–19:00';
         document.querySelector('.footer-bottom span').textContent = '© 2026 AutoParts.uz';
       }
     
       // Перерисовываем интерфейс с новыми строковыми данными
       renderCategoryTabs();
       renderProducts();
       updateCartUI();
       initReceiptHeader();
   }
   
   /* ---------- Инициализация приложения ---------- */
   renderCategoryTabs();
   renderProducts();
   updateCartUI();
   initReceiptHeader();