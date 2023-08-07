const express = require("express");

const ctrl = require("../../controllers/auth");
// імпортуємо аутетифікацію і прописуємо в маршруті який нам необхідно
const { validateBody, authenticate } = require("../../middlewares");

const { userSchemas } = require("../../models");

const router = express.Router();
// signup
router.post("/register", validateBody(userSchemas.registerSchema), ctrl.register);
// signin
router.post("/login", validateBody(userSchemas.loginSchema), ctrl.login);
// запит який видаляє токен
router.post("/logout", authenticate, ctrl.logout);
// при get запиті ми перевіряємо чи людина залогінена якщо да 
// getCurrent відішле імеіл та імя
router.get("/current", authenticate, ctrl.getCurrent);

router.patch(
  "/",
  authenticate,
  validateBody(userSchemas.updSubscriptionSchema),
  ctrl.updateSubscription
);

module.exports = router;