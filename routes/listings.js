const express = require("express");
const router = express.Router();

const Listing = require("../modules/listings");
const {listingSchema } = require("../schema");
const wrapAsync = require("../util/wrapAsync");
const ExpressError = require("../util/ExpressError");

const validatelisting = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        
        let errmsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(404, errmsg);
    }
    next();
};

//index rought
router.get("/",
    
    async(req,res)=>{
    const allListings = await Listing.find({});
    res.render("Listings/index.ejs",{allListings});
})

//new rought
router.get("/new",(req,res)=>{
    res.render("Listings/new");
})
//show rought
router.get("/:id",wrapAsync(async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs",{listing});
}))

//create rought
router.post("/",
     validatelisting,
    wrapAsync(async(req,res,next)=>{
   
    const newListing = new Listing(req.body.Listing);
    await newListing.save();
    res.redirect("/listings");

}))

//update rought 
router.get("/:id/edit",wrapAsync(async (req,res)=>{
    let {id}=req.params;
    const listing = await Listing.findById(id);
    res.render("Listings/edit.ejs",{listing});
}))

router.put("/:id",
     validatelisting,
    wrapAsync(async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.Listing});
    res.redirect(`/listings/${id}`);
}))


//delete rought
router.delete("/:id",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    const deletedListing = await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}));


module.exports =  router;