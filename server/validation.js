const Joi = require("joi");

const registerValidation = (data) => {
  const Schema = {
    name: Joi.string().required(),
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(8).required(),
  };
  return Joi.validate(data, Schema, { abortEarly: false });
};

const LoginValidation = (data) => {
  const Schema = {
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(8).required(),
  };
  return Joi.validate(data, Schema);
};
const dealValidation = (data) => {
  const Schema = {
    dealName: Joi.string().min(4).required(),
    dealAmount: Joi.string()
      .min(1)
      .regex(/^[0-9]+$/),
    dealStage: Joi.string().required(),
    rate: Joi.number(),
  };
  return Joi.validate(data, Schema, { allowUnknown: true });
};

module.exports.registerValidation = registerValidation;
module.exports.LoginValidation = LoginValidation;
module.exports.dealValidation = dealValidation;
