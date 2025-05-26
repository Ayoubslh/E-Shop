const mongoose = require("mongoose");
const validator = require("validator");
const crypto= require('crypto')
const bcrypt=require("bcryptjs")

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: { validator: validator.isEmail, message: "Enter a valid email" },
  },

  password: { type: String, required: true, minlength: 8, select: false },
  passwordConfirm: {
    type: String,
    required: true,
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: "Passwords do not match",
    },
    select: false,
  },
  phonenum: {
    type: String,
    required: true,
    minlength:10,
    maxlength:10
  },
  address: {
    street: String,
    city: String,
    zip: String,
    country: String,
  },

  role: {
    type: String,
    default: "user",
    enum: ["user", "admin"],
  },

  createdAt: {
    type: Date,
    default: Date.now(),
  },

  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
});

UserSchema.pre('save',async function(next){
    if(!this.isModified('password')) return next();
    this.password= await bcrypt.hashSync(this.password,12);
    this.passwordConfirm=undefined;
    next();

})
UserSchema.pre('save',function(next){
  if(!this.isModified('password') || this.isNew) return next();
  this.passwordChangedAt = Date.now()-1000;
  next(); 

})
UserSchema.pre(/^find/,function(next){
  this.find({active:{$ne:false}})
  next();
})
UserSchema.methods.correctPassword= async function(candidatePassword,userPassword){
  return await bcrypt.compare(candidatePassword,userPassword);
}
UserSchema.methods.changePasswordAfter=function(JWTTimestamp){
  if(this.passwordChangedAt){

    const passwordChangedTimestamp=parseInt(this.passwordChangedAt.getTime()/1000,10);
    return JWTTimestamp<passwordChangedTimestamp 

  }
  
  return false;
}


UserSchema.methods.creatPasswordResetToken= function(){
  const resetToken= crypto.randomBytes(32).toString('hex');
 this.passwordResetToken= crypto.createHash('sha256').update(resetToken).digest('hex');
 this.passwordResetExpires=Date.now()+10*60*1000;
 return resetToken;

}









const user = mongoose.model("User", UserSchema);
module.exports = user;
