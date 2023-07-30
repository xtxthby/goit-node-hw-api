const express = require('express')
// імпортуємо обєкт який відповідає за роботу с джейсон запитами 
const contacts = require("../../models/contacts")
// створюємо частинку проекту яка відповідає за контакти
const router = express.Router()
// тут додаємо валідацію на 400-ту помилку
const { validateBody } = require('../../middlewares/validateBody');
// імпортуємо схеми валідації
const { addSchema } = require('../../schemas/contacts');

router.get('/', ctrl.listContacts);

router.get('/:contactId', ctrl.getById);

router.post('/', validateBody(addSchema), ctrl.addContact);

router.delete('/:contactId', ctrl.removeContact);

router.put('/:contactId', validateBody(addSchema), ctrl.updateContact);

module.exports = router
