
require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('./config/db');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');

const app = express();

//enable cors for all routes
app.use(cors());

connectDB();

// middleware
app.use(express.json());

// Set up Multer storage
const storage = multer.diskStorage({});

// Initialize Multer upload
//const upload = multer({ storage });

cloudinary.config({ 
  cloud_name:process.env.CLOUDINARY_CLOUD_NAME, 
  api_key:process.env.CLOUDINARY_API_KEY, 
  api_secret:process.env.CLOUDINARY_API_SECRET,  
});

app.use((req, res, next) => {
  req.cloudinary = cloudinary;
  next();
});

// Routes
const memoriesRoutes = require('./routes/memories');
app.use('/api/memories', memoriesRoutes);

const userRoutes = require('./routes/userRoutes');
app.use('/api/user', userRoutes); // Mount user routes

const dashboardRoutes = require('./routes/dashboardRoutes');
app.use('/api/dashboard', dashboardRoutes);

const adminRoutes = require('./routes/admin');
app.use('/api/admin', adminRoutes);

// Start server
app.listen(process.env.PORT, () => {
    console.log('server running on PORT ', process.env.PORT);
  })


/*
const Admin = require('./models/Admin');
const bcrypt = require('bcrypt');

// Function to add admin user
const createAdmin = async () => {
  try {
    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ username: 'admin' });
    if (!existingAdmin) {
      // If admin doesn't exist, create a new admin user
      const passwordHash = await bcrypt.hash('Admin@123#', 10); // Replace 'adminpassword' with the desired password
      const newAdmin = new Admin({
        username: 'admin',
        password: passwordHash
      });
      await newAdmin.save();
      console.log('Admin user created successfully');
    } else {
      console.log('Admin user already exists');
    }
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
};

// Call the createAdmin function
createAdmin();
*/
