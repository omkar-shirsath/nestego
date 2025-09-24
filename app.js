const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("../Nestago/modules/listings");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./uitil/wrapAsync");
const ExpressError = require("./uitil/ExpressError");
const {listingSchema ,reviewSchema} = require("./schema");
const review = require("./modules/reviews");




const MONGO_URL = "mongodb://127.0.0.1:27017/Nestago";
async function main(){
    await mongoose.connect(MONGO_URL);
}

main()
.then(()=>{
    console.log("database connected");
})
.catch((err)=>{
    console.log(err);
})

const validatelisting = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        
        let errmsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(404, errmsg);
    }
    next();
};

const  validateReview = (req,res,next)=>{
    let {error}= reviewSchema.validate(req.body);
    if(error){
        let errmsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(404,errmsg);
    }
    next();
};
//testing database connectivity
// app.get("/testing",(req,res)=>{
//     let newlisting = Listing({
//         title:"my home",
//         description:"availabel for the rent",
//         price:2400,
//         location:"sinnar",
//         country:"India"
//     });

//     newlisting.save();
//     console.log("testing succesful");
//     res.send("successful test");
// })

//ejs basic set up
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);
app.use(express.static (path.join(__dirname,"public")));

//index rought
app.get("/listings",
    
    async(req,res)=>{
    const allListings = await Listing.find({});
    res.render("Listings/index.ejs",{allListings});
})

//new rought
app.get("/listings/new",(req,res)=>{
    res.render("Listings/new");
})
//show rought
app.get("/listings/:id",wrapAsync(async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs",{listing});
}))

//create rought
app.post("/listings",
     validatelisting,
    wrapAsync(async(req,res,next)=>{
   
    const newListing = new Listing(req.body.Listing);
    await newListing.save();
    res.redirect("/listings");

}))

//update rought 
app.get("/listings/:id/edit",wrapAsync(async (req,res)=>{
    let {id}=req.params;
    const listing = await Listing.findById(id);
    res.render("Listings/edit.ejs",{listing});
}))

app.put("/listings/:id",
     validatelisting,
    wrapAsync(async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.Listing});
    res.redirect(`/listings/${id}`);
}))


//delete rought
app.delete("/listings/:id",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    const deletedListing = await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}));

//reviews
//post rought
app.post("/listings/:id/review",validateReview,wrapAsync(async (req,res)=>{

    let listing = await Listing.findById(req.params.id);
    let newreview = new review(req.body.review);

    listing.reviews.push(newreview);
    await newreview.save();
    await listing.save();
    
    res.redirect(`/listings/${req.params.id}`);
    
}));

app.delete("/listings/:id/reviews/:reviewId",wrapAsync(async(req,res)=>{
    let {id,reviewId} = req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{ reviews:reviewId}});
    await review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
}));

app.all("/{*any}",(req,res,next)=>{
    next(new ExpressError(404,"Page Not Found"));
})

app.use((err,req,res,next)=>{
    let{statusCode=500,message="something went wrong"} = err;
    res.status(statusCode).render("Listings/error.ejs",{message});
})
app.get("/",(req,res)=>{
    res.send("this is root ");
})


app.listen(8080,()=>{
    console.log("Server is runing on port 8080");
})

