// // імпортуємо функцію isValidObjectId
const { isValidObjectId } = require("mongoose");
const { HttpError } = require("../helpers");
// це функція на перевірку валідності самого айді
const isValidId = (req, _, next) => {
    const { contactId } = req.params;
    // передаємо в функцію щось що може бути айді
    // якщо це не тру(не аійді) то викинь помилку 400
    // не валідне айді
  if (!isValidObjectId(contactId)) {
    next(HttpError(400, `${contactId} is not valid id.`));
  }
  next();
};

module.exports = isValidId;