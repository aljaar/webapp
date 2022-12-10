import joi from 'joi';

const phoneValidation = /^(^\+62|62|^08)(\d{3,4}-?){2}\d{3,4}$/;

export const signUp = (data) => {
  const schema = joi.object({
    full_name: joi.string().required(),
    email: joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
    password: joi.string().min(8).alphanum().required(),
    repeat_password: joi.ref('password'),
    phone: joi.string().regex(phoneValidation).required(),
  });

  return schema.validate(data);
};

export const product = (data) => {
  const schema = joi.object().keys({
    title: joi.string().min(8).label('Title').required(),
    description: joi.string().label('Description').required(),
    category: joi.string().valid('food', 'non-food').label('Category').required(),
    qty: joi.number().label('QTY').required(),
    tags: joi.array().items(joi.number()).min(1).label('Tags')
      .required(),
    drop_point: joi.array().items(joi.number().label('Titik Lokasi Penjemputan')).label('Titik Lokasi Penjemputan').required(),
    drop_time: joi.array().items(joi.string().label('Waktu Ambil')).label('Waktu Ambil').required(),
    images: joi.array().items(joi.string()).min(1).label('Images')
      .required(),
    used_since: joi.when('category', {
      is: joi.string().valid('non-food').required(),
      then: joi.string().label('Used Since').required(),
    }),
    expired_at: joi.when('category', {
      is: joi.string().valid('food').required(),
      then: joi.date().iso().label('Expired Date').required(),
    }),
  });

  return schema.validate(data);
};

export const editProduct = (data) => {
  const schema = joi.object().keys({
    title: joi.string().min(8).label('Title').optional(),
    description: joi.string().label('Description').optional(),
    category: joi.string().valid('food', 'non-food').label('Category').optional(),
    qty: joi.number().label('QTY').optional(),
    tags: joi.array().items(joi.number()).label('Tags').optional(),
    images: joi.array().items(joi.string()).label('Images').optional(),
    used_since: joi.when('category', {
      is: joi.string().valid('non-food').required(),
      then: joi.string().label('Used Since').optional(),
    }),
    drop_time: joi.array().items(joi.string().label('Waktu Ambil')).label('Waktu Ambil').required(),
    expired_at: joi.when('category', {
      is: joi.string().valid('food').required(),
      then: joi.date().iso().label('Expired Date').optional(),
    }),
  });

  return schema.validate(data);
};
