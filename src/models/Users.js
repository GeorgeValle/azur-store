//schema for mongoose
import mongoose from 'mongoose';
const {Schema} = mongoose;

//connection
import '../loaders/connection.js';

const userSchema = new Schema({
    // username: { 
    //     type: String,
    //     required: true },
    username: { 
        type: String,
        unique: true,
        lowercase: true,
        required: [true, "can't be blank"],
        match: [/\S+@\S+\.\S+/, 'is invalid'],
        index:true,
        required: true},

    password: { 
        type: String,
        // match: [/^[a-zA-Z0-9]+$/, 'is invalid'],
        required: [true, "can't be blank"],},
    // date: {}
    name:{
        type: String,
        required: true
    },

    address:{
        type: String,
    },

    age:{
        type:Number,
        required:true
    },
    
    phone:{
        type:Number
    },

    avatar:{
        type: String
    }

})

const userModel = mongoose.model('user', userSchema)
//see si no genera error
export {userModel}
