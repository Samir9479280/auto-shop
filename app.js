// НАСТРОЙКИ ТЕЛЕГРАМА (Вставь свои данные сюда)
const BOT_TOKEN = '8757607697:AAEazhbC-8JcC2J6VdP-YGPIm-rsBAzXAnU';
const CHAT_ID = '-5428602025';

// Массив для хранения товаров в корзине
let cart = [];

// Функция добавления товара в корзину
function addToCart(productId, productName, productPrice) {
    // Проверяем, есть ли уже такой товар в корзине
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: productId,
            name: productName,
            price: productPrice,
            quantity: 1
        });
    }
    
    updateCartUI();
}

// Обновление отображения корзины на странице
function updateCartUI() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartCount = document.getElementById('cart-count');
    const cartTotal = document.getElementById('cart-total');
    
    if(!cartItemsContainer) return;

    cartItemsContainer.innerHTML = '';
    let total = 0;
    let totalItems = 0;

    cart.forEach(item => {
        total += item.price * item.quantity;
        totalItems += item.quantity;

        const li = document.createElement('li');
        li.textContent = `${item.name} x${item.quantity} — ${(item.price * item.quantity).toLocaleString()} сум`;
        cartItemsContainer.appendChild(li);
    });

    if(cartCount) cartCount.textContent = totalItems;
    if(cartTotal) cartTotal.textContent = total.toLocaleString();
}

// Функция отправки заказа напрямую в Telegram
function sendOrder(event) {
    event.preventDefault(); // Защита от перезагрузки страницы

    if (cart.length === 0) {
        alert('Ваша корзина пуста!');
        return;
    }

    const name = document.getElementById('username').value;
    const phone = document.getElementById('phone').value;
    const email = document.getElementById('email').value || 'Не указан';

    // Формируем список товаров для текста сообщения
    let cartText = '';
    let totalSum = 0;
    cart.forEach((item, index) => {
        cartText += `${index + 1}. ${item.name} (x${item.quantity}) — ${(item.price * item.quantity).toLocaleString()} сум\n`;
        totalSum += item.price * item.quantity;
    });

    // Красиво оформляем текст для Телеграма
    const message = `🚗 **НОВЫЙ ЗАКАЗ НА САЙТЕ** 🚗\n\n` +
                    `👤 **Имя:** ${name}\n` +
                    `📞 **Телефон:** ${phone}\n` +
                    `📧 **Email:** ${email}\n\n` +
                    `📦 **Товары:**\n${cartText}\n` +
                    `💰 **Итого к оплате:** ${totalSum.toLocaleString()} сум`;

    // Кнопка переходит в режим отправки
    const submitBtn = document.querySelector('.submit-btn');
    if(submitBtn) {
        submitBtn.textContent = 'ОТПРАВКА...';
        submitBtn.disabled = true;
    }

    // Делаем прямой запрос к серверам Telegram
    fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            chat_id: CHAT_ID,
            text: message,
            parse_mode: 'Markdown'
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.ok) {
            alert('🔥 Заказ успешно принят! Менеджер свяжется с вами.');
            cart = []; // Очищаем корзину
            updateCartUI();
            document.querySelector('form').reset(); // Сбрасываем форму
        } else {
            alert('Ошибка при отправке: ' + data.description);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Произошла ошибка сети. Проверьте подключение.');
    })
    .finally(() => {
        if(submitBtn) {
            submitBtn.textContent = 'ОТПРАВИТЬ ЗАКАЗ';
            submitBtn.disabled = false;
        }
    });
}

// Привязываем событие отправки к форме, когда страница загрузилась
document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    if(form) {
        form.addEventListener('submit', sendOrder);
    }
});