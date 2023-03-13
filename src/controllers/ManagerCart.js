import '../loaders/connection.js';
import CartModel from '../models/CartModel.js';
import book from './ManagerBook.js';
import {logInfo,errorLogger} from '../utils/Logger.js';
import {userModel} from '../models/Users.js';
import ProductModel from '../models/ProductModel.js';
class Cart{

    //receive a id of product
    saveData= async (req, res) => {
        //validations
        try{
            let carts = await CartModel.find()
            if(!carts){
            const createdCart = await CartModel.create({});
            if(!createdCart)return res.status(404).json({ message: 'Cart does not created'})
        
            return res.status(200).json({message: "Cart created", data: createdCart})
            }
        }catch(err){
            console.log(err)
            return{status:400, message: "error cart not created"}
        }
    }
    
    createOneCart= async (req, res)=>{
        try{
            const { id_user } = req.params
            const user = await userModel.findById(id_user)
            if(!user){
                errorLogger.error("NO found user for function createOneCart")
                return res.status(404)
            }
            const cart = await CartModel.find({user:user}).populate("products")
            if(!cart){
                const newCart = await CartModel.create({user:user})
                await newCart.save()
                return newCart
            }
        }catch(err){
            errorLogger.error("error to create Cart, function createOneCart")
            res.render('errors',{message:err,route: "session/purchase",zone:"/compras"})
        }
    }

    #createCart= async (id_user)=>{
        // const { id_user } = req.params
        try{
            const user = await userModel.findById(id_user)
            if(!user){errorLogger.error("NO found user for function createCart")}

            const cart = await CartModel.find({user:user}).populate("products")
            if(!cart[0]){
                
                await CartModel.create({user:user})
                
                logInfo.info("Cart created")
                
            }
        }catch(err){
            errorLogger.error(`cart not created ${err}`)
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

    getItemById = async (req,res) => {

        try {
            
            const { id } = req.params
            //Validations
            if (!id) return res.status(400).json( {message: "Id required"});
            const { id_prod } = req.params;
            if (!id_prod) return res.status(400).json( {message: "Product ID required"});
            let seeProduct = await CartModel.findOne({ id: id})
            let item = seeProduct.products.find(id_prod)
            if(!item){return res.status(200).json({message:"ok",data:item})}
        }catch(err){
            errorLogger.error(`no se encontró item ${err}`)

        }

    }

    //add a product in a cart 
    updateById= async (req, res) => {

        try {
            
            const { id_user } = req.params
            if (!id_user) return res.status(400).json( {message: "Id required"});
            await this.#createCart(id_user)
            
            const { id_prod } = req.params;
            if (!id_prod) return res.status(400).json( {message: " Product ID required"});

            //let newProduct= await book.getBook(id_prod);
            let newProduct= await ProductModel.findById(id_prod);
            if(!newProduct) return res.status(400).json( {message:"product not fund"})

            const thisUser = await userModel.findById(id_user);
            //const updated = await CartModel.find({ user: thisUser }).populate("products",{_id:1});

            

            const productList = await CartModel.find({user:thisUser});
            
            let list =productList.filter(product=>product.id==id_user)
            // let flag = false
            // for (let i = 0; i < productList.products.length; i++) {
            //     if(products[i]._id = id_prod ){flag=true}
            // }
            console.log(list)

            if(list){

                //toDO : cart.products.totalItems y cart.products.totalPrice
                logInfo.info(`added in cart again: ${newProduct.name}  ruta /carts/id_user/products/id_prod`)
                return res.status(200).json({ data: list})
            }else{

            await CartModel.findOneAndUpdate( thisUser,
                {$push: {
                        'products':newProduct,
                        },
                })
            logInfo.info(`added to cart: ${newProduct.name}  ruta /carts/id_user/products/id_prod`)
            }
            return res.status(200).json({ message: 'Cart updated!'})
        } catch(err) {
            return res.status(404).json({ message: `Failed to update Cart ${err}`})
        }
    }

    //delete a product from a cart

    deleteById =async (req,res)=> {
        try{
            const { id } = req.params;
            if (!id) return res.status(400).json( {message: "Id required"});
            const { id_prod } = req.params;
            if (!id_prod) return res.status(400).json( {message: "Product Id required"});
            // const deleted = await CartModel.updateOne({_id: id}, {$pull: {products: id_prod }})
            // await CartModel.save;
            let products = await CartModel.find({id:id}).populate('products')
            let update= products.filter(product =>product.id === id_prod)
            let cart = await CartModel.findOneAndUpdate({user:id}, { $set:{product: update}}, {new: true}, {

            });



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

        const carts = await CartModel.find()
        return res.status(200).json({data:carts})
    }
}

export default new Cart();