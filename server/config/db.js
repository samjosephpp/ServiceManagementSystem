const {default : mongoose} = require('mongoose');


const connectDB = async () =>{
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("DB Connected Successfully");
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

module.exports = { connectDB }