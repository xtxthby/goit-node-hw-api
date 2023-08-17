const express = require("express");

const ctrl = require("../../controllers/auth");
// імпортуємо аутетифікацію і прописуємо в маршруті який нам необхідно
const { validateBody, authenticate, upload } = require("../../middlewares");

const { userSchemas } = require("../../models");
// створюємо router обєкт
const router = express.Router();
// signup маршрут на регістрацію
router.post("/register", validateBody(userSchemas.registerSchema), ctrl.register);
// signin
router.post("/login", validateBody(userSchemas.loginSchema), ctrl.login);
// запит який видаляє токен
router.post("/logout", authenticate, ctrl.logout);
// при get запиті ми перевіряємо чи людина залогінена якщо да 
// getCurrent відішле імеіл та імя
router.get("/current", authenticate, ctrl.getCurrent);
// після регістрації створюємо роутер  с гет запросом де остання 
// частина дінамічна де зберігається веріфікейшинтокін
router.get("/verify/:verificationToken", ctrl.verifyEmail);
// це окремий маршрут для повторного запиту якщо не прийшов лист з підтведженням
// там буде тільки поле з імейлом де ми далі проводимо валідацію імейла
// якщо все добре викликаємо контролер
router.post(
  "/verify",
  validateBody(userSchemas.emailSchema),
  ctrl.resendVerifyEmail
);
router.patch(
  "/",
  authenticate,
  validateBody(userSchemas.updSubscriptionSchema),
  ctrl.updateSubscription
);
// тут ми даємо можливість людині змінити аватарку яка залогінелась (authenticate)
// це буде єдине поле з файлом аватар і обробимо контролером
router.patch("/avatars", authenticate, upload.single("avatar"), ctrl.updAvatar);

module.exports = router;


// QQYiZWNQJgIizYUq