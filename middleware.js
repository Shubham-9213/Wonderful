const listing=require("./Models/listing.js");
const review=require("./Models/review.js")
const {listingSchema,reviewSchema}=require("./schema.js");
const ExpressError=require("./utils/ExpressError.js");

module.exports.isLoggedIn=(req,resp,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl
        req.flash("error","you not login ");
       return resp.redirect("/login")
    }
    next();
}
module.exports.saveredirectUrl=(req,resp,next)=>{
    if(req.session.redirectUrl){
        
        resp.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}
module.exports.isOwner=async(req,resp,next)=>{
    let {id}=req.params;

    let list=await listing.findById(id);
    if(!(list.owner._id.equals(resp.locals.currUser._id))){
        req.flash("error","you are not owner");
        return resp.redirect(`/listing/${id}`);
    }
    next()
}

module.exports.validatelisting=(req,resp,next)=>{
            
     let {error}=listingSchema.validate(req.body);
     
     if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
                throw new ExpressError(400,errMsg)
     }
     else{
        next();
     }
     
}
module.exports.validatereview=(req,resp,next)=>{
    let {error}=reviewSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
                throw new ExpressError(400,errMsg)
     }
     else{
        next();
     }
}
module.exports.isreviewauthor=async(req,resp,next)=>{
    let {id,reviewid}=req.params;

    let res=await review.findById(reviewid).populate("author");
    if(!(res.author._id.equals(resp.locals.currUser._id))){
        req.flash("error","you are not owner of this review");
        return resp.redirect(`/listing/${id}`);
    }
    next()
}