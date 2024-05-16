// memoryRoutes.js

const express = require('express');
const router = express.Router();
const memoryController = require('../controllers/memoryController');
const requireAuth = require('../middleware/requireAuth');
const multer = require('multer');
// Import cloudinary
const cloudinary = require('cloudinary').v2;

// Set up Multer storage
const storage = multer.diskStorage({});

// Initialize Multer upload
const upload = multer({ storage });

// Route to search memories by title
router.get("/search", requireAuth, memoryController.searchMemoriesByTitle);

// Route to search memories by tags
router.get("/searchtags", requireAuth, memoryController.searchMemoriesByTags);

// route to get all memories
router.get('/', requireAuth, memoryController.getMemories);


// Handle image upload route
router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    // Upload image to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path);

    // Store the imageUrl temporarily
    const imageUrl = result.secure_url;

    // Return Cloudinary URL for the uploaded image
    res.json({ imageUrl });
    console.log("image url :", imageUrl);
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
  

// Route to add a memory
router.post('/add', requireAuth, memoryController.addMemory);

// Route to fetch dates with memories
router.get('/dates', requireAuth, memoryController.getDatesWithMemories);

// Route to fetch memories for a specific date
router.get('/:year/:month/:day', requireAuth, memoryController.getMemoriesByDate);

// Route to edit a memory
router.put('/edit/:id', requireAuth, upload.single('image'), memoryController.editMemory);

// Route to delete a memory
router.delete('/delete/:id', requireAuth, memoryController.deleteMemory);

// Route to fetch a single memory by its ID
router.get('/:id', requireAuth, memoryController.getMemoryById);

// Route to search memories by title
router.get("/search", requireAuth, memoryController.searchMemoriesByTitle);

// Route to search memories by tags
router.get("/searchtags", requireAuth, memoryController.searchMemoriesByTags);


module.exports = router;
