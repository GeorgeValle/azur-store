import '../loaders/connection.js';
import CartModel from '../models/CartModel.js';
import book from './ManagerBook.js';

class Cart{

    //receive a id of product
    saveData= async (req, res) => {
        //validations
        try{
            
            const createdCart = await CartModel.create({});
            if(!createdCart)return res.status(404).json({ message: 'Cart does not created'})
        
            return res.status(200).json({message: "Cart created", data: createdCart})
        }catch(err){
            console.log(err)
            return{status:400, message: "error cart not created"}
        }
    }
    

    //obtain a product from cart by id_prod
    getById = async (req,res) => {
        //Validations
        try {
            const { id } = req.params
            //Validations
            if (!id) return res.status(400).json( {message: "Id required"});

            const cart = await CartModel.findById(id)
            if(!cart) return res.status(404).json({ message: 'Cart does not exits'})
            return res.status(200).json(cart)
        } catch(err) {
            console.log(err);
            return res.status(404).json({ message: 'Product does not exits'});
        }
    }

    //add a product in a cart 
    updateById= async (req, res) => {

        try {
            const { id } = req.params
            if (!id) return res.status(400).json( {message: "Id required"});
            const { id_prod } = req.params;
            if (!id_prod) return res.status(400).json( {message: " Product ID required"});

            let newProduct= await book.getBook(id_prod);
            const updated = await CartModel.findByIdAndUpdate(id,
                {$push: {
                        'products':newProduct,
                        },
                })

            return res.status(200).json({ message: 'Cart updated!', data:{updated}})
        } catch(err) {
            return res.status(404).json({ message: 'Failed to update Cart'})
        }
    }

    //delete a product from a cart

    deleteById =async (req,res)=> {
        try{
            const { id } = req.params;
            if (!id) return res.status(400).json( {message: "Id required"});
            const { id_prod } = req.params;
            if (!id_prod) return res.status(400).json( {message: "Product Id required"});
            const deleted = await CartModel.updateOne({_id: id}, {$pull: {products: id_prod }})
            await CartModel.save;
            return res.status(200).json({ message: 'Product deleted!', data: deleted})
            }catch(err) {
                    console.log(err);
                    return res.status(404).json({ message: 'Failed to delete product'})
            }
    }
    // deleteById = async (req,res) => {
    //     try {
    //         const { id } = req.params;
    //         if (!id) return res.status(400).json( {message: "Id required"});
    //         const { id_prod } = req.params;
    //         if (!id_prod) return res.status(400).json( {message: "Product Id required"});

    //         const deleted = await CartModel.findByIdAndUpdate(id,
    //             {$pull: {
    //                     products:{_id:id_prod}
    //                     }
    //             },
    //             { safe: true }
    //         );

    //         return res.status(200).json({ message: 'Product deleted!', data: deleted})
    //     } catch(err) {
    //         console.log(err);
    //         return res.status(404).json({ message: 'Failed to delete product'})
    //     }
    // }

    //delete a cart
    deleteCart = async (req,res) => {
        try {
            const { id } = req.params
            if (!id) return res.status(400).json( {message: "Cart Id required"});
            const cartDeleted = await CartModel.findByIdAndDelete(id)
            if (!cartDeleted) return res.status(404).json({ message: 'Cart does not exists'})
            return res.status(200).json({ message: 'Cart deleted!', data: cartDeleted})
        }catch(err){return res.status(404).json({ message: 'Failed to delete cart'})}
    }

    async getAll(req , res) {

        const products = await CartModel.find()
        return res.status(200).json({data:products})
    }
}

export default new Cart();