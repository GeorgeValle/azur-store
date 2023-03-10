import {Schema,model} from 'mongoose';

const productSchema = new Schema({
    name:String,
    price:{
        type: Number,
        default: 0
    },
    stock:{
        type:Number,
        default:0
    },
    description:String,
    code:Number,
    thumbnail:String,
    inside:{
        type:Boolean,
        default: false
    }

})

export default  model('product', productSchema);