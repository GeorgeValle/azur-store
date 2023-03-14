import {Schema,model} from 'mongoose';


const chatSchema = new Schema({
    idDB:{
        type: Number 
    },
    email:{
        type: String
    },
    type:{
        type: String
    },
    timestamp:{
        type: String
    },
    message:{
        type: String
    }
})

export default  model('chat', chatSchema);