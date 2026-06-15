const BOT_TOKEN = '8757607697:AAEazhbC-8JcC2J6VdP-YGPIm-rsBAzXAnU';
const CHAT_ID = '-5428602025'; // Убедись, что это верный ID группы с минусом
let cart = [];

// Функция добавления товара
function addToCart(id, name, price) {
    cart.push({ id, name, price });
    updateCartUI();
}

// Обновление корзины
function updateCartUI() {
    const list = document.getElementById('cart-items');
    const totalEl = document.getElementById('cart-total');
    if (!list) return;
    
    list.innerHTML = '';
    let total = 0;
    cart.forEach(i => {
        total += i.price;
        list.innerHTML += `<li>${i.name} — ${i.price} сум</li>`;
    });
    if (totalEl) totalEl.textContent = total;
}

// Отправка заказа
document.getElementById('order-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('username').value;
    const phone = document.getElementById('phone').value;
    
    let message = `НОВЫЙ ЗАКАЗ:\nИмя: ${name}\nТелефон: ${phone}\nТовары:\n`;
    cart.forEach(i => message += `${i.name} (${i.price} сум)\n`);

    fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: CHAT_ID, text: message })
    })
    .then(r => r.json())
    .then(data => {
        if (data.ok) {
            alert('Заказ отправлен!');
            cart = [];
            updateCartUI();
            e.target.reset();
        } else {
            alert('Ошибка: ' + data.description);
        }
    });
});