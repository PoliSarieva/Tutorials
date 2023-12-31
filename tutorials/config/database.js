const mongoose = require('mongoose');

const CONNECTION_STRING = 'mongodb://127.0.0.1:27017/tutorials';
module.exports = async (app) => {
    try {
        mongoose.connect(CONNECTION_STRING);
        console.log('Database connected');
    } catch(err) {
        console.error(err.message);
        process.exit(1);
    }
};