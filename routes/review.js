const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const {reviewSchema}=require("../schema.js");
const ExpressError=require("../utils/ExpressError.js");
const reviewController=require("../controller/review.js")
const Review=require("../Models/review.js");
const listing=require("../Models/listing.js");


const {validatereview,isLoggedIn,isreviewauthor}=require("../middleware.js")

//it is create so no problem come rektaed to it
router.get("/:reviewid",wrapAsync(reviewController.showlisting));

//review post route
router.post("/",isLoggedIn,validatereview,wrapAsync(reviewController.createReview));
//delete review
router.delete("/:reviewid",isLoggedIn,isreviewauthor,wrapAsync(reviewController.destroyReview))

module.exports=router;