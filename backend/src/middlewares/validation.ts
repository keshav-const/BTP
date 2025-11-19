import Joi from 'joi';

export const validateRequest = (schema: Joi.ObjectSchema) => {
  return (req: any, res: any, next: any) => {
    const { error } = schema.validate(req.body);
    
    if (error) {
      const errorMessage = error.details.map(detail => detail.message).join(', ');
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        error: errorMessage,
      });
    }
    
    next();
  };
};

export const validateQuery = (schema: Joi.ObjectSchema) => {
  return (req: any, res: any, next: any) => {
    const { error } = schema.validate(req.query);
    
    if (error) {
      const errorMessage = error.details.map(detail => detail.message).join(', ');
      return res.status(400).json({
        success: false,
        message: 'Query Validation Error',
        error: errorMessage,
      });
    }
    
    next();
  };
};

// Common validation schemas
export const schemas = {
  signup: Joi.object({
    firstName: Joi.string().trim().min(2).max(50).required(),
    lastName: Joi.string().trim().min(2).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid('user', 'admin').optional(),
  }),

  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),

  product: Joi.object({
    name: Joi.string().trim().min(1).max(100).required(),
    description: Joi.string().min(1).max(2000).required(),
    price: Joi.number().min(0).required(),
    category: Joi.string().trim().required(),
    brand: Joi.string().trim().required(),
    stock: Joi.number().integer().min(0).required(),
    images: Joi.array().items(Joi.string().uri()).optional(),
    isActive: Joi.boolean().optional(),
  }),

  order: Joi.object({
    items: Joi.array().items(
      Joi.object({
        product: Joi.string().required(),
        quantity: Joi.number().integer().min(1).required(),
        price: Joi.number().min(0).required(),
      })
    ).min(1).required(),
    shippingAddress: Joi.object({
      street: Joi.string().required(),
      city: Joi.string().required(),
      state: Joi.string().required(),
      zipCode: Joi.string().required(),
      country: Joi.string().required(),
    }).required(),
    paymentMethod: Joi.string().required(),
  }),

  pagination: Joi.object({
    page: Joi.number().integer().min(1).optional(),
    limit: Joi.number().integer().min(1).max(100).optional(),
    sort: Joi.string().optional(),
    order: Joi.string().valid('asc', 'desc').optional(),
    status: Joi.string().optional(),
  }),

  productFilters: Joi.object({
    category: Joi.string().optional(),
    brand: Joi.string().optional(),
    minPrice: Joi.number().min(0).optional(),
    maxPrice: Joi.number().min(0).optional(),
    search: Joi.string().optional(),
    isActive: Joi.boolean().optional(),
  }).concat(Joi.object({
    page: Joi.number().integer().min(1).optional(),
    limit: Joi.number().integer().min(1).max(100).optional(),
    sort: Joi.string().optional(),
    order: Joi.string().valid('asc', 'desc').optional(),
  })),

  wishlistAdd: Joi.object({
    productId: Joi.string().required(),
  }),

  cartAdd: Joi.object({
    productId: Joi.string().required(),
    qty: Joi.number().integer().min(1).default(1),
  }),

  cartUpdate: Joi.object({
    qty: Joi.number().integer().min(1).required(),
  }),

  address: Joi.object({
    label: Joi.string().allow('', null).optional(),
    fullName: Joi.string().min(2).max(100).required(),
    phone: Joi.string().allow('', null).optional(),
    street: Joi.string().min(2).max(100).required(),
    city: Joi.string().min(2).max(60).required(),
    state: Joi.string().min(2).max(60).required(),
    zipCode: Joi.string().min(2).max(20).required(),
    country: Joi.string().min(2).max(60).required(),
    isDefault: Joi.alternatives().try(
      Joi.boolean(),
      Joi.string().valid('true', 'false', '1', '0')
    ).optional(),
  }),

  addressUpdate: Joi.object({
    label: Joi.string().allow('', null).optional(),
    fullName: Joi.string().min(2).max(100).optional(),
    phone: Joi.string().allow('', null).optional(),
    street: Joi.string().min(2).max(100).optional(),
    city: Joi.string().min(2).max(60).optional(),
    state: Joi.string().min(2).max(60).optional(),
    zipCode: Joi.string().min(2).max(20).optional(),
    country: Joi.string().min(2).max(60).optional(),
    isDefault: Joi.alternatives().try(
      Joi.boolean(),
      Joi.string().valid('true', 'false', '1', '0')
    ).optional(),
  }).min(1),

  profileUpdate: Joi.object({
    firstName: Joi.string().trim().min(2).max(50).optional(),
    lastName: Joi.string().trim().min(2).max(50).optional(),
    phoneNumber: Joi.string().allow('', null).optional(),
  }).min(1),

  checkout: Joi.object({
    items: Joi.array().items(
      Joi.object({
        productId: Joi.string().required(),
        quantity: Joi.number().integer().min(1).required(),
      })
    ).min(1).required(),
    shippingAddress: Joi.object({
      fullName: Joi.string().required(),
      email: Joi.string().email().required(),
      phone: Joi.string().required(),
      street: Joi.string().required(),
      city: Joi.string().required(),
      state: Joi.string().required(),
      zipCode: Joi.string().required(),
      country: Joi.string().required(),
    }).required(),
    billingAddress: Joi.object({
      fullName: Joi.string().required(),
      email: Joi.string().email().required(),
      phone: Joi.string().required(),
      street: Joi.string().required(),
      city: Joi.string().required(),
      state: Joi.string().required(),
      zipCode: Joi.string().required(),
      country: Joi.string().required(),
    }).required(),
    paymentMethod: Joi.string().valid('razorpay', 'card', 'cod').required(),
    cardDetails: Joi.object({
      cardholderName: Joi.string().optional(),
      cardNumber: Joi.string().optional(),
      expiryDate: Joi.string().optional(),
      cvv: Joi.string().optional(),
    }).optional(),
  }),

  payment: Joi.object({
    orderId: Joi.string().required(),
    cardDetails: Joi.object({
      cardholderName: Joi.string().required(),
      cardNumber: Joi.string().min(13).max(19).required(),
      expiryDate: Joi.string().pattern(/^(0[1-9]|1[0-2])\/\d{2}$/).required(),
      cvv: Joi.string().min(3).max(4).required(),
    }).required(),
  }),
};