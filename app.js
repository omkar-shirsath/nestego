const express = require("express");
const app = express();
const mongoose = require("mongoose");

const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

const ExpressError = require("./util/ExpressError");



const listings = require("./routes/listings");
const reviews = require("./routes/reviews");


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




//ejs basic set up
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);
app.use(express.static (path.join(__dirname,"public")));

app.use("/listings",listings);
app.use("/listings/:id",reviews);

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

