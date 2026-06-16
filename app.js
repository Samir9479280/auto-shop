/* ============================================
   НАСТРОЙКИ TELEGRAM
   ============================================
   ВАЖНО: старый токен бота был опубликован в открытом коде
   и считается скомпрометированным. Перед запуском:
   1) Зайди в @BotFather → /mybots → выбери бота →
      API Token → Revoke current token → получи новый.
   2) Вставь новый токен ниже вместо плейсхолдера.
   CHAT_ID уже верный — это id супергруппы "pjpjpj".
*/
const BOT_TOKEN = 'ВСТАВЬ_СЮДА_НОВЫЙ_ТОКЕН_БОТА';
const CHAT_ID = '-1004436689296';

/* ============================================
   КАТАЛОГ — единственный источник данных.
   Чтобы добавить деталь, просто добавь объект в массив.
   ============================================ */
const PRODUCTS = [
  { id: 1, sku: '0231', brand: 'NGK', name: 'Свечи зажигания, комплект 4 шт', spec: 'Для бензиновых двигателей, зазор 0.8 мм', price: 120000, category: 'Свечи зажигания' },
  { id: 2, sku: '0456', brand: 'Brembo', name: 'Колодки тормозные передние', spec: 'Комплект на 1 ось, керамический состав', price: 450000, category: 'Тормозная система' },
  { id: 3, sku: '0789', brand: 'Shell', name: 'Фильтр масляный', spec: 'Подходит для большинства бензиновых двигателей', price: 85000, category: 'Фильтры' },
  { id: 4, sku: '1012', brand: 'Mobil 1', name: 'Масло моторное 5W-40, 4 л', spec: 'Синтетика, для турбированных двигателей', price: 380000, category: 'Масла и жидкости' },
  { id: 5, sku: '1140', brand: 'Mann-Filter', name: 'Фильтр воздушный', spec: 'Оригинальная замена, качество OEM', price: 65000, category: 'Фильтры' },
  { id: 6, sku: '1273', brand: 'Bosch', name: 'Диски тормозные задние, 2 шт', spec: 'Вентилируемые, для регулярной эксплуатации', price: 620000, category: 'Тормозная система' },
  { id: 7, sku: '1305', brand: 'Varta', name: 'Аккумулятор Blue Dynamic 60Ah', spec: 'Пусковой ток 540А, гарантия 2 года', price: 890000, category: 'Аккумуляторы' },
  { id: 8, sku: '1356', brand: 'Bosch', name: 'Свечи накаливания, комплект 4 шт', spec: 'Для дизельных двигателей', price: 145000, category: 'Свечи зажигания' },
  { id: 9, sku: '1402', brand: 'Mann-Filter', name: 'Фильтр салонный угольный', spec: 'Угольный слой, защита от запахов', price: 55000, category: 'Фильтры' },
];

const CATEGORIES = ['Все', ...new Set(PRODUCTS.map(p => p.category))];

let activeCategory = 'Все';
let searchTerm = '';
let cart = []; // { id, qty }

/* ---------- helpers ---------- */
function formatSum(n) {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' сум';
}

function showToast(message, isError = false) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.toggle('error', isError);
  toast.classList.add('show');
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => toast.classList.remove('show'), 2600);
}

