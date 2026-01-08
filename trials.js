const jwt = require("jsonwebtoken");
const mongoose  = require("mongoose");

/* let variable = 'ralph';

console.log(variable.split('l').join(' ')); */

const userSchema = new mongoose.Schema({
    name: String,
    password: String
})

userSchema.methods.create_JWT = function(next){
    next()
}


