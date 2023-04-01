const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    login:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
});

module.exports = new mongoose.model("users", postSchema);