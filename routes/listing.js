const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");

const listing=require("../Models/listing.js");
const {isLoggedIn,isOwner,validatelisting}=require("../middleware.js");
const ListingController=require("../controller/listing.js")

const multer  = require('multer')
const {storage}=require("../cloudconfig.js")
const upload = multer({ storage })

router.route("/")
.get(wrapAsync(ListingController.index)
)
.post(isLoggedIn,upload.single("listing[image][url]"),validatelisting,
wrapAsync(ListingController.createlisting));


//create new list route
router.get("/new",isLoggedIn,ListingController.renderform)

router.route("/:id")
.get(wrapAsync(ListingController.showlisting))
.put(isLoggedIn,isOwner,upload.single("listing[image][url]"),validatelisting,wrapAsync(ListingController.updateListing))
.delete(isLoggedIn,isOwner,wrapAsync(ListingController.destroyListing));

router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(ListingController.renderEditForm));



module.exports=router;