var mongoose = require("mongoose")
var passportLocalMongoose = require("passport-local-mongoose")
// mongoose.connect("mongodb://127.0.0.1:27017/pw")

var studentSchema =new mongoose.Schema({
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

    // teacherid: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }]
      },{
      timestamps:true
    })
    studentSchema.plugin(passportLocalMongoose)

    module.exports = mongoose.model("student" , studentSchema);
