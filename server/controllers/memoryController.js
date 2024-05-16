// memoryController.js

const Memory = require('../models/Memory');


const getMemories = async (req, res) => {
    //const userId = req.user._id; // Assuming userId is obtained from authentication

    try {
        // Fetch memories for the authenticated user from the database
        const memories = await Memory.find({ userId: req.user._id });
    
        res.status(200).json(memories);
      } catch (error) {
        console.error('Error fetching memories:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    };

// Controller function to add a new memory
const addMemory = async (req, res) => {
    try {
        // Set userId based on the logged-in user
        req.body.userId = req.user._id;

        // Get imageUrl from the request body
        const { imageUrl, ...memoryData } = req.body;
        
        // Add imageUrl to memory data
        const memoryWithImageUrl = { ...memoryData, image: imageUrl };

        // Create a new memory instance using the data from the request body
        const newMemory = await Memory.create(memoryWithImageUrl);
        
        // Send the newly created memory object as a response
        res.status(201).json(newMemory);
    } catch (err) {
        // If an error occurs, send an error response
        res.status(400).json({ message: err.message });
    }
};

// Controller function to fetch memories for a specific date
const getMemoriesByDate = async (req, res) => {
    try {
        const { year, month, day } = req.params;
        console.log('Year:', year);
        console.log('Month:', month);
        console.log('Day:', day);
        console.log('User ID:', req.user._id);

        const date = new Date(Date.UTC(year, month - 1, day)); // Construct date with UTC values
        
        // Find memories for the specified date
        const memories = await Memory.find({ date: { $eq: date }, userId: req.user._id });
        console.log('Memories:', memories);
        res.status(200).json(memories);
    } catch (error) {
        console.error('Error fetching memories:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const editMemory = async (req, res) => {
  try {
    const { id } = req.params;
    let updatedMemoryData = { ...req.body };

    // Check if a new image file is provided
    if (req.file) {
      // Upload image to Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path);
      // Log the image URL
      console.log('Image URL from Cloudinary:', result.secure_url);
      // Update the memory data with the new image URL
      updatedMemoryData.image = result.secure_url;
    }

    // Find the memory by ID and update it with the new data
    const updatedMemory = await Memory.findByIdAndUpdate(
      { _id: id, userId: req.user._id },
      updatedMemoryData,
      { new: true }
    );

    if (!updatedMemory) {
      return res.status(404).json({ message: 'Memory not found' });
    }

    // Send the updated memory as the response
    res.json(updatedMemory);
  } catch (error) {
    console.error('Error editing memory:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};



  
  
// Controller function to delete a memory
const deleteMemory = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedMemory = await Memory.findByIdAndDelete({ _id: id, userId: req.user._id });
        if (!deletedMemory) {
            return res.status(404).json({ message: 'Memory not found' });
        }
        res.json({ message: 'Memory deleted successfully' });
    } catch (error) {
        console.error('Error deleting memory:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Controller function to fetch dates with memories
const getDatesWithMemories = async (req, res) => {
    try {
        // Find distinct dates with memories for the user
        const datesWithMemories = await Memory.distinct('date', { userId: req.user._id });

        // Extract year, month, and day from each date
        const formattedDates = datesWithMemories.map(date => {
            const formattedDate = new Date(date);
            return {
                year: formattedDate.getFullYear(),
                month: formattedDate.getMonth() + 1, // Month starts from 0, so add 1 
                day: formattedDate.getDate()
            };
        });

        res.status(200).json(formattedDates);
    } catch (error) {
        console.error('Error fetching dates with memories:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Controller function to fetch a single memory by its ID

const getMemoryById = async (req, res) => {
    try {
        const { id } = req.params;

        // Fetch the memory by its ID
        const memory = await Memory.findOne({ _id: id, userId: req.user._id });

        // If the memory is not found, return a 404 status
        if (!memory) {
            return res.status(404).json({ message: 'Memory not found' });
        }

        // If the memory is found, return it as a response
        res.status(200).json(memory);
    } catch (error) {
        console.error('Error fetching memory by ID:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
 

const searchMemoriesByTitle = async (req, res) => {
    try {
      const { title } = req.query;
      const userId = req.user._id; // Get the current user's ID
      console.log("Searching memories by title:", title); // Log the title being searched
      const memories = await Memory.find({ title: { $regex: title, $options: "i" }, userId: userId });
      console.log("Found memories:", memories); // Log the memories found
      res.json(memories);
    } catch (error) {
      console.error("Error searching memories by title:", error); // Log any errors that occur
      res.status(500).json({ message: "Internal server error" });
    }
  };

  
  
  
 const searchMemoriesByTags = async (req, res) => {
    try {
      const { tags } = req.query;
      const userId = req.user._id; // Get the current user's ID
      console.log("Searching memories by tags:", tags); // Log the tag being searched
      const memories = await Memory.find({ tags: { $in: tags.split(",") }, userId: userId });
      console.log("Found memories:", memories); // Log the memories found
      res.json(memories);
    } catch (error) {
      console.error("Error searching memories by title:", error); // Log any errors that occur
      res.status(500).json({ message: "Internal server error" });
    }
  };


// Export the controller function
module.exports = { 
    getMemories, 
    addMemory, 
    getMemoriesByDate,
    getMemoryById, 
    deleteMemory, 
    editMemory, 
    getDatesWithMemories, 
    searchMemoriesByTitle,
    searchMemoriesByTags
};
