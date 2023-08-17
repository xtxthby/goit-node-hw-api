// тут ми зберігаємо колекцію користувачів
const { Schema, model } = require("mongoose");
const Joi = require("joi");

const { handleMongooseError } = require("../helpers");

const EMAIL_REGEX =
  /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

const PASS_REGEX = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
const SUBSCRIPTIONS = ["starter", "pro", "business"];
// створюємо схему для юзерів
const userSchema = new Schema(
  {
    email: {
          type: String,
        // тут регулярний вираз для електронної почти
        match: EMAIL_REGEX,
        required: [true, "Email is required"],
        // монгуст має перевірити чи немає обєкта 
        // з таким самим імейлом
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Set password for user"],
        },
    // оновлення
    subscription: {
      type: String,
      // приймає масив
        enum: {
          values: [...SUBSCRIPTIONS],
          message: `have only ${SUBSCRIPTIONS.join(", ")}`,
        },

        default: "starter",
    },
    avatarURL: String,
    // щоб зберегти токін  додаєм його сюди
    token: String,
    // це поле відповідає за підтвердження імейлу
    verify: {
      type: Boolean,
      default: false,
    },
    // це код підтвердження
    verificationToken: {
      type: String,
      required: [true, "Verify token is required"],
    },
  },
  { versionKey: false, timestamps: true }
);
// якщо валідація не пройдена - буде викидати помилку
userSchema.post("save", handleMongooseError);
const User = model("user", userSchema);
// Joi схема на регістрацію
const registerSchema = Joi.object({
  email: Joi.string().pattern(EMAIL_REGEX).required().messages({
    "string.pattern.base":
      "Email may contain letters, numbers, an apostrophe, and must be followed by '@' domain name '.' domain suffix. For example Taras@ukr.ua, adrian@gmail.com, JacobM3rcer@hotmail.com",
  }),
  password: Joi.string().pattern(PASS_REGEX).required().messages({
    "string.pattern.base":
      "Password must contain at least one number and one uppercase and lowercase letter, and at least 6 or more characters. For example TgeV23592, 3Greioct.",
  }),
  subscription: Joi.string(),
});
// Joі схема на авторизацію (логін)
const loginSchema = Joi.object({
  email: Joi.string().pattern(EMAIL_REGEX).required().messages({
    "string.pattern.base":
      "Email may contain letters, numbers, an apostrophe, and must be followed by '@' domain name '.' domain suffix. For example Taras@ukr.ua, adrian@gmail.com, JacobM3rcer@hotmail.com",
  }),
  password: Joi.string().pattern(PASS_REGEX).required().messages({
    "string.pattern.base":
      "Password must contain at least one number and one uppercase and lowercase letter, and at least 6 or more characters. For example TgeV23592, 3Greioct.",
  }),
});

const updSubscriptionSchema = Joi.object({
  subscription: Joi.string().required(),
});
// схема підтвердження імейлу
const emailSchema = Joi.object({
  email: Joi.string().pattern(EMAIL_REGEX).required().messages({
    "string.pattern.base":
      "Email may contain letters, numbers, an apostrophe, and must be followed by '@' domain name '.' domain suffix. For example Taras@ukr.ua, adrian@gmail.com, JacobM3rcer@hotmail.com",
  }),
});

const userSchemas = {
  registerSchema,
  loginSchema,
  updSubscriptionSchema,
  emailSchema,
};

module.exports = { User, userSchemas };