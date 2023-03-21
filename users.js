var mongoose = require("mongoose")
var passportLocalMongoose = require("passport-local-mongoose")
mongoose.connect("mongodb://127.0.0.1:27017/pw")

var userSchema = new mongoose.Schema({
  username:{
    type:String,
    require:true,
    unique: true
  },
  firstname:{
    type:String,
    require:true,
    // unique: true
  },
  lastname:{
    type:String,
    require:true,
    // unique: true
  },
  password:{
    type:String
  },
  address:String,
  subject:String,

  student:{
    type:Array,
    default:[]
  },
},{
 timestamps: true 
})


userSchema.plugin(passportLocalMongoose)
module.exports = mongoose.model("user", userSchema);
