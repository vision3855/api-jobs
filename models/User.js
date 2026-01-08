const mongoose  = require("mongoose")
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')


const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name'],
        minLength: 3,
        maxLength: 50
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email'
      ]
    },

    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password must be at least 6 characters'],
      //select: false // Don't return password by default
    }
})

UserSchema.pre('save', async function(next) {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt); 
                                                                                                                    
});

UserSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

UserSchema.methods.generateAccessToken = function() {
  return jwt.sign(
    { 
      id: this._id,
      name:this.name,
      email: this.email,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_LIFETIME }
  );
};

module.exports = mongoose.model('User', UserSchema)