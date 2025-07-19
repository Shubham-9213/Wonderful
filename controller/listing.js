const listing=require("../Models/listing.js");
const mbxGeocoding=require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken=process.env.MAP_TOKEN;
const geocodingClient=mbxGeocoding({accessToken:mapToken});


//index route
module.exports.index=async(req,resp)=>{
   const Alllisting=await listing.find({});
   req.flash("success","Welcome to our website");
   resp.render("listings/index.ejs",{Alllisting});
   
}
//create new listroute
module.exports.renderform=(req,resp)=>{
    
    
     resp.render("listings/new.ejs")
}

//show route
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

//create route
module.exports.createlisting=async (req,resp,next)=>{
    
   let response=await geocodingClient.forwardGeocode({
  query: req.body.listing.location,
  limit: 1
})
  .send();
  
        const list= req.body.listing;
       const newlisting=new listing(list);
        // let url=req.file.path;
        // let filename=req.file.filename;
    if (req.file) {
        newlisting.image = {
            url: req.file.path,
            filename: req.file.filename
        };
    }
    else {
        newlisting.image = {
            url:"https://images.unsplash.com/photo-1625505826533-5c80aca7d157?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGdvYXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60", // Your default image path
            filename: "listingimage"
        };
    }
         newlisting.owner=req.user._id;
         
         newlisting.geometry=response.body.features[0].geometry;
        let saved=await newlisting.save();
        console.log(response.body.features[0].geometry)
        req.flash("success","congratulation new listing is created");
        resp.redirect("/listing");
}

//edit route
module.exports.renderEditForm=async (req,resp)=>{
    let {id}=req.params;
    const List=await listing.findById(id);
    if(!List){
        req.flash("error","Sorry!!! listing not exist for edit");
        resp.redirect("/listing")
    }else{
        let OriginalImageUrl=List.image.url;
        OriginalImageUrl=OriginalImageUrl.replace("/upload","/upload/,w_250")
    resp.render("listings/edit.ejs",{List,OriginalImageUrl});
    console.log(List);}
}

//update route
module.exports.updateListing=async (req,resp)=>{
    
    let {id}=req.params;

    let list=await listing.findById(id);
    
    let Listing=await listing.findByIdAndUpdate(id,{...req.body.listing});
    if (typeof req.file !="undefined")
    {
        let url=req.file.path;
        let filename=req.file.filename;
        Listing.image={url,filename};
        await Listing.save();


    }
     req.flash("success","congratulation successfuly listing is updated");
    
    resp.redirect("/listing");
}

//destroy route
module.exports.destroyListing=async (req,resp)=>{
    let {id}=req.params;
    let deletedlist=await listing.findByIdAndDelete(id);
     req.flash("success","listing is deleted");
    resp.redirect("/listing");
}