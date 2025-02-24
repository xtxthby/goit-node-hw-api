// витягуэмо  з монгуста схему і модель
// mongoose перевіряє те що ми зберігаємо в базі
const { Schema, model } = require("mongoose");
// Joi перевіряє тіло запиту - те що нам приходить
const Joi = require("joi");
// додаємо додаткову функцію помилки 400
const { handleMongooseError } = require("../helpers");

const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Set name for contact"],
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
    // owner - це власник або людина яка додала контакт
    // і кожен користувач бачить тільки свої контакти
    owner: {
      // щоб вказати айді треба за допомогою монгодб
      // генерувати його і зробити таку запис
      type: Schema.Types.ObjectId,
      // тут записують властивість ref в яку записують назву
      // з якої колекції це айді
      ref: "user",
    },
  },
  // це для БД , перше - опис обєкту _v
  // друге -опис налаштування- дата створення і дата оновлення
  { versionKey: false, timestamps: true }
);
// коли при збереженні сталася помилка нехай спрацює
// ось ця міделвара handleMongooseError
contactSchema.post("save", handleMongooseError);
// створюємо модель де перший єлемент це назва колекції
// другиий аргумент це схема
const Contact = model("contact", contactSchema);

const addSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string(),
  phone: Joi.string(),
  favorite: Joi.boolean(),
});
// це схема для окремого запиту на зміну поля
const updateFavoriteSchema = Joi.object({
  // це одне поле але тепер обовязкове
  favorite: Joi.boolean().required(),
});

const schemas = {
  addSchema,
  updateFavoriteSchema,
};

module.exports = { Contact, schemas };


