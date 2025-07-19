const mongoose=require("mongoose");
const initdata=require("./data.js");
const MONGO_URL="mongodb://127.0.0.1:27017/wonderlust";
const listing=require("../Models/listing.js")

main()
.then(()=>{console.log("ok")

})
.catch((err)=>{console.log(err)});
async function main(){
    await mongoose.connect(MONGO_URL);
}
const initdb=async()=>{
         await listing.deleteMany({});
        initdata.data= initdata.data.map((obj)=>({...obj,owner:"686c7571be0f2e419db79c31"}))
         await listing.insertMany(initdata.data);
         console.log("fill")
}
initdb();