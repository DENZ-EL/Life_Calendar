const mongoose = require('mongoose');

const memorySchema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    content:{
        type: String,
    },
    date:{
        type: Date,
        required: true
    },

    image: String, // Store content type of the image

    tags:[String],
    
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    }
}, {timestamps: true});

module.exports = mongoose.model('Memory', memorySchema);
