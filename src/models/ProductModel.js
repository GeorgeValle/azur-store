import {Schema,model} from 'mongoose';

const productSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        default:0
    },
    stock:{
        type:Number,
        default:0
    },
    description:String,
    code:{
        type:Number,
        required:true
    },
    thumbnail:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    quantity:{
        type:Number,
        default:0
    },
    userId:{
        type:String,
        default:""
    }
    

})

export default  model('product', productSchema);