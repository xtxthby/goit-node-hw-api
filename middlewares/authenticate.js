// міделвара ідентифікації
const jwt = require("jsonwebtoken");

const { HttpError } = require("../helpers");
// імпортуємо модель юзер для перевірки чи є людина в базі
const { User } = require("../models");
// зі змінних оточення забираємо ключ
const { SECRET_KEY } = process.env;

const authenticate = async (req, _, next) => {
    // дістаємо заголовок із хедера
    const { authorization = "" } = req.headers;
    // Розділяємо  authorization на два слова по пробілу
    const [bearer, token] = authorization.split(" ");
    // перша перевірка на наявність слова Bearer
    // в даному випадку перериває next функцію
    if (bearer !== "Bearer" || !token) next(HttpError(401));
    // перевіряємо токін за допомогою бібліотеки jsonwebtoken
    try {
        // якщо токен валідний нам повертається пейлоад 
        // з якого ми беремо айді
        const { id } = jwt.verify(token, SECRET_KEY);
        // перевіряємо чи є людина взагалі в базі по айді
        const user = await User.findById(id);
        if (!user || !user.token || user.token !== token) next(HttpError(401));
        // до обєкту req додаємо ключ user який дорівнює користувачу
        req.user = user;
        // якщо людина є то викликаємо next()- іди далі
        next();
    } catch {
        next(HttpError(401));
    }
};

module.exports = authenticate;