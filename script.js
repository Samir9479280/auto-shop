// Переменная, где будут храниться товары в корзине
let cart = [];

// 1. Функция добавления товара в корзину
function addToCart(productName, productPrice) {
    // Добавляем товар как объект в наш массив
    cart.push({ name: productName, price: productPrice });
    
    // Обновляем отображение корзины на экране
    updateCartUI();
}

// 2. Функция, которая перерисовывает корзину на сайте
function updateCartUI() {
    const cartCountElement = document.getElementById('cart-count');
    const cartItemsElement = document.getElementById('cart-items');
    
    // Обновляем цифру количества в шапке
    cartCountElement.innerText = cart.length;
    
    // Очищаем старый список товаров в форме оформления
    cartItemsElement.innerHTML = '';
    
    if (cart.length === 0) {
        cartItemsElement.innerHTML = '<li class="empty-text">Корзина пока пуста. Выберите товары выше.</li>';
        return;
    }
    
    // Перебираем товары из массива и добавляем их в список списком
    cart.forEach((item, index) => {
        const li = document.createElement('li');
        li.innerHTML = `${item.name} — <strong>${item.price}</strong>`;
        cartItemsElement.appendChild(li);
    });
}

// 3. Перехватываем отправку формы заказа
document.getElementById('order-form').addEventListener('submit', function(event) {
    // Отменяем стандартную перезагрузку страницы при отправке формы
    event.preventDefault();
    
    // Проверяем, не пуста ли корзина
    if (cart.length === 0) {
        alert('Пожалуйста, добавьте хотя бы один товар в корзину перед отправкой!');
        return;
    }
    
    // Собираем данные из полей ввода
    const name = document.getElementById('username').value;
    const phone = document.getElementById('userphone').value;
    const email = document.getElementById('useremail').value;
    
    // Превращаем массив товаров корзины в красивый текст для Телеграма
    let cartText = "";
    cart.forEach((item, index) => {
        cartText += `${index + 1}. ${item.name} (${item.price})\n`;
    });
    
    // Упаковываем всё в один объект для отправки бэкенду
    const orderData = {
        name: name,
        phone: phone,
        email: email,
        cart: cartText
    };
    
    // Кнопка отправки (чтобы клиент не кликал много раз, пока идет запрос)
    const submitBtn = document.getElementById('submit-btn');
    submitBtn.innerText = "Отправка...";
    submitBtn.disabled = true;

    // ВАЖНО: Сюда мы потом вставим реальную ссылку на твой бесплатный PHP-сервер
    const backendUrl = 'https://autoparts-api.xo.je/send_order.php';
    
    // Отправляем данные на PHP-бэкенд
    fetch(backendUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            alert('🔥 Заказ успешно отправлен! Менеджер свяжется с вами в ближайшее время.');
            // Очищаем форму и корзину после успешного заказа
            cart = [];
            updateCartUI();
            document.getElementById('order-form').reset();
        } else {
            alert('Ошибка: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Ошибка:', error);
        // Пока бэкенд не запущен, fetch будет падать в ошибку. 
        // Чтобы ты мог потестить фронтенд прямо сейчас, выведем данные в консоль:
        alert('Фронтенд сработал! Данные собраны. (Ошибка связи нормальна, так как PHP-бэкенд еще не запущен)');
        console.log('Данные, которые готовы к отправке:', orderData);
    })
    .finally(() => {
        // Возвращаем кнопку в исходное состояние
        submitBtn.innerText = "Отправить заказ";
        submitBtn.disabled = false;
    });
});