const mongoose = require("mongoose");


exports.connectedDatabase = async()=>{
    try {
        await mongoose.connect("mongodb+srv://garvitjainraju:QHmB92NOAp4Ztl4Z@smartsolution.m7c3vvn.mongodb.net/?retryWrites=true&w=majority");
        console.log("Database connected");
    } catch (error) {
        console.log(error);
    }
}