import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const cartProductSchema = new Schema(
  {
    _id: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      default: 0,
    },
    stock: {
      type: Number,
      default: 0,
    },
    description: {
      type: String,
      default: '',
    },
    code: {
      type: Number,
    },
    thumbnail: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      default: '',
    },
    quantity: {
      type: Number,
      default: 1,
    },
    userId: {
      type: String,
      default: '',
    },
  },
  { _id: false }
);

const cartSchema = new Schema({
  idUser: {
    type: String,
    default: '',
  },
  timestamp: {
    type: String,
    default: new Date().toLocaleString('es-AR'),
  },
  products: {
    type: [cartProductSchema],
    default: [],
  },
  totalItems: {
    type: Number,
    default: 0,
  },
  totalPrice: {
    type: Number,
    default: 0,
  },
  address: {
    type: String,
  },
  email: {
    type: String,
  },
  phone: {
    type: Number,
  },
});

export default model('cart', cartSchema);