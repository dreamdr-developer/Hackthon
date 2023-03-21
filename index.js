var express = require('express');
var router = express.Router();
var userModel = require("./users")
var studentModel = require("./student")
var passport = require("passport")
var multer = require("multer")

var LocalStrategy = require('passport-local');
passport.use(new LocalStrategy(userModel.authenticate()));
// passport.use(new LocalStrategy(studentModel.authenticate()));

// -----------------------------------------------------------

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images/uploads')
  },
  filename: function (req, file, cb) {
   crypto.randomBytes(13, function(err,buffer){
  var fn =  buffer.toString("hex") + path.extname(file.originalname);
  cb(null, fn)
   })
  }
})

const upload = multer({ storage :storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
    }
  }
 });
 
/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', {user: req.user,title:"home"});
});
router.get('/live', function(req, res) {
  res.render('live', {user: req.user,title:"live"});
});

router.get('/askdoute', function(req, res) {
  res.render('dout', {user: req.user,title:"ask doute"});
});
router.get('/teacherprofile',isLoggedin, function(req, res) {
  userModel.findOne({username:req.session.passport.user}).then(function(loginuser){
    res.render('teacherprofile', {user: req.user,title:"teacher",loginuser});
  })
});
router.get('/readt', function(req, res, next) {
  userModel.find().then(function(user){
    res.send(user)
  })
});
router.get('/reads', function(req, res, next) {
  studentModel.find().then(function(user){
    res.send(user)
  })
});
router.get('/teacherlogin', isLoggedout,function(req, res, next) {
  res.render('login', {user: req.user, isLoggedIn: req.isLogged,title:"teacher login"});
});
router.get('/studentlogin', isLoggedout,function(req, res, next) {
  res.render('stlogin', {user: req.user, isLoggedIn: req.isLogged,title:"student login"});
});
// ------------------------------------------------------------

 
// --------------------------------------------------------
router.post("/teacherregister", function(req,res){
  var data = new userModel({
    // profile:req.file.filename,
    username:req.body.username,
    firstname:req.body.firstname,
    lastname:req.body.lastname,

  })
  if (!req.body.password) {
    res.send("enter a password")
  }else if (req.body.password !== req.body.confirmpassword) {
    res.send("password not matched")
  }else{
    userModel.register(data,req.body.password).then(function(u){
      passport.authenticate('local')(req,res,function(){
        res.redirect("/teacherprofile")
      })
    })
  }
})
// router.post("/studentregister", function(req,res){
//   var data = new studentModel({
//     // profile:req.file.filename,
//     username:req.body.username,
//     firstname:req.body.firstname,
//     lastname:req.body.lastname,

//   })
//   if (!req.body.password) {
//     res.send("enter a password")
//   }else if (req.body.password !== req.body.confirmpassword) {
//     res.send("password not matched")
//   }else{
//     studentModel.register(data,req.body.password).then(function(u){
//       passport.authenticate('local')(req,res,function(){
//         res.redirect("/")
//       })
//     })
//   }
// })
router.post("/addstudent",async function(req,res){
var user =await userModel.findOne({username:req.session.passport.user})
var data={
  name:req.body.name,
  email:req.body.email,
  class:req.body.class,
  dob:req.body.dob
}
user.student.push(data)
user.save()
res.redirect('back')
})

// ---------------------login / logout--------------------

router.post("/teacherlogin",function(req,res){
  if (!req.body.username) {
    res.redirect("back")
}
else if (!req.body.password) {
    res.redirect("back")}
else {
    passport.authenticate("local", {
      successRedirect:'/teacherprofile',
      failureRedirect:'/teacherlogin',
    })(req, res);
}
})

// router.post("/studentlogin",function(req,res){
//   if (!req.body.username) {
//     res.redirect("back")
// }
// else if (!req.body.password) {
//     res.redirect("back")}
// else {
//     passport.authenticate("local", {
//       successRedirect:'/',
//       failureRedirect:'/studentlogin',
//     })(req, res);
// }
// })


router.get('/logout', function(req, res, next){
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

// ---------------------------------------
function isLoggedin(req,res,next){
  if(req.isAuthenticated()){
    req.isLogged = true
    return next();
  }else{
    res.redirect("/teacherlogin")
  }
}

function isLoggedout(req,res,next){
  if(req.isAuthenticated() == false){
    return next();
  }else{
    res.redirect("/")
  }
}


module.exports = router;
