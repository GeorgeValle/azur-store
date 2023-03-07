import {Schema,model} from 'mongoose';

const cartSchema = new Schema({
    timestamp:{
        type: Date,
        default: Date.now(),
    },
    products:{ 
        type: Array,
        default: []
    },
})

export default model('cart', cartSchema);