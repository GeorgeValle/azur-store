//import {Schema,model} from 'mongoose';
import mongoose from 'mongoose';
const {Schema, model} = mongoose;

const cartSchema = new Schema({
    idUser:{
        type:String,
        default:""
    },
    timestamp:{
        type: String,
        default: new Date().toLocaleString("es-AR")
    },
    products:[{ 
        type: Array,
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
    },
    address:{
        type:String
    },
    email:{
        type:String
    },
    phone:{
        type:Number
    }

    
})

export default model('cart', cartSchema);