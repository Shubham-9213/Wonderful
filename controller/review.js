const listing=require("../Models/listing.js");
const Review=require("../Models/review.js");

module.exports.showlisting=async (req,resp)=>{
    let {id}=req.params;
    const IDlisting=await listing.findById(id).populate({path:"review",populate:{path:"author"}}).populate("owner");
    
    if(!IDlisting){
        req.flash("error","Sorry!!! listing not exist");
        resp.redirect("/listing")
    }
    else{
    resp.render("listings/show.ejs",{IDlisting});
    }
}

//review post route
module.exports.createReview=async(req,resp)=>
{
  
    let list=await listing.findById(req.params.id)
    let newreview=new Review(req.body.review);
    newreview.author=req.user._id;
    list.review.push(newreview);
    await newreview.save();
    await list.save();
     req.flash("success","congratulation new review is created");
    resp.redirect(`/listing/${list._id}`)

}

//delete route
module.exports.destroyReview=async(req,resp)=>{
    let {id,reviewid}=req.params;
    await listing.findByIdAndUpdate(id,{$pull:{review:reviewid}});
    await Review.findByIdAndDelete(reviewid);
     req.flash("success","review is deleted");
    resp.redirect(`/listing/${id}`);
}