/* ---------- category tabs ---------- */
function renderCategoryTabs() {
  const wrap = document.getElementById('category-tabs');
  wrap.innerHTML = '';
  CATEGORIES.forEach(cat => {
    const btn = document.createElement('button');
    btn.className = 'tab-btn' + (cat === activeCategory ? ' active' : '');
    btn.textContent = cat;
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

/* ---------- product grid ---------- */
function renderProducts() {
  const grid = document.getElementById('products-grid');
  const noResults = document.getElementById('no-results');
  const term = searchTerm.trim().toLowerCase();

  const filtered = PRODUCTS.filter(p => {
    const inCategory = activeCategory === 'Все' || p.category === activeCategory;
    const inSearch = !term || p.name.toLowerCase().includes(term) || p.brand.toLowerCase().includes(term);
    return inCategory && inSearch;
  });

  grid.innerHTML = '';
  noResults.hidden = filtered.length !== 0;

  filtered.forEach((p, i) => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.style.animationDelay = (i * 0.04) + 's';
    card.innerHTML = `
      <div class="product-card-top">
        <span class="product-sku">Арт. №${p.sku}</span>
        <span class="product-brand">${p.brand}</span>
      </div>
      <h3>${p.name}</h3>
      <p class="product-spec">${p.spec}</p>
      <div class="product-card-bottom">
        <span class="product-price">${formatSum(p.price)}</span>
        <button class="btn-add" type="button" data-id="${p.id}">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 4h2l2.4 12.4a2 2 0 0 0 2 1.6h7.2a2 2 0 0 0 2-1.6L20 8H6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
          <span>В корзину</span>
        </button>
      </div>
    `;
    grid.appendChild(card);
  });

  grid.querySelectorAll('.btn-add').forEach(btn => {
    btn.addEventListener('click', () => addToCart(Number(btn.dataset.id), btn));
  });
}

/* ---------- cart ---------- */
function addToCart(id, btnEl) {
  const existing = cart.find(i => i.id === id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ id, qty: 1 });
  }
  updateCartUI();

  const product = PRODUCTS.find(p => p.id === id);
  showToast(`Добавлено: ${product.name}`);

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
    itemsWrap.innerHTML = '<p class="receipt-empty" id="receipt-empty">Корзина пуста — выберите детали в <a href="#catalog">каталоге выше</a>.</p>';
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
        <button type="button" data-action="dec" aria-label="Уменьшить количество">−</button>
        <span>${item.qty}</span>
        <button type="button" data-action="inc" aria-label="Увеличить количество">+</button>
      </div>
      <span class="receipt-item-name">${product.name}</span>
      <span class="receipt-leader"></span>
      <span class="receipt-item-price">${formatSum(lineTotal)}</span>
      <button type="button" class="receipt-remove" aria-label="Удалить">×</button>
    `;
    row.querySelector('[data-action="dec"]').addEventListener('click', () => changeQty(item.id, -1));
    row.querySelector('[data-action="inc"]').addEventListener('click', () => changeQty(item.id, 1));
    row.querySelector('.receipt-remove').addEventListener('click', () => removeFromCart(item.id));
    itemsWrap.appendChild(row);
  });

  totalEl.textContent = formatSum(total);
  submitBtn.disabled = false;
}

/* ---------- receipt header (order number / date) ---------- */
function initReceiptHeader() {
  const num = 'AP-' + Math.floor(1000 + Math.random() * 9000);
  document.getElementById('order-number').textContent = num;
  document.getElementById('order-date').textContent = new Date().toLocaleDateString('ru-RU');
}

/* ---------- order submit ---------- */
document.getElementById('order-form').addEventListener('submit', function (e) {
  e.preventDefault();

  if (cart.length === 0) {
    showToast('Добавьте хотя бы одну деталь в корзину', true);
    return;
  }

  const name = document.getElementById('username').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const email = document.getElementById('email').value.trim();

  const submitBtn = document.getElementById('submit-btn');
  const label = submitBtn.querySelector('.btn-label');
  submitBtn.disabled = true;
  submitBtn.classList.add('sending');
  label.textContent = 'Отправка…';

  let message = `🔧 НОВЫЙ ЗАКАЗ AutoParts.uz\n\nИмя: ${name}\nТелефон: ${phone}\n`;
  if (email) message += `Email: ${email}\n`;
  message += `\nТовары:\n`;
  cart.forEach(item => {
    const product = PRODUCTS.find(p => p.id === item.id);
    if (product) message += `• ${product.name} — ${item.qty} шт × ${formatSum(product.price)} = ${formatSum(product.price * item.qty)}\n`;
  });
  const total = cart.reduce((sum, item) => {
    const product = PRODUCTS.find(p => p.id === item.id);
    return sum + (product ? product.price * item.qty : 0);
  }, 0);
  message += `\nИТОГО: ${formatSum(total)}`;

  fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: CHAT_ID, text: message }),
  })
    .then(r => r.json())
    .then(data => {
      if (data.ok) {
        showToast('Заказ отправлен! Мы скоро свяжемся с вами.');
        cart = [];
        updateCartUI();
        e.target.reset();
        initReceiptHeader();
      } else {
        showToast('Ошибка отправки: ' + (data.description || 'попробуйте позже'), true);
      }
    })
    .catch(() => {
      showToast('Не удалось отправить заказ. Проверьте интернет-соединение.', true);
    })
    .finally(() => {
      submitBtn.classList.remove('sending');
      label.textContent = 'Отправить заказ';
      submitBtn.disabled = cart.length === 0;
    });
});

/* ---------- search ---------- */
document.getElementById('search-input').addEventListener('input', e => {
  searchTerm = e.target.value;
  renderProducts();
});

/* ---------- cart pill scroll ---------- */
document.getElementById('cart-pill').addEventListener('click', () => {
  document.getElementById('order').scrollIntoView({ behavior: 'smooth', block: 'start' });
});

/* ---------- init ---------- */
renderCategoryTabs();
renderProducts();
updateCartUI();
initReceiptHeader();
