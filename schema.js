const Joi = require("joi");

// Schema for creating/updating a listing
module.exports.listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().required().messages({
      'string.empty': 'Title is required.'
    }),
    description: Joi.string().required().messages({
      'string.empty': 'Description is required.'
    }),
    location: Joi.string().required().messages({
      'string.empty': 'Location is required.'
    }),
    country: Joi.string().required().messages({
      'string.empty': 'Country is required.'
    }),
    price: Joi.number().min(0).required().messages({
      'number.base': 'Price must be a number.',
      'number.min': 'Price must be at least 0.',
      'any.required': 'Price is required.'
    }),
    // --- ✨ THIS IS THE NEWLY ADDED FIELD ---
    category: Joi.string().required().messages({
        'string.empty': 'Category is required.'
    })
    // Do NOT validate image here, since it comes from multer (req.file)
  }).required()
});

// Schema for creating a review
module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().min(1).max(5).required().messages({
      'number.base': 'Rating must be a number.',
      'number.min': 'Rating must be at least 1.',
      'number.max': 'Rating cannot exceed 5.',
      'any.required': 'Rating is required.'
    }),
    comment: Joi.string().required().messages({
      'string.empty': 'Comment is required.'
    })
  }).required()
});