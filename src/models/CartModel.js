//import {Schema,model} from 'mongoose';
import mongoose from 'mongoose';
const {Schema, model} = mongoose;

const cartSchema = new Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"},
    timestamp:{
        type: Date,
        default: Date.now(),
    },
    products:[{ 
        type: mongoose.Schema.Types.ObjectId,
        ref:"product",
        unique: true,
        default: [],
        
    }],
    totalItems:{
        type: Number, 
        default:0
    },
    totalPrice:{
        type: Number,
        default:0
    }
    
})

export default model('cart', cartSchema);