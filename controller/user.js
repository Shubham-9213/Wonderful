const User=require("../Models/user.js");

module.exports.renderSignupForm=(req,resp)=>{
    resp.render("users/signup.ejs");
}
module.exports.signup=async (req,resp)=>{
    try{
    let {username,email,password}=req.body;
    const newUser=new User({username,email});
    const res=await User.register(newUser,password);
    req.login(res,(err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","you succesfully login");
    resp.redirect("/listing")

    });
   
    }
    catch(err){
        req.flash("error",err.message);
        resp.redirect("/signup")
    }
}
module.exports.renderLoginForm=(req,resp)=>{
    resp.render("users/login.ejs");
}
module.exports.login=async (req, resp) => {
    req.flash("success", "welcome to wonderlust login sucessfully");
    let redirectUrl=resp.locals.redirectUrl || "/listing";
    

    resp.redirect(redirectUrl)
}
module.exports.logout=(req,resp,next)=>{
req.logOut((err)=>{
    if(err){
        return next(err);
    }
    req.flash("success","you succesfully logout");
    resp.redirect("/listing")
})

}