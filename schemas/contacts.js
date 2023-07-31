// папка схеми валідації
const Joi = require('joi');

const addSchemaPost = Joi.object({
  name: Joi.string().min(3).required(),
  email: Joi.string().required(),
  phone: Joi.string().min(6).required(),
});
const addSchemaPut = Joi.object({
  name: Joi.string().min(3),
  email: Joi.string(),
  phone: Joi.string().min(6),
});

module.exports = { addSchemaPost, addSchemaPut };
