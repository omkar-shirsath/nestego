const Joi = require('joi');

module.exports.listingSchema = Joi.object({
    Listing: Joi.object({
        title:Joi.string().required(),
        description:Joi.string().required(),
        location:Joi.string().required(),
        price:Joi.number().required().min(0),
        // image:({url:Joi.string().allow("",null)}),
        country:Joi.string().required()
    }).required().unknown(true)


})

module.exports.reviewSchema = Joi.object({
    review:Joi.object({
        ratings:Joi.number().required().min(1).max(5),
        comment:Joi.string().required()
    }).required()
})