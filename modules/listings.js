const mongoose = require("mongoose");
const Schema = mongoose.Schema;
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
        Set:(v)=> v===""?"https://cdn.pixabay.com/photo/2022/11/27/01/47/boat-7618814_1280.jpg":v,
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

const Listing = mongoose.model("Listing",listingSchema);
module.exports=Listing;