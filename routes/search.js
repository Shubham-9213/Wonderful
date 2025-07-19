const express=require("express");
const router=express.Router();
const listing=require("../Models/listing.js");


//**************************************************************************************************************** */
router.get("/:Category", async (req, res) => {
  const category = req.params.Category.toLowerCase(); // Normalize input

  const allowedCategories = [ // Whitelist of valid categories
    "mountain", "beach", "hotel", "snow",
    "swimming", "camping", "industrial area", "restroom"
  ];

  if (!allowedCategories.includes(category)) {
    req.flash("error", "Invalid category selected"); // Feedback to user
    return res.redirect("/listing"); // Go back if invalid
  }

  // Case-insensitive search
  const Alllisting = await listing.find({
    category: { $regex: new RegExp(`^${category}$`, "i") }
  });

  res.render("listings/index.ejs", { Alllisting }); // Render listings
});
//************************************************* */

router.get("/", async (req, res) => {
  try {
    const { location } = req.query;
    console.log("Search location:", location);

    if (!location || location.trim() === "") {
      req.flash("error", "Please enter a location to search.");
      return res.redirect("/listing");
    }

    // Case-insensitive exact match on location
    const listingsFound = await listing.find({
      location: { $regex: new RegExp("^" + location.trim() + "$", "i") }
    });

    console.log("Results count:", listingsFound.length);

    if (listingsFound.length === 0) {
      req.flash("error", `No listings found for location: ${location}`);
      return res.redirect("/listing");
    }

    res.render("listings/index.ejs", { Alllisting: listingsFound });

  } catch (error) {
    console.error("Error during search:", error);
    req.flash("error", "Something went wrong during the search.");
    res.redirect("/listing");
  }
});


module.exports=router;