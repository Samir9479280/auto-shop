<?php
// Разрешаем фронтенду с GitHub отправлять запросы на наш PHP-сервер
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Если это просто проверка связи, отключаемся
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Получаем данные от фронтенда
$inputData = file_get_contents('php://input');
$data = json_decode($inputData, true);

// Проверяем, что нам прислали имя и телефон
if (empty($data['name']) || empty($data['phone'])) {
    echo json_encode(["status" => "error", "message" => "Заполните обязательные поля!"]);
    exit;
}

$name = htmlspecialchars($data['name']);
$phone = htmlspecialchars($data['phone']);
$email = !empty($data['email']) ? htmlspecialchars($data['email']) : 'Не указан';
$cart = !empty($data['cart']) ? $data['cart'] : 'Корзина пуста';

// ТВОИ НАСТРОЙКИ ТЕЛЕГРАМ (Замени на свои данные)
$botToken = "8757607697:AAEazhbC-8JcC2J6VdP-YGPIm-rsBAzXAnU"; 
const CHAT_ID = '-1004436689296';

// Формируем красивый текст сообщения для бизнеса
$message = "📦 **Новый заказ автозапчастей!**\n\n";
$message .= "👤 **Имя:** $name\n";
$message .= "📞 **Телефон:** $phone\n";
$message .= "📧 **Email:** $email\n\n";
$message .= "🛒 **Заказ:**\n$cart";

// Отправляем запрос в API Telegram через функцию file_get_contents
$url = "https://api.telegram.org/bot" . $botToken . "/sendMessage";
$postData = [
    'chat_id' => $chatId,
    'text' => $message,
    'parse_mode' => 'Markdown'
];

$options = [
    'http' => [
        'header'  => "Content-type: application/x-www-form-urlencoded\r\n",
        'method'  => 'POST',
        'content' => http_build_query($postData),
    ],
];

$context  = stream_context_create($options);
$result = file_get_contents($url, false, $context);

// Отвечаем фронтенду, что всё прошло успешно
if ($result !== FALSE) {
    echo json_encode(["status" => "success", "message" => "Заказ успешно отправлен!"]);
} else {
    echo json_encode(["status" => "error", "message" => "Ошибка при отправке в Telegram."]);
}
?>