const BOT_TOKEN = '8757607697:AAEazhbC-8JcC2J6VdP-YGPIm-rsBAzXAnU';
const CHAT_ID = '-5428602025';
let cart = [];

function addToCart(id, name, price) {
    const item = cart.find(i => i.id === id);
    if (item) item.quantity++;
    else cart.push({ id, name, price, quantity: 1 });
    updateCartUI();
}

function updateCartUI() {
    const list = document.getElementById('cart-items');
    const count = document.getElementById('cart-count');
    const totalEl = document.getElementById('cart-total');
    list.innerHTML = '';
    let total = 0;
    cart.forEach(i => {
        total += i.price * i.quantity;
        list.innerHTML += `<li>${i.name} x${i.quantity}</li>`;
    });
    count.textContent = cart.reduce((sum, i) => sum + i.quantity, 0);
    totalEl.textContent = total.toLocaleString();
}

document.getElementById('order-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('username').value;
    const phone = document.getElementById('phone').value;
    const email = document.getElementById('email').value;

    let itemsText = cart.map(i => `${i.name} x${i.quantity}`).join('\n');
    let message = `ЗАКАЗ С САЙТА\n\nИмя: ${name}\nТелефон: ${phone}\nEmail: ${email}\n\nТовары:\n${itemsText}\n\nИтого: ${document.getElementById('cart-total').textContent} сум`;

    fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: CHAT_ID, text: message })
    })
    .then(r => r.json())
    .then(data => {
        if (data.ok) {
            alert('Заказ успешно отправлен!');
            cart = [];
            updateCartUI();
            e.target.reset();
        } else {
            alert('Ошибка: ' + data.description);
        }
    });
});