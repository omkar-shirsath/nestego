const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./reviews");
const listingSchema = new Schema({
    title:{
        type:String,
        required:true
    },
    description:String,
    image:{
        
        url:{
        type:String,
        default:"https://cdn.pixabay.com/photo/2022/11/27/01/47/boat-7618814_1280.jpg",
        set :(v)=> v===""?"https://cdn.pixabay.com/photo/2022/11/27/01/47/boat-7618814_1280.jpg":v,
        }
    },
    price:Number,
    location:String,
    country:String,
    reviews :[{

    
            type : Schema.Types.ObjectId,
            ref:"review"
    }]
    

    

});

listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await Review.deleteMany({_id:{$in:listing.reviews}});
    };
    
});

const Listing = mongoose.model("Listing",listingSchema);
module.exports=Listing;