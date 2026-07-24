const mongoose = require('mongoose');
const { mongodbUri } = require('./index');

async function connectDB() {
    if (!mongodbUri) {
        console.warn('No MongoDB URI found in config/index.js');
        return;
    }
    try {

        await mongoose.connect(mongodbUri)
        console.log('MongoDB connected');
    }
    catch (err) {
        console.error('MongoDB connection error', err);
    }
}

module.exports = { connectDB }