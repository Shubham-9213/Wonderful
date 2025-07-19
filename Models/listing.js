const mongoose=require("mongoose");
const schema=mongoose.Schema;
const Review=require("./review.js");
const { required } = require("joi");
const listingSchema=new schema(
    {
        title:{
            type:String,
        },
        description:{
            type:String,
    },
   image: {
  filename: {
    type: String,
    default: "listingimage"
  },
  url: {
    type: String,
    default:
      "https://images.unsplash.com/photo-1625505826533-5c80aca7d157?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGdvYXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
    set: (v) =>
      v === ""
        ? "https://images.unsplash.com/photo-1625505826533-5c80aca7d157?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGdvYXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60"
        : v,
  }
},
    price:{
        type:Number,
},
location:{
    type:String,
},
country:{
    type:String,
},
review:[{
  type:schema.Types.ObjectId,
  ref:"Review"
}
],
owner:{
  type:schema.Types.ObjectId,
  ref:"User"

},geometry:{
  type:{type:String,
    enum:['Point'],
    required:true
  },
  coordinates:{
    type:[Number],
    required:true
  }
},
category:{
  type:String,
  enum:["mountain","beach","hotel","snow","swimming","camping","industrial area","restroom"],
  required:true
}
});

listingSchema.post("findOneAndDelete",async(listing)=>{
  if(listing){
    await Review.deleteMany({_id:{$in:listing.review}});
  }
})
const listing=mongoose.model("listing",listingSchema);
module.exports=listing;