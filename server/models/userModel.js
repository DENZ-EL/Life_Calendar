// userModel.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
//const validator = require('validator');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  dateOfBirth: {
    type: Date,
    required: true,
  },
}, { timestamps: true });

// Static method for user signup
userSchema.statics.signup = async function(username, email, password, dateOfBirth) {
    // Validate email uniqueness
    const existingUser = await this.findOne({ email });
    if (existingUser) {
      throw new Error('Email already exists');
    }
  
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
  
    // Create a new user instance
    const user = await this.create({
      username,
      email,
      password: hashedPassword,
      dateOfBirth,
    });
  
    return user;
  };
  
  // Static method for user login
  userSchema.statics.login = async function(email, password) {
    // Find user by email
    const user = await this.findOne({ email });
    if (!user) {
      throw new Error('Invalid credentials');
    }
  
    // Compare passwords
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      throw new Error('Invalid credentials');
    }
  
    return user;

    
  };

  // Define isValidPassword method
userSchema.methods.isValidPassword = async function(password) {
  try {
    // Compare the provided password with the hashed password stored in the database
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    // Handle error, e.g., log it or throw it
    throw new Error(error);
  }
};


const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;
