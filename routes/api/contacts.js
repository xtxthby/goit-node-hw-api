const express = require('express')

const ctrl = require('../../controllers/contacts');
// тут додаємо валідацію на 400-ту помилку
const { validateBody } = require('../../middlewares/validateBody');
// імпортуємо схеми валідації
const { addSchema } = require('../../schemas/contacts');

const router = express.Router()

router.get('/', ctrl.listContacts);

router.get('/:contactId', ctrl.getById);
// там де треба перевірити тіло ми додаєм validateBody і schemas.addSchema
router.post('/', validateBody(addSchema), ctrl.addContact);

router.delete('/:contactId', ctrl.removeContact);

router.put('/:contactId', validateBody(addSchema), ctrl.updateContact);

module.exports = router
