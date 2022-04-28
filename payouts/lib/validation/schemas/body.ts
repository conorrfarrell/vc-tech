import Joi from 'joi';

const bodySchema = Joi.object({
  soldItems: Joi.array().items(
    Joi.number()
  )
});

export default bodySchema;
