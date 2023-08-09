const express = require('express')

const ctrl = require('../../controllers/contacts');
// тут додаємо валідацію на 400-ту помилку
const { validateBody, isValidId, authenticate  } = require('../../middlewares');
// імпортуємо схеми валідації
const { schemas } = require("../../models");


const router = express.Router()

router.get('/', authenticate, ctrl.listContacts);

router.get('/:contactId', authenticate, isValidId, ctrl.getById);
// там де треба перевірити тіло ми додаєм validateBody і schemas.addSchema
router.post('/', authenticate, validateBody(schemas.addSchema), ctrl.addContact);

router.delete('/:contactId', authenticate, isValidId, ctrl.removeContact);


router.put('/:contactId', authenticate, isValidId, validateBody(schemas.addSchema), ctrl.updateContact);

router.patch(
  "/:contactId/favorite",
  authenticate,
  isValidId,
  validateBody(schemas.updateFavoriteSchema),
  ctrl.updateFavorite
);

module.exports = router
