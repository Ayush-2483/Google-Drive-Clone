const mongoose = require('mongoose')
function connectToDB(){
    return mongoose.connect(process.env.MONGO_URI).then(()=>{
        console.log('Connected to DB');
    }).catch((error) => {
        console.error('Database connection failed:', error.message);
        throw error;
    });
}

module.exports = connectToDB;