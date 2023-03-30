const express=require("express");
const bodyParser=require("body-parser");
const mongoose=require("mongoose");
const plm= require("passport-local-mongoose");
const passport=require('passport');
const localStrategy=require("passport-local")
const app=express();
app.set('view engine', 'ejs');
app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));

app.use(require('express-session')({
resave: false,
saveUninitialized: false,
secret: "my first Authentication"
}));
app.use(passport.initialize());
app.use(passport.session());
const userModel = require("./users");

const data = new userModel()

passport.use(new localStrategy(userModel.authenticate()));

passport.serializeUser(userModel.serializeUser());
passport.deserializeUser(userModel.deserializeUser());

app.get("/",function(req,res){
res.render("index");

});
app.post("/reg",function(req,res){
    const dets = new userModel({
        name: req.body.name,
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
        });
        
        userModel.register(dets, req.body.password).then(function (registeredUser) {
        passport.authenticate("local")(req, res, function () {
        res.redirect("/profile");
        });
        });
});
app.get("/login",function(req,res){
    res.render("login");
});
app.get("/profile",isLoggedIn ,function (req, res) {
    userModel.findOne({username:req.session.passport.user})
    .then(function(user){
    res.render('profile',{user});
    })
    });

app.post(
    "/login",
    passport.authenticate("local", {
    successRedirect: "/profile",
    failureRedirect: "/login",
    }),
    function (req, res) {}
    );
    
    app.get("/logout", function (req, res) {
    req.logOut();
    res.redirect("/");
    });
    
    
    
    function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
    return next();
    } else {
    res.redirect("/login");
    }
    }


    

app.listen(8000,function(){
    console.log("sever starter on server port 8000")
});

module.exports=app;