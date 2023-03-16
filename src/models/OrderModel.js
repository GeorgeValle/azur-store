import {Schema,model} from 'mongoose';

const orderSchema = new Schema({
    numOrder:{
        type:Number,
        required:true,
        unique: true,
    },
    products:{
        type:Array,
        default:[]
    },
    timestamp:{
        type:String,
        default: new Date().toLocaleString("es-AR")
    },
    email:{
        type:String
    },
    address:{
        type:String
    },
    state:{
        type:String,
        default:"generated"
    },
    totalItems:{
        type:Number,
        default:0
    },
    totalPrice:{
        type:Number,
        default:0
    },
    userId:{
        type:String,
        default:""
    },
    phone:{
        type:Number
    }



})

export default  model('order', orderSchema);