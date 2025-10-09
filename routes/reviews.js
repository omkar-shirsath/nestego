const express = require("express");
const router = express.Router({mergeParams:true});
const {reviewSchema} = require("../schema");
const wrapAsync = require("../util/wrapAsync");
const ExpressError = require("../util/ExpressError");
const Listing = require("../modules/listings");
const review = require("../modules/reviews");

const  validateReview = (req,res,next)=>{
    let {error}= reviewSchema.validate(req.body);
    if(error){
        let errmsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(404,errmsg);
    }
    next();
};


//post rought
router.post("/review",validateReview,wrapAsync(async (req,res)=>{
    
    let listing = await Listing.findById(req.params.id);
    let newreview = new review(req.body.review);

    listing.reviews.push(newreview);
    await newreview.save();
    await listing.save();
    
    res.redirect(`/listings/${req.params.id}`);
    
}));

router.delete("/reviews/:reviewId",wrapAsync(async(req,res)=>{
    let {id,reviewId} = req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{ reviews:reviewId}});
    await review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
}));

module.exports = router;