const mongoose = require("mongoose");
const initdata = require("./data");
const Listing = require("../modules/listings");

const Mongodb_url = "mongodb://127.0.0.1:27017/Nestago";
async function main(){
    await mongoose.connect(Mongodb_url);
}

main()
.then(()=>{
    console.log("Database connected");
})
.catch((err)=>{
    console.log(err);
})

const init = async ()=>{
    await Listing.deleteMany({});
    await Listing.insertMany(initdata.data);
    console.log("database initialized");
}

init